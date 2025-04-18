import { nanoid } from 'nanoid';

// Environment variables for OAuth configuration
const CLIENT_ID = import.meta.env.VITE_CAPITAL_ONE_CLIENT_ID;
const REDIRECT_URI = import.meta.env.VITE_CAPITAL_ONE_REDIRECT_URI || window.location.origin;
const OAUTH_BASE_URL = 'https://api-sandbox.capitalone.com/oauth2/authorize';

/**
 * Initiates the OAuth flow with Capital One
 */
export async function initiateOAuthFlow() {
  try {
    // Generate a state param to prevent CSRF
    const state = nanoid(32);
    
    // Store the state in session storage for validation when the user returns
    sessionStorage.setItem('oauth_state', state);
    
    // Register the state with the backend
    await fetch('/api/auth/state', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ state }),
    });
    
    // Construct the OAuth URL
    const oauthUrl = new URL(OAUTH_BASE_URL);
    oauthUrl.searchParams.append('client_id', CLIENT_ID);
    oauthUrl.searchParams.append('redirect_uri', REDIRECT_URI);
    oauthUrl.searchParams.append('scope', 'read_financial_profile');
    oauthUrl.searchParams.append('response_type', 'code');
    oauthUrl.searchParams.append('state', state);
    
    // Redirect to Capital One OAuth
    window.location.href = oauthUrl.toString();
  } catch (error) {
    console.error('Error starting OAuth flow:', error);
    throw error;
  }
}
