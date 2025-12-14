
import React, { useEffect, useRef, useState } from 'react';
import { GeneratedPage } from '../types';
import * as Icons from 'lucide-react';

interface PreviewRenderProps {
  data: GeneratedPage;
  viewMode: 'desktop' | 'mobile';
}

// --- UTILS & HOOKS ---

const useOnScreen = (options: IntersectionObserverInit) => {
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setVisible(true);
                observer.disconnect();
            }
        }, options);

        if (ref.current) observer.observe(ref.current);

        return () => observer.disconnect();
    }, [ref, options]);

    return [ref, isVisible] as const;
};

interface ScrollRevealProps {
    children?: React.ReactNode;
    className?: string;
    delay?: number;
    direction?: 'up' | 'left' | 'right';
}

const ScrollReveal: React.FC<ScrollRevealProps> = ({ children, className = '', delay = 0, direction = 'up' }) => {
    const [ref, isVisible] = useOnScreen({ threshold: 0.1 });
    
    let translateClass = 'translate-y-8';
    if (direction === 'left') translateClass = '-translate-x-8';
    if (direction === 'right') translateClass = 'translate-x-8';

    return (
        <div 
            ref={ref} 
            className={`transition-all duration-1000 ease-out transform ${isVisible ? 'opacity-100 translate-x-0 translate-y-0' : `opacity-0 ${translateClass}`} ${className}`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            {children}
        </div>
    );
};

const IconRenderer = ({ name, className }: { name: string; className?: string }) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const LucideIcon = (Icons as any)[name] || Icons.Code;
  return <LucideIcon className={className} />;
};

