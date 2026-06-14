'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export interface TocItem {
  depth: 2 | 3;
  text: string;
  id: string;
}

/**
 * Sticky table of contents with scroll-spy highlighting. Degrades to a plain
 * link list without JS. Built from headings extracted at build time.
 */
export function TableOfContents({ items, title = 'On this page' }: { items: TocItem[]; title?: string }) {
  const [active, setActive] = useState<string>('');

  useEffect(() => {
    if (items.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
            break;
          }
        }
      },
      { rootMargin: '0px 0px -70% 0px', threshold: 0.1 }
    );
    items.forEach((it) => {
      const el = document.getElementById(it.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [items]);

  if (items.length < 3) return null;

  return (
    <nav aria-label="Table of contents" className="text-sm">
      <p className="mb-2 font-semibold uppercase tracking-wide text-ink-muted">{title}</p>
      <ul className="space-y-1.5 border-l border-slate-200">
        {items.map((it) => (
          <li key={it.id} className={cn(it.depth === 3 && 'ml-3')}>
            <a
              href={`#${it.id}`}
              className={cn(
                '-ml-px block border-l-2 py-0.5 pl-3 no-underline transition',
                active === it.id
                  ? 'border-brand-600 font-medium text-brand-700'
                  : 'border-transparent text-ink-muted hover:text-ink'
              )}
            >
              {it.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
