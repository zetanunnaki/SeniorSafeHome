import type { Metadata } from 'next';
import { PageHero } from '@/components/layout/PageHero';
import { Container } from '@/components/ui/Container';
import { buildMetadata } from '@/lib/seo';
import siteData from '@/data/site.json';
import type { SiteConfig } from '@/lib/types';

const site = siteData as SiteConfig;

export const metadata: Metadata = buildMetadata({
  title: 'Contact SeniorSaferHome',
  description:
    'Get in touch with the SeniorSaferHome editorial team with questions, corrections, or product suggestions.',
  path: '/contact',
});

const crumbs = [
  { name: 'Home', href: '/' },
  { name: 'Contact', href: '/contact' },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Get in touch"
        description="Questions, corrections, or a product we should review? We'd love to hear from you."
        crumbs={crumbs}
      />
      <Container className="py-12">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="prose-ssh">
            <h2>Email us</h2>
            <p>
              The fastest way to reach the editorial team is by email at{' '}
              <a href={`mailto:${site.email}`}>{site.email}</a>. We read every message and aim to
              reply within a few business days.
            </p>
            <h2>What we love to hear about</h2>
            <ul>
              <li>Corrections or updates to a product or guide</li>
              <li>A senior safety product you think we should review</li>
              <li>Questions about choosing the right product for a specific situation</li>
              <li>Accessibility feedback on the site itself</li>
            </ul>
            <p>
              Please note that we provide general safety information, not medical advice. For
              questions about a specific health condition or fall risk, consult a qualified
              healthcare professional.
            </p>
          </div>

          <div>
            <form
              action={`mailto:${site.email}`}
              method="post"
              encType="text/plain"
              className="rounded-2xl border border-slate-200 bg-white p-6"
            >
              <h2 className="text-xl font-semibold text-ink">Send a message</h2>
              <p className="mt-1 text-sm text-ink-muted">
                This form opens your email app. You can also email us directly at {site.email}.
              </p>
              <div className="mt-5 space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-ink">
                    Your name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 focus-visible:border-brand-500"
                  />
                </div>
                <div>
                  <label htmlFor="from" className="block text-sm font-medium text-ink">
                    Your email
                  </label>
                  <input
                    id="from"
                    name="email"
                    type="email"
                    required
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 focus-visible:border-brand-500"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-ink">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    required
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 focus-visible:border-brand-500"
                  />
                </div>
                <button type="submit" className="btn-primary w-full">
                  Open email to send
                </button>
              </div>
            </form>
          </div>
        </div>
      </Container>
    </>
  );
}
