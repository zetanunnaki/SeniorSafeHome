// One-time helper: fill in missing ASINs by searching the Amazon Creators API
// for each product by name, taking the top match. Writes ASINs back into
// data/products.json and logs every match for owner review. Auto-resolved
// ASINs are tagged with "asinSource": "searchItems" so they can be verified.
//
// Run:  AMAZON_CREATORS_CLIENT_ID=... AMAZON_CREATORS_CLIENT_SECRET=... \
//       node scripts/resolve-asins.mjs

import fs from 'node:fs';
import path from 'node:path';

const SRC = path.join(process.cwd(), 'data', 'products.json');
const {
  AMAZON_CREATORS_CLIENT_ID,
  AMAZON_CREATORS_CLIENT_SECRET,
  AMAZON_PARTNER_TAG = 'seniorsaferhome-20',
} = process.env;

if (!AMAZON_CREATORS_CLIENT_ID || !AMAZON_CREATORS_CLIENT_SECRET) {
  console.error('Missing AMAZON_CREATORS_CLIENT_ID / AMAZON_CREATORS_CLIENT_SECRET');
  process.exit(1);
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function getToken() {
  const res = await fetch('https://api.amazon.com/auth/o2/token', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: AMAZON_CREATORS_CLIENT_ID,
      client_secret: AMAZON_CREATORS_CLIENT_SECRET,
      scope: 'creatorsapi::default',
    }),
  });
  const j = await res.json();
  if (!j.access_token) throw new Error('token failed: ' + JSON.stringify(j));
  return j.access_token;
}

async function search(token, keywords) {
  const res = await fetch('https://creatorsapi.amazon/catalog/v1/searchItems', {
    method: 'POST',
    headers: {
      authorization: `Bearer ${token}`,
      'content-type': 'application/json; charset=utf-8',
      'x-marketplace': 'www.amazon.com',
    },
    body: JSON.stringify({
      keywords,
      searchIndex: 'All',
      itemCount: 1,
      partnerTag: AMAZON_PARTNER_TAG,
      partnerType: 'Associates',
      marketplace: 'www.amazon.com',
      resources: ['itemInfo.title'],
    }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const j = JSON.parse(await res.text());
  if (j?.Output?.__type) throw new Error(j.Output.__type);
  return j?.searchResult?.items?.[0];
}

async function main() {
  const products = JSON.parse(fs.readFileSync(SRC, 'utf8'));
  const token = await getToken();
  const missing = products.filter((p) => !(p.asin && /^[A-Z0-9]{10}$/.test(p.asin)));
  console.log(`Resolving ASINs for ${missing.length} products...\n`);

  let resolved = 0;
  for (const p of missing) {
    const keywords = p.name.replace(/["”″]/g, ' inch ').replace(/\s+/g, ' ').trim();
    try {
      const hit = await search(token, keywords);
      if (hit?.asin) {
        p.asin = hit.asin;
        p.asinSource = 'searchItems';
        resolved++;
        console.log(`✓ ${p.id}\n    "${keywords}"\n    -> ${hit.asin}  ${(hit.itemInfo?.title?.displayValue || '').slice(0, 70)}`);
      } else {
        console.log(`✗ ${p.id} — no match for "${keywords}"`);
      }
    } catch (e) {
      console.log(`! ${p.id} — ${e.message}`);
    }
    await sleep(600); // be gentle on rate limits
  }

  fs.writeFileSync(SRC, JSON.stringify(products, null, 2) + '\n');
  console.log(`\nResolved ${resolved}/${missing.length}. Wrote data/products.json.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
