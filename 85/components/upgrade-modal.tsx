import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X } from 'lucide-react';
import { useEffect, useState } from 'react';

export function UpgradeModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [checkoutUrl, setCheckoutUrl] = useState('https://kindlyprompt.lemonsqueezy.com/checkout/buy/cee279de-65e5-4f0d-9035-c6aa4358e26b');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Add a redirect param to URL if possible. Actually standard LemonSqueezy link doesn't use success_url by default like this unless configured in dashboard, but sometimes ?checkout[success_url]= works.
      const returnUrl = encodeURIComponent(`${window.location.origin}/?success=true`);
      // We will just use the checkout root and see.
    }
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]"
          />
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#141414] border border-white/10 rounded-3xl p-8 max-w-sm w-full relative pointer-events-auto shadow-2xl flex flex-col items-center text-center overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 to-transparent opacity-50" />
              
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors z-10"
              >
                <X size={20} />
              </button>

              <div className="w-16 h-16 bg-[#1a1a1a] rounded-full flex items-center justify-center mb-6 relative z-10 border border-white/5 shadow-inner">
                <Sparkles size={28} className="text-blue-400" />
              </div>

              <h2 className="text-2xl font-medium tracking-tight mb-2 relative z-10">Upgrade to Plus</h2>
              <p className="text-zinc-400 text-sm mb-8 relative z-10">
                Unlock AI Studio integration and more advanced agent capabilities.
              </p>

              <a
                href={checkoutUrl}
                className="w-full bg-white text-black hover:bg-zinc-200 transition-colors py-3.5 rounded-full font-medium flex items-center justify-center gap-2 relative z-10"
              >
                <Sparkles size={16} /> Update Now
              </a>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
