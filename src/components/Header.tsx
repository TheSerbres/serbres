import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import BrandsMenu from "@/components/BrandsMenu";
import { site, asset } from "@/lib/site";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2.5" aria-label={site.brand}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={asset("/serbres-logo.svg")}
            alt={`${site.brand} logo`}
            className="logo-themed h-9 w-9"
            width={36}
            height={36}
          />
          <span className="text-sm font-semibold tracking-wide">{site.brand}</span>
        </Link>

        <div className="flex items-center gap-5 sm:gap-7">
          <nav className="flex items-center gap-5 text-sm text-muted sm:gap-6">
            <Link
              href="/about/"
              className="underline-offset-4 transition-colors hover:text-accent hover:underline"
            >
              About
            </Link>
            <BrandsMenu />
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
