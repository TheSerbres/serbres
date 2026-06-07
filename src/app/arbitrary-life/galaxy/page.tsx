import type { Metadata } from "next";
import Link from "next/link";
import { arbitraryLife as al } from "@/lib/site";
import GalaxyMap from "@/components/GalaxyMap";

export const metadata: Metadata = {
  title: `Galaxy Map | ${al.name}`,
  description:
    "An interactive map of the Arbitrary Life galaxy: hover and click its regions, powers, and factions to explore the universe.",
};

export default function GalaxyMapPage() {
  return (
    <div className="relative overflow-hidden">
      <div className="al-atmos" aria-hidden="true" />

      <section className="mx-auto max-w-6xl px-6 pt-16 pb-24 sm:pt-24">
        {/* Terminal header bar */}
        <div className="al-rise flex flex-wrap items-center justify-between gap-3 border-b border-[color:rgb(var(--hud)/0.2)] pb-4">
          <div className="flex items-center gap-3">
            <span
              className="al-live h-1.5 w-1.5 rounded-full bg-[color:rgb(var(--core))]"
              aria-hidden="true"
            />
            <span className="al-tele text-accent">Stellar Cartography</span>
            <span className="al-tele text-muted">Online</span>
          </div>
          <Link
            href="/arbitrary-life"
            className="al-tele text-muted transition-colors hover:text-accent"
          >
            &larr; Arbitrary Life
          </Link>
        </div>

        <h1
          className="al-display al-wipe mt-8 max-w-3xl text-4xl leading-[1.02] tracking-tight text-fg sm:text-6xl"
          style={{ "--d": "120ms" } as React.CSSProperties}
        >
          The Galaxy Map
        </h1>
        <p
          className="al-rise mt-5 max-w-2xl text-lg leading-relaxed text-[color:rgb(var(--al-ink)/0.78)]"
          style={{ "--d": "320ms" } as React.CSSProperties}
        >
          The worlds, powers, and factions of Arbitrary Life, charted across the
          galaxy. Click an arm to light it up, then click again inside it to
          drill into a single province.
        </p>

        <div
          className="al-rise mt-12"
          style={{ "--d": "460ms" } as React.CSSProperties}
        >
          <GalaxyMap />
        </div>
      </section>
    </div>
  );
}
