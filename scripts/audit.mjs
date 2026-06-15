// Full catalog audit — read-only. Reports integrity issues across products,
// categories, topics, and MDX content. Run: node scripts/audit.mjs
import fs from 'node:fs';
import path from 'node:path';

const read = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));
const products = read('data/products.json');
const enrichedRaw = read('data/products.enriched.json');
const enriched = Array.isArray(enrichedRaw) ? enrichedRaw : Object.values(enrichedRaw);
const categories = read('data/categories.json');
const topics = read('data/topics.json');

const ok = [];
const warn = [];
const fail = [];
const PASS = (m) => ok.push(m);
const WARN = (m) => warn.push(m);
const FAIL = (m) => fail.push(m);

// Approved categories that may contain sub-4.5 (still >=4.0) products.
const FLOOR40 = new Set([
  'hearing-amplifiers', 'automatic-pill-dispensers', 'lift-chairs', 'seat-cushions',
  'smart-home-for-seniors', 'walker-wheelchair-accessories', 'large-button-phones',
]);

const catSlugs = new Set(categories.map((c) => c.slug));
const ids = products.map((p) => p.id);
const idSet = new Set(ids);

// ---- 1. Product structure ----
const required = ['id', 'name', 'brand', 'category', 'asin', 'price']; // rating handled separately
// large-button-phones may hold specialty amplified/captioned phones without an
// Amazon star rating (we never fabricate ratings); these render with no stars
// and valid schema (productSchema omits aggregateRating when rating is absent).
const UNRATED_OK = new Set(['large-button-phones']);
let structIssues = 0;
for (const p of products) {
  for (const f of required) {
    if (p[f] === undefined || p[f] === null || p[f] === '') {
      FAIL(`product ${p.id || '(no id)'} missing field: ${f}`);
      structIssues++;
    }
  }
  if (typeof p.rating !== 'number') {
    if (UNRATED_OK.has(p.category)) WARN(`unrated specialty phone (accepted): ${p.id}`);
    else { FAIL(`product ${p.id} missing field: rating`); structIssues++; }
  }
  if (p.category && !catSlugs.has(p.category)) FAIL(`product ${p.id} has unknown category: ${p.category}`);
}
if (!structIssues) PASS(`All ${products.length} products have required fields (rating optional only for specialty phones)`);

// ---- 2. Duplicate ids ----
const dupIds = ids.filter((id, i) => ids.indexOf(id) !== i);
if (dupIds.length) FAIL(`Duplicate product ids: ${[...new Set(dupIds)].join(', ')}`);
else PASS('No duplicate product ids');

// ---- 3. Duplicate ASINs ----
const byAsin = {};
products.forEach((p) => { if (p.asin) (byAsin[p.asin] = byAsin[p.asin] || []).push(p.id); });
const dupAsins = Object.entries(byAsin).filter(([, list]) => list.length > 1);
if (dupAsins.length) {
  WARN(`${dupAsins.length} ASINs used by multiple products:`);
  dupAsins.forEach(([a, list]) => WARN(`    ${a} -> ${list.join(', ')}`));
} else PASS('No duplicate ASINs');
const noAsin = products.filter((p) => !p.asin).map((p) => p.id);
if (noAsin.length) FAIL(`Products missing ASIN: ${noAsin.join(', ')}`);
else PASS('Every product has an ASIN');

// ---- 4. Real images (from enriched) ----
const eById = new Map(enriched.map((p) => [p.id, p]));
const noImg = [];
for (const p of products) {
  const e = eById.get(p.id);
  const img = e && e.image;
  if (!img || !/media-amazon\.com/.test(img)) noImg.push(p.id);
}
if (noImg.length) FAIL(`Products without a real Amazon image: ${noImg.join(', ')}`);
else PASS(`All ${products.length} products have a real Amazon image`);

// ---- 5. Rating-floor compliance ----
const below45 = products.filter((p) => p.rating < 4.5);
const violations = below45.filter((p) => !FLOOR40.has(p.category));
const below40 = products.filter((p) => p.rating < 4.0);
if (below40.length) FAIL(`Products below 4.0 stars: ${below40.map((p) => `${p.id}(${p.rating})`).join(', ')}`);
else PASS('No product below 4.0 stars');
if (violations.length) {
  FAIL(`Sub-4.5 products outside an approved 4.0-floor category:`);
  violations.forEach((p) => FAIL(`    ${p.id} (${p.rating}) in ${p.category}`));
} else PASS('All sub-4.5 products are in approved 4.0-floor categories');
const floorCats = {};
below45.forEach((p) => { floorCats[p.category] = (floorCats[p.category] || 0) + 1; });
PASS(`Sub-4.5 products (all in approved cats): ${Object.entries(floorCats).map(([c, n]) => `${c}:${n}`).join(', ') || 'none'}`);

// ---- 6. Thin review counts (info) ----
const thin = products.filter((p) => p.reviewCount !== undefined && p.reviewCount < 50);
if (thin.length) WARN(`${thin.length} products with <50 reviews (niche): ${thin.map((p) => `${p.id}(${p.reviewCount})`).join(', ')}`);

