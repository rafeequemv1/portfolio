import React, { useCallback, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { Edit2, Loader2, Plus, Trash2, Upload, X, ChevronUp, ChevronDown, GripVertical } from 'lucide-react';
import { supabase } from '../supabase/client';
import type { Course, CourseContentBlock } from '../courses/types';
import { normalizeContentBlocks } from '../courses/types';
import { emptyColorLabBlock, emptyHtmlBlock, emptyImageBlock, emptyTextBlock, emptyYoutubeBlock, newBlockId } from '../courses/blocks';
import { COLOR_LAB_PRESETS } from '../courses/colorLabPresets';
import { sanitizeCourseAuthorCss, sanitizeCourseAuthorHtml } from '../courses/htmlSanitize';
import { ROUTES } from '../utils/routes';

const toSlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

function sanitizeBlocksForDb(blocks: CourseContentBlock[]): CourseContentBlock[] {
  return blocks.filter((b) => {
    if (b.type === 'text') return true;
    if (b.type === 'youtube') return b.url.trim().length > 0;
    if (b.type === 'image') return b.public_url.trim().length > 0 && b.storage_path.trim().length > 0;
    if (b.type === 'html') return b.html.trim().length > 0;
    if (b.type === 'color_lab') return COLOR_LAB_PRESETS.includes(b.preset);
    return false;
  });
}

function newBlockForType(type: CourseContentBlock['type']): CourseContentBlock {
  switch (type) {
    case 'text':
      return emptyTextBlock();
    case 'youtube':
      return emptyYoutubeBlock();
    case 'image':
      return emptyImageBlock();
    case 'html':
      return emptyHtmlBlock();
    case 'color_lab':
      return emptyColorLabBlock('hue_wheel');
    default: {
      const _exhaustive: never = type;
      void _exhaustive;
      return emptyTextBlock();
    }
  }
}

interface ChapterDraft {
  id: string;
  title: string;
  blocks: CourseContentBlock[];
}

const CourseManager: React.FC = () => {
  const [list, setList] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<{ ch: number; blk: number } | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [courseId, setCourseId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [published, setPublished] = useState(false);
  const [displayOrder, setDisplayOrder] = useState(0);
  const [category, setCategory] = useState('General');
  const [offerEnabled, setOfferEnabled] = useState(false);
  const [offerTitle, setOfferTitle] = useState('');
  const [offerBody, setOfferBody] = useState('');
  const [offerCtaLabel, setOfferCtaLabel] = useState('');
  const [offerCtaUrl, setOfferCtaUrl] = useState('');
  const [chapters, setChapters] = useState<ChapterDraft[]>([]);
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  /** Course-level fields + offer vs a single chapter editor */
  const [editorPanel, setEditorPanel] = useState<'metadata' | 'chapter'>('metadata');

  const fetchList = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('courses')
      .select(
        'id, title, slug, description, published, display_order, created_at, updated_at, category, offer_enabled, offer_title, offer_body, offer_cta_label, offer_cta_url'
      )
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false });
    if (error) console.error(error);
    setList((data || []) as Course[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  const closeModal = () => {
    setModalOpen(false);
    setCourseId(null);
    setActiveChapterIndex(0);
    setEditorPanel('metadata');
  };

  const openEditor = async (id: string) => {
    const { data: cRow, error: cErr } = await supabase
      .from('courses')
      .select(
        'id, title, slug, description, published, display_order, category, offer_enabled, offer_title, offer_body, offer_cta_label, offer_cta_url'
      )
      .eq('id', id)
      .maybeSingle();
    if (cErr || !cRow) {
      alert(cErr?.message || 'Course not found');
      return;
    }
    const { data: chRows, error: chErr } = await supabase
      .from('course_chapters')
      .select('id, title, position, content_blocks')
      .eq('course_id', id)
      .order('position', { ascending: true });
    if (chErr) console.error(chErr);
    const mapped: ChapterDraft[] = (chRows || []).map((r: Record<string, unknown>) => ({
      id: r.id as string,
      title: (r.title as string) || 'Chapter',
      blocks: normalizeContentBlocks(r.content_blocks).length
        ? normalizeContentBlocks(r.content_blocks)
        : [emptyTextBlock()],
    }));
    setCourseId(cRow.id as string);
    setTitle(cRow.title as string);
    setSlug(cRow.slug as string);
    setDescription((cRow.description as string) || '');
    setPublished(!!cRow.published);
    setDisplayOrder((cRow.display_order as number) ?? 0);
    setCategory(typeof cRow.category === 'string' && cRow.category ? cRow.category : 'General');
    setOfferEnabled(!!cRow.offer_enabled);
    setOfferTitle((cRow.offer_title as string) || '');
    setOfferBody((cRow.offer_body as string) || '');
    setOfferCtaLabel((cRow.offer_cta_label as string) || '');
    setOfferCtaUrl((cRow.offer_cta_url as string) || '');
    setChapters(mapped.length ? mapped : [{ id: newBlockId(), title: 'Chapter 1', blocks: [emptyTextBlock()] }]);
    setActiveChapterIndex(0);
    setEditorPanel('metadata');
    setModalOpen(true);
  };

  const handleCreateDraft = async () => {
    const baseSlug = `draft-${Date.now()}`;
    const { data: row, error } = await supabase
      .from('courses')
      .insert({
        title: 'Untitled course',
        slug: baseSlug,
        description: '',
        published: false,
        display_order: 0,
        category: 'General',
        offer_enabled: false,
      })
      .select('id')
      .single();
    if (error || !row) {
      alert(error?.message || 'Could not create course');
      return;
    }
    const chId = newBlockId();
    await supabase.from('course_chapters').insert({
      id: chId,
      course_id: row.id,
      title: 'Chapter 1',
      position: 0,
      content_blocks: [emptyTextBlock()],
    });
    await fetchList();
    openEditor(row.id as string);
  };

  const syncChapters = async (cid: string, drafts: ChapterDraft[]) => {
    const { data: existing } = await supabase.from('course_chapters').select('id').eq('course_id', cid);
    const keep = new Set(drafts.map((d) => d.id));
    const toRemove = (existing || []).map((r: { id: string }) => r.id).filter((id) => !keep.has(id));
    if (toRemove.length) {
      await supabase.from('course_chapters').delete().in('id', toRemove);
    }
    const rows = drafts.map((ch, i) => ({
      id: ch.id,
      course_id: cid,
      title: ch.title.trim() || `Chapter ${i + 1}`,
      position: i,
      content_blocks: sanitizeBlocksForDb(ch.blocks).map((b) =>
        b.type === 'html'
          ? {
              ...b,
              html: sanitizeCourseAuthorHtml(b.html),
              css: sanitizeCourseAuthorCss(b.css || ''),
            }
          : b
      ),
      updated_at: new Date().toISOString(),
    }));
    if (rows.length) {
      const { error } = await supabase.from('course_chapters').upsert(rows, { onConflict: 'id' });
      if (error) throw error;
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseId) return;
    setSaving(true);
    try {
      const slugFinal = toSlug((slug || title).trim()) || `course-${Date.now()}`;
      const { error: uErr } = await supabase
        .from('courses')
        .update({
          title: title.trim() || 'Untitled',
          slug: slugFinal,
          description: description.trim() || null,
          published,
          display_order: displayOrder,
          category: (category.trim() || 'General').slice(0, 120),
          offer_enabled: offerEnabled,
          offer_title: offerTitle.trim() || null,
          offer_body: offerBody.trim() || null,
          offer_cta_label: offerCtaLabel.trim() || null,
          offer_cta_url: offerCtaUrl.trim() || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', courseId);
      if (uErr) throw uErr;
      await syncChapters(courseId, chapters);
      await fetchList();
      closeModal();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this course and all chapters?')) return;
    const { error } = await supabase.from('courses').delete().eq('id', id);
    if (error) {
      alert(error.message);
      return;
    }
    fetchList();
  };

  const addChapter = () => {
    setChapters((prev) => {
      const next = [
        ...prev,
        { id: newBlockId(), title: `Chapter ${prev.length + 1}`, blocks: [emptyTextBlock()] },
      ];
      setActiveChapterIndex(next.length - 1);
      return next;
    });
    setEditorPanel('chapter');
  };

  const moveChapter = (index: number, dir: -1 | 1) => {
    setChapters((prev) => {
      const j = index + dir;
      if (j < 0 || j >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[j]] = [next[j], next[index]];
      setActiveChapterIndex((cur) => {
        if (cur === index) return j;
        if (cur === j) return index;
        return cur;
      });
      return next;
    });
  };

  const removeChapter = (index: number) => {
    if (!window.confirm('Remove this chapter?')) return;
    setChapters((prev) => {
      const next = prev.filter((_, i) => i !== index);
      setActiveChapterIndex((cur) => {
        if (next.length === 0) return 0;
        if (cur === index) return Math.min(index, next.length - 1);
        if (cur > index) return cur - 1;
        return Math.min(cur, next.length - 1);
      });
      return next;
    });
  };

  const addBlock = (chIndex: number, type: CourseContentBlock['type']) => {
    const block = newBlockForType(type);
    setChapters((prev) =>
      prev.map((ch, i) => (i === chIndex ? { ...ch, blocks: [...ch.blocks, block] } : ch))
    );
  };

  const updateBlock = (chIndex: number, blkIndex: number, patch: Partial<CourseContentBlock>) => {
    setChapters((prev) =>
      prev.map((ch, i) => {
        if (i !== chIndex) return ch;
        const blocks = ch.blocks.map((b, j) => (j === blkIndex ? ({ ...b, ...patch } as CourseContentBlock) : b));
        return { ...ch, blocks };
      })
    );
  };

  const removeBlock = (chIndex: number, blkIndex: number) => {
    setChapters((prev) =>
      prev.map((ch, i) => (i === chIndex ? { ...ch, blocks: ch.blocks.filter((_, j) => j !== blkIndex) } : ch))
    );
  };

  const moveBlock = (chIndex: number, blkIndex: number, dir: -1 | 1) => {
    setChapters((prev) =>
      prev.map((ch, i) => {
        if (i !== chIndex) return ch;
        const j = blkIndex + dir;
        if (j < 0 || j >= ch.blocks.length) return ch;
        const blocks = [...ch.blocks];
        [blocks[blkIndex], blocks[j]] = [blocks[j], blocks[blkIndex]];
        return { ...ch, blocks };
      })
    );
  };

  const handleImageUpload = async (chIndex: number, blkIndex: number, file: File | undefined) => {
    if (!file || !courseId) return;
    setUploading({ ch: chIndex, blk: blkIndex });
    const ext = file.name.split('.').pop() || 'jpg';
    const safe = file.name.replace(/[^\w.-]+/g, '_').slice(0, 80);
    const path = `${courseId}/${Date.now()}-${safe}.${ext}`;
    const { error: upErr } = await supabase.storage.from('course-content').upload(path, file, { upsert: false });
    if (upErr) {
      alert(upErr.message);
      setUploading(null);
      return;
    }
    const { data } = supabase.storage.from('course-content').getPublicUrl(path);
    updateBlock(chIndex, blkIndex, { storage_path: path, public_url: data.publicUrl });
    setUploading(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-serif text-2xl text-[#37352f]">Short courses</h2>
        <button
          type="button"
          onClick={handleCreateDraft}
          className="inline-flex items-center gap-2 rounded-lg bg-[#37352f] px-4 py-2 text-sm font-medium text-white"
        >
          <Plus size={18} aria-hidden />
          New course
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-[#37352f]/25" aria-hidden />
        </div>
      ) : (
        <ul className="space-y-3">
          {list.map((c) => (
            <li
              key={c.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#37352f]/10 bg-white p-4"
            >
              <div className="min-w-0">
                <p className="font-serif text-lg text-[#37352f]">{c.title}</p>
                <p className="mt-1 flex flex-wrap items-center gap-2 text-xs text-[#37352f]/55">
                  <span className="rounded-full bg-[#37352f]/10 px-2 py-0.5 font-semibold uppercase tracking-wide text-[#37352f]/70">
                    {c.category || 'General'}
                  </span>
                  <span>
                    /{ROUTES.courses}/{c.slug}
                  </span>
                  {c.published ? (
                    <span className="ml-2 rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-bold uppercase text-emerald-800">
                      Live
                    </span>
                  ) : (
                    <span className="ml-2 rounded bg-amber-50 px-1.5 py-0.5 text-[10px] font-bold uppercase text-amber-900">
                      Draft
                    </span>
                  )}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => openEditor(c.id)}
                  className="rounded-full border border-[#37352f]/15 p-2 hover:bg-[#37352f]/5"
                  aria-label="Edit course"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(c.id)}
                  className="rounded-full border border-red-200 p-2 text-red-600 hover:bg-red-50"
                  aria-label="Delete course"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </li>
          ))}
          {list.length === 0 ? (
            <p className="rounded-xl border border-dashed border-[#37352f]/15 py-12 text-center text-sm text-[#37352f]/50">
              No courses yet. Create a draft to add chapters, text, YouTube, images, and HTML/CSS embeds.
            </p>
          ) : null}
        </ul>
      )}

      {modalOpen &&
        typeof document !== 'undefined' &&
        ReactDOM.createPortal(
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/45 p-2 backdrop-blur-sm sm:p-4">
            <div className="flex max-h-[94vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
              <div className="flex shrink-0 items-center justify-between border-b border-[#37352f]/10 bg-white px-4 py-3 sm:px-5 sm:py-4">
                <h3 className="font-serif text-lg text-[#37352f] sm:text-xl">Edit course</h3>
                <button type="button" onClick={closeModal} className="text-[#37352f]/40 hover:text-[#37352f]" aria-label="Close">
                  <X size={22} />
                </button>
              </div>

              <form onSubmit={handleSave} className="flex min-h-0 flex-1 flex-col overflow-hidden lg:flex-row">
                <aside className="flex max-h-[40vh] shrink-0 flex-col border-b border-[#37352f]/10 bg-[#fcfaf8] lg:max-h-none lg:w-56 lg:border-b-0 lg:border-r">
                  <div className="flex items-center justify-between border-b border-[#37352f]/10 px-3 py-2">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#37352f]/45">Editor</p>
                    <button
                      type="button"
                      onClick={addChapter}
                      className="rounded-md p-1 text-[#37352f] hover:bg-[#37352f]/10"
                      aria-label="Add chapter"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto p-2" aria-label="Course editor sections">
                    <button
                      type="button"
                      onClick={() => setEditorPanel('metadata')}
                      className={`w-full rounded-lg px-2 py-2.5 text-left text-xs font-semibold uppercase tracking-wide transition-colors ${
                        editorPanel === 'metadata'
                          ? 'bg-[#37352f] text-white shadow-sm'
                          : 'bg-white/80 text-[#37352f]/80 hover:bg-white'
                      }`}
                    >
                      Course &amp; offer
                    </button>
                    <p className="px-2 pt-2 text-[10px] font-bold uppercase tracking-wider text-[#37352f]/40">Chapters</p>
                    {chapters.map((ch, ci) => (
                      <div key={ch.id} className="flex items-stretch gap-0.5">
                        <button
                          type="button"
                          onClick={() => {
                            setEditorPanel('chapter');
                            setActiveChapterIndex(ci);
                          }}
                          className={`min-w-0 flex-1 rounded-lg px-2 py-2 text-left text-xs font-medium transition-colors ${
                            editorPanel === 'chapter' && ci === activeChapterIndex
                              ? 'bg-[#37352f] text-white shadow-sm'
                              : 'bg-white/80 text-[#37352f]/80 hover:bg-white'
                          }`}
                          aria-current={editorPanel === 'chapter' && ci === activeChapterIndex ? 'true' : undefined}
                        >
                          <span className="mr-1 font-mono text-[10px] opacity-60">{ci + 1}.</span>
                          <span className="line-clamp-2">{ch.title || `Chapter ${ci + 1}`}</span>
                        </button>
                        <div className="flex shrink-0 flex-col border border-[#37352f]/10 rounded-lg bg-white/90">
                          <button
                            type="button"
                            onClick={() => moveChapter(ci, -1)}
                            className="px-1 py-0.5 text-[#37352f]/50 hover:bg-[#37352f]/5"
                            aria-label="Move chapter up"
                          >
                            <ChevronUp size={12} />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveChapter(ci, 1)}
                            className="px-1 py-0.5 text-[#37352f]/50 hover:bg-[#37352f]/5"
                            aria-label="Move chapter down"
                          >
                            <ChevronDown size={12} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </nav>
                </aside>

                <div className="flex min-h-0 min-w-0 flex-1 flex-col">
                  <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-5">
                    {editorPanel === 'metadata' ? (
                      <div className="mx-auto max-w-2xl space-y-4">
                        <p className="text-xs text-[#37352f]/55">
                          Course details and the end-of-course CTA. Chapter content is edited one chapter at a time from the sidebar.
                        </p>
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-[#37352f]/50">Title</label>
                            <input
                              value={title}
                              onChange={(e) => setTitle(e.target.value)}
                              className="w-full rounded-lg border border-[#37352f]/15 px-3 py-2 text-sm"
                              required
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-[#37352f]/50">URL slug</label>
                            <input
                              value={slug}
                              onChange={(e) => setSlug(e.target.value)}
                              onBlur={() => setSlug((s) => toSlug(s))}
                              className="w-full rounded-lg border border-[#37352f]/15 px-3 py-2 font-mono text-sm"
                              required
                            />
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-[#37352f]/50">Description</label>
                          <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            className="w-full rounded-lg border border-[#37352f]/15 px-3 py-2 text-sm"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-[#37352f]/50">Category (listing)</label>
                          <input
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            placeholder="e.g. Graphical abstracts, Blender, Outreach"
                            className="w-full rounded-lg border border-[#37352f]/15 px-3 py-2 text-sm"
                          />
                        </div>
                        <div className="flex flex-wrap items-center gap-6 border-t border-[#37352f]/10 pt-4">
                          <label className="inline-flex items-center gap-2 text-sm">
                            <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} />
                            Published
                          </label>
                          <label className="inline-flex items-center gap-2 text-sm">
                            Order
                            <input
                              type="number"
                              value={displayOrder}
                              onChange={(e) => setDisplayOrder(Number(e.target.value) || 0)}
                              className="w-20 rounded-lg border border-[#37352f]/15 px-2 py-1 text-sm"
                            />
                          </label>
                        </div>
                        <div className="rounded-xl border border-amber-200/80 bg-amber-50/40 p-4 sm:p-5">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-[#5c3d0c]/80">End-of-course offer (last)</p>
                          <p className="mt-1 text-xs text-[#5c3d0c]/70">
                            Shown only after learners finish every chapter on the public course page — paid session, workshop, or download link.
                          </p>
                          <label className="mt-3 inline-flex items-center gap-2 text-sm text-[#37352f]">
                            <input type="checkbox" checked={offerEnabled} onChange={(e) => setOfferEnabled(e.target.checked)} />
                            Enable offer after completion
                          </label>
                          <input
                            value={offerTitle}
                            onChange={(e) => setOfferTitle(e.target.value)}
                            placeholder="Offer headline"
                            className="mt-3 w-full rounded-lg border border-[#37352f]/15 bg-white px-3 py-2 text-sm"
                          />
                          <textarea
                            value={offerBody}
                            onChange={(e) => setOfferBody(e.target.value)}
                            rows={3}
                            placeholder="Short description (plain text)"
                            className="mt-2 w-full rounded-lg border border-[#37352f]/15 bg-white px-3 py-2 text-sm"
                          />
                          <div className="mt-4 border-t border-amber-200/60 pt-4">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-[#5c3d0c]/80">Call to action</p>
                            <div className="mt-2 grid gap-2 sm:grid-cols-2">
                              <input
                                value={offerCtaLabel}
                                onChange={(e) => setOfferCtaLabel(e.target.value)}
                                placeholder="Button label (e.g. Book 1:1 session)"
                                className="w-full rounded-lg border border-[#37352f]/15 bg-white px-3 py-2 text-sm"
                              />
                              <input
                                value={offerCtaUrl}
                                onChange={(e) => setOfferCtaUrl(e.target.value)}
                                placeholder="https://…"
                                className="w-full rounded-lg border border-[#37352f]/15 bg-white px-3 py-2 font-mono text-xs"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : chapters[activeChapterIndex] ? (
                      <div className="rounded-xl border border-[#37352f]/12 bg-[#fcfaf8] p-4">
                        <p className="mb-3 text-[10px] font-bold uppercase tracking-wider text-[#37352f]/45">
                          Chapter {activeChapterIndex + 1} of {chapters.length}
                        </p>
                        <div className="mb-4 flex flex-wrap items-center gap-2">
                          <GripVertical className="h-4 w-4 shrink-0 text-[#37352f]/25" aria-hidden />
                          <input
                            value={chapters[activeChapterIndex].title}
                            onChange={(e) =>
                              setChapters((prev) =>
                                prev.map((c, i) =>
                                  i === activeChapterIndex ? { ...c, title: e.target.value } : c
                                )
                              )
                            }
                            className="min-w-0 flex-1 rounded-lg border border-[#37352f]/15 bg-white px-3 py-2 text-sm font-medium"
                            placeholder="Chapter title"
                          />
                          <button
                            type="button"
                            onClick={() => removeChapter(activeChapterIndex)}
                            className="rounded border border-red-200 p-2 text-red-600 hover:bg-red-50"
                            aria-label="Remove this chapter"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>

                        <div className="space-y-3">
                          {chapters[activeChapterIndex].blocks.map((blk, bi) => (
                            <div key={blk.id} className="rounded-lg border border-[#37352f]/10 bg-white p-3">
                              <div className="mb-2 flex items-center justify-between gap-2">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-[#37352f]/45">
                                  {blk.type}
                                </span>
                                <div className="flex gap-1">
                                  <button
                                    type="button"
                                    onClick={() => moveBlock(activeChapterIndex, bi, -1)}
                                    className="rounded p-1 hover:bg-[#37352f]/5"
                                    aria-label="Move block up"
                                  >
                                    <ChevronUp size={14} />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => moveBlock(activeChapterIndex, bi, 1)}
                                    className="rounded p-1 hover:bg-[#37352f]/5"
                                    aria-label="Move block down"
                                  >
                                    <ChevronDown size={14} />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => removeBlock(activeChapterIndex, bi)}
                                    className="rounded p-1 text-red-600 hover:bg-red-50"
                                    aria-label="Remove block"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </div>
                              {blk.type === 'text' ? (
                                <textarea
                                  value={blk.text}
                                  onChange={(e) =>
                                    updateBlock(activeChapterIndex, bi, { type: 'text', text: e.target.value })
                                  }
                                  rows={5}
                                  className="w-full rounded border border-[#37352f]/10 px-2 py-2 font-mono text-sm"
                                  placeholder="Lesson text"
                                />
                              ) : null}
                              {blk.type === 'youtube' ? (
                                <input
                                  value={blk.url}
                                  onChange={(e) =>
                                    updateBlock(activeChapterIndex, bi, { type: 'youtube', url: e.target.value })
                                  }
                                  className="w-full rounded border border-[#37352f]/10 px-2 py-2 font-mono text-sm"
                                  placeholder="https://www.youtube.com/watch?v=…"
                                />
                              ) : null}
                              {blk.type === 'image' ? (
                                <div className="space-y-2">
                                  {!courseId ? (
                                    <p className="text-xs text-amber-800">Save course once before uploading images.</p>
                                  ) : (
                                    <label className="flex cursor-pointer items-center gap-2 rounded border border-dashed border-[#37352f]/20 px-3 py-3 text-xs text-[#37352f]/60 hover:bg-[#37352f]/5">
                                      {uploading?.ch === activeChapterIndex && uploading?.blk === bi ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                      ) : (
                                        <Upload size={14} />
                                      )}
                                      Upload image
                                      <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        disabled={!!uploading}
                                        onChange={(e) =>
                                          handleImageUpload(activeChapterIndex, bi, e.target.files?.[0])
                                        }
                                      />
                                    </label>
                                  )}
                                  {blk.public_url ? (
                                    <img src={blk.public_url} alt="" className="max-h-40 rounded border object-contain" />
                                  ) : null}
                                  <input
                                    value={blk.alt || ''}
                                    onChange={(e) =>
                                      updateBlock(activeChapterIndex, bi, { type: 'image', alt: e.target.value })
                                    }
                                    className="w-full rounded border border-[#37352f]/10 px-2 py-1 text-xs"
                                    placeholder="Alt text (optional)"
                                  />
                                </div>
                              ) : null}
                              {blk.type === 'html' ? (
                                <div className="space-y-2">
                                  <p className="text-[10px] text-[#37352f]/50">
                                    HTML and optional CSS render in an isolated shadow root (scripts and inline handlers are stripped on display).
                                  </p>
                                  <textarea
                                    value={blk.html}
                                    onChange={(e) =>
                                      updateBlock(activeChapterIndex, bi, {
                                        type: 'html',
                                        id: blk.id,
                                        html: e.target.value,
                                        css: blk.css,
                                      })
                                    }
                                    rows={6}
                                    className="w-full rounded border border-[#37352f]/10 px-2 py-2 font-mono text-xs"
                                    placeholder="<div>…</div>"
                                  />
                                  <textarea
                                    value={blk.css || ''}
                                    onChange={(e) =>
                                      updateBlock(activeChapterIndex, bi, {
                                        type: 'html',
                                        id: blk.id,
                                        html: blk.html,
                                        css: e.target.value,
                                      })
                                    }
                                    rows={4}
                                    className="w-full rounded border border-[#37352f]/10 px-2 py-2 font-mono text-xs"
                                    placeholder="Optional CSS scoped to this embed"
                                  />
                                </div>
                              ) : null}
                              {blk.type === 'color_lab' ? (
                                <div className="space-y-2">
                                  <p className="text-[10px] text-[#37352f]/50">
                                    Built-in interactive widget (hue ring, harmony presets including tetradic, complements, warm/cool strip) — no HTML required.
                                  </p>
                                  <select
                                    value={blk.preset}
                                    onChange={(e) =>
                                      updateBlock(activeChapterIndex, bi, {
                                        type: 'color_lab',
                                        id: blk.id,
                                        preset: e.target.value as (typeof COLOR_LAB_PRESETS)[number],
                                      })
                                    }
                                    className="w-full rounded border border-[#37352f]/10 px-2 py-2 text-sm"
                                  >
                                    {COLOR_LAB_PRESETS.map((p) => (
                                      <option key={p} value={p}>
                                        {p.replace(/_/g, ' ')}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              ) : null}
                            </div>
                          ))}
                        </div>

                        <div className="mt-3 flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => addBlock(activeChapterIndex, 'text')}
                            className="rounded-lg border border-[#37352f]/15 px-2 py-1 text-xs font-medium hover:bg-white"
                          >
                            + Text
                          </button>
                          <button
                            type="button"
                            onClick={() => addBlock(activeChapterIndex, 'youtube')}
                            className="rounded-lg border border-[#37352f]/15 px-2 py-1 text-xs font-medium hover:bg-white"
                          >
                            + YouTube
                          </button>
                          <button
                            type="button"
                            onClick={() => addBlock(activeChapterIndex, 'image')}
                            className="rounded-lg border border-[#37352f]/15 px-2 py-1 text-xs font-medium hover:bg-white"
                          >
                            + Image
                          </button>
                          <button
                            type="button"
                            onClick={() => addBlock(activeChapterIndex, 'html')}
                            className="rounded-lg border border-[#37352f]/15 px-2 py-1 text-xs font-medium hover:bg-white"
                          >
                            + HTML/CSS
                          </button>
                          <button
                            type="button"
                            onClick={() => addBlock(activeChapterIndex, 'color_lab')}
                            className="rounded-lg border border-[#37352f]/15 px-2 py-1 text-xs font-medium hover:bg-white"
                          >
                            + Color lab
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-[#37352f]/50">No chapter selected.</p>
                    )}
                  </div>

                  <div className="flex shrink-0 gap-3 border-t border-[#37352f]/10 bg-white p-4 sm:p-5">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="flex-1 rounded-xl border border-[#37352f]/15 py-3 text-sm font-semibold uppercase tracking-wider text-[#37352f]/60"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#37352f] py-3 text-sm font-semibold uppercase tracking-wider text-white disabled:opacity-60"
                    >
                      {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                      Save
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

export default CourseManager;
