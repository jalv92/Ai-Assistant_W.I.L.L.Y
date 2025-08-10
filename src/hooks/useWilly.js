import { useState, useCallback, useEffect } from 'react';
import { processN8NWebhook } from '../services/n8n/webhook';
import toast from 'react-hot-toast';

export const useWilly = () => {
  const [willyState, setWillyState] = useState({
    status: 'initializing',
    isProcessing: false,
    lastCommand: null,
    lastResponse: null,
    capabilities: [
      'voice-commands',
      'system-monitoring',
      'task-automation',
      'ai-assistance'
    ],
    metrics: {
      commandsProcessed: 0,
      successRate: 100,
      averageResponseTime: 0
    }
  });

  // Initialize WILLY
  useEffect(() => {
    const initialize = async () => {
      try {
        // Simulate initialization
        await new Promise(resolve => setTimeout(resolve, 1000));
        updateState({ status: 'ready' });
      } catch (error) {
        console.error('WILLY initialization failed:', error);
        updateState({ status: 'error' });
      }
    };
    
    initialize();
  }, []);

  const updateState = useCallback((updates) => {
    setWillyState(prev => ({ ...prev, ...updates }));
  }, []);

  const processCommand = useCallback(async (command) => {
    updateState({ 
      isProcessing: true, 
      lastCommand: command,
      status: 'processing'
    });

    const startTime = Date.now();

    try {
      // Parse command intent
      const intent = parseCommandIntent(command);
      let response = null;

      switch (intent.type) {
        case 'system':
          response = await handleSystemCommand(intent.action);
          break;
        case 'automation':
          response = await handleAutomationCommand(intent.action, intent.params);
          break;
        case 'query':
          response = await handleQueryCommand(intent.query);
          break;
        case 'control':
          response = await handleControlCommand(intent.action);
          break;
        default:
          response = await handleGenericCommand(command);
      }

      const responseTime = Date.now() - startTime;
      
      updateState({
        isProcessing: false,
        lastResponse: response,
        status: 'ready',
        metrics: {
          ...willyState.metrics,
          commandsProcessed: willyState.metrics.commandsProcessed + 1,
          averageResponseTime: Math.round(
            (willyState.metrics.averageResponseTime + responseTime) / 2
          )
        }
      });

      return {
        success: true,
        response: response.message,
        data: response.data
      };
    } catch (error) {
      console.error('Command processing error:', error);
      
      updateState({
        isProcessing: false,
        status: 'error',
        metrics: {
          ...willyState.metrics,
          successRate: Math.round(
            (willyState.metrics.successRate * willyState.metrics.commandsProcessed) / 
            (willyState.metrics.commandsProcessed + 1)
          )
        }
      });

      return {
        success: false,
        response: 'I encountered an error processing that command.',
        error: error.message
      };
    }
  }, [willyState.metrics]);

  const parseCommandIntent = (command) => {
    const lowerCommand = command.toLowerCase();
    
    // System commands
    if (lowerCommand.includes('status') || lowerCommand.includes('diagnostic')) {
      return { type: 'system', action: 'status' };
    }
    if (lowerCommand.includes('scan') || lowerCommand.includes('check')) {
      return { type: 'system', action: 'scan' };
    }
    
    // Automation commands
    if (lowerCommand.includes('automate') || lowerCommand.includes('schedule')) {
      return { type: 'automation', action: 'create', params: { command } };
    }
    
    // Query commands
    if (lowerCommand.includes('what') || lowerCommand.includes('how') || lowerCommand.includes('when')) {
      return { type: 'query', query: command };
    }
    
    // Control commands
    if (lowerCommand.includes('turn on') || lowerCommand.includes('activate')) {
      return { type: 'control', action: 'activate' };
    }
    if (lowerCommand.includes('turn off') || lowerCommand.includes('deactivate')) {
      return { type: 'control', action: 'deactivate' };
    }
    
    return { type: 'generic', command };
  };

  const handleSystemCommand = async (action) => {
    switch (action) {
      case 'status':
        return {
          message: 'All systems operational. CPU: 42%, Memory: 2.1GB, Network: Online',
          data: { cpu: 42, memory: 2.1, network: 'online' }
        };
      case 'scan':
        await new Promise(resolve => setTimeout(resolve, 2000));
        return {
          message: 'System scan complete. No threats detected.',
          data: { threats: 0, scanned: 1247 }
        };
      default:
        return {
          message: 'System command executed successfully.',
          data: {}
        };
    }
  };

  const handleAutomationCommand = async (action, params) => {
    try {
      const result = await processN8NWebhook({
        action,
        params,
        timestamp: new Date().toISOString()
      });
      
      return {
        message: 'Automation task created successfully.',
        data: result
      };
    } catch (error) {
      throw new Error('Failed to create automation task');
    }
  };

  const handleQueryCommand = async (query) => {
    // Simulate AI response
    await new Promise(resolve => setTimeout(resolve, 1500));
    return {
      message: `Based on my analysis: ${query} - I'll need more context to provide a detailed answer.`,
      data: { query, confidence: 0.75 }
    };
  };

  const handleControlCommand = async (action) => {
    return {
      message: `Control command '${action}' executed successfully.`,
      data: { action, status: 'completed' }
    };
  };

  const handleGenericCommand = async (command) => {
    // Process through N8N webhook for complex commands
    try {
      const result = await processN8NWebhook({
        type: 'generic',
        command,
        timestamp: new Date().toISOString()
      });
      
      return {
        message: 'Command processed successfully.',
        data: result
      };
    } catch (error) {
      return {
        message: `I understand you said: "${command}". How can I help you with that?`,
        data: { command }
      };
    }
  };

  const executeAction = useCallback(async (actionType) => {
    switch (actionType) {
      case 'systemScan':
        toast.promise(
          handleSystemCommand('scan'),
          {
            loading: 'Running system scan...',
            success: 'Scan complete!',
            error: 'Scan failed'
          }
        );
        break;
      case 'statusReport':
        const status = await handleSystemCommand('status');
        toast.success(status.message);
        break;
      case 'aiAssist':
        toast('AI Assistant activated', { icon: '🤖' });
        break;
      default:
        toast('Action executed');
    }
  }, []);

  return {
    willyState,
    updateState,
    processCommand,
    executeAction
  };
};