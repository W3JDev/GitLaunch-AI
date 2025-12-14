
import React, { useState, useEffect, useRef, Suspense } from 'react';
import { Wand2, Smartphone, Monitor, Download, Loader2, Play, Send, Palette, Type, LayoutTemplate, MousePointerClick, MessageSquare, WifiOff } from 'lucide-react';
import { AppState, GeneratedPage, AnalysisResult, ChatMessage } from './types';
import { fetchRepoReadme, fetchRepoStats } from './services/githubService';
import { analyzeRepository, generateLandingPage, refineLandingPage } from './services/geminiService';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import { generateStaticHTML } from './utils/htmlGenerator';

// Lazy Load heavy components for performance
const PreviewRender = React.lazy(() => import('./components/PreviewRender'));
const AnalyticsView = React.lazy(() => import('./components/AnalyticsView'));

// --- HOOKS ---
const useOnlineStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  return isOnline;
};

// --- DATA CONSTANTS ---
const THEME_COLORS = [
    { name: 'Blue', hex: '#3b82f6', bg: 'bg-blue-500' },
    { name: 'Indigo', hex: '#6366f1', bg: 'bg-indigo-500' },
    { name: 'Violet', hex: '#8b5cf6', bg: 'bg-violet-500' },
    { name: 'Emerald', hex: '#10b981', bg: 'bg-emerald-500' },
    { name: 'Rose', hex: '#f43f5e', bg: 'bg-rose-500' },
    { name: 'Orange', hex: '#f97316', bg: 'bg-orange-500' },
    { name: 'Slate', hex: '#64748b', bg: 'bg-slate-500' },
    { name: 'Black', hex: '#000000', bg: 'bg-black' },
];

const FONTS = [
    { id: 'sans', name: 'Inter', label: 'Modern Sans' },
    { id: 'serif', name: 'Playfair Display', label: 'Elegant Serif' },
    { id: 'mono', name: 'JetBrains Mono', label: 'Tech Mono' },
];

const LAYOUTS = [
    { id: 'modern-saas', label: 'SaaS Startup', desc: 'Clean, white, trustworthy.' },
    { id: 'developer-tool', label: 'Dev Tool', desc: 'Dark mode, terminal vibes.' },
];

