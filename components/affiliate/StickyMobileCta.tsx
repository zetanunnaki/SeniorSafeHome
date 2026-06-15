import type { Product } from '@/lib/types';
import { getProductById, productImage } from '@/lib/products';
import { formatPrice } from '@/lib/utils';
import { AffiliateButton } from './AffiliateButton';
import { Img } from '@/components/ui/Img';

/**
 * A sticky "Check Price" bar pinned to the bottom of the screen on mobile only
 * (hidden on desktop). Shown on reviews and roundups for the primary product to
 * keep the conversion action always in reach.
 */
export function StickyMobileCta({ productId }: { productId?: string }) {
  const product: Product | undefined = productId ? getProductById(productId) : undefined;
  if (!product) return null;
  const price = formatPrice(product.price, product.priceCurrency);

  return (
    <div className="pb-safe fixed inset-x-0 bottom-0 z-40 border-t border-ink/10 bg-white/95 px-2.5 pt-2.5 shadow-[0_-4px_16px_rgba(18,42,44,0.10)] backdrop-blur lg:hidden">
      <div className="mx-auto flex max-w-3xl items-center gap-3">
        <Img src={productImage(product)} alt="" className="h-11 w-11 flex-shrink-0 rounded object-contain" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-ink">{product.name}</p>
          {price && <p className="text-xs text-ink-muted">{price} on Amazon</p>}
        </div>
        <AffiliateButton product={product} label="Check Price" className="!px-4 !py-2.5 !text-sm" />
      </div>
    </div>
  );
}
