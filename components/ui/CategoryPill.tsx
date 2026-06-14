import Link from 'next/link';
import { cn } from '@/lib/utils';

export function CategoryPill({
  name,
  href,
  className,
}: {
  name: string;
  href?: string;
  className?: string;
}) {
  const classes = cn(
    'inline-flex items-center rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-sm font-medium text-brand-800 transition hover:bg-brand-100',
    className
  );
  if (href) {
    return (
      <Link href={href} className={cn(classes, 'no-underline')}>
        {name}
      </Link>
    );
  }
  return <span className={classes}>{name}</span>;
}
