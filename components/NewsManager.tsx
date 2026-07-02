import React, { useEffect, useMemo, useState } from 'react';
import { Plus, Edit2, Trash2, X, Loader2, Upload, ImageIcon, Link2 } from 'lucide-react';
import { supabase } from '../supabase/client';
import type { NewsItem, NewsLinkKind, NewsThumbnailSourceKind } from '../types';
import { NEWS_LINK_KIND_OPTIONS } from '../utils/newsLinks';
import { mapNewsItemRow, newsItemToPayload } from '../utils/newsItemMapper';
import { figureImageDisplayUrl } from '../utils/figureImageUrl';
import { getYoutubeThumbnailUrl } from '../utils/youtubeThumbnail';

type ThumbnailPickerTab = NewsThumbnailSourceKind;

interface PickerImage {
  id: string;
  label: string;
  url: string;
  sourceKind: ThumbnailPickerTab;
}

const THUMBNAIL_TABS: { key: ThumbnailPickerTab; label: string }[] = [
  { key: 'cover', label: 'Covers' },
  { key: 'figure', label: 'Figures' },
  { key: 'illustration', label: 'Illustrations' },
  { key: 'abstract', label: 'Abstracts' },
  { key: 'logo', label: 'Logos' },
  { key: 'video', label: 'Videos' },
  { key: 'workshop', label: 'Workshops' },
  { key: 'course', label: 'Courses' },
  { key: 'blog', label: 'Blog' },
];

const defaultForm = () => ({
  title: '',
  summary: '',
  thumbnailUrl: '',
  thumbnailSourceKind: '' as string,
  thumbnailSourceId: '',
  publishedAt: new Date().toISOString().slice(0, 10),
  displayOrder: 0,
  isPublished: true,
  linkKind: 'external' as NewsLinkKind,
  linkTarget: '',
  linkUrl: '',
});

