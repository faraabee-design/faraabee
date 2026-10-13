import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { SpiritualPost, SpiritualSettings } from '../../types';
import {
  Sparkles,
  Plus,
  Edit2,
  Trash2,
  Eye,
  MessageCircle,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  X,
  Sliders,
  ExternalLink,
  BookOpen,
} from 'lucide-react';

interface AdminSpiritualProps {
  onNotify: (msg: string) => void;
}

export const AdminSpiritual: React.FC<AdminSpiritualProps> = ({ onNotify }) => {
  const {
    spiritualPosts,
    spiritualSettings,
    products,
    addSpiritualPost,
    updateSpiritualPost,
    deleteSpiritualPost,
    updateSpiritualSettings,
    uploadProductImage,
  } = useStore();

  const [activeSubTab, setActiveSubTab] = useState<'posts' | 'settings'>('posts');
  const [editingPost, setEditingPost] = useState<SpiritualPost | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [postToDelete, setPostToDelete] = useState<SpiritualPost | null>(null);

  // Form state for creating / editing post
  const [formData, setFormData] = useState<Partial<SpiritualPost>>({
    title: '',
    subtitle: '',
    category: 'Prophetic Botanicals',
    image: '',
    arabicQuote: '',
    quoteTranslation: '',
    description: '',
    contactPrompt: 'Consult on WhatsApp',
    relatedProductSlug: '',
    active: true,
    displayOrder: 1,
  });

  // Settings form state
  const [settingsData, setSettingsData] = useState<SpiritualSettings>(spiritualSettings);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);

  const openCreateModal = () => {
    setFormData({
      title: '',
      subtitle: '',
      category: 'Prophetic Botanicals',
      image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1200&q=80',
      arabicQuote: '',
      quoteTranslation: '',
      description: '',
      contactPrompt: 'Consult on WhatsApp',
      relatedProductSlug: '',
      active: true,
      displayOrder: spiritualPosts.length + 1,
    });
    setEditingPost(null);
    setIsCreating(true);
  };

  const openEditModal = (post: SpiritualPost) => {
    setFormData({ ...post });
    setEditingPost(post);
    setIsCreating(true);
  };

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const url = await uploadProductImage(file);
      setFormData((prev) => ({ ...prev, image: url }));
      onNotify('Image uploaded successfully');
    } catch {
      onNotify('Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSavePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.trim() || !formData.description?.trim()) {
      onNotify('Please provide both Title and Description for the spiritual post.');
      return;
    }

    try {
      if (editingPost) {
        await updateSpiritualPost(editingPost.id, formData);
        onNotify(`Updated spiritual article "${formData.title}"`);
      } else {
        await addSpiritualPost(formData);
        onNotify(`Added new spiritual article "${formData.title}"`);
      }
      setIsCreating(false);
      setEditingPost(null);
    } catch {
      onNotify('Failed to save spiritual article.');
    }
  };

  const handleDeletePost = async () => {
    if (!postToDelete) return;
    try {
      await deleteSpiritualPost(postToDelete.id);
      onNotify(`Removed spiritual article "${postToDelete.title}"`);
    } catch {
      onNotify('Failed to delete spiritual article.');
    } finally {
      setPostToDelete(null);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      await updateSpiritualSettings(settingsData);
      onNotify('Spiritual Sanctuary header & settings saved successfully!');
    } catch {
      onNotify('Failed to save spiritual settings.');
    } finally {
      setSavingSettings(false);
    }
  };

  const categoryPresets = [
    'Prophetic Botanicals',
    'Sacred Remedies',
    'Heart & Mindfulness',
    'Holistic Living',
    'Ruqyah & Purification',
    'Herbal Tisanes & Honey',
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner and Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl shadow-xs border border-[#AFC7A5]/30">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-serif font-bold text-[#183F32]">
              Spiritual Sanctuary Management
            </h2>
            <span className="px-2 py-0.5 bg-[#FAF9F3] text-[#183F32] border border-[#AFC7A5]/40 text-xs font-bold rounded-full">
              {spiritualPosts.length} Articles
            </span>
          </div>
          <p className="text-xs text-[#26312B]/70 mt-0.5">
            Customize spiritual articles, descriptions, pictures, quotes, and consultation prompts for your Spiritual Page.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="flex rounded-xl bg-[#FAF9F3] p-1 border border-[#AFC7A5]/30">
            <button
              onClick={() => setActiveSubTab('posts')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeSubTab === 'posts'
                  ? 'bg-[#183F32] text-white shadow-xs'
                  : 'text-[#26312B]/70 hover:text-[#183F32]'
              }`}
            >
              Wisdom Articles ({spiritualPosts.length})
            </button>
            <button
              onClick={() => setActiveSubTab('settings')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeSubTab === 'settings'
                  ? 'bg-[#183F32] text-white shadow-xs'
                  : 'text-[#26312B]/70 hover:text-[#183F32]'
              }`}
            >
              Page Header & Quotes
            </button>
          </div>

          {activeSubTab === 'posts' && (
            <button
              onClick={openCreateModal}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#183F32] hover:bg-[#285844] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Spiritual Post</span>
            </button>
          )}
        </div>
      </div>

      {/* Subtab: Wisdom Articles List */}
      {activeSubTab === 'posts' && (
        <div className="space-y-4">
          {spiritualPosts.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-[#AFC7A5]/40 space-y-3">
              <BookOpen className="w-10 h-10 mx-auto text-[#183F32]/40" />
              <p className="font-semibold text-sm text-[#183F32]">No Spiritual Articles Added Yet</p>
              <p className="text-xs text-[#26312B]/60 max-w-sm mx-auto">
                Create inspiring spiritual write-ups with pictures, prophetic wisdom, and direct WhatsApp contact prompts.
              </p>
              <button
                onClick={openCreateModal}
                className="px-4 py-2 bg-[#183F32] text-white text-xs font-bold rounded-xl hover:bg-[#285844] cursor-pointer"
              >
                Create First Article
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {spiritualPosts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white rounded-2xl p-4 sm:p-5 border border-[#AFC7A5]/30 shadow-xs flex flex-col justify-between hover:border-[#183F32]/40 transition-all group"
                >
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover bg-[#FAF9F3] shrink-0 border border-[#AFC7A5]/25"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="px-2 py-0.5 bg-[#FAF9F3] text-[#183F32] text-[10px] font-bold uppercase rounded-md border border-[#AFC7A5]/30">
                            {post.category || 'General'}
                          </span>
                          <span
                            className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                              post.active
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {post.active ? 'Active' : 'Draft'}
                          </span>
                        </div>
                        <h3 className="font-serif font-bold text-base text-[#183F32] mt-1 line-clamp-1">
                          {post.title}
                        </h3>
                        {post.subtitle && (
                          <p className="text-[11px] text-[#B79A5B] font-medium line-clamp-1">
                            {post.subtitle}
                          </p>
                        )}
                      </div>
                    </div>

                    {post.arabicQuote && (
                      <div className="p-2.5 bg-[#FAF9F3] rounded-lg border-l-2 border-[#183F32] text-right text-xs font-urdu text-[#183F32]">
                        {post.arabicQuote}
                      </div>
                    )}

                    <p className="text-xs text-[#26312B]/75 line-clamp-3 leading-relaxed">
                      {post.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#AFC7A5]/20 mt-3 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-[#26312B]/50 flex items-center gap-1">
                      <MessageCircle className="w-3 h-3 text-[#25D366]" />
                      <span>{post.contactPrompt || 'Consult on WhatsApp'}</span>
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => openEditModal(post)}
                        className="p-1.5 text-[#183F32] hover:bg-[#FAF9F3] rounded-lg transition-colors cursor-pointer"
                        title="Edit Article"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setPostToDelete(post)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="Delete Article"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Subtab: Page Header & Quotes Customization */}
      {activeSubTab === 'settings' && (
        <form onSubmit={handleSaveSettings} className="bg-white rounded-2xl p-6 border border-[#AFC7A5]/30 shadow-xs space-y-6">
          <div>
            <h3 className="font-serif font-bold text-lg text-[#183F32]">
              Spiritual Page Header & Quotes
            </h3>
            <p className="text-xs text-[#26312B]/70 mt-0.5">
              Customize the prominent top banners, Islamic Ayah / Hadith calligraphy, and concierge prompts displayed on the spiritual page.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#183F32] uppercase mb-1">
                Top Badge Text
              </label>
              <input
                type="text"
                value={settingsData.badge}
                onChange={(e) => setSettingsData({ ...settingsData, badge: e.target.value })}
                placeholder="e.g. FARAABEE SPIRITUAL SANCTUARY • روحانی شفا"
                className="w-full px-3 py-2 text-xs border border-[#AFC7A5]/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#183F32]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#183F32] uppercase mb-1">
                Main Page Heading
              </label>
              <input
                type="text"
                value={settingsData.title}
                onChange={(e) => setSettingsData({ ...settingsData, title: e.target.value })}
                placeholder="e.g. Spiritual Sanctuary & Botanical Wisdom"
                className="w-full px-3 py-2 text-xs border border-[#AFC7A5]/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#183F32]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#183F32] uppercase mb-1">
              Introductory Subtitle & Philosophy
            </label>
            <textarea
              rows={2}
              value={settingsData.subtitle}
              onChange={(e) => setSettingsData({ ...settingsData, subtitle: e.target.value })}
              placeholder="Describe the sanctuary philosophy..."
              className="w-full px-3 py-2 text-xs border border-[#AFC7A5]/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#183F32]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-[#FAF9F3] rounded-xl border border-[#AFC7A5]/30">
            <div>
              <label className="block text-xs font-bold text-[#183F32] uppercase mb-1">
                Featured Quranic / Arabic Quote
              </label>
              <input
                type="text"
                dir="rtl"
                value={settingsData.headerQuote}
                onChange={(e) => setSettingsData({ ...settingsData, headerQuote: e.target.value })}
                placeholder="أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ"
                className="w-full px-3 py-2 text-sm font-urdu border border-[#AFC7A5]/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#183F32] text-right bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#183F32] uppercase mb-1">
                Quote Translation / Citation
              </label>
              <input
                type="text"
                value={settingsData.headerQuoteTranslation}
                onChange={(e) => setSettingsData({ ...settingsData, headerQuoteTranslation: e.target.value })}
                placeholder="Unquestionably, by the remembrance of Allah do hearts find rest (Surah Ar-Ra’d 13:28)"
                className="w-full px-3 py-2 text-xs border border-[#AFC7A5]/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#183F32] bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#183F32] uppercase mb-1">
                Top Contact Button Label
              </label>
              <input
                type="text"
                value={settingsData.contactButtonText}
                onChange={(e) => setSettingsData({ ...settingsData, contactButtonText: e.target.value })}
                placeholder="e.g. Consult on Spiritual Formulations"
                className="w-full px-3 py-2 text-xs border border-[#AFC7A5]/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#183F32]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#183F32] uppercase mb-1">
                Bottom Consultation Description
              </label>
              <input
                type="text"
                value={settingsData.consultationText}
                onChange={(e) => setSettingsData({ ...settingsData, consultationText: e.target.value })}
                placeholder="Concierge assistance description..."
                className="w-full px-3 py-2 text-xs border border-[#AFC7A5]/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#183F32]"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={savingSettings}
              className="px-6 py-2.5 bg-[#183F32] hover:bg-[#285844] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              {savingSettings ? 'Saving Settings...' : 'Save Spiritual Settings'}
            </button>
          </div>
        </form>
      )}

      {/* Create / Edit Article Modal */}
      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-[#AFC7A5]/30 my-8 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#AFC7A5]/20">
              <h3 className="font-serif font-bold text-lg text-[#183F32]">
                {editingPost ? 'Edit Spiritual Article' : 'Add New Spiritual Article'}
              </h3>
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePost} className="space-y-4">
              {/* Title & Subtitle */}
              <div>
                <label className="block text-xs font-bold text-[#183F32] uppercase mb-1">
                  Article Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. The Sacred Sidr: Purification of Mind & Heart"
                  className="w-full px-3 py-2 text-xs border border-[#AFC7A5]/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#183F32]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#183F32] uppercase mb-1">
                    Subtitle / Summary Tag
                  </label>
                  <input
                    type="text"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    placeholder="e.g. Ancient leaves for inner calm"
                    className="w-full px-3 py-2 text-xs border border-[#AFC7A5]/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#183F32]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#183F32] uppercase mb-1">
                    Category
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      placeholder="Category"
                      className="w-full px-3 py-2 text-xs border border-[#AFC7A5]/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#183F32]"
                    />
                    <select
                      onChange={(e) => e.target.value && setFormData({ ...formData, category: e.target.value })}
                      className="px-2 py-2 text-xs border border-[#AFC7A5]/40 rounded-xl bg-[#FAF9F3] cursor-pointer"
                    >
                      <option value="">Presets</option>
                      {categoryPresets.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Image Input (URL + Upload) */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-[#183F32] uppercase">
                  Article Picture (Image URL or Upload) *
                </label>
                <div className="flex gap-3">
                  <input
                    type="url"
                    required
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="flex-1 px-3 py-2 text-xs border border-[#AFC7A5]/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#183F32]"
                  />
                  <label className="px-4 py-2 bg-[#FAF9F3] hover:bg-[#E8F1DF] text-[#183F32] text-xs font-bold rounded-xl border border-[#AFC7A5]/40 flex items-center gap-1.5 cursor-pointer">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadingImage ? 'Uploading...' : 'Upload'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="hidden"
                    />
                  </label>
                </div>
                {formData.image && (
                  <div className="mt-2 w-32 h-20 rounded-xl overflow-hidden border border-[#AFC7A5]/30">
                    <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              {/* Arabic Quote & Translation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3.5 bg-[#FAF9F3] rounded-xl border border-[#AFC7A5]/30">
                <div>
                  <label className="block text-xs font-bold text-[#183F32] uppercase mb-1">
                    Arabic Quote / Ayah (Optional)
                  </label>
                  <input
                    type="text"
                    dir="rtl"
                    value={formData.arabicQuote}
                    onChange={(e) => setFormData({ ...formData, arabicQuote: e.target.value })}
                    placeholder="فِي سِدْرٍ مَّخْضُودٍ"
                    className="w-full px-3 py-2 text-sm font-urdu border border-[#AFC7A5]/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#183F32] bg-white text-right"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#183F32] uppercase mb-1">
                    Quote Translation (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.quoteTranslation}
                    onChange={(e) => setFormData({ ...formData, quoteTranslation: e.target.value })}
                    placeholder="Among thornless lote trees (56:28)"
                    className="w-full px-3 py-2 text-xs border border-[#AFC7A5]/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#183F32] bg-white"
                  />
                </div>
              </div>

              {/* Description Box */}
              <div>
                <label className="block text-xs font-bold text-[#183F32] uppercase mb-1">
                  Description Box & Spiritual Reflections *
                </label>
                <textarea
                  rows={6}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Write your spiritual insights, botanical lore, healing rituals, and preparation advice here. Multi-paragraph formatting is preserved..."
                  className="w-full px-3 py-2 text-xs border border-[#AFC7A5]/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#183F32] font-serif leading-relaxed"
                />
              </div>

              {/* Contact Prompt & Related Product */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#183F32] uppercase mb-1">
                    Contact Button Label
                  </label>
                  <input
                    type="text"
                    value={formData.contactPrompt}
                    onChange={(e) => setFormData({ ...formData, contactPrompt: e.target.value })}
                    placeholder="e.g. Consult on WhatsApp"
                    className="w-full px-3 py-2 text-xs border border-[#AFC7A5]/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#183F32]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#183F32] uppercase mb-1">
                    Attach Related Store Product
                  </label>
                  <select
                    value={formData.relatedProductSlug || ''}
                    onChange={(e) => setFormData({ ...formData, relatedProductSlug: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-[#AFC7A5]/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#183F32] bg-white cursor-pointer"
                  >
                    <option value="">None (General Reflection)</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.slug}>
                        {p.name} ({p.category})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Display Order & Active status */}
              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="rounded text-[#183F32] focus:ring-[#183F32]"
                  />
                  <span className="text-xs font-bold text-[#183F32]">Publish as Active Article</span>
                </label>

                <div className="flex items-center gap-2 text-xs">
                  <span className="font-semibold text-[#26312B]/70">Sort Order:</span>
                  <input
                    type="number"
                    value={formData.displayOrder || 1}
                    onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 1 })}
                    className="w-16 px-2 py-1 text-xs border border-[#AFC7A5]/40 rounded-lg text-center"
                  />
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex justify-end gap-2.5 pt-4 border-t border-[#AFC7A5]/20">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#26312B] bg-[#FAF9F3] hover:bg-[#E8F1DF] rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 text-xs font-bold text-white bg-[#183F32] hover:bg-[#285844] rounded-xl shadow-md transition-colors cursor-pointer"
                >
                  {editingPost ? 'Save Changes' : 'Publish Article'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {postToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#AFC7A5]/30 space-y-4">
            <h3 className="font-serif font-bold text-lg text-red-700">Delete Spiritual Article</h3>
            <p className="text-xs text-[#26312B]/80 leading-relaxed">
              Are you sure you want to permanently delete the spiritual article &quot;{postToDelete.title}&quot;? This cannot be undone.
            </p>
            <div className="flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setPostToDelete(null)}
                className="px-4 py-2 text-xs font-semibold text-[#26312B] bg-[#FAF9F3] hover:bg-[#E8F1DF] rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeletePost}
                className="px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl cursor-pointer"
              >
                Delete Article
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
