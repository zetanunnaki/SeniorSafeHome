import type { MetadataRoute } from 'next';
import { siteUrl } from '@/lib/utils';

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_BASE_PATH || '';
  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: `${siteUrl()}${base}/sitemap.xml`,
    host: siteUrl(),
  };
}
