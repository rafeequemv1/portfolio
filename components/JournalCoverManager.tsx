
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { supabase } from '../supabase/client';
import { JournalCover } from '../types';
import { Plus, Trash2, Edit2, ExternalLink, Upload, X, Loader2, ChevronUp, ChevronDown } from 'lucide-react';

function sortCovers(a: JournalCover, b: JournalCover): number {
  const oa = typeof a.display_order === 'number' ? a.display_order : 0;
  const ob = typeof b.display_order === 'number' ? b.display_order : 0;
  if (oa !== ob) return oa - ob;
  return sortKeyMs(b.created_at) - sortKeyMs(a.created_at);
}

function sortKeyMs(d?: string | null): number {
  if (!d) return 0;
  const t = new Date(d).getTime();
  return Number.isNaN(t) ? 0 : t;
}

const JournalCoverManager: React.FC = () => {
  const [covers, setCovers] = useState<JournalCover[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCover, setEditingCover] = useState<JournalCover | null>(null);
  const [uploading, setUploading] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    journal_name: '',
    institute_name: '',
    description: '',
    lab_url: '',
    paper_url: '',
    cover_image_url: '',
    publication_date: new Date().toISOString().split('T')[0],
    lab_name: '',
    pi_name: '',
    display_order: 0,
  });

  useEffect(() => {
    fetchCovers();
  }, []);

  const fetchCovers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('journal_covers')
      .select('*')
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching covers:', error);
    } else {
      setCovers(data || []);
    }
    setLoading(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
    const filePath = `covers/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('journal-covers')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Error uploading image:', uploadError);
      alert(`Error uploading image: ${uploadError.message}`);
    } else {
      const { data: { publicUrl } } = supabase.storage
        .from('journal-covers')
        .getPublicUrl(filePath);
      
      setFormData(prev => ({ ...prev, cover_image_url: publicUrl }));
    }
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...formData,
      display_order: Number(formData.display_order) || 0,
    };

    if (editingCover) {
      const { error } = await supabase
        .from('journal_covers')
        .update(payload)
        .eq('id', editingCover.id);
      
      if (error) console.error('Error updating cover:', error);
    } else {
      const nextOrder =
        covers.length > 0
          ? Math.max(...covers.map((c) => (typeof c.display_order === 'number' ? c.display_order : 0))) + 1
          : 0;
      const { error } = await supabase
        .from('journal_covers')
        .insert([{ ...payload, display_order: nextOrder }]);
      
      if (error) console.error('Error inserting cover:', error);
    }

    setLoading(false);
    setIsModalOpen(false);
    setEditingCover(null);
    resetForm();
    fetchCovers();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      journal_name: '',
      institute_name: '',
      description: '',
      lab_url: '',
      paper_url: '',
      cover_image_url: '',
      publication_date: new Date().toISOString().split('T')[0],
      lab_name: '',
      pi_name: '',
      display_order: 0,
    });
  };

  const reorderCover = async (id: string, direction: 'up' | 'down') => {
    const sorted = [...covers].sort(sortCovers);
    const index = sorted.findIndex((c) => c.id === id);
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    if (index < 0 || swapIndex < 0 || swapIndex >= sorted.length) return;

    [sorted[index], sorted[swapIndex]] = [sorted[swapIndex], sorted[index]];

    setLoading(true);
    const updates = await Promise.all(
      sorted.map((cover, idx) =>
        supabase.from('journal_covers').update({ display_order: idx }).eq('id', cover.id)
      )
    );
    const failed = updates.find((r) => r.error);
    if (failed?.error) {
      console.error('Error reordering covers:', failed.error);
      alert(failed.error.message);
    }
    await fetchCovers();
  };

  const handleEdit = (cover: JournalCover) => {
    setEditingCover(cover);
    setFormData({
      title: cover.title,
      journal_name: cover.journal_name || '',
      institute_name: cover.institute_name || '',
      description: cover.description || '',
      lab_url: cover.lab_url || '',
      paper_url: cover.paper_url || '',
      cover_image_url: cover.cover_image_url || '',
      publication_date: cover.publication_date || new Date().toISOString().split('T')[0],
      lab_name: cover.lab_name || '',
      pi_name: cover.pi_name || '',
      display_order: cover.display_order ?? 0,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this cover?')) return;

    setLoading(true);
    const { error } = await supabase
      .from('journal_covers')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting cover:', error);
    } else {
      fetchCovers();
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl font-serif text-[#37352f]">Journal Covers</h2>
          <p className="mt-1 text-sm text-[#37352f]/55">
            Lower display order appears first on the portfolio covers tab. Use the arrows to reorder.
          </p>
        </div>
        <button
          onClick={() => { resetForm(); setEditingCover(null); setIsModalOpen(true); }}
          className="flex items-center gap-2 bg-[#37352f] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#37352f]/90 transition-colors"
        >
          <Plus size={18} />
          New Cover
        </button>
      </div>

      {loading && !isModalOpen ? (
        <div className="flex justify-center py-12">
          <Loader2 className="animate-spin text-[#37352f]/20" size={32} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...covers].sort(sortCovers).map((cover, index, sorted) => (
            <div key={cover.id} className="group bg-white border border-[#37352f]/10 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
              <div className="aspect-[3/4] relative overflow-hidden bg-gray-100">
                <img 
                  src={cover.cover_image_url} 
                  alt={cover.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-4">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#37352f]/45">
                    Order {index + 1}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={index === 0 || loading}
                      onClick={() => reorderCover(cover.id, 'up')}
                      className="rounded-md border border-[#37352f]/15 p-1.5 text-[#37352f]/70 hover:bg-[#37352f]/5 disabled:opacity-30"
                      aria-label="Move cover earlier"
                    >
                      <ChevronUp size={14} />
                    </button>
                    <button
                      type="button"
                      disabled={index === sorted.length - 1 || loading}
                      onClick={() => reorderCover(cover.id, 'down')}
                      className="rounded-md border border-[#37352f]/15 p-1.5 text-[#37352f]/70 hover:bg-[#37352f]/5 disabled:opacity-30"
                      aria-label="Move cover later"
                    >
                      <ChevronDown size={14} />
                    </button>
                  </div>
                </div>
                <h3 className="font-serif text-lg text-[#37352f] mb-1 line-clamp-1">{cover.title}</h3>
                <p className="text-xs text-[#37352f]/60 mb-3 line-clamp-2">{cover.description}</p>
                <div className="flex gap-3">
                  {cover.paper_url && (
                    <a href={cover.paper_url} target="_blank" rel="noopener noreferrer" className="text-[10px] uppercase tracking-wider font-bold text-[#37352f]/40 hover:text-[#37352f] flex items-center gap-1">
                      Paper <ExternalLink size={10} />
                    </a>
                  )}
                  {cover.lab_url && (
                    <a href={cover.lab_url} target="_blank" rel="noopener noreferrer" className="text-[10px] uppercase tracking-wider font-bold text-[#37352f]/40 hover:text-[#37352f] flex items-center gap-1">
                      Lab <ExternalLink size={10} />
                    </a>
                  )}
                </div>
                <div className="mt-4 pt-3 border-t border-[#37352f]/10 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleEdit(cover)}
                    className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-md bg-[#37352f]/5 text-[#37352f] hover:bg-[#37352f]/10 transition-colors"
                  >
                    <Edit2 size={12} />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(cover.id)}
                    className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-md bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                  >
                    <Trash2 size={12} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && typeof document !== 'undefined' && ReactDOM.createPortal(
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-fade-in-up">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
              <h3 className="text-xl font-serif text-[#37352f]">
                {editingCover ? 'Edit Journal Cover' : 'Add New Journal Cover'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#37352f]/60">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#37352f]/10 focus:border-[#37352f] outline-none transition-all"
                    placeholder="e.g. Nature Nanotechnology Cover"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#37352f]/60">Journal Name</label>
                  <input
                    type="text"
                    name="journal_name"
                    value={formData.journal_name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#37352f]/10 focus:border-[#37352f] outline-none transition-all"
                    placeholder="e.g. Nature"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#37352f]/60">Institute Name</label>
                  <input
                    type="text"
                    name="institute_name"
                    value={formData.institute_name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#37352f]/10 focus:border-[#37352f] outline-none transition-all"
                    placeholder="e.g. University of Illinois Chicago"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#37352f]/60">Short Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#37352f]/10 focus:border-[#37352f] outline-none transition-all resize-none"
                  placeholder="Describe the scientific concept illustrated..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#37352f]/60">Lab Website Link</label>
                  <input
                    type="url"
                    name="lab_url"
                    value={formData.lab_url}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#37352f]/10 focus:border-[#37352f] outline-none transition-all"
                    placeholder="https://lab-website.com"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#37352f]/60">Link to Paper</label>
                  <input
                    type="url"
                    name="paper_url"
                    value={formData.paper_url}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#37352f]/10 focus:border-[#37352f] outline-none transition-all"
                    placeholder="https://doi.org/..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#37352f]/60">Lab Name</label>
                  <input
                    type="text"
                    name="lab_name"
                    value={formData.lab_name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#37352f]/10 focus:border-[#37352f] outline-none transition-all"
                    placeholder="e.g. Prof. Sushant Anand Lab"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#37352f]/60">PI Name</label>
                  <input
                    type="text"
                    name="pi_name"
                    value={formData.pi_name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#37352f]/10 focus:border-[#37352f] outline-none transition-all"
                    placeholder="e.g. Prof. Jyoti Seth"
                  />
                </div>
              </div>

              <div className="space-y-2 md:max-w-xs">
                <label className="text-xs font-bold uppercase tracking-wider text-[#37352f]/60">Display order</label>
                <input
                  type="number"
                  name="display_order"
                  value={formData.display_order}
                  onChange={handleInputChange}
                  min={0}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#37352f]/10 focus:border-[#37352f] outline-none transition-all"
                  placeholder="0 = first on portfolio"
                />
                <p className="text-[11px] text-[#37352f]/45">Lower numbers appear first. Reorder arrows on each card update all positions.</p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#37352f]/60">Cover Image</label>
                <div className="flex items-start gap-4">
                  <div className="flex-grow">
                    <label className="relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer transition-all">
                      {uploading ? (
                        <Loader2 className="animate-spin text-gray-400" />
                      ) : formData.cover_image_url ? (
                        <div className="flex flex-col items-center">
                          <span className="text-xs text-green-600 font-medium">Image Uploaded</span>
                          <span className="text-[10px] text-gray-400 mt-1">Click to change</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <Upload className="text-gray-400 mb-2" size={24} />
                          <span className="text-xs text-gray-500">Upload high-res cover</span>
                        </div>
                      )}
                      <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                    </label>
                  </div>
                  {formData.cover_image_url && (
                    <div className="w-32 h-32 rounded-xl overflow-hidden border border-gray-100">
                      <img src={formData.cover_image_url} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-6 py-3 border border-gray-200 rounded-xl text-sm font-bold uppercase tracking-widest text-gray-500 hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || uploading || !formData.cover_image_url}
                  className="flex-1 px-6 py-3 bg-[#37352f] text-white rounded-xl text-sm font-bold uppercase tracking-widest hover:bg-[#37352f]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                >
                  {loading && <Loader2 className="animate-spin" size={16} />}
                  {editingCover ? 'Update Cover' : 'Save Cover'}
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

export default JournalCoverManager;
