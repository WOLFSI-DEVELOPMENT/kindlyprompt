'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Copy,
  RefreshCw,
  X,
  ArrowUp,
  Check,
  ArrowUpRight,
  Download,
  Sparkles,
  Plus,
  History,
  Library,
  ExternalLink,
  Edit3,
  Wrench,
  Save,
  MessageSquare,
  Eye,
  Mic,
  Square,
  ChevronDown,
  Image as ImageIcon,
  Link,
  Paintbrush,
  Zap
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { GoogleGenAI, Type } from '@google/genai';
import { SuggestToolModal } from '@/components/suggest-modal';
import { AuthModal } from '@/components/auth-modal';
import { PersonalIntelligenceModal } from '@/components/pi-modal';
import { OnboardingModal } from '@/components/onboarding-modal';
import { UpgradeModal } from '@/components/upgrade-modal';

import { SKILL_CREATOR_GUIDELINES } from '@/lib/skill-guidelines';

export default function Home() {
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState('');
  const [view, setView] = useState<'home' | 'result' | 'recents' | 'edit' | 'library'>('home');
  const [copied, setCopied] = useState(false);
  const [libraryCopiedIdx, setLibraryCopiedIdx] = useState<number | null>(null);
  const [selectedTool, setSelectedTool] = useState<'prompt' | 'design' | 'skill'>('prompt');
  const [recentsFilter, setRecentsFilter] = useState<'prompt' | 'design' | 'skill'>('prompt');
  const [isSuggestModalOpen, setIsSuggestModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [isPlus, setIsPlus] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [user, setUser] = useState<{ email: string, name: string, image?: string } | null>(null);
  const [isUserLoaded, setIsUserLoaded] = useState(false);
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [isApiKeyLoaded, setIsApiKeyLoaded] = useState(false);
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('success') === 'true') {
        const timeout = setTimeout(() => {
          setIsPlus(true);
          setShowSuccessModal(true);
        }, 0);
        localStorage.setItem('hasPlus', 'true');
        // Remove param from url
        const newUrl = window.location.pathname;
        window.history.replaceState({}, '', newUrl);
        
        setTimeout(() => setShowSuccessModal(false), 3000);
        return () => clearTimeout(timeout);
      } else {
        const hasPlus = localStorage.getItem('hasPlus') === 'true';
        const timeout = setTimeout(() => setIsPlus(hasPlus), 0);
        return () => clearTimeout(timeout);
      }
    }
  }, []);

  const [isPiModalOpen, setIsPiModalOpen] = useState(false);
  const [isPiCardVisible, setIsPiCardVisible] = useState(false);
  const [isOnboardingModalOpen, setIsOnboardingModalOpen] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
      const piActive = localStorage.getItem('piActive');
      
      if (!hasSeenOnboarding) {
        setIsOnboardingModalOpen(true);
      }
      if (piActive !== 'true') {
        setIsPiCardVisible(true);
      }
    }, 0);
  }, []);

  const handlePiComplete = () => {
    localStorage.setItem('piActive', 'true');
    localStorage.setItem('hasSeenPI', 'true');
    setIsPiCardVisible(false);
  };
  
  const [recents, setRecents] = useState<Array<{ title: string, prompt: string, svg: string, type?: 'prompt' | 'design' | 'skill' }>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('kindly_prompt_recents');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error('Failed to load recents', e);
          return [];
        }
      }
    }
    return [];
  });
  const [currentResult, setCurrentResult] = useState<{ title: string, prompt: string, svg: string, type?: 'prompt' | 'design' | 'skill' } | null>(null);
  const [imageRef, setImageRef] = useState<string | null>(null);
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);

  const handleImageUpload = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setImageRef(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageUpload(e.dataTransfer.files[0]);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    if (e.clipboardData.items) {
      for (let i = 0; i < e.clipboardData.items.length; i++) {
        if (e.clipboardData.items[i].type.indexOf("image") !== -1) {
          const file = e.clipboardData.items[i].getAsFile();
          if (file) handleImageUpload(file);
        }
      }
    }
  };

  // Save recents to localStorage
  useEffect(() => {
    localStorage.setItem('kindly_prompt_recents', JSON.stringify(recents));
  }, [recents]);

  // Load user from localStorage
  useEffect(() => {
    const timeout = setTimeout(() => {
      const savedUser = localStorage.getItem('kindly_prompt_user');
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch(e) {}
      }
      setIsUserLoaded(true);
    }, 0);
    return () => clearTimeout(timeout);
  }, []);

  // Save user to localStorage
  useEffect(() => {
    if (!isUserLoaded) return;
    if (user) {
      localStorage.setItem('kindly_prompt_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('kindly_prompt_user');
    }
  }, [user, isUserLoaded]);

  // Load and Save API Key
  useEffect(() => {
    const timeout = setTimeout(() => {
      const savedKey = localStorage.getItem('kindly_gemini_api_key');
      if (savedKey) setGeminiApiKey(savedKey);
      setIsApiKeyLoaded(true);
    }, 0);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (!isApiKeyLoaded) return;
    if (geminiApiKey) {
      localStorage.setItem('kindly_gemini_api_key', geminiApiKey);
    } else {
      localStorage.removeItem('kindly_gemini_api_key');
    }
  }, [geminiApiKey, isApiKeyLoaded]);

  const [chatHistory, setChatHistory] = useState<Array<{role: 'user'|'model', text: string}>>([]);
  const [refineInput, setRefineInput] = useState('');
  const [isEditingRaw, setIsEditingRaw] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [aiGreeting, setAiGreeting] = useState<string | null>(null);

  const refinePrompt = useCallback(async (instruction: string, isVoice = false) => {
    if (!instruction.trim()) return;
    
    setChatHistory(prev => [...prev, { role: 'user', text: instruction }]);
    setRefineInput('');
    setIsGenerating(true);
    
    try {
      const ai = new GoogleGenAI({ apiKey: geminiApiKey || process.env.NEXT_PUBLIC_GEMINI_API_KEY });
      const streamResponse = await ai.models.generateContentStream({
          model: isVoice ? 'gemini-3.1-flash-live-preview' : 'gemini-3.1-flash-lite',
          contents: [
              { role: 'user', parts: [{ text: `Here is the current prompt I am generating:\n\n${result}\n\nPlease update it according to this instruction: ${instruction}\n\nProvide the updated full prompt string. Do not include markdown \`\`\` blocks around your answer.` }]}
          ],
          config: isVoice ? {
            responseModalities: ["AUDIO" as any]
          } : undefined
      });
      
      let fullText = "";
      for await (const chunk of streamResponse) {
        let chunkText = chunk.text || "";
        if (chunkText.startsWith('```markdown')) chunkText = chunkText.replace(/^```markdown\n?/, '').replace(/\n?```$/, '');
        else if (chunkText.startsWith('```')) chunkText = chunkText.replace(/^```\n?/, '').replace(/\n?```$/, '');
        
        fullText += chunkText;
        setResult(fullText.trim());
      }
      
      setChatHistory(prev => [...prev, { role: 'model', text: 'Prompt updated.' }]);
    } catch(e) {
      console.error(e);
      setChatHistory(prev => [...prev, { role: 'model', text: 'Sorry, an error occurred.' }]);
    } finally {
      setIsGenerating(false);
    }
  }, [result, geminiApiKey]);

  const toggleListening = () => {
    const nextListening = !isListening;
    setIsListening(nextListening);
    if (nextListening) {
      const greetings = [
        "Hey! What would you like to tweak?",
        "I'm listening... How can I improve this?",
        "What changes should we make to the prompt?",
        "Ready to refine. Tell me what's on your mind!"
      ];
      setAiGreeting(greetings[Math.floor(Math.random() * greetings.length)]);
    } else {
      // If stopping, trigger if there was input
      if (refineInput.trim()) {
        refinePrompt(refineInput, true);
      }
      setAiGreeting(null);
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isListening && refineInput.trim().length > 5) {
      timer = setTimeout(() => {
        refinePrompt(refineInput, true);
        setIsListening(false);
      }, 2000); // 2 seconds of "silence" (no typing) triggers it
    }
    return () => clearTimeout(timer);
  }, [refineInput, isListening, refinePrompt]);

  const downloadPromptFile = () => {
    if (!currentResult) return;
    const blob = new Blob([currentResult.prompt], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    
    let filename = 'PROMPT.md';
    if (currentResult.type === 'design') filename = 'DESIGN.md';
    if (currentResult.type === 'skill') filename = 'SKILL.md';
    
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const aiStudioUrl = `https://aistudio.google.com/apps#prompt=${encodeURIComponent(result)}`;
  const lovableUrl = `https://lovable.dev/?autosubmit=true#prompt=${encodeURIComponent(result)}`;
  const chatGptUrl = `https://chatgpt.com/?q=${encodeURIComponent(result)}`;
  const claudeUrl = `https://claude.ai/new?q=${encodeURIComponent(result)}`;

  const generatePrompt = async (text: string, image: string | null = null) => {
    if (!text.trim() && !image) return;
    setIsGenerating(true);
    setView('result');
    try {
      const ai = new GoogleGenAI({ apiKey: geminiApiKey || process.env.NEXT_PUBLIC_GEMINI_API_KEY });
      
      let contentsObj: any = text;
      if (image) {
        const base64Data = image.split(',')[1];
        const mimeType = image.split(';')[0].split(':')[1];
        contentsObj = [{
          role: 'user',
          parts: [
            { text: text.trim() ? text : "Turn this image into a UI prompt." },
            { inlineData: { data: base64Data, mimeType } }
          ]
        }];
      }

      let systemInstruction = '';
      let promptDescription = '';
      if (selectedTool === 'prompt') {
        systemInstruction = `You are an expert prompt engineer and UI designer for "vibe coders". 
Your task is to take a basic user prompt for an app or website and turn it into a next-level, highly detailed prompt.

Requirements for the generated prompt:
1. It MUST explicitly specify exact spacing (using Tailwind scales like p-4, m-8), layout structures, theme colors (hex codes or Tailwind palette), features, typography and vibe.
2. It MUST explicitly BAN glows, gradients, and shadows. Add clear instructions to the AI interpreting the prompt like "Do not use glows", "No gradients", "Strictly no drop shadows or box shadows".
3. Use a brutalist, clean, flat, or minimal solid aesthetic approach in the description by default, unless the user specifies a different vibe.
4. Include detailed instructions for individual interactive elements to have clear, solid state changes (e.g. solid color background changes for hover).`;
        promptDescription = 'The advanced prompt ready to be copy-pasted.';
      } else if (selectedTool === 'design') {
        systemInstruction = `You are an expert design documenter. Your task is to take a basic user prompt and turn it into a highly detailed DESIGN.md file content.
        
Requirements for the generated DESIGN.md:
1. Structure it nicely with markdown headings (e.g., # App Design, ## Typography, ## Colors, etc.).
2. Detail the exact color palette, typography choices, and spacing guidelines.
3. Describe the layout structure and interaction patterns.
4. Output ONLY the markdown text.`;
        promptDescription = 'The advanced DESIGN.md file content ready to be copy-pasted.';
      } else if (selectedTool === 'skill') {
        systemInstruction = `You are an AI assistant specialized in writing agent skills. Your task is to take a basic user prompt and turn it into a highly detailed SKILL.md file content. Read these guidelines carefully before generating the skill:

<skill-creator-guidelines>
${SKILL_CREATOR_GUIDELINES}
</skill-creator-guidelines>
        
Requirements for the generated SKILL.md:
1. Include YAML frontmatter with 'name' and 'description'.
2. Structure the skill instructions with clear headings.
3. Detail the exact steps, rules, and constraints the agent should follow when using this skill.
4. Output ONLY the markdown text.`;
        promptDescription = 'The advanced SKILL.md file content ready to be copy-pasted.';
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash',
        contents: contentsObj,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: 'A two or three word short title for this app idea.' },
              prompt: { type: Type.STRING, description: promptDescription },
              svg_icon: { type: Type.STRING, description: 'A functional SVG string (only the <svg> tag and contents). Use viewBox 0 0 48 48. Build a very simple geometric layout abstractly representing the app using <rect> or <circle> elements. Use exactly fill="#27272a" or clear stroke="#27272a". Never add width or height attributes to the root <svg>, only viewBox. Make it a clean flat icon.' }
            },
            required: ['title', 'prompt', 'svg_icon']
          },
          systemInstruction: systemInstruction,
        },
      });
      
      const responseText = response.text || '{}';
      try {
        const parsed = JSON.parse(responseText);
        const newItem = {
          title: parsed.title || 'Generated App',
          prompt: parsed.prompt || result || 'Failed to parse prompt.',
          svg: parsed.svg_icon || `<svg viewBox="0 0 48 48"><rect x="8" y="8" width="32" height="32" rx="4" fill="#27272a" /></svg>`,
          type: selectedTool
        };
        setCurrentResult(newItem);
        setRecents(prev => [newItem, ...prev]);
        setResult(newItem.prompt);
      } catch (err) {
        setResult(responseText);
      }
    } catch (e) {
      console.error(e);
      setResult('An error occurred while generating your prompt.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden bg-[#070707] text-white font-sans selection:bg-zinc-800 relative">
      {view !== 'edit' && (
        <div className="absolute top-6 left-6 z-50">
          <a href="/" className="block hover:opacity-80 transition-opacity">
            <img src="https://i.ibb.co/WL4x4zC/AI-text-generation-app-icon-202605140740-modified.png" alt="Kindly Prompt Logo" className="w-[38px] h-[38px] rounded-xl shadow-xl border border-white/10" />
          </a>
        </div>
      )}
      <div className="absolute top-6 right-6 z-50">
        <AnimatePresence mode="wait">
          {user ? (
            showApiKeyInput ? (
              <motion.div
                key="api-input"
                initial={{ opacity: 0, scale: 0.9, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9, x: -20 }}
                className="bg-[#1f1f1f] flex items-center p-1 rounded-full shadow-[0_0_20px_rgba(0,0,0,0.4)] border border-white/5 overflow-hidden"
              >
                <input
                  type="password"
                  placeholder="Gemini API Key..."
                  value={geminiApiKey}
                  onChange={(e) => setGeminiApiKey(e.target.value)}
                  className="bg-transparent text-sm text-zinc-200 outline-none px-4 w-48 placeholder:text-zinc-600"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') setShowApiKeyInput(false);
                  }}
                />
                <button
                  onClick={() => setShowApiKeyInput(false)}
                  className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-white transition-colors"
                >
                  <Check size={14} />
                </button>
              </motion.div>
            ) : (
              <motion.div 
                key="user-profile"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, x: 20 }}
                className="bg-[#1f1f1f] rounded-full relative overflow-hidden group shadow-lg border-none"
              >
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-red-500 font-bold text-[11px] tracking-wider pointer-events-none">
                  LOGOUT
                </div>
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 text-blue-500 font-bold text-[11px] tracking-wider pointer-events-none">
                  API KEY
                </div>
                <motion.div 
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={{ left: 0.6, right: 0.6 }}
                  onDragEnd={(e, info) => {
                    if (info.offset.x < -60 || info.velocity.x < -400) {
                      setShowApiKeyInput(true);
                    } else if (info.offset.x > 60 || info.velocity.x > 400) {
                      setUser(null);
                    }
                  }}
                  whileTap={{ scale: 0.98, cursor: 'grabbing' }}
                  className="bg-[#2a2a2a] text-zinc-300 text-sm font-medium px-1.5 py-1.5 pr-6 rounded-full flex items-center gap-3 cursor-grab relative z-10 touch-pan-y shadow-[0_0_15px_rgba(0,0,0,0.5)]"
                  transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
                >
                  <div className="w-8 h-8 rounded-full bg-[#1c1c1c] overflow-hidden flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-inner">
                    {user.image ? (
                      <img src={user.image} alt={user.name} className="w-full h-full object-cover pointer-events-none" />
                    ) : (
                      <span className="pointer-events-none">{user.name.charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  <div className="flex flex-col text-left pointer-events-none select-none">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[13px] leading-tight text-white font-medium">{user.name}</span>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )
          ) : (
            <motion.button 
              key="sign-in"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={() => setIsAuthModalOpen(true)}
              className="bg-[#1c1c1c] hover:bg-[#2a2a2a] text-zinc-300 text-sm font-medium px-5 py-2.5 rounded-full transition-colors border border-transparent shadow-lg"
            >
              Sign In
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Centered Top Nav Bar */}
      <AnimatePresence>
        {view !== 'edit' && (
          <div className="fixed top-6 left-0 right-0 z-50 pointer-events-none flex justify-center">
            <motion.div 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              drag="x"
              dragConstraints={{ left: -20, right: 20 }}
              dragElastic={0.2}
              dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
              whileDrag={{ scale: 1.02, cursor: 'grabbing' }}
              onDragEnd={(_, info) => {
                const threshold = 30;
                const velocityThreshold = 200;
                if ((info.offset.x < -threshold || info.velocity.x < -velocityThreshold)) {
                  if (view === 'home' || view === 'result') setView('recents');
                  else if (view === 'recents') setView('library');
                } else if ((info.offset.x > threshold || info.velocity.x > velocityThreshold)) {
                  if (view === 'library') setView('recents');
                  else if (view === 'recents') setView('home');
                }
              }}
              className="pointer-events-auto flex items-center bg-[#0a0a0a]/60 backdrop-blur-xl border border-white/5 rounded-full p-1.5 shadow-2xl cursor-grab touch-none select-none"
            >
              <div className="flex items-center gap-1">
                <motion.button 
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setView('home')}
                  className="relative px-4 py-1.5 rounded-full text-xs font-semibold flex items-center gap-2 outline-none group"
                >
                  {(view === 'home' || view === 'result') && (
                    <motion.div 
                      layoutId="active-nav-bg"
                      className="absolute inset-0 bg-[#1c1c1c] shadow-lg rounded-full"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <Plus size={14} className={`relative z-10 transition-colors ${view === 'home' || view === 'result' ? 'text-white' : 'text-zinc-500 group-hover:text-zinc-300'}`} />
                  <span className={`relative z-10 transition-colors ${view === 'home' || view === 'result' ? 'text-white' : 'text-zinc-500 group-hover:text-zinc-300'}`}>GENERATE</span>
                </motion.button>
                <motion.button 
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setView('recents')}
                  className="relative px-4 py-1.5 rounded-full text-xs font-semibold flex items-center gap-2 outline-none group"
                >
                  {view === 'recents' && (
                    <motion.div 
                      layoutId="active-nav-bg"
                      className="absolute inset-0 bg-[#1c1c1c] shadow-lg rounded-full"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <History size={14} className={`relative z-10 transition-colors ${view === 'recents' ? 'text-white' : 'text-zinc-500 group-hover:text-zinc-300'}`} />
                  <span className={`relative z-10 transition-colors ${view === 'recents' ? 'text-white' : 'text-zinc-500 group-hover:text-zinc-300'}`}>HISTORY</span>
                </motion.button>
                <motion.button 
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setView('library')}
                  className="relative px-4 py-1.5 rounded-full text-xs font-semibold flex items-center gap-2 outline-none group"
                >
                  {view === 'library' && (
                    <motion.div 
                      layoutId="active-nav-bg"
                      className="absolute inset-0 bg-[#1c1c1c] shadow-lg rounded-full"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <Library size={14} className={`relative z-10 transition-colors ${view === 'library' ? 'text-white' : 'text-zinc-500 group-hover:text-zinc-300'}`} />
                  <span className={`relative z-10 transition-colors ${view === 'library' ? 'text-white' : 'text-zinc-500 group-hover:text-zinc-300'}`}>LIBRARY</span>
                </motion.button>
              </div>
              
              <div className="w-[1px] h-4 bg-white/10 mx-2" />
              
              <div className="flex items-center gap-2 px-3 text-zinc-500 select-none">
                 <span className="text-[10px] font-mono tracking-tighter uppercase opacity-50">
                    {selectedTool === 'prompt' ? 'Kindly Prompt' : selectedTool === 'design' ? 'Kindly Design' : 'Kindly Skill'}
                 </span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      {/* AI Glow Border Effect */}
      <AnimatePresence>
        {isGenerating && view === 'edit' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 pointer-events-none z-[60]"
          >
            <div className="absolute inset-0 border-[4px] border-blue-800/60 rounded-none shadow-[inset_0_0_150px_rgba(30,58,138,0.6)]" />
            <motion.div 
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.6, 0.9, 0.6],
                x: [0, 50, -50, 0],
                y: [0, -30, 30, 0]
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-20 -left-20 w-96 h-96 bg-blue-900/80 rounded-full blur-[120px]" 
            />
            <motion.div 
              animate={{ 
                scale: [1.2, 1, 1.2],
                opacity: [0.7, 0.5, 0.7],
                x: [0, -60, 60, 0],
                y: [0, 40, -40, 0]
              }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-20 -right-20 w-[30rem] h-[30rem] bg-blue-800/60 rounded-full blur-[120px]" 
            />
          </motion.div>
        )}
      </AnimatePresence>
      
      <main className="flex-1 relative overflow-y-auto h-full flex flex-col pt-16">

      {view === 'home' ? (
        // HOME VIEW
        <div className="max-w-4xl mx-auto px-4 pt-24 pb-16 flex flex-col items-center min-h-[80vh] justify-center">
          <h1 className="text-3xl md:text-4xl font-medium tracking-tight mb-8">
            {selectedTool === 'prompt' ? 'What do you want to prompt?' : selectedTool === 'design' ? 'What do you want to design?' : 'What do you want to build a skill for?'}
          </h1>

          {/* Input Box */}
          <div className="flex flex-col items-center w-full max-w-2xl relative">
            <div 
              className={`bg-[#1c1c1c] rounded-xl flex flex-col transition-all border border-transparent focus-within:border-zinc-700/50 shadow-sm w-full relative z-10`}
              style={{ boxSizing: 'border-box', minHeight: '100px' }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
            >
              {imageRef && (
                <div className="absolute top-3 left-4 w-16 h-9 rounded-full overflow-hidden shrink-0 border border-zinc-700/50 shadow-sm z-10 group">
                  <img src={imageRef} alt="Reference" className="w-full h-full object-cover" />
                  <button 
                    onClick={() => setImageRef(null)} 
                    className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                  >
                    <X size={14} className="text-white" />
                  </button>
                </div>
              )}
              <div className="flex-1 flex px-4 pt-4 pb-12 relative w-full">
                <textarea
                  className={`w-full bg-transparent outline-none resize-none placeholder:text-zinc-500 text-zinc-100 placeholder:select-none text-base custom-scrollbar ${imageRef ? 'mt-8' : ''}`}
                  style={{ boxSizing: 'border-box', paddingRight: '40px', minHeight: '60px' }}
                  placeholder={selectedTool === 'prompt' ? "Describe your app or vibe, or paste an image..." : selectedTool === 'design' ? "Describe your design needs, or paste an image..." : "Describe the agent skill you need..."}
                  value={input}
                  onPaste={handlePaste}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      generatePrompt(input, imageRef);
                    }
                  }}
                />
              </div>
              
              <div className="absolute bottom-[5px] left-[5px] flex items-end">
                 <input 
                   type="file" 
                   accept="image/*" 
                   id="image-upload" 
                   className="hidden" 
                   onChange={(e) => {
                     if (e.target.files && e.target.files[0]) {
                       handleImageUpload(e.target.files[0]);
                       setIsAddMenuOpen(false);
                     }
                     e.target.value = '';
                   }}
                 />
                 <button 
                   onClick={() => setIsAddMenuOpen(!isAddMenuOpen)}
                   className={`text-zinc-500 hover:text-zinc-300 p-2 cursor-pointer flex items-center justify-center rounded-full transition-colors hover:bg-[#2a2a2a] ${isAddMenuOpen ? 'bg-[#2a2a2a] text-zinc-300' : ''}`} 
                   title="Add context"
                 >
                   <Plus size={18} className={`transition-transform duration-200 ${isAddMenuOpen ? 'rotate-45' : ''}`} />
                 </button>

                 <AnimatePresence>
                   {isAddMenuOpen && (
                     <motion.div 
                       initial={{ opacity: 0, y: 10, scale: 0.95 }}
                       animate={{ opacity: 1, y: 0, scale: 1 }}
                       exit={{ opacity: 0, y: 10, scale: 0.95 }}
                       transition={{ duration: 0.15 }}
                       className="absolute bottom-12 left-0 w-48 bg-[#1c1c1c]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-1 shadow-2xl flex flex-col z-50 overflow-hidden"
                     >
                       <div className="flex flex-col gap-0.5 mb-1 text-sm font-medium">
                         <label onClick={(e) => { if(!user) { e.preventDefault(); setIsAuthModalOpen(true); } }} htmlFor={user ? "image-upload" : undefined} className="w-full text-left px-3 py-2 flex items-center gap-2 rounded-full text-zinc-300 hover:bg-[#2a2a2a] hover:text-white transition-colors cursor-pointer group">
                           <ImageIcon size={16} className="text-zinc-500 group-hover:text-blue-400 transition-colors" />
                           Upload Image
                         </label>
                         <button className="w-full text-left px-3 py-2 flex items-center gap-2 rounded-full text-zinc-300 hover:bg-[#2a2a2a] hover:text-white transition-colors group cursor-not-allowed opacity-70">
                           <Link size={16} className="text-zinc-500 transition-colors" />
                           Add URL
                         </button>
                       </div>
                       <div className="h-px bg-white/5 mx-2 my-1" />
                       <div className="flex flex-col gap-0.5 mt-1 text-sm font-medium">
                         <button onClick={() => { setSelectedTool('prompt'); setIsAddMenuOpen(false); }} className={`w-full text-left px-3 py-2 flex items-center gap-2 rounded-full transition-colors group ${selectedTool === 'prompt' ? 'bg-[#2a2a2a] text-white' : 'text-zinc-300 hover:bg-[#1f1f1f]'}`}>
                           <MessageSquare size={16} className={`transition-colors ${selectedTool === 'prompt' ? 'text-white' : 'text-zinc-500 group-hover:text-zinc-400'}`} />
                           Prompt
                         </button>
                         <button onClick={() => { setSelectedTool('design'); setIsAddMenuOpen(false); }} className={`w-full text-left px-3 py-2 flex items-center gap-2 rounded-full transition-colors group ${selectedTool === 'design' ? 'bg-[#2a2a2a] text-white' : 'text-zinc-300 hover:bg-[#1f1f1f]'}`}>
                           <Paintbrush size={16} className={`transition-colors ${selectedTool === 'design' ? 'text-white' : 'text-zinc-500 group-hover:text-zinc-400'}`} />
                           Design
                         </button>
                         <button onClick={() => { setSelectedTool('skill'); setIsAddMenuOpen(false); }} className={`w-full text-left px-3 py-2 flex items-center gap-2 rounded-full transition-colors group ${selectedTool === 'skill' ? 'bg-[#2a2a2a] text-white' : 'text-zinc-300 hover:bg-[#1f1f1f]'}`}>
                           <Zap size={16} className={`transition-colors ${selectedTool === 'skill' ? 'text-white' : 'text-zinc-500 group-hover:text-zinc-400'}`} />
                           Skill
                         </button>
                       </div>
                     </motion.div>
                   )}
                 </AnimatePresence>
              </div>

              <button
                onClick={() => generatePrompt(input, imageRef)}
                disabled={!input.trim() && !imageRef}
                className="bg-[#2a2a2a] hover:bg-[#383838] p-2 text-zinc-300 disabled:opacity-50 disabled:bg-[#1a1a1a] disabled:text-zinc-700 rounded-full transition-colors flex items-center justify-center border border-transparent disabled:border-zinc-800"
                style={{ position: 'absolute', bottom: '5px', right: '5px' }}
              >
                <ArrowUp size={18} />
              </button>
            </div>
            {isPiCardVisible && (
              <div className="w-full h-[42px] bg-[#1a1a1a]/80 backdrop-blur-md rounded-b-2xl flex items-center justify-between px-4 z-0 shadow-lg border border-t-0 border-white/5 -mt-[7px] pt-[7px] relative">
                <span className="text-[11px] font-medium tracking-wide text-zinc-400 capitalize">Activate personal intelligence</span>
                <button onClick={() => { setIsPiModalOpen(true); localStorage.setItem('hasSeenPI', 'true'); }} className="bg-[#2a2a2a] text-zinc-300 px-4 h-[24px] rounded-full text-[10px] hover:bg-[#383838] transition-colors border-none outline-none flex items-center justify-center font-medium shadow-sm">
                  Activate
                </button>
              </div>
            )}
          </div>

          {/* Export Targets */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-6 w-full max-w-2xl">
            <span className="text-zinc-500 text-sm mr-2 hidden sm:block">Works with:</span>
            
            <div className="bg-[#141414] hover:bg-[#1a1a1a] cursor-pointer transition-colors rounded-full px-5 py-2.5 flex items-center gap-2">
              <svg width="18" height="18" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fillRule="evenodd" clipRule="evenodd" d="M151.083 0c83.413 0 151.061 67.819 151.061 151.467v57.6h50.283c83.413 0 151.082 67.797 151.082 151.466 0 83.691-67.626 151.467-151.082 151.467H0V151.467C0 67.84 67.627 0 151.083 0z" fill="url(#prefix__paint0_radial_5_27)"/><defs><radialGradient id="prefix__paint0_radial_5_27" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="rotate(92.545 118.724 174.844) scale(480.474 650.325)"><stop offset=".25" stopColor="#FE7B02"/><stop offset=".433" stopColor="#FE4230"/><stop offset=".548" stopColor="#FE529A"/><stop offset=".654" stopColor="#DD67EE"/><stop offset=".95" stopColor="#4B73FF"/></radialGradient></defs></svg>
              <span className="text-zinc-300 text-sm font-medium">Lovable</span>
            </div>

            <div className="bg-[#141414] hover:bg-[#1a1a1a] cursor-pointer transition-colors rounded-full px-5 py-2.5 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" shapeRendering="geometricPrecision" textRendering="geometricPrecision" imageRendering="optimizeQuality" fillRule="evenodd" clipRule="evenodd" viewBox="0 0 512 509.64"><path fill="#D77655" d="M115.612 0h280.775C459.974 0 512 52.026 512 115.612v278.415c0 63.587-52.026 115.612-115.613 115.612H115.612C52.026 509.639 0 457.614 0 394.027V115.612C0 52.026 52.026 0 115.612 0z"/><path fill="#FCF2EE" fillRule="nonzero" d="M142.27 316.619l73.655-41.326 1.238-3.589-1.238-1.996-3.589-.001-12.31-.759-42.084-1.138-36.498-1.516-35.361-1.896-8.897-1.895-8.34-10.995.859-5.484 7.482-5.03 10.717.935 23.683 1.617 35.537 2.452 25.782 1.517 38.193 3.968h6.064l.86-2.451-2.073-1.517-1.618-1.517-36.776-24.922-39.81-26.338-20.852-15.166-11.273-7.683-5.687-7.204-2.451-15.721 10.237-11.273 13.75.935 3.513.936 13.928 10.716 29.749 23.027 38.848 28.612 5.687 4.727 2.275-1.617.278-1.138-2.553-4.271-21.13-38.193-22.546-38.848-10.035-16.101-2.654-9.655c-.935-3.968-1.617-7.304-1.617-11.374l11.652-15.823 6.445-2.073 15.545 2.073 6.547 5.687 9.655 22.092 15.646 34.78 24.265 47.291 7.103 14.028 3.791 12.992 1.416 3.968 2.449-.001v-2.275l1.997-26.641 3.69-32.707 3.589-42.084 1.239-11.854 5.863-14.206 11.652-7.683 9.099 4.348 7.482 10.716-1.036 6.926-4.449 28.915-8.72 45.294-5.687 30.331h3.313l3.792-3.791 15.342-20.372 25.782-32.227 11.374-12.789 13.27-14.129 8.517-6.724 16.1-.001 11.854 17.617-5.307 18.199-16.581 21.029-13.75 17.819-19.716 26.54-12.309 21.231 1.138 1.694 2.932-.278 44.536-9.479 24.062-4.347 28.714-4.928 12.992 6.066 1.416 6.167-5.106 12.613-30.71 7.583-36.018 7.204-53.636 12.689-.657.48.758.935 24.164 2.275 10.337.556h25.301l47.114 3.514 12.309 8.139 7.381 9.959-1.238 7.583-18.957 9.655-25.579-6.066-59.702-14.205-20.474-5.106-2.83-.001v1.694l17.061 16.682 31.266 28.233 39.152 36.397 1.997 8.999-5.03 7.102-5.307-.758-34.401-25.883-13.27-11.651-30.053-25.302-1.996-.001v2.654l6.926 10.136 36.574 54.975 1.895 16.859-2.653 5.485-9.479 3.311-10.414-1.895-21.408-30.054-22.092-33.844-17.819-30.331-2.173 1.238-10.515 113.261-4.929 5.788-11.374 4.348-9.478-7.204-5.03-11.652 5.03-23.027 6.066-30.052 4.928-23.886 4.449-29.674 2.654-9.858-.177-.657-2.173.278-22.37 30.71-34.021 45.977-26.919 28.815-6.445 2.553-11.173-5.789 1.037-10.337 6.243-9.2 37.257-47.392 22.47-29.371 14.508-16.961-.101-2.451h-.859l-98.954 64.251-17.618 2.275-7.583-7.103.936-11.652 3.589-3.791 29.749-20.474-.101.102.024.101z"/></svg>
               <span className="text-zinc-300 text-sm font-medium">Claude</span>
            </div>

            <div className="bg-[#141414] hover:bg-[#1a1a1a] cursor-pointer transition-colors rounded-full px-5 py-2.5 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" shapeRendering="geometricPrecision" textRendering="geometricPrecision" imageRendering="optimizeQuality" fillRule="evenodd" clipRule="evenodd" viewBox="0 0 512 509.639"><path fill="#fff" d="M115.612 0h280.775C459.974 0 512 52.026 512 115.612v278.415c0 63.587-52.026 115.613-115.613 115.613H115.612C52.026 509.64 0 457.614 0 394.027V115.612C0 52.026 52.026 0 115.612 0z"/><path fillRule="nonzero" d="M412.037 221.764a90.834 90.834 0 004.648-28.67 90.79 90.79 0 00-12.443-45.87c-16.37-28.496-46.738-46.089-79.605-46.089-6.466 0-12.943.683-19.264 2.04a90.765 90.765 0 00-67.881-30.515h-.576c-.059.002-.149.002-.216.002-39.807 0-75.108 25.686-87.346 63.554-25.626 5.239-47.748 21.31-60.682 44.03a91.873 91.873 0 00-12.407 46.077 91.833 91.833 0 0023.694 61.553 90.802 90.802 0 00-4.649 28.67 90.804 90.804 0 0012.442 45.87c16.369 28.504 46.74 46.087 79.61 46.087a91.81 91.81 0 0019.253-2.04 90.783 90.783 0 0067.887 30.516h.576l.234-.001c39.829 0 75.119-25.686 87.357-63.588 25.626-5.242 47.748-21.312 60.682-44.033a91.718 91.718 0 0012.383-46.035 91.83 91.83 0 00-23.693-61.553l-.004-.005zM275.102 413.161h-.094a68.146 68.146 0 01-43.611-15.8 56.936 56.936 0 002.155-1.221l72.54-41.901a11.799 11.799 0 005.962-10.251V241.651l30.661 17.704c.326.163.55.479.596.84v84.693c-.042 37.653-30.554 68.198-68.21 68.273h.001zm-146.689-62.649a68.128 68.128 0 01-9.152-34.085c0-3.904.341-7.817 1.005-11.663.539.323 1.48.897 2.155 1.285l72.54 41.901a11.832 11.832 0 0011.918-.002l88.563-51.137v35.408a1.1 1.1 0 01-.438.94l-73.33 42.339a68.43 68.43 0 01-34.11 9.12 68.359 68.359 0 01-59.15-34.11l-.001.004zm-19.083-158.36a68.044 68.044 0 0135.538-29.934c0 .625-.036 1.731-.036 2.5v83.801l-.001.07a11.79 11.79 0 005.954 10.242l88.564 51.13-30.661 17.704a1.096 1.096 0 01-1.034.093l-73.337-42.375a68.36 68.36 0 01-34.095-59.143 68.412 68.412 0 019.112-34.085l-.004-.003zm251.907 58.621l-88.563-51.137 30.661-17.697a1.097 1.097 0 011.034-.094l73.337 42.339c21.109 12.195 34.132 34.746 34.132 59.132 0 28.604-17.849 54.199-44.686 64.078v-86.308c.004-.032.004-.065.004-.096 0-4.219-2.261-8.119-5.919-10.217zm30.518-45.93c-.539-.331-1.48-.898-2.155-1.286l-72.54-41.901a11.842 11.842 0 00-5.958-1.611c-2.092 0-4.15.558-5.957 1.611l-88.564 51.137v-35.408l-.001-.061a1.1 1.1 0 01.44-.88l73.33-42.303a68.301 68.301 0 0134.108-9.129c37.704 0 68.281 30.577 68.281 68.281a68.69 68.69 0 01-.984 11.545v.005zm-191.843 63.109l-30.668-17.704a1.09 1.09 0 01-.596-.84v-84.692c.016-37.685 30.593-68.236 68.281-68.236a68.332 68.332 0 0143.689 15.804 63.09 63.09 0 00-2.155 1.222l-72.54 41.9a11.794 11.794 0 00-5.961 10.248v.068l-.05 102.23zm16.655-35.91l39.445-22.782 39.444 22.767v45.55l-39.444 22.767-39.445-22.767v-45.535z"/></svg>
               <span className="text-zinc-300 text-[15px] font-medium leading-[0]">ChatGPT</span>
            </div>

            <div 
              onClick={() => {
                window.open(aiStudioUrl, '_blank');
              }}
              className="bg-[#141414] hover:bg-[#1a1a1a] cursor-pointer transition-colors rounded-full px-5 py-2.5 flex items-center gap-2"
            >
              <svg width="18" height="18" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><g clipPath="url(#prefix__clip0_5_13)" fillRule="evenodd" clipRule="evenodd" fill="currentColor"><path d="M211.648 89.515h-76.651A57.707 57.707 0 0077.291 147.2v242.389a57.707 57.707 0 0057.706 57.707h242.411a57.707 57.707 0 0057.707-57.707V288.128l34.624-23.744v125.227a92.35 92.35 0 01-92.331 92.33H134.997a92.349 92.349 0 01-92.33-92.33v-242.39A92.336 92.336 0 0169.702 81.92a92.33 92.33 0 0165.295-27.05h96.96l-20.309 34.645z"/><path d="M380.16 0c3.093 0 5.717 2.219 6.379 5.248a149.328 149.328 0 0040.533 74.325 149.332 149.332 0 0074.347 40.555c3.029.661 5.248 3.285 5.248 6.4a6.574 6.574 0 01-5.248 6.357 149.338 149.338 0 00-74.326 40.555 149.338 149.338 0 00-40.789 75.413 6.334 6.334 0 01-6.144 5.078 6.334 6.334 0 01-6.144-5.078 149.338 149.338 0 00-40.789-75.413 149.326 149.326 0 00-75.414-40.789 6.338 6.338 0 01-5.077-6.144c0-2.987 2.133-5.547 5.077-6.144a149.336 149.336 0 0075.414-40.79 149.354 149.354 0 0040.554-74.325A6.573 6.573 0 01380.16 0z"/></g><defs><clipPath id="prefix__clip0_5_13"><path fill="#fff" d="M0 0h512v512H0z"/></clipPath></defs></svg>
              <span className="text-zinc-300 text-[15px] font-medium">AI Studio</span>
            </div>
          </div>
          
          <button 
            onClick={() => setIsSuggestModalOpen(true)}
            className="mt-4 text-xs text-zinc-500 hover:text-zinc-300 transition-colors underline decoration-zinc-800 hover:decoration-zinc-500 underline-offset-4"
          >
            Suggest more tools
          </button>

          {/* Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-[10px] mt-10 w-full">
            {[
              { 
                title: 'Brutalist Blog', 
                visual: (
                  <div className="flex flex-col gap-1.5 w-12 h-12 justify-center group-hover:scale-105 transition-transform duration-500">
                    <div className="w-full h-4 bg-zinc-800"></div>
                    <div className="w-2/3 h-4 bg-zinc-800"></div>
                  </div>
                )
              },
              { 
                title: 'SaaS Dashboard', 
                visual: (
                   <div className="flex items-end gap-1 w-12 h-12 justify-center group-hover:scale-105 transition-transform duration-500">
                     <div className="w-2.5 h-5 bg-zinc-800"></div>
                     <div className="w-2.5 h-8 bg-zinc-800"></div>
                     <div className="w-2.5 h-4 bg-zinc-800"></div>
                     <div className="w-2.5 h-10 bg-zinc-800"></div>
                   </div>
                )
              },
              { 
                title: 'Flat Music Player', 
                visual: (
                   <div className="flex items-center gap-2 w-16 h-12 justify-center group-hover:scale-105 transition-transform duration-500">
                     <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center shrink-0">
                       <div className="w-2 h-2 rounded-full bg-[#141414] group-hover:bg-[#1c1c1c] transition-colors"></div>
                     </div>
                     <div className="flex flex-col gap-1 w-full">
                       <div className="w-full h-1.5 bg-zinc-800"></div>
                       <div className="w-1/2 h-1.5 bg-zinc-800"></div>
                     </div>
                   </div>
                )
              },
              { 
                title: 'Minimal To-Do', 
                visual: (
                   <div className="flex flex-col gap-2 w-12 h-12 justify-center group-hover:scale-105 transition-transform duration-500">
                     <div className="flex gap-1.5 items-center">
                       <div className="w-2.5 h-2.5 border-2 border-zinc-800 shrink-0"></div>
                       <div className="w-full h-1.5 bg-zinc-800"></div>
                     </div>
                     <div className="flex gap-1.5 items-center">
                       <div className="w-2.5 h-2.5 bg-zinc-800 shrink-0"></div>
                       <div className="w-2/3 h-1.5 bg-zinc-800 opacity-60"></div>
                     </div>
                     <div className="flex gap-1.5 items-center">
                       <div className="w-2.5 h-2.5 border-2 border-zinc-800 shrink-0"></div>
                       <div className="w-full h-1.5 bg-zinc-800"></div>
                     </div>
                   </div>
                )
              },
            ].map((item, i) => (
              <div
                key={i}
                onClick={() =>
                  generatePrompt(`A ${item.title.toLowerCase()}`)
                }
                className="bg-[#141414] rounded-2xl p-5 cursor-pointer hover:bg-[#1c1c1c] transition-colors aspect-[4/3] flex flex-col relative group border border-transparent hover:border-zinc-800/50 min-h-[140px]"
              >
                <div className="flex-1 flex items-center justify-center text-zinc-800 transition-colors">
                  {item.visual}
                </div>
                <div className="flex items-end justify-between mt-2">
                  <span className="text-sm font-medium text-zinc-400 group-hover:text-zinc-300">{item.title}</span>
                  <div className="bg-[#212121] p-1.5 rounded-full text-zinc-500 group-hover:text-zinc-400 group-hover:bg-[#2a2a2a] transition-colors">
                    <ArrowUpRight size={14} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : view === 'library' ? (
        // LIBRARY VIEW
        <div className="max-w-6xl w-full relative z-10 shrink-0 mx-auto px-6 pt-24 pb-16 min-h-[80vh]">
          <div className="flex flex-col gap-2 mb-12">
            <h1 className="text-3xl font-medium tracking-tight">Prompt Library</h1>
            <p className="text-zinc-500 text-sm">Curated collection of high-performance prompts for vibe coding and UI design.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Vibe UI Architect",
                description: "Focuses on spacing, typography, and distinctive aesthetics while banning generic defaults.",
                prompt: "Act as a Lead Product Designer. Generate a React component with Tailwind. Focus on spacing (rhythmic padding), typography (Inter/Space Grotesk), and architectural honesty. BAN: generic shadows, default blue/purple gradients, and cookie-cutter card layouts. Use CSS variables for a monochromatic technical theme."
              },
              {
                title: "Dark Minimal SaaS",
                description: "Clean, high-contrast dashboard with a focus on data density and elegant borders.",
                prompt: "Generate a dashboard for a cloud infrastructure tool. Theme: Ultra Dark Minimal. Background: #050505. Borders: 1px border-white/5. Spacing: Compact. Use JetBrains Mono for all data points. Highlight important actions with a single emerald accent color."
              },
              {
                title: "Editorial Portfolio",
                description: "Text-heavy design focusing on readability and classic typography pairings.",
                prompt: "Design a landing page for a creative agency. Vibe: Editorial, Swiss Modern. Typography: Playfair Display for headings, Inter for body. Maximize white space. Use large, high-quality image placeholders with dark overlays. All text must be left-aligned and mathematically spaced."
              },
              {
                title: "Bento Technical Grid",
                description: "A functional grid layout for displaying complex metrics or featured sets.",
                prompt: "Create a Bento Grid layout for a developer tools landing page. Each card should have a subtle glow on hover. Use 128-bit UID strings for ID attributes. Focus on responsive fluidity—grid should collapse to a single column on mobile. Color palette: Zinc-900, Zinc-400, Zinc-100."
              },
              {
                title: "Cyber Brutalist UI",
                description: "Hard edges, mono fonts, and high-impact visual elements.",
                prompt: "Design a login page with a Cyber Brutalist aesthetic. Hard black borders (2px). High contrast colors (Yellow/Black). Use mono fonts exclusively. Buttons should have a 'popping' animation where they shift position by 2px on click. No rounded corners."
              },
              {
                title: "Retro Terminal",
                description: "CRT-style interface with glowing text and scanline effects.",
                prompt: "Generate a terminal-style UI for a system monitoring tool. Theme: Phosphor Green on Black. Use a monospace font (Share Tech Mono) if possible. Add scanline effects using subtle repeating linear gradients. All interactions should have a slight 'flicker' effect. Focus on data visualization using ASCII-inspired graphs."
              },
              {
                title: "Glassmorphism 2.0",
                description: "Refined frosted glass effects with sharp borders and vibrant backgrounds.",
                prompt: "Design a settings modal with a Glassmorphism approach. No generic shadows. Background: white/5 with backdrop-blur-md and a 1px border-white/10. Use high-saturation vibrant shapes behind the modal to justify the blur. Typography: Outfit, medium weight. Buttons should have a slight inner glow."
              },
              {
                title: "Neubrutalism Layout",
                description: "Bold colors, heavy strokes, and non-traditional spacing.",
                prompt: "Create a landing page layout for a modern fintech app. Vibe: Neubrutalism. Color palette: Pastel Yellow, Vivid Orange, and Deep Navy. Hard black borders (3px). No border-radius. Use large, heavy typography (Inter Black). Shadows should be solid and offset, not blurred."
              }
            ].map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 flex flex-col gap-4 hover:border-white/20 transition-all group"
              >
                <div className="flex flex-col gap-2">
                  <h3 className="text-zinc-100 font-bold text-lg">{item.title}</h3>
                  <p className="text-zinc-500 text-sm leading-relaxed">{item.description}</p>
                </div>
                
                <div className="flex-1" />

                <div className="flex items-center gap-2 pt-4">
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(item.prompt);
                      setLibraryCopiedIdx(idx);
                      setTimeout(() => setLibraryCopiedIdx(null), 2000);
                    }}
                    className="flex-1 flex items-center justify-center px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-full text-xs font-bold transition-all border-none relative overflow-hidden"
                  >
                    <AnimatePresence mode="wait">
                      {libraryCopiedIdx === idx ? (
                        <motion.div 
                          key="check"
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: -20, opacity: 0 }}
                          className="flex items-center gap-2"
                        >
                          <Check size={14} className="text-emerald-400" /> COPIED
                        </motion.div>
                      ) : (
                        <motion.div 
                          key="copy"
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: -20, opacity: 0 }}
                          className="flex items-center gap-2"
                        >
                          <Copy size={14} /> COPY
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </button>
                  <button 
                    onClick={() => {
                      setResult(item.prompt);
                      setView('result');
                      setCurrentResult({
                        title: item.title,
                        prompt: item.prompt,
                        svg: `<svg viewBox="0 0 48 48"><rect x="8" y="8" width="32" height="32" rx="4" fill="#27272a" /></svg>`
                      });
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-full text-xs font-bold transition-all border-none"
                  >
                    <Sparkles size={14} /> USE
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      const blob = new Blob([item.prompt], { type: 'text/markdown' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      const safeTitle = item.title.toLowerCase().replace(/\s+/g, '_');
                      const extension = (item as any).type === 'design' ? 'design.md' : (item as any).type === 'skill' ? 'skill.md' : 'prompt.md';
                      a.download = `${safeTitle}_${extension}`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                    className="p-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-full transition-all border-none"
                    title="Export as file"
                  >
                    <Download size={14} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ) : view === 'recents' ? (
        // RECENTS VIEW
        <div className="max-w-5xl w-full relative z-10 shrink-0 mx-auto px-6 pt-24 pb-16 min-h-[80vh]">
          <h1 className="text-3xl font-medium tracking-tight mb-8 text-white">History</h1>
          <div className="flex bg-[#141414] p-1.5 rounded-2xl mb-10 border border-white/5 self-start w-fit scrollbar-hide overflow-x-auto">
            <button onClick={() => setRecentsFilter('prompt')} className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-colors outline-none shrink-0 ${recentsFilter === 'prompt' ? 'bg-[#2a2a2a] text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'}`}>Prompts</button>
            <button onClick={() => setRecentsFilter('design')} className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-colors outline-none shrink-0 ${recentsFilter === 'design' ? 'bg-[#2a2a2a] text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'}`}>Designs</button>
            <button onClick={() => setRecentsFilter('skill')} className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-colors outline-none shrink-0 ${recentsFilter === 'skill' ? 'bg-[#2a2a2a] text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'}`}>Skills</button>
          </div>
          {recents.filter((item) => (item.type || 'prompt') === recentsFilter).length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-24 px-4 bg-[#141414]/50 border border-white/5 rounded-[32px] w-full">
              <div className="w-20 h-20 rounded-full bg-[#1c1c1c] flex items-center justify-center mb-6 border border-white/5 shadow-inner">
                <History className="text-zinc-600 w-8 h-8" />
              </div>
              <h3 className="text-2xl font-medium text-zinc-300 mb-3 tracking-tight">No {recentsFilter}s yet</h3>
              <p className="text-zinc-500 max-w-sm text-[15px]">Generate some {recentsFilter === 'prompt' ? 'prompts' : recentsFilter === 'design' ? 'UI designs' : 'skills'} to see them appear in your history.</p>
              <button 
                onClick={() => setView('home')} 
                className="mt-8 bg-white text-black px-6 py-3 rounded-full font-medium hover:bg-zinc-200 transition-colors"
               >
                Go Generate
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full">
              {recents.filter((item) => (item.type || 'prompt') === recentsFilter).map((item, i) => (
                <div
                  key={i}
                  onClick={() => {
                     setCurrentResult(item);
                     setResult(item.prompt);
                     setView('result');
                  }}
                  className="bg-[#141414] rounded-[24px] p-6 cursor-pointer hover:bg-[#1a1a1a] transition-all duration-300 aspect-[4/3] flex flex-col relative group border border-white/5 hover:border-white/10 shadow-sm hover:shadow-xl hover:-translate-y-1"
                >
                  <div 
                    className="flex-1 flex items-center justify-center text-zinc-800 transition-colors w-24 h-24 mx-auto group-hover:scale-110 duration-500 [&>svg]:w-full [&>svg]:h-full"
                    dangerouslySetInnerHTML={{ __html: item.svg }} 
                  />
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-[15px] font-medium text-zinc-300 group-hover:text-white truncate pr-4">{item.title}</span>
                    <div className="bg-[#212121] p-2 rounded-full text-zinc-400 group-hover:text-white group-hover:bg-[#2a2a2a] transition-colors shrink-0">
                      <ArrowUpRight size={16} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : view === 'result' ? (
        // RESULT VIEW
        <div className="max-w-3xl mx-auto px-4 pt-24 pb-16 min-h-screen flex flex-col gap-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between px-2"
          >
            <h2 className="text-[17px] text-zinc-100 font-medium flex items-center gap-2">
              <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
                <defs>
                  <linearGradient id="sparkleGradient" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
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
                  fill="url(#sparkleGradient)"
                  transform="translate(0 -2)"
                />
              </svg> AI Generated Prompt
              {isGenerating && (
                <span className="text-zinc-500 text-sm flex items-center gap-2 ml-4">
                  <RefreshCw size={14} className="animate-spin" /> Generating...
                </span>
              )}
            </h2>
            <div className="flex items-center gap-4">
              <button
                 disabled={isGenerating}
                 onClick={() => {
                   setView('edit');
                   setChatHistory([]);
                 }}
                 className="text-zinc-400 hover:text-zinc-200 text-[15px] font-medium flex items-center gap-2 transition-colors disabled:opacity-50 border border-transparent hover:bg-[#141414] px-3 py-1.5 rounded-full"
               >
                 <Edit3 size={16} />
                 Edit
               </button>
               <button
                 disabled={isGenerating}
                 onClick={() => {
                   navigator.clipboard.writeText(result);
                   setCopied(true);
                   setTimeout(() => setCopied(false), 2000);
                 }}
                 className="text-zinc-400 hover:text-zinc-200 text-[15px] font-medium flex items-center gap-2 transition-colors disabled:opacity-50 border border-transparent hover:bg-[#141414] px-3 py-1.5 rounded-full"
               >
                 {copied ? <Check size={16} /> : <Copy size={16} />}
                 {copied ? 'Copied' : 'Copy'}
               </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[#141414] rounded-[24px] p-6 sm:p-8 relative overflow-hidden"
          >
            <div className="h-[240px] text-zinc-300 whitespace-pre-wrap font-mono text-[15px] leading-relaxed overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {isGenerating ? (
                 <div className="flex flex-col gap-3 animate-pulse">
                   <div className="h-4 bg-zinc-800/50 rounded w-3/4"></div>
                   <div className="h-4 bg-zinc-800/50 rounded w-full"></div>
                   <div className="h-4 bg-zinc-800/50 rounded w-5/6"></div>
                   <div className="h-4 bg-zinc-800/50 rounded w-1/2 mt-4"></div>
                 </div>
              ) : (
                result
              )}
              {/* Extra padding at bottom to ensure content isn't completely hidden by gradient blur */}
              <div className="h-12 w-full"></div>
            </div>
            
            {/* Gradient Blur at bottom */}
             <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#141414] to-transparent pointer-events-none rounded-b-[24px]"></div>
          </motion.div>

          <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 0.2 }}
             className="flex flex-col gap-3 px-2 pt-2"
          >
             <div className="flex flex-wrap items-center gap-3">
               <button
                  disabled={isGenerating}
                  onClick={downloadPromptFile}
                  className="bg-[#141414] hover:bg-[#1c1c1c] text-zinc-300 px-5 py-2.5 rounded-full text-[15px] font-medium flex items-center gap-2 transition-colors disabled:opacity-50"
                >
                  <Download size={16} />
                  {currentResult?.type === 'design' ? 'Download DESIGN.md' : currentResult?.type === 'skill' ? 'Download SKILL.md' : 'Download PROMPT.md'}
                </button>
                
                <a
                  href={user ? lovableUrl : '#'}
                  target={user ? "_blank" : undefined}
                  rel={user ? "noopener noreferrer" : undefined}
                  onClick={(e) => {
                    if (!user) {
                      e.preventDefault();
                      setIsAuthModalOpen(true);
                    }
                  }}
                  className={`bg-[#141414] hover:bg-[#1c1c1c] text-zinc-300 px-5 py-2.5 rounded-full text-[15px] font-medium flex items-center gap-2 transition-colors ${isGenerating ? 'opacity-50 pointer-events-none' : ''}`}
                >
                  <svg width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fillRule="evenodd" clipRule="evenodd" d="M151.083 0c83.413 0 151.061 67.819 151.061 151.467v57.6h50.283c83.413 0 151.082 67.797 151.082 151.466 0 83.691-67.626 151.467-151.082 151.467H0V151.467C0 67.84 67.627 0 151.083 0z" fill="url(#prefix__paint0_radial_5_27)"/><defs><radialGradient id="prefix__paint0_radial_5_27" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="rotate(92.545 118.724 174.844) scale(480.474 650.325)"><stop offset=".25" stopColor="#FE7B02"/><stop offset=".433" stopColor="#FE4230"/><stop offset=".548" stopColor="#FE529A"/><stop offset=".654" stopColor="#DD67EE"/><stop offset=".95" stopColor="#4B73FF"/></radialGradient></defs></svg>
                  Export to Lovable
                </a>

                <a
                  href={claudeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`bg-[#141414] hover:bg-[#1c1c1c] text-zinc-300 px-5 py-2.5 rounded-full text-[15px] font-medium flex items-center gap-2 transition-colors ${isGenerating ? 'opacity-50 pointer-events-none' : ''}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" shapeRendering="geometricPrecision" textRendering="geometricPrecision" imageRendering="optimizeQuality" fillRule="evenodd" clipRule="evenodd" viewBox="0 0 512 509.64"><path fill="#D77655" d="M115.612 0h280.775C459.974 0 512 52.026 512 115.612v278.415c0 63.587-52.026 115.612-115.613 115.612H115.612C52.026 509.639 0 457.614 0 394.027V115.612C0 52.026 52.026 0 115.612 0z"/><path fill="#FCF2EE" fillRule="nonzero" d="M142.27 316.619l73.655-41.326 1.238-3.589-1.238-1.996-3.589-.001-12.31-.759-42.084-1.138-36.498-1.516-35.361-1.896-8.897-1.895-8.34-10.995.859-5.484 7.482-5.03 10.717.935 23.683 1.617 35.537 2.452 25.782 1.517 38.193 3.968h6.064l.86-2.451-2.073-1.517-1.618-1.517-36.776-24.922-39.81-26.338-20.852-15.166-11.273-7.683-5.687-7.204-2.451-15.721 10.237-11.273 13.75.935 3.513.936 13.928 10.716 29.749 23.027 38.848 28.612 5.687 4.727 2.275-1.617.278-1.138-2.553-4.271-21.13-38.193-22.546-38.848-10.035-16.101-2.654-9.655c-.935-3.968-1.617-7.304-1.617-11.374l11.652-15.823 6.445-2.073 15.545 2.073 6.547 5.687 9.655 22.092 15.646 34.78 24.265 47.291 7.103 14.028 3.791 12.992 1.416 3.968 2.449-.001v-2.275l1.997-26.641 3.69-32.707 3.589-42.084 1.239-11.854 5.863-14.206 11.652-7.683 9.099 4.348 7.482 10.716-1.036 6.926-4.449 28.915-8.72 45.294-5.687 30.331h3.313l3.792-3.791 15.342-20.372 25.782-32.227 11.374-12.789 13.27-14.129 8.517-6.724 16.1-.001 11.854 17.617-5.307 18.199-16.581 21.029-13.75 17.819-19.716 26.54-12.309 21.231 1.138 1.694 2.932-.278 44.536-9.479 24.062-4.347 28.714-4.928 12.992 6.066 1.416 6.167-5.106 12.613-30.71 7.583-36.018 7.204-53.636 12.689-.657.48.758.935 24.164 2.275 10.337.556h25.301l47.114 3.514 12.309 8.139 7.381 9.959-1.238 7.583-18.957 9.655-25.579-6.066-59.702-14.205-20.474-5.106-2.83-.001v1.694l17.061 16.682 31.266 28.233 39.152 36.397 1.997 8.999-5.03 7.102-5.307-.758-34.401-25.883-13.27-11.651-30.053-25.302-1.996-.001v2.654l6.926 10.136 36.574 54.975 1.895 16.859-2.653 5.485-9.479 3.311-10.414-1.895-21.408-30.054-22.092-33.844-17.819-30.331-2.173 1.238-10.515 113.261-4.929 5.788-11.374 4.348-9.478-7.204-5.03-11.652 5.03-23.027 6.066-30.052 4.928-23.886 4.449-29.674 2.654-9.858-.177-.657-2.173.278-22.37 30.71-34.021 45.977-26.919 28.815-6.445 2.553-11.173-5.789 1.037-10.337 6.243-9.2 37.257-47.392 22.47-29.371 14.508-16.961-.101-2.451h-.859l-98.954 64.251-17.618 2.275-7.583-7.103.936-11.652 3.589-3.791 29.749-20.474-.101.102.024.101z"/></svg>
                  Export to Claude
                </a>

                <a
                  href={chatGptUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`bg-[#141414] hover:bg-[#1c1c1c] text-zinc-300 px-5 py-2.5 rounded-full text-[15px] font-medium flex items-center gap-2 transition-colors ${isGenerating ? 'opacity-50 pointer-events-none' : ''}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" shapeRendering="geometricPrecision" textRendering="geometricPrecision" imageRendering="optimizeQuality" fillRule="evenodd" clipRule="evenodd" viewBox="0 0 512 509.639"><path fill="#fff" d="M115.612 0h280.775C459.974 0 512 52.026 512 115.612v278.415c0 63.587-52.026 115.613-115.613 115.613H115.612C52.026 509.64 0 457.614 0 394.027V115.612C0 52.026 52.026 0 115.612 0z"/><path fillRule="nonzero" d="M412.037 221.764a90.834 90.834 0 004.648-28.67 90.79 90.79 0 00-12.443-45.87c-16.37-28.496-46.738-46.089-79.605-46.089-6.466 0-12.943.683-19.264 2.04a90.765 90.765 0 00-67.881-30.515h-.576c-.059.002-.149.002-.216.002-39.807 0-75.108 25.686-87.346 63.554-25.626 5.239-47.748 21.31-60.682 44.03a91.873 91.873 0 00-12.407 46.077 91.833 91.833 0 0023.694 61.553 90.802 90.802 0 00-4.649 28.67 90.804 90.804 0 0012.442 45.87c16.369 28.504 46.74 46.087 79.61 46.087a91.81 91.81 0 0019.253-2.04 90.783 90.783 0 0067.887 30.516h.576l.234-.001c39.829 0 75.119-25.686 87.357-63.588 25.626-5.242 47.748-21.312 60.682-44.033a91.718 91.718 0 0012.383-46.035 91.83 91.83 0 00-23.693-61.553l-.004-.005zM275.102 413.161h-.094a68.146 68.146 0 01-43.611-15.8 56.936 56.936 0 002.155-1.221l72.54-41.901a11.799 11.799 0 005.962-10.251V241.651l30.661 17.704c.326.163.55.479.596.84v84.693c-.042 37.653-30.554 68.198-68.21 68.273h.001zm-146.689-62.649a68.128 68.128 0 01-9.152-34.085c0-3.904.341-7.817 1.005-11.663.539.323 1.48.897 2.155 1.285l72.54 41.901a11.832 11.832 0 0011.918-.002l88.563-51.137v35.408a1.1 1.1 0 01-.438.94l-73.33 42.339a68.43 68.43 0 01-34.11 9.12 68.359 68.359 0 01-59.15-34.11l-.001.004zm-19.083-158.36a68.044 68.044 0 0135.538-29.934c0 .625-.036 1.731-.036 2.5v83.801l-.001.07a11.79 11.79 0 005.954 10.242l88.564 51.13-30.661 17.704a1.096 1.096 0 01-1.034.093l-73.337-42.375a68.36 68.36 0 01-34.095-59.143 68.412 68.412 0 019.112-34.085l-.004-.003zm251.907 58.621l-88.563-51.137 30.661-17.697a1.097 1.097 0 011.034-.094l73.337 42.339c21.109 12.195 34.132 34.746 34.132 59.132 0 28.604-17.849 54.199-44.686 64.078v-86.308c.004-.032.004-.065.004-.096 0-4.219-2.261-8.119-5.919-10.217zm30.518-45.93c-.539-.331-1.48-.898-2.155-1.286l-72.54-41.901a11.842 11.842 0 00-5.958-1.611c-2.092 0-4.15.558-5.957 1.611l-88.564 51.137v-35.408l-.001-.061a1.1 1.1 0 01.44-.88l73.33-42.303a68.301 68.301 0 0134.108-9.129c37.704 0 68.281 30.577 68.281 68.281a68.69 68.69 0 01-.984 11.545v.005zm-191.843 63.109l-30.668-17.704a1.09 1.09 0 01-.596-.84v-84.692c.016-37.685 30.593-68.236 68.281-68.236a68.332 68.332 0 0143.689 15.804 63.09 63.09 0 00-2.155 1.222l-72.54 41.9a11.794 11.794 0 00-5.961 10.248v.068l-.05 102.23zm16.655-35.91l39.445-22.782 39.444 22.767v45.55l-39.444 22.767-39.445-22.767v-45.535z"/></svg>
                  Export to ChatGPT
                </a>

                <a
                  href={user ? aiStudioUrl : '#'}
                  target={user ? "_blank" : undefined}
                  rel={user ? "noopener noreferrer" : undefined}
                  onClick={(e) => {
                    if (!user) {
                      e.preventDefault();
                      setIsAuthModalOpen(true);
                      return;
                    }
                  }}
                  className={`bg-[#141414] hover:bg-[#1c1c1c] text-zinc-300 px-5 py-2.5 rounded-full text-[15px] font-medium flex items-center gap-2 transition-colors ${isGenerating ? 'opacity-50 pointer-events-none' : ''}`}
                >
                  <svg width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><g clipPath="url(#prefix__clip0_5_13)" fillRule="evenodd" clipRule="evenodd" fill="currentColor"><path d="M211.648 89.515h-76.651A57.707 57.707 0 0077.291 147.2v242.389a57.707 57.707 0 0057.706 57.707h242.411a57.707 57.707 0 0057.707-57.707V288.128l34.624-23.744v125.227a92.35 92.35 0 01-92.331 92.33H134.997a92.349 92.349 0 01-92.33-92.33v-242.39A92.336 92.336 0 0169.702 81.92a92.33 92.33 0 0165.295-27.05h96.96l-20.309 34.645z"/><path d="M380.16 0c3.093 0 5.717 2.219 6.379 5.248a149.328 149.328 0 0040.533 74.325 149.332 149.332 0 0074.347 40.555c3.029.661 5.248 3.285 5.248 6.4a6.574 6.574 0 01-5.248 6.357 149.338 149.338 0 00-74.326 40.555 149.338 149.338 0 00-40.789 75.413 6.334 6.334 0 01-6.144 5.078 6.334 6.334 0 01-6.144-5.078 149.338 149.338 0 00-40.789-75.413 149.326 149.326 0 00-75.414-40.789 6.338 6.338 0 01-5.077-6.144c0-2.987 2.133-5.547 5.077-6.144a149.336 149.336 0 0075.414-40.79 149.354 149.354 0 0040.554-74.325A6.573 6.573 0 01380.16 0z"/></g><defs><clipPath id="prefix__clip0_5_13"><path fill="#fff" d="M0 0h512v512H0z"/></clipPath></defs></svg>
                  Export to AI Studio
                </a>
             </div>
          </motion.div>
        </div>
      ) : (
        // EDIT VIEW (Full Page Preview + Floating Pill)
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#0a0a0a] relative">
          {/* Top Bar (Close) */}
          <div className="fixed top-6 left-6 z-50">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setView('result')}
              className="bg-[#0a0a0a]/60 backdrop-blur-xl border border-white/10 rounded-full p-2.5 text-zinc-400 hover:text-white transition-colors shadow-xl"
            >
              <X size={20} />
            </motion.button>
          </div>

          {/* Editor Header / Switcher */}
          <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3">
             <div className="flex bg-[#0a0a0a]/60 backdrop-blur-xl border border-white/10 rounded-full p-1 shadow-xl">
                <button 
                  onClick={() => setIsEditingRaw(false)}
                  className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all flex items-center gap-2 ${!isEditingRaw ? 'bg-[#1c1c1c] text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  <Eye size={14} /> PREVIEW
                </button>
                <button 
                  onClick={() => setIsEditingRaw(true)}
                  className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all flex items-center gap-2 ${isEditingRaw ? 'bg-[#1c1c1c] text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  <Edit3 size={14} /> RAW
                </button>
             </div>
             
             <button 
                onClick={() => {
                  if (currentResult) {
                    const updatedRecents = recents.map(item => 
                      (item.title === currentResult.title && item.prompt === currentResult.prompt) 
                        ? { ...item, prompt: result } 
                        : item
                    );
                    setRecents(updatedRecents);
                    setCurrentResult({ ...currentResult, prompt: result });
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }
                }}
                className="bg-[#0a0a0a]/60 backdrop-blur-xl border border-white/10 rounded-full px-4 py-2 text-zinc-300 text-xs font-bold transition-all shadow-xl hover:bg-[#1c1c1c]"
              >
                {copied ? 'SAVED' : 'SAVE'}
              </button>
          </div>

          {/* Full Page Content */}
          <div className="flex-1 overflow-y-auto p-12 pb-32 flex justify-center selection:bg-blue-500/30 custom-scrollbar">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl w-full"
            >
              {isEditingRaw ? (
                <textarea 
                  className="w-full h-[80vh] bg-transparent text-zinc-300 font-mono text-base leading-relaxed outline-none resize-none border-none focus:ring-0 custom-scrollbar"
                  value={result}
                  onChange={(e) => setResult(e.target.value)}
                  spellCheck={false}
                  placeholder="Paste or write your prompt here..."
                />
              ) : (
                <div className="prose prose-invert prose-zinc max-w-none 
                  prose-base md:prose-lg
                  prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-zinc-100
                  prose-p:text-zinc-400 prose-p:leading-relaxed 
                  prose-strong:text-zinc-200 prose-strong:font-semibold
                  prose-ul:text-zinc-400 prose-ol:text-zinc-400
                  prose-li:my-2
                  prose-hr:border-white/5
                  prose-blockquote:border-l-zinc-700 prose-blockquote:text-zinc-200 prose-blockquote:italic bg-zinc-900/30 p-4 rounded-r-xl
                  prose-code:text-blue-300 prose-code:bg-blue-500/10 prose-code:rounded prose-code:px-1.5 prose-code:py-0.5 prose-code:before:content-none prose-code:after:content-none
                  prose-pre:bg-[#141414] prose-pre:border prose-pre:border-white/10 prose-pre:rounded-2xl prose-pre:p-6 shadow-2xl">
                  <ReactMarkdown>{result}</ReactMarkdown>
                </div>
              )}
            </motion.div>
          </div>

          {/* Floating Gemini-Style Pill Bar */}
          <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 w-full max-w-lg px-6">
            <AnimatePresence>
              {aiGreeting && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 px-4 py-2 bg-blue-600/90 backdrop-blur-md text-white text-sm font-medium rounded-2xl shadow-xl whitespace-nowrap"
                >
                  {aiGreeting}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-blue-600/90" />
                </motion.div>
              )}
            </AnimatePresence>
            <motion.div 
              layout
              className="bg-[#0a0a0a]/80 backdrop-blur-2xl border border-white/10 rounded-[32px] p-2 flex items-center gap-2 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden"
            >
              <AnimatePresence>
                {isListening && (
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="absolute inset-0 bg-blue-600/5 pointer-events-none" 
                  />
                )}
              </AnimatePresence>

              <button 
                onClick={toggleListening}
                className={`p-3 transition-colors relative z-10 ${isListening ? 'text-blue-400' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                {isListening ? <Mic size={20} className="animate-pulse" /> : <Mic size={20} />}
              </button>
              
              <div className="flex-1 bg-white/5 hover:bg-white/10 transition-colors rounded-full flex items-center px-4 py-2.5 gap-3 group relative overflow-hidden z-10">
                {isListening && (
                  <div className="absolute left-4 flex gap-1 h-3 items-center">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <motion.div
                        key={i}
                        animate={{
                          height: ["30%", "100%", "30%"],
                        }}
                        transition={{
                          duration: 0.6,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: i * 0.1,
                        }}
                        className="w-0.5 bg-blue-400 rounded-full"
                      />
                    ))}
                  </div>
                )}
                <input 
                  type="text" 
                  placeholder={isListening ? "Listening... (Gemini Live Mode)" : (isGenerating ? "Processing..." : "Edit with Gemini Live...")}
                  className={`bg-transparent border-none outline-none flex-1 text-[15px] text-zinc-200 placeholder:text-zinc-600 w-full ${isListening ? 'pl-10' : ''}`}
                  value={refineInput}
                  onChange={(e) => {
                    setRefineInput(e.target.value);
                    if (aiGreeting && e.target.value.trim().length > 0) {
                      setAiGreeting(null);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') refinePrompt(refineInput);
                  }}
                />
                <div className="flex items-center gap-2">
                  <AnimatePresence>
                    {isListening && (
                      <motion.span 
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-[10px] font-bold text-blue-500/80 tracking-widest uppercase hidden sm:block"
                      >
                        Live Session
                      </motion.span>
                    )}
                  </AnimatePresence>
                  <button className="text-zinc-600 group-focus-within:text-zinc-400 transition-colors">
                    <ChevronDown size={18} />
                  </button>
                </div>
              </div>

              <AnimatePresence>
                {!isListening && (
                  <motion.button 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      if (isGenerating) return;
                      refinePrompt(refineInput);
                    }}
                    className={`p-3 rounded-full transition-all ${
                      isGenerating 
                        ? 'bg-blue-500 text-white animate-pulse' 
                        : 'bg-white text-black hover:bg-zinc-200'
                    }`}
                  >
                    {isGenerating ? <Square size={18} fill="currentColor" /> : <ArrowUp size={20} />}
                  </motion.button>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      )}
      
      {view !== 'edit' && (
        <footer className="w-full py-4 mt-auto px-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between text-zinc-500 text-sm gap-4 shrink-0 relative z-20 bg-[#070707]">
          <div>&copy; {new Date().getFullYear()} Kindly Prompt. All rights reserved.</div>
          <div className="flex items-center gap-6">
            <a href="/privacy" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-300 transition-colors">Privacy Policy</a>
            <a href="/terms" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-300 transition-colors">Terms of Service</a>
          </div>
        </footer>
      )}
      </main>
      <SuggestToolModal isOpen={isSuggestModalOpen} onClose={() => setIsSuggestModalOpen(false)} />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} onSuccess={(u) => setUser(u)} />
      <UpgradeModal isOpen={isUpgradeModalOpen} onClose={() => setIsUpgradeModalOpen(false)} />
      <AnimatePresence>
        {showSuccessModal && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 right-6 bg-[#1a1a1a] border border-white/10 rounded-2xl p-4 shadow-2xl z-[9999] flex items-center gap-3 pr-6"
          >
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Check size={16} />
            </div>
            <div>
              <div className="text-sm font-medium text-white tracking-tight">Successfully Upgraded</div>
              <div className="text-xs text-zinc-400">Welcome to Kindly Prompt Plus.</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <PersonalIntelligenceModal 
        isOpen={isPiModalOpen} 
        setIsOpen={(v) => { 
          if (!v) localStorage.setItem('hasSeenPI', 'true');
          setIsPiModalOpen(v); 
        }} 
        onComplete={handlePiComplete} 
      />
      <OnboardingModal isOpen={isOnboardingModalOpen} setIsOpen={setIsOnboardingModalOpen} />
    </div>
  );
}
