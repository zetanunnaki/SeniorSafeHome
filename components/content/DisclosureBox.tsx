import Link from 'next/link';
import siteData from '@/data/site.json';
import type { SiteConfig } from '@/lib/types';
import { cn } from '@/lib/utils';

const site = siteData as SiteConfig;

/**
 * Affiliate disclosure shown near the first CTA on money pages. Required for
 * Amazon Associates compliance. `variant="inline"` is a slim strip; `card` is a
 * boxed version for the top of roundups/reviews.
 */
export function DisclosureBox({
  variant = 'card',
  className,
}: {
  variant?: 'inline' | 'card';
  className?: string;
}) {
  if (variant === 'inline') {
    return (
      <p className={cn('text-sm text-ink-muted', className)}>
        {site.disclosureShort}{' '}
        <Link href="/affiliate-disclosure" className="underline">
          Learn more
        </Link>
        .
      </p>
    );
  }
  return (
    <aside
      className={cn(
        'not-prose rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-ink-soft',
        className
      )}
      role="note"
    >
      <strong className="font-semibold text-ink">Disclosure:</strong> {site.disclosure}{' '}
      <Link href="/affiliate-disclosure" className="font-medium underline">
        Read our full affiliate disclosure
      </Link>
      .
    </aside>
  );
}
