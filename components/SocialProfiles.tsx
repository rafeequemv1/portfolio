import React from 'react';
import { BookOpen, Facebook, Instagram, Linkedin, Twitter, Youtube } from 'lucide-react';
import type { View } from '../types';
import { SOCIAL_LINKS, type SocialLinkEntry, type SocialLinkId } from '../utils/socialLinks';

function MediumIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zm7.42 0c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42zm3.38 0c0 2.96-1.3 5.36-2.9 5.36s-2.9-2.4-2.9-5.36 1.3-5.36 2.9-5.36 2.9 2.4 2.9 5.36z" />
    </svg>
  );
}

function BlueskyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M6.5 4.5C8.5 8 12 11.5 12 11.5s3.5-3.5 5.5-7C19 6 21 8 21 10.5c0 5-4.5 8.5-9 12.5C7.5 19 3 15.5 3 10.5 3 8 5 6 6.5 4.5z" />
    </svg>
  );
}

export function SocialIcon({ id, className }: { id: SocialLinkId; className?: string }) {
  const cn = className ?? 'h-4 w-4';
  switch (id) {
    case 'blog':
      return <BookOpen className={cn} size={16} strokeWidth={1.75} aria-hidden />;
    case 'medium':
      return <MediumIcon className={cn} />;
    case 'x':
      return <Twitter className={cn} size={16} strokeWidth={1.75} aria-hidden />;
    case 'instagram':
      return <Instagram className={cn} size={16} strokeWidth={1.75} aria-hidden />;
    case 'linkedin':
      return <Linkedin className={cn} size={16} strokeWidth={1.75} aria-hidden />;
    case 'facebook':
      return <Facebook className={cn} size={16} strokeWidth={1.75} aria-hidden />;
    case 'bluesky':
      return <BlueskyIcon className={cn} />;
    case 'threads':
      return (
        <span className={`${cn} flex items-center justify-center text-sm font-semibold leading-none`} aria-hidden>
          @
        </span>
      );
    case 'youtube':
      return <Youtube className={cn} size={16} strokeWidth={1.75} aria-hidden />;
    default:
      return null;
  }
}

type NavigateFn = (e: React.MouseEvent<HTMLAnchorElement>, view: View, path: string) => void;

interface SocialProfilesProps {
  variant: 'footer' | 'about';
  navigate?: NavigateFn;
}

function SocialAnchor({
  link,
  variant,
  navigate,
}: {
  link: SocialLinkEntry;
  variant: SocialProfilesProps['variant'];
  navigate?: NavigateFn;
}) {
  const isInternal = Boolean(link.view && navigate);
  const rel = link.external ? 'noopener noreferrer' : undefined;
  const target = link.external ? '_blank' : undefined;

  if (variant === 'footer') {
    return (
      <a
        href={link.href}
        target={target}
        rel={rel}
        title={`${link.label} ${link.handle}`}
        className="inline-flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-[#5c5a57] transition-colors hover:bg-[#37352f]/8 hover:text-[#37352f]"
        onClick={
          isInternal
            ? (e) => {
                e.preventDefault();
                navigate!(e, link.view!, link.href);
              }
            : undefined
        }
      >
        <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#37352f]/5 text-[#37352f]/70">
          <SocialIcon id={link.id} className="h-4 w-4" />
        </span>
        <span className="flex min-w-0 flex-col items-start leading-tight">
          <span className="text-[11px] font-semibold text-[#37352f]">{link.label}</span>
          <span className="max-w-[9rem] truncate text-[10px] text-[#37352f]/50 sm:max-w-none">{link.handle}</span>
        </span>
      </a>
    );
  }

  return (
    <a
      href={link.href}
      target={target}
      rel={rel}
      className="flex items-center gap-3 rounded-lg border border-[#37352f]/10 bg-white/50 px-4 py-3 text-sm text-[#37352f]/80 transition-colors hover:border-[#37352f]/25 hover:bg-white"
      onClick={
        isInternal
          ? (e) => {
              e.preventDefault();
              navigate!(e, link.view!, link.href);
            }
          : undefined
      }
    >
      <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#37352f]/5 text-[#37352f]/60">
        <SocialIcon id={link.id} className="h-[18px] w-[18px]" />
      </span>
      <span className="font-medium text-[#37352f]">{link.label}</span>
      <span className="ml-auto text-[10px] uppercase tracking-wider text-[#37352f]/40">{link.handle}</span>
    </a>
  );
}

const SocialProfiles: React.FC<SocialProfilesProps> = ({ variant, navigate }) => {
  if (variant === 'footer') {
    return (
      <nav aria-label="Social profiles" className="border-t border-[#37352f]/10 pt-4">
        <p className="mb-3 text-center text-[10px] font-bold uppercase tracking-[0.18em] text-[#37352f]/45">Connect</p>
        <ul className="mx-auto flex max-w-2xl list-none flex-wrap justify-center gap-1 px-0">
          {SOCIAL_LINKS.map((link) => (
            <li key={link.id}>
              <SocialAnchor link={link} variant="footer" navigate={navigate} />
            </li>
          ))}
        </ul>
      </nav>
    );
  }

  return (
    <div className="mt-6">
      <p className="mb-3 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-[#37352f]/45 lg:text-left">
        Social
      </p>
      <ul className="flex list-none flex-col gap-2 pl-0">
        {SOCIAL_LINKS.map((link) => (
          <li key={link.id}>
            <SocialAnchor link={link} variant="about" navigate={navigate} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SocialProfiles;
