'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUp, Square } from 'lucide-react';
import { HugeiconsIcon } from '@hugeicons/react';
import type { IconSvgElement } from '@hugeicons/react';
import {
  Add01Icon,
  AlignLeftIcon,
  ArrowDown01Icon,
  ArrowRight01Icon,
  ArrowUpRight01Icon,
  AiChemistry02Icon,
  AiContentGenerator01Icon,
  BookOpen01Icon,
  ClipboardIcon,
  CodeIcon,
  Copy01Icon,
  DiscoverCircleIcon,
  Download01Icon,
  Edit02Icon,
  EyeIcon,
  File01Icon,
  FlashIcon,
  Folder02Icon,
  FolderLibraryIcon,
  Image01Icon,
  Link01Icon,
  Message01Icon,
  Mic01Icon,
  PaintBrush01Icon,
  RefreshIcon,
  Search01Icon,
  SidebarLeftIcon,
  SidebarRightIcon,
  SparklesIcon,
  Tick01Icon,
  Cancel01Icon,
} from '@hugeicons/core-free-icons';
import ReactMarkdown from 'react-markdown';

type IconProps = {
  size?: number | string;
  className?: string;
  strokeWidth?: number;
  fill?: string;
};

const createHugeIcon = (icon: IconSvgElement) => {
  const HugeIcon = ({ size = 24, className, strokeWidth = 1.5 }: IconProps) => (
    <HugeiconsIcon icon={icon} size={size} className={className} strokeWidth={strokeWidth} />
  );
  HugeIcon.displayName = 'HugeIcon';
  return HugeIcon;
};

const Copy = createHugeIcon(Copy01Icon);
const RefreshCw = createHugeIcon(RefreshIcon);
const X = createHugeIcon(Cancel01Icon);
const Check = createHugeIcon(Tick01Icon);
const ArrowRight = createHugeIcon(ArrowRight01Icon);
const ArrowUpRight = createHugeIcon(ArrowUpRight01Icon);
const Download = createHugeIcon(Download01Icon);
const Sparkles = createHugeIcon(SparklesIcon);
const Plus = createHugeIcon(Add01Icon);
const AlignLeft = createHugeIcon(AlignLeftIcon);
const History = createHugeIcon(Folder02Icon);
const Edit3 = createHugeIcon(Edit02Icon);
const MessageSquare = createHugeIcon(Message01Icon);
const PromptIcon = createHugeIcon(AiContentGenerator01Icon);
const Eye = createHugeIcon(EyeIcon);
const Mic = createHugeIcon(Mic01Icon);
const ChevronDown = createHugeIcon(ArrowDown01Icon);
const ImageIcon = createHugeIcon(Image01Icon);
const Labs = createHugeIcon(AiChemistry02Icon);
const Link = createHugeIcon(Link01Icon);
const Paintbrush = createHugeIcon(PaintBrush01Icon);
const Zap = createHugeIcon(FlashIcon);
const Search = createHugeIcon(Search01Icon);
const FileText = createHugeIcon(File01Icon);
const BookOpen = createHugeIcon(BookOpen01Icon);
const Clipboard = createHugeIcon(ClipboardIcon);
const Code2 = createHugeIcon(CodeIcon);
const FolderLibrary = createHugeIcon(FolderLibraryIcon);
const Discover = createHugeIcon(DiscoverCircleIcon);
const SidebarLeft = createHugeIcon(SidebarLeftIcon);
const SidebarRight = createHugeIcon(SidebarRightIcon);

