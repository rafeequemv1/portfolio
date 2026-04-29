
import React, { useEffect, useMemo, useState } from 'react';
import { supabase } from '../supabase/client';
import { JournalCover } from '../types';

const Home: React.FC = () => {
  const [covers, setCovers] = useState<JournalCover[]>([]);

  useEffect(() => {
    const fetchCovers = async () => {
      const { data, error } = await supabase
        .from('journal_covers')
        .select('*')
        .not('cover_image_url', 'is', null)
        .order('created_at', { ascending: false })
        .limit(16);

      if (!error) {
        setCovers((data || []).filter((item: JournalCover) => Boolean(item.cover_image_url)));
      }
    };

    fetchCovers();
  }, []);

  const [firstRow, secondRow] = useMemo(() => {
    if (!covers.length) return [[], []] as [JournalCover[], JournalCover[]];
    const midpoint = Math.ceil(covers.length / 2);
    const rowA = covers.slice(0, midpoint);
    const rowB = covers.slice(midpoint);
    return [rowA, rowB.length ? rowB : rowA];
  }, [covers]);

  return (
    <div className="flex-grow flex flex-col items-center relative p-6 pt-16 md:pt-20 animate-fade-in-up">
      <div className="text-center max-w-2xl mb-14 md:mb-16">
        <h1 className="text-5xl md:text-7xl font-serif text-[#37352f] tracking-tight mb-6">
          Rafeeque Mavoor
        </h1>
        <div className="flex items-center justify-center gap-3">
          <span className="h-[1px] w-8 bg-[#37352f]/20"></span>
          <p className="text-[#37352f]/60 text-xs md:text-sm uppercase tracking-[0.3em] font-sans font-medium">
            Scientific Illustrator • Educator • Entrepreneur
          </p>
          <span className="h-[1px] w-8 bg-[#37352f]/20"></span>
        </div>
        
        {/* Handwritten Note */}
        <div className="mt-12 opacity-80 rotate-[-2deg]">
           <p className="font-hand text-2xl text-[#37352f]/70">
             Visualizing science, with precision and soul.
           </p>
        </div>

      </div>

      {covers.length > 0 && (
        <div className="w-full max-w-7xl space-y-6 md:space-y-8">
          <div className="cover-marquee">
            <div className="cover-marquee-track">
              {[...firstRow, ...firstRow].map((cover, idx) => (
                <div key={`${cover.id}-${idx}`} className="cover-marquee-card">
                  <img src={cover.cover_image_url} alt={cover.title} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          <div className="cover-marquee">
            <div className="cover-marquee-track cover-marquee-track-reverse">
              {[...secondRow, ...secondRow].map((cover, idx) => (
                <div key={`${cover.id}-reverse-${idx}`} className="cover-marquee-card">
                  <img src={cover.cover_image_url} alt={cover.title} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="mt-10 mb-8">
        <a
          href="/portfolio"
          className="inline-flex items-center gap-2 text-xs md:text-sm uppercase tracking-[0.2em] font-semibold text-[#37352f]/70 hover:text-[#37352f] transition-colors"
        >
          View All Covers
        </a>
      </div>
    </div>
  );
};

export default Home;
