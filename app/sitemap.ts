import type { MetadataRoute } from 'next';
import { absoluteUrl } from '@/lib/utils';
import { getAllContent } from '@/lib/content';
import { getAllCategories } from '@/lib/products';
import { getAllComparisons } from '@/lib/comparisons';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPaths = [
    '/',
    '/best',
    '/reviews',
    '/guides',
    '/gift-guides',
    '/categories',
    '/compare',
    '/topics',
    '/glossary',
    '/about',
    '/editorial-policy',
    '/affiliate-disclosure',
    '/privacy-policy',
    '/terms',
    '/contact',
  ];

  const entries: MetadataRoute.Sitemap = staticPaths.map((p) => ({
    url: absoluteUrl(p),
    lastModified: now,
    changeFrequency: p === '/' ? 'weekly' : 'monthly',
    priority: p === '/' ? 1 : 0.7,
  }));

  // Content detail pages, using their updated dates.
  const contentTypes = ['best', 'reviews', 'guides', 'gift-guides', 'glossary'] as const;
  for (const type of contentTypes) {
    for (const doc of getAllContent(type)) {
      entries.push({
        url: absoluteUrl(`/${type}/${doc.slug}`),
        lastModified: new Date(doc.frontmatter.dateUpdated || doc.frontmatter.datePublished || now),
        changeFrequency: 'monthly',
        priority: 0.8,
      });
    }
  }

  for (const c of getAllCategories()) {
    entries.push({ url: absoluteUrl(`/categories/${c.slug}`), lastModified: now, priority: 0.7 });
  }
  for (const c of getAllComparisons()) {
    entries.push({ url: absoluteUrl(`/compare/${c.slug}`), lastModified: now, priority: 0.6 });
  }

  return entries;
}
