import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Circle,
  Loader2,
  Lock,
  PlayCircle,
} from 'lucide-react';
import { supabase } from '../supabase/client';
import type { AppNavigate } from '../types';
import type { Course, CourseChapter } from '../courses/types';
import { normalizeContentBlocks } from '../courses/types';
import {
  loadCourseProgress,
  setChapterComplete,
  progressFraction,
  isChapterIndexUnlocked,
  maxUnlockedChapterIndex,
  setLastChapterIndex,
  loadLastChapterIndex,
  setCoursePlayerOpen,
} from '../courses/courseProgress';
import { ROUTES, courseSlugFromPath } from '../utils/routes';
import CourseChapterRenderer from '../components/CourseChapterRenderer';
import CourseCompletionModal from '../components/CourseCompletionModal';
import { applyPageSeo, clearDynamicJsonLd, courseDetailJsonLd, courseDetailKeywords } from '../utils/seo';

interface CourseDetailProps {
  path: string;
  navigate: AppNavigate;
}

function mapCourseRow(row: Record<string, unknown>): Course {
  return {
    id: row.id as string,
    title: row.title as string,
    slug: row.slug as string,
    description: (row.description as string) ?? null,
    published: !!row.published,
    display_order: (row.display_order as number) ?? 0,
    category: typeof row.category === 'string' && row.category ? row.category : 'General',
    offer_enabled: !!row.offer_enabled,
    offer_title: (row.offer_title as string) ?? null,
    offer_body: (row.offer_body as string) ?? null,
    offer_cta_label: (row.offer_cta_label as string) ?? null,
    offer_cta_url: (row.offer_cta_url as string) ?? null,
    created_at: row.created_at as string | undefined,
    updated_at: row.updated_at as string | undefined,
  };
}

type LearnerPhase = 'chapter' | 'complete';
type CourseSurface = 'overview' | 'learn';

function pickResumeChapterIndex(slug: string, orderedIds: string[]): number {
  const done = new Set(loadCourseProgress(slug).completedChapterIds);
  for (let i = 0; i < orderedIds.length; i++) {
    if (!done.has(orderedIds[i])) return i;
  }
  return Math.max(0, orderedIds.length - 1);
}

