import fs from 'node:fs';
const f = 'data/products.json';
const p = JSON.parse(fs.readFileSync(f, 'utf8'));
const mk = (o) => ({
  id: o.id, name: o.name, brand: o.brand, category: 'toilet-safety-frames', subCategory: o.sub,
  amazonUrl: `https://www.amazon.com/s?k=${encodeURIComponent(o.q)}&tag=seniorsaferhome-20`,
  asin: '', editorialImageFallback: `/images/products/${o.id}.svg`,
  shortDescription: o.desc, badge: o.badge, price: o.price, priceCurrency: 'USD',
  rating: o.rating, ...(o.reviews ? { reviewCount: o.reviews } : {}),
  features: o.features, pros: o.pros || o.features.slice(0, 2), cons: o.cons || [], bestFor: o.bestFor || [],
  specs: o.specs, reviewSlug: null, lastManualReview: '2026-06-14',
});
const add = [
  mk({ id: 'lianjindun-toilet-safety-frame', name: 'Lianjindun Adjustable Toilet Safety Frame', brand: 'Lianjindun', sub: 'freestanding', q: 'Lianjindun toilet safety rails frame adjustable foldable aluminum 350 lb', badge: 'Best Overall', price: 44.99, rating: 4.6, reviews: 3795, desc: 'A freestanding aluminum frame that adjusts in height and width to fit any toilet, with soft foam grips, suction-cup and rubber feet, and a fold for travel.', features: ['Adjustable height 24–31" & width 20–25"', '350 lb capacity, corrosion-resistant aluminum', 'Soft foam grips', 'Suction cups + rubber feet, foldable'], pros: ['Fits virtually any toilet', 'No tools or wall damage', 'Folds for travel'], cons: ['Takes some floor space'], bestFor: ['renters', 'sit-to-stand help', 'travel'], specs: { height: '24–31"', width: '20–25"', capacity: '350 lb', material: 'Aluminum' } }),
  mk({ id: 'medical-king-7047-toilet-frame', name: 'Medical King Stand-Alone Toilet Safety Rail', brand: 'Medical King', sub: 'freestanding', q: 'Medical King toilet safety rail adjustable detachable stand alone 300 lb', badge: 'Best Value', price: 34.99, rating: 4.5, reviews: 3931, desc: 'A budget-friendly freestanding rail with extra-strong suction-cup feet and a 2-minute, no-tool assembly — adjustable to fit most toilets.', features: ['Adjustable height 24–31" & width 20–25"', '300 lb capacity, rustproof aluminum', 'Extra-strong suction-cup feet', '2-minute no-tool assembly'], pros: ['Lowest price here', 'Strong suction footing', 'Quick to set up'], cons: ['300 lb capacity (lowest here)'], bestFor: ['budget buyers', 'most standard toilets', 'easy setup'], specs: { height: '24–31"', width: '20–25"', capacity: '300 lb', feet: 'Suction' } }),
  mk({ id: 'pelegon-toilet-safety-frame', name: 'PELEGON TSR01 Lightweight Toilet Safety Rail', brand: 'PELEGON', sub: 'freestanding', q: 'PELEGON TSR01 toilet safety rails lightweight aluminum lab tested 350 lb', badge: 'Best for Recovery', price: 69.97, rating: 4.6, reviews: 1525, desc: 'A lab-tested, post-surgery-focused frame and the lightest here at 5.56 lb — easy to position and move, with tool-free assembly and video guides.', features: ['Lightest frame (5.56 lb)', '350 lb capacity, lab-tested stability', 'Height 24–30" & width 19–24.5"', 'Tool-free assembly + video guides'], pros: ['Very light to move/position', 'Designed for post-surgery', 'Verified stability'], cons: ['Priciest frame'], bestFor: ['hip/knee recovery', 'easy repositioning', 'lab-tested reassurance'], specs: { weight: '5.56 lb', capacity: '350 lb', height: '24–30"', width: '19–24.5"' } }),
  mk({ id: 'homland-t8-toilet-frame', name: 'HOMLAND T8 Adjustable Toilet Safety Frame', brand: 'HOMLAND', sub: 'freestanding', q: 'HOMLAND T8 toilet safety rails adjustable height width dual C-clamp 350 lb', badge: 'Most Stable', price: 39.99, rating: 4.5, reviews: 710, desc: 'A freestanding frame with upgraded dual C-clamps for enhanced stability, button-lock assembly, four pre-installed rubber feet, and two bonus suction cups.', features: ['Upgraded dual C-clamps', '350 lb capacity', 'Height 25–31" & width 20–26"', '4 rubber feet + 2 bonus suction cups'], pros: ['Extra-stable clamp design', 'Button-lock easy assembly', '1-year warranty, FSA/HSA'], cons: ['Newer listing, fewer reviews'], bestFor: ['extra stability', 'wider toilets', 'secure footing'], specs: { height: '25–31"', width: '20–26"', capacity: '350 lb', clamps: 'Dual C' } }),
];
const ids = new Set(p.map((x) => x.id));
const fresh = add.filter((x) => !ids.has(x.id));
p.push(...fresh);
fs.writeFileSync(f, JSON.stringify(p, null, 2) + '\n');
console.log(`Added ${fresh.length} toilet-safety-frames. Catalog now ${p.length} products.`);
