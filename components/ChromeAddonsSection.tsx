import React from 'react';
import type { AppNavigate } from '../types';
import { ROUTES } from '../utils/routes';

interface ChromeAddonsSectionProps {
  navigate?: AppNavigate;
}

const ChromeAddonsSection: React.FC<ChromeAddonsSectionProps> = ({ navigate }) => {
  const handlePolicyClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!navigate) return;
    navigate(e, 'clipper-privacy', ROUTES.clipperPrivacyPolicy);
  };

  return (
    <section className="rounded-2xl border border-[#37352f]/10 bg-white/80 p-6 shadow-sm" aria-labelledby="chrome-addons-heading">
      <div className="mb-5 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#37352f]/45">Chrome Add-ons</p>
        <h2 id="chrome-addons-heading" className="mt-1 font-serif text-2xl tracking-tight text-[#37352f]">
          Browser tools for content workflows
        </h2>
      </div>

      <a
        href={ROUTES.clipperPrivacyPolicy}
        onClick={handlePolicyClick}
        className="group block rounded-xl border border-[#37352f]/10 bg-[#fcfaf8] p-5 transition-all hover:-translate-y-0.5 hover:border-[#37352f]/20 hover:bg-white hover:shadow-md"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#37352f] font-serif text-2xl text-white shadow-sm">
            C
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-serif text-xl tracking-tight text-[#37352f]">Clipper</h3>
              <span className="rounded-full border border-[#37352f]/10 bg-white px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#37352f]/50">
                Chrome extension
              </span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-[#5c5a57]">
              Save social media posts, collect content ideas, write drafts, and plan publishing from Chrome.
            </p>
            <p className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#37352f]/55 transition-colors group-hover:text-[#37352f]">
              View privacy policy for Chrome Web Store
            </p>
          </div>
        </div>
      </a>
    </section>
  );
};

export default ChromeAddonsSection;
