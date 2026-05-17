'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  ArrowRight01Icon,
  Cancel01Icon,
  ClipboardIcon,
  CloudUploadIcon,
  File01Icon,
  FileZipIcon,
  SparklesIcon,
  Tick01Icon,
} from '@hugeicons/core-free-icons';

type IconProps = { size?: number | string; className?: string; strokeWidth?: number };
const Sparkles = ({ size = 24, className, strokeWidth = 1.5 }: IconProps) => <HugeiconsIcon icon={SparklesIcon} size={size} className={className} strokeWidth={strokeWidth} />;
const Clipboard = ({ size = 24, className, strokeWidth = 1.5 }: IconProps) => <HugeiconsIcon icon={ClipboardIcon} size={size} className={className} strokeWidth={strokeWidth} />;
const UploadCloud = ({ size = 24, className, strokeWidth = 1.5 }: IconProps) => <HugeiconsIcon icon={CloudUploadIcon} size={size} className={className} strokeWidth={strokeWidth} />;
const FileText = ({ size = 24, className, strokeWidth = 1.5 }: IconProps) => <HugeiconsIcon icon={File01Icon} size={size} className={className} strokeWidth={strokeWidth} />;
const FileArchive = ({ size = 24, className, strokeWidth = 1.5 }: IconProps) => <HugeiconsIcon icon={FileZipIcon} size={size} className={className} strokeWidth={strokeWidth} />;
const ArrowRight = ({ size = 24, className, strokeWidth = 1.5 }: IconProps) => <HugeiconsIcon icon={ArrowRight01Icon} size={size} className={className} strokeWidth={strokeWidth} />;
const Check = ({ size = 24, className, strokeWidth = 1.5 }: IconProps) => <HugeiconsIcon icon={Tick01Icon} size={size} className={className} strokeWidth={strokeWidth} />;
const X = ({ size = 24, className, strokeWidth = 1.5 }: IconProps) => <HugeiconsIcon icon={Cancel01Icon} size={size} className={className} strokeWidth={strokeWidth} />;

const IntroAnimation = () => {
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
            <linearGradient id="piSparkleGradient" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
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
            fill="url(#piSparkleGradient)"
            transform="translate(0 -2)"
          />
        </svg>
      </motion.div>

      {/* Hello */}
      <motion.div
        initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
        animate={{ opacity: [0, 1, 1, 0], y: [20, 0, 0, -20], filter: ['blur(10px)', 'blur(0px)', 'blur(0px)', 'blur(10px)'] }}
        transition={{ duration: 1.5, delay: 1.5, times: [0, 0.3, 0.7, 1], ease: "easeInOut", repeat: Infinity, repeatDelay: 3.5 }}
        className="absolute text-2xl font-medium tracking-tight text-white"
      >
        hello
      </motion.div>

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
        animate={{ opacity: [0, 1, 1, 0], y: [20, 0, 0, -20], filter: ['blur(10px)', 'blur(0px)', 'blur(0px)', 'blur(10px)'] }}
        transition={{ duration: 1.5, delay: 3.0, times: [0, 0.3, 0.7, 1], ease: "easeInOut", repeat: Infinity, repeatDelay: 3.5 }}
        className="absolute text-xl font-medium tracking-tight text-white whitespace-nowrap"
      >
        Personal Intelligence
      </motion.div>
    </div>
  );
};

const SuccessAnimation = () => {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.5, filter: 'blur(10px)' }}
        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="absolute text-xl font-medium tracking-tight text-white text-center px-4 leading-tight"
      >
        Personal Intelligence <br /> Activated
      </motion.div>
    </div>
  );
};

