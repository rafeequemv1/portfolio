
import React from 'react';

const Home: React.FC = () => {
  return (
    <div className="flex-grow flex flex-col items-center justify-center relative p-6 animate-fade-in-up">
      <div className="text-center max-w-2xl">
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

        {/* Under Construction Notice */}
        <div className="mt-24">
            <p className="text-xs font-sans text-[#37352f]/40 tracking-wider">
                This digital portfolio is a work in progress. New projects and case studies are added frequently.
            </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
