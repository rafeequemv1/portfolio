import React, { useEffect, useState } from 'react';
import { blogPosts as fallbackPosts } from '../data/blog';
import { supabase } from '../supabase/client';
import { BlogPost, View } from '../types';

interface BlogDetailProps {
  path: string;
  navigate: (e: React.MouseEvent<HTMLAnchorElement> | React.MouseEvent<HTMLButtonElement>, view: View, path: string) => void;
}

const BlogDetail: React.FC<BlogDetailProps> = ({ path, navigate }) => {
  const slug = path.split('/').pop();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

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

      setPost({
        id: data.id,
        slug: data.slug,
        title: data.title,
        subtitle: data.subtitle || '',
        date: data.date,
        excerpt: data.excerpt || '',
        content: data.content || '',
        readingTime: data.reading_time || '5 min read',
        tags: data.tags || [],
        category: data.category || 'Engineering',
        imageUrl: data.image_url || '',
        featured: !!data.featured,
        author: {
          name: data.author_name || 'Rafeeque Mavoor',
          avatar: data.author_avatar || '',
          role: data.author_role || 'Scientific Illustrator and Educator',
        },
      });
      setLoading(false);
    };
    fetchPost();
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

  if (loading) {
    return <div className="mx-auto w-full max-w-3xl px-4 py-16 text-[#37352f]/60 sm:px-6 md:px-12 md:py-20">Loading post...</div>;
  }

  if (!post) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-16 text-center sm:px-6 md:px-12 md:py-20">
        <h1 className="text-3xl font-serif mb-4">Post not found</h1>
        <a
          href="/blog"
          onClick={(e) => navigate(e, 'blog', '/blog')}
          className="text-sm uppercase tracking-[0.15em] text-[#37352f]/70 hover:text-[#37352f]"
        >
          Back to blog
        </a>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl animate-fade-in-up px-4 py-10 sm:px-6 md:px-12 md:py-20">
      <a
        href="/blog"
        onClick={(e) => navigate(e, 'blog', '/blog')}
        className="inline-flex items-center gap-2 text-sm text-[#37352f]/60 hover:text-[#37352f] transition-colors font-medium mb-10"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
        All posts
      </a>

      <header className="mb-10">
        <div className="flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.15em] text-[#37352f]/50 font-semibold mb-4">
          <span>{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          <span>•</span>
          <span>{post.readingTime}</span>
          <span>•</span>
          <span>{post.category}</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-serif text-[#37352f] tracking-tight mb-4">{post.title}</h1>
        {post.subtitle && <p className="text-lg text-[#37352f]/70 leading-relaxed">{post.subtitle}</p>}
      </header>

      <img src={post.imageUrl} alt={post.title} className="w-full h-72 md:h-96 object-cover rounded-xl mb-10 border border-[#37352f]/10" />

      <article
        className="prose max-w-none prose-headings:font-serif prose-headings:text-[#37352f] prose-p:text-[#37352f]/80 prose-li:text-[#37352f]/80"
        dangerouslySetInnerHTML={{ __html: post.content || '' }}
      />
    </div>
  );
};

export default BlogDetail;
