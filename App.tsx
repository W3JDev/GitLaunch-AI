import React, { useState, useEffect, useRef } from 'react';
import { Github, Wand2, Layout, Smartphone, Monitor, Download, BarChart2, Loader2, Play, Send, MessageSquare } from 'lucide-react';
import { AppState, GeneratedPage, AnalysisResult, ChatMessage } from './types';
import { fetchRepoReadme, fetchRepoStats } from './services/githubService';
import { analyzeRepository, generateLandingPage, refineLandingPage } from './services/geminiService';
import PreviewRender from './components/PreviewRender';
import AnalyticsView from './components/AnalyticsView';
import { generateStaticHTML } from './utils/htmlGenerator';

const App: React.FC = () => {
  const [repoUrl, setRepoUrl] = useState('');
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [activeTab, setActiveTab] = useState<'preview' | 'analytics'>('preview');
  const [generatedPage, setGeneratedPage] = useState<GeneratedPage | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Chat State
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, appState]);

  const handleGenerate = async () => {
    if (!repoUrl.includes('github.com')) {
      setErrorMsg('Please enter a valid GitHub URL');
      return;
    }

    setAppState(AppState.ANALYZING);
    setErrorMsg('');
    setChatHistory([]); // Reset chat on new generation

    try {
      // 1. Fetch GitHub Data
      const readme = await fetchRepoReadme(repoUrl);
      const stats = await fetchRepoStats(repoUrl);
      
      // 2. Analyze with Gemini
      const analysis = await analyzeRepository(readme, repoUrl);
      setAnalysisResult(analysis);
      
      setAppState(AppState.GENERATING);

      // 3. Generate Page Content
      const pageData = await generateLandingPage(analysis, stats);
      setGeneratedPage(pageData);
      
      setAppState(AppState.COMPLETE);
      setChatHistory([{ role: 'assistant', content: `I've generated a ${analysis.suggestedLayout} landing page for you based on the repo '${analysis.projectName}'. How does it look?` }]);

    } catch (err) {
      console.error(err);
      setAppState(AppState.ERROR);
      setErrorMsg(err instanceof Error ? err.message : 'An unexpected error occurred');
    }
  };

  const handleRefine = async () => {
    if (!chatInput.trim() || !generatedPage) return;
    
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
        setAppState(AppState.COMPLETE); // Return to complete even on error to allow retry
        setChatHistory(prev => [...prev, { role: 'assistant', content: "Sorry, I couldn't process that update. Try rephrasing." }]);
    }
  };

  const downloadSite = () => {
    if (!generatedPage) return;
    
    // Generate the full HTML string
    const htmlContent = generateStaticHTML(generatedPage);
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.href = url;
    link.download = "index.html"; // The user gets a ready-to-run HTML file
    link.click();
    
    // Cleanup
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-screen bg-slate-900 text-slate-100 overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Wand2 className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight">GitLaunch AI</span>
        </div>
        
        {generatedPage && (
           <div className="flex items-center gap-4 bg-slate-900 rounded-lg p-1 border border-slate-800">
             <button 
                onClick={() => setViewMode('desktop')}
                className={`p-2 rounded-md transition-all ${viewMode === 'desktop' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'}`}
                title="Desktop View"
             >
                <Monitor className="w-4 h-4" />
             </button>
             <button 
                onClick={() => setViewMode('mobile')}
                className={`p-2 rounded-md transition-all ${viewMode === 'mobile' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'}`}
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
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors shadow-lg shadow-blue-500/20"
                >
                    <Download className="w-4 h-4" />
                    Export Site
                </button>
            ) : (
                <div className="w-24"></div>
            )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex overflow-hidden">
        
        {/* Sidebar / Input Area */}
        <aside className="w-96 bg-slate-900 border-r border-slate-800 flex flex-col z-20 shadow-2xl shrink-0">
           {/* Top: URL Input (Disabled if generated) */}
           <div className="p-6 border-b border-slate-800">
              <label className="block text-xs font-semibold uppercase text-slate-500 mb-2">GitHub Repository</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  placeholder="https://github.com/owner/repo"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600 outline-none transition-all placeholder-slate-600"
                  disabled={appState !== AppState.IDLE && appState !== AppState.ERROR}
                />
              </div>
              {appState === AppState.IDLE || appState === AppState.ERROR ? (
                <button 
                    onClick={handleGenerate}
                    disabled={!repoUrl}
                    className="w-full mt-4 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                    <Play className="w-4 h-4 fill-current" />
                    Generate Site
                </button>
              ) : (
                <div className="mt-4 flex items-center justify-center gap-2 text-slate-400 text-sm">
                   {appState === AppState.COMPLETE || appState === AppState.REFINING ? (
                        <span className="text-green-500 flex items-center gap-2"><div className="w-2 h-2 bg-green-500 rounded-full"></div> Site Live</span>
                   ) : (
                       <span className="flex items-center gap-2"><Loader2 className="w-3 h-3 animate-spin" /> Processing...</span>
                   )}
                </div>
              )}
              {errorMsg && (
                  <div className="mt-3 text-red-400 text-xs bg-red-900/20 p-2 rounded border border-red-900/50">
                      {errorMsg}
                  </div>
              )}
           </div>

           {/* Middle: Chat Interface / Progress */}
           <div className="flex-1 flex flex-col min-h-0 bg-slate-900/50">
              {appState === AppState.IDLE ? (
                 <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-slate-600">
                    <Github className="w-12 h-12 mb-4 opacity-20" />
                    <p className="text-sm">Enter a GitHub URL to generate a high-converting landing page instantly.</p>
                 </div>
              ) : (appState === AppState.ANALYZING || appState === AppState.GENERATING) ? (
                  <div className="flex-1 p-6 space-y-6">
                      <div className="space-y-4">
                          <div className="flex items-center gap-3 text-sm text-blue-400">
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <span>{appState === AppState.ANALYZING ? 'Analyzing codebase...' : 'Generating designs...'}</span>
                          </div>
                          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                              <div className={`h-full bg-blue-600 transition-all duration-1000 ${appState === AppState.GENERATING ? 'w-2/3' : 'w-1/3'}`}></div>
                          </div>
                      </div>
                  </div>
              ) : (
                  // Chat History
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      {chatHistory.map((msg, idx) => (
                          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                              <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                                  msg.role === 'user' 
                                  ? 'bg-blue-600 text-white rounded-tr-sm' 
                                  : 'bg-slate-800 text-slate-200 rounded-tl-sm'
                              }`}>
                                  {msg.content}
                              </div>
                          </div>
                      ))}
                      {appState === AppState.REFINING && (
                           <div className="flex justify-start">
                                <div className="bg-slate-800 text-slate-400 rounded-2xl rounded-tl-sm px-4 py-3 text-sm flex items-center gap-2">
                                    <Loader2 className="w-3 h-3 animate-spin" /> Thinking...
                                </div>
                           </div>
                      )}
                      <div ref={chatEndRef} />
                  </div>
              )}
           </div>

           {/* Bottom: Chat Input (Only when complete) */}
           {(appState === AppState.COMPLETE || appState === AppState.REFINING) && (
               <div className="p-4 bg-slate-950 border-t border-slate-800">
                   <div className="relative">
                       <input 
                          type="text" 
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleRefine()}
                          placeholder="Refine: 'Make it darker', 'Add urgency'..."
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
                   <div className="text-[10px] text-slate-500 mt-2 text-center">
                       AI can hallucinate. Check generated code.
                   </div>
               </div>
           )}

           {/* Tab Switcher (Only visible when generated) */}
           {(appState === AppState.COMPLETE || appState === AppState.REFINING) && (
                <div className="p-2 bg-slate-950 border-t border-slate-800 flex gap-1">
                    <button 
                        onClick={() => setActiveTab('preview')}
                        className={`flex-1 py-2 text-xs font-medium rounded-md flex items-center justify-center gap-2 ${activeTab === 'preview' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        <Layout className="w-3 h-3" /> Preview
                    </button>
                    <button 
                        onClick={() => setActiveTab('analytics')}
                        className={`flex-1 py-2 text-xs font-medium rounded-md flex items-center justify-center gap-2 ${activeTab === 'analytics' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        <BarChart2 className="w-3 h-3" /> Analytics
                    </button>
                </div>
           )}
        </aside>

        {/* Viewport Area */}
        <div className="flex-1 bg-slate-950 p-4 md:p-8 flex items-center justify-center overflow-hidden relative">
            <div className="absolute inset-0 pattern-grid opacity-5 pointer-events-none"></div>
            
            {generatedPage ? (
                activeTab === 'preview' ? (
                     <PreviewRender data={generatedPage} viewMode={viewMode} />
                ) : (
                     <div className="w-full h-full bg-white rounded-xl shadow-2xl overflow-hidden">
                        <AnalyticsView pageData={generatedPage} />
                     </div>
                )
            ) : (
                <div className="text-center max-w-md opacity-30">
                     <Layout className="w-32 h-32 mx-auto mb-6 stroke-1 text-slate-600" />
                     <h2 className="text-2xl font-light text-slate-400">Waiting for input...</h2>
                </div>
            )}
        </div>
      </main>
    </div>
  );
};

export default App;
