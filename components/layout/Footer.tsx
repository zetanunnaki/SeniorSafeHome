import Link from 'next/link';
import siteData from '@/data/site.json';
import type { SiteConfig } from '@/lib/types';
import { Container } from '@/components/ui/Container';

const site = siteData as SiteConfig;

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-24 bg-night-texture text-white/80">
      <Container className="py-16">
        <div className="grid gap-10 md:grid-cols-[1.6fr_repeat(3,1fr)]">
          <div>
            <p className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500 text-white" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2l7 3v6c0 4.5-3 8.5-7 9.9C8 19.5 5 15.5 5 11V5l7-3z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                  <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span className="font-display text-lg font-bold text-white">
                Senior<span className="text-brand-300">Safe</span>Home
              </span>
            </p>
            <p className="mt-4 max-w-xs text-sm text-white/70">{site.tagline}</p>
            <p className="mt-5 text-xs leading-relaxed text-white/50">{site.disclosure}</p>
          </div>

          {Object.entries(site.footerLinks).map(([group, links]) => (
            <div key={group}>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-300">{group}</p>
              <ul className="mt-4 space-y-2.5">
                {links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sm text-white/75 no-underline transition hover:text-white">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-white/12 pt-6 text-sm text-white/55 sm:flex-row sm:items-center">
          <p>
            © {year} {site.name}. All rights reserved.
          </p>
          <p className="max-w-xl sm:text-right">
            As an Amazon Associate we earn from qualifying purchases. Amazon and the Amazon logo are
            trademarks of Amazon.com, Inc. or its affiliates.
          </p>
        </div>
      </Container>
    </footer>
  );
}
