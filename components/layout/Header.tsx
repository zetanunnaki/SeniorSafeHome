'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import siteData from '@/data/site.json';
import type { SiteConfig } from '@/lib/types';
import { Container } from '@/components/ui/Container';
import { cn } from '@/lib/utils';

const site = siteData as SiteConfig;

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const onHome = pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Transparent over the dark homepage hero; solid elsewhere or once scrolled.
  const transparent = onHome && !scrolled && !open;

  return (
    <header
      className={cn(
        'sticky top-0 z-40 transition-all duration-300',
        transparent
          ? 'bg-transparent'
          : cn('border-b border-ink/10 bg-surface/95 backdrop-blur', scrolled && 'shadow-sm')
      )}
    >
      <Container className="flex h-[72px] items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2.5 no-underline" onClick={() => setOpen(false)}>
          <span
            className={cn(
              'flex h-9 w-9 items-center justify-center rounded-xl shadow-sm ring-1 ring-inset transition-colors',
              transparent
                ? 'bg-gradient-to-b from-brand-400 to-brand-600 ring-white/20'
                : 'bg-gradient-to-b from-brand-500 to-brand-700 ring-black/5'
            )}
            aria-hidden="true"
          >
            <ShieldHomeIcon />
          </span>
          <span
            className={cn(
              'font-display text-lg font-bold tracking-tight',
              transparent ? 'text-white' : 'text-ink'
            )}
          >
            Senior<span className={transparent ? 'text-brand-300' : 'text-brand-600'}>Safer</span>Home
          </span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
          {site.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'text-[15px] font-semibold no-underline transition-colors',
                transparent ? 'text-white/85 hover:text-white' : 'text-ink-soft hover:text-brand-700'
              )}
            >
              {item.label}
            </Link>
          ))}
          <Link href="/best" className="btn-primary !px-5 !py-2.5 !text-sm no-underline">
            Best Picks
          </Link>
        </nav>

        <button
          type="button"
          className={cn(
            'inline-flex h-10 w-10 items-center justify-center rounded-lg border lg:hidden',
            transparent ? 'border-white/30 text-white' : 'border-ink/20 text-ink'
          )}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label="Toggle navigation menu"
          onClick={() => setOpen((o) => !o)}
        >
          <span aria-hidden="true">{open ? '✕' : '☰'}</span>
        </button>
      </Container>

      {open && (
        <nav
          id="mobile-nav"
          className="animate-fade-up border-t border-ink/10 bg-surface shadow-sm lg:hidden"
          aria-label="Mobile"
        >
          <Container className="flex flex-col gap-1 py-3">
            {site.nav.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'rounded-xl px-3 py-3 text-base font-semibold no-underline transition-colors',
                    active ? 'bg-brand-50 text-brand-700' : 'text-ink-soft hover:bg-cream'
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
            <Link
              href="/best"
              onClick={() => setOpen(false)}
              className="btn-primary mt-2 w-full no-underline"
            >
              Browse Best Picks
            </Link>
          </Container>
        </nav>
      )}
    </header>
  );
}

/** Brand mark: a protective shield enclosing a home (protection + home). */
function ShieldHomeIcon() {
  return (
    <svg width="21" height="21" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path
        d="M16 6l8 3.4v6.8c0 5.1-3.4 9.6-8 11.2-4.6-1.6-8-6.1-8-11.2V9.4L16 6z"
        fill="#ffffff"
      />
      <path d="M16 11l6 4.7h-2v5.8h-8v-5.8H10L16 11z" fill="#0f766e" />
      <path d="M14.6 21.5v-2.9a1.4 1.4 0 0 1 2.8 0v2.9z" fill="#ffffff" />
    </svg>
  );
}
