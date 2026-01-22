
import React, { useState } from 'react';
import { Mail, Lock, Radio, ArrowRight, Github } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Button } from './Button';

export const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });
        if (loginError) throw loginError;
      } else {
        const { error: signUpError } = await supabase.auth.signUp({ email, password });
        if (signUpError) throw signUpError;
        alert('Check your email for the confirmation link!');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full animate-pulse" />

      <div className="w-full max-w-md z-10">
        <div className="text-center space-y-4 mb-10">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto shadow-2xl shadow-blue-500/20 float">
            <Radio className="text-white" size={32} />
          </div>
          <div>
            <h1 className="text-4xl font-extrabold text-white tracking-tight">
              {isLogin ? 'Welcome back' : 'Get started'}
            </h1>
            <p className="text-slate-400 mt-2">
              {isLogin ? 'Log in to your business dashboard' : 'Create an account for your business'}
            </p>
          </div>
        </div>

        <div className="glass p-8 rounded-[2rem] shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-400 flex items-center gap-2 px-1">
                <Mail size={14} /> Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-3.5 text-white outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                placeholder="name@business.com"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-400 flex items-center gap-2 px-1">
                <Lock size={14} /> Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-3.5 text-white outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full py-4 text-md" isLoading={isLoading}>
              {isLogin ? 'Sign In' : 'Create Account'} <ArrowRight size={18} />
            </Button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-800 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-slate-400 hover:text-white transition-colors text-sm font-medium"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        </div>

        <p className="text-center text-slate-500 text-xs mt-12 px-6">
          By continuing, you agree to our Terms of Service and Privacy Policy. Built for high-growth businesses.
        </p>
      </div>
    </div>
  );
};
