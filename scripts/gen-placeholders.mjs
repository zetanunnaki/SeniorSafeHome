// Generates simple, on-brand SVG placeholder images for products and guides,
// plus a logo and a default OG image. Safe to re-run; overwrites existing files.
// Real product images are supplied at build time by the Amazon enrichment step;
// these editorial fallbacks ensure the site always renders.

import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const productsPath = path.join(root, 'data', 'products.json');
const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function productSvg(name, brand) {
  const initials = brand
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
  const safeName = name.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400" role="img" aria-label="${safeName}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#eff6ff"/>
      <stop offset="1" stop-color="#dbeafe"/>
    </linearGradient>
  </defs>
  <rect width="400" height="400" fill="url(#g)"/>
  <rect x="120" y="110" width="160" height="160" rx="20" fill="#fff" stroke="#bfdbfe" stroke-width="3"/>
  <text x="200" y="205" font-family="system-ui, sans-serif" font-size="56" font-weight="700" fill="#2563eb" text-anchor="middle" dominant-baseline="middle">${initials}</text>
  <text x="200" y="320" font-family="system-ui, sans-serif" font-size="20" font-weight="600" fill="#334155" text-anchor="middle">${brand.replace(/&/g, '&amp;')}</text>
</svg>
`;
}

// Product placeholders
const productsDir = path.join(root, 'public', 'images', 'products');
ensureDir(productsDir);
let count = 0;
for (const p of products) {
  const file = path.basename(p.editorialImageFallback);
  fs.writeFileSync(path.join(productsDir, file), productSvg(p.name, p.brand));
  count++;
}

// Guide placeholder
const guidesDir = path.join(root, 'public', 'images', 'guides');
ensureDir(guidesDir);
fs.writeFileSync(
  path.join(guidesDir, 'prevent-bathroom-falls.svg'),
  `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#eff6ff"/>
  <text x="600" y="315" font-family="system-ui, sans-serif" font-size="48" font-weight="700" fill="#1e3a8a" text-anchor="middle" dominant-baseline="middle">Bathroom Safety for Seniors</text>
</svg>
`
);

// Logo + default OG
const imagesDir = path.join(root, 'public', 'images');
ensureDir(imagesDir);
fs.writeFileSync(
  path.join(imagesDir, 'logo.svg'),
  `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="60" viewBox="0 0 240 60">
  <rect width="60" height="60" rx="12" fill="#2563eb"/>
  <path d="M30 14l14 6v10c0 9-6 17-14 19-8-2-14-10-14-19V20l14-6z" fill="none" stroke="#fff" stroke-width="3" stroke-linejoin="round"/>
  <path d="M24 30l4 4 8-8" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
  <text x="74" y="38" font-family="system-ui, sans-serif" font-size="24" font-weight="700" fill="#0f172a">SeniorSafeHome</text>
</svg>
`
);
fs.writeFileSync(
  path.join(imagesDir, 'og-default.svg'),
  `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#2563eb"/>
  <text x="600" y="300" font-family="system-ui, sans-serif" font-size="64" font-weight="800" fill="#fff" text-anchor="middle">SeniorSafeHome</text>
  <text x="600" y="370" font-family="system-ui, sans-serif" font-size="30" fill="#dbeafe" text-anchor="middle">Helping aging adults stay safe at home</text>
</svg>
`
);

console.log(`Generated ${count} product placeholders + guide/logo/OG images.`);
