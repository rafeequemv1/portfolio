import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { supabase } from '../supabase/client';
import { GraphicalAbstract, JournalCover, LabWebsite, PortfolioFigure, PortfolioVideo, View } from '../types';
import { Loader2, ExternalLink, X, ChevronLeft, ChevronRight } from 'lucide-react';
import AppsShowcase from '../components/AppsShowcase';
import {
  pathnameOnly,
  portfolioFiguresGalleryFromPath,
  portfolioHrefForTab,
  portfolioTabFromPathname,
  ROUTES,
  type PortfolioFiguresGalleryFilter,
  type PortfolioTab,
} from '../utils/routes';
import { figureImageDisplayUrl } from '../utils/figureImageUrl';

export type { PortfolioFiguresGalleryFilter, PortfolioTab };

const getYoutubeEmbedUrl = (url: string): string => {
  try {
    const parsed = new URL(url.trim());
    if (parsed.hostname.includes('youtu.be')) {
      const id = parsed.pathname.replace('/', '');
      return `https://www.youtube.com/embed/${id}`;
    }
    const id = parsed.searchParams.get('v');
    if (id) return `https://www.youtube.com/embed/${id}`;
    const parts = parsed.pathname.split('/');
    return `https://www.youtube.com/embed/${parts[parts.length - 1]}`;
  } catch {
    return '';
  }
};

function portfolioFigureUrls(fig: PortfolioFigure | null): string[] {
  if (!fig?.image_urls?.length) return [];
  return fig.image_urls.filter((u): u is string => typeof u === 'string' && u.trim().length > 0);
}

function sortKeyMs(d?: string | null): number {
  if (!d) return 0;
  const t = new Date(d).getTime();
  return Number.isNaN(t) ? 0 : t;
}

type GalleryRow =
  | { kind: 'figure'; item: PortfolioFigure; sort: number }
  | { kind: 'abstract'; item: GraphicalAbstract; sort: number };

interface PortfolioProps {
  path: string;
  navigate?: (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>, view: View, path: string) => void;
}

