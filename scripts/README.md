# Galaxy map asset pipeline

The interactive map renders `public/arbitrary-life/galaxy.svg`. That file is a
**generated artifact** — never hand-edit it. It is produced from the canonical
Affinity export (`Interactive-Map.svg`, ~27 MB), which embeds the painted galaxy
arms raster inline alongside the vector regions, already aligned.

## `build-galaxy.mjs`

Externalizes the one big raster (`_Image1`, ~19 MB base64) to
`public/arbitrary-life/galaxy-arms.jpg` and repoints its `href`, leaving every
coordinate untouched. This drops the SVG from ~27 MB to ~1.4 MB while keeping the
regions pixel-aligned with the galaxy **by construction** — the image and the
shapes come from the same document, so no transform math is needed. The ~37 tiny
icon rasters stay inline.

```
node scripts/build-galaxy.mjs        # writes galaxy.svg + full-res galaxy-arms.png
# then downscale the PNG to the JPEG the SVG references (Windows / System.Drawing):
#   3000px wide, q85  ->  galaxy-arms.jpg (~0.8 MB), and delete the PNG
```

The `<image>` box keeps its original pixel dimensions with
`preserveAspectRatio` from the export, so the downscaled JPEG stretches into the
same box and the placement is unchanged.

Re-run after any re-export from Affinity. If a `BASE_PATH` is ever introduced
(currently `""`), prefix the `HREF` constant in `build-galaxy.mjs` accordingly.

## Interaction note

Region classification lives in `src/lib/galaxy.ts`. The current export nests
shapes as `Lands > Shapes > {arms, political}` and `Abyss > Voids`; the structural
wrappers (`Shapes`, `Voids`, `arms`, `political`, and numbered duplicates like
`Abyss1`) are excluded there so they are never selectable.
