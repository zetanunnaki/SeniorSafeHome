import Link from 'next/link';

export interface Crumb {
  name: string;
  href: string;
}

/** Visible breadcrumb trail. Pair with breadcrumbSchema() for JSON-LD. */
export function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm">
      <ol className="flex flex-wrap items-center gap-1.5 text-ink-muted">
        {crumbs.map((c, i) => {
          const last = i === crumbs.length - 1;
          return (
            <li key={c.href} className="flex items-center gap-1.5">
              {last ? (
                <span className="font-medium text-ink-soft" aria-current="page">
                  {c.name}
                </span>
              ) : (
                <Link href={c.href} className="text-ink-muted no-underline hover:text-brand-700">
                  {c.name}
                </Link>
              )}
              {!last && <span aria-hidden="true">/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
