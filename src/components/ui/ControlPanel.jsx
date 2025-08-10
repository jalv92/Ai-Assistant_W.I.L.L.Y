import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ControlPanel = ({ onCommand, quickActions, isProcessing }) => {
  const [input, setInput] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !isProcessing) {
      onCommand(input.trim());
      setCommandHistory(prev => [...prev, input.trim()]);
      setInput('');
      setHistoryIndex(-1);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowUp' && commandHistory.length > 0) {
      e.preventDefault();
      const newIndex = historyIndex < commandHistory.length - 1 ? historyIndex + 1 : historyIndex;
      setHistoryIndex(newIndex);
      setInput(commandHistory[commandHistory.length - 1 - newIndex]);
    } else if (e.key === 'ArrowDown' && historyIndex > 0) {
      e.preventDefault();
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setInput(commandHistory[commandHistory.length - 1 - newIndex]);
    } else if (e.key === 'Escape') {
      setIsExpanded(false);
      setInput('');
    }
  };

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="relative"
    >
      <div className="bg-black/60 backdrop-blur-xl border-t border-willy-primary/20">
        {/* Quick Actions Bar */}
        <div className="px-4 py-3 border-b border-willy-primary/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {quickActions.map((action) => (
                <button
                  key={action.id}
                  onClick={action.action}
                  disabled={isProcessing}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                    action.active 
                      ? 'bg-willy-primary/20 border border-willy-primary text-willy-primary' 
                      : 'bg-black/30 border border-willy-primary/20 text-willy-primary/60 hover:bg-willy-primary/10 hover:border-willy-primary/40'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{action.icon}</span>
                    <span className="font-tech text-sm hidden sm:inline">{action.label}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Expand/Collapse Button */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 rounded-lg bg-black/30 border border-willy-primary/20 text-willy-primary/60 hover:bg-willy-primary/10 hover:border-willy-primary/40 transition-all duration-300"
            >
              <svg 
                className={`w-5 h-5 transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Command Input Area */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="p-4">
                <form onSubmit={handleSubmit} className="relative">
                  <div className="relative">
                    <input
                      ref={inputRef}
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      disabled={isProcessing}
                      placeholder="Enter command..."
                      className="w-full px-4 py-3 pr-12 bg-black/30 border border-willy-primary/30 rounded-lg text-willy-primary placeholder-willy-primary/30 font-tech focus:outline-none focus:border-willy-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <button
                      type="submit"
                      disabled={isProcessing || !input.trim()}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-willy-primary/60 hover:text-willy-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    </button>
                  </div>
                </form>

                {/* Command Suggestions */}
                <div className="mt-3 flex flex-wrap gap-2">
                  {['System status', 'Run diagnostics', 'Check weather', 'Set reminder'].map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => {
                        setInput(suggestion);
                        inputRef.current?.focus();
                      }}
                      disabled={isProcessing}
                      className="px-3 py-1 text-xs font-tech text-willy-primary/40 border border-willy-primary/20 rounded-full hover:bg-willy-primary/10 hover:text-willy-primary/60 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>

                {/* Processing Indicator */}
                {isProcessing && (
                  <div className="mt-3 flex items-center space-x-2">
                    <div className="w-2 h-2 bg-willy-primary rounded-full animate-pulse"></div>
                    <span className="text-willy-primary/60 font-tech text-xs">Processing command...</span>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default ControlPanel;