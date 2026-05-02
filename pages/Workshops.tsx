import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase/client';
import { Workshop, View } from '../types';
import { demoWorkshops } from '../data/demo';
import { CalendarPlus } from 'lucide-react';
import WorkshopCardMedia from '../components/WorkshopCardMedia';
import { formatWorkshopDate } from '../utils/formatWorkshopDate';
import { workshopImageList } from '../utils/workshopImages';

interface WorkshopsProps {
  navigate: (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>, view: View, path: string) => void;
}

const normalizeWorkshopRow = (workshop: any): Workshop => ({
  ...workshop,
  cover_image: workshop.image_urls?.[0] || workshop.cover_image,
  institute: workshop.location || workshop.institute,
  gallery_images: Array.isArray(workshop.image_urls)
    ? workshop.image_urls.filter((u: unknown) => typeof u === 'string' && u)
    : workshop.gallery_images || [],
});

const Workshops: React.FC<WorkshopsProps> = ({ navigate }) => {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWorkshops = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('workshops').select('*').order('date', { ascending: false });

      if (error) {
        setError(error.message);
        console.error('Error fetching workshops:', error);
      } else {
        setWorkshops((data || []).map(normalizeWorkshopRow));
      }
      setLoading(false);
    };

    fetchWorkshops();
  }, []);

  const workshopsToDisplay = !loading && workshops.length === 0 ? demoWorkshops : workshops;

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-grow flex-col animate-fade-in-up px-4 py-10 sm:px-6 sm:py-12 md:px-12 md:py-16 lg:px-16">
      <header className="mb-12 text-center">
        <div className="relative inline-block">
          <h1 className="relative z-10 mb-4 font-serif text-4xl tracking-tight text-[#37352f] md:text-5xl">Workshops & Training</h1>
          <div className="absolute bottom-2 left-0 -z-0 h-3 w-full -rotate-1 rounded-sm bg-[#d1e9e7] opacity-80" />
        </div>
        <p className="font-hand text-2xl text-[#37352f]/60">Sharing knowledge, fostering creativity.</p>
      </header>

      <section className="mb-12 w-full rounded-2xl border border-[#37352f]/10 bg-white/80 p-6 shadow-sm sm:p-8">
        <div className="flex w-full flex-col items-stretch gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
          <div className="min-w-0 flex-1 text-center lg:max-w-2xl lg:text-left">
            <p className="mb-1 text-sm font-bold uppercase tracking-[0.15em] text-[#37352f]/45">Host a session</p>
            <p className="font-serif text-lg text-[#37352f] sm:text-xl">Book me for an on-campus or online workshop</p>
            <p className="mt-2 text-sm leading-relaxed text-[#37352f]/60">
              Scientific illustration, visual communication, and AI tools for research teams.
            </p>
          </div>
          <div className="flex shrink-0 justify-center lg:justify-end">
            <a
              href="/services#request-workshop"
              onClick={(e) => navigate(e, 'services', '/services#request-workshop')}
              className="inline-flex w-full max-w-xs items-center justify-center gap-2 rounded-xl bg-[#37352f] px-6 py-3.5 text-center text-sm font-semibold uppercase tracking-wider text-white shadow-md transition-colors hover:bg-black sm:w-auto"
            >
              <CalendarPlus size={18} strokeWidth={1.75} />
              Request a workshop
            </a>
          </div>
        </div>
      </section>

      {loading && <div className="py-20 text-center text-[#37352f]/60">Loading workshops...</div>}
      {error && <div className="py-20 text-center text-red-600">Error: {error}</div>}

      {!loading && !error && (
        <div className="grid w-full grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3">
          {workshopsToDisplay.map((workshop) => {
            const imgs = workshopImageList(workshop);
            return (
              <a
                key={workshop.id}
                href={`/workshops/${workshop.id}`}
                onClick={(e) => navigate(e, 'workshop-detail', `/workshops/${workshop.id}`)}
                className="group flex min-w-0 flex-col overflow-hidden rounded-xl border border-[#37352f]/10 bg-white/70 shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                <div className="relative min-h-0 w-full shrink-0 overflow-hidden">
                  <WorkshopCardMedia workshop={workshop} title={workshop.title} />
                  {workshop.status === 'Past' && (
                    <span className="absolute right-3 top-3 rounded-full bg-[#37352f]/70 px-2 py-1 text-[10px] font-bold uppercase text-white backdrop-blur-sm">
                      Past Event
                    </span>
                  )}
                </div>
                <div className="flex min-h-0 flex-1 flex-col p-5">
                  <h2 className="mb-2 font-serif text-xl leading-snug text-[#37352f] transition-colors group-hover:text-black">
                    {workshop.title}
                  </h2>
                  <div className="mt-auto flex flex-wrap items-center justify-between gap-2 border-t border-[#37352f]/10 pt-3 text-xs font-medium text-[#37352f]/60">
                    <span className="min-w-0 truncate">{workshop.location || '—'}</span>
                    <span className="shrink-0">{formatWorkshopDate(workshop.date, false)}</span>
                  </div>
                  {imgs.length > 1 && (
                    <p className="mt-2 text-[10px] uppercase tracking-wider text-[#37352f]/40">{imgs.length} photos</p>
                  )}
                </div>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Workshops;
