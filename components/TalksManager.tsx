import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, X, Loader2 } from 'lucide-react';
import { supabase } from '../supabase/client';
import type { AboutTalk } from '../types';
import { getYoutubeEmbedUrl } from '../utils/youtubeEmbed';

const TalksManager: React.FC = () => {
  const [rows, setRows] = useState<AboutTalk[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<AboutTalk | null>(null);
  const [form, setForm] = useState({
    title: '',
    youtube_url: '',
    description: '',
    display_order: 0,
  });

  const fetchRows = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('about_talks')
      .select('*')
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false });
    if (error) {
      console.error(error);
      setRows([]);
    } else {
      setRows(
        ((data || []) as Record<string, unknown>[]).map((row) => ({
          id: String(row.id),
          title: String(row.title || ''),
          description: (row.description as string) || null,
          youtube_url: String(row.youtube_url || ''),
          display_order: typeof row.display_order === 'number' ? row.display_order : 0,
          created_at: row.created_at as string | undefined,
        }))
      );
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRows();
  }, []);

  const resetForm = () => {
    setForm({ title: '', youtube_url: '', description: '', display_order: 0 });
  };

  const openNew = () => {
    setEditing(null);
    resetForm();
    setModalOpen(true);
  };

  const openEdit = (t: AboutTalk) => {
    setEditing(t);
    setForm({
      title: t.title,
      youtube_url: t.youtube_url,
      description: t.description || '',
      display_order: t.display_order ?? 0,
    });
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this talk?')) return;
    const { error } = await supabase.from('about_talks').delete().eq('id', id);
    if (error) {
      alert(error.message);
      return;
    }
    fetchRows();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!getYoutubeEmbedUrl(form.youtube_url)) {
      alert('Enter a valid YouTube URL (watch or youtu.be link).');
      return;
    }
    setSubmitting(true);
    const payload = {
      title: form.title.trim(),
      youtube_url: form.youtube_url.trim(),
      description: form.description.trim() || null,
      display_order: Number(form.display_order || 0),
    };
    if (editing) {
      const { error } = await supabase.from('about_talks').update(payload).eq('id', editing.id);
      if (error) alert(error.message);
    } else {
      const { error } = await supabase.from('about_talks').insert([payload]);
      if (error) alert(error.message);
    }
    setSubmitting(false);
    setModalOpen(false);
    setEditing(null);
    resetForm();
    fetchRows();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-serif text-2xl text-[#37352f]">About — Talks</h2>
          <p className="mt-1 text-sm text-[#37352f]/60">
            YouTube embeds shown on the public About page. Run <code className="rounded bg-[#37352f]/5 px-1 text-xs">supabase/about_talks.sql</code> if the table
            is missing.
          </p>
        </div>
        <button
          type="button"
          onClick={openNew}
          className="inline-flex items-center gap-2 rounded-lg bg-[#37352f] px-4 py-2 text-sm font-medium text-white hover:bg-black"
        >
          <Plus size={18} />
          Add talk
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-[#37352f]/25" />
        </div>
      ) : (
        <div className="space-y-2">
          {rows.map((t) => (
            <div
              key={t.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#37352f]/10 bg-white p-4"
            >
              <div className="min-w-0">
                <h3 className="truncate font-serif text-lg text-[#37352f]">{t.title}</h3>
                <p className="truncate text-xs text-[#37352f]/50">Order {t.display_order ?? 0} · {t.youtube_url}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => openEdit(t)}
                  className="rounded-full border border-[#37352f]/15 p-2 hover:bg-[#37352f]/5"
                  aria-label="Edit"
                >
                  <Edit2 size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(t.id)}
                  className="rounded-full border border-red-200 p-2 text-red-600 hover:bg-red-50"
                  aria-label="Delete"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
          {rows.length === 0 && (
            <div className="rounded-xl border border-dashed border-[#37352f]/15 py-12 text-center text-sm text-[#37352f]/50">
              No talks yet. Add one to show it on About.
            </div>
          )}
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-[210] flex items-center justify-center bg-black/45 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#37352f]/10 bg-white p-6">
              <h3 className="font-serif text-xl text-[#37352f]">{editing ? 'Edit talk' : 'Add talk'}</h3>
              <button type="button" onClick={() => setModalOpen(false)} className="text-[#37352f]/45 hover:text-[#37352f]" aria-label="Close">
                <X size={22} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5 p-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#37352f]/60">Title</label>
                <input
                  required
                  value={form.title}
                  onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                  className="w-full rounded-lg border border-[#37352f]/15 px-4 py-2 text-sm outline-none focus:border-[#37352f]/35"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#37352f]/60">YouTube URL</label>
                <input
                  type="url"
                  required
                  value={form.youtube_url}
                  onChange={(e) => setForm((p) => ({ ...p, youtube_url: e.target.value }))}
                  placeholder="https://www.youtube.com/watch?v=…"
                  className="w-full rounded-lg border border-[#37352f]/15 px-4 py-2 text-sm outline-none focus:border-[#37352f]/35"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#37352f]/60">Details (optional)</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  rows={4}
                  className="w-full resize-y rounded-lg border border-[#37352f]/15 px-4 py-2 text-sm outline-none focus:border-[#37352f]/35"
                  placeholder="Venue, date, links, key takeaways…"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#37352f]/60">Display order</label>
                <input
                  type="number"
                  value={form.display_order}
                  onChange={(e) => setForm((p) => ({ ...p, display_order: Number(e.target.value || 0) }))}
                  className="w-full rounded-lg border border-[#37352f]/15 px-4 py-2 text-sm outline-none focus:border-[#37352f]/35"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 rounded-xl border border-[#37352f]/15 py-3 text-sm font-semibold uppercase tracking-wider text-[#37352f]/60 hover:bg-[#fcfaf8]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#37352f] py-3 text-sm font-semibold uppercase tracking-wider text-white hover:bg-black disabled:opacity-60"
                >
                  {submitting && <Loader2 size={16} className="animate-spin" />}
                  {editing ? 'Update' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TalksManager;
