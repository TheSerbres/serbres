import type { Metadata } from "next";
import { canonGenie as cg, asset } from "@/lib/site";
import BrandHero from "@/components/BrandHero";

export const metadata: Metadata = {
  title: `${cg.name} | ${cg.tagline}`,
  description: cg.blurb,
};

export default function CanonGenie() {
  const actions: {
    label: string;
    href: string;
    external: boolean;
    icon?: "youtube" | "etsy";
  }[] = [];
  if (cg.etsy.shopUrl)
    actions.push({ label: "Shop on Etsy", href: cg.etsy.shopUrl, external: true });
  if (cg.youtube)
    actions.push({
      label: "Watch on YouTube",
      href: cg.youtube,
      external: true,
      icon: "youtube",
    });

  const listings = cg.etsy.listings.filter((l) => l.href || l.image);

  return (
    <>
      <BrandHero
        name={cg.name}
        tagline={cg.tagline}
        description={cg.description}
        actions={actions}
        logo={cg.logo}
      />

      {/* The channel's two modes */}
      <section className="border-t border-border bg-bg-elev/40">
        <div className="mx-auto max-w-5xl px-6 py-20">
          <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
            Two modes
          </h2>
          <ul className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2">
            {cg.modes.map((m) => (
              <li key={m.name} className="flex h-full flex-col gap-4 bg-bg p-7">
                <div className="flex items-center gap-4">
                  {m.icon && (
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white p-1.5 ring-1 ring-black/5">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={asset(m.icon)}
                        alt={`${m.name} mode`}
                        className="h-full w-full object-contain"
                      />
                    </div>
                  )}
                  <div>
                    <h3 className="text-xl font-semibold tracking-tight">{m.name}</h3>
                    <p className="mt-0.5 font-mono text-xs uppercase tracking-[0.15em] text-accent">
                      {m.label}
                    </p>
                  </div>
                </div>
                <p className="text-sm leading-relaxed text-muted">{m.desc}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Featured listings */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-5xl px-6 py-20">
          <div className="flex items-end justify-between gap-6">
            <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
              From the shop
            </h2>
            {cg.etsy.shopUrl && (
              <a
                href={cg.etsy.shopUrl}
                target="_blank"
                rel="noreferrer"
                className="text-sm font-medium text-fg underline-offset-4 transition-colors hover:text-accent hover:underline"
              >
                Shop all →
              </a>
            )}
          </div>

          {listings.length > 0 ? (
            <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {listings.map((l, i) => {
                const Tag = l.href ? "a" : "div";
                return (
                  <li key={i}>
                    <Tag
                      {...(l.href
                        ? { href: l.href, target: "_blank", rel: "noreferrer" }
                        : {})}
                      className={`group block overflow-hidden rounded-2xl border border-border bg-bg ${
                        l.href ? "transition-colors hover:border-accent" : ""
                      }`}
                    >
                      <div className="aspect-square w-full bg-bg-elev">
                        {l.image && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={l.image}
                            alt={l.title}
                            className="h-full w-full object-cover"
                          />
                        )}
                      </div>
                      <div className="flex items-center justify-between gap-3 p-4">
                        <p className="text-sm font-medium transition-colors group-hover:text-accent">
                          {l.title}
                        </p>
                        {l.price && (
                          <p className="shrink-0 font-mono text-xs text-muted">
                            {l.price}
                          </p>
                        )}
                      </div>
                    </Tag>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="mt-6 max-w-xl text-sm leading-relaxed text-muted">
              Featured listings are on the way. In the meantime, follow along as the
              shop fills up.
            </p>
          )}
        </div>
      </section>

      {/* Green Apologetics sub-brand */}
      <section className="border-t border-border bg-bg-elev/40">
        <div className="mx-auto max-w-5xl px-6 py-20">
          <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
            {cg.subBrand.name}
          </h2>
          <p className="mt-4 max-w-2xl text-2xl font-semibold leading-snug tracking-tight">
            {cg.subBrand.tagline}
          </p>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">
            {cg.subBrand.description}
          </p>

          <ul className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-3">
            {cg.subBrand.pillars.map((p) => (
              <li key={p.name} className="flex h-full flex-col gap-2 bg-bg p-6">
                <h3 className="font-semibold tracking-tight">{p.name}</h3>
                <p className="text-sm leading-relaxed text-muted">{p.desc}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
