
import { GeneratedPage } from "../types";

export const generateStaticHTML = (data: GeneratedPage): string => {
  const themeColor = data.meta?.themeColor || '#3b82f6';
  const brandName = data.meta?.brandName || 'App';
  const isDevTool = data.meta?.layoutStyle === 'developer-tool';
  const isDark = isDevTool;
  
  return `<!DOCTYPE html>
<html lang="en" class="${isDark ? 'dark' : ''} scroll-smooth">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.meta?.title || 'Landing Page'}</title>
    <meta name="description" content="${data.meta?.description || ''}">
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/lucide@latest"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@300;400;500;600;700;800&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap');
        
        body { font-family: 'Inter', sans-serif; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
        .font-serif { font-family: 'Playfair Display', serif; }
        
        /* Custom Animations */
        @keyframes blob {
            0% { transform: translate(0px, 0px) scale(1); }
            33% { transform: translate(30px, -50px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
            100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        
        @keyframes fade-up {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .reveal {
            animation: fade-up 0.8s ease-out forwards;
            opacity: 0;
        }
    </style>
    <script>
        tailwind.config = {
            darkMode: 'class',
            theme: {
                extend: {
                    colors: {
                        primary: '${themeColor}',
                    }
                }
            }
        }
    </script>
</head>
<body class="${isDark ? 'bg-[#0B0F19] text-white' : 'bg-white text-slate-900'} antialiased ${data.meta?.fontPairing === 'serif' ? 'font-serif' : 'font-sans'}">

    <!-- Navbar -->
    <nav class="fixed w-full z-50 transition-all duration-300 border-b ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-gray-100'} backdrop-blur-md">
        <div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div class="font-bold text-xl flex items-center gap-2 tracking-tighter">
                <div class="p-1.5 rounded-lg text-white" style="background-color: ${themeColor}">
                    <i data-lucide="box" class="w-5 h-5"></i>
                </div>
                <span>${brandName}</span>
            </div>
            <div class="hidden md:flex gap-8 text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}">
                <a href="#problem" class="hover:text-primary transition-colors">Solutions</a>
                <a href="#features" class="hover:text-primary transition-colors">Product</a>
                <a href="#pricing" class="hover:text-primary transition-colors">Pricing</a>
                <a href="#faq" class="hover:text-primary transition-colors">Resources</a>
            </div>
            <div class="flex gap-4 items-center">
                 <button class="hidden sm:block text-sm font-medium ${isDark ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'}">
                    Sign in
                </button>
                <button class="px-5 py-2.5 rounded-lg text-sm font-semibold text-white transition-all hover:scale-105 shadow-lg shadow-primary/20" style="background-color: ${themeColor}">
                    ${data.hero?.ctaSecondary || 'Get Started'}
                </button>
            </div>
        </div>
    </nav>

    ${isDevTool ? `
    <!-- DEV TOOL HERO -->
    <section class="relative pt-32 pb-24 overflow-hidden min-h-[90vh] flex flex-col justify-center">
        <!-- Grid Background -->
        <div class="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_0%,#000_70%,transparent_100%)] z-0"></div>

        <div class="relative z-10 max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">
            <div>
                <div class="reveal">
                    <div class="inline-flex items-center gap-3 px-3 py-1.5 rounded-full border border-slate-700 bg-slate-800/50 backdrop-blur text-blue-400 font-mono text-sm mb-8">
                         <i data-lucide="github" class="w-4 h-4"></i>
                         <span>${data.githubStats?.stars.toLocaleString() || '0'} Stars</span>
                    </div>
                </div>
                <h1 class="reveal text-6xl md:text-8xl font-bold tracking-tight mb-8 leading-none bg-clip-text text-transparent bg-gradient-to-br from-white via-white to-slate-500" style="animation-delay: 0.1s">
                    ${data.hero?.headline}
                </h1>
                <p class="reveal text-xl text-slate-400 mb-10 leading-relaxed max-w-lg" style="animation-delay: 0.2s">
                    ${data.hero?.subheadline}
                </p>
                <div class="reveal flex flex-col sm:flex-row gap-4" style="animation-delay: 0.3s">
                    <button class="h-14 px-8 rounded-lg bg-white text-slate-900 font-bold hover:bg-slate-200 transition-colors flex items-center justify-center gap-2">
                        <i data-lucide="terminal" class="w-5 h-5"></i> Install SDK
                    </button>
                    <button class="h-14 px-8 rounded-lg border border-slate-700 text-slate-300 font-medium hover:border-slate-500 hover:text-white transition-all bg-slate-900/50">
                        Read Documentation
                    </button>
                </div>
            </div>
            <div class="reveal relative" style="animation-delay: 0.4s">
                <div class="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur-2xl opacity-20"></div>
                <div class="relative bg-[#0F1117] rounded-xl border border-slate-800 shadow-2xl overflow-hidden">
                     <div class="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-[#0F1117]">
                         <div class="flex gap-2">
                             <div class="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                             <div class="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                             <div class="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
                         </div>
                         <div class="text-xs text-slate-500 font-mono">install.sh</div>
                     </div>
                     <div class="p-6 font-mono text-sm overflow-x-auto text-slate-300">
                         <div class="flex"><span class="text-blue-400 mr-4">$</span> <span>npm install @${brandName.toLowerCase()}/core</span></div>
                         <div class="flex text-slate-500 mt-2"><span class="mr-4"> </span> <span>Installing dependencies...</span></div>
                         <div class="flex text-green-400 mt-2"><span class="mr-4">✔</span> <span>Core engine ready</span></div>
                         <div class="flex mt-4"><span class="text-blue-400 mr-4">$</span> <span class="animate-pulse">_</span></div>
                     </div>
                </div>
            </div>
        </div>
    </section>
    ` : `
    <!-- SAAS HERO -->
    <section class="relative pt-32 pb-20 overflow-hidden bg-white">
        <!-- Soft Gradients -->
        <div class="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
             <div class="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-purple-100 rounded-full blur-3xl opacity-60"></div>
             <div class="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-100 rounded-full blur-3xl opacity-60"></div>
        </div>

        <div class="relative z-10 max-w-6xl mx-auto px-6 text-center">
            <div class="reveal inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wide mb-8">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                New Release v2.0
            </div>

            <h1 class="reveal text-6xl md:text-8xl font-bold tracking-tight text-slate-900 mb-8 leading-[1.05]" style="animation-delay: 0.1s">
                ${data.hero?.headline}
            </h1>
            <p class="reveal text-xl md:text-2xl text-slate-500 max-w-3xl mx-auto mb-12 leading-relaxed" style="animation-delay: 0.2s">
                ${data.hero?.subheadline}
            </p>
            <div class="reveal flex flex-col sm:flex-row gap-4 justify-center items-center mb-20" style="animation-delay: 0.3s">
                <button class="px-8 py-4 rounded-xl text-lg font-bold text-white shadow-xl shadow-primary/20 transform hover:-translate-y-1 transition-all" style="background-color: ${themeColor}">
                    ${data.hero?.ctaPrimary || 'Start Free Trial'}
                </button>
                <button class="px-8 py-4 rounded-xl text-lg font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-all flex items-center gap-2">
                    <i data-lucide="play-circle" class="w-5 h-5"></i> View Demo
                </button>
            </div>
            <div class="reveal relative mx-auto rounded-2xl p-2 bg-slate-900/5 shadow-2xl ring-1 ring-slate-900/10 backdrop-blur-sm" style="animation-delay: 0.4s">
                 <div class="rounded-xl overflow-hidden bg-white shadow-inner aspect-[16/9] relative group">
                    <div class="absolute inset-0 bg-gradient-to-t from-slate-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10"></div>
                    <img src="https://image.pollinations.ai/prompt/${encodeURIComponent(data.hero?.imagePrompt || 'saas dashboard ui')}?width=1200&height=800&nologo=true" alt="App" class="w-full h-full object-cover" />
                 </div>
            </div>
        </div>
    </section>
    `}
    
    <!-- TRUSTED BY -->
    <div class="py-12 border-b ${isDark ? 'bg-[#0B0F19] border-slate-800' : 'bg-white border-gray-100'}">
        <p class="text-center text-xs font-bold uppercase tracking-widest mb-8 opacity-50 ${isDark ? 'text-slate-400' : 'text-slate-500'}">Trusted by innovative teams worldwide</p>
        <div class="flex justify-center flex-wrap gap-12 opacity-40 grayscale hover:grayscale-0 transition-all duration-500 px-6">
            <i data-lucide="trello" class="w-8 h-8"></i>
            <i data-lucide="figma" class="w-8 h-8"></i>
            <i data-lucide="slack" class="w-8 h-8"></i>
            <i data-lucide="github" class="w-8 h-8"></i>
            <i data-lucide="chrome" class="w-8 h-8"></i>
            <i data-lucide="codepen" class="w-8 h-8"></i>
        </div>
    </div>

    <!-- ZIG ZAG PROBLEM/SOLUTION -->
    ${data.problemSolution ? `
    <div id="problem" class="py-32 px-6 overflow-hidden ${isDark ? 'bg-[#0F1117] text-white' : 'bg-slate-50 text-slate-900'}">
         <div class="max-w-7xl mx-auto space-y-32">
             <div class="grid lg:grid-cols-2 gap-16 items-center">
                <div class="reveal relative aspect-square md:aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
                     <img src="https://image.pollinations.ai/prompt/chaotic%20messy%20office%20paper%20work%20stress%20abstract%20red%20tones?width=800&height=600&nologo=true" alt="Problem" class="w-full h-full object-cover" />
                     <div class="absolute inset-0 bg-gradient-to-tr from-red-500/20 to-transparent mix-blend-overlay"></div>
                </div>
                <div class="reveal">
                    <h2 class="text-4xl md:text-5xl font-bold leading-tight mb-6">${data.problemSolution.problemTitle}</h2>
                    <p class="text-xl leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}">${data.problemSolution.problemDescription}</p>
                </div>
             </div>

             <div class="grid lg:grid-cols-2 gap-16 items-center">
                <div class="reveal lg:order-2 relative aspect-square md:aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
                     <img src="https://image.pollinations.ai/prompt/organized%20clean%20minimalist%20ui%20dashboard?width=800&height=600&nologo=true" alt="Solution" class="w-full h-full object-cover" />
                     <div class="absolute inset-0 bg-gradient-to-bl from-blue-500/10 to-transparent mix-blend-overlay"></div>
                </div>
                <div class="reveal lg:order-1">
                    <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide mb-2 ${isDark ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-100 text-blue-700'}">
                        <i data-lucide="sparkles" class="w-3 h-3"></i> The Solution
                    </div>
                    <h2 class="text-4xl md:text-5xl font-bold leading-tight mb-6">${data.problemSolution.solutionTitle}</h2>
                    <p class="text-xl leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}">${data.problemSolution.solutionDescription}</p>
                </div>
             </div>
         </div>
    </div>
    ` : ''}

    <!-- FEATURES BENTO -->
    <section id="features" class="py-32 px-6 ${isDark ? 'bg-[#0B0F19]' : 'bg-white'}">
        <div class="max-w-7xl mx-auto">
            <div class="reveal text-center max-w-3xl mx-auto mb-20">
                <h2 class="text-4xl md:text-5xl font-bold mb-6 ${isDark ? 'text-white' : 'text-slate-900'}">Everything you need to scale</h2>
                <p class="text-xl ${isDark ? 'text-slate-400' : 'text-slate-500'}">Powerful features designed for modern teams.</p>
            </div>
            <div class="grid md:grid-cols-3 gap-6 auto-rows-[300px]">
                ${data.features?.map((f, i) => {
                    const isLarge = i === 0 || i === 3;
                    return `
                    <div class="reveal group relative h-full rounded-3xl p-8 overflow-hidden transition-all duration-300 hover:shadow-2xl border ${isDark ? 'bg-slate-900 border-slate-800 hover:border-slate-700' : 'bg-slate-50 border-gray-100 hover:border-blue-200 hover:bg-white'} ${isLarge ? 'md:col-span-2' : ''}" style="animation-delay: ${i * 0.1}s">
                        <div class="relative z-10 flex flex-col h-full">
                            <div class="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 text-2xl transition-transform group-hover:scale-110 ${isDark ? 'bg-slate-800 text-blue-400' : 'bg-white shadow-sm text-blue-600'}">
                                <i data-lucide="${f.icon ? f.icon.toLowerCase().replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase() : 'check'}"></i>
                            </div>
                            <h3 class="text-2xl font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}">${f.title}</h3>
                            <p class="${isDark ? 'text-slate-400' : 'text-slate-600'} leading-relaxed">${f.description}</p>
                        </div>
                    </div>
                    `;
                }).join('') || ''}
            </div>
        </div>
    </section>

    <!-- SOCIAL PROOF -->
    ${data.socialProof ? `
    <section class="py-32 px-6 border-y relative overflow-hidden ${isDark ? 'bg-[#0F1117] border-slate-800' : 'bg-slate-900 border-gray-100'}">
        <div class="relative z-10 max-w-5xl mx-auto text-center">
            <div class="reveal">
                <blockquote class="text-3xl md:text-5xl font-medium leading-tight text-white mb-10">"${data.socialProof.testimonial}"</blockquote>
                <div class="flex flex-col items-center">
                    <div class="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-400 to-purple-500 p-[2px] mb-4">
                        <div class="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-xl font-bold text-white">
                            ${data.socialProof.testimonialAuthor.charAt(0)}
                        </div>
                    </div>
                    <div class="text-white font-bold text-lg">${data.socialProof.testimonialAuthor}</div>
                </div>
            </div>
        </div>
    </section>
    ` : ''}

    <!-- PRICING -->
    <section id="pricing" class="py-32 px-6 ${isDark ? 'bg-slate-900' : 'bg-slate-50'}">
         <div class="max-w-7xl mx-auto">
            <div class="text-center mb-20 reveal">
                <h2 class="text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}">Simple, transparent pricing</h2>
            </div>
            <div class="grid md:grid-cols-3 gap-8 items-start">
                ${data.pricing?.map((p, i) => `
                <div class="reveal relative p-10 rounded-3xl h-full flex flex-col transition-transform duration-300 hover:-translate-y-2 ${p.isPopular ? `bg-slate-900 text-white shadow-2xl ring-4 ring-blue-500/20` : (isDark ? 'bg-[#0F1117] border border-slate-800 text-white' : 'bg-white border border-gray-100 text-slate-900 shadow-xl shadow-slate-200/50')}" style="animation-delay: ${0.1 * i}s">
                    ${p.isPopular ? `<div class="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-blue-600 text-white text-xs font-bold rounded-full uppercase tracking-wide">Most Popular</div>` : ''}
                    <h3 class="text-xl font-bold mb-2 opacity-80">${p.planName}</h3>
                    <div class="text-5xl font-bold mb-6 tracking-tight">${p.price}<span class="text-lg font-normal opacity-50">/mo</span></div>
                    <ul class="space-y-4 mb-8 flex-1">
                        ${p.features.map(f => `<li class="flex items-start gap-3 text-sm"><i data-lucide="check" class="w-5 h-5 shrink-0 ${p.isPopular ? 'text-blue-400' : 'text-green-500'}"></i> <span class="opacity-80">${f}</span></li>`).join('')}
                    </ul>
                    <button class="w-full py-4 rounded-xl font-bold transition-all ${p.isPopular ? 'bg-blue-600 hover:bg-blue-500 text-white' : (isDark ? 'bg-slate-800 hover:bg-slate-700' : 'bg-slate-100 hover:bg-slate-200 text-slate-900')}">Get Started</button>
                </div>
                `).join('') || ''}
            </div>
        </div>
    </section>

    <!-- CTA -->
    <section class="py-24 px-6">
         <div class="max-w-5xl mx-auto rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden ${isDark ? 'bg-blue-900' : 'bg-slate-900'}">
            <div class="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
                 <div class="absolute top-[-50%] left-[-50%] w-[1000px] h-[1000px] bg-blue-500 rounded-full blur-[150px]"></div>
            </div>
            <div class="reveal relative z-10">
                <h2 class="text-4xl md:text-6xl font-bold mb-8 text-white tracking-tight">Start building with ${data.meta?.brandName} today.</h2>
                <div class="flex flex-col sm:flex-row gap-4 justify-center">
                    <button class="px-10 py-5 rounded-full text-xl font-bold text-slate-900 bg-white hover:bg-blue-50 transition-all shadow-xl">
                        ${data.hero?.ctaPrimary || 'Get Started Now'}
                    </button>
                </div>
            </div>
         </div>
    </section>

    <!-- FOOTER -->
    <footer class="py-20 px-6 border-t ${isDark ? 'bg-[#0B0F19] border-slate-800 text-slate-500' : 'bg-white border-gray-100 text-slate-500'}">
        <div class="max-w-7xl mx-auto text-center">
            <p>&copy; 2024 ${brandName}. All rights reserved.</p>
        </div>
    </footer>

    <script>
        lucide.createIcons();
        
        const observerOptions = { threshold: 0.1 };
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0) translateX(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        document.querySelectorAll('.reveal').forEach(el => {
            observer.observe(el);
        });
    </script>
</body>
</html>`;
};
