import React, { useState, useEffect } from 'react';
import { AtSign, BookOpen, Instagram, Twitter, Youtube } from 'lucide-react';
import SiteHeader from './components/SiteHeader';
import Home from './pages/Home';
import Contact from './pages/Contact';
import About from './pages/About';
import Services from './pages/Services';
import Workshops from './pages/Workshops';
import WorkshopDetail from './pages/WorkshopDetail';
import Portfolio from './pages/Portfolio';
import Blog from './pages/Blog';
import BlogDetail from './pages/BlogDetail';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import { supabase } from './supabase/client';
import { Session } from '@supabase/supabase-js';
import { View } from './types';

const pathMap: { [key: string]: View } = {
  '/': 'home',
  '/services': 'services',
  '/apps': 'apps',
  '/workshops': 'workshops',
  '/portfolio': 'portfolio',
  '/about': 'about',
  '/blog': 'blog',
  '/contact': 'contact',
  '/login': 'login',
  '/dashboard': 'dashboard',
};

const getViewFromPath = (path: string): View => {
  const pathOnly = path.split('#')[0] || path;
  if (pathOnly.startsWith('/workshops/') && pathOnly.length > '/workshops/'.length) {
    return 'workshop-detail';
  }
  if (pathOnly.startsWith('/blog/') && pathOnly.length > '/blog/'.length) {
    return 'blog-detail';
  }
  return pathMap[pathOnly] || 'home';
};

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(
    getViewFromPath(window.location.pathname + window.location.hash)
  );
  const [currentPath, setCurrentPath] = useState(window.location.pathname + window.location.hash);
  const [session, setSession] = useState<Session | null>(null);

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
      const full = window.location.pathname + window.location.hash;
      setCurrentView(getViewFromPath(full));
      setCurrentPath(full);
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
        path = '/services';
        break;
      case 'apps':
        title = 'Apps & Experiments | Rafeeque Mavoor';
        description = 'A digital garden of tools and experiments by Rafeeque Mavoor, including OpenScienceArt, OceanOfPapers, and other scientific software.';
        path = '/apps';
        break;
      case 'workshops':
        title = 'Workshops & Training | Rafeeque Mavoor';
        description = 'Explore past on-campus and online workshops on scientific illustration and visual communication led by Rafeeque Mavoor.';
        path = '/workshops';
        break;
      case 'workshop-detail':
        break;
      case 'portfolio':
        title = 'Portfolio | Rafeeque Mavoor | Journal Cover Art';
        description = 'A curated selection of journal cover art and scientific illustrations for leading publications like Nature, Science, and Cell.';
        path = '/portfolio';
        break;
      case 'about':
        title = 'About Rafeeque Mavoor | Experience & Education';
        description = "Learn about the professional journey of Rafeeque Mavoor, from a Master's in Chemistry to a leading scientific illustrator and founder of SciDart Academy.";
        path = '/about';
        break;
      case 'blog':
        title = 'Blog | Rafeeque Mavoor | Prompt Engineering, Database, Web Apps';
        description = 'Read insights by Rafeeque Mavoor on prompt engineering, database design, and web app development for science and education.';
        path = '/blog';
        break;
      case 'blog-detail': {
        title = 'Blog | Rafeeque Mavoor';
        description = 'Read insights on scientific communication, prompt engineering, databases, and web app development.';
        path = currentPath.split('#')[0];
        break;
      }
      case 'contact':
        title = 'Contact Rafeeque Mavoor | Scientific Illustration Projects';
        description = 'Get in touch with Rafeeque Mavoor for collaborations, commissions, or mentorship in scientific illustration and visualization.';
        path = '/contact';
        break;
      case 'login':
        title = 'Admin Login | Rafeeque Mavoor';
        description = 'Admin login portal.';
        path = '/login';
        break;
      case 'dashboard':
        title = 'Admin Dashboard | Rafeeque Mavoor';
        description = 'Admin dashboard for managing content.';
        path = '/dashboard';
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
    const currentFull = window.location.pathname + window.location.hash;
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
        return <Home />;
      case 'services':
        return <Services />;
      case 'apps':
        return <Portfolio initialTab="apps" navigate={navigate} />;
      case 'workshops':
        return <Workshops navigate={navigate} />;
      case 'workshop-detail':
        return <WorkshopDetail path={currentPath} navigate={navigate} />;
      case 'portfolio':
        return <Portfolio navigate={navigate} />;
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
        return <Home />;
    }
  };

  return (
    <div className="flex min-h-screen min-h-[100dvh] w-full max-w-[100vw] flex-col bg-[#fcfaf8] text-[#37352f] antialiased">
      <SiteHeader session={session} currentView={currentView} navigate={navigate} />

      <main className="relative flex min-h-0 flex-1 flex-col overflow-x-clip pb-[env(safe-area-inset-bottom,0px)]">
        {renderContent()}
      </main>

      <footer className="flex w-full flex-col items-center justify-between gap-6 border-t border-[#e0e0e0] bg-[#fcfaf8] px-4 py-8 text-xs text-[#37352f]/50 supports-[padding:max(0px)]:pb-[max(2rem,env(safe-area-inset-bottom))] sm:px-6 md:flex-row md:gap-4 md:px-12 lg:px-24 xl:px-32">
        <div className="flex items-center gap-2 text-center font-serif italic md:text-left">
          <span>© {new Date().getFullYear()} Rafeeque Mavoor Studio.</span>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4 md:mt-0 md:justify-end md:gap-6">
            <div className="flex items-center gap-3 text-[#37352f]/45 sm:gap-5 hover:text-[#37352f]/70">
               <a href="/blog" onClick={(e) => navigate(e, 'blog', '/blog')} className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg hover:bg-[#37352f]/5 hover:text-[#37352f] transition-colors" aria-label="Blog" title="Blog">
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
            <button type="button" onClick={(e) => navigate(e, 'login', '/login')} className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-[#37352f]/40 transition-colors hover:bg-[#37352f]/5 hover:text-[#37352f]" aria-label="Admin Login">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
            </button>
        </div>
      </footer>
    </div>
  );
};

export default App;