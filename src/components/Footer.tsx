import Link from "next/link";
import { site, brands } from "@/lib/site";

export default function Footer() {
  const { email, github, twitter, linkedin, youtube } = site.links;
  const social = [
    email && { label: "Email", href: `mailto:${email}` },
    github && { label: "GitHub", href: github },
    youtube && { label: "YouTube", href: youtube },
    twitter && { label: "Twitter", href: twitter },
    linkedin && { label: "LinkedIn", href: linkedin },
  ].filter(Boolean) as { label: string; href: string }[];

  return (
    <footer className="border-t border-border">
      <div className="mx-auto grid max-w-5xl gap-8 px-6 py-12 sm:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <p className="text-sm font-semibold tracking-wide">{site.brand}</p>
          <p className="mt-2 max-w-xs text-sm text-muted">{site.intro}</p>
        </div>

        <nav className="flex flex-col gap-2.5">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">Brands</p>
          <Link
            href="/about/"
            className="text-sm text-muted underline-offset-4 transition-colors hover:text-accent hover:underline"
          >
            About
          </Link>
          {brands.map((b) => (
            <Link
              key={b.slug}
              href={`/${b.slug}/`}
              className="text-sm text-muted underline-offset-4 transition-colors hover:text-accent hover:underline"
            >
              {b.name}
            </Link>
          ))}
        </nav>

        <nav className="flex flex-col gap-2.5">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">Connect</p>
          {social.map((link) => (
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

      <div className="border-t border-border">
        <div className="mx-auto max-w-5xl px-6 py-5">
          <p className="text-sm text-muted">
            © {new Date().getFullYear()} {site.name}
          </p>
        </div>
      </div>
    </footer>
  );
}
