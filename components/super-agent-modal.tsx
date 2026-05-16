import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Terminal } from 'lucide-react';

const SuperAgentAnimation = () => {
  const [step, setStep] = React.useState(0);

  React.useEffect(() => {
    const t = setTimeout(() => {
      setStep(1);
    }, 3000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center bg-black">
      <motion.div
        layout
        initial={{ width: 100, height: 50, borderRadius: 100 }}
        animate={{ 
          width: step === 0 ? 100 : 220, 
          height: step === 0 ? 50 : 50,
          borderRadius: 100
        }}
        transition={{ type: "spring", bounce: 0.4, duration: 0.8 }}
        className="bg-white flex items-center justify-center overflow-hidden"
      >
        <AnimatePresence mode="wait">
          {step === 0 ? (
            <motion.div
              key="eyes"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-center gap-3 w-full h-full"
            >
              <motion.div
                animate={{ height: ["12px", "2px", "12px"] }}
                transition={{ duration: 0.2, delay: 1.5, repeat: Infinity, repeatDelay: 3 }}
                className="w-1.5 h-3 bg-black rounded-full"
              />
              <motion.div
                animate={{ height: ["12px", "2px", "12px"] }}
                transition={{ duration: 0.2, delay: 1.5, repeat: Infinity, repeatDelay: 3 }}
                className="w-1.5 h-3 bg-black rounded-full"
              />
            </motion.div>
          ) : (
            <motion.div
              key="text"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="px-6 text-black font-semibold tracking-tight text-[15px] flex items-center justify-center whitespace-nowrap"
            >
              hello super agent
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export function SuperAgentModal({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: (val: boolean) => void }) {
  const close = () => {
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#070707]/90 backdrop-blur-md">
          <button onClick={close} className="absolute top-6 right-6 text-zinc-500 hover:text-zinc-300 transition-colors z-50">
            <X size={24} />
          </button>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-md bg-[#141414] rounded-[24px] flex flex-col overflow-hidden shadow-2xl border border-white/5 relative z-10"
          >
            {/* Visual Container */}
            <div className="m-1 rounded-[20px] bg-black h-[220px] relative overflow-hidden flex items-center justify-center">
              <SuperAgentAnimation />
            </div>
            
            {/* Details */}
            <div className="p-8 flex flex-col gap-4 text-center">
              <div className="text-zinc-500 text-[15px] leading-relaxed">
                <span className="block text-zinc-200 font-medium tracking-tight mb-2 text-base">Super Agent Capabilities</span>
                Fast researcher equipped with <strong>Computer Use</strong>, <strong>URL Context</strong>, and <strong>Search Grounding</strong>. It can read websites, execute tasks, analyze skills, and solve problems in real-time.
              </div>
              <div className="mt-4 flex justify-center gap-4">
                <button
                  onClick={close}
                  className="px-6 py-3 rounded-full text-zinc-500 hover:text-zinc-300 text-sm font-medium transition-colors"
                >
                  Skip
                </button>
                <button
                  onClick={close}
                  className="bg-[#2a2a2a] hover:bg-[#383838] px-8 py-3 rounded-full text-zinc-200 text-sm font-medium transition-colors flex items-center justify-center border border-transparent"
                >
                  Activate
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
