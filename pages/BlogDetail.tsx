import React, { useEffect, useRef, useState } from 'react';
import { blogPosts as fallbackPosts } from '../data/blog';
import { supabase } from '../supabase/client';
import { BlogPost, type AppNavigate } from '../types';
import { ROUTES } from '../utils/routes';

function slugifyHeading(text: string, index: number): string {
  const base = text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 56);
  return base.length > 0 ? base : `section-${index}`;
}

function mapSupabaseRowToPost(data: Record<string, unknown>): BlogPost {
  return {
    id: String(data.id),
    slug: String(data.slug),
    title: String(data.title),
    subtitle: String(data.subtitle ?? ''),
    date: String(data.date),
    excerpt: String(data.excerpt ?? ''),
    content: String(data.content ?? ''),
    readingTime: String(data.reading_time ?? '5 min read'),
    tags: Array.isArray(data.tags) ? (data.tags as string[]) : [],
    category: String(data.category ?? 'Engineering'),
    imageUrl: String(data.image_url ?? ''),
    featured: Boolean(data.featured),
    author: {
      name: String(data.author_name ?? 'Rafeeque Mavoor'),
      avatar: String(data.author_avatar ?? ''),
      role: String(data.author_role ?? 'Scientific Illustrator and Educator'),
    },
  };
}

interface BlogDetailProps {
  path: string;
  navigate: AppNavigate;
}

