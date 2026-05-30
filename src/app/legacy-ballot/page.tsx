import type { Metadata } from "next";
import { legacyBallot as lb } from "@/lib/site";
import BrandHero from "@/components/BrandHero";

export const metadata: Metadata = {
  title: `${lb.name} | ${lb.tagline}`,
  description: lb.blurb,
};

export default function LegacyBallot() {
  const actions: { label: string; href: string; external: boolean }[] = [];
  if (lb.href) actions.push({ label: "Open the app", href: lb.href, external: true });

  return (
    <>
      <BrandHero
        name={lb.name}
        tagline={lb.tagline}
        description={lb.description}
        actions={actions}
        logo={lb.logo}
      />

      <section className="border-t border-border bg-bg-elev/40">
        <div className="mx-auto max-w-5xl px-6 py-20">
          <div className="flex items-center gap-4">
            <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
              How it works
            </h2>
            {lb.status && (
              <span className="rounded-full border border-accent/40 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.15em] text-accent">
                {lb.status}
              </span>
            )}
          </div>

          <ol className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-3">
            {lb.features.map((f, i) => (
              <li key={f.title} className="flex h-full flex-col gap-3 bg-bg p-6">
                <span className="font-mono text-2xl font-bold text-accent/70">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-semibold tracking-tight">{f.title}</h3>
                <p className="text-sm leading-relaxed text-muted">{f.desc}</p>
              </li>
            ))}
          </ol>

          <div className="mt-12 rounded-2xl border border-border bg-bg p-7">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
              The idea
            </p>
            <p className="mt-3 max-w-2xl text-lg leading-relaxed text-muted">
              Rate the résumé, not your favorite. Legacy Ballot starts from what
              actually happened (the stats, the accomplishments, the receipts) and
              turns even the loudest narratives into numbers you can compare.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
