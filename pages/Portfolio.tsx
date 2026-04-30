import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase/client';
import { GraphicalAbstract, JournalCover, LabWebsite, PortfolioVideo } from '../types';
import { Loader2, ExternalLink, X } from 'lucide-react';

interface AppProject {
  id: string;
  title: string;
  url: string;
  displayUrl: string;
  description: string;
  category: string;
  accentColor: string;
  comingSoon?: boolean;
  beta?: boolean;
}

const appProjects: AppProject[] = [
  { id: '13', title: 'SciDart Academy', url: 'https://scidart.com', displayUrl: 'scidart.com', description: 'An upskilling platform for scientists in visual communication and illustration.', category: 'Education', accentColor: '#FFD54F' },
  { id: '1', title: 'OpenScienceArt', url: 'https://openscienceart.com', displayUrl: 'openscienceart.com', description: 'A curated open-access library of high-fidelity scientific illustrations and vectors.', category: 'Library', accentColor: '#B2DFDB' },
  { id: '2', title: 'OceanOfPapers', url: 'https://oceanofpapers.com', displayUrl: 'oceanofpapers.com', description: 'Research paper search tool.', category: 'Tool', accentColor: '#BBDEFB', beta: true },
  { id: '3', title: 'PlantIcons', url: 'https://planticons.com', displayUrl: 'planticons.com', description: 'Library of plant illustrations.', category: 'Library', accentColor: '#C8E6C9', beta: true },
  { id: '4', title: 'SciIcons', url: 'https://sciicons.com', displayUrl: 'sciicons.com', description: 'Scientific icons and symbols.', category: 'Tool', accentColor: '#B3E5FC', beta: true },
  { id: '5', title: 'MolDraw', url: 'https://moldraw.com', displayUrl: 'moldraw.com', description: 'Minimalist chemical structure editor.', category: 'Tool', accentColor: '#E1BEE7', beta: true },
  { id: '6', title: 'PosterScientist', url: 'https://posterscientist.com', displayUrl: 'posterscientist.com', description: 'Grid-based tools for academic posters.', category: 'Tool', accentColor: '#FFE0B2', beta: true },
  { id: '7', title: 'MapMyPaper', url: 'https://mapmypaper.com', displayUrl: 'mapmypaper.com', description: 'Convert papers to mindmaps.', category: 'Visualisation', accentColor: '#FFCDD2', beta: true },
  { id: '11', title: 'KiwiTeach', url: 'https://kiwiteach.com', displayUrl: 'kiwiteach.com', description: 'Interactive educational tools for biology.', category: 'Tool', accentColor: '#D1C4E9', beta: true },
  { id: '8', title: 'LabCanvas', url: 'https://labcanvas.io', displayUrl: 'labcanvas.io', description: 'Scientific illustration studio.', category: 'Tool', accentColor: '#C5CAE9', beta: true },
  { id: '9', title: 'SciCommTalent', url: 'https://scicommtalent.com', displayUrl: 'scicommtalent.com', description: 'Community of science illustrators.', category: 'Community', accentColor: '#F8BBD0' },
  { id: '12', title: 'Upscholar', url: 'https://upscholar.co/', displayUrl: 'upscholar.co', description: 'Academic job board with CV & cover letter tools.', category: 'Career', accentColor: '#CFD8DC', beta: true },
  { id: '10', title: 'TeachSlides', url: 'https://teachslides.com', displayUrl: 'teachslides.com', description: 'AI presentation generator.', category: 'Tool', accentColor: '#FFF9C4', comingSoon: true },
];

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
  initialTab?: 'covers' | 'videos' | 'graphical-abstracts' | 'apps' | 'websites';
}

