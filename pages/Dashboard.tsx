
import React, { useMemo, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../supabase/client';
import JournalCoverManager from '../components/JournalCoverManager';
import WorkshopManager from '../components/WorkshopManager';
import BrandManager from '../components/BrandManager';
import { LayoutDashboard, Image, Calendar, Briefcase, Settings, LogOut, ChevronLeft } from 'lucide-react';

interface DashboardProps {
  session: Session;
  navigate: (e: React.MouseEvent<HTMLButtonElement> | React.MouseEvent<HTMLAnchorElement>, view: any, path: string) => void;
}

type DashboardSection = 'overview' | 'portfolio' | 'workshops' | 'brands' | 'services' | 'settings';

const Dashboard: React.FC<DashboardProps> = ({ session, navigate }) => {
  const [activeSection, setActiveSection] = useState<DashboardSection>('overview');
  const sectionItems = useMemo(
    () => [
      { key: 'overview' as DashboardSection, label: 'Overview', icon: LayoutDashboard },
      { key: 'portfolio' as DashboardSection, label: 'Portfolio', icon: Image },
      { key: 'workshops' as DashboardSection, label: 'Workshops', icon: Calendar },
      { key: 'brands' as DashboardSection, label: 'Brands', icon: Briefcase },
      { key: 'services' as DashboardSection, label: 'Services', icon: Briefcase },
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
        return <JournalCoverManager />;
      case 'workshops':
        return <WorkshopManager />;
      case 'brands':
        return <BrandManager />;
      case 'services':
        return (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <LayoutDashboard className="text-gray-400" />
            </div>
            <h3 className="text-xl font-serif text-[#37352f] mb-2">Coming Soon</h3>
            <p className="text-sm text-[#37352f]/60 max-w-xs">The management interface for {activeSection} is currently under development.</p>
          </div>
        );
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
    <div className="flex-grow w-full max-w-7xl mx-auto p-6 md:p-10 lg:p-12 animate-fade-in-up">
      <div className="grid grid-cols-[220px_1fr] md:grid-cols-[230px_1fr] lg:grid-cols-[240px_1fr] gap-6 md:gap-8 lg:gap-12 items-start">
        <aside className="ml-1 md:ml-2 lg:ml-4">
          <div className="bg-white/80 border border-[#37352f]/10 rounded-2xl p-3">
            <div className="px-2 py-3 mb-2">
              <p className="text-[11px] uppercase tracking-[0.2em] text-[#37352f]/45">Sections</p>
            </div>
            <nav className="space-y-1">
              {sectionItems.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveSection(key)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                    activeSection === key
                      ? 'bg-[#37352f] text-white shadow-sm'
                      : 'text-[#37352f]/70 hover:bg-[#37352f]/5 hover:text-[#37352f]'
                  }`}
                >
                  <Icon size={16} />
                  <span className="font-medium">{label}</span>
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
