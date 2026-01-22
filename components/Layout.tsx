
import React from 'react';
import { LogOut, Upload as UploadIcon, BarChart2, Radio, Activity, ShieldCheck } from 'lucide-react';
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
      <aside className="w-full md:w-80 md:h-screen flex flex-col command-surface border-r border-white/5 p-8 z-20 sticky top-0 overflow-y-auto custom-scrollbar">
        <div className="flex items-center gap-4 mb-16 group cursor-default">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.3)] border border-white/10 transition-transform duration-500 group-hover:rotate-12">
            <Radio className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-xl font-black text-white tracking-tight leading-tight uppercase">Stream<span className="text-blue-500">Hub</span></h1>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <p className="text-[9px] uppercase tracking-[0.4em] font-black text-slate-500">Encrypted</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          <p className="text-[9px] uppercase font-black text-slate-600 tracking-[0.3em] mb-4 ml-3">System Access</p>
          
          <button
            onClick={() => onTabChange(DashboardTab.UPLOAD)}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 group relative
              ${activeTab === DashboardTab.UPLOAD 
                ? 'bg-blue-600/10 text-white border border-blue-500/30' 
                : 'text-slate-500 hover:bg-white/5 hover:text-slate-300 border border-transparent'}
            `}
          >
            <UploadIcon size={18} className={activeTab === DashboardTab.UPLOAD ? 'text-blue-400' : 'group-hover:translate-y-[-1px] transition-transform'} />
            <span className="font-bold tracking-tight text-sm">Deployment Hub</span>
          </button>

          <button
            onClick={() => onTabChange(DashboardTab.ANALYTICS)}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 group relative
              ${activeTab === DashboardTab.ANALYTICS 
                ? 'bg-purple-600/10 text-white border border-purple-500/30' 
                : 'text-slate-500 hover:bg-white/5 hover:text-slate-300 border border-transparent'}
            `}
          >
            <BarChart2 size={18} className={activeTab === DashboardTab.ANALYTICS ? 'text-purple-400' : 'group-hover:translate-y-[-1px] transition-transform'} />
            <span className="font-bold tracking-tight text-sm">Intelligence Brief</span>
          </button>
        </nav>

        <div className="mt-auto pt-8 border-t border-white/5 space-y-4">
          <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-blue-400">
                <ShieldCheck size={12} />
                <span className="text-[8px] font-black uppercase tracking-widest">Protocol Active</span>
              </div>
              <Activity size={10} className="text-emerald-500" />
            </div>
            <p className="text-[10px] font-bold text-slate-400 truncate opacity-70">{userEmail}</p>
          </div>
          
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-slate-600 hover:text-red-400 hover:bg-red-500/5 transition-all duration-300 group"
          >
            <LogOut size={18} className="group-hover:translate-x-[-2px] transition-transform" />
            <span className="font-bold tracking-tight text-sm">Sign out Relay</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8 md:p-16 lg:p-24 overflow-y-auto custom-scrollbar relative">
        <div className="max-w-4xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};
