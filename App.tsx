import React, { useState, useEffect, lazy, Suspense } from 'react';
import { AtSign, BookOpen, Instagram, Twitter, Youtube } from 'lucide-react';
import SiteHeader from './components/SiteHeader';
import Home from './pages/Home';

const Contact = lazy(() => import('./pages/Contact'));
const About = lazy(() => import('./pages/About'));
const Services = lazy(() => import('./pages/Services'));
const Workshops = lazy(() => import('./pages/Workshops'));
const WorkshopDetail = lazy(() => import('./pages/WorkshopDetail'));
const Portfolio = lazy(() => import('./pages/Portfolio'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogDetail = lazy(() => import('./pages/BlogDetail'));
const Login = lazy(() => import('./pages/Login'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
import { supabase } from './supabase/client';
import { Session } from '@supabase/supabase-js';
import { View } from './types';
import {
  applyPageSeo,
  clearDynamicJsonLd,
  workshopsIndexJsonLd,
  WORKSHOP_INDEX_KEYWORDS,
  WORKSHOP_INDEX_DESC,
} from './utils/seo';
import {
  ROUTES,
  canonicalPathnameIfLegacy,
  getViewFromPath,
  pathnameOnly,
  pathnameWithSearch,
  portfolioTabFromPathname,
  PORTFOLIO_SEO,
} from './utils/routes';

function browserPathSearchHash(): string {
  return window.location.pathname + window.location.search + window.location.hash;
}

const routeFallback = (
  <div className="flex flex-1 flex-col items-center justify-center gap-2 py-24 text-sm text-[#5c5a57]" aria-busy="true">
    <span className="h-8 w-8 animate-pulse rounded-full bg-[#37352f]/10" aria-hidden />
    Loading…
  </div>
);

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(getViewFromPath(browserPathSearchHash()));
  const [currentPath, setCurrentPath] = useState(browserPathSearchHash());
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const full = browserPathSearchHash();
    const pathOnly = pathnameOnly(full);
    const canon = canonicalPathnameIfLegacy(pathOnly);
    if (canon && canon !== pathOnly) {
      const rest = full.startsWith(pathOnly) ? full.slice(pathOnly.length) : '';
      window.history.replaceState({}, '', canon + rest);
      setCurrentPath(canon + rest);
      setCurrentView(getViewFromPath(canon + rest));
    }
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session && window.location.pathname === '/login') {
        window.history.pushState({}, '', '/dashboard');
        setCurrentView('dashboard');
        setCurrentPath('/dashboard');
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session && window.location.pathname === '/login') {
        window.history.pushState({}, '', '/dashboard');
        setCurrentView('dashboard');
        setCurrentPath('/dashboard');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const onPopState = () => {
      const full = browserPathSearchHash();
      const pathOnly = pathnameOnly(full);
      const canon = canonicalPathnameIfLegacy(pathOnly);
      if (canon && canon !== pathOnly) {
        const rest = full.startsWith(pathOnly) ? full.slice(pathOnly.length) : '';
        window.history.replaceState({}, '', canon + rest);
        setCurrentView(getViewFromPath(canon + rest));
        setCurrentPath(canon + rest);
      } else {
        setCurrentView(getViewFromPath(full));
        setCurrentPath(full);
      }
      const hash = window.location.hash.slice(1);
      requestAnimationFrame(() => {
        if (hash) {
          document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          window.scrollTo(0, 0);
        }
      });
    };
    window.addEventListener('popstate', onPopState);
    return () => {
      window.removeEventListener('popstate', onPopState);
    };
  }, []);

  useEffect(() => {
    if (currentView === 'workshop-detail' || currentView === 'blog-detail') {
      return;
    }

    if (currentView !== 'workshops') {
      clearDynamicJsonLd();
    }

    let title = '';
    let description = '';
    const baseUrl = 'https://rafeeque.com';
    let path = '';

    switch (currentView) {
      case 'home':
        title = 'Rafeeque Mavoor | Scientific Illustration & 3D Molecular Animation';
        description = 'Portfolio of Rafeeque Mavoor, a scientific illustrator and educator specializing in high-fidelity 3D molecular renders, journal covers, and biomedical animation.';
        path = '/';
        break;
      case 'services':
        title = 'Work With Me | Rafeeque Mavoor | Scientific Illustration Services';
        description = 'Offering professional services in journal cover art, figures & infographics, lab websites, and on-campus workshops for scientists and researchers.';
        path = ROUTES.services;
        break;
      case 'apps': {
        const appsSeo = PORTFOLIO_SEO['websites-apps'];
        title = appsSeo.title;
        description = appsSeo.description;
        path = ROUTES.apps;
        break;
      }
      case 'workshops':
        applyPageSeo({
          title: 'Workshops & Training | Scientific Illustration | Rafeeque Mavoor',
          description: WORKSHOP_INDEX_DESC,
          canonicalPath: ROUTES.workshops,
          keywords: WORKSHOP_INDEX_KEYWORDS,
          ogImage: '/og-image.jpg',
          ogType: 'website',
          jsonLd: workshopsIndexJsonLd(),
        });
        return;
      case 'portfolio': {
        const tab = portfolioTabFromPathname(pathnameOnly(currentPath));
        const seo = PORTFOLIO_SEO[tab];
        title = seo.title;
        description = seo.description;
        path = pathnameWithSearch(currentPath);
        break;
      }
      case 'about':
        title = 'About Rafeeque Mavoor | Experience & Education';
        description = "Learn about the professional journey of Rafeeque Mavoor, from a Master's in Chemistry to a leading scientific illustrator and founder of SciDart Academy.";
        path = ROUTES.about;
        break;
      case 'blog':
        title = 'Blog | Rafeeque Mavoor | Scientific Illustration, Blender, MolDraw';
        description =
          'Articles on scientific illustration, Blender workshops, and open chemistry tools such as MolDraw—a free alternative to ChemDraw for structures and 3D visualization.';
        path = ROUTES.blog;
        break;
      case 'contact':
        title = 'Contact Rafeeque Mavoor | Scientific Illustration Projects';
        description = 'Get in touch with Rafeeque Mavoor for collaborations, commissions, or mentorship in scientific illustration and visualization.';
        path = ROUTES.contact;
        break;
      case 'login':
        title = 'Admin Login | Rafeeque Mavoor';
        description = 'Admin login portal.';
        path = ROUTES.login;
        break;
      case 'dashboard':
        title = 'Admin Dashboard | Rafeeque Mavoor';
        description = 'Admin dashboard for managing content.';
        path = ROUTES.dashboard;
        break;
    }
    
    if (title) document.title = title;
    if (description) document.querySelector('meta[name="description"]')?.setAttribute('content', description);
    
    const fullUrl = `${baseUrl}${path}`;
    if(path) {
      document.querySelector('link[rel="canonical"]')?.setAttribute('href', fullUrl);
      document.querySelector('meta[property="og:title"]')?.setAttribute('content', title);
      document.querySelector('meta[property="og:description"]')?.setAttribute('content', description);
      document.querySelector('meta[property="og:url"]')?.setAttribute('content', fullUrl);
      document.querySelector('meta[name="twitter:title"]')?.setAttribute('content', title);
      document.querySelector('meta[name="twitter:description"]')?.setAttribute('content', description);
    }

  }, [currentView, currentPath]);

  const navigate = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>, _view: View, path: string) => {
    e.preventDefault();
    const pathOnly = path.split('#')[0] || path;
    const hash = path.includes('#') ? path.slice(path.indexOf('#') + 1) : '';
    const currentFull = browserPathSearchHash();
    if (currentFull !== path) {
      try {
        window.history.pushState({}, '', path);
      } catch (error) {
        console.warn('history.pushState failed, likely in a sandboxed environment. Falling back to state-only navigation.', error);
      }
      setCurrentView(getViewFromPath(pathOnly));
      setCurrentPath(pathOnly + (hash ? `#${hash}` : ''));
      requestAnimationFrame(() => {
        if (hash) {
          document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          window.scrollTo(0, 0);
        }
      });
    } else if (hash) {
      document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const renderContent = () => {
    switch (currentView) {
      case 'home':
        return <Home navigate={navigate} />;
      case 'services':
        return <Services />;
      case 'apps':
        return <Portfolio path={currentPath} navigate={navigate} />;
      case 'workshops':
        return <Workshops navigate={navigate} />;
      case 'workshop-detail':
        return <WorkshopDetail path={currentPath} navigate={navigate} />;
      case 'portfolio':
        return <Portfolio path={currentPath} navigate={navigate} />;
      case 'about':
        return <About />;
      case 'blog':
        return <Blog navigate={navigate} />;
      case 'blog-detail':
        return <BlogDetail path={currentPath} navigate={navigate} />;
      case 'contact':
        return <Contact navigate={navigate} />;
      case 'login':
        return <Login session={session} navigate={navigate} />;
      case 'dashboard':
        return session ? <Dashboard session={session} navigate={navigate} /> : <Login session={session} navigate={navigate} />;
      default:
        return <Home navigate={navigate} />;
    }
  };

  return (
    <div className="flex min-h-screen min-h-[100dvh] w-full max-w-[100vw] flex-col bg-[#fcfaf8] text-[#37352f] antialiased">
      <SiteHeader session={session} currentView={currentView} navigate={navigate} />

      <main className="relative flex min-h-0 flex-1 flex-col overflow-x-clip pb-[env(safe-area-inset-bottom,0px)]">
        <Suspense fallback={routeFallback}>{renderContent()}</Suspense>
      </main>

      <footer className="flex w-full flex-col items-center justify-between gap-6 border-t border-[#e0e0e0] bg-[#fcfaf8] px-4 py-8 text-xs text-[#37352f]/50 supports-[padding:max(0px)]:pb-[max(2rem,env(safe-area-inset-bottom))] sm:px-6 md:flex-row md:gap-4 md:px-12 lg:px-24 xl:px-32">
        <div className="flex items-center gap-2 text-center font-serif italic md:text-left">
          <span>© {new Date().getFullYear()} Rafeeque Mavoor Studio.</span>
        </div>
        <div className="flex flex-col items-center gap-4 md:items-end">
            <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-sm font-normal text-[#5c5a57]" aria-label="Site sections">
              <a href={ROUTES.workshops} onClick={(e) => navigate(e, 'workshops', ROUTES.workshops)} className="min-h-[44px] inline-flex items-center rounded-md px-1 underline-offset-4 hover:text-[#37352f] hover:underline">
                Workshops
              </a>
              <a href={ROUTES.blog} onClick={(e) => navigate(e, 'blog', ROUTES.blog)} className="min-h-[44px] inline-flex items-center rounded-md px-1 underline-offset-4 hover:text-[#37352f] hover:underline">
                Blog
              </a>
            </nav>
            <div className="flex flex-wrap items-center justify-center gap-4 md:justify-end md:gap-6">
            <div className="flex items-center gap-3 text-[#5c5a57] sm:gap-5 hover:text-[#37352f]">
               <a href={ROUTES.blog} onClick={(e) => navigate(e, 'blog', ROUTES.blog)} className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg hover:bg-[#37352f]/5 hover:text-[#37352f] transition-colors" aria-label="Blog" title="Blog">
                 <BookOpen className="h-5 w-5" strokeWidth={1.75} />
               </a>
               <a href="https://twitter.com/rafeequemavoor" target="_blank" rel="noopener noreferrer" className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg hover:bg-[#37352f]/5 hover:text-[#37352f] transition-colors" aria-label="Twitter / X" title="Twitter">
                 <Twitter className="h-5 w-5" strokeWidth={1.75} />
               </a>
               <a href="https://instagram.com/rafeequemavoor" target="_blank" rel="noopener noreferrer" className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg hover:bg-[#37352f]/5 hover:text-[#37352f] transition-colors" aria-label="Instagram" title="Instagram">
                 <Instagram className="h-5 w-5" strokeWidth={1.75} />
               </a>
               <a href="https://bsky.app/profile/rafeequemavoor" target="_blank" rel="noopener noreferrer" className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg hover:bg-[#37352f]/5 hover:text-[#37352f] transition-colors" aria-label="Bluesky" title="Bluesky">
                 <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565.139 1.908 0 3.08 0 3.768c0 .69.378 5.65.624 6.479.815 2.736 3.713 3.66 6.383 3.364.136-.02.275-.039.415-.054-.138.022-.276.04-.415.054-3.928.58-7.414 2.01-6.378 7.972 1.008 5.337 7.406 4.054 10.092 2.097 2.686-1.957 4.206-6.352 4.206-6.352s1.52 4.395 4.206 6.352c2.686 1.957 9.084 3.24 10.092-2.097 1.036-5.962-2.45-7.392-6.378-7.972-.139-.014-.277-.032-.415-.054.14.015.279.034.415.054 2.67.296 5.568-.628 6.383-3.364.246-.828.624-5.79.624-6.478 0-.69-.139-1.86-.902-2.206-.659-.298-1.664-.62-4.3 1.24C16.046 4.748 13.087 8.687 12 10.8z"/></svg>
               </a>
               <a href="https://www.threads.net/@rafeequemavoor" target="_blank" rel="noopener noreferrer" className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg hover:bg-[#37352f]/5 hover:text-[#37352f] transition-colors" aria-label="Threads" title="Threads">
                 <AtSign className="h-5 w-5" strokeWidth={1.75} />
               </a>
               <a href="https://www.youtube.com/@rafeequemavoor" target="_blank" rel="noopener noreferrer" className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg hover:bg-[#37352f]/5 hover:text-[#37352f] transition-colors" aria-label="YouTube" title="YouTube">
                 <Youtube className="h-5 w-5" strokeWidth={1.75} />
               </a>
            </div>
            <div className="hidden h-6 w-px bg-[#37352f]/10 md:block" aria-hidden />
            <button type="button" onClick={(e) => navigate(e, 'login', '/login')} className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-[#5c5a57] transition-colors hover:bg-[#37352f]/5 hover:text-[#37352f]" aria-label="Admin Login">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
            </button>
            </div>
        </div>
      </footer>
    </div>
  );
};

export default App;