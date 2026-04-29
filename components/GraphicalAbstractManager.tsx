import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { supabase } from '../supabase/client';
import { GraphicalAbstract } from '../types';
import { Plus, Edit2, Trash2, Upload, X, Loader2 } from 'lucide-react';

const GraphicalAbstractManager: React.FC = () => {
  const [items, setItems] = useState<GraphicalAbstract[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GraphicalAbstract | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    journal_name: '',
    institute_name: '',
    publication_date: '',
    abstract_image_url: '',
    paper_url: '',
    lab_name: '',
    lab_url: '',
    pi_name: '',
    description: '',
    display_order: 0,
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('portfolio_graphical_abstracts')
      .select('*')
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false });
    if (error) console.error('Error fetching graphical abstracts:', error);
    else setItems((data as GraphicalAbstract[]) || []);
    setLoading(false);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      journal_name: '',
      institute_name: '',
      publication_date: '',
      abstract_image_url: '',
      paper_url: '',
      lab_name: '',
      lab_url: '',
      pi_name: '',
      description: '',
      display_order: 0,
    });
  };

  const openNewModal = () => {
    setEditingItem(null);
    resetForm();
    setIsModalOpen(true);
  };

  const handleEdit = (item: GraphicalAbstract) => {
    setEditingItem(item);
    setFormData({
      title: item.title || '',
      journal_name: item.journal_name || '',
      institute_name: item.institute_name || '',
      publication_date: item.publication_date || '',
      abstract_image_url: item.abstract_image_url || '',
      paper_url: item.paper_url || '',
      lab_name: item.lab_name || '',
      lab_url: item.lab_url || '',
      pi_name: item.pi_name || '',
      description: item.description || '',
      display_order: item.display_order ?? 0,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this graphical abstract?')) return;
    const { error } = await supabase.from('portfolio_graphical_abstracts').delete().eq('id', id);
    if (error) {
      console.error('Error deleting graphical abstract:', error);
      return;
    }
    fetchItems();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const ext = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const filePath = `abstracts/${fileName}`;
    const { error: uploadError } = await supabase.storage
      .from('graphical-abstracts')
      .upload(filePath, file, { upsert: false });
    if (uploadError) {
      console.error('Error uploading graphical abstract:', uploadError);
      alert(`Error uploading image: ${uploadError.message}`);
      setUploading(false);
      return;
    }
    const { data } = supabase.storage.from('graphical-abstracts').getPublicUrl(filePath);
    setFormData((prev) => ({ ...prev, abstract_image_url: data.publicUrl }));
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const payload = {
      ...formData,
      publication_date: formData.publication_date || null,
      paper_url: formData.paper_url || null,
      lab_url: formData.lab_url || null,
      description: formData.description || null,
    };
    if (editingItem) {
      const { error } = await supabase.from('portfolio_graphical_abstracts').update(payload).eq('id', editingItem.id);
      if (error) {
        console.error('Error updating graphical abstract:', error);
        setSubmitting(false);
        return;
      }
    } else {
      const { error } = await supabase.from('portfolio_graphical_abstracts').insert([payload]);
      if (error) {
        console.error('Error creating graphical abstract:', error);
        setSubmitting(false);
        return;
      }
    }
    setSubmitting(false);
    setIsModalOpen(false);
    setEditingItem(null);
    resetForm();
    fetchItems();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-serif text-[#37352f]">Graphical Abstracts</h2>
        <button onClick={openNewModal} className="flex items-center gap-2 bg-[#37352f] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#37352f]/90 transition-colors">
          <Plus size={18} />
          Add New
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="animate-spin text-[#37352f]/20" size={32} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <div key={item.id} className="bg-white border border-[#37352f]/10 rounded-xl p-3">
              <div className="aspect-[4/3] rounded-lg overflow-hidden bg-gray-100">
                <img src={item.abstract_image_url} alt={item.title} className="w-full h-full object-cover" />
              </div>
              <h3 className="font-serif text-lg mt-3 text-[#37352f] line-clamp-1">{item.title}</h3>
              <p className="text-xs text-[#37352f]/55 line-clamp-1">{item.institute_name || item.journal_name || 'No institute'}</p>
              <div className="mt-3 flex items-center gap-2">
                <button onClick={() => handleEdit(item)} className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-md bg-[#37352f]/5 text-[#37352f] hover:bg-[#37352f]/10">
                  <Edit2 size={12} /> Edit
                </button>
                <button onClick={() => handleDelete(item.id)} className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-md bg-red-50 text-red-600 hover:bg-red-100">
                  <Trash2 size={12} /> Delete
                </button>
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <div className="col-span-full text-center py-10 border border-dashed border-[#37352f]/15 rounded-xl text-[#37352f]/50">
              No graphical abstracts yet.
            </div>
          )}
        </div>
      )}

      {isModalOpen && typeof document !== 'undefined' && ReactDOM.createPortal(
        <div className="fixed inset-0 z-[215] bg-black/45 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white z-10 p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-xl font-serif text-[#37352f]">{editingItem ? 'Edit Graphical Abstract' : 'Add Graphical Abstract'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-[#37352f]/45 hover:text-[#37352f]"><X size={22} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#37352f]/60">Title</label>
                  <input required value={formData.title} onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))} className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#37352f]/60">Publication Date</label>
                  <input type="date" value={formData.publication_date} onChange={(e) => setFormData((p) => ({ ...p, publication_date: e.target.value }))} className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#37352f]/60">Journal Name</label>
                  <input value={formData.journal_name} onChange={(e) => setFormData((p) => ({ ...p, journal_name: e.target.value }))} className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#37352f]/60">Institute Name</label>
                  <input value={formData.institute_name} onChange={(e) => setFormData((p) => ({ ...p, institute_name: e.target.value }))} className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#37352f]/60">Lab Name</label>
                  <input value={formData.lab_name} onChange={(e) => setFormData((p) => ({ ...p, lab_name: e.target.value }))} className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#37352f]/60">PI Name</label>
                  <input value={formData.pi_name} onChange={(e) => setFormData((p) => ({ ...p, pi_name: e.target.value }))} className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#37352f]/60">Paper URL</label>
                  <input type="url" value={formData.paper_url} onChange={(e) => setFormData((p) => ({ ...p, paper_url: e.target.value }))} className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#37352f]/60">Lab URL</label>
                  <input type="url" value={formData.lab_url} onChange={(e) => setFormData((p) => ({ ...p, lab_url: e.target.value }))} className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#37352f]/60">Description</label>
                <textarea rows={3} value={formData.description} onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))} className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none resize-none" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#37352f]/60">Display Order</label>
                  <input type="number" value={formData.display_order} onChange={(e) => setFormData((p) => ({ ...p, display_order: Number(e.target.value || 0) }))} className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#37352f]/60">Abstract Image</label>
                  <label className="w-full h-11 border border-dashed border-gray-300 rounded-lg flex items-center justify-center text-xs text-[#37352f]/60 cursor-pointer hover:bg-gray-50">
                    {uploading ? <Loader2 size={16} className="animate-spin" /> : <span className="inline-flex items-center gap-2"><Upload size={14} /> Upload local image</span>}
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                  </label>
                </div>
              </div>

              {formData.abstract_image_url && (
                <div className="w-full h-44 rounded-lg overflow-hidden border border-gray-100">
                  <img src={formData.abstract_image_url} alt="Graphical abstract preview" className="w-full h-full object-cover" />
                </div>
              )}

              <div className="pt-2 flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-5 py-3 border border-gray-200 rounded-xl text-sm font-bold uppercase tracking-widest text-[#37352f]/60 hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={submitting || uploading || !formData.abstract_image_url} className="flex-1 px-5 py-3 bg-[#37352f] text-white rounded-xl text-sm font-bold uppercase tracking-widest hover:bg-[#37352f]/90 disabled:opacity-60 inline-flex items-center justify-center gap-2">
                  {submitting && <Loader2 size={16} className="animate-spin" />}
                  {editingItem ? 'Update' : 'Save'}
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

export default GraphicalAbstractManager;
