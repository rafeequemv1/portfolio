import React, { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '../supabase/client';
import { GraphicalAbstract, JournalCover, LabWebsite, PortfolioFigure, PortfolioVideo, View } from '../types';
import { Loader2, ExternalLink, X } from 'lucide-react';
import AppsShowcase from '../components/AppsShowcase';

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

interface PortfolioProps {
  initialTab?: 'covers' | 'videos' | 'graphical-abstracts' | 'figures' | 'apps' | 'websites';
  navigate?: (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>, view: View, path: string) => void;
}

const Portfolio: React.FC<PortfolioProps> = ({ initialTab = 'covers', navigate }) => {
  const [covers, setCovers] = useState<JournalCover[]>([]);
  const [videos, setVideos] = useState<PortfolioVideo[]>([]);
  const [graphicalAbstracts, setGraphicalAbstracts] = useState<GraphicalAbstract[]>([]);
  const [websites, setWebsites] = useState<LabWebsite[]>([]);
  const [figures, setFigures] = useState<PortfolioFigure[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCover, setSelectedCover] = useState<JournalCover | null>(null);
  const [selectedAbstract, setSelectedAbstract] = useState<GraphicalAbstract | null>(null);
  const [activeTab, setActiveTab] = useState<'covers' | 'videos' | 'graphical-abstracts' | 'figures' | 'apps' | 'websites'>(initialTab);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [tabsDocked, setTabsDocked] = useState(false);
  const tabBarRef = useRef<HTMLDivElement>(null);

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
    const stickyTopPx = 81;
    setTabsDocked((prev) => {
      if (prev) return top > stickyTopPx + 28 ? false : true;
      return top <= stickyTopPx;
    });
  }, []);

  useEffect(() => {
    if (loading) return;
    const onScroll = () => {
      setShowScrollTop(window.scrollY > 500);
      updateTabBarDock();
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', updateTabBarDock);
    updateTabBarDock();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', updateTabBarDock);
    };
  }, [loading, updateTabBarDock]);

  useEffect(() => {
    if (loading) return;
    const id = requestAnimationFrame(() => updateTabBarDock());
    return () => cancelAnimationFrame(id);
  }, [activeTab, loading, updateTabBarDock]);

  const openModal = (cover: JournalCover) => {
    setSelectedCover(cover);
  };

  const closeModal = () => {
    setSelectedCover(null);
    setSelectedAbstract(null);
  };


  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#37352f]/20" size={48} />
      </div>
    );
  }

  const coversLayout = activeTab === 'covers';

  return (
    <>
      <div className={coversLayout ? 'w-full bg-white' : 'w-full'}>
        <div
          className={`flex-grow w-full mx-auto animate-fade-in-up p-8 md:py-16 ${
            coversLayout ? 'max-w-5xl md:px-10 lg:px-16 xl:max-w-4xl' : 'max-w-6xl md:px-24'
          }`}
        >
        <div className="mb-16 text-center">
          <div className="inline-block relative">
            <h1 className="text-4xl md:text-5xl font-serif text-[#37352f] tracking-tight mb-4 relative z-10">Portfolio</h1>
            <div className="absolute bottom-2 left-0 w-full h-3 bg-[#e1e5e8] -z-0 opacity-80 rounded-sm transform -rotate-1"></div>
          </div>
          <p className="font-hand text-2xl text-[#37352f]/60">A selection of published journal covers.</p>
        </div>

        <div
          ref={tabBarRef}
          className={`sticky top-20 z-30 mb-10 flex justify-center transition-[background-color,box-shadow,border-color] duration-200 ${
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
                onClick={() => setActiveTab('covers')}
                className={`rounded-lg px-2.5 py-2 text-[10px] font-semibold uppercase tracking-wide sm:px-3 sm:text-[11px] ${
                  activeTab === 'covers' ? 'bg-[#37352f] text-white' : 'text-[#37352f]/70 hover:bg-[#37352f]/5 hover:text-[#37352f]'
                }`}
              >
                Covers
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('videos')}
                className={`rounded-lg px-2.5 py-2 text-[10px] font-semibold uppercase tracking-wide sm:px-3 sm:text-[11px] ${
                  activeTab === 'videos' ? 'bg-[#37352f] text-white' : 'text-[#37352f]/70 hover:bg-[#37352f]/5 hover:text-[#37352f]'
                }`}
              >
                Videos
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('apps')}
                className={`rounded-lg px-2.5 py-2 text-[10px] font-semibold uppercase tracking-wide sm:px-3 sm:text-[11px] ${
                  activeTab === 'apps' ? 'bg-[#37352f] text-white' : 'text-[#37352f]/70 hover:bg-[#37352f]/5 hover:text-[#37352f]'
                }`}
              >
                Apps
              </button>
              <button
                type="button"
                title="Graphical abstracts"
                onClick={() => setActiveTab('graphical-abstracts')}
                className={`rounded-lg px-2.5 py-2 text-[10px] font-semibold uppercase tracking-wide sm:px-3 sm:text-[11px] ${
                  activeTab === 'graphical-abstracts' ? 'bg-[#37352f] text-white' : 'text-[#37352f]/70 hover:bg-[#37352f]/5 hover:text-[#37352f]'
                }`}
              >
                Abstracts
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('figures')}
                className={`rounded-lg px-2.5 py-2 text-[10px] font-semibold uppercase tracking-wide sm:px-3 sm:text-[11px] ${
                  activeTab === 'figures' ? 'bg-[#37352f] text-white' : 'text-[#37352f]/70 hover:bg-[#37352f]/5 hover:text-[#37352f]'
                }`}
              >
                Figures
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('websites')}
                className={`rounded-lg px-2.5 py-2 text-[10px] font-semibold uppercase tracking-wide sm:px-3 sm:text-[11px] ${
                  activeTab === 'websites' ? 'bg-[#37352f] text-white' : 'text-[#37352f]/70 hover:bg-[#37352f]/5 hover:text-[#37352f]'
                }`}
              >
                Websites
              </button>
            </div>
          </div>
        </div>

        {activeTab === 'covers' && (
          <>
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
          <div className="mt-8">
            <div className="mb-10 text-center">
              <h2 className="text-3xl md:text-4xl font-serif text-[#37352f] tracking-tight mb-3">Videos</h2>
              <p className="text-[#37352f]/60 text-sm">Scientific illustration and process videos.</p>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {videos.map((video) => {
                const embedUrl = getYoutubeEmbedUrl(video.youtube_url);
                return (
                  <div key={video.id} className="bg-white border border-[#37352f]/10 rounded-xl p-4 md:p-5 shadow-sm">
                    <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
                      {embedUrl ? (
                        <iframe
                          src={embedUrl}
                          title={video.title}
                          className="w-full h-full"
                          loading="lazy"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          referrerPolicy="strict-origin-when-cross-origin"
                          allowFullScreen
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-sm text-[#37352f]/50">
                          Invalid YouTube URL
                        </div>
                      )}
                    </div>
                    <h3 className="font-serif text-xl text-[#37352f] mt-4">{video.title}</h3>
                    {video.description && <p className="text-sm text-[#37352f]/65 mt-2">{video.description}</p>}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'apps' && <AppsShowcase />}

        {activeTab === 'graphical-abstracts' && (
          <div className="mt-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {graphicalAbstracts.map((item) => (
                <div key={item.id} className="group relative aspect-[4/3] overflow-hidden rounded-lg shadow-md border border-[#37352f]/10 cursor-pointer" onClick={() => setSelectedAbstract(item)}>
                  <img src={item.abstract_image_url} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 p-4 w-full text-white translate-y-3 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-in-out">
                    <p className="text-[10px] font-bold uppercase tracking-widest">{item.institute_name || item.journal_name}</p>
                    <h3 className="text-base font-serif mt-1">{item.title}</h3>
                  </div>
                </div>
              ))}
            </div>
            {graphicalAbstracts.length === 0 && (
              <div className="text-center py-20 border-2 border-dashed border-[#37352f]/10 rounded-3xl">
                <p className="text-[#37352f]/40 font-serif italic text-xl">No graphical abstracts added yet.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'figures' && (
          <div className="mt-8">
            <div className="mb-10 text-center">
              <h2 className="text-2xl md:text-3xl font-serif text-[#37352f] tracking-tight mb-2">Publication figures</h2>
              <p className="text-sm text-[#37352f]/60">Figures from peer-reviewed research.</p>
            </div>
            {figures.length === 0 ? (
              <div className="text-center py-20 border-2 border-dashed border-[#37352f]/10 rounded-3xl">
                <p className="text-[#37352f]/40 font-serif italic text-xl">No figures added yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-12 md:gap-16 lg:grid-cols-2">
                {figures.map((fig) => (
                  <article key={fig.id} className="rounded-xl border border-[#37352f]/10 bg-white/80 p-4 shadow-sm md:p-6">
                    <div className="flex gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                      {(fig.image_urls || []).map((url) => (
                        <img
                          key={url}
                          src={url}
                          alt=""
                          className="max-h-64 w-auto shrink-0 rounded-lg border border-[#37352f]/10 bg-[#fafafa] object-contain md:max-h-80"
                        />
                      ))}
                    </div>
                    <div className="mt-5 space-y-2 border-t border-[#37352f]/10 pt-5">
                      {fig.paper_url ? (
                        <a
                          href={fig.paper_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-start gap-2 font-serif text-lg font-semibold text-[#37352f] hover:underline"
                        >
                          <span>{fig.paper_title}</span>
                          <ExternalLink size={16} className="mt-1 shrink-0 opacity-50" />
                        </a>
                      ) : (
                        <h3 className="font-serif text-lg font-semibold text-[#37352f]">{fig.paper_title}</h3>
                      )}
                      {(fig.lab_name || fig.university_name) && (
                        <p className="text-sm text-[#37352f]/75">{[fig.lab_name, fig.university_name].filter(Boolean).join(' · ')}</p>
                      )}
                      {fig.authors && <p className="text-xs leading-relaxed text-[#37352f]/55">{fig.authors}</p>}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'websites' && (
          <>
            <div className="mb-10 flex flex-col items-center justify-center gap-4 rounded-2xl border border-[#37352f]/10 bg-white/80 px-6 py-8 text-center shadow-sm sm:flex-row sm:text-left">
              <div className="max-w-xl flex-1">
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#37352f]/45">Lab web presence</p>
                <p className="mt-1 font-serif text-lg text-[#37352f]">Need a new or redesigned lab website?</p>
                <p className="mt-2 text-sm text-[#37352f]/60">Submit a request from Services — I will follow up by email.</p>
              </div>
              <a
                href="/services#request-lab-website"
                onClick={(e) => navigate && navigate(e, 'services', '/services#request-lab-website')}
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
          </>
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

      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 z-[120] w-11 h-11 rounded-full bg-[#37352f] text-white shadow-lg hover:bg-black transition-colors"
          aria-label="Scroll to top"
        >
          ↑
        </button>
      )}
    </>
  );
};

export default Portfolio;
