"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { brands } from "@/lib/site";

export default function BrandsMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center gap-1 underline-offset-4 transition-colors hover:text-accent"
      >
        Brands
        <span
          aria-hidden="true"
          className={`text-[0.65rem] transition-transform ${open ? "rotate-180" : ""}`}
        >
          ▼
        </span>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-3 w-64 overflow-hidden rounded-xl border border-border bg-bg shadow-xl shadow-black/30"
        >
          {brands.map((b) => (
            <Link
              key={b.slug}
              href={`/${b.slug}/`}
              role="menuitem"
              onClick={() => setOpen(false)}
              data-brand={b.slug}
              className="block px-4 py-3 transition-colors hover:bg-bg-elev"
            >
              <span className="block text-sm font-medium text-accent">{b.name}</span>
              <span className="mt-0.5 block text-xs text-fg">{b.tagline}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
