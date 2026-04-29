
import React, { useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../supabase/client';
import JournalCoverManager from '../components/JournalCoverManager';
import { LayoutDashboard, Image, Calendar, Briefcase, Settings, LogOut, ChevronLeft } from 'lucide-react';

interface DashboardProps {
  session: Session;
  navigate: (e: React.MouseEvent<HTMLButtonElement> | React.MouseEvent<HTMLAnchorElement>, view: any, path: string) => void;
}

type DashboardSection = 'overview' | 'journal-covers' | 'portfolio' | 'workshops' | 'services' | 'settings';

const Dashboard: React.FC<DashboardProps> = ({ session, navigate }) => {
  const [activeSection, setActiveSection] = useState<DashboardSection>('overview');

  const handleLogout = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    await supabase.auth.signOut();
    navigate(e, 'home', '/');
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'journal-covers':
        return <JournalCoverManager />;
      case 'portfolio':
      case 'workshops':
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <button 
              onClick={() => setActiveSection('journal-covers')}
              className="p-6 bg-white border border-[#37352f]/10 rounded-xl shadow-sm hover:shadow-md transition-all text-left group"
            >
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
                <Image className="text-blue-600" size={20} />
              </div>
              <h2 className="text-xl font-serif text-[#37352f] mb-2">Journal Covers</h2>
              <p className="text-sm text-[#37352f]/60">Manage high-res cover art, descriptions, and links.</p>
            </button>

            <button 
              onClick={() => setActiveSection('portfolio')}
              className="p-6 bg-white border border-[#37352f]/10 rounded-xl shadow-sm hover:shadow-md transition-all text-left group"
            >
              <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-emerald-100 transition-colors">
                <Briefcase className="text-emerald-600" size={20} />
              </div>
              <h2 className="text-xl font-serif text-[#37352f] mb-2">Portfolio</h2>
              <p className="text-sm text-[#37352f]/60">Update your scientific illustration gallery.</p>
            </button>

            <button 
              onClick={() => setActiveSection('workshops')}
              className="p-6 bg-white border border-[#37352f]/10 rounded-xl shadow-sm hover:shadow-md transition-all text-left group"
            >
              <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-100 transition-colors">
                <Calendar className="text-purple-600" size={20} />
              </div>
              <h2 className="text-xl font-serif text-[#37352f] mb-2">Workshops</h2>
              <p className="text-sm text-[#37352f]/60">Manage upcoming and past training sessions.</p>
            </button>
          </div>
        );
    }
  };

  return (
    <div className="flex-grow w-full max-w-7xl mx-auto p-6 md:p-12 lg:p-16 animate-fade-in-up">
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-4">
            {activeSection !== 'overview' && (
              <button 
                onClick={() => setActiveSection('overview')}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors text-[#37352f]/40 hover:text-[#37352f]"
              >
                <ChevronLeft size={20} />
              </button>
            )}
            <h1 className="text-4xl font-serif text-[#37352f] tracking-tight">
              {activeSection === 'overview' ? 'Admin Dashboard' : 
               activeSection === 'journal-covers' ? 'Journal Covers' : 
               activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
            </h1>
          </div>
          <p className="text-[#37352f]/60">
            {activeSection === 'overview' ? `Welcome back, ${session.user.email}` : `Manage your ${activeSection.replace('-', ' ')} content.`}
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <button
            onClick={() => setActiveSection('settings')}
            className={`p-3 rounded-xl transition-all ${activeSection === 'settings' ? 'bg-[#37352f] text-white' : 'bg-white border border-gray-100 text-[#37352f]/60 hover:bg-gray-50'}`}
            title="Settings"
          >
            <Settings size={20} />
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-50 text-red-600 text-xs font-bold uppercase tracking-widest px-6 py-3 rounded-xl hover:bg-red-100 transition-colors"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>

      <div className="min-h-[400px]">
        {renderSection()}
      </div>
    </div>
  );
};

export default Dashboard;
