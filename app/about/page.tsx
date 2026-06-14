import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHero } from '@/components/layout/PageHero';
import { Container } from '@/components/ui/Container';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'About SeniorSaferHome',
  description:
    'SeniorSaferHome helps aging adults and their families choose home safety products with confidence through independent research, hands-on reviews, and practical guides.',
  path: '/about',
});

const crumbs = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About us"
        title="Helping families keep aging adults safe at home"
        crumbs={crumbs}
      />
      <Container className="py-12">
        <div className="prose-ssh max-w-3xl">
          <p>
            SeniorSaferHome is an independent publisher focused on one thing: helping older adults
            live safely, comfortably, and independently in their own homes. We exist for the adult
            children, caregivers, and seniors who are trying to make confident decisions — often
            during a stressful time, like a recovery from surgery or after a fall.
          </p>

          <h2>Why we started</h2>
          <p>
            Shopping for senior safety products is surprisingly hard. Retail listings are written to
            sell, not to help you choose. Specifications are buried, important safety details are
            glossed over, and it&apos;s difficult to tell whether a product actually suits your
            parent&apos;s situation. We built SeniorSaferHome to cut through that noise with clear,
            calm, practical guidance.
          </p>

          <h2>What we cover</h2>
          <p>
            We focus on the products and decisions that have the biggest impact on safety at home:
            bathroom safety, fall prevention, bedroom safety, mobility and transfer aids, medical
            alert systems, medication organization, and communication devices. For each, we publish
            roundups, hands-on reviews, comparison pages, and educational guides that work together.
          </p>

          <h2>How we keep your trust</h2>
          <ul>
            <li>
              <strong>Independence first.</strong> We recommend products based on stability, ease of
              use, and real-world value — never because of a commission.
            </li>
            <li>
              <strong>Careful, non-alarmist language.</strong> We avoid fear-based selling and
              unsupported health claims, and we encourage readers to involve a doctor or
              occupational therapist when appropriate.
            </li>
            <li>
              <strong>Transparency.</strong> We clearly disclose our affiliate relationships and how
              we make money. Read our{' '}
              <Link href="/affiliate-disclosure">affiliate disclosure</Link> and{' '}
              <Link href="/editorial-policy">editorial policy</Link>.
            </li>
          </ul>

          <h2>A note on medical advice</h2>
          <p>
            SeniorSaferHome provides general safety information, not medical advice. Every person&apos;s
            needs are different. For questions about a specific health condition, mobility limitation,
            or fall risk, please consult a qualified healthcare professional.
          </p>

          <h2>Get in touch</h2>
          <p>
            We welcome questions, corrections, and product suggestions. Visit our{' '}
            <Link href="/contact">contact page</Link> to reach the editorial team.
          </p>
        </div>
      </Container>
    </>
  );
}
