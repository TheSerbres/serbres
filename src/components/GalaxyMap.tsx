"use client";

import { useEffect, useRef, useState } from "react";
import { asset } from "@/lib/site";
import {
  CATEGORY_CONTAINER,
  cleanRegionName,
  isSelectableRegion,
  resolveRegion,
  type GalaxyRegion,
  type RegionCategory,
} from "@/lib/galaxy";

type Found = {
  region: GalaxyRegion;
  el: SVGGElement;
  category: RegionCategory;
};

// A "Districts" wrapper bundles the district pieces inside a province. It is
// never selectable itself, but its direct <g> children ARE the districts.
function isDistrictsWrapper(el: Element | null): boolean {
  if (!(el instanceof SVGGElement)) return false;
  const serif = el.getAttribute("serif:id");
  const label = serif && serif.trim() ? serif.trim() : el.id;
  return label === "Districts" || /^Districts\d*$/.test(label);
}

// A district is a direct <g> child of a Districts wrapper (e.g. Varro's "1" and
// "Capital"). These sit one level below a province and become the deepest
// drillable layer. Pops/Blank markers nested deeper still aren't districts,
// because their parent is the district, not the wrapper.
function isDistrictGroup(el: Element): boolean {
  return (
    el instanceof SVGGElement &&
    el.id !== "" &&
    isDistrictsWrapper(el.parentElement)
  );
}

// True when a group contains a deeper selectable layer (an arm has provinces, a
// province has districts). Drives the "click again to go deeper" hint.
function hasSelectableChild(el: SVGGraphicsElement): boolean {
  for (const g of Array.from(el.querySelectorAll("g"))) {
    if (g === el) continue;
    if (
      isSelectableRegion(g.id, g.getAttribute("serif:id")) ||
      isDistrictGroup(g)
    ) {
      return true;
    }
  }
  return false;
}

// Selectable region groups are <g> elements with an `id` that isn't one of the
// structural wrappers, plus the district groups inside a Districts wrapper.
// Collect them from an event target up to the svg root, ordered innermost
// (district) -> outermost (arm).
function ancestorGroups(
  target: EventTarget | null,
  root: SVGSVGElement,
): SVGGElement[] {
  const out: SVGGElement[] = [];
  let el = target as Element | null;
  while (el && el !== root) {
    if (
      el instanceof SVGGElement &&
      (isSelectableRegion(el.id, el.getAttribute("serif:id")) ||
        isDistrictGroup(el))
    ) {
      out.push(el);
    }
    el = el.parentElement;
  }
  return out;
}

// The innermost selectable group under a target (used for hover feedback).
function innermostGroup(
  target: EventTarget | null,
  root: SVGSVGElement,
): SVGGElement | null {
  return ancestorGroups(target, root)[0] ?? null;
}

// Decide which category a shape belongs to by walking up to the first
// Lands/Abyss container. Defaults to land for anything outside the Abyss.
function categoryOf(el: Element, root: SVGSVGElement): RegionCategory {
  let node: Element | null = el;
  while (node && node !== root) {
    const cat = CATEGORY_CONTAINER[node.id];
    if (cat) return cat;
    node = node.parentElement;
  }
  return "land";
}

// True when a Pops layer (the populations detail) sits anywhere above this
// element — so labeled pop markers don't get mistaken for real regions.
function isPopsLayer(el: Element): boolean {
  const serif = el.getAttribute("serif:id");
  return serif === "Pops" || el.id === "Pops" || /^Pops\d*$/.test(el.id);
}
function isInsidePops(el: Element, root: SVGSVGElement): boolean {
  let node: Element | null = el.parentElement;
  while (node && node !== root) {
    if (isPopsLayer(node)) return true;
    node = node.parentElement;
  }
  return false;
}

