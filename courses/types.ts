import type { ColorLabPreset } from './colorLabPresets';
import { isColorLabPreset } from './colorLabPresets';

export type CourseContentBlockType = 'text' | 'youtube' | 'image' | 'html' | 'color_lab';

export interface CourseTextBlock {
  id: string;
  type: 'text';
  text: string;
}

export interface CourseYoutubeBlock {
  id: string;
  type: 'youtube';
  url: string;
}

export interface CourseImageBlock {
  id: string;
  type: 'image';
  storage_path: string;
  public_url: string;
  alt?: string;
}

/** Scoped HTML + optional CSS rendered inside a shadow root (no global style leakage). */
export interface CourseHtmlBlock {
  id: string;
  type: 'html';
  html: string;
  css?: string;
}

export interface CourseColorLabBlock {
  id: string;
  type: 'color_lab';
  preset: ColorLabPreset;
}

export type CourseContentBlock = CourseTextBlock | CourseYoutubeBlock | CourseImageBlock | CourseHtmlBlock | CourseColorLabBlock;

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  published: boolean;
  display_order: number;
  category: string;
  offer_enabled: boolean;
  offer_title: string | null;
  offer_body: string | null;
  offer_cta_label: string | null;
  offer_cta_url: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface CourseChapter {
  id: string;
  course_id: string;
  title: string;
  position: number;
  content_blocks: CourseContentBlock[];
  created_at?: string;
  updated_at?: string;
}

export function isCourseContentBlock(value: unknown): value is CourseContentBlock {
  if (!value || typeof value !== 'object') return false;
  const o = value as Record<string, unknown>;
  const id = o.id;
  const type = o.type;
  if (typeof id !== 'string' || (type !== 'text' && type !== 'youtube' && type !== 'image' && type !== 'html' && type !== 'color_lab'))
    return false;
  if (type === 'text') return typeof o.text === 'string';
  if (type === 'youtube') return typeof o.url === 'string';
  if (type === 'html') {
    return typeof o.html === 'string' && (o.css === undefined || o.css === null || typeof o.css === 'string');
  }
  if (type === 'color_lab') return isColorLabPreset(o.preset);
  return typeof o.storage_path === 'string' && typeof o.public_url === 'string';
}

export function normalizeContentBlocks(raw: unknown): CourseContentBlock[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter(isCourseContentBlock);
}
