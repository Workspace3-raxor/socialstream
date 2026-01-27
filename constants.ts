
import { PlatformConfig } from './types';

export const SUPABASE_URL = 'https://gcytiezqslwjgsefrkxn.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdjeXRpZXpxc2x3amdzZWZya3huIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk0Nzc5MTEsImV4cCI6MjA4NTA1MzkxMX0.oSJEyA-P2LXrSsSRTdAECgbPk3OKlKC1C_JhWcDVtZY';
export const WEBHOOK_URL = 'https://pyrs.app.n8n.cloud/webhook/file-upload';

export const SOCIAL_PLATFORMS: PlatformConfig[] = [
  { id: 'facebook', label: 'Facebook', icon: 'Facebook', color: '#1877F2' },
  { id: 'instagram', label: 'Instagram', icon: 'Instagram', color: '#E4405F' },
  { id: 'linkedin', label: 'LinkedIn', icon: 'Linkedin', color: '#0A66C2' },
  { id: 'twitter', label: 'Twitter (X)', icon: 'Twitter', color: '#000000' },
  { id: 'tiktok', label: 'TikTok', icon: 'Music2', color: '#000000' },
  { id: 'youtube', label: 'YouTube', icon: 'Youtube', color: '#FF0000' },
  { id: 'pinterest', label: 'Pinterest', icon: 'Pin', color: '#BD081C' },
  { id: 'google_business', label: 'Google Business', icon: 'MapPin', color: '#4285F4' }
];
