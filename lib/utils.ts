// Small shared helpers. Keep framework-agnostic and side-effect free.

/** Join class names, dropping falsy values. */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ');
}

/** Prefix an absolute site path with the deploy basePath (for GitHub Pages subpaths). */
export function withBasePath(path: string): string {
  const base = process.env.NEXT_PUBLIC_BASE_PATH || '';
  if (!path.startsWith('/')) return path;
  return `${base}${path}`;
}

/** Public site origin, used for canonicals / sitemap / JSON-LD. */
export function siteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || 'https://seniorsaferhome.com').replace(/\/$/, '');
}

/** Build a fully-qualified canonical URL for a site-relative path. */
export function absoluteUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_BASE_PATH || '';
  const clean = path === '/' ? '' : path.replace(/\/$/, '');
  return `${siteUrl()}${base}${clean}`;
}

/** Human-readable date, e.g. "June 1, 2026". */
export function formatDate(iso?: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

/** Display price like "$49.99". Returns null if no usable price. */
export function formatPrice(price?: number, currency = 'USD'): string | null {
  if (typeof price !== 'number' || Number.isNaN(price)) return null;
  try {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(price);
  } catch {
    return `$${price.toFixed(2)}`;
  }
}

/** Turn arbitrary text into a slug. */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

/** Stable id from a heading, used for the Table of Contents anchors. */
export function headingId(text: string): string {
  return slugify(text);
}

/** Extract H2/H3 headings from raw MDX for a Table of Contents. */
export function extractHeadings(body: string): Array<{ depth: 2 | 3; text: string; id: string }> {
  const lines = body.split('\n');
  const headings: Array<{ depth: 2 | 3; text: string; id: string }> = [];
  let inFence = false;
  for (const line of lines) {
    if (/^\s*```/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    const m = /^(#{2,3})\s+(.*)$/.exec(line);
    if (m) {
      const depth = m[1].length as 2 | 3;
      const text = m[2].replace(/[#*`]/g, '').trim();
      headings.push({ depth, text, id: headingId(text) });
    }
  }
  return headings;
}
