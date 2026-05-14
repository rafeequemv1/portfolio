import React from 'react';

const PrivacyPolicy: React.FC = () => {
  return (
    <article className="mx-auto w-full max-w-3xl animate-fade-in-up px-4 py-12 sm:px-6 md:py-16">
      <header className="mb-10 border-b border-[#37352f]/10 pb-8">
        <h1 className="font-serif text-3xl tracking-tight text-[#37352f] md:text-4xl">Privacy policy</h1>
        <p className="mt-2 text-sm text-[#37352f]/60">Last updated: May 2026</p>
      </header>
      <div className="space-y-6 text-sm leading-relaxed text-[#37352f]/85">
        <section>
          <h2 className="mb-2 font-serif text-lg text-[#37352f]">Overview</h2>
          <p>
            This site (rafeeque.com) is operated by Rafeeque Mavoor. This policy explains what information may be collected when you use the
            public pages, lead forms, newsletter signup, or account areas (where applicable), and how it is used.
          </p>
        </section>
        <section>
          <h2 className="mb-2 font-serif text-lg text-[#37352f]">Data we may process</h2>
          <p>
            When you submit a request through forms, we collect the fields you provide (such as name, email, institution, and message). When
            you sign in to an admin area, authentication data is processed by our hosting and database providers (e.g. Supabase) under
            their terms and security practices.
          </p>
        </section>
        <section>
          <h2 className="mb-2 font-serif text-lg text-[#37352f]">Analytics</h2>
          <p>
            We may use privacy-respecting analytics (such as Google Analytics) to understand aggregate traffic. You can control cookies and
            tracking through your browser settings.
          </p>
        </section>
        <section>
          <h2 className="mb-2 font-serif text-lg text-[#37352f]">Retention & contact</h2>
          <p>
            Inquiry data is kept only as long as needed to respond and manage the relationship. To ask questions about this policy or request
            deletion of data tied to a request, contact{' '}
            <a className="text-[#37352f] underline underline-offset-2" href="mailto:rafeequemavoor@gmail.com">
              rafeequemavoor@gmail.com
            </a>
            .
          </p>
        </section>
        <p className="text-xs text-[#37352f]/50">
          This page is a general notice and does not constitute legal advice. Adapt with counsel for your jurisdiction if required.
        </p>
      </div>
    </article>
  );
};

export default PrivacyPolicy;