const AIImage = ({ prompt, className, alt }: { prompt: string, className?: string, alt: string }) => {
    const safePrompt = prompt || 'technology abstract software';
    const encodedPrompt = encodeURIComponent(safePrompt);
    const src = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1200&height=800&nologo=true&seed=${safePrompt.length}`;
    return <img src={src} alt={alt} className={className} loading="lazy" />;
};

// --- COMPONENTS ---

const Navbar = ({ data, isDark }: { data: GeneratedPage, isDark: boolean }) => (
    <nav className={`flex items-center justify-between px-6 py-5 sticky top-0 z-40 backdrop-blur-xl border-b transition-colors duration-300 ${isDark ? 'bg-[#0B0F19]/80 border-slate-800 text-white' : 'bg-white/80 border-gray-100 text-slate-900'}`}>
        <div className="font-bold text-xl flex items-center gap-2 tracking-tighter cursor-pointer hover:opacity-80 transition-opacity">
            <div className="p-1.5 rounded-lg text-white shadow-lg" style={{ backgroundColor: data.meta?.themeColor || '#3b82f6' }}>
                <Icons.Box className="w-5 h-5" />
            </div>
            <span className={isDark ? 'text-white' : 'text-slate-900'}>{data.meta?.brandName || 'App'}</span>
        </div>
        <div className={`hidden md:flex gap-8 text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-500'}`}>
            <a href="#problem" className="hover:text-blue-500 transition-colors">Solutions</a>
            <a href="#features" className="hover:text-blue-500 transition-colors">Product</a>
            <a href="#pricing" className="hover:text-blue-500 transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-blue-500 transition-colors">Resources</a>
        </div>
        <div className="flex gap-4 items-center">
             <button className={`hidden sm:block text-sm font-medium transition-colors ${isDark ? 'text-slate-300 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}>
                Sign in
            </button>
            <button 
                className={`px-5 py-2.5 rounded-full text-sm font-semibold text-white transition-all hover:scale-105 shadow-xl shadow-blue-500/20`}
                style={{ backgroundColor: data.meta?.themeColor || '#3b82f6' }}
            >
                {data.hero?.ctaSecondary || 'Get Started'}
            </button>
        </div>
    </nav>
);

const TrustedBy = ({ isDark }: { isDark: boolean }) => (
    <div className={`py-12 border-b ${isDark ? 'bg-[#0B0F19] border-slate-800' : 'bg-white border-gray-100'}`}>
        <p className={`text-center text-xs font-bold uppercase tracking-widest mb-8 opacity-40 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Trusted by innovative teams worldwide</p>
        <div className="flex justify-center flex-wrap gap-12 opacity-30 grayscale hover:grayscale-0 transition-all duration-500 px-6">
            {[Icons.Trello, Icons.Figma, Icons.Slack, Icons.Github, Icons.Chrome, Icons.Codepen].map((Icon, i) => (
                <Icon key={i} className={`w-8 h-8 ${isDark ? 'text-white' : 'text-slate-900'}`} />
            ))}
        </div>
    </div>
);

const HeroSaaS = ({ data }: { data: GeneratedPage }) => (
    <section className="relative pt-32 pb-20 overflow-hidden bg-white">
        {/* Soft Gradients */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
             <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-purple-100/50 rounded-full blur-3xl opacity-60"></div>
             <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-100/50 rounded-full blur-3xl opacity-60"></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
             <ScrollReveal>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-slate-600 text-xs font-bold uppercase tracking-wide mb-8 hover:bg-white transition-colors cursor-pointer">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                    </span>
                    New Release v2.0
                </div>
            </ScrollReveal>

            <ScrollReveal delay={100}>
                <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-slate-900 mb-8 leading-[1.05]">
                    {data.hero?.headline}
                </h1>
            </ScrollReveal>
            
            <ScrollReveal delay={200}>
                <p className="text-xl md:text-2xl text-slate-500 max-w-3xl mx-auto mb-12 leading-relaxed font-light">
                    {data.hero?.subheadline}
                </p>
            </ScrollReveal>
            
            <ScrollReveal delay={300}>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20">
                    <button 
                        className="px-8 py-4 rounded-full text-lg font-bold text-white shadow-2xl shadow-blue-500/20 transform hover:-translate-y-1 transition-all"
                        style={{ backgroundColor: data.meta?.themeColor || '#3b82f6' }}
                    >
                        {data.hero?.ctaPrimary || 'Start Free Trial'}
                    </button>
                    <button className="px-8 py-4 rounded-full text-lg font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm hover:shadow">
                        <Icons.PlayCircle className="w-5 h-5" />
                        View Demo
                    </button>
                </div>
            </ScrollReveal>

            <ScrollReveal delay={400}>
                <div className="relative mx-auto rounded-2xl p-2 bg-slate-900/5 shadow-2xl ring-1 ring-slate-900/10 backdrop-blur-sm">
                    <div className="rounded-xl overflow-hidden bg-white shadow-inner aspect-[16/9] relative group">
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10"></div>
                        <AIImage prompt={`clean minimalist saas dashboard ui ${data.meta?.themeColor} light mode`} alt="App Dashboard" className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000" />
                        
                        {/* Floating Cards Mockup */}
                        <div className="absolute -bottom-10 -right-10 w-48 h-32 bg-white rounded-lg shadow-xl p-4 hidden md:block animate-blob animation-delay-2000 z-20">
                             <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mb-2">
                                 <Icons.TrendingUp className="w-4 h-4 text-green-600" />
                             </div>
                             <div className="h-2 w-20 bg-slate-100 rounded mb-2"></div>
                             <div className="h-2 w-12 bg-slate-100 rounded"></div>
                        </div>
                    </div>
                </div>
            </ScrollReveal>
        </div>
    </section>
);

const HeroDevTool = ({ data }: { data: GeneratedPage }) => (
    <section className="relative pt-32 pb-24 px-6 bg-[#0B0F19] text-white overflow-hidden min-h-[90vh] flex flex-col justify-center">
        {/* Animated Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_0%,#000_70%,transparent_100%)] z-0"></div>

        <div className="relative z-10 max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
            <div>
                <ScrollReveal>
                    <div className="inline-flex items-center gap-3 px-3 py-1.5 rounded-full border border-slate-700 bg-slate-800/50 backdrop-blur text-blue-400 font-mono text-sm mb-8">
                        <Icons.Github className="w-4 h-4" />
                        <span>{data.githubStats?.stars?.toLocaleString() || '2.4k'} Stars</span>
                    </div>
                </ScrollReveal>

                <ScrollReveal delay={100}>
                    <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-8 leading-none bg-clip-text text-transparent bg-gradient-to-br from-white via-white to-slate-500">
                        {data.hero?.headline}
                    </h1>
                </ScrollReveal>

                <ScrollReveal delay={200}>
                    <p className="text-xl text-slate-400 mb-10 leading-relaxed max-w-lg font-light">
                        {data.hero?.subheadline}
                    </p>
                </ScrollReveal>

                <ScrollReveal delay={300}>
                    <div className="flex flex-col sm:flex-row gap-4">
                         <button 
                            className="h-14 px-8 rounded-full bg-white text-slate-900 font-bold hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
                        >
                            <Icons.Terminal className="w-5 h-5" />
                            Install SDK
                        </button>
                        <button className="h-14 px-8 rounded-full border border-slate-700 text-slate-300 font-medium hover:border-slate-500 hover:text-white transition-all bg-slate-900/50">
                            Read Documentation
                        </button>
                    </div>
                </ScrollReveal>
            </div>

            <ScrollReveal delay={400} direction="right">
                <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur-2xl opacity-20"></div>
                    <div className="relative bg-[#0F1117] rounded-xl border border-slate-800 shadow-2xl overflow-hidden">
                        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-[#0F1117]">
                             <div className="flex gap-2">
                                 <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                                 <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                                 <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
                             </div>
                             <div className="text-xs text-slate-500 font-mono">install.sh</div>
                        </div>
                        <div className="p-6 font-mono text-sm overflow-x-auto text-slate-300">
                             <div className="flex"><span className="text-blue-400 mr-4">$</span> <span>npm install @{data.meta?.brandName?.toLowerCase() || 'app'}/core</span></div>
                             <div className="flex text-slate-500 mt-2"><span className="mr-4"> </span> <span>Installing dependencies...</span></div>
                             <div className="flex text-green-400 mt-2"><span className="mr-4">✔</span> <span>Core engine ready</span></div>
                             <div className="flex mt-4"><span className="text-blue-400 mr-4">$</span> <span className="animate-pulse">_</span></div>
                        </div>
                    </div>
                </div>
            </ScrollReveal>
        </div>
    </section>
);

const ZigZagSection = ({ data, isDark }: { data: GeneratedPage, isDark: boolean }) => {
    // Robust check for missing data to ensure section renders if ANY content is present
    const hasProblem = data.problemSolution?.problemTitle || data.problemSolution?.problemDescription;
    const hasSolution = data.problemSolution?.solutionTitle || data.problemSolution?.solutionDescription;

    if (!hasProblem && !hasSolution) return null;

    return (
        <div id="problem" className={`py-32 px-6 overflow-hidden ${isDark ? 'bg-[#0F1117] text-white' : 'bg-slate-50 text-slate-900'}`}>
             <div className="max-w-7xl mx-auto space-y-32">
                 
                 {/* Problem Block */}
                 {hasProblem && (
                 <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <ScrollReveal direction="left">
                        <div className="relative aspect-square md:aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
                             <AIImage prompt="chaotic messy office paper work stress abstract red tones" alt="Problem visualization" className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity" />
                             <div className="absolute inset-0 bg-gradient-to-tr from-red-500/20 to-transparent mix-blend-overlay"></div>
                             <div className="absolute bottom-8 left-8 bg-white/90 backdrop-blur p-4 rounded-xl shadow-lg max-w-xs">
                                 <div className="flex items-center gap-3 text-red-600 font-bold mb-1">
                                     <Icons.AlertCircle className="w-5 h-5" />
                                     <span>The Challenge</span>
                                 </div>
                                 <p className="text-slate-600 text-sm">Inefficient manual processes slowing you down.</p>
                             </div>
                        </div>
                    </ScrollReveal>
                    
                    <ScrollReveal>
                        <div className="space-y-6">
                            <h2 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight">{data.problemSolution?.problemTitle || "The Challenge"}</h2>
                            <p className={`text-xl leading-relaxed font-light ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                {data.problemSolution?.problemDescription || "Manual operations are prone to error and waste valuable resources."}
                            </p>
                            <div className="pl-6 border-l-4 border-red-500/30 space-y-4">
                                <div className="flex items-center gap-3">
                                    <Icons.X className="w-5 h-5 text-red-500" />
                                    <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>Disconnected systems</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Icons.X className="w-5 h-5 text-red-500" />
                                    <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>Manual data entry errors</span>
                                </div>
                            </div>
                        </div>
                    </ScrollReveal>
                 </div>
                 )}

                 {/* Solution Block */}
                 {hasSolution && (
                 <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <ScrollReveal className="lg:order-2" direction="right">
                        <div className="relative aspect-square md:aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl ring-1 ring-slate-900/5">
                             <AIImage prompt={`organized clean minimalist ${data.meta?.themeColor} futuristic ui dashboard layout`} alt="Solution visualization" className="w-full h-full object-cover" />
                             <div className={`absolute inset-0 bg-gradient-to-bl from-${isDark ? 'blue-900' : 'blue-500'}/10 to-transparent mix-blend-overlay`}></div>
                             <div className="absolute top-8 right-8 bg-white/90 backdrop-blur p-4 rounded-xl shadow-lg max-w-xs">
                                 <div className="flex items-center gap-3 text-green-600 font-bold mb-1">
                                     <Icons.CheckCircle2 className="w-5 h-5" />
                                     <span>The Solution</span>
                                 </div>
                                 <p className="text-slate-600 text-sm">Automated workflows running 24/7.</p>
                             </div>
                        </div>
                    </ScrollReveal>

                    <ScrollReveal className="lg:order-1">
                        <div className="space-y-6">
                            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide mb-2 ${isDark ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-100 text-blue-700'}`}>
                                <Icons.Sparkles className="w-3 h-3" />
                                The Solution
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight">{data.problemSolution?.solutionTitle || "The Solution"}</h2>
                            <p className={`text-xl leading-relaxed font-light ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                {data.problemSolution?.solutionDescription || "Streamline your operations with our automated platform."}
                            </p>
                            <button className={`mt-4 flex items-center gap-2 font-semibold group ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                                <span className="group-hover:underline">Explore the platform</span> 
                                <Icons.ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </button>
                        </div>
                    </ScrollReveal>
                 </div>
                 )}
             </div>
        </div>
    );
};

const BentoFeatures = ({ data, isDark }: { data: GeneratedPage, isDark: boolean }) => (
    <section id="features" className={`py-32 px-6 ${isDark ? 'bg-[#0B0F19]' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto">
            <ScrollReveal>
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <h2 className={`text-4xl md:text-5xl font-bold mb-6 tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        Everything you need to scale
                    </h2>
                    <p className={`text-xl ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        Powerful features designed for modern teams, packaged in a beautiful interface.
                    </p>
                </div>
            </ScrollReveal>

            <div className="grid md:grid-cols-3 gap-6 auto-rows-[300px]">
                {data.features?.map((feature, idx) => {
                    const isLarge = idx === 0 || idx === 3;
                    return (
                        <ScrollReveal key={idx} delay={idx * 100} className={`${isLarge ? 'md:col-span-2' : ''} h-full`}>
                            <div className={`group relative h-full rounded-3xl p-8 overflow-hidden transition-all duration-300 hover:shadow-2xl border ${isDark ? 'bg-slate-900 border-slate-800 hover:border-slate-700' : 'bg-slate-50 border-gray-100 hover:border-blue-200 hover:bg-white'}`}>
                                <div className="relative z-10 flex flex-col h-full">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 text-2xl transition-transform group-hover:scale-110 ${isDark ? 'bg-slate-800 text-blue-400' : 'bg-white shadow-sm text-blue-600'}`}>
                                        <IconRenderer name={feature.icon} />
                                    </div>
                                    <h3 className={`text-2xl font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>{feature.title}</h3>
                                    <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'} leading-relaxed`}>
                                        {feature.description}
                                    </p>
                                </div>
                                {/* Decorative Gradient Blob */}
                                <div className={`absolute -bottom-20 -right-20 w-64 h-64 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 ${isDark ? 'bg-blue-600/20' : 'bg-blue-400/20'}`}></div>
                            </div>
                        </ScrollReveal>
                    );
                })}
            </div>
        </div>
    </section>
);

