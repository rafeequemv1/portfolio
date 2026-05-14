import type { CourseContentBlock } from './types';
import type { ColorLabPreset } from './colorLabPresets';

export function newBlockId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return `b-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function emptyTextBlock(): CourseContentBlock {
  return { id: newBlockId(), type: 'text', text: '' };
}

export function emptyYoutubeBlock(): CourseContentBlock {
  return { id: newBlockId(), type: 'youtube', url: '' };
}

export function emptyImageBlock(): CourseContentBlock {
  return { id: newBlockId(), type: 'image', storage_path: '', public_url: '', alt: '' };
}

export function emptyHtmlBlock(): CourseContentBlock {
  return { id: newBlockId(), type: 'html', html: '', css: '' };
}

export function emptyColorLabBlock(preset: ColorLabPreset = 'hue_wheel'): CourseContentBlock {
  return { id: newBlockId(), type: 'color_lab', preset };
}
