import { Configuration } from '@azure/msal-browser';

export const msalConfig: Configuration = {
  auth: {
    clientId: process.env.REACT_APP_AUTH_CLIENT_ID || '',
    authority: process.env.REACT_APP_AUTH_AUTHORITY,
    knownAuthorities: [process.env.REACT_APP_AUTH_KNOWN_AUTHORITY || ''],
    redirectUri: process.env.REACT_APP_AUTH_REDIRECT_URL,
  },
  cache: {
    cacheLocation: 'sessionStorage', // This configures where your cache will be stored
    storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
  },
};

// Add scopes here for ID token to be used at Microsoft identity platform endpoints.
export const loginRequest = {
  scopes: ['openid'],
};

// Add the endpoints here for Microsoft Graph API services you'd like to use.
export const graphConfig = {
  graphMeEndpoint: 'https://graph.microsoft.com',
};