const SocialProof = ({ data, isDark }: { data: GeneratedPage, isDark: boolean }) => {
    // Robust check against empty strings or undefined
    if (!data.socialProof?.testimonial || data.socialProof.testimonial.length < 5) return null;

    return (
    <section className={`py-32 px-6 border-y relative overflow-hidden ${isDark ? 'bg-[#0F1117] border-slate-800' : 'bg-slate-900 border-gray-100'}`}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
            <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
            </svg>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center">
            <ScrollReveal>
                <div className="flex justify-center mb-8 text-yellow-400 gap-1">
                    {[...Array(5)].map((_, i) => <Icons.Star key={i} className="w-6 h-6 fill-current" />)}
                </div>
                <blockquote className="text-3xl md:text-5xl font-medium leading-tight text-white mb-10">
                    "{data.socialProof.testimonial}"
                </blockquote>
                <div className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-400 to-purple-500 p-[2px] mb-4">
                        <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-xl font-bold text-white uppercase">
                            {data.socialProof.testimonialAuthor ? data.socialProof.testimonialAuthor.charAt(0) : 'U'}
                        </div>
                    </div>
                    <div className="text-white font-bold text-lg">{data.socialProof.testimonialAuthor}</div>
                    {(data.socialProof.stat || data.socialProof.statLabel) && (
                        <div className="text-slate-400 mt-2">{data.socialProof.stat} • {data.socialProof.statLabel}</div>
                    )}
                </div>
            </ScrollReveal>
        </div>
    </section>
    );
};

