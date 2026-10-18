import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { CareBundle } from '../../types';
import {
  Sparkles,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Tag,
  DollarSign,
  Package,
  Eye,
  Percent,
} from 'lucide-react';

interface AdminBundlesProps {
  onNotify: (msg: string) => void;
}

export const AdminBundles: React.FC<AdminBundlesProps> = ({ onNotify }) => {
  const { bundles, addBundle, updateBundle, deleteBundle, products } = useStore();

  const [editingBundle, setEditingBundle] = useState<CareBundle | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [urduName, setUrduName] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [badge, setBadge] = useState('Most Cherished Set');
  const [originalPrice, setOriginalPrice] = useState(3500);
  const [bundlePrice, setBundlePrice] = useState(2950);
  const [originalPriceUSD, setOriginalPriceUSD] = useState(24);
  const [bundlePriceUSD, setBundlePriceUSD] = useState(19);
  const [savingsPercentage, setSavingsPercentage] = useState(15);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [active, setActive] = useState(true);

  const startCreate = () => {
    setName('');
    setUrduName('');
    setSubtitle('');
    setDescription('');
    setImage('https://images.unsplash.com/photo-1608248597359-001091a13e2f?auto=format&fit=crop&q=80&w=800');
    setBadge('Bachat Set');
    setOriginalPrice(3500);
    setBundlePrice(2950);
    setOriginalPriceUSD(24);
    setBundlePriceUSD(19);
    setSavingsPercentage(15);
    setSelectedProductIds([]);
    setActive(true);
    setIsCreating(true);
    setEditingBundle(null);
  };

  const startEdit = (bundle: CareBundle) => {
    setEditingBundle(bundle);
    setName(bundle.name);
    setUrduName(bundle.urduName || '');
    setSubtitle(bundle.subtitle);
    setDescription(bundle.description);
    setImage(bundle.image);
    setBadge(bundle.badge || 'Bachat Set');
    setOriginalPrice(bundle.originalPrice);
    setBundlePrice(bundle.bundlePrice);
    setOriginalPriceUSD(bundle.originalPriceUSD || 24);
    setBundlePriceUSD(bundle.bundlePriceUSD || 19);
    setSavingsPercentage(bundle.savingsPercentage);
    setSelectedProductIds(bundle.productIds || []);
    setActive(bundle.active);
    setIsCreating(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (isCreating) {
      await addBundle({
        name: name.trim(),
        urduName: urduName.trim(),
        subtitle: subtitle.trim(),
        description: description.trim(),
        image: image.trim(),
        badge: badge.trim(),
        originalPrice: Number(originalPrice),
        bundlePrice: Number(bundlePrice),
        originalPriceUSD: Number(originalPriceUSD),
        bundlePriceUSD: Number(bundlePriceUSD),
        savingsPercentage: Number(savingsPercentage),
        productIds: selectedProductIds,
        active,
      });
      onNotify('Care Bundle created successfully!');
    } else if (editingBundle) {
      await updateBundle(editingBundle.id, {
        name: name.trim(),
        urduName: urduName.trim(),
        subtitle: subtitle.trim(),
        description: description.trim(),
        image: image.trim(),
        badge: badge.trim(),
        originalPrice: Number(originalPrice),
        bundlePrice: Number(bundlePrice),
        originalPriceUSD: Number(originalPriceUSD),
        bundlePriceUSD: Number(bundlePriceUSD),
        savingsPercentage: Number(savingsPercentage),
        productIds: selectedProductIds,
        active,
      });
      onNotify('Care Bundle updated successfully!');
    }

    setIsCreating(false);
    setEditingBundle(null);
  };

  const handleDelete = async (id: string, bundleName: string) => {
    if (confirm(`Are you sure you want to delete bundle "${bundleName}"?`)) {
      await deleteBundle(id);
      onNotify('Care Bundle deleted.');
    }
  };

  const toggleProductSelection = (productId: string) => {
    if (selectedProductIds.includes(productId)) {
      setSelectedProductIds(selectedProductIds.filter((id) => id !== productId));
    } else {
      setSelectedProductIds([...selectedProductIds, productId]);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#AFC7A5]/35 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E3EBDD] text-[#183F32] text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#285844]" />
            <span>Curated Bachat Packages</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#183F32]">
            Care Bundles & Regimens
          </h2>
          <p className="text-xs sm:text-sm text-[#26312B]/75 mt-1 max-w-xl">
            Configure multi-product sets with bundled pricing, custom badges, savings percentages, and dual PKR / USD tags.
          </p>
        </div>

        {!isCreating && !editingBundle && (
          <button
            onClick={startCreate}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#183F32] text-white hover:bg-[#285844] text-xs font-bold shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Bundle</span>
          </button>
        )}
      </div>

      {/* Form Card (Create or Edit) */}
      {(isCreating || editingBundle) && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#183F32]/40 shadow-lg animate-fade-in">
          <div className="flex items-center justify-between pb-4 border-b border-[#AFC7A5]/30 mb-6">
            <h3 className="font-serif text-xl font-bold text-[#183F32]">
              {isCreating ? 'Create New Care Bundle' : `Edit Bundle: ${editingBundle?.name}`}
            </h3>
            <button
              onClick={() => {
                setIsCreating(false);
                setEditingBundle(null);
              }}
              className="p-1.5 text-[#26312B]/60 hover:text-[#183F32] rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#183F32] mb-1">
                  Bundle Name (English) *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ruhani Sukoon & Deep Sleep Bundle"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#AFC7A5]/40 focus:border-[#183F32] outline-hidden bg-[#FAF9F3]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#183F32] mb-1">
                  Urdu Title (اردو نام)
                </label>
                <input
                  type="text"
                  value={urduName}
                  onChange={(e) => setUrduName(e.target.value)}
                  placeholder="روحانی سکون اور نیند کا خصوصی سیٹ"
                  dir="rtl"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#AFC7A5]/40 focus:border-[#183F32] outline-hidden bg-[#FAF9F3] font-urdu text-sm"
                />
              </div>
            </div>

            {/* Subtitle & Badge */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#183F32] mb-1">
                  Subtitle
                </label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="e.g. Soothing Balms & Restorative Herbal Oil"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#AFC7A5]/40 focus:border-[#183F32] outline-hidden bg-[#FAF9F3]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#183F32] mb-1">
                  Display Badge
                </label>
                <input
                  type="text"
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  placeholder="e.g. Most Cherished Set / Best Value"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#AFC7A5]/40 focus:border-[#183F32] outline-hidden bg-[#FAF9F3]"
                />
              </div>
            </div>

            {/* Description & Image */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#183F32] mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Explain why these items work synergistically..."
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#AFC7A5]/40 focus:border-[#183F32] outline-hidden bg-[#FAF9F3]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#183F32] mb-1">
                  Bundle Image URL
                </label>
                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#AFC7A5]/40 focus:border-[#183F32] outline-hidden bg-[#FAF9F3] mb-2"
                />
                {image && (
                  <img
                    src={image}
                    alt="Preview"
                    className="w-20 h-16 object-cover rounded-xl border border-[#AFC7A5]/30"
                  />
                )}
              </div>
            </div>

            {/* Pricing Section (PKR and USD) */}
            <div className="p-4 rounded-2xl bg-[#FAF9F3] border border-[#AFC7A5]/30 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#183F32] block">
                Multi-Currency Bundle Pricing
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#183F32] mb-1">
                    Regular Price (PKR)
                  </label>
                  <input
                    type="number"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(Number(e.target.value))}
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-[#AFC7A5]/40 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#183F32] mb-1">
                    Bundle Price (PKR) *
                  </label>
                  <input
                    type="number"
                    value={bundlePrice}
                    onChange={(e) => setBundlePrice(Number(e.target.value))}
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-[#AFC7A5]/40 bg-white font-bold text-[#183F32]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#183F32] mb-1">
                    Regular Price (USD)
                  </label>
                  <input
                    type="number"
                    value={originalPriceUSD}
                    onChange={(e) => setOriginalPriceUSD(Number(e.target.value))}
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-[#AFC7A5]/40 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#183F32] mb-1">
                    Bundle Price (USD) *
                  </label>
                  <input
                    type="number"
                    value={bundlePriceUSD}
                    onChange={(e) => setBundlePriceUSD(Number(e.target.value))}
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-[#AFC7A5]/40 bg-white font-bold text-[#183F32]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#183F32] mb-1">
                    Savings %
                  </label>
                  <input
                    type="number"
                    value={savingsPercentage}
                    onChange={(e) => setSavingsPercentage(Number(e.target.value))}
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-[#AFC7A5]/40 bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Select Included Products */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#183F32] mb-2">
                Included Products in this Bundle:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-3 bg-[#FAF9F3] rounded-2xl border border-[#AFC7A5]/30">
                {products.map((p) => {
                  const isChecked = selectedProductIds.includes(p.id) || selectedProductIds.includes(p.slug);
                  return (
                    <button
                      type="button"
                      key={p.id}
                      onClick={() => toggleProductSelection(p.id)}
                      className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-colors cursor-pointer text-xs ${
                        isChecked
                          ? 'bg-[#183F32] text-white border-[#183F32]'
                          : 'bg-white border-[#AFC7A5]/30 text-[#26312B] hover:bg-[#E3EBDD]'
                      }`}
                    >
                      <span className="truncate max-w-[170px] font-medium">{p.name}</span>
                      {isChecked && <Check className="w-3.5 h-3.5 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Status toggle */}
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#183F32]">
                <input
                  type="checkbox"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                  className="w-4 h-4 accent-[#183F32]"
                />
                <span>Active on Public Storefront</span>
              </label>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#AFC7A5]/30">
              <button
                type="button"
                onClick={() => {
                  setIsCreating(false);
                  setEditingBundle(null);
                }}
                className="px-4 py-2 text-xs font-semibold text-[#26312B]/70 hover:text-[#183F32] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[#183F32] text-white hover:bg-[#285844] text-xs font-bold shadow-xs cursor-pointer"
              >
                {isCreating ? 'Publish Care Bundle' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Existing Bundles List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bundles.map((bundle) => (
          <div
            key={bundle.id}
            className="bg-white rounded-3xl border border-[#AFC7A5]/40 overflow-hidden shadow-xs flex flex-col justify-between"
          >
            <div className="relative aspect-16/9 bg-[#FAF9F3]">
              <img src={bundle.image} alt={bundle.name} className="w-full h-full object-cover" />
              <div className="absolute top-3 left-3 flex gap-1.5">
                {bundle.badge && (
                  <span className="px-2.5 py-0.5 rounded-md bg-[#183F32] text-white text-[10px] font-bold uppercase tracking-wider">
                    {bundle.badge}
                  </span>
                )}
                <span className="px-2 py-0.5 rounded-md bg-amber-500 text-white text-[10px] font-bold uppercase tracking-wider">
                  Save {bundle.savingsPercentage}%
                </span>
              </div>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-serif text-lg font-bold text-[#183F32]">
                    {bundle.name}
                  </h4>
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                      bundle.active ? 'bg-emerald-50 text-emerald-800' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {bundle.active ? 'Active' : 'Draft'}
                  </span>
                </div>
                <p className="text-xs text-[#285844] font-medium mt-0.5">{bundle.subtitle}</p>
                <p className="text-xs text-[#26312B]/70 mt-2 line-clamp-2">{bundle.description}</p>

                {/* Prices */}
                <div className="mt-4 pt-3 border-t border-[#AFC7A5]/25 flex items-baseline justify-between">
                  <div>
                    <span className="text-base font-bold text-[#183F32]">
                      Rs. {bundle.bundlePrice.toLocaleString()}
                    </span>
                    <span className="text-xs text-[#26312B]/40 line-through ml-2">
                      Rs. {bundle.originalPrice.toLocaleString()}
                    </span>
                  </div>
                  <div className="text-xs text-[#285844] font-semibold">
                    ${bundle.bundlePriceUSD || Math.round(bundle.bundlePrice / 280)}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-5 pt-3 border-t border-[#AFC7A5]/25 flex items-center justify-end gap-2">
                <button
                  onClick={() => startEdit(bundle)}
                  className="p-2 rounded-xl border border-[#AFC7A5]/40 hover:bg-[#FAF9F3] text-[#183F32] cursor-pointer"
                  title="Edit Bundle"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(bundle.id, bundle.name)}
                  className="p-2 rounded-xl border border-red-200 hover:bg-red-50 text-red-600 cursor-pointer"
                  title="Delete Bundle"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
