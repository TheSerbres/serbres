"use client";

import { useEffect, useRef, useState } from "react";
import { asset } from "@/lib/site";
import {
  CATEGORY_CONTAINER,
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

// Selectable region groups are <g> elements with an `id` that isn't one of the
// structural wrappers. Collect them from an event target up to the svg root,
// ordered innermost (province) -> outermost (arm).
function ancestorGroups(
  target: EventTarget | null,
  root: SVGSVGElement,
): SVGGElement[] {
  const out: SVGGElement[] = [];
  let el = target as Element | null;
  while (el && el !== root) {
    if (
      el instanceof SVGGElement &&
      isSelectableRegion(el.id, el.getAttribute("serif:id"))
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

// The outermost selectable group containing an element (its "arm").
function armOf(el: SVGGElement, root: SVGSVGElement): SVGGElement {
  const chain = ancestorGroups(el, root);
  return chain[chain.length - 1] ?? el;
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

function regionForGroup(g: SVGGElement): GalaxyRegion {
  const serif = g.getAttribute("serif:id");
  return resolveRegion(serif && serif.trim() ? serif.trim() : g.id);
}

// Fade everything that doesn't contain the active shape. Walking up from it and
// dimming each level's *other* children leaves only its branch lit, regardless
// of how loosely paths/wrappers are nested. Opacity composes predictably
// through the SVG tree, so this stays reliable where stacked filters did not.
function focusOnArm(arm: SVGGElement, root: SVGSVGElement) {
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

// A collapsible, searchable list of region chips for one category.
function RegionList({
  title,
  items,
  selectedName,
  onSelect,
  defaultOpen,
}: {
  title: string;
  items: Found[];
  selectedName: string | null;
  onSelect: (f: Found) => void;
  defaultOpen?: boolean;
}) {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const filtered = q
    ? items.filter((f) => f.region.name.toLowerCase().includes(q))
    : items;

  return (
    <details
      open={defaultOpen}
      className="rounded-2xl border border-border bg-bg p-6"
    >
      <summary className="flex cursor-pointer select-none items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
        <span>{title}</span>
        <span className="text-muted">({items.length})</span>
      </summary>

      {items.length > 0 ? (
        <>
          <div className="relative mt-4">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search…"
              aria-label={`Search ${title}`}
              className="w-full rounded-full border border-border bg-bg-elev px-4 py-2 text-xs text-fg placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>
          {filtered.length > 0 ? (
            <ul className="mt-4 flex flex-wrap gap-2">
              {filtered.map((f) => (
                <li key={f.region.name}>
                  <button
                    type="button"
                    onClick={() => onSelect(f)}
                    className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                      selectedName === f.region.name
                        ? "border-accent bg-accent text-accent-fg"
                        : "border-border text-muted hover:border-accent hover:text-accent"
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
        <p className="mt-4 text-xs text-muted">
          Nothing charted here yet.
        </p>
      )}
    </details>
  );
}

export default function GalaxyMap() {
  const hostRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const hoveredRef = useRef<SVGGElement | null>(null);
  const armElRef = useRef<SVGGElement | null>(null);
  const provinceElRef = useRef<SVGGElement | null>(null);
  const regionMapRef = useRef<Map<string, Found>>(new Map());

  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );
  const [selected, setSelected] = useState<GalaxyRegion | null>(null);
  const [canDrill, setCanDrill] = useState(false);
  const [lands, setLands] = useState<Found[]>([]);
  const [abyss, setAbyss] = useState<Found[]>([]);
  const [showPops, setShowPops] = useState(true);
  const [expanded, setExpanded] = useState(false);

  // Smoothly zoom the map toward a region: center it in the view and scale up.
  // Measuring the element against the svg's own rect makes the fractions
  // transform-invariant, so each call recomputes one absolute transform and the
  // CSS transition animates cleanly from wherever the map currently sits.
  function zoomTo(el: SVGGElement) {
    const svg = svgRef.current;
    if (!svg) return;
    const sr = svg.getBoundingClientRect();
    const er = el.getBoundingClientRect();
    if (!sr.width || !sr.height || !er.width) return;
    const cx = (er.left + er.width / 2 - sr.left) / sr.width;
    const cy = (er.top + er.height / 2 - sr.top) / sr.height;
    const fracW = er.width / sr.width;
    const fracH = er.height / sr.height;
    // Fill ~55% of the view with the region, but keep the zoom gentle.
    let scale = 0.55 / Math.max(fracW, fracH, 0.001);
    scale = Math.max(1.3, Math.min(scale, 2.4));
    const tx = (0.5 - cx * scale) * 100;
    const ty = (0.5 - cy * scale) * 100;
    svg.style.transform = `translate(${tx}%, ${ty}%) scale(${scale})`;
  }

  // Light a whole shape. `full` swaps the soft ~50% wash for a full highlight
  // (used for the second click on an arm, or any single-click abyss shape).
  function selectArm(arm: SVGGElement, full: boolean) {
    const svg = svgRef.current;
    hostRef.current?.classList.add("gx-focusing");
    if (svg) focusOnArm(arm, svg);
    if (armElRef.current && armElRef.current !== arm) {
      armElRef.current.classList.remove("gx-arm", "gx-selected");
    }
    if (provinceElRef.current && provinceElRef.current !== arm) {
      provinceElRef.current.classList.remove("gx-selected");
    }
    provinceElRef.current = full ? arm : null;
    armElRef.current = arm;
    arm.classList.remove("gx-arm", "gx-selected");
    arm.classList.add(full ? "gx-selected" : "gx-arm");
    setSelected(regionForGroup(arm));
    zoomTo(arm);
  }

  // Highlight a single province inside the currently-lit arm.
  function selectProvince(prov: SVGGElement) {
    if (
      provinceElRef.current &&
      provinceElRef.current !== prov &&
      provinceElRef.current !== armElRef.current
    ) {
      provinceElRef.current.classList.remove("gx-selected");
    }
    prov.classList.add("gx-selected");
    provinceElRef.current = prov;
    setSelected(regionForGroup(prov));
    zoomTo(prov);
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
    armElRef.current?.classList.remove("gx-arm", "gx-selected");
    provinceElRef.current?.classList.remove("gx-selected");
    armElRef.current = null;
    provinceElRef.current = null;
    hostRef.current?.classList.remove("gx-focusing");
    setSelected(null);
    setCanDrill(false);
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
      const province = groups[0];
      const arm = groups[groups.length - 1];

      // Abyss shapes are single-click: highlight just the clicked shape.
      if (categoryOf(province, svg) === "abyss") {
        selectArm(province, true);
        setCanDrill(false);
        return;
      }

      // Lands keep the two-stage arm -> province drill.
      if (arm !== armElRef.current) {
        selectArm(arm, false);
        setCanDrill(province !== arm);
      } else if (province === arm) {
        selectArm(arm, true);
        setCanDrill(false);
      } else {
        selectProvince(province);
        setCanDrill(false);
      }
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
  // highlight; lands light the arm (and province, when the shape is nested).
  function selectFound(f: Found) {
    const svg = svgRef.current;
    if (!svg) return;
    const el = f.el;
    if (f.category === "abyss") {
      selectArm(el, true);
    } else {
      const arm = armOf(el, svg);
      if (el === arm) {
        selectArm(arm, true);
      } else {
        selectArm(arm, false);
        selectProvince(el);
      }
    }
    setCanDrill(false);
    el.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_minmax(0,20rem)] lg:items-start">
      <div
        className={
          expanded
            ? "gx-stage fixed inset-0 z-[70] flex items-center justify-center bg-[#010206] p-4 sm:p-8"
            : "gx-stage relative overflow-hidden rounded-2xl border border-border bg-[#010206]"
        }
      >
        {/* Deep-space backdrop (shows through the disk's gaps). */}
        <div className="gx-stage-bg" aria-hidden="true" />

        {status === "loading" && (
          <div className="flex aspect-[6692/5438] items-center justify-center text-sm text-muted">
            Charting the galaxy…
          </div>
        )}
        {status === "error" && (
          <div className="flex aspect-[6692/5438] items-center justify-center px-6 text-center text-sm text-muted">
            The galaxy map could not be loaded. Please refresh to try again.
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

        {status === "ready" && selected && (
          <button
            type="button"
            onClick={resetView}
            aria-label="Reset view"
            title="Reset view"
            className="absolute left-3 top-3 z-10 flex h-9 items-center gap-1.5 rounded-lg border border-white/15 bg-black/40 px-3 text-xs font-medium text-white/90 backdrop-blur-sm transition-colors hover:border-accent hover:text-accent"
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
            Reset
          </button>
        )}

        {status === "ready" && (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-label={expanded ? "Exit fullscreen" : "Expand map to fullscreen"}
            title={expanded ? "Exit fullscreen (Esc)" : "Expand to fullscreen"}
            className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 bg-black/40 text-white/90 backdrop-blur-sm transition-colors hover:border-accent hover:text-accent"
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
      </div>

      <aside className="flex flex-col gap-5">
        <div className="rounded-2xl border border-border bg-bg p-6">
          {selected ? (
            <>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
                {selected.kind}
              </p>
              <h3 className="mt-2 text-xl font-semibold tracking-tight">
                {selected.name}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                {selected.description || "Lore for this region is coming soon."}
              </p>
              {canDrill && (
                <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.15em] text-accent/80">
                  Click again inside the arm to highlight a province.
                </p>
              )}
            </>
          ) : (
            <>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
                Galaxy Map
              </p>
              <h3 className="mt-2 text-xl font-semibold tracking-tight">
                Explore the galaxy
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                Click an arm to light it up, then click again inside it to
                highlight a province. Abyss shapes select with a single click.
              </p>
            </>
          )}
        </div>

        {status === "ready" && (
          <>
            <RegionList
              title="All Lands"
              items={lands}
              selectedName={selected?.name ?? null}
              onSelect={selectFound}
            />
            <RegionList
              title="All Abyss"
              items={abyss}
              selectedName={selected?.name ?? null}
              onSelect={selectFound}
            />

            {/* Detail-layer toggle */}
            <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-border bg-bg p-5 text-sm">
              <input
                type="checkbox"
                checked={showPops}
                onChange={(e) => setShowPops(e.target.checked)}
                className="h-4 w-4 shrink-0 accent-[var(--accent)]"
              />
              <span className="font-medium">Show Pops</span>
              <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.15em] text-muted">
                {showPops ? "On" : "Off"}
              </span>
            </label>

            {/* Legend */}
            <div className="rounded-2xl border border-border bg-bg p-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
                Legend
              </p>
              <ul className="mt-4 flex flex-col gap-4">
                <li className="flex items-start gap-3">
                  <span
                    aria-hidden="true"
                    className="mt-0.5 h-4 w-4 shrink-0 rounded-[5px]"
                    style={{
                      background:
                        "conic-gradient(from 210deg, #4da6ff, #7c5cff, #15b8a6, #e0b341, #d9534f, #4da6ff)",
                    }}
                  />
                  <div>
                    <p className="text-sm font-medium">Lands</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-muted">
                      The galaxy&rsquo;s arms and the provinces within them.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span
                    aria-hidden="true"
                    className="mt-0.5 h-4 w-4 shrink-0 rounded-[5px] ring-1 ring-inset ring-white/15"
                    style={{ background: "#0a1b2b" }}
                  />
                  <div>
                    <p className="text-sm font-medium">Abyss</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-muted">
                      The space between and beyond the arms, where travel works
                      differently.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span
                    aria-hidden="true"
                    className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-white shadow-[0_0_6px_2px_rgba(255,255,255,0.5)]"
                  />
                  <div>
                    <p className="text-sm font-medium">Pops</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-muted">
                      Populations: planets, settlements, corporate sites, and
                      other points of interest. Toggle off to hide them.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
