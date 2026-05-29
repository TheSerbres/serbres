import Link from "next/link";
import { asset } from "@/lib/site";

type Action = { label: string; href: string; external?: boolean };

export default function BrandHero({
  name,
  tagline,
  description,
  actions = [],
  logo,
}: {
  name: string;
  tagline: string;
  description: readonly string[];
  actions?: Action[];
  logo?: string;
}) {
  return (
    <section className="mx-auto max-w-5xl px-6 pt-20 pb-14 sm:pt-28">
      {logo && (
        <div className="mb-7 flex h-36 w-36 items-center justify-center overflow-hidden rounded-2xl bg-white p-3 ring-1 ring-black/5 sm:h-40 sm:w-40">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={asset(logo)}
            alt={`${name} logo`}
            className="max-h-full max-w-full object-contain"
          />
        </div>
      )}
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
        {tagline}
      </p>
      <h1
        className={
          logo
            ? "sr-only"
            : "mt-4 text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl"
        }
      >
        {name}
      </h1>
      <div className="mt-8 max-w-2xl space-y-5 text-lg leading-relaxed text-muted">
        {description.map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>

      {actions.length > 0 && (
        <div className="mt-9 flex flex-wrap items-center gap-4">
          {actions.map((a, i) =>
            a.external ? (
              <a
                key={a.label}
                href={a.href}
                target="_blank"
                rel="noreferrer"
                className={
                  i === 0
                    ? "inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-fg transition-all hover:bg-accent-hover hover:shadow-[0_8px_30px_-6px_var(--glow)]"
                    : "text-sm font-medium text-fg underline-offset-4 transition-colors hover:text-accent hover:underline"
                }
              >
                {a.label}
                {i === 0 && <span aria-hidden="true">→</span>}
              </a>
            ) : (
              <Link
                key={a.label}
                href={a.href}
                className={
                  i === 0
                    ? "inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-fg transition-all hover:bg-accent-hover hover:shadow-[0_8px_30px_-6px_var(--glow)]"
                    : "text-sm font-medium text-fg underline-offset-4 transition-colors hover:text-accent hover:underline"
                }
              >
                {a.label}
                {i === 0 && <span aria-hidden="true">→</span>}
              </Link>
            )
          )}
        </div>
      )}
    </section>
  );
}