export function PersonalIntelligenceModal({ isOpen, setIsOpen, onComplete }: { isOpen: boolean, setIsOpen: (v: boolean) => void, onComplete: () => void }) {
  const [step, setStep] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const t = setTimeout(() => setStep(0), 0);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  const close = () => {
    setIsOpen(false);
  };

  const handleFinish = () => {
    onComplete();
    close();
  };

  const copyPromptText = `You are my personalized AI coding assistant. I want you to analyze my previous project files, my communication style, and my aesthetic preferences to create a deeply tailored MEMORY.md file. 

The MEMORY.md file MUST strictly document:
1. Tech Stack: (e.g. Next.js App Router, Tailwind v4, Lucide React).
2. UI/UX Rules: Clean, brutalist, flat design. Strictly NO glows, NO gradients, NO shadows.
3. Code Formatting: Exact spacing, component patterns, and precise color mapping.
4. Interaction: Solid state changes, no soft hover effects.

Create this file entirely structured around these rigid design bounds so that every future instruction adheres perfectly to my workflow.`;

  const handleCopy = () => {
    navigator.clipboard.writeText(copyPromptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#070707]/90 backdrop-blur-md">
          <button onClick={close} className="absolute top-6 right-6 text-zinc-500 hover:text-zinc-300 transition-colors z-50">
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
            className="w-full max-w-md bg-[#141414] rounded-[24px] flex flex-col overflow-hidden"
          >
            {/* Visual Container */}
            <div className="m-1 rounded-[20px] bg-black h-[220px] relative overflow-hidden flex items-center justify-center">
              <IntroAnimation />
            </div>
            {/* Details */}
            <div className="p-8 flex flex-col gap-4 text-center">
              <div className="text-zinc-500 text-[15px] leading-relaxed">
                Connect your memory, write a short story, and upload chat history to teach the AI what you like. Build an agent tailored to you.
              </div>
              <div className="mt-4 flex justify-center gap-4">
                <button
                  onClick={close}
                  className="px-6 py-3 rounded-full text-zinc-500 hover:text-zinc-300 text-sm font-medium transition-colors"
                >
                  Skip
                </button>
                <button
                  onClick={() => setStep(1)}
                  className="bg-[#2a2a2a] hover:bg-[#383838] px-8 py-3 rounded-full text-zinc-200 text-sm font-medium transition-colors flex items-center justify-center border border-transparent"
                >
                  Activate
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
            className="w-full max-w-lg bg-[#141414] rounded-[24px] p-1 flex flex-col gap-1 overflow-hidden"
          >
            {/* Prompt Card */}
            <div className="bg-[#1c1c1c] rounded-[20px] p-6 relative flex flex-col gap-4 h-64 overflow-hidden">
              <div className="flex items-start justify-between gap-4">
                <div className="flex flex-col">
                  <h3 className="text-zinc-200 font-medium text-base tracking-tight mb-1">Import Memory</h3>
                  <p className="text-[13px] text-zinc-500 leading-relaxed max-w-[280px]">Run this prompt in your AI assistant to generate a personalized MEMORY.md file, then drop it below.</p>
                </div>
                <button
                  onClick={handleCopy}
                  className="bg-[#2a2a2a] hover:bg-[#383838] px-4 py-2 rounded-full text-xs font-medium text-zinc-300 transition-colors flex items-center gap-1.5 shrink-0"
                >
                  {copied ? <Check size={14} /> : <Clipboard size={14} />} {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
              <div className="flex-1 overflow-y-auto pr-2 text-[13px] text-zinc-400 leading-relaxed font-mono whitespace-pre-wrap select-all focus:outline-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {copyPromptText}
              </div>
            </div>

            {/* Upload Memory Card */}
            <div className="bg-gradient-to-b from-[#0a0a0a] to-black rounded-[20px] p-6 flex flex-col items-center justify-center h-[160px] relative">
              <div className="flex items-center justify-center gap-6 text-zinc-600 mb-4 w-full relative z-10 pointer-events-none">
                <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}><Clipboard size={22} /></motion.div>
                <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 2, delay: 0.2, ease: "easeInOut" }}><UploadCloud size={22} /></motion.div>
                <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 2, delay: 0.4, ease: "easeInOut" }}><FileText size={22} /></motion.div>
              </div>
              <div className="text-sm text-zinc-500 font-medium z-10 pointer-events-none">Paste, drop, or upload MEMORY.md</div>
              <input type="file" className="absolute inset-0 opacity-0 cursor-pointer z-20" onChange={() => setStep(2)} />
            </div>
            
            <div className="flex justify-start px-4 py-2">
              <button onClick={() => setStep(2)} className="text-zinc-500 hover:text-zinc-300 text-[13px] font-medium transition-colors">Skip step</button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, filter: 'blur(10px)', scale: 0.95 }}
            animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
            exit={{ opacity: 0, filter: 'blur(10px)', scale: 1.05 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-lg bg-[#141414] rounded-[24px] p-1 flex flex-col"
          >
            <div className="p-6 bg-[#1c1c1c] rounded-[20px] flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <h3 className="text-zinc-200 font-medium tracking-tight text-base">Writing Style</h3>
                <p className="text-[13px] text-zinc-500">Write a short story or snippet to teach the AI your tone and phrasing.</p>
              </div>
              <textarea
                className="w-full h-36 bg-[#141414] rounded-xl p-4 text-[13px] text-zinc-300 placeholder:text-zinc-600 focus:outline-none resize-none font-mono"
                placeholder="Once upon a time in a clean, shadowless interface..."
              />
              <div className="flex justify-between items-center mt-2">
                <button onClick={() => setStep(3)} className="text-zinc-500 hover:text-zinc-300 text-[13px] font-medium transition-colors px-2">Skip step</button>
                <button onClick={() => setStep(3)} className="bg-[#2a2a2a] hover:bg-[#383838] px-6 py-2.5 rounded-full text-zinc-200 text-sm font-medium transition-colors flex items-center gap-2">
                  Continue <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, filter: 'blur(10px)', scale: 0.95 }}
            animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
            exit={{ opacity: 0, filter: 'blur(10px)', scale: 1.05 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-lg bg-[#141414] rounded-[24px] p-1 flex flex-col gap-1 overflow-hidden"
          >
            <div className="bg-[#1c1c1c] rounded-[20px] p-8 flex flex-col items-center justify-center text-center gap-6 h-[300px] relative">
              <div className="w-16 h-16 rounded-full bg-[#141414] flex items-center justify-center text-zinc-500 mb-2">
                <FileArchive size={32} />
              </div>
              <div>
                <h3 className="text-zinc-200 font-medium tracking-tight text-base">Import Chat History</h3>
                <p className="text-[13px] text-zinc-500 mt-2 max-w-[260px] mx-auto">Upload your past AI chat logs (.zip) to train your agent on your historical preferences.</p>
              </div>
              <button className="bg-[#2a2a2a] hover:bg-[#383838] px-8 py-3 rounded-full text-zinc-200 text-sm font-medium transition-colors relative z-10">
                Select ZIP File
              </button>
              <input type="file" accept=".zip" className="absolute top-0 left-0 w-full h-[85%] opacity-0 cursor-pointer z-20" onChange={() => setStep(4)} />
              
              <div className="absolute bottom-0 left-0 w-full flex justify-center pb-6 z-30">
                <button onClick={() => setStep(4)} className="text-zinc-500 hover:text-zinc-300 text-[13px] font-medium transition-colors">Skip step</button>
              </div>
            </div>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, filter: 'blur(10px)', scale: 0.95 }}
            animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
            exit={{ opacity: 0, filter: 'blur(10px)', scale: 1.05 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-md bg-[#141414] rounded-[24px] flex flex-col overflow-hidden"
          >
            <div className="m-1 rounded-[20px] bg-black h-[220px] relative overflow-hidden flex items-center justify-center">
              <SuccessAnimation />
            </div>
            <div className="p-8 flex flex-col gap-4 text-center">
              <div className="text-zinc-500 text-[15px] leading-relaxed">
                You&apos;re all set. Start building perfectly synced UI components with an AI that knows exactly what you mean.
              </div>
              <div className="mt-4 flex justify-center">
                <button
                  onClick={handleFinish}
                  className="bg-[#2a2a2a] hover:bg-[#383838] px-8 py-3 rounded-full text-zinc-200 text-sm font-medium transition-colors flex items-center justify-center border border-transparent"
                >
                  Get Started
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
        </div>
      )}
    </>
  );
}
