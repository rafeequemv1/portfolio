import React from 'react';
import type { View } from '../types';
import SiteSearch from './SiteSearch';
import SocialProfiles from './SocialProfiles';
import { FOOTER_NAV_LINKS, FOOTER_SITE_TAGLINE, SITE_CONTACT } from '../utils/routes';

const COPYRIGHT_YEAR = new Date().getFullYear();

const FOOTER_MAIN_LINKS = FOOTER_NAV_LINKS.filter(
  (l) => !['Privacy', 'Terms', 'Editorial', 'Site map', 'FAQ'].includes(l.label)
);
const FOOTER_LEGAL_LINKS = FOOTER_NAV_LINKS.filter((l) =>
  ['Privacy', 'Terms', 'Editorial', 'Site map', 'FAQ'].includes(l.label)
);

interface SiteFooterProps {
  navigate: (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>, view: View, path: string) => void;
}

const SiteFooter: React.FC<SiteFooterProps> = ({ navigate }) => {
  const navToSocial = (e: React.MouseEvent<HTMLAnchorElement>, view: View, path: string) => {
    navigate(e, view, path);
  };

  const footerLinkClass =
    'text-[11px] text-[#5c5a57] underline-offset-2 transition-colors hover:text-[#37352f] hover:underline';

  return (
    <footer className="w-full border-t border-[#e0e0e0] bg-[#fcfaf8] px-4 py-8 text-[#37352f]/50 supports-[padding:max(0px)]:pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-6 md:px-10 lg:px-16">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="space-y-3 text-center sm:text-left">
          <p className="site-description text-xs leading-relaxed text-[#5c5a57] sm:max-w-xl">{FOOTER_SITE_TAGLINE}</p>
          <div className="flex flex-col items-center gap-0.5 text-xs text-[#37352f] sm:items-start">
            <a href={`mailto:${SITE_CONTACT.email}`} className="font-medium hover:underline">
              {SITE_CONTACT.email}
            </a>
            <a href={`tel:${SITE_CONTACT.phoneTel}`} className="tabular-nums text-[#5c5a57] hover:underline">
              {SITE_CONTACT.phoneDisplay}
            </a>
          </div>
        </div>

        <div className="grid gap-8 border-t border-[#37352f]/8 pt-8 md:grid-cols-[1fr_minmax(0,11rem)] md:gap-10 lg:grid-cols-[1fr_12rem_1fr]">
          <nav aria-label="Site pages" className="min-w-0">
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#37352f]/40">Pages</p>
            <ul className="grid list-none grid-cols-2 gap-x-4 gap-y-1.5 p-0 sm:grid-cols-3">
              {FOOTER_MAIN_LINKS.map(({ label, path, view }) => (
                <li key={`${path}-${label}`}>
                  <a href={path} onClick={(e) => navigate(e, view, path)} className={footerLinkClass}>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="min-w-0">
            <p className="mb-3 text-center text-[10px] font-semibold uppercase tracking-[0.16em] text-[#37352f]/40 md:text-left">
              Social
            </p>
            <SocialProfiles variant="footer" navigate={navToSocial} />
          </div>

          <div className="min-w-0 md:col-span-2 lg:col-span-1">
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#37352f]/40">Search</p>
            <SiteSearch id="footer-site-search" className="max-w-sm md:max-w-none" />
          </div>
        </div>

        <nav aria-label="Policies" className="flex flex-wrap justify-center gap-x-3 gap-y-1 border-t border-[#37352f]/8 pt-6 md:justify-start">
          {FOOTER_LEGAL_LINKS.map(({ label, path, view }) => (
            <a key={path} href={path} onClick={(e) => navigate(e, view, path)} className={footerLinkClass}>
              {label}
            </a>
          ))}
          <a href="/llm.txt" className={footerLinkClass} rel="noopener">
            Site summary (llm.txt)
          </a>
        </nav>

        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 border-t border-[#37352f]/8 pt-4 text-[10px] text-[#37352f]/45 md:justify-between">
          <span className="font-serif italic">© {COPYRIGHT_YEAR} Rafeeque Mavoor</span>
          <div className="flex items-center gap-4">
            <a
              href="https://www.dmca.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#37352f] hover:underline"
            >
              DMCA
            </a>
            <button
              type="button"
              onClick={(e) => navigate(e, 'login', '/login')}
              className="rounded p-1 text-[#5c5a57] transition-colors hover:bg-[#37352f]/5 hover:text-[#37352f]"
              aria-label="Admin login"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
