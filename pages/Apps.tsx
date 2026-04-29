
import React from 'react';

interface Project {
  id: string;
  title: string;
  url: string;
  displayUrl: string;
  description: string;
  category: string;
  accentColor: string; // Tailwind class or Hex for decorative element
  comingSoon?: boolean;
  beta?: boolean;
}

const projects: Project[] = [
    {
    id: '13',
    title: 'SciDart Academy',
    url: 'https://scidart.com',
    displayUrl: 'scidart.com',
    description: 'An upskilling platform for scientists in visual communication and illustration.',
    category: 'Education',
    accentColor: '#FFD54F', // Amber 300
  },
  {
    id: '1',
    title: 'OpenScienceArt',
    url: 'https://openscienceart.com',
    displayUrl: 'openscienceart.com',
    description: 'A curated open-access library of high-fidelity scientific illustrations and vectors.',
    category: 'Library',
    accentColor: '#B2DFDB' // Teal 100
  },
  {
    id: '2',
    title: 'OceanOfPapers',
    url: 'https://oceanofpapers.com',
    displayUrl: 'oceanofpapers.com',
    description: 'Research paper search tool.',
    category: 'Tool',
    accentColor: '#BBDEFB', // Blue 100
    beta: true
  },
  {
    id: '3',
    title: 'PlantIcons',
    url: 'https://planticons.com',
    displayUrl: 'planticons.com',
    description: 'Library of plant illustrations.',
    category: 'Library',
    accentColor: '#C8E6C9', // Green 100
    beta: true
  },
  {
    id: '4',
    title: 'SciIcons',
    url: 'https://sciicons.com',
    displayUrl: 'sciicons.com',
    description: 'Scientific icons and symbols.',
    category: 'Tool',
    accentColor: '#B3E5FC', // Light Blue
    beta: true
  },
  {
    id: '5',
    title: 'MolDraw',
    url: 'https://moldraw.com',
    displayUrl: 'moldraw.com',
    description: 'Minimalist chemical structure editor.',
    category: 'Tool',
    accentColor: '#E1BEE7', // Purple 100
    beta: true
  },
  {
    id: '6',
    title: 'PosterScientist',
    url: 'https://posterscientist.com',
    displayUrl: 'posterscientist.com',
    description: 'Grid-based tools for academic posters.',
    category: 'Tool',
    accentColor: '#FFE0B2', // Orange 100
    beta: true
  },
  {
    id: '7',
    title: 'MapMyPaper',
    url: 'https://mapmypaper.com',
    displayUrl: 'mapmypaper.com',
    description: 'Convert papers to mindmaps.',
    category: 'Visualisation',
    accentColor: '#FFCDD2', // Red 100
    beta: true
  },
  {
    id: '11',
    title: 'KiwiTeach',
    url: 'https://kiwiteach.com',
    displayUrl: 'kiwiteach.com',
    description: 'Interactive educational tools for biology.',
    category: 'Tool',
    accentColor: '#D1C4E9', // Deep Purple 100
    beta: true
  },
  {
    id: '8',
    title: 'LabCanvas',
    url: 'https://labcanvas.io',
    displayUrl: 'labcanvas.io',
    description: 'Scientific illustration studio.',
    category: 'Tool',
    accentColor: '#C5CAE9', // Indigo 100
    beta: true
  },
  {
    id: '9',
    title: 'SciCommTalent',
    url: 'https://scicommtalent.com',
    displayUrl: 'scicommtalent.com',
    description: 'Community of science illustrators.',
    category: 'Community',
    accentColor: '#F8BBD0' // Pink 100
  },
  {
    id: '12',
    title: 'Upscholar',
    url: 'https://upscholar.co/',
    displayUrl: 'upscholar.co',
    description: 'Academic job board with CV & cover letter tools.',
    category: 'Career',
    accentColor: '#CFD8DC',
    beta: true
  },
  {
    id: '10',
    title: 'TeachSlides',
    url: 'https://teachslides.com',
    displayUrl: 'teachslides.com',
    description: 'AI presentation generator.',
    category: 'Tool',
    accentColor: '#FFF9C4', // Yellow 100
    comingSoon: true
  }
];

