
import React, { useState, useRef } from 'react';
import { Upload, X, AlertCircle, FileText, Sparkles, Send, MailSearch, ArrowRight, Layers, Check } from 'lucide-react';
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
      setStatus({ type: 'error', message: 'Operational conflict: Missing media assets or relay targets.' });
      return;
    }

    setIsUploading(true);
    setStatus(null);
    setUploadProgress(10);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Authorization lost');

      const formData = new FormData();
      formData.append('file', file);
      formData.append('user_id', user.id);
      formData.append('notes', notes);
      formData.append('caption_ideas', captionIdeas);
      formData.append('platforms', JSON.stringify(selectedPlatforms));

      setUploadProgress(40);
      const response = await fetch(WEBHOOK_URL, { method: 'POST', body: formData });
      if (!response.ok) throw new Error('Relay endpoint unreachable');
      
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
      setStatus({ type: 'error', message: 'System Relay Fault: Deployment interrupted.' });
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
      {/* Sleek Success/Error Toast */}
      {status && (
        <div className={`px-5 py-4 rounded-xl flex items-center gap-4 animate-in slide-in-from-top-4 duration-500 border
          ${status.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}
        `}>
          <div className="shrink-0">
            {status.type === 'success' ? <MailSearch size={18} /> : <AlertCircle size={18} />}
          </div>
          <p className="text-[11px] font-bold tracking-tight">{status.message}</p>
          <button onClick={() => setStatus(null)} className="ml-auto opacity-40 hover:opacity-100 transition-opacity">
            <X size={14} />
          </button>
        </div>
      )}

      <header className="flex items-center justify-between border-b border-white/5 pb-5">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">Deployment Hub</h2>
          <p className="text-[9px] uppercase tracking-[0.3em] font-black text-slate-500 mt-1 flex items-center gap-2">
            <span className="w-1 h-1 bg-blue-500 rounded-full"></span>
            Interface active / Grid 4.2
          </p>
        </div>
        <div className="px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/5 flex items-center gap-2">
          <Layers size={10} className="text-blue-500" />
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Master Relay</span>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Col: Media & Targets */}
        <div className="lg:col-span-5 space-y-5">
          <div 
            onClick={() => fileInputRef.current?.click()}
            className={`group relative overflow-hidden cursor-pointer border border-dashed rounded-2xl p-6 flex flex-col items-center justify-center transition-all duration-500 command-surface h-[280px]
              ${file ? 'border-blue-500/20 bg-blue-500/[0.01]' : 'border-white/10 hover:border-blue-500/20 hover:bg-white/[0.01]'}
            `}
          >
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*,video/*" />
            
            {preview ? (
              <div className="relative w-full h-full animate-in fade-in duration-500">
                {file?.type.startsWith('video/') ? (
                  <video src={preview} className="w-full h-full object-cover rounded-xl shadow-lg border border-white/5" />
                ) : (
                  <img src={preview} alt="Asset" className="w-full h-full object-cover rounded-xl shadow-lg border border-white/5" />
                )}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
                   <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white">Replace Master Asset</p>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-white/[0.02] border border-white/10 rounded-xl flex items-center justify-center mx-auto group-hover:scale-110 transition-all duration-500">
                  <Upload className="text-blue-500/60" size={20} />
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-white tracking-tight">Import Asset</p>
                  <p className="text-[8px] text-slate-500 font-bold uppercase tracking-widest">RAW 4K / VECTOR</p>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-[8px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2 ml-1">
              <Send size={10} className="text-blue-500" /> Target Destinations
            </label>
            <div className="grid grid-cols-2 gap-2">
              {SOCIAL_PLATFORMS.map((platform) => (
                <button
                  key={platform.id}
                  type="button"
                  onClick={() => togglePlatform(platform.id)}
                  className={`flex items-center gap-2.5 p-2.5 rounded-xl border transition-all duration-300
                    ${selectedPlatforms.includes(platform.id) 
                      ? 'bg-blue-600/10 border-blue-500/30 text-white' 
                      : 'bg-white/[0.01] border-white/5 text-slate-500 hover:border-white/10 hover:text-slate-400'}
                  `}
                >
                  <div className={`w-5 h-5 rounded-md flex items-center justify-center text-[7px] font-black ${selectedPlatforms.includes(platform.id) ? 'bg-blue-500 text-white shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'bg-slate-800'}`}>
                    {selectedPlatforms.includes(platform.id) ? <Check size={10} /> : platform.label.substring(0,1).toUpperCase()}
                  </div>
                  <span className="text-[10px] font-bold truncate tracking-tight">{platform.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Configuration */}
        <div className="lg:col-span-7 space-y-5">
          <div className="space-y-2">
            <label className="text-[8px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2 ml-1">
              <FileText size={10} className="text-blue-500" /> Operational Mission
            </label>
            <textarea 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Campaign briefing and objective data..."
              className="w-full h-[112px] bg-slate-900/40 border border-white/5 rounded-xl p-4 text-slate-200 focus:ring-1 focus:ring-blue-500/20 focus:border-blue-500/30 outline-none transition-all placeholder:text-slate-800 font-medium text-xs leading-relaxed"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[8px] font-black text-purple-500 uppercase tracking-[0.3em] flex items-center gap-2 ml-1">
              <Sparkles size={10} /> Intelligence Hooks
            </label>
            <textarea 
              value={captionIdeas}
              onChange={(e) => setCaptionIdeas(e.target.value)}
              placeholder="Directives for AI tone and creative hooks..."
              className="w-full h-[112px] bg-slate-900/40 border border-white/5 rounded-xl p-4 text-slate-200 focus:ring-1 focus:ring-purple-500/20 focus:border-purple-500/30 outline-none transition-all placeholder:text-slate-800 font-medium text-xs leading-relaxed"
            />
          </div>

          <div className="pt-1 space-y-4">
            {uploadProgress > 0 && (
              <div className="space-y-1.5 animate-in fade-in duration-300">
                <div className="flex justify-between items-center px-1">
                  <span className="text-[7px] font-black text-blue-500 uppercase tracking-[0.2em] mono">Relay Encryption Active</span>
                  <span className="text-[9px] font-bold text-white mono">{uploadProgress}%</span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-1 overflow-hidden">
                  <div className="bg-blue-500 h-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                </div>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full py-4 text-xs rounded-xl shadow-lg hover:translate-y-[-1px] active:translate-y-0 transition-all uppercase tracking-widest font-black" 
              isLoading={isUploading}
              disabled={!file || selectedPlatforms.length === 0}
            >
              Initialize Blast Relay <ArrowRight size={14} className="ml-2" />
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};
