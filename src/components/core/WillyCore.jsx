import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import WillyOrb from '../3d/WillyOrb';
import ControlPanel from '../ui/ControlPanel';
import StatusDisplay from '../ui/StatusDisplay';
import { useWilly } from '../../hooks/useWilly';
import { useVoice } from '../../hooks/useVoice';
import toast from 'react-hot-toast';

const WillyCore = () => {
  const [isListening, setIsListening] = useState(false);
  const [currentCommand, setCurrentCommand] = useState('');
  const [processingState, setProcessingState] = useState('idle');
  const containerRef = useRef(null);
  
  const { 
    processCommand, 
    willyState, 
    updateState,
    executeAction 
  } = useWilly();
  
  const { 
    startListening, 
    stopListening, 
    speak, 
    transcript,
    isRecognizing 
  } = useVoice();

  // Handle voice commands
  useEffect(() => {
    if (transcript && transcript.length > 0) {
      setCurrentCommand(transcript);
      handleCommand(transcript);
    }
  }, [transcript]);

  // Initialize greeting
  useEffect(() => {
    const greetUser = async () => {
      await speak("WILLY online. How may I assist you today?");
      updateState({ status: 'ready' });
    };
    
    setTimeout(greetUser, 1500);
  }, []);

  const handleCommand = async (command) => {
    setProcessingState('processing');
    
    try {
      const result = await processCommand(command);
      
      if (result.success) {
        await speak(result.response);
        toast.success('Command executed successfully');
      } else {
        await speak("I encountered an error processing that command");
        toast.error('Command failed');
      }
    } catch (error) {
      console.error('Command processing error:', error);
      toast.error('System error occurred');
    } finally {
      setProcessingState('idle');
      setCurrentCommand('');
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
      setIsListening(false);
      toast('Voice recognition stopped', { icon: '🎤' });
    } else {
      startListening();
      setIsListening(true);
      toast('Listening...', { icon: '👂' });
    }
  };

  const handleTextCommand = (text) => {
    setCurrentCommand(text);
    handleCommand(text);
  };

  const quickActions = [
    { 
      id: 'voice', 
      label: 'Voice Command', 
      icon: '🎤', 
      action: toggleListening,
      active: isListening 
    },
    { 
      id: 'scan', 
      label: 'System Scan', 
      icon: '📡', 
      action: () => executeAction('systemScan') 
    },
    { 
      id: 'report', 
      label: 'Status Report', 
      icon: '📊', 
      action: () => executeAction('statusReport') 
    },
    { 
      id: 'assist', 
      label: 'AI Assist', 
      icon: '🤖', 
      action: () => executeAction('aiAssist') 
    }
  ];

  return (
    <div className="relative w-full h-screen overflow-hidden" ref={containerRef}>
      {/* Background Effects */}
      <div className="absolute inset-0 bg-willy-gradient">
        <div className="absolute inset-0 bg-gradient-radial from-willy-primary/5 via-transparent to-transparent"></div>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-willy-primary to-transparent animate-scan"></div>
      </div>

      {/* 3D Orb Container */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-full h-full max-w-2xl max-h-2xl">
          <WillyOrb 
            isActive={processingState === 'processing'} 
            isListening={isListening}
          />
        </div>
      </div>

      {/* Status Display */}
      <div className="absolute top-8 left-8 z-20">
        <StatusDisplay 
          status={willyState.status}
          isListening={isListening}
          processingState={processingState}
        />
      </div>

      {/* Command Display */}
      <AnimatePresence>
        {currentCommand && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none"
          >
            <div className="bg-black/50 backdrop-blur-md border border-willy-primary/50 rounded-lg px-6 py-3">
              <p className="text-willy-primary font-tech text-lg">{currentCommand}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Control Panel */}
      <div className="absolute bottom-0 left-0 right-0 z-20">
        <ControlPanel 
          onCommand={handleTextCommand}
          quickActions={quickActions}
          isProcessing={processingState === 'processing'}
        />
      </div>

      {/* Quick Stats */}
      <div className="absolute top-8 right-8 z-20">
        <div className="bg-black/30 backdrop-blur-md border border-willy-primary/20 rounded-lg p-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-willy-primary/70 font-tech text-xs">CPU</span>
              <span className="text-willy-primary font-tech text-xs">42%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-willy-primary/70 font-tech text-xs">Memory</span>
              <span className="text-willy-primary font-tech text-xs">2.1GB</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-willy-primary/70 font-tech text-xs">Network</span>
              <span className="text-willy-success font-tech text-xs">Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Version Badge */}
      <div className="absolute bottom-4 right-4 z-10">
        <span className="text-willy-primary/30 font-tech text-xs">
          WILLY v1.0.0
        </span>
      </div>
    </div>
  );
};

export default WillyCore;