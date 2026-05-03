import React from 'react';
import { AtSign, Facebook, Instagram, Linkedin, Mail, MessageCircle, Phone, Twitter } from 'lucide-react';
import NewsletterSignupCard from '../components/NewsletterSignupCard';
import { View } from '../types';
import { ROUTES } from '../utils/routes';

interface ContactProps {
  navigate: (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>, view: View, path: string) => void;
}

const Contact: React.FC<ContactProps> = ({ navigate }) => {
  return (
    <div className="relative flex flex-grow flex-col items-center px-4 py-10 animate-fade-in-up sm:px-6 md:p-16 lg:p-20">
      <div className="relative w-full max-w-xl overflow-hidden rounded-xl border border-[#37352f]/5 bg-white/60 p-6 shadow-sm backdrop-blur-sm sm:p-8 md:p-14">
        <div className="absolute top-0 right-0 w-24 h-24 bg-[#FFF9C4] opacity-20 rounded-bl-full -mr-4 -mt-4 blur-xl" />

        <div className="text-center mb-10 relative z-10">
          <div className="inline-block relative">
            <h1 className="text-4xl font-serif text-[#37352f] mb-3 relative z-10">Get in Touch</h1>
            <div className="absolute bottom-1 left-0 w-full h-3 bg-[#FFF9C4] -z-0 opacity-80 rounded-sm transform -rotate-1" />
          </div>
          <p className="font-hand text-2xl text-[#37352f]/60 rotate-[-1deg] mt-2">let's create something beautiful</p>
        </div>

        <div className="space-y-10 font-sans text-[#37352f]/80 relative z-10">
          {/* Direct message */}
          <div>
            <div className="mb-4 flex items-center justify-center gap-2 text-[#37352f]">
              <MessageCircle className="h-5 w-5 opacity-70" strokeWidth={1.75} />
              <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#37352f]/70">Send a message</p>
            </div>
            <p className="text-center text-sm leading-relaxed text-[#37352f]/70">
              Project requests and workshop bookings now live on the{' '}
              <a
                href={`${ROUTES.services}#request-illustration`}
                onClick={(e) => navigate(e, 'services', `${ROUTES.services}#request-illustration`)}
                className="font-semibold text-[#37352f] underline decoration-[#37352f]/25 underline-offset-2 hover:decoration-[#37352f]"
              >
                Services
              </a>{' '}
              page so everything stays in one place.
            </p>
            <a
              href={`${ROUTES.services}#request-illustration`}
              onClick={(e) => navigate(e, 'services', `${ROUTES.services}#request-illustration`)}
              className="mt-6 flex w-full items-center justify-center rounded-lg bg-[#37352f] py-3.5 text-sm font-semibold text-white transition-colors hover:bg-black"
            >
              Go to Services — requests
            </a>
          </div>

          <div className="w-12 h-px bg-[#37352f]/10 mx-auto" />

          <NewsletterSignupCard />

          <div className="w-12 h-px bg-[#37352f]/10 mx-auto" />

          <div className="flex flex-col items-center gap-4">
            <a
              href="mailto:rafeequemavoor@gmail.com"
              className="inline-flex items-center gap-3 text-lg md:text-xl font-serif italic hover:text-[#37352f] transition-colors border-b border-dashed border-[#37352f]/20 hover:border-[#37352f]/50 pb-1"
            >
              <Mail className="h-5 w-5 flex-shrink-0 text-[#37352f]/50" strokeWidth={1.5} />
              <span>rafeequemavoor@gmail.com</span>
            </a>
            <a
              href="tel:+919447267129"
              className="inline-flex items-center gap-3 text-sm font-medium tracking-widest text-[#37352f]/50 hover:text-[#37352f] transition-colors"
            >
              <Phone className="h-4 w-4 flex-shrink-0" strokeWidth={1.5} />
              <span>+91 9447 267 129</span>
            </a>
          </div>

          <div className="w-12 h-px bg-[#37352f]/10 mx-auto" />

          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#37352f]/45 text-center mb-4">Social</p>
            <ul className="flex flex-col gap-3">
              <li>
                <a
                  href="https://instagram.com/rafeequemavoor"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-lg border border-[#37352f]/10 bg-white/50 px-4 py-3 text-sm text-[#37352f]/80 hover:border-[#37352f]/25 hover:bg-white transition-colors"
                >
                  <Instagram className="h-5 w-5 text-[#37352f]/55 flex-shrink-0" strokeWidth={1.75} />
                  <span className="font-medium">Instagram</span>
                  <span className="ml-auto text-[10px] text-[#37352f]/35 uppercase tracking-wider">@rafeequemavoor</span>
                </a>
              </li>
              <li>
                <a
                  href="https://twitter.com/rafeequemavoor"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-lg border border-[#37352f]/10 bg-white/50 px-4 py-3 text-sm text-[#37352f]/80 hover:border-[#37352f]/25 hover:bg-white transition-colors"
                >
                  <Twitter className="h-5 w-5 text-[#37352f]/55 flex-shrink-0" strokeWidth={1.75} />
                  <span className="font-medium">Twitter</span>
                  <span className="ml-auto text-[10px] text-[#37352f]/35 uppercase tracking-wider">@rafeequemavoor</span>
                </a>
              </li>
              <li>
                <a
                  href="https://linkedin.com/in/rafeequemavoor"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-lg border border-[#37352f]/10 bg-white/50 px-4 py-3 text-sm text-[#37352f]/80 hover:border-[#37352f]/25 hover:bg-white transition-colors"
                >
                  <Linkedin className="h-5 w-5 text-[#37352f]/55 flex-shrink-0" strokeWidth={1.75} />
                  <span className="font-medium">LinkedIn</span>
                  <span className="ml-auto text-[10px] text-[#37352f]/35 uppercase tracking-wider">/in/rafeequemavoor</span>
                </a>
              </li>
              <li>
                <a
                  href="https://facebook.com/rafeequemavoor"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-lg border border-[#37352f]/10 bg-white/50 px-4 py-3 text-sm text-[#37352f]/80 hover:border-[#37352f]/25 hover:bg-white transition-colors"
                >
                  <Facebook className="h-5 w-5 text-[#37352f]/55 flex-shrink-0" strokeWidth={1.75} />
                  <span className="font-medium">Facebook</span>
                  <span className="ml-auto text-[10px] text-[#37352f]/35 uppercase tracking-wider">/rafeequemavoor</span>
                </a>
              </li>
              <li>
                <a
                  href="https://www.threads.net/@rafeequemavoor"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-lg border border-[#37352f]/10 bg-white/50 px-4 py-3 text-sm text-[#37352f]/80 hover:border-[#37352f]/25 hover:bg-white transition-colors"
                >
                  <AtSign className="h-5 w-5 text-[#37352f]/55 flex-shrink-0" strokeWidth={1.75} />
                  <span className="font-medium">Threads</span>
                  <span className="ml-auto text-[10px] text-[#37352f]/35 uppercase tracking-wider">@rafeequemavoor</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
