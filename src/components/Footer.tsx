import Link from "next/link";
import { site, brands, canonGenie } from "@/lib/site";
import SocialMenu, { type Account } from "@/components/SocialMenu";
import SocialIcon, { type IconName } from "@/components/SocialIcon";

export default function Footer() {
  const { email, github, twitter, linkedin, youtube } = site.links;
  const etsy = canonGenie.etsy.shopUrl;

  // Each platform lists the account(s) behind it, so hovering reveals which
  // brand owns the link (and whether there's more than one).
  const socials = (
    [
      {
        label: "Email",
        icon: "email" as IconName,
        accounts: [
          email && {
            name: "Sammie L. Robinson III",
            detail: email,
            href: `mailto:${email}`,
          },
        ],
      },
      {
        label: "GitHub",
        icon: "github" as IconName,
        accounts: [github && { name: site.brand, detail: "@TheSerbres", href: github }],
      },
      {
        label: "YouTube",
        icon: "youtube" as IconName,
        accounts: [
          youtube && { name: site.brand, detail: "@serbres", href: youtube },
          canonGenie.youtube && {
            name: canonGenie.name,
            detail: "@TheCanonGenie",
            href: canonGenie.youtube,
          },
        ],
      },
      {
        label: "Etsy",
        icon: "etsy" as IconName,
        accounts: [
          etsy && {
            name: canonGenie.name,
            detail: "thecanongenie.etsy.com",
            href: etsy,
          },
        ],
      },
      {
        label: "Twitter",
        icon: "twitter" as IconName,
        accounts: [twitter && { name: site.brand, detail: "Twitter / X", href: twitter }],
      },
      {
        label: "LinkedIn",
        icon: "linkedin" as IconName,
        accounts: [
          linkedin && {
            name: site.name,
            detail: "@sammie-robinson",
            href: linkedin,
          },
        ],
      },
    ] as { label: string; icon: IconName; accounts: (Account | "" | undefined)[] }[]
  )
    .map((s) => ({ ...s, accounts: s.accounts.filter(Boolean) as Account[] }))
    .filter((s) => s.accounts.length > 0);

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
          {socials.map((s) => (
            <SocialMenu
              key={s.label}
              label={s.label}
              icon={<SocialIcon name={s.icon} />}
              accounts={s.accounts}
            />
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
