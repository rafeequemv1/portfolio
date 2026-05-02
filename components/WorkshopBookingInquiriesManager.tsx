import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase/client';
import { Loader2, Trash2 } from 'lucide-react';
import { formatBookingTopicIds } from '../data/workshopBookingTopics';

type WorkshopBookingInquiryRow = {
  id: string;
  name: string;
  email: string;
  organization: string | null;
  preferred_dates: string | null;
  topics: string[] | null;
  message: string | null;
  created_at: string;
};

const WorkshopBookingInquiriesManager: React.FC = () => {
  const [inquiries, setInquiries] = useState<WorkshopBookingInquiryRow[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInquiries = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('workshop_booking_inquiries')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      console.error('Error fetching workshop inquiries:', error);
      setInquiries([]);
    } else {
      setInquiries((data as WorkshopBookingInquiryRow[]) || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this booking inquiry?')) return;
    const { error } = await supabase.from('workshop_booking_inquiries').delete().eq('id', id);
    if (error) {
      alert(error.message);
      return;
    }
    fetchInquiries();
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="animate-spin text-[#37352f]/20" size={32} />
      </div>
    );
  }

  if (inquiries.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-[#37352f]/15 py-12 text-center text-sm text-[#37352f]/50">
        No workshop booking requests yet.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {inquiries.map((row) => (
        <div key={row.id} className="rounded-xl border border-[#37352f]/10 bg-white p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="font-serif text-lg text-[#37352f]">{row.name}</h3>
              <a href={`mailto:${row.email}`} className="text-sm text-blue-700 hover:underline">
                {row.email}
              </a>
              <p className="mt-1 text-xs text-[#37352f]/50">{new Date(row.created_at).toLocaleString()}</p>
            </div>
            <button
              type="button"
              onClick={() => handleDelete(row.id)}
              className="shrink-0 rounded-full border border-red-200 p-2 text-red-600 hover:bg-red-50"
              aria-label="Delete inquiry"
            >
              <Trash2 size={16} />
            </button>
          </div>
          {row.organization && (
            <p className="mt-2 text-sm text-[#37352f]/75">
              <span className="font-semibold text-[#37352f]/50">Organization:</span> {row.organization}
            </p>
          )}
          <p className="mt-2 text-sm text-[#37352f]/75">
            <span className="font-semibold text-[#37352f]/50">Topics:</span> {formatBookingTopicIds(row.topics)}
          </p>
          {row.preferred_dates && (
            <p className="mt-1 text-sm text-[#37352f]/75">
              <span className="font-semibold text-[#37352f]/50">Preferred dates:</span> {row.preferred_dates}
            </p>
          )}
          {row.message && (
            <p className="mt-3 whitespace-pre-wrap border-t border-[#37352f]/10 pt-3 text-sm text-[#37352f]/80">{row.message}</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default WorkshopBookingInquiriesManager;
