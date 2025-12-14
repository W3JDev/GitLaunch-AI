# Product Requirements Document (PRD)

**Project**: GitLaunch AI  
**Version**: 1.0  
**Status**: In Development

## 1. Executive Summary
An AI-powered web app that takes a GitHub URL and generates a single-page marketing website.

## 2. User Personas
- **The Indie Hacker**: Needs to validate a SaaS idea quickly. Values speed and "good enough" design.
- **The OSS Maintainer**: Needs a documentation/landing page for their library. Values dark mode and code highlighting.

## 3. Functional Requirements

### 3.1 Repository Analysis
- **Input**: User provides valid `github.com` URL.
- **Process**: System fetches raw `README.md` and repo metadata (stars, forks).
- **Fallback**: If raw fetch fails (CORS), system relies on URL context inference.

### 3.2 AI Generation Engine
- **Model**: Gemini 2.5 Flash.
- **Analysis**: Classify project type (Tool, SaaS, Framework).
- **Copywriting**: Generate headlines, benefits, and features based on repo content.
- **Design**: Select layout (`modern-saas` vs `dev-tool`) and color palette.

### 3.3 Visual Preview
- **Live Render**: React component rendering the generated JSON data.
- **Responsiveness**: Toggle between Desktop and Mobile view.
- **Interactivity**: Basic scroll animations and hover states.

### 3.4 Export
- **HTML Export**: Generate a standalone `index.html` file with embedded Tailwind CDN and scripts.

## 4. Non-Functional Requirements
- **Performance**: Analysis + Generation should take < 15 seconds.
- **Reliability**: Graceful error handling if repo is private or API quotas are hit.
- **Design Quality**: The output must look "Premium" (Apple/Vercel aesthetic).

## 5. Success Metrics
- **Generation Success Rate**: % of valid URLs that result in a rendered page.
- **Export Rate**: % of users who download the HTML after generation.
- **Latency**: Average time from "Click Generate" to "View Page".
