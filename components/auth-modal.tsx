'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail } from 'lucide-react';

const AuthAnimation = () => {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center">
      {/* Sparkle */}
      <motion.div
        initial={{ opacity: 0, scale: 0, rotate: -45 }}
        animate={{ opacity: [0, 1, 0], scale: [0, 1, 1.5], rotate: [-45, 0, 45] }}
        transition={{ duration: 1.5, times: [0, 0.5, 1], ease: "easeInOut", repeat: Infinity, repeatDelay: 3.5 }}
        className="absolute"
      >
        <svg width="32" height="32" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="piSparkleGradientAuth" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#60A5FA"/>
              <stop offset="50%" stopColor="#3B82F6"/>
              <stop offset="100%" stopColor="#2563EB"/>
            </linearGradient>
          </defs>
          <path
            d="M12 2.8
               C12.4 6.8 13.2 8.8 15.2 10.8
               C17.2 12.8 19.2 13.6 23.2 14
               C19.2 14.4 17.2 15.2 15.2 17.2
               C13.2 19.2 12.4 21.2 12 25.2
               C11.6 21.2 10.8 19.2 8.8 17.2
               C6.8 15.2 4.8 14.4 0.8 14
               C4.8 13.6 6.8 12.8 8.8 10.8
               C10.8 8.8 11.6 6.8 12 2.8Z"
            fill="url(#piSparkleGradientAuth)"
            transform="translate(0 -2)"
          />
        </svg>
      </motion.div>

      {/* Text */}
      <motion.div
        initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
        animate={{ opacity: [0, 1, 1, 0], y: [20, 0, 0, -20], filter: ['blur(10px)', 'blur(0px)', 'blur(0px)', 'blur(10px)'] }}
        transition={{ duration: 5, delay: 1.5, times: [0, 0.1, 0.9, 1], ease: "easeInOut", repeat: Infinity, repeatDelay: 1 }}
        className="absolute text-xl font-medium tracking-tight text-white text-center px-4"
      >
        Sign up or login <br /> for more features
      </motion.div>
    </div>
  );
};

// Simple SVG Icons for Socials
const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const GithubIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.84 9.49.5.09.68-.22.68-.485v-1.816c-2.778.605-3.364-1.34-3.364-1.34-.454-1.156-1.11-1.465-1.11-1.465-.908-.62.069-.608.069-.608 1.004.07 1.532 1.03 1.532 1.03.892 1.53 2.341 1.088 2.91.832.09-.646.348-1.088.636-1.338-2.22-.252-4.555-1.11-4.555-4.943 0-1.09.39-1.984 1.03-2.68-.103-.254-.447-1.27.098-2.646 0 0 .84-.27 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.748-1.025 2.748-1.025.546 1.376.202 2.392.1 2.646.64.696 1.028 1.59 1.028 2.68 0 3.842-2.337 4.687-4.565 4.935.358.307.678.915.678 1.846v2.74c0 .268.18.58.688.482A10.019 10.019 0 0022 12c0-5.523-4.477-10-10-10z"/>
  </svg>
);

