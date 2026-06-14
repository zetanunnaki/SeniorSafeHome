import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHero } from '@/components/layout/PageHero';
import { Container } from '@/components/ui/Container';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Editorial Policy',
  description:
    'How SeniorSaferHome researches, evaluates, and recommends senior home safety products — our standards for accuracy, independence, and trust.',
  path: '/editorial-policy',
});

const crumbs = [
  { name: 'Home', href: '/' },
  { name: 'Editorial Policy', href: '/editorial-policy' },
];

export default function EditorialPolicyPage() {
  return (
    <>
      <PageHero eyebrow="Editorial" title="Our editorial policy" crumbs={crumbs} />
      <Container className="py-12">
        <div className="prose-ssh max-w-3xl">
          <p>
            This policy explains how we research, evaluate, and recommend products so you can trust
            what you read on SeniorSaferHome.
          </p>

          <h2>How we evaluate products</h2>
          <p>When we assess a senior safety product, we weigh:</p>
          <ul>
            <li>
              <strong>Safety and stability</strong> — weight capacity, slip resistance, secure
              mounting, and how the product behaves in real conditions (wet floors, uneven footing).
            </li>
            <li>
              <strong>Ease of use</strong> — whether an older adult with limited strength, vision, or
              dexterity can use it confidently and independently.
            </li>
            <li>
              <strong>Build quality and durability</strong> — materials, construction, and how the
              product holds up over time.
            </li>
            <li>
              <strong>Value</strong> — fair price for the safety benefit, not just the lowest cost.
            </li>
            <li>
              <strong>Real-world feedback</strong> — patterns across verified owner reviews,
              especially recurring safety complaints.
            </li>
          </ul>

          <h2>How we choose what to recommend</h2>
          <p>
            Our recommendations are independent. Manufacturers and retailers do not pay for
            placement, ratings, or badges such as &quot;Best Overall.&quot; When we name a top pick,
            it reflects our editorial judgment about which product best serves a particular need.
          </p>

          <h2>Accuracy and updates</h2>
          <p>
            We show a published and, where relevant, an updated date on our content. Product details
            such as specifications can change, and pricing and availability on Amazon fluctuate. We
            treat pricing as approximate and encourage readers to confirm the current price and
            details on the retailer&apos;s site before buying. If you spot an error, please{' '}
            <Link href="/contact">tell us</Link> and we will correct it.
          </p>

          <h2>Health and safety language</h2>
          <p>
            We publish general safety information, not medical advice. We avoid unsupported health
            claims and fear-based selling. For decisions involving a specific medical condition or
            significant fall risk, we recommend consulting a physician or occupational therapist.
          </p>

          <h2>How we make money</h2>
          <p>
            SeniorSaferHome is reader-supported. We participate in the Amazon Associates program and
            may earn a commission when you buy through our links, at no extra cost to you. This never
            influences our editorial judgment. See our{' '}
            <Link href="/affiliate-disclosure">affiliate disclosure</Link> for details.
          </p>

          <h2>Corrections</h2>
          <p>
            We take accuracy seriously. When we make a meaningful error, we correct it promptly and,
            where appropriate, note the change. Reach us through our{' '}
            <Link href="/contact">contact page</Link>.
          </p>
        </div>
      </Container>
    </>
  );
}
