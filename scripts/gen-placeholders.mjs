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
      <stop offset="0" stop-color="#f0fdfa"/>
      <stop offset="1" stop-color="#ccfbf1"/>
    </linearGradient>
  </defs>
  <rect width="400" height="400" fill="url(#g)"/>
  <rect x="120" y="110" width="160" height="160" rx="20" fill="#fff" stroke="#99f6e4" stroke-width="3"/>
  <text x="200" y="205" font-family="system-ui, sans-serif" font-size="56" font-weight="700" fill="#0f766e" text-anchor="middle" dominant-baseline="middle">${initials}</text>
  <text x="200" y="320" font-family="system-ui, sans-serif" font-size="20" font-weight="600" fill="#33484a" text-anchor="middle">${brand.replace(/&/g, '&amp;')}</text>
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
  <rect width="1200" height="630" fill="#f0fdfa"/>
  <text x="600" y="315" font-family="system-ui, sans-serif" font-size="48" font-weight="700" fill="#115e59" text-anchor="middle" dominant-baseline="middle">Bathroom Safety for Seniors</text>
</svg>
`
);

// Logo + default OG
const imagesDir = path.join(root, 'public', 'images');
ensureDir(imagesDir);
const markPaths = `
    <path d="M16 6l8 3.4v6.8c0 5.1-3.4 9.6-8 11.2-4.6-1.6-8-6.1-8-11.2V9.4L16 6z" fill="#ffffff"/>
    <path d="M16 11l6 4.7h-2v5.8h-8v-5.8H10L16 11z" fill="#0f766e"/>
    <path d="M14.6 21.5v-2.9a1.4 1.4 0 0 1 2.8 0v2.9z" fill="#ffffff"/>`;
fs.writeFileSync(
  path.join(imagesDir, 'logo.svg'),
  `<svg xmlns="http://www.w3.org/2000/svg" width="248" height="60" viewBox="0 0 248 60">
  <defs>
    <linearGradient id="ssh-logo-bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#14b8a6"/>
      <stop offset="1" stop-color="#0f766e"/>
    </linearGradient>
  </defs>
  <g transform="scale(1.875)">
    <rect width="32" height="32" rx="8" fill="url(#ssh-logo-bg)"/>${markPaths}
  </g>
  <text x="72" y="38" font-family="'Outfit', system-ui, sans-serif" font-size="23" font-weight="700" letter-spacing="-0.3">
    <tspan fill="#122a2c">Senior</tspan><tspan fill="#0d9488">Safer</tspan><tspan fill="#122a2c">Home</tspan>
  </text>
</svg>
`
);
fs.writeFileSync(
  path.join(imagesDir, 'og-default.svg'),
  `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="ssh-og-bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0c272d"/>
      <stop offset="1" stop-color="#115e59"/>
    </linearGradient>
    <linearGradient id="ssh-og-mark" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#14b8a6"/>
      <stop offset="1" stop-color="#0f766e"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#ssh-og-bg)"/>
  <g transform="translate(434 150) scale(3.5)">
    <rect width="32" height="32" rx="8" fill="url(#ssh-og-mark)"/>${markPaths}
  </g>
  <text x="600" y="375" font-family="'Outfit', system-ui, sans-serif" font-size="66" font-weight="800" text-anchor="middle">
    <tspan fill="#ffffff">Senior</tspan><tspan fill="#5eead4">Safer</tspan><tspan fill="#ffffff">Home</tspan>
  </text>
  <text x="600" y="430" font-family="system-ui, sans-serif" font-size="28" fill="#a7c6c4" text-anchor="middle">Helping aging adults stay safe, comfortable, and independent at home</text>
</svg>
`
);

console.log(`Generated ${count} product placeholders + guide/logo/OG images.`);
