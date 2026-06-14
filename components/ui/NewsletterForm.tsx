/**
 * Newsletter sign-up. Static-export friendly: when NEXT_PUBLIC_NEWSLETTER_ACTION
 * is set (a ConvertKit/Beehiiv/Mailchimp form POST URL), it renders a real form
 * that submits straight to the provider — no backend needed. When unset, it
 * shows a disabled "coming soon" placeholder so the layout looks intentional.
 *
 *   NEXT_PUBLIC_NEWSLETTER_ACTION  -> provider form action URL
 *   NEXT_PUBLIC_NEWSLETTER_FIELD   -> email field name (default "email_address")
 */
export function NewsletterForm({ variant = 'dark' }: { variant?: 'dark' | 'light' }) {
  const action = process.env.NEXT_PUBLIC_NEWSLETTER_ACTION;
  const field = process.env.NEXT_PUBLIC_NEWSLETTER_FIELD || 'email_address';
  const live = Boolean(action);

  const inputClass =
    variant === 'dark'
      ? 'w-full rounded-full border border-white/20 bg-white/10 px-5 py-3.5 text-white placeholder:text-white/50'
      : 'w-full rounded-full border border-ink/15 bg-white px-5 py-3.5 text-ink placeholder:text-ink-muted';

  return (
    <form
      action={action || undefined}
      method={live ? 'post' : undefined}
      target="_blank"
      className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
      aria-label="Email sign-up"
    >
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <input
        id="newsletter-email"
        type="email"
        name={field}
        required={live}
        disabled={!live}
        placeholder="you@example.com"
        className={inputClass}
      />
      {/* simple honeypot */}
      <input type="text" name="b_hp" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <button
        type="submit"
        disabled={!live}
        className={`btn-primary whitespace-nowrap ${live ? '' : 'cursor-not-allowed opacity-80'}`}
      >
        {live ? 'Subscribe' : 'Notify me'}
      </button>
    </form>
  );
}
