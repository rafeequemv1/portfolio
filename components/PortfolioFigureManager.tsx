import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { supabase } from '../supabase/client';
import { PortfolioFigure } from '../types';
import { Edit2, Loader2, Plus, Trash2, Upload, X } from 'lucide-react';

const emptyForm = () => ({
  image_urls: [] as string[],
  paper_title: '',
  paper_url: '',
  lab_name: '',
  university_name: '',
  authors: '',
  display_order: 0,
});

const MAX_FIGURE_PIXEL = 3200;

/** Raster images → WebP in-browser before upload (smaller, faster portfolio loads). SVG unchanged. */
async function fileToWebpBlob(file: File): Promise<Blob> {
  if (file.type === 'image/svg+xml') return file;
  const bmp = await createImageBitmap(file);
  let w = bmp.width;
  let h = bmp.height;
  if (w > MAX_FIGURE_PIXEL || h > MAX_FIGURE_PIXEL) {
    const s = Math.min(MAX_FIGURE_PIXEL / w, MAX_FIGURE_PIXEL / h);
    w = Math.round(w * s);
    h = Math.round(h * s);
  }
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    bmp.close();
    throw new Error('Canvas not available');
  }
  ctx.drawImage(bmp, 0, 0, bmp.width, bmp.height, 0, 0, w, h);
  bmp.close();
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/webp', 0.9));
  if (!blob) throw new Error('WebP encoding failed');
  return blob;
}

