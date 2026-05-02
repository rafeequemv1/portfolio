import React from 'react';
import { useEffect, useState } from 'react';
import { blogPosts as fallbackPosts } from '../data/blog';
import { supabase } from '../supabase/client';
import { BlogPost, View } from '../types';

interface BlogProps {
  navigate: (e: React.MouseEvent<HTMLAnchorElement> | React.MouseEvent<HTMLButtonElement>, view: View, path: string) => void;
}

const Blog: React.FC<BlogProps> = ({ navigate }) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('is_published', true)
        .order('date', { ascending: false });

      if (error || !data || data.length === 0) {
        setPosts([...fallbackPosts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
        setLoading(false);
        return;
      }

      const mapped: BlogPost[] = data.map((post: any) => ({
        id: post.id,
        slug: post.slug,
        title: post.title,
        subtitle: post.subtitle || '',
        date: post.date,
        excerpt: post.excerpt || '',
        content: post.content || '',
        readingTime: post.reading_time || '5 min read',
        tags: post.tags || [],
        category: post.category || 'Engineering',
        imageUrl: post.image_url || '',
        featured: !!post.featured,
        author: {
          name: post.author_name || 'Rafeeque Mavoor',
          avatar: post.author_avatar || '',
          role: post.author_role || 'Scientific Illustrator and Educator',
        },
      }));
      setPosts(mapped);
      setLoading(false);
    };
    fetchPosts();
  }, []);

  return (
    <div className="mx-auto w-full max-w-6xl animate-fade-in-up px-4 py-10 sm:px-6 md:px-12 md:py-20 lg:px-24">
      <header className="mb-14 max-w-3xl">
        <p className="text-xs uppercase tracking-[0.2em] text-[#37352f]/50 font-semibold mb-4">Journal</p>
        <h1 className="text-4xl md:text-5xl font-serif text-[#37352f] tracking-tight mb-5">Thoughts on design, code, and scientific communication.</h1>
        <p className="text-[#37352f]/70 leading-relaxed">
          A minimal reading space inspired by modern editorial platforms, covering prompt engineering, databases, and web app development.
        </p>
      </header>

      {loading && <div className="py-12 text-[#37352f]/60">Loading posts...</div>}
      <section className="space-y-6">
        {posts.map((post) => (
          <article key={post.id} className="border border-[#37352f]/10 rounded-2xl bg-white/70 overflow-hidden shadow-sm">
            <a
              href={`/blog/${post.slug}`}
              onClick={(e) => navigate(e, 'blog-detail', `/blog/${post.slug}`)}
              className="grid grid-cols-1 md:grid-cols-4"
            >
              <div className="md:col-span-1 h-48 md:h-full bg-[#f3f1ee]">
                <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" />
              </div>
              <div className="md:col-span-3 p-6 md:p-8">
                <div className="flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.15em] text-[#37352f]/50 font-semibold mb-4">
                  <span>{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                  <span>•</span>
                  <span>{post.readingTime}</span>
                  <span>•</span>
                  <span>{post.category}</span>
                </div>
                <h2 className="text-2xl font-serif text-[#37352f] mb-2">{post.title}</h2>
                {post.subtitle && <p className="text-[#37352f]/70 mb-3">{post.subtitle}</p>}
                <p className="text-[#37352f]/75 leading-relaxed">{post.excerpt}</p>
              </div>
            </a>
          </article>
        ))}
      </section>
    </div>
  );
};

export default Blog;
