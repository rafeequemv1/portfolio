import React, { useEffect, useState } from 'react';
import { Loader2, Trash2 } from 'lucide-react';
import { supabase } from '../supabase/client';

type ContactMessageRow = {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
};

const ContactMessagesManager: React.FC = () => {
  const [rows, setRows] = useState<ContactMessageRow[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRows = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false });
    if (error) {
      console.error(error);
      setRows([]);
    } else {
      setRows((data as ContactMessageRow[]) || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRows();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this message?')) return;
    const { error } = await supabase.from('contact_messages').delete().eq('id', id);
    if (error) {
      alert(error.message);
      return;
    }
    fetchRows();
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-[#37352f]/60">
        General illustration inquiries from the Services page form and the home page “Work with me” / “Request illustration” modals. Rows are stored in{' '}
        <code className="rounded bg-[#37352f]/5 px-1 text-xs">contact_messages</code>.
      </p>
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-[#37352f]/25" />
        </div>
      ) : rows.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[#37352f]/15 py-12 text-center text-sm text-[#37352f]/50">No messages yet.</div>
      ) : (
        <div className="space-y-3">
          {rows.map((row) => (
            <div key={row.id} className="rounded-xl border border-[#37352f]/10 bg-white p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-serif text-lg text-[#37352f]">{row.name}</p>
                  <a href={`mailto:${row.email}`} className="text-sm text-blue-700 hover:underline">
                    {row.email}
                  </a>
                  <p className="mt-1 text-xs text-[#37352f]/50">{new Date(row.created_at).toLocaleString()}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(row.id)}
                  className="shrink-0 rounded-full border border-red-200 p-2 text-red-600 hover:bg-red-50"
                  aria-label="Delete message"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <p className="mt-4 whitespace-pre-wrap border-t border-[#37352f]/10 pt-4 text-sm leading-relaxed text-[#37352f]/85">{row.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContactMessagesManager;
