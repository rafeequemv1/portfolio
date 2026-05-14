import React from 'react';

const EditorialGuidelines: React.FC = () => {
  return (
    <article className="mx-auto w-full max-w-3xl animate-fade-in-up px-4 py-12 sm:px-6 md:py-16">
      <header className="mb-10 border-b border-[#37352f]/10 pb-8">
        <h1 className="font-serif text-3xl tracking-tight text-[#37352f] md:text-4xl">Editorial guidelines</h1>
        <p className="mt-2 text-sm text-[#37352f]/60">How blog and public teaching content is produced</p>
      </header>
      <div className="space-y-6 text-sm leading-relaxed text-[#37352f]/85">
        <section>
          <h2 className="mb-2 font-serif text-lg text-[#37352f]">Authorship</h2>
          <p>
            Articles and tutorials on this site are written or edited by Rafeeque Mavoor unless a guest author is explicitly named. The
            About page describes background, education, and experience relevant to scientific illustration and visualization.
          </p>
        </section>
        <section>
          <h2 className="mb-2 font-serif text-lg text-[#37352f]">Accuracy & updates</h2>
          <p>
            Technical posts (e.g. software workflows) are checked against current tool versions when published. Major changes may receive a
            short “last updated” note at the top of the article when refreshed.
          </p>
        </section>
        <section>
          <h2 className="mb-2 font-serif text-lg text-[#37352f]">Disclosure</h2>
          <p>
            If content references tools, books, or services with a commercial relationship, that relationship will be disclosed in the
            article. General educational references do not imply endorsement by employers or publishers.
          </p>
        </section>
        <section>
          <h2 className="mb-2 font-serif text-lg text-[#37352f]">Corrections</h2>
          <p>
            Factual corrections are welcome via the contact email. Substantive fixes may be noted briefly at the bottom of the post when
            applied.
          </p>
        </section>
      </div>
    </article>
  );
};

export default EditorialGuidelines;
