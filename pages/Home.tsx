
import React, { useEffect, useMemo, useState } from 'react';
import { supabase } from '../supabase/client';
import { Brand, JournalCover } from '../types';

const shuffleArray = <T,>(items: T[]): T[] => {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

const Home: React.FC = () => {
  const [covers, setCovers] = useState<JournalCover[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);

  useEffect(() => {
    const fetchCovers = async () => {
      const { data, error } = await supabase
        .from('journal_covers')
        .select('*')
        .not('cover_image_url', 'is', null)
        .order('created_at', { ascending: true })
        .limit(25);

      if (!error) {
        const valid = (data || []).filter((item: JournalCover) => Boolean(item.cover_image_url));
        setCovers(shuffleArray(valid));
      }
    };

    fetchCovers();
  }, []);

  useEffect(() => {
    const fetchBrands = async () => {
      const { data, error } = await supabase
        .from('brands')
        .select('*')
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: true });

      if (!error) {
        setBrands((data as Brand[]) || []);
      }
    };

    fetchBrands();
  }, []);

  const [firstRow, secondRow] = useMemo(() => {
    if (!covers.length) return [[], []] as [JournalCover[], JournalCover[]];
    const midpoint = Math.ceil(covers.length / 2);
    const rowA = covers.slice(0, midpoint);
    const rowB = covers.slice(midpoint);
    return [rowA, rowB.length ? rowB : rowA];
  }, [covers]);

  const buildFullRow = (row: JournalCover[], minItems: number) => {
    if (!row.length) return [];
    const filled: JournalCover[] = [];
    while (filled.length < minItems) {
      filled.push(...row);
    }
    return filled.slice(0, minItems);
  };

  const firstRowFull = useMemo(() => buildFullRow(firstRow, 12), [firstRow]);
  const secondRowFull = useMemo(() => buildFullRow(secondRow, 12), [secondRow]);

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
              {[...firstRowFull, ...firstRowFull].map((cover, idx) => (
                <div key={`${cover.id}-${idx}`} className="cover-marquee-card">
                  <img src={cover.cover_image_url} alt={cover.title} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          <div className="cover-marquee">
            <div className="cover-marquee-track cover-marquee-track-reverse">
              {[...secondRowFull, ...secondRowFull].map((cover, idx) => (
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

      {brands.length > 0 && (
        <section className="w-full max-w-7xl mt-10 md:mt-14 border-t border-[#37352f]/10 pt-10 md:pt-12">
          <div className="text-center mb-7">
            <p className="text-[10px] md:text-xs uppercase tracking-[0.22em] text-[#37352f]/45 font-semibold">
              Trusted by researchers and institutions
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5">
            {brands.map((brand) => (
              <a
                key={brand.id}
                href={brand.website_url || '#'}
                target={brand.website_url ? '_blank' : undefined}
                rel={brand.website_url ? 'noopener noreferrer' : undefined}
                className="group h-20 md:h-24 px-4 rounded-xl border border-[#37352f]/10 bg-white/60 flex items-center justify-center"
              >
                {brand.logo_url ? (
                  <img
                    src={brand.logo_url}
                    alt={brand.name}
                    className="max-h-10 md:max-h-12 max-w-full object-contain opacity-70 group-hover:opacity-100 transition-opacity"
                  />
                ) : (
                  <span className="text-xs md:text-sm text-[#37352f]/70 text-center font-medium">{brand.name}</span>
                )}
              </a>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
