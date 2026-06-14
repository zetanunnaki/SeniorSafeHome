import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHero } from '@/components/layout/PageHero';
import { Container } from '@/components/ui/Container';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Affiliate Disclosure',
  description:
    'SeniorSafeHome is reader-supported. As an Amazon Associate, we earn from qualifying purchases at no extra cost to you. Read our full affiliate disclosure.',
  path: '/affiliate-disclosure',
});

const crumbs = [
  { name: 'Home', href: '/' },
  { name: 'Affiliate Disclosure', href: '/affiliate-disclosure' },
];

export default function AffiliateDisclosurePage() {
  return (
    <>
      <PageHero eyebrow="Disclosure" title="Affiliate disclosure" crumbs={crumbs} />
      <Container className="py-12">
        <div className="prose-ssh max-w-3xl">
          <p>
            SeniorSafeHome is reader-supported. As an Amazon Associate, we may earn from qualifying
            purchases at no extra cost to you. When you click a link to Amazon on our site and make a
            purchase, we may receive a small commission.
          </p>

          <h2>What this means</h2>
          <p>
            The price you pay is exactly the same whether or not you use our links. The commission we
            earn helps us research products, maintain the site, and keep our guides free to read.
          </p>

          <h2>Amazon Associates Program</h2>
          <p>
            SeniorSafeHome is a participant in the Amazon Services LLC Associates Program, an
            affiliate advertising program designed to provide a means for sites to earn advertising
            fees by advertising and linking to Amazon.com. Amazon and the Amazon logo are trademarks
            of Amazon.com, Inc. or its affiliates.
          </p>

          <h2>Our commitment to you</h2>
          <ul>
            <li>
              We recommend products based on merit — safety, ease of use, and value — not on the
              commission they pay.
            </li>
            <li>
              We do not accept payment from manufacturers for reviews, rankings, or badges.
            </li>
            <li>
              Pricing and availability shown anywhere on this site are approximate and can change.
              Always confirm the current price on Amazon before purchasing.
            </li>
          </ul>

          <p>
            For more on how we research and select products, see our{' '}
            <Link href="/editorial-policy">editorial policy</Link>. Questions? Visit our{' '}
            <Link href="/contact">contact page</Link>.
          </p>
        </div>
      </Container>
    </>
  );
}
