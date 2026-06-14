import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHero } from '@/components/layout/PageHero';
import { Container } from '@/components/ui/Container';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Terms of Use',
  description:
    'The terms and conditions for using SeniorSaferHome, including the limits of our safety information and your responsibilities as a reader.',
  path: '/terms',
});

const crumbs = [
  { name: 'Home', href: '/' },
  { name: 'Terms of Use', href: '/terms' },
];

export default function TermsPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Terms of use" crumbs={crumbs} />
      <Container className="py-12">
        <div className="prose-ssh max-w-3xl">
          <p>
            Welcome to SeniorSaferHome. By accessing or using this website, you agree to these Terms
            of Use. If you do not agree, please do not use the site.
          </p>

          <h2>Informational purpose only</h2>
          <p>
            The content on SeniorSaferHome is provided for general informational purposes. It is not
            medical, legal, or professional advice, and it is not a substitute for guidance from a
            qualified professional who knows your specific situation. Always consult a physician or
            occupational therapist about a particular health condition, mobility limitation, or fall
            risk.
          </p>

          <h2>No guarantee of outcomes</h2>
          <p>
            We work to provide accurate, helpful information, but we make no warranties about the
            completeness, reliability, or suitability of the content for any purpose. Products must be
            installed and used according to the manufacturer&apos;s instructions. Proper installation
            — especially for weight-bearing items like grab bars — is essential to safety.
          </p>

          <h2>Affiliate links and third parties</h2>
          <p>
            Our site contains affiliate links, primarily to Amazon. We are not responsible for the
            content, products, pricing, or practices of third-party websites. See our{' '}
            <Link href="/affiliate-disclosure">affiliate disclosure</Link>.
          </p>

          <h2>Limitation of liability</h2>
          <p>
            To the fullest extent permitted by law, SeniorSaferHome and its contributors are not
            liable for any damages arising from your use of the site or reliance on its content. You
            use the site and any products you purchase at your own discretion and risk.
          </p>

          <h2>Intellectual property</h2>
          <p>
            The content on this site, including text and design, is owned by SeniorSaferHome unless
            otherwise noted, and may not be reproduced without permission. Product names and
            trademarks belong to their respective owners.
          </p>

          <h2>Changes</h2>
          <p>
            We may update these terms from time to time. Continued use of the site after changes
            constitutes acceptance of the revised terms.
          </p>

          <h2>Contact</h2>
          <p>
            Questions about these terms? Reach us through our <Link href="/contact">contact page</Link>.
          </p>
        </div>
      </Container>
    </>
  );
}