const FAQ = ({ data, isDark }: { data: GeneratedPage, isDark: boolean }) => (
    <section id="faq" className={`py-32 px-6 ${isDark ? 'bg-[#0B0F19]' : 'bg-white'}`}>
        <div className="max-w-3xl mx-auto">
            <ScrollReveal>
                <h2 className={`text-3xl font-bold mb-16 text-center tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Common Questions</h2>
            </ScrollReveal>
            <div className="space-y-4">
                {data.faq?.map((item, idx) => (
                    <ScrollReveal key={idx} delay={idx * 50}>
                        <div className={`p-6 rounded-2xl transition-all hover:shadow-md cursor-pointer group ${isDark ? 'bg-slate-900 hover:bg-slate-800' : 'bg-slate-50 hover:bg-white border border-transparent hover:border-gray-200'}`}>
                            <div className="flex justify-between items-center mb-2">
                                <h4 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>{item.question}</h4>
                                <Icons.Plus className={`w-5 h-5 transition-transform group-hover:rotate-45 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                            </div>
                            <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'} hidden group-hover:block transition-all mt-2`}>{item.answer}</p>
                        </div>
                    </ScrollReveal>
                ))}
            </div>
        </div>
    </section>
);

const Pricing = ({ data, isDark }: { data: GeneratedPage, isDark: boolean }) => (
    <section id="pricing" className={`py-32 px-6 ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
         <div className="max-w-7xl mx-auto">
            <ScrollReveal>
                <div className="text-center mb-20">
                    <h2 className={`text-4xl font-bold mb-4 tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Simple, transparent pricing</h2>
                    <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>No hidden fees. Cancel anytime.</p>
                </div>
            </ScrollReveal>

            <div className="grid md:grid-cols-3 gap-8 items-start">
                {data.pricing?.map((plan, idx) => (
                    <ScrollReveal key={idx} delay={idx * 150} className="h-full">
                        <div className={`relative p-10 rounded-3xl h-full flex flex-col transition-transform duration-300 hover:-translate-y-2 ${plan.isPopular 
                            ? `bg-slate-900 text-white shadow-2xl ring-4 ring-blue-500/20 scale-105` 
                            : (isDark ? 'bg-[#0F1117] border border-slate-800 text-white' : 'bg-white border border-gray-100 text-slate-900 shadow-xl shadow-slate-200/50')}`}
                        >
                            {plan.isPopular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-blue-600 text-white text-xs font-bold rounded-full uppercase tracking-wide">
                                    Most Popular
                                </div>
                            )}
                            <h3 className="text-xl font-bold mb-2 opacity-80">{plan.planName}</h3>
                            <div className="text-5xl font-bold mb-6 tracking-tight">
                                {plan.price}<span className="text-lg font-normal opacity-50">/mo</span>
                            </div>
                            <p className="text-sm opacity-60 mb-8 pb-8 border-b border-gray-200/10">Perfect for growing teams and startups.</p>
                            
                            <ul className="space-y-4 mb-8 flex-1">
                                {plan.features.map((feat, i) => (
                                    <li key={i} className="flex items-start gap-3 text-sm">
                                        <Icons.Check className={`w-5 h-5 shrink-0 ${plan.isPopular ? 'text-blue-400' : 'text-green-500'}`} />
                                        <span className="opacity-80">{feat}</span>
                                    </li>
                                ))}
                            </ul>
                            <button 
                                className={`w-full py-4 rounded-xl font-bold transition-all ${plan.isPopular 
                                    ? 'bg-blue-600 hover:bg-blue-500 text-white' 
                                    : (isDark ? 'bg-slate-800 hover:bg-slate-700' : 'bg-slate-100 hover:bg-slate-200 text-slate-900')}`}
                            >
                                Get Started
                            </button>
                        </div>
                    </ScrollReveal>
                ))}
            </div>
        </div>
    </section>
);

