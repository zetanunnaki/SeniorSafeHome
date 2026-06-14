import type { Product } from '@/lib/types';
import { getProductsByIds } from '@/lib/products';
import { AffiliateButton } from './AffiliateButton';
import { RatingStars } from '@/components/ui/RatingStars';
import { Badge } from '@/components/ui/Badge';
import { Img } from '@/components/ui/Img';
import { productImage } from '@/lib/products';
import Link from 'next/link';

/**
 * Compact "quick picks" module for the top of roundups — lets readers (and AI
 * answer engines) grab the verdict immediately without scrolling.
 */
export function QuickPicks({
  products,
  ids,
  title = 'Our Quick Picks',
}: {
  products?: Product[];
  ids?: string[];
  title?: string;
}) {
  const items = products ?? getProductsByIds(ids ?? []);
  if (items.length === 0) return null;

  return (
    <section className="not-prose rounded-2xl border border-brand-100 bg-brand-50/60 p-5 sm:p-6">
      <h2 className="!mt-0 text-xl font-semibold text-ink">{title}</h2>
      <ul className="mt-4 divide-y divide-brand-100">
        {items.map((p) => (
          <li key={p.id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:gap-5">
            <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-lg bg-white">
              <Img src={productImage(p)} alt={p.name} className="h-12 w-auto object-contain" />
            </div>
            <div className="flex-1">
              {p.badge && <Badge>{p.badge}</Badge>}
              <p className="mt-1 font-semibold text-ink">
                {p.reviewSlug ? (
                  <Link href={`/reviews/${p.reviewSlug}`} className="no-underline hover:text-brand-700">
                    {p.name}
                  </Link>
                ) : (
                  p.name
                )}
              </p>
              <RatingStars rating={p.rating} reviewCount={p.reviewCount} size="sm" className="mt-1" />
            </div>
            <div className="sm:w-48">
              <AffiliateButton product={p} fullWidth />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