const PortfolioFigureManager: React.FC = () => {
  const [rows, setRows] = useState<PortfolioFigure[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<PortfolioFigure | null>(null);
  const [form, setForm] = useState(emptyForm());

  const fetchRows = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('portfolio_figures')
      .select('*')
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false });
    if (error) {
      console.error(error);
      setRows([]);
    } else {
      setRows(
        (data || []).map((r: any) => ({
          ...r,
          image_urls: Array.isArray(r.image_urls) ? r.image_urls : [],
        })) as PortfolioFigure[]
      );
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRows();
  }, []);

  const openNew = () => {
    setEditing(null);
    setForm(emptyForm());
    setModalOpen(true);
  };

  const openEdit = (row: PortfolioFigure) => {
    setEditing(row);
    setForm({
      image_urls: [...(row.image_urls || [])],
      paper_title: row.paper_title || '',
      paper_url: row.paper_url || '',
      lab_name: row.lab_name || '',
      university_name: row.university_name || '',
      authors: row.authors || '',
      display_order: row.display_order ?? 0,
    });
    setModalOpen(true);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    setUploading(true);
    for (const file of Array.from(files)) {
      try {
        let body: Blob = file;
        let ext = (file.name.split('.').pop() || 'png').toLowerCase();
        if (file.type.startsWith('image/') && file.type !== 'image/svg+xml') {
          body = await fileToWebpBlob(file);
          ext = 'webp';
        }
        const path = `figures/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { error } = await supabase.storage.from('portfolio-figures').upload(path, body, {
          contentType: ext === 'webp' ? 'image/webp' : file.type || undefined,
        });
        if (error) {
          alert(error.message);
          break;
        }
        const { data } = supabase.storage.from('portfolio-figures').getPublicUrl(path);
        setForm((prev) => ({ ...prev, image_urls: [...prev.image_urls, data.publicUrl] }));
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Could not process image');
        break;
      }
    }
    setUploading(false);
    e.target.value = '';
  };

  const removeImage = (idx: number) => {
    setForm((prev) => ({ ...prev, image_urls: prev.image_urls.filter((_, i) => i !== idx) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.image_urls.length) {
      alert('Add at least one figure image.');
      return;
    }
    if (!form.paper_title.trim()) {
      alert('Research paper name is required.');
      return;
    }
    setSubmitting(true);
    const payload = {
      image_urls: form.image_urls,
      paper_title: form.paper_title.trim(),
      paper_url: form.paper_url.trim() || null,
      lab_name: form.lab_name.trim() || null,
      university_name: form.university_name.trim() || null,
      authors: form.authors.trim() || null,
      display_order: Number(form.display_order) || 0,
      updated_at: new Date().toISOString(),
    };
    if (editing) {
      const { error } = await supabase.from('portfolio_figures').update(payload).eq('id', editing.id);
      if (error) alert(error.message);
    } else {
      const { error } = await supabase.from('portfolio_figures').insert(payload);
      if (error) alert(error.message);
    }
    setSubmitting(false);
    setModalOpen(false);
    setEditing(null);
    setForm(emptyForm());
    fetchRows();
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this figure set?')) return;
    const { error } = await supabase.from('portfolio_figures').delete().eq('id', id);
    if (error) alert(error.message);
    else fetchRows();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-2xl font-serif text-[#37352f]">Publication figures</h2>
        <button
          type="button"
          onClick={openNew}
          className="inline-flex items-center gap-2 rounded-lg bg-[#37352f] px-4 py-2 text-sm font-medium text-white hover:bg-black"
        >
          <Plus size={18} />
          Add figures
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-[#37352f]/25" />
        </div>
      ) : rows.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[#37352f]/15 py-12 text-center text-sm text-[#37352f]/50">No figures yet.</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((row) => (
            <div key={row.id} className="rounded-xl border border-[#37352f]/10 bg-white p-4 shadow-sm">
              <div className="flex gap-2 overflow-x-auto pb-2">
                {(row.image_urls || []).slice(0, 3).map((url) => (
                  <img key={url} src={url} alt="" className="h-24 w-auto shrink-0 rounded-md border border-[#37352f]/10 object-cover" />
                ))}
                {(row.image_urls?.length || 0) > 3 && (
                  <span className="flex h-24 shrink-0 items-center rounded-md bg-[#37352f]/5 px-2 text-xs text-[#37352f]/60">
                    +{(row.image_urls?.length || 0) - 3}
                  </span>
                )}
              </div>
              <p className="mt-3 font-serif text-sm font-semibold text-[#37352f] line-clamp-2">{row.paper_title}</p>
              <p className="mt-2 text-xs text-[#37352f]/55 line-clamp-2">
                {[row.lab_name, row.university_name].filter(Boolean).join(' · ')}
              </p>
              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => openEdit(row)}
                  className="rounded-full border border-[#37352f]/15 p-2 hover:bg-[#37352f]/5"
                  aria-label="Edit"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(row.id)}
                  className="rounded-full border border-red-200 p-2 text-red-600 hover:bg-red-50"
                  aria-label="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen &&
        typeof document !== 'undefined' &&
        ReactDOM.createPortal(
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/45 p-4 backdrop-blur-sm">
            <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-[#37352f]/10 bg-white shadow-2xl">
              <div className="sticky top-0 flex items-center justify-between border-b border-gray-100 bg-white px-6 py-4">
                <h3 className="font-serif text-xl text-[#37352f]">{editing ? 'Edit figures' : 'Add figures'}</h3>
                <button type="button" onClick={() => setModalOpen(false)} className="text-[#37352f]/40 hover:text-[#37352f]" aria-label="Close">
                  <X size={22} />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4 p-6">
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#37352f]/55">Figure images</label>
                  <label className="flex min-h-[100px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 hover:bg-gray-50">
                    {uploading ? <Loader2 className="animate-spin text-gray-400" /> : <Upload className="text-gray-400" size={24} />}
                    <span className="mt-2 text-xs text-gray-500">Click to upload (one or more)</span>
                    <input type="file" accept="image/*" multiple className="hidden" onChange={handleUpload} disabled={uploading} />
                  </label>
                  {form.image_urls.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {form.image_urls.map((url, idx) => (
                        <div key={url} className="relative inline-block">
                          <img src={url} alt="" className="h-20 w-auto rounded border border-gray-200 object-cover" />
                          <button
                            type="button"
                            onClick={() => removeImage(idx)}
                            className="absolute -right-1 -top-1 rounded-full bg-red-600 p-0.5 text-white shadow"
                            aria-label="Remove image"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#37352f]/55">Research paper name</label>
                  <input
                    required
                    value={form.paper_title}
                    onChange={(e) => setForm((p) => ({ ...p, paper_title: e.target.value }))}
                    className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm"
                    placeholder="Paper title"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#37352f]/55">Paper link (optional)</label>
                  <input
                    type="url"
                    value={form.paper_url}
                    onChange={(e) => setForm((p) => ({ ...p, paper_url: e.target.value }))}
                    className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm"
                    placeholder="https://…"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#37352f]/55">Lab name (optional)</label>
                  <input
                    value={form.lab_name}
                    onChange={(e) => setForm((p) => ({ ...p, lab_name: e.target.value }))}
                    className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#37352f]/55">University (optional)</label>
                  <input
                    value={form.university_name}
                    onChange={(e) => setForm((p) => ({ ...p, university_name: e.target.value }))}
                    className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#37352f]/55">Authors (optional)</label>
                  <textarea
                    rows={2}
                    value={form.authors}
                    onChange={(e) => setForm((p) => ({ ...p, authors: e.target.value }))}
                    className="w-full resize-y rounded-lg border border-gray-200 px-4 py-2.5 text-sm"
                    placeholder="e.g. Smith J., Doe A., …"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#37352f]/55">Display order</label>
                  <input
                    type="number"
                    value={form.display_order}
                    onChange={(e) => setForm((p) => ({ ...p, display_order: Number(e.target.value) }))}
                    className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setModalOpen(false)} className="flex-1 rounded-xl border border-gray-200 py-3 text-sm font-medium text-[#37352f]/60">
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting || uploading}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#37352f] py-3 text-sm font-semibold text-white disabled:opacity-60"
                  >
                    {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

export default PortfolioFigureManager;