const CanvaIcon = () => (
  <svg viewBox="0 0 508 508" width="16" height="16" xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" clipRule="evenodd" strokeLinejoin="round" strokeMiterlimit="2"><g transform="matrix(.26718 0 0 .26718 0 0)"><circle cx="950" cy="950" r="950" fill="#7d2ae7"/><circle cx="950" cy="950" r="950" fill="url(#prefix___Radial1)"/><circle cx="950" cy="950" r="950" fill="url(#prefix___Radial2)"/><circle cx="950" cy="950" r="950" fill="url(#prefix___Radial3)"/><circle cx="950" cy="950" r="950" fill="url(#prefix___Radial4)"/></g><path d="M446.744 276.845c-.665 0-1.271.43-1.584 1.33-4.011 11.446-9.43 18.254-13.891 18.254-2.563 0-3.6-2.856-3.6-7.336 0-11.21 6.71-34.982 10.095-45.82.392-1.312.646-2.485.646-3.483 0-3.15-1.722-4.696-5.987-4.696-4.598 0-9.547 1.8-14.36 10.233-1.663-7.435-6.691-10.683-13.715-10.683-8.12 0-15.965 5.224-22.421 13.696-6.456 8.471-14.048 11.25-19.76 9.88 4.108-10.057 5.634-17.57 5.634-23.145 0-8.746-4.324-14.028-11.308-14.028-10.624 0-16.747 10.134-16.747 20.797 0 8.237 3.736 16.708 11.954 20.817-6.887 15.573-16.943 29.66-20.758 29.66-4.93 0-6.379-24.123-6.105-41.38.176-9.9.998-10.408.998-13.401 0-1.722-1.115-2.896-5.595-2.896-10.448 0-13.676 8.844-14.165 18.998a50.052 50.052 0 01-1.8 11.406c-4.363 15.573-13.363 27.39-19.232 27.39-2.72 0-3.463-2.72-3.463-6.28 0-11.21 6.28-25.219 6.28-37.173 0-8.784-3.854-14.34-11.112-14.34-8.55 0-19.858 10.173-30.56 29.229 3.521-14.595 4.97-28.721-5.459-28.721a14.115 14.115 0 00-6.476 1.683 3.689 3.689 0 00-2.113 3.56c.998 15.535-12.521 55.329-25.336 55.329-2.328 0-3.463-2.524-3.463-6.593 0-11.23 6.691-34.943 10.056-45.801.43-1.409.666-2.622.666-3.678 0-2.974-1.84-4.5-6.007-4.5-4.578 0-9.547 1.741-14.34 10.174-1.683-7.435-6.711-10.683-13.735-10.683-11.523 0-24.397 12.19-30.051 28.076-7.572 21.208-22.832 41.692-43.375 41.692-18.645 0-28.486-15.515-28.486-40.03 0-35.392 25.982-64.308 45.253-64.308 9.215 0 13.617 5.869 13.617 14.869 0 10.897-6.085 15.964-6.085 20.112 0 1.272 1.057 2.524 3.15 2.524 8.374 0 18.234-9.841 18.234-23.262 0-13.422-10.897-23.243-30.168-23.243-31.851 0-63.898 32.047-63.898 73.113 0 32.673 16.121 52.374 44 52.374 19.017 0 35.628-14.79 44.588-32.047 1.018 14.302 7.513 21.776 17.413 21.776 8.804 0 15.925-5.243 21.364-14.458 2.094 9.645 7.65 14.36 14.87 14.36 8.275 0 15.201-5.243 21.794-14.986-.097 7.65 1.644 14.85 8.276 14.85 3.13 0 6.867-.725 7.533-3.464 6.984-28.877 24.24-52.453 29.523-52.453 1.565 0 1.995 1.507 1.995 3.287 0 7.846-5.537 23.928-5.537 34.2 0 11.092 4.716 18.43 14.459 18.43 10.8 0 21.775-13.227 29.092-32.556 2.29 18.058 7.24 32.633 14.987 32.633 9.508 0 26.392-20.014 36.625-41.203 4.01.509 10.036.372 15.827-3.717-2.465 6.241-3.912 13.07-3.912 19.897 0 19.663 9.39 25.18 17.47 25.18 8.785 0 15.907-5.243 21.365-14.458 1.8 8.315 6.398 14.34 14.85 14.34 13.225 0 24.71-13.519 24.71-24.612 0-2.934-1.252-4.715-2.72-4.715zm-274.51 18.547c-5.342 0-7.435-5.38-7.435-13.401 0-13.93 9.528-37.193 19.604-37.193 4.402 0 6.065 5.185 6.065 11.524 0 14.145-9.059 39.07-18.235 39.07zm182.948-41.574c-3.189-3.796-4.343-8.961-4.343-13.559 0-5.673 2.074-10.467 4.558-10.467 2.485 0 3.248 2.446 3.248 5.85 0 5.693-2.035 14.008-3.463 18.176zm41.418 41.574c-5.34 0-7.434-6.182-7.434-13.401 0-13.441 9.528-37.193 19.682-37.193 4.402 0 5.967 5.146 5.967 11.524 0 14.145-8.902 39.07-18.215 39.07z" fill="#fff" fillRule="nonzero"/><defs><radialGradient id="prefix___Radial1" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="scale(1469.491) rotate(-49.416 1.37 .302)"><stop offset="0" stopColor="#6420ff"/><stop offset="1" stopColor="#6420ff" stopOpacity="0"/></radialGradient><radialGradient id="prefix___Radial2" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="rotate(54.703 42.717 594.194) scale(1657.122)"><stop offset="0" stopColor="#00c4cc"/><stop offset="1" stopColor="#00c4cc" stopOpacity="0"/></radialGradient><radialGradient id="prefix___Radial3" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="matrix(1023 -1030 473.711 470.491 367 1684)"><stop offset="0" stopColor="#6420ff"/><stop offset="1" stopColor="#6420ff" stopOpacity="0"/></radialGradient><radialGradient id="prefix___Radial4" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="matrix(595.999 1372 -2298.41 998.431 777 256)"><stop offset="0" stopColor="#00c4cc" stopOpacity=".73"/><stop offset="0" stopColor="#00c4cc"/><stop offset="1" stopColor="#00c4cc" stopOpacity="0"/></radialGradient></defs></svg>
);


