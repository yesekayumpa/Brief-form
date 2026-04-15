import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { motion } from 'motion/react';

interface GoogleAuthProps {
  onGoogleLogin: (name: string, email: string) => void;
}

export default function GoogleAuth({ onGoogleLogin }: GoogleAuthProps) {
  const handleGoogleSuccess = (credentialResponse: any) => {
    try {
      // Décoder le token JWT pour obtenir les informations utilisateur
      const token = credentialResponse.credential;
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join('')
      );
      
      const userInfo = JSON.parse(jsonPayload);
      
      // Extraire le nom et l'email
      const name = userInfo.name || userInfo.given_name + ' ' + (userInfo.family_name || '');
      const email = userInfo.email;
      
      onGoogleLogin(name, email);
    } catch (error) {
      console.error('Erreur lors de la connexion Google:', error);
    }
  };

  const handleGoogleError = () => {
    console.error('Erreur de connexion avec Google');
  };

  return (
    <div className="mt-6">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-slate-500 font-medium">Ou connectez-vous avec</span>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-6"
      >
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
          useOneTap
          theme="outline"
          size="large"
          text="signin_with"
          shape="rectangular"
          locale="fr"
          containerProps={{
            style: {
              width: '100%',
              display: 'flex',
              justifyContent: 'center'
            }
          }}
        />
      </motion.div>

      <p className="mt-4 text-xs text-slate-400 text-center">
        En vous connectant, vous acceptez nos conditions d'utilisation et politique de confidentialité
      </p>
    </div>
  );
}
