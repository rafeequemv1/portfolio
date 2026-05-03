import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../supabase/client';
import type { Workshop, WorkshopStrand, View } from '../types';
import { demoWorkshops } from '../data/demo';
import { SITE_WORKSHOPS } from '../data/siteWorkshops';
import { CalendarPlus } from 'lucide-react';
import WorkshopCardMedia from '../components/WorkshopCardMedia';
import { inferWorkshopStrand, WORKSHOP_STRAND_FILTERS } from '../utils/workshopImages';
import { ROUTES, workshopDetailHref } from '../utils/routes';

const STRAND_ACCENT: Record<WorkshopStrand, string> = {
  illustration: '#B3E5FC',
  outreach: '#C8E6C9',
  school: '#FFE0B2',
  ai: '#D1C4E9',
};

function workshopAccentLine(workshop: Workshop): string {
  const strand = workshop.strand ?? inferWorkshopStrand(workshop.title);
  return STRAND_ACCENT[strand];
}

function stripToPlain(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

function workshopCardExcerpt(workshop: Workshop): string {
  const raw = stripToPlain(workshop.description || '');
  if (!raw) return 'Open for venue, dates, and gallery.';
  const max = 72;
  return raw.length <= max ? raw : `${raw.slice(0, max - 1).trimEnd()}…`;
}

function cityFromLocation(location: string): string {
  const first = location.split(',')[0]?.trim() || '';
  return first;
}

/** Stable bucket so one sidebar row + count (e.g. IISER Pune) filters every matching workshop. */
function instituteFilterBucket(w: Workshop): string | null {
  const inst = (w.institute || '').trim();
  const loc = (w.location || '').trim();
  const hay = `${inst} ${loc}`.trim();
  if (!hay) return null;
  if (/JNCASR|Jawaharlal Nehru Centre for Advanced Scientific Research/i.test(inst) || /JNCASR/i.test(hay))
    return 'jncasr';
  if (/IISER\s*Pune/i.test(inst) || /IISER\s*Pune/i.test(hay)) return 'iiser-pune';
  if (/CSIR|Central Drug Research|\bCDRI\b/i.test(inst) || /\bCDRI\b/i.test(hay)) return 'cdri';
  if (/Andhra University/i.test(inst) || /Andhra University/i.test(hay)) return 'andhra';
  if (/India Science Festival/i.test(inst)) return 'isf';
  if (/Kiel University|Christian-Albrechts/i.test(inst)) return 'kiel';
  if (/University of Kerala|^Kerala University/i.test(inst)) return 'kerala';
  if (/University of Oxford/i.test(inst)) return 'oxford';
  if (/SciDart/i.test(inst)) return 'scidart';
  if (/^EMBL$/i.test(inst)) return 'embl';
  return `raw:${inst || loc}`;
}

function bucketSidebarLabel(bucket: string, sample: Workshop): string {
  const inst = (sample.institute || '').trim();
  const loc = (sample.location || '').trim();
  if (bucket === 'jncasr') return shortInstituteLabel(inst || 'JNCASR', loc);
  if (bucket === 'iiser-pune') return 'IISER Pune';
  if (bucket === 'cdri') return shortInstituteLabel(inst || 'CDRI', loc);
  if (bucket === 'andhra') return shortInstituteLabel(inst || 'Andhra University', loc);
  if (bucket === 'isf') return shortInstituteLabel(inst || 'India Science Festival', loc);
  if (bucket === 'kiel') return 'Kiel University';
  if (bucket === 'kerala') return shortInstituteLabel(inst || 'University of Kerala', loc);
  if (bucket === 'oxford') return 'Oxford';
  if (bucket === 'scidart') return 'SciDart';
  if (bucket === 'embl') return 'EMBL';
  if (bucket.startsWith('raw:')) return shortInstituteLabel(inst || loc, loc);
  return shortInstituteLabel(inst, loc);
}

/** Short label for sidebar; institute keys stay full strings for filtering. */
function shortInstituteLabel(institute: string, location: string): string {
  const i = institute.trim();
  if (!i) return cityFromLocation(location) || 'Other';
  const city = cityFromLocation(location);

  if (/JNCASR|Jawaharlal Nehru Centre for Advanced Scientific Research/i.test(i)) {
    return city ? `JNCASR ${city}` : 'JNCASR';
  }
  if (/IISER\s*Pune/i.test(i)) return 'IISER Pune';
  if (/CSIR|Central Drug Research|\bCDRI\b/i.test(i)) {
    return city ? `CDRI ${city}` : 'CDRI';
  }
  if (/Andhra University/i.test(i)) {
    return city ? `AU ${city}` : 'Andhra University';
  }
  if (/India Science Festival/i.test(i)) {
    return city ? `ISF ${city}` : 'India Science Festival';
  }
  if (/Kiel University|Christian-Albrechts/i.test(i)) return 'Kiel University';
  if (/University of Kerala|^Kerala University/i.test(i)) {
    const c = cityFromLocation(location);
    if (!c) return 'Kerala Univ.';
    if (/thiruvananthapuram/i.test(c)) return 'Kerala Univ. TVM';
    return `Kerala Univ. ${c}`;
  }
  if (/University of Oxford/i.test(i)) return 'Oxford';
  if (/SciDart/i.test(i)) return 'SciDart';
  if (/^EMBL$/i.test(i)) return 'EMBL';

  const noLongParen = i.replace(/\s*\([^)]{10,}\)\s*$/, '').trim();
  const base = noLongParen.length < i.length ? noLongParen : i;
  return base.length > 26 ? `${base.slice(0, 24).trimEnd()}…` : base;
}