const NewsManager: React.FC = () => {
  const [rows, setRows] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<NewsItem | null>(null);
  const [form, setForm] = useState(defaultForm);
  const [thumbnailMode, setThumbnailMode] = useState<'upload' | 'portfolio'>('upload');
  const [pickerTab, setPickerTab] = useState<ThumbnailPickerTab>('cover');
  const [pickerImages, setPickerImages] = useState<PickerImage[]>([]);
  const [pickerLoading, setPickerLoading] = useState(false);
  const [linkOptions, setLinkOptions] = useState<{ id: string; label: string }[]>([]);
  const [linkOptionsLoading, setLinkOptionsLoading] = useState(false);

  const linkNeedsTarget = useMemo(
    () => NEWS_LINK_KIND_OPTIONS.find((o) => o.value === form.linkKind)?.needsTarget ?? false,
    [form.linkKind]
  );

  const fetchRows = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('news_items')
      .select('*')
      .order('display_order', { ascending: true })
      .order('published_at', { ascending: false });
    if (error) {
      console.error(error);
      setRows([]);
    } else {
      setRows(((data || []) as Record<string, unknown>[]).map(mapNewsItemRow));
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRows();
  }, []);

  useEffect(() => {
    if (!modalOpen || thumbnailMode !== 'portfolio') return;
    const loadPicker = async () => {
      setPickerLoading(true);
      const images: PickerImage[] = [];
      try {
        if (pickerTab === 'cover') {
          const { data } = await supabase.from('journal_covers').select('id, title, cover_image_url').not('cover_image_url', 'is', null).order('display_order');
          for (const row of data || []) {
            if (row.cover_image_url) images.push({ id: row.id, label: row.title, url: row.cover_image_url, sourceKind: 'cover' });
          }
        } else if (pickerTab === 'figure') {
          const { data } = await supabase.from('portfolio_figures').select('id, paper_title, image_urls').order('display_order');
          for (const row of data || []) {
            const url = Array.isArray(row.image_urls) ? row.image_urls[0] : '';
            if (url) images.push({ id: row.id, label: row.paper_title, url, sourceKind: 'figure' });
          }
        } else if (pickerTab === 'illustration') {
          const { data } = await supabase.from('portfolio_illustrations').select('id, title, image_urls').order('display_order');
          for (const row of data || []) {
            const url = Array.isArray(row.image_urls) ? row.image_urls[0] : '';
            if (url) images.push({ id: row.id, label: row.title, url, sourceKind: 'illustration' });
          }
        } else if (pickerTab === 'abstract') {
          const { data } = await supabase.from('portfolio_graphical_abstracts').select('id, title, abstract_image_url').order('display_order');
          for (const row of data || []) {
            if (row.abstract_image_url) images.push({ id: row.id, label: row.title, url: row.abstract_image_url, sourceKind: 'abstract' });
          }
        } else if (pickerTab === 'logo') {
          const { data } = await supabase.from('portfolio_logos').select('id, title, image_urls').order('display_order');
          for (const row of data || []) {
            const url = Array.isArray(row.image_urls) ? row.image_urls[0] : '';
            if (url) images.push({ id: row.id, label: row.title, url, sourceKind: 'logo' });
          }
        } else if (pickerTab === 'video') {
          const { data } = await supabase.from('portfolio_videos').select('id, title, youtube_url').order('display_order');
          for (const row of data || []) {
            const url = getYoutubeThumbnailUrl(row.youtube_url || '');
            if (url) images.push({ id: row.id, label: row.title, url, sourceKind: 'video' });
          }
        } else if (pickerTab === 'workshop') {
          const { data } = await supabase.from('workshops').select('id, title, image_urls').order('date', { ascending: false });
          for (const row of data || []) {
            const url = Array.isArray(row.image_urls) ? row.image_urls[0] : '';
            if (url) images.push({ id: row.id, label: row.title, url, sourceKind: 'workshop' });
          }
        } else if (pickerTab === 'course') {
          const { data } = await supabase.from('courses').select('id, title, cover_image_url, slug').order('created_at', { ascending: false });
          for (const row of data || []) {
            if (row.cover_image_url) images.push({ id: row.slug || row.id, label: row.title, url: row.cover_image_url, sourceKind: 'course' });
          }
        } else if (pickerTab === 'blog') {
          const { data } = await supabase.from('posts').select('id, title, slug, image_url').order('date', { ascending: false });
          for (const row of data || []) {
            if (row.image_url) images.push({ id: row.slug || row.id, label: row.title, url: row.image_url, sourceKind: 'blog' });
          }
        }
      } catch (err) {
        console.error(err);
      }
      setPickerImages(images);
      setPickerLoading(false);
    };
    loadPicker();
  }, [modalOpen, thumbnailMode, pickerTab]);

  useEffect(() => {
    if (!modalOpen || !linkNeedsTarget) {
      setLinkOptions([]);
      return;
    }
    const loadLinkOptions = async () => {
      setLinkOptionsLoading(true);
      const options: { id: string; label: string }[] = [];
      try {
        if (form.linkKind === 'workshop') {
          const { data } = await supabase.from('workshops').select('id, title').order('date', { ascending: false });
          for (const row of data || []) options.push({ id: row.id, label: row.title });
        } else if (form.linkKind === 'course') {
          const { data } = await supabase.from('courses').select('slug, title').order('created_at', { ascending: false });
          for (const row of data || []) options.push({ id: row.slug, label: row.title });
        } else if (form.linkKind === 'blog') {
          const { data } = await supabase.from('posts').select('slug, title').order('date', { ascending: false });
          for (const row of data || []) options.push({ id: row.slug, label: row.title });
        }
      } catch (err) {
        console.error(err);
      }
      setLinkOptions(options);
      setLinkOptionsLoading(false);
    };
    loadLinkOptions();
  }, [modalOpen, form.linkKind, linkNeedsTarget]);

  const openNew = () => {
    setEditing(null);
    setForm(defaultForm());
    setThumbnailMode('upload');
    setModalOpen(true);
  };

  const openEdit = (item: NewsItem) => {
    setEditing(item);
    setForm({
      title: item.title,
      summary: item.summary || '',
      thumbnailUrl: item.thumbnailUrl || '',
      thumbnailSourceKind: item.thumbnailSourceKind || '',
      thumbnailSourceId: item.thumbnailSourceId || '',
      publishedAt: item.publishedAt,
      displayOrder: item.displayOrder ?? 0,
      isPublished: item.isPublished,
      linkKind: item.linkKind,
      linkTarget: item.linkTarget || '',
      linkUrl: item.linkUrl || '',
    });
    setThumbnailMode(item.thumbnailSourceKind && item.thumbnailSourceKind !== 'upload' ? 'portfolio' : 'upload');
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this news item?')) return;
    const { error } = await supabase.from('news_items').delete().eq('id', id);
    if (error) {
      alert(error.message);
      return;
    }
    fetchRows();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const ext = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const filePath = `news/thumbnails/${fileName}`;
    const { error: uploadError } = await supabase.storage.from('blog-assets').upload(filePath, file, { upsert: false });
    if (uploadError) {
      alert(uploadError.message);
      setUploading(false);
      return;
    }
    const { data } = supabase.storage.from('blog-assets').getPublicUrl(filePath);
    setForm((prev) => ({
      ...prev,
      thumbnailUrl: data.publicUrl,
      thumbnailSourceKind: 'upload',
      thumbnailSourceId: '',
    }));
    setUploading(false);
  };

  const selectPickerImage = (img: PickerImage) => {
    setForm((prev) => ({
      ...prev,
      thumbnailUrl: img.url,
      thumbnailSourceKind: img.sourceKind,
      thumbnailSourceId: img.id,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.linkKind === 'external' && !form.linkUrl.trim()) {
      alert('Enter a link URL for external links.');
      return;
    }
    if (linkNeedsTarget && !form.linkTarget.trim()) {
      alert('Select a link target.');
      return;
    }
    setSubmitting(true);
    const payload = newsItemToPayload(form);
    if (editing) {
      const { error } = await supabase.from('news_items').update(payload).eq('id', editing.id);
      if (error) alert(error.message);
    } else {
      const { error } = await supabase.from('news_items').insert([payload]);
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
          <h2 className="font-serif text-2xl text-[#37352f]">News</h2>
          <p className="mt-1 text-sm text-[#37352f]/60">
            Studio updates shown on the home page. Link to workshops, portfolio sections, or blog posts.
          </p>
        </div>
        <button
          type="button"
          onClick={openNew}
          className="inline-flex items-center gap-2 rounded-lg bg-[#37352f] px-4 py-2 text-sm font-medium text-white hover:bg-black"
        >
          <Plus size={18} />
          Add news
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-[#37352f]/25" />
        </div>
      ) : (
        <div className="space-y-2">
          {rows.map((item) => (
            <div
              key={item.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#37352f]/10 bg-white p-4"
            >
              <div className="flex min-w-0 items-center gap-3">
                {item.thumbnailUrl ? (
                  <img
                    src={figureImageDisplayUrl(item.thumbnailUrl, { width: 96, quality: 78 })}
                    alt=""
                    className="h-14 w-14 shrink-0 rounded-lg object-cover"
                  />
                ) : (
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-[#37352f]/5 text-[#37352f]/30">
                    <ImageIcon size={20} />
                  </div>
                )}
                <div className="min-w-0">
                  <h3 className="truncate font-serif text-lg text-[#37352f]">{item.title}</h3>
                  <p className="truncate text-xs text-[#37352f]/50">
                    {item.publishedAt} · Order {item.displayOrder ?? 0} · {item.isPublished ? 'Published' : 'Draft'} · {item.linkKind}
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
              No news yet. Add an update to show it on the home page.
            </div>
          )}
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-[210] flex items-center justify-center bg-black/45 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#37352f]/10 bg-white p-6">
              <h3 className="font-serif text-xl text-[#37352f]">{editing ? 'Edit news' : 'Add news'}</h3>
              <button type="button" onClick={() => setModalOpen(false)} className="text-[#37352f]/45 hover:text-[#37352f]" aria-label="Close">
                <X size={22} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6 p-6">
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#37352f]/60">Title</label>
                  <input
                    required
                    value={form.title}
                    onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                    className="w-full rounded-lg border border-[#37352f]/15 px-4 py-2 text-sm outline-none focus:border-[#37352f]/35"
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#37352f]/60">Summary</label>
                  <textarea
                    value={form.summary}
                    onChange={(e) => setForm((p) => ({ ...p, summary: e.target.value }))}
                    rows={3}
                    placeholder="Short line shown on the home page"
                    className="w-full resize-y rounded-lg border border-[#37352f]/15 px-4 py-2 text-sm outline-none focus:border-[#37352f]/35"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#37352f]/60">Published date</label>
                  <input
                    type="date"
                    required
                    value={form.publishedAt}
                    onChange={(e) => setForm((p) => ({ ...p, publishedAt: e.target.value }))}
                    className="w-full rounded-lg border border-[#37352f]/15 px-4 py-2 text-sm outline-none focus:border-[#37352f]/35"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#37352f]/60">Display order</label>
                  <input
                    type="number"
                    value={form.displayOrder}
                    onChange={(e) => setForm((p) => ({ ...p, displayOrder: Number(e.target.value || 0) }))}
                    className="w-full rounded-lg border border-[#37352f]/15 px-4 py-2 text-sm outline-none focus:border-[#37352f]/35"
                  />
                </div>
                <div className="flex items-center gap-2 sm:col-span-2">
                  <input
                    id="news-published"
                    type="checkbox"
                    checked={form.isPublished}
                    onChange={(e) => setForm((p) => ({ ...p, isPublished: e.target.checked }))}
                    className="h-4 w-4 rounded border-[#37352f]/20"
                  />
                  <label htmlFor="news-published" className="text-sm text-[#37352f]/80">
                    Published (visible on home page)
                  </label>
                </div>
              </div>

              <div className="space-y-3 rounded-xl border border-[#37352f]/10 bg-[#fcfaf8] p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-[#37352f]">
                  <ImageIcon size={16} />
                  Thumbnail
                </div>
                <div className="inline-flex rounded-lg border border-[#37352f]/10 bg-white p-1">
                  <button
                    type="button"
                    onClick={() => setThumbnailMode('upload')}
                    className={`rounded-md px-3 py-1.5 text-xs font-medium ${thumbnailMode === 'upload' ? 'bg-[#37352f] text-white' : 'text-[#37352f]/70'}`}
                  >
                    Upload
                  </button>
                  <button
                    type="button"
                    onClick={() => setThumbnailMode('portfolio')}
                    className={`rounded-md px-3 py-1.5 text-xs font-medium ${thumbnailMode === 'portfolio' ? 'bg-[#37352f] text-white' : 'text-[#37352f]/70'}`}
                  >
                    From portfolio
                  </button>
                </div>
                {thumbnailMode === 'upload' ? (
                  <div className="flex flex-wrap items-center gap-4">
                    {form.thumbnailUrl ? (
                      <img src={figureImageDisplayUrl(form.thumbnailUrl, { width: 160, quality: 80 })} alt="" className="h-20 w-20 rounded-lg object-cover" />
                    ) : null}
                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-[#37352f]/15 bg-white px-4 py-2 text-sm hover:bg-[#37352f]/5">
                      {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                      {uploading ? 'Uploading…' : 'Choose image'}
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                    </label>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-1">
                      {THUMBNAIL_TABS.map((tab) => (
                        <button
                          key={tab.key}
                          type="button"
                          onClick={() => setPickerTab(tab.key)}
                          className={`rounded-md px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${pickerTab === tab.key ? 'bg-[#37352f] text-white' : 'bg-white text-[#37352f]/65'}`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>
                    {pickerLoading ? (
                      <div className="flex justify-center py-6">
                        <Loader2 className="h-6 w-6 animate-spin text-[#37352f]/25" />
                      </div>
                    ) : (
                      <div className="grid max-h-48 grid-cols-4 gap-2 overflow-y-auto sm:grid-cols-5">
                        {pickerImages.map((img) => (
                          <button
                            key={`${img.sourceKind}-${img.id}`}
                            type="button"
                            onClick={() => selectPickerImage(img)}
                            title={img.label}
                            className={`overflow-hidden rounded-lg border-2 transition-colors ${form.thumbnailSourceId === img.id && form.thumbnailSourceKind === img.sourceKind ? 'border-[#37352f]' : 'border-transparent hover:border-[#37352f]/25'}`}
                          >
                            <img src={figureImageDisplayUrl(img.url, { width: 120, quality: 75 })} alt="" className="aspect-square w-full object-cover" />
                          </button>
                        ))}
                        {pickerImages.length === 0 && (
                          <p className="col-span-full py-4 text-center text-xs text-[#37352f]/50">No images in this section yet.</p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-3 rounded-xl border border-[#37352f]/10 bg-[#fcfaf8] p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-[#37352f]">
                  <Link2 size={16} />
                  Link
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#37352f]/60">Link to</label>
                  <select
                    value={form.linkKind}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        linkKind: e.target.value as NewsLinkKind,
                        linkTarget: '',
                        linkUrl: '',
                      }))
                    }
                    className="w-full rounded-lg border border-[#37352f]/15 bg-white px-4 py-2 text-sm outline-none focus:border-[#37352f]/35"
                  >
                    {NEWS_LINK_KIND_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                {form.linkKind === 'external' ? (
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#37352f]/60">URL</label>
                    <input
                      type="url"
                      value={form.linkUrl}
                      onChange={(e) => setForm((p) => ({ ...p, linkUrl: e.target.value }))}
                      placeholder="https://…"
                      className="w-full rounded-lg border border-[#37352f]/15 bg-white px-4 py-2 text-sm outline-none focus:border-[#37352f]/35"
                    />
                  </div>
                ) : linkNeedsTarget ? (
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#37352f]/60">Select item</label>
                    {linkOptionsLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin text-[#37352f]/25" />
                    ) : (
                      <select
                        required
                        value={form.linkTarget}
                        onChange={(e) => setForm((p) => ({ ...p, linkTarget: e.target.value }))}
                        className="w-full rounded-lg border border-[#37352f]/15 bg-white px-4 py-2 text-sm outline-none focus:border-[#37352f]/35"
                      >
                        <option value="">Choose…</option>
                        {linkOptions.map((opt) => (
                          <option key={opt.id} value={opt.id}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-[#37352f]/55">This link goes to the selected section on the site.</p>
                )}
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

export default NewsManager;
