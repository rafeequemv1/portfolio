import React, { useEffect, useState } from 'react';
import { Loader2, Trash2 } from 'lucide-react';
import { supabase } from '../supabase/client';

type Row = {
  id: string;
  name: string;
  email: string;
  lab_name: string | null;
  university: string | null;
  message: string | null;
  current_site_url: string | null;
  created_at: string;
};

const LabWebsiteInquiriesManager: React.FC = () => {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('lab_website_inquiries').select('*').order('created_at', { ascending: false });
    if (error) {
      console.error(error);
      setRows([]);
    } else setRows((data as Row[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const del = async (id: string) => {
    if (!window.confirm('Delete this request?')) return;
    const { error } = await supabase.from('lab_website_inquiries').delete().eq('id', id);
    if (error) alert(error.message);
    else load();
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-[#37352f]/60">Requests from the Portfolio → Websites “Get a lab website” form.</p>
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-[#37352f]/25" />
        </div>
      ) : rows.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[#37352f]/15 py-12 text-center text-sm text-[#37352f]/50">No requests yet.</div>
      ) : (
        <div className="space-y-3">
          {rows.map((r) => (
            <div key={r.id} className="rounded-xl border border-[#37352f]/10 bg-white p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-serif text-lg text-[#37352f]">{r.name}</p>
                  <a href={`mailto:${r.email}`} className="text-sm text-blue-700 hover:underline">
                    {r.email}
                  </a>
                  <p className="mt-1 text-xs text-[#37352f]/50">{new Date(r.created_at).toLocaleString()}</p>
                </div>
                <button type="button" onClick={() => del(r.id)} className="rounded-full border border-red-200 p-2 text-red-600 hover:bg-red-50" aria-label="Delete">
                  <Trash2 size={16} />
                </button>
              </div>
              {(r.lab_name || r.university) && (
                <p className="mt-3 text-sm text-[#37352f]/80">
                  {[r.lab_name, r.university].filter(Boolean).join(' · ')}
                </p>
              )}
              {r.current_site_url && (
                <p className="mt-2 text-xs text-[#37352f]/60">
                  Current site:{' '}
                  <a href={r.current_site_url} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline">
                    {r.current_site_url}
                  </a>
                </p>
              )}
              {r.message && <p className="mt-3 whitespace-pre-wrap border-t border-[#37352f]/10 pt-3 text-sm text-[#37352f]/80">{r.message}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LabWebsiteInquiriesManager;
