# Data Models

## Generated Page Schema (JSON)
This is the core data structure returned by the AI and consumed by the UI.

```typescript
interface GeneratedPage {
  meta: {
    brandName: string;      // e.g. "GitLaunch"
    themeColor: string;     // Hex code
    layoutStyle: 'modern-saas' | 'developer-tool';
    fontPairing: 'sans' | 'serif' | 'mono';
  };
  hero: {
    headline: string;
    subheadline: string;
    ctaPrimary: string;
    imagePrompt: string;    // Passed to Pollinations.ai
  };
  features: Array<{
    title: string;
    description: string;
    icon: string;           // Lucide Icon Name
  }>;
  pricing?: Array<{
    planName: string;
    price: string;
    features: string[];
    isPopular: boolean;
  }>;
  // ... (See types.ts for full definition)
}
```

## State Machine
The application follows a linear state machine defined in `AppState`:

1. `IDLE`: Waiting for input.
2. `ANALYZING`: Fetching GitHub data and performing initial AI analysis.
3. `GENERATING`: Creating the visual page content.
4. `COMPLETE`: Page rendered, ready for refinement/export.
5. `ERROR`: System failure state.
