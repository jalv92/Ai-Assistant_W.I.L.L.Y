import { 
  startAuthentication, 
  startRegistration,
  browserSupportsWebAuthn 
} from '@simplewebauthn/browser';

// Configuration
const RP_NAME = import.meta.env.VITE_WEBAUTHN_RP_NAME || 'WILLY Assistant';
const RP_ID = import.meta.env.VITE_WEBAUTHN_RP_ID || window.location.hostname;
const ORIGIN = import.meta.env.VITE_WEBAUTHN_ORIGIN || window.location.origin;

// Check if WebAuthn is supported
export const isWebAuthnSupported = () => {
  return browserSupportsWebAuthn();
};

// Check if platform authenticator is available (Face ID, Touch ID, Windows Hello)
export const isPlatformAuthenticatorAvailable = async () => {
  try {
    if (!window.PublicKeyCredential) {
      return false;
    }
    
    return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
  } catch (error) {
    console.error('Error checking platform authenticator:', error);
    return false;
  }
};

// Generate registration options
export const generateRegistrationOptions = (username, userId) => {
  const challenge = new Uint8Array(32);
  crypto.getRandomValues(challenge);
  
  return {
    challenge: bufferToBase64(challenge),
    rp: {
      name: RP_NAME,
      id: RP_ID
    },
    user: {
      id: stringToBase64(userId || generateUserId()),
      name: username,
      displayName: username
    },
    pubKeyCredParams: [
      { alg: -7, type: 'public-key' },   // ES256
      { alg: -257, type: 'public-key' }, // RS256
      { alg: -8, type: 'public-key' }    // EdDSA
    ],
    timeout: 60000,
    attestation: 'direct',
    authenticatorSelection: {
      authenticatorAttachment: 'platform',
      requireResidentKey: false,
      residentKey: 'preferred',
      userVerification: 'required'
    },
    extensions: {
      credProps: true
    }
  };
};

// Register biometric credential
export const registerBiometric = async (username) => {
  try {
    // Check support
    const isSupported = await isPlatformAuthenticatorAvailable();
    if (!isSupported) {
      throw new Error('Biometric authentication not available on this device');
    }
    
    // Generate registration options
    const options = generateRegistrationOptions(username);
    
    // Start registration
    const credential = await startRegistration(options);
    
    // Store credential info locally (in production, send to server)
    const credentialData = {
      id: credential.id,
      rawId: credential.rawId,
      type: credential.type,
      username: username,
      createdAt: new Date().toISOString()
    };
    
    localStorage.setItem(`willy_credential_${username}`, JSON.stringify(credentialData));
    
    return {
      success: true,
      credential: credentialData
    };
  } catch (error) {
    console.error('Biometric registration failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Generate authentication options
export const generateAuthenticationOptions = () => {
  const challenge = new Uint8Array(32);
  crypto.getRandomValues(challenge);
  
  return {
    challenge: bufferToBase64(challenge),
    timeout: 60000,
    rpId: RP_ID,
    userVerification: 'required',
    allowCredentials: [] // Empty to allow any registered credential
  };
};

// Authenticate with biometric
export const authenticateWithBiometric = async () => {
  try {
    // Check support
    const isSupported = await isPlatformAuthenticatorAvailable();
    if (!isSupported) {
      throw new Error('Biometric authentication not available on this device');
    }
    
    // Generate authentication options
    const options = generateAuthenticationOptions();
    
    // Start authentication
    const assertion = await startAuthentication(options);
    
    // Verify locally (in production, send to server for verification)
    if (assertion && assertion.id) {
      // Check if credential exists
      const storedCredentials = Object.keys(localStorage)
        .filter(key => key.startsWith('willy_credential_'))
        .map(key => JSON.parse(localStorage.getItem(key)));
      
      const matchingCredential = storedCredentials.find(cred => 
        cred.id === assertion.id
      );
      
      if (matchingCredential) {
        return {
          success: true,
          user: {
            username: matchingCredential.username,
            credentialId: matchingCredential.id
          }
        };
      }
    }
    
    return {
      success: false,
      error: 'Authentication failed'
    };
  } catch (error) {
    console.error('Biometric authentication failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Helper functions
const bufferToBase64 = (buffer) => {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};

const stringToBase64 = (str) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  return bufferToBase64(data);
};

const generateUserId = () => {
  return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Clear stored credentials
export const clearBiometricCredentials = () => {
  const keys = Object.keys(localStorage).filter(key => 
    key.startsWith('willy_credential_')
  );
  
  keys.forEach(key => localStorage.removeItem(key));
};

// Get all registered users
export const getRegisteredUsers = () => {
  const keys = Object.keys(localStorage).filter(key => 
    key.startsWith('willy_credential_')
  );
  
  return keys.map(key => {
    const data = JSON.parse(localStorage.getItem(key));
    return data.username;
  });
};

// Export all functions
export default {
  isWebAuthnSupported,
  isPlatformAuthenticatorAvailable,
  registerBiometric,
  authenticateWithBiometric,
  clearBiometricCredentials,
  getRegisteredUsers
};