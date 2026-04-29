
import React from 'react';

interface Service {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const services: Service[] = [
  {
    id: '1',
    title: 'Journal Cover Art',
    description: 'High-impact, cinematic 3D renders of molecular structures to showcase your research on the covers of top-tier journals.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
  },
  {
    id: '2',
    title: 'Figures & Infographics',
    description: 'Clear, accurate, and aesthetically pleasing figures, diagrams, and infographics for publications, presentations, and grant proposals.',
    icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
        </svg>
    ),
  },
  {
    id: '3',
    title: 'Lab Websites',
    description: 'Elegant, minimalist, and functional websites for research labs and academic groups to showcase their work, team, and publications.',
    icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
    ),
  },
  {
    id: '4',
    title: 'On-Campus Workshops',
    description: 'Intensive, hands-on training sessions and workshops for universities and institutes on the art and science of effective visual communication.',
    icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path d="M12 14l9-5-9-5-9 5 9 5z" />
            <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-5.998 12.078 12.078 0 01.665-6.479L12 14z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-5.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222 4 2.222V20M1 12v7a2 2 0 002 2h18a2 2 0 002-2v-7" />
        </svg>
    ),
  },
];

const Services: React.FC = () => {
  return (
    <div className="flex-grow w-full max-w-5xl mx-auto p-8 md:px-24 md:py-16 animate-fade-in-up">
      <div className="mb-12 text-center">
        <div className="inline-block relative">
          <h1 className="text-4xl md:text-5xl font-serif text-[#37352f] tracking-tight mb-4 relative z-10">Work With Me</h1>
          <div className="absolute bottom-2 left-0 w-full h-3 bg-[#e0e7e1] -z-0 opacity-80 rounded-sm transform -rotate-1"></div>
        </div>
        <p className="font-hand text-2xl text-[#37352f]/60">Collaborate to bring your research to life.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map((service) => (
          <div
            key={service.id}
            className="group relative flex flex-col p-6 rounded-lg border border-[#37352f]/10 bg-white/50 hover:bg-white transition-all duration-300 ease-out hover:shadow-lg hover:shadow-[#37352f]/5 hover:-translate-y-1"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-[#37352f]/5 rounded-full text-[#37352f]/70 group-hover:bg-[#37352f]/10 group-hover:text-[#37352f] transition-colors">
                {service.icon}
              </div>
            </div>
            <h2 className="text-xl font-serif font-semibold text-[#37352f] mb-2">{service.title}</h2>
            <p className="text-sm font-sans text-[#37352f]/70 leading-relaxed flex-grow">{service.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;