function timeAgo(dateString?: string) {
  if (!dateString) return 'recently';
  const seconds = Math.floor((new Date().getTime() - new Date(dateString).getTime()) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  interval = seconds / 86400;
  if (interval > 1) {
    if (Math.floor(interval) === 1) return "yesterday";
    return Math.floor(interval) + " days ago";
  }
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minutes ago";
  return "just now";
}

type AgentSkill = {
  slug: string;
  name: string;
  description: string;
  category: string;
  installs: number;
  pixels: number[];
  content: string;
};
import { SuggestToolModal } from '@/components/suggest-modal';
import { AuthModal } from '@/components/auth-modal';
import { PersonalIntelligenceModal } from '@/components/pi-modal';
import { OnboardingModal } from '@/components/onboarding-modal';
import { SuperAgentModal } from '@/components/super-agent-modal';
import { UpgradeModal } from '@/components/upgrade-modal';

export default function Home() {
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState('');
  const [streamedResult, setStreamedResult] = useState('');
  const [agentLogs, setAgentLogs] = useState<{ id: string, text: string, type: 'search' | 'read' | 'code' | 'info' }[]>([]);
  const [view, setView] = useState<'home' | 'result' | 'recents' | 'edit' | 'preview' | 'library' | 'discover' | 'skills' | 'labs' | 'event'>('home');
  const [copied, setCopied] = useState(false);
  const [libraryCopiedIdx, setLibraryCopiedIdx] = useState<number | null>(null);
  const [selectedTool, setSelectedTool] = useState<'prompt' | 'design' | 'skill' | 'spec'>('prompt');
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [showShortcutsMenu, setShowShortcutsMenu] = useState(false);
  const [modelType, setModelType] = useState<'ultra-fast' | 'super-agent' | 'lite'>('ultra-fast');
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [isAppSwitcherOpen, setIsAppSwitcherOpen] = useState(false);
  const [recentsFilter, setRecentsFilter] = useState<'prompt' | 'design' | 'skill' | 'spec'>('prompt');
  const [searchQuery, setSearchQuery] = useState('');
  const [skillSearch, setSkillSearch] = useState('');
  const [selectedSkillCard, setSelectedSkillCard] = useState<AgentSkill | null>(null);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
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
  const [showSplash, setShowSplash] = useState(true);
  const [supportNoticeHidden, setSupportNoticeHidden] = useState(false);
  const [supportNoticeView, setSupportNoticeView] = useState<'message' | 'venmo'>('message');
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [supportName, setSupportName] = useState('');
  const [supportEmail, setSupportEmail] = useState('');
  const [supportCategory, setSupportCategory] = useState('Bug');
  const [supportMessage, setSupportMessage] = useState('');
  const [isSupportSubmitting, setIsSupportSubmitting] = useState(false);
  const [supportSent, setSupportSent] = useState(false);

  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const eyeShift = Math.max(-4, Math.min(4, input.length / 18));
  const faceMood = input.length > 80 ? 'focused' : input.length > 0 ? 'curious' : 'idle';

  const submitSupportRequest = async () => {
    if (!supportEmail || !supportMessage) return;
    setIsSupportSubmitting(true);
    try {
      const res = await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: supportName,
          email: supportEmail,
          category: supportCategory,
          message: supportMessage,
        }),
      });
      if (res.ok) {
        setSupportSent(true);
        setTimeout(() => {
          setIsSupportModalOpen(false);
          setSupportSent(false);
          setSupportName('');
          setSupportEmail('');
          setSupportCategory('Bug');
          setSupportMessage('');
        }, 1800);
      }
    } finally {
      setIsSupportSubmitting(false);
    }
  };

  const handleSuggestionClick = (text: string) => {
    setInput('');
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    let i = 0;
    const typeNext = () => {
      if (i < text.length) {
        setInput(prev => text.substring(0, i + 1));
        i++;
        typingTimeoutRef.current = setTimeout(typeNext, 15);
      }
    };
    typeNext();
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (sessionStorage.getItem('hasSeenSplash')) {
        const timer = setTimeout(() => {
          setShowSplash(false);
        }, 0);
        return () => clearTimeout(timer);
      } else {
        const timer = setTimeout(() => {
          setShowSplash(false);
          sessionStorage.setItem('hasSeenSplash', 'true');
        }, 2000);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const notificationView = urlParams.get('view');
      if (notificationView === 'event') {
        setTimeout(() => setView('event'), 0);
        window.history.replaceState({}, '', window.location.pathname);
      }
      if (notificationView === 'result') {
        setTimeout(() => setView('result'), 0);
        window.history.replaceState({}, '', window.location.pathname);
      }
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
  const [isSuperAgentModalOpen, setIsSuperAgentModalOpen] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
      const piActive = localStorage.getItem('piActive');
      const hasSeenSuperAgent = localStorage.getItem('hasSeenSuperAgent');
      
      if (!hasSeenOnboarding) {
        setIsOnboardingModalOpen(true);
      }
      if (piActive !== 'true') {
        setIsPiCardVisible(true);
      }
      if (!hasSeenSuperAgent) {
        setIsSuperAgentModalOpen(true);
        localStorage.setItem('hasSeenSuperAgent', 'true');
      }
    }, 0);
  }, []);

  const handlePiComplete = () => {
    localStorage.setItem('piActive', 'true');
    localStorage.setItem('hasSeenPI', 'true');
    setIsPiCardVisible(false);
  };
  
  const [recents, setRecents] = useState<Array<{ title: string, prompt: string, svg: string, type?: 'prompt' | 'design' | 'skill' | 'spec', date?: string }>>(() => {
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
  const [currentResult, setCurrentResult] = useState<{ title: string, prompt: string, svg: string, type?: 'prompt' | 'design' | 'skill' | 'spec', date?: string } | null>(null);
  const [imageRef, setImageRef] = useState<string | null>(null);
  const [attachedText, setAttachedText] = useState<{name: string, content: string} | null>(null);
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
  const [isComposerListening, setIsComposerListening] = useState(false);
  const composerRecognitionRef = useRef<any>(null);
  const composerTranscriptRef = useRef('');

  const handleImageUpload = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setImageRef(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const attachFigmaLink = () => {
    const figmaLink = window.prompt('Paste your Figma link');
    if (!figmaLink?.trim()) return;
    setInput((prev) => {
      const prefix = prev.trim() ? `${prev.trim()}\n\n` : '';
      return `${prefix}Turn this Figma file into a detailed AI coding prompt: ${figmaLink.trim()}`;
    });
    setIsAddMenuOpen(false);
  };

  const toggleComposerListening = () => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setInput((prev) => `${prev}${prev ? '\n' : ''}Voice input is not supported in this browser.`);
      return;
    }

    if (isComposerListening) {
      composerRecognitionRef.current?.stop();
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    composerTranscriptRef.current = input;

    recognition.onresult = (event: any) => {
      let interim = '';
      let finalText = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) finalText += transcript;
        else interim += transcript;
      }
      if (finalText) {
        composerTranscriptRef.current = `${composerTranscriptRef.current}${composerTranscriptRef.current ? ' ' : ''}${finalText.trim()}`;
      }
      setInput(`${composerTranscriptRef.current}${interim ? `${composerTranscriptRef.current ? ' ' : ''}${interim}` : ''}`);
    };
    recognition.onend = () => setIsComposerListening(false);
    recognition.onerror = () => setIsComposerListening(false);
    composerRecognitionRef.current = recognition;
    setIsComposerListening(true);
    recognition.start();
  };

  useEffect(() => {
    return () => {
      composerRecognitionRef.current?.stop?.();
    };
  }, []);

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

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in an input or textarea unless it is part of the shortcut
      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      const isInput = tag === 'input' || tag === 'textarea';

      // Ctrl + Enter to go home
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        setView('home');
        setInput('');
        setResult('');
      }
      
      // Ctrl + K for Focus Input and Home
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchQuery('');
        // Make sure we are not already trying to focus
        setTimeout(() => {
          if (view === 'recents' || view === 'library') {
             // It will focus the search input inherently 
             const searchInput = document.querySelector('input[placeholder="Search..."]') as HTMLInputElement;
             if(searchInput) searchInput.focus();
          } else {
             setView('home');
             const mainInput = document.querySelector('textarea') as HTMLTextAreaElement;
             if(mainInput) mainInput.focus();
          }
        }, 100);
      }

      // Ctrl + H for History
      if ((e.ctrlKey || e.metaKey) && e.key === 'h') {
        e.preventDefault();
        setView('recents');
      }

      // Ctrl + L for Library
      if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
        e.preventDefault();
        setView('library');
      }
      
      // Ctrl + C to copy result
      if ((e.ctrlKey || e.metaKey) && e.key === 'c' && view === 'result' && !window.getSelection()?.toString()) {
        e.preventDefault();
        navigator.clipboard.writeText(result);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [view, result]);

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
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    
    setChatHistory(prev => [...prev, { role: 'user', text: instruction }]);
    setRefineInput('');
    setIsGenerating(true);
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'refine',
          apiKey: geminiApiKey,
          instruction,
          result,
          isVoice,
          modelType,
          user,
        }),
      });

      if (!response.ok) throw new Error(await response.text());
      const data = await response.json();
      
      let fullText = data.text || "";
      if (fullText.startsWith('```markdown')) fullText = fullText.replace(/^```markdown\n?/, '').replace(/\n?```$/, '');
      else if (fullText.startsWith('```')) fullText = fullText.replace(/^```\n?/, '').replace(/\n?```$/, '');
      
      setResult(fullText.trim());
      
      setChatHistory(prev => [...prev, { role: 'model', text: 'Prompt updated.' }]);
    } catch(e) {
      console.error(e);
      setChatHistory(prev => [...prev, { role: 'model', text: 'Sorry, an error occurred.' }]);
    } finally {
      setIsGenerating(false);
    }
  }, [result, geminiApiKey, modelType, user]);

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
    if (currentResult.type === 'spec') filename = 'SPEC.md';
    
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
  const claudeCodeUrl = `claude-cli://open?prompt=${encodeURIComponent(result)}`;
  const conductorUrl = `conductor://prompt=${encodeURIComponent(result)}`;
  const modelLabel = modelType === 'ultra-fast' ? 'Ultra Fast' : modelType === 'super-agent' ? 'Super Agents' : 'Lite';
  const superAgents = [
    {
      id: 'researcher',
      name: 'Researcher',
      description: 'Supported Grounding with Google Search for current context.',
      color: '#efe2c8',
      image: 'https://i.ibb.co/CSH6NMB/Kawaii-blob-character-with-beret-202605171327-modified.png',
      hat: true,
      lashes: false,
      status: 'Grounding with Google Search completed',
    },
    {
      id: 'validator',
      name: 'Validator',
      description: 'Validates the idea before generation starts.',
      color: '#f3dccd',
      image: 'https://i.ibb.co/qFPQ48YJ/Kawaii-blob-character-with-check-202605171327-modified.png',
      hat: false,
      lashes: true,
      status: 'Idea validation completed',
    },
    {
      id: 'designer',
      name: 'Designer',
      description: 'Inspects provided designs and analyzes visual direction.',
      color: '#ead8b6',
      image: 'https://i.ibb.co/xqBpN9pg/Kawaii-blob-character-with-beret-202605171327-1-modified.png',
      hat: false,
      lashes: true,
      status: 'Design analysis completed',
    },
    {
      id: 'engineer',
      name: 'Engineer',
      description: 'Writes backend instructions and merges agent findings.',
      color: '#f4e9d2',
      image: 'https://i.ibb.co/vvJdcKmC/Blob-character-with-headset-and-202605171327-modified.png',
      hat: true,
      lashes: false,
      status: 'Backend instructions completed',
    },
    {
      id: 'composer',
      name: 'Composer',
      description: 'Combines all agent work into one final prompt.',
      color: '#e6d2bd',
      image: 'https://i.ibb.co/NdQ7fcTw/Kawaii-blob-character-with-docum-202605171327-modified.png',
      hat: false,
      lashes: false,
      status: 'Final prompt assembly completed',
    },
  ];
  const weeklyEvent = {
    id: 'chrome-extension-discover-skills-super-agent-2026-05',
    title: 'New weekly event',
    body: 'New Chrome extension, new way to discover and get skills, new super agent.',
  };
  const discoveryTabs = [
    { label: 'Discover', view: 'discover' as const, icon: Discover },
    { label: 'Skills', view: 'skills' as const, icon: Clipboard },
    { label: 'Library', view: 'library' as const, icon: FolderLibrary },
    { label: 'Labs', view: 'labs' as const, icon: Labs },
  ];
  const discoverTickerItems = [
    'LaunchFlow app',
    'Prompt: AI habit coach',
    'Skill: repo migration reviewer',
    'Article: better agent handoffs',
    'CanvasKit app',
    'Prompt: dark SaaS dashboard',
    'Skill: support inbox triage',
    'Article: prompt systems that scale',
  ];
  const skillsTickerItems = [
    'Skill: code review copilot',
    'Skill: Vercel deploy fixer',
    'Skill: design-system auditor',
    'Skill: GitHub PR closer',
    'Skill: spreadsheet analyst',
    'Skill: iOS simulator debugger',
    'Skill: launch checklist agent',
    'Skill: support request sorter',
  ];
  const labsTickerItems = [
    'Experiment: prompt scoring',
    'Lab: agent memory',
    'Prototype: voice flows',
    'Test: design critique',
    'Sandbox: prompt variants',
    'Preview: chrome extension',
    'Experiment: skill publishing',
    'Lab: workflow recipes',
  ];
  const agentSkills: AgentSkill[] = [
    {
      slug: '/cinematic-motion-language',
      name: 'cinematic-motion-language',
      description: 'Structured prompt vocabulary for high-precision cinematic video generation and motion direction.',
      category: 'Video',
      installs: 214,
      pixels: [4,5,6,11,13,18,20,25,26,27,28,29,34,36,42,44,49,50,51],
      content: `---
name: cinematic-motion-language
description: Structured prompt vocabulary for high-precision cinematic video generation and motion direction.
---

Use this skill when the user wants cinematic movement, camera language, shot composition, pacing, or production-ready video prompts.

Translate rough visual intent into precise shot language. Include camera movement, lens feel, subject blocking, atmosphere, lighting, pacing, and transition notes. Keep prompts concrete and avoid vague words like cinematic unless you define the exact visual behavior.

Return a compact shot plan followed by a final generation prompt.`
    },
    {
      slug: '/interface-critic',
      name: 'interface-critic',
      description: 'Audit screens for hierarchy, density, spacing, contrast, and product-quality interaction polish.',
      category: 'Design',
      installs: 188,
      pixels: [2,3,4,5,10,13,18,21,26,27,28,29,34,37,42,45,50,51,52,53],
      content: `---
name: interface-critic
description: Audit screens for hierarchy, density, spacing, contrast, and product-quality interaction polish.
---

Use this skill when the user wants a UI reviewed, tightened, or made more professional.

Inspect the interface like a senior product designer. Prioritize layout hierarchy, information density, spacing rhythm, control affordance, visual consistency, copy clarity, and accessibility. Give direct fixes, not generic praise.

Return findings ordered by user impact, then a short implementation checklist.`
    },
    {
      slug: '/vercel-deploy-fixer',
      name: 'vercel-deploy-fixer',
      description: 'Diagnose Vercel build failures, package issues, env gaps, and Next.js deployment regressions.',
      category: 'Engineering',
      installs: 301,
      pixels: [8,9,14,15,20,21,26,27,28,29,34,35,40,41,46,47,52,53],
      content: `---
name: vercel-deploy-fixer
description: Diagnose Vercel build failures, package issues, env gaps, and Next.js deployment regressions.
---

Use this skill when a Vercel deploy or Next.js production build fails.

Start from the exact failing command and log line. Reproduce locally when possible. Check dependency installs, type errors, route runtime constraints, missing environment variables, server/client boundaries, and build-only behavior.

Return the root cause, the minimal patch, and the verification command.`
    },
    {
      slug: '/prompt-architect',
      name: 'prompt-architect',
      description: 'Turn messy app ideas into complete AI coding prompts with scope, UX, data, and edge cases.',
      category: 'Prompting',
      installs: 267,
      pixels: [1,2,8,9,15,16,22,23,24,25,29,30,36,37,43,44,50,51],
      content: `---
name: prompt-architect
description: Turn messy app ideas into complete AI coding prompts with scope, UX, data, and edge cases.
---

Use this skill when the user has a rough product idea and needs a build-ready coding prompt.

Extract the product goal, core workflows, target user, data model, UI states, integrations, constraints, and acceptance criteria. Fill small gaps with sensible defaults and clearly mark assumptions.

Return a polished prompt that another AI coding agent can execute without follow-up questions.`
    },
    {
      slug: '/repo-cartographer',
      name: 'repo-cartographer',
      description: 'Map unfamiliar codebases fast and explain the files, flows, risks, and edit points.',
      category: 'Codebase',
      installs: 156,
      pixels: [7,8,9,13,19,20,21,25,31,32,33,37,43,44,45,49,55,56,57],
      content: `---
name: repo-cartographer
description: Map unfamiliar codebases fast and explain the files, flows, risks, and edit points.
---

Use this skill when entering a new repository or planning a feature across unknown code.

Identify the app structure, key routes, shared components, state boundaries, APIs, persistence, tests, and deployment assumptions. Prefer evidence from files over guesses.

Return a concise map with likely edit locations and the safest next steps.`
    },
    {
      slug: '/growth-copy-lab',
      name: 'growth-copy-lab',
      description: 'Write concise launch copy, feature messaging, CTAs, and product page sections.',
      category: 'Marketing',
      installs: 129,
      pixels: [3,4,5,11,12,13,19,20,21,27,28,29,35,36,37,45,46,47,53],
      content: `---
name: growth-copy-lab
description: Write concise launch copy, feature messaging, CTAs, and product page sections.
---

Use this skill when the user needs product copy that is clear, useful, and conversion-aware.

Anchor copy in the product's actual job-to-be-done. Avoid inflated claims. Create variants for headlines, subcopy, CTA labels, release notes, and short social posts.

Return the strongest recommendation first, followed by alternates.`
    },
    {
      slug: '/qa-pathfinder',
      name: 'qa-pathfinder',
      description: 'Create focused manual and automated test paths for risky app changes.',
      category: 'Testing',
      installs: 175,
      pixels: [0,1,2,8,16,17,18,24,32,33,34,40,48,49,50,56,57,58],
      content: `---
name: qa-pathfinder
description: Create focused manual and automated test paths for risky app changes.
---

Use this skill when a feature needs practical verification without bloated test plans.

Identify the highest-risk flows, regression surfaces, browser/device considerations, auth states, empty states, and failure modes. Recommend the smallest useful set of manual checks and automated tests.

Return a checklist grouped by priority.`
    },
    {
      slug: '/support-triage-agent',
      name: 'support-triage-agent',
      description: 'Classify user feedback, extract root issues, and draft calm support responses.',
      category: 'Support',
      installs: 143,
      pixels: [6,7,8,14,20,21,22,28,34,35,36,42,48,49,50,54,55,56],
      content: `---
name: support-triage-agent
description: Classify user feedback, extract root issues, and draft calm support responses.
---

Use this skill when reviewing support messages, bug reports, or feature requests.

Separate symptoms from likely causes. Classify urgency, product area, user intent, and needed follow-up. Draft a concise response that acknowledges the issue without overpromising.

Return triage metadata, next action, and the customer-facing reply.`
    },
    {
      slug: '/launch-readiness',
      name: 'launch-readiness',
      description: 'Run a final launch checklist across UX, auth, billing, SEO, analytics, and reliability.',
      category: 'Launch',
      installs: 232,
      pixels: [10,11,12,18,19,20,26,27,28,29,30,36,37,38,44,45,46,52],
      content: `---
name: launch-readiness
description: Run a final launch checklist across UX, auth, billing, SEO, analytics, and reliability.
---

Use this skill before shipping a product, feature, or public launch.

Check onboarding, empty states, broken links, auth boundaries, payment flows, metadata, analytics events, error handling, mobile behavior, and rollback readiness.

Return blockers first, then nice-to-have polish.`
    },
    {
      slug: '/agent-memory-editor',
      name: 'agent-memory-editor',
      description: 'Convert repeated user preferences and workflows into clean reusable agent memory.',
      category: 'Agents',
      installs: 119,
      pixels: [5,6,13,14,21,22,28,29,30,35,36,37,43,44,50,51,52,53],
      content: `---
name: agent-memory-editor
description: Convert repeated user preferences and workflows into clean reusable agent memory.
---

Use this skill when the user wants durable preferences, project context, or reusable working rules captured.

Distill only stable, useful information. Avoid saving one-off facts, secrets, or guesses. Write memory as short operational guidance an agent can follow later.

Return proposed memory entries and ask for confirmation before saving.`
    },
  ];
  const filteredAgentSkills = agentSkills.filter((skill) => {
    const q = skillSearch.trim().toLowerCase();
    if (!q) return true;
    return [skill.name, skill.slug, skill.description, skill.category].some((value) => value.toLowerCase().includes(q));
  });
  const renderDiscoveryTopBar = () => (
    <div className="fixed left-1/2 top-5 z-[70] -translate-x-1/2">
      <div className="flex items-center gap-1 rounded-full border border-white/5 bg-[#171717]/95 p-1 shadow-[0_12px_36px_rgba(0,0,0,0.32)] backdrop-blur-xl">
        {discoveryTabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.view}
              onClick={() => setView(tab.view)}
              className={`flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors ${view === tab.view ? 'bg-[#2b2b2b] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]' : 'text-zinc-400 hover:text-zinc-100'}`}
            >
              <Icon size={15} />
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
  const renderMovingHero = (
    title: string,
    subtitle: string,
    items: string[],
  ) => (
    <section className="relative w-full overflow-hidden px-6 py-20 text-center">
      <div className="pointer-events-none absolute inset-0 opacity-30">
        {[0, 1, 2].map((row) => (
          <motion.div
            key={row}
            animate={{ x: row % 2 === 0 ? ['0%', '-50%'] : ['-50%', '0%'] }}
            transition={{ duration: 28 + row * 4, repeat: Infinity, ease: 'linear' }}
            className={`absolute left-0 flex w-max items-center gap-6 ${row === 0 ? 'top-5' : row === 1 ? 'top-20' : 'bottom-7'}`}
          >
            {[...items, ...items].map((item, index) => (
              <span
                key={`${row}-${item}-${index}`}
                className="whitespace-nowrap text-sm font-medium text-zinc-500/80"
              >
                {item}
              </span>
            ))}
          </motion.div>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 z-[1] w-40 bg-gradient-to-r from-[#070707] via-[#070707]/85 to-transparent backdrop-blur-[3px]" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-[1] w-40 bg-gradient-to-l from-[#070707] via-[#070707]/85 to-transparent backdrop-blur-[3px]" />
      <div className="relative z-10 mx-auto max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight text-white">{title}</h1>
        <p className="mt-4 text-sm leading-relaxed text-zinc-400">{subtitle}</p>
      </div>
    </section>
  );

  const renderSkillPixelVisual = (skill: AgentSkill, size = 'md') => {
    const large = size === 'lg';
    const iconType = agentSkills.findIndex((item) => item.slug === skill.slug) % 5;
    return (
      <div className={`${large ? 'h-24 w-24' : 'h-20 w-20'} shrink-0 text-zinc-100`}>
        <svg viewBox="0 0 80 80" className="h-full w-full overflow-visible" shapeRendering="crispEdges" aria-hidden="true">
          <rect x="26" y="54" width="28" height="18" fill="#efefef" />
          <rect x="22" y="68" width="36" height="6" fill="#b8b8b8" />
          <rect x="30" y="54" width="4" height="20" fill="#202020" />
          <rect x="46" y="54" width="4" height="20" fill="#202020" />
          <circle cx="40" cy="34" r="29" fill="#f4f4f4" />
          <circle cx="40" cy="34" r="29" fill="none" stroke="#9f9f9f" strokeWidth="4" />
          <rect x="14" y="17" width="52" height="8" fill="#d4d4d4" />
          <rect x="18" y="28" width="44" height="16" fill="#1a1a1a" />
          <rect x="24" y="32" width="8" height="8" fill="#f2f2f2" />
          <rect x="48" y="32" width="8" height="8" fill="#f2f2f2" />
          <rect x="34" y="46" width="12" height="5" fill="#1a1a1a" />
          {iconType === 0 && (
            <>
              <rect x="26" y="10" width="28" height="5" fill="#202020" />
              <rect x="30" y="4" width="20" height="8" fill="#d8d8d8" />
              <rect x="33" y="4" width="14" height="8" fill="#202020" />
            </>
          )}
          {iconType === 1 && (
            <>
              <rect x="19" y="46" width="6" height="18" fill="#2a2a2a" />
              <rect x="55" y="46" width="6" height="18" fill="#2a2a2a" />
              <rect x="26" y="24" width="28" height="4" fill="#8e8e8e" />
            </>
          )}
          {iconType === 2 && (
            <>
              <rect x="20" y="29" width="8" height="3" fill="#c8c8c8" />
              <rect x="52" y="29" width="8" height="3" fill="#c8c8c8" />
              <rect x="36" y="10" width="8" height="8" fill="#202020" />
            </>
          )}
          {iconType === 3 && (
            <>
              <rect x="14" y="38" width="8" height="5" fill="#bdbdbd" />
              <rect x="58" y="38" width="8" height="5" fill="#bdbdbd" />
              <rect x="31" y="51" width="18" height="4" fill="#8f8f8f" />
            </>
          )}
          {iconType === 4 && (
            <>
              <rect x="27" y="30" width="5" height="12" fill="#d0d0d0" />
              <rect x="48" y="30" width="5" height="12" fill="#d0d0d0" />
              <rect x="34" y="14" width="12" height="5" fill="#1a1a1a" />
            </>
          )}
          {skill.pixels.slice(0, 12).map((pixel, index) => (
            <rect
              key={`${skill.slug}-detail-${pixel}`}
              x={18 + (pixel % 8) * 6}
              y={18 + Math.floor(index / 4) * 9}
              width="4"
              height="4"
              fill={index % 2 === 0 ? '#111111' : '#9d9d9d'}
              opacity="0.9"
            />
          ))}
        </svg>
      </div>
    );
  };

  const renderAgentFace = (agent: typeof superAgents[number], index: number, compact = false) => (
    <div className="group relative flex flex-col items-center">
      <motion.div
        initial={{ y: 6, opacity: 0, scale: 0.96 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ delay: index * 0.05, duration: 0.28 }}
        className={`${compact ? 'h-11 w-11' : 'h-16 w-16'} relative overflow-hidden rounded-full bg-[#f1f1ef] shadow-[0_10px_28px_rgba(0,0,0,0.28)] ring-[3px] ring-[#2a2a2a]`}
      >
        <img src={agent.image} alt="" className="h-full w-full object-cover" />
      </motion.div>
      {!compact && (
        <div className="pointer-events-none absolute top-full z-20 mt-3 w-52 rounded-2xl bg-[#1b1b1b] px-4 py-3 text-center opacity-0 shadow-2xl transition-opacity group-hover:opacity-100">
          <div className="text-sm font-bold text-white">{agent.name}</div>
          <div className="mt-1 text-xs leading-relaxed text-zinc-400">{agent.description}</div>
        </div>
      )}
    </div>
  );

  const copySkill = (skill: AgentSkill) => {
    navigator.clipboard.writeText(skill.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const downloadSkill = (skill: AgentSkill) => {
    const blob = new Blob([skill.content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${skill.name}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const renderSkillsCatalog = () => (
    <div className="relative z-10 flex min-h-[120vh] w-full shrink-0 flex-col items-center px-6 pt-24 text-center">
      {renderDiscoveryTopBar()}
      {renderMovingHero(
        'Skills for repeatable agent work',
        'Browse ready-to-use agent skills for design, shipping, QA, support, prompts, and codebase work.',
        skillsTickerItems,
      )}

      <div className="sticky bottom-6 z-30 mt-2 flex w-full justify-center">
        <div className="flex w-full max-w-md items-center gap-3 rounded-full bg-[#242424]/95 px-5 py-3 shadow-[0_18px_48px_rgba(0,0,0,0.34)] backdrop-blur-xl">
          <Search size={17} className="shrink-0 text-zinc-500" />
          <input
            value={skillSearch}
            onChange={(e) => setSkillSearch(e.target.value)}
            placeholder="Search skills"
            className="w-full bg-transparent text-sm font-medium text-zinc-100 outline-none placeholder:text-zinc-500"
          />
        </div>
      </div>

      <div className="mt-10 grid w-full max-w-7xl grid-cols-2 gap-x-12 gap-y-2 pb-32 text-left">
        {filteredAgentSkills.map((skill, index) => (
          <motion.button
            key={skill.slug}
            type="button"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.035 }}
            onClick={() => setSelectedSkillCard(skill)}
            className="group flex min-w-0 items-center gap-5 rounded-[24px] px-4 py-3 text-left transition-colors hover:bg-white/[0.04]"
          >
            {renderSkillPixelVisual(skill)}
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-[17px] font-bold text-zinc-100">{skill.slug}</h3>
              <p className="mt-1 truncate text-[15px] leading-relaxed text-zinc-500">{skill.description}</p>
            </div>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1b1b1b] text-zinc-400 transition-colors group-hover:bg-[#2a2a2a] group-hover:text-white">
              <Plus size={19} />
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );

  const isDesktopWeb = () => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(min-width: 768px)').matches && !/Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  };

  const ensureNotificationPermission = async () => {
    if (typeof window === 'undefined' || !('Notification' in window) || !isDesktopWeb()) return false;
    if (Notification.permission === 'granted') return true;
    if (Notification.permission === 'denied') return false;
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  };

  const showDesktopNotification = useCallback(async (title: string, options: NotificationOptions = {}) => {
    if (typeof window === 'undefined' || !('Notification' in window) || !isDesktopWeb()) return;
    if (Notification.permission !== 'granted') return;

    const payload = {
      badge: '/notification-icon.svg',
      icon: '/notification-icon.svg',
      ...options,
    };

    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        registration.showNotification(title, payload);
        return;
      }
    }

    new Notification(title, payload);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator) || !isDesktopWeb()) return;
    navigator.serviceWorker.register('/sw.js').catch((error) => {
      console.warn('Notification service worker registration failed', error);
    });
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || !isDesktopWeb() || !('Notification' in window)) return;
    if (Notification.permission !== 'granted') return;
    const seenWeeklyEventId = localStorage.getItem('kindly_prompt_seen_weekly_event_id');
    if (seenWeeklyEventId === weeklyEvent.id) return;
    localStorage.setItem('kindly_prompt_seen_weekly_event_id', weeklyEvent.id);
    showDesktopNotification(weeklyEvent.title, {
      body: weeklyEvent.body,
      tag: `weekly-event-${weeklyEvent.id}`,
      data: { view: 'event' },
    });
  }, [showDesktopNotification, weeklyEvent.id, weeklyEvent.body, weeklyEvent.title]);

  const generatePrompt = async (text: string, image: string | null = null) => {
    if (!text.trim() && !image) return;
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    ensureNotificationPermission();
    setIsGenerating(true);
    setView('result');
    try {
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

      setStreamedResult('');
      setAgentLogs([{ id: 'start', text: 'Initializing...', type: 'info' }]);
      if (modelType === 'super-agent') {
        setAgentLogs([{ id: 'start', text: 'Super Agents starting...', type: 'info' }]);
        superAgents.forEach((agent, index) => {
          setTimeout(() => {
            setAgentLogs(prev => [
              ...prev.filter(log => log.id !== `agent-${agent.id}`),
              { id: `agent-${agent.id}`, text: `${agent.name}: ${agent.status}`, type: index === 0 ? 'search' : index === 3 ? 'code' : 'info' },
            ]);
          }, 350 + index * 420);
        });
      }

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate',
          apiKey: geminiApiKey,
          modelType,
          selectedTool,
          contents: contentsObj,
          user,
        }),
      });

      if (!response.ok) throw new Error(await response.text());
      const data = await response.json();
      
      let fullJsonText = data.text || "";
      setStreamedResult(fullJsonText);
      
      // Update logs if grounding info exists
      const candidates = data.candidates;
      if (candidates?.[0]?.groundingMetadata?.webSearchQueries?.length) {
        candidates[0].groundingMetadata.webSearchQueries.forEach((query: string) => {
          setAgentLogs(prev => {
            if (prev.some(log => log.text === `Searching web: ${query}`)) return prev;
            return [...prev, { id: Math.random().toString(), text: `Searching web: ${query}`, type: 'search' }];
          });
        });
      }
      if (candidates?.[0]?.groundingMetadata?.groundingChunks?.length) {
        candidates[0].groundingMetadata.groundingChunks.forEach((c: any) => {
          if (c.web?.uri) {
            setAgentLogs(prev => {
              try {
                const urlObj = new URL(c.web.uri);
                const hostname = urlObj.hostname.replace(/^www\./, '');
                if (prev.some(log => log.text === `Reading ${hostname}`)) return prev;
                return [...prev, { id: Math.random().toString(), text: `Reading ${hostname}`, type: 'read' }];
              } catch (e) {
                return prev;
              }
            });
          }
        });
      }
      
      const responseText = fullJsonText || '{}';
      try {
        const parsed = JSON.parse(responseText);
        const newItem = {
          title: parsed.title || 'Generated App',
          prompt: parsed.prompt || result || 'Failed to parse prompt.',
          svg: parsed.svg_icon || `<svg viewBox="0 0 48 48"><rect x="8" y="8" width="32" height="32" rx="4" fill="#27272a" /></svg>`,
          type: selectedTool,
          date: new Date().toISOString()
        };
        setCurrentResult(newItem);
        setRecents(prev => [newItem, ...prev]);
        setResult(newItem.prompt);
        showDesktopNotification('Your prompt is ready', {
          body: `${newItem.title} has finished generating.`,
          tag: `prompt-generated-${newItem.date}`,
          data: { view: 'result' },
        });
      } catch (err) {
        setResult(responseText);
        showDesktopNotification('Your prompt is ready', {
          body: 'Your generated prompt has finished.',
          tag: 'prompt-generated-latest',
          data: { view: 'result' },
        });
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
      <div className="md:hidden absolute inset-0 z-[9999] bg-black flex items-center justify-center p-6 text-center">
        <p className="text-zinc-400 font-medium tracking-wide">Mobile version coming soon</p>
      </div>
      <AnimatePresence>
        {showSplash && (
          <motion.div
            initial={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 z-[100] flex flex-col items-center justify-center bg-[#050505]"
          >
            <motion.img 
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
              src="https://i.ibb.co/WL4x4zC/AI-text-generation-app-icon-202605140740-modified.png" 
              alt="Kindly Prompt Logo" 
              className="w-24 h-24 rounded-[28px] shadow-2xl border border-white/5 mb-6" 
            />
            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
              className="text-3xl font-medium tracking-tight text-white mb-2"
            >
              Kindly Prompt
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.3 }}
              className="text-sm text-zinc-500 font-medium tracking-wide uppercase"
            >
              AI Workspace
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {view === 'home' && (
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
                  animate={{ x: [0, -12, 0, 12, 0] }}
                  onDragEnd={(e, info) => {
                    if (info.offset.x < -60 || info.velocity.x < -400) {
                      setShowApiKeyInput(true);
                    } else if (info.offset.x > 60 || info.velocity.x > 400) {
                      setUser(null);
                    }
                  }}
                  whileTap={{ scale: 0.98, cursor: 'grabbing' }}
                  className="bg-[#2a2a2a] text-zinc-300 text-sm font-medium px-1.5 py-1.5 pr-6 rounded-full flex items-center gap-3 cursor-grab relative z-10 touch-pan-y shadow-[0_0_15px_rgba(0,0,0,0.5)]"
                  transition={{
                    x: { duration: 1.8, repeat: Infinity, repeatDelay: 7, ease: 'easeInOut' },
                    scale: { type: "spring", bounce: 0.3, duration: 0.6 }
                  }}
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
      )}

      <AnimatePresence>
        {view === 'home' && !supportNoticeHidden && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="absolute top-5 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 text-sm font-semibold text-zinc-300"
          >
            <button
              onClick={() => setSupportNoticeView('venmo')}
              className="flex items-center gap-2 text-zinc-300 hover:text-white transition-colors"
            >
              <svg className="h-4 w-4 shrink-0" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 65 65">
                <mask id="gemini-support-mask" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="0" y="0" width="65" height="65">
                  <path d="M32.447 0c.68 0 1.273.465 1.439 1.125a38.904 38.904 0 001.999 5.905c2.152 5 5.105 9.376 8.854 13.125 3.751 3.75 8.126 6.703 13.125 8.855a38.98 38.98 0 005.906 1.999c.66.166 1.124.758 1.124 1.438 0 .68-.464 1.273-1.125 1.439a38.902 38.902 0 00-5.905 1.999c-5 2.152-9.375 5.105-13.125 8.854-3.749 3.751-6.702 8.126-8.854 13.125a38.973 38.973 0 00-2 5.906 1.485 1.485 0 01-1.438 1.124c-.68 0-1.272-.464-1.438-1.125a38.913 38.913 0 00-2-5.905c-2.151-5-5.103-9.375-8.854-13.125-3.75-3.749-8.125-6.702-13.125-8.854a38.973 38.973 0 00-5.905-2A1.485 1.485 0 010 32.448c0-.68.465-1.272 1.125-1.438a38.903 38.903 0 005.905-2c5-2.151 9.376-5.104 13.125-8.854 3.75-3.749 6.703-8.125 8.855-13.125a38.972 38.972 0 001.999-5.905A1.485 1.485 0 0132.447 0z" fill="#000"/>
                </mask>
                <g mask="url(#gemini-support-mask)">
                  <path d="M-5.859 50.734c7.498 2.663 16.116-2.33 19.249-11.152 3.133-8.821-.406-18.131-7.904-20.794-7.498-2.663-16.116 2.33-19.25 11.151-3.132 8.822.407 18.132 7.905 20.795z" fill="#FFE432"/>
                  <path d="M27.433 21.649c10.3 0 18.651-8.535 18.651-19.062 0-10.528-8.35-19.062-18.651-19.062S8.78-7.94 8.78 2.587c0 10.527 8.35 19.062 18.652 19.062z" fill="#FC413D"/>
                  <path d="M20.184 82.608c10.753-.525 18.918-12.244 18.237-26.174-.68-13.93-9.95-24.797-20.703-24.271C6.965 32.689-1.2 44.407-.519 58.337c.681 13.93 9.95 24.797 20.703 24.271z" fill="#00B95C"/>
                  <path d="M67.391 42.993c10.132 0 18.346-7.91 18.346-17.666 0-9.757-8.214-17.667-18.346-17.667s-18.346 7.91-18.346 17.667c0 9.757 8.214 17.666 18.346 17.666z" fill="#3186FF"/>
                  <path d="M-13.065 40.944c9.33 7.094 22.959 4.869 30.442-4.972 7.483-9.84 5.987-23.569-3.343-30.663C4.704-1.786-8.924.439-16.408 10.28c-7.483 9.84-5.986 23.57 3.343 30.664z" fill="#FBBC04"/>
                  <path d="M34.74 51.43c11.135 7.656 25.896 5.524 32.968-4.764 7.073-10.287 3.779-24.832-7.357-32.488C49.215 6.52 34.455 8.654 27.382 18.94c-7.072 10.288-3.779 24.833 7.357 32.49z" fill="#3186FF"/>
                  <path d="M54.984-2.336c2.833 3.852-.808 11.34-8.131 16.727-7.324 5.387-15.557 6.631-18.39 2.78-2.833-3.853.807-11.342 8.13-16.728 7.324-5.387 15.558-6.631 18.39-2.78z" fill="#749BFF"/>
                  <path d="M31.727 16.104C43.053 5.598 46.94-8.626 40.41-15.666c-6.53-7.04-21.006-4.232-32.332 6.274s-15.214 24.73-8.683 31.77c6.53 7.04 21.006 4.232 32.332-6.274z" fill="#FC413D"/>
                  <path d="M8.51 53.838c6.732 4.818 14.46 5.55 17.262 1.636 2.802-3.915-.384-10.994-7.116-15.812-6.731-4.818-14.46-5.55-17.261-1.636-2.802 3.915.383 10.994 7.115 15.812z" fill="#FFEE48"/>
                </g>
              </svg>
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={supportNoticeView}
                  initial={{ opacity: 0, x: supportNoticeView === 'venmo' ? 18 : -18 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: supportNoticeView === 'venmo' ? -18 : 18 }}
                  transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                  className="block whitespace-nowrap"
                >
                  {supportNoticeView === 'venmo'
                    ? 'Venmo @rocioramirezpena'
                    : 'Gemini consumes AI credits support us'}
                </motion.span>
              </AnimatePresence>
            </button>
            <button
              onClick={() => {
                if (supportNoticeView === 'venmo') {
                  setSupportNoticeView('message');
                } else {
                  setSupportNoticeHidden(true);
                }
              }}
              className="text-zinc-600 hover:text-zinc-300 transition-colors"
              aria-label={supportNoticeView === 'venmo' ? 'Go back' : 'Close support notice'}
            >
              <X size={14} strokeWidth={1.7} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Left Vertical Nav Bar */}
      <AnimatePresence>
        {view !== 'edit' && (
          <>
          <motion.aside
            animate={{ width: isSidebarExpanded ? 220 : 48 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed top-0 bottom-0 left-0 z-50 bg-[#1f1f1f] flex flex-col pt-3 pb-6 gap-6 overflow-hidden"
          >
            {isSidebarExpanded ? (
              <div className="mx-2 flex flex-col gap-[2px]">
                <button
                  type="button"
                  onClick={() => setIsAppSwitcherOpen((value) => !value)}
                  className={`flex h-14 w-full items-center justify-between px-4 text-left transition-all duration-300 ease-out ${
                    isAppSwitcherOpen
                      ? 'rounded-t-[28px] rounded-b-[10px] bg-[#262626]'
                      : 'rounded-full bg-[#1f1f1f] hover:bg-[#262626]'
                  }`}
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <img src="https://i.ibb.co/CpDQrQc9/Change-background-to-green-202605142004-removebg-preview.png" alt="Logo" className="h-6 w-6 shrink-0 object-contain opacity-90" />
                    <span className="min-w-0 truncate text-sm font-bold text-zinc-100">Kindly Prompt</span>
                  </div>
                  <ChevronDown size={14} className={`shrink-0 text-zinc-500 transition-transform duration-300 ${isAppSwitcherOpen ? 'rotate-180' : ''}`} />
                </button>
                <div className={`origin-top overflow-hidden transition-all duration-300 ease-out ${isAppSwitcherOpen ? 'max-h-[64px] scale-y-100 opacity-100' : 'max-h-0 scale-y-95 opacity-0'}`}>
                  <button
                    type="button"
                    className="flex h-12 w-full cursor-default items-center gap-3 rounded-t-[10px] rounded-b-[28px] bg-[#151515] px-4 text-left text-zinc-500 transition-colors hover:bg-[#1e1e1e]"
                    aria-disabled="true"
                  >
                    <AlignLeft size={18} className="shrink-0 text-zinc-500" />
                    <span className="truncate text-sm font-semibold">Kindly Agent</span>
                  </button>
                </div>
              </div>
            ) : (
              <a href="/" className="mx-auto flex-shrink-0 transition-opacity hover:opacity-80">
                <div className="w-10 h-10 rounded-full bg-[#2a2a2a] flex shrink-0 items-center justify-center overflow-hidden">
                   <img src="https://i.ibb.co/CpDQrQc9/Change-background-to-green-202605142004-removebg-preview.png" alt="Logo" className="w-[24px] h-[24px] object-contain" />
                </div>
              </a>
            )}
            
            <div className={`flex flex-col gap-2 w-full ${isSidebarExpanded ? 'items-stretch px-3' : 'items-center'}`}>
                {[
                  { label: 'New task', view: 'home' as const, icon: Plus, active: view === 'home' || view === 'result' },
                  { label: 'History', view: 'recents' as const, icon: History, active: view === 'recents' },
                  { label: 'Library', view: 'library' as const, icon: FolderLibrary, active: view === 'library' },
                  { label: 'Discover', view: 'discover' as const, icon: Discover, active: view === 'discover' },
                  { label: 'Skills', view: 'skills' as const, icon: Clipboard, active: view === 'skills' },
                  { label: 'Labs', view: 'labs' as const, icon: Labs, active: view === 'labs' },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <motion.button
                      key={item.label}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setView(item.view)}
                      className={`relative rounded-full flex items-center outline-none group h-10 transition-colors ${
                        isSidebarExpanded
                          ? `gap-3 px-3 justify-start ${item.active ? 'bg-[#2a2a2a]' : 'hover:bg-[#262626]'}`
                          : 'w-10 justify-center'
                      }`}
                      title={item.label}
                    >
                      <Icon size={20} strokeWidth={1.5} className={`shrink-0 transition-colors ${item.active ? 'text-white' : 'text-zinc-500 group-hover:text-zinc-300'}`} />
                      {isSidebarExpanded && <span className={`truncate text-sm font-semibold ${item.active ? 'text-white' : 'text-zinc-300'}`}>{item.label}</span>}
                    </motion.button>
                  );
                })}
              </div>
          </motion.aside>
          <button
            onClick={() => {
              setIsSidebarExpanded((value) => {
                if (value) setIsAppSwitcherOpen(false);
                return !value;
              });
            }}
            className={`fixed top-3 z-[60] flex h-9 w-9 items-center justify-center text-zinc-500 transition-all hover:text-white ${isSidebarExpanded ? 'left-[232px]' : 'left-[56px]'}`}
            title={isSidebarExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {isSidebarExpanded ? <SidebarLeft size={17} /> : <SidebarRight size={17} />}
          </button>
          </>
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
      
      <main
        className={`flex-1 relative overflow-y-auto h-full flex flex-col transition-[margin-left] duration-200 ease-out [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] ${view === 'preview' ? 'pt-0' : 'pt-16'}`}
        style={{ marginLeft: view !== 'edit' ? (isSidebarExpanded ? 220 : 48) : 0 }}
      >

      {view === 'home' ? (
        // HOME VIEW
        <div className="max-w-4xl mx-auto w-full px-4 pt-[15vh] pb-32 flex flex-col items-center">
          <div className="mb-8 flex flex-col items-center justify-center gap-5">
            {modelType === 'super-agent' ? (
              <div className="flex h-20 items-center justify-center -space-x-2">
                {superAgents.map((agent, index) => (
                  <div key={agent.id} className="transition-transform hover:z-10 hover:-translate-y-1">
                    {renderAgentFace(agent, index)}
                  </div>
                ))}
              </div>
            ) : (
              <motion.div
                animate={{
                  y: faceMood === 'focused' ? [0, -1, 0] : [0, 1, 0],
                  rotate: faceMood === 'curious' ? [0, -2, 2, 0] : 0
                }}
                transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                className="relative h-11 w-[72px] rounded-full bg-white shadow-[inset_0_-8px_12px_rgba(0,0,0,0.18),inset_0_6px_10px_rgba(255,255,255,0.85),0_12px_26px_rgba(0,0,0,0.42)] ring-1 ring-white/50"
                aria-hidden="true"
              >
                <div className="absolute inset-x-3 top-1 h-2 rounded-full bg-white/70 blur-[1px]" />
                <motion.span
                  animate={{ x: eyeShift, height: [16, 16, 3, 16, 16, 3, 16] }}
                  transition={{
                    x: { duration: 0.2 },
                    height: { duration: 10, repeat: Infinity, times: [0, 0.48, 0.5, 0.52, 0.94, 0.96, 1] }
                  }}
                  className="absolute left-[24px] top-[14px] h-4 w-2 rounded-full bg-black"
                />
                <motion.span
                  animate={{ x: eyeShift, y: faceMood === 'focused' ? -1 : 0, height: [16, 16, 3, 16] }}
                  transition={{
                    x: { duration: 0.2 },
                    y: { duration: 0.2 },
                    height: { duration: 10, repeat: Infinity, times: [0, 0.94, 0.96, 1] }
                  }}
                  className="absolute right-[24px] top-[14px] h-4 w-2 rounded-full bg-black"
                />
              </motion.div>
            )}
            <h1 className="text-3xl md:text-4xl font-medium tracking-tight">
              {selectedTool === 'prompt' ? 'What do you want to prompt?' : selectedTool === 'design' ? 'What do you want to design?' : selectedTool === 'skill' ? 'What do you want to build a skill for?' : 'What should SPEC.md define?'}
            </h1>
          </div>

          {/* Suggestions & Input Section */}
          <div className="flex flex-col items-center w-full max-w-[700px] relative mb-16">
            
            <div className="bg-[#1c1c1c] rounded-[32px] flex flex-col p-1 w-full relative z-10 transition-colors group shadow-2xl">
              
              <div className="bg-[#0f0f0f] rounded-[28px] p-3 flex flex-col relative">
                <div className="absolute top-4 left-4 z-10 flex gap-2">
                  {imageRef && (
                    <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-white/10 relative group/img">
                      <img src={imageRef} alt="Context" className="w-full h-full object-cover" />
                      <button 
                         onClick={() => setImageRef(null)} 
                         className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity"
                      >
                         <X size={14} className="text-white" />
                      </button>
                    </div>
                  )}

                  {attachedText && (
                    <div className="bg-[#222222] text-zinc-300 rounded-full pl-3 pr-2 py-1.5 flex items-center gap-2 h-[34px] border border-white/5">
                      <FileText size={14} className="text-zinc-400" />
                      <span className="text-xs font-medium max-w-[150px] truncate">{attachedText.name}</span>
                      <button 
                         onClick={() => setAttachedText(null)} 
                         className="text-zinc-500 hover:text-zinc-300 ml-1 rounded-full hover:bg-white/10 p-0.5 transition-colors"
                      >
                         <X size={12} />
                      </button>
                    </div>
                  )}
                </div>
                
                 <textarea
                  className={`w-full bg-transparent outline-none resize-none placeholder:text-zinc-500 text-zinc-100 text-[15px] leading-relaxed custom-scrollbar ${(imageRef || attachedText) ? (imageRef ? 'pt-16 min-h-[80px]' : 'pt-12 min-h-[70px]') : 'min-h-[30px]'}`}
                  placeholder={selectedTool === 'prompt' ? "Describe the app you want to build..." : selectedTool === 'design' ? "Describe your ideal user interface..." : selectedTool === 'skill' ? "Describe the agent skill you need..." : "Describe the unified spec you need..."}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onPaste={(e) => {
                    const pastedText = e.clipboardData.getData('text');
                    if (pastedText && pastedText.length > 300) {
                      e.preventDefault();
                      setAttachedText({ name: 'Attached text', content: pastedText });
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      if(input.trim() || imageRef || attachedText) {
                        // Include attached text in prompt logic later, for now just call generate
                        generatePrompt(attachedText ? `${input}\n\nAttached Data:\n${attachedText.content}` : input, imageRef);
                        setAttachedText(null);
                      }
                    }
                  }}
                />
                
                {/* Action Bar */}
                <div className="flex items-center justify-between mt-1">
                  <div className="flex items-center gap-3">
                    <input type="file" accept="image/*" id="input-upload" className="hidden" onChange={(e) => { if(e.target.files?.[0]) handleImageUpload(e.target.files[0]); setIsAddMenuOpen(false); }} />
                    <input type="file" accept="image/*" id="wireframe-upload" className="hidden" onChange={(e) => { 
                      if(e.target.files?.[0]) {
                        handleImageUpload(e.target.files[0]);
                        setInput((prev) => prev.trim() ? prev : 'Turn this wireframe image into a detailed AI coding prompt.');
                      }
                      setIsAddMenuOpen(false);
                    }} />
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setIsAddMenuOpen(!isAddMenuOpen)}
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-zinc-300 transition-colors cursor-pointer shrink-0 ${isAddMenuOpen ? 'bg-[#383838]' : 'bg-[#2a2a2a] hover:bg-[#383838]'}`}
                        aria-label="Add source"
                      >
                        <Plus size={16} />
                      </button>
                      <AnimatePresence>
                        {isAddMenuOpen && (
                          <>
                            <div className="fixed inset-0 z-40" onClick={() => setIsAddMenuOpen(false)} />
                            <motion.div
                              initial={{ opacity: 0, y: 8, scale: 0.96 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 8, scale: 0.96 }}
                              transition={{ duration: 0.15 }}
                              className="absolute bottom-full left-0 z-50 mb-2 w-56 rounded-2xl border border-white/10 bg-[#121212] p-1.5 shadow-2xl"
                            >
                              <label htmlFor="input-upload" className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[13px] font-medium text-zinc-300 transition-colors hover:bg-white/5 hover:text-white">
                                <ImageIcon size={16} className="text-zinc-500" />
                                Upload image
                              </label>
                              <label htmlFor="wireframe-upload" className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[13px] font-medium text-zinc-300 transition-colors hover:bg-white/5 hover:text-white">
                                <Paintbrush size={16} className="text-zinc-500" />
                                Upload wireframe image
                              </label>
                              <button
                                type="button"
                                onClick={attachFigmaLink}
                                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[13px] font-medium text-zinc-300 transition-colors hover:bg-white/5 hover:text-white"
                              >
                                <Link size={16} className="text-zinc-500" />
                                Figma link
                              </button>
                            </motion.div>
                          </>
                        )}
                      </AnimatePresence>
                    </div>

                    <div className="relative">
                      <div 
                        onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
                        className={`flex items-center gap-1.5 cursor-pointer px-3 py-1.5 rounded-full transition-colors whitespace-nowrap ${isModelDropdownOpen ? 'bg-[#2a2a2a]' : 'hover:bg-[#2a2a2a]'}`}
                      >
                        <span className="font-semibold text-white text-[13px]">{modelLabel}</span>
                        <ChevronDown size={14} className="text-zinc-500 ml-0.5" />
                      </div>
                      
                      <AnimatePresence>
                        {isModelDropdownOpen && (
                          <>
                            <div className="fixed inset-0 z-40" onClick={() => setIsModelDropdownOpen(false)} />
                            <motion.div
                              initial={{ opacity: 0, y: 10, scale: 0.95 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 10, scale: 0.95 }}
                              transition={{ duration: 0.15 }}
                              className="absolute top-full left-0 mt-2 bg-[#121212] border border-[#2a2a2a] rounded-2xl p-1.5 z-50 shadow-2xl min-w-[200px]"
                            >
                              <div className="flex flex-col gap-1">
                                <button
                                  onClick={() => { setModelType('ultra-fast'); setIsModelDropdownOpen(false); }}
                                  className={`w-full text-left px-3 py-2.5 rounded-full text-[13px] font-medium transition-colors ${modelType === 'ultra-fast' ? 'bg-[#2a2a2a] text-white' : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#1c1c1c]'}`}
                                >
                                  Ultra Fast
                                </button>
                                <button
                                  onClick={() => { setModelType('lite'); setIsModelDropdownOpen(false); }}
                                  className={`w-full text-left px-3 py-2.5 rounded-full text-[13px] font-medium transition-colors ${modelType === 'lite' ? 'bg-[#2a2a2a] text-white' : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#1c1c1c]'}`}
                                >
                                  Lite
                                </button>
                                <button
                                  onClick={() => { setModelType('super-agent'); setIsModelDropdownOpen(false); }}
                                  className={`w-full text-left px-3 py-2.5 rounded-full text-[13px] font-medium transition-colors flex items-center justify-between ${modelType === 'super-agent' ? 'bg-[#2a2a2a] text-white' : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#1c1c1c]'}`}
                                >
                                  <span>Super Agents</span>
                                  <Zap size={12} className={modelType === 'super-agent' ? 'text-white' : 'text-zinc-500'} />
                                </button>
                              </div>
                            </motion.div>
                          </>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={toggleComposerListening}
                      className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors shrink-0 ${isComposerListening ? 'bg-blue-500/15 text-blue-300' : 'bg-[#2a2a2a] text-zinc-300 hover:bg-[#383838]'}`}
                      aria-label={isComposerListening ? 'Stop voice input' : 'Start voice input'}
                    >
                      <Mic size={17} className={isComposerListening ? 'animate-pulse' : ''} />
                    </button>
                    <button
                      onClick={() => {
                        if(input.trim() || imageRef || attachedText) {
                          generatePrompt(attachedText ? `${input}\n\nAttached Data:\n${attachedText.content}` : input, imageRef);
                          setAttachedText(null);
                        }
                      }}
                      disabled={!input.trim() && !imageRef && !attachedText}
                      className="w-9 h-9 rounded-full bg-white hover:bg-zinc-200 disabled:opacity-50 flex items-center justify-center text-black transition-colors shrink-0"
                    >
                      <ArrowUp size={18} className="stroke-[2.5]" />
                    </button>
                  </div>
                </div>
              </div>

              <AnimatePresence initial={false}>
                {showSuggestions && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="p-3 pt-4">
                      {/* Tool Selection Chips */}
                      <div className="flex flex-wrap items-center gap-2 mb-4">
                        <button 
                          onClick={() => setSelectedTool('prompt')} 
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[13px] font-semibold transition-colors ${selectedTool === 'prompt' ? 'bg-[#333333] text-white' : 'bg-transparent text-zinc-400 hover:text-zinc-200'}`}
                        >
                           <PromptIcon size={14} /> Prompt
                        </button>
                        <button 
                          onClick={() => setSelectedTool('design')} 
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[13px] font-semibold transition-colors ${selectedTool === 'design' ? 'bg-[#333333] text-white' : 'bg-transparent text-zinc-400 hover:text-zinc-200'}`}
                        >
                           <Paintbrush size={14} /> Design
                        </button>
                        <button 
                          onClick={() => setSelectedTool('skill')} 
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[13px] font-semibold transition-colors ${selectedTool === 'skill' ? 'bg-[#333333] text-white' : 'bg-transparent text-zinc-400 hover:text-zinc-200'}`}
                        >
                           <Zap size={14} /> Skill
                        </button>
                        <button 
                          onClick={() => setSelectedTool('spec')} 
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[13px] font-semibold transition-colors ${selectedTool === 'spec' ? 'bg-[#333333] text-white' : 'bg-transparent text-zinc-400 hover:text-zinc-200'}`}
                        >
                           <FileText size={14} /> SPEC.md
                           <span className="rounded-md bg-[#10292e] px-1.5 py-0.5 text-[10px] font-black leading-none text-cyan-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_1px_0_rgba(0,0,0,0.35)]">
                             New
                           </span>
                        </button>
                      </div>

                      {/* In-Line Text Suggestions */}
                      <div className="flex flex-col gap-4 px-1 pb-1">
                         {(selectedTool === 'prompt' ? [
                           "Build a personal habit tracker with a dark UI",
                           "Create a real-time multiplayer drawing app",
                           "Generate a dashboard for tracking crypto prices"
                         ] : selectedTool === 'design' ? [
                           "Make a minimalist portfolio design with large typography",
                           "A dark-mode dashboard for tracking server analytics",
                           "A retro terminal UI for a weather app"
                         ] : selectedTool === 'skill' ? [
                           "Build an agent skill to read and parse local log files",
                           "Create a skill to search the web for recent news articles",
                           "Add a skill to securely connect to a PostgreSQL database"
                         ] : [
                           "Create a SPEC.md for a vibe coding prompt engineer",
                           "Unify prompt, design, skill, and research docs for a SaaS builder",
                           "Write a SPEC.md for an AI design review agent"
                         ]).map((suggestion, i) => (
                           <button 
                             key={i}
                             onClick={() => handleSuggestionClick(suggestion)}
                             className="text-left w-full flex items-center gap-4 text-[15px] text-zinc-300 hover:text-white transition-colors group"
                           >
                             <ArrowRight size={16} className="text-zinc-500 group-hover:text-zinc-400 shrink-0" strokeWidth={1.5} />
                             <span className="truncate">{suggestion}</span>
                           </button>
                         ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <button
              onClick={() => setShowSuggestions(!showSuggestions)}
              className="mt-3 w-12 h-1.5 rounded-full bg-zinc-600/50 hover:bg-zinc-500 transition-colors shrink-0"
              aria-label="Toggle suggestions"
            />
          </div>

          {/* Export Targets - Moved to bottom */}
          <div className="flex flex-wrap items-center justify-center gap-3 w-full max-w-2xl mt-4 pt-2">
            <span className="text-zinc-500 text-sm leading-none mr-2 hidden sm:flex items-center h-10">Works with:</span>
            
            <div className="bg-[#1f1f1f] hover:bg-[#2a2a2a] cursor-pointer transition-colors rounded-full px-5 py-2.5 flex items-center gap-2 border-none">
              <svg width="18" height="18" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fillRule="evenodd" clipRule="evenodd" d="M151.083 0c83.413 0 151.061 67.819 151.061 151.467v57.6h50.283c83.413 0 151.082 67.797 151.082 151.466 0 83.691-67.626 151.467-151.082 151.467H0V151.467C0 67.84 67.627 0 151.083 0z" fill="url(#prefix__paint0_radial_5_27)"/><defs><radialGradient id="prefix__paint0_radial_5_27" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="rotate(92.545 118.724 174.844) scale(480.474 650.325)"><stop offset=".25" stopColor="#FE7B02"/><stop offset=".433" stopColor="#FE4230"/><stop offset=".548" stopColor="#FE529A"/><stop offset=".654" stopColor="#DD67EE"/><stop offset=".95" stopColor="#4B73FF"/></radialGradient></defs></svg>
              <span className="text-zinc-300 text-sm font-medium">Lovable</span>
            </div>

            <div className="bg-[#1f1f1f] hover:bg-[#2a2a2a] cursor-pointer transition-colors rounded-full px-5 py-2.5 flex items-center gap-2 border-none">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" shapeRendering="geometricPrecision" textRendering="geometricPrecision" imageRendering="optimizeQuality" fillRule="evenodd" clipRule="evenodd" viewBox="0 0 512 509.64"><path fill="#D77655" d="M115.612 0h280.775C459.974 0 512 52.026 512 115.612v278.415c0 63.587-52.026 115.612-115.613 115.612H115.612C52.026 509.639 0 457.614 0 394.027V115.612C0 52.026 52.026 0 115.612 0z"/><path fill="#FCF2EE" fillRule="nonzero" d="M142.27 316.619l73.655-41.326 1.238-3.589-1.238-1.996-3.589-.001-12.31-.759-42.084-1.138-36.498-1.516-35.361-1.896-8.897-1.895-8.34-10.995.859-5.484 7.482-5.03 10.717.935 23.683 1.617 35.537 2.452 25.782 1.517 38.193 3.968h6.064l.86-2.451-2.073-1.517-1.618-1.517-36.776-24.922-39.81-26.338-20.852-15.166-11.273-7.683-5.687-7.204-2.451-15.721 10.237-11.273 13.75.935 3.513.936 13.928 10.716 29.749 23.027 38.848 28.612 5.687 4.727 2.275-1.617.278-1.138-2.553-4.271-21.13-38.193-22.546-38.848-10.035-16.101-2.654-9.655c-.935-3.968-1.617-7.304-1.617-11.374l11.652-15.823 6.445-2.073 15.545 2.073 6.547 5.687 9.655 22.092 15.646 34.78 24.265 47.291 7.103 14.028 3.791 12.992 1.416 3.968 2.449-.001v-2.275l1.997-26.641 3.69-32.707 3.589-42.084 1.239-11.854 5.863-14.206 11.652-7.683 9.099 4.348 7.482 10.716-1.036 6.926-4.449 28.915-8.72 45.294-5.687 30.331h3.313l3.792-3.791 15.342-20.372 25.782-32.227 11.374-12.789 13.27-14.129 8.517-6.724 16.1-.001 11.854 17.617-5.307 18.199-16.581 21.029-13.75 17.819-19.716 26.54-12.309 21.231 1.138 1.694 2.932-.278 44.536-9.479 24.062-4.347 28.714-4.928 12.992 6.066 1.416 6.167-5.106 12.613-30.71 7.583-36.018 7.204-53.636 12.689-.657.48.758.935 24.164 2.275 10.337.556h25.301l47.114 3.514 12.309 8.139 7.381 9.959-1.238 7.583-18.957 9.655-25.579-6.066-59.702-14.205-20.474-5.106-2.83-.001v1.694l17.061 16.682 31.266 28.233 39.152 36.397 1.997 8.999-5.03 7.102-5.307-.758-34.401-25.883-13.27-11.651-30.053-25.302-1.996-.001v2.654l6.926 10.136 36.574 54.975 1.895 16.859-2.653 5.485-9.479 3.311-10.414-1.895-21.408-30.054-22.092-33.844-17.819-30.331-2.173 1.238-10.515 113.261-4.929 5.788-11.374 4.348-9.478-7.204-5.03-11.652 5.03-23.027 6.066-30.052 4.928-23.886 4.449-29.674 2.654-9.858-.177-.657-2.173.278-22.37 30.71-34.021 45.977-26.919 28.815-6.445 2.553-11.173-5.789 1.037-10.337 6.243-9.2 37.257-47.392 22.47-29.371 14.508-16.961-.101-2.451h-.859l-98.954 64.251-17.618 2.275-7.583-7.103.936-11.652 3.589-3.791 29.749-20.474-.101.102.024.101z"/></svg>
               <span className="text-zinc-300 text-sm font-medium">Claude</span>
            </div>

            <div className="bg-[#1f1f1f] hover:bg-[#2a2a2a] cursor-pointer transition-colors rounded-full px-5 py-2.5 flex items-center gap-2 border-none">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" shapeRendering="geometricPrecision" textRendering="geometricPrecision" imageRendering="optimizeQuality" fillRule="evenodd" clipRule="evenodd" viewBox="0 0 512 509.639"><path fill="#fff" d="M115.612 0h280.775C459.974 0 512 52.026 512 115.612v278.415c0 63.587-52.026 115.613-115.613 115.613H115.612C52.026 509.64 0 457.614 0 394.027V115.612C0 52.026 52.026 0 115.612 0z"/><path fillRule="nonzero" d="M412.037 221.764a90.834 90.834 0 004.648-28.67 90.79 90.79 0 00-12.443-45.87c-16.37-28.496-46.738-46.089-79.605-46.089-6.466 0-12.943.683-19.264 2.04a90.765 90.765 0 00-67.881-30.515h-.576c-.059.002-.149.002-.216.002-39.807 0-75.108 25.686-87.346 63.554-25.626 5.239-47.748 21.31-60.682 44.03a91.873 91.873 0 00-12.407 46.077 91.833 91.833 0 0023.694 61.553 90.802 90.802 0 00-4.649 28.67 90.804 90.804 0 0012.442 45.87c16.369 28.504 46.74 46.087 79.61 46.087a91.81 91.81 0 0019.253-2.04 90.783 90.783 0 0067.887 30.516h.576l.234-.001c39.829 0 75.119-25.686 87.357-63.588 25.626-5.242 47.748-21.312 60.682-44.033a91.718 91.718 0 0012.383-46.035 91.83 91.83 0 00-23.693-61.553l-.004-.005zM275.102 413.161h-.094a68.146 68.146 0 01-43.611-15.8 56.936 56.936 0 002.155-1.221l72.54-41.901a11.799 11.799 0 005.962-10.251V241.651l30.661 17.704c.326.163.55.479.596.84v84.693c-.042 37.653-30.554 68.198-68.21 68.273h.001zm-146.689-62.649a68.128 68.128 0 01-9.152-34.085c0-3.904.341-7.817 1.005-11.663.539.323 1.48.897 2.155 1.285l72.54 41.901a11.832 11.832 0 0011.918-.002l88.563-51.137v35.408a1.1 1.1 0 01-.438.94l-73.33 42.339a68.43 68.43 0 01-34.11 9.12 68.359 68.359 0 01-59.15-34.11l-.001.004zm-19.083-158.36a68.044 68.044 0 0135.538-29.934c0 .625-.036 1.731-.036 2.5v83.801l-.001.07a11.79 11.79 0 005.954 10.242l88.564 51.13-30.661 17.704a1.096 1.096 0 01-1.034.093l-73.337-42.375a68.36 68.36 0 01-34.095-59.143 68.412 68.412 0 019.112-34.085l-.004-.003zm251.907 58.621l-88.563-51.137 30.661-17.697a1.097 1.097 0 011.034-.094l73.337 42.339c21.109 12.195 34.132 34.746 34.132 59.132 0 28.604-17.849 54.199-44.686 64.078v-86.308c.004-.032.004-.065.004-.096 0-4.219-2.261-8.119-5.919-10.217zm30.518-45.93c-.539-.331-1.48-.898-2.155-1.286l-72.54-41.901a11.842 11.842 0 00-5.958-1.611c-2.092 0-4.15.558-5.957 1.611l-88.564 51.137v-35.408l-.001-.061a1.1 1.1 0 01.44-.88l73.33-42.303a68.301 68.301 0 0134.108-9.129c37.704 0 68.281 30.577 68.281 68.281a68.69 68.69 0 01-.984 11.545v.005zm-191.843 63.109l-30.668-17.704a1.09 1.09 0 01-.596-.84v-84.692c.016-37.685 30.593-68.236 68.281-68.236a68.332 68.332 0 0143.689 15.804 63.09 63.09 0 00-2.155 1.222l-72.54 41.9a11.794 11.794 0 00-5.961 10.248v.068l-.05 102.23zm16.655-35.91l39.445-22.782 39.444 22.767v45.55l-39.444 22.767-39.445-22.767v-45.535z"/></svg>
               <span className="text-zinc-300 text-[15px] font-medium leading-[0]">ChatGPT</span>
            </div>

            <div 
              onClick={() => {
                window.open(aiStudioUrl, '_blank');
              }}
              className="bg-[#1f1f1f] hover:bg-[#2a2a2a] cursor-pointer transition-colors rounded-full px-5 py-2.5 flex items-center gap-2 border-none"
            >
              <svg width="18" height="18" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><g clipPath="url(#prefix__clip0_5_13)" fillRule="evenodd" clipRule="evenodd" fill="currentColor"><path d="M211.648 89.515h-76.651A57.707 57.707 0 0077.291 147.2v242.389a57.707 57.707 0 0057.706 57.707h242.411a57.707 57.707 0 0057.707-57.707V288.128l34.624-23.744v125.227a92.35 92.35 0 01-92.331 92.33H134.997a92.349 92.349 0 01-92.33-92.33v-242.39A92.336 92.336 0 0169.702 81.92a92.33 92.33 0 0165.295-27.05h96.96l-20.309 34.645z"/><path d="M380.16 0c3.093 0 5.717 2.219 6.379 5.248a149.328 149.328 0 0040.533 74.325 149.332 149.332 0 0074.347 40.555c3.029.661 5.248 3.285 5.248 6.4a6.574 6.574 0 01-5.248 6.357 149.338 149.338 0 00-74.326 40.555 149.338 149.338 0 00-40.789 75.413 6.334 6.334 0 01-6.144 5.078 6.334 6.334 0 01-6.144-5.078 149.338 149.338 0 00-40.789-75.413 149.326 149.326 0 00-75.414-40.789 6.338 6.338 0 01-5.077-6.144c0-2.987 2.133-5.547 5.077-6.144a149.336 149.336 0 0075.414-40.79 149.354 149.354 0 0040.554-74.325A6.573 6.573 0 01380.16 0z"/></g><defs><clipPath id="prefix__clip0_5_13"><path fill="#fff" d="M0 0h512v512H0z"/></clipPath></defs></svg>
              <span className="text-zinc-300 text-[15px] font-medium">AI Studio</span>
            </div>
          </div>

          <div className="mt-6 w-full max-w-2xl overflow-hidden rounded-[22px] bg-[#151515] p-[1px]">
            <div className="relative flex min-h-[150px] overflow-hidden rounded-[21px] bg-[#111313]">
              <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(#253235_1px,transparent_1px),linear-gradient(90deg,#253235_1px,transparent_1px)] [background-size:70px_70px]" />
              <div className="relative z-10 flex w-[48%] flex-col justify-between p-6">
                <div>
                  <div className="mb-3 flex items-center gap-2">
                    <h2 className="text-2xl font-black tracking-tight text-white">WEEKLY EVENT</h2>
                    <span className="rounded-md bg-cyan-300 px-2 py-0.5 text-[11px] font-black text-[#101314]">SOON</span>
                  </div>
                  <p className="max-w-[260px] text-[15px] leading-snug text-zinc-400">
                    {weeklyEvent.body}
                  </p>
                </div>
                <button onClick={() => setView('event')} className="mt-5 flex w-fit items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-[#111315] transition-colors hover:bg-zinc-200">
                  Preview
                  <ArrowUpRight size={15} />
                </button>
              </div>
              <div className="relative z-10 flex flex-1 items-center justify-end gap-3 overflow-hidden pr-6">
                {[
                  { label: 'Chrome Extension', icon: <Code2 size={22} /> },
                  { label: 'Discover Skills', icon: <Discover size={22} /> },
                  { label: 'Super Agent', icon: <Zap size={22} /> }
                ].map((item, idx) => (
                  <motion.div
                    key={item.label}
                    animate={{ y: idx === 1 ? [0, -6, 0] : [0, 5, 0] }}
                    transition={{ duration: 4 + idx, repeat: Infinity, ease: 'easeInOut' }}
                    style={{ rotate: idx === 0 ? '-7deg' : idx === 1 ? '5deg' : '-3deg' }}
                    className="flex h-24 w-24 flex-col items-center justify-center gap-2 rounded-2xl bg-[#27292b] text-zinc-200 shadow-[0_16px_40px_rgba(0,0,0,0.28)]"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1a1b1d] text-cyan-200">
                      {item.icon}
                    </div>
                    <span className="text-[11px] font-bold text-zinc-300">{item.label}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 w-full max-w-2xl overflow-hidden">
            <motion.div
              animate={{ x: ['0%', '-50%'] }}
              transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
              className="flex w-max items-center gap-5 pb-2"
            >
              {[
                {
                  href: 'https://findly.tools/kindly-prompt?utm_source=kindly-prompt',
                  src: 'https://findly.tools/badges/findly-tools-badge-light.svg',
                  alt: 'Featured on Findly.tools',
                  width: 175,
                  height: 55,
                },
                {
                  href: 'https://www.producthunt.com/products/kindly-prompt/reviews/new?utm_source=badge-product_review&utm_medium=badge&utm_source=badge-kindly-prompt',
                  src: 'https://api.producthunt.com/widgets/embed-image/v1/product_review.svg?product_id=1225437&theme=dark',
                  alt: 'Kindly Prompt - Turn simple ideas into highly detailed AI coding prompts | Product Hunt',
                  width: 250,
                  height: 54,
                },
                {
                  href: 'https://startupfa.me/s/kindly-prompt?utm_source=kindlyprompt.vercel.app',
                  src: 'https://startupfa.me/badges/featured/default.webp',
                  alt: 'Kindly Prompt - Featured on Startup Fame',
                  width: 171,
                  height: 54,
                },
                {
                  href: 'https://fazier.com/launches/kindlyprompt.vercel.app',
                  src: 'https://fazier.com/api/v1//public/badges/launch_badges.svg?badge_type=launched&theme=dark',
                  alt: 'Fazier badge',
                  width: 120,
                  height: 54,
                },
                {
                  href: 'https://findly.tools/kindly-prompt?utm_source=kindly-prompt',
                  src: 'https://findly.tools/badges/findly-tools-badge-light.svg',
                  alt: 'Featured on Findly.tools',
                  width: 175,
                  height: 55,
                },
                {
                  href: 'https://www.producthunt.com/products/kindly-prompt/reviews/new?utm_source=badge-product_review&utm_medium=badge&utm_source=badge-kindly-prompt',
                  src: 'https://api.producthunt.com/widgets/embed-image/v1/product_review.svg?product_id=1225437&theme=dark',
                  alt: 'Kindly Prompt - Turn simple ideas into highly detailed AI coding prompts | Product Hunt',
                  width: 250,
                  height: 54,
                },
                {
                  href: 'https://startupfa.me/s/kindly-prompt?utm_source=kindlyprompt.vercel.app',
                  src: 'https://startupfa.me/badges/featured/default.webp',
                  alt: 'Kindly Prompt - Featured on Startup Fame',
                  width: 171,
                  height: 54,
                },
                {
                  href: 'https://fazier.com/launches/kindlyprompt.vercel.app',
                  src: 'https://fazier.com/api/v1//public/badges/launch_badges.svg?badge_type=launched&theme=dark',
                  alt: 'Fazier badge',
                  width: 120,
                  height: 54,
                },
              ].map((badge, index) => (
                <a
                  key={`${badge.href}-${index}`}
                  href={badge.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-[58px] shrink-0 items-center justify-center"
                >
                  <img src={badge.src} alt={badge.alt} width={badge.width} height={badge.height} className="max-h-[55px] object-contain" />
                </a>
              ))}
            </motion.div>
          </div>
        </div>
      ) : view === 'event' ? (
        <div className="max-w-5xl w-full relative z-10 shrink-0 mx-auto px-6 pt-24 pb-16 min-h-[80vh]">
          <button
            onClick={() => setView('home')}
            className="mb-8 flex items-center gap-2 text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-200"
          >
            <ArrowRight size={15} className="rotate-180" />
            Back home
          </button>

          <article className="overflow-hidden rounded-[28px] bg-[#121212]">
            <div className="relative min-h-[320px] overflow-hidden bg-[#101415] p-8 sm:p-10">
              <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(#273638_1px,transparent_1px),linear-gradient(90deg,#273638_1px,transparent_1px)] [background-size:84px_84px]" />
              <div className="relative z-10 grid gap-8 md:grid-cols-[1.05fr_0.95fr]">
                <div className="flex flex-col justify-between">
                  <div>
                    <div className="mb-4 flex items-center gap-2">
                      <span className="rounded-md bg-cyan-300 px-2 py-1 text-[11px] font-black text-[#101314]">WEEKLY EVENT</span>
                      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">Coming soon</span>
                    </div>
                    <h1 className="max-w-xl text-4xl font-black tracking-tight text-white sm:text-5xl">
                      New ways to turn rough ideas into usable prompts.
                    </h1>
                    <p className="mt-5 max-w-xl text-base leading-relaxed text-zinc-400">
                      A clean preview of upcoming creation flows for people who think visually, speak quickly, or start from messy sketches.
                    </p>
                  </div>
                  <p className="mt-8 text-sm font-medium text-zinc-500">A lot more is coming after this first drop.</p>
                </div>

                <div className="relative flex min-h-[260px] items-center justify-center">
                  {[
                    { title: 'Wireframe', detail: 'Sketch structure first', icon: <MessageSquare size={26} /> },
                    { title: 'Figma', detail: 'Extract intent', icon: <Paintbrush size={26} /> },
                    { title: 'Voice', detail: 'Speak the brief', icon: <Mic size={26} /> },
                  ].map((item, idx) => (
                    <motion.div
                      key={item.title}
                      animate={{ y: idx === 1 ? [0, -9, 0] : [0, 7, 0] }}
                      transition={{ duration: 4.5 + idx, repeat: Infinity, ease: 'easeInOut' }}
                      style={{
                        rotate: idx === 0 ? '-8deg' : idx === 1 ? '5deg' : '10deg',
                        left: `${idx * 32 + 2}%`,
                        top: `${idx === 1 ? 9 : idx === 2 ? 42 : 30}%`,
                      }}
                      className="absolute flex h-36 w-32 flex-col justify-between rounded-3xl bg-[#27292b] p-4 shadow-[0_22px_60px_rgba(0,0,0,0.45)]"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#191a1c] text-cyan-200">
                        {item.icon}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white">{item.title}</h3>
                        <p className="mt-1 text-xs text-zinc-500">{item.detail}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid gap-0 md:grid-cols-3">
              {[
                ['Wireframe to prompt', 'Turn layout blocks and rough structure into a precise implementation brief.'],
                ['Figma to prompt', 'Capture design intent, components, and hierarchy without rewriting the whole spec by hand.'],
                ['Voice to prompt', 'Talk through the idea, then shape it into something an AI builder can execute.'],
              ].map(([title, body]) => (
                <section key={title} className="border-t border-white/5 p-7 md:border-r md:last:border-r-0">
                  <h2 className="text-lg font-bold text-zinc-100">{title}</h2>
                  <p className="mt-3 text-sm leading-relaxed text-zinc-500">{body}</p>
                </section>
              ))}
            </div>
          </article>
        </div>
      ) : view === 'library' ? (
        // LIBRARY VIEW
        <div className="max-w-6xl w-full relative z-10 shrink-0 mx-auto px-6 pt-24 pb-16 min-h-[80vh]">
          {renderDiscoveryTopBar()}
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
                className="bg-[#151515] rounded-[22px] p-2.5 flex flex-col gap-4 transition-colors hover:bg-[#191919] group"
              >
                <div className="h-44 rounded-[18px] bg-[#2a2a2c] p-5 flex flex-col justify-between overflow-hidden">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-zinc-500/60" />
                    <div className="h-2 w-2 rounded-full bg-zinc-500/40" />
                    <div className="h-2 w-2 rounded-full bg-zinc-500/30" />
                  </div>
                  <div className="space-y-2 opacity-70">
                    <div className="h-3 w-3/4 rounded-full bg-zinc-700" />
                    <div className="h-3 w-1/2 rounded-full bg-zinc-700" />
                    <div className="h-3 w-2/3 rounded-full bg-zinc-700" />
                  </div>
                </div>

                <div className="flex flex-col gap-2 px-2">
                  <h3 className="text-zinc-100 font-bold text-lg">{item.title}</h3>
                  <p className="text-zinc-500 text-sm leading-relaxed line-clamp-2">{item.description}</p>
                  <div className="mt-1 flex flex-col gap-2">
                    <div className="h-3 w-4/5 rounded-full bg-[#2a2a2c]" />
                    <div className="h-3 w-1/2 rounded-full bg-[#2a2a2c]" />
                  </div>
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
                      const extension = (item as any).type === 'design' ? 'design.md' : (item as any).type === 'skill' ? 'skill.md' : (item as any).type === 'spec' ? 'spec.md' : 'prompt.md';
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
      ) : view === 'discover' ? (
        <div className="relative z-10 flex min-h-[80vh] w-full shrink-0 flex-col items-center px-6 pt-24 text-center">
          {renderDiscoveryTopBar()}
          {renderMovingHero(
            'Discover what builders are making',
            'Explore a coming feed of apps, prompts, skills, and practical articles shaped for faster AI building.',
            discoverTickerItems,
          )}
        </div>
      ) : view === 'skills' ? (
        renderSkillsCatalog()
      ) : view === 'labs' ? (
        <div className="relative z-10 flex min-h-[80vh] w-full shrink-0 flex-col items-center px-6 pt-24 text-center">
          {renderDiscoveryTopBar()}
          {renderMovingHero(
            'Labs coming soon',
            'Experimental prompt tools, agent workflows, and early features are being shaped here.',
            labsTickerItems,
          )}
        </div>
      ) : view === 'recents' ? (
        // RECENTS VIEW
        <div className="max-w-4xl w-full relative z-10 shrink-0 mx-auto px-6 pt-24 pb-16 min-h-[80vh]">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <h1 className="text-3xl font-medium tracking-tight text-white mb-2 md:mb-0">History</h1>
            
            <div className="flex-1 max-w-sm w-full relative">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 w-4 h-4" />
               <input 
                 type="text" 
                 placeholder="Search history..." 
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="w-full bg-[#1c1c1c] text-zinc-200 placeholder:text-zinc-500 rounded-full pl-11 pr-4 py-2.5 outline-none border border-white/5 focus:border-zinc-700/50 transition-colors text-sm"
               />
            </div>

            <div className="flex gap-2 self-start md:self-auto shrink-0 mt-4 md:mt-0">
              {!selectionMode ? (
                <>
                  <button 
                    onClick={() => setSelectionMode(true)}
                    className="bg-[#2a2a2a] hover:bg-[#383838] text-zinc-300 px-4 py-2.5 rounded-full text-xs font-semibold transition-colors border-none"
                  >
                    SELECT
                  </button>
                  <button 
                    onClick={() => setView('home')}
                    className="bg-black hover:bg-black/80 text-white px-4 py-2.5 rounded-full text-xs font-semibold transition-colors border border-white/10"
                  >
                    NEW CHAT
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-4 bg-[#141414] p-1.5 rounded-full border border-white/5">
                  <span className="text-xs text-zinc-500 pl-3 font-medium">{selectedItems.length} selected</span>
                  <button 
                    onClick={() => {
                      if (selectedItems.length === recents.length && recents.length > 0) {
                        setSelectedItems([]);
                      } else {
                        setSelectedItems(recents.map((_, i) => i));
                      }
                    }}
                    className="bg-transparent hover:bg-zinc-800 text-zinc-300 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors"
                  >
                    ALL
                  </button>
                  <button 
                    onClick={() => {
                      setRecents(prev => prev.filter((_, i) => !selectedItems.includes(i)));
                      setSelectedItems([]);
                      setSelectionMode(false);
                    }}
                    disabled={selectedItems.length === 0}
                    className="bg-[#3a1a1a] hover:bg-[#4a1a1a] disabled:opacity-50 text-red-300 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors"
                  >
                    DELETE
                  </button>
                  <button 
                    onClick={() => {
                      setSelectionMode(false);
                      setSelectedItems([]);
                    }}
                    className="bg-transparent hover:bg-zinc-800 text-zinc-300 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors"
                  >
                    CANCEL
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col w-full">
            {recents.filter(item => item.title.toLowerCase().includes(searchQuery.toLowerCase()) || item.prompt.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 ? (
              <div className="flex min-h-[360px] w-full flex-col items-center justify-center text-center px-4">
                <div className="relative mb-7 h-24 w-28">
                  <div className="absolute left-8 top-4 h-20 w-20 rotate-[-6deg] rounded-lg bg-[#202124]" />
                  <div className="absolute left-12 top-2 h-20 w-20 rotate-[7deg] rounded-lg bg-[#191a1c]" />
                  <div className="absolute left-10 top-6 h-20 w-20 rounded-lg bg-[#2b2e31]" />
                  <div className="absolute bottom-2 left-5 flex h-8 w-8 items-center justify-center rounded-full bg-zinc-400 text-black">
                    <Plus size={22} strokeWidth={1.7} />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-2 tracking-tight">No history yet</h3>
                <p className="text-zinc-400 text-sm mb-6">Your generated prompts will show up here.</p>
                <button
                  onClick={() => setView('home')}
                  className="rounded-full bg-white px-6 py-3 text-sm font-bold text-[#111315] transition-colors hover:bg-zinc-200"
                >
                  Start a new prompt
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {recents.filter(item => item.title.toLowerCase().includes(searchQuery.toLowerCase()) || item.prompt.toLowerCase().includes(searchQuery.toLowerCase())).map((item, originalIndex) => {
                  const globalIndex = recents.indexOf(item);
                  const isSelected = selectedItems.includes(globalIndex);
                  return (
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={globalIndex}
                      className={`flex flex-col gap-3 p-4 border rounded-2xl transition-colors cursor-pointer group ${isSelected ? 'bg-zinc-900 border-zinc-700/50' : 'bg-[#141414]/50 border-white/5 hover:border-white/10 hover:bg-[#1a1a1a]'}`}
                      onClick={() => {
                        if (selectionMode) {
                          if (isSelected) {
                            setSelectedItems(selectedItems.filter(id => id !== globalIndex));
                          } else {
                            setSelectedItems([...selectedItems, globalIndex]);
                          }
                        } else {
                          setCurrentResult(item);
                          setResult(item.prompt);
                          setView('result');
                        }
                      }}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4 flex-1 overflow-hidden">
                          {selectionMode ? (
                            <div className={`w-5 h-5 mt-0.5 rounded flex items-center justify-center shrink-0 transition-colors ${isSelected ? 'bg-white border-white' : 'bg-transparent border border-white/20 group-hover:border-white/40'}`}>
                              {isSelected && <Check size={12} className="text-black stroke-[3]" />}
                            </div>
                          ) : (
                            <div className="w-8 h-8 rounded-lg bg-[#2a2a2a] shrink-0 flex items-center justify-center transition-colors">
                              {item.type === 'design' ? <Paintbrush size={14} className="text-zinc-400" /> : item.type === 'skill' ? <Zap size={14} className="text-zinc-400" /> : item.type === 'spec' ? <FileText size={14} className="text-zinc-400" /> : <MessageSquare size={14} className="text-zinc-400" />}
                            </div>
                          )}
                          
                          <div className="flex flex-col flex-1 min-w-0">
                            <span className="text-[15px] font-semibold text-zinc-100 truncate mb-1">{item.title}</span>
                            <span className="text-sm text-zinc-500 line-clamp-2 leading-relaxed">{item.prompt}</span>
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-end gap-2 shrink-0">
                          <span className="text-xs font-mono text-zinc-600 uppercase tracking-widest pl-2">
                            {timeAgo((item as any).date) || 'recently'}
                          </span>
                          {!selectionMode && (
                             <div className="p-2 -mr-2 text-zinc-600 group-hover:text-zinc-300 transition-colors">
                               <ArrowRight size={16} />
                             </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
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
                 onClick={() => setView('preview')}
                 className="text-zinc-400 hover:text-zinc-200 text-[15px] font-medium flex items-center gap-2 transition-colors disabled:opacity-50 border border-transparent hover:bg-[#141414] px-3 py-1.5 rounded-full"
               >
                 <ArrowUpRight size={16} />
                 Expand
               </button>
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
                 <div className="flex flex-col gap-4 h-full relative">
                   {modelType === 'super-agent' ? (
                     <div className="flex flex-col gap-3 font-sans pb-4">
                       {superAgents.map((agent, index) => {
                         const complete = agentLogs.some((log) => log.id === `agent-${agent.id}`);
                         return (
                           <motion.div
                             key={agent.id}
                             initial={{ opacity: 0, x: -10 }}
                             animate={{ opacity: 1, x: 0 }}
                             transition={{ delay: index * 0.04 }}
                             className="flex items-center gap-3 rounded-2xl bg-[#101010] px-3 py-2"
                           >
                             {renderAgentFace(agent, index, true)}
                             <div className="min-w-0 flex-1">
                               <div className="text-sm font-bold text-zinc-100">{agent.name}</div>
                               <div className="truncate text-xs text-zinc-500">{complete ? agent.status : 'Working...'}</div>
                             </div>
                             <div className={`flex h-7 w-7 items-center justify-center rounded-full ${complete ? 'bg-emerald-400/15 text-emerald-300' : 'bg-zinc-800 text-zinc-500'}`}>
                               {complete ? <Check size={15} /> : <RefreshCw size={14} className="animate-spin" />}
                             </div>
                           </motion.div>
                         );
                       })}
                     </div>
                   ) : agentLogs.length === 0 ? (
                     <div className="flex flex-col gap-3 animate-pulse">
                       <div className="h-4 bg-zinc-800/50 rounded w-3/4"></div>
                       <div className="h-4 bg-zinc-800/50 rounded w-full"></div>
                       <div className="h-4 bg-zinc-800/50 rounded w-5/6"></div>
                       <div className="h-4 bg-zinc-800/50 rounded w-1/2 mt-4"></div>
                     </div>
                   ) : (
                     <div className="flex flex-col gap-3 font-sans pb-4">
                       <AnimatePresence>
                         {agentLogs.map((log) => (
                           <motion.div
                             key={log.id}
                             initial={{ opacity: 0, x: -10, y: 10 }}
                             animate={{ opacity: 1, x: 0, y: 0 }}
                             className="flex items-center gap-3 text-sm"
                           >
                             {log.type === 'search' ? (
                               <Search size={14} className="text-zinc-500 shrink-0" />
                             ) : log.type === 'code' ? (
                               <Code2 size={14} className="text-[#a46de5] shrink-0" />
                             ) : log.type === 'read' ? (
                               <BookOpen size={14} className="text-zinc-500 shrink-0" />
                             ) : (
                               <Sparkles size={14} className="text-zinc-500 shrink-0" />
                             )}
                             <span className={log.type === 'search' ? 'text-zinc-300 font-medium' : 'text-zinc-500'}>
                               {log.text}
                             </span>
                           </motion.div>
                         ))}
                       </AnimatePresence>
                     </div>
                   )}
                   {streamedResult && (
                     <div className="mt-4 pt-4 border-t border-white/5 opacity-80 text-zinc-400">
                       <ReactMarkdown>{
                         (() => {
                           const m = streamedResult.match(/"prompt"\s*:\s*"([^]+?)(?:",?|$)/);
                           return m ? m[1].replace(/\\n/g, '\n').replace(/\\"/g, '"').replace(/\\\\/g, '\\') : 'Writing...';
                         })()
                       }</ReactMarkdown>
                     </div>
                   )}
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
                  {currentResult?.type === 'design' ? 'Download DESIGN.md' : currentResult?.type === 'skill' ? 'Download SKILL.md' : currentResult?.type === 'spec' ? 'Download SPEC.md' : 'Download PROMPT.md'}
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
                  <img src="https://raw.githubusercontent.com/lobehub/lobe-icons/refs/heads/master/packages/static-png/dark/claude-color.png" alt="" className="h-4 w-4 rounded-sm object-contain" />
                  <svg className="hidden" xmlns="http://www.w3.org/2000/svg" width="16" height="16" shapeRendering="geometricPrecision" textRendering="geometricPrecision" imageRendering="optimizeQuality" fillRule="evenodd" clipRule="evenodd" viewBox="0 0 512 509.64"><path fill="#D77655" d="M115.612 0h280.775C459.974 0 512 52.026 512 115.612v278.415c0 63.587-52.026 115.612-115.613 115.612H115.612C52.026 509.639 0 457.614 0 394.027V115.612C0 52.026 52.026 0 115.612 0z"/><path fill="#FCF2EE" fillRule="nonzero" d="M142.27 316.619l73.655-41.326 1.238-3.589-1.238-1.996-3.589-.001-12.31-.759-42.084-1.138-36.498-1.516-35.361-1.896-8.897-1.895-8.34-10.995.859-5.484 7.482-5.03 10.717.935 23.683 1.617 35.537 2.452 25.782 1.517 38.193 3.968h6.064l.86-2.451-2.073-1.517-1.618-1.517-36.776-24.922-39.81-26.338-20.852-15.166-11.273-7.683-5.687-7.204-2.451-15.721 10.237-11.273 13.75.935 3.513.936 13.928 10.716 29.749 23.027 38.848 28.612 5.687 4.727 2.275-1.617.278-1.138-2.553-4.271-21.13-38.193-22.546-38.848-10.035-16.101-2.654-9.655c-.935-3.968-1.617-7.304-1.617-11.374l11.652-15.823 6.445-2.073 15.545 2.073 6.547 5.687 9.655 22.092 15.646 34.78 24.265 47.291 7.103 14.028 3.791 12.992 1.416 3.968 2.449-.001v-2.275l1.997-26.641 3.69-32.707 3.589-42.084 1.239-11.854 5.863-14.206 11.652-7.683 9.099 4.348 7.482 10.716-1.036 6.926-4.449 28.915-8.72 45.294-5.687 30.331h3.313l3.792-3.791 15.342-20.372 25.782-32.227 11.374-12.789 13.27-14.129 8.517-6.724 16.1-.001 11.854 17.617-5.307 18.199-16.581 21.029-13.75 17.819-19.716 26.54-12.309 21.231 1.138 1.694 2.932-.278 44.536-9.479 24.062-4.347 28.714-4.928 12.992 6.066 1.416 6.167-5.106 12.613-30.71 7.583-36.018 7.204-53.636 12.689-.657.48.758.935 24.164 2.275 10.337.556h25.301l47.114 3.514 12.309 8.139 7.381 9.959-1.238 7.583-18.957 9.655-25.579-6.066-59.702-14.205-20.474-5.106-2.83-.001v1.694l17.061 16.682 31.266 28.233 39.152 36.397 1.997 8.999-5.03 7.102-5.307-.758-34.401-25.883-13.27-11.651-30.053-25.302-1.996-.001v2.654l6.926 10.136 36.574 54.975 1.895 16.859-2.653 5.485-9.479 3.311-10.414-1.895-21.408-30.054-22.092-33.844-17.819-30.331-2.173 1.238-10.515 113.261-4.929 5.788-11.374 4.348-9.478-7.204-5.03-11.652 5.03-23.027 6.066-30.052 4.928-23.886 4.449-29.674 2.654-9.858-.177-.657-2.173.278-22.37 30.71-34.021 45.977-26.919 28.815-6.445 2.553-11.173-5.789 1.037-10.337 6.243-9.2 37.257-47.392 22.47-29.371 14.508-16.961-.101-2.451h-.859l-98.954 64.251-17.618 2.275-7.583-7.103.936-11.652 3.589-3.791 29.749-20.474-.101.102.024.101z"/></svg>
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

                <a
                  href={claudeCodeUrl}
                  className={`bg-[#141414] hover:bg-[#1c1c1c] text-zinc-300 px-5 py-2.5 rounded-full text-[15px] font-medium flex items-center gap-2 transition-colors ${isGenerating ? 'opacity-50 pointer-events-none' : ''}`}
                >
                  <img src="https://raw.githubusercontent.com/lobehub/lobe-icons/refs/heads/master/packages/static-png/dark/claudecode-color.png" alt="" className="h-4 w-4 rounded-sm object-contain" />
                  Open in Claude Code
                </a>

                <a
                  href={conductorUrl}
                  className={`bg-[#141414] hover:bg-[#1c1c1c] text-zinc-300 px-5 py-2.5 rounded-full text-[15px] font-medium flex items-center gap-2 transition-colors ${isGenerating ? 'opacity-50 pointer-events-none' : ''}`}
                >
                  <img src="https://favicon.im/www.conductor.build?larger=true" alt="" className="h-4 w-4 rounded-sm object-contain" />
                  Open in Conductor
                </a>

                <button
                  disabled={isGenerating}
                  onClick={() => {
                    navigator.clipboard.writeText(result);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="bg-[#141414] hover:bg-[#1c1c1c] text-zinc-300 px-5 py-2.5 rounded-full text-[15px] font-medium flex items-center gap-2 transition-colors disabled:opacity-50"
                >
                  <img src="https://raw.githubusercontent.com/lobehub/lobe-icons/refs/heads/master/packages/static-png/dark/codex.png" alt="" className="h-4 w-4 rounded-sm object-contain" />
                  Copy for Codex
                </button>

                <button
                  disabled={isGenerating}
                  onClick={() => {
                    navigator.clipboard.writeText(result);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="bg-[#141414] hover:bg-[#1c1c1c] text-zinc-300 px-5 py-2.5 rounded-full text-[15px] font-medium flex items-center gap-2 transition-colors disabled:opacity-50"
                >
                  <img src="https://antigravity.google/assets/image/brand/antigravity-icon__full-color.png" alt="" className="h-4 w-4 rounded-sm object-contain" />
                  Copy for Antigravity
                </button>
             </div>
          </motion.div>
        </div>
      ) : view === 'preview' ? (
        <div className="min-h-screen bg-[#080808] px-6 py-3">
          <div className="sticky top-0 z-40 mx-auto mb-4 flex max-w-5xl items-center justify-between border-b border-white/5 bg-[#080808]/90 pb-4 pt-1 backdrop-blur-xl">
            <button
              onClick={() => setView('result')}
              className="flex items-center gap-2 rounded-full bg-[#151515] px-4 py-2 text-sm font-semibold text-zinc-300 transition-colors hover:bg-[#202020] hover:text-white"
            >
              <X size={16} />
              Close
            </button>
            <div className="text-center">
              <div className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-600">Preview</div>
              <h1 className="mt-1 text-lg font-semibold tracking-tight text-zinc-100">{currentResult?.title || 'Generated Prompt'}</h1>
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(result);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="flex items-center gap-2 rounded-full bg-[#151515] px-4 py-2 text-sm font-semibold text-zinc-300 transition-colors hover:bg-[#202020] hover:text-white"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>

          <motion.article
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="mx-auto max-w-4xl rounded-[28px] bg-[#101010] px-12 py-10 shadow-[0_24px_80px_rgba(0,0,0,0.35)]"
          >
            <div className="mb-8 border-b border-white/6 pb-7">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#1d1d1d] text-zinc-300">
                <MessageSquare size={20} />
              </div>
              <h2 className="text-4xl font-semibold tracking-tight text-white">{currentResult?.title || 'Generated Prompt'}</h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-500">
                Read-only formatted prompt preview.
              </p>
            </div>

            <div className="prose prose-invert prose-zinc max-w-none
              prose-headings:scroll-mt-24 prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-zinc-100
              prose-h1:text-3xl prose-h2:mt-10 prose-h2:border-b prose-h2:border-white/6 prose-h2:pb-3 prose-h2:text-2xl prose-h3:text-xl
              prose-p:text-[16px] prose-p:leading-8 prose-p:text-zinc-300
              prose-strong:text-white prose-strong:font-semibold
              prose-ul:my-6 prose-ol:my-6 prose-li:my-2 prose-li:text-zinc-300 marker:prose-li:text-zinc-500
              prose-blockquote:rounded-2xl prose-blockquote:border-l-0 prose-blockquote:bg-white/[0.04] prose-blockquote:px-5 prose-blockquote:py-3 prose-blockquote:text-zinc-300
              prose-code:rounded-md prose-code:bg-white/8 prose-code:px-1.5 prose-code:py-0.5 prose-code:text-zinc-100 prose-code:before:content-none prose-code:after:content-none
              prose-pre:rounded-2xl prose-pre:border prose-pre:border-white/10 prose-pre:bg-[#0b0b0b] prose-pre:p-5">
              <ReactMarkdown>{result}</ReactMarkdown>
            </div>
          </motion.article>
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
        <footer className="w-full py-4 mt-auto px-6 border-t border-white/5 flex flex-col items-center justify-center text-zinc-500 text-sm gap-3 shrink-0 relative z-20 bg-[#070707]">
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-center">
            <div>&copy; {new Date().getFullYear()} Kindly Prompt.</div>
            <button
              onClick={() => setIsOnboardingModalOpen(true)}
              className="hover:text-zinc-300 transition-colors"
            >
              How it works
            </button>
            <button
              onClick={() => setIsPiModalOpen(true)}
              className="hover:text-zinc-300 transition-colors"
            >
              Personal Intelligence
            </button>
            <button
              onClick={() => setIsSuperAgentModalOpen(true)}
              className="hover:text-zinc-300 transition-colors flex items-center gap-1.5"
            >
              Super Agent
            </button>
            <button
              onClick={() => setIsSupportModalOpen(true)}
              className="hover:text-zinc-300 transition-colors"
            >
              Support
            </button>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-center">
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
        {isSupportModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#070707]/90 p-4 backdrop-blur-md">
            <button onClick={() => setIsSupportModalOpen(false)} className="absolute right-6 top-6 z-50 text-zinc-500 transition-colors hover:text-zinc-300">
              <X size={24} />
            </button>
            <motion.div
              initial={{ opacity: 0, filter: 'blur(10px)', scale: 0.95 }}
              animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
              exit={{ opacity: 0, filter: 'blur(10px)', scale: 1.05 }}
              transition={{ duration: 0.35 }}
              className="w-full max-w-md overflow-hidden rounded-[24px] bg-[#141414] p-1 shadow-2xl"
            >
              <div className="rounded-[20px] bg-[#1c1c1c] p-8">
                {supportSent ? (
                  <div className="flex h-[340px] flex-col items-center justify-center text-center">
                    <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-300">
                      <Check size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-white">Sent to support</h3>
                    <p className="mt-2 text-sm text-zinc-500">Thanks. We’ll use this to improve Kindly Prompt.</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#141414] text-cyan-200">
                        <MessageSquare size={18} />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium tracking-tight text-zinc-200">Customer Support</h3>
                        <p className="text-[13px] text-zinc-500">Bugs, improvements, and feature ideas.</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Name"
                        value={supportName}
                        onChange={(e) => setSupportName(e.target.value)}
                        className="rounded-xl bg-[#141414] px-4 py-3 text-sm text-zinc-300 outline-none placeholder:text-zinc-600 focus:ring-1 focus:ring-zinc-700"
                      />
                      <input
                        type="email"
                        placeholder="Email"
                        value={supportEmail}
                        onChange={(e) => setSupportEmail(e.target.value)}
                        className="rounded-xl bg-[#141414] px-4 py-3 text-sm text-zinc-300 outline-none placeholder:text-zinc-600 focus:ring-1 focus:ring-zinc-700"
                      />
                    </div>

                    <div className="flex gap-2">
                      {['Bug', 'Improvement', 'Feature'].map((category) => (
                        <button
                          key={category}
                          onClick={() => setSupportCategory(category)}
                          className={`flex-1 rounded-full px-3 py-2 text-xs font-bold transition-colors ${supportCategory === category ? 'bg-white text-black' : 'bg-[#141414] text-zinc-400 hover:text-zinc-200'}`}
                        >
                          {category}
                        </button>
                      ))}
                    </div>

                    <textarea
                      placeholder="Describe what happened, what you want improved, or what feature you want next..."
                      value={supportMessage}
                      onChange={(e) => setSupportMessage(e.target.value)}
                      className="h-32 resize-none rounded-xl bg-[#141414] p-4 text-sm text-zinc-300 outline-none placeholder:text-zinc-600 focus:ring-1 focus:ring-zinc-700"
                    />

                    <div className="flex justify-end">
                      <button
                        onClick={submitSupportRequest}
                        disabled={!supportEmail || !supportMessage || isSupportSubmitting}
                        className="flex items-center gap-2 rounded-full bg-[#2a2a2a] px-6 py-2.5 text-sm font-medium text-zinc-200 transition-colors hover:bg-[#383838] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isSupportSubmitting ? 'Sending...' : 'Send to us'}
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {selectedSkillCard && (
          <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/70 p-8 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 16 }}
              transition={{ duration: 0.2 }}
              className="relative flex max-h-[88vh] w-full max-w-6xl flex-col overflow-hidden rounded-[32px] bg-[#1b1c1d] p-6 shadow-[0_30px_120px_rgba(0,0,0,0.55)]"
            >
              <button
                onClick={() => setSelectedSkillCard(null)}
                className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full bg-[#2a2b2c] text-zinc-300 transition-colors hover:bg-[#343536] hover:text-white"
                aria-label="Close skill"
              >
                <X size={20} />
              </button>

              <div className="px-2 pt-4 text-left">
                <h2 className="text-xl font-bold text-white">{selectedSkillCard.slug}</h2>
              </div>

              <div className="mx-auto mt-8 flex max-w-4xl flex-col items-center text-center">
                {renderSkillPixelVisual(selectedSkillCard, 'lg')}
                <h3 className="mt-6 text-2xl font-bold text-white">{selectedSkillCard.slug}</h3>
                <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-zinc-400">{selectedSkillCard.description}</p>
                <div className="mt-4 flex items-center gap-3 text-sm font-semibold text-zinc-500">
                  <span>{selectedSkillCard.installs} installs</span>
                  <span>-</span>
                  <span>{selectedSkillCard.category}</span>
                </div>
              </div>

              <div className="mt-10 min-h-0 flex-1 overflow-y-auto rounded-[26px] bg-[#141617] p-7 text-left [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                <pre className="whitespace-pre-wrap font-sans text-[16px] font-medium leading-relaxed text-zinc-300">{selectedSkillCard.content}</pre>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <button
                  onClick={() => copySkill(selectedSkillCard)}
                  className="flex items-center gap-2 rounded-full bg-[#2a2b2c] px-5 py-3 text-sm font-bold text-zinc-200 transition-colors hover:bg-[#343536]"
                >
                  <Copy size={16} />
                  {copied ? 'Copied' : 'Copy skill'}
                </button>
                <button
                  onClick={() => downloadSkill(selectedSkillCard)}
                  className="flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-black transition-colors hover:bg-zinc-200"
                >
                  <Download size={16} />
                  Download
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
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
      <SuperAgentModal isOpen={isSuperAgentModalOpen} setIsOpen={setIsSuperAgentModalOpen} />
      
      {/* Shortcuts pill */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="relative">
          <AnimatePresence>
            {showShortcutsMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowShortcutsMenu(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute bottom-full right-0 mb-2 bg-[#1c1c1c] border border-white/5 rounded-2xl p-2 z-50 shadow-2xl min-w-[240px]"
                >
                  <div className="flex flex-col gap-1">
                    <div className="px-3 py-2 flex items-center justify-between text-zinc-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors cursor-pointer">
                      <div className="flex items-center gap-3">
                        <MessageSquare size={16} className="text-zinc-500" />
                        <span className="text-sm font-medium">New Generate</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-[10px] font-sans text-zinc-400">Ctrl</kbd>
                        <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-[10px] font-sans text-zinc-400">Enter</kbd>
                      </div>
                    </div>
                    <div className="px-3 py-2 flex items-center justify-between text-zinc-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors cursor-pointer">
                      <div className="flex items-center gap-3">
                        <Search size={16} className="text-zinc-500" />
                        <span className="text-sm font-medium">Search Library</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-[10px] font-sans text-zinc-400">Ctrl</kbd>
                        <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-[10px] font-sans text-zinc-400">K</kbd>
                      </div>
                    </div>
                    <div className="px-3 py-2 flex items-center justify-between text-zinc-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors cursor-pointer">
                      <div className="flex items-center gap-3">
                        <History size={16} className="text-zinc-500" />
                        <span className="text-sm font-medium">History</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-[10px] font-sans text-zinc-400">Ctrl</kbd>
                        <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-[10px] font-sans text-zinc-400">H</kbd>
                      </div>
                    </div>
                    <div className="px-3 py-2 flex items-center justify-between text-zinc-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors cursor-pointer">
                      <div className="flex items-center gap-3">
                        <BookOpen size={16} className="text-zinc-500" />
                        <span className="text-sm font-medium">Library</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-[10px] font-sans text-zinc-400">Ctrl</kbd>
                        <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-[10px] font-sans text-zinc-400">L</kbd>
                      </div>
                    </div>
                    <div
                      onClick={() => { setView('discover'); setShowShortcutsMenu(false); }}
                      className="px-3 py-2 flex items-center justify-between text-zinc-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <Discover size={16} className="text-zinc-500" />
                        <span className="text-sm font-medium">Discover</span>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-500">Soon</span>
                    </div>
                    <div
                      onClick={() => { setView('skills'); setShowShortcutsMenu(false); }}
                      className="px-3 py-2 flex items-center justify-between text-zinc-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <Clipboard size={16} className="text-zinc-500" />
                        <span className="text-sm font-medium">Skills</span>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-500">Soon</span>
                    </div>
                     <div className="px-3 py-2 flex items-center justify-between text-zinc-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors cursor-pointer">
                      <div className="flex items-center gap-3">
                        <Code2 size={16} className="text-zinc-500" />
                        <span className="text-sm font-medium">Copy Result</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-[10px] font-sans text-zinc-400">Ctrl</kbd>
                        <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-[10px] font-sans text-zinc-400">C</kbd>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          <button 
            onClick={() => setShowShortcutsMenu(!showShortcutsMenu)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1c1c1c] hover:bg-[#2a2a2a] transition-colors text-zinc-400 hover:text-zinc-200"
          >
            <span className="font-sans text-[14px]">⌘</span>
            <span className="text-[13px] font-medium">Shortcuts</span>
          </button>
        </div>
      </div>
    </div>
  );
}
