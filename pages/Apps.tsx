import React from 'react';
import AppsShowcase from '../components/AppsShowcase';

const Apps: React.FC = () => {
  return (
    <div className="flex-grow w-full max-w-5xl mx-auto p-8 md:px-24 md:py-16 animate-fade-in-up">
      <div className="mb-12 text-center">
        <div className="inline-block relative">
          <h1 className="text-3xl md:text-4xl font-serif text-[#37352f] mb-2 relative z-10 tracking-tight">Apps & Projects</h1>
          <div className="absolute bottom-1 left-0 w-full h-2 bg-[#f0e6d2] -z-0 opacity-60 rounded-sm transform -rotate-1" />
        </div>
        <div className="mt-2 flex items-center justify-center gap-2">
          <span className="font-hand text-xl text-[#37352f]/50">a digital garden of tools</span>
        </div>
      </div>

      <AppsShowcase />

      <div className="mt-16 text-center">
        <p className="font-hand text-lg text-[#37352f]/40 rotate-1 inline-block">built with react & coffee</p>
      </div>
    </div>
  );
};

export default Apps;
