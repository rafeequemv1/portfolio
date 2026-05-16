import React, { useEffect } from 'react';
import type { AppNavigate } from '../types';
import { ROUTES } from '../utils/routes';
import { applyPageSeo } from '../utils/seo';

interface NotFoundProps {
  path: string;
  navigate: AppNavigate;
}

const NotFound: React.FC<NotFoundProps> = ({ path, navigate }) => {
  useEffect(() => {
    applyPageSeo({
      title: 'Page not found | Rafeeque Mavoor',
      description: 'This page could not be found. Browse services, portfolio, workshops, or contact for scientific illustration.',
      canonicalPath: path.split('?')[0] || '/404',
      robots: 'noindex, nofollow',
    });
  }, [path]);

  return (
    <section
      className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center px-4 py-20 text-center sm:px-6"
      aria-labelledby="not-found-heading"
    >
      <h1 id="not-found-heading" className="mb-3 font-serif text-3xl text-[#37352f] sm:text-4xl">
        Page not found
      </h1>
      <p className="mb-8 text-sm leading-relaxed text-[#5c5a57]">
        The address may be outdated or mistyped. Try the links below or return home.
      </p>
      <nav className="flex flex-wrap justify-center gap-3 text-sm" aria-label="Helpful links">
        <a
          href={ROUTES.home}
          onClick={(e) => navigate(e, 'home', ROUTES.home)}
          className="rounded-lg border border-[#37352f]/15 bg-white px-4 py-2 font-medium text-[#37352f] hover:bg-[#37352f]/5"
        >
          Home
        </a>
        <a
          href={ROUTES.services}
          onClick={(e) => navigate(e, 'services', ROUTES.services)}
          className="rounded-lg border border-[#37352f]/15 bg-white px-4 py-2 font-medium text-[#37352f] hover:bg-[#37352f]/5"
        >
          Services
        </a>
        <a
          href={ROUTES.portfolioCovers}
          onClick={(e) => navigate(e, 'portfolio', ROUTES.portfolioCovers)}
          className="rounded-lg border border-[#37352f]/15 bg-white px-4 py-2 font-medium text-[#37352f] hover:bg-[#37352f]/5"
        >
          Portfolio
        </a>
      </nav>
    </section>
  );
};

export default NotFound;
