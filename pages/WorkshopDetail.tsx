
import { useState, useEffect } from 'react';
import { supabase } from '../supabase/client';
import { Workshop, View } from '../types';
import { demoWorkshops } from '../data/demo';
import { formatWorkshopDate } from '../utils/formatWorkshopDate';
import { workshopImageList } from '../utils/workshopImages';

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
                    setWorkshop({
                        ...demoData,
                        gallery_images: workshopImageList(demoData),
                    });
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
                    const row = data as Record<string, unknown>;
                    const urls = Array.isArray(row.image_urls)
                        ? (row.image_urls as string[]).filter((u) => typeof u === 'string' && u.trim())
                        : [];
                    setWorkshop({
                        ...(data as Workshop),
                        cover_image: urls[0] || (data as { cover_image?: string }).cover_image,
                        institute:
                            (data as { location?: string }).location ||
                            (data as { institute?: string }).institute ||
                            '',
                        gallery_images: urls.length ? urls : (data as { gallery_images?: string[] }).gallery_images || [],
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
    
    if (loading) return <div className="text-center p-20">Loading workshop details...</div>;
    if (error || !workshop) return <div className="text-center p-20 text-red-500">Error: Could not load workshop.</div>;

    const navItems = [
      { id: '#overview', label: 'Overview' },
      workshop.content ? { id: '#topics-covered', label: 'Topics Covered' } : null,
      workshop.gallery_images && workshop.gallery_images.length > 0 ? { id: '#gallery', label: 'Gallery' } : null,
      workshop.testimonials && workshop.testimonials.length > 0 ? { id: '#testimonials', label: 'Testimonials' } : null,
    ].filter((item): item is { id: string; label: string } => item !== null);

    const gallery = workshopImageList(workshop);

    return (
        <div className="mx-auto w-full max-w-6xl animate-fade-in-up px-5 py-12 sm:px-8 md:px-12 md:py-16 lg:px-20 lg:py-20">
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

            <header className="mb-16 grid grid-cols-1 items-start gap-10 md:mb-20 md:grid-cols-5 md:gap-14 lg:gap-16">
                <div className="md:col-span-3">
                    <p className="mb-4 text-sm font-medium uppercase tracking-widest text-[#37352f]/50">
                        {workshop.institute} • {formatWorkshopDate(workshop.date, true)}
                    </p>
                    <h1 className="mb-6 font-serif text-4xl tracking-tight text-[#37352f] lg:text-5xl">{workshop.title}</h1>
                    <p className="mb-8 text-lg leading-relaxed text-[#37352f]/70">{workshop.description}</p>
                    <a
                        href="mailto:rafeequemavoor@gmail.com?subject=Workshop Inquiry"
                        className="inline-block rounded-md bg-[#37352f] px-8 py-4 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-black"
                    >
                        Request This Workshop
                    </a>
                </div>

                <div className="min-w-0 md:col-span-2">
                    {gallery.length === 0 && (
                        <div className="flex aspect-[4/3] w-full items-center justify-center rounded-lg border border-dashed border-[#37352f]/15 bg-[#f3f1ee] text-sm text-[#37352f]/40">
                            No images yet
                        </div>
                    )}
                    {gallery.length === 1 && (
                        <img
                            src={gallery[0]}
                            alt={workshop.title}
                            className="aspect-[4/3] h-auto w-full rounded-lg object-cover shadow-xl"
                        />
                    )}
                    {gallery.length === 2 && (
                        <div className="grid grid-cols-2 gap-2">
                            {gallery.map((src, i) => (
                                <img key={src} src={src} alt={i === 0 ? workshop.title : ''} className="aspect-square w-full rounded-lg object-cover shadow-md" />
                            ))}
                        </div>
                    )}
                    {gallery.length >= 3 && (
                        <div className="grid grid-cols-2 gap-2">
                            {gallery.slice(0, 4).map((src, i) => (
                                <img
                                    key={`${src}-${i}`}
                                    src={src}
                                    alt={i === 0 ? workshop.title : ''}
                                    className="aspect-[4/3] w-full rounded-lg object-cover shadow-md"
                                />
                            ))}
                        </div>
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
