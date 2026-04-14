import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Eye, EyeOff, Lock, Mail, User, ArrowRight, ShieldCheck } from 'lucide-react';
import BorderGlow from './BorderGlow';
import GoogleAuth from './GoogleAuth';

interface LoginProps {
  onLogin: (success: boolean, userName?: string) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleGoogleLogin = (name: string, email: string) => {
    setIsLoading(true);
    setError('');
    
    // Simuler une authentification réussie avec Google
    setTimeout(() => {
      onLogin(true, name);
      setIsLoading(false);
    }, 1000);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    // Validation des champs
    if (!fullName.trim()) {
      setError('Le nom complet est requis');
      setIsLoading(false);
      return;
    }

    if (!email.trim()) {
      setError('L\'email est requis');
      setIsLoading(false);
      return;
    }

    if (!password.trim()) {
      setError('Le mot de passe est requis');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      setIsLoading(false);
      return;
    }

    // Simuler une inscription réussie
    setTimeout(() => {
      setSuccess('Compte créé avec succès ! Vous pouvez maintenant vous connecter.');
      setIsLoginMode(true); // Basculer vers le mode connexion
      setIsLoading(false);
      
      // Réinitialiser les champs
      setPassword('');
      setConfirmPassword('');
    }, 1500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validation des champs
    if (!fullName.trim()) {
      setError('Le nom complet est requis');
      setIsLoading(false);
      return;
    }

    if (!email.trim()) {
      setError('L\'email est requis');
      setIsLoading(false);
      return;
    }

    if (!password.trim()) {
      setError('Le mot de passe est requis');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      setIsLoading(false);
      return;
    }

    // Simuler une authentification (pour démo)
    setTimeout(() => {
      // Authentification simple pour démo - accepte n'importe quel email et mot de passe valide
      onLogin(true, fullName);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="fixed inset-0 z-0">
        <motion.img 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 20, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1920" 
          alt="Professional Background"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-slate-50/90 backdrop-blur-[2px]" />
        <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-transparent to-brand-red/5" />
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between border-b border-slate-100 bg-white/95 backdrop-blur-xl">
        <div className="flex items-center">
          <img 
            src="./IMG_3335.png" 
            alt="Digital Mind+ Logo" 
            className="h-10 sm:h-12 w-auto object-contain"
          />
        </div>
        
        <div className="hidden sm:flex items-center gap-2">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-red" />
            <span className="hidden sm:inline">Accès Sécurisé</span>
          </div>
        </div>
      </header>

      {/* Login Form */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.99, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-md w-full relative z-10 mt-16"
      >
        <BorderGlow
          glowColor="227 30 36"
          glowIntensity={0.05}
          glowRadius={80}
          borderRadius={24}
          backgroundColor="transparent"
        >
          <div className="glass-panel p-8 md:p-10 relative overflow-hidden backdrop-blur-xl bg-white/95">
            {/* Background Pattern */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.02]">
              <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-brand-red/5" />
            </div>

            <div className="relative z-10">
              {/* Logo */}
              <div className="mb-6 flex justify-center">
                <img 
                  src="./IMG_3335.png" 
                  alt="Digital Mind+ Logo" 
                  className="h-12 w-auto object-contain"
                />
              </div>

              {/* Title */}
              <div className="text-center mb-6">
                <h1 className="font-display text-2xl font-bold text-brand-dark mb-2">
                  {isLoginMode ? 'Connexion' : 'Inscription'}
                </h1>
                <p className="text-slate-600 text-sm font-medium">
                  {isLoginMode 
                    ? 'Accédez à votre espace client' 
                    : 'Créez votre compte Digital Mind+'
                  }
                </p>
              </div>

              {/* Form */}
              <form onSubmit={isLoginMode ? handleSubmit : handleRegister} className="space-y-4">
                {/* Full Name Field */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Nom Complet
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <User className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-3 bg-white/80 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-all text-sm"
                      placeholder="Jean Dupont"
                      required
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Email Professionnel
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Mail className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-3 bg-white/80 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-all text-sm"
                      placeholder="admin@digitalmind.com"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Mot de Passe
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Lock className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-3 bg-white/80 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-all text-sm"
                      placeholder="DigitalMind2024"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-slate-400 hover:text-slate-600 transition-colors" />
                      ) : (
                        <Eye className="h-4 w-4 text-slate-400 hover:text-slate-600 transition-colors" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password Field - Only for registration */}
                {!isLoginMode && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Confirmation Mot de Passe
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Lock className="h-4 w-4 text-slate-400" />
                      </div>
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full pl-10 pr-10 py-3 bg-white/80 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-all text-sm"
                        placeholder="Confirmez votre mot de passe"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4 text-slate-400 hover:text-slate-600 transition-colors" />
                        ) : (
                          <Eye className="h-4 w-4 text-slate-400 hover:text-slate-600 transition-colors" />
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-medium"
                  >
                    {error}
                  </motion.div>
                )}

                {/* Success Message */}
                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-2.5 rounded-lg bg-green-50 border border-green-200 text-green-700 text-xs font-medium"
                  >
                    {success}
                  </motion.div>
                )}

                
                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-brand-red hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 text-sm shadow-lg hover:shadow-xl"
                >
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                    />
                  ) : (
                    <>
                      {isLoginMode ? 'Se Connecter' : 'S\'inscrire'}
                    </>
                  )}
                </button>
              </form>

              {/* Mode Toggle */}
              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setIsLoginMode(!isLoginMode);
                    setError('');
                    setSuccess('');
                  }}
                  className="text-xs text-brand-red hover:text-brand-dark font-semibold transition-colors"
                >
                  {isLoginMode 
                    ? "Pas encore de compte ? S'inscrire" 
                    : "Déjà un compte ? Se connecter"
                  }
                </button>
              </div>

              {/* Google Authentication */}
              {isLoginMode && <GoogleAuth onGoogleLogin={handleGoogleLogin} />}

              {/* Footer */}
              <div className="mt-6 pt-6 border-t border-slate-100 text-center">
                <p className="text-xs text-slate-500">
                  Digital Mind+ Group &copy; {new Date().getFullYear()}
                </p>
              </div>
            </div>
          </div>
        </BorderGlow>
      </motion.div>
    </div>
  );
}
