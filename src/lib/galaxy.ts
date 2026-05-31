// Data + helpers for the Arbitrary Life interactive Galaxy Map.
//
// The map itself is a Serif-exported SVG (public/arbitrary-life/galaxy.svg).
// Each selectable region is a `<g id="...">` group, most carrying a
// `serif:id="Clean Name"` attribute. A handful of `<g>` ids are structural
// wrappers (layers, the abyss backdrop, etc.) and must never be selectable.
export const EXCLUDE_IDS = new Set([
  "Abyss",
  "Lands",
  "Layer1",
  "Layer2",
  "Not",
  "Raids",
]);

// Turn a raw id (e.g. "Varro1", "Kiran-Republic", "middle-world") into a clean
// display name. Mirrors the normalization used to build the region inventory:
// strip trailing digits, hyphens to spaces, title-case each word.
export function cleanRegionName(raw: string): string {
  let s = raw.replace(/\d+$/, "");
  s = s.replace(/-/g, " ").trim();
  s = s
    .split(" ")
    .map((w) => (w.length ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
  return s;
}

export type GalaxyRegion = {
  /** Display name, matching the SVG serif:id where present. */
  name: string;
  /** Short kind/label shown above the name in the panel. */
  kind: string;
  /** A sentence or two of lore. Placeholder copy until the canon is filled in. */
  description: string;
};

// Lore keyed by the lowercased display name. Descriptions are scaffolding for
// now; replace the placeholder copy as the canon gets written down.
//
// `kind` groups regions loosely so the panel reads well even before the lore
// lands. Tune freely.
export const GALAXY_REGIONS: Record<string, GalaxyRegion> = {
  acrux: { name: "Acrux", kind: "Region", description: "" },
  animus: { name: "Animus", kind: "Region", description: "" },
  arberis: { name: "Arberis", kind: "Region", description: "" },
  atlas: { name: "Atlas", kind: "Region", description: "" },
  attica: { name: "Attica", kind: "Region", description: "" },
  "brice corporation": {
    name: "Brice Corporation",
    kind: "Power",
    description: "",
  },
  c: { name: "C", kind: "Region", description: "" },
  camros: { name: "Camros", kind: "Region", description: "" },
  cappella: { name: "Cappella", kind: "Region", description: "" },
  capris: { name: "Capris", kind: "Region", description: "" },
  cleopas: { name: "Cleopas", kind: "Region", description: "" },
  congregation: { name: "Congregation", kind: "Power", description: "" },
  crete: { name: "Crete", kind: "Region", description: "" },
  cypress: { name: "Cypress", kind: "Region", description: "" },
  dagon: { name: "Dagon", kind: "Region", description: "" },
  darravick: { name: "Darravick", kind: "Region", description: "" },
  exum: { name: "Exum", kind: "Region", description: "" },
  fates: { name: "Fates", kind: "Power", description: "" },
  forseti: { name: "Forseti", kind: "Region", description: "" },
  hadrian: { name: "Hadrian", kind: "Region", description: "" },
  janus: { name: "Janus", kind: "Region", description: "" },
  kiran: { name: "Kiran", kind: "Region", description: "" },
  "kiran republic": { name: "Kiran Republic", kind: "Power", description: "" },
  lasair: { name: "Lasair", kind: "Region", description: "" },
  lesna: { name: "Lesna", kind: "Region", description: "" },
  luxor: { name: "Luxor", kind: "Region", description: "" },
  madron: { name: "Madron", kind: "Region", description: "" },
  "magna mater": { name: "Magna Mater", kind: "Region", description: "" },
  "magnus arma": { name: "Magnus Arma", kind: "Power", description: "" },
  mahrein: { name: "Mahrein", kind: "Region", description: "" },
  "middle world": { name: "Middle World", kind: "Region", description: "" },
  "middle worlds": { name: "Middle Worlds", kind: "Region", description: "" },
  nimes: { name: "Nimes", kind: "Region", description: "" },
  odesa: { name: "Odesa", kind: "Region", description: "" },
  phanes: { name: "Phanes", kind: "Region", description: "" },
  "planet states": { name: "Planet States", kind: "Power", description: "" },
  pops: { name: "Pops", kind: "Region", description: "" },
  saphon: { name: "Saphon", kind: "Region", description: "" },
  seneca: { name: "Seneca", kind: "Region", description: "" },
  septrion: { name: "Septrion", kind: "Region", description: "" },
  septum: { name: "Septum", kind: "Region", description: "" },
  serephim: { name: "Serephim", kind: "Region", description: "" },
  solec: { name: "Solec", kind: "Region", description: "" },
  tarf: { name: "Tarf", kind: "Region", description: "" },
  tavek: { name: "Tavek", kind: "Region", description: "" },
  "the chosen": { name: "The Chosen", kind: "Power", description: "" },
  "the commonwealth": {
    name: "The Commonwealth",
    kind: "Power",
    description: "",
  },
  "the forge": { name: "The Forge", kind: "Region", description: "" },
  "the league": { name: "The League", kind: "Power", description: "" },
  "the nephine": { name: "The Nephine", kind: "Power", description: "" },
  "the new kingdome": {
    name: "The New Kingdome",
    kind: "Power",
    description: "",
  },
  "the old kingdome": {
    name: "The Old Kingdome",
    kind: "Power",
    description: "",
  },
  "the west wield": { name: "The West Wield", kind: "Region", description: "" },
  titain: { name: "Titain", kind: "Region", description: "" },
  ultor: { name: "Ultor", kind: "Region", description: "" },
  varro: { name: "Varro", kind: "Region", description: "" },
  vesta: { name: "Vesta", kind: "Region", description: "" },
  "west wield": { name: "West Wield", kind: "Region", description: "" },
};

// Resolve a region by raw id or display name. Falls back to a cleaned-name
// placeholder so a newly added SVG group still renders something sensible.
export function getRegion(raw: string): GalaxyRegion {
  const name = cleanRegionName(raw);
  const key = name.toLowerCase();
  return (
    GALAXY_REGIONS[key] ?? {
      name,
      kind: "Region",
      description: "",
    }
  );
}

// Sorted list for the accessible region index / fallback navigation.
export const GALAXY_REGION_LIST: GalaxyRegion[] = Object.values(GALAXY_REGIONS).sort(
  (a, b) => a.name.localeCompare(b.name),
);
