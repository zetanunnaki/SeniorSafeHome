import type { Metadata } from 'next';
import { Inter, Outfit, Fraunces } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { JsonLd } from '@/components/seo/JsonLd';
import { Analytics } from '@/components/seo/Analytics';
import { rootMetadata } from '@/lib/seo';
import { websiteSchema, organizationSchema } from '@/lib/schema';

// Distinctive geometric display + highly legible body + editorial serif accent.
const inter = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
const outfit = Outfit({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  variable: '--font-display',
  display: 'swap',
});
const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['italic'],
  variable: '--font-serif',
  display: 'swap',
});

export const metadata: Metadata = rootMetadata();

// Content-Security-Policy (delivered via meta tag since GitHub Pages can't set
// response headers). 'unsafe-inline' for scripts is required because a static
// export can't use per-request nonces for the inline JSON-LD and analytics init.
const CSP = [
  "default-src 'self'",
  "img-src 'self' https://m.media-amazon.com https://*.media-amazon.com https://*.ssl-images-amazon.com data:",
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://plausible.io",
  "connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com https://plausible.io",
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self' data:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self' https: mailto:",
  "frame-ancestors 'none'",
  'upgrade-insecure-requests',
].join('; ');

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} ${fraunces.variable}`}>
      <head>
        <meta httpEquiv="Content-Security-Policy" content={CSP} />
      </head>
      <body className="flex min-h-screen flex-col">
        <JsonLd data={[websiteSchema(), organizationSchema()]} />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-brand-600 focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to main content
        </a>
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
