import React, { useEffect, useState, useCallback } from 'react';
import { Menu, X } from 'lucide-react';
import type { Session } from '@supabase/supabase-js';
import type { View } from '../types';
import SiteSearch from './SiteSearch';
import { ROUTES } from '../utils/routes';

interface SiteHeaderProps {
  session: Session | null;
  currentView: View;
  navigate: (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>, view: View, path: string) => void;
}

const navItems: { label: string; view: View; path: string; match: (v: View) => boolean }[] = [
  { label: 'Home', view: 'home', path: ROUTES.home, match: (v) => v === 'home' },
  {
    label: 'Portfolio',
    view: 'portfolio',
    path: ROUTES.portfolioCovers,
    match: (v) => v === 'portfolio' || v === 'apps',
  },
  { label: 'Services', view: 'services', path: ROUTES.services, match: (v) => v === 'services' },
  {
    label: 'Workshops',
    view: 'workshops',
    path: ROUTES.workshops,
    match: (v) => v === 'workshops' || v === 'workshop-detail',
  },
  { label: 'About', view: 'about', path: ROUTES.about, match: (v) => v === 'about' },
  { label: 'Contact', view: 'contact', path: ROUTES.contact, match: (v) => v === 'contact' },
];

const navLinkClass = (active: boolean) =>
  `relative whitespace-nowrap py-1 text-sm font-semibold transition-colors ${
    active ? 'text-[#37352f]' : 'text-[#5c5a57] hover:text-[#37352f]'
  }`;

const SiteHeader: React.FC<SiteHeaderProps> = ({ session, currentView, navigate }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  useEffect(() => {
    closeMenu();
  }, [currentView, closeMenu]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMenu();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen, closeMenu]);

  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  const onNav = (e: React.MouseEvent<HTMLAnchorElement>, view: View, path: string) => {
    navigate(e, view, path);
    closeMenu();
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full shrink-0 border-b border-[#e0e0e0] bg-[#fcfaf8]/95 backdrop-blur-md">
        <div className="relative mx-auto flex h-12 max-w-5xl items-center justify-center gap-6 px-11 sm:h-14 sm:gap-8 sm:px-12 lg:gap-10">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="absolute left-1.5 flex h-9 w-9 items-center justify-center rounded-md text-[#37352f] touch-manipulation hover:bg-[#37352f]/5 md:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav-panel"
            aria-label="Open menu"
          >
            <Menu size={20} strokeWidth={1.75} />
          </button>

          <a
            href={ROUTES.home}
            onClick={(e) => onNav(e, 'home', ROUTES.home)}
            className="group flex shrink-0 items-center gap-1.5 touch-manipulation"
          >
            <img
              src="/logo.svg"
              alt="Rafeeque Mavoor logo"
              width={28}
              height={28}
              className="h-7 w-7 rounded-full"
              fetchPriority="high"
            />
            <span className="hidden font-serif text-sm font-medium tracking-tight text-[#37352f] group-hover:opacity-80 sm:inline">
              Rafeeque Mavoor
            </span>
          </a>

          <nav
            className="hidden items-center gap-4 md:flex lg:gap-5"
            aria-label="Main"
            itemScope
            itemType="https://schema.org/SiteNavigationElement"
          >
          {navItems.map(({ label, view, path, match }) => (
            <a
              key={path}
              href={path}
              onClick={(e) => onNav(e, view, path)}
              className={navLinkClass(match(currentView))}
            >
              {label}
              {match(currentView) ? <span className="absolute bottom-0 left-0 h-[1.5px] w-full bg-[#37352f]" /> : null}
            </a>
          ))}
          {session ? (
            <a
              href={ROUTES.dashboard}
              onClick={(e) => onNav(e, 'dashboard', ROUTES.dashboard)}
              className={`rounded border px-2.5 py-1 text-sm font-semibold ${
                currentView === 'dashboard'
                  ? 'border-[#37352f] bg-[#37352f] text-white'
                  : 'border-[#37352f]/20 text-[#37352f] hover:bg-[#37352f]/5'
              }`}
            >
              Admin
            </a>
          ) : null}
        </nav>

          <span className="absolute right-1.5 w-9 md:hidden" aria-hidden />
        </div>
      </header>

      {menuOpen ? (
        <div className="fixed inset-0 z-[100] md:hidden" role="dialog" aria-modal="true" aria-labelledby="mobile-nav-title">
          <button
            type="button"
            className="absolute inset-0 bg-black/35 backdrop-blur-[2px]"
            aria-label="Close menu"
            onClick={closeMenu}
          />
          <aside
            id="mobile-nav-panel"
            className="absolute right-0 top-0 flex h-full w-[min(20rem,88vw)] max-w-[320px] flex-col border-l border-[#37352f]/10 bg-[#fcfaf8] shadow-2xl supports-[padding:max(0px)]:pt-[env(safe-area-inset-top)]"
          >
            <div className="flex items-center justify-between border-b border-[#37352f]/10 px-4 py-3">
              <span id="mobile-nav-title" className="font-serif text-lg font-semibold text-[#37352f]">
                Menu
              </span>
              <button
                type="button"
                onClick={closeMenu}
                className="flex h-11 w-11 items-center justify-center rounded-lg text-[#37352f] touch-manipulation hover:bg-[#37352f]/5"
                aria-label="Close menu"
              >
                <X size={22} strokeWidth={1.75} />
              </button>
            </div>
            <div className="border-b border-[#37352f]/10 px-4 py-3">
              <SiteSearch id="mobile-site-search" />
            </div>
            <nav
              className="flex flex-1 flex-col gap-0.5 overflow-y-auto overscroll-y-contain px-2 py-4"
              aria-label="Mobile main"
              itemScope
              itemType="https://schema.org/SiteNavigationElement"
            >
              {navItems.map(({ label, view, path, match }) => (
                <a
                  key={path}
                  href={path}
                  onClick={(e) => onNav(e, view, path)}
                  className={`rounded-md px-3 py-2.5 text-sm font-semibold touch-manipulation transition-colors ${
                    match(currentView) ? 'bg-[#37352f]/10 text-[#37352f]' : 'text-[#5c5a57] hover:bg-[#37352f]/5 hover:text-[#37352f]'
                  }`}
                >
                  {label}
                </a>
              ))}
              {session ? (
                <a
                  href={ROUTES.dashboard}
                  onClick={(e) => onNav(e, 'dashboard', ROUTES.dashboard)}
                  className={`mt-1 rounded-md px-3 py-2.5 text-sm font-semibold touch-manipulation ${
                    currentView === 'dashboard' ? 'bg-[#37352f] text-white' : 'text-[#37352f] hover:bg-[#37352f]/5'
                  }`}
                >
                  Dashboard
                </a>
              ) : null}
              <a
                href={ROUTES.blog}
                onClick={(e) => onNav(e, 'blog', ROUTES.blog)}
                className={`rounded-md px-3 py-2.5 text-sm font-semibold touch-manipulation ${
                  currentView === 'blog' || currentView === 'blog-detail'
                    ? 'bg-[#37352f]/10 text-[#37352f]'
                    : 'text-[#5c5a57] hover:bg-[#37352f]/5 hover:text-[#37352f]'
                }`}
              >
                Blog
              </a>
            </nav>
          </aside>
        </div>
      ) : null}
    </>
  );
};

export default SiteHeader;
