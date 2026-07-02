import React, { useEffect, useMemo, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { supabase } from '../supabase/client';
import type { AboutTalk } from '../types';
import { ABOUT_FEATURED_TALKS } from '../utils/routes';
import { getYoutubeEmbedUrl } from '../utils/youtubeEmbed';

const TalkArticle: React.FC<{ talk: AboutTalk }> = ({ talk }) => {
  const embed = getYoutubeEmbedUrl(talk.youtube_url)!;
  return (
    <article className="overflow-hidden rounded-lg border border-[#37352f]/10 bg-white/90 shadow-sm">
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
          <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-[#37352f]/70">{talk.description}</p>
        ) : null}
      </div>
    </article>
  );
};

function talkEmbedKey(url: string): string {
  return getYoutubeEmbedUrl(url) || url.trim();
}

const AboutTalksSection: React.FC = () => {
  const [talks, setTalks] = useState<AboutTalk[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMore, setShowMore] = useState(false);

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

  const orderedTalks = useMemo(() => {
    const legacyTalks: AboutTalk[] = ABOUT_FEATURED_TALKS.map((item, index) => ({
      id: `featured-${index}`,
      title: `${item.label} ${index + 1}`,
      description: null,
      youtube_url: item.href,
      display_order: 1000 + index,
    }));

    const seen = new Set<string>();
    const merged: AboutTalk[] = [];

    for (const talk of talks) {
      if (!getYoutubeEmbedUrl(talk.youtube_url)) continue;
      const key = talkEmbedKey(talk.youtube_url);
      if (seen.has(key)) continue;
      seen.add(key);
      merged.push(talk);
    }

    for (const talk of legacyTalks) {
      if (!getYoutubeEmbedUrl(talk.youtube_url)) continue;
      const key = talkEmbedKey(talk.youtube_url);
      if (seen.has(key)) continue;
      seen.add(key);
      merged.push(talk);
    }

    return merged;
  }, [talks]);

  if (loading) {
    return (
      <section id="talks" className="mb-12 scroll-mt-28" aria-busy="true">
        <h2 className="mb-4 border-b border-[#37352f]/10 pb-2 font-serif text-2xl text-[#37352f]">Talks</h2>
        <p className="text-sm text-[#37352f]/50">Loading…</p>
      </section>
    );
  }

  const primaryTalk = orderedTalks[0];
  const moreTalks = orderedTalks.slice(1);

  return (
    <section id="talks" className="mb-12 scroll-mt-28">
      <h2 className="mb-6 border-b border-[#37352f]/10 pb-2 font-serif text-2xl text-[#37352f]">Talks</h2>
      {orderedTalks.length === 0 ? (
        <p className="text-sm leading-relaxed text-[#37352f]/55">
          Talks and session recordings will appear here when they are published.
        </p>
      ) : (
        <div className="space-y-6">
          {primaryTalk ? <TalkArticle talk={primaryTalk} /> : null}

          {moreTalks.length > 0 ? (
            <>
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setShowMore((open) => !open)}
                  className="inline-flex items-center gap-2 rounded-full border border-[#37352f]/15 bg-white/80 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#37352f]/75 transition-colors hover:border-[#37352f]/30 hover:text-[#37352f]"
                  aria-expanded={showMore}
                >
                  {showMore ? 'Show fewer talks' : `More talks (${moreTalks.length})`}
                  {showMore ? <ChevronUp size={14} aria-hidden /> : <ChevronDown size={14} aria-hidden />}
                </button>
              </div>
              {showMore ? (
                <div className="space-y-10">
                  {moreTalks.map((talk) => (
                    <TalkArticle key={talk.id} talk={talk} />
                  ))}
                </div>
              ) : null}
            </>
          ) : null}
        </div>
      )}
    </section>
  );
};

export default AboutTalksSection;