const Portfolio: React.FC<PortfolioProps> = ({ path, navigate }) => {
  const [covers, setCovers] = useState<JournalCover[]>([]);
  const [videos, setVideos] = useState<PortfolioVideo[]>([]);
  const [graphicalAbstracts, setGraphicalAbstracts] = useState<GraphicalAbstract[]>([]);
  const [websites, setWebsites] = useState<LabWebsite[]>([]);
  const [figures, setFigures] = useState<PortfolioFigure[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCover, setSelectedCover] = useState<JournalCover | null>(null);
  const [selectedAbstract, setSelectedAbstract] = useState<GraphicalAbstract | null>(null);
  const [selectedFigure, setSelectedFigure] = useState<PortfolioFigure | null>(null);
  const [figureSlideIndex, setFigureSlideIndex] = useState(0);
  const figureTouchStartX = useRef<number | null>(null);
  const [activeTab, setActiveTab] = useState<PortfolioTab>(() => portfolioTabFromPathname(pathnameOnly(path)));
  const [figuresGalleryFilter, setFiguresGalleryFilter] = useState<PortfolioFiguresGalleryFilter>(() =>
    portfolioFiguresGalleryFromPath(path)
  );

  useEffect(() => {
    setActiveTab(portfolioTabFromPathname(pathnameOnly(path)));
  }, [path]);

  useEffect(() => {
    setFiguresGalleryFilter(portfolioFiguresGalleryFromPath(path));
  }, [path]);

  const goTab = (tab: PortfolioTab) => (e: React.MouseEvent<HTMLButtonElement>) => {
    const dest = portfolioHrefForTab(tab);
    if (navigate) {
      navigate(e, 'portfolio', dest);
    } else {
      setActiveTab(tab);
    }
  };

  const goFiguresGallery = (filter: PortfolioFiguresGalleryFilter) => (e: React.MouseEvent<HTMLButtonElement>) => {
    const dest =
      filter === 'abstracts'
        ? ROUTES.portfolioAbstracts
        : filter === 'figures'
          ? `${ROUTES.portfolioFigures}?view=figures`
          : ROUTES.portfolioFigures;
    if (navigate) {
      navigate(e, 'portfolio', dest);
    } else {
      setActiveTab('figures');
      setFiguresGalleryFilter(filter);
    }
  };
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [tabsDocked, setTabsDocked] = useState(false);
  const [showFloatingWorkCta, setShowFloatingWorkCta] = useState(false);
  const tabBarRef = useRef<HTMLDivElement>(null);

  const portfolioCtaTabs: PortfolioTab[] = ['covers', 'figures'];
  const showFloatingCtaForTab = portfolioCtaTabs.includes(activeTab);

  const tabHeroSubtitle: Partial<Record<PortfolioTab, string>> = {
    covers: 'A selection of published journal covers.',
    figures: 'Paper figures, panels, and graphical abstracts from peer-reviewed work.',
    videos: 'Scientific illustration and process videos.',
    'websites-apps': 'Lab websites and science web experiments.',
  };

  useEffect(() => {
    const fetchCovers = async () => {
      setLoading(true);
      const { data: coversData, error: coversError } = await supabase
        .from('journal_covers')
        .select('*')
        .order('created_at', { ascending: true });

      const { data: videosData, error: videosError } = await supabase
        .from('portfolio_videos')
        .select('*')
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });

      const { data: abstractsData, error: abstractsError } = await supabase
        .from('portfolio_graphical_abstracts')
        .select('*')
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });

      const { data: websitesData, error: websitesError } = await supabase
        .from('lab_websites')
        .select('*')
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });

      const { data: figuresData, error: figuresError } = await supabase
        .from('portfolio_figures')
        .select('*')
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (coversError) {
        console.error('Error fetching covers:', coversError);
      } else {
        setCovers(coversData || []);
      }

      if (videosError) {
        console.error('Error fetching videos:', videosError);
      } else {
        setVideos((videosData as PortfolioVideo[]) || []);
      }

      if (abstractsError) {
        console.error('Error fetching graphical abstracts:', abstractsError);
      } else {
        setGraphicalAbstracts((abstractsData as GraphicalAbstract[]) || []);
      }

      if (websitesError) {
        console.error('Error fetching websites:', websitesError);
      } else {
        const mappedWebsites: LabWebsite[] = (websitesData || []).map((item: any) => ({
          id: item.id,
          labName: item.lab_name,
          piName: item.pi_name,
          university: item.university || '',
          websiteUrl: item.website_url,
          imageUrl: item.image_url || '',
          description: item.description || '',
          display_order: item.display_order || 0,
        }));
        setWebsites(mappedWebsites);
      }

      if (figuresError) {
        console.error('Error fetching portfolio figures:', figuresError);
      } else {
        setFigures(
          (figuresData || []).map((item: any) => ({
            ...item,
            image_urls: Array.isArray(item.image_urls) ? item.image_urls : [],
          })) as PortfolioFigure[]
        );
      }

      setLoading(false);
    };

    fetchCovers();
  }, []);

  const updateTabBarDock = useCallback(() => {
    const el = tabBarRef.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top;
    const stickyTopPx =
      typeof window !== 'undefined' && window.matchMedia('(min-width: 640px)').matches ? 81 : 68;
    setTabsDocked((prev) => {
      if (prev) return top > stickyTopPx + 28 ? false : true;
      return top <= stickyTopPx;
    });
  }, []);

  useEffect(() => {
    if (loading) return;
    const onScroll = () => {
      const y = window.scrollY;
      setShowScrollTop(y > 500);
      setShowFloatingWorkCta(showFloatingCtaForTab && y > 200);
      updateTabBarDock();
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', updateTabBarDock);
    updateTabBarDock();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', updateTabBarDock);
    };
  }, [loading, updateTabBarDock, showFloatingCtaForTab]);

  useEffect(() => {
    if (loading) return;
    const id = requestAnimationFrame(() => updateTabBarDock());
    return () => cancelAnimationFrame(id);
  }, [activeTab, loading, updateTabBarDock]);

  useEffect(() => {
    if (!showFloatingCtaForTab) setShowFloatingWorkCta(false);
  }, [activeTab, showFloatingCtaForTab]);

  const openModal = (cover: JournalCover) => {
    setSelectedCover(cover);
  };

  const closeModal = () => {
    setSelectedCover(null);
    setSelectedAbstract(null);
    setSelectedFigure(null);
  };

  useEffect(() => {
    if (selectedFigure) setFigureSlideIndex(0);
  }, [selectedFigure?.id]);

  useEffect(() => {
    if (!selectedFigure) return;
    const n = portfolioFigureUrls(selectedFigure).length;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setSelectedCover(null);
        setSelectedAbstract(null);
        setSelectedFigure(null);
        return;
      }
      if (n <= 1) return;
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setFigureSlideIndex((i) => (i - 1 + n) % n);
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        setFigureSlideIndex((i) => (i + 1) % n);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectedFigure]);

  const servicesIllustrationHref = `${ROUTES.services}#request-illustration`;

  const portfolioTopCta = (headline: string, body: string) => (
    <div className="mb-8 rounded-2xl border border-[#37352f]/10 bg-[#fcfaf8]/90 px-5 py-5 shadow-sm sm:px-6 sm:py-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <div className="min-w-0 text-center sm:text-left">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#37352f]/45">Work with me</p>
          <p className="mt-1 font-serif text-lg text-[#37352f] sm:text-xl">{headline}</p>
          <p className="mt-1.5 text-sm leading-relaxed text-[#37352f]/65">{body}</p>
        </div>
        {navigate ? (
          <a
            href={servicesIllustrationHref}
            onClick={(e) => navigate(e, 'services', servicesIllustrationHref)}
            className="inline-flex shrink-0 items-center justify-center self-center rounded-xl bg-[#37352f] px-5 py-3 text-center text-xs font-semibold uppercase tracking-wider text-white transition-colors hover:bg-black sm:self-auto"
          >
            Request illustration
          </a>
        ) : (
          <a
            href={servicesIllustrationHref}
            className="inline-flex shrink-0 items-center justify-center self-center rounded-xl bg-[#37352f] px-5 py-3 text-center text-xs font-semibold uppercase tracking-wider text-white transition-colors hover:bg-black sm:self-auto"
          >
            Request illustration
          </a>
        )}
      </div>
    </div>
  );

  const galleryRows = useMemo((): GalleryRow[] => {
    const rows: GalleryRow[] = [
      ...figures.map((item) => ({ kind: 'figure' as const, item, sort: sortKeyMs(item.created_at) })),
      ...graphicalAbstracts.map((item) => ({ kind: 'abstract' as const, item, sort: sortKeyMs(item.created_at) })),
    ];
    rows.sort((a, b) => b.sort - a.sort);
    if (figuresGalleryFilter === 'figures') return rows.filter((r) => r.kind === 'figure');
    if (figuresGalleryFilter === 'abstracts') return rows.filter((r) => r.kind === 'abstract');
    return rows;
  }, [figures, graphicalAbstracts, figuresGalleryFilter]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#37352f]/20" size={48} />
      </div>
    );
  }

  const coversLayout = activeTab === 'covers';
  /** Same horizontal padding / max width as covers, figures (incl. videos grid). */
  const compactColumn = ['covers', 'videos', 'figures', 'websites-apps'].includes(activeTab);
  const stickyBottomCtaVisible = showFloatingCtaForTab && showFloatingWorkCta;

  return (
    <>
      <div className={coversLayout ? 'w-full bg-white' : 'w-full'}>
        <div
          className={`mx-auto w-full max-w-full flex-grow animate-fade-in-up px-4 pt-6 sm:px-6 md:py-16 ${
            compactColumn ? 'max-w-5xl md:px-10 lg:px-16 xl:max-w-4xl' : 'max-w-6xl md:px-16 lg:px-24'
          } ${stickyBottomCtaVisible ? 'pb-24 sm:pb-28' : 'pb-8'}`}
        >
        <div className="mb-16 text-center">
          <div className="inline-block relative">
            <h1 className="text-4xl md:text-5xl font-serif text-[#37352f] tracking-tight mb-4 relative z-10">Portfolio</h1>
            <div className="absolute bottom-2 left-0 w-full h-3 bg-[#e1e5e8] -z-0 opacity-80 rounded-sm transform -rotate-1"></div>
          </div>
          <p className="font-hand text-2xl text-[#37352f]/60">
            {tabHeroSubtitle[activeTab] ?? 'Scientific illustration and visual communication.'}
          </p>
        </div>

        <div
          ref={tabBarRef}
          className={`sticky top-16 z-30 mb-10 flex justify-center transition-[background-color,box-shadow,border-color] duration-200 sm:top-20 ${
            tabsDocked
              ? `border-b border-[#37352f]/10 py-2.5 shadow-sm backdrop-blur-md ${coversLayout ? 'bg-white/95' : 'bg-[#fcfaf8]/95'}`
              : 'py-2'
          }`}
        >
          <div className="mx-auto flex w-full max-w-6xl justify-center px-2 sm:px-4 md:px-6">
            <div
              className={`inline-flex max-w-full flex-wrap items-center justify-center gap-0.5 rounded-xl border border-[#37352f]/10 p-1 shadow-sm sm:gap-1 ${
                coversLayout ? 'bg-white/90' : 'bg-[#fcfaf8]/90'
              }`}
            >
              <button
                type="button"
                onClick={goTab('covers')}
                className={`rounded-lg px-2.5 py-2 text-[10px] font-semibold uppercase tracking-wide sm:px-3 sm:text-[11px] ${
                  activeTab === 'covers' ? 'bg-[#37352f] text-white' : 'text-[#37352f]/70 hover:bg-[#37352f]/5 hover:text-[#37352f]'
                }`}
              >
                Covers
              </button>
              <button
                type="button"
                title="Figures and graphical abstracts"
                onClick={goTab('figures')}
                className={`rounded-lg px-2.5 py-2 text-[10px] font-semibold uppercase tracking-wide sm:px-3 sm:text-[11px] ${
                  activeTab === 'figures' ? 'bg-[#37352f] text-white' : 'text-[#37352f]/70 hover:bg-[#37352f]/5 hover:text-[#37352f]'
                }`}
              >
                Figures
              </button>
              <button
                type="button"
                title="Lab websites and interactive apps"
                onClick={goTab('websites-apps')}
                className={`rounded-lg px-2.5 py-2 text-[10px] font-semibold uppercase tracking-wide sm:px-3 sm:text-[11px] ${
                  activeTab === 'websites-apps' ? 'bg-[#37352f] text-white' : 'text-[#37352f]/70 hover:bg-[#37352f]/5 hover:text-[#37352f]'
                }`}
              >
                Web & apps
              </button>
              <button
                type="button"
                onClick={goTab('videos')}
                className={`rounded-lg px-2.5 py-2 text-[10px] font-semibold uppercase tracking-wide sm:px-3 sm:text-[11px] ${
                  activeTab === 'videos' ? 'bg-[#37352f] text-white' : 'text-[#37352f]/70 hover:bg-[#37352f]/5 hover:text-[#37352f]'
                }`}
              >
                Videos
              </button>
            </div>
          </div>
        </div>

        {activeTab === 'covers' && (
          <>
            {portfolioTopCta(
              'Need a journal cover?',
              'Share your journal, deadline, and story—we can align art direction with your lab’s visual identity.'
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14 md:gap-y-16 lg:gap-y-20">
              {covers.map((cover) => (
                <div key={cover.id} className="flex flex-col gap-3">
                  <div
                    className="group relative aspect-[3/4] overflow-hidden rounded-lg shadow-md border border-[#37352f]/10 cursor-pointer"
                    onClick={() => openModal(cover)}
                  >
                    <img
                      src={cover.cover_image_url}
                      alt={cover.title}
                      className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-0 left-0 p-5 w-full text-white translate-y-4 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-in-out">
                      <p className="text-xs font-bold uppercase tracking-widest">{cover.journal_name}</p>
                      <h2 className="text-lg font-serif font-semibold leading-tight mt-1">{cover.title}</h2>
                    </div>
                  </div>
                  {(cover.lab_name || cover.institute_name) && (
                    <div className="px-0.5 text-center md:text-left">
                      {cover.lab_name ? (
                        <p className="text-sm font-semibold text-[#37352f] leading-snug">{cover.lab_name}</p>
                      ) : null}
                      {cover.institute_name ? (
                        <p className="mt-1 text-xs font-medium uppercase tracking-[0.12em] text-[#37352f]/55 leading-relaxed">{cover.institute_name}</p>
                      ) : null}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {covers.length === 0 && (
              <div className="text-center py-20 border-2 border-dashed border-[#37352f]/10 rounded-3xl">
                <p className="text-[#37352f]/40 font-serif italic text-xl">No journal covers added yet.</p>
              </div>
            )}
          </>
        )}

        {activeTab === 'videos' && (
          <div className="mt-2">
            <p className="mb-6 text-center text-sm text-[#37352f]/55">Scientific illustration and process videos.</p>
            <div className="mx-auto grid w-full grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-7">
              {videos.map((video) => {
                const embedUrl = getYoutubeEmbedUrl(video.youtube_url);
                return (
                  <div
                    key={video.id}
                    className="flex flex-col gap-3 rounded-lg border border-[#37352f]/10 bg-white/90 p-3 shadow-md sm:p-4"
                  >
                    <div className="aspect-video overflow-hidden rounded-md bg-[#f0eeeb]">
                      {embedUrl ? (
                        <iframe
                          src={embedUrl}
                          title={video.title}
                          className="h-full w-full"
                          loading="lazy"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          referrerPolicy="strict-origin-when-cross-origin"
                          allowFullScreen
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs text-[#37352f]/50">
                          Invalid YouTube URL
                        </div>
                      )}
                    </div>
                    <div className="px-0.5 text-center md:text-left">
                      <h3 className="font-serif text-lg leading-snug text-[#37352f] sm:text-xl">{video.title}</h3>
                      {video.description ? (
                        <p className="mt-1.5 text-xs leading-relaxed text-[#37352f]/65 sm:text-sm">{video.description}</p>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
            {videos.length === 0 && (
              <div className="mx-auto mt-8 max-w-xl rounded-2xl border-2 border-dashed border-[#37352f]/10 py-16 text-center">
                <p className="font-serif text-lg italic text-[#37352f]/40">No videos added yet.</p>
              </div>
            )}
          </div>
        )}


        {activeTab === 'figures' && (
          <div className="mt-2">
            {portfolioTopCta(
              'Figures, panels & graphical abstracts?',
              'Publication-ready visuals—from multi-part figures to one-panel graphical abstracts—aligned with your data and journal expectations.'
            )}
            <nav
              className="mb-8 flex flex-wrap items-center justify-center gap-2"
              aria-label="Filter figures and graphical abstracts"
            >
              {(
                [
                  { id: 'all' as const, label: 'All' },
                  { id: 'figures' as const, label: 'Paper figures' },
                  { id: 'abstracts' as const, label: 'Graphical abstracts' },
                ] as const
              ).map(({ id, label }) => (
                <button
                  key={id}
                  type="button"
                  onClick={goFiguresGallery(id)}
                  className={`rounded-full border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide transition-colors sm:px-4 sm:py-2 sm:text-xs ${
                    figuresGalleryFilter === id
                      ? 'border-[#37352f] bg-[#37352f] text-white shadow-sm'
                      : 'border-[#37352f]/15 bg-white/80 text-[#37352f]/65 hover:border-[#37352f]/25 hover:text-[#37352f]'
                  }`}
                >
                  {label}
                </button>
              ))}
            </nav>

            {galleryRows.length === 0 ? (
              <div className="mx-auto max-w-xl rounded-2xl border-2 border-dashed border-[#37352f]/10 py-16 text-center">
                <p className="font-serif text-lg italic text-[#37352f]/40">
                  {figuresGalleryFilter === 'abstracts'
                    ? 'No graphical abstracts yet.'
                    : figuresGalleryFilter === 'figures'
                      ? 'No paper figures yet.'
                      : 'No figures or graphical abstracts yet.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-x-6 gap-y-10 md:grid-cols-2 md:gap-x-8 md:gap-y-12 lg:grid-cols-3 lg:gap-y-14">
                {galleryRows.map((row) => {
                  if (row.kind === 'figure') {
                    const fig = row.item;
                    const urls = portfolioFigureUrls(fig);
                    const thumb = urls[0];
                    return (
                      <button
                        key={`fig-${fig.id}`}
                        type="button"
                        onClick={() => setSelectedFigure(fig)}
                        className="group flex min-w-0 flex-col gap-2.5 rounded-2xl border border-[#37352f]/10 bg-white/90 text-left shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#37352f]/8 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#37352f]/30"
                      >
                        <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-[#37352f]/10 bg-[#f3f1ee]">
                          {thumb ? (
                            <img
                              src={figureImageDisplayUrl(thumb, { width: 960 })}
                              alt=""
                              className="h-full w-full object-contain transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                              loading="lazy"
                              decoding="async"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-xs text-[#37352f]/45">No preview</div>
                          )}
                          <span className="pointer-events-none absolute left-2 top-2 rounded-full bg-[#37352f]/85 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white backdrop-blur-sm">
                            Figure
                          </span>
                          {urls.length > 1 && (
                            <span className="absolute bottom-2 right-2 rounded-full bg-[#37352f]/80 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white backdrop-blur-sm">
                              {urls.length} images
                            </span>
                          )}
                        </div>
                        <div className="px-0.5 pb-1">
                          <p className="line-clamp-2 font-serif text-sm font-semibold leading-snug text-[#37352f] transition-colors group-hover:text-black sm:text-base">
                            {fig.paper_title}
                          </p>
                          {(fig.lab_name || fig.university_name) && (
                            <p className="mt-1 line-clamp-1 text-[10px] font-medium uppercase tracking-[0.12em] text-[#37352f]/50">
                              {[fig.lab_name, fig.university_name].filter(Boolean).join(' · ')}
                            </p>
                          )}
                        </div>
                      </button>
                    );
                  }
                  const abs = row.item;
                  return (
                    <button
                      key={`abs-${abs.id}`}
                      type="button"
                      onClick={() => setSelectedAbstract(abs)}
                      className="group flex min-w-0 flex-col gap-2.5 rounded-2xl border border-[#37352f]/10 bg-white/90 text-left shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#37352f]/8 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#37352f]/30"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-[#37352f]/10 shadow-md">
                        <img
                          src={abs.abstract_image_url}
                          alt={abs.title}
                          className="h-full w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-[1.02]"
                        />
                        <span className="pointer-events-none absolute left-2 top-2 rounded-full bg-white/95 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-[#37352f]/80 backdrop-blur-sm">
                          Abstract
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                        <div className="absolute bottom-0 left-0 w-full translate-y-3 p-4 text-white opacity-0 transition-all duration-300 ease-in-out group-hover:translate-y-0 group-hover:opacity-100">
                          <p className="text-[10px] font-bold uppercase tracking-widest">{abs.institute_name || abs.journal_name}</p>
                          <h3 className="mt-1 font-serif text-base leading-tight">{abs.title}</h3>
                        </div>
                      </div>
                      <div className="px-0.5 pb-1 text-center md:text-left">
                        <p className="line-clamp-2 text-xs font-semibold leading-snug text-[#37352f]">{abs.title}</p>
                        {(abs.institute_name || abs.journal_name) && (
                          <p className="mt-1 line-clamp-1 text-[10px] font-medium uppercase tracking-[0.12em] text-[#37352f]/50">
                            {abs.institute_name || abs.journal_name}
                          </p>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'websites-apps' && (
          <div className="mt-2">
            <div className="mb-10 flex flex-col items-center justify-center gap-4 rounded-2xl border border-[#37352f]/10 bg-white/80 px-6 py-8 text-center shadow-sm sm:flex-row sm:text-left">
              <div className="max-w-xl flex-1">
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#37352f]/45">Lab web presence</p>
                <p className="mt-1 font-serif text-lg text-[#37352f]">Need a new or redesigned lab website?</p>
                <p className="mt-2 text-sm text-[#37352f]/60">Submit a request from Services — I will follow up by email.</p>
              </div>
              <a
                href={`${ROUTES.services}#request-lab-website`}
                onClick={(e) => navigate && navigate(e, 'services', `${ROUTES.services}#request-lab-website`)}
                className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#37352f] px-5 py-3 text-xs font-semibold uppercase tracking-wider text-white hover:bg-black"
              >
                Lab website request
              </a>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {websites.map((site) => (
                <a key={site.id} href={site.websiteUrl} target="_blank" rel="noopener noreferrer" className="group bg-white/70 border border-[#37352f]/10 rounded-xl overflow-hidden hover:shadow-md transition-all">
                  <div className="h-44 bg-[#f3f1ee] border-b border-[#37352f]/10 overflow-hidden">
                    {site.imageUrl ? (
                      <img src={site.imageUrl} alt={site.labName} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-sm text-[#37352f]/45">Thumbnail coming soon</div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="text-xl font-serif text-[#37352f]">{site.labName}</h3>
                    <p className="text-xs uppercase tracking-wider text-[#37352f]/50 mt-1">
                      {site.piName}
                      {site.university ? ` • ${site.university}` : ''}
                    </p>
                    <p className="text-sm text-[#37352f]/70 mt-3 leading-relaxed">{site.description}</p>
                    <p className="text-xs text-[#37352f]/60 mt-4">{site.websiteUrl}</p>
                  </div>
                </a>
              ))}
              {websites.length === 0 && (
                <div className="col-span-full text-center py-16 border-2 border-dashed border-[#37352f]/10 rounded-2xl text-[#37352f]/45">
                  No websites added yet.
                </div>
              )}
            </div>

            <div className="mt-14 border-t border-[#37352f]/10 pt-12">
              <p className="mb-4 text-center text-xs font-bold uppercase tracking-[0.15em] text-[#37352f]/45">Apps</p>
              <AppsShowcase compact />
            </div>
          </div>
        )}

        </div>
      </div>

      {selectedCover && (
        <div
          className="fixed inset-0 z-[100] flex animate-fade-in-up items-center justify-center bg-black/50 p-3 backdrop-blur-sm sm:p-6"
          style={{ animationDuration: '0.3s' }}
          onClick={closeModal}
        >
          <div
            className="flex max-h-[min(92vh,900px)] w-full max-w-5xl flex-col overflow-hidden rounded-xl bg-[#fcfaf8] shadow-2xl md:max-h-[90vh] md:flex-row"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex min-h-[min(45vh,320px)] shrink-0 items-center justify-center bg-[#ebe8e4] p-3 sm:p-5 md:min-h-0 md:w-[min(52%,480px)] md:max-w-[52%]">
              <img
                src={selectedCover.cover_image_url}
                alt={selectedCover.title}
                className="max-h-[min(50vh,640px)] w-auto max-w-full object-contain md:max-h-[min(82vh,720px)]"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="min-h-0 min-w-0 flex-1 overflow-y-auto p-5 sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-bold uppercase tracking-widest text-[#37352f]/50">{selectedCover.journal_name}</p>
                  <h1 className="mt-1 font-serif text-2xl tracking-tight text-[#37352f] sm:text-3xl">{selectedCover.title}</h1>
                </div>
                <button
                  onClick={closeModal}
                  className="shrink-0 text-[#37352f]/40 transition-colors hover:text-black"
                  aria-label="Close modal"
                >
                  <X size={24} />
                </button>
              </div>

              <p className="my-5 font-sans leading-relaxed text-[#37352f]/70 sm:my-6">{selectedCover.description}</p>

              <div className="space-y-4 border-t border-[#37352f]/10 pt-6 text-sm">
                {selectedCover.institute_name && (
                  <div className="flex items-center gap-4">
                    <span className="text-[#37352f]/50 w-20 flex-shrink-0">Institute</span>
                    <span className="font-semibold">{selectedCover.institute_name}</span>
                  </div>
                )}
                {selectedCover.pi_name && (
                  <div className="flex items-center gap-4">
                    <span className="text-[#37352f]/50 w-20 flex-shrink-0">PI</span>
                    <span className="font-semibold">{selectedCover.pi_name}</span>
                  </div>
                )}
                {selectedCover.lab_name && (
                  <div className="flex items-center gap-4">
                    <span className="text-[#37352f]/50 w-20 flex-shrink-0">Lab</span>
                    {selectedCover.lab_url ? (
                      <a href={selectedCover.lab_url} target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 hover:underline flex items-center gap-1">
                        {selectedCover.lab_name} <ExternalLink size={12} />
                      </a>
                    ) : (
                      <span className="font-semibold">{selectedCover.lab_name}</span>
                    )}
                  </div>
                )}
                {selectedCover.paper_url && (
                  <div className="flex items-center gap-4">
                    <span className="text-[#37352f]/50 w-20 flex-shrink-0">Paper</span>
                    <a href={selectedCover.paper_url} target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 hover:underline flex items-center gap-1">
                      Read the Article <ExternalLink size={12} />
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedAbstract && (
        <div
          className="fixed inset-0 z-[100] flex animate-fade-in-up items-center justify-center bg-black/50 p-3 backdrop-blur-sm sm:p-6"
          style={{ animationDuration: '0.3s' }}
          onClick={closeModal}
        >
          <div
            className="flex max-h-[min(92vh,900px)] w-full max-w-5xl flex-col overflow-hidden rounded-xl bg-[#fcfaf8] shadow-2xl md:max-h-[90vh] md:flex-row"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex min-h-[min(40vh,280px)] shrink-0 items-center justify-center bg-[#ebe8e4] p-3 sm:p-5 md:min-h-0 md:w-[min(52%,480px)] md:max-w-[52%]">
              <img
                src={selectedAbstract.abstract_image_url}
                alt={selectedAbstract.title}
                className="max-h-[min(48vh,560px)] w-auto max-w-full object-contain md:max-h-[min(82vh,680px)]"
              />
            </div>
            <div className="min-h-0 min-w-0 flex-1 overflow-y-auto p-5 sm:p-8">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-bold uppercase tracking-widest text-[#37352f]/50">{selectedAbstract.journal_name}</p>
                  <h1 className="text-3xl font-serif text-[#37352f] tracking-tight mt-1">{selectedAbstract.title}</h1>
                </div>
                <button onClick={closeModal} className="text-[#37352f]/40 hover:text-black transition-colors" aria-label="Close modal"><X size={24} /></button>
              </div>
              <p className="text-[#37352f]/70 font-sans leading-relaxed my-6">{selectedAbstract.description}</p>
              <div className="space-y-4 text-sm border-t border-[#37352f]/10 pt-6">
                {selectedAbstract.institute_name && <div className="flex items-center gap-4"><span className="text-[#37352f]/50 w-20 flex-shrink-0">Institute</span><span className="font-semibold">{selectedAbstract.institute_name}</span></div>}
                {selectedAbstract.pi_name && <div className="flex items-center gap-4"><span className="text-[#37352f]/50 w-20 flex-shrink-0">PI</span><span className="font-semibold">{selectedAbstract.pi_name}</span></div>}
                {selectedAbstract.lab_name && <div className="flex items-center gap-4"><span className="text-[#37352f]/50 w-20 flex-shrink-0">Lab</span>{selectedAbstract.lab_url ? <a href={selectedAbstract.lab_url} target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 hover:underline flex items-center gap-1">{selectedAbstract.lab_name} <ExternalLink size={12} /></a> : <span className="font-semibold">{selectedAbstract.lab_name}</span>}</div>}
                {selectedAbstract.paper_url && <div className="flex items-center gap-4"><span className="text-[#37352f]/50 w-20 flex-shrink-0">Paper</span><a href={selectedAbstract.paper_url} target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 hover:underline flex items-center gap-1">Read the Article <ExternalLink size={12} /></a></div>}
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedFigure && (
        <div
          className="fixed inset-0 z-[100] flex animate-fade-in-up items-center justify-center bg-black/50 p-3 backdrop-blur-sm sm:p-6"
          style={{ animationDuration: '0.3s' }}
          onClick={closeModal}
        >
          <div
            className="flex max-h-[min(92vh,880px)] w-full max-w-[min(92vw,1040px)] flex-col overflow-hidden rounded-xl bg-[#fcfaf8] shadow-2xl md:max-h-[92vh] md:flex-row"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative flex min-h-[min(44vh,320px)] min-w-0 flex-1 flex-col bg-[#ebe8e4] md:min-h-0">
              {(() => {
                const urls = portfolioFigureUrls(selectedFigure);
                const n = urls.length;
                const idx = n > 0 ? ((figureSlideIndex % n) + n) % n : 0;
                const src = urls[idx];
                const goPrev = () => {
                  if (n) setFigureSlideIndex((i) => (i - 1 + n) % n);
                };
                const goNext = () => {
                  if (n) setFigureSlideIndex((i) => (i + 1) % n);
                };
                return (
                  <>
                    <div
                      className="relative flex min-h-[min(38vh,260px)] flex-1 items-center justify-center p-3 sm:p-5"
                      onTouchStart={(e) => {
                        figureTouchStartX.current = e.touches[0]?.clientX ?? null;
                      }}
                      onTouchEnd={(e) => {
                        const start = figureTouchStartX.current;
                        figureTouchStartX.current = null;
                        if (start == null || n <= 1) return;
                        const end = e.changedTouches[0]?.clientX ?? start;
                        const dx = end - start;
                        if (Math.abs(dx) > 48) {
                          if (dx > 0) goPrev();
                          else goNext();
                        }
                      }}
                    >
                      {src ? (
                        <img
                          src={figureImageDisplayUrl(src, { width: 2000, quality: 85 })}
                          alt=""
                          className="max-h-[min(56vh,620px)] w-auto max-w-full object-contain md:max-h-[min(88vh,820px)]"
                          decoding="async"
                          fetchPriority="high"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <p className="px-4 text-center text-sm text-[#37352f]/50">No images for this figure set.</p>
                      )}
                      {n > 1 && (
                        <>
                          <button
                            type="button"
                            onClick={goPrev}
                            className="absolute left-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#37352f]/15 bg-white/95 text-[#37352f] shadow-md transition-colors hover:bg-white"
                            aria-label="Previous image"
                          >
                            <ChevronLeft size={22} strokeWidth={2} />
                          </button>
                          <button
                            type="button"
                            onClick={goNext}
                            className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#37352f]/15 bg-white/95 text-[#37352f] shadow-md transition-colors hover:bg-white"
                            aria-label="Next image"
                          >
                            <ChevronRight size={22} strokeWidth={2} />
                          </button>
                        </>
                      )}
                    </div>
                    {n > 1 && (
                      <div className="flex flex-wrap justify-center gap-1.5 border-t border-[#37352f]/10 bg-[#ebe8e4]/98 px-3 py-2.5">
                        {urls.map((_, i) => (
                          <button
                            key={`${selectedFigure.id}-dot-${i}`}
                            type="button"
                            onClick={() => setFigureSlideIndex(i)}
                            className={`h-1.5 rounded-full transition-all ${i === idx ? 'w-6 bg-[#37352f]' : 'w-1.5 bg-[#37352f]/30 hover:bg-[#37352f]/45'}`}
                            aria-label={`Show image ${i + 1} of ${n}`}
                          />
                        ))}
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
            <div className="min-h-0 w-full max-w-full shrink-0 overflow-y-auto border-t border-[#37352f]/10 p-4 sm:p-5 md:w-60 md:max-w-[min(30%,17rem)] md:border-l md:border-t-0 md:py-5">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#37352f]/45">Publication figure</p>
                  {selectedFigure.paper_url ? (
                    <a
                      href={selectedFigure.paper_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1.5 inline-flex items-start gap-1.5 font-serif text-base font-semibold leading-snug tracking-tight text-[#37352f] hover:underline sm:text-lg"
                    >
                      <span>{selectedFigure.paper_title}</span>
                      <ExternalLink size={14} className="mt-0.5 shrink-0 opacity-50" />
                    </a>
                  ) : (
                    <h1 className="mt-1.5 font-serif text-base font-semibold leading-snug tracking-tight text-[#37352f] sm:text-lg">
                      {selectedFigure.paper_title}
                    </h1>
                  )}
                </div>
                <button
                  type="button"
                  onClick={closeModal}
                  className="shrink-0 text-[#37352f]/40 transition-colors hover:text-black"
                  aria-label="Close modal"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="mt-5 space-y-3 border-t border-[#37352f]/10 pt-4 text-xs">
                {selectedFigure.university_name && (
                  <div className="flex gap-2">
                    <span className="w-14 shrink-0 text-[10px] uppercase tracking-wide text-[#37352f]/50">Univ.</span>
                    <span className="min-w-0 font-medium leading-snug text-[#37352f]">{selectedFigure.university_name}</span>
                  </div>
                )}
                {selectedFigure.lab_name && (
                  <div className="flex gap-2">
                    <span className="w-14 shrink-0 text-[10px] uppercase tracking-wide text-[#37352f]/50">Lab</span>
                    <span className="min-w-0 font-medium leading-snug text-[#37352f]">{selectedFigure.lab_name}</span>
                  </div>
                )}
                {selectedFigure.authors && (
                  <div className="flex gap-2">
                    <span className="w-14 shrink-0 text-[10px] uppercase tracking-wide text-[#37352f]/50">Authors</span>
                    <span className="min-w-0 leading-relaxed text-[#37352f]/80">{selectedFigure.authors}</span>
                  </div>
                )}
                {portfolioFigureUrls(selectedFigure).length > 1 && (
                  <div className="flex gap-2">
                    <span className="w-14 shrink-0 text-[10px] uppercase tracking-wide text-[#37352f]/50">Panels</span>
                    <span className="font-medium leading-snug text-[#37352f]">
                      {portfolioFigureUrls(selectedFigure).length} — arrows / swipe
                    </span>
                  </div>
                )}
                {selectedFigure.paper_url && (
                  <div className="flex gap-2">
                    <span className="w-14 shrink-0 text-[10px] uppercase tracking-wide text-[#37352f]/50">Paper</span>
                    <a
                      href={selectedFigure.paper_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-w-0 items-center gap-1 font-medium text-blue-600 hover:underline"
                    >
                      Open <ExternalLink size={11} />
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {showFloatingCtaForTab && (
        <div
          className={`fixed inset-x-0 bottom-0 z-[45] flex justify-center pb-[max(0.5rem,env(safe-area-inset-bottom))] transition-opacity duration-300 ease-out ${
            showFloatingWorkCta ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
          }`}
          role="region"
          aria-label="Request illustration"
        >
          <div
            className={`w-full max-w-5xl px-4 transition-transform duration-300 ease-out sm:px-6 md:px-10 lg:px-16 xl:max-w-4xl ${
              showFloatingWorkCta ? 'translate-y-0' : 'translate-y-[120%]'
            }`}
          >
            <div className="mx-auto flex w-full flex-col items-center gap-2 rounded-2xl border border-[#37352f]/10 bg-white/95 px-4 py-2.5 text-center shadow-[0_8px_40px_rgba(55,53,47,0.12)] backdrop-blur-md sm:flex-row sm:justify-between sm:gap-4 sm:py-3 sm:text-left">
              <div className="min-w-0">
                <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#37352f]/40">Work with me</p>
                <p className="mt-0.5 font-serif text-sm leading-snug text-[#37352f] sm:text-[0.95rem]">
                  {activeTab === 'covers' && 'Journal cover commission'}
                  {activeTab === 'figures' &&
                    (figuresGalleryFilter === 'abstracts' ? 'Graphical abstract' : 'Publication figures')}
                </p>
              </div>
              {navigate ? (
                <a
                  href={servicesIllustrationHref}
                  onClick={(e) => navigate(e, 'services', servicesIllustrationHref)}
                  className="inline-flex shrink-0 items-center justify-center rounded-xl bg-[#37352f] px-4 py-2 text-center text-[10px] font-semibold uppercase tracking-wider text-white transition-colors hover:bg-black sm:px-5"
                >
                  Request illustration
                </a>
              ) : (
                <a
                  href={servicesIllustrationHref}
                  className="inline-flex shrink-0 items-center justify-center rounded-xl bg-[#37352f] px-4 py-2 text-center text-[10px] font-semibold uppercase tracking-wider text-white transition-colors hover:bg-black sm:px-5"
                >
                  Request illustration
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className={`fixed right-8 z-[120] w-11 h-11 rounded-full bg-[#37352f] text-white shadow-lg transition-all duration-300 hover:bg-black ${
            stickyBottomCtaVisible ? 'bottom-[5.25rem] sm:bottom-[5.75rem]' : 'bottom-8'
          }`}
          aria-label="Scroll to top"
        >
          ↑
        </button>
      )}
    </>
  );
};

export default Portfolio;