export function AuthModal({ isOpen, onClose, onSuccess }: { isOpen: boolean, onClose: () => void, onSuccess: (user: any) => void }) {
  const [view, setView] = useState<'options' | 'email' | 'success'>('options');
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (action: 'signin' | 'signup') => {
    if (!email || !password) return;
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, action }),
      });
      if (res.ok) {
        setView('success');
        setTimeout(() => {
          onClose();
          onSuccess({ email, name: email.split('@')[0] });
          setView('options');
          setEmail('');
          setPassword('');
        }, 2000);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCanvaLogin = async () => {
    try {
      const response = await fetch(`/api/auth/canva/url?origin=${encodeURIComponent(window.location.origin)}`);
      if (!response.ok) {
        throw new Error('Failed to get auth URL');
      }
      const { url } = await response.json();

      const authWindow = window.open(
        url,
        'oauth_popup',
        'width=600,height=700'
      );

      if (!authWindow) {
        alert('Please allow popups for this site to connect your account.');
      }
    } catch (error) {
      console.error('OAuth error:', error);
    }
  };

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const origin = event.origin;
      if (!origin.endsWith('.run.app') && !origin.includes('localhost')) {
        return;
      }
      if (event.data?.type === 'OAUTH_AUTH_SUCCESS') {
        setView('success');
        const user = event.data.user || { email: 'user@canva.com', name: 'Canva User' };
        setTimeout(() => {
          onClose();
          onSuccess(user);
          setView('options');
        }, 2000);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onClose, onSuccess]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#070707]/90 backdrop-blur-md">
      <button onClick={onClose} className="absolute top-6 right-6 text-zinc-500 hover:text-zinc-300 transition-colors z-50">
        <X size={24} />
      </button>

      <AnimatePresence mode="wait">
        <motion.div
          key={view}
          initial={{ opacity: 0, filter: 'blur(10px)', scale: 0.95 }}
          animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
          exit={{ opacity: 0, filter: 'blur(10px)', scale: 1.05 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md bg-[#141414] rounded-[24px] flex flex-col overflow-hidden"
        >
          {/* Visual Container */}
          <div className="m-1 rounded-[20px] bg-black h-[180px] relative overflow-hidden flex items-center justify-center border border-white/5">
            <AuthAnimation />
          </div>

          {/* Details */}
          <div className="p-6 flex flex-col gap-3">
            {view === 'options' ? (
              <>
                <button 
                  onClick={() => setView('email')}
                  className="w-full bg-[#1c1c1c] hover:bg-[#2a2a2a] py-3.5 px-4 rounded-full text-zinc-200 text-[15px] font-medium transition-colors flex items-center justify-center gap-2 border-none"
                >
                  <Mail size={16} /> Continue with Email
                </button>

                <button className="w-full bg-[#1c1c1c] hover:bg-[#2a2a2a] py-3.5 px-4 rounded-full text-zinc-200 text-[15px] font-medium transition-colors flex items-center justify-center gap-2 border-none">
                  <GoogleIcon /> Continue with Google
                </button>

                <button className="w-full bg-[#1c1c1c] hover:bg-[#2a2a2a] py-3.5 px-4 rounded-full text-zinc-200 text-[15px] font-medium transition-colors flex items-center justify-center gap-2 border-none">
                  <GithubIcon /> Continue with GitHub
                </button>

                <button onClick={handleCanvaLogin} className="w-full bg-[#1c1c1c] hover:bg-[#2a2a2a] py-3.5 px-4 rounded-full text-zinc-200 text-[15px] font-medium transition-colors flex items-center justify-center gap-2 border-none">
                  <CanvaIcon /> Continue with Canva
                </button>
              </>
            ) : view === 'email' ? (
              <>
                <div className="flex flex-col gap-3 text-left w-full mt-2">
                  <input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#1c1c1c] rounded-full px-5 py-3.5 text-[15px] text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-700 transition-all border border-transparent"
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#1c1c1c] rounded-full px-5 py-3.5 text-[15px] text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-700 transition-all border border-transparent"
                  />
                </div>
                
                <div className="flex flex-col items-center mt-3 mb-1 w-full text-sm gap-4">
                  <div className="flex justify-between w-full items-center">
                    <button onClick={() => setView('options')} className="text-zinc-500 hover:text-zinc-300 font-medium px-2 py-1 transition-colors">
                      Back
                    </button>
                    <button 
                      onClick={() => handleSubmit(authMode)}
                      disabled={!email || !password || isSubmitting}
                      className="bg-[#2a2a2a] hover:bg-[#383838] px-8 py-2.5 rounded-full text-zinc-200 font-medium flex items-center justify-center transition-colors disabled:opacity-50"
                    >
                      {authMode === 'signin' ? 'Sign In' : 'Sign Up'}
                    </button>
                  </div>
                  <button 
                    onClick={() => setAuthMode(authMode === 'signin' ? 'signup' : 'signin')}
                    className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
                  >
                    {authMode === 'signin' ? "Don't have an account? Sign up" : "Already have an account? Log in"}
                  </button>
                </div>
              </>
            ) : (
               <div className="flex flex-col items-center justify-center py-6">
                 <p className="text-zinc-200 font-medium text-lg">Success!</p>
               </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