// ---- 7. Categories: products + roundup ----
const catProductCount = {};
products.forEach((p) => { catProductCount[p.category] = (catProductCount[p.category] || 0) + 1; });
const emptyCats = categories.filter((c) => !catProductCount[c.slug]);
if (emptyCats.length) FAIL(`Categories with no products: ${emptyCats.map((c) => c.slug).join(', ')}`);
else PASS(`All ${categories.length} categories have products`);

// roundups
const bestDir = 'content/best';
const roundupCats = new Set();
const allMdx = [];
for (const dir of ['best', 'guides', 'gift-guides']) {
  const d = path.join('content', dir);
  if (!fs.existsSync(d)) continue;
  for (const fn of fs.readdirSync(d).filter((f) => f.endsWith('.mdx'))) {
    const raw = fs.readFileSync(path.join(d, fn), 'utf8');
    allMdx.push({ dir, fn, raw });
    if (dir === 'best') {
      const m = raw.match(/^category:\s*"?([a-z0-9-]+)"?/m);
      if (m) roundupCats.add(m[1]);
    }
  }
}
const noRoundup = categories.filter((c) => !roundupCats.has(c.slug));
if (noRoundup.length) WARN(`Categories without a best-roundup: ${noRoundup.map((c) => c.slug).join(', ')}`);
else PASS(`All ${categories.length} categories have a roundup`);

// ---- 8. Topic wiring ----
let topicIssues = 0;
for (const t of topics) {
  for (const c of t.categories || []) {
    if (!catSlugs.has(c)) { FAIL(`topic ${t.slug} references unknown category: ${c}`); topicIssues++; }
  }
}
const inTopics = new Set(topics.flatMap((t) => t.categories || []));
const orphanCats = categories.filter((c) => !inTopics.has(c.slug));
if (orphanCats.length) WARN(`Categories not in any topic: ${orphanCats.map((c) => c.slug).join(', ')}`);
if (!topicIssues) PASS('All topic category references are valid');

// ---- 9. MDX product-id + internal-link integrity ----
const bestSlugs = new Set();
const guideSlugs = new Set();
const giftSlugs = new Set();
for (const { dir, raw } of allMdx) {
  const m = raw.match(/^slug:\s*"?([a-z0-9-]+)"?/m);
  if (!m) continue;
  if (dir === 'best') bestSlugs.add(m[1]);
  else if (dir === 'guides') guideSlugs.add(m[1]);
  else if (dir === 'gift-guides') giftSlugs.add(m[1]);
}
let badIdRefs = 0, badLinks = 0;
for (const { dir, fn, raw } of allMdx) {
  // collect product ids referenced
  const refs = new Set();
  for (const mm of raw.matchAll(/id=\{?["']([a-z0-9-]+)["']\}?/g)) refs.add(mm[1]);
  for (const mm of raw.matchAll(/ids=\{\[([^\]]*)\]\}/g)) {
    for (const q of mm[1].matchAll(/["']([a-z0-9-]+)["']/g)) refs.add(q[1]);
  }
  // frontmatter id arrays
  for (const key of ['featuredProductIds', 'comparisonProductIds', 'relatedProductIds']) {
    const block = raw.match(new RegExp(`${key}:\\n((?:\\s*-\\s*[a-z0-9-]+\\n)+)`));
    if (block) for (const q of block[1].matchAll(/-\s*([a-z0-9-]+)/g)) refs.add(q[1]);
  }
  for (const r of refs) {
    if (!idSet.has(r)) { FAIL(`${dir}/${fn}: references missing product id "${r}"`); badIdRefs++; }
  }
  // internal links
  for (const mm of raw.matchAll(/\]\((\/(best|categories|guides|gift-guides)\/[a-z0-9-]+)\/?\)/g)) {
    const [_, full, type] = mm;
    const slug = full.split('/')[2];
    const exists =
      (type === 'categories' && catSlugs.has(slug)) ||
      (type === 'best' && bestSlugs.has(slug)) ||
      (type === 'guides' && guideSlugs.has(slug)) ||
      (type === 'gift-guides' && giftSlugs.has(slug));
    if (!exists) { FAIL(`${dir}/${fn}: broken internal link ${full}`); badLinks++; }
  }
}
if (!badIdRefs) PASS('All MDX product-id references resolve');
if (!badLinks) PASS('All MDX internal category/roundup/guide links resolve');

// ---- Summary ----
console.log('\n================ CATALOG AUDIT ================');
console.log(`Products: ${products.length} | Categories: ${categories.length} | Topics: ${topics.length}`);
console.log(`Roundups: ${bestSlugs.size} | Guides: ${guideSlugs.size} | Gift guides: ${giftSlugs.size}`);
console.log('\n--- PASS (' + ok.length + ') ---');
ok.forEach((m) => console.log('  ✓ ' + m));
console.log('\n--- WARNINGS (' + warn.length + ') ---');
warn.forEach((m) => console.log('  ! ' + m));
console.log('\n--- FAILURES (' + fail.length + ') ---');
fail.forEach((m) => console.log('  ✗ ' + m));
console.log('\n==============================================');
console.log(fail.length === 0 ? 'RESULT: PASS (no failures)' : `RESULT: ${fail.length} FAILURE(S) TO REVIEW`);
