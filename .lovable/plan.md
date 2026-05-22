## Goal

Replace `slug: "ppf"` in `src/data/servicePages.ts` with the full uploaded PPF copy from `f9_car_care.txt` — **preserving every H1, H2, H3, H4 from the source exactly as written**, all paragraphs verbatim, and rendering it as a clean, good-looking page (no card chrome, no highlights — per project memory).

## Heading hierarchy — preserved exactly from the source

The source file has a specific outline. Each heading maps to a field that renders the matching HTML tag:

| Source heading | Renders as | Field |
|---|---|---|
| H1 `🏆 #1 PPF Service Center in Hyderabad…` | `<h1>` (once) | `h1` |
| H2 `What is PPF — Paint Protection Film?` | `<h2>` | `aboutTitle` |
| H3 `The Structural Anatomy of Premium PPF Coatings` | `<h3>` inside richContent | `richContent[].title` |
| H2 `Why Every Car in Hyderabad Needs PPF` | `<h2>` | richContent section |
| H2 `PPF Packages & Prices in Hyderabad` | `<h2>` | `pricingTitle` |
| H3 `Starter / Full Front / Ultimate Protection Package` | `<h3>` per pricing card | `pricing[].title` |
| H2 `Comprehensive PPF Price Matrix by Car Type` | `<h2>` | richContent section (price matrix as listItems) |
| H2 `F9 Car Care's Multi-Stage PPF Installation Process` | `<h2>` | `processTitle` |
| H4 `Step 1 … Step 7` | `<h4>` per step + paragraph in richContent | `process[]` + richContent paragraphs |
| H2 `PPF vs Ceramic Coating — Real Difference` | `<h2>` | richContent section |
| H2 `Why Hyderabad Roads Demand PPF` | `<h2>` | richContent section |
| H2 `Tailored PPF Applications for Every Vehicle Segment` | `<h2>` | richContent section |
| H2 `The Complete Educational Guide to PPF` | `<h2>` | richContent section |
| H3 `Molecular Science Behind Self-Healing Elastomer Technology` | `<h3>` | richContent subsection |
| H3 `Decoding Film Quality Tiers` | `<h3>` | richContent subsection |
| H3 `Absolute Post-Installation Maintenance Playbook` | `<h3>` | richContent subsection |
| H2 `Financial Investment Case: PPF vs Repainting` | `<h2>` (with cost table → listItems) | richContent section |
| H2 `Why F9 Car Care Stands Unchallenged` | `<h2>` | richContent section |
| H2 `Our Comprehensive Local Service Network` | `<h2>` | richContent section |
| H2 `Frequently Asked Questions` | `<h2>` | `faqTitle` |
| H4 (9 FAQ questions) | `<h4>`/accordion | `faqs[]` |
| H2 `Secure Your Automotive Investment` | `<h2>` | `ctaHeading` |

Every paragraph between headings is copied verbatim — no summarising, no rephrasing, no dropped keyword sentences ("PPF coating in Hyderabad", "Bachupally", "R.C. Puram", etc. all stay in).

## Make it look good (within existing component contract)

`ServiceDetailPage` already renders these fields with clean typography on the dark / yellow brand theme. To make the new long-form PPF page feel polished without adding card chrome:

- **Hero**: existing hero band uses `h1`, `subheading`, and `tags` — pick a punchy one-line subheading and 5 short tag chips so the top of the page reads tight and confident.
- **Pricing cards**: 3 cards, middle one (`Full Front PPF`) flagged `popular: true` so it gets the yellow accent treatment that's already wired in.
- **Process**: 7 numbered steps render as a horizontal/stepped list (existing component) — titles only, full paragraph text lives just below in the richContent section so nothing is lost.
- **Price matrix & cost-comparison tables**: rendered as richContent `listItems` (one bullet per row with all four price columns inline, e.g. `Partial PPF — Hatchback ₹18,999 · Sedan ₹21,999 · SUV ₹24,999 · Luxury: Custom Quote`). Keeps every number visible, stays plain-text per memory rule.
- **PPF vs Ceramic comparison**: rendered as two richContent subsections with bulleted `listItems` (✓ / ✗ kept verbatim from source).
- **FAQs**: existing accordion — each question is an `<h4>`/trigger, answer is full verbatim paragraph.
- **Spacing & rhythm**: rely on existing `space-y` rhythm in `ServiceDetailPage`; no new component, no new styling tokens.
- **No `<mark>`, no boxed callouts, no gradient cards inside the body** (per memory).

## SEO

- `titleTag` ≤60 chars: `"Best PPF Service in Hyderabad | Paint Protection Film | F9 Car Care"`
- `metaDescription` ≤160 chars: self-healing PPF, price from ₹18,999, phone, Hyderabad.
- `h1` from source line 2 (emoji dropped for clean crawler output).
- One `h1`, well-structured `h2/h3/h4` cascade above.
- `scripts/prerender.ts` automatically rebuilds `dist/ppf/index.html` from these fields with canonical, og:*, Service JSON-LD — no prerender edits needed.
- All long-tail keyword phrases in the source remain verbatim for organic coverage.
- Internal `Related Services` block is already auto-injected by the prerender + page component.

## Out of scope

- No edits to `ServicePage.tsx`, `ServiceDetailPage.tsx`, `RawMarkdown.tsx`, prerender, sitemap, routes, or other service pages.
- No new images.
- BASE_URL stays as-is (will flip to `f9carcare.co.in` when migration to Vercel happens, per earlier discussion).

## Files to change

- `src/data/servicePages.ts` — replace the single `ppf` object (currently lines ~462–500).

## Verification

1. Open `/ppf` in preview — confirm every H1/H2/H3/H4 from the source appears in order and renders as the matching semantic tag.
2. View source — confirm single `<h1>`, proper heading cascade, no `<mark>` tags, no card chrome wrapping body text.
3. Spot-check pricing (₹18,999 / ₹28,999 / ₹55,000), the 7 process steps, the 9 FAQ Q&As, and the cost-comparison numbers against the source.
4. DOM inspect: `<title>`, meta description, canonical, og:*, and Service JSON-LD all reflect new PPF data.