const CTA = ({ data, isDark }: { data: GeneratedPage, isDark: boolean }) => (
    <section className="py-24 px-6">
         <div className={`max-w-5xl mx-auto rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden ${isDark ? 'bg-blue-900' : 'bg-slate-900'}`}>
            <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
                 <div className="absolute top-[-50%] left-[-50%] w-[1000px] h-[1000px] bg-blue-500 rounded-full blur-[150px]"></div>
            </div>
            
            <ScrollReveal className="relative z-10">
                <h2 className="text-4xl md:text-6xl font-bold mb-8 text-white tracking-tight">
                    Start building with {data.meta?.brandName || 'us'} today.
                </h2>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button 
                        className="px-10 py-5 rounded-full text-xl font-bold text-slate-900 bg-white hover:bg-blue-50 transition-all shadow-xl"
                    >
                        {data.hero?.ctaPrimary || 'Get Started Now'}
                    </button>
                </div>
                <p className="mt-8 text-slate-400 text-sm">No credit card required • 14-day free trial</p>
            </ScrollReveal>
         </div>
    </section>
);

const Footer = ({ data, isDark }: { data: GeneratedPage, isDark: boolean }) => (
    <footer className={`py-20 px-6 border-t ${isDark ? 'bg-[#0B0F19] border-slate-800 text-slate-500' : 'bg-white border-gray-100 text-slate-500'}`}>
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12 mb-12 text-sm">
            <div className="col-span-1 md:col-span-1">
                <div className={`font-bold text-xl mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                     <Icons.Box className="w-6 h-6 text-blue-500" />
                     {data.meta?.brandName}
                </div>
                <p className="mb-4">Making work flow better for everyone, everywhere.</p>
                <div className="flex gap-4">
                    <Icons.Twitter className="w-5 h-5 cursor-pointer hover:text-blue-500 transition-colors" />
                    <Icons.Github className="w-5 h-5 cursor-pointer hover:text-blue-500 transition-colors" />
                    <Icons.Linkedin className="w-5 h-5 cursor-pointer hover:text-blue-500 transition-colors" />
                </div>
            </div>
            <div>
                <h4 className={`font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>Product</h4>
                <ul className="space-y-2">
                    <li>Features</li>
                    <li>Integrations</li>
                    <li>Pricing</li>
                    <li>Changelog</li>
                </ul>
            </div>
            <div>
                <h4 className={`font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>Company</h4>
                <ul className="space-y-2">
                    <li>About Us</li>
                    <li>Careers</li>
                    <li>Blog</li>
                    <li>Contact</li>
                </ul>
            </div>
            <div>
                <h4 className={`font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>Legal</h4>
                <ul className="space-y-2">
                    <li>Privacy Policy</li>
                    <li>Terms of Service</li>
                    <li>Security</li>
                </ul>
            </div>
        </div>
        <div className="max-w-7xl mx-auto pt-8 border-t border-gray-200/10 text-center">
            <p>© 2024 {data.meta?.brandName || 'App'}. All rights reserved.</p>
        </div>
    </footer>
);

// --- MAIN PREVIEW COMPONENT ---

const PreviewRender: React.FC<PreviewRenderProps> = ({ data, viewMode }) => {
  const isDevTool = data.meta?.layoutStyle === 'developer-tool';
  const isDark = isDevTool; 
  
  // Font selection logic
  const fontClass = data.meta?.fontPairing === 'serif' ? 'font-serif' : 'font-sans';

  const containerStyle = viewMode === 'mobile' 
    ? 'w-[375px] h-[750px] border-[12px] border-[#1a1a1a] rounded-[3rem] overflow-y-auto shadow-2xl bg-black' 
    : 'w-full h-full overflow-y-auto rounded-xl shadow-2xl';

  return (
    <div className={`mx-auto transition-all duration-300 ${containerStyle} ${fontClass} ${isDark ? 'bg-[#0B0F19]' : 'bg-white'} scroll-smooth relative no-scrollbar`}>
      
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@300;400;500;600;700&display=swap');
        .font-serif { font-family: 'Playfair Display', serif; }
        .font-sans { font-family: 'Inter', sans-serif; }
      `}</style>

      {viewMode === 'desktop' && (
        <div className={`sticky top-0 z-50 px-4 py-2 flex items-center justify-between text-xs border-b ${isDark ? 'bg-[#0B0F19] text-slate-400 border-slate-800' : 'bg-white text-slate-500 border-gray-200'}`}>
           <div className="flex space-x-2">
             <div className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E]"></div>
             <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]"></div>
             <div className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]"></div>
           </div>
           <div className="font-medium opacity-80">{data.meta?.title || 'Untitled'}</div>
           <div className="w-10"></div>
        </div>
      )}

      <Navbar data={data} isDark={isDark} />
      
      {isDevTool ? <HeroDevTool data={data} /> : <HeroSaaS data={data} />}
      
      <TrustedBy isDark={isDark} />

      <ZigZagSection data={data} isDark={isDark} />
      
      <BentoFeatures data={data} isDark={isDark} />
      
      <SocialProof data={data} isDark={isDark} />
      
      <Pricing data={data} isDark={isDark} />

      <FAQ data={data} isDark={isDark} />

      <CTA data={data} isDark={isDark} />
      
      <Footer data={data} isDark={isDark} />
    </div>
  );
};

export default PreviewRender;
