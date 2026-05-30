"use client";

import { useEffect, useRef, useState } from "react";
import { asset } from "@/lib/site";
import SocialIcon, { type IconName } from "@/components/SocialIcon";

type Role = {
  title: string;
  org?: string;
  type?: string;
  period: string;
  location?: string;
  desc: string;
  skills?: readonly string[];
};

type Education = {
  school: string;
  credential: string;
  period: string;
  grade?: string;
  detail?: string;
};

type Image = {
  src: string;
  alt: string;
  caption: string;
  /** Tailwind aspect-ratio class for the figure; defaults to 16/10. */
  aspect?: string;
  /** CSS object-position for the cropped image; defaults to center. */
  position?: string;
};

type ChapterLink = { href: string; label: string; icon: IconName };

type Logo = {
  src: string;
  alt: string;
  /** Tailwind max-width class for the logo; defaults to max-w-[16rem]. */
  maxW?: string;
};

type Chapter = {
  id: string;
  era: string;
  title: string;
  narrative: readonly string[];
  images?: readonly Image[];
  /** A plain, contained brand logo shown in the side column — no panel or caption. */
  logo?: Logo;
  banner?: Image;
  link?: ChapterLink;
  roles?: readonly Role[];
  education?: readonly Education[];
};

export default function Journey({
  chapters,
}: {
  chapters: readonly Chapter[];
}) {
  return (
    <ol className="relative mt-10 space-y-0 border-l border-border">
      {chapters.map((c) => (
        <ChapterBlock key={c.id} chapter={c} />
      ))}
    </ol>
  );
}

function ChapterBlock({ chapter }: { chapter: Chapter }) {
  const ref = useRef<HTMLLIElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShown(true);
            io.disconnect();
          }
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const hasDetails =
    (chapter.roles && chapter.roles.length > 0) ||
    (chapter.education && chapter.education.length > 0);

  const hasSide =
    (chapter.images && chapter.images.length > 0) || Boolean(chapter.logo);

  return (
    <li
      ref={ref}
      id={chapter.id}
      className={`relative scroll-mt-24 pl-8 pb-14 last:pb-0 transition-all duration-700 ease-out sm:pl-10 ${
        shown ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      }`}
    >
      <span
        aria-hidden="true"
        className="absolute left-0 top-1.5 h-3 w-3 -translate-x-1/2 rounded-full bg-accent ring-4 ring-bg"
      />
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
        {chapter.era}
      </p>
      <div className="mt-2 flex items-center justify-between gap-4">
        <h3 className="text-2xl font-bold tracking-tight sm:text-3xl">
          {chapter.title}
        </h3>
        {chapter.link && (
          <a
            href={chapter.link.href}
            target="_blank"
            rel="noreferrer"
            aria-label={chapter.link.label}
            className="inline-flex shrink-0 items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-accent"
          >
            <SocialIcon name={chapter.link.icon} />
            <span className="hidden sm:inline">{chapter.link.label}</span>
          </a>
        )}
      </div>

      <div
        className={
          hasSide
            ? "mt-5 grid gap-6 lg:grid-cols-[1fr_minmax(0,22rem)] lg:items-start"
            : "mt-5"
        }
      >
        <div className="max-w-2xl space-y-4 text-base leading-relaxed text-muted">
          {chapter.narrative.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
        {chapter.images && chapter.images.length > 0 ? (
          <ChapterGallery images={chapter.images} />
        ) : chapter.logo ? (
          <ChapterLogo logo={chapter.logo} />
        ) : null}
      </div>

      {hasDetails && <Details chapter={chapter} />}

      {chapter.banner && <ParallaxBand image={chapter.banner} />}
    </li>
  );
}

