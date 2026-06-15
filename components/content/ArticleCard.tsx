import Link from 'next/link';
import type { ContentSummary } from '@/lib/types';
import { formatDate } from '@/lib/utils';

const TYPE_LABEL: Record<string, string> = {
  best: 'Best Picks',
  reviews: 'Review',
  guides: 'Guide',
  'gift-guides': 'Gift Guide',
  glossary: 'Glossary',
};

/** Card used across hub and archive listings. */
export function ArticleCard({ item, showType = true }: { item: ContentSummary; showType?: boolean }) {
  return (
    <article className="group flex h-full flex-col rounded-2xl border border-ink/10 bg-white p-6 shadow-card transition hover:-translate-y-1 hover:border-brand-300 hover:shadow-lift">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-brand-700">
        {showType && <span>{TYPE_LABEL[item.type] || item.type}</span>}
        {item.dateUpdated && (
          <span className="font-medium normal-case tracking-normal text-ink-muted">
            · Updated {formatDate(item.dateUpdated)}
          </span>
        )}
      </div>
      <h3 className="mt-3 font-display text-xl font-bold leading-snug text-ink">
        <Link href={item.href} className="no-underline group-hover:text-brand-700">
          {item.title}
        </Link>
      </h3>
      <p className="mt-2 flex-1 text-ink-soft">{item.description}</p>
      <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700">
        Read more
        <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
          →
        </span>
      </span>
    </article>
  );
}
