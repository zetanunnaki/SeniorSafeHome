// Build-time product enrichment via the Amazon Creators API (replaces the
// retired PA-API). Reads data/products.json and writes data/products.enriched.json.
//
// Auth: OAuth 2.0 client-credentials (Login with Amazon) → bearer token.
// Data: POST https://creatorsapi.amazon/catalog/v1/getItems
//
// Credentials come from env only (GitHub Secrets in CI) and are NEVER written
// to the output. If credentials are missing or a lookup fails, each product
// falls back to its editorial image and the build still succeeds. Runs at build
// time only — the deployed static site never calls Amazon.

import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const SRC = path.join(root, 'data', 'products.json');
const OUT = path.join(root, 'data', 'products.enriched.json');

const {
  AMAZON_CREATORS_CLIENT_ID,
  AMAZON_CREATORS_CLIENT_SECRET,
  AMAZON_PARTNER_TAG = 'seniorsaferhome-20',
  AMAZON_CREATORS_SCOPE = 'creatorsapi::default',
  AMAZON_CREATORS_TOKEN_URL = 'https://api.amazon.com/auth/o2/token',
  AMAZON_CREATORS_HOST = 'creatorsapi.amazon',
  AMAZON_MARKETPLACE = 'www.amazon.com',
} = process.env;

const hasCreds = Boolean(AMAZON_CREATORS_CLIENT_ID && AMAZON_CREATORS_CLIENT_SECRET);

const RESOURCES = [
  'images.primary.large',
  'itemInfo.title',
  'offersV2.listings.price',
  'customerReviews.count',
  'customerReviews.starRating',
];

function fallback(product) {
  return { ...product, image: product.editorialImageFallback, imageSource: 'editorial-fallback' };
}

async function getToken() {
  const res = await fetch(AMAZON_CREATORS_TOKEN_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: AMAZON_CREATORS_CLIENT_ID,
      client_secret: AMAZON_CREATORS_CLIENT_SECRET,
      scope: AMAZON_CREATORS_SCOPE,
    }),
  });
  const json = await res.json();
  if (!json.access_token) throw new Error(`Token request failed: ${JSON.stringify(json)}`);
  return json.access_token;
}

async function getItems(token, asins) {
  const res = await fetch(`https://${AMAZON_CREATORS_HOST}/catalog/v1/getItems`, {
    method: 'POST',
    headers: {
      authorization: `Bearer ${token}`,
      'content-type': 'application/json; charset=utf-8',
      'x-marketplace': AMAZON_MARKETPLACE,
    },
    body: JSON.stringify({
      itemIds: asins,
      itemIdType: 'ASIN',
      partnerTag: AMAZON_PARTNER_TAG,
      partnerType: 'Associates',
      marketplace: AMAZON_MARKETPLACE,
      resources: RESOURCES,
    }),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`getItems HTTP ${res.status}: ${text.slice(0, 200)}`);
  const json = JSON.parse(text);
  if (json?.Output?.__type) throw new Error(`getItems error: ${json.Output.__type}`);
  return json;
}

function mapItem(item) {
  const image = item?.images?.primary?.large?.url;
  const listing = item?.offersV2?.listings?.[0];
  const priceAmount =
    listing?.price?.money?.amount ?? listing?.price?.amount ?? undefined;
  const priceCurrency =
    listing?.price?.money?.currencyCode ?? listing?.price?.currency ?? 'USD';
  const rating = item?.customerReviews?.starRating?.value;
  const reviewCount = item?.customerReviews?.count;

  return {
    ...(image ? { image, imageSource: 'creators-api' } : {}),
    ...(item?.detailPageURL ? { amazonUrl: item.detailPageURL } : {}),
    ...(typeof priceAmount === 'number' ? { price: priceAmount, priceCurrency } : {}),
    ...(typeof rating === 'number' ? { rating } : {}),
    ...(typeof reviewCount === 'number' ? { reviewCount } : {}),
    lastVerified: new Date().toISOString().slice(0, 10),
  };
}

async function main() {
  const products = JSON.parse(fs.readFileSync(SRC, 'utf8'));

  if (!hasCreds) {
    console.log('[enrich] No Creators API credentials — using editorial fallback images.');
    fs.writeFileSync(OUT, JSON.stringify(products.map(fallback), null, 2));
    console.log(`[enrich] Wrote ${products.length} products (fallback).`);
    return;
  }

  console.log('[enrich] Creators API credentials found — fetching live product data.');
  const token = await getToken();

  // getItems accepts up to 10 ASINs per request.
  const valid = products.filter((p) => p.asin && /^[A-Z0-9]{10}$/.test(p.asin));
  const byAsin = new Map();
  for (let i = 0; i < valid.length; i += 10) {
    const batch = valid.slice(i, i + 10);
    const asins = batch.map((p) => p.asin);
    try {
      const data = await getItems(token, asins);
      for (const item of data?.itemsResult?.items || []) byAsin.set(item.asin, mapItem(item));
    } catch (err) {
      console.warn(`[enrich] Batch failed (${asins.join(', ')}): ${err.message}`);
    }
  }

  let enriched = 0;
  const out = products.map((p) => {
    const extra = byAsin.get(p.asin);
    if (extra?.image) {
      enriched++;
      return { ...p, ...extra };
    }
    return fallback(p);
  });

  fs.writeFileSync(OUT, JSON.stringify(out, null, 2));
  console.log(
    `[enrich] Wrote ${out.length} products (${enriched} enriched from Creators API, ${out.length - enriched} fallback).`
  );
}

main().catch((err) => {
  console.error('[enrich] Unexpected error, falling back for all products:', err.message);
  try {
    const products = JSON.parse(fs.readFileSync(SRC, 'utf8'));
    fs.writeFileSync(OUT, JSON.stringify(products.map(fallback), null, 2));
  } catch (e) {
    console.error('[enrich] Could not write fallback output:', e.message);
    process.exit(1);
  }
});
