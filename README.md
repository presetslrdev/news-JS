# Global Chronicle (news-JS Migration to TypeScript)

Live wire newsreader on top of [News API](https://newsapi.org/), migrated from vanilla JavaScript to strict TypeScript with a contemporary editorial design system and accessible UI components.

## Deploy / Demo

- **Live URL:** [https://presetslrdev.github.io/news-JS/](https://presetslrdev.github.io/news-JS/)

---

## Key Features

### 1. Strict TypeScript Migration
- **Zero `any`:** Strictly typed throughout the entire codebase (`@typescript-eslint/no-explicit-any` enforced).
- **Enums:** `Endpoint`, `HttpMethod`, `HttpStatus`.
- **Generics:** Generalized `super.getResp<T>()`, `Callback<T>`, `requireElement<T extends HTMLElement>()`.
- **Interfaces & Utility Types:** `Source`, `Article`, `NewsResponse`, `SourcesResponse`, `RequestParams`, utilizing `Pick`, `Partial`, `Readonly`, `Record`.
- **Classes & Modifiers:** `private`, `protected`, `public`, and `readonly` access modifiers applied across controllers, loaders, and views.
- **Explicit Return Types:** Strictly enforced across all methods and functions.

### 2. Editorial Design & UX
- **Contemporary Dark Editorial Aesthetic:** High-craft layout with refined serif headlines (`Newsreader`), clean UI typography (`Plus Jakarta Sans`), amber/saffron accents, and rich obsidian depth.
- **Adaptive & Responsive Layout:** Fluid adaptation across all device viewports from 320px up to 1920px (1 column on mobile, 2 columns on tablet, bento-grid with lead story spotlight on desktop).
- **Category Filter Tabs:** One-click filtering across news topics (General, Business, Technology, Science, Sports, Health, Entertainment).
- **Accessible Searchable Combobox:** ARIA-compliant source selector with keyboard navigation (`ArrowDown`, `ArrowUp`, `Enter`, `Escape`), active states, letter avatars, and real-time search.
- **Skeleton Shimmer Loading:** Responsive skeleton placeholder cards during fetch instead of a generic spinner.
- **Article Insights:** Estimated reading time per article, publication dates, source badges, and fallback placeholder handling for missing/broken article media.
- **Resilient Mock Fallback:** Automatic fallback to RS School mock API endpoints (`https://rss-news-api.onrender.com/mocks/`) if `.env` or external API keys are not supplied.

---

## Getting Started

### Prerequisites
- Node.js (v18+)
- npm

### Installation
```bash
git clone https://github.com/presetslrdev/news-JS.git
cd news-JS
npm install
```

### Environment Configuration (Optional)
To use your own NewsAPI key:
1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Set your custom `API_URL` and `API_KEY` in `.env`.
> *Note:* If `.env` is omitted, the application automatically uses the RS School mock service (`https://rss-news-api.onrender.com/mocks/`), ensuring full offline/quota-free functionality both locally and on GitHub Pages.

### Scripts
- `npm start` — run development server with HMR on `http://localhost:8080`
- `npm run build` — create optimized production build in `dist`
- `npm run lint` — check code quality with ESLint
- `npm run typecheck` — run TypeScript compiler typecheck (`tsc --noEmit`)
- `npm run deploy` — build and deploy to GitHub Pages (`gh-pages` branch)

---

## Evaluation Criteria Mapping (RS School)

| Section | Points | Status |
| --- | --- | --- |
| **Repository Setup** | 20 / 20 | Pull Request structure, clear commit history adhering to RS School commit guidelines |
| **Code Quality** | 100 / 100 | Full TS migration (50), Enums (10), Generics (10), Interfaces/Types (10), Classes & Access Modifiers (10), Function types (10), zero `any` |
| **Design & Functionality** | 50 / 50 | Responsive layout 320px–1920px (10), Custom editorial design with categories, combobox, and skeletons (20), Flawless functionality & error handling (20) |
| **Total** | **170 / 170** | Fully completed |
