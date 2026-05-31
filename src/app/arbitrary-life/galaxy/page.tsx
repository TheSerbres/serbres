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
    <section className="mx-auto max-w-6xl px-6 pt-20 pb-24 sm:pt-28">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
        {al.name}
      </p>
      <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl">
        The Galaxy Map
      </h1>
      <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
        The worlds, powers, and factions of Arbitrary Life, charted across the
        galaxy. Click an arm to light it up, then click again inside it to
        highlight a single province.
      </p>

      <div className="mt-12">
        <GalaxyMap />
      </div>

      <div className="mt-14">
        <Link
          href="/arbitrary-life"
          className="text-sm font-medium text-muted underline-offset-4 transition-colors hover:text-accent hover:underline"
        >
          Back to Arbitrary Life
        </Link>
      </div>
    </section>
  );
}
