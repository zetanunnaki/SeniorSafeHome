import Link from 'next/link';
import type { ContentSummary } from '@/lib/types';

const TYPE_LABEL: Record<string, string> = {
  best: 'Best Picks',
  reviews: 'Review',
  guides: 'Guide',
  'gift-guides': 'Gift Guide',
  glossary: 'Glossary',
};

/** Internal-linking module that reinforces topical clusters. */
export function RelatedArticles({
  items,
  title = 'Related reading',
}: {
  items: ContentSummary[];
  title?: string;
}) {
  if (!items || items.length === 0) return null;
  return (
    <section className="not-prose" aria-labelledby="related-heading">
      <h2 id="related-heading" className="text-2xl font-semibold text-ink">
        {title}
      </h2>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group flex flex-col rounded-xl border border-slate-200 bg-white p-5 no-underline transition hover:border-brand-300 hover:shadow-sm"
          >
            <span className="text-xs font-semibold uppercase tracking-wide text-brand-600">
              {TYPE_LABEL[item.type] || item.type}
            </span>
            <span className="mt-1 font-semibold text-ink group-hover:text-brand-700">
              {item.title}
            </span>
            <span className="mt-1 text-sm text-ink-soft">{item.description}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
