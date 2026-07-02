import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { supabase } from '../supabase/client';
import type { Testimonial } from '../types';
import { mapTestimonialRow } from '../utils/testimonialMapper';
import { figureImageDisplayUrl } from '../utils/figureImageUrl';
import { getLinkedInEmbedSrc, getTwitterEmbedSrc } from '../utils/socialEmbeds';

const TestimonialCard: React.FC<{ item: Testimonial }> = ({ item }) => {
  const twitterEmbed = item.contentType === 'twitter' && item.sourceUrl ? getTwitterEmbedSrc(item.sourceUrl) : '';
  const linkedInEmbed = item.contentType === 'linkedin' && item.sourceUrl ? getLinkedInEmbedSrc(item.sourceUrl) : '';
  const ctaHref = item.linkUrl?.trim() || item.sourceUrl?.trim() || '';
  const ctaLabel = item.linkLabel?.trim() || (item.contentType === 'linkedin' ? 'View on LinkedIn' : item.contentType === 'twitter' ? 'View on X' : 'Learn more');

  return (
    <article className="flex h-full min-h-[280px] w-[min(88vw,22rem)] shrink-0 snap-center flex-col rounded-2xl border border-[#37352f]/10 bg-white/90 p-5 shadow-sm sm:w-[24rem] sm:p-6">
      {item.contentType === 'twitter' && twitterEmbed ? (
        <div className="mb-4 overflow-hidden rounded-lg border border-[#37352f]/10 bg-[#fcfaf8]">
          <iframe
            title={`${item.authorName} on X`}
            src={twitterEmbed}
            className="h-[280px] w-full"
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
      ) : null}

      {item.contentType === 'linkedin' && linkedInEmbed && !item.imageUrl ? (
        <div className="mb-4 overflow-hidden rounded-lg border border-[#37352f]/10 bg-[#fcfaf8]">
          <iframe
            title={`${item.authorName} on LinkedIn`}
            src={linkedInEmbed}
            className="h-[280px] w-full"
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
      ) : null}

      {(item.contentType === 'image' || item.imageUrl) && item.imageUrl ? (
        <a
          href={ctaHref || item.imageUrl}
          target={ctaHref ? '_blank' : undefined}
          rel={ctaHref ? 'noopener noreferrer' : undefined}
          className="mb-4 block overflow-hidden rounded-lg border border-[#37352f]/10"
        >
          <img
            src={figureImageDisplayUrl(item.imageUrl, { width: 480, quality: 82 })}
            alt=""
            width={384}
            height={240}
            loading="lazy"
            decoding="async"
            className="aspect-[16/10] w-full object-cover"
          />
        </a>
      ) : null}

      {item.quote ? (
        <blockquote className="flex-1 font-serif text-base leading-relaxed text-[#37352f] sm:text-lg">
          <span className="text-[#37352f]/35">&ldquo;</span>
          {item.quote}
          <span className="text-[#37352f]/35">&rdquo;</span>
        </blockquote>
      ) : null}

      <footer className="mt-4 border-t border-[#37352f]/8 pt-4">
        <p className="text-sm font-semibold text-[#37352f]">{item.authorName}</p>
        {(item.authorRole || item.authorOrg) && (
          <p className="mt-0.5 text-xs text-[#37352f]/55">
            {[item.authorRole, item.authorOrg].filter(Boolean).join(' · ')}
          </p>
        )}
        {ctaHref ? (
          <a
            href={ctaHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:underline"
          >
            {ctaLabel}
            <ExternalLink size={11} aria-hidden />
          </a>
        ) : null}
      </footer>
    </article>
  );
};

const AboutTestimonialsCarousel: React.FC = () => {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('is_published', true)
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });
      if (!cancelled) {
        if (!error) {
          setItems(((data || []) as Record<string, unknown>[]).map(mapTestimonialRow));
        }
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const scrollByCard = (dir: -1 | 1) => {
    const el = trackRef.current;
    if (!el) return;
    const cardWidth = el.querySelector('article')?.getBoundingClientRect().width ?? 320;
    el.scrollBy({ left: dir * (cardWidth + 16), behavior: 'smooth' });
  };

  if (loading) return null;
  if (!items.length) return null;

  return (
    <section className="mb-12" aria-labelledby="about-testimonials-heading">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#5c5a57]">Testimonials</p>
          <h2 id="about-testimonials-heading" className="mt-1 font-serif text-2xl text-[#37352f]">
            What clients &amp; trainees say
          </h2>
        </div>
        <div className="hidden shrink-0 gap-1 sm:flex">
          <button
            type="button"
            onClick={() => scrollByCard(-1)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#37352f]/15 text-[#37352f]/60 transition-colors hover:bg-[#37352f]/5 hover:text-[#37352f]"
            aria-label="Previous testimonial"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={() => scrollByCard(1)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#37352f]/15 text-[#37352f]/60 transition-colors hover:bg-[#37352f]/5 hover:text-[#37352f]"
            aria-label="Next testimonial"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
      <div
        ref={trackRef}
        className="-mx-1 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 scroll-smooth [scrollbar-width:thin]"
        aria-label="Testimonials carousel"
      >
        {items.map((item) => (
          <TestimonialCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
};

export default AboutTestimonialsCarousel;
