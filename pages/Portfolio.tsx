import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase/client';
import { JournalCover } from '../types';
import { Loader2, ExternalLink, X } from 'lucide-react';

const Portfolio: React.FC = () => {
  const [covers, setCovers] = useState<JournalCover[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCover, setSelectedCover] = useState<JournalCover | null>(null);

  useEffect(() => {
    const fetchCovers = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('journal_covers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching covers:', error);
      } else {
        setCovers(data || []);
      }
      setLoading(false);
    };

    fetchCovers();
  }, []);

  const openModal = (cover: JournalCover) => {
    setSelectedCover(cover);
  };

  const closeModal = () => {
    setSelectedCover(null);
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
    </>
  );
};

export default Portfolio;
