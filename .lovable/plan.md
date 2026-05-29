## Plan

Update the header so the complete F9 logo from the uploaded PDF is visible, not just the square F9 mark.

## What I’ll change

1. **Generate a clean web image from the uploaded PDF**
   - Convert the PDF logo into an optimized PNG.
   - Crop only empty page whitespace, while keeping the full logo lockup: F9 mark, `CAR-CARE`, `& DETAILING STUDIO`, and `Showroom Shine Everytime`.

2. **Replace the current header logo asset**
   - Save the full logo as `public/f9-logo-full.png`.
   - Keep the existing mark-only logo available for favicon/small uses.

3. **Adjust navbar sizing**
   - Use a wider logo display area so the full logo is not clipped.
   - Keep `object-contain` so the entire artwork is always shown.
   - Add responsive sizing so desktop shows the full logo clearly, and smaller screens still fit without breaking the nav.

4. **Keep crawler/accessibility readability**
   - Use descriptive alt text: `F9 Car Care & Detailing Studio — Showroom Shine Everytime`.
   - Keep the logo link accessible with a full brand aria-label.

## Verification

After implementation, I’ll check the rendered header at the current desktop viewport and confirm the entire uploaded logo is visible.