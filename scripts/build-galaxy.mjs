// Build the render-ready galaxy map from the canonical Affinity export.
//
// The source `Interactive-Map.svg` is a ~27 MB export that embeds the painted
// galaxy arms raster (_Image1, ~19 MB base64) inline alongside the shapes. We
// externalize that one big raster to a file and rewrite its href, which drops
// the SVG to ~1.4 MB while leaving every coordinate untouched — so the regions
// stay pixel-aligned with the galaxy by construction (no transform math). The
// 37 tiny icon rasters (~0.4 MB total) are left inline.
//
// Idempotent: re-run after re-exporting from Affinity. The SVG is a generated
// artifact — never hand-edit public/arbitrary-life/galaxy.svg.
//
// Pipeline: this writes galaxy.svg + a full-res galaxy-arms.png; a follow-up
// PowerShell step downscales the PNG to galaxy-arms.jpg (the href target).
import { readFileSync, writeFileSync } from "fs";

const SRC = "C:/Users/srobi/OneDrive/Desktop/Project/Arbitrary Life/Interactive-Map.svg";
const OUT_SVG = "C:/Users/srobi/source/repos/serbres-web/public/arbitrary-life/galaxy.svg";
const OUT_PNG = "C:/Users/srobi/source/repos/serbres-web/public/arbitrary-life/galaxy-arms.png";
const HREF = "/arbitrary-life/galaxy-arms.jpg"; // root-relative; BASE_PATH is ""

let svg = readFileSync(SRC, "utf8");

// Pull the big galaxy raster (_Image1, not _Image10..) out to its own file and
// repoint its href at the external (downscaled) JPEG.
const re = /(<image[^>]*\sid="_Image1"(?![0-9])[^>]*xlink:href=")data:image\/png;base64,([^"]*)(")/;
const m = svg.match(re);
if (!m) throw new Error("_Image1 data URI not found");
writeFileSync(OUT_PNG, Buffer.from(m[2], "base64"));
svg = svg.replace(re, `$1${HREF}$3`);

writeFileSync(OUT_SVG, svg);

const mb = (n) => (n / 1e6).toFixed(2);
console.log("galaxy-arms.png", mb(Buffer.from(m[2], "base64").length), "MB (downscale -> .jpg next)");
console.log("galaxy.svg     ", mb(Buffer.byteLength(svg)), "MB");
if (/data:image\/[a-z]+;base64,[A-Za-z0-9+/]{200000,}/.test(svg))
  console.warn("WARN: a large inline raster remains in galaxy.svg");
