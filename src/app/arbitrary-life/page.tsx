import type { Metadata } from "next";
import Link from "next/link";
import { arbitraryLife as al, asset } from "@/lib/site";

export const metadata: Metadata = {
  title: `${al.name} | ${al.tagline}`,
  description: al.blurb,
};

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];

// "Arbitrary Life III: Edge of Existence" -> "Edge of Existence"
function subtitleOf(title: string): string {
  const i = title.indexOf(":");
  return i >= 0 ? title.slice(i + 1).trim() : title;
}

export default function ArbitraryLife() {
  const books = al.books.filter((b) => !b.title.startsWith("TODO"));

  return (
    <div className="relative overflow-hidden">
      <div className="al-atmos" aria-hidden="true" />

      {/* ---- HERO ----------------------------------------------------------- */}
      <section className="mx-auto grid max-w-6xl gap-14 px-6 pt-20 pb-16 sm:pt-28 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-8">
        <div>
          <div
            className="al-rise flex flex-wrap items-center gap-x-4 gap-y-2"
            style={{ "--d": "0ms" } as React.CSSProperties}
          >
            <span className="al-tele al-rule text-accent">
              SERBRES &middot; Facet 02
            </span>
            <span className="al-tele text-muted">
              Gal.Lon 214.7&deg; / Lat &minus;06.2&deg;
            </span>
          </div>

          <h1
            className="al-display al-wipe mt-6 text-5xl leading-[0.95] tracking-tight text-fg sm:text-7xl"
            style={{ "--d": "120ms" } as React.CSSProperties}
          >
            Arbitrary
            <br />
            <span className="text-accent">Life</span>
          </h1>

          <p
            className="al-rise mt-6 max-w-xl font-mono text-sm uppercase tracking-[0.18em] text-muted"
            style={{ "--d": "320ms" } as React.CSSProperties}
          >
            {al.tagline}
          </p>

          <div
            className="al-rise mt-7 max-w-xl space-y-5 text-lg leading-relaxed text-[color:rgb(var(--al-ink)/0.82)]"
            style={{ "--d": "420ms" } as React.CSSProperties}
          >
            {al.description.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>

          <div
            className="al-rise mt-9 flex flex-wrap items-center gap-5"
            style={{ "--d": "560ms" } as React.CSSProperties}
          >
            <Link
              href="/arbitrary-life/galaxy"
              className="group inline-flex items-center gap-2.5 rounded-sm bg-accent px-6 py-3 text-sm font-semibold tracking-wide text-accent-fg transition-all hover:bg-accent-hover hover:shadow-[0_8px_36px_-6px_var(--glow)]"
            >
              <span className="al-tele !tracking-[0.18em] !text-[0.7rem]">
                Open Star Chart
              </span>
              <span
                aria-hidden="true"
                className="transition-transform group-hover:translate-x-0.5"
              >
                &rarr;
              </span>
            </Link>
            {al.youtube && (
              <a
                href={al.youtube}
                target="_blank"
                rel="noreferrer"
                className="text-sm font-medium text-muted underline-offset-4 transition-colors hover:text-accent hover:underline"
              >
                Watch on YouTube
              </a>
            )}
          </div>
        </div>

        {/* Astrolabe: rotating coordinate rings around the brand emblem. */}
        <div
          className="al-rise relative mx-auto aspect-square w-full max-w-sm"
          style={{ "--d": "260ms" } as React.CSSProperties}
          aria-hidden="true"
        >
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_50%_50%,rgb(var(--hud)/0.16),transparent_62%)]" />
          {/* outer ticked ring */}
          <div
            className="al-ring absolute inset-[4%] rounded-full border border-[color:rgb(var(--hud)/0.28)]"
            style={{
              backgroundImage:
                "repeating-conic-gradient(from 0deg, rgb(var(--hud)/0.5) 0deg 0.4deg, transparent 0.4deg 7.5deg)",
              WebkitMaskImage:
                "radial-gradient(circle, transparent 0 47%, #000 47% 50%, transparent 50%)",
              maskImage:
                "radial-gradient(circle, transparent 0 47%, #000 47% 50%, transparent 50%)",
            }}
          />
          {/* mid dashed ring + travelling marker */}
          <div className="al-ring-rev absolute inset-[18%] rounded-full border border-dashed border-[color:rgb(var(--hud)/0.35)]">
            <span className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-accent shadow-[0_0_10px_2px_var(--accent)]" />
          </div>
          {/* inner ring */}
          <div className="absolute inset-[33%] rounded-full border border-[color:rgb(var(--hud)/0.2)]" />
          {/* crosshair */}
          <div className="absolute left-1/2 top-[6%] h-[88%] w-px -translate-x-1/2 bg-[linear-gradient(180deg,transparent,rgb(var(--hud)/0.25),transparent)]" />
          <div className="absolute top-1/2 left-[6%] h-px w-[88%] -translate-y-1/2 bg-[linear-gradient(90deg,transparent,rgb(var(--hud)/0.25),transparent)]" />
          {/* emblem */}
          <div className="absolute inset-[37%] flex items-center justify-center rounded-full bg-bg/70 ring-1 ring-[color:rgb(var(--hud)/0.3)] backdrop-blur-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={asset(al.logo)}
              alt=""
              className="logo-themed h-3/5 w-3/5 object-contain opacity-90"
            />
          </div>
        </div>
      </section>

      {/* ---- STAR CHART LAUNCH BANNER -------------------------------------- */}
      <section className="mx-auto max-w-6xl px-6 pb-4">
        <Link
          href="/arbitrary-life/galaxy"
          className="al-frame group relative block overflow-hidden border border-[color:rgb(var(--hud)/0.22)] bg-[#04070f] p-8 transition-colors hover:border-[color:rgb(var(--hud)/0.5)] sm:p-10"
        >
          <span className="al-frame-corners" aria-hidden="true" />
          {/* faint galaxy wash inside the banner */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full opacity-70 blur-2xl"
            style={{
              background:
                "radial-gradient(circle, rgb(var(--core)/0.35), transparent 60%)",
            }}
          />
          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="al-tele text-accent">Interactive · Stellar Cartography</p>
              <h2 className="al-display mt-3 text-3xl tracking-tight text-[#eaf1ff] sm:text-4xl">
                Open the Star Chart
              </h2>
              <p className="mt-3 max-w-xl leading-relaxed text-white/65">
                Chart the worlds, powers, and factions of the galaxy. Click an
                arm to light it up, then drill inward &mdash; arm to province to
                district.
              </p>
            </div>
            <span className="inline-flex shrink-0 items-center gap-2.5 self-start rounded-sm border border-[color:rgb(var(--hud)/0.4)] px-5 py-3 text-accent transition-colors group-hover:bg-accent group-hover:text-accent-fg sm:self-auto">
              <span className="al-tele !text-[0.7rem]">Launch</span>
              <span
                aria-hidden="true"
                className="transition-transform group-hover:translate-x-0.5"
              >
                &rarr;
              </span>
            </span>
          </div>
        </Link>
      </section>

      {/* ---- THE ARCHIVE (books) ------------------------------------------- */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="al-tele al-rule text-accent">The Archive</h2>
          <span className="al-tele text-muted">
            {books.length.toString().padStart(2, "0")} Volumes
          </span>
        </div>

        {books.length > 0 ? (
          <ul className="mt-8 grid gap-px overflow-hidden border border-[color:rgb(var(--hud)/0.18)] bg-[color:rgb(var(--hud)/0.18)] sm:grid-cols-2 lg:grid-cols-3">
            {books.map((b, i) => {
              const Tag = b.href ? "a" : "div";
              return (
                <li key={i} className="contents">
                  <Tag
                    {...(b.href
                      ? { href: b.href, target: "_blank", rel: "noreferrer" }
                      : {})}
                    className={`group relative flex h-full flex-col gap-4 bg-bg p-6 ${
                      b.href ? "transition-colors hover:bg-bg-elev" : ""
                    }`}
                  >
                    {/* accent edge that lights on hover */}
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-0 top-0 h-px scale-x-0 bg-accent transition-transform duration-300 group-hover:scale-x-100"
                    />
                    <div className="flex items-center justify-between">
                      <span className="al-display text-2xl text-[color:rgb(var(--hud)/0.4)] transition-colors group-hover:text-accent">
                        {ROMAN[i] ?? i + 1}
                      </span>
                      {b.status && (
                        <span className="al-tele rounded-sm border border-[color:rgb(var(--hud)/0.3)] px-2 py-0.5 !text-[0.6rem] text-muted">
                          {b.status}
                        </span>
                      )}
                    </div>
                    <div className="flex items-start gap-4">
                      {b.cover && (
                        <div className="w-16 shrink-0 overflow-hidden rounded-[2px] ring-1 ring-[color:rgb(var(--hud)/0.25)]">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={asset(b.cover)}
                            alt={`${b.title} cover`}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex flex-col gap-1.5">
                        <h3 className="al-display text-lg leading-tight tracking-tight text-fg transition-colors group-hover:text-accent">
                          {subtitleOf(b.title)}
                        </h3>
                        <p className="text-sm italic leading-relaxed text-[color:rgb(var(--al-ink)/0.6)]">
                          {b.desc}
                        </p>
                      </div>
                    </div>
                  </Tag>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="mt-6 max-w-xl leading-relaxed text-[color:rgb(var(--al-ink)/0.7)]">
            Titles are in the works. The universe has been years in the
            worldbuilding; the first books are on their way.
          </p>
        )}

        <p className="mt-8 max-w-2xl text-sm leading-relaxed text-muted">
          The same world is built to scale into YouTube graphic novels and other
          visual formats as the story grows.
        </p>
      </section>
    </div>
  );
}
