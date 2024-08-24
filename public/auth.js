

import * as supabase from '@supabase/supabase-js';

const sb = supabase.createClient(
  "https://kkvszipvbsxezcdrgsut.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtrdnN6aXB2YnN4ZXpjZHJnc3V0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjM2OTk4MDcsImV4cCI6MjAzOTI3NTgwN30.UlRIl7wtwzNr8jW6pjehojKhPjSDE0imkw_IAHgPdIQ",
);

// Extract access_token from URL hash and store in local storage
window.addEventListener('load', () => {
  const hash = window.location.hash;
  const params = new URLSearchParams(hash.substring(1));
  const accessToken = params.get('access_token');
  if (accessToken) {
    localStorage.setItem('access_token', accessToken);
    window.history.replaceState(null, null, ' ');
    console.log('Access token stored in local storage');
  }
});

// Use the access_token to authenticate Supabase requests
const storedToken = localStorage.getItem('access_token');
if (storedToken) {
  sb.auth.setAuth(storedToken);
}

// Function to refresh the access token
async function refreshAccessToken() {
  const refreshToken = localStorage.getItem('refresh_token');
  if (!refreshToken) return;

  const { data, error } = await sb.auth.refreshSession({ refresh_token: refreshToken });
  if (error) {
    console.error('Refresh token error', error);
    return;
  }

  localStorage.setItem('access_token', data.access_token);
  localStorage.setItem('refresh_token', data.refresh_token);
  sb.auth.setAuth(data.access_token);
}

// Example usage: Call refreshAccessToken when the access token expires
// This is a simple example, you might want to set up a more robust mechanism
setInterval(async () => {
  console.log('Access token interval');
  const tokenExpiryTime = 3600 * 1000; // Assuming token expires in 1 hour
  const lastRefreshTime = localStorage.getItem('last_refresh_time');
  const currentTime = new Date().getTime();

  if (!lastRefreshTime || currentTime - lastRefreshTime > tokenExpiryTime) {
    console.log('Refreshing access token');
    await refreshAccessToken();
    localStorage.setItem('last_refresh_time', currentTime.toString());
  }
}, 60000); // Check every minute