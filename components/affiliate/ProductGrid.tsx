import type { Product } from '@/lib/types';
import { getProductsByIds } from '@/lib/products';
import { ProductCard } from './ProductCard';
import { cn } from '@/lib/utils';

/**
 * Responsive grid of product cards. Accepts either resolved products or a list
 * of product IDs (so it can be embedded in MDX with just IDs).
 */
export function ProductGrid({
  products,
  ids,
  columns = 3,
  ranked = false,
  className,
}: {
  products?: Product[];
  ids?: string[];
  columns?: 2 | 3 | 4;
  ranked?: boolean;
  className?: string;
}) {
  const items = products ?? getProductsByIds(ids ?? []);
  if (items.length === 0) return null;

  const cols = {
    2: 'sm:grid-cols-2',
    3: 'sm:grid-cols-2 lg:grid-cols-3',
    4: 'sm:grid-cols-2 lg:grid-cols-4',
  }[columns];

  return (
    <div className={cn('grid grid-cols-1 gap-6', cols, className)}>
      {items.map((p, i) => (
        <ProductCard key={p.id} product={p} rank={ranked ? i + 1 : undefined} />
      ))}
    </div>
  );
}
