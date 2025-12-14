# GitLaunch AI 🚀

> **Turn Code into Conversions.**  
> Instantly generate high-converting landing pages from any GitHub repository using AI.

![Status](https://img.shields.io/badge/Status-Beta-blue)
![Tech](https://img.shields.io/badge/Stack-React%20%7C%20Tailwind%20%7C%20Gemini-green)

## 📖 Overview

GitLaunch AI analyzes your codebase (README, file structure, and metadata) to understand your project's value proposition. It then uses the Google Gemini API to design, write, and code a fully responsive landing page tailored to your specific audience (Developers vs. Consumers).

**Key Features:**
- 🔍 **Deep Repo Analysis**: Understands SaaS vs. Libraries vs. Tools.
- 🎨 **Adaptive UI**: Switches between "Modern SaaS" and "DevTool" layouts.
- ⚡ **Instant Preview**: Live rendering of the generated site.
- 📥 **Export Ready**: Download the full HTML/Tailwind code in one click.

- ## 🎬 Demo & Screenshots

GitLaunch AI transforms GitHub repositories into stunning marketing landing pages. Here's what the generated pages look like:

### Hero Section
The app creates a compelling hero section with:
- Repository information and star count
- Engaging headline and description
- Code snippet display
- Live preview toggle

### Full Page Features
- **Problem/Challenge Section**: Visual storytelling about the project's value
- **Feature Showcase**: Key features with icons and descriptions
- **Social Proof**: Testimonials and usage statistics  
- **Pricing/Value Props**: Feature checklist and CTAs
- **Footer**: Complete navigation and links

### Example Output
When analyzing the React repository, GitLaunch AI generated:
- Header with navigation (Solutions, Product, Pricing, Resources)
- Hero: "Build user interface effortlessly" with 241K+ stars displayed
- Problem visualization with challenge/solution narrative
- Feature cards highlighting Virtual DOM, community support, extensibility
- Testimonials from community leaders
- Strong CTAs: "Start building with React today"
- Professional footer with product, company, and legal links

### Design Customization
The generated pages include:
✨ Dark theme with modern design patterns  
🎨 Customizable colors and fonts via Design Studio  
📱 Responsive layouts for desktop and mobile  
⚡ Fast-loading with optimized assets


## 📚 Documentation

We maintain enterprise-grade documentation for architecture, product, and engineering standards.

- **[Product Vision](/docs/product/vision.md)**: The "Why" behind GitLaunch.
- **[PRD](/docs/product/prd.md)**: Detailed feature specifications.
- **[Architecture](/docs/architecture/overview.md)**: System design and data flow.
- **[Agents Guide](/AGENTS.md)**: Rules for AI contributors.
- **[Changelog](/docs/changelog/CHANGELOG.md)**: Release history.

## 🛠️ Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/gitlaunch-ai.git
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Environment**
   Ensure `process.env.API_KEY` is available (or use your platform's environment variable manager).

4. **Run Development Server**
   ```bash
   npm run dev
   ```

## 🏗️ Project Structure

```text
/src
  /components   # UI Components (Preview, Analytics)
  /services     # API logic (GitHub, Gemini)
  /utils        # Helpers (HTML generation)
/docs           # Enterprise Documentation
AGENTS.md       # AI Coding Guidelines
```

## 🤝 Contributing

Please read `AGENTS.md` before submitting PRs to understand our coding standards and architectural boundaries.

---

## ✍️ Author

**w3jdev**
- 🌐 [w3jdev.com](https://w3jdev.com)
- 🐙 [github.com/w3jdev](https://github.com/w3jdev)
- 💼 [linkedin.com/in/w3jdev](https://linkedin.com/in/w3jdev)
