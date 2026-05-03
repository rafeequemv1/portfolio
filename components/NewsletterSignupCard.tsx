import React from 'react';
import { Newspaper } from 'lucide-react';
import { NEWSLETTER_SUBSCRIBE_URL } from '../utils/newsletter';

/** Reusable Substack signup block for Contact / About. */
const NewsletterSignupCard: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div
    className={`rounded-xl border border-[#37352f]/10 bg-white/80 p-5 shadow-sm ${className}`.trim()}
  >
    <div className="mb-3 flex items-center gap-2 text-[#37352f]">
      <Newspaper className="h-5 w-5 shrink-0 opacity-75" strokeWidth={1.75} aria-hidden />
      <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#37352f]/70">Newsletter</p>
    </div>
    <p className="text-sm leading-relaxed text-[#37352f]/75">
      Free training, tips, and tutorials on scientific illustration—delivered by email.
    </p>
    <p className="mt-2 text-xs leading-relaxed text-[#37352f]/50">
      Prefer Gmail or a personal address; some institute inboxes block newsletter delivery.
    </p>
    <a
      href={NEWSLETTER_SUBSCRIBE_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-4 flex w-full items-center justify-center rounded-lg bg-[#37352f] py-3 text-sm font-semibold text-white transition-colors hover:bg-black"
    >
      Subscribe on Substack
    </a>
  </div>
);

export default NewsletterSignupCard;
