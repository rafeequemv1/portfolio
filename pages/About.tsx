
import React from 'react';

const experience = [
  {
    role: 'Founder',
    company: 'Scidart Academy',
    period: 'Jul 2021 - Present',
    location: 'India · On-site',
    description: 'An upskilling platform for scientists and engineers in the art and science of visual communication.'
  },
  {
    role: 'Associate Senior Medical Illustrator',
    company: 'Novo Nordisk',
    period: 'Nov 2022 - Jan 2024',
    duration: '1 yr 3 mos',
    location: 'Bengaluru, Karnataka, India',
    description: 'Developed high-quality medical illustrations and animations for publications and internal communications.'
  },
  {
    role: 'Science Illustrator',
    company: 'Indian Institute of Science Education and Research (IISER), Pune',
    period: 'Jan 2019 - Apr 2021',
    duration: '2 yrs 4 mos',
    location: 'Pune, India',
    description: 'Collaborated with research groups to create compelling scientific illustrations, figures, and graphical abstracts for publications.'
  },
];

const education = [
    {
    institution: 'Indian Institute of Science Education and Research, Thiruvananthapuram',
    degree: 'Master’s Degree, Chemistry',
    period: '2011 – 2016'
  },
  {
    institution: 'Arena Animation',
    degree: 'Animation, Interactive Technology & VFX',
    period: '2016 – 2017'
  },
];

const About: React.FC = () => {
  return (
    <div className="w-full max-w-6xl mx-auto p-8 md:px-12 lg:px-24 py-12 md:py-20 animate-fade-in-up">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
        
        {/* Left Sidebar */}
        <aside className="lg:col-span-1 lg:sticky top-28 self-start">
          <div className="w-32 h-32 rounded-full bg-[#e0e0e0] mb-6 border-4 border-white shadow-md mx-auto lg:mx-0">
            {/* Placeholder for profile image */}
          </div>
          <h1 className="text-3xl font-serif text-center lg:text-left text-[#37352f] tracking-tight">Rafeeque Mavoor</h1>
          <p className="text-md text-center lg:text-left text-[#37352f]/60 mt-1">Lead Scientific Illustrator & Founder of SciDart Academy</p>
          <p className="text-xs text-center lg:text-left text-[#37352f]/40 mt-3 font-medium uppercase tracking-widest">Oxford, United Kingdom</p>
          
          <div className="flex justify-center lg:justify-start gap-4 mt-6">
            <a href="https://twitter.com/rafeequemavoor" target="_blank" rel="noopener noreferrer" className="text-[#37352f]/40 hover:text-[#37352f] transition-colors" aria-label="Twitter">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.71v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path></svg>
            </a>
            <a href="https://linkedin.com/in/rafeequemavoor" target="_blank" rel="noopener noreferrer" className="text-[#37352f]/40 hover:text-[#37352f] transition-colors" aria-label="LinkedIn">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path></svg>
            </a>
          </div>
        </aside>

        {/* Right Content */}
        <main className="lg:col-span-2">
          <section className="mb-12">
            <h2 className="text-2xl font-serif text-[#37352f] mb-4 border-b border-[#37352f]/10 pb-2">About</h2>
            <p className="text-[#37352f]/80 leading-relaxed font-sans">
              With a foundation in Chemistry and a passion for visual storytelling, I bridge the gap between complex scientific discoveries and clear, compelling visual communication. My work focuses on creating high-fidelity 3D molecular renders, biomedical animations, and journal cover art for leading research institutions and publications. I am also the founder of SciDart Academy, an educational platform dedicated to upskilling scientists in the art of illustration.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-serif text-[#37352f] mb-6 border-b border-[#37352f]/10 pb-2">Experience</h2>
            <div className="space-y-6">
              {experience.map((item, index) => (
                <div key={index} className="flex gap-4">
                  <div className="w-12 h-12 bg-white border border-[#37352f]/10 rounded-md flex-shrink-0"></div>
                  <div>
                    <h3 className="font-semibold text-lg text-[#37352f]">{item.role}</h3>
                    <p className="text-md text-[#37352f]/80">{item.company}</p>
                    <p className="text-xs text-[#37352f]/50 font-medium uppercase tracking-widest mt-1">
                      {item.period} {item.duration && `· ${item.duration}`}
                    </p>
                    <p className="text-sm font-sans text-[#37352f]/70 leading-relaxed mt-2">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-[#37352f] mb-6 border-b border-[#37352f]/10 pb-2">Education</h2>
            <div className="space-y-6">
              {education.map((item, index) => (
                <div key={index} className="flex gap-4">
                  <div className="w-12 h-12 bg-white border border-[#37352f]/10 rounded-md flex-shrink-0"></div>
                  <div>
                    <h3 className="font-semibold text-lg text-[#37352f]">{item.institution}</h3>
                    <p className="text-md text-[#37352f]/80">{item.degree}</p>
                    <p className="text-xs text-[#37352f]/50 font-medium uppercase tracking-widest mt-1">{item.period}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>

      </div>
    </div>
  );
};

export default About;
