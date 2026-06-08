import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Chakra_Petch,
  IBM_Plex_Mono,
  Hanken_Grotesk,
} from "next/font/google";
import "./globals.css";
import { site } from "@/lib/site";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BrandTheme from "@/components/BrandTheme";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Arbitrary Life facet type system. Declared globally as CSS variables but only
// applied within [data-brand="arbitrary-life"] (see globals.css), so the rest
// of the site keeps Geist. Chakra Petch = angular HUD display; IBM Plex Mono =
// telemetry/coordinates; Hanken Grotesk = warm humanist reading face.
const chakraPetch = Chakra_Petch({
  variable: "--font-chakra",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const hankenGrotesk = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: `${site.name} | ${site.brand}`,
  description: site.tagline,
};

// Runs before first paint to apply the saved theme (defaults to dark) with no flash.
const themeScript = `
(function () {
  try {
    var stored = localStorage.getItem('theme');
    var theme = stored
      ? stored
      : (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    document.documentElement.setAttribute('data-theme', theme);
  } catch (e) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className={`${geistSans.variable} ${geistMono.variable} ${chakraPetch.variable} ${plexMono.variable} ${hankenGrotesk.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full flex flex-col">
        <BrandTheme>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </BrandTheme>
      </body>
    </html>
  );
}
