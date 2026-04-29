import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase/client';
import { PortfolioVideo } from '../types';
import { Plus, Edit2, Trash2, X, Loader2 } from 'lucide-react';

const getYoutubeEmbedUrl = (url: string): string => {
  try {
    const parsed = new URL(url.trim());
    if (parsed.hostname.includes('youtu.be')) {
      const id = parsed.pathname.replace('/', '');
      return `https://www.youtube.com/embed/${id}`;
    }
    const id = parsed.searchParams.get('v');
    if (id) return `https://www.youtube.com/embed/${id}`;
    const parts = parsed.pathname.split('/');
    const embedId = parts[parts.length - 1];
    return `https://www.youtube.com/embed/${embedId}`;
  } catch {
    return '';
  }
};

const PortfolioVideoManager: React.FC = () => {
  const [videos, setVideos] = useState<PortfolioVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<PortfolioVideo | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    youtube_url: '',
    description: '',
    display_order: 0,
  });

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('portfolio_videos')
      .select('*')
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false });
    if (error) console.error('Error fetching videos:', error);
    else setVideos((data as PortfolioVideo[]) || []);
    setLoading(false);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      youtube_url: '',
      description: '',
      display_order: 0,
    });
  };

  const openNewModal = () => {
    setEditingVideo(null);
    resetForm();
    setIsModalOpen(true);
  };

  const handleEdit = (video: PortfolioVideo) => {
    setEditingVideo(video);
    setFormData({
      title: video.title || '',
      youtube_url: video.youtube_url || '',
      description: video.description || '',
      display_order: video.display_order ?? 0,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this video?')) return;
    const { error } = await supabase.from('portfolio_videos').delete().eq('id', id);
    if (error) {
      console.error('Error deleting video:', error);
      return;
    }
    fetchVideos();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!getYoutubeEmbedUrl(formData.youtube_url)) {
      alert('Please enter a valid YouTube URL.');
      return;
    }
    setSubmitting(true);
    const payload = {
      title: formData.title,
      youtube_url: formData.youtube_url,
      description: formData.description || null,
      display_order: Number(formData.display_order || 0),
    };

    if (editingVideo) {
      const { error } = await supabase.from('portfolio_videos').update(payload).eq('id', editingVideo.id);
      if (error) {
        console.error('Error updating video:', error);
        setSubmitting(false);
        return;
      }
    } else {
      const { error } = await supabase.from('portfolio_videos').insert([payload]);
      if (error) {
        console.error('Error creating video:', error);
        setSubmitting(false);
        return;
      }
    }

    setSubmitting(false);
    setIsModalOpen(false);
    setEditingVideo(null);
    resetForm();
    fetchVideos();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-serif text-[#37352f]">Portfolio Videos</h2>
        <button
          onClick={openNewModal}
          className="flex items-center gap-2 bg-[#37352f] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#37352f]/90 transition-colors"
        >
          <Plus size={18} />
          Add Video
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="animate-spin text-[#37352f]/20" size={32} />
        </div>
      ) : (
        <div className="space-y-3">
          {videos.map((video) => (
            <div key={video.id} className="bg-white border border-[#37352f]/10 rounded-xl p-4 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <h3 className="font-serif text-lg text-[#37352f] truncate">{video.title}</h3>
                <p className="text-xs text-[#37352f]/55 truncate">{video.youtube_url}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => handleEdit(video)} className="p-2 rounded-full border border-[#37352f]/15 hover:bg-[#37352f]/5">
                  <Edit2 size={15} />
                </button>
                <button onClick={() => handleDelete(video.id)} className="p-2 rounded-full border border-red-200 text-red-600 hover:bg-red-50">
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
          {videos.length === 0 && (
            <div className="text-center py-10 border border-dashed border-[#37352f]/15 rounded-xl text-[#37352f]/50">
              No videos added yet.
            </div>
          )}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-[210] bg-black/45 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white z-10 p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-xl font-serif text-[#37352f]">{editingVideo ? 'Edit Video' : 'Add Portfolio Video'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-[#37352f]/45 hover:text-[#37352f]">
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#37352f]/60">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                  required
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#37352f]/10 focus:border-[#37352f] outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#37352f]/60">YouTube Link</label>
                <input
                  type="url"
                  value={formData.youtube_url}
                  onChange={(e) => setFormData((prev) => ({ ...prev, youtube_url: e.target.value }))}
                  required
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#37352f]/10 focus:border-[#37352f] outline-none"
                  placeholder="https://www.youtube.com/watch?v=..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#37352f]/60">Description (optional)</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#37352f]/10 focus:border-[#37352f] outline-none resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#37352f]/60">Display Order</label>
                <input
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData((prev) => ({ ...prev, display_order: Number(e.target.value || 0) }))}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#37352f]/10 focus:border-[#37352f] outline-none"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-5 py-3 border border-gray-200 rounded-xl text-sm font-bold uppercase tracking-widest text-[#37352f]/60 hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="flex-1 px-5 py-3 bg-[#37352f] text-white rounded-xl text-sm font-bold uppercase tracking-widest hover:bg-[#37352f]/90 disabled:opacity-60 inline-flex items-center justify-center gap-2">
                  {submitting && <Loader2 size={16} className="animate-spin" />}
                  {editingVideo ? 'Update' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioVideoManager;
