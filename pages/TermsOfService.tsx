import React from 'react';

const TermsOfService: React.FC = () => {
  return (
    <article className="mx-auto w-full max-w-3xl animate-fade-in-up px-4 py-12 sm:px-6 md:py-16">
      <header className="mb-10 border-b border-[#37352f]/10 pb-8">
        <h1 className="font-serif text-3xl tracking-tight text-[#37352f] md:text-4xl">Terms of service</h1>
        <p className="mt-2 text-sm text-[#37352f]/60">Last updated: May 2026</p>
      </header>
      <div className="space-y-6 text-sm leading-relaxed text-[#37352f]/85">
        <section>
          <h2 className="mb-2 font-serif text-lg text-[#37352f]">Use of this website</h2>
          <p>
            By using rafeeque.com you agree not to misuse the site, attempt unauthorized access, or interfere with its operation. Content
            (text, images, portfolio samples) is protected by copyright unless otherwise credited.
          </p>
        </section>
        <section>
          <h2 className="mb-2 font-serif text-lg text-[#37352f]">Commissions & deliverables</h2>
          <p>
            Custom illustration, design, and workshop engagements are governed by separate written agreements or statements of work. Unless
            agreed in writing, portfolio display of delivered work may be used for promotion of the studio.
          </p>
        </section>
        <section>
          <h2 className="mb-2 font-serif text-lg text-[#37352f]">Courses & educational content</h2>
          <p>
            Self-paced courses and materials are provided for learning purposes. Redistribution or resale of course materials without
            permission is not allowed.
          </p>
        </section>
        <section>
          <h2 className="mb-2 font-serif text-lg text-[#37352f]">Disclaimer</h2>
          <p>
            Materials on this site are provided “as is” without warranties to the extent permitted by law. Scientific accuracy in client
            work depends on source data supplied by clients and publishers.
          </p>
        </section>
        <section>
          <h2 className="mb-2 font-serif text-lg text-[#37352f]">Contact</h2>
          <p>
            Questions about these terms:{' '}
            <a className="text-[#37352f] underline underline-offset-2" href="mailto:rafeequemavoor@gmail.com">
              rafeequemavoor@gmail.com
            </a>
            .
          </p>
        </section>
        <p className="text-xs text-[#37352f]/50">Review with legal counsel for your jurisdiction before relying on this template as binding terms.</p>
      </div>
    </article>
  );
};

export default TermsOfService;
