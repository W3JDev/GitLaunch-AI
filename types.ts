
export enum AppState {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  GENERATING = 'GENERATING',
  REFINING = 'REFINING',
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR'
}

export interface GeneratedPage {
  meta: {
    brandName: string;
    title: string;
    description: string;
    themeColor: string;
    fontPairing: 'sans' | 'serif' | 'mono';
    layoutStyle: 'modern-saas' | 'developer-tool';
  };
  hero: {
    headline: string;
    subheadline: string;
    ctaPrimary: string;
    ctaSecondary: string;
    imagePrompt: string;
  };
  problemSolution?: {
    problemTitle?: string;
    problemDescription?: string;
    solutionTitle?: string;
    solutionDescription?: string;
  };
  features: Array<{
    title: string;
    description: string;
    icon: string; 
  }>;
  socialProof?: {
    stat?: string;
    statLabel?: string;
    testimonial?: string;
    testimonialAuthor?: string;
  };
  pricing?: Array<{
    planName: string;
    price: string;
    features: string[];
    isPopular: boolean;
  }>;
  faq?: Array<{
    question: string;
    answer: string;
  }>;
  githubStats?: {
    stars: number;
    forks: number;
    issues: number;
  };
}

export interface AnalysisResult {
  projectName: string;
  projectType: 'SaaS' | 'Library' | 'Tool' | 'Framework';
  targetAudience: string;
  tone: 'Professional' | 'Playful' | 'Technical' | 'Minimalist';
  keyBenefits: string[];
  suggestedColor: string;
  suggestedLayout: 'modern-saas' | 'developer-tool';
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}
