import React, { FormEvent } from 'react';
import { Search } from 'lucide-react';

const GOOGLE_SITE_SEARCH = 'https://www.google.com/search';

export function siteSearchUrl(query: string): string {
  const q = query.trim();
  if (!q) return `${GOOGLE_SITE_SEARCH}?sitesearch=rafeeque.com`;
  return `${GOOGLE_SITE_SEARCH}?q=${encodeURIComponent(q)}&sitesearch=rafeeque.com`;
}

interface SiteSearchProps {
  id: string;
  className?: string;
  inputClassName?: string;
  compact?: boolean;
}

const SiteSearch: React.FC<SiteSearchProps> = ({ id, className = '', inputClassName = '', compact = false }) => {
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const q = String(fd.get('q') ?? '');
    window.location.href = siteSearchUrl(q);
  };

  const inputClass =
    inputClassName ||
    `min-w-0 flex-1 rounded-lg border border-[#37352f]/15 bg-white px-3 py-2 text-sm text-[#37352f] placeholder:text-[#37352f]/40 focus:border-[#37352f]/35 focus:outline-none focus:ring-1 focus:ring-[#37352f]/20 ${compact ? 'w-28 sm:w-36' : 'w-full'}`;

  return (
    <form
      role="search"
      action={GOOGLE_SITE_SEARCH}
      method="get"
      onSubmit={onSubmit}
      className={className}
      aria-label="Search this website"
    >
      <input type="hidden" name="sitesearch" value="rafeeque.com" />
      <label htmlFor={id} className="sr-only">
        Search rafeeque.com
      </label>
      <div className={`flex items-center gap-2 ${compact ? '' : 'w-full max-w-xs'}`}>
        <input id={id} type="search" name="q" placeholder={compact ? 'Search…' : 'Search site…'} autoComplete="off" className={inputClass} />
        <button
          type="submit"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#37352f] text-white transition-colors hover:bg-[#37352f]/90"
          aria-label="Submit search"
        >
          <Search size={16} strokeWidth={2} aria-hidden />
        </button>
      </div>
    </form>
  );
};

export default SiteSearch;
