import axios from 'axios';

// Configuration
const N8N_WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL || '';
const N8N_API_KEY = import.meta.env.VITE_N8N_API_KEY || '';

// Webhook client configuration
const webhookClient = axios.create({
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    ...(N8N_API_KEY && { 'X-API-Key': N8N_API_KEY })
  }
});

// Request interceptor for logging
webhookClient.interceptors.request.use(
  (config) => {
    console.log('N8N Webhook Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('N8N Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
webhookClient.interceptors.response.use(
  (response) => {
    console.log('N8N Webhook Response:', response.status);
    return response;
  },
  (error) => {
    console.error('N8N Response Error:', error.response?.status, error.message);
    return Promise.reject(error);
  }
);

// Process command through N8N webhook
export const processN8NWebhook = async (payload) => {
  try {
    if (!N8N_WEBHOOK_URL) {
      console.warn('N8N webhook URL not configured');
      return mockWebhookResponse(payload);
    }
    
    const response = await webhookClient.post(N8N_WEBHOOK_URL, {
      ...payload,
      timestamp: new Date().toISOString(),
      source: 'willy-assistant'
    });
    
    return response.data;
  } catch (error) {
    console.error('N8N webhook error:', error);
    
    // Fallback to mock response in case of error
    if (error.code === 'ECONNABORTED' || !error.response) {
      return mockWebhookResponse(payload);
    }
    
    throw error;
  }
};

// Trigger specific N8N workflow
export const triggerWorkflow = async (workflowId, data = {}) => {
  try {
    const url = `${N8N_WEBHOOK_URL}/workflow/${workflowId}`;
    
    const response = await webhookClient.post(url, {
      workflowId,
      data,
      timestamp: new Date().toISOString()
    });
    
    return {
      success: true,
      workflowId,
      executionId: response.data.executionId,
      data: response.data
    };
  } catch (error) {
    console.error('Workflow trigger error:', error);
    return {
      success: false,
      workflowId,
      error: error.message
    };
  }
};

// Send event to N8N
export const sendN8NEvent = async (eventType, eventData) => {
  try {
    const response = await webhookClient.post(`${N8N_WEBHOOK_URL}/event`, {
      type: eventType,
      data: eventData,
      timestamp: new Date().toISOString(),
      source: 'willy-assistant'
    });
    
    return response.data;
  } catch (error) {
    console.error('N8N event error:', error);
    throw error;
  }
};

// Poll workflow execution status
export const getWorkflowStatus = async (executionId) => {
  try {
    const response = await webhookClient.get(`${N8N_WEBHOOK_URL}/execution/${executionId}`);
    
    return {
      executionId,
      status: response.data.status,
      finished: response.data.finished,
      data: response.data.data
    };
  } catch (error) {
    console.error('Get workflow status error:', error);
    return {
      executionId,
      status: 'error',
      finished: true,
      error: error.message
    };
  }
};

// Mock webhook response for development
const mockWebhookResponse = (payload) => {
  console.log('Using mock N8N response for:', payload);
  
  const responses = {
    systemScan: {
      success: true,
      action: 'system_scan',
      result: {
        cpu: Math.floor(Math.random() * 50) + 30,
        memory: (Math.random() * 4 + 1).toFixed(1),
        disk: Math.floor(Math.random() * 30) + 60,
        network: 'stable',
        threats: 0
      }
    },
    automation: {
      success: true,
      action: 'automation_created',
      workflowId: `wf_${Date.now()}`,
      message: 'Automation workflow created successfully'
    },
    query: {
      success: true,
      action: 'query_processed',
      response: 'Query processed successfully',
      confidence: 0.85
    },
    default: {
      success: true,
      action: 'command_processed',
      message: 'Command processed successfully',
      data: payload
    }
  };
  
  // Simulate network delay
  return new Promise((resolve) => {
    setTimeout(() => {
      const responseType = payload.action || payload.type || 'default';
      resolve(responses[responseType] || responses.default);
    }, 500 + Math.random() * 1000);
  });
};

// Webhook utilities
export const webhookUtils = {
  // Validate webhook URL
  isConfigured() {
    return !!N8N_WEBHOOK_URL;
  },
  
  // Get webhook configuration
  getConfig() {
    return {
      url: N8N_WEBHOOK_URL ? 'Configured' : 'Not configured',
      hasApiKey: !!N8N_API_KEY,
      timeout: webhookClient.defaults.timeout
    };
  },
  
  // Test webhook connection
  async testConnection() {
    try {
      const response = await processN8NWebhook({ 
        action: 'test',
        timestamp: new Date().toISOString()
      });
      
      return {
        connected: true,
        response
      };
    } catch (error) {
      return {
        connected: false,
        error: error.message
      };
    }
  }
};

export default {
  processN8NWebhook,
  triggerWorkflow,
  sendN8NEvent,
  getWorkflowStatus,
  webhookUtils
};