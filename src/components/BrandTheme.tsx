"use client";

import { usePathname } from "next/navigation";

const BRAND_SLUGS = ["canon-genie", "arbitrary-life", "legacy-ballot"];

// Wraps the whole page and tags it with the active brand so the accent palette
// (defined in globals.css) shifts per section. Display:contents keeps layout
// untouched while still letting the --accent custom property inherit down.
export default function BrandTheme({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "/";
  const seg = pathname.replace(/\/+$/, "").split("/")[1] ?? "";
  const brand = BRAND_SLUGS.includes(seg) ? seg : "serbres";

  return (
    <div data-brand={brand} className="contents">
      {children}
    </div>
  );
}
