import type { Product } from '@/lib/types';
import { affiliateUrl } from '@/lib/products';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'secondary';

/**
 * Amazon affiliate CTA. Always opens in a new tab and carries
 * rel="sponsored nofollow noopener" for compliance. Uses evergreen price
 * language by default rather than hardcoded prices.
 */
export function AffiliateButton({
  product,
  label = 'Check Price on Amazon',
  variant = 'primary',
  className,
  fullWidth = false,
}: {
  product: Product;
  label?: 'Check Price on Amazon' | "See Today's Price" | 'View Details' | string;
  variant?: Variant;
  className?: string;
  fullWidth?: boolean;
}) {
  return (
    <a
      href={affiliateUrl(product)}
      target="_blank"
      rel="sponsored nofollow noopener"
      data-affiliate="amazon"
      data-product-id={product.id}
      className={cn(
        variant === 'primary' ? 'btn-primary' : 'btn-secondary',
        'no-underline',
        fullWidth && 'w-full',
        className
      )}
    >
      {label}
      <span aria-hidden="true">↗</span>
    </a>
  );
}
