# Galaxy map — arms image alignment

The interactive map (`public/arbitrary-life/galaxy.svg`) is a shapes-only export
from the canonical Affinity doc. The painted galaxy **arms image** lives in a
separate export, `Interactive-Map.overlay.svg`, which carries both the raster
*and* the shapes already aligned. These one-off scripts transfer that image onto
`galaxy.svg`'s coordinate space so the political regions sit exactly over their
arms. They are NOT part of the build — run them only to regenerate the asset.

## Pipeline

1. **`extract-arms.mjs`** — pulls the `_Image1` arms raster out of the overlay to
   `public/arbitrary-life/galaxy-arms.png`, and writes a light, shapes-only copy
   of the overlay (`public/_tmp/overlay-shapes.svg`) for measurement.

2. **Measure correspondences (browser).** With `npm run dev` up, load both SVGs
   offscreen and record each region's transform-resolved centre (compose
   `getScreenCTM`) in viewBox units, for every `id` present in both files.

3. **`solve-affine.mjs`** — least-squares affine `overlay → galaxy` over those
   centres (the two exports differ by ~4° rotation + scale + translation), with
   big-group outliers trimmed. Composes it with the overlay's image matrix to get
   the placement matrix used on the injected `<image id="gx-arms">` in
   `src/components/GalaxyMap.tsx`. Inlier residual was ~4 units mean / ~7 max on a
   6692-unit-wide canvas (sub-pixel at display size).

4. **Downscale.** `galaxy-arms.png` (4608², ~19 MB) → `galaxy-arms.jpg` (3000²,
   q85, ~0.8 MB). The `<image>` box stays 4608² with `preserveAspectRatio="none"`,
   so the smaller raster stretches to the same box and the matrix is unchanged.

If the artwork moves in Affinity, re-export the overlay, re-run steps 1–4, and
update the matrix literal in `GalaxyMap.tsx`.
