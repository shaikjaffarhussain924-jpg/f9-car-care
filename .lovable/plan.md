## SEO Fixes for F9 Car Care

Apply the user's specified SEO updates to `index.html` and verify `public/robots.txt`.

### 1. `index.html` updates

**Title** → `F9 Car Care & Detailing Studio | Car Wash, Ceramic Coating & PPF in Hyderabad`

**Meta description** → `F9 Car Care & Detailing Studio in Hafeezpet, Hyderabad offers premium car detailing, ceramic coating, PPF, Teflon coating, deep interior wash, and car denting services. Book your service today!`

**Meta author** → `F9 Car Care & Detailing Studio`

**OG title** → `F9 Car Care & Detailing Studio | Best Car Detailing in Hyderabad`

**OG description** → `Premium car care services in Hafeezpet, Hyderabad — Ceramic Coating, PPF, Teflon Coating, Interior Wash & more. Visit F9 Car Care today!`

**Twitter:site** → `@f9_car_detailing_studio`

**Twitter:title** → match new OG title

**Twitter:description** → match new OG description

### 2. Add Local Business JSON-LD

Append the provided `AutoRepair` schema as a second `<script type="application/ld+json">` block in `<head>`. I'll drop the irrelevant `servesCuisine: null` field (not valid for AutoRepair). Telephone will be set to `+91-XXXXXXXXXX` exactly as provided — **please confirm if you'd like the real number `+91-7032674047` used instead** (recommended for SEO).

> Note: the existing schema block already uses the real domain `https://www.f9carcare.co.in`. The new block uses `https://f9-car-care.lovable.app`. Mixing two URLs for the same business hurts SEO. **Recommend using `https://www.f9carcare.co.in` in the new schema too** for consistency.

### 3. `public/robots.txt`

Your message was cut off after "Add a robots.txt file at the root with:" — the contents weren't included. The current `robots.txt` already contains:

```
User-agent: *
Allow: /
Sitemap: https://www.f9carcare.co.in/sitemap.xml
```

**Please paste the exact contents you want**, or confirm the existing file is fine.

### Files modified
- `index.html`
- `public/robots.txt` (pending your content)

### Open questions before implementing
1. Use real phone `+91-7032674047` in the new schema, or keep the placeholder `+91-XXXXXXXXXX`?
2. Use canonical domain `https://www.f9carcare.co.in` in the new schema (recommended) or keep `https://f9-car-care.lovable.app` as you wrote?
3. What should `robots.txt` contain?
