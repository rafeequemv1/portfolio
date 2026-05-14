/** Strip risky patterns from admin-authored embed HTML (scripts, inline handlers, iframes). */
export function sanitizeCourseAuthorHtml(html: string): string {
  let s = html;
  s = s.replace(/<script\b[\s\S]*?<\/script>/gi, '');
  s = s.replace(/<\/script>/gi, '');
  s = s.replace(/\s+on\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '');
  s = s.replace(/javascript:/gi, '');
  s = s.replace(/<iframe\b[\s\S]*?<\/iframe>/gi, '');
  s = s.replace(/<object\b[\s\S]*?<\/object>/gi, '');
  s = s.replace(/<embed\b[^>]*>/gi, '');
  return s;
}

export function sanitizeCourseAuthorCss(css: string): string {
  return css.replace(/@import\b/gi, '/*@import blocked*/');
}
