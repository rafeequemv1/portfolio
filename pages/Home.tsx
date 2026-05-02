
import React, { useEffect, useMemo, useState } from 'react';
import { supabase } from '../supabase/client';
import { Brand, JournalCover, View } from '../types';
import { ROUTES } from '../utils/routes';
import { figureImageDisplayUrl } from '../utils/figureImageUrl';

const shuffleArray = <T,>(items: T[]): T[] => {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

interface HomeProps {
  navigate?: (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>, view: View, path: string) => void;
}

const Home: React.FC<HomeProps> = ({ navigate }) => {
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
    <div className="relative flex flex-grow flex-col items-center px-4 pb-12 pt-12 animate-fade-in-up sm:px-6 md:pb-16 md:pt-20">
      <div className="mb-12 max-w-2xl text-center md:mb-16">
        <h1 className="mb-5 font-serif text-4xl tracking-tight text-[#37352f] sm:text-5xl md:mb-6 md:text-7xl">
          Rafeeque Mavoor
        </h1>
        <div className="flex items-center justify-center gap-3">
          <span className="h-[1px] w-8 bg-[#37352f]/20"></span>
          <p className="text-[#5c5a57] text-xs md:text-sm uppercase tracking-[0.3em] font-sans font-medium">
            Scientific Illustrator • Educator • Entrepreneur
          </p>
          <span className="h-[1px] w-8 bg-[#37352f]/20"></span>
        </div>
        
        {/* Handwritten Note */}
        <div className="mt-12 opacity-80 rotate-[-2deg]">
           <p className="font-hand text-2xl text-[#5c5a57]">
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
                  <img
                    src={figureImageDisplayUrl(cover.cover_image_url, { width: 420, quality: 82 })}
                    alt={cover.title}
                    width={170}
                    height={230}
                    sizes="170px"
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="cover-marquee">
            <div className="cover-marquee-track cover-marquee-track-reverse">
              {[...secondRowFull, ...secondRowFull].map((cover, idx) => (
                <div key={`${cover.id}-reverse-${idx}`} className="cover-marquee-card">
                  <img
                    src={figureImageDisplayUrl(cover.cover_image_url, { width: 420, quality: 82 })}
                    alt={cover.title}
                    width={170}
                    height={230}
                    sizes="170px"
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="mt-10 mb-8">
        <a
          href={ROUTES.portfolioCovers}
          onClick={(e) => {
            if (navigate) {
              e.preventDefault();
              navigate(e, 'portfolio', ROUTES.portfolioCovers);
            }
          }}
          className="inline-flex items-center gap-2 text-xs md:text-sm uppercase tracking-[0.2em] font-semibold text-[#5c5a57] hover:text-[#37352f] transition-colors"
        >
          View All Covers
        </a>
      </div>

      {brands.length > 0 && (
        <section className="w-full max-w-7xl mt-10 md:mt-14 border-t border-[#37352f]/10 pt-10 md:pt-12">
          <div className="text-center mb-7">
            <p className="text-[10px] md:text-xs uppercase tracking-[0.22em] text-[#5c5a57] font-semibold">
              Trusted by researchers and institutions
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-10 md:gap-x-8 md:gap-y-12">
            {brands.map((brand) => (
              <a
                key={brand.id}
                href={brand.website_url || '#'}
                target={brand.website_url ? '_blank' : undefined}
                rel={brand.website_url ? 'noopener noreferrer' : undefined}
                className="group flex flex-col items-center justify-start gap-3 text-center"
                aria-label={
                  brand.website_url ? `${brand.name}, opens in a new tab` : brand.name
                }
              >
                {brand.logo_url ? (
                  <img
                    src={figureImageDisplayUrl(brand.logo_url, { width: 200, quality: 80 })}
                    alt=""
                    width={160}
                    height={56}
                    sizes="(max-width: 768px) 112px, 128px"
                    loading="lazy"
                    decoding="async"
                    className="h-10 w-auto max-w-[min(100%,7rem)] object-contain opacity-80 transition-opacity group-hover:opacity-100 md:h-12 lg:h-14"
                  />
                ) : null}
                <span className="px-1 font-serif text-xs leading-snug text-[#37352f] transition-colors group-hover:text-[#37352f] md:text-sm">
                  {brand.name}
                </span>
              </a>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
