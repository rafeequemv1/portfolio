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

export function SocialIcon({ id, className, size = 16 }: { id: SocialLinkId; className?: string; size?: number }) {
  const cn = className ?? 'h-4 w-4';
  switch (id) {
    case 'blog':
      return <BookOpen className={cn} size={size} strokeWidth={1.75} aria-hidden />;
    case 'medium':
      return <MediumIcon className={cn} />;
    case 'x':
      return <Twitter className={cn} size={size} strokeWidth={1.75} aria-hidden />;
    case 'instagram':
      return <Instagram className={cn} size={size} strokeWidth={1.75} aria-hidden />;
    case 'linkedin':
      return <Linkedin className={cn} size={size} strokeWidth={1.75} aria-hidden />;
    case 'facebook':
      return <Facebook className={cn} size={size} strokeWidth={1.75} aria-hidden />;
    case 'bluesky':
      return <BlueskyIcon className={cn} />;
    case 'threads':
      return (
        <span className={`${cn} flex items-center justify-center text-sm font-semibold leading-none`} aria-hidden>
          @
        </span>
      );
    case 'youtube':
      return <Youtube className={cn} size={size} strokeWidth={1.75} aria-hidden />;
    default:
      return null;
  }
}

type NavigateFn = (e: React.MouseEvent<HTMLAnchorElement>, view: View, path: string) => void;

export type SocialProfilesVariant = 'footer' | 'about';

interface SocialProfilesProps {
  variant: SocialProfilesVariant;
  navigate?: NavigateFn;
  className?: string;
}

function SocialAnchor({
  link,
  variant,
  navigate,
}: {
  link: SocialLinkEntry;
  variant: SocialProfilesVariant;
  navigate?: NavigateFn;
}) {
  const isInternal = Boolean(link.view && navigate);
  const rel = link.external ? 'noopener noreferrer' : undefined;
  const target = link.external ? '_blank' : undefined;
  const onClick = isInternal
    ? (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        navigate!(e, link.view!, link.href);
      }
    : undefined;

  if (variant === 'footer') {
    return (
      <a
        href={link.href}
        target={target}
        rel={rel}
        title={link.label}
        className="flex flex-col items-center gap-1.5 rounded-lg px-1 py-2 text-[#5c5a57] transition-colors hover:bg-[#37352f]/5 hover:text-[#37352f]"
        onClick={onClick}
      >
        <span className="inline-flex h-8 w-8 items-center justify-center text-[#37352f]/65">
          <SocialIcon id={link.id} className="h-[18px] w-[18px]" size={18} />
        </span>
        <span className="text-[10px] font-medium leading-none text-[#37352f]/80">{link.label}</span>
      </a>
    );
  }

  return (
    <a
      href={link.href}
      target={target}
      rel={rel}
      title={link.label}
      aria-label={link.label}
      className="inline-flex h-7 w-7 items-center justify-center rounded-full text-[#37352f]/40 transition-colors hover:bg-[#37352f]/6 hover:text-[#37352f]"
      onClick={onClick}
    >
      <SocialIcon id={link.id} className="h-3.5 w-3.5" size={14} />
    </a>
  );
}

const SocialProfiles: React.FC<SocialProfilesProps> = ({ variant, navigate, className = '' }) => {
  if (variant === 'footer') {
    return (
      <nav aria-label="Social profiles" className={className}>
        <ul className="grid list-none grid-cols-3 gap-1 p-0 sm:grid-cols-4 md:grid-cols-5">
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
    <nav className={`mt-5 ${className}`.trim()} aria-label="Social profiles">
      <ul className="flex list-none flex-wrap justify-center gap-1 p-0 lg:justify-start">
        {SOCIAL_LINKS.map((link) => (
          <li key={link.id}>
            <SocialAnchor link={link} variant="about" navigate={navigate} />
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default SocialProfiles;
