import ThemeToggle from "@/components/ThemeToggle";
import { site, asset } from "@/lib/site";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <About />
      </main>
      <Footer />
    </>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <a href="#top" className="flex items-center gap-2.5" aria-label={site.brand}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={asset("/serbres-logo.svg")}
            alt={`${site.brand} logo`}
            className="logo-themed h-9 w-9"
            width={36}
            height={36}
          />
          <span className="text-sm font-semibold tracking-wide">
            {site.brand}
          </span>
        </a>
        <ThemeToggle />
      </div>
    </header>
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
            <a
              href={site.cta.href}
              className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-fg transition-all hover:bg-accent-hover hover:shadow-[0_8px_30px_-6px_var(--glow)]"
            >
              {site.cta.label}
              <span aria-hidden="true">→</span>
            </a>
            {site.links.github && (
              <a
                href={site.links.github}
                target="_blank"
                rel="noreferrer"
                className="text-sm font-medium text-fg underline-offset-4 transition-colors hover:text-accent hover:underline"
              >
                GitHub
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

function About() {
  return (
    <section id="about" className="border-t border-border bg-bg-elev/40">
      <div className="mx-auto max-w-5xl px-6 py-20">
        <h2 className="mb-8 font-mono text-xs uppercase tracking-[0.2em] text-accent">
          About
        </h2>
        <div className="grid gap-8 md:grid-cols-[1fr_1.6fr]">
          <p className="text-2xl font-semibold leading-snug tracking-tight">
            One creator, many properties, one mark.
          </p>
          <div className="space-y-5 text-lg leading-relaxed text-muted">
            {site.about.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </div>

        <ul className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-3">
          {site.properties.map((p) => {
            const Tag = p.href ? "a" : "div";
            return (
              <li key={p.name} className="contents">
                <Tag
                  {...(p.href
                    ? { href: p.href, target: "_blank", rel: "noreferrer" }
                    : {})}
                  className={`group flex h-full flex-col gap-2 bg-bg p-6 transition-colors ${
                    p.href ? "hover:bg-bg-elev" : ""
                  }`}
                >
                  <h3 className="font-semibold tracking-tight transition-colors group-hover:text-accent">
                    {p.name}
                    {p.href && (
                      <span
                        aria-hidden="true"
                        className="ml-1 inline-block opacity-0 transition-opacity group-hover:opacity-100"
                      >
                        ↗
                      </span>
                    )}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted">{p.desc}</p>
                </Tag>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

function Footer() {
  const { email, github, twitter, linkedin, youtube } = site.links;
  const links = [
    email && { label: "Email", href: `mailto:${email}` },
    github && { label: "GitHub", href: github },
    twitter && { label: "Twitter", href: twitter },
    linkedin && { label: "LinkedIn", href: linkedin },
    youtube && { label: "YouTube", href: youtube },
  ].filter(Boolean) as { label: string; href: string }[];

  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row">
        <p className="text-sm text-muted">
          © {new Date().getFullYear()} {site.name}
        </p>
        <nav className="flex flex-wrap gap-5">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={link.href.startsWith("http") ? "noreferrer" : undefined}
              className="text-sm text-muted underline-offset-4 transition-colors hover:text-accent hover:underline"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
