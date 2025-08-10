import { useState, useCallback, useEffect, useRef } from 'react';
import { startRecognition, stopRecognition } from '../services/voice/recognition';

export const useVoice = () => {
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const recognitionRef = useRef(null);
  const synthRef = useRef(null);

  // Check for voice support
  useEffect(() => {
    const checkSupport = () => {
      const speechRecognitionSupported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
      const speechSynthesisSupported = 'speechSynthesis' in window;
      
      setVoiceSupported(speechRecognitionSupported && speechSynthesisSupported);
      
      if (speechSynthesisSupported) {
        synthRef.current = window.speechSynthesis;
      }
    };
    
    checkSupport();
  }, []);

  const startListening = useCallback(() => {
    if (!voiceSupported) {
      console.error('Voice recognition not supported');
      return false;
    }

    try {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';
      
      recognitionRef.current.onstart = () => {
        setIsRecognizing(true);
        setTranscript('');
        setInterimTranscript('');
      };
      
      recognitionRef.current.onresult = (event) => {
        let interim = '';
        let final = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            final += transcript + ' ';
          } else {
            interim += transcript;
          }
        }
        
        if (final) {
          setTranscript(prev => prev + final);
        }
        setInterimTranscript(interim);
      };
      
      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsRecognizing(false);
      };
      
      recognitionRef.current.onend = () => {
        setIsRecognizing(false);
      };
      
      recognitionRef.current.start();
      return true;
    } catch (error) {
      console.error('Failed to start speech recognition:', error);
      return false;
    }
  }, [voiceSupported]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isRecognizing) {
      recognitionRef.current.stop();
      setIsRecognizing(false);
      setInterimTranscript('');
    }
  }, [isRecognizing]);

  const speak = useCallback(async (text, options = {}) => {
    if (!synthRef.current) {
      console.error('Speech synthesis not supported');
      return false;
    }

    return new Promise((resolve) => {
      // Cancel any ongoing speech
      synthRef.current.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Configure voice settings
      utterance.rate = options.rate || 1.0;
      utterance.pitch = options.pitch || 1.0;
      utterance.volume = options.volume || 1.0;
      utterance.lang = options.lang || 'en-US';
      
      // Try to use a futuristic-sounding voice
      const voices = synthRef.current.getVoices();
      const preferredVoice = voices.find(voice => 
        voice.name.includes('Google') || 
        voice.name.includes('Microsoft') ||
        voice.name.includes('Premium')
      );
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
      
      utterance.onstart = () => {
        setIsSpeaking(true);
      };
      
      utterance.onend = () => {
        setIsSpeaking(false);
        resolve(true);
      };
      
      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        setIsSpeaking(false);
        resolve(false);
      };
      
      synthRef.current.speak(utterance);
    });
  }, []);

  const stopSpeaking = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  }, []);

  const clearTranscript = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
  }, []);

  return {
    isRecognizing,
    transcript,
    interimTranscript,
    isSpeaking,
    voiceSupported,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
    clearTranscript
  };
};