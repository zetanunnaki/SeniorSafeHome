import { withBasePath } from '@/lib/utils';
import { cn } from '@/lib/utils';

/**
 * Plain <img> that applies the deploy basePath to local (/...) sources and
 * leaves remote URLs (Amazon images) untouched. Chosen over next/image because
 * static export + remote Amazon hosts + SVG fallbacks are simplest this way,
 * and images are already sized/lazy below the fold.
 */
export function Img({
  src,
  alt,
  className,
  width,
  height,
  loading = 'lazy',
}: {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  loading?: 'lazy' | 'eager';
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={withBasePath(src)}
      alt={alt}
      width={width}
      height={height}
      loading={loading}
      decoding="async"
      className={cn(className)}
    />
  );
}
