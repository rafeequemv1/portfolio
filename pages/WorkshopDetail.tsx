
import { useState, useEffect } from 'react';
import { supabase } from '../supabase/client';
import { Workshop, View } from '../types';
import { demoWorkshops } from '../data/demo';

interface WorkshopDetailProps {
    path: string;
    navigate: (e: React.MouseEvent<HTMLAnchorElement> | React.MouseEvent<HTMLButtonElement>, view: View, path: string) => void;
}

const WorkshopDetail: React.FC<WorkshopDetailProps> = ({ path, navigate }) => {
    const [workshop, setWorkshop] = useState<Workshop | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const id = path.split('/').pop();

    useEffect(() => {
        if (!id) {
            setError('Workshop ID not found.');
            setLoading(false);
            return;
        }

        const fetchWorkshopDetails = async () => {
            setLoading(true);
            if (id.startsWith('demo-')) {
                const demoData = demoWorkshops.find(w => w.id === id);
                if (demoData) {
                    setWorkshop(demoData);
                } else {
                    setError('Demo workshop not found.');
                }
            } else {
                const { data, error } = await supabase
                    .from('workshops')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (error) {
                    setError(error.message);
                    console.error('Error fetching workshop:', error);
                } else {
                    setWorkshop({
                        ...data,
                        cover_image: data.image_urls?.[0] || data.cover_image,
                        institute: data.location || data.institute,
                        gallery_images: data.image_urls || data.gallery_images,
                    });
                }
            }
            setLoading(false);
        };

        fetchWorkshopDetails();
    }, [id]);

    useEffect(() => {
        if (workshop?.title) {
            document.title = `${workshop.title} | Rafeeque Mavoor`;
        }
    }, [workshop]);
    
    const formatDate = (isoString: string) => new Date(isoString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    if (loading) return <div className="text-center p-20">Loading workshop details...</div>;
    if (error || !workshop) return <div className="text-center p-20 text-red-500">Error: Could not load workshop.</div>;

    const navItems = [
      { id: '#overview', label: 'Overview' },
      workshop.content ? { id: '#topics-covered', label: 'Topics Covered' } : null,
      workshop.gallery_images && workshop.gallery_images.length > 0 ? { id: '#gallery', label: 'Gallery' } : null,
      workshop.testimonials && workshop.testimonials.length > 0 ? { id: '#testimonials', label: 'Testimonials' } : null,
    ].filter((item): item is { id: string; label: string } => item !== null);

    return (
        <div className="w-full max-w-6xl mx-auto p-8 md:px-12 lg:px-24 py-12 md:py-20 animate-fade-in-up">
            <div className="mb-8">
                 <a 
                    href="/workshops" 
                    onClick={(e) => navigate(e, 'workshops', '/workshops')}
                    className="inline-flex items-center gap-2 text-sm text-[#37352f]/60 hover:text-[#37352f] transition-colors font-medium"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    All Workshops
                </a>
            </div>

            <header className="grid grid-cols-1 md:grid-cols-5 gap-12 md:gap-16 items-center mb-16 md:mb-20">
                <div className="md:col-span-3">
                    <p className="text-sm font-medium uppercase tracking-widest text-[#37352f]/50 mb-4">{workshop.institute} • {formatDate(workshop.date)}</p>
                    <h1 className="text-4xl lg:text-5xl font-serif text-[#37352f] tracking-tight mb-6">{workshop.title}</h1>
                    <p className="text-lg text-[#37352f]/70 leading-relaxed mb-8">
                        {workshop.description}
                    </p>
                    <a href="mailto:rafeequemavoor@gmail.com?subject=Workshop Inquiry" className="inline-block bg-[#37352f] text-white text-xs font-bold uppercase tracking-widest px-8 py-4 rounded-md hover:bg-black transition-colors">Request This Workshop</a>
                </div>

                <div className="md:col-span-2">
                    {workshop.cover_image && (
                        <img 
                            src={workshop.cover_image} 
                            alt={workshop.title} 
                            className="rounded-lg shadow-xl w-full h-auto aspect-[4/3] object-cover" 
                        />
                    )}
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-5 lg:gap-16">
                <aside className="hidden lg:block lg:col-span-1">
                    <div className="sticky top-28">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-[#37352f]/40 mb-4">On this page</h3>
                        <nav>
                            <ul className="space-y-3">
                                {navItems.map(item => (
                                    <li key={item.id}><a href={item.id} className="text-sm text-[#37352f]/60 hover:text-[#37352f] transition-colors">{item.label}</a></li>
                                ))}
                            </ul>
                        </nav>
                    </div>
                </aside>

                <main className="lg:col-span-4 prose max-w-none prose-headings:font-serif prose-headings:text-[#37352f] prose-headings:border-t prose-headings:border-gray-200 prose-headings:pt-6 prose-headings:mt-6 prose-p:text-[#37352f]/80 prose-li:text-[#37352f]/80 prose-strong:text-[#37352f]">
                    <h3 id="overview">Overview</h3>
                    <p>{workshop.description}</p>
                    
                    {workshop.content && <div dangerouslySetInnerHTML={{ __html: workshop.content }} />}

                    {workshop.gallery_images && workshop.gallery_images.length > 0 && (
                        <>
                            <h3 id="gallery">Gallery</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 not-prose">
                                {workshop.gallery_images.map((img, index) => (
                                    <div key={index} className="overflow-hidden rounded-lg shadow-sm border border-gray-100">
                                       <img src={img} alt={`Workshop gallery image ${index + 1}`} className="object-cover aspect-square w-full h-full hover:scale-105 transition-transform duration-300" />
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {workshop.testimonials && workshop.testimonials.length > 0 && (
                        <>
                            <h3 id="testimonials">Testimonials</h3>
                            <div className="space-y-8 not-prose">
                                {workshop.testimonials.map((t, i) => (
                                    <blockquote key={i} className="relative p-6 bg-white/60 border-l-4 border-[#d1e9e7]">
                                        <p className="text-lg text-[#37352f]/90 italic leading-relaxed">"{t.quote}"</p>
                                        <footer className="mt-4 text-sm not-italic text-right">
                                            — <span className="font-bold">{t.author}</span>, <span className="text-[#37352f]/60">{t.role}</span>
                                        </footer>
                                    </blockquote>
                                ))}
                            </div>
                        </>
                    )}
                </main>
            </div>
        </div>
    );
};

export default WorkshopDetail;
