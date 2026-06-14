import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import type { ContentType, ContentDoc, ContentSummary, ContentFrontmatter } from './types';

const CONTENT_DIR = path.join(process.cwd(), 'content');

const TYPE_BASE: Record<ContentType, string> = {
  best: '/best',
  reviews: '/reviews',
  guides: '/guides',
  'gift-guides': '/gift-guides',
  glossary: '/glossary',
};

function typeDir(type: ContentType): string {
  return path.join(CONTENT_DIR, type);
}

function readMdxFiles(type: ContentType): string[] {
  const dir = typeDir(type);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.mdx') || f.endsWith('.md'));
}

/** Load and parse a single content document by type + slug. */
export function getContent(type: ContentType, slug: string): ContentDoc | null {
  const dir = typeDir(type);
  const candidates = [path.join(dir, `${slug}.mdx`), path.join(dir, `${slug}.md`)];
  const file = candidates.find((f) => fs.existsSync(f));
  if (!file) return null;
  const raw = fs.readFileSync(file, 'utf8');
  const { data, content } = matter(raw);
  const frontmatter = data as ContentFrontmatter;
  return {
    type,
    slug: frontmatter.slug || slug,
    frontmatter,
    body: content,
  };
}

/** All documents of a type, sorted newest-first by published date. */
export function getAllContent(type: ContentType): ContentDoc[] {
  return readMdxFiles(type)
    .map((file) => {
      const slug = file.replace(/\.(mdx|md)$/, '');
      return getContent(type, slug);
    })
    .filter((doc): doc is ContentDoc => Boolean(doc))
    .sort((a, b) =>
      (b.frontmatter.datePublished || '').localeCompare(a.frontmatter.datePublished || '')
    );
}

export function toSummary(doc: ContentDoc): ContentSummary {
  const fm = doc.frontmatter;
  return {
    type: doc.type,
    slug: doc.slug,
    title: fm.title,
    description: fm.description,
    datePublished: fm.datePublished,
    dateUpdated: fm.dateUpdated,
    category: fm.category,
    tags: fm.tags,
    featuredImage: fm.featuredImage,
    href: `${TYPE_BASE[doc.type]}/${doc.slug}`,
  };
}

export function getContentSummaries(type: ContentType): ContentSummary[] {
  return getAllContent(type).map(toSummary);
}

/** Slugs for generateStaticParams. */
export function getContentSlugs(type: ContentType): string[] {
  return readMdxFiles(type).map((f) => f.replace(/\.(mdx|md)$/, ''));
}

export function contentHref(type: ContentType, slug: string): string {
  return `${TYPE_BASE[type]}/${slug}`;
}

/** Glossary terms for auto-linking: { match, slug } where match drops any
 *  parenthetical (e.g. "Occupational Therapist (OT)" -> "Occupational Therapist"). */
export function getGlossaryTerms(): Array<{ match: string; slug: string }> {
  return getAllContent('glossary')
    .map((d) => ({
      match: (d.frontmatter.term || d.frontmatter.title).replace(/\s*\([^)]*\)\s*/g, '').trim(),
      slug: d.slug,
    }))
    .filter((t) => t.match.length > 3);
}

/** Recent content across multiple types, newest first. */
export function getLatestContent(
  types: ContentType[] = ['best', 'reviews', 'guides', 'gift-guides'],
  limit = 6
): ContentSummary[] {
  const all = types.flatMap((t) => getContentSummaries(t));
  return all
    .sort((a, b) => (b.datePublished || '').localeCompare(a.datePublished || ''))
    .slice(0, limit);
}

/**
 * Related content for a document: same category first, then shared tags,
 * excluding the current doc. Useful for RelatedArticles modules.
 */
export function getRelatedContent(doc: ContentDoc, limit = 4): ContentSummary[] {
  const fm = doc.frontmatter;
  const pool = (['best', 'reviews', 'guides', 'gift-guides'] as ContentType[])
    .flatMap((t) => getAllContent(t))
    .filter((d) => !(d.type === doc.type && d.slug === doc.slug));

  const scored = pool.map((d) => {
    let score = 0;
    if (d.frontmatter.category && d.frontmatter.category === fm.category) score += 3;
    const sharedTags = (d.frontmatter.tags || []).filter((t) => (fm.tags || []).includes(t));
    score += sharedTags.length;
    return { doc: d, score };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => toSummary(s.doc));
}
