// Netlify Function for Authentication Check
exports.handler = async (event, context) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    // Get authorization header
    const authHeader = event.headers.authorization || event.headers.Authorization;
    
    if (!authHeader) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({
          success: false,
          error: 'No authorization header provided'
        })
      };
    }

    // Extract token
    const token = authHeader.replace('Bearer ', '');
    
    // In production, verify token with your auth service
    // For demo, we'll do basic validation
    if (!token || token.length < 10) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({
          success: false,
          error: 'Invalid token'
        })
      };
    }

    // Mock user data (in production, fetch from database)
    const userData = {
      id: 'user_123',
      username: 'willy_user',
      email: 'user@willy.ai',
      role: 'user',
      permissions: ['read', 'write', 'execute'],
      lastLogin: new Date().toISOString()
    };

    // Return success response
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        user: userData,
        token: {
          valid: true,
          expiresIn: 3600
        }
      })
    };

  } catch (error) {
    console.error('Auth check error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: 'Internal server error'
      })
    };
  }
};