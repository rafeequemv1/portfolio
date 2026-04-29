
import React from 'react';

const Contact: React.FC = () => {
  return (
    <div className="flex-grow flex flex-col items-center justify-center relative p-10 md:p-20 animate-fade-in-up">
      <div className="max-w-lg w-full bg-white/60 backdrop-blur-sm p-10 md:p-14 rounded-xl border border-[#37352f]/5 shadow-sm relative overflow-hidden">
        
        {/* Decorative corner */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-[#FFF9C4] opacity-20 rounded-bl-full -mr-4 -mt-4 blur-xl"></div>

        <div className="text-center mb-10 relative z-10">
          <div className="inline-block relative">
            <h1 className="text-4xl font-serif text-[#37352f] mb-3 relative z-10">Get in Touch</h1>
            <div className="absolute bottom-1 left-0 w-full h-3 bg-[#FFF9C4] -z-0 opacity-80 rounded-sm transform -rotate-1"></div>
          </div>
          <p className="font-hand text-2xl text-[#37352f]/60 rotate-[-1deg] mt-2">let's create something beautiful</p>
        </div>

        <div className="space-y-8 font-sans text-[#37352f]/80 relative z-10">
          
          {/* Direct Contact */}
          <div className="flex flex-col items-center gap-3">
             <a href="mailto:rafeequemavoor@gmail.com" className="text-xl md:text-2xl font-serif italic hover:text-[#37352f] transition-colors border-b border-dashed border-[#37352f]/20 hover:border-[#37352f]/50 pb-1">
               rafeequemavoor@gmail.com
             </a>
             <a href="tel:+919447267129" className="text-sm font-medium tracking-widest text-[#37352f]/50 hover:text-[#37352f] transition-colors">
               +91 9447 267 129
             </a>
          </div>

          <div className="w-12 h-[1px] bg-[#37352f]/10 mx-auto"></div>

          {/* Socials */}
          <div className="grid grid-cols-2 gap-4 text-center text-[10px] font-bold uppercase tracking-[0.15em] text-[#37352f]/60">
            <a href="https://instagram.com/rafeequemavoor" target="_blank" rel="noopener noreferrer" className="hover:text-black hover:bg-white/80 py-3 rounded transition-all duration-300">
              Instagram
            </a>
            <a href="https://twitter.com/rafeequemavoor" target="_blank" rel="noopener noreferrer" className="hover:text-black hover:bg-white/80 py-3 rounded transition-all duration-300">
              Twitter
            </a>
            <a href="https://linkedin.com/in/rafeequemavoor" target="_blank" rel="noopener noreferrer" className="hover:text-black hover:bg-white/80 py-3 rounded transition-all duration-300">
              LinkedIn
            </a>
            <a href="https://facebook.com/rafeequemavoor" target="_blank" rel="noopener noreferrer" className="hover:text-black hover:bg-white/80 py-3 rounded transition-all duration-300">
              Facebook
            </a>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Contact;
