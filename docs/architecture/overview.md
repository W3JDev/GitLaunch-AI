# System Architecture Overview

## High-Level Diagram
`[User Browser]` <--> `[React Frontend]` <--> `[Google Gemini API]`
                               ^
                               |
                        `[GitHub API]`

## Core Components

### 1. Frontend Client (React)
- **Role**: Handles UI, State Management, and Rendering.
- **Key Modules**:
    - `App.tsx`: Orchestrator.
    - `PreviewRender.tsx`: Dynamic renderer based on JSON schema.
    - `geminiService.ts`: AI Interface.

### 2. GitHub Integration Layer
- **Role**: Fetches context.
- **Mechanism**: Direct fetch to `raw.githubusercontent.com`.
- **Constraint**: Browser-side CORS restrictions often block direct GitHub API calls. We use public raw access or fallbacks.

### 3. Intelligence Layer (Gemini)
- **Role**: The "Brain".
- **Two-Step Process**:
    1. **Analyze**: `README` -> `AnalysisResult` (JSON)
    2. **Generate**: `AnalysisResult` -> `GeneratedPage` (JSON)

## Data Flow
1. User inputs URL.
2. `githubService` grabs raw text.
3. `geminiService` sends text to LLM with specific `responseSchema`.
4. LLM returns structured JSON.
5. React State updates.
6. `PreviewRender` maps JSON to UI Components (`Hero`, `Features`, `Pricing`).
