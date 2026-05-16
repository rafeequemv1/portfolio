import React from 'react';
import type { View } from '../types';
import SiteSearch from './SiteSearch';
import SocialProfiles from './SocialProfiles';
import { FOOTER_NAV_LINKS, FOOTER_SITE_TAGLINE, SITE_CONTACT } from '../utils/routes';

const COPYRIGHT_YEAR = new Date().getFullYear();

interface SiteFooterProps {
  navigate: (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>, view: View, path: string) => void;
}

const SiteFooter: React.FC<SiteFooterProps> = ({ navigate }) => {
  const navToSocial = (e: React.MouseEvent<HTMLAnchorElement>, view: View, path: string) => {
    navigate(e, view, path);
  };

  return (
    <footer className="w-full border-t border-[#e0e0e0] bg-[#fcfaf8] px-4 py-6 text-[#37352f]/50 supports-[padding:max(0px)]:pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-6 md:px-10 lg:px-16">
      <div className="mx-auto flex max-w-4xl flex-col gap-4">
        <p className="site-description text-center text-xs leading-relaxed text-[#5c5a57] sm:text-sm">{FOOTER_SITE_TAGLINE}</p>

        <div className="flex flex-col items-center gap-1 text-center text-sm text-[#37352f]">
          <a href={`mailto:${SITE_CONTACT.email}`} className="font-medium hover:underline">
            {SITE_CONTACT.email}
          </a>
          <a href={`tel:${SITE_CONTACT.phoneTel}`} className="tabular-nums text-[#5c5a57] hover:text-[#37352f] hover:underline">
            {SITE_CONTACT.phoneDisplay}
          </a>
        </div>

        <SiteSearch id="footer-site-search" className="mx-auto flex justify-center px-2" />

        <nav aria-label="Site pages and policies">
          <ul className="flex list-none flex-wrap justify-center gap-x-0 gap-y-1 px-0 text-[10px] leading-tight text-[#5c5a57] sm:text-[11px]">
            {FOOTER_NAV_LINKS.map(({ label, path, view }, i) => (
              <li key={`${path}-${label}`} className="inline-flex items-center">
                {i > 0 ? (
                  <span className="mx-1 select-none text-[#37352f]/20" aria-hidden>
                    ·
                  </span>
                ) : null}
                <a
                  href={path}
                  onClick={(e) => navigate(e, view, path)}
                  className="rounded-sm underline-offset-2 hover:text-[#37352f] hover:underline"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <SocialProfiles variant="footer" navigate={navToSocial} />

        <div className="grid grid-cols-1 items-center gap-3 border-t border-[#37352f]/10 pt-3 text-[10px] text-[#37352f]/45 sm:grid-cols-3 sm:gap-2">
          <span className="text-center font-serif italic sm:text-left">
            © {COPYRIGHT_YEAR} Rafeeque Mavoor · All rights reserved
          </span>
          <a
            href="https://www.dmca.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="justify-self-center text-center underline-offset-2 hover:text-[#37352f] hover:underline"
            title="DMCA.com — copyright protection resources"
          >
            DMCA.com
          </a>
          <button
            type="button"
            onClick={(e) => navigate(e, 'login', '/login')}
            className="justify-self-center rounded-md p-1.5 text-[#5c5a57] transition-colors hover:bg-[#37352f]/5 hover:text-[#37352f] sm:justify-self-end"
            aria-label="Admin login"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
