import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { Plus, Edit2, Trash2, X, Loader2, Upload } from 'lucide-react';
import { supabase } from '../supabase/client';
import { BlogPost } from '../types';

const toSlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const BlogManager: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    subtitle: '',
    date: new Date().toISOString().slice(0, 10),
    excerpt: '',
    content: '',
    readingTime: '5 min read',
    tags: '',
    category: 'Engineering',
    imageUrl: '',
    featured: false,
    isPublished: true,
  });

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('posts').select('*').order('date', { ascending: false });
    if (error) {
      console.error('Error fetching posts:', error);
      setLoading(false);
      return;
    }

    const mapped: BlogPost[] = (data || []).map((post: any) => ({
      id: post.id,
      slug: post.slug,
      title: post.title,
      subtitle: post.subtitle || '',
      date: post.date || new Date().toISOString().slice(0, 10),
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

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      subtitle: '',
      date: new Date().toISOString().slice(0, 10),
      excerpt: '',
      content: '',
      readingTime: '5 min read',
      tags: '',
      category: 'Engineering',
      imageUrl: '',
      featured: false,
      isPublished: true,
    });
  };

  const openNewModal = () => {
    setEditingPost(null);
    resetForm();
    setIsModalOpen(true);
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      slug: post.slug,
      subtitle: post.subtitle || '',
      date: post.date,
      excerpt: post.excerpt,
      content: post.content || '',
      readingTime: post.readingTime,
      tags: post.tags.join(', '),
      category: post.category,
      imageUrl: post.imageUrl,
      featured: post.featured,
      isPublished: true,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this post?')) return;
    const { error } = await supabase.from('posts').delete().eq('id', id);
    if (error) {
      alert(error.message);
      return;
    }
    fetchPosts();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const ext = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const filePath = `thumbnails/${fileName}`;

    const { error: uploadError } = await supabase.storage.from('blog-assets').upload(filePath, file, { upsert: false });
    if (uploadError) {
      alert(uploadError.message);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from('blog-assets').getPublicUrl(filePath);
    setFormData((prev) => ({ ...prev, imageUrl: data.publicUrl }));
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const payload = {
      title: formData.title,
      slug: formData.slug || toSlug(formData.title),
      subtitle: formData.subtitle || null,
      date: formData.date,
      excerpt: formData.excerpt || null,
      content: formData.content || null,
      reading_time: formData.readingTime || null,
      tags: formData.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      category: formData.category || null,
      image_url: formData.imageUrl || null,
      featured: formData.featured,
      is_published: formData.isPublished,
      author_name: 'Rafeeque Mavoor',
      author_role: 'Scientific Illustrator and Educator',
    };

    if (editingPost) {
      const { error } = await supabase.from('posts').update(payload).eq('id', editingPost.id);
      if (error) {
        alert(error.message);
        setSubmitting(false);
        return;
      }
    } else {
      const { error } = await supabase.from('posts').insert([payload]);
      if (error) {
        alert(error.message);
        setSubmitting(false);
        return;
      }
    }

    setSubmitting(false);
    setIsModalOpen(false);
    setEditingPost(null);
    resetForm();
    fetchPosts();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-serif text-[#37352f]">Blog Posts</h2>
        <button onClick={openNewModal} className="flex items-center gap-2 bg-[#37352f] text-white px-4 py-2 rounded-lg text-sm font-medium">
          <Plus size={18} />
          Add New
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="animate-spin text-[#37352f]/30" size={28} /></div>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <div key={post.id} className="bg-white border border-[#37352f]/10 rounded-xl p-4 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <h3 className="font-serif text-lg text-[#37352f] truncate">{post.title}</h3>
                <p className="text-xs text-[#37352f]/60 mt-1">/{post.slug} • {post.date}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => handleEdit(post)} className="p-2 rounded-full border border-[#37352f]/15 hover:bg-[#37352f]/5"><Edit2 size={16} /></button>
                <button onClick={() => handleDelete(post.id)} className="p-2 rounded-full border border-red-200 text-red-600 hover:bg-red-50"><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
          {posts.length === 0 && <div className="text-center py-12 border border-dashed rounded-xl text-[#37352f]/50">No posts yet.</div>}
        </div>
      )}

      {isModalOpen && typeof document !== 'undefined' && ReactDOM.createPortal(
        <div className="fixed inset-0 z-[200] bg-black/45 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white z-10 p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-xl font-serif text-[#37352f]">{editingPost ? 'Edit Post' : 'Add New Post'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-[#37352f]/40 hover:text-[#37352f]"><X size={22} /></button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#37352f]/60">Title</label>
                  <input type="text" value={formData.title} onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value, slug: p.slug || toSlug(e.target.value) }))} className="w-full px-4 py-2 border border-gray-200 rounded-lg" required />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#37352f]/60">Slug</label>
                  <input type="text" value={formData.slug} onChange={(e) => setFormData((p) => ({ ...p, slug: toSlug(e.target.value) }))} className="w-full px-4 py-2 border border-gray-200 rounded-lg" required />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#37352f]/60">Subtitle</label>
                <input type="text" value={formData.subtitle} onChange={(e) => setFormData((p) => ({ ...p, subtitle: e.target.value }))} className="w-full px-4 py-2 border border-gray-200 rounded-lg" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <input type="date" value={formData.date} onChange={(e) => setFormData((p) => ({ ...p, date: e.target.value }))} className="px-4 py-2 border border-gray-200 rounded-lg" />
                <input type="text" value={formData.readingTime} onChange={(e) => setFormData((p) => ({ ...p, readingTime: e.target.value }))} placeholder="6 min read" className="px-4 py-2 border border-gray-200 rounded-lg" />
                <input type="text" value={formData.category} onChange={(e) => setFormData((p) => ({ ...p, category: e.target.value }))} placeholder="Category" className="px-4 py-2 border border-gray-200 rounded-lg" />
              </div>

              <textarea value={formData.excerpt} onChange={(e) => setFormData((p) => ({ ...p, excerpt: e.target.value }))} rows={3} placeholder="Excerpt" className="w-full px-4 py-2 border border-gray-200 rounded-lg resize-none" />
              <textarea value={formData.content} onChange={(e) => setFormData((p) => ({ ...p, content: e.target.value }))} rows={10} placeholder="HTML content for full post" className="w-full px-4 py-2 border border-gray-200 rounded-lg resize-y" />
              <input type="text" value={formData.tags} onChange={(e) => setFormData((p) => ({ ...p, tags: e.target.value }))} placeholder="Tags (comma separated)" className="w-full px-4 py-2 border border-gray-200 rounded-lg" />

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#37352f]/60">Thumbnail</label>
                <div className="flex items-start gap-4">
                  <label className="flex-1 h-28 border-2 border-dashed border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer flex items-center justify-center">
                    {uploading ? <Loader2 className="animate-spin text-gray-400" /> : <div className="text-xs text-gray-500 inline-flex items-center gap-2"><Upload size={16} /> Upload from local</div>}
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                  </label>
                  {formData.imageUrl && <div className="w-28 h-28 rounded-xl border border-gray-100 bg-gray-50 overflow-hidden"><img src={formData.imageUrl} alt="Thumbnail preview" className="w-full h-full object-cover" /></div>}
                </div>
              </div>

              <div className="flex items-center gap-6 text-sm">
                <label className="inline-flex items-center gap-2"><input type="checkbox" checked={formData.featured} onChange={(e) => setFormData((p) => ({ ...p, featured: e.target.checked }))} /> Featured</label>
                <label className="inline-flex items-center gap-2"><input type="checkbox" checked={formData.isPublished} onChange={(e) => setFormData((p) => ({ ...p, isPublished: e.target.checked }))} /> Published</label>
              </div>

              <div className="pt-2 flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-5 py-3 border border-gray-200 rounded-xl text-sm font-bold uppercase tracking-widest text-[#37352f]/60">Cancel</button>
                <button type="submit" disabled={submitting || uploading} className="flex-1 px-5 py-3 bg-[#37352f] text-white rounded-xl text-sm font-bold uppercase tracking-widest disabled:opacity-60 inline-flex items-center justify-center gap-2">
                  {submitting && <Loader2 size={16} className="animate-spin" />}
                  {editingPost ? 'Update' : 'Save'}
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

export default BlogManager;
