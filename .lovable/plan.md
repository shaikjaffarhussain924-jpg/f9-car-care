## Goal

Make every public route on F9 Car Care render as fully-formed HTML at build time so Google (and other crawlers) sees real content, titles, meta tags, and JSON-LD without needing to execute JavaScript.

Today the site is a client-side React SPA built with Vite. `index.html` ships an empty `<div id="root">`, and React Helmet sets titles/meta only after JS runs. Crawlers that don't execute JS — or execute it slowly — see a blank shell. Prerendering fixes this.

## Approach: `vite-react-ssg` static export

After comparing options I recommend `**vite-react-ssg**` (static export), not runtime prerendering:

- It renders each route to a real `.html` file at `vite build` time → output is plain static HTML in `dist/`.
- Works with our existing React Router setup with minimal refactor.
- Plays nicely with `react-helmet-async` (already installed) so per-page titles/meta/canonical/OG tags get baked into the HTML.
- No Node server needed at runtime — Lovable's static hosting serves the files directly.

Rejected alternatives:

- `**vite-plugin-prerender` / `react-snap**`: rely on headless Chrome at build time; flaky in Lovable's build environment.
- **SSR (Next.js / Remix migration)**: out of scope and against project tech stack.

## Routes to prerender

Static, public, indexable routes (from `src/App.tsx`):

- `/`
- `/book`
- `/contact`
- `/privacy-policy`
- `/services/:slug` — one page per entry in `src/data/servicePages.ts` (expanded at build time)

Excluded (noindex / private):

- `/admin/*` (login + dashboard)
- `*` (NotFound)

## Technical changes

1. **Install**
  - `bun add -D vite-react-ssg`
2. **Refactor router to a route config**
  - Convert `src/App.tsx`'s inline `<Routes>` JSX into an exported `routes` array (`createBrowserRouter`-compatible) in a new `src/routes.tsx`.
  - Keep `App.tsx` providers (Helmet, QueryClient, Tooltip, Toasters) wrapping `<RouterProvider>` for the dev/runtime path.
  - Export a `getStaticPaths` for `/services/:slug` that returns every slug from `servicePages`.
3. **Entry points** (required by vite-react-ssg)
  - `src/main.tsx` → use `ViteReactSSG` with the routes array; keeps client hydration working.
  - Update `index.html` if needed (it already has `<div id="root">` — fine).
4. **Vite config**
  - `vite.config.ts`: add the `vite-react-ssg` plugin and configure `ssgOptions` (formatting: `'minify'`, `crittersOptions: false` to keep things simple).
5. **Build script**
  - `package.json`: change `"build": "vite build"` → `"build": "vite-react-ssg build"`.
  - `predev`/`prebuild` sitemap generator stays as-is.
6. **Sitemap**
  - Update `scripts/generate-sitemap.ts` (or create one — current `public/sitemap.xml` is hand-edited with only `/`) to include all prerendered routes, including each `/services/:slug`. This will be confirmed/handled separately if needed.
7. **Helmet**
  - Already used on `Index`, `BookAppointment`, `Contact`, `ServicePage`, `PrivacyPolicy`. `vite-react-ssg` uses Helmet's server-side `renderStatic` to inject tags into each generated HTML file. No code changes needed beyond ensuring `HelmetProvider` wraps the app (it does).
  - Bonus: remove the duplicate static `<title>`/`<meta description>` in `index.html` so Helmet's per-page values aren't shadowed in view-source for `/` (optional — Helmet overrides them at runtime, but for prerender the page-specific ones will be written into the file correctly).
8. **Verify after build**
  - `dist/index.html`, `dist/book/index.html`, `dist/contact/index.html`, `dist/privacy-policy/index.html`, `dist/services/<slug>/index.html` all exist.
  - Each contains the route's real H1, body copy, meta description, canonical, OG tags, and JSON-LD (where applicable).
  - `curl https://...` (or `view-source:`) shows content without running JS.

## What does NOT change

- No UI changes.
- No backend / Supabase changes.
- Routing behavior in the browser stays identical (client-side nav after first paint).
- Admin pages stay client-only.

## Risks / notes

- One-time refactor of `App.tsx` into a route config — small but touches the app's entry. Will be done carefully so dev preview keeps working.
- Build time will increase slightly (one render per route).
- If a service page component reads `window`/`document` at module top level, it'll crash SSR. I'll guard any such access with `typeof window !== 'undefined'` checks during implementation if encountered.

## Files touched

- `package.json` (deps + build script)
- `vite.config.ts` (plugin)
- `src/main.tsx` (entry)
- `src/App.tsx` → split into `src/routes.tsx` + slimmer `App.tsx`
- (maybe) `index.html` — drop static title/description duplicates
- (maybe) `scripts/generate-sitemap.ts` + `public/sitemap.xml` regen