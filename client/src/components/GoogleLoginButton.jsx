import { useEffect } from 'react';

const GoogleLoginButton = ({ onLogin }) => {
  useEffect(() => {
    const initializeGoogleSignIn = () => {
      if (window.google && window.google.accounts) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse,
        });

        window.google.accounts.id.renderButton(
          document.getElementById('google-login-btn'),
          { theme: 'outline', size: 'large' }
        );
      } else {
        // If google isn't ready yet, try again shortly
        setTimeout(initializeGoogleSignIn, 100);
      }
    };


    initializeGoogleSignIn();
  }, []);

  const handleCredentialResponse = async (response) => {
    console.log('🟢 Token:', response.credential);
    try {
      const res = await fetch('http://localhost:5000/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_token: response.credential }),
      });

      const data = await res.json();
      if (data.token) {
        onLogin(data); // token + user
      } else {
        console.error('❌ Login failed:', data.error);
      }
    } catch (err) {
      console.error('❌ Login error:', err);
    }
  };

  return <div id="google-login-btn"></div>;
};

export default GoogleLoginButton;
