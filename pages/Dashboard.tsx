
import React, { useMemo, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../supabase/client';
import JournalCoverManager from '../components/JournalCoverManager';
import WorkshopManager from '../components/WorkshopManager';
import BrandManager from '../components/BrandManager';
import PortfolioVideoManager from '../components/PortfolioVideoManager';
import GraphicalAbstractManager from '../components/GraphicalAbstractManager';
import BlogManager from '../components/BlogManager';
import LabWebsiteManager from '../components/LabWebsiteManager';
import PortfolioFigureManager from '../components/PortfolioFigureManager';
import { LayoutDashboard, Image, Calendar, Briefcase, Settings, LogOut, ChevronLeft, BookOpen, Smartphone, ClipboardList } from 'lucide-react';
import SiteAndAppsManager from '../components/SiteAndAppsManager';
import ServicesAdminPanel from '../components/ServicesAdminPanel';

interface DashboardProps {
  session: Session;
  navigate: (e: React.MouseEvent<HTMLButtonElement> | React.MouseEvent<HTMLAnchorElement>, view: any, path: string) => void;
}

type DashboardSection = 'overview' | 'portfolio' | 'workshops' | 'blog' | 'brands' | 'apps' | 'services' | 'settings';

const Dashboard: React.FC<DashboardProps> = ({ session, navigate }) => {
  const [activeSection, setActiveSection] = useState<DashboardSection>('overview');
  const [portfolioTab, setPortfolioTab] = useState<'covers' | 'videos' | 'figures-abstracts' | 'websites'>('covers');
  const sectionItems = useMemo(
    () => [
      { key: 'overview' as DashboardSection, label: 'Overview', icon: LayoutDashboard },
      { key: 'portfolio' as DashboardSection, label: 'Portfolio', icon: Image },
      { key: 'workshops' as DashboardSection, label: 'Workshops', icon: Calendar },
      { key: 'blog' as DashboardSection, label: 'Blog', icon: BookOpen },
      { key: 'apps' as DashboardSection, label: 'Apps & site', icon: Smartphone },
      { key: 'brands' as DashboardSection, label: 'Brands', icon: Briefcase },
      { key: 'services' as DashboardSection, label: 'Service requests', icon: ClipboardList },
      { key: 'settings' as DashboardSection, label: 'Settings', icon: Settings },
    ],
    []
  );

  const handleLogout = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    await supabase.auth.signOut();
    navigate(e, 'home', '/');
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'portfolio':
        return (
          <div className="space-y-10">
            <div className="inline-flex max-w-full flex-wrap items-center gap-1 rounded-xl border border-[#37352f]/10 bg-[#37352f]/5 p-1">
              <button onClick={() => setPortfolioTab('covers')} className={`px-3 py-2 text-[10px] sm:text-xs uppercase tracking-wider rounded-lg ${portfolioTab === 'covers' ? 'bg-[#37352f] text-white' : 'text-[#37352f]/70 hover:text-[#37352f]'}`}>Covers</button>
              <button onClick={() => setPortfolioTab('videos')} className={`px-3 py-2 text-[10px] sm:text-xs uppercase tracking-wider rounded-lg ${portfolioTab === 'videos' ? 'bg-[#37352f] text-white' : 'text-[#37352f]/70 hover:text-[#37352f]'}`}>Videos</button>
              <button
                onClick={() => setPortfolioTab('figures-abstracts')}
                className={`px-3 py-2 text-[10px] sm:text-xs uppercase tracking-wider rounded-lg ${portfolioTab === 'figures-abstracts' ? 'bg-[#37352f] text-white' : 'text-[#37352f]/70 hover:text-[#37352f]'}`}
              >
                Figures & abstracts
              </button>
              <button onClick={() => setPortfolioTab('websites')} className={`px-3 py-2 text-[10px] sm:text-xs uppercase tracking-wider rounded-lg ${portfolioTab === 'websites' ? 'bg-[#37352f] text-white' : 'text-[#37352f]/70 hover:text-[#37352f]'}`}>Websites</button>
            </div>
            {portfolioTab === 'covers' && <JournalCoverManager />}
            {portfolioTab === 'videos' && <PortfolioVideoManager />}
            {portfolioTab === 'figures-abstracts' && (
              <div className="space-y-10">
                <PortfolioFigureManager />
                <GraphicalAbstractManager />
              </div>
            )}
            {portfolioTab === 'websites' && <LabWebsiteManager />}
          </div>
        );
      case 'workshops':
        return <WorkshopManager />;
      case 'blog':
        return <BlogManager />;
      case 'apps':
        return <SiteAndAppsManager />;
      case 'brands':
        return <BrandManager />;
      case 'services':
        return <ServicesAdminPanel />;
      case 'settings':
        return (
          <div className="max-w-xl">
            <h2 className="text-2xl font-serif text-[#37352f] mb-6">Account Settings</h2>
            <div className="bg-white border border-gray-100 rounded-xl p-6 space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#37352f]/60">Email Address</label>
                <p className="text-sm font-medium text-[#37352f] mt-1">{session.user.email}</p>
              </div>
              <div className="pt-4">
                <button className="text-sm text-red-600 font-medium hover:underline">Change Password</button>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="space-y-6">
            <div className="bg-white border border-[#37352f]/10 rounded-xl p-6">
              <h2 className="text-2xl font-serif text-[#37352f] mb-2">Welcome back</h2>
              <p className="text-sm text-[#37352f]/60">{session.user.email}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {sectionItems
                .filter(({ key }) => key !== 'overview' && key !== 'settings')
                .map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    onClick={() => setActiveSection(key)}
                    className="p-4 bg-white border border-[#37352f]/10 rounded-xl text-left hover:shadow-sm hover:border-[#37352f]/20 transition-all"
                  >
                    <Icon className="text-[#37352f]/70 mb-3" size={18} />
                    <h3 className="text-base font-serif text-[#37352f]">{label}</h3>
                  </button>
                ))}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="mx-auto w-full max-w-7xl flex-grow animate-fade-in-up px-4 py-6 sm:px-6 md:p-10 lg:p-12">
      <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[240px_1fr] lg:items-start lg:gap-12">
        <aside className="min-w-0 lg:ml-2 xl:ml-4">
          <div className="rounded-2xl border border-[#37352f]/10 bg-white/80 p-3">
            <div className="mb-2 px-2 py-3">
              <p className="text-[11px] uppercase tracking-[0.2em] text-[#37352f]/45">Sections</p>
            </div>
            <nav className="-mx-1 flex gap-1 overflow-x-auto overscroll-x-contain px-1 pb-1 lg:mx-0 lg:flex-col lg:space-y-1 lg:overflow-visible lg:px-0 lg:pb-0">
              {sectionItems.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActiveSection(key)}
                  className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm transition-all touch-manipulation sm:gap-3 lg:w-full ${
                    activeSection === key
                      ? 'bg-[#37352f] text-white shadow-sm'
                      : 'text-[#37352f]/70 hover:bg-[#37352f]/5 hover:text-[#37352f]'
                  }`}
                >
                  <Icon size={16} className="shrink-0" />
                  <span className="whitespace-nowrap font-medium">{label}</span>
                </button>
              ))}
            </nav>
            <div className="mt-3 pt-3 border-t border-[#37352f]/10">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut size={16} />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        </aside>

        <div>
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              {activeSection !== 'overview' && (
                <button
                  onClick={() => setActiveSection('overview')}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors text-[#37352f]/40 hover:text-[#37352f]"
                >
                  <ChevronLeft size={18} />
                </button>
              )}
              <h1 className="text-3xl md:text-4xl font-serif text-[#37352f] tracking-tight">
                {activeSection === 'overview'
                  ? 'Admin Dashboard'
                  : activeSection === 'portfolio'
                    ? 'Portfolio'
                    : activeSection === 'apps'
                      ? 'Apps & site'
                      : activeSection === 'services'
                        ? 'Service requests'
                        : activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
              </h1>
            </div>
            <p className="text-[#37352f]/60">
              {activeSection === 'overview'
                ? `Welcome back, ${session.user.email}`
                : `Manage your ${activeSection.replace('-', ' ')} content.`}
            </p>
          </div>

          <div className="min-h-[400px]">
            {renderSection()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
