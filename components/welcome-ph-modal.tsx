'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ExternalLink } from 'lucide-react';

export function WelcomePhModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isFromPH, setIsFromPH] = useState(false);
  const [typedText, setTypedText] = useState('');
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Only show once per session or use localStorage
    const hasSeenWelcome = localStorage.getItem('hasSeenWelcomePH');
    if (!hasSeenWelcome) {
      setTimeout(() => setIsOpen(true), 1500);
      localStorage.setItem('hasSeenWelcomePH', 'true');
    }

    // Check if URL has ?ref=producthunt
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('ref') === 'producthunt') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsFromPH(true);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      if (!isFromPH) {
        const textToType = "We're now on Product Hunt!";
        let i = 0;
        const typeNext = () => {
          if (i <= textToType.length) {
            setTypedText(textToType.substring(0, i));
            i++;
            typingTimeoutRef.current = setTimeout(typeNext, 50);
          }
        };
        typeNext();
      }
    }
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, [isOpen, isFromPH]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md bg-[#1a1a1a] rounded-3xl p-8 shadow-[0_0_40px_rgba(0,0,0,0.5)] border border-white/10"
        >
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 p-2 text-zinc-500 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>

          <div className="flex flex-col items-center text-center gap-6 mt-4">
            <div className="w-16 h-16 rounded-full bg-[#da552f]/10 flex items-center justify-center shrink-0">
              <span className="text-[#da552f] text-3xl font-bold font-serif leading-none">P</span>
            </div>
            
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-medium text-white tracking-tight min-h-[32px]">
                {isFromPH ? (
                  <span className="text-[#da552f]">Thank you for upvoting!</span>
                ) : (
                  <>
                    <span className="text-white">{typedText}</span>
                    <motion.span
                      animate={{ opacity: [1, 0] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                      className="inline-block w-0.5 h-6 bg-white ml-1 align-middle"
                    />
                  </>
                )}
              </h2>
              <p className="text-zinc-400 text-[15px] leading-relaxed">
                {isFromPH 
                  ? "We super appreciate your support for Kindly Prompt on Product Hunt! Enjoy generating advanced prompts with us." 
                  : "Kindly Prompt is live on Product Hunt! We'd love your support and feedback to help us grow."}
              </p>
            </div>

            <a
              href="https://www.producthunt.com/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsOpen(false)}
              className="mt-2 w-full flex items-center justify-center gap-2 py-3 px-6 bg-[#da552f] hover:bg-[#da552f]/90 text-white rounded-full font-medium transition-colors"
            >
              <ExternalLink size={18} />
              {isFromPH ? "View on Product Hunt" : "Support us on Product Hunt"}
            </a>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
