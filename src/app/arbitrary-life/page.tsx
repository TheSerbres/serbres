import type { Metadata } from "next";
import { arbitraryLife as al } from "@/lib/site";
import BrandHero from "@/components/BrandHero";

export const metadata: Metadata = {
  title: `${al.name} — ${al.tagline}`,
  description: al.blurb,
};

export default function ArbitraryLife() {
  const actions: { label: string; href: string; external: boolean }[] = [];
  if (al.youtube)
    actions.push({ label: "Watch on YouTube", href: al.youtube, external: true });

  const books = al.books.filter((b) => !b.title.startsWith("TODO"));

  return (
    <>
      <BrandHero
        name={al.name}
        tagline={al.tagline}
        description={al.description}
        actions={actions}
      />

      <section className="border-t border-border bg-bg-elev/40">
        <div className="mx-auto max-w-5xl px-6 py-20">
          <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
            The books
          </h2>

          {books.length > 0 ? (
            <ul className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2">
              {books.map((b, i) => {
                const Tag = b.href ? "a" : "div";
                return (
                  <li key={i} className="contents">
                    <Tag
                      {...(b.href
                        ? { href: b.href, target: "_blank", rel: "noreferrer" }
                        : {})}
                      className={`group flex h-full flex-col gap-2 bg-bg p-6 ${
                        b.href ? "transition-colors hover:bg-bg-elev" : ""
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold tracking-tight transition-colors group-hover:text-accent">
                          {b.title}
                        </h3>
                        {b.status && (
                          <span className="rounded-full border border-border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.15em] text-muted">
                            {b.status}
                          </span>
                        )}
                      </div>
                      <p className="text-sm italic leading-relaxed text-muted">
                        {b.desc}
                      </p>
                    </Tag>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="mt-6 max-w-xl text-sm leading-relaxed text-muted">
              Titles are in the works. The universe has been years in the
              worldbuilding — the first books are on their way.
            </p>
          )}

          <div className="mt-12 rounded-2xl border border-border bg-bg p-7">
            <h3 className="font-semibold tracking-tight">Beyond the page</h3>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
              The same world is built to scale into YouTube graphic novels and other
              visual formats as the story grows.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
