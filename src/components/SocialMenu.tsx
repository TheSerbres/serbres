"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

export type Account = { name: string; detail: string; href: string };

function linkProps(href: string) {
  return href.startsWith("http")
    ? { target: "_blank" as const, rel: "noreferrer" }
    : {};
}

export default function SocialMenu({
  label,
  icon,
  accounts,
}: {
  label: string;
  icon: ReactNode;
  accounts: Account[];
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const multi = accounts.length > 1;
  const primary = accounts[0];

  const cancelClose = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };
  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDown);
    };
  }, [open]);

  const triggerClass =
    "inline-flex items-center gap-2.5 text-sm text-muted transition-colors hover:text-accent";

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => {
        cancelClose();
        setOpen(true);
      }}
      onMouseLeave={scheduleClose}
    >
      {multi ? (
        <button
          type="button"
          aria-haspopup="menu"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          className={triggerClass}
        >
          {icon}
          <span>{label}</span>
          <span
            aria-hidden="true"
            className={`text-[0.6rem] transition-transform ${
              open ? "rotate-180" : ""
            }`}
          >
            ▼
          </span>
        </button>
      ) : (
        <a
          href={primary.href}
          {...linkProps(primary.href)}
          onFocus={() => setOpen(true)}
          onBlur={scheduleClose}
          className={triggerClass}
        >
          {icon}
          <span>{label}</span>
        </a>
      )}

      {open && (
        <div
          role={multi ? "menu" : undefined}
          className="absolute left-full top-1/2 z-50 ml-3 w-56 -translate-y-1/2 overflow-hidden rounded-xl border border-border bg-bg shadow-xl shadow-black/30 sm:left-auto sm:right-full sm:ml-0 sm:mr-3"
        >
          {accounts.map((a) => (
            <a
              key={a.href}
              href={a.href}
              {...linkProps(a.href)}
              role={multi ? "menuitem" : undefined}
              className="block px-4 py-2.5 transition-colors hover:bg-bg-elev"
            >
              <span className="block text-sm font-medium text-fg">{a.name}</span>
              <span className="mt-0.5 block break-all text-xs text-muted">
                {a.detail}
              </span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
