import { formatDate } from '@/lib/utils';
import { cn } from '@/lib/utils';

/** Shows published / updated dates for editorial trust and GEO signals. */
export function LastUpdated({
  datePublished,
  dateUpdated,
  className,
}: {
  datePublished: string;
  dateUpdated?: string;
  className?: string;
}) {
  const updated = dateUpdated && dateUpdated !== datePublished;
  return (
    <p className={cn('text-sm text-ink-muted', className)}>
      {updated ? (
        <>
          <span>Updated </span>
          <time dateTime={dateUpdated}>{formatDate(dateUpdated)}</time>
          <span className="text-ink-muted/70"> · Published {formatDate(datePublished)}</span>
        </>
      ) : (
        <>
          <span>Published </span>
          <time dateTime={datePublished}>{formatDate(datePublished)}</time>
        </>
      )}
    </p>
  );
}
