import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase/client';
import { APP_PROJECTS, type AppProject } from '../data/appProjects';
import { X, ExternalLink } from 'lucide-react';

const fetchAppDetails = async (): Promise<Record<string, string>> => {
  const { data, error } = await supabase.from('portfolio_app_details').select('app_key, detail_content');
  if (error) {
    console.error('Error fetching app details:', error);
    return {};
  }
  const m: Record<string, string> = {};
  for (const row of data || []) {
    m[(row as { app_key: string }).app_key] = (row as { detail_content: string | null }).detail_content || '';
  }
  return m;
};

const AppsShowcase: React.FC = () => {
  const [detailsByKey, setDetailsByKey] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<AppProject | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const m = await fetchAppDetails();
      if (!cancelled) setDetailsByKey(m);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelected(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selected]);

  const detailHtml = selected ? detailsByKey[selected.id] || '' : '';
  const defaultArticle = selected
    ? `<p class="text-[#37352f]/80 leading-relaxed">${selected.description}</p>`
    : '';

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {APP_PROJECTS.map((project) => (
          <button
            key={project.id}
            type="button"
            onClick={() => setSelected(project)}
            className={`group relative flex flex-col p-5 rounded-lg border border-[#37352f]/5 bg-white/60 hover:bg-white text-left transition-all duration-500 ease-out hover:shadow-lg hover:shadow-[#37352f]/5 hover:-translate-y-0.5 overflow-hidden ${project.comingSoon ? 'cursor-default opacity-80' : 'cursor-pointer'}`}
          >
            <div
              className="absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-20 group-hover:opacity-30 transition-opacity duration-500 blur-xl"
              style={{ backgroundColor: project.accentColor }}
            />
            <div className="mb-3 relative z-10 flex items-center justify-between">
              <span className="text-[9px] uppercase tracking-[0.2em] font-medium text-[#37352f]/40 border border-[#37352f]/10 px-2 py-0.5 rounded-full bg-white/50 backdrop-blur-sm">
                {project.category}
              </span>
              <div className="flex gap-2">
                {project.beta && !project.comingSoon && (
                  <span className="text-[9px] uppercase tracking-widest font-bold text-[#37352f]/50 bg-[#37352f]/5 px-1.5 py-0.5 rounded border border-[#37352f]/5">
                    Beta
                  </span>
                )}
                {project.comingSoon && (
                  <span className="text-[9px] uppercase tracking-wider font-bold text-[#37352f]/30">Soon</span>
                )}
              </div>
            </div>
            <div className="relative z-10 flex-grow">
              <div className="inline-block mb-1.5">
                <h3 className="text-xl font-serif text-[#37352f] group-hover:text-black leading-snug">{project.title}</h3>
                <div
                  className="h-[3px] w-full rounded-full mt-1 opacity-80"
                  style={{ backgroundColor: project.accentColor, filter: 'saturate(1.5) brightness(0.95)' }}
                />
              </div>
              <span className="text-[10px] font-mono text-[#37352f]/30 mb-3 block group-hover:text-[#37352f]/50 transition-colors">
                {project.displayUrl}
              </span>
              <p className="text-[#37352f]/70 font-sans text-xs leading-relaxed pr-2">{project.description}</p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#37352f]/5 flex items-center justify-between text-[10px] font-medium text-[#37352f]/30 group-hover:text-[#37352f]/80 transition-colors uppercase tracking-wider">
              <span>{project.comingSoon ? 'Preview' : 'Details'}</span>
              <span className="transform group-hover:translate-x-1 transition-transform duration-300">→</span>
            </div>
          </button>
        ))}
      </div>

      {selected && (
        <>
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[90] animate-fade-in-up md:block"
            style={{ animationDuration: '0.2s' }}
            aria-hidden
            onClick={() => setSelected(null)}
          />
          <aside
            className="fixed z-[95] inset-y-0 right-0 w-full max-w-lg bg-[#fcfaf8] border-l border-[#37352f]/10 shadow-2xl flex flex-col animate-fade-in-up"
            style={{ animationDuration: '0.25s' }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="app-detail-title"
          >
            <div className="flex items-start justify-between gap-4 p-6 border-b border-[#37352f]/10">
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#37352f]/45">{selected.category}</p>
                <h2 id="app-detail-title" className="text-2xl md:text-3xl font-serif text-[#37352f] tracking-tight mt-1">
                  {selected.title}
                </h2>
                <p className="text-xs font-mono text-[#37352f]/45 mt-2">{selected.displayUrl}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="flex-shrink-0 p-2 rounded-full text-[#37352f]/40 hover:text-[#37352f] hover:bg-[#37352f]/5 transition-colors"
                aria-label="Close details"
              >
                <X size={22} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <article className="prose prose-sm prose-neutral max-w-none font-sans">
                {detailHtml ? (
                  <div className="text-[#37352f]/85 leading-relaxed space-y-4 [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_a]:text-blue-700 [&_a]:underline" dangerouslySetInnerHTML={{ __html: detailHtml }} />
                ) : (
                  <div className="text-[#37352f]/85 leading-relaxed space-y-4" dangerouslySetInnerHTML={{ __html: defaultArticle }} />
                )}
              </article>

              {!selected.comingSoon && (
                <a
                  href={selected.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#37352f] text-white text-sm font-medium hover:bg-black transition-colors w-fit"
                >
                  Open app
                  <ExternalLink size={16} />
                </a>
              )}
            </div>
          </aside>
        </>
      )}
    </>
  );
};

export default AppsShowcase;
