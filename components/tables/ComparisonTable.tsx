import type { Product } from '@/lib/types';
import { getProductsByIds, productImage } from '@/lib/products';
import { AffiliateButton } from '@/components/affiliate/AffiliateButton';
import { RatingStars } from '@/components/ui/RatingStars';
import { Badge } from '@/components/ui/Badge';
import { Img } from '@/components/ui/Img';

/**
 * Fact-rich comparison table driven by product IDs from the JSON catalog.
 * Responsive: a real table on desktop, stacked cards on mobile. Plain-language
 * labels make it easy for answer engines to summarize.
 */
export function ComparisonTable({
  products,
  ids,
  specKeys,
  title,
}: {
  products?: Product[];
  ids?: string[];
  specKeys?: string[];
  title?: string;
}) {
  const items = products ?? getProductsByIds(ids ?? []);
  if (items.length === 0) return null;

  // Derive the spec rows to show: caller-provided, else union of all spec keys.
  const keys =
    specKeys ??
    Array.from(new Set(items.flatMap((p) => Object.keys(p.specs || {})))).slice(0, 5);

  return (
    <section className="not-prose my-8">
      {title && <h2 className="mb-4 text-2xl font-semibold text-ink sm:text-3xl">{title}</h2>}

      {/* Desktop / tablet table */}
      <div className="hidden overflow-x-auto rounded-xl border border-slate-200 md:block">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="bg-slate-50">
              <th className="p-4 font-semibold text-ink">Product</th>
              <th className="p-4 font-semibold text-ink">Rating</th>
              {keys.map((k) => (
                <th key={k} className="p-4 font-semibold text-ink">
                  {humanizeKey(k)}
                </th>
              ))}
              <th className="p-4 font-semibold text-ink">Price</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {items.map((p) => (
              <tr key={p.id} className="align-top">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <Img src={productImage(p)} alt={p.name} className="h-12 w-12 flex-shrink-0 object-contain" />
                    <div>
                      {p.badge && <Badge className="mb-1">{p.badge}</Badge>}
                      <p className="font-semibold text-ink">{p.name}</p>
                      <p className="text-xs text-ink-muted">{p.brand}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <RatingStars rating={p.rating} reviewCount={p.reviewCount} size="sm" />
                </td>
                {keys.map((k) => (
                  <td key={k} className="p-4 text-ink-soft">
                    {p.specs?.[k] ?? '—'}
                  </td>
                ))}
                <td className="p-4">
                  <AffiliateButton product={p} label="Check Price" variant="secondary" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile stacked cards */}
      <div className="grid gap-4 md:hidden">
        {items.map((p) => (
          <div key={p.id} className="rounded-xl border border-slate-200 p-4">
            <div className="flex items-center gap-3">
              <Img src={productImage(p)} alt={p.name} className="h-14 w-14 object-contain" />
              <div>
                {p.badge && <Badge className="mb-1">{p.badge}</Badge>}
                <p className="font-semibold text-ink">{p.name}</p>
                <RatingStars rating={p.rating} reviewCount={p.reviewCount} size="sm" />
              </div>
            </div>
            <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
              {keys.map((k) => (
                <div key={k} className="flex flex-col">
                  <dt className="text-xs uppercase tracking-wide text-ink-muted">{humanizeKey(k)}</dt>
                  <dd className="text-ink-soft">{p.specs?.[k] ?? '—'}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-4">
              <AffiliateButton product={p} fullWidth />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function humanizeKey(key: string): string {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (c) => c.toUpperCase())
    .trim();
}
