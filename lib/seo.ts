import type { Metadata } from 'next';
import { absoluteUrl, siteUrl } from './utils';
import siteData from '@/data/site.json';
import type { SiteConfig } from './types';

const site = siteData as SiteConfig;

interface SeoArgs {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  noindex?: boolean;
}

/**
 * Build per-page Next.js Metadata: title, description, canonical, OpenGraph,
 * Twitter, and robots. Export-safe (no runtime dependencies).
 */
export function buildMetadata({
  title,
  description,
  path,
  image,
  type = 'website',
  publishedTime,
  modifiedTime,
  noindex = false,
}: SeoArgs): Metadata {
  const canonical = absoluteUrl(path);
  // Image may already be an absolute URL (e.g. an Amazon product image) — only
  // prefix the site origin for site-relative paths.
  const ogImage = image
    ? image.startsWith('http')
      ? image
      : absoluteUrl(image)
    : absoluteUrl('/images/og-default.png');
  const fullTitle = title.includes(site.name) ? title : `${title} | ${site.name}`;

  return {
    // `absolute` bypasses the root title template so the site name isn't
    // appended twice (fullTitle already includes it).
    title: { absolute: fullTitle },
    description,
    alternates: { canonical },
    robots: noindex ? { index: false, follow: true } : { index: true, follow: true },
    openGraph: {
      title: fullTitle,
      description,
      url: canonical,
      siteName: site.name,
      type,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
      ...(publishedTime ? { publishedTime } : {}),
      ...(modifiedTime ? { modifiedTime } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [ogImage],
      ...(site.social?.twitter ? { creator: site.social.twitter } : {}),
    },
  };
}

/** Root metadata used in app/layout.tsx (title template + defaults). */
export function rootMetadata(): Metadata {
  return {
    metadataBase: new URL(siteUrl()),
    title: {
      default: `${site.name} — ${site.tagline}`,
      template: `%s | ${site.name}`,
    },
    description: site.description,
    applicationName: site.name,
    authors: [{ name: site.publisher }],
    alternates: { canonical: absoluteUrl('/') },
    openGraph: {
      type: 'website',
      siteName: site.name,
      title: `${site.name} — ${site.tagline}`,
      description: site.description,
      url: absoluteUrl('/'),
    },
    twitter: { card: 'summary_large_image' },
    robots: { index: true, follow: true },
  };
}
