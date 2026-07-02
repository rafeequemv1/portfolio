import React from 'react';

const Resources: React.FC = () => {
  return (
    <article className="mx-auto w-full max-w-3xl animate-fade-in-up px-4 py-12 sm:px-6 md:py-16">
      <header className="mb-10 border-b border-[#37352f]/10 pb-8 text-center md:text-left">
        <h1 className="font-serif text-3xl tracking-tight text-[#37352f] md:text-4xl">Resources</h1>
        <p className="mt-3 text-sm text-[#37352f]/65">Workshop materials and shared files.</p>
      </header>
      <p className="text-sm leading-relaxed text-[#37352f]/55">
        Free PDFs, videos, and workshop files will be listed here as they are published.
      </p>
    </article>
  );
};

export default Resources;
