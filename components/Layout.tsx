
import React from 'react';
import { LogOut, Upload as UploadIcon, BarChart2, Radio, Activity, Globe, ShieldCheck } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { DashboardTab } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
  userEmail?: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange, userEmail }) => {
  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-transparent text-slate-200">
      <aside className="w-full md:w-80 md:h-screen flex flex-col command-surface border-r border-white/5 p-10 z-20 sticky top-0 overflow-y-auto custom-scrollbar">
        <div className="flex items-center gap-5 mb-20 group cursor-default">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-700 rounded-[1.25rem] flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.4)] border border-white/20 transition-transform duration-700 group-hover:rotate-12">
            <Radio className="text-white" size={32} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight leading-tight">SOCIAL<span className="text-blue-500">STREAM</span></h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <p className="text-[10px] uppercase tracking-[0.4em] font-black text-slate-500">System Ready</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-3">
          <p className="text-[10px] uppercase font-black text-slate-600 tracking-[0.25em] mb-6 ml-4">Command Center</p>
          
          <button
            onClick={() => onTabChange(DashboardTab.UPLOAD)}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-500 group relative
              ${activeTab === DashboardTab.UPLOAD 
                ? 'bg-blue-600/10 text-white border border-blue-500/40 shadow-xl shadow-blue-500/10' 
                : 'text-slate-500 hover:bg-white/5 hover:text-slate-200 border border-transparent'}
            `}
          >
            {activeTab === DashboardTab.UPLOAD && <div className="absolute left-0 w-1 h-6 bg-blue-500 rounded-full" />}
            <UploadIcon size={20} className={activeTab === DashboardTab.UPLOAD ? 'text-blue-400' : 'group-hover:translate-y-[-2px] transition-transform'} />
            <span className="font-bold tracking-tight">Deployment Hub</span>
          </button>

          <button
            onClick={() => onTabChange(DashboardTab.ANALYTICS)}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-500 group relative
              ${activeTab === DashboardTab.ANALYTICS 
                ? 'bg-purple-600/10 text-white border border-purple-500/40 shadow-xl shadow-purple-500/10' 
                : 'text-slate-500 hover:bg-white/5 hover:text-slate-200 border border-transparent'}
            `}
          >
            {activeTab === DashboardTab.ANALYTICS && <div className="absolute left-0 w-1 h-6 bg-purple-500 rounded-full" />}
            <BarChart2 size={20} className={activeTab === DashboardTab.ANALYTICS ? 'text-purple-400' : 'group-hover:translate-y-[-2px] transition-transform'} />
            <span className="font-bold tracking-tight">Intelligence Brief</span>
          </button>
        </nav>

        <div className="mt-auto pt-10 border-t border-white/5 space-y-6">
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-blue-400">
                <ShieldCheck size={14} />
                <span className="text-[9px] font-black uppercase tracking-widest">Protocol V4.2</span>
              </div>
              <Activity size={12} className="text-emerald-500 animate-pulse" />
            </div>
            <p className="text-[11px] font-bold text-slate-300 truncate opacity-80">{userEmail}</p>
          </div>
          
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-slate-500 hover:text-red-400 hover:bg-red-500/5 transition-all duration-500 group"
          >
            <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-bold tracking-tight">Sign out Protocol</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8 md:p-12 lg:p-20 overflow-y-auto custom-scrollbar relative">
        <div className="max-w-5xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};
