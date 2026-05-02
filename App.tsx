
import React, { useState, useEffect } from 'react';
import { AtSign, BookOpen, Instagram, Twitter, Youtube } from 'lucide-react';
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
    <div className="min-h-screen w-full flex flex-col bg-[#fcfaf8] text-[#37352f]">
      
      <header className="w-full h-20 border-b border-[#e0e0e0] flex items-center justify-between md:justify-center px-8 md:gap-16 lg:gap-24 sticky top-0 bg-[#fcfaf8]/90 backdrop-blur-md z-50 transition-all duration-300">
        
        <a href="/" onClick={(e) => navigate(e, 'home', '/')} className="flex items-center gap-3 group">
          <span className="text-xl bg-[#37352f]/5 w-8 h-8 flex items-center justify-center rounded-full group-hover:bg-[#37352f]/10 transition-colors">🧬</span>
          <span className="font-serif text-lg font-bold text-[#37352f] tracking-tight group-hover:opacity-70 transition-opacity">Rafeeque Mavoor</span>
        </a>
        
        <nav className="hidden md:flex items-center gap-8 text-xs uppercase tracking-[0.15em] font-bold">
          <a href="/" onClick={(e) => navigate(e, 'home', '/')} className={`transition-all duration-200 relative py-1 ${currentView === 'home' ? 'text-[#37352f]' : 'text-[#37352f]/40 hover:text-[#37352f]'}`}>Home{currentView === 'home' && <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#37352f]"></span>}</a>
          <a href="/portfolio" onClick={(e) => navigate(e, 'portfolio', '/portfolio')} className={`transition-all duration-200 relative py-1 ${currentView === 'portfolio' ? 'text-[#37352f]' : 'text-[#37352f]/40 hover:text-[#37352f]'}`}>Portfolio{currentView === 'portfolio' && <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#37352f]"></span>}</a>
          <a href="/services" onClick={(e) => navigate(e, 'services', '/services')} className={`transition-all duration-200 relative py-1 ${currentView === 'services' ? 'text-[#37352f]' : 'text-[#37352f]/40 hover:text-[#37352f]'}`}>Services{currentView === 'services' && <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#37352f]"></span>}</a>
          <a href="/workshops" onClick={(e) => navigate(e, 'workshops', '/workshops')} className={`transition-all duration-200 relative py-1 ${['workshops', 'workshop-detail'].includes(currentView) ? 'text-[#37352f]' : 'text-[#37352f]/40 hover:text-[#37352f]'}`}>Workshops{['workshops', 'workshop-detail'].includes(currentView) && <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#37352f]"></span>}</a>
          <a href="/about" onClick={(e) => navigate(e, 'about', '/about')} className={`transition-all duration-200 relative py-1 ${currentView === 'about' ? 'text-[#37352f]' : 'text-[#37352f]/40 hover:text-[#37352f]'}`}>About{currentView === 'about' && <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#37352f]"></span>}</a>
          <a href="/contact" onClick={(e) => navigate(e, 'contact', '/contact')} className={`transition-all duration-200 relative py-1 ${currentView === 'contact' ? 'text-[#37352f]' : 'text-[#37352f]/40 hover:text-[#37352f]'}`}>Contact{currentView === 'contact' && <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#37352f]"></span>}</a>
          {session && (
            <a href="/dashboard" onClick={(e) => navigate(e, 'dashboard', '/dashboard')} className={`transition-all duration-200 relative py-2 px-3 rounded-md border ${currentView === 'dashboard' ? 'bg-[#37352f] text-white border-[#37352f]' : 'text-[#37352f] border-[#37352f]/20 hover:bg-[#37352f]/5'}`}>Dashboard</a>
          )}
        </nav>

        <div className="md:hidden flex gap-4 text-xs font-bold uppercase tracking-wider">
             <button onClick={(e) => navigate(e, 'portfolio', '/portfolio')} className={currentView === 'portfolio' ? 'text-black' : 'text-gray-400'}>Portfolio</button>
             <button onClick={(e) => navigate(e, 'services', '/services')} className={currentView === 'services' ? 'text-black' : 'text-gray-400'}>Services</button>
             <button onClick={(e) => navigate(e, 'workshops', '/workshops')} className={['workshops', 'workshop-detail'].includes(currentView) ? 'text-black' : 'text-gray-400'}>Workshops</button>
             <button onClick={(e) => navigate(e, 'about', '/about')} className={currentView === 'about' ? 'text-black' : 'text-gray-400'}>About</button>
             <button onClick={(e) => navigate(e, 'contact', '/contact')} className={currentView === 'contact' ? 'text-black' : 'text-gray-400'}>Contact</button>
             {session && <button onClick={(e) => navigate(e, 'dashboard', '/dashboard')} className={currentView === 'dashboard' ? 'text-black' : 'text-gray-400'}>Dashboard</button>}
        </div>
      </header>

      <main className="relative flex flex-grow flex-col overflow-x-clip">
        {renderContent()}
      </main>

      <footer className="w-full border-t border-[#e0e0e0] py-8 px-8 md:px-24 lg:px-32 flex flex-col md:flex-row items-center justify-between text-xs text-[#37352f]/50 bg-[#fcfaf8]">
        <div className="flex items-center gap-2 font-serif italic">
           <span>© {new Date().getFullYear()} Rafeeque Mavoor Studio.</span>
        </div>
        <div className="flex items-center gap-6 mt-4 md:mt-0">
            <div className="flex items-center gap-5 text-[#37352f]/45 hover:text-[#37352f]/70">
               <a href="/blog" onClick={(e) => navigate(e, 'blog', '/blog')} className="hover:text-[#37352f] transition-colors p-1" aria-label="Blog" title="Blog">
                 <BookOpen className="h-4 w-4" strokeWidth={1.75} />
               </a>
               <a href="https://twitter.com/rafeequemavoor" target="_blank" rel="noopener noreferrer" className="hover:text-[#37352f] transition-colors p-1" aria-label="Twitter / X" title="Twitter">
                 <Twitter className="h-4 w-4" strokeWidth={1.75} />
               </a>
               <a href="https://instagram.com/rafeequemavoor" target="_blank" rel="noopener noreferrer" className="hover:text-[#37352f] transition-colors p-1" aria-label="Instagram" title="Instagram">
                 <Instagram className="h-4 w-4" strokeWidth={1.75} />
               </a>
               <a href="https://bsky.app/profile/rafeequemavoor" target="_blank" rel="noopener noreferrer" className="hover:text-[#37352f] transition-colors p-1" aria-label="Bluesky" title="Bluesky">
                 <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565.139 1.908 0 3.08 0 3.768c0 .69.378 5.65.624 6.479.815 2.736 3.713 3.66 6.383 3.364.136-.02.275-.039.415-.054-.138.022-.276.04-.415.054-3.928.58-7.414 2.01-6.378 7.972 1.008 5.337 7.406 4.054 10.092 2.097 2.686-1.957 4.206-6.352 4.206-6.352s1.52 4.395 4.206 6.352c2.686 1.957 9.084 3.24 10.092-2.097 1.036-5.962-2.45-7.392-6.378-7.972-.139-.014-.277-.032-.415-.054.14.015.279.034.415.054 2.67.296 5.568-.628 6.383-3.364.246-.828.624-5.79.624-6.478 0-.69-.139-1.86-.902-2.206-.659-.298-1.664-.62-4.3 1.24C16.046 4.748 13.087 8.687 12 10.8z"/></svg>
               </a>
               <a href="https://www.threads.net/@rafeequemavoor" target="_blank" rel="noopener noreferrer" className="hover:text-[#37352f] transition-colors p-1" aria-label="Threads" title="Threads">
                 <AtSign className="h-4 w-4" strokeWidth={1.75} />
               </a>
               <a href="https://www.youtube.com/@rafeequemavoor" target="_blank" rel="noopener noreferrer" className="hover:text-[#37352f] transition-colors p-1" aria-label="YouTube" title="YouTube">
                 <Youtube className="h-4 w-4" strokeWidth={1.75} />
               </a>
            </div>
            <div className="h-4 w-[1px] bg-[#37352f]/10 hidden md:block"></div>
            <button onClick={(e) => navigate(e, 'login', '/login')} className="text-[#37352f]/40 hover:text-[#37352f] transition-colors" aria-label="Admin Login">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
            </button>
        </div>
      </footer>
    </div>
  );
};

export default App;