'use client';

import { useState } from 'react';
import type { FaqItem } from '@/lib/types';

/**
 * Accessible FAQ accordion. Uses native <details>-like behavior with buttons so
 * it works without JS too. Pair with faqSchema() for FAQPage JSON-LD.
 */
export function FAQAccordion({ faq, title = 'Frequently Asked Questions' }: { faq: FaqItem[]; title?: string }) {
  if (!faq || faq.length === 0) return null;
  return (
    <section className="not-prose" aria-labelledby="faq-heading">
      <h2 id="faq-heading" className="text-2xl font-semibold text-ink sm:text-3xl">
        {title}
      </h2>
      <div className="mt-5 divide-y divide-slate-200 rounded-xl border border-slate-200">
        {faq.map((item, i) => (
          <FaqRow key={i} item={item} defaultOpen={i === 0} />
        ))}
      </div>
    </section>
  );
}

function FaqRow({ item, defaultOpen }: { item: FaqItem; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(Boolean(defaultOpen));
  return (
    <div>
      <h3 className="!m-0">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-lg font-semibold text-ink hover:bg-slate-50"
        >
          <span>{item.question}</span>
          <span
            aria-hidden="true"
            className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700 transition-transform ${
              open ? 'rotate-45' : ''
            }`}
          >
            +
          </span>
        </button>
      </h3>
      {open && <div className="px-5 pb-5 text-ink-soft">{item.answer}</div>}
    </div>
  );
}
