import React, { useEffect, useMemo, useState } from 'react';
import { BookOpen, Loader2 } from 'lucide-react';
import { supabase } from '../supabase/client';
import type { AppNavigate } from '../types';
import type { Course } from '../courses/types';
import { ROUTES } from '../utils/routes';
import { applyPageSeo, clearDynamicJsonLd, coursesIndexJsonLd, COURSES_INDEX_DESC, COURSES_INDEX_KEYWORDS } from '../utils/seo';

interface CoursesProps {
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

const ALL = 'All';

const Courses: React.FC<CoursesProps> = ({ navigate }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>(ALL);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from('courses')
        .select(
          'id, title, slug, description, published, display_order, created_at, updated_at, category, offer_enabled, offer_title, offer_body, offer_cta_label, offer_cta_url'
        )
        .eq('published', true)
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });
      if (cancelled) return;
      if (error) {
        console.error(error);
        setCourses([]);
      } else {
        setCourses((data || []).map((r) => mapCourseRow(r as Record<string, unknown>)));
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const categories = useMemo(() => {
    const set = new Set<string>();
    courses.forEach((c) => set.add(c.category || 'General'));
    return [ALL, ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, [courses]);

  const filtered = useMemo(() => {
    if (activeCategory === ALL) return courses;
    return courses.filter((c) => (c.category || 'General') === activeCategory);
  }, [courses, activeCategory]);

  useEffect(() => {
    applyPageSeo({
      title: 'Short courses | Graphical abstracts & scientific illustration | Rafeeque Mavoor',
      description: COURSES_INDEX_DESC,
      canonicalPath: ROUTES.courses,
      keywords: COURSES_INDEX_KEYWORDS,
      ogImage: '/og-image.jpg',
      ogType: 'website',
      robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
      jsonLd: coursesIndexJsonLd(),
    });
    return () => clearDynamicJsonLd();
  }, []);

  return (
    <section className="mx-auto w-full max-w-6xl flex-1 px-4 py-12 sm:px-6 md:py-16" id="courses-index" aria-labelledby="courses-heading">
      <header className="mb-10 text-center lg:mb-12">
        <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#37352f]/45">Learn</p>
        <h1 id="courses-heading" className="font-serif text-3xl tracking-tight text-[#37352f] sm:text-4xl">
          Short courses
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-[#37352f]/65">
          Self-paced lessons for researchers: graphical abstracts, journal-ready figures, and clear visual storytelling. Each course uses
          structured chapters (text, video, images, and optional interactive HTML) so search engines and AI assistants can follow a stable
          outline.
        </p>
      </header>

      <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-12">
        <nav
          className="shrink-0 lg:sticky lg:top-24 lg:w-52"
          aria-label="Filter by category"
        >
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#37352f]/40">Categories</p>
          <div className="flex flex-wrap gap-2 lg:flex-col lg:flex-nowrap lg:gap-1">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`rounded-full border px-3 py-1.5 text-left text-xs font-semibold uppercase tracking-wider transition-colors lg:w-full lg:rounded-xl lg:px-3 lg:py-2.5 ${
                  activeCategory === cat
                    ? 'border-[#37352f] bg-[#37352f] text-white shadow-sm'
                    : 'border-[#37352f]/15 bg-white text-[#37352f]/70 hover:border-[#37352f]/25 hover:text-[#37352f]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </nav>

        <div className="min-w-0 flex-1">
          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-[#37352f]/25" aria-hidden />
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#37352f]/15 bg-white/60 px-6 py-14 text-center text-sm text-[#37352f]/55">
              <BookOpen className="mx-auto mb-3 h-10 w-10 text-[#37352f]/20" aria-hidden />
              {courses.length === 0 ? 'No published courses yet. Check back soon.' : 'No courses in this category yet.'}
            </div>
          ) : (
            <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {filtered.map((c) => (
                <li key={c.id} className="h-full">
                  <a
                    href={`${ROUTES.courses}/${c.slug}`}
                    onClick={(e) => navigate(e, 'course-detail', `${ROUTES.courses}/${c.slug}`)}
                    className="flex h-full min-h-[220px] flex-col rounded-2xl border border-[#37352f]/10 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#37352f]/20 hover:shadow-md"
                  >
                    <span className="inline-flex w-fit rounded-full bg-[#37352f]/8 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#37352f]/70">
                      {c.category || 'General'}
                    </span>
                    <h2 className="mt-3 font-serif text-xl leading-snug text-[#37352f]">{c.title}</h2>
                    {c.description ? (
                      <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-[#37352f]/65">{c.description}</p>
                    ) : (
                      <p className="mt-2 flex-1 text-sm italic text-[#37352f]/40">Open to view chapters.</p>
                    )}
                    <span className="mt-4 text-xs font-bold uppercase tracking-wider text-[#37352f]/50">Start course →</span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
};

export default Courses;
