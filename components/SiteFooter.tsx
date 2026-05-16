import React from 'react';
import { BookOpen, Facebook, Instagram, Linkedin, Twitter, Youtube } from 'lucide-react';
import type { View } from '../types';
import SiteSearch from './SiteSearch';
import { FOOTER_NAV_LINKS, FOOTER_SITE_TAGLINE, ROUTES, SITE_CONTACT } from '../utils/routes';

const COPYRIGHT_YEAR = new Date().getFullYear();

interface SiteFooterProps {
  navigate: (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>, view: View, path: string) => void;
}

const iconLinkClass =
  'inline-flex h-8 w-8 items-center justify-center rounded-full text-[#37352f]/55 transition-colors hover:bg-[#37352f]/8 hover:text-[#37352f]';

function MediumIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zm7.42 0c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42zm3.38 0c0 2.96-1.3 5.36-2.9 5.36s-2.9-2.4-2.9-5.36 1.3-5.36 2.9-5.36 2.9 2.4 2.9 5.36z" />
    </svg>
  );
}

function BlueskyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M6.5 4.5C8.5 8 12 11.5 12 11.5s3.5-3.5 5.5-7C19 6 21 8 21 10.5c0 5-4.5 8.5-9 12.5C7.5 19 3 15.5 3 10.5 3 8 5 6 6.5 4.5z" />
    </svg>
  );
}

const SiteFooter: React.FC<SiteFooterProps> = ({ navigate }) => {
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

        <nav aria-label="Social profiles" className="flex flex-wrap items-center justify-center gap-0.5 border-t border-[#37352f]/10 pt-3">
          <a
            href={ROUTES.blog}
            title="Blog"
            aria-label="Blog"
            className={iconLinkClass}
            onClick={(e) => {
              e.preventDefault();
              navigate(e, 'blog', ROUTES.blog);
            }}
          >
            <BookOpen size={16} strokeWidth={1.75} />
          </a>
          <a
            href="https://medium.com/@rafeequemavoor"
            target="_blank"
            rel="noopener noreferrer"
            title="Medium @rafeequemavoor"
            aria-label="Medium"
            className={iconLinkClass}
          >
            <MediumIcon className="h-4 w-4" />
          </a>
          <a
            href="https://twitter.com/rafeequemavoor"
            target="_blank"
            rel="noopener noreferrer"
            title="X @rafeequemavoor"
            aria-label="X (Twitter)"
            className={iconLinkClass}
          >
            <Twitter size={16} strokeWidth={1.75} />
          </a>
          <a
            href="https://instagram.com/rafeequemavoor"
            target="_blank"
            rel="noopener noreferrer"
            title="Instagram @rafeequemavoor"
            aria-label="Instagram"
            className={iconLinkClass}
          >
            <Instagram size={16} strokeWidth={1.75} />
          </a>
          <a
            href="https://linkedin.com/in/rafeequemavoor"
            target="_blank"
            rel="noopener noreferrer"
            title="LinkedIn"
            aria-label="LinkedIn"
            className={iconLinkClass}
          >
            <Linkedin size={16} strokeWidth={1.75} />
          </a>
          <a
            href="https://www.facebook.com/rafeequemvr/"
            target="_blank"
            rel="noopener noreferrer"
            title="Facebook"
            aria-label="Facebook"
            className={iconLinkClass}
          >
            <Facebook size={16} strokeWidth={1.75} />
          </a>
          <a
            href="https://bsky.app/profile/rafeequemavoor"
            target="_blank"
            rel="noopener noreferrer"
            title="Bluesky @rafeequemavoor"
            aria-label="Bluesky"
            className={iconLinkClass}
          >
            <BlueskyIcon className="h-4 w-4" />
          </a>
          <a
            href="https://www.threads.net/@rafeequemavoor"
            target="_blank"
            rel="noopener noreferrer"
            title="Threads @rafeequemavoor"
            aria-label="Threads"
            className={iconLinkClass}
          >
            <span className="text-sm font-semibold leading-none" aria-hidden>
              @
            </span>
          </a>
          <a
            href="https://www.youtube.com/@rafeeque-mavoor"
            target="_blank"
            rel="noopener noreferrer"
            title="YouTube @rafeeque-mavoor"
            aria-label="YouTube"
            className={iconLinkClass}
          >
            <Youtube size={16} strokeWidth={1.75} />
          </a>
        </nav>

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
