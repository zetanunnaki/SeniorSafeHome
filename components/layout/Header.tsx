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
        'sticky top-0 z-40 transition-colors duration-300',
        transparent ? 'bg-transparent' : 'border-b border-ink/10 bg-surface/95 backdrop-blur'
      )}
    >
      <Container className="flex h-[72px] items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2.5 no-underline" onClick={() => setOpen(false)}>
          <span
            className={cn(
              'flex h-9 w-9 items-center justify-center rounded-xl text-white',
              transparent ? 'bg-brand-500' : 'bg-brand-700'
            )}
            aria-hidden="true"
          >
            <ShieldIcon />
          </span>
          <span
            className={cn(
              'font-display text-lg font-bold tracking-tight',
              transparent ? 'text-white' : 'text-ink'
            )}
          >
            Senior<span className={transparent ? 'text-brand-300' : 'text-brand-600'}>Safe</span>Home
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
        <nav id="mobile-nav" className="border-t border-ink/10 bg-surface lg:hidden" aria-label="Mobile">
          <Container className="flex flex-col py-2">
            {site.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-2 py-3 text-base font-semibold text-ink-soft no-underline hover:bg-cream"
              >
                {item.label}
              </Link>
            ))}
          </Container>
        </nav>
      )}
    </header>
  );
}

function ShieldIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 2l7 3v6c0 4.5-3 8.5-7 9.9C8 19.5 5 15.5 5 11V5l7-3z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