const App: React.FC = () => {
  const [repoUrl, setRepoUrl] = useState('');
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [activeTab, setActiveTab] = useState<'preview' | 'analytics'>('preview');
  const [sidebarTab, setSidebarTab] = useState<'chat' | 'design'>('chat');
  
  const [generatedPage, setGeneratedPage] = useState<GeneratedPage | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const isOnline = useOnlineStatus();

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, appState, sidebarTab]);

  const handleGenerate = async () => {
    if (!isOnline) {
      setErrorMsg("You are offline. Please check your connection.");
      return;
    }
    if (!repoUrl.includes('github.com')) {
      setErrorMsg('Please enter a valid GitHub URL');
      return;
    }

    setAppState(AppState.ANALYZING);
    setErrorMsg('');
    setChatHistory([]); 

    try {
      const readme = await fetchRepoReadme(repoUrl);
      const stats = await fetchRepoStats(repoUrl);
      const analysis = await analyzeRepository(readme, repoUrl);
      setAnalysisResult(analysis);
      
      setAppState(AppState.GENERATING);
      const pageData = await generateLandingPage(analysis, stats);
      setGeneratedPage(pageData);
      
      setAppState(AppState.COMPLETE);
      setChatHistory([{ role: 'assistant', content: `I've generated a ${analysis.suggestedLayout} landing page based on '${analysis.projectName}'. Use the Design tab to customize colors and fonts.` }]);

    } catch (err) {
      console.error(err);
      setAppState(AppState.ERROR);
      setErrorMsg(err instanceof Error ? err.message : 'An unexpected error occurred');
    }
  };

  const handleRefine = async () => {
    if (!chatInput.trim() || !generatedPage) return;
    if (!isOnline) {
      setChatHistory(prev => [...prev, { role: 'assistant', content: "I need an internet connection to refine the page." }]);
      return;
    }
    
    const userMsg = chatInput;
    setChatInput('');
    setChatHistory(prev => [...prev, { role: 'user', content: userMsg }]);
    setAppState(AppState.REFINING);

    try {
        const updatedPage = await refineLandingPage(generatedPage, userMsg);
        setGeneratedPage(updatedPage);
        setChatHistory(prev => [...prev, { role: 'assistant', content: "Updated! I've adjusted the page based on your feedback." }]);
        setAppState(AppState.COMPLETE);
    } catch (err) {
        setAppState(AppState.COMPLETE);
        setChatHistory(prev => [...prev, { role: 'assistant', content: "Sorry, I couldn't process that update. Try rephrasing." }]);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateMeta = (key: string, value: any) => {
      if (!generatedPage) return;
      setGeneratedPage({
          ...generatedPage,
          meta: { ...generatedPage.meta, [key]: value }
      });
  };

  const downloadSite = () => {
    if (!generatedPage) return;
    const htmlContent = generateStaticHTML(generatedPage);
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "index.html"; 
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-screen bg-slate-900 text-slate-100 overflow-hidden font-sans selection:bg-blue-500/30">
      <PWAInstallPrompt />
      
      {/* Offline Banner */}
      {!isOnline && (
        <div className="bg-red-600 text-white text-xs font-bold text-center py-1 absolute top-0 w-full z-50 flex items-center justify-center gap-2">
            <WifiOff className="w-3 h-3" /> You are currently offline. Features may be limited.
        </div>
      )}
      
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800 shrink-0 shadow-sm z-30 pt-6">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg shadow-lg shadow-blue-500/20">
            <Wand2 className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-xl tracking-tight leading-none text-slate-100">GitLaunch AI</span>
            <a href="https://w3jdev.com" target="_blank" rel="noopener noreferrer" className="text-[10px] text-slate-500 hover:text-blue-400 font-medium tracking-wide transition-colors">
                by w3jdev
            </a>
          </div>
        </div>
        
        {generatedPage && (
           <div className="flex items-center gap-2 bg-slate-900 rounded-lg p-1 border border-slate-800">
             <button 
                onClick={() => setViewMode('desktop')}
                className={`p-2 rounded-md transition-all ${viewMode === 'desktop' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                title="Desktop View"
             >
                <Monitor className="w-4 h-4" />
             </button>
             <button 
                onClick={() => setViewMode('mobile')}
                className={`p-2 rounded-md transition-all ${viewMode === 'mobile' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                title="Mobile View"
             >
                <Smartphone className="w-4 h-4" />
             </button>
           </div>
        )}

        <div>
            {generatedPage ? (
                <button 
                  onClick={downloadSite}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 active:scale-95"
                >
                    <Download className="w-4 h-4" />
                    <span className="hidden sm:inline">Export</span>
                </button>
            ) : (
                <div className="w-24"></div>
            )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden relative">
        
        {/* Sidebar */}
        <aside className="w-full md:w-[400px] bg-slate-900 border-r border-slate-800 flex flex-col z-20 shadow-2xl shrink-0 absolute md:relative h-full transition-transform">
           
           {/* URL Input State */}
           {(appState === AppState.IDLE || appState === AppState.ERROR) && (
               <div className="p-6 border-b border-slate-800">
                  <label className="block text-xs font-semibold uppercase text-slate-500 mb-2 tracking-wider">GitHub Repository</label>
                  <div className="relative group">
                    <input 
                      type="text" 
                      value={repoUrl}
                      onChange={(e) => setRepoUrl(e.target.value)}
                      placeholder="https://github.com/owner/repo"
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-3 pr-3 py-3 text-sm focus:ring-2 focus:ring-blue-600 outline-none transition-all placeholder-slate-600"
                    />
                  </div>
                  <button 
                        onClick={handleGenerate}
                        disabled={!repoUrl || !isOnline}
                        className="w-full mt-4 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed text-white font-medium py-3 rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20"
                    >
                        <Play className="w-4 h-4 fill-current" />
                        Generate Site
                    </button>
                  {errorMsg && (
                      <div className="mt-4 text-red-400 text-xs bg-red-950/50 p-3 rounded-lg border border-red-900/50 flex items-start gap-2">
                          <div className="w-1 h-full bg-red-500 rounded-full"></div>
                          {errorMsg}
                      </div>
                  )}
                  
                  <div className="mt-8 text-center">
                    <p className="text-xs text-slate-600 uppercase tracking-widest font-semibold mb-4">Try Example Repos</p>
                    <div className="flex flex-wrap gap-2 justify-center">
                        <button onClick={() => setRepoUrl('https://github.com/facebook/react')} className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-full transition-colors">facebook/react</button>
                        <button onClick={() => setRepoUrl('https://github.com/tailwindlabs/tailwindcss')} className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-full transition-colors">tailwindlabs/tailwindcss</button>
                    </div>
                  </div>
               </div>
           )}

           {/* Loading State */}
           {(appState === AppState.ANALYZING || appState === AppState.GENERATING) && (
               <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-6">
                    <div className="relative">
                        <div className="w-16 h-16 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Wand2 className="w-6 h-6 text-blue-500 animate-pulse" />
                        </div>
                    </div>
                    <div className="text-center space-y-2">
                        <h3 className="text-lg font-medium text-white">
                            {appState === AppState.ANALYZING ? 'Analyzing Repository...' : 'Designing Layout...'}
                        </h3>
                        <p className="text-sm text-slate-500 max-w-xs mx-auto">
                            {appState === AppState.ANALYZING 
                                ? 'Reading README.md, checking stars, and understanding your tech stack.' 
                                : 'Applying UX best practices, generating copy, and selecting assets.'}
                        </p>
                    </div>
               </div>
           )}

           {/* Active State (Chat/Design) */}
           {(appState === AppState.COMPLETE || appState === AppState.REFINING) && (
               <>
                 <div className="flex border-b border-slate-800 bg-slate-950">
                    <button 
                        onClick={() => setSidebarTab('chat')}
                        className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 border-b-2 transition-colors ${sidebarTab === 'chat' ? 'border-blue-500 text-white bg-slate-900' : 'border-transparent text-slate-500 hover:text-slate-300 hover:bg-slate-900/50'}`}
                    >
                        <MessageSquare className="w-4 h-4" /> AI Editor
                    </button>
                    <button 
                        onClick={() => setSidebarTab('design')}
                        className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 border-b-2 transition-colors ${sidebarTab === 'design' ? 'border-blue-500 text-white bg-slate-900' : 'border-transparent text-slate-500 hover:text-slate-300 hover:bg-slate-900/50'}`}
                    >
                        <Palette className="w-4 h-4" /> Design Studio
                    </button>
                 </div>

                 <div className="flex-1 flex flex-col min-h-0 bg-slate-900">
                    {sidebarTab === 'chat' && (
                        <>
                            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                                {chatHistory.map((msg, idx) => (
                                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[85%] rounded-2xl px-5 py-3 text-sm leading-relaxed shadow-sm ${
                                            msg.role === 'user' 
                                            ? 'bg-blue-600 text-white rounded-tr-sm' 
                                            : 'bg-slate-800 text-slate-200 rounded-tl-sm border border-slate-700'
                                        }`}>
                                            {msg.content}
                                        </div>
                                    </div>
                                ))}
                                {appState === AppState.REFINING && (
                                    <div className="flex justify-start">
                                            <div className="bg-slate-800 text-slate-400 rounded-2xl rounded-tl-sm px-5 py-3 text-sm flex items-center gap-2 border border-slate-700">
                                                <Loader2 className="w-3 h-3 animate-spin" /> Thinking...
                                            </div>
                                    </div>
                                )}
                                <div ref={chatEndRef} />
                            </div>
                            <div className="p-4 bg-slate-950 border-t border-slate-800">
                                <div className="relative">
                                    <input 
                                        type="text" 
                                        value={chatInput}
                                        onChange={(e) => setChatInput(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleRefine()}
                                        placeholder="e.g. 'Make the hero title bolder'"
                                        className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-4 pr-10 py-3 text-sm focus:ring-2 focus:ring-blue-600 outline-none transition-all placeholder-slate-500"
                                        disabled={appState === AppState.REFINING}
                                    />
                                    <button 
                                        onClick={handleRefine}
                                        disabled={!chatInput.trim() || appState === AppState.REFINING}
                                        className="absolute right-2 top-2 p-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-500 disabled:opacity-50 disabled:bg-slate-700 transition-all"
                                    >
                                        <Send className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>
                        </>
                    )}

                    {sidebarTab === 'design' && generatedPage && (
                        <div className="flex-1 overflow-y-auto p-6 space-y-8">
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-sm font-semibold text-slate-300 uppercase tracking-wide">
                                    <Palette className="w-4 h-4" /> Brand Color
                                </div>
                                <div className="grid grid-cols-4 gap-3">
                                    {THEME_COLORS.map((color) => (
                                        <button
                                            key={color.hex}
                                            onClick={() => updateMeta('themeColor', color.hex)}
                                            className={`h-10 rounded-lg ${color.bg} transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-blue-500 relative flex items-center justify-center group`}
                                        >
                                            {generatedPage.meta.themeColor.toLowerCase() === color.hex.toLowerCase() && (
                                                <div className="bg-white rounded-full p-0.5 shadow-sm">
                                                    <div className={`w-2 h-2 rounded-full ${color.bg}`} />
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <hr className="border-slate-800" />
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-sm font-semibold text-slate-300 uppercase tracking-wide">
                                    <Type className="w-4 h-4" /> Typography
                                </div>
                                <div className="grid grid-cols-1 gap-2">
                                    {FONTS.map(font => (
                                        <button 
                                            key={font.id}
                                            onClick={() => updateMeta('fontPairing', font.id)}
                                            className={`px-4 py-3 rounded-lg border text-left flex items-center justify-between transition-all ${generatedPage.meta.fontPairing === font.id ? 'bg-blue-600/10 border-blue-600 text-blue-400' : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'}`}
                                        >
                                            <span className="font-medium">{font.label}</span>
                                            <span className={`text-xs opacity-60 ${font.id === 'serif' ? 'font-serif' : font.id === 'mono' ? 'font-mono' : 'font-sans'}`}>Abc</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <hr className="border-slate-800" />
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-sm font-semibold text-slate-300 uppercase tracking-wide">
                                    <LayoutTemplate className="w-4 h-4" /> Layout Style
                                </div>
                                <div className="grid grid-cols-1 gap-3">
                                    {LAYOUTS.map(layout => (
                                        <button 
                                            key={layout.id}
                                            onClick={() => updateMeta('layoutStyle', layout.id)}
                                            className={`p-4 rounded-xl border text-left transition-all relative overflow-hidden group ${generatedPage.meta.layoutStyle === layout.id ? 'bg-slate-800 border-blue-500' : 'bg-slate-900 border-slate-700 hover:border-slate-500'}`}
                                        >
                                            <div className="relative z-10">
                                                <div className={`font-semibold mb-1 ${generatedPage.meta.layoutStyle === layout.id ? 'text-blue-400' : 'text-slate-200'}`}>{layout.label}</div>
                                                <div className="text-xs text-slate-500">{layout.desc}</div>
                                            </div>
                                            {generatedPage.meta.layoutStyle === layout.id && (
                                                <div className="absolute top-2 right-2 text-blue-500">
                                                    <MousePointerClick className="w-4 h-4" />
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                 </div>
               </>
           )}

           {/* Footer */}
           <div className="p-4 bg-slate-950 border-t border-slate-800 text-center">
               <p className="text-[10px] text-slate-600">
                  &copy; {new Date().getFullYear()} <a href="https://w3jdev.com" target="_blank" rel="noopener noreferrer" className="hover:text-slate-400 underline decoration-dotted transition-colors">w3jdev</a> · <a href="https://github.com/w3jdev" target="_blank" rel="noopener noreferrer" className="hover:text-slate-400 transition-colors">GitHub</a>
               </p>
           </div>
        </aside>

        {/* Viewport Area */}
        <div className="hidden md:flex flex-1 bg-slate-950 p-4 md:p-8 items-center justify-center overflow-hidden relative">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none opacity-50"></div>
            
            <Suspense fallback={<div className="text-slate-500 flex items-center gap-2"><Loader2 className="animate-spin w-5 h-5" /> Loading View...</div>}>
            {generatedPage ? (
                activeTab === 'preview' ? (
                     <PreviewRender data={generatedPage} viewMode={viewMode} />
                ) : (
                     <div className="w-full h-full bg-white rounded-xl shadow-2xl overflow-hidden animate-fade-in-up">
                        <AnalyticsView pageData={generatedPage} />
                     </div>
                )
            ) : (
                <div className="text-center max-w-md opacity-30 flex flex-col items-center">
                     <div className="w-32 h-32 rounded-full bg-slate-800/50 mb-6 flex items-center justify-center border-4 border-slate-800 border-dashed">
                        <Wand2 className="w-12 h-12 text-slate-600" />
                     </div>
                     <h2 className="text-xl font-medium text-slate-400">Waiting for Repository...</h2>
                </div>
            )}
            </Suspense>

            {generatedPage && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-800 p-1.5 rounded-full shadow-2xl flex gap-1 z-40">
                     <button 
                        onClick={() => setActiveTab('preview')}
                        className={`px-4 py-2 text-xs font-semibold rounded-full transition-all ${activeTab === 'preview' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
                    >
                        Live Preview
                    </button>
                    <button 
                        onClick={() => setActiveTab('analytics')}
                        className={`px-4 py-2 text-xs font-semibold rounded-full transition-all ${activeTab === 'analytics' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
                    >
                        Forecast
                    </button>
                </div>
            )}
        </div>
      </main>
    </div>
  );
};

export default App;
