import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase/client';
import { Brand } from '../types';
import { Plus, Edit2, Trash2, Upload, X, Loader2, ExternalLink } from 'lucide-react';

const BrandManager: React.FC = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    logo_url: '',
    website_url: '',
  });

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('brands')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      console.error('Error fetching brands:', error);
    } else {
      setBrands((data as Brand[]) || []);
    }
    setLoading(false);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      logo_url: '',
      website_url: '',
    });
  };

  const openNewModal = () => {
    setEditingBrand(null);
    resetForm();
    setIsModalOpen(true);
  };

  const handleEdit = (brand: Brand) => {
    setEditingBrand(brand);
    setFormData({
      name: brand.name || '',
      logo_url: brand.logo_url || '',
      website_url: brand.website_url || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this brand?')) return;
    const { error } = await supabase.from('brands').delete().eq('id', id);
    if (error) {
      console.error('Error deleting brand:', error);
      return;
    }
    fetchBrands();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const ext = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const filePath = `logos/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('brand-logos')
      .upload(filePath, file, { upsert: false });

    if (uploadError) {
      console.error('Error uploading logo:', uploadError);
      alert('Logo upload failed. Please try again.');
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from('brand-logos').getPublicUrl(filePath);
    setFormData((prev) => ({ ...prev, logo_url: data.publicUrl }));
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const payload = {
      name: formData.name?.trim() || 'Brand Logo',
      logo_url: formData.logo_url,
      website_url: formData.website_url || null,
    };

    if (editingBrand) {
      const { error } = await supabase.from('brands').update(payload).eq('id', editingBrand.id);
      if (error) {
        console.error('Error updating brand:', error);
        setSubmitting(false);
        return;
      }
    } else {
      const { error } = await supabase.from('brands').insert([payload]);
      if (error) {
        console.error('Error creating brand:', error);
        setSubmitting(false);
        return;
      }
    }

    setSubmitting(false);
    setIsModalOpen(false);
    setEditingBrand(null);
    resetForm();
    fetchBrands();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-serif text-[#37352f]">Brands</h2>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {brands.map((brand) => (
            <div key={brand.id} className="bg-white border border-[#37352f]/10 rounded-xl p-4">
              <div className="h-20 bg-gray-50 rounded-lg border border-gray-100 flex items-center justify-center overflow-hidden mb-3">
                <img src={brand.logo_url} alt={brand.name} className="max-h-14 object-contain" />
              </div>
              <h3 className="font-medium text-[#37352f]">{brand.name}</h3>
              <div className="mt-3 flex items-center justify-between">
                {brand.website_url ? (
                  <a href={brand.website_url} target="_blank" rel="noreferrer" className="text-xs text-[#37352f]/60 hover:text-[#37352f] inline-flex items-center gap-1">
                    Visit <ExternalLink size={12} />
                  </a>
                ) : (
                  <span className="text-xs text-[#37352f]/35">No website</span>
                )}
                <div className="flex items-center gap-2">
                  <button onClick={() => handleEdit(brand)} className="p-2 rounded-full border border-[#37352f]/15 hover:bg-[#37352f]/5">
                    <Edit2 size={14} />
                  </button>
                  <button onClick={() => handleDelete(brand.id)} className="p-2 rounded-full border border-red-200 text-red-600 hover:bg-red-50">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {brands.length === 0 && (
            <div className="col-span-full text-center py-12 border border-dashed border-[#37352f]/15 rounded-xl text-[#37352f]/50">
              No brands added yet.
            </div>
          )}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-[110] bg-black/45 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white z-10 p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-xl font-serif text-[#37352f]">{editingBrand ? 'Edit Brand' : 'Add New Brand'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-[#37352f]/45 hover:text-[#37352f]">
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#37352f]/60">Brand Name (optional)</label>
                <input name="name" value={formData.name} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#37352f]/10 focus:border-[#37352f] outline-none" placeholder="Optional" />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#37352f]/60">Logo</label>
                <div className="flex items-start gap-4">
                  <label className="flex-1 h-28 border-2 border-dashed border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer flex items-center justify-center">
                    {uploading ? <Loader2 className="animate-spin text-gray-400" /> : <div className="text-xs text-gray-500 inline-flex items-center gap-2"><Upload size={16} /> Upload local file</div>}
                    <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} disabled={uploading} />
                  </label>
                  {formData.logo_url && (
                    <div className="w-28 h-28 rounded-xl border border-gray-100 bg-gray-50 flex items-center justify-center overflow-hidden">
                      <img src={formData.logo_url} alt="Logo preview" className="max-h-20 object-contain" />
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#37352f]/60">Website URL (optional)</label>
                <input type="url" name="website_url" value={formData.website_url} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#37352f]/10 focus:border-[#37352f] outline-none" />
              </div>

              <div className="pt-2 flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-5 py-3 border border-gray-200 rounded-xl text-sm font-bold uppercase tracking-widest text-[#37352f]/60 hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" disabled={submitting || uploading || !formData.logo_url} className="flex-1 px-5 py-3 bg-[#37352f] text-white rounded-xl text-sm font-bold uppercase tracking-widest hover:bg-[#37352f]/90 disabled:opacity-60 inline-flex items-center justify-center gap-2">
                  {submitting && <Loader2 size={16} className="animate-spin" />}
                  {editingBrand ? 'Update' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrandManager;
