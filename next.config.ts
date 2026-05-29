import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

// Project is served from https://theserbres.github.io/serbres/ on GitHub Pages.
// A custom domain or user-pages repo (theserbres.github.io) would set this to "".
const repoBasePath = "/serbres";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: isProd ? repoBasePath : undefined,
  images: { unoptimized: true },
};

export default nextConfig;
