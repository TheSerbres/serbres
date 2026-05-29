import type { NextConfig } from "next";

// Served at the root of the custom domain (www.serbres.com), so no basePath.
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
