import { readFileSync, writeFileSync, mkdirSync } from "fs";

const OV = "C:/Users/srobi/OneDrive/Desktop/Project/Arbitrary Life/Interactive-Map.overlay.svg";
const ROOT = "C:/Users/srobi/source/repos/serbres-web";
const ov = readFileSync(OV, "utf8");

// 1) Pull the galaxy-arms raster (_Image1) out to a real PNG file.
const m = ov.match(/id="_Image1"[^>]*xlink:href="data:image\/png;base64,([^"]+)"/);
if (!m) throw new Error("_Image1 png not found");
mkdirSync(`${ROOT}/public/arbitrary-life`, { recursive: true });
writeFileSync(`${ROOT}/public/arbitrary-life/galaxy-arms.png`, Buffer.from(m[1], "base64"));
console.log("wrote galaxy-arms.png", (m[1].length * 0.75 / 1e6).toFixed(1), "MB");

// 2) Shapes-only copy of the overlay for in-browser measurement: blank every
//    embedded raster so the file is light, geometry/transforms untouched.
mkdirSync(`${ROOT}/public/_tmp`, { recursive: true });
const stripped = ov.replace(
  /xlink:href="data:image\/[a-z]+;base64,[^"]*"/g,
  'xlink:href=""',
);
writeFileSync(`${ROOT}/public/_tmp/overlay-shapes.svg`, stripped);
console.log("wrote overlay-shapes.svg", (stripped.length / 1e6).toFixed(2), "MB");
