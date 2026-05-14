import React from 'react';
import { getYoutubeEmbedUrl } from '../utils/youtubeEmbed';
import type { CourseContentBlock } from '../courses/types';
import CourseHtmlEmbed from './CourseHtmlEmbed';
import CourseColorLabEmbed from './CourseColorLabEmbed';

interface CourseChapterRendererProps {
  blocks: CourseContentBlock[];
  className?: string;
}

const CourseChapterRenderer: React.FC<CourseChapterRendererProps> = ({ blocks, className = '' }) => {
  return (
    <div className={`space-y-6 text-[#37352f]/90 ${className}`}>
      {blocks.map((block) => {
        if (block.type === 'text') {
          const t = block.text.trim();
          if (!t) return null;
          return (
            <div key={block.id} className="max-w-none text-[15px] leading-relaxed sm:text-base whitespace-pre-wrap">
              {block.text}
            </div>
          );
        }
        if (block.type === 'youtube') {
          const embed = getYoutubeEmbedUrl(block.url);
          if (!embed) {
            return (
              <p key={block.id} className="text-sm text-amber-800/90">
                Invalid YouTube URL — check the link.
              </p>
            );
          }
          return (
            <div key={block.id} className="relative aspect-video w-full overflow-hidden rounded-xl border border-[#37352f]/10 bg-black/5 shadow-sm">
              <iframe
                title="Embedded YouTube video"
                src={embed}
                className="absolute inset-0 h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          );
        }
        if (block.type === 'image' && block.public_url) {
          return (
            <figure key={block.id} className="my-2">
              <img
                src={block.public_url}
                alt={block.alt || ''}
                className="w-full max-h-[min(70vh,520px)] rounded-xl border border-[#37352f]/10 object-contain bg-[#37352f]/5"
                loading="lazy"
              />
              {block.alt ? <figcaption className="mt-2 text-center text-xs text-[#37352f]/55">{block.alt}</figcaption> : null}
            </figure>
          );
        }
        if (block.type === 'html' && block.html.trim()) {
          return <CourseHtmlEmbed key={block.id} html={block.html} css={block.css} />;
        }
        if (block.type === 'color_lab') {
          return <CourseColorLabEmbed key={block.id} preset={block.preset} />;
        }
        return null;
      })}
    </div>
  );
};

export default CourseChapterRenderer;
