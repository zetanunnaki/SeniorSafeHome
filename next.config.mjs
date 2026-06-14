/** @type {import('next').NextConfig} */

// basePath/assetPrefix are driven by env so the same build works for a custom
// apex domain (empty) or a GitHub Pages repo subpath (e.g. "/SeniorSafeHome").
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

const nextConfig = {
  // Static export for production (GitHub Pages). Skipped in `next dev` because
  // Next 14's dev server mis-handles dynamic routes under `output: 'export'`.
  // `next build` still produces a full static export to ./out.
  output: process.env.NODE_ENV === 'production' ? 'export' : undefined,
  basePath: basePath || undefined,
  assetPrefix: basePath || undefined,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  pageExtensions: ['ts', 'tsx', 'js', 'jsx'],
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;