function regionForGroup(g: SVGGraphicsElement): GalaxyRegion {
  const serif = g.getAttribute("serif:id");
  const raw = serif && serif.trim() ? serif.trim() : g.id;
  // Districts carry placeholder labels until the canon names them. Numbered
  // pieces read as "District N"; named ones (e.g. "Capital") keep their name.
  if (isDistrictGroup(g)) {
    const name = /^\d+$/.test(raw) ? `District ${raw}` : cleanRegionName(raw);
    return { name, kind: "District", description: "" };
  }
  return resolveRegion(raw);
}

// Fade everything that doesn't contain the active shape. Walking up from it and
// dimming each level's *other* children leaves only its branch lit, regardless
// of how loosely paths/wrappers are nested. Opacity composes predictably
// through the SVG tree, so this stays reliable where stacked filters did not.
function focusOnArm(arm: SVGGraphicsElement, root: SVGSVGElement) {
  root.querySelectorAll(".gx-dim").forEach((e) => e.classList.remove("gx-dim"));
  let node: Element = arm;
  let parent: Element | null = arm.parentElement;
  while (parent) {
    for (const child of Array.from(parent.children)) {
      if (child !== node) child.classList.add("gx-dim");
    }
    if (parent === root) break;
    node = parent;
    parent = parent.parentElement;
  }
}

