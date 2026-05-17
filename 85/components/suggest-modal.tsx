'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowRight01Icon, Cancel01Icon, SparklesIcon, Tick01Icon } from '@hugeicons/core-free-icons';

type IconProps = { size?: number | string; className?: string; strokeWidth?: number };
const Sparkles = ({ size = 24, className, strokeWidth = 1.5 }: IconProps) => <HugeiconsIcon icon={SparklesIcon} size={size} className={className} strokeWidth={strokeWidth} />;
const X = ({ size = 24, className, strokeWidth = 1.5 }: IconProps) => <HugeiconsIcon icon={Cancel01Icon} size={size} className={className} strokeWidth={strokeWidth} />;
const ArrowRight = ({ size = 24, className, strokeWidth = 1.5 }: IconProps) => <HugeiconsIcon icon={ArrowRight01Icon} size={size} className={className} strokeWidth={strokeWidth} />;
const Check = ({ size = 24, className, strokeWidth = 1.5 }: IconProps) => <HugeiconsIcon icon={Tick01Icon} size={size} className={className} strokeWidth={strokeWidth} />;

const SuccessAnimation = () => {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.5, filter: 'blur(10px)' }}
        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="absolute text-xl font-medium tracking-tight text-white text-center px-4 leading-tight"
      >
        Suggestion <br /> Sent!
      </motion.div>
    </div>
  );
};

export function SuggestToolModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [tool, setTool] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!name || !email || !tool) return;
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, tool }),
      });
      if (res.ok) {
        setStep(1); // Show success
        setTimeout(() => {
          onClose();
          setStep(0);
          setName('');
          setEmail('');
          setTool('');
        }, 2500);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#070707]/90 backdrop-blur-md">
      <button onClick={onClose} className="absolute top-6 right-6 text-zinc-500 hover:text-zinc-300 transition-colors z-50">
        <X size={24} />
      </button>
      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div
            key="step0"
            initial={{ opacity: 0, filter: 'blur(10px)', scale: 0.95 }}
            animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
            exit={{ opacity: 0, filter: 'blur(10px)', scale: 1.05 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-md bg-[#141414] rounded-[24px] flex flex-col p-1 overflow-hidden shadow-2xl"
          >
            <div className="p-8 flex flex-col gap-6 bg-[#1c1c1c] rounded-[20px]">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-[#141414] flex items-center justify-center border border-white/5">
                  <Sparkles size={18} className="text-blue-400" />
                </div>
                <div>
                  <h3 className="text-zinc-200 font-medium tracking-tight text-lg leading-tight">Suggest a Tool</h3>
                  <p className="text-[13px] text-zinc-500">What should we add next?</p>
                </div>
              </div>
              
              <div className="flex flex-col gap-3">
                <input
                  type="text"
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#141414] rounded-xl px-4 py-3 text-sm text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-700 transition-all border border-transparent"
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#141414] rounded-xl px-4 py-3 text-sm text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-700 transition-all border border-transparent"
                />
                <textarea
                  placeholder="What tool would you like to export to? (e.g. Vercel, Supabase, Figma)"
                  value={tool}
                  onChange={(e) => setTool(e.target.value)}
                  className="w-full h-24 bg-[#141414] rounded-xl p-4 text-sm text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-700 resize-none transition-all border border-transparent custom-scrollbar"
                />
              </div>

              <div className="flex justify-end mt-2">
                <button
                  onClick={handleSubmit}
                  disabled={!name || !email || !tool || isSubmitting}
                  className="bg-[#2a2a2a] hover:bg-[#383838] px-6 py-2.5 rounded-full text-zinc-200 text-sm font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Sending...' : 'Send Suggestion'} <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, filter: 'blur(10px)', scale: 0.95 }}
            animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
            exit={{ opacity: 0, filter: 'blur(10px)', scale: 1.05 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-md bg-[#141414] rounded-[24px] flex flex-col overflow-hidden"
          >
            <div className="m-1 rounded-[20px] bg-black h-[260px] relative overflow-hidden flex items-center justify-center border border-white/5">
              <SuccessAnimation />
            </div>
            <div className="p-6 text-center text-zinc-500 text-[15px]">
              Thanks for helping us improve.
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
