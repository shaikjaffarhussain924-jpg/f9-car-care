## Plan

Replace the current navbar logo with the uploaded horizontal F9 lockup (yellow square mark + "CAR-CARE & DETAILING STUDIO" + tagline).

### Changes

1. **Add the new logo asset**
   - Copy the uploaded image to `public/f9-logo-horizontal.png`.
   - Image is wide (~16:9 ratio), so it scales cleanly at navbar height.

2. **Update `src/components/Navbar.tsx`**
   - Swap `src="/f9-logo-full.png"` → `src="/f9-logo-horizontal.png"`.
   - Reduce navbar height back from `h-32` → `h-20` (horizontal logo doesn't need tall container).
   - Logo `<img>` classes: `h-12 md:h-14 w-auto object-contain` (~48–56px tall, wide aspect renders the full lockup clearly).
   - Update `width`/`height` attributes to match new image dimensions.
   - Keep alt text and aria-label.

3. **No other changes** — colors, fonts, links, routes, mobile menu untouched.

### Result

The full horizontal F9 lockup shows in the navbar at a clean, readable size — mark on the left, wordmark + tagline on the right, all visible without clipping.