const Portfolio: React.FC<PortfolioProps> = ({ initialTab = 'covers' }) => {
  const [covers, setCovers] = useState<JournalCover[]>([]);
  const [videos, setVideos] = useState<PortfolioVideo[]>([]);
  const [graphicalAbstracts, setGraphicalAbstracts] = useState<GraphicalAbstract[]>([]);
  const [websites, setWebsites] = useState<LabWebsite[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCover, setSelectedCover] = useState<JournalCover | null>(null);
  const [selectedAbstract, setSelectedAbstract] = useState<GraphicalAbstract | null>(null);
  const [activeTab, setActiveTab] = useState<'covers' | 'videos' | 'graphical-abstracts' | 'apps' | 'websites'>(initialTab);
  const [showScrollTop, setShowScrollTop] = useState(false);

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

      setLoading(false);
    };

    fetchCovers();
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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

  return (
    <>
      <div className="flex-grow w-full max-w-6xl mx-auto p-8 md:px-24 md:py-16 animate-fade-in-up">
        <div className="mb-16 text-center">
          <div className="inline-block relative">
            <h1 className="text-4xl md:text-5xl font-serif text-[#37352f] tracking-tight mb-4 relative z-10">Portfolio</h1>
            <div className="absolute bottom-2 left-0 w-full h-3 bg-[#e1e5e8] -z-0 opacity-80 rounded-sm transform -rotate-1"></div>
          </div>
          <p className="font-hand text-2xl text-[#37352f]/60">A selection of published journal covers.</p>
        </div>

        <div className="mb-10 sticky top-20 z-30 flex justify-center">
          <div className="inline-flex items-center p-1 rounded-xl bg-[#fcfaf8]/95 backdrop-blur-md border border-[#37352f]/10 shadow-sm">
            <button onClick={() => setActiveTab('covers')} className={`px-4 py-2 text-xs uppercase tracking-wider rounded-lg ${activeTab === 'covers' ? 'bg-[#37352f] text-white' : 'text-[#37352f]/70 hover:text-[#37352f]'}`}>Covers</button>
            <button onClick={() => setActiveTab('videos')} className={`px-4 py-2 text-xs uppercase tracking-wider rounded-lg ${activeTab === 'videos' ? 'bg-[#37352f] text-white' : 'text-[#37352f]/70 hover:text-[#37352f]'}`}>Videos</button>
            <button onClick={() => setActiveTab('graphical-abstracts')} className={`px-4 py-2 text-xs uppercase tracking-wider rounded-lg ${activeTab === 'graphical-abstracts' ? 'bg-[#37352f] text-white' : 'text-[#37352f]/70 hover:text-[#37352f]'}`}>Graphical Abstracts</button>
            <button onClick={() => setActiveTab('websites')} className={`px-4 py-2 text-xs uppercase tracking-wider rounded-lg ${activeTab === 'websites' ? 'bg-[#37352f] text-white' : 'text-[#37352f]/70 hover:text-[#37352f]'}`}>Websites</button>
            <button onClick={() => setActiveTab('apps')} className={`px-4 py-2 text-xs uppercase tracking-wider rounded-lg ${activeTab === 'apps' ? 'bg-[#37352f] text-white' : 'text-[#37352f]/70 hover:text-[#37352f]'}`}>Apps</button>
          </div>
        </div>

        {activeTab === 'covers' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {covers.map((cover) => (
                <div 
                  key={cover.id} 
                  className="group relative aspect-[3/4] overflow-hidden rounded-lg shadow-md border border-[#37352f]/10 cursor-pointer"
                  onClick={() => openModal(cover)}
                >
                  <img 
                    src={cover.cover_image_url} 
                    alt={cover.title}
                    className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute bottom-0 left-0 p-5 w-full text-white translate-y-4 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-in-out">
                    <p className="text-xs font-bold uppercase tracking-widest">{cover.journal_name}</p>
                    <h2 className="text-lg font-serif font-semibold leading-tight mt-1">{cover.title}</h2>
                  </div>
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
          <div className="mt-24">
            <div className="mb-10 text-center">
              <h2 className="text-3xl md:text-4xl font-serif text-[#37352f] tracking-tight mb-3">Videos</h2>
              <p className="text-[#37352f]/60 text-sm">Scientific illustration and process videos.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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

        {activeTab === 'apps' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {appProjects.map((project) => (
              <a
                key={project.id}
                href={project.comingSoon ? undefined : project.url}
                target={project.comingSoon ? undefined : '_blank'}
                rel={project.comingSoon ? undefined : 'noopener noreferrer'}
                className={`group relative flex flex-col p-5 rounded-lg border border-[#37352f]/5 bg-white/60 hover:bg-white transition-all duration-500 ease-out hover:shadow-lg hover:shadow-[#37352f]/5 hover:-translate-y-0.5 overflow-hidden ${project.comingSoon ? 'cursor-default opacity-80' : ''}`}
              >
                <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-20 group-hover:opacity-30 transition-opacity duration-500 blur-xl" style={{ backgroundColor: project.accentColor }} />
                <div className="mb-3 relative z-10 flex items-center justify-between">
                  <span className="text-[9px] uppercase tracking-[0.2em] font-medium text-[#37352f]/40 border border-[#37352f]/10 px-2 py-0.5 rounded-full bg-white/50 backdrop-blur-sm">{project.category}</span>
                  <div className="flex gap-2">
                    {project.beta && !project.comingSoon && <span className="text-[9px] uppercase tracking-widest font-bold text-[#37352f]/50 bg-[#37352f]/5 px-1.5 py-0.5 rounded border border-[#37352f]/5">Beta</span>}
                    {project.comingSoon && <span className="text-[9px] uppercase tracking-wider font-bold text-[#37352f]/30">Soon</span>}
                  </div>
                </div>
                <div className="relative z-10 flex-grow">
                  <div className="inline-block mb-1.5">
                    <h3 className="text-xl font-serif text-[#37352f] group-hover:text-black leading-snug">{project.title}</h3>
                    <div className="h-[3px] w-full rounded-full mt-1 opacity-80" style={{ backgroundColor: project.accentColor, filter: 'saturate(1.5) brightness(0.95)' }} />
                  </div>
                  <span className="text-[10px] font-mono text-[#37352f]/30 mb-3 block group-hover:text-[#37352f]/50 transition-colors">{project.displayUrl}</span>
                  <p className="text-[#37352f]/70 font-sans text-xs leading-relaxed pr-2">{project.description}</p>
                </div>
                {!project.comingSoon && (
                  <div className="mt-4 pt-3 border-t border-[#37352f]/5 flex items-center justify-between text-[10px] font-medium text-[#37352f]/30 group-hover:text-[#37352f]/80 transition-colors uppercase tracking-wider">
                    <span>Open</span>
                    <span className="transform group-hover:translate-x-1 transition-transform duration-300">→</span>
                  </div>
                )}
              </a>
            ))}
          </div>
        )}
        {activeTab === 'websites' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  <p className="text-xs uppercase tracking-wider text-[#37352f]/50 mt-1">{site.piName}{site.university ? ` • ${site.university}` : ''}</p>
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
        )}
      </div>

      {selectedCover && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in-up"
          style={{ animationDuration: '0.3s' }}
          onClick={closeModal}
        >
          <div 
            className="bg-[#fcfaf8] rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col md:flex-row overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full md:w-1/2 h-64 md:h-auto bg-gray-200">
                <img 
                  src={selectedCover.cover_image_url} 
                  alt={selectedCover.title} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
            </div>
            <div className="w-full md:w-1/2 p-8 overflow-y-auto">
              <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-bold uppercase tracking-widest text-[#37352f]/50">{selectedCover.journal_name}</p>
                    <h1 className="text-3xl font-serif text-[#37352f] tracking-tight mt-1">{selectedCover.title}</h1>
                  </div>
                  <button onClick={closeModal} className="text-[#37352f]/40 hover:text-black transition-colors" aria-label="Close modal">
                    <X size={24} />
                  </button>
              </div>

              <p className="text-[#37352f]/70 font-sans leading-relaxed my-6">{selectedCover.description}</p>
              
              <div className="space-y-4 text-sm border-t border-[#37352f]/10 pt-6">
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in-up" style={{ animationDuration: '0.3s' }} onClick={closeModal}>
          <div className="bg-[#fcfaf8] rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col md:flex-row overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="w-full md:w-1/2 h-64 md:h-auto bg-gray-200">
              <img src={selectedAbstract.abstract_image_url} alt={selectedAbstract.title} className="w-full h-full object-cover" />
            </div>
            <div className="w-full md:w-1/2 p-8 overflow-y-auto">
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
