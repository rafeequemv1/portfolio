import React from 'react';

const sections = [
  {
    title: 'Information We Store',
    body: (
      <>
        <p>Clipper stores the following information locally in your browser:</p>
        <ul className="mt-3 list-disc space-y-1.5 pl-5">
          <li>Saved social media post text and links</li>
          <li>Saved media URLs from clipped posts</li>
          <li>Author names, handles, avatars, and post metadata from clipped posts</li>
          <li>Draft text written by the user</li>
          <li>Board, bucket, and calendar organization data</li>
        </ul>
        <p className="mt-3">This data is stored using Chrome local storage on your device.</p>
      </>
    ),
  },
  {
    title: 'Information We Do Not Collect',
    body: (
      <>
        <p>Clipper does not collect, sell, rent, or share your personal information.</p>
        <p>
          Clipper does not transfer your saved clips, drafts, or planning data to our servers. The extension does not use
          analytics, advertising trackers, or third-party data brokers.
        </p>
      </>
    ),
  },
  {
    title: 'Permissions',
    body: (
      <>
        <p>Clipper requests browser permissions only to provide its core features:</p>
        <ul className="mt-3 list-disc space-y-1.5 pl-5">
          <li>
            <strong>Storage:</strong> used to save clips, drafts, boards, buckets, and calendar data locally.
          </li>
          <li>
            <strong>Side Panel:</strong> used to display saved clips and quick actions inside Chrome's side panel.
          </li>
          <li>
            <strong>Tabs:</strong> used to open the full Clipper workspace in a browser tab when requested by the user.
          </li>
          <li>
            <strong>Host Permissions:</strong> used to detect and save posts from supported social platforms, including
            X/Twitter, LinkedIn, YouTube, Facebook, and Instagram.
          </li>
        </ul>
      </>
    ),
  },
  {
    title: 'Remote Code',
    body: (
      <p>
        Clipper does not execute remote code. The extension runs from local files packaged with the Chrome extension. Some
        clipped posts may include links, images, videos, or embeds from the original social platform, and those platforms
        may process requests according to their own privacy policies.
      </p>
    ),
  },
  {
    title: 'Data Sharing',
    body: <p>Clipper does not share user data with third parties.</p>,
  },
  {
    title: 'User Control and Data Deletion',
    body: (
      <p>
        You can delete saved clips from inside the extension. You can also remove all stored extension data by uninstalling
        the extension or clearing the extension's site/storage data in Chrome.
      </p>
    ),
  },
  {
    title: "Children's Privacy",
    body: <p>Clipper is not designed for children under 13 and does not knowingly collect personal information from children.</p>,
  },
  {
    title: 'Changes to This Policy',
    body: (
      <p>
        This privacy policy may be updated from time to time. Any changes will be posted on this page with an updated
        "Last updated" date.
      </p>
    ),
  },
];

const ClipperPrivacyPolicy: React.FC = () => (
  <article className="mx-auto w-full max-w-3xl flex-1 px-4 py-12 text-[#37352f] sm:px-6 md:py-16">
    <header className="mb-10 border-b border-[#37352f]/10 pb-8">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#37352f]/45">Chrome extension policy</p>
      <h1 className="font-serif text-3xl tracking-tight sm:text-4xl">Privacy Policy for Clipper</h1>
      <p className="mt-3 text-sm text-[#5c5a57]">Last updated: June 1, 2026</p>
      <p className="mt-5 leading-relaxed text-[#37352f]/75">
        Clipper is a Chrome extension that helps users save social media posts, organize content ideas, write drafts, and
        plan publishing.
      </p>
    </header>

    <div className="space-y-9">
      {sections.map((section) => (
        <section key={section.title} aria-labelledby={section.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}>
          <h2
            id={section.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}
            className="mb-3 font-serif text-2xl tracking-tight"
          >
            {section.title}
          </h2>
          <div className="space-y-3 text-sm leading-relaxed text-[#37352f]/75">{section.body}</div>
        </section>
      ))}

      <section aria-labelledby="contact">
        <h2 id="contact" className="mb-3 font-serif text-2xl tracking-tight">
          Contact
        </h2>
        <p className="text-sm leading-relaxed text-[#37352f]/75">
          For privacy questions or support, contact:{' '}
          <a className="font-medium underline underline-offset-2" href="mailto:rafeequemavoor@gmail.com">
            rafeequemavoor@gmail.com
          </a>
        </p>
      </section>
    </div>
  </article>
);

export default ClipperPrivacyPolicy;
