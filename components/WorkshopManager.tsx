import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { supabase } from '../supabase/client';
import { Workshop } from '../types';
import { Plus, Edit2, Trash2, X, Loader2, Upload } from 'lucide-react';
type WorkshopStatus = 'Upcoming' | 'Past' | 'Sold Out';

const WorkshopManager: React.FC = () => {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWorkshop, setEditingWorkshop] = useState<Workshop | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    location: '',
    description: '',
    status: 'Upcoming' as WorkshopStatus,
    imageUrls: [] as string[],
  });

  useEffect(() => {
    fetchWorkshops();
  }, []);

  const fetchWorkshops = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('workshops')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching workshops:', error);
    } else {
      const rows = (data || []).map((w: any) => ({
        ...w,
        gallery_images: Array.isArray(w.image_urls)
          ? w.image_urls.filter((u: unknown) => typeof u === 'string' && (u as string).trim())
          : w.gallery_images || [],
        cover_image: w.image_urls?.[0] || w.cover_image,
      })) as Workshop[];
      setWorkshops(rows);
    }
    setLoading(false);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      date: '',
      location: '',
      description: '',
      status: 'Upcoming',
      imageUrls: [],
    });
  };

  const openNewModal = () => {
    setEditingWorkshop(null);
    resetForm();
    setIsModalOpen(true);
  };

  const handleEdit = (workshop: Workshop) => {
    setEditingWorkshop(workshop);
    const urls = workshop.gallery_images?.filter((u) => typeof u === 'string' && u.trim()) || [];
    const imageUrls = urls.length ? urls : workshop.cover_image?.trim() ? [workshop.cover_image.trim()] : [];
    setFormData({
      title: workshop.title || '',
      date: workshop.date || '',
      location: workshop.location || '',
      description: workshop.description || '',
      status: (workshop.status as WorkshopStatus) || 'Upcoming',
      imageUrls,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this workshop?')) return;
    const { error } = await supabase.from('workshops').delete().eq('id', id);
    if (error) {
      console.error('Error deleting workshop:', error);
      return;
    }
    fetchWorkshops();
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const uploadWorkshopFile = async (file: File): Promise<string | null> => {
    const ext = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const filePath = `covers/${fileName}`;
    const { error: uploadError } = await supabase.storage.from('workshop-gallery').upload(filePath, file, { upsert: false });
    if (uploadError) {
      console.error('Error uploading workshop image:', uploadError);
      alert(`Error uploading: ${uploadError.message}`);
      return null;
    }
    const { data } = supabase.storage.from('workshop-gallery').getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handleImagesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    setUploading(true);
    const next: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file || !file.type.startsWith('image/')) continue;
      const url = await uploadWorkshopFile(file);
      if (url) next.push(url);
    }
    setUploading(false);
    e.target.value = '';
    if (next.length) {
      setFormData((prev) => ({ ...prev, imageUrls: [...prev.imageUrls, ...next] }));
    }
  };

  const removeImageAt = (index: number) => {
    setFormData((prev) => ({ ...prev, imageUrls: prev.imageUrls.filter((_, i) => i !== index) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      title: formData.title,
      date: formData.date || 'TBD',
      location: formData.location || null,
      description: formData.description || null,
      status: formData.status,
      image_urls: formData.imageUrls.length > 0 ? formData.imageUrls : null,
    };

    if (editingWorkshop) {
      const { error } = await supabase
        .from('workshops')
        .update(payload)
        .eq('id', editingWorkshop.id);
      if (error) {
        console.error('Error updating workshop:', error);
        alert(`Error updating workshop: ${error.message}`);
        setSubmitting(false);
        return;
      }
    } else {
      const { error } = await supabase.from('workshops').insert([payload]);
      if (error) {
        console.error('Error creating workshop:', error);
        alert(`Error creating workshop: ${error.message}`);
        setSubmitting(false);
        return;
      }
    }

    setSubmitting(false);
    setIsModalOpen(false);
    setEditingWorkshop(null);
    resetForm();
    fetchWorkshops();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
            <h2 className="text-2xl font-serif text-[#37352f]">Workshop events</h2>
            <button
              onClick={openNewModal}
              className="flex items-center gap-2 bg-[#37352f] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#37352f]/90 transition-colors"
            >
              <Plus size={18} />
              Add New
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="animate-spin text-[#37352f]/20" size={32} />
            </div>
          ) : (
            <div className="space-y-3">
              {workshops.map((workshop) => (
                <div
                  key={workshop.id}
                  className="bg-white border border-[#37352f]/10 rounded-xl p-4 flex items-center justify-between gap-4"
                >
                  <div className="min-w-0">
                    <h3 className="font-serif text-lg text-[#37352f] truncate">{workshop.title}</h3>
                    <p className="text-xs text-[#37352f]/60 mt-1">
                      {workshop.location || 'No location'} • {workshop.date || 'TBD'} • {workshop.status || 'Upcoming'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(workshop)}
                      className="p-2 rounded-full border border-[#37352f]/15 hover:bg-[#37352f]/5"
                      aria-label="Edit workshop"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(workshop.id)}
                      className="p-2 rounded-full border border-red-200 text-red-600 hover:bg-red-50"
                      aria-label="Delete workshop"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}

              {workshops.length === 0 && (
                <div className="text-center py-12 border border-dashed border-[#37352f]/15 rounded-xl text-[#37352f]/50">
                  No workshops yet. Add your first one.
                </div>
              )}
            </div>
          )}

      {isModalOpen && typeof document !== 'undefined' && ReactDOM.createPortal(
        <div className="fixed inset-0 z-[200] bg-black/45 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white z-10 p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-xl font-serif text-[#37352f]">
                {editingWorkshop ? 'Edit Workshop' : 'Add New Workshop'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[#37352f]/40 hover:text-[#37352f]"
                aria-label="Close"
              >
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#37352f]/60">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#37352f]/10 focus:border-[#37352f] outline-none"
                  placeholder="Scientific Illustration Workshop"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#37352f]/60">Date</label>
                  <input
                    type="text"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    placeholder="TBD or 2026-05-10"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#37352f]/10 focus:border-[#37352f] outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#37352f]/60">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#37352f]/10 focus:border-[#37352f] outline-none bg-white"
                  >
                    <option value="Upcoming">Upcoming</option>
                    <option value="Past">Past</option>
                    <option value="Sold Out">Sold Out</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#37352f]/60">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#37352f]/10 focus:border-[#37352f] outline-none"
                  placeholder="JNCASR"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#37352f]/60">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#37352f]/10 focus:border-[#37352f] outline-none resize-none"
                  placeholder="Details can be added later..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#37352f]/60">Images (multiple)</label>
                <p className="text-xs text-[#37352f]/45">First image is used as the primary thumbnail on cards. You can add several for the gallery.</p>
                <label className="flex min-h-[7rem] cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 hover:bg-gray-50">
                  {uploading ? (
                    <Loader2 className="animate-spin text-gray-400" />
                  ) : (
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Upload size={16} />
                      Upload one or more images
                    </div>
                  )}
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    multiple
                    onChange={handleImagesUpload}
                    disabled={uploading}
                  />
                </label>
                {formData.imageUrls.length > 0 && (
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {formData.imageUrls.map((url, idx) => (
                      <li key={`${url}-${idx}`} className="relative h-24 w-24 overflow-hidden rounded-lg border border-gray-100 bg-gray-50">
                        <img src={url} alt="" className="h-full w-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeImageAt(idx)}
                          className="absolute right-1 top-1 rounded-full bg-black/55 p-1 text-white hover:bg-black/75"
                          aria-label={`Remove image ${idx + 1}`}
                        >
                          <X size={14} />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-5 py-3 border border-gray-200 rounded-xl text-sm font-bold uppercase tracking-widest text-[#37352f]/60 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || uploading}
                  className="flex-1 px-5 py-3 bg-[#37352f] text-white rounded-xl text-sm font-bold uppercase tracking-widest hover:bg-[#37352f]/90 disabled:opacity-60 inline-flex items-center justify-center gap-2"
                >
                  {submitting && <Loader2 size={16} className="animate-spin" />}
                  {editingWorkshop ? 'Update' : 'Save'}
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

export default WorkshopManager;
