
import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { Auth } from './components/Auth';
import { Layout } from './components/Layout';
import { UploadSection } from './components/UploadSection';
import { AnalyticsSection } from './components/AnalyticsSection';
import { DashboardTab } from './types';
import { Session } from '@supabase/supabase-js';

const App: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [activeTab, setActiveTab] = useState<DashboardTab>(DashboardTab.UPLOAD);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-400 animate-pulse font-medium tracking-wider">SECURE CONNECT...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return <Auth />;
  }

  return (
    <Layout 
      activeTab={activeTab} 
      onTabChange={setActiveTab}
      userEmail={session.user.email}
    >
      {activeTab === DashboardTab.UPLOAD ? (
        <UploadSection />
      ) : (
        <AnalyticsSection />
      )}
    </Layout>
  );
};

export default App;
