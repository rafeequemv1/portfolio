import React, { useEffect, useState, useCallback } from 'react';
import { Menu, X } from 'lucide-react';
import type { Session } from '@supabase/supabase-js';
import type { View } from '../types';
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
      <header className="sticky top-0 z-50 flex h-16 w-full shrink-0 items-center justify-between border-b border-[#e0e0e0] bg-[#fcfaf8]/95 px-4 backdrop-blur-md supports-[padding:max(0px)]:pl-[max(12px,env(safe-area-inset-left))] supports-[padding:max(0px)]:pr-[max(12px,env(safe-area-inset-right))] sm:h-20 sm:px-6 md:justify-center md:gap-16 lg:gap-24">
        <a
          href={ROUTES.home}
          onClick={(e) => onNav(e, 'home', ROUTES.home)}
          className="group flex min-w-0 items-center gap-2.5 touch-manipulation sm:gap-3"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#37352f]/5 text-lg transition-colors group-hover:bg-[#37352f]/10">
            🧬
          </span>
          <span className="truncate font-serif text-base font-bold tracking-tight text-[#37352f] transition-opacity group-hover:opacity-80 sm:text-lg">
            Rafeeque Mavoor
          </span>
        </a>

        <nav className="hidden items-center gap-6 text-xs font-bold uppercase tracking-[0.15em] md:flex lg:gap-8" aria-label="Main">
          {navItems.map(({ label, view, path, match }) => (
            <a
              key={path}
              href={path}
              onClick={(e) => onNav(e, view, path)}
              className={`relative py-1 transition-colors duration-200 ${
                match(currentView) ? 'text-[#37352f]' : 'text-[#37352f]/40 hover:text-[#37352f]'
              }`}
            >
              {label}
              {match(currentView) ? <span className="absolute bottom-0 left-0 h-[1.5px] w-full bg-[#37352f]" /> : null}
            </a>
          ))}
          {session ? (
            <a
              href={ROUTES.dashboard}
              onClick={(e) => onNav(e, 'dashboard', ROUTES.dashboard)}
              className={`relative rounded-md border px-3 py-2 transition-colors ${
                currentView === 'dashboard'
                  ? 'border-[#37352f] bg-[#37352f] text-white'
                  : 'border-[#37352f]/20 text-[#37352f] hover:bg-[#37352f]/5'
              }`}
            >
              Dashboard
            </a>
          ) : null}
        </nav>

        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-[#37352f] touch-manipulation hover:bg-[#37352f]/5 md:hidden"
          aria-expanded={menuOpen}
          aria-controls="mobile-nav-panel"
          aria-label="Open menu"
        >
          <Menu size={24} strokeWidth={1.75} />
        </button>
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
            <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto overscroll-y-contain px-2 py-4" aria-label="Mobile main">
              {navItems.map(({ label, view, path, match }) => (
                <a
                  key={path}
                  href={path}
                  onClick={(e) => onNav(e, view, path)}
                  className={`rounded-lg px-4 py-3.5 text-sm font-semibold uppercase tracking-[0.12em] touch-manipulation transition-colors ${
                    match(currentView) ? 'bg-[#37352f]/10 text-[#37352f]' : 'text-[#37352f]/70 hover:bg-[#37352f]/5 hover:text-[#37352f]'
                  }`}
                >
                  {label}
                </a>
              ))}
              {session ? (
                <a
                  href={ROUTES.dashboard}
                  onClick={(e) => onNav(e, 'dashboard', ROUTES.dashboard)}
                  className={`mt-2 rounded-lg px-4 py-3.5 text-sm font-semibold uppercase tracking-[0.12em] touch-manipulation ${
                    currentView === 'dashboard' ? 'bg-[#37352f] text-white' : 'text-[#37352f] hover:bg-[#37352f]/5'
                  }`}
                >
                  Dashboard
                </a>
              ) : null}
              <a
                href={ROUTES.blog}
                onClick={(e) => onNav(e, 'blog', ROUTES.blog)}
                className={`rounded-lg px-4 py-3.5 text-sm font-semibold uppercase tracking-[0.12em] touch-manipulation ${
                  currentView === 'blog' || currentView === 'blog-detail'
                    ? 'bg-[#37352f]/10 text-[#37352f]'
                    : 'text-[#37352f]/70 hover:bg-[#37352f]/5 hover:text-[#37352f]'
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
