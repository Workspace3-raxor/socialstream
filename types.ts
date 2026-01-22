
export interface UserUpload {
  id: string;
  user_id: string;
  filename: string;
  platforms: string[];
  notes: string;
  caption_ideas?: string;
  uploaded_at: string;
  status: 'pending' | 'completed' | 'failed';
}

export interface PlatformConfig {
  id: string;
  label: string;
  icon: string;
  color: string;
}

export enum DashboardTab {
  UPLOAD = 'upload',
  ANALYTICS = 'analytics'
}
