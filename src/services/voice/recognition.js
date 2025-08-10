// Voice Recognition Service
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const SpeechGrammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList;

// Configuration
const VOICE_CONFIG = {
  language: import.meta.env.VITE_VOICE_LANGUAGE || 'en-US',
  continuous: import.meta.env.VITE_VOICE_CONTINUOUS === 'true',
  interimResults: true,
  maxAlternatives: 3
};

// Command grammar for better recognition
const COMMAND_KEYWORDS = [
  'willy', 'hey willy', 'ok willy',
  'status', 'report', 'scan', 'check',
  'activate', 'deactivate', 'enable', 'disable',
  'show', 'hide', 'open', 'close',
  'search', 'find', 'locate',
  'help', 'assist', 'support',
  'yes', 'no', 'confirm', 'cancel'
];

// Create recognition instance
let recognition = null;
let isListening = false;

// Initialize speech recognition
export const initializeRecognition = () => {
  if (!SpeechRecognition) {
    console.error('Speech recognition not supported');
    return null;
  }
  
  recognition = new SpeechRecognition();
  
  // Configure recognition
  recognition.continuous = VOICE_CONFIG.continuous;
  recognition.interimResults = VOICE_CONFIG.interimResults;
  recognition.maxAlternatives = VOICE_CONFIG.maxAlternatives;
  recognition.lang = VOICE_CONFIG.language;
  
  // Add grammar if supported
  if (SpeechGrammarList) {
    const grammar = `#JSGF V1.0; grammar commands; public <command> = ${COMMAND_KEYWORDS.join(' | ')};`;
    const speechRecognitionList = new SpeechGrammarList();
    speechRecognitionList.addFromString(grammar, 1);
    recognition.grammars = speechRecognitionList;
  }
  
  return recognition;
};

// Start speech recognition
export const startRecognition = (callbacks = {}) => {
  if (!recognition) {
    recognition = initializeRecognition();
  }
  
  if (!recognition) {
    return { success: false, error: 'Speech recognition not available' };
  }
  
  if (isListening) {
    return { success: false, error: 'Already listening' };
  }
  
  // Set up event handlers
  recognition.onstart = () => {
    isListening = true;
    callbacks.onStart?.();
  };
  
  recognition.onresult = (event) => {
    const results = processResults(event);
    callbacks.onResult?.(results);
  };
  
  recognition.onerror = (event) => {
    console.error('Speech recognition error:', event.error);
    isListening = false;
    callbacks.onError?.(event.error);
  };
  
  recognition.onend = () => {
    isListening = false;
    callbacks.onEnd?.();
    
    // Auto-restart if continuous mode
    if (VOICE_CONFIG.continuous && callbacks.autoRestart) {
      setTimeout(() => {
        if (!isListening) {
          startRecognition(callbacks);
        }
      }, 100);
    }
  };
  
  recognition.onspeechend = () => {
    callbacks.onSpeechEnd?.();
  };
  
  recognition.onnomatch = () => {
    callbacks.onNoMatch?.();
  };
  
  try {
    recognition.start();
    return { success: true };
  } catch (error) {
    console.error('Failed to start recognition:', error);
    isListening = false;
    return { success: false, error: error.message };
  }
};

// Stop speech recognition
export const stopRecognition = () => {
  if (recognition && isListening) {
    recognition.stop();
    isListening = false;
    return { success: true };
  }
  
  return { success: false, error: 'Not currently listening' };
};

// Process recognition results
const processResults = (event) => {
  const results = {
    final: '',
    interim: '',
    alternatives: [],
    confidence: 0
  };
  
  for (let i = event.resultIndex; i < event.results.length; i++) {
    const result = event.results[i];
    const transcript = result[0].transcript;
    
    if (result.isFinal) {
      results.final += transcript + ' ';
      results.confidence = result[0].confidence || 0;
      
      // Collect alternatives
      for (let j = 0; j < Math.min(result.length, 3); j++) {
        results.alternatives.push({
          transcript: result[j].transcript,
          confidence: result[j].confidence || 0
        });
      }
    } else {
      results.interim += transcript;
    }
  }
  
  // Process command if it's a final result
  if (results.final) {
    results.command = extractCommand(results.final);
    results.isWakeWord = checkWakeWord(results.final);
  }
  
  return results;
};

// Extract command from transcript
const extractCommand = (transcript) => {
  const lower = transcript.toLowerCase().trim();
  
  // Remove wake word if present
  const wakeWords = ['hey willy', 'ok willy', 'willy'];
  let command = lower;
  
  for (const wake of wakeWords) {
    if (command.startsWith(wake)) {
      command = command.substring(wake.length).trim();
      break;
    }
  }
  
  // Parse command structure
  const commandParts = command.split(' ');
  const action = commandParts[0];
  const target = commandParts.slice(1).join(' ');
  
  return {
    raw: transcript,
    processed: command,
    action,
    target,
    keywords: commandParts.filter(part => COMMAND_KEYWORDS.includes(part))
  };
};

// Check for wake word
const checkWakeWord = (transcript) => {
  const lower = transcript.toLowerCase();
  return ['hey willy', 'ok willy', 'willy'].some(wake => lower.includes(wake));
};

// Get recognition status
export const getRecognitionStatus = () => {
  return {
    available: !!SpeechRecognition,
    listening: isListening,
    language: VOICE_CONFIG.language,
    continuous: VOICE_CONFIG.continuous
  };
};

// Change language
export const setLanguage = (language) => {
  VOICE_CONFIG.language = language;
  
  if (recognition) {
    recognition.lang = language;
  }
  
  return { success: true, language };
};

// Voice command patterns
export const voicePatterns = {
  system: [
    { pattern: /status|report/, action: 'status' },
    { pattern: /scan|check|diagnostic/, action: 'scan' },
    { pattern: /restart|reboot/, action: 'restart' }
  ],
  control: [
    { pattern: /turn on|activate|enable/, action: 'activate' },
    { pattern: /turn off|deactivate|disable/, action: 'deactivate' },
    { pattern: /open/, action: 'open' },
    { pattern: /close/, action: 'close' }
  ],
  query: [
    { pattern: /what|how|when|where|why|who/, type: 'question' },
    { pattern: /search|find|locate/, type: 'search' },
    { pattern: /show|display/, type: 'display' }
  ]
};

// Match voice command to pattern
export const matchVoicePattern = (transcript) => {
  const lower = transcript.toLowerCase();
  
  for (const [category, patterns] of Object.entries(voicePatterns)) {
    for (const { pattern, ...data } of patterns) {
      if (pattern.test(lower)) {
        return { category, ...data, matched: true };
      }
    }
  }
  
  return { matched: false };
};

export default {
  initializeRecognition,
  startRecognition,
  stopRecognition,
  getRecognitionStatus,
  setLanguage,
  matchVoicePattern
};