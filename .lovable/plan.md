## Problem

The navbar shows the broken-image alt text "F9 Car..." instead of the logo. `public/f9-logo.png` exists on disk (20 KB, valid PNG), and `src/components/Navbar.tsx` references `/f9-logo.png` correctly. The asset was added to `public/` after the dev server started, and Vite's dev server does not always pick up newly created `public/` files until it's restarted — so the browser is getting a 404 for `/f9-logo.png`.

## Fix

1. Restart the Vite dev server so it serves the new `public/f9-logo.png` and `public/favicon.png`.
2. Verify in the preview that the logo renders in the navbar and footer, and the favicon shows in the tab.

If the logo still 404s after restart, fall back to importing the asset from `src/assets/f9-logo-mark.png` (already 20 KB on disk) as an ES module in `Navbar.tsx` and `Footer.tsx` — bundled assets always resolve. The `<link rel="preload">` in `index.html` would be removed in that case (it can only target a stable URL, not a hashed bundle path).

No other code changes needed.