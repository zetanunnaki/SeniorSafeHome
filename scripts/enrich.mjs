// Build-time product enrichment.
//
// Reads the hand-maintained data/products.json and writes
// data/products.enriched.json. When Amazon Product Advertising API (PA-API v5)
// credentials are present in the environment (GitHub Secrets in CI), it fetches
// approved fields such as the canonical image URL, price, and availability.
//
// SAFETY:
//  - Credentials are read from env only and NEVER written to the output file.
//  - If credentials are missing, or any lookup fails, each product falls back
//    to its editorial image and the build continues successfully.
//  - This runs only at build time; the deployed static site never calls Amazon.

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = process.cwd();
const SRC = path.join(root, 'data', 'products.json');
const OUT = path.join(root, 'data', 'products.enriched.json');

const {
  AMAZON_ACCESS_KEY,
  AMAZON_SECRET_KEY,
  AMAZON_PARTNER_TAG,
  AMAZON_HOST = 'webservices.amazon.com',
  AMAZON_REGION = 'us-east-1',
} = process.env;

const hasCreds = Boolean(AMAZON_ACCESS_KEY && AMAZON_SECRET_KEY && AMAZON_PARTNER_TAG);

function fallback(product) {
  return {
    ...product,
    image: product.editorialImageFallback,
    imageSource: 'editorial-fallback',
  };
}

// --- AWS Signature V4 for PA-API v5 ---

function sha256Hex(data) {
  return crypto.createHash('sha256').update(data, 'utf8').digest('hex');
}
function hmac(key, data) {
  return crypto.createHmac('sha256', key).update(data, 'utf8').digest();
}

async function getItems(asins) {
  const service = 'ProductAdvertisingAPI';
  const target = 'com.amazon.paapi5.v1.ProductAdvertisingAPIv1.GetItems';
  const endpoint = `https://${AMAZON_HOST}/paapi5/getitems`;
  const uri = '/paapi5/getitems';

  const payload = JSON.stringify({
    ItemIds: asins,
    Resources: [
      'Images.Primary.Large',
      'ItemInfo.Title',
      'Offers.Listings.Price',
      'Offers.Listings.Availability.Message',
    ],
    PartnerTag: AMAZON_PARTNER_TAG,
    PartnerType: 'Associates',
    Marketplace: 'www.amazon.com',
  });

  const now = new Date();
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, '');
  const dateStamp = amzDate.slice(0, 8);

  const headers = {
    'content-encoding': 'amz-1.0',
    'content-type': 'application/json; charset=utf-8',
    host: AMAZON_HOST,
    'x-amz-date': amzDate,
    'x-amz-target': target,
  };

  const signedHeaders = Object.keys(headers).sort().join(';');
  const canonicalHeaders =
    Object.keys(headers)
      .sort()
      .map((k) => `${k}:${headers[k]}\n`)
      .join('') ;

  const canonicalRequest = [
    'POST',
    uri,
    '',
    canonicalHeaders,
    signedHeaders,
    sha256Hex(payload),
  ].join('\n');

  const scope = `${dateStamp}/${AMAZON_REGION}/${service}/aws4_request`;
  const stringToSign = [
    'AWS4-HMAC-SHA256',
    amzDate,
    scope,
    sha256Hex(canonicalRequest),
  ].join('\n');

  const kDate = hmac(`AWS4${AMAZON_SECRET_KEY}`, dateStamp);
  const kRegion = hmac(kDate, AMAZON_REGION);
  const kService = hmac(kRegion, service);
  const kSigning = hmac(kService, 'aws4_request');
  const signature = crypto.createHmac('sha256', kSigning).update(stringToSign, 'utf8').digest('hex');

  const authorization = `AWS4-HMAC-SHA256 Credential=${AMAZON_ACCESS_KEY}/${scope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { ...headers, Authorization: authorization },
    body: payload,
  });

  if (!res.ok) {
    throw new Error(`PA-API HTTP ${res.status}: ${await res.text()}`);
  }
  return res.json();
}

function mapApiItem(item) {
  const image = item?.Images?.Primary?.Large?.URL;
  const listing = item?.Offers?.Listings?.[0];
  const price = listing?.Price?.Amount;
  const currency = listing?.Price?.Currency;
  const availability = listing?.Availability?.Message;
  return {
    ...(image ? { image, imageSource: 'amazon-api' } : {}),
    ...(typeof price === 'number' ? { price, priceCurrency: currency || 'USD' } : {}),
    ...(availability ? { availability } : {}),
    lastVerified: new Date().toISOString().slice(0, 10),
  };
}

async function main() {
  const products = JSON.parse(fs.readFileSync(SRC, 'utf8'));

  if (!hasCreds) {
    console.log('[enrich] No Amazon credentials found — using editorial fallback images.');
    fs.writeFileSync(OUT, JSON.stringify(products.map(fallback), null, 2));
    console.log(`[enrich] Wrote ${products.length} products to ${path.basename(OUT)} (fallback).`);
    return;
  }

  console.log('[enrich] Amazon credentials found — attempting PA-API enrichment.');
  const byAsin = new Map();

  // PA-API GetItems accepts up to 10 ASINs per request.
  const valid = products.filter((p) => p.asin && !p.asin.includes('EXAMPLE'));
  for (let i = 0; i < valid.length; i += 10) {
    const batch = valid.slice(i, i + 10);
    const asins = batch.map((p) => p.asin);
    try {
      const data = await getItems(asins);
      for (const item of data?.ItemsResult?.Items || []) {
        byAsin.set(item.ASIN, mapApiItem(item));
      }
    } catch (err) {
      console.warn(`[enrich] Batch failed (${asins.join(', ')}): ${err.message}`);
    }
  }

  let enrichedCount = 0;
  const out = products.map((p) => {
    const extra = byAsin.get(p.asin);
    if (extra && extra.image) {
      enrichedCount++;
      return { ...p, ...extra };
    }
    return fallback(p);
  });

  fs.writeFileSync(OUT, JSON.stringify(out, null, 2));
  console.log(
    `[enrich] Wrote ${out.length} products (${enrichedCount} enriched from Amazon, ${out.length - enrichedCount} fallback).`
  );
}

main().catch((err) => {
  console.error('[enrich] Unexpected error, falling back for all products:', err);
  try {
    const products = JSON.parse(fs.readFileSync(SRC, 'utf8'));
    fs.writeFileSync(OUT, JSON.stringify(products.map(fallback), null, 2));
  } catch (e) {
    console.error('[enrich] Could not write fallback output:', e);
    process.exit(1);
  }
});
