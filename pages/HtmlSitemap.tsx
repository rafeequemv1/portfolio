import React from 'react';
import type { View } from '../types';
import { FOOTER_ESSENTIAL_TRUST, FOOTER_SEO_NAV, ROUTES } from '../utils/routes';
import { SEO_SITE_ORIGIN } from '../utils/seo';

interface HtmlSitemapProps {
  navigate: (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>, view: View, path: string) => void;
}

const HtmlSitemap: React.FC<HtmlSitemapProps> = ({ navigate }) => {
  const renderLink = (label: string, path: string, view: View) => (
    <li key={`${view}-${path}`}>
      <a
        href={`${SEO_SITE_ORIGIN}${path}`}
        onClick={(e) => {
          e.preventDefault();
          navigate(e, view, path);
        }}
        className="text-[#37352f] underline decoration-[#37352f]/25 underline-offset-2 transition-colors hover:decoration-[#37352f]/70"
      >
        {label}
      </a>
      <span className="ml-2 font-mono text-[11px] text-[#37352f]/40">{path}</span>
    </li>
  );

  return (
    <article className="mx-auto w-full max-w-3xl animate-fade-in-up px-4 py-12 sm:px-6 md:py-16">
      <header className="mb-10 border-b border-[#37352f]/10 pb-8">
        <h1 className="font-serif text-3xl tracking-tight text-[#37352f] md:text-4xl">HTML site map</h1>
        <p className="mt-3 text-sm text-[#37352f]/65">
          Human-readable list of main URLs. The machine-readable sitemap is at{' '}
          <a className="text-[#37352f] underline" href={`${SEO_SITE_ORIGIN}/sitemap.xml`}>
            /sitemap.xml
          </a>
          .
        </p>
      </header>

      <section className="mb-10">
        <h2 className="mb-3 font-serif text-xl text-[#37352f]">Policies & essentials</h2>
        <ul className="list-none space-y-2 pl-0 text-sm text-[#37352f]/85">{FOOTER_ESSENTIAL_TRUST.map((x) => renderLink(x.label, x.path, x.view))}</ul>
      </section>

      <section>
        <h2 className="mb-3 font-serif text-xl text-[#37352f]">All public sections</h2>
        <ul className="list-none space-y-2 pl-0 text-sm text-[#37352f]/85">{FOOTER_SEO_NAV.map((x) => renderLink(x.label, x.path, x.view))}</ul>
      </section>

      <section className="mt-10 rounded-lg border border-[#37352f]/10 bg-[#fcfaf8] p-4 text-xs text-[#37352f]/60">
        <p className="font-semibold text-[#37352f]/70">Admin</p>
        <ul className="mt-2 space-y-1">
          <li>{renderLink('Login', ROUTES.login, 'login')}</li>
        </ul>
      </section>
    </article>
  );
};

export default HtmlSitemap;
