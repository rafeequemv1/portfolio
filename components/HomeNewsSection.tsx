import React from 'react';
import type { NewsItem, View } from '../types';
import { formatNewsDate, resolveNewsLink } from '../utils/newsLinks';
import { figureImageDisplayUrl } from '../utils/figureImageUrl';
import { SEO_SITE_ORIGIN } from '../utils/seo';

interface HomeNewsSectionProps {
  items: NewsItem[];
  navigate?: (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>, view: View, path: string) => void;
}

const HomeNewsSection: React.FC<HomeNewsSectionProps> = ({ items, navigate }) => {
  if (!items.length) return null;

  return (
    <section id="home-news" className="mx-auto mb-10 w-full max-w-2xl scroll-mt-24 px-1 md:mb-12" aria-labelledby="home-news-heading">
      <div className="mb-5 text-center">
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#5c5a57]">Studio news</p>
        <h2 id="home-news-heading" className="mt-2 font-serif text-2xl tracking-tight text-[#37352f] sm:text-3xl">
          Recent updates
        </h2>
      </div>
      <ul className="divide-y divide-[#37352f]/10 border-y border-[#37352f]/10">
        {items.map((item) => {
          const link = resolveNewsLink(item);
          const href = link.external ? link.path : `${SEO_SITE_ORIGIN}${link.path}`;
          return (
            <li key={item.id}>
              <a
                href={href}
                target={link.external ? '_blank' : undefined}
                rel={link.external ? 'noopener noreferrer' : undefined}
                onClick={(e) => {
                  if (!link.external && navigate) {
                    e.preventDefault();
                    navigate(e, link.view, link.path);
                  }
                }}
                className="group flex items-start gap-4 py-4 transition-colors hover:bg-[#37352f]/[0.02] sm:gap-5 sm:py-5"
              >
                {item.thumbnailUrl ? (
                  <img
                    src={figureImageDisplayUrl(item.thumbnailUrl, { width: 120, quality: 78 })}
                    alt=""
                    width={72}
                    height={72}
                    loading="lazy"
                    decoding="async"
                    className="mt-0.5 h-[4.5rem] w-[4.5rem] shrink-0 rounded-md object-cover ring-1 ring-[#37352f]/10"
                  />
                ) : (
                  <div className="mt-0.5 h-[4.5rem] w-[4.5rem] shrink-0 rounded-md bg-[#37352f]/5 ring-1 ring-[#37352f]/10" />
                )}
                <div className="min-w-0 flex-1 text-left">
                  <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#5c5a57]">
                    {formatNewsDate(item.publishedAt)}
                  </p>
                  <h3 className="mt-1 font-serif text-lg leading-snug text-[#37352f] transition-colors group-hover:text-black sm:text-xl">
                    {item.title}
                  </h3>
                  {item.summary ? (
                    <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-[#5c5a57]">{item.summary}</p>
                  ) : null}
                </div>
              </a>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default HomeNewsSection;
