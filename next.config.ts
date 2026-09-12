import type { NextConfig } from "next";

/**
 * Two build modes:
 *  - Default (dev / sandbox preview): standalone server on port 3000.
 *  - EXPORT_MODE=1: fully static export into `out/` for GitHub Pages,
 *    served under https://iqrahoque.github.io/PetCare/ → basePath /PetCare.
 *    distDir is separated so an export build never clobbers the dev server.
 */
const isExport = process.env.EXPORT_MODE === "1";

const nextConfig: NextConfig = {
  ...(isExport
    ? { output: "export" as const, basePath: "/PetCare", distDir: ".next-export" }
    : { output: "standalone" as const }),
  images: { unoptimized: true },
  typescript: { ignoreBuildErrors: true },
  reactStrictMode: false,
  trailingSlash: true,
};

export default nextConfig;