const CourseDetail: React.FC<CourseDetailProps> = ({ path, navigate }) => {
  const slug = courseSlugFromPath(path) || '';
  const [course, setCourse] = useState<Course | null>(null);
  const [chapters, setChapters] = useState<CourseChapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [progressTick, setProgressTick] = useState(0);
  const [celebrateOpen, setCelebrateOpen] = useState(false);
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [learnerPhase, setLearnerPhase] = useState<LearnerPhase>('chapter');
  const [surface, setSurface] = useState<CourseSurface>('overview');
  const surfaceInitSlugRef = useRef<string>('');

  const chapterIds = useMemo(() => chapters.map((c) => c.id), [chapters]);

  const refreshProgress = useCallback(() => {
    setProgressTick((t) => t + 1);
  }, []);

  const completedCount = useMemo(() => {
    if (!slug || chapterIds.length === 0) return 0;
    const done = loadCourseProgress(slug).completedChapterIds;
    return done.filter((id) => chapterIds.includes(id)).length;
  }, [slug, chapterIds, progressTick]);

  const allChaptersComplete = useMemo(() => {
    if (!slug || chapterIds.length === 0) return false;
    const done = new Set(loadCourseProgress(slug).completedChapterIds);
    return chapterIds.every((id) => done.has(id));
  }, [slug, chapterIds, progressTick]);

  const playerOpen = slug ? !!loadCourseProgress(slug).playerOpen : false;

  const pct = slug && chapterIds.length ? Math.round(progressFraction(slug, chapterIds) * 100) : 0;

  useEffect(() => {
    if (!slug) {
      setNotFound(true);
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      const { data: courseRow, error: cErr } = await supabase
        .from('courses')
        .select(
          'id, title, slug, description, published, display_order, created_at, updated_at, category, offer_enabled, offer_title, offer_body, offer_cta_label, offer_cta_url'
        )
        .eq('slug', slug)
        .eq('published', true)
        .maybeSingle();
      if (cancelled) return;
      if (cErr || !courseRow) {
        setNotFound(true);
        setLoading(false);
        return;
      }
      const { data: chRows, error: chErr } = await supabase
        .from('course_chapters')
        .select('id, course_id, title, position, content_blocks, created_at, updated_at')
        .eq('course_id', courseRow.id)
        .order('position', { ascending: true });
      if (cancelled) return;
      if (chErr) {
        console.error(chErr);
        setChapters([]);
      } else {
        const mapped = (chRows || []).map((row: Record<string, unknown>) => ({
          id: row.id as string,
          course_id: row.course_id as string,
          title: row.title as string,
          position: row.position as number,
          content_blocks: normalizeContentBlocks(row.content_blocks),
          created_at: row.created_at as string | undefined,
          updated_at: row.updated_at as string | undefined,
        }));
        setChapters(mapped);
        const ids = mapped.map((c) => c.id);
        if (ids.length > 0) {
          const maxU = maxUnlockedChapterIndex(slug, ids);
          const saved = loadLastChapterIndex(slug, mapped.length);
          setActiveChapterIndex(Math.min(Math.max(0, saved), maxU));
          const every = ids.every((id) => loadCourseProgress(slug).completedChapterIds.includes(id));
          setLearnerPhase(every ? 'complete' : 'chapter');
        } else {
          setActiveChapterIndex(0);
          setLearnerPhase('chapter');
        }
      }
      setCourse(mapCourseRow(courseRow as Record<string, unknown>));
      setLoading(false);
      setCelebrateOpen(false);
      refreshProgress();
    })();
    return () => {
      cancelled = true;
    };
  }, [slug, refreshProgress]);

  useEffect(() => {
    if (!course || loading || !slug) return;
    if (surfaceInitSlugRef.current === slug) return;
    surfaceInitSlugRef.current = slug;
    const p = loadCourseProgress(slug);
    setSurface(p.playerOpen ? 'learn' : 'overview');
  }, [course?.id, loading, slug]);

  useEffect(() => {
    if (!slug || chapters.length === 0) return;
    const ids = chapters.map((c) => c.id);
    const maxU = maxUnlockedChapterIndex(slug, ids);
    setActiveChapterIndex((i) => Math.min(i, maxU));
    if (!ids.every((id) => loadCourseProgress(slug).completedChapterIds.includes(id))) {
      setLearnerPhase((p) => (p === 'complete' ? 'chapter' : p));
    }
  }, [slug, chapters, progressTick]);

  useEffect(() => {
    if (!course || loading) return;
    const canonicalPath = `${ROUTES.courses}/${course.slug}`;
    const desc =
      course.description?.trim() ||
      'Multi-chapter short course with structured lessons, media, and interactive examples for researchers.';
    applyPageSeo({
      title: `${course.title} | Short course | Rafeeque Mavoor`,
      description: desc.length > 165 ? `${desc.slice(0, 162)}…` : desc,
      canonicalPath,
      keywords: courseDetailKeywords(course),
      ogImage: '/og-image.jpg',
      ogType: 'article',
      robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
      jsonLd: courseDetailJsonLd(course, chapters, canonicalPath),
    });
    return () => clearDynamicJsonLd();
  }, [course, chapters, loading]);

  const goToChapter = useCallback(
    (index: number) => {
      if (!slug || chapters.length === 0) return;
      const ids = chapters.map((c) => c.id);
      if (!isChapterIndexUnlocked(slug, ids, index)) return;
      setLearnerPhase('chapter');
      setActiveChapterIndex(index);
      setLastChapterIndex(slug, index);
    },
    [slug, chapters]
  );

  const beginOrResumeCourse = useCallback(() => {
    if (!slug || chapters.length === 0) return;
    setCoursePlayerOpen(slug, true);
    setSurface('learn');
    const ids = chapters.map((c) => c.id);
    const done = new Set(loadCourseProgress(slug).completedChapterIds);
    const every = ids.length > 0 && ids.every((id) => done.has(id));
    if (every) {
      setLearnerPhase('complete');
    } else {
      setLearnerPhase('chapter');
      const resume = pickResumeChapterIndex(slug, ids);
      const maxU = maxUnlockedChapterIndex(slug, ids);
      const idx = Math.min(resume, maxU);
      setActiveChapterIndex(idx);
      setLastChapterIndex(slug, idx);
    }
    refreshProgress();
  }, [slug, chapters, refreshProgress]);

  const toggleChapter = (chapterId: string, currentlyDone: boolean) => {
    if (!slug) return;
    const before = loadCourseProgress(slug).completedChapterIds.filter((id) => chapterIds.includes(id)).length;
    setChapterComplete(slug, chapterId, !currentlyDone);
    const after = loadCourseProgress(slug).completedChapterIds.filter((id) => chapterIds.includes(id)).length;
    refreshProgress();
    if (!currentlyDone && chapterIds.length > 0 && before === chapterIds.length - 1 && after === chapterIds.length) {
      setCelebrateOpen(true);
    }
  };

  const currentChapter = chapters[activeChapterIndex];
  const currentDone = currentChapter && slug ? loadCourseProgress(slug).completedChapterIds.includes(currentChapter.id) : false;
  const canGoNext =
    currentChapter &&
    currentDone &&
    activeChapterIndex < chapters.length - 1 &&
    isChapterIndexUnlocked(slug, chapterIds, activeChapterIndex + 1);
  const canGoPrev = activeChapterIndex > 0;

  const goNext = () => {
    if (!slug || !canGoNext) return;
    const next = activeChapterIndex + 1;
    setActiveChapterIndex(next);
    setLastChapterIndex(slug, next);
  };

  const goPrev = () => {
    if (!slug || !canGoPrev) return;
    const prev = activeChapterIndex - 1;
    setActiveChapterIndex(prev);
    setLastChapterIndex(slug, prev);
    setLearnerPhase('chapter');
  };

  const handleModalClose = () => {
    setCelebrateOpen(false);
    if (slug && chapterIds.length > 0 && chapterIds.every((id) => loadCourseProgress(slug).completedChapterIds.includes(id))) {
      setLearnerPhase('complete');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" aria-hidden />
      </div>
    );
  }

  if (notFound || !course) {
    return (
      <div className="mx-auto max-w-lg flex-1 px-4 py-20 text-center">
        <p className="font-serif text-2xl text-slate-800">Course not found</p>
        <p className="mt-2 text-sm text-slate-500">This course may be unpublished or the link is incorrect.</p>
        <a
          href={ROUTES.courses}
          onClick={(e) => navigate(e, 'courses', ROUTES.courses)}
          className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-slate-700 underline-offset-4 hover:underline"
        >
          <ChevronLeft size={16} aria-hidden />
          All courses
        </a>
      </div>
    );
  }

  const showOffer =
    course.offer_enabled && (course.offer_title?.trim() || course.offer_body?.trim() || course.offer_cta_url?.trim());

  const startCtaLabel =
    playerOpen || completedCount > 0 ? 'Continue to lessons' : 'Start course';

  const learnStickyBar = (
    <div className="sticky top-0 z-20 -mx-4 mb-6 border-b border-slate-200/90 bg-slate-50/95 px-4 py-2.5 shadow-sm backdrop-blur sm:-mx-6 sm:px-6">
      <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1.5">
        <a
          href={ROUTES.courses}
          onClick={(e) => navigate(e, 'courses', ROUTES.courses)}
          className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-800"
        >
          <ChevronLeft size={14} aria-hidden />
          Catalog
        </a>
        <span className="hidden text-slate-300 sm:inline" aria-hidden>
          /
        </span>
        <p className="min-w-0 flex-1 truncate text-sm font-semibold leading-tight text-slate-900 sm:flex-none">{course.title}</p>
        {chapters.length > 0 ? (
          <div className="flex w-full min-w-[8rem] items-center gap-2 sm:ml-auto sm:w-auto">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-200 sm:w-24 sm:flex-none">
              <div className="h-full rounded-full bg-emerald-600 transition-all duration-500" style={{ width: `${pct}%` }} />
            </div>
            <span className="shrink-0 tabular-nums text-xs font-medium text-slate-500">{pct}%</span>
          </div>
        ) : null}
      </div>
      {surface === 'learn' && learnerPhase === 'chapter' && currentChapter ? (
        <p className="mt-1.5 truncate text-xs text-slate-500">
          Lesson {activeChapterIndex + 1} of {chapters.length}
          <span className="text-slate-300"> · </span>
          <span className="text-slate-600">{currentChapter.title}</span>
        </p>
      ) : surface === 'learn' && learnerPhase === 'complete' ? (
        <p className="mt-1.5 text-xs font-medium text-emerald-800">Course complete</p>
      ) : null}
    </div>
  );

  return (
    <>
      <CourseCompletionModal open={celebrateOpen} courseTitle={course.title} onClose={handleModalClose} />

      {surface === 'overview' ? (
        <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
          <a
            href={ROUTES.courses}
            onClick={(e) => navigate(e, 'courses', ROUTES.courses)}
            className="mb-8 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-slate-500 hover:text-slate-800"
          >
            <ChevronLeft size={14} aria-hidden />
            Back to catalog
          </a>

          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 bg-slate-50/80 px-6 py-5 sm:px-8 sm:py-6">
              <span className="inline-flex rounded-full border border-slate-200 bg-white px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                {course.category}
              </span>
              <h1 className="mt-4 font-serif text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">{course.title}</h1>
              {course.updated_at ? (
                <p className="mt-2 text-xs text-slate-400">
                  Updated{' '}
                  <time dateTime={course.updated_at}>{new Date(course.updated_at).toLocaleDateString(undefined, { dateStyle: 'medium' })}</time>
                </p>
              ) : null}
            </div>

            <div className="space-y-6 px-6 py-6 sm:px-8 sm:py-8">
              {course.description ? (
                <p className="text-sm leading-relaxed text-slate-600">{course.description}</p>
              ) : (
                <p className="text-sm text-slate-500">Open the lessons below when you are ready.</p>
              )}

              {chapters.length > 0 ? (
                <>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Curriculum</p>
                    <ol className="mt-3 divide-y divide-slate-100 rounded-lg border border-slate-100 bg-slate-50/50">
                      {chapters.map((ch, idx) => (
                        <li key={ch.id} className="flex items-start gap-3 px-3 py-2.5 text-sm text-slate-700">
                          <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-xs font-semibold text-slate-500 ring-1 ring-slate-200">
                            {idx + 1}
                          </span>
                          <span className="min-w-0 leading-snug">{ch.title}</span>
                        </li>
                      ))}
                    </ol>
                    <p className="mt-2 text-xs text-slate-400">{chapters.length} lessons · progress is saved in this browser</p>
                  </div>

                  {(playerOpen || completedCount > 0) && (
                    <div className="rounded-lg border border-slate-100 bg-slate-50 p-4">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Your progress</p>
                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
                        <div className="h-full rounded-full bg-emerald-600 transition-all" style={{ width: `${pct}%` }} />
                      </div>
                      <p className="mt-2 text-xs text-slate-500">
                        {completedCount} / {chapters.length} lessons complete
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <p className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
                  This course has no lessons yet.
                </p>
              )}

              {chapters.length > 0 ? (
                <div className="flex flex-col gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:items-center">
                  <button
                    type="button"
                    onClick={beginOrResumeCourse}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 sm:w-auto"
                  >
                    {playerOpen || completedCount > 0 ? (
                      <PlayCircle size={18} aria-hidden />
                    ) : (
                      <BookOpen size={18} aria-hidden />
                    )}
                    {startCtaLabel}
                  </button>
                  {playerOpen ? (
                    <button
                      type="button"
                      onClick={() => {
                        setCoursePlayerOpen(slug, false);
                        refreshProgress();
                      }}
                      className="text-center text-xs font-medium text-slate-500 underline-offset-2 hover:text-slate-700 hover:underline sm:text-left"
                    >
                      Reset intro (clear “started” flag)
                    </button>
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>
        </main>
      ) : (
        <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-0 px-4 py-6 sm:px-6 lg:flex-row lg:gap-0 lg:py-8">
          <aside
            className="mb-6 shrink-0 border-slate-200 lg:mb-0 lg:w-56 lg:border-r lg:bg-slate-50/50 lg:pr-4"
            aria-label="Course outline and progress"
          >
            <div className="lg:sticky lg:top-6 lg:max-h-[calc(100vh-3rem)] lg:overflow-y-auto lg:pr-1">
              <button
                type="button"
                onClick={() => setSurface('overview')}
                className="mb-4 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-left text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
              >
                Course overview
              </button>

              {chapters.length > 0 ? (
                <div className="mb-4 rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Progress</p>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full rounded-full bg-emerald-600 transition-all duration-500" style={{ width: `${pct}%` }} />
                  </div>
                  <p className="mt-2 text-xs text-slate-500">
                    {completedCount} / {chapters.length} lessons
                  </p>
                </div>
              ) : null}

              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Lessons</p>
              <nav className="mt-2 space-y-0.5 border-l border-slate-200 pl-3">
                {chapters.map((ch, idx) => {
                  const unlocked = slug ? isChapterIndexUnlocked(slug, chapterIds, idx) : idx === 0;
                  const done = slug ? loadCourseProgress(slug).completedChapterIds.includes(ch.id) : false;
                  const isActive = learnerPhase === 'chapter' && idx === activeChapterIndex;
                  return (
                    <div key={ch.id} className="flex items-start gap-2 py-1">
                      {unlocked ? (
                        <button
                          type="button"
                          onClick={() => toggleChapter(ch.id, done)}
                          className="mt-0.5 shrink-0 text-slate-400 hover:text-emerald-600"
                          aria-label={done ? `Mark lesson ${idx + 1} incomplete` : `Mark lesson ${idx + 1} complete`}
                          title={done ? 'Mark incomplete' : 'Mark complete'}
                        >
                          {done ? <CheckCircle2 size={17} className="text-emerald-600" aria-hidden /> : <Circle size={17} aria-hidden />}
                        </button>
                      ) : (
                        <span className="mt-0.5 shrink-0 text-slate-300" title="Complete previous lessons first">
                          <Lock size={15} aria-hidden />
                        </span>
                      )}
                      <button
                        type="button"
                        disabled={!unlocked}
                        onClick={() => goToChapter(idx)}
                        className={`min-w-0 flex-1 rounded-md py-1 text-left text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                          isActive ? 'bg-emerald-50 font-medium text-emerald-900 ring-1 ring-emerald-200/80' : 'text-slate-700 hover:bg-slate-100'
                        } ${done && !isActive ? 'text-slate-500 line-through decoration-slate-300' : ''}`}
                      >
                        <span className="mr-1.5 font-mono text-[10px] text-slate-400">{idx + 1}</span>
                        {ch.title}
                      </button>
                    </div>
                  );
                })}
              </nav>

              {allChaptersComplete ? (
                <button
                  type="button"
                  onClick={() => setLearnerPhase('complete')}
                  className={`mt-4 w-full rounded-lg border px-3 py-2.5 text-left text-[11px] font-bold uppercase tracking-wide transition ${
                    learnerPhase === 'complete'
                      ? 'border-emerald-300 bg-emerald-50 text-emerald-900'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                  }`}
                >
                  Finish &amp; next steps
                </button>
              ) : null}
            </div>
          </aside>

          <article className="min-w-0 flex-1 lg:pl-8">
            {learnStickyBar}

            {chapters.length === 0 ? (
              <p className="text-sm text-slate-500">This course has no lessons yet.</p>
            ) : learnerPhase === 'complete' && allChaptersComplete ? (
              <section className="space-y-6" aria-labelledby="course-finish-heading">
                <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-5 sm:p-6">
                  <h2 id="course-finish-heading" className="text-lg font-semibold text-slate-900">
                    You finished the course
                  </h2>
                  <p className="mt-2 text-sm text-slate-600">
                    Every lesson is complete. Use the outline to review, or continue below.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setLearnerPhase('chapter');
                      setActiveChapterIndex(Math.max(0, chapters.length - 1));
                      if (slug) setLastChapterIndex(slug, Math.max(0, chapters.length - 1));
                    }}
                    className="mt-4 text-sm font-medium text-emerald-800 underline-offset-4 hover:underline"
                  >
                    Back to lessons
                  </button>
                </div>

                {showOffer ? (
                  <section
                    className="rounded-xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50/90 p-5 sm:p-6"
                    aria-labelledby="course-offer-heading"
                  >
                    {course.offer_title?.trim() ? (
                      <h2 id="course-offer-heading" className="text-lg font-semibold text-amber-950 sm:text-xl">
                        {course.offer_title.trim()}
                      </h2>
                    ) : (
                      <h2 id="course-offer-heading" className="text-lg font-semibold text-amber-950 sm:text-xl">
                        Next step
                      </h2>
                    )}
                    {course.offer_body?.trim() ? (
                      <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-amber-950/85">{course.offer_body.trim()}</p>
                    ) : null}
                    {course.offer_cta_url?.trim() && course.offer_cta_label?.trim() ? (
                      <a
                        href={course.offer_cta_url.trim()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-5 inline-flex items-center justify-center rounded-md bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                      >
                        {course.offer_cta_label.trim()}
                      </a>
                    ) : null}
                  </section>
                ) : (
                  <p className="text-sm text-slate-500">No follow-up offer is configured for this course.</p>
                )}
              </section>
            ) : currentChapter ? (
              <section className="space-y-5" aria-labelledby={`chapter-title-${currentChapter.id}`}>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={goPrev}
                      disabled={!canGoPrev}
                      className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <ChevronLeft size={16} aria-hidden />
                      Previous
                    </button>
                    <button
                      type="button"
                      onClick={goNext}
                      disabled={!canGoNext}
                      className="inline-flex items-center gap-1 rounded-md border border-slate-900 bg-slate-900 px-3 py-2 text-sm font-medium text-white shadow-sm disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Next lesson
                      <ChevronRight size={16} aria-hidden />
                    </button>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
                  <div className="mb-4 flex flex-wrap items-end justify-between gap-3 border-b border-slate-100 pb-4">
                    <h2 id={`chapter-title-${currentChapter.id}`} className="text-lg font-semibold leading-snug text-slate-900 sm:text-xl">
                      {currentChapter.title}
                    </h2>
                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 hover:border-slate-300">
                      <input
                        type="checkbox"
                        checked={currentDone}
                        onChange={() => toggleChapter(currentChapter.id, currentDone)}
                        className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                      />
                      Mark complete
                    </label>
                  </div>
                  <CourseChapterRenderer blocks={currentChapter.content_blocks} />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-100 bg-slate-50/80 px-4 py-3">
                  <p className="text-xs text-slate-500">
                    {currentDone
                      ? activeChapterIndex < chapters.length - 1
                        ? 'Go to the next lesson when you are ready.'
                        : 'Last lesson — mark complete to finish the course.'
                      : 'Mark this lesson complete to unlock the next one.'}
                  </p>
                  {allChaptersComplete ? (
                    <button
                      type="button"
                      onClick={() => setLearnerPhase('complete')}
                      className="rounded-md bg-emerald-700 px-3 py-2 text-[11px] font-bold uppercase tracking-wide text-white hover:bg-emerald-800"
                    >
                      Finish &amp; next steps
                    </button>
                  ) : null}
                </div>
              </section>
            ) : null}
          </article>
        </main>
      )}
    </>
  );
};

export default CourseDetail;
