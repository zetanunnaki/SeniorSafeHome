import fs from 'node:fs';
import path from 'node:path';
import type { Product, Category, Topic } from './types';

import categoriesData from '@/data/categories.json';
import topicsData from '@/data/topics.json';

const DATA_DIR = path.join(process.cwd(), 'data');

/**
 * Load the product catalog. Prefers the build-time enriched artifact
 * (data/products.enriched.json); falls back to the hand-maintained
 * data/products.json so the site still builds if enrichment was skipped.
 */
function loadProducts(): Product[] {
  const enrichedPath = path.join(DATA_DIR, 'products.enriched.json');
  const basePath = path.join(DATA_DIR, 'products.json');
  const file = fs.existsSync(enrichedPath) ? enrichedPath : basePath;
  const raw = fs.readFileSync(file, 'utf8');
  return JSON.parse(raw) as Product[];
}

let _products: Product[] | null = null;
export function getAllProducts(): Product[] {
  if (!_products) _products = loadProducts();
  return _products;
}

export function getProductById(id: string): Product | undefined {
  return getAllProducts().find((p) => p.id === id);
}

export function getProductsByIds(ids: string[] = []): Product[] {
  return ids.map((id) => getProductById(id)).filter((p): p is Product => Boolean(p));
}

export function getProductsByCategory(categorySlug: string): Product[] {
  return getAllProducts().filter((p) => p.category === categorySlug);
}

/** The best image to show: enriched Amazon image if present, else editorial fallback. */
export function productImage(product: Product): string {
  return product.image || product.editorialImageFallback;
}

/**
 * First real (enriched) product image among the given IDs — used as an
 * article's OpenGraph image so social previews show a real product photo.
 * Returns undefined if none have an enriched image yet.
 */
export function firstProductImage(ids: string[] = []): string | undefined {
  for (const id of ids) {
    const p = getProductById(id);
    if (p?.image) return p.image;
  }
  return undefined;
}

/** Affiliate URL, ensuring the Associates tag is present. */
export function affiliateUrl(product: Product): string {
  const tag = process.env.NEXT_PUBLIC_AMAZON_TAG || 'seniorsaferhome-20';
  if (product.amazonUrl.includes('tag=')) return product.amazonUrl;
  const sep = product.amazonUrl.includes('?') ? '&' : '?';
  return `${product.amazonUrl}${sep}tag=${tag}`;
}

// --- Categories & topics ---

export function getAllCategories(): Category[] {
  return categoriesData as Category[];
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return getAllCategories().find((c) => c.slug === slug);
}

export function getAllTopics(): Topic[] {
  return topicsData as Topic[];
}

export function getTopicBySlug(slug: string): Topic | undefined {
  return getAllTopics().find((t) => t.slug === slug);
}

export function getCategoriesByCluster(cluster: string): Category[] {
  return getAllCategories().filter((c) => c.cluster === cluster);
}
