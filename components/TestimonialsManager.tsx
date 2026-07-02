import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, X, Loader2, Upload } from 'lucide-react';
import { supabase } from '../supabase/client';
import type { Testimonial, TestimonialContentType } from '../types';
import { mapTestimonialRow, testimonialToPayload } from '../utils/testimonialMapper';
import { figureImageDisplayUrl } from '../utils/figureImageUrl';
import { getTwitterEmbedSrc } from '../utils/socialEmbeds';

const CONTENT_TYPES: { value: TestimonialContentType; label: string }[] = [
  { value: 'quote', label: 'Written quote' },
  { value: 'image', label: 'Image / screenshot' },
  { value: 'twitter', label: 'X (Twitter) post' },
  { value: 'linkedin', label: 'LinkedIn post' },
];

const defaultForm = () => ({
  authorName: '',
  authorRole: '',
  authorOrg: '',
  quote: '',
  contentType: 'quote' as TestimonialContentType,
  sourceUrl: '',
  imageUrl: '',
  linkUrl: '',
  linkLabel: '',
  displayOrder: 0,
  isPublished: true,
});

const TestimonialsManager: React.FC = () => {
  const [rows, setRows] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [form, setForm] = useState(defaultForm);

  const fetchRows = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false });
    if (error) {
      console.error(error);
      setRows([]);
    } else {
      setRows(((data || []) as Record<string, unknown>[]).map(mapTestimonialRow));
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRows();
  }, []);

  const openNew = () => {
    setEditing(null);
    setForm(defaultForm());
    setModalOpen(true);
  };

  const openEdit = (item: Testimonial) => {
    setEditing(item);
    setForm({
      authorName: item.authorName,
      authorRole: item.authorRole || '',
      authorOrg: item.authorOrg || '',
      quote: item.quote || '',
      contentType: item.contentType,
      sourceUrl: item.sourceUrl || '',
      imageUrl: item.imageUrl || '',
      linkUrl: item.linkUrl || '',
      linkLabel: item.linkLabel || '',
      displayOrder: item.displayOrder ?? 0,
      isPublished: item.isPublished,
    });
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this testimonial?')) return;
    const { error } = await supabase.from('testimonials').delete().eq('id', id);
    if (error) alert(error.message);
    else fetchRows();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const ext = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const filePath = `testimonials/${fileName}`;
    const { error: uploadError } = await supabase.storage.from('blog-assets').upload(filePath, file, { upsert: false });
    if (uploadError) {
      alert(uploadError.message);
      setUploading(false);
      return;
    }
    const { data } = supabase.storage.from('blog-assets').getPublicUrl(filePath);
    setForm((prev) => ({ ...prev, imageUrl: data.publicUrl }));
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.authorName.trim()) {
      alert('Author name is required.');
      return;
    }
    if (form.contentType === 'quote' && !form.quote.trim()) {
      alert('Add the testimonial quote text.');
      return;
    }
    if (form.contentType === 'image' && !form.imageUrl.trim()) {
      alert('Upload an image screenshot.');
      return;
    }
    if (form.contentType === 'twitter') {
      if (!form.sourceUrl.trim()) {
        alert('Paste the X/Twitter post URL.');
        return;
      }
      if (!getTwitterEmbedSrc(form.sourceUrl) && !form.imageUrl.trim()) {
        alert('Enter a valid tweet URL, or upload a screenshot as fallback.');
        return;
      }
    }
    if (form.contentType === 'linkedin' && !form.sourceUrl.trim() && !form.imageUrl.trim()) {
      alert('Add a LinkedIn post URL and/or upload a screenshot.');
      return;
    }

    setSubmitting(true);
    const payload = testimonialToPayload(form);
    if (editing) {
      const { error } = await supabase.from('testimonials').update(payload).eq('id', editing.id);
      if (error) alert(error.message);
    } else {
      const { error } = await supabase.from('testimonials').insert([payload]);
      if (error) alert(error.message);
    }
    setSubmitting(false);
    setModalOpen(false);
    setEditing(null);
    setForm(defaultForm());
    fetchRows();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-serif text-2xl text-[#37352f]">Testimonials</h2>
          <p className="mt-1 text-sm text-[#37352f]/60">
            Shown in a sideways carousel on the About page — quotes, screenshots, or LinkedIn/X posts.
          </p>
        </div>
        <button type="button" onClick={openNew} className="inline-flex items-center gap-2 rounded-lg bg-[#37352f] px-4 py-2 text-sm font-medium text-white hover:bg-black">
          <Plus size={18} />
          Add testimonial
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-[#37352f]/25" />
        </div>
      ) : (
        <div className="space-y-2">
          {rows.map((item) => (
            <div key={item.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#37352f]/10 bg-white p-4">
              <div className="flex min-w-0 items-center gap-3">
                {item.imageUrl ? (
                  <img src={figureImageDisplayUrl(item.imageUrl, { width: 80, quality: 75 })} alt="" className="h-12 w-12 shrink-0 rounded-lg object-cover" />
                ) : null}
                <div className="min-w-0">
                  <h3 className="truncate font-serif text-lg text-[#37352f]">{item.authorName}</h3>
                  <p className="truncate text-xs text-[#37352f]/50">
                    {item.contentType} · Order {item.displayOrder ?? 0} · {item.isPublished ? 'Published' : 'Draft'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => openEdit(item)} className="rounded-full border border-[#37352f]/15 p-2 hover:bg-[#37352f]/5" aria-label="Edit">
                  <Edit2 size={15} />
                </button>
                <button type="button" onClick={() => handleDelete(item.id)} className="rounded-full border border-red-200 p-2 text-red-600 hover:bg-red-50" aria-label="Delete">
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
          {rows.length === 0 && (
            <div className="rounded-xl border border-dashed border-[#37352f]/15 py-12 text-center text-sm text-[#37352f]/50">
              No testimonials yet. Add one to show it on About.
            </div>
          )}
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-[210] flex items-center justify-center bg-black/45 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#37352f]/10 bg-white p-6">
              <h3 className="font-serif text-xl text-[#37352f]">{editing ? 'Edit testimonial' : 'Add testimonial'}</h3>
              <button type="button" onClick={() => setModalOpen(false)} className="text-[#37352f]/45 hover:text-[#37352f]" aria-label="Close">
                <X size={22} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5 p-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#37352f]/60">Type</label>
                <select
                  value={form.contentType}
                  onChange={(e) => setForm((p) => ({ ...p, contentType: e.target.value as TestimonialContentType }))}
                  className="w-full rounded-lg border border-[#37352f]/15 px-4 py-2 text-sm outline-none focus:border-[#37352f]/35"
                >
                  {CONTENT_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#37352f]/60">Name</label>
                  <input required value={form.authorName} onChange={(e) => setForm((p) => ({ ...p, authorName: e.target.value }))} className="w-full rounded-lg border border-[#37352f]/15 px-4 py-2 text-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#37352f]/60">Role (optional)</label>
                  <input value={form.authorRole} onChange={(e) => setForm((p) => ({ ...p, authorRole: e.target.value }))} className="w-full rounded-lg border border-[#37352f]/15 px-4 py-2 text-sm" placeholder="PI, PhD student…" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#37352f]/60">Organisation (optional)</label>
                <input value={form.authorOrg} onChange={(e) => setForm((p) => ({ ...p, authorOrg: e.target.value }))} className="w-full rounded-lg border border-[#37352f]/15 px-4 py-2 text-sm" />
              </div>
              {(form.contentType === 'quote' || form.contentType === 'image') && (
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#37352f]/60">Quote / caption</label>
                  <textarea value={form.quote} onChange={(e) => setForm((p) => ({ ...p, quote: e.target.value }))} rows={4} className="w-full resize-y rounded-lg border border-[#37352f]/15 px-4 py-2 text-sm" placeholder="What they said about your work or training…" />
                </div>
              )}
              {(form.contentType === 'twitter' || form.contentType === 'linkedin') && (
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#37352f]/60">Post URL</label>
                  <input type="url" value={form.sourceUrl} onChange={(e) => setForm((p) => ({ ...p, sourceUrl: e.target.value }))} placeholder={form.contentType === 'twitter' ? 'https://x.com/…/status/…' : 'https://www.linkedin.com/posts/…'} className="w-full rounded-lg border border-[#37352f]/15 px-4 py-2 text-sm" />
                  <p className="text-xs text-[#37352f]/50">For LinkedIn, also upload a screenshot if the embed does not load.</p>
                </div>
              )}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#37352f]/60">Screenshot image (optional)</label>
                <div className="flex flex-wrap items-center gap-3">
                  {form.imageUrl ? <img src={figureImageDisplayUrl(form.imageUrl, { width: 120, quality: 78 })} alt="" className="h-16 w-16 rounded-lg object-cover" /> : null}
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-[#37352f]/15 px-4 py-2 text-sm hover:bg-[#37352f]/5">
                    {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                    Upload
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  </label>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#37352f]/60">Link URL (optional)</label>
                  <input type="url" value={form.linkUrl} onChange={(e) => setForm((p) => ({ ...p, linkUrl: e.target.value }))} className="w-full rounded-lg border border-[#37352f]/15 px-4 py-2 text-sm" placeholder="https://…" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#37352f]/60">Link label (optional)</label>
                  <input value={form.linkLabel} onChange={(e) => setForm((p) => ({ ...p, linkLabel: e.target.value }))} className="w-full rounded-lg border border-[#37352f]/15 px-4 py-2 text-sm" placeholder="View project" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#37352f]/60">Display order</label>
                <input type="number" value={form.displayOrder} onChange={(e) => setForm((p) => ({ ...p, displayOrder: Number(e.target.value || 0) }))} className="w-full rounded-lg border border-[#37352f]/15 px-4 py-2 text-sm" />
              </div>
              <label className="flex items-center gap-2 text-sm text-[#37352f]/80">
                <input type="checkbox" checked={form.isPublished} onChange={(e) => setForm((p) => ({ ...p, isPublished: e.target.checked }))} className="h-4 w-4" />
                Published on About page
              </label>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setModalOpen(false)} className="flex-1 rounded-xl border border-[#37352f]/15 py-3 text-sm font-semibold uppercase tracking-wider text-[#37352f]/60 hover:bg-[#fcfaf8]">
                  Cancel
                </button>
                <button type="submit" disabled={submitting || uploading} className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#37352f] py-3 text-sm font-semibold uppercase tracking-wider text-white hover:bg-black disabled:opacity-60">
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

export default TestimonialsManager;
