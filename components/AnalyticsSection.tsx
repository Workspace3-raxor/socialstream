
import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Calendar, BarChart3, Clock, LayoutGrid, CheckCircle, Database, Loader2, ArrowUpRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { UserUpload } from '../types';
import { SOCIAL_PLATFORMS } from '../constants';

export const AnalyticsSection: React.FC = () => {
  const [uploads, setUploads] = useState<UserUpload[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalMonth: 0,
    totalAllTime: 0,
    platformData: [] as any[]
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('user_uploads')
        .select('*')
        .eq('user_id', user.id)
        .order('uploaded_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      if (data) {
        setUploads(data);
        processStats(data);
      }
    } catch (err) {
      console.error('Data Fetch Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const processStats = (data: UserUpload[]) => {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthUploads = data.filter(u => new Date(u.uploaded_at) >= monthStart).length;
    
    const platformCounts: Record<string, number> = {};
    data.forEach(upload => {
      upload.platforms.forEach(p => {
        platformCounts[p] = (platformCounts[p] || 0) + 1;
      });
    });

    const chartData = SOCIAL_PLATFORMS.map(p => ({
      name: p.label,
      count: platformCounts[p.id] || 0,
      color: p.color
    })).filter(d => d.count > 0);

    setStats({
      totalMonth: monthUploads,
      totalAllTime: data.length,
      platformData: chartData
    });
  };

  if (loading) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center text-slate-600 gap-6">
        <div className="relative">
          <Loader2 className="animate-spin text-blue-500" size={60} strokeWidth={1} />
          <div className="absolute inset-0 bg-blue-500/20 blur-[20px] rounded-full animate-pulse"></div>
        </div>
        <p className="mono text-xs uppercase tracking-[0.4em] font-black">Syncing Intelligence Grid...</p>
      </div>
    );
  }

  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-12 duration-1000">
       <div className="space-y-2">
          <div className="flex items-center gap-3 text-purple-500 font-black text-[10px] uppercase tracking-[0.4em] mb-4">
            Briefing ID: {(Math.random() * 10000).toFixed(0)}
          </div>
          <h2 className="text-6xl font-black text-white tracking-tighter leading-none">Intelligence Brief</h2>
          <p className="text-slate-500 text-xl font-medium tracking-tight">Real-time telemetry and cross-platform performance metrics.</p>
        </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[
          { label: 'Current Cycle', val: stats.totalMonth, icon: Calendar, color: 'text-blue-500' },
          { label: 'System Lifetime', val: stats.totalAllTime, icon: Database, color: 'text-purple-500' },
          { label: 'Encryption Sync', val: 'Active', icon: CheckCircle, color: 'text-emerald-500' }
        ].map((item, idx) => (
          <div key={idx} className="command-surface p-10 rounded-[2.5rem] space-y-4 group hover:scale-[1.03] transition-all duration-500">
            <div className={`flex items-center justify-between ${item.color}`}>
              <item.icon size={24} strokeWidth={2.5} />
              <ArrowUpRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="text-5xl font-black text-white tracking-tighter mono">{item.val}</div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">{item.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7 command-surface p-10 rounded-[3rem] space-y-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500">
                <BarChart3 size={24} />
              </div>
              <h3 className="text-2xl font-black text-white tracking-tight uppercase">Platform Density</h3>
            </div>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.platformData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#475569" fontSize={10} fontWeight="bold" tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#475569" fontSize={10} fontWeight="bold" tickLine={false} axisLine={false} dx={-10} />
                <Tooltip 
                  cursor={{fill: 'rgba(255,255,255,0.03)'}}
                  contentStyle={{ backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '16px', color: '#f8fafc', fontWeight: 'bold' }}
                />
                <Bar dataKey="count" radius={[8, 8, 8, 8]} barSize={40}>
                  {stats.platformData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-5 command-surface p-10 rounded-[3rem] space-y-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-500">
              <Clock size={24} />
            </div>
            <h3 className="text-2xl font-black text-white tracking-tight uppercase">Recent Relay Logs</h3>
          </div>
          <div className="space-y-6">
            {uploads.map((upload) => (
              <div key={upload.id} className="flex items-center justify-between group cursor-default">
                <div className="space-y-1">
                  <div className="text-sm font-black text-slate-200 uppercase tracking-wide group-hover:text-blue-400 transition-colors truncate max-w-[180px]">
                    {upload.filename}
                  </div>
                  <div className="text-[9px] mono text-slate-600 font-bold uppercase tracking-widest">
                    TS: {new Date(upload.uploaded_at).toLocaleTimeString()} / {new Date(upload.uploaded_at).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex -space-x-2">
                    {upload.platforms.map((p, i) => (
                      <div key={i} className="w-5 h-5 rounded-full bg-slate-800 border-2 border-slate-900 text-[8px] font-black flex items-center justify-center text-white uppercase shadow-lg">
                        {p.charAt(0)}
                      </div>
                    ))}
                  </div>
                  <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${upload.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                    {upload.status}
                  </div>
                </div>
              </div>
            ))}
            {uploads.length === 0 && (
              <div className="py-20 text-center text-slate-600 mono text-[10px] uppercase tracking-[0.3em] font-black italic">
                Logs Empty. Awaiting First Deployment.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
