import type { Product } from '@/lib/types';
import { productImage } from '@/lib/products';
import { AffiliateButton } from '@/components/affiliate/AffiliateButton';
import { RatingStars } from '@/components/ui/RatingStars';
import { Badge } from '@/components/ui/Badge';
import { Img } from '@/components/ui/Img';

/**
 * Top-of-review summary card: a direct-answer verdict box for readers and AI
 * answer engines. Shows the product, rating, verdict, quick best-for, and CTA.
 */
export function ReviewSummaryBox({
  product,
  rating,
  verdict,
}: {
  product: Product;
  rating?: number;
  verdict?: string;
}) {
  const score = rating ?? product.rating;
  return (
    <section className="not-prose overflow-hidden rounded-2xl border border-brand-100 bg-white shadow-sm">
      <div className="grid gap-6 p-6 sm:grid-cols-[200px_1fr] sm:p-8">
        <div className="flex items-center justify-center rounded-xl bg-slate-50 p-4">
          <Img
            src={productImage(product)}
            alt={`${product.name} — ${product.shortDescription}`}
            className="h-44 w-auto object-contain"
            loading="eager"
          />
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {product.badge && <Badge>{product.badge}</Badge>}
            <span className="text-sm font-medium text-ink-muted">{product.brand}</span>
          </div>
          <h2 className="!mt-0 text-2xl font-semibold text-ink">{product.name}</h2>
          {typeof score === 'number' && (
            <div className="flex items-center gap-3">
              <RatingStars rating={score} reviewCount={product.reviewCount} />
              <span className="rounded-md bg-brand-600 px-2 py-0.5 text-sm font-bold text-white">
                {score.toFixed(1)}/5
              </span>
            </div>
          )}
          {verdict && (
            <p className="rounded-lg bg-brand-50 p-3 text-ink-soft">
              <span className="font-semibold text-ink">Verdict: </span>
              {verdict}
            </p>
          )}
          {product.bestFor && product.bestFor.length > 0 && (
            <p className="text-sm text-ink-soft">
              <span className="font-semibold text-ink">Best for: </span>
              {product.bestFor.join(', ')}.
            </p>
          )}
          <div className="mt-2 sm:max-w-xs">
            <AffiliateButton product={product} fullWidth />
          </div>
        </div>
      </div>
    </section>
  );
}
