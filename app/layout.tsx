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

// Google AdSense publisher client, e.g. "ca-pub-1234567890123456".
// Set NEXT_PUBLIC_ADSENSE_CLIENT to enable ads + the verification snippet; leave
// unset and the site ships ad-free with a tighter CSP.
const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT?.trim();

// Extra CSP sources required by AdSense — only added when ads are enabled, so the
// default policy stays tight until you actually apply.
const adsense = ADSENSE_CLIENT
  ? {
      script: ' https://pagead2.googlesyndication.com https://partner.googleadservices.com https://tpc.googlesyndication.com https://www.googletagservices.com https://adservice.google.com',
      img: ' https://pagead2.googlesyndication.com https://*.googlesyndication.com https://*.g.doubleclick.net https://*.google.com',
      frame: " frame-src https://googleads.g.doubleclick.net https://tpc.googlesyndication.com https://www.google.com;",
      connect: ' https://pagead2.googlesyndication.com https://*.googlesyndication.com https://*.g.doubleclick.net https://*.google.com',
    }
  : { script: '', img: '', frame: '', connect: '' };

// Content-Security-Policy (delivered via meta tag since GitHub Pages can't set
// response headers). 'unsafe-inline' for scripts is required because a static
// export can't use per-request nonces for the inline JSON-LD and analytics init.
const CSP = [
  "default-src 'self'",
  `img-src 'self' https://m.media-amazon.com https://*.media-amazon.com https://*.ssl-images-amazon.com data:${adsense.img}`,
  `script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://plausible.io${adsense.script}`,
  `connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com https://plausible.io${adsense.connect}`,
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self' data:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self' https: mailto:",
  'frame-ancestors \'none\'',
  'upgrade-insecure-requests',
]
  .join('; ')
  // append a frame-src directive only when AdSense needs to embed ad iframes
  .concat(adsense.frame ? `;${adsense.frame}` : '');

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} ${fraunces.variable}`}>
      <head>
        <meta httpEquiv="Content-Security-Policy" content={CSP} />
        {/* Google AdSense: verification meta + ad-serving loader. Renders only
            when NEXT_PUBLIC_ADSENSE_CLIENT is set (e.g. when you apply/approve). */}
        {ADSENSE_CLIENT && (
          <>
            <meta name="google-adsense-account" content={ADSENSE_CLIENT} />
            <script
              async
              src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
              crossOrigin="anonymous"
            />
          </>
        )}
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
