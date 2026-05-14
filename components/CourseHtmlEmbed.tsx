import React, { useEffect, useRef } from 'react';
import { sanitizeCourseAuthorCss, sanitizeCourseAuthorHtml } from '../courses/htmlSanitize';

interface CourseHtmlEmbedProps {
  html: string;
  css?: string;
}

/**
 * Renders trusted admin HTML/CSS inside a shadow root so styles do not leak to the page.
 * Scripts and common XSS vectors are stripped in {@link sanitizeCourseAuthorHtml}.
 */
const CourseHtmlEmbed: React.FC<CourseHtmlEmbedProps> = ({ html, css }) => {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const safeHtml = sanitizeCourseAuthorHtml(html);
    const safeCss = sanitizeCourseAuthorCss(css || '');
    let shadow = host.shadowRoot;
    if (!shadow) {
      shadow = host.attachShadow({ mode: 'open' });
    }
    shadow.innerHTML = '';
    const style = document.createElement('style');
    style.textContent =
      safeCss +
      ':host{display:block}*{box-sizing:border-box}img,video,svg{max-width:100%;height:auto}a{color:#2d5a87}';
    const wrap = document.createElement('div');
    wrap.className = 'course-html-root';
    wrap.innerHTML = safeHtml;
    shadow.appendChild(style);
    shadow.appendChild(wrap);
  }, [html, css]);

  if (!html.trim()) return null;

  return (
    <div
      ref={hostRef}
      className="rounded-xl border border-[#37352f]/10 bg-white shadow-sm"
      role="region"
      aria-label="Embedded interactive content"
    />
  );
};

export default CourseHtmlEmbed;
