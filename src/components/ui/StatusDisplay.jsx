import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const StatusDisplay = ({ status, isListening, processingState }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'online':
      case 'ready':
        return 'text-willy-success';
      case 'processing':
      case 'busy':
        return 'text-willy-secondary';
      case 'error':
      case 'offline':
        return 'text-willy-error';
      default:
        return 'text-willy-primary';
    }
  };

  const getStatusIcon = () => {
    if (isListening) return '👂';
    switch (processingState) {
      case 'processing':
        return '⚡';
      case 'idle':
      default:
        switch (status) {
          case 'online':
          case 'ready':
            return '✓';
          case 'error':
            return '⚠';
          case 'offline':
            return '✗';
          default:
            return '●';
        }
    }
  };

  const getStatusText = () => {
    if (isListening) return 'Listening...';
    if (processingState === 'processing') return 'Processing...';
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-black/30 backdrop-blur-md border border-willy-primary/20 rounded-lg p-4"
    >
      <div className="flex items-center space-x-3">
        {/* Status Indicator */}
        <div className="relative">
          <div className={`w-3 h-3 rounded-full ${getStatusColor()} bg-current animate-pulse`}></div>
          <div className={`absolute inset-0 rounded-full ${getStatusColor()} bg-current animate-ping opacity-20`}></div>
        </div>

        {/* Status Text */}
        <div className="flex flex-col">
          <div className="flex items-center space-x-2">
            <span className="text-lg">{getStatusIcon()}</span>
            <span className={`font-tech text-sm ${getStatusColor()}`}>
              {getStatusText()}
            </span>
          </div>
          
          {/* Sub-status */}
          <AnimatePresence>
            {processingState === 'processing' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-1"
              >
                <div className="flex items-center space-x-1">
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1.5, delay: i * 0.2, repeat: Infinity }}
                      className="w-1 h-1 bg-willy-primary rounded-full"
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Additional Info */}
      <div className="mt-3 pt-3 border-t border-willy-primary/10">
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-willy-primary/50 font-tech text-xs">Mode</span>
            <span className="text-willy-primary/70 font-tech text-xs">
              {isListening ? 'Voice' : 'Standard'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-willy-primary/50 font-tech text-xs">Response</span>
            <span className="text-willy-primary/70 font-tech text-xs">
              {processingState === 'processing' ? 'Pending' : 'Ready'}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default StatusDisplay;