/** Card meta: date only (institute lives in the left filter, not repeated here). */
function workshopCardDateLine(workshop: Workshop): string {
  const d = workshop.date;
  if (!d || /^tbd$/i.test(String(d))) return 'Date TBD';
  const date = new Date(d);
  if (Number.isNaN(date.getTime())) return String(d);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
}

interface WorkshopsProps {
  navigate: (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>, view: View, path: string) => void;
}

const normalizeWorkshopRow = (workshop: any): Workshop => ({
  ...workshop,
  cover_image: workshop.image_urls?.[0] || workshop.cover_image,
  institute: workshop.institute || workshop.location,
  gallery_images: Array.isArray(workshop.image_urls)
    ? workshop.image_urls.filter((u: unknown) => typeof u === 'string' && u)
    : workshop.gallery_images || [],
  strand: workshop.strand ?? inferWorkshopStrand(workshop.title || ''),
});

const Workshops: React.FC<WorkshopsProps> = ({ navigate }) => {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [strandFilter, setStrandFilter] = useState<'all' | WorkshopStrand>('all');
  const [instituteFilter, setInstituteFilter] = useState<string>('all');

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

  const mergedWorkshops = useMemo(() => {
    const normalized = workshops.map(normalizeWorkshopRow);
    const byId = new Map<string, Workshop>();
    for (const w of normalized) byId.set(w.id, w);
    for (const w of SITE_WORKSHOPS) {
      if (!byId.has(w.id)) byId.set(w.id, w);
    }
    const merged = Array.from(byId.values()).sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    return merged.length > 0 ? merged : demoWorkshops;
  }, [workshops]);

  const workshopsForStrand = useMemo(() => {
    if (strandFilter === 'all') return mergedWorkshops;
    return mergedWorkshops.filter((w) => (w.strand ?? inferWorkshopStrand(w.title)) === strandFilter);
  }, [mergedWorkshops, strandFilter]);

  const instituteNavItems = useMemo(() => {
    const tally = new Map<string, { count: number; sample: Workshop }>();
    for (const w of workshopsForStrand) {
      const bucket = instituteFilterBucket(w);
      if (!bucket) continue;
      const prev = tally.get(bucket);
      if (prev) prev.count += 1;
      else tally.set(bucket, { count: 1, sample: w });
    }
    return Array.from(tally.entries())
      .map(([bucket, { count, sample }]) => ({
        bucket,
        short: bucketSidebarLabel(bucket, sample),
        count,
      }))
      .sort((a, b) => a.short.localeCompare(b.short, undefined, { sensitivity: 'base' }));
  }, [workshopsForStrand]);

  const filteredWorkshops = useMemo(() => {
    let list = mergedWorkshops;
    if (strandFilter !== 'all') {
      list = list.filter((w) => (w.strand ?? inferWorkshopStrand(w.title)) === strandFilter);
    }
    if (instituteFilter !== 'all') {
      list = list.filter((w) => instituteFilterBucket(w) === instituteFilter);
    }
    return list;
  }, [mergedWorkshops, strandFilter, instituteFilter]);

  useEffect(() => {
    if (instituteFilter === 'all') return;
    const stillThere = workshopsForStrand.some((w) => instituteFilterBucket(w) === instituteFilter);
    if (!stillThere) setInstituteFilter('all');
  }, [instituteFilter, workshopsForStrand]);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-grow flex-col animate-fade-in-up px-4 py-10 sm:px-6 md:px-12 md:py-16 lg:px-24">
      <header className="mb-12 text-center">
        <div className="relative inline-block">
          <h1 className="relative z-10 mb-4 font-serif text-4xl tracking-tight text-[#37352f] md:text-5xl">Workshops & Training</h1>
          <div className="absolute bottom-2 left-0 -z-0 h-3 w-full -rotate-1 rounded-sm bg-[#d1e9e7] opacity-80" />
        </div>
        <p className="font-hand text-2xl text-[#37352f]/60">Sharing knowledge, fostering creativity.</p>
      </header>

      <nav
        className="mb-10 flex flex-wrap items-center justify-center gap-2 px-1 sm:mb-12 sm:gap-2.5"
        aria-label="Workshop categories"
      >
        {WORKSHOP_STRAND_FILTERS.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => setStrandFilter(id)}
            className={`rounded-full border px-3 py-1.5 text-left text-[11px] font-semibold uppercase tracking-wide transition-colors sm:px-4 sm:py-2 sm:text-xs ${
              strandFilter === id
                ? 'border-[#37352f] bg-[#37352f] text-white shadow-sm'
                : 'border-[#37352f]/15 bg-white/80 text-[#37352f]/65 hover:border-[#37352f]/25 hover:text-[#37352f]'
            }`}
          >
            {label}
          </button>
        ))}
      </nav>

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
              href={`${ROUTES.services}#request-workshop`}
              onClick={(e) => navigate(e, 'services', `${ROUTES.services}#request-workshop`)}
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
        <>
          {filteredWorkshops.length === 0 ? (
            <p className="py-16 text-center text-sm text-[#37352f]/50">No workshops in this category yet.</p>
          ) : (
            <div className="flex w-full flex-col gap-8 lg:flex-row lg:items-start lg:gap-10">
              <aside
                className="shrink-0 border-b border-[#37352f]/10 pb-6 lg:sticky lg:top-28 lg:w-44 lg:self-start lg:border-b-0 lg:border-r lg:border-[#37352f]/10 lg:pb-0 lg:pr-6 xl:w-48"
                aria-label="Filter by institute"
              >
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#37352f]/40">Institutes</p>
                <nav className="flex max-h-[40vh] flex-col gap-0.5 overflow-y-auto pr-1 lg:max-h-[min(70vh,36rem)]">
                  <button
                    type="button"
                    onClick={() => setInstituteFilter('all')}
                    className={`rounded-md px-2 py-2 text-left text-[12px] leading-snug text-[#37352f]/60 transition-colors hover:bg-[#37352f]/5 hover:text-[#37352f] ${
                      instituteFilter === 'all' ? 'bg-[#37352f]/10 font-medium text-[#37352f]' : 'font-normal'
                    }`}
                  >
                    All ({workshopsForStrand.length})
                  </button>
                  {instituteNavItems.map(({ bucket, short, count }) => (
                    <button
                      key={bucket}
                      type="button"
                      onClick={() => setInstituteFilter(bucket)}
                      className={`w-full rounded-md px-2 py-2 text-left text-[12px] leading-snug transition-colors hover:bg-[#37352f]/5 hover:text-[#37352f] ${
                        instituteFilter === bucket
                          ? 'bg-[#37352f]/10 font-medium text-[#37352f]'
                          : 'font-normal text-[#37352f]/60'
                      }`}
                    >
                      {short}{' '}
                      <span className="tabular-nums text-[#37352f]/40">({count})</span>
                    </button>
                  ))}
                </nav>
              </aside>

              <div className="min-w-0 flex-1">
                <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 lg:gap-4">
                  {filteredWorkshops.map((workshop) => {
                    const accent = workshopAccentLine(workshop);
                    return (
                      <a
                        key={workshop.id}
                        href={workshopDetailHref(workshop.id)}
                        onClick={(e) => navigate(e, 'workshop-detail', workshopDetailHref(workshop.id))}
                        className="group flex min-w-0 flex-col overflow-hidden rounded-md border border-[#37352f]/10 bg-white/90 transition-colors hover:border-[#37352f]/18 hover:bg-white"
                      >
                        <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden bg-[#f0eeeb]">
                          <WorkshopCardMedia workshop={workshop} title={workshop.title} fill />
                          {workshop.status === 'Past' && (
                            <span className="absolute right-2 top-2 rounded bg-[#37352f]/80 px-1.5 py-0.5 text-[8px] font-semibold uppercase tracking-wide text-white">
                              Past
                            </span>
                          )}
                        </div>
                        <div className="flex min-h-0 flex-1 flex-col gap-1.5 p-3">
                          <h2 className="font-serif text-[0.95rem] font-medium leading-snug text-[#37352f] transition-colors group-hover:text-black sm:text-base">
                            {workshop.title}
                          </h2>
                          <div className="h-0.5 w-8 rounded-full opacity-80" style={{ backgroundColor: accent }} aria-hidden />
                          <p className="text-[10px] font-medium uppercase tracking-[0.1em] text-[#37352f]/40">
                            {workshopCardDateLine(workshop)}
                          </p>
                          <p className="line-clamp-2 text-[11px] leading-relaxed text-[#37352f]/55">{workshopCardExcerpt(workshop)}</p>
                          <span className="mt-1 text-[10px] text-[#37352f]/35 group-hover:text-[#37352f]/55">View →</span>
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Workshops;
