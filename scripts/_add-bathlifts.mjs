import fs from 'node:fs';
const f = 'data/products.json';
const p = JSON.parse(fs.readFileSync(f, 'utf8'));
const mk = (o) => ({
  id: o.id, name: o.name, brand: o.brand, category: 'bath-lifts', subCategory: o.sub,
  amazonUrl: `https://www.amazon.com/s?k=${encodeURIComponent(o.q)}&tag=seniorsaferhome-20`,
  asin: '', editorialImageFallback: `/images/products/${o.id}.svg`,
  shortDescription: o.desc, badge: o.badge, price: o.price, priceCurrency: 'USD',
  rating: o.rating, ...(o.reviews ? { reviewCount: o.reviews } : {}),
  features: o.features, pros: o.pros || o.features.slice(0, 2), cons: o.cons || [], bestFor: o.bestFor || [],
  specs: o.specs, reviewSlug: null, lastManualReview: '2026-06-14',
});
const add = [
  mk({ id: 'superhandy-gorise-bath-lift', name: 'SuperHandy GoRise LT Portable Floor & Bath Lift', brand: 'SuperHandy', sub: 'portable', q: 'SuperHandy GoRise LT portable floor bath lift foldable', badge: 'Best Overall', price: 377.99, rating: 4.5, reviews: 410, desc: 'A patented foldable lift that works in the tub, shower, or bedroom — ultralight at 19 lb, fully waterproof, and doubling as a floor-recovery lift.', features: ['Dual-purpose floor + bath lift', '330 lb capacity, only 19 lb', 'IP68 waterproof, aluminum/stainless', 'Foldable; wide drainage seat'], pros: ['Use in tub, shower, or bedroom', 'Very light and portable', 'Fully waterproof'], cons: ['Premium price'], bestFor: ['independent bathing', 'floor fall recovery', 'travel between rooms'], specs: { type: 'Portable bath/floor lift', capacity: '330 lb', waterproof: 'IP68', weight: '19 lb' } }),
  mk({ id: 'perlecare-electric-bath-lift', name: 'PERLECARE Electric Bath Lift Chair', brand: 'PERLECARE', sub: 'powered', q: 'PERLECARE electric bath lift chair waterproof foldable remote', badge: 'Best Value', price: 209.97, rating: 4.5, reviews: 80, desc: 'An IP68 waterproof powered lift that folds to just 6.4 inches for storage, with a stable 6-point base and a simple remote — the most affordable powered option.', features: ['IP68 waterproof', '308 lb capacity, 50+ cycles/charge', 'Folds to 6.4" for storage', '6-point stable base + remote'], pros: ['Lowest-priced powered lift', 'Folds away compactly', 'Stable on tile or tub floor'], cons: ['Fewer reviews than GoRise'], bestFor: ['budget powered bathing', 'small bathrooms', 'easy storage'], specs: { type: 'Powered bath lift', capacity: '308 lb', waterproof: 'IP68', folds: '6.4 in' } }),
  mk({ id: 'superhandy-gorise-bath-lift-pink', name: 'SuperHandy GoRise LT Bath Lift (EVA Cushion)', brand: 'SuperHandy', sub: 'portable', q: 'SuperHandy GoRise LT bath lift EVA cushion pink portable', badge: 'Most Comfortable', price: 379.99, rating: 4.5, reviews: 410, desc: 'The same GoRise LT platform with an added EVA comfort cushion for softer seating — a thoughtful, more comfortable choice with all the waterproof, foldable design.', features: ['Included EVA comfort cushion', '330 lb capacity, 19 lb', 'IP68 waterproof, foldable', '1-year warranty + US support'], pros: ['Softer, cushioned seat', 'Same light, waterproof build', 'Backed by US support'], cons: ['Premium price'], bestFor: ['added seating comfort', 'independent bathing', 'gift choice'], specs: { type: 'Portable bath/floor lift', capacity: '330 lb', waterproof: 'IP68', seat: 'EVA cushion' } }),
];
const ids = new Set(p.map((x) => x.id));
const fresh = add.filter((x) => !ids.has(x.id));
p.push(...fresh);
fs.writeFileSync(f, JSON.stringify(p, null, 2) + '\n');
console.log(`Added ${fresh.length} bath-lifts. Catalog now ${p.length} products.`);
