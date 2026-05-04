import type { MouseEvent } from 'react';

export interface Project {
  id: string;
  title: string;
  category: 'Molecular' | 'Medical' | 'Environmental' | 'Data';
  imageUrl: string;
  videoUrl?: string;
  embedCode?: string;
  type: 'image' | 'video' | 'embed';
  description: string;
  display_order?: number;
}

export enum Section {
  HERO = 'hero',
  PORTFOLIO = 'portfolio',
  SERVICES = 'services',
  ABOUT = 'about',
  CONTACT = 'contact'
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

/** Used for /workshops filters (Supabase rows can omit — we infer from title). */
export type WorkshopStrand = 'illustration' | 'outreach' | 'school' | 'ai';

export interface Workshop {
  id: string;
  title: string;
  date: string; // ISO string from DB
  location: string;
  institute: string;
  mode: 'Online' | 'Offline' | 'Hybrid';
  description: string;
  content?: string; // For the detailed blog-style page
  status: 'Upcoming' | 'Past' | 'Sold Out';
  price?: string;
  registration_link?: string;
  cover_image?: string;
  gallery_images?: string[]; // Array of URLs
  /** Optional; when missing, `inferWorkshopStrand(title)` is used for filters. */
  strand?: WorkshopStrand;
  testimonials?: { quote: string; author: string; role: string; }[];
  created_at?: string;
}

export interface AppProject {
  id:string;
  title: string;
  tech: string[];
  link: string;
  imageUrl: string;
  description: string;
  role: string;
  display_order?: number;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  date: string;
  excerpt: string;
  content?: string;
  readingTime: string;
  tags: string[];
  category: string;
  imageUrl: string;
  featured: boolean;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
}

export interface LabWebsite {
  id: string;
  labName: string;
  piName: string;
  university?: string;
  websiteUrl: string;
  imageUrl: string;
  description: string;
  display_order?: number;
}

export type View = 'home' | 'apps' | 'services' | 'workshops' | 'workshop-detail' | 'portfolio' | 'about' | 'blog' | 'blog-detail' | 'contact' | 'login' | 'dashboard';

/** SPA navigation handler (defined in `.ts` so union element types are not parsed as JSX). */
export type AppNavigate = (
  e: MouseEvent<HTMLAnchorElement | HTMLButtonElement>,
  view: View,
  path: string
) => void;

export interface JournalCover {
  id: string;
  title: string;
  journal_name?: string;
  institute_name?: string;
  publication_date?: string;
  cover_image_url: string;
  paper_url?: string;
  lab_name?: string;
  lab_url?: string;
  pi_name?: string;
  description?: string;
  display_order?: number;
  created_at?: string;
}

export interface UserProfile {
  id: string;
  full_name: string;
  avatar_url?: string;
  is_admin: boolean;
}

export interface Brand {
  id: string;
  name: string;
  logo_url: string;
  website_url?: string;
  display_order?: number;
  created_at?: string;
}

export interface PortfolioVideo {
  id: string;
  title: string;
  youtube_url: string;
  description?: string;
  display_order?: number;
  created_at?: string;
}

export interface PortfolioLogoProject {
  id: string;
  title: string;
  description?: string | null;
  related_link?: string | null;
  image_urls: string[];
  display_order?: number;
  created_at?: string;
}

/** About page “Talks” — YouTube embed + copy; managed in dashboard. */
export interface AboutTalk {
  id: string;
  title: string;
  description?: string | null;
  youtube_url: string;
  display_order?: number;
  created_at?: string;
}

export interface PortfolioFigure {
  id: string;
  image_urls: string[];
  paper_title: string;
  paper_url?: string | null;
  lab_name?: string | null;
  university_name?: string | null;
  authors?: string | null;
  display_order?: number;
  created_at?: string;
  updated_at?: string;
}

export interface GraphicalAbstract {
  id: string;
  title: string;
  journal_name?: string;
  institute_name?: string;
  publication_date?: string;
  abstract_image_url: string;
  paper_url?: string;
  lab_name?: string;
  lab_url?: string;
  pi_name?: string;
  description?: string;
  display_order?: number;
  created_at?: string;
}