const Apps: React.FC = () => {
  return (
    <div className="flex-grow w-full max-w-5xl mx-auto p-8 md:px-24 md:py-16 animate-fade-in-up">
      
      {/* Header Section */}
      <div className="mb-12 text-center">
        <div className="inline-block relative">
             <h1 className="text-3xl md:text-4xl font-serif text-[#37352f] mb-2 relative z-10 tracking-tight">
               Apps & Projects
             </h1>
             {/* Subtle underline highlighter */}
             <div className="absolute bottom-1 left-0 w-full h-2 bg-[#f0e6d2] -z-0 opacity-60 rounded-sm transform -rotate-1"></div>
        </div>
        <div className="mt-2 flex items-center justify-center gap-2">
            <span className="font-hand text-xl text-[#37352f]/50">a digital garden of tools</span>
        </div>
      </div>

      {/* Grid: Tighter gaps, 3 columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {projects.map((project) => (
          <a 
            key={project.id}
            href={project.comingSoon ? undefined : project.url}
            target={project.comingSoon ? undefined : "_blank"}
            rel={project.comingSoon ? undefined : "noopener noreferrer"}
            className={`group relative flex flex-col p-5 rounded-lg border border-[#37352f]/5 bg-white/60 hover:bg-white transition-all duration-500 ease-out hover:shadow-lg hover:shadow-[#37352f]/5 hover:-translate-y-0.5 overflow-hidden ${project.comingSoon ? 'cursor-default opacity-80' : ''}`}
          >
            {/* Pastel Decorative Corner - Smaller */}
            <div 
                className="absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-20 group-hover:opacity-30 transition-opacity duration-500 blur-xl"
                style={{ backgroundColor: project.accentColor }}
            />
            
            {/* Meta Tag - Compact */}
            <div className="mb-3 relative z-10 flex items-center justify-between">
                <span className="text-[9px] uppercase tracking-[0.2em] font-medium text-[#37352f]/40 border border-[#37352f]/10 px-2 py-0.5 rounded-full bg-white/50 backdrop-blur-sm">
                    {project.category}
                </span>
                
                {/* Status Tags */}
                <div className="flex gap-2">
                  {project.beta && !project.comingSoon && (
                     <span className="text-[9px] uppercase tracking-widest font-bold text-[#37352f]/50 bg-[#37352f]/5 px-1.5 py-0.5 rounded border border-[#37352f]/5">
                      Beta
                    </span>
                  )}
                  {project.comingSoon && (
                    <span className="text-[9px] uppercase tracking-wider font-bold text-[#37352f]/30">
                      Soon
                    </span>
                  )}
                </div>
            </div>

            {/* Content - Compact Typography with Underline */}
            <div className="relative z-10 flex-grow">
                <div className="inline-block mb-1.5">
                   <h3 className="text-xl font-serif text-[#37352f] group-hover:text-black leading-snug">
                        {project.title}
                    </h3>
                    <div 
                        className="h-[3px] w-full rounded-full mt-1 opacity-80"
                        style={{ backgroundColor: project.accentColor, filter: 'saturate(1.5) brightness(0.95)' }}
                   ></div>
                </div>
                
                <span className="text-[10px] font-mono text-[#37352f]/30 mb-3 block group-hover:text-[#37352f]/50 transition-colors">
                    {project.displayUrl}
                </span>
                <p className="text-[#37352f]/70 font-sans text-xs leading-relaxed pr-2">
                    {project.description}
                </p>
            </div>

            {/* Hover Action - Subtle */}
            {!project.comingSoon && (
              <div className="mt-4 pt-3 border-t border-[#37352f]/5 flex items-center justify-between text-[10px] font-medium text-[#37352f]/30 group-hover:text-[#37352f]/80 transition-colors uppercase tracking-wider">
                  <span>Open</span>
                  <span className="transform group-hover:translate-x-1 transition-transform duration-300">→</span>
              </div>
            )}
          </a>
        ))}
      </div>
      
      {/* Footer Note */}
      <div className="mt-16 text-center">
        <p className="font-hand text-lg text-[#37352f]/40 rotate-1 inline-block">
          built with react & coffee
        </p>
      </div>
    </div>
  );
};

export default Apps;