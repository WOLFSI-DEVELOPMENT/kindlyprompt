'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowRight, ImageIcon, History, UploadCloud, Mic, ShieldCheck, Download, MicIcon, Link as LinkIcon, MessageSquare, Paintbrush, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';

const StepOne = () => {
  const text = "Describe your app...";
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-[#1c1c1c] rounded-xl p-4 w-64 border border-zinc-800 shadow-xl relative"
      >
        <div className="h-10 bg-zinc-800/50 rounded flex items-center px-3 mb-2 overflow-hidden">
           <motion.span 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 0.3 }}
             className="text-zinc-500 text-xs flex"
           >
             {text.split('').map((char, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 + index * 0.05 }}
                >
                  {char}
                </motion.span>
             ))}
           </motion.span>
           <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [1, 0, 1] }}
              transition={{ delay: 0.5 + text.length * 0.05, repeat: Infinity, duration: 0.8 }}
              className="w-0.5 h-3.5 bg-zinc-400 ml-0.5"
           />
        </div>
        <motion.div 
          initial={{ scale: 0.5, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ delay: 1.5, type: 'spring', bounce: 0.5 }}
          className="absolute -bottom-3 -right-3 bg-zinc-800 rounded-full p-2 shadow-lg border border-zinc-700"
        >
          <ImageIcon size={16} className="text-blue-400" />
        </motion.div>
      </motion.div>
    </div>
  );
};

const StepTwo = () => (
  <div className="relative w-full h-full flex items-center justify-center">
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col gap-2 w-48"
    >
      {[1, 2, 3].map((i) => (
        <motion.div 
          key={i}
          initial={{ opacity: 0, x: -20, y: 10 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ delay: i * 0.15, type: "spring" }}
          className="bg-[#1c1c1c] h-10 rounded-xl px-3 flex items-center gap-2 border border-zinc-800 shadow-sm"
        >
          <History size={12} className="text-zinc-500" />
          <motion.div 
             initial={{ width: 0 }}
             animate={{ width: "5rem" }}
             transition={{ delay: i * 0.15 + 0.2, duration: 0.4 }}
             className="h-2 bg-zinc-700 rounded-full" 
          />
        </motion.div>
      ))}
    </motion.div>
  </div>
);

const StepThree = () => (
  <div className="relative w-full h-full flex items-center justify-center">
    <div className="flex gap-3">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="w-16 h-16 bg-[#1c1c1c] rounded-2xl flex flex-col items-center justify-center gap-1 border border-zinc-800"
      >
        <div className="w-6 h-6 rounded-full bg-orange-500/20 flex items-center justify-center">
          <UploadCloud size={12} className="text-orange-500" />
        </div>
      </motion.div>
      <motion.div 
        initial={{ scale: 0.8, opacity: 0, y: 20 }}
        animate={{ scale: 1.2, opacity: 1, y: 0, boxShadow: '0 0 30px rgba(75, 115, 255, 0.2)' }}
        transition={{ delay: 0.3, duration: 0.5, type: 'spring' }}
        className="w-16 h-16 bg-[#1c1c1c] rounded-xl flex flex-col items-center justify-center gap-1 border border-zinc-700 relative z-10"
      >
        <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center">
          <svg width="12" height="12" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><g fill="currentColor"><path d="M211.648 89.515h-76.651A57.707 57.707 0 0077.291 147.2v242.389a57.707 57.707 0 0057.706 57.707h242.411a57.707 57.707 0 0057.707-57.707V288.128l34.624-23.744v125.227a92.35 92.35 0 01-92.331 92.33H134.997a92.349 92.349 0 01-92.33-92.33v-242.39A92.336 92.336 0 0169.702 81.92a92.33 92.33 0 0165.295-27.05h96.96l-20.309 34.645z"/><path d="M380.16 0c3.093 0 5.717 2.219 6.379 5.248a149.328 149.328 0 0040.533 74.325 149.332 149.332 0 0074.347 40.555c3.029.661 5.248 3.285 5.248 6.4a6.574 6.574 0 01-5.248 6.357 149.338 149.338 0 00-74.326 40.555 149.338 149.338 0 00-40.789 75.413 6.334 6.334 0 01-6.144 5.078 6.334 6.334 0 01-6.144-5.078 149.338 149.338 0 00-40.789-75.413 149.326 149.326 0 00-75.414-40.789 6.338 6.338 0 01-5.077-6.144c0-2.987 2.133-5.547 5.077-6.144a149.336 149.336 0 0075.414-40.79 149.354 149.354 0 0040.554-74.325A6.573 6.573 0 01380.16 0z"/></g></svg>
        </div>
        <motion.div 
           initial={{ opacity: 0, y: 10, scale: 0.8 }}
           animate={{ opacity: 1, y: 0, scale: 1 }}
           transition={{ delay: 0.8, type: 'spring' }}
           className="absolute px-2 py-1 bg-green-500 text-white text-[10px] font-bold rounded shadow-lg font-medium"
           style={{ top: "100%", marginTop: "10px" }}
        >
          Exported!
        </motion.div>
      </motion.div>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="w-16 h-16 bg-[#1c1c1c] rounded-2xl flex flex-col items-center justify-center gap-1 border border-zinc-800"
      >
        <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center">
          <Download size={12} className="text-purple-500" />
        </div>
      </motion.div>
    </div>
  </div>
);

const StepFour = () => (
   <div className="relative w-full h-full flex flex-col items-center justify-center">
       <motion.div
           initial={{ scale: 0, opacity: 0 }}
           animate={{ scale: 1, opacity: 1 }}
           transition={{ type: 'spring', bounce: 0.5 }}
           className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-transparent p-[1px] relative shadow-[0_0_30px_rgba(59,130,246,0.2)]"
       >
         <div className="w-full h-full bg-[#1c1c1c] rounded-full flex items-center justify-center relative">
            <motion.div 
               animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }} 
               transition={{ repeat: Infinity, duration: 2 }}
               className="absolute inset-0 rounded-full bg-blue-500/30"
            />
            <motion.div 
               animate={{ scale: [1, 1.2, 1] }} 
               transition={{ repeat: Infinity, duration: 1.5 }}
            >
               <MicIcon size={24} className="text-blue-400" />
            </motion.div>
         </div>
       </motion.div>
   </div>
);

const StepFive = () => (
    <div className="relative w-full h-full flex items-center justify-center">
        <motion.div 
           initial={{ y: 30, opacity: 0, scale: 0.9 }} 
           animate={{ y: 0, opacity: 1, scale: 1 }}
           transition={{ type: 'spring' }} 
           className="bg-[#1c1c1c] rounded-2xl border border-zinc-800 p-4 shadow-xl flex items-center gap-3 w-64"
        >
           <ShieldCheck size={20} className="text-green-400" />
           <div className="h-4 bg-zinc-800 rounded w-full overflow-hidden flex items-center px-1">
             {[1, 2, 3, 4].map((i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + i * 0.15, type: 'spring' }}
                  className="w-2 h-2 rounded-full bg-zinc-400 mr-1"
                />
             ))}
           </div>
        </motion.div>
    </div>
);

const StepSix = () => {
    useEffect(() => {
        const interval = setInterval(() => {
            confetti({
                particleCount: 50,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444']
            });
            confetti({
                particleCount: 50,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444']
            });
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative w-full h-full flex flex-col items-center justify-center text-center">
            <motion.div
               initial={{ scale: 0.5, opacity: 0, filter: "blur(10px)" }}
               animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
               className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-2"
            >
                Enjoy!
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-zinc-500 text-sm">
                You're ready to start building amazing apps.
            </motion.div>
        </div>
    );
}

export function OnboardingModal({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: (v: boolean) => void }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (isOpen) setStep(0);
  }, [isOpen]);

  const close = () => {
    localStorage.setItem('hasSeenOnboarding', 'true');
    setIsOpen(false);
  };

  const nextStep = () => {
      if (step < 5) {
          setStep(step + 1);
      } else {
          close();
      }
  };

  const steps = [
      { component: StepOne, text: "Upload images directly within the input box to provide visual context." },
      { component: StepTwo, text: "Access your entire prompt history instantly from the recents panel." },
      { component: StepThree, text: "Export your generated prompts directly to AI Studio, Lovable, or ChatGPT." },
      { component: StepFour, text: "Refine and edit your prompts smoothly using just your voice." },
      { component: StepFive, text: "Securely add your Gemini API key inside your profile card to unlock full capabilities." },
      { component: StepSix, text: "You're all set! Enjoy crafting perfect prompts for your projects." }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#070707]/90 backdrop-blur-md">
          <button onClick={close} className="absolute top-6 right-6 text-zinc-500 hover:text-zinc-300 transition-colors z-50">
            <X size={24} />
          </button>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-md bg-[#141414] rounded-[24px] flex flex-col overflow-hidden shadow-2xl border border-white/5"
          >
            {/* Visual Container */}
            <div className="m-1 rounded-[20px] bg-black h-[220px] relative overflow-hidden flex items-center justify-center">
              <AnimatePresence mode="wait">
                  <motion.div 
                     key={step}
                     initial={{ opacity: 0, x: 20 }}
                     animate={{ opacity: 1, x: 0 }}
                     exit={{ opacity: 0, x: -20 }}
                     transition={{ duration: 0.3 }}
                     className="w-full h-full absolute inset-0"
                  >
                      {steps[step].component()}
                  </motion.div>
              </AnimatePresence>
            </div>
            {/* Details */}
            <div className="p-8 flex flex-col gap-6 text-center">
              <div className="flex justify-center gap-1.5 mb-2">
                 {[0, 1, 2, 3, 4, 5].map(i => (
                     <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === step ? 'w-6 bg-blue-500' : 'w-1.5 bg-zinc-800'}`} />
                 ))}
              </div>
              <div className="text-zinc-400 text-sm leading-relaxed h-10 flex items-center justify-center">
                {steps[step].text}
              </div>
              <div className="mt-2 flex justify-center gap-4">
                {step < 5 && (
                  <button
                    onClick={close}
                    className="px-6 py-3 rounded-full text-zinc-500 hover:text-zinc-300 text-sm font-medium transition-colors"
                  >
                    Skip
                  </button>
                )}
                <button
                  onClick={nextStep}
                  className="bg-[#2a2a2a] hover:bg-[#383838] px-8 py-3 rounded-full text-zinc-200 text-sm font-medium transition-colors flex items-center justify-center flex-1"
                >
                  {step === 5 ? "Get Started" : "Next"}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
