import Link from "next/link";
import { site, brands, asset } from "@/lib/site";
import SocialIcon from "@/components/SocialIcon";

export default function Home() {
  return (
    <>
      <Hero />
      <Brands />
    </>
  );
}

function Hero() {
  return (
    <section id="top" className="mx-auto max-w-5xl px-6 pt-20 pb-16 sm:pt-28">
      <div className="grid items-center gap-12 md:grid-cols-[1.4fr_1fr]">
        <div>
          <p className="mb-4 flex flex-wrap gap-2 font-mono text-xs uppercase tracking-[0.2em] text-muted">
            {site.roles.map((role) => (
              <span
                key={role}
                className="after:ml-2 after:content-['/'] last:after:content-['']"
              >
                {role}
              </span>
            ))}
          </p>

          <h1 className="text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
            {site.greeting}
            <span className="text-accent">.</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
            {site.tagline}
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link
              href={site.cta.href}
              className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-fg transition-all hover:bg-accent-hover hover:shadow-[0_8px_30px_-6px_var(--glow)]"
            >
              {site.cta.label}
              <span aria-hidden="true">→</span>
            </Link>
            {site.links.youtube && (
              <a
                href={site.links.youtube}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-fg transition-colors hover:text-accent"
              >
                <SocialIcon name="youtube" />
                Watch on YouTube
              </a>
            )}
          </div>
        </div>

        <div className="relative mx-auto hidden md:block">
          <div
            className="absolute inset-0 -z-10 rounded-full blur-3xl"
            style={{ background: "var(--glow)" }}
            aria-hidden="true"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={asset("/serbres-logo.svg")}
            alt={`${site.brand} mark`}
            className="logo-themed mx-auto w-56 lg:w-64"
            width={256}
            height={256}
          />
        </div>
      </div>
    </section>
  );
}

function Brands() {
  return (
    <section id="brands" className="border-t border-border bg-bg-elev/40">
      <div className="mx-auto max-w-5xl px-6 py-20">
        <div className="flex items-end justify-between gap-6">
          <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
            The properties
          </h2>
          <p className="hidden max-w-sm text-sm text-muted sm:block">
            {site.intro}
          </p>
        </div>

        <ul className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-3">
          {brands.map((b) => {
            const logo: string = b.logo;
            return (
            <li key={b.slug} className="contents">
              <Link
                href={`/${b.slug}/`}
                data-brand={b.slug}
                className="group relative flex h-full flex-col gap-3 bg-bg p-7 transition-colors hover:bg-bg-elev"
              >
                <span
                  aria-hidden="true"
                  className="absolute right-6 top-6 text-accent opacity-0 transition-all -translate-x-1 group-hover:translate-x-0 group-hover:opacity-100"
                >
                  →
                </span>
                {logo ? (
                  <div className="flex h-16 w-fit items-center justify-center overflow-hidden rounded-xl bg-white px-3 py-2 ring-1 ring-black/5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={asset(logo)}
                      alt={`${b.name} logo`}
                      className="h-full w-auto object-contain"
                    />
                  </div>
                ) : (
                  <h3 className="text-lg font-semibold tracking-tight transition-colors group-hover:text-accent">
                    {b.name}
                  </h3>
                )}
                <p className="font-mono text-xs uppercase tracking-[0.15em] text-accent/80">
                  {b.tagline}
                </p>
                <p className="text-sm leading-relaxed text-muted">{b.blurb}</p>
              </Link>
            </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
