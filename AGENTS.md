# GitLaunch AI - Agents & Contributors Guide

## 1. Project Overview
**GitLaunch AI** is a React-based application that leverages the Google Gemini API to analyze GitHub repositories and automatically generate high-converting, developer-centric landing pages.

- **Primary Goal**: Bridge the gap between code and marketing by automating landing page design for developers.
- **Core Technology**: React 19, TypeScript, Tailwind CSS, Google GenAI SDK (`@google/genai`).

## 2. Tech Stack & Environment
- **Framework**: React 19 (via Vite/ESM)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS (Utility-first, no external CSS files preferred)
- **Icons**: Lucide React
- **AI Integration**: Google Gemini API (`gemini-2.5-flash`)
- **Visualizations**: Recharts
- **State Management**: React Context / Local State (Keep it simple)

## 3. Commands
- **Install**: `npm install`
- **Development**: `npm run dev`
- **Build**: `npm run build`
- **Lint**: `npm run lint`

## 4. Code Style & Patterns
### TypeScript
- **Interfaces**: Define all data structures in `types.ts`. Do not use `any`.
- **Enums**: Use Enums for state (e.g., `AppState`) and fixed options (e.g., `layoutStyle`).
- **Null Safety**: Always handle optional properties in API responses using optional chaining (`?.`) or fallback values.

### React Components
- **Functional Components**: Use `React.FC<Props>`.
- **Hooks**: Isolate complex logic (like GitHub fetching or AI analysis) into custom hooks or service files.
- **Tailwind**: Use arbitrary values sparingly. Prefer standard Tailwind utility classes.

### Project Structure
- `/services`: Business logic and API calls (`geminiService.ts`, `githubService.ts`).
- `/components`: UI presentation layers.
- `/utils`: Helper functions (e.g., `htmlGenerator.ts`).
- `/docs`: Documentation (Do not modify without instruction).

## 5. Critical Rules (Dos & Don'ts)
- **DO NOT** Import `GoogleGenerativeAI` from `@google/genai`. Use `{ GoogleGenAI }`.
- **DO NOT** Create new CSS files. Use Tailwind classes directly in JSX.
- **DO NOT** Expose API keys in client-side code (Assume `process.env.API_KEY` is injected).
- **DO** Ensure `metadata.json` lists permissions if adding new browser APIs.
- **DO** Maintain the `PreviewRender.tsx` as the source of truth for the generated visual output.

## 6. AI Workflow specifics
- **Gemini 2.5 Flash**: Use this model for speed and cost-efficiency in `geminiService.ts`.
- **JSON Schema**: Always strictly define the `responseSchema` when calling Gemini for analysis or generation.
- **Validation**: When the AI returns generated page data, validate it against the `GeneratedPage` interface before rendering.

## 7. Security
- Never commit `.env` files.
- Sanitize user input (GitHub URLs) before passing to the backend/API services.
- Do not log full API response bodies in production; log only status codes or error messages.
