import siteData from '@/data/site.json';
import type { SiteConfig } from '@/lib/types';

const site = siteData as SiteConfig;

/** Author/editor attribution block — an editorial trust signal for SEO/GEO. */
export function AuthorBox({ author }: { author?: string }) {
  const name = author || site.publisher;
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="not-prose flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-5">
      <div
        className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-brand-100 font-semibold text-brand-700"
        aria-hidden="true"
      >
        {initials}
      </div>
      <div>
        <p className="font-semibold text-ink">{name}</p>
        <p className="mt-1 text-sm text-ink-soft">
          Our editorial team researches senior home safety products hands-on and against
          published safety guidance. We recommend products based on stability, ease of use, and
          real-world value — never on commissions. See our{' '}
          <a href="/editorial-policy" className="font-medium underline">
            editorial policy
          </a>{' '}
          and how we evaluate products.
        </p>
      </div>
    </div>
  );
}
