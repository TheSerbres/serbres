"use client";

import { useEffect, useRef, useState } from "react";
import { asset } from "@/lib/site";
import {
  EXCLUDE_IDS,
  getRegion,
  type GalaxyRegion,
} from "@/lib/galaxy";

type Found = { region: GalaxyRegion; el: SVGGElement };

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
    if (el instanceof SVGGElement && el.id && !EXCLUDE_IDS.has(el.id)) {
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

function regionForGroup(g: SVGGElement): GalaxyRegion {
  const serif = g.getAttribute("serif:id");
  return getRegion(serif && serif.trim() ? serif.trim() : g.id);
}

// Fade everything that doesn't contain the active arm. Walking up from the arm
// and dimming each level's *other* children leaves only the arm's branch lit,
// regardless of how loose paths or wrapper groups are nested. Opacity composes
// predictably through the SVG tree, so this stays reliable where stacked
// filters did not.
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
  const [regionNames, setRegionNames] = useState<string[]>([]);

  // Light the whole arm. `full` swaps the soft 50% wash for a full highlight
  // (used when the arm has no provinces to drill into).
  function selectArm(arm: SVGGElement, full: boolean) {
    const svg = svgRef.current;
    hostRef.current?.classList.add("gx-focusing");
    // Fade everything outside the active arm's branch.
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

        // Build the name -> {region, element} index for the region list and
        // dedupe duplicate ids/names.
        const map = new Map<string, Found>();
        svg.querySelectorAll<SVGGElement>("g[id]").forEach((g) => {
          if (EXCLUDE_IDS.has(g.id)) return;
          const region = regionForGroup(g);
          if (!map.has(region.name)) map.set(region.name, { region, el: g });
        });
        regionMapRef.current = map;
        setRegionNames([...map.keys()].sort((a, b) => a.localeCompare(b)));
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
      if (!groups.length) return;
      const province = groups[0];
      const arm = groups[groups.length - 1];

      if (arm !== armElRef.current) {
        // First click on a new arm: wash the whole arm at ~50%.
        selectArm(arm, false);
        setCanDrill(province !== arm);
      } else if (province === arm) {
        // Re-clicking an arm with no deeper province: promote to full.
        selectArm(arm, true);
        setCanDrill(false);
      } else {
        // Second click within the lit arm: highlight the province.
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

  // Jump straight to a region from the index: light its arm and the region.
  function selectByName(name: string) {
    const svg = svgRef.current;
    const found = regionMapRef.current.get(name);
    if (!svg || !found) return;
    const el = found.el;
    const arm = armOf(el, svg);
    if (el === arm) {
      selectArm(arm, true);
    } else {
      selectArm(arm, false);
      selectProvince(el);
    }
    setCanDrill(false);
    el.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_minmax(0,20rem)] lg:items-start">
      <div className="relative overflow-hidden rounded-2xl border border-border bg-[#04121f]">
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
        <div ref={hostRef} className="gx-canvas w-full" />
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
                highlight a single province and read about it.
              </p>
            </>
          )}
        </div>

        {regionNames.length > 0 && (
          <details className="rounded-2xl border border-border bg-bg p-6">
            <summary className="cursor-pointer select-none font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
              All regions ({regionNames.length})
            </summary>
            <ul className="mt-4 flex flex-wrap gap-2">
              {regionNames.map((name) => (
                <li key={name}>
                  <button
                    type="button"
                    onClick={() => selectByName(name)}
                    className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                      selected?.name === name
                        ? "border-accent bg-accent text-accent-fg"
                        : "border-border text-muted hover:border-accent hover:text-accent"
                    }`}
                  >
                    {name}
                  </button>
                </li>
              ))}
            </ul>
          </details>
        )}
      </aside>
    </div>
  );
}
