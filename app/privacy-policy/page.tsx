import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHero } from '@/components/layout/PageHero';
import { Container } from '@/components/ui/Container';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Privacy Policy',
  description:
    'How SeniorSaferHome handles your information, including analytics, cookies, affiliate links, and your privacy choices.',
  path: '/privacy-policy',
});

const crumbs = [
  { name: 'Home', href: '/' },
  { name: 'Privacy Policy', href: '/privacy-policy' },
];

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Privacy policy" crumbs={crumbs} />
      <Container className="py-12">
        <div className="prose-ssh max-w-3xl">
          <p>
            This Privacy Policy explains what information SeniorSaferHome collects, how we use it, and
            the choices you have. By using this website, you agree to the practices described here.
          </p>

          <h2>Information we collect</h2>
          <ul>
            <li>
              <strong>Information you provide.</strong> If you contact us, we receive the details you
              choose to share, such as your name, email address, and message.
            </li>
            <li>
              <strong>Automatically collected data.</strong> Like most websites, we may collect basic
              technical information such as your browser type, device, and pages visited, typically
              through privacy-respecting analytics.
            </li>
          </ul>

          <h2>Cookies and analytics</h2>
          <p>
            We may use cookies and similar technologies to understand how visitors use the site so we
            can improve it. We may use analytics tools (for example, a privacy-focused analytics
            provider or Google Analytics). You can control cookies through your browser settings.
          </p>

          <h2>Affiliate links</h2>
          <p>
            Our pages contain affiliate links, primarily to Amazon. When you click these links,
            Amazon may set cookies or collect information according to its own privacy policy. We do
            not control and are not responsible for the privacy practices of third-party sites. See
            our <Link href="/affiliate-disclosure">affiliate disclosure</Link> for details.
          </p>

          <h2>Advertising</h2>
          <p>
            We may display advertising in the future. If we use third-party ad networks (such as
            Google AdSense), those providers may use cookies to serve ads based on your prior visits
            to this and other websites. You can learn about your choices for personalized advertising
            through your ad settings with the relevant provider.
          </p>

          <h2>How we use information</h2>
          <p>
            We use information to respond to your messages, operate and improve the site, understand
            aggregate usage, and comply with legal obligations. We do not sell your personal
            information.
          </p>

          <h2>Your choices</h2>
          <ul>
            <li>You can disable cookies in your browser.</li>
            <li>You can opt out of personalized advertising through the relevant ad provider.</li>
            <li>
              You can ask us about the information we hold related to your contact request by
              emailing us.
            </li>
          </ul>

          <h2>Children&apos;s privacy</h2>
          <p>
            This site is intended for adults. We do not knowingly collect personal information from
            children under 13.
          </p>

          <h2>Changes to this policy</h2>
          <p>
            We may update this policy from time to time. Material changes will be reflected by an
            updated date on this page.
          </p>

          <h2>Contact</h2>
          <p>
            Questions about this policy? Reach us through our <Link href="/contact">contact page</Link>.
          </p>
        </div>
      </Container>
    </>
  );
}