function ParallaxBand({ image }: { image: Image }) {
  const figRef = useRef<HTMLElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  // Scroll-driven parallax: drift the image opposite to scroll as the band
  // passes through the viewport.
  useEffect(() => {
    const fig = figRef.current;
    const img = imgRef.current;
    if (!fig || !img) return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = fig.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const raw =
        (rect.top + rect.height / 2 - vh / 2) / (vh / 2 + rect.height / 2);
      const progress = Math.max(-1, Math.min(1, raw));
      const shift = progress * 7; // vertical drift, % of image height
      // Slow zoom: scales up as the band travels up through the viewport.
      const scale = 1.04 + ((1 - progress) / 2) * 0.06; // 1.04 → 1.10
      img.style.transform = `translate3d(-50%, calc(-50% + ${shift}%), 0) scale(${scale.toFixed(4)})`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <figure
      ref={figRef}
      className="relative mt-5 h-56 w-full overflow-hidden rounded-2xl border border-border bg-bg-elev sm:h-64 lg:h-72"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imgRef}
        src={asset(image.src)}
        alt={image.alt}
        className="absolute left-1/2 top-1/2 h-[124%] w-full object-cover"
        style={{ transform: "translate3d(-50%, -50%, 0)" }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg/60 via-bg/10 to-transparent"
      />
      {image.caption && (
        <figcaption className="absolute inset-x-0 bottom-0 px-4 pb-3 text-xs leading-relaxed text-fg/85">
          {image.caption}
        </figcaption>
      )}
    </figure>
  );
}

function ChapterLogo({ logo }: { logo: Logo }) {
  return (
    <div className="flex items-start justify-center lg:justify-end lg:pt-2">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={asset(logo.src)}
        alt={logo.alt}
        className={`h-auto w-full object-contain ${logo.maxW ?? "max-w-[16rem]"}`}
      />
    </div>
  );
}

function ChapterGallery({ images }: { images: readonly Image[] }) {
  if (images.length === 1) return <ChapterImage image={images[0]} />;
  return <Carousel images={images} />;
}

function ChapterImage({ image }: { image: Image }) {
  const [failed, setFailed] = useState(!image.src);
  const imgRef = useRef<HTMLImageElement>(null);

  // If the image already errored before React hydrated and attached onError,
  // detect it here (complete with zero natural width = load failed).
  useEffect(() => {
    const el = imgRef.current;
    if (el && el.complete && el.naturalWidth === 0) {
      setFailed(true);
    }
  }, []);

  return (
    <figure className="overflow-hidden rounded-2xl border border-border bg-bg-elev/60">
      <div className={`relative w-full ${image.aspect ?? "aspect-[16/10]"}`}>
        {failed ? (
          <div className="flex h-full w-full items-center justify-center p-6 text-center">
            <span className="text-xs leading-relaxed text-muted">
              {image.caption}
            </span>
          </div>
        ) : (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            ref={imgRef}
            src={asset(image.src)}
            alt={image.alt}
            onError={() => setFailed(true)}
            style={image.position ? { objectPosition: image.position } : undefined}
            className="h-full w-full object-cover"
          />
        )}
      </div>
      {!failed && (
        <figcaption className="border-t border-border px-4 py-2.5 text-xs leading-relaxed text-muted">
          {image.caption}
        </figcaption>
      )}
    </figure>
  );
}

function Carousel({ images }: { images: readonly Image[] }) {
  const [index, setIndex] = useState(0);
  const count = images.length;
  const go = (n: number) => setIndex((n + count) % count);
  const current = images[index];

  return (
    <figure className="overflow-hidden rounded-2xl border border-border bg-bg-elev/60">
      <div className="group relative aspect-[16/10] w-full">
        <div
          className="flex h-full w-full transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {images.map((img, i) => (
            <div key={i} className="h-full w-full shrink-0 grow-0 basis-full">
              <CarouselSlide image={img} />
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => go(index - 1)}
          aria-label="Previous photo"
          className="absolute left-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-bg/70 text-fg shadow-sm backdrop-blur transition-colors hover:bg-bg hover:text-accent"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="h-4 w-4"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => go(index + 1)}
          aria-label="Next photo"
          className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-bg/70 text-fg shadow-sm backdrop-blur transition-colors hover:bg-bg hover:text-accent"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="h-4 w-4"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>
      </div>

      <figcaption className="border-t border-border px-4 py-2.5 text-xs leading-relaxed text-muted">
        <p>{current.caption}</p>
        <div className="mt-2 flex items-center gap-1.5">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => go(i)}
              aria-label={`Go to photo ${i + 1}`}
              aria-current={i === index}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? "w-4 bg-accent" : "w-1.5 bg-border hover:bg-muted"
              }`}
            />
          ))}
        </div>
      </figcaption>
    </figure>
  );
}

function CarouselSlide({ image }: { image: Image }) {
  const [failed, setFailed] = useState(!image.src);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const el = imgRef.current;
    if (el && el.complete && el.naturalWidth === 0) {
      setFailed(true);
    }
  }, []);

  if (failed) {
    return (
      <div className="flex h-full w-full items-center justify-center p-6 text-center">
        <span className="text-xs leading-relaxed text-muted">
          {image.caption}
        </span>
      </div>
    );
  }

  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      ref={imgRef}
      src={asset(image.src)}
      alt={image.alt}
      onError={() => setFailed(true)}
      className="h-full w-full object-cover"
    />
  );
}

function Details({ chapter }: { chapter: Chapter }) {
  return (
    <details className="group mt-5 rounded-xl border border-border bg-bg-elev/30 open:bg-bg-elev/60">
      <summary className="flex cursor-pointer list-none items-center gap-2 px-4 py-3 text-sm font-medium text-fg transition-colors hover:text-accent [&::-webkit-details-marker]:hidden">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="h-4 w-4 text-accent transition-transform duration-300 group-open:rotate-180"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
        <span className="group-open:hidden">See the details</span>
        <span className="hidden group-open:inline">Hide the details</span>
      </summary>

      <div className="space-y-6 border-t border-border px-4 pb-5 pt-5">
        {chapter.roles && chapter.roles.length > 0 && (
          <div className="space-y-5">
            {chapter.roles.map((role, i) => (
              <RoleRow key={i} role={role} />
            ))}
          </div>
        )}

        {chapter.education && chapter.education.length > 0 && (
          <div className="space-y-4">
            <h4 className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-muted">
              Education
            </h4>
            {chapter.education.map((edu, i) => (
              <EduRow key={i} edu={edu} />
            ))}
          </div>
        )}
      </div>
    </details>
  );
}

function RoleRow({ role }: { role: Role }) {
  return (
    <div className="border-l-2 border-border pl-4">
      <p className="font-semibold tracking-tight">
        {role.title}
        {role.org && <span className="font-normal text-muted"> · {role.org}</span>}
      </p>
      <p className="mt-0.5 font-mono text-xs uppercase tracking-[0.15em] text-muted">
        {role.period}
        {role.type && <span> · {role.type}</span>}
        {role.location && <span> · {role.location}</span>}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-muted">{role.desc}</p>
      {role.skills && role.skills.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-2">
          {role.skills.map((skill) => (
            <li
              key={skill}
              className="rounded-full border border-border bg-bg px-3 py-1 text-xs text-muted"
            >
              {skill}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function EduRow({ edu }: { edu: Education }) {
  return (
    <div className="border-l-2 border-border pl-4">
      <p className="font-semibold tracking-tight">{edu.school}</p>
      <p className="mt-0.5 font-mono text-xs uppercase tracking-[0.15em] text-muted">
        {edu.period}
        {edu.grade && <span> · {edu.grade}</span>}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-muted">{edu.credential}</p>
      {edu.detail && (
        <p className="mt-1.5 text-sm leading-relaxed text-muted">{edu.detail}</p>
      )}
    </div>
  );
}
