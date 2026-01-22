
import React, { useState, useRef } from 'react';
import { Upload, X, CheckCircle2, AlertCircle, FileText, Sparkles, Send, MailSearch, ArrowRight, Layers } from 'lucide-react';
import { Button } from './Button';
import { SOCIAL_PLATFORMS, WEBHOOK_URL } from '../constants';
import { supabase } from '../lib/supabase';

export const UploadSection: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [captionIdeas, setCaptionIdeas] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(selectedFile);
    }
  };

  const togglePlatform = (id: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || selectedPlatforms.length === 0) {
      setStatus({ type: 'error', message: 'Deployment incomplete: Media asset and platforms required.' });
      return;
    }

    setIsUploading(true);
    setStatus(null);
    setUploadProgress(10);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Session expired');

      const formData = new FormData();
      formData.append('file', file);
      formData.append('user_id', user.id);
      formData.append('notes', notes);
      formData.append('caption_ideas', captionIdeas);
      formData.append('platforms', JSON.stringify(selectedPlatforms));

      setUploadProgress(40);
      const response = await fetch(WEBHOOK_URL, { method: 'POST', body: formData });
      if (!response.ok) throw new Error('Relay error');
      
      setUploadProgress(80);
      await supabase.from('user_uploads').insert({
        user_id: user.id,
        filename: file.name,
        platforms: selectedPlatforms,
        notes,
        caption_ideas: captionIdeas,
        status: 'pending'
      });

      setUploadProgress(100);
      setStatus({ 
        type: 'success', 
        message: 'Deployment Success! You will receive an approval link via email shortly. Kindly go through it to finalize the blast.' 
      });
      
      setFile(null);
      setPreview(null);
      setNotes('');
      setCaptionIdeas('');
      setSelectedPlatforms([]);
    } catch (err: any) {
      setStatus({ type: 'error', message: 'Critical relay fault.' });
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      {/* Mini Success/Error Header Notification */}
      {status && (
        <div className={`p-4 rounded-2xl flex items-center gap-4 animate-in slide-in-from-top-4 duration-500 border shadow-2xl
          ${status.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}
        `}>
          <div className="shrink-0">
            {status.type === 'success' ? <MailSearch size={20} /> : <AlertCircle size={20} />}
          </div>
          <p className="text-xs font-bold tracking-tight leading-tight">{status.message}</p>
          <button onClick={() => setStatus(null)} className="ml-auto opacity-50 hover:opacity-100 transition-opacity">
            <X size={14} />
          </button>
        </div>
      )}

      <header className="flex items-center justify-between border-b border-white/5 pb-6">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tighter">Deployment Hub</h2>
          <p className="text-[10px] uppercase tracking-[0.3em] font-black text-slate-500 mt-1">Grid System v4.2.0</p>
        </div>
        <div className="flex gap-2">
           <div className="px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/5 flex items-center gap-2">
              <Layers size={12} className="text-blue-500" />
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Active Relay</span>
           </div>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Asset intake */}
        <div className="lg:col-span-5 space-y-6">
          <div 
            onClick={() => fileInputRef.current?.click()}
            className={`group relative overflow-hidden cursor-pointer border border-dashed rounded-3xl p-8 flex flex-col items-center justify-center transition-all duration-500 command-surface h-[320px]
              ${file ? 'border-blue-500/30 bg-blue-500/[0.01]' : 'border-white/10 hover:border-blue-500/20 hover:bg-white/[0.01]'}
            `}
          >
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*,video/*" />
            
            {preview ? (
              <div className="relative w-full h-full animate-in fade-in duration-500">
                {file?.type.startsWith('video/') ? (
                  <video src={preview} className="w-full h-full object-cover rounded-2xl shadow-xl border border-white/5" />
                ) : (
                  <img src={preview} alt="Asset" className="w-full h-full object-cover rounded-2xl shadow-xl border border-white/5" />
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl">
                   <p className="text-[10px] font-black uppercase tracking-widest text-white">Replace Asset</p>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-white/[0.02] border border-white/10 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-all duration-500">
                  <Upload className="text-blue-500/70" size={24} />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-white tracking-tight">Import Asset</p>
                  <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Master File Intake</p>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-3">
             <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2 ml-1">
              <Send size={10} className="text-blue-500" /> Platform Grid
            </label>
            <div className="grid grid-cols-2 gap-2">
              {SOCIAL_PLATFORMS.map((platform) => (
                <button
                  key={platform.id}
                  type="button"
                  onClick={() => togglePlatform(platform.id)}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-300
                    ${selectedPlatforms.includes(platform.id) 
                      ? 'bg-blue-600/10 border-blue-500/40 text-white' 
                      : 'bg-white/[0.01] border-white/5 text-slate-500 hover:border-white/10 hover:text-slate-400'}
                  `}
                >
                  <div className={`w-6 h-6 rounded-md flex items-center justify-center text-[8px] font-black ${selectedPlatforms.includes(platform.id) ? 'bg-blue-500 text-white' : 'bg-slate-800'}`}>
                    {platform.label.substring(0,1).toUpperCase()}
                  </div>
                  <span className="text-[10px] font-bold truncate uppercase tracking-tighter">{platform.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Information Intake */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-3">
            <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2 ml-1">
              <FileText size={12} className="text-blue-500" /> Operational Objectives
            </label>
            <textarea 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Campaign mission briefing..."
              className="w-full h-28 bg-slate-900/40 border border-white/5 rounded-2xl p-4 text-slate-200 focus:ring-1 focus:ring-blue-500/30 focus:border-blue-500/30 outline-none transition-all placeholder:text-slate-800 font-medium text-sm leading-relaxed"
            />
          </div>

          <div className="space-y-3">
            <label className="text-[9px] font-black text-purple-500 uppercase tracking-[0.3em] flex items-center gap-2 ml-1">
              <Sparkles size={12} /> Intelligence Hooks
            </label>
            <textarea 
              value={captionIdeas}
              onChange={(e) => setCaptionIdeas(e.target.value)}
              placeholder="Creative direction and tone hooks..."
              className="w-full h-28 bg-slate-900/40 border border-white/5 rounded-2xl p-4 text-slate-200 focus:ring-1 focus:ring-purple-500/30 focus:border-purple-500/30 outline-none transition-all placeholder:text-slate-800 font-medium text-sm leading-relaxed"
            />
          </div>

          <div className="pt-2 space-y-6">
            {uploadProgress > 0 && (
              <div className="space-y-2 animate-in fade-in duration-300">
                <div className="flex justify-between items-center px-1">
                  <span className="text-[8px] font-black text-blue-500 uppercase tracking-[0.2em] mono">Bit-Relay Encryption</span>
                  <span className="text-[10px] font-bold text-white mono">{uploadProgress}%</span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-1 overflow-hidden">
                  <div className="bg-blue-500 h-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                </div>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full py-4 text-sm rounded-2xl shadow-xl shadow-blue-500/5 hover:scale-[1.01] active:scale-[0.98] transition-all" 
              isLoading={isUploading}
              disabled={!file || selectedPlatforms.length === 0}
            >
              Execute Blast Relay <ArrowRight size={18} className="ml-1" />
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};
