import React, { useEffect } from 'react';

interface GoogleSignInButtonProps {
  onSuccess: (credential: string) => void;
  onError: (error: string) => void;
  disabled?: boolean;
}

declare global {
  interface Window {
    google: any;
    handleGoogleSignIn: (response: any) => void;
  }
}

const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({
  onSuccess,
  onError,
  disabled = false,
}) => {
  useEffect(() => {
    // Load Google Sign-In library
    const loadGoogleScript = () => {
      if (window.google) {
        initializeGoogleSignIn();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogleSignIn;
      document.body.appendChild(script);
    };

    const initializeGoogleSignIn = () => {
      if (!window.google) return;

      // Make callback available globally
      window.handleGoogleSignIn = (response: any) => {
        if (response.credential) {
          onSuccess(response.credential);
        } else {
          onError('Google Sign-In failed');
        }
      };

      window.google.accounts.id.initialize({
        client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
        callback: window.handleGoogleSignIn,
      });

      window.google.accounts.id.renderButton(
        document.getElementById('google-signin-button'),
        {
          theme: 'outline',
          size: 'large',
          width: '100%',
          text: 'continue_with',
        }
      );
    };

    if (process.env.REACT_APP_GOOGLE_CLIENT_ID) {
      loadGoogleScript();
    }

    return () => {
      // Cleanup
      if (window.handleGoogleSignIn) {
        window.handleGoogleSignIn = undefined as any;
      }
    };
  }, [onSuccess, onError]);

  if (!process.env.REACT_APP_GOOGLE_CLIENT_ID) {
    return (
      <div className="text-center text-gray-500 text-sm">
        Google Sign-In not configured
      </div>
    );
  }

  return (
    <div className="w-full">
      <div 
        id="google-signin-button" 
        style={{ 
          opacity: disabled ? 0.5 : 1,
          pointerEvents: disabled ? 'none' : 'auto'
        }}
      />
    </div>
  );
};

export default GoogleSignInButton;
