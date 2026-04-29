import { useState, useEffect } from 'react';
import { supabase } from '../supabase/client';
import { Workshop, View } from '../types';
import { demoWorkshops } from '../data/demo';

interface WorkshopsProps {
    navigate: (e: React.MouseEvent<HTMLAnchorElement> | React.MouseEvent<HTMLButtonElement>, view: View, path: string) => void;
}

const Workshops: React.FC<WorkshopsProps> = ({ navigate }) => {
    const [workshops, setWorkshops] = useState<Workshop[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchWorkshops = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from('workshops')
                .select('*')
                .order('date', { ascending: false });

            if (error) {
                setError(error.message);
                console.error('Error fetching workshops:', error);
            } else {
                setWorkshops(data || []);
            }
            setLoading(false);
        };

        fetchWorkshops();
    }, []);

    const workshopsToDisplay = !loading && workshops.length === 0 ? demoWorkshops : workshops;

    const formatDate = (isoString: string) => {
        return new Date(isoString).toLocaleDateString('en-US', {
            year: 'numeric', month: 'long',
        });
    };

    return (
        <div className="flex-grow w-full max-w-6xl mx-auto p-8 md:px-24 md:py-16 animate-fade-in-up">
            <div className="mb-16 text-center">
                <div className="inline-block relative">
                    <h1 className="text-4xl md:text-5xl font-serif text-[#37352f] tracking-tight mb-4 relative z-10">Workshops & Training</h1>
                    <div className="absolute bottom-2 left-0 w-full h-3 bg-[#d1e9e7] -z-0 opacity-80 rounded-sm transform -rotate-1"></div>
                </div>
                <p className="font-hand text-2xl text-[#37352f]/60">Sharing knowledge, fostering creativity.</p>
            </div>
            
            {loading && <div className="text-center p-20">Loading workshops...</div>}
            {error && <div className="text-center p-20 text-red-500">Error: {error}</div>}
            
            {!loading && !error && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {workshopsToDisplay.map(workshop => (
                        <a 
                            key={workshop.id} 
                            href={`/workshops/${workshop.id}`}
                            onClick={(e) => navigate(e, 'workshop-detail', `/workshops/${workshop.id}`)}
                            className="bg-white/60 border border-[#37352f]/10 rounded-xl overflow-hidden shadow-sm flex flex-col group hover:-translate-y-1 transition-transform duration-300"
                        >
                            <div className="relative">
                                <div className="w-full h-48 bg-gray-200">
                                    {workshop.cover_image && (
                                        <img src={workshop.cover_image} alt={workshop.title} className="w-full h-full object-cover" />
                                    )}
                                </div>
                                {workshop.status === 'Past' && (
                                    <span className="absolute top-3 right-3 text-[10px] uppercase font-bold text-white bg-[#37352f]/70 px-2 py-1 rounded-full backdrop-blur-sm">
                                        Past Event
                                    </span>
                                )}
                            </div>
                            <div className="p-5 flex flex-col flex-grow">
                                <h2 className="text-xl font-serif text-[#37352f] mb-2 group-hover:text-black transition-colors leading-tight flex-grow">{workshop.title}</h2>
                                <div className="flex justify-between items-center mt-3 pt-3 border-t border-[#37352f]/10">
                                     <span className="text-xs font-medium text-[#37352f]/60">
                                        {workshop.location}
                                    </span>
                                    <span className="text-xs font-medium text-[#37352f]/60">
                                        {formatDate(workshop.date)}
                                    </span>
                                </div>
                            </div>
                        </a>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Workshops;