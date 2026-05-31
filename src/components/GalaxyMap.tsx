"use client";

import { useEffect, useRef, useState } from "react";
import { asset } from "@/lib/site";
import {
  EXCLUDE_IDS,
  getRegion,
  type GalaxyRegion,
} from "@/lib/galaxy";

type Found = { region: GalaxyRegion; el: SVGGElement };

// Walk up from an event target to the innermost selectable region group:
// a <g> with an `id` that isn't one of the structural wrappers.
function findRegionGroup(
  target: EventTarget | null,
  root: SVGSVGElement,
): SVGGElement | null {
  let el = target as Element | null;
  while (el && el !== root) {
    if (
      el instanceof SVGGElement &&
      el.id &&
      !EXCLUDE_IDS.has(el.id)
    ) {
      return el;
    }
    el = el.parentElement;
  }
  return null;
}

function regionForGroup(g: SVGGElement): GalaxyRegion {
  const serif = g.getAttribute("serif:id");
  return getRegion(serif && serif.trim() ? serif.trim() : g.id);
}

export default function GalaxyMap() {
  const hostRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const hoveredRef = useRef<SVGGElement | null>(null);
  const selectedElRef = useRef<SVGGElement | null>(null);
  const regionMapRef = useRef<Map<string, Found>>(new Map());

  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );
  const [selected, setSelected] = useState<GalaxyRegion | null>(null);
  const [regionNames, setRegionNames] = useState<string[]>([]);

  // Highlight + record a selection given its group element.
  function select(el: SVGGElement) {
    if (selectedElRef.current && selectedElRef.current !== el) {
      selectedElRef.current.classList.remove("gx-selected");
    }
    el.classList.add("gx-selected");
    selectedElRef.current = el;
    setSelected(regionForGroup(el));
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
        setRegionNames(
          [...map.keys()].sort((a, b) => a.localeCompare(b)),
        );
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
      const g = findRegionGroup(e.target, svg);
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
      const g = findRegionGroup(e.target, svg);
      if (g) select(g);
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

  function selectByName(name: string) {
    const found = regionMapRef.current.get(name);
    if (found) {
      select(found.el);
      found.el.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
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
                Hover to highlight a region, then click it to read about the
                worlds, powers, and factions of Arbitrary Life.
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
