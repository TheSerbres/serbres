import type { Metadata } from "next";
import Link from "next/link";
import { site, story, cv } from "@/lib/site";

export const metadata: Metadata = {
  title: `About — ${site.name}`,
  description: story.lead,
};

export default function About() {
  return (
    <>
      <Story />
      <CV />
    </>
  );
}

function Story() {
  return (
    <section className="mx-auto max-w-5xl px-6 pt-20 pb-16 sm:pt-28">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">About</p>
      <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl">
        {story.lead}
      </h1>
      <div className="mt-10 max-w-2xl space-y-6 text-lg leading-relaxed text-muted">
        {story.paragraphs.map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>
    </section>
  );
}

function CV() {
  // Only show real timeline rows — placeholder TODO rows stay out of the live site.
  const timeline = cv.timeline.filter((t) => !t.role.startsWith("TODO"));
  return (
    <section className="border-t border-border bg-bg-elev/40">
      <div className="mx-auto max-w-5xl px-6 py-20">
        {/* What I do */}
        <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
          What I do
        </h2>
        <ul className="mt-6 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-3">
          {cv.focus.map((f) => (
            <li key={f.title} className="flex h-full flex-col gap-2 bg-bg p-6">
              <h3 className="font-semibold tracking-tight">{f.title}</h3>
              <p className="text-sm leading-relaxed text-muted">{f.desc}</p>
            </li>
          ))}
        </ul>

        {/* Experience timeline */}
        <div className="mt-16 flex items-center justify-between gap-4">
          <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
            Experience
          </h2>
          {site.links.linkedin && (
            <a
              href={site.links.linkedin}
              target="_blank"
              rel="noreferrer"
              aria-label="View full profile on LinkedIn"
              className="inline-flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-accent"
            >
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
                className="h-5 w-5"
              >
                <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
              </svg>
              <span className="hidden sm:inline">View on LinkedIn</span>
            </a>
          )}
        </div>
        <ol className="mt-6 border-l border-border">
          {timeline.map((item, i) => (
            <li key={i} className="relative pl-8 pb-9 last:pb-0">
              <span
                aria-hidden="true"
                className="absolute left-0 top-1.5 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-accent"
              />
              <p className="font-mono text-xs uppercase tracking-[0.15em] text-muted">
                {item.period}
              </p>
              <h3 className="mt-1.5 font-semibold tracking-tight">
                {item.role}
                {item.org && (
                  <span className="font-normal text-muted"> · {item.org}</span>
                )}
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-muted">{item.desc}</p>
            </li>
          ))}
        </ol>

        {/* Skills */}
        <h2 className="mt-16 font-mono text-xs uppercase tracking-[0.2em] text-accent">
          Skills & tools
        </h2>
        <ul className="mt-6 flex flex-wrap gap-2.5">
          {cv.skills.map((skill) => (
            <li
              key={skill}
              className="rounded-full border border-border bg-bg px-4 py-1.5 text-sm text-muted"
            >
              {skill}
            </li>
          ))}
        </ul>

        <div className="mt-14">
          <a
            href={`mailto:${site.links.email}`}
            className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-fg transition-all hover:bg-accent-hover hover:shadow-[0_8px_30px_-6px_var(--glow)]"
          >
            Get in touch
            <span aria-hidden="true">→</span>
          </a>
          <Link
            href="/"
            className="ml-5 text-sm font-medium text-muted underline-offset-4 transition-colors hover:text-accent hover:underline"
          >
            Back to home
          </Link>
        </div>
      </div>
    </section>
  );
}