const BlogDetail: React.FC<BlogDetailProps> = ({ path, navigate }) => {
  const slug = path.split('/').pop();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [related, setRelated] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [toc, setToc] = useState<{ id: string; text: string; level: number }[]>([]);
  const articleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) {
        setLoading(false);
        return;
      }
      const { data, error } = await supabase.from('posts').select('*').eq('slug', slug).single();
      if (error || !data) {
        setPost(fallbackPosts.find((item) => item.slug === slug) || null);
        setLoading(false);
        return;
      }

      setPost(mapSupabaseRowToPost(data as Record<string, unknown>));
      setLoading(false);
    };
    fetchPost();
  }, [slug]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!slug) return;
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('is_published', true)
        .order('date', { ascending: false });
      if (cancelled) return;
      if (error || !data?.length) {
        const sorted = [...fallbackPosts]
          .filter((p) => p.slug !== slug)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setRelated(sorted);
        return;
      }
      setRelated(
        (data as Record<string, unknown>[]).map(mapSupabaseRowToPost).filter((p) => p.slug !== slug)
      );
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  useEffect(() => {
    if (!post) return;
    const title = `${post.title} | Rafeeque Mavoor`;
    document.title = title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', post.excerpt);
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', `https://rafeeque.com/blog/${post.slug}`);
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', title);
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', post.excerpt);
    document.querySelector('meta[property="og:url"]')?.setAttribute('content', `https://rafeeque.com/blog/${post.slug}`);
    document.querySelector('meta[name="twitter:title"]')?.setAttribute('content', title);
    document.querySelector('meta[name="twitter:description"]')?.setAttribute('content', post.excerpt);
  }, [post]);

  useEffect(() => {
    if (!post) {
      setToc([]);
      return;
    }
    const frameId = requestAnimationFrame(() => {
      const root = articleRef.current;
      if (!root) return;
      const els = root.querySelectorAll('h2, h3');
      const used = new Set<string>();
      const items: { id: string; text: string; level: number }[] = [];
      els.forEach((el, i) => {
        const htmlEl = el as HTMLElement;
        let idAttr = htmlEl.id;
        if (!idAttr) {
          idAttr = slugifyHeading(el.textContent || '', i);
          let candidate = idAttr;
          let n = 0;
          while (used.has(candidate)) {
            n += 1;
            candidate = `${idAttr}-${n}`;
          }
          used.add(candidate);
          htmlEl.id = candidate;
          idAttr = candidate;
        } else if (!used.has(idAttr)) {
          used.add(idAttr);
        }
        items.push({
          id: idAttr,
          text: (el.textContent || '').trim(),
          level: el.tagName === 'H2' ? 2 : 3,
        });
      });
      setToc(items);
    });
    return () => cancelAnimationFrame(frameId);
  }, [post]);

  if (loading) {
    return <div className="mx-auto w-full max-w-3xl px-4 py-16 text-[#37352f]/60 sm:px-6 md:px-12 md:py-20">Loading post...</div>;
  }

  if (!post) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-16 text-center sm:px-6 md:px-12 md:py-20">
        <h1 className="text-3xl font-serif mb-4">Post not found</h1>
        <a
          href={ROUTES.blog}
          onClick={(e) => navigate(e, 'blog', ROUTES.blog)}
          className="text-sm uppercase tracking-[0.15em] text-[#37352f]/70 hover:text-[#37352f]"
        >
          Back to blog
        </a>
      </div>
    );
  }

  const navLink =
    'block rounded-md py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#37352f]/50 transition-colors hover:bg-[#37352f]/5 hover:text-[#37352f]';

  return (
    <div className="mx-auto w-full max-w-6xl animate-fade-in-up px-4 py-10 sm:px-6 xl:max-w-[1320px] xl:px-10 xl:py-16">
      <a
        href={ROUTES.blog}
        onClick={(e) => navigate(e, 'blog', ROUTES.blog)}
        className="inline-flex items-center gap-2 text-sm font-medium text-[#37352f]/60 transition-colors hover:text-[#37352f]"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
        All posts
      </a>

      <div className="mt-8 flex flex-col gap-10 lg:mt-10 lg:grid lg:grid-cols-[minmax(0,10.5rem)_minmax(0,1fr)_minmax(0,12rem)] lg:items-start lg:gap-x-8 xl:grid-cols-[11rem_1fr_13.5rem] xl:gap-x-10">
        <aside className="order-1 lg:sticky lg:top-24 lg:self-start">
          <nav className="border-b border-[#37352f]/10 pb-6 lg:border-0 lg:pb-0" aria-label="Article navigation">
            <a href={ROUTES.blog} onClick={(e) => navigate(e, 'blog', ROUTES.blog)} className={navLink}>
              Journal
            </a>
            <a href={ROUTES.workshops} onClick={(e) => navigate(e, 'workshops', ROUTES.workshops)} className={navLink}>
              Workshops
            </a>
            {toc.length > 0 ? (
              <div className="mt-6 border-t border-[#37352f]/10 pt-5 lg:border-t-0 lg:pt-0">
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#37352f]/35">On this page</p>
                <ul className="space-y-0.5 border-l border-[#37352f]/10 pl-3">
                  {toc.map((item) => (
                    <li key={item.id}>
                      <a
                        href={`#${item.id}`}
                        className={`block border-l-2 border-transparent py-1 pl-2 text-[13px] font-normal normal-case leading-snug tracking-normal text-[#37352f]/65 transition-colors hover:border-[#37352f]/25 hover:text-[#37352f] ${
                          item.level === 3 ? 'pl-4 text-[12px] text-[#37352f]/55' : ''
                        }`}
                      >
                        {item.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </nav>
        </aside>

        <div className="order-2 min-w-0">
          <header className="mb-10">
            <div className="mb-4 flex flex-wrap items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.15em] text-[#37352f]/50">
              <span>{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              <span aria-hidden>•</span>
              <span>{post.readingTime}</span>
              <span aria-hidden>•</span>
              <span>{post.category}</span>
            </div>
            <h1 className="mb-4 font-serif text-4xl tracking-tight text-[#37352f] md:text-5xl">{post.title}</h1>
            {post.subtitle ? <p className="text-lg leading-relaxed text-[#37352f]/70">{post.subtitle}</p> : null}
          </header>

          <img
            src={post.imageUrl}
            alt={post.title}
            className="mb-10 h-72 w-full rounded-xl border border-[#37352f]/10 object-cover md:h-96"
          />

          <article
            ref={articleRef}
            className="prose max-w-none prose-headings:scroll-mt-24 prose-headings:font-serif prose-headings:text-[#37352f] prose-p:text-[#37352f]/80 prose-li:text-[#37352f]/80 prose-a:text-[#37352f] prose-a:underline prose-figure:my-8 prose-figcaption:text-center prose-figcaption:text-sm prose-figcaption:text-[#37352f]/60 [&_img]:rounded-xl [&_img]:border [&_img]:border-[#37352f]/10"
            dangerouslySetInnerHTML={{ __html: post.content || '' }}
          />
        </div>

        <aside className="order-3 lg:sticky lg:top-24 lg:self-start">
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#37352f]/35">More posts</p>
          {related.length === 0 ? (
            <p className="text-xs text-[#37352f]/45">No other posts yet.</p>
          ) : (
            <ul className="flex flex-col gap-3">
              {related.slice(0, 8).map((r) => (
                <li key={r.id}>
                  <a
                    href={`/blog/${r.slug}`}
                    onClick={(e) => navigate(e, 'blog-detail', `/blog/${r.slug}`)}
                    className="group flex gap-3 rounded-xl border border-[#37352f]/10 bg-white p-2 shadow-sm transition-all hover:border-[#37352f]/18 hover:shadow-md"
                  >
                    {r.imageUrl ? (
                      <img
                        src={r.imageUrl}
                        alt=""
                        className="h-16 w-[4.5rem] shrink-0 rounded-lg border border-[#37352f]/8 object-cover"
                        loading="lazy"
                        decoding="async"
                        aria-hidden
                      />
                    ) : (
                      <div className="h-16 w-[4.5rem] shrink-0 rounded-lg bg-[#f3f1ee]" aria-hidden />
                    )}
                    <span className="line-clamp-3 min-w-0 font-serif text-[13px] leading-snug text-[#37352f] transition-colors group-hover:text-black">
                      {r.title}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </aside>
      </div>
    </div>
  );
};

export default BlogDetail;
