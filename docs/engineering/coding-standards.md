# Engineering Standards

## 1. TypeScript Strictness
- **No Implicit Any**: All variables must have types.
- **Interface First**: Define interfaces in `types.ts` before implementing logic.
- **Enums**: Use enums for finite states (e.g., Layout styles).

## 2. Component Architecture
- **Composition**: Break complex sections (Hero, Pricing) into sub-components within `PreviewRender.tsx` (or separate files if they grow too large).
- **Props**: Pass the entire `data` object or specific slices to sub-components.
- **Safety**: Always check for undefined/null in optional JSON fields (e.g., `data.socialProof?.testimonial`).

## 3. Styling (Tailwind)
- **Mobile First**: Write classes like `flex-col md:flex-row`.
- **Theming**: Use the dynamic `style={{ color: themeColor }}` for brand customization, but Tailwind classes for layout/spacing.
- **Dark Mode**: Support `dark:` variants for the "Developer Tool" layout.

## 4. Error Handling
- Wrap all Async/Await calls in `try/catch`.
- Provide user-friendly error messages in the UI (not just console logs).
- Fallback gracefully if GitHub content cannot be fetched (allow AI to hallucinate/infer based on URL).