// One searchable panel with Lands / Abyss tabs. Switching tabs clears the
// search so each list starts fresh.
function RegionTabs({
  lands,
  abyss,
  selectedName,
  onSelect,
}: {
  lands: Found[];
  abyss: Found[];
  selectedName: string | null;
  onSelect: (f: Found) => void;
}) {
  const [tab, setTab] = useState<"lands" | "abyss">("lands");
  const [query, setQuery] = useState("");

  const items = tab === "lands" ? lands : abyss;
  const q = query.trim().toLowerCase();
  const filtered = q
    ? items.filter((f) => f.region.name.toLowerCase().includes(q))
    : items;

  const tabs: { key: "lands" | "abyss"; label: string; count: number }[] = [
    { key: "lands", label: "Lands", count: lands.length },
    { key: "abyss", label: "Abyss", count: abyss.length },
  ];

  return (
    <div className="al-panel p-6">
      <div
        role="tablist"
        aria-label="Region category"
        className="flex gap-1 rounded-sm border border-[color:rgb(var(--hud)/0.2)] bg-bg-elev p-1"
      >
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            role="tab"
            aria-selected={tab === t.key}
            onClick={() => {
              setTab(t.key);
              setQuery("");
            }}
            className={`al-tele flex-1 rounded-[2px] px-3 py-2 !text-[0.65rem] transition-colors ${
              tab === t.key
                ? "bg-accent text-accent-fg"
                : "text-muted hover:text-fg"
            }`}
          >
            {t.label}{" "}
            <span
              className={tab === t.key ? "opacity-70" : "text-muted"}
            >
              ({t.count})
            </span>
          </button>
        ))}
      </div>

      {items.length > 0 ? (
        <>
          <div className="relative mt-4">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search…"
              aria-label={`Search ${tab}`}
              className="w-full rounded-sm border border-[color:rgb(var(--hud)/0.2)] bg-bg-elev px-4 py-2 text-xs text-fg placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>
          {filtered.length > 0 ? (
            <ul className="mt-4 flex flex-wrap gap-2">
              {filtered.map((f) => (
                <li key={f.region.name}>
                  <button
                    type="button"
                    onClick={() => onSelect(f)}
                    className={`rounded-[2px] border px-3 py-1 text-xs transition-colors ${
                      selectedName === f.region.name
                        ? "border-accent bg-accent text-accent-fg"
                        : "border-[color:rgb(var(--hud)/0.22)] text-muted hover:border-accent hover:text-accent"
                    }`}
                  >
                    {f.region.name}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-xs text-muted">
              No matches for “{query.trim()}”.
            </p>
          )}
        </>
      ) : (
        <p className="mt-4 text-xs text-muted">Nothing charted here yet.</p>
      )}
    </div>
  );
}

export default function GalaxyMap() {
  const hostRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const hoveredRef = useRef<SVGGElement | null>(null);
  // The active drill chain, outermost -> innermost: [arm, province?, district?].
  // Widened to SVGGraphicsElement so it can also hold a bare path (e.g. Earth).
  const drillRef = useRef<SVGGraphicsElement[]>([]);
  const regionMapRef = useRef<Map<string, Found>>(new Map());

  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );
  const [selected, setSelected] = useState<GalaxyRegion | null>(null);
  const [canDrill, setCanDrill] = useState(false);
  // How many levels deep the current selection is (1 = arm, 2 = province,
  // 3 = district). Used to word the "drill deeper" hint correctly.
  const [depth, setDepth] = useState(0);
  const [lands, setLands] = useState<Found[]>([]);
  const [abyss, setAbyss] = useState<Found[]>([]);
  const [showPops, setShowPops] = useState(true);
  const [expanded, setExpanded] = useState(false);

  // Smoothly zoom the map toward a region: center it in the view and scale up.
  // Measuring the element against the svg's own rect makes the fractions
  // transform-invariant, so each call recomputes one absolute transform and the
  // CSS transition animates cleanly from wherever the map currently sits.
  function zoomTo(
    el: SVGGraphicsElement,
    opts?: { fill?: number; maxScale?: number; minScale?: number },
  ) {
    const svg = svgRef.current;
    if (!svg) return;
    const sr = svg.getBoundingClientRect();
    const er = el.getBoundingClientRect();
    if (!sr.width || !sr.height || !er.width) return;
    const cx = (er.left + er.width / 2 - sr.left) / sr.width;
    const cy = (er.top + er.height / 2 - sr.top) / sr.height;
    const fracW = er.width / sr.width;
    const fracH = er.height / sr.height;
    // Fill ~55% of the view with the region, but keep the zoom gentle. A tiny
    // target (like Earth) can ask for a tighter fill and a higher cap so it
    // becomes findable instead of staying a speck.
    const fill = opts?.fill ?? 0.55;
    let scale = fill / Math.max(fracW, fracH, 0.001);
    scale = Math.max(opts?.minScale ?? 1.3, Math.min(scale, opts?.maxScale ?? 2.4));
    const tx = (0.5 - cx * scale) * 100;
    const ty = (0.5 - cy * scale) * 100;
    svg.style.transform = `translate(${tx}%, ${ty}%) scale(${scale})`;
  }

  // Light a drill chain (outer -> inner) up to `levels` deep. The arm gets the
  // soft wash; the deepest pick beyond the arm glows. Everything outside the
  // deepest pick's branch fades. One function now drives all of arm / province /
  // district selection, so the depth is just how far the chain is sliced.
  function selectChain(chain: SVGGraphicsElement[], levels: number) {
    const svg = svgRef.current;
    const sel = chain.slice(0, Math.max(1, levels));
    const deepest = sel[sel.length - 1];

    // Drop highlight classes from anything no longer in the active chain.
    for (const el of drillRef.current) {
      if (!sel.includes(el)) el.classList.remove("gx-arm", "gx-selected");
    }
    sel.forEach((el) => el.classList.remove("gx-arm", "gx-selected"));

    hostRef.current?.classList.add("gx-focusing");
    if (svg) focusOnArm(deepest, svg);

    sel[0].classList.add("gx-arm");
    if (sel.length >= 2) deepest.classList.add("gx-selected");

    drillRef.current = sel;
    setSelected(regionForGroup(deepest));
    setCanDrill(hasSelectableChild(deepest));
    setDepth(sel.length);
    zoomTo(deepest);
  }

  // Abyss shapes are single-click: just light and zoom the clicked shape.
  function selectAbyss(el: SVGGElement) {
    const svg = svgRef.current;
    for (const e of drillRef.current) {
      e.classList.remove("gx-arm", "gx-selected");
    }
    hostRef.current?.classList.add("gx-focusing");
    if (svg) focusOnArm(el, svg);
    el.classList.add("gx-selected");
    drillRef.current = [el];
    setSelected(regionForGroup(el));
    setCanDrill(false);
    setDepth(1);
    zoomTo(el);
  }

  // "Where is Earth?": Earth is a single tiny path tucked inside Magna Mater.
  // Light it, fade the rest, and zoom in tight enough that the speck becomes
  // findable. Tracked in the drill chain so Reset/empty-click clears it too.
  function whereIsEarth() {
    const svg = svgRef.current;
    if (!svg) return;
    const earth = svg.querySelector("#Earth");
    if (!(earth instanceof SVGGraphicsElement)) return;
    for (const e of drillRef.current) {
      e.classList.remove("gx-arm", "gx-selected");
    }
    hostRef.current?.classList.add("gx-focusing");
    focusOnArm(earth, svg);
    earth.classList.add("gx-selected");
    drillRef.current = [earth];
    setSelected({
      name: "Earth",
      kind: "Homeworld",
      description:
        "Humanity's cradle, a quiet world far out on the Magna Mater arm.",
    });
    setCanDrill(false);
    setDepth(1);
    zoomTo(earth, { fill: 0.32, maxScale: 6 });
  }

  // Zoom back out and clear the selection — the "reverse" of selecting. Wired to
  // both a clicked empty area and the Reset button.
  function resetView() {
    const svg = svgRef.current;
    if (svg) {
      svg.style.transform = "";
      svg.querySelectorAll(".gx-dim").forEach((e) =>
        e.classList.remove("gx-dim"),
      );
    }
    for (const el of drillRef.current) {
      el.classList.remove("gx-arm", "gx-selected");
    }
    drillRef.current = [];
    hostRef.current?.classList.remove("gx-focusing");
    setSelected(null);
    setCanDrill(false);
    setDepth(0);
  }

  useEffect(() => {
    let cancelled = false;
    const host = hostRef.current;
    if (!host) return;

    fetch(asset("/arbitrary-life/galaxy.svg"))
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.text();
      })
      .then((markup) => {
        if (cancelled || !host) return;
        host.innerHTML = markup;
        const svg = host.querySelector("svg");
        if (!(svg instanceof SVGSVGElement)) {
          throw new Error("No <svg> in galaxy map");
        }
        svgRef.current = svg;
        svg.style.width = "100%";
        svg.style.height = "auto";
        svg.style.display = "block";
        svg.setAttribute("role", "img");
        svg.setAttribute("aria-label", "Map of the Arbitrary Life galaxy");

        // Drop the painted galaxy arms (a raster from the canonical Affinity
        // doc) in as the bottom layer so the vector regions sit exactly over
        // their arms. The matrix maps the 4608² image into this SVG's
        // coordinate space; it was solved as the affine between the overlay
        // export (which carries the image) and this shapes export, so the photo
        // lines up with the shapes and zooms/pans with them. See
        // scripts/solve-affine.mjs.
        if (!svg.querySelector("#gx-arms")) {
          const SVGNS = "http://www.w3.org/2000/svg";
          const XLINK = "http://www.w3.org/1999/xlink";
          const arms = document.createElementNS(SVGNS, "image");
          arms.id = "gx-arms";
          arms.setAttribute("width", "4608");
          arms.setAttribute("height", "4608");
          arms.setAttribute("preserveAspectRatio", "none");
          arms.setAttribute(
            "transform",
            "matrix(1.36833,0.1325,-0.11682,1.20362,495.42172,-308.86722)",
          );
          const armsHref = asset("/arbitrary-life/galaxy-arms.jpg");
          arms.setAttributeNS(XLINK, "xlink:href", armsHref);
          arms.setAttribute("href", armsHref);
          svg.insertBefore(arms, svg.firstChild);

          // The painted arms now ARE the galaxy, so retire the old Abyss
          // "white sphere" raster (#_Image1) the design previously dimmed to
          // black to fake the void. Hiding it lets the photo read; the Abyss
          // vector shapes (Animus, etc.) stay selectable.
          svg.querySelectorAll<SVGElement>("#Abyss use, #Abyss image").forEach(
            (u) => {
              const href =
                u.getAttributeNS(XLINK, "href") || u.getAttribute("href") || "";
              if (href === "#_Image1" || u.id === "_Image1") {
                u.style.display = "none";
              }
            },
          );
        }

        // Tag the populations detail layer so the "Show Pops" toggle can hide
        // it. Pops are scattered as per-holding layers (serif:id="Pops"), not a
        // single container.
        svg.querySelectorAll<SVGGElement>("g").forEach((g) => {
          if (isPopsLayer(g)) g.classList.add("gx-pop");
        });

        // Build the name -> {region, element, category} index, splitting shapes
        // into Lands and Abyss by their container and skipping pop markers,
        // paint/marker layers, and gradient defs.
        const map = new Map<string, Found>();
        svg.querySelectorAll<SVGGElement>("g[id]").forEach((g) => {
          if (!isSelectableRegion(g.id, g.getAttribute("serif:id"))) return;
          if (isInsidePops(g, svg)) return;
          const region = regionForGroup(g);
          if (map.has(region.name)) return;
          map.set(region.name, {
            region,
            el: g,
            category: categoryOf(g, svg),
          });
        });
        regionMapRef.current = map;

        const all = [...map.values()];
        const byName = (a: Found, b: Found) =>
          a.region.name.localeCompare(b.region.name);
        setLands(all.filter((f) => f.category === "land").sort(byName));
        setAbyss(all.filter((f) => f.category === "abyss").sort(byName));
        setStatus("ready");
      })
      .catch((err) => {
        console.error("Galaxy map failed to load:", err);
        if (!cancelled) setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // Toggle the Pops detail layer on/off.
  useEffect(() => {
    if (status !== "ready") return;
    hostRef.current?.classList.toggle("gx-hide-pops", !showPops);
  }, [showPops, status]);

  // Fullscreen overlay: Escape exits, and the page scroll locks while open.
  useEffect(() => {
    if (!expanded) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setExpanded(false);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [expanded]);

  // Pointer interactions, attached once the svg is in the DOM.
  useEffect(() => {
    const svg = svgRef.current;
    if (status !== "ready" || !svg) return;

    const onMove = (e: PointerEvent) => {
      const g = innermostGroup(e.target, svg);
      if (g === hoveredRef.current) return;
      if (hoveredRef.current) hoveredRef.current.classList.remove("gx-hover");
      if (g) g.classList.add("gx-hover");
      hoveredRef.current = g;
      svg.style.cursor = g ? "pointer" : "default";
    };
    const onLeave = () => {
      if (hoveredRef.current) hoveredRef.current.classList.remove("gx-hover");
      hoveredRef.current = null;
      svg.style.cursor = "default";
    };
    const onClick = (e: MouseEvent) => {
      const groups = ancestorGroups(e.target, svg);
      // Clicking empty space (the deep-space gaps between arms) zooms back out.
      if (!groups.length) {
        resetView();
        return;
      }

      // Abyss shapes are single-click: highlight just the clicked shape.
      if (categoryOf(groups[0], svg) === "abyss") {
        selectAbyss(groups[0]);
        return;
      }

      // Lands drill progressively: arm -> province -> district. `chain` is the
      // clicked path outermost -> innermost. Each click advances one level past
      // what the current selection already shares with that path, so the first
      // click lights the arm, the next the province, the next the district —
      // and clicking a sibling at any level switches to it.
      const chain = groups.slice().reverse();
      const drill = drillRef.current;
      let common = 0;
      while (
        common < drill.length &&
        common < chain.length &&
        drill[common] === chain[common]
      ) {
        common++;
      }
      const levels = Math.min(common + 1, chain.length);
      selectChain(chain, levels);
    };

    svg.addEventListener("pointermove", onMove);
    svg.addEventListener("pointerleave", onLeave);
    svg.addEventListener("click", onClick);
    return () => {
      svg.removeEventListener("pointermove", onMove);
      svg.removeEventListener("pointerleave", onLeave);
      svg.removeEventListener("click", onClick);
    };
  }, [status]);

  // Jump straight to a shape from a list. Abyss shapes are a single full
  // highlight; lands select their full chain down to the picked shape.
  function selectFound(f: Found) {
    const svg = svgRef.current;
    if (!svg) return;
    const el = f.el;
    if (f.category === "abyss") {
      selectAbyss(el);
    } else {
      const chain = ancestorGroups(el, svg).reverse();
      if (chain.length) selectChain(chain, chain.length);
    }
    el.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_minmax(0,20rem)] lg:items-start">
      {/* Left column: a controls bar (legend + Pops toggle) above the map. */}
      <div className="flex flex-col gap-4">
        {status === "ready" && (
          <div className="al-panel flex flex-wrap items-center gap-x-6 gap-y-3 px-5 py-4">
            <p className="al-tele text-accent">Legend</p>
            <ul className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs">
              <li
                className="flex items-center gap-2"
                title="The galaxy's arms and the provinces within them."
              >
                <span
                  aria-hidden="true"
                  className="h-3.5 w-3.5 shrink-0 rounded-[4px]"
                  style={{
                    background:
                      "conic-gradient(from 210deg, #4da6ff, #7c5cff, #15b8a6, #e0b341, #d9534f, #4da6ff)",
                  }}
                />
                <span className="font-medium">Lands</span>
              </li>
              <li
                className="flex items-center gap-2"
                title="The space between and beyond the arms, where travel works differently."
              >
                <span
                  aria-hidden="true"
                  className="h-3.5 w-3.5 shrink-0 rounded-[4px] ring-1 ring-inset ring-white/15"
                  style={{ background: "#0a1b2b" }}
                />
                <span className="font-medium">Abyss</span>
              </li>
              <li
                className="flex items-center gap-2"
                title="Populations: planets, settlements, corporate sites, and other points of interest."
              >
                <span
                  aria-hidden="true"
                  className="h-2.5 w-2.5 shrink-0 rounded-full bg-white shadow-[0_0_6px_2px_rgba(255,255,255,0.5)]"
                />
                <span className="font-medium">Pops</span>
              </li>
            </ul>
            <label className="ml-auto flex cursor-pointer items-center gap-3 text-sm">
              <input
                type="checkbox"
                checked={showPops}
                onChange={(e) => setShowPops(e.target.checked)}
                className="h-4 w-4 shrink-0 accent-[var(--accent)]"
              />
              <span className="font-medium">Show Pops</span>
              <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted">
                {showPops ? "On" : "Off"}
              </span>
            </label>
          </div>
        )}

        <div
          className={
            expanded
              ? "gx-stage fixed inset-0 z-[70] flex items-center justify-center bg-[#010206] p-4 sm:p-8"
              : "gx-stage relative overflow-hidden rounded-[3px] border border-[color:rgb(var(--hud)/0.25)] bg-[#010206]"
          }
        >
        {/* Deep-space backdrop (shows through the disk's gaps). */}
        <div className="gx-stage-bg" aria-hidden="true" />

        {status === "loading" && (
          <div className="flex aspect-[6692/5438] items-center justify-center">
            <span className="al-tele al-live text-accent">
              Acquiring chart&hellip;
            </span>
          </div>
        )}
        {status === "error" && (
          <div className="flex aspect-[6692/5438] items-center justify-center px-6 text-center text-sm text-muted">
            Chart link lost. Refresh to re-establish the feed.
          </div>
        )}
        {/* React never renders children into this node, so it is safe to
            replace its contents with the fetched SVG via innerHTML. */}
        <div
          ref={hostRef}
          className={`gx-canvas relative z-[1] w-full overflow-hidden ${expanded ? "max-h-full max-w-6xl" : ""}`}
        />

        {/* Core bloom + rim vignette over the map. */}
        <div className="gx-stage-glow" aria-hidden="true" />

        {/* HUD corner brackets (sit inside the clipped stage). */}
        {!expanded && (
          <div className="al-corners" aria-hidden="true">
            <i />
          </div>
        )}

        {status === "ready" && selected && (
          <button
            type="button"
            onClick={resetView}
            aria-label="Reset view"
            title="Reset view"
            className="absolute left-3 top-3 z-10 flex h-9 items-center gap-1.5 rounded-[2px] border border-[color:rgb(var(--hud)/0.3)] bg-black/55 px-3 text-xs font-medium text-white/85 backdrop-blur-sm transition-colors hover:border-accent hover:text-accent"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M3 12a9 9 0 1 0 3-6.7L3 8m0-5v5h5" />
            </svg>
            <span className="al-tele !text-[0.65rem] !tracking-[0.18em]">Reset</span>
          </button>
        )}

        {status === "ready" && (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-label={expanded ? "Exit fullscreen" : "Expand map to fullscreen"}
            title={expanded ? "Exit fullscreen (Esc)" : "Expand to fullscreen"}
            className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-[2px] border border-[color:rgb(var(--hud)/0.3)] bg-black/55 text-white/85 backdrop-blur-sm transition-colors hover:border-accent hover:text-accent"
          >
            {expanded ? (
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            ) : (
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
              </svg>
            )}
          </button>
        )}

        {status === "ready" && (
          <button
            type="button"
            onClick={whereIsEarth}
            title="Find Earth on the map"
            className="absolute bottom-3 left-3 z-10 flex h-9 items-center gap-1.5 rounded-[2px] border border-[color:rgb(var(--hud)/0.3)] bg-black/55 px-3 text-xs font-medium text-white/85 backdrop-blur-sm transition-colors hover:border-accent hover:text-accent"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="9" />
              <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
            </svg>
            <span className="al-tele !text-[0.65rem] !tracking-[0.18em]">
              Where is Earth?
            </span>
          </button>
        )}
        </div>
      </div>

      <aside className="flex flex-col gap-5">
        <div className="al-panel al-frame p-6">
          <span className="al-frame-corners" aria-hidden="true" />
          {selected ? (
            <>
              <p className="al-tele text-accent">{selected.kind}</p>
              <h3 className="al-display mt-2.5 text-xl tracking-tight">
                {selected.name}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[color:rgb(var(--al-ink)/0.7)]">
                {selected.description || "Lore for this region is coming soon."}
              </p>
              {canDrill && (
                <p className="al-tele mt-4 !text-[0.6rem] text-accent/80">
                  {depth >= 2
                    ? "▸ Click again to highlight a district."
                    : "▸ Click again to highlight a province."}
                </p>
              )}
            </>
          ) : (
            <>
              <p className="al-tele text-accent">Galaxy Map</p>
              <h3 className="al-display mt-2.5 text-xl tracking-tight">
                Explore the galaxy
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[color:rgb(var(--al-ink)/0.7)]">
                Click an arm to light it up, then click again to drill in:
                arm → province → district. Abyss shapes select with a single
                click.
              </p>
            </>
          )}
        </div>

        {status === "ready" && (
          <RegionTabs
            lands={lands}
            abyss={abyss}
            selectedName={selected?.name ?? null}
            onSelect={selectFound}
          />
        )}
      </aside>
    </div>
  );
}
