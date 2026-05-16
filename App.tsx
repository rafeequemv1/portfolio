import React, { useState, useEffect, lazy, Suspense } from 'react';
import BackToTop from './components/BackToTop';
import SiteHeader from './components/SiteHeader';
import SiteFooter from './components/SiteFooter';
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
const Courses = lazy(() => import('./pages/Courses'));
const CourseDetail = lazy(() => import('./pages/CourseDetail'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const EditorialGuidelines = lazy(() => import('./pages/EditorialGuidelines'));
const HtmlSitemap = lazy(() => import('./pages/HtmlSitemap'));
const Faq = lazy(() => import('./pages/Faq'));
import { supabase } from './supabase/client';
import { Session } from '@supabase/supabase-js';
import { View } from './types';
import { applyPageSeo, clearDynamicJsonLd, resolvePageSeo } from './utils/seo';
import { canonicalPathnameIfLegacy, getViewFromPath, pathnameOnly } from './utils/routes';

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
    if (currentView !== 'workshops' && currentView !== 'workshop-detail') {
      clearDynamicJsonLd();
    }

    const seo = resolvePageSeo(currentView, currentPath);
    if (seo) applyPageSeo(seo);
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
      case 'courses':
        return <Courses navigate={navigate} />;
      case 'course-detail':
        return <CourseDetail path={currentPath} navigate={navigate} />;
      case 'contact':
        return <Contact navigate={navigate} />;
      case 'privacy':
        return <PrivacyPolicy />;
      case 'terms':
        return <TermsOfService />;
      case 'editorial':
        return <EditorialGuidelines />;
      case 'html-sitemap':
        return <HtmlSitemap navigate={navigate} />;
      case 'faq':
        return <Faq />;
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

      <SiteFooter navigate={navigate} />
      <BackToTop />
    </div>
  );
};

export default App;