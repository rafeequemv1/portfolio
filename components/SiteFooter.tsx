import React from 'react';
import type { View } from '../types';
import { FOOTER_SEO_NAV, ROUTES } from '../utils/routes';

interface SiteFooterProps {
  navigate: (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>, view: View, path: string) => void;
}

const socialLinks: {
  href: string;
  label: string;
  title: string;
  internal?: { view: View; path: string };
}[] = [
  { href: ROUTES.blog, label: 'Blog', title: 'Blog — rafeeque.com/blog', internal: { view: 'blog', path: ROUTES.blog } },
  { href: 'https://twitter.com/rafeequemavoor', label: 'X', title: 'X (Twitter) @rafeequemavoor' },
  { href: 'https://instagram.com/rafeequemavoor', label: 'Instagram', title: 'Instagram @rafeequemavoor' },
  { href: 'https://linkedin.com/in/rafeequemavoor', label: 'LinkedIn', title: 'LinkedIn /in/rafeequemavoor' },
  { href: 'https://facebook.com/rafeequemavoor', label: 'Facebook', title: 'Facebook /rafeequemavoor' },
  { href: 'https://bsky.app/profile/rafeequemavoor', label: 'Bluesky', title: 'Bluesky @rafeequemavoor' },
  { href: 'https://www.threads.net/@rafeequemavoor', label: 'Threads', title: 'Threads @rafeequemavoor' },
  { href: 'https://www.youtube.com/@rafeequemavoor', label: 'YouTube', title: 'YouTube @rafeequemavoor' },
];

const SiteFooter: React.FC<SiteFooterProps> = ({ navigate }) => {
  return (
    <footer className="w-full border-t border-[#e0e0e0] bg-[#fcfaf8] px-4 py-4 text-[#37352f]/50 supports-[padding:max(0px)]:pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-6 md:px-10 lg:px-16">
      <div className="mx-auto flex max-w-4xl flex-col gap-2.5">
        <nav aria-label="Site pages">
          <ul className="flex list-none flex-wrap justify-center gap-x-0 gap-y-0.5 px-0 text-[10px] leading-tight text-[#5c5a57]">
            {FOOTER_SEO_NAV.map(({ label, path, view }, i) => (
              <li key={path} className="inline-flex items-center">
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

        <nav
          aria-label="Social profiles"
          className="flex flex-wrap justify-center gap-x-0 gap-y-0.5 border-t border-[#37352f]/10 pt-2.5 text-[10px] leading-tight text-[#5c5a57]"
        >
          {socialLinks.map(({ href, label, title, internal }, i) => (
            <span key={href} className="inline-flex items-center">
              {i > 0 ? (
                <span className="mx-1 select-none text-[#37352f]/20" aria-hidden>
                  ·
                </span>
              ) : null}
              <a
                href={href}
                title={title}
                {...(internal ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
                onClick={internal ? (e) => navigate(e, internal.view, internal.path) : undefined}
                className="rounded-sm underline-offset-2 hover:text-[#37352f] hover:underline"
              >
                {label}
              </a>
            </span>
          ))}
        </nav>

        <div className="flex items-center justify-between gap-3 border-t border-[#37352f]/10 pt-2.5 text-[10px] text-[#37352f]/45">
          <span className="min-w-0 truncate font-serif italic">© {new Date().getFullYear()} Rafeeque Mavoor</span>
          <button
            type="button"
            onClick={(e) => navigate(e, 'login', '/login')}
            className="shrink-0 rounded-md p-1.5 text-[#5c5a57] transition-colors hover:bg-[#37352f]/5 hover:text-[#37352f]"
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
