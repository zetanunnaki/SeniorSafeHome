import { cn } from '@/lib/utils';

/** Accessible star rating. Renders full/half/empty stars and a numeric label. */
export function RatingStars({
  rating,
  reviewCount,
  size = 'md',
  className,
}: {
  rating?: number;
  reviewCount?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  if (typeof rating !== 'number') return null;
  const clamped = Math.max(0, Math.min(5, rating));
  const full = Math.floor(clamped);
  const half = clamped - full >= 0.25 && clamped - full < 0.75;
  const roundedForHalf = clamped - full >= 0.75 ? full + 1 : full;

  const sizes = { sm: 'h-4 w-4 text-sm', md: 'h-5 w-5 text-base', lg: 'h-6 w-6 text-lg' };

  return (
    <span
      className={cn('inline-flex items-center gap-1.5', className)}
      aria-label={`Rated ${clamped} out of 5${reviewCount ? ` from ${reviewCount.toLocaleString()} reviews` : ''}`}
    >
      <span className="inline-flex" aria-hidden="true">
        {[0, 1, 2, 3, 4].map((i) => {
          const filled = i < roundedForHalf;
          const isHalf = half && i === full;
          return (
            <Star key={i} className={sizes[size]} state={isHalf ? 'half' : filled ? 'full' : 'empty'} />
          );
        })}
      </span>
      <span className="font-semibold text-ink">{clamped.toFixed(1)}</span>
      {reviewCount ? (
        <span className="text-ink-muted">({reviewCount.toLocaleString()})</span>
      ) : null}
    </span>
  );
}

function Star({ className, state }: { className?: string; state: 'full' | 'half' | 'empty' }) {
  const fill = state === 'empty' ? '#e2e8f0' : '#f59e0b';
  return (
    <svg className={className} viewBox="0 0 20 20" role="presentation">
      {state === 'half' && (
        <defs>
          <linearGradient id="halfStar">
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="50%" stopColor="#e2e8f0" />
          </linearGradient>
        </defs>
      )}
      <path
        d="M10 1.5l2.6 5.27 5.82.85-4.21 4.1.99 5.79L10 14.77l-5.2 2.73.99-5.79L1.58 7.62l5.82-.85L10 1.5z"
        fill={state === 'half' ? 'url(#halfStar)' : fill}
      />
    </svg>
  );
}
