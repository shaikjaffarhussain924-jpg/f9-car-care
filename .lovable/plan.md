## Goal

Make F9 Car Care crawlable by Google and LLM crawlers by ensuring public pages return real HTML content, not just an empty React app shell.

## Current problem

The app is currently a Vite React SPA. `index.html` contains `<div id="root"></div>`, while page content, service text, meta tags, and service routes are created after JavaScript runs. Google may eventually render some JavaScript, but many SEO tools, LLM crawlers, and fast crawlers will see little or no page content.

Also, the current sitemap only lists `/`, so service pages are not being advertised to crawlers.

## Recommended implementation

Use a static prerender pipeline that generates crawlable `.html` files for:

- `/`
- `/book`
- `/contact`
- `/privacy-policy`
- `/services/ceramic-coating`
- `/services/ppf`
- `/services/teflon-coating`
- `/services/nano-coating`
- `/services/deep-interior-wash`
- `/services/car-seat-covers`
- `/services/car-denting-painting`
- `/services/car-restoration`
- `/services/car-sunfilm`
- `/services/car-washing-painting`
- `/services/car-general-service`

Admin routes will remain client-only and excluded from indexing.

## Safer approach than the previous failed attempt

The earlier `vite-react-ssg` attempt hit a `react-helmet-async` SSR context mismatch. To avoid that, I will not depend on Helmet SSR injection.

Instead, I will:

1. Keep the normal React app working as-is for users.
2. Add a custom post-build prerender script using `react-dom/server`.
3. Render public routes to static HTML strings.
4. Inject the correct title, meta description, canonical URL, Open Graph tags, JSON-LD, and page body into route-specific HTML files.
5. Leave client-side hydration intact so the pages still behave normally after load.

This avoids changing the runtime framework and avoids the Helmet server-rendering conflict.

## Files to change

- `package.json`
  - Add a build hook/script to run sitemap generation and prerendering after Vite builds.
- `scripts/prerender.tsx` or similar
  - New script that renders public routes into real HTML files under `dist/`.
- `scripts/generate-sitemap.ts`
  - New/updated script to include all public indexable routes.
- `public/sitemap.xml`
  - Regenerated with all public service pages.
- Possibly `src/App.tsx` / route wrapper files
  - Only if needed to render the public pages cleanly in the prerender script.
- `index.html`
  - Keep existing app shell, but ensure canonical/domain metadata is not conflicting.

## SEO output after implementation

For each public route, the built output should contain:

- Real visible page text in HTML
- One route-specific `<title>`
- Meta description
- Canonical URL using `https://www.f9carcare.co.in`
- Open Graph metadata
- Structured data where applicable
- Crawlable service body content

## Verification

After implementation, I will verify that generated HTML files contain actual service content without JavaScript execution, for example:

- `dist/services/ceramic-coating/index.html` contains the ceramic coating H1 and body text
- `dist/services/ppf/index.html` contains PPF content
- `dist/sitemap.xml` lists all public routes
- Admin pages are not included in the sitemap

## What will not change

- No visual redesign
- No service-page text rewriting or summarizing
- No backend changes
- No admin route indexing
- No migration to another framework

## Result

After publishing, Google and LLM crawlers should be able to fetch public pages and read the service-page content directly from HTML.