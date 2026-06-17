import React from 'react';
import { ExternalLink } from 'lucide-react';

const LODHA_GENIUS_WORKSHOP_URL =
  'https://drive.google.com/drive/folders/1r_Vvokk0Cu1m_Hv2aUh_Ri2NhV0OFRa1?usp=sharing';

const Resources: React.FC = () => {
  return (
    <article className="mx-auto w-full max-w-3xl animate-fade-in-up px-4 py-12 sm:px-6 md:py-16">
      <header className="mb-10 border-b border-[#37352f]/10 pb-8 text-center md:text-left">
        <h1 className="font-serif text-3xl tracking-tight text-[#37352f] md:text-4xl">Resources</h1>
        <p className="mt-3 text-sm text-[#37352f]/65">Workshop materials and shared files.</p>
      </header>
      <ul className="space-y-3">
        <li>
          <a
            href={LODHA_GENIUS_WORKSHOP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-[#37352f]/10 bg-white/70 px-5 py-4 text-sm font-semibold text-[#37352f] shadow-sm transition-colors hover:border-[#37352f]/20 hover:bg-white"
          >
            Lodha Genius Workshop
            <ExternalLink size={16} strokeWidth={1.75} className="text-[#37352f]/50" aria-hidden />
          </a>
        </li>
      </ul>
    </article>
  );
};

export default Resources;
