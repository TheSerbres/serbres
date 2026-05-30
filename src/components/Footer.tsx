import Link from "next/link";
import { site, brands } from "@/lib/site";

type IconName = "email" | "github" | "youtube" | "twitter" | "linkedin";

function SocialIcon({ name }: { name: IconName }) {
  const cls = "h-5 w-5 shrink-0";
  switch (name) {
    case "linkedin":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={cls}>
          <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
        </svg>
      );
    case "youtube":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={cls}>
          <path d="M23.5 6.2a3.02 3.02 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.51A3.02 3.02 0 0 0 .5 6.2 31.4 31.4 0 0 0 0 12a31.4 31.4 0 0 0 .5 5.8 3.02 3.02 0 0 0 2.12 2.14c1.88.51 9.38.51 9.38.51s7.5 0 9.38-.51a3.02 3.02 0 0 0 2.12-2.14A31.4 31.4 0 0 0 24 12a31.4 31.4 0 0 0-.5-5.8zM9.55 15.57V8.43L15.82 12l-6.27 3.57z" />
        </svg>
      );
    case "github":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={cls}>
          <path d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.5.99.11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.62-5.49 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.69.82.58A12 12 0 0 0 24 12.5C24 5.87 18.63.5 12 .5z" />
        </svg>
      );
    case "twitter":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={cls}>
          <path d="M18.9 1.5h3.68l-8.04 9.19L24 22.5h-7.41l-5.8-7.58-6.64 7.58H.46l8.6-9.83L0 1.5h7.59l5.24 6.93L18.9 1.5zm-1.29 18.8h2.04L6.49 3.6H4.3l13.31 16.7z" />
        </svg>
      );
    case "email":
    default:
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={cls}>
          <path d="M22 4H2a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h20a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1zm-1.4 2L12 11.6 3.4 6h17.2zM3 8.27l8.46 5.5a1 1 0 0 0 1.08 0L21 8.27V18H3V8.27z" />
        </svg>
      );
  }
}

export default function Footer() {
  const { email, github, twitter, linkedin, youtube } = site.links;
  const social = [
    email && { label: "Email", href: `mailto:${email}`, icon: "email" as IconName },
    github && { label: "GitHub", href: github, icon: "github" as IconName },
    youtube && { label: "YouTube", href: youtube, icon: "youtube" as IconName },
    twitter && { label: "Twitter", href: twitter, icon: "twitter" as IconName },
    linkedin && { label: "LinkedIn", href: linkedin, icon: "linkedin" as IconName },
  ].filter(Boolean) as { label: string; href: string; icon: IconName }[];

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
              className="inline-flex items-center gap-2.5 text-sm text-muted transition-colors hover:text-accent"
            >
              <SocialIcon name={link.icon} />
              <span>{link.label}</span>
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
