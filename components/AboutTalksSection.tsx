import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase/client';
import type { AboutTalk } from '../types';
import { getYoutubeEmbedUrl } from '../utils/youtubeEmbed';

const AboutTalksSection: React.FC = () => {
  const [talks, setTalks] = useState<AboutTalk[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from('about_talks')
        .select('*')
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });
      if (cancelled) return;
      if (!error && data) {
        setTalks(
          (data as Record<string, unknown>[]).map((row) => ({
            id: String(row.id),
            title: String(row.title || ''),
            description: (row.description as string) || null,
            youtube_url: String(row.youtube_url || ''),
            display_order: typeof row.display_order === 'number' ? row.display_order : 0,
            created_at: row.created_at as string | undefined,
          }))
        );
      } else {
        setTalks([]);
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <section className="mb-12" aria-busy="true">
        <h2 className="mb-4 border-b border-[#37352f]/10 pb-2 font-serif text-2xl text-[#37352f]">Talks</h2>
        <p className="text-sm text-[#37352f]/50">Loading…</p>
      </section>
    );
  }

  const talksWithEmbed = talks.filter((t) => getYoutubeEmbedUrl(t.youtube_url));

  return (
    <section className="mb-12">
      <h2 className="mb-6 border-b border-[#37352f]/10 pb-2 font-serif text-2xl text-[#37352f]">Talks</h2>
      {talksWithEmbed.length === 0 ? (
        <p className="text-sm leading-relaxed text-[#37352f]/55">
          {talks.length === 0
            ? 'Talks and session recordings will appear here when they are published.'
            : 'These entries need a valid YouTube link (watch or youtu.be URL) to appear as a video.'}
        </p>
      ) : (
        <div className="space-y-10">
          {talksWithEmbed.map((talk) => {
            const embed = getYoutubeEmbedUrl(talk.youtube_url)!;
            return (
              <article key={talk.id} className="overflow-hidden rounded-lg border border-[#37352f]/10 bg-white/90 shadow-sm">
                <div className="aspect-video w-full bg-[#f0eeeb]">
                  <iframe
                    title={talk.title}
                    src={embed}
                    className="h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="strict-origin-when-cross-origin"
                  />
                </div>
                <div className="p-4 sm:p-5">
                  <h3 className="font-serif text-lg text-[#37352f] sm:text-xl">{talk.title}</h3>
                  {talk.description ? (
                    <p className="mt-2 text-sm leading-relaxed text-[#37352f]/70 whitespace-pre-wrap">{talk.description}</p>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default AboutTalksSection;
