import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '../supabase/client';
import { Workshop, View } from '../types';
import { demoWorkshops } from '../data/demo';
import { findSiteWorkshop } from '../data/siteWorkshops';
import { formatWorkshopDate } from '../utils/formatWorkshopDate';
import { workshopDetailGalleryUrls, workshopCardCoverUrl } from '../utils/workshopImages';
import {
  applyPageSeo,
  clearDynamicJsonLd,
  workshopDetailJsonLd,
  workshopDetailKeywords,
} from '../utils/seo';
import { ROUTES, workshopDetailHref, workshopIdFromPath } from '../utils/routes';

function stripHtmlToPlain(text: string): string {
  return text.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

interface WorkshopDetailProps {
  path: string;
  navigate: (e: React.MouseEvent<HTMLAnchorElement> | React.MouseEvent<HTMLButtonElement>, view: View, path: string) => void;
}

const WorkshopDetail: React.FC<WorkshopDetailProps> = ({ path, navigate }) => {
  const [workshop, setWorkshop] = useState<Workshop | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const id = workshopIdFromPath(path);

  useEffect(() => {
    if (!id) {
      setError('Workshop ID not found.');
      setLoading(false);
      return;
    }

    const fetchWorkshopDetails = async () => {
      setLoading(true);
      setError(null);
      if (id.startsWith('demo-')) {
        const demoData = demoWorkshops.find((w) => w.id === id);
        if (demoData) {
          setWorkshop({ ...demoData });
        } else {
          setError('Demo workshop not found.');
        }
      } else {
        const siteData = findSiteWorkshop(id);
        if (siteData) {
          setWorkshop({ ...siteData });
        } else {
          const { data, error: fetchError } = await supabase.from('workshops').select('*').eq('id', id).single();

          if (fetchError) {
            setError(fetchError.message);
            console.error('Error fetching workshop:', fetchError);
          } else {
            const row = data as Record<string, unknown>;
            const urls = Array.isArray(row.image_urls)
              ? (row.image_urls as string[]).filter((u) => typeof u === 'string' && u.trim())
              : [];
            setWorkshop({
              ...(data as Workshop),
              cover_image: urls[0] || (data as { cover_image?: string }).cover_image,
              institute:
                (data as { location?: string }).location ||
                (data as { institute?: string }).institute ||
                '',
              gallery_images: urls.length ? urls : (data as { gallery_images?: string[] }).gallery_images || [],
            });
          }
        }
      }
      setLoading(false);
    };

    fetchWorkshopDetails();
  }, [id]);

  useEffect(() => {
    if (!workshop || workshop.id !== id) return;

    const canonicalPath = workshopDetailHref(workshop.id);
    const raw = workshop.description?.trim() ? stripHtmlToPlain(workshop.description) : '';
    const desc =
      raw.length > 158
        ? `${raw.slice(0, 155)}…`
        : raw ||
          `${workshop.title} — scientific illustration and science communication workshop with Rafeeque Mavoor.`;

    const title = `${workshop.title} | Workshop | Rafeeque Mavoor`;
    const cover = workshopCardCoverUrl(workshop);

    applyPageSeo({
      title,
      description: desc,
      canonicalPath,
      keywords: workshopDetailKeywords(workshop),
      ogImage: cover || undefined,
      ogType: 'event',
      jsonLd: workshopDetailJsonLd(workshop, canonicalPath),
    });

    return () => clearDynamicJsonLd();
  }, [workshop, path, id]);

  const gallery = workshop ? workshopDetailGalleryUrls(workshop) : [];
  const scrollToIndex = useCallback((i: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const clamped = Math.max(0, Math.min(i, gallery.length - 1));
    setActiveIndex(clamped);
    el.scrollTo({ left: clamped * el.clientWidth, behavior: 'smooth' });
  }, [gallery.length]);

  useEffect(() => {
    setActiveIndex(0);
  }, [workshop?.id]);

  const onCarouselScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el || gallery.length <= 1) return;
    const w = el.clientWidth || 1;
    const i = Math.round(el.scrollLeft / w);
    setActiveIndex(Math.min(Math.max(0, i), gallery.length - 1));
  }, [gallery.length]);

  if (loading) {
    return (
      <div className="mx-auto flex min-h-[50vh] max-w-xl items-center justify-center px-6">
        <p className="font-serif text-lg text-[#37352f]/45">Loading…</p>
      </div>
    );
  }
  if (error || !workshop) {
    return (
      <div className="mx-auto max-w-xl px-6 py-20 text-center">
        <p className="text-[#37352f]/70">{error || 'Could not load this workshop.'}</p>
      </div>
    );
  }

  return (
    <article className="animate-fade-in-up pb-24 pt-8">
      <div className="mx-auto mb-10 max-w-[680px] px-5 sm:px-6">
        <a
          href={ROUTES.workshops}
          onClick={(e) => navigate(e, 'workshops', ROUTES.workshops)}
          className="inline-flex items-center gap-1.5 text-sm text-[#37352f]/50 transition-colors hover:text-[#37352f]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
            <path
              fillRule="evenodd"
              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
          Workshops
        </a>
      </div>

      {gallery.length > 0 && (
        <div className="mb-8 w-full sm:mb-10">
          <div className="mx-auto flex w-full max-w-5xl flex-col gap-2 px-3 sm:gap-2.5 sm:px-6 md:px-10">
            <div className="w-full overflow-x-clip sm:overflow-visible">
              <div
                ref={scrollRef}
                onScroll={onCarouselScroll}
                className="flex touch-pan-x snap-x snap-mandatory overflow-x-auto scroll-smooth [-webkit-overflow-scrolling:touch] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                {gallery.map((src, i) => (
                  <div key={`${src}-${i}`} className="w-full flex-[0_0_100%] snap-center snap-always">
                    <div className="mx-auto flex max-h-[min(58dvh,520px)] min-h-0 w-full max-w-5xl items-center justify-center rounded-2xl bg-[#ebe8e3] px-2 py-2 sm:max-h-[min(68dvh,600px)] sm:px-3 sm:py-3 md:max-h-[min(72vh,640px)]">
                      <img
                        src={src}
                        alt={i === 0 ? workshop.title : `${workshop.title} — photo ${i + 1}`}
                        className="mx-auto max-h-[min(52dvh,480px)] w-full max-w-full object-contain object-center sm:max-h-[min(62dvh,560px)] md:max-h-[min(68vh,600px)]"
                        loading={i === 0 ? 'eager' : 'lazy'}
                        decoding="async"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {gallery.length > 1 && (
              <div className="rounded-2xl border border-[#37352f]/10 bg-white/90 p-2 shadow-sm backdrop-blur-sm sm:p-3">
                <p className="mb-1.5 px-1 text-center text-[10px] font-semibold uppercase tracking-[0.18em] text-[#37352f]/40 sm:mb-2">
                  Photos ({gallery.length})
                </p>
                <div className="flex snap-x snap-mandatory gap-2.5 overflow-x-auto overscroll-x-contain px-1 pb-0.5 [-webkit-overflow-scrolling:touch] sm:flex-wrap sm:justify-center sm:overflow-x-visible">
                  {gallery.map((src, i) => (
                    <button
                      key={`thumb-${src}-${i}`}
                      type="button"
                      onClick={() => scrollToIndex(i)}
                      className={`relative shrink-0 snap-center overflow-hidden rounded-xl border-2 transition-all touch-manipulation ${
                        i === activeIndex
                          ? 'border-[#37352f] shadow-md ring-2 ring-[#37352f]/15 scale-[1.02]'
                          : 'border-[#37352f]/10 opacity-80 hover:border-[#37352f]/25 hover:opacity-100 active:scale-[0.98]'
                      }`}
                      aria-label={`Show image ${i + 1}`}
                      aria-current={i === activeIndex ? 'true' : undefined}
                    >
                      <span className="block h-[3.25rem] w-[4.75rem] sm:h-16 sm:w-[5.5rem] md:h-[4.5rem] md:w-24">
                        <img src={src} alt="" className="h-full w-full object-cover" />
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <header className="mx-auto max-w-[680px] px-5 sm:px-6">
        <p className="mb-3 text-[13px] font-medium uppercase tracking-[0.12em] text-[#37352f]/45">
          {workshop.institute || 'Workshop'}
          {workshop.date ? ` · ${formatWorkshopDate(workshop.date, true)}` : null}
        </p>
        <h1 className="mb-8 font-serif text-[2.25rem] font-normal leading-[1.15] tracking-tight text-[#37352f] sm:text-[2.75rem]">
          {workshop.title}
        </h1>
      </header>

      <div className="mx-auto max-w-[680px] px-5 sm:px-6">
        <div className="max-w-none font-sans text-[1.125rem] leading-[1.75] text-[#37352f]/85 [&_a]:text-[#37352f] [&_a]:underline [&_strong]:font-semibold [&_strong]:text-[#37352f] [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6">
          {workshop.description?.trim() ? (
            <p className="whitespace-pre-wrap first:mt-0">{workshop.description}</p>
          ) : null}

          {workshop.content ? (
            <div
              className="mt-10 border-t border-[#37352f]/10 pt-10 [&_h2]:mt-8 [&_h2]:font-serif [&_h2]:text-2xl [&_h2]:text-[#37352f] [&_h3]:mt-6 [&_h3]:font-serif [&_h3]:text-xl [&_h3]:text-[#37352f] [&_p]:mt-4 [&_p]:first:mt-0"
              dangerouslySetInnerHTML={{ __html: workshop.content }}
            />
          ) : null}
        </div>

        {workshop.testimonials && workshop.testimonials.length > 0 && (
          <section className="mt-16 border-t border-[#37352f]/10 pt-12">
            <h2 className="mb-8 font-serif text-2xl font-normal text-[#37352f]">Voices from the room</h2>
            <div className="space-y-10">
              {workshop.testimonials.map((t, i) => (
                <blockquote key={i} className="border-l-2 border-[#37352f]/15 pl-6">
                  <p className="font-serif text-lg italic leading-relaxed text-[#37352f]/90">"{t.quote}"</p>
                  <footer className="mt-3 text-sm text-[#37352f]/55">
                    <span className="font-medium text-[#37352f]/80">{t.author}</span>
                    {t.role ? <span className="text-[#37352f]/50"> · {t.role}</span> : null}
                  </footer>
                </blockquote>
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  );
};

export default WorkshopDetail;
