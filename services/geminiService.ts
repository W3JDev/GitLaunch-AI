
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisResult, GeneratedPage } from "../types";

const getClient = () => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) throw new Error("API Key not found in environment");
    return new GoogleGenAI({ apiKey });
};

// --- SCHEMAS ---

const AnalysisSchema: Schema = {
    type: Type.OBJECT,
    properties: {
        projectName: { type: Type.STRING, description: "The EXACT Project Name. Maximum 2 words. e.g. 'PunchClock', 'React'. NO slogans." },
        projectType: { type: Type.STRING, enum: ['SaaS', 'Library', 'Tool', 'Framework'] },
        targetAudience: { type: Type.STRING },
        tone: { type: Type.STRING, enum: ['Professional', 'Playful', 'Technical', 'Minimalist'] },
        keyBenefits: { type: Type.ARRAY, items: { type: Type.STRING } },
        suggestedColor: { type: Type.STRING, description: "Hex code only." },
        suggestedLayout: { type: Type.STRING, enum: ['modern-saas', 'developer-tool'] }
    },
    required: ['projectName', 'projectType', 'targetAudience', 'tone', 'keyBenefits', 'suggestedColor', 'suggestedLayout']
};

const LandingPageSchema: Schema = {
    type: Type.OBJECT,
    properties: {
        meta: {
            type: Type.OBJECT,
            properties: {
                brandName: { type: Type.STRING, description: "Short UI name. Max 20 chars. e.g. 'PUNCHCLOCK'" },
                title: { type: Type.STRING, description: "SEO Title. Max 60 chars." },
                description: { type: Type.STRING, description: "SEO Description. Max 160 chars." },
                themeColor: { type: Type.STRING },
                fontPairing: { type: Type.STRING, enum: ['sans', 'serif', 'mono'] },
                layoutStyle: { type: Type.STRING, enum: ['modern-saas', 'developer-tool'] }
            }
        },
        hero: {
            type: Type.OBJECT,
            properties: {
                headline: { type: Type.STRING, description: "Punchy, modern headline. Max 8 words. e.g. 'Build faster, scale sooner.'" },
                subheadline: { type: Type.STRING, description: "Short description. Max 20 words." },
                ctaPrimary: { type: Type.STRING, description: "Action button text." },
                ctaSecondary: { type: Type.STRING },
                imagePrompt: { type: Type.STRING, description: "Abstract 3D tech visualization, isometric, glassmorphism style. No text." }
            }
        },
        problemSolution: {
            type: Type.OBJECT,
            properties: {
                problemTitle: { type: Type.STRING },
                problemDescription: { type: Type.STRING },
                solutionTitle: { type: Type.STRING },
                solutionDescription: { type: Type.STRING },
            }
        },
        features: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING },
                    description: { type: Type.STRING },
                    icon: { type: Type.STRING, description: "Lucide icon name" },
                }
            }
        },
        socialProof: {
            type: Type.OBJECT,
            properties: {
                stat: { type: Type.STRING },
                statLabel: { type: Type.STRING },
                testimonial: { type: Type.STRING },
                testimonialAuthor: { type: Type.STRING },
            }
        },
        pricing: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    planName: { type: Type.STRING },
                    price: { type: Type.STRING },
                    features: { type: Type.ARRAY, items: { type: Type.STRING } },
                    isPopular: { type: Type.BOOLEAN },
                }
            }
        },
        faq: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    question: { type: Type.STRING },
                    answer: { type: Type.STRING },
                }
            }
        }
    }
};

// --- FUNCTIONS ---

export const analyzeRepository = async (readmeContent: string, repoUrl: string): Promise<AnalysisResult> => {
    const ai = getClient();
    
    const prompt = `
    Role: Expert Brand Strategist.
    Task: Analyze this GitHub Repository to create a brand profile.
    
    Repo URL: ${repoUrl}
    README Context:
    ${readmeContent.substring(0, 10000)}
    
    Constraints:
    1. 'projectName': Must be the EXACT name (e.g., 'PUNCHCLOCK'). Do NOT add slogans.
    2. 'suggestedColor': Look for brand colors in the README (hex codes). If none, pick a color that fits the industry.
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: 'application/json',
            responseSchema: AnalysisSchema,
        }
    });

    return JSON.parse(response.text) as AnalysisResult;
};

export const generateLandingPage = async (analysis: AnalysisResult, repoStats: any): Promise<GeneratedPage> => {
    const ai = getClient();

    const prompt = `
    Role: Senior UI/UX Copywriter for a modern web design agency.
    Task: Write ultra-modern, punchy copy for a ${analysis.projectType} called "${analysis.projectName}".
    
    Style: Minimalist, "Apple-esque" or "Vercel-esque".
    
    Strict Rules:
    1. Headlines must be short and impactful (under 8 words).
    2. No "fluff" or generic filler text.
    3. 'imagePrompt': Request a high-end 3D abstract render, isometric glass style, matching the brand color.
    4. 'meta.brandName': Just the name.
    
    Context:
    Benefits: ${analysis.keyBenefits.join(', ')}
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: 'application/json',
            responseSchema: LandingPageSchema,
        }
    });

    const data = JSON.parse(response.text);
    return { ...data, githubStats: repoStats };
};

export const refineLandingPage = async (currentData: GeneratedPage, userInstruction: string): Promise<GeneratedPage> => {
    const ai = getClient();

    const prompt = `
    Role: Senior Web Developer & Designer.
    Task: Update the JSON configuration based on user feedback.
    
    Current JSON:
    ${JSON.stringify(currentData)}
    
    User Feedback: "${userInstruction}"
    
    Instructions:
    - Update ONLY the fields requested.
    - Return the COMPLETE updated JSON.
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: 'application/json',
            responseSchema: LandingPageSchema,
        }
    });

    const newData = JSON.parse(response.text);
    return {
        ...newData,
        githubStats: currentData.githubStats
    };
};
