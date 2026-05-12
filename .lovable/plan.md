Diagnosis:
- The Lovable published URL is crawlable: `https://f9-car-care.lovable.app/services/ceramic-coating` returns the full service text in plain HTML/markdown.
- The production domain is not serving this app yet: `https://www.f9carcare.co.in/services/ceramic-coating` returns only a blank loader.
- The production sitemap is also old and points to legacy `.html` URLs, not the current service URLs.
- So Google/LLMs are likely crawling the old production domain, not the SEO-prerendered Lovable version.

Plan:
1. Make the production URLs crawler-safe
   - Add permanent service URLs at the root level, e.g. `/ceramic-coating`, `/paint-protection-film`, `/teflon-coating`, etc.
   - Keep `/services/:slug` working as compatibility URLs.
   - Add legacy `.html` compatibility routes like `/ceramic-coating.html`, `/paint-protection-film.html`, etc., so existing indexed URLs do not become dead ends.

2. Update static prerendering
   - Generate real static HTML for every root-level service page, `/services/:slug`, and legacy `.html` URL.
   - Make service content available directly in the HTML source without relying on JavaScript.
   - Avoid hiding SEO text behind `aria-hidden`/visually-hidden wrappers so LLM crawlers do not treat it as hidden or cloaked content.

3. Update metadata and canonicals
   - Keep unique editable `<title>` and meta descriptions from `src/data/servicePages.ts`.
   - Set canonical URLs to the preferred root-level pages, e.g. `https://www.f9carcare.co.in/ceramic-coating`.
   - Add route-specific Open Graph/Twitter tags and service schema JSON-LD.

4. Update internal navigation
   - Change the Services dropdown to standard link destinations for the preferred root-level service URLs.
   - Keep internal related-service links pointing to the preferred root-level URLs.

5. Regenerate sitemap and robots
   - Generate `public/sitemap.xml` with all preferred service URLs on `https://www.f9carcare.co.in`.
   - Keep `robots.txt` allowing crawlers and pointing to the correct sitemap.

6. Required publish/domain step
   - After code changes, publish/update the Lovable app.
   - Connect `www.f9carcare.co.in` to this Lovable project in Domains/DNS. Right now this domain appears to be serving an older site, which is the main reason LLMs cannot read the service pages.