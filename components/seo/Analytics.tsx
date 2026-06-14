'use client';

import Script from 'next/script';
import { useEffect } from 'react';

/**
 * Opt-in analytics, all static-export safe. Nothing loads unless the matching
 * env var is set, so the default build ships with no trackers.
 *
 *   NEXT_PUBLIC_GA_ID            -> Google Analytics 4 (e.g. G-XXXXXXX)
 *   NEXT_PUBLIC_PLAUSIBLE_DOMAIN -> Plausible (privacy-friendly, cookieless)
 *
 * Also tracks outbound affiliate clicks (elements with data-affiliate="amazon")
 * as a custom event in whichever provider is configured.
 */
export function Analytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const plausible = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;

  useEffect(() => {
    function onClick(e: MouseEvent) {
      const el = (e.target as HTMLElement)?.closest('[data-affiliate="amazon"]');
      if (!el) return;
      const productId = el.getAttribute('data-product-id') || 'unknown';
      // GA4
      (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag?.('event', 'affiliate_click', {
        product_id: productId,
        outbound: true,
        merchant: 'amazon',
      });
      // Plausible
      (window as unknown as { plausible?: (...a: unknown[]) => void }).plausible?.('Affiliate Click', {
        props: { product: productId },
      });
    }
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  return (
    <>
      {gaId && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
          <Script id="ga4-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}');`}
          </Script>
        </>
      )}
      {plausible && (
        <Script
          src="https://plausible.io/js/script.tagged-events.outbound-links.js"
          data-domain={plausible}
          strategy="afterInteractive"
        />
      )}
    </>
  );
}
