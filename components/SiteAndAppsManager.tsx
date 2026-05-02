import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { Edit2, Loader2, Upload, X } from 'lucide-react';
import { supabase } from '../supabase/client';
import { APP_PROJECTS } from '../data/appProjects';

const ABOUT_PROFILE_KEY = 'about_profile_image_url';

const SiteAndAppsManager: React.FC = () => {
  const [profileUrl, setProfileUrl] = useState('');
  const [uploadingProfile, setUploadingProfile] = useState(false);
  const [detailsByKey, setDetailsByKey] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [modalKey, setModalKey] = useState<string | null>(null);
  const [modalContent, setModalContent] = useState('');
  const [savingDetail, setSavingDetail] = useState(false);

  const load = async () => {
    setLoading(true);
    const [{ data: settings }, { data: rows }] = await Promise.all([
      supabase.from('site_settings').select('key, value').eq('key', ABOUT_PROFILE_KEY).maybeSingle(),
      supabase.from('portfolio_app_details').select('app_key, detail_content'),
    ]);
    if (settings?.value) setProfileUrl(settings.value);
    const m: Record<string, string> = {};
    for (const row of rows || []) {
      m[(row as { app_key: string }).app_key] = (row as { detail_content: string | null }).detail_content || '';
    }
    setDetailsByKey(m);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleProfileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingProfile(true);
    const ext = file.name.split('.').pop() || 'png';
    const fileName = `site/profile-${Date.now()}.${ext}`;
    const { error: uploadError } = await supabase.storage.from('blog-assets').upload(fileName, file, { upsert: true });
    if (uploadError) {
      alert(uploadError.message);
      setUploadingProfile(false);
      return;
    }
    const { data } = supabase.storage.from('blog-assets').getPublicUrl(fileName);
    const url = data.publicUrl;
    setProfileUrl(url);
    setSavingProfile(true);
    const { error } = await supabase.from('site_settings').upsert(
      { key: ABOUT_PROFILE_KEY, value: url, updated_at: new Date().toISOString() },
      { onConflict: 'key' }
    );
    setSavingProfile(false);
    setUploadingProfile(false);
    if (error) alert(error.message);
  };

  const openEdit = (appKey: string) => {
    setModalKey(appKey);
    setModalContent(detailsByKey[appKey] || '');
  };

  const saveDetail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalKey) return;
    setSavingDetail(true);
    const { error } = await supabase.from('portfolio_app_details').upsert(
      { app_key: modalKey, detail_content: modalContent, updated_at: new Date().toISOString() },
      { onConflict: 'app_key' }
    );
    setSavingDetail(false);
    if (error) {
      alert(error.message);
      return;
    }
    setDetailsByKey((prev) => ({ ...prev, [modalKey]: modalContent }));
    setModalKey(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="animate-spin text-[#37352f]/30" size={28} />
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <section className="bg-white border border-[#37352f]/10 rounded-xl p-6">
        <h2 className="text-xl font-serif text-[#37352f] mb-2">About page profile photo</h2>
        <p className="text-sm text-[#37352f]/60 mb-6">Stored in Supabase (Storage + URL in site_settings).</p>
        <div className="flex flex-wrap items-start gap-6">
          <div className="w-28 h-28 rounded-full border-4 border-white shadow-md overflow-hidden bg-[#e0e0e0]">
            {profileUrl ? (
              <img src={profileUrl} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[10px] text-[#37352f]/40 text-center px-1">No URL set</div>
            )}
          </div>
          <div>
            <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#37352f]/15 hover:bg-[#37352f]/5 cursor-pointer text-sm font-medium text-[#37352f]">
              {uploadingProfile || savingProfile ? <Loader2 className="animate-spin" size={16} /> : <Upload size={16} />}
              Upload image
              <input type="file" className="hidden" accept="image/*" onChange={handleProfileUpload} disabled={uploadingProfile || savingProfile} />
            </label>
            <p className="text-xs text-[#37352f]/50 mt-3 max-w-md">
              Uses the <code className="text-[11px]">blog-assets</code> bucket. The About page falls back to <code className="text-[11px]">/images/rafeeque-profile.png</code> until a URL is saved here.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-serif text-[#37352f] mb-2">App detail articles</h2>
        <p className="text-sm text-[#37352f]/60 mb-4">HTML shown in the right panel when a visitor opens an app from Portfolio → Apps.</p>
        <div className="space-y-2">
          {APP_PROJECTS.map((app) => (
            <div key={app.id} className="bg-white border border-[#37352f]/10 rounded-xl p-4 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <h3 className="font-serif text-[#37352f]">{app.title}</h3>
                <p className="text-xs text-[#37352f]/50 truncate">{app.displayUrl}</p>
                <p className="text-[11px] text-[#37352f]/40 mt-1">{detailsByKey[app.id] ? 'Custom article saved' : 'Using default short description'}</p>
              </div>
              <button type="button" onClick={() => openEdit(app.id)} className="p-2 rounded-full border border-[#37352f]/15 hover:bg-[#37352f]/5" aria-label={`Edit ${app.title}`}>
                <Edit2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </section>

      {modalKey &&
        typeof document !== 'undefined' &&
        ReactDOM.createPortal(
          <div className="fixed inset-0 z-[200] bg-black/45 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white z-10 p-6 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-xl font-serif text-[#37352f]">
                  Edit details — {APP_PROJECTS.find((a) => a.id === modalKey)?.title}
                </h3>
                <button type="button" onClick={() => setModalKey(null)} className="text-[#37352f]/40 hover:text-[#37352f]">
                  <X size={22} />
                </button>
              </div>
              <form onSubmit={saveDetail} className="p-6 space-y-4">
                <label className="text-xs font-bold uppercase tracking-wider text-[#37352f]/60">HTML article body</label>
                <textarea
                  value={modalContent}
                  onChange={(e) => setModalContent(e.target.value)}
                  rows={14}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg font-mono text-sm"
                  placeholder="<p>Intro paragraph...</p>"
                />
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setModalKey(null)} className="flex-1 px-5 py-3 border border-gray-200 rounded-xl text-sm font-medium text-[#37352f]/60">
                    Cancel
                  </button>
                  <button type="submit" disabled={savingDetail} className="flex-1 px-5 py-3 bg-[#37352f] text-white rounded-xl text-sm font-medium disabled:opacity-60 inline-flex items-center justify-center gap-2">
                    {savingDetail && <Loader2 size={16} className="animate-spin" />}
                    Save
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

export default SiteAndAppsManager;
