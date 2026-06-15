import Link from 'next/link';
import type { Product } from '@/lib/types';
import { productImage } from '@/lib/products';
import { AffiliateButton } from './AffiliateButton';
import { RatingStars } from '@/components/ui/RatingStars';
import { Badge } from '@/components/ui/Badge';
import { Img } from '@/components/ui/Img';
import { cn } from '@/lib/utils';

/**
 * Conversion-focused product card used in grids, roundups, and related blocks.
 * Shows badge, image, name, rating, short description, key features, and CTA.
 * Pricing is intentionally not shown as a hard number (evergreen CTA instead).
 */
export function ProductCard({
  product,
  rank,
  showFeatures = true,
  className,
}: {
  product: Product;
  rank?: number;
  showFeatures?: boolean;
  className?: string;
}) {
  return (
    <article
      className={cn(
        'group card-interactive flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-card',
        className
      )}
    >
      <div className="relative flex items-center justify-center overflow-hidden bg-slate-50 p-6">
        {product.badge && (
          <div className="absolute left-3 top-3 z-10">
            <Badge>{product.badge}</Badge>
          </div>
        )}
        {typeof rank === 'number' && (
          <div className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white shadow-sm">
            {rank}
          </div>
        )}
        <Img
          src={productImage(product)}
          alt={`${product.name} — ${product.shortDescription}`}
          className="img-zoom h-40 w-auto object-contain"
        />
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-ink-muted">
            {product.brand}
          </p>
          <h3 className="mt-0.5 text-lg font-semibold leading-snug text-ink">
            {product.reviewSlug ? (
              <Link href={`/reviews/${product.reviewSlug}`} className="no-underline hover:text-brand-700">
                {product.name}
              </Link>
            ) : (
              product.name
            )}
          </h3>
        </div>

        <RatingStars rating={product.rating} reviewCount={product.reviewCount} size="sm" />

        <p className="text-sm text-ink-soft">{product.shortDescription}</p>

        {showFeatures && product.features && product.features.length > 0 && (
          <ul className="mt-auto space-y-1 text-sm text-ink-soft">
            {product.features.slice(0, 3).map((f) => (
              <li key={f} className="flex gap-2">
                <span className="mt-0.5 text-sage-600" aria-hidden="true">
                  ✓
                </span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-3 flex flex-col gap-2">
          <AffiliateButton product={product} fullWidth />
          {product.reviewSlug && (
            <Link
              href={`/reviews/${product.reviewSlug}`}
              className="text-center text-sm font-medium text-brand-700"
            >
              Read our full review →
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
