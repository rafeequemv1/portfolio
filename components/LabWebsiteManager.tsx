import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { supabase } from '../supabase/client';
import { LabWebsite } from '../types';
import { Plus, Edit2, Trash2, Upload, X, Loader2, ExternalLink } from 'lucide-react';
const LabWebsiteManager: React.FC = () => {
  const [websites, setWebsites] = useState<LabWebsite[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWebsite, setEditingWebsite] = useState<LabWebsite | null>(null);
  const [formData, setFormData] = useState({
    labName: '',
    piName: '',
    university: '',
    websiteUrl: '',
    imageUrl: '',
    description: '',
    displayOrder: 0,
  });

  useEffect(() => {
    fetchWebsites();
  }, []);

  const fetchWebsites = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('lab_websites')
      .select('*')
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false });
    if (!error) {
      const mapped = (data || []).map((item: any) => ({
        id: item.id,
        labName: item.lab_name,
        piName: item.pi_name,
        university: item.university || '',
        websiteUrl: item.website_url,
        imageUrl: item.image_url || '',
        description: item.description || '',
        display_order: item.display_order || 0,
      }));
      setWebsites(mapped);
    }
    setLoading(false);
  };

  const resetForm = () => {
    setFormData({
      labName: '',
      piName: '',
      university: '',
      websiteUrl: '',
      imageUrl: '',
      description: '',
      displayOrder: 0,
    });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this website entry?')) return;
    const { error } = await supabase.from('lab_websites').delete().eq('id', id);
    if (!error) fetchWebsites();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const ext = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const filePath = `websites/${fileName}`;
    const { error: uploadError } = await supabase.storage.from('portfolio-assets').upload(filePath, file, { upsert: false });
    if (uploadError) {
      setUploading(false);
      alert(uploadError.message);
      return;
    }
    const { data } = supabase.storage.from('portfolio-assets').getPublicUrl(filePath);
    setFormData((prev) => ({ ...prev, imageUrl: data.publicUrl }));
    setUploading(false);
  };

  const openNewModal = () => {
    setEditingWebsite(null);
    resetForm();
    setIsModalOpen(true);
  };

  const handleEdit = (website: LabWebsite) => {
    setEditingWebsite(website);
    setFormData({
      labName: website.labName || '',
      piName: website.piName || '',
      university: website.university || '',
      websiteUrl: website.websiteUrl || '',
      imageUrl: website.imageUrl || '',
      description: website.description || '',
      displayOrder: website.display_order || 0,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const payload = {
      lab_name: formData.labName,
      pi_name: formData.piName,
      university: formData.university || null,
      website_url: formData.websiteUrl,
      image_url: formData.imageUrl || null,
      description: formData.description || null,
      display_order: Number(formData.displayOrder) || 0,
    };
    if (editingWebsite) {
      await supabase.from('lab_websites').update(payload).eq('id', editingWebsite.id);
    } else {
      await supabase.from('lab_websites').insert([payload]);
    }
    setSubmitting(false);
    setIsModalOpen(false);
    setEditingWebsite(null);
    resetForm();
    fetchWebsites();
  };

  return (
    <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-2xl font-serif text-[#37352f]">Lab websites</h2>
            <button onClick={openNewModal} className="flex items-center gap-2 bg-[#37352f] text-white px-4 py-2 rounded-lg text-sm font-medium">
              <Plus size={18} />
              Add New
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-12"><Loader2 className="animate-spin text-[#37352f]/20" size={32} /></div>
          ) : (
            <div className="space-y-3">
              {websites.map((website) => (
                <div key={website.id} className="bg-white border border-[#37352f]/10 rounded-xl p-4 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <h3 className="font-serif text-lg text-[#37352f] truncate">{website.labName}</h3>
                    <a href={website.websiteUrl} target="_blank" rel="noreferrer" className="text-xs text-[#37352f]/60 hover:text-[#37352f] inline-flex items-center gap-1 mt-1">
                      {website.websiteUrl} <ExternalLink size={12} />
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleEdit(website)} className="p-2 rounded-full border border-[#37352f]/15 hover:bg-[#37352f]/5"><Edit2 size={16} /></button>
                    <button onClick={() => handleDelete(website.id)} className="p-2 rounded-full border border-red-200 text-red-600 hover:bg-red-50"><Trash2 size={16} /></button>
                  </div>
                </div>
              ))}
              {websites.length === 0 && <div className="text-center py-10 border border-dashed rounded-xl text-[#37352f]/50">No websites added yet.</div>}
            </div>
          )}

      {isModalOpen && typeof document !== 'undefined' && ReactDOM.createPortal(
        <div className="fixed inset-0 z-[210] bg-black/45 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white z-10 p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-xl font-serif text-[#37352f]">{editingWebsite ? 'Edit Website' : 'Add Website'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-[#37352f]/40 hover:text-[#37352f]"><X size={22} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <input required value={formData.labName} onChange={(e) => setFormData((p) => ({ ...p, labName: e.target.value }))} placeholder="Website / Lab name" className="w-full px-4 py-2 border border-gray-200 rounded-lg" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input required value={formData.piName} onChange={(e) => setFormData((p) => ({ ...p, piName: e.target.value }))} placeholder="Founder / PI" className="w-full px-4 py-2 border border-gray-200 rounded-lg" />
                <input value={formData.university} onChange={(e) => setFormData((p) => ({ ...p, university: e.target.value }))} placeholder="University / Organization" className="w-full px-4 py-2 border border-gray-200 rounded-lg" />
              </div>
              <input required type="url" value={formData.websiteUrl} onChange={(e) => setFormData((p) => ({ ...p, websiteUrl: e.target.value }))} placeholder="https://example.com" className="w-full px-4 py-2 border border-gray-200 rounded-lg" />
              <textarea value={formData.description} onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))} rows={3} placeholder="Description" className="w-full px-4 py-2 border border-gray-200 rounded-lg resize-none" />
              <input type="number" value={formData.displayOrder} onChange={(e) => setFormData((p) => ({ ...p, displayOrder: Number(e.target.value) }))} placeholder="Display order" className="w-full px-4 py-2 border border-gray-200 rounded-lg" />

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#37352f]/60">Thumbnail</label>
                <div className="flex items-start gap-4">
                  <label className="flex-1 h-28 border-2 border-dashed border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer flex items-center justify-center">
                    {uploading ? <Loader2 className="animate-spin text-gray-400" /> : <div className="text-xs text-gray-500 inline-flex items-center gap-2"><Upload size={16} /> Upload local file</div>}
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                  </label>
                  {formData.imageUrl && <div className="w-28 h-28 rounded-xl border border-gray-100 bg-gray-50 overflow-hidden"><img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" /></div>}
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-5 py-3 border border-gray-200 rounded-xl text-sm font-bold uppercase tracking-widest text-[#37352f]/60">Cancel</button>
                <button type="submit" disabled={submitting || uploading} className="flex-1 px-5 py-3 bg-[#37352f] text-white rounded-xl text-sm font-bold uppercase tracking-widest disabled:opacity-60 inline-flex items-center justify-center gap-2">
                  {submitting && <Loader2 size={16} className="animate-spin" />}
                  {editingWebsite ? 'Update' : 'Save'}
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

export default LabWebsiteManager;
