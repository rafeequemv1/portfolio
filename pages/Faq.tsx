import React from 'react';
import { SITE_FAQ_ITEMS } from '../utils/seo';

const Faq: React.FC = () => {
  return (
    <article className="mx-auto w-full max-w-3xl animate-fade-in-up px-4 py-12 sm:px-6 md:py-16">
      <header className="mb-10 border-b border-[#37352f]/10 pb-8 text-center md:text-left">
        <h1 className="font-serif text-3xl tracking-tight text-[#37352f] md:text-4xl">Frequently asked questions</h1>
        <p className="mt-3 text-sm text-[#37352f]/65">
          Quick answers about scientific illustration services, training, and working together.
        </p>
      </header>
      <div className="space-y-8">
        {SITE_FAQ_ITEMS.map((item) => (
          <section key={item.question} className="rounded-xl border border-[#37352f]/10 bg-white/70 p-5 shadow-sm sm:p-6">
            <h2 className="font-serif text-lg text-[#37352f]">{item.question}</h2>
            <p className="mt-3 text-sm leading-relaxed text-[#37352f]/80">{item.answer}</p>
          </section>
        ))}
      </div>
    </article>
  );
};

export default Faq;
