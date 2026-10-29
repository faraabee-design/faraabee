import React, { useState } from 'react';
import { Product, Category } from '../../types';
import {
  X,
  Upload,
  Check,
  Image as ImageIcon,
  Trash2,
  Sparkles,
  Loader2,
  Plus,
  Leaf,
  Layers,
  FileText,
  AlertCircle,
  HelpCircle,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

const BOTANICAL_PRESETS = [
  {
    name: 'Herbal Hair Oil',
    url: 'https://images.unsplash.com/photo-1608248597359-009988ff8ecb?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Pure Shilajit',
    url: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Botanical Tincture',
    url: 'https://images.unsplash.com/photo-1512290900672-1f4864c29c8e?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Organic Herbal Tea',
    url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Natural Balm',
    url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
  },
];

interface ProductFormModalProps {
  isOpen: boolean;
  product?: Product | null;
  categories: Category[];
  onClose: () => void;
  onSave: (productData: Partial<Product>) => Promise<void>;
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  product,
  categories,
  onClose,
  onSave,
}) => {
  const { uploadProductImage } = useStore();
  const isEditing = !!product;

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<
    'general' | 'descriptions' | 'ingredients' | 'apothecary' | 'images'
  >('general');

  // General & Pricing
  const [name, setName] = useState(product?.name || '');
  const [urduName, setUrduName] = useState(product?.urduName || '');
  const [category, setCategory] = useState(product?.category || (categories[0]?.name || 'Herbal Oils'));
  const [price, setPrice] = useState<string>(product?.price !== undefined ? String(product.price) : '');
  const [salePrice, setSalePrice] = useState<string>(product?.salePrice !== undefined ? String(product.salePrice) : '');
  const [priceUSD, setPriceUSD] = useState<string>(product?.priceUSD !== undefined ? String(product.priceUSD) : '');
  const [salePriceUSD, setSalePriceUSD] = useState<string>(product?.salePriceUSD !== undefined ? String(product.salePriceUSD) : '');
  const [currency, setCurrency] = useState(product?.currency || 'PKR');
  const [currencyTag, setCurrencyTag] = useState<'PKR' | 'USD' | 'DUAL'>(
    product?.currency === 'USD' ? 'USD' : product?.priceUSD ? 'DUAL' : 'PKR'
  );
  const [volume, setVolume] = useState(product?.volume || '100 ml');
  const [sku, setSku] = useState(product?.sku || '');
  const [stockQuantity, setStockQuantity] = useState<string>(
    product?.stockQuantity !== undefined ? String(product.stockQuantity) : '50'
  );
  const [inStock, setInStock] = useState(product?.inStock ?? true);
  const [featured, setFeatured] = useState(product?.featured ?? false);
  const [status, setStatus] = useState<Product['status']>(product?.status || 'active');
  const [displayOrder, setDisplayOrder] = useState<string>(
    product?.displayOrder !== undefined ? String(product.displayOrder) : '1'
  );

  // Descriptions
  const [shortDescription, setShortDescription] = useState(product?.shortDescription || '');
  const [description, setDescription] = useState(product?.description || '');

  // Ingredients (Full Control)
  const [ingredients, setIngredients] = useState<string[]>(product?.ingredients || []);
  const [newIngredient, setNewIngredient] = useState('');
  const [bulkIngredients, setBulkIngredients] = useState('');
  const [showBulkInput, setShowBulkInput] = useState(false);

  // Key Botanicals (Actives & Benefits)
  const [keyBotanicals, setKeyBotanicals] = useState<{ name: string; benefit: string }[]>(
    product?.keyBotanicals || []
  );
  const [newBotanicalName, setNewBotanicalName] = useState('');
  const [newBotanicalBenefit, setNewBotanicalBenefit] = useState('');

  // Apothecary & Usage Details
  const [traditionalUse, setTraditionalUse] = useState(product?.traditionalUse || '');
  const [directions, setDirections] = useState(product?.directions || '');
  const [precautions, setPrecautions] = useState(product?.precautions || '');
  const [packagingInfo, setPackagingInfo] = useState(product?.packagingInfo || '');

  // Images & Gallery
  const [image, setImage] = useState(product?.image || '');
  const [secondaryImage, setSecondaryImage] = useState(product?.secondaryImage || '');
  const [additionalImages, setAdditionalImages] = useState<string[]>(product?.additionalImages || []);
  const [newGalleryUrl, setNewGalleryUrl] = useState('');

  // Loading & status states
  const [uploadingPrimary, setUploadingPrimary] = useState(false);
  const [uploadingSecondary, setUploadingSecondary] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [uploadSuccessPrimary, setUploadSuccessPrimary] = useState(false);
  const [uploadSuccessSecondary, setUploadSuccessSecondary] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  // --- Handlers: Ingredients ---
  const handleAddIngredient = () => {
    const trimmed = newIngredient.trim();
    if (!trimmed) return;
    if (trimmed.includes(',')) {
      // Split comma separated
      const parts = trimmed.split(',').map((p) => p.trim()).filter(Boolean);
      setIngredients((prev) => [...prev, ...parts]);
    } else {
      setIngredients((prev) => [...prev, trimmed]);
    }
    setNewIngredient('');
  };

  const handleRemoveIngredient = (index: number) => {
    setIngredients((prev) => prev.filter((_, i) => i !== index));
  };

  const handleApplyBulkIngredients = () => {
    if (!bulkIngredients.trim()) return;
    // Split by comma or new lines
    const parsed = bulkIngredients
      .split(/[\n,]+/)
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
    setIngredients((prev) => [...prev, ...parsed]);
    setBulkIngredients('');
    setShowBulkInput(false);
  };

  // --- Handlers: Key Botanicals ---
  const handleAddBotanical = () => {
    if (!newBotanicalName.trim()) return;
    setKeyBotanicals((prev) => [
      ...prev,
      {
        name: newBotanicalName.trim(),
        benefit: newBotanicalBenefit.trim() || 'Nourishing botanical active',
      },
    ]);
    setNewBotanicalName('');
    setNewBotanicalBenefit('');
  };

  const handleRemoveBotanical = (index: number) => {
    setKeyBotanicals((prev) => prev.filter((_, i) => i !== index));
  };

  // --- Handlers: Gallery Images ---
  const handleAddGalleryUrl = () => {
    if (!newGalleryUrl.trim()) return;
    setAdditionalImages((prev) => [...prev, newGalleryUrl.trim()]);
    setNewGalleryUrl('');
  };

  const handleRemoveGalleryImage = (index: number) => {
    setAdditionalImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleGalleryFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingGallery(true);
    try {
      const url = await uploadProductImage(file);
      if (url) {
        setAdditionalImages((prev) => [...prev, url]);
      }
    } catch {
      setError('Failed to upload gallery image.');
    } finally {
      setUploadingGallery(false);
      e.target.value = '';
    }
  };

  // Primary image file upload
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const inputEl = e.target;

    try {
      const localUrl = URL.createObjectURL(file);
      setImage(localUrl);
    } catch {}

    setUploadingPrimary(true);
    setUploadSuccessPrimary(false);
    setError(null);
    try {
      const url = await uploadProductImage(file);
      if (url) {
        setImage(url);
        setUploadSuccessPrimary(true);
        setTimeout(() => setUploadSuccessPrimary(false), 3500);
      }
    } catch {
      setError('Failed to process image. Please try again or paste a URL.');
    } finally {
      setUploadingPrimary(false);
      inputEl.value = '';
    }
  };

  // Secondary image file upload
  const handleSecondaryImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const inputEl = e.target;

    try {
      const localUrl = URL.createObjectURL(file);
      setSecondaryImage(localUrl);
    } catch {}

    setUploadingSecondary(true);
    setUploadSuccessSecondary(false);
    setError(null);
    try {
      const url = await uploadProductImage(file);
      if (url) {
        setSecondaryImage(url);
        setUploadSuccessSecondary(true);
        setTimeout(() => setUploadSuccessSecondary(false), 3500);
      }
    } catch {
      setError('Failed to process secondary image.');
    } finally {
      setUploadingSecondary(false);
      inputEl.value = '';
    }
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Product name is required.');
      return;
    }
    if (!price || Number(price) <= 0) {
      setError('Please provide a valid price greater than 0.');
      return;
    }
    if (!shortDescription.trim()) {
      setError('Short description is required.');
      return;
    }
    if (!image.trim()) {
      setError('Please upload or provide a primary product image.');
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const payload: Partial<Product> = {
        name: name.trim(),
        urduName: urduName.trim() || undefined,
        category,
        price: Number(price),
        salePrice: salePrice && !isNaN(Number(salePrice)) && Number(salePrice) > 0 ? Number(salePrice) : undefined,
        priceUSD: priceUSD && !isNaN(Number(priceUSD)) && Number(priceUSD) > 0 ? Number(priceUSD) : undefined,
        salePriceUSD: salePriceUSD && !isNaN(Number(salePriceUSD)) && Number(salePriceUSD) > 0 ? Number(salePriceUSD) : undefined,
        currency: currencyTag === 'USD' ? 'USD' : currencyTag === 'DUAL' ? 'PKR' : (currency.trim() || 'PKR'),
        volume: volume.trim(),
        shortDescription: shortDescription.trim(),
        description: description.trim() || shortDescription.trim(),
        image: image.trim(),
        secondaryImage: secondaryImage.trim() || undefined,
        additionalImages: additionalImages.filter(Boolean),
        ingredients: ingredients.filter((ing) => ing.trim().length > 0),
        keyBotanicals: keyBotanicals.filter((kb) => kb.name.trim().length > 0),
        sku: sku.trim() || undefined,
        stockQuantity: Number(stockQuantity) || 0,
        inStock,
        featured,
        status,
        displayOrder: Number(displayOrder) || 1,
        traditionalUse: traditionalUse.trim() || undefined,
        directions: directions.trim() || undefined,
        precautions: precautions.trim() || undefined,
        packagingInfo: packagingInfo.trim() || undefined,
      };

      await onSave(payload);
      onClose();
    } catch (err: unknown) {
      let friendlyMsg = 'Failed to save product.';
      if (err instanceof Error) {
        try {
          const parsed = JSON.parse(err.message);
          friendlyMsg = parsed.error || err.message;
        } catch {
          friendlyMsg = err.message;
        }
      }
      setError(friendlyMsg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[94vh] flex flex-col shadow-2xl border border-[#AFC7A5]/40 my-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#AFC7A5]/20 flex items-center justify-between bg-[#FAF9F3] rounded-t-3xl">
          <div>
            <h2 className="text-xl font-serif font-bold text-[#183F32] flex items-center gap-2">
              <span>{isEditing ? `Edit Formulation: ${product.name}` : 'Create New Herbal Formulation'}</span>
            </h2>
            <p className="text-xs text-[#26312B]/70 mt-0.5">
              Full control over all pricing, rich descriptions, botanical ingredients, usage, and photo gallery.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#26312B]/60 hover:text-[#183F32] hover:bg-[#E3EBDD]/40 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 pt-3 pb-2 bg-[#FAF9F3]/50 border-b border-[#AFC7A5]/20 flex flex-wrap gap-2 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('general')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'general'
                ? 'bg-[#183F32] text-white shadow-xs'
                : 'bg-white hover:bg-[#E3EBDD] text-[#183F32] border border-[#AFC7A5]/30'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Pricing & Basics</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('descriptions')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'descriptions'
                ? 'bg-[#183F32] text-white shadow-xs'
                : 'bg-white hover:bg-[#E3EBDD] text-[#183F32] border border-[#AFC7A5]/30'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Descriptions & Details</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('ingredients')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'ingredients'
                ? 'bg-[#183F32] text-white shadow-xs'
                : 'bg-white hover:bg-[#E3EBDD] text-[#183F32] border border-[#AFC7A5]/30'
            }`}
          >
            <Leaf className="w-3.5 h-3.5 text-[#AFC7A5]" />
            <span>Ingredients & Botanicals ({ingredients.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('apothecary')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'apothecary'
                ? 'bg-[#183F32] text-white shadow-xs'
                : 'bg-white hover:bg-[#E3EBDD] text-[#183F32] border border-[#AFC7A5]/30'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Directions, Use & Safety</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('images')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'images'
                ? 'bg-[#183F32] text-white shadow-xs'
                : 'bg-white hover:bg-[#E3EBDD] text-[#183F32] border border-[#AFC7A5]/30'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Photos & Gallery ({1 + (secondaryImage ? 1 : 0) + additionalImages.length})</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {error && (
            <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Legal Advertising Safety Tip */}
          <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl text-[11px] text-amber-950 flex items-start gap-2 leading-relaxed">
            <HelpCircle className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
            <div>
              <strong>Legal Compliance Tip:</strong> To avoid regulatory warnings under DRAP and US FDA regulations, describe herbs using wellness terms (e.g. <em>"supports vitality"</em>, <em>"nourishes scalp"</em>, <em>"promotes relaxation"</em>) rather than medical disease claims (e.g. <em>"cures baldness"</em>, <em>"treats anxiety"</em>).
            </div>
          </div>

          {/* ================= TAB 1: GENERAL & PRICING ================= */}
          {activeTab === 'general' && (
            <div className="space-y-6 animate-fade-in">
              {/* Product Names & Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#183F32] mb-1">
                    Product Title (English) *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Botanical Hair Nourishing Oil"
                    className="w-full px-3.5 py-2.5 border border-[#AFC7A5]/40 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#183F32] bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#183F32] mb-1">
                    Urdu Name / روایتی نام (اختیاری)
                  </label>
                  <input
                    type="text"
                    dir="rtl"
                    value={urduName}
                    onChange={(e) => setUrduName(e.target.value)}
                    placeholder="مثلاً: خالص ہربل تیل برائے بال"
                    className="w-full px-3.5 py-2.5 border border-[#AFC7A5]/40 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#183F32] bg-white font-urdu"
                  />
                </div>
              </div>

              {/* Category, Volume & SKU */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#183F32] mb-1">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-[#AFC7A5]/40 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#183F32] bg-white cursor-pointer"
                  >
                    {categories.map((c) => (
                      <option key={c.id || c.slug} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                    {!categories.some((c) => c.name === category) && (
                      <option value={category}>{category}</option>
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#183F32] mb-1">
                    Volume / Net Quantity
                  </label>
                  <input
                    type="text"
                    value={volume}
                    onChange={(e) => setVolume(e.target.value)}
                    placeholder="100 ml / 50 g / 200 ml"
                    className="w-full px-3.5 py-2.5 border border-[#AFC7A5]/40 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#183F32] bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#183F32] mb-1">
                    SKU / Product Code
                  </label>
                  <input
                    type="text"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    placeholder="FAR-001"
                    className="w-full px-3.5 py-2.5 border border-[#AFC7A5]/40 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#183F32] bg-white"
                  />
                </div>
              </div>

              {/* Pricing Grid */}
              <div className="p-4 bg-[#FAF9F3]/70 rounded-2xl border border-[#AFC7A5]/30 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#183F32]">
                    Pricing & International Currencies
                  </span>
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="text-[#26312B]/60 font-medium">Pricing Mode:</span>
                    <button
                      type="button"
                      onClick={() => setCurrencyTag('PKR')}
                      className={`px-2 py-0.5 rounded font-bold ${
                        currencyTag === 'PKR' ? 'bg-[#183F32] text-white' : 'bg-white text-[#183F32] border'
                      }`}
                    >
                      PKR
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrencyTag('DUAL')}
                      className={`px-2 py-0.5 rounded font-bold ${
                        currencyTag === 'DUAL' ? 'bg-[#183F32] text-white' : 'bg-white text-[#183F32] border'
                      }`}
                    >
                      Dual (PKR + USD)
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrencyTag('USD')}
                      className={`px-2 py-0.5 rounded font-bold ${
                        currencyTag === 'USD' ? 'bg-[#183F32] text-white' : 'bg-white text-[#183F32] border'
                      }`}
                    >
                      USD
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-[#183F32] mb-1">
                      Regular Price (PKR Rs.) *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="2800"
                      className="w-full px-3 py-2 border border-[#AFC7A5]/40 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#183F32] bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#183F32] mb-1">
                      Sale Price (PKR Rs.) (Optional)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={salePrice}
                      onChange={(e) => setSalePrice(e.target.value)}
                      placeholder="2350"
                      className="w-full px-3 py-2 border border-[#AFC7A5]/40 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#183F32] bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#183F32] mb-1">
                      International Price (USD $) (Optional)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={priceUSD}
                      onChange={(e) => setPriceUSD(e.target.value)}
                      placeholder="18"
                      className="w-full px-3 py-2 border border-[#AFC7A5]/40 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#183F32] bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#183F32] mb-1">
                      USD Sale Price ($) (Optional)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={salePriceUSD}
                      onChange={(e) => setSalePriceUSD(e.target.value)}
                      placeholder="14"
                      className="w-full px-3 py-2 border border-[#AFC7A5]/40 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#183F32] bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Inventory & Status Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#183F32] mb-1">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={stockQuantity}
                    onChange={(e) => setStockQuantity(e.target.value)}
                    placeholder="50"
                    className="w-full px-3 py-2 border border-[#AFC7A5]/40 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#183F32] bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#183F32] mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(e.target.value)}
                    placeholder="1"
                    className="w-full px-3 py-2 border border-[#AFC7A5]/40 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#183F32] bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#183F32] mb-1">
                    Visibility Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as Product['status'])}
                    className="w-full px-3 py-2 border border-[#AFC7A5]/40 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#183F32] bg-white cursor-pointer"
                  >
                    <option value="active">Active (Visible in Store)</option>
                    <option value="draft">Draft (Hidden from Public)</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              {/* Switches */}
              <div className="flex flex-wrap items-center gap-6 p-4 bg-white rounded-2xl border border-[#AFC7A5]/30">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inStock}
                    onChange={(e) => setInStock(e.target.checked)}
                    className="w-4 h-4 text-[#183F32] rounded-md focus:ring-[#183F32]"
                  />
                  <span className="text-sm font-semibold text-[#183F32]">
                    In Stock (Allow Orders)
                  </span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="w-4 h-4 text-[#183F32] rounded-md focus:ring-[#183F32]"
                  />
                  <span className="text-sm font-semibold text-[#183F32]">
                    Featured (Show on Homepage Showcase)
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* ================= TAB 2: DESCRIPTIONS ================= */}
          {activeTab === 'descriptions' && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#183F32] mb-1">
                  Short Description (Cards, Previews & Cart) *
                </label>
                <textarea
                  required
                  rows={3}
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  placeholder="A restorative botanical oil handcrafted with sun-steeped amla and black seed to nourish scalp vitality..."
                  className="w-full px-3.5 py-2.5 border border-[#AFC7A5]/40 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#183F32] leading-relaxed"
                />
                <span className="text-[11px] text-[#26312B]/60">
                  Displayed on product catalog cards, search results, and checkout summaries.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#183F32] mb-1">
                  Full Formulation Description (Product Detail Page)
                </label>
                <textarea
                  rows={8}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Comprehensive herbal overview, maceration technique, traditional philosophy, and experiential feeling..."
                  className="w-full px-3.5 py-2.5 border border-[#AFC7A5]/40 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#183F32] leading-relaxed font-sans"
                />
                <span className="text-[11px] text-[#26312B]/60">
                  You can use multiple paragraphs, bullet notes, and traditional apothecary explanations.
                </span>
              </div>
            </div>
          )}

          {/* ================= TAB 3: INGREDIENTS & BOTANICALS ================= */}
          {activeTab === 'ingredients' && (
            <div className="space-y-6 animate-fade-in">
              {/* Ingredients Manager */}
              <div className="p-5 bg-white rounded-2xl border border-[#AFC7A5]/40 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#AFC7A5]/25">
                  <div>
                    <h3 className="text-sm font-bold text-[#183F32] flex items-center gap-2">
                      <Leaf className="w-4 h-4 text-emerald-700" />
                      <span>Botanical Ingredients List</span>
                    </h3>
                    <p className="text-xs text-[#26312B]/70">
                      Add individual botanical ingredients. They will be displayed clearly in the ingredients tab on the product page.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowBulkInput(!showBulkInput)}
                    className="text-xs font-semibold text-[#183F32] bg-[#FAF9F3] hover:bg-[#E3EBDD] px-3 py-1.5 rounded-xl border border-[#AFC7A5]/40 transition-colors cursor-pointer"
                  >
                    {showBulkInput ? 'Close Bulk Paste' : '📋 Bulk Paste / Import'}
                  </button>
                </div>

                {/* Bulk Paste Area */}
                {showBulkInput && (
                  <div className="p-3.5 bg-[#FAF9F3] border border-[#AFC7A5]/40 rounded-xl space-y-2 animate-fade-in">
                    <label className="block text-xs font-bold text-[#183F32]">
                      Paste Ingredients (Separated by Commas or New Lines):
                    </label>
                    <textarea
                      rows={3}
                      value={bulkIngredients}
                      onChange={(e) => setBulkIngredients(e.target.value)}
                      placeholder="e.g. Cold-Pressed Sesame Seed Oil, Whole Indian Gooseberry (Amla), Shikakai, Black Seed Oil (Nigella Sativa), Sweet Almond Oil"
                      className="w-full px-3 py-2 text-xs border border-[#AFC7A5]/50 rounded-lg bg-white"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={handleApplyBulkIngredients}
                        className="px-3.5 py-1.5 bg-[#183F32] text-white text-xs font-bold rounded-lg hover:bg-[#285844] cursor-pointer"
                      >
                        Add All Ingredients
                      </button>
                    </div>
                  </div>
                )}

                {/* Quick Add Ingredient Input */}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newIngredient}
                    onChange={(e) => setNewIngredient(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddIngredient();
                      }
                    }}
                    placeholder="Type an ingredient (e.g. Pure Cold-Pressed Sesame Oil) and press Enter"
                    className="flex-1 px-3.5 py-2 border border-[#AFC7A5]/40 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#183F32] bg-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddIngredient}
                    className="px-4 py-2 bg-[#183F32] hover:bg-[#285844] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1 shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>

                {/* Ingredients Pill Badges */}
                {ingredients.length > 0 ? (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {ingredients.map((ing, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FAF9F3] border border-[#AFC7A5]/50 rounded-full text-xs font-medium text-[#183F32]"
                      >
                        <span>{ing}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveIngredient(idx)}
                          className="w-4 h-4 rounded-full hover:bg-red-100 hover:text-red-600 flex items-center justify-center transition-colors cursor-pointer"
                          title="Remove ingredient"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 rounded-xl border border-dashed border-[#AFC7A5]/50 text-center text-xs text-[#26312B]/50">
                    No individual ingredients added yet. Type an ingredient above or use Bulk Paste.
                  </div>
                )}
              </div>

              {/* Key Botanicals & Benefits */}
              <div className="p-5 bg-white rounded-2xl border border-[#AFC7A5]/40 space-y-4">
                <div className="pb-3 border-b border-[#AFC7A5]/25">
                  <h3 className="text-sm font-bold text-[#183F32] flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#B79A5B]" />
                    <span>Key Botanical Actives & Traditional Roles</span>
                  </h3>
                  <p className="text-xs text-[#26312B]/70">
                    Highlight 2-4 key plants and their traditional wellness benefits (e.g. "Sidr Leaf" &rarr; "Traditional purification and scalp soothing").
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                  <input
                    type="text"
                    value={newBotanicalName}
                    onChange={(e) => setNewBotanicalName(e.target.value)}
                    placeholder="Herb Name (e.g. Black Seed Oil)"
                    className="sm:col-span-5 px-3 py-2 border border-[#AFC7A5]/40 rounded-xl text-xs bg-white"
                  />
                  <input
                    type="text"
                    value={newBotanicalBenefit}
                    onChange={(e) => setNewBotanicalBenefit(e.target.value)}
                    placeholder="Traditional Role (e.g. Rich in thymoquinone for scalp vitality)"
                    className="sm:col-span-5 px-3 py-2 border border-[#AFC7A5]/40 rounded-xl text-xs bg-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddBotanical}
                    className="sm:col-span-2 px-3 py-2 bg-[#183F32] text-white text-xs font-bold rounded-xl hover:bg-[#285844] cursor-pointer flex items-center justify-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Active</span>
                  </button>
                </div>

                {keyBotanicals.length > 0 && (
                  <div className="space-y-2 pt-2">
                    {keyBotanicals.map((kb, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2.5 bg-[#FAF9F3] border border-[#AFC7A5]/30 rounded-xl text-xs"
                      >
                        <div>
                          <strong className="text-[#183F32]">{kb.name}:</strong>{' '}
                          <span className="text-[#26312B]/80">{kb.benefit}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveBotanical(idx)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ================= TAB 4: APOTHECARY & SAFETY ================= */}
          {activeTab === 'apothecary' && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#183F32] mb-1">
                  Traditional Botanical Use & Heritage
                </label>
                <textarea
                  rows={2}
                  value={traditionalUse}
                  onChange={(e) => setTraditionalUse(e.target.value)}
                  placeholder="e.g. Historically prepared via slow sun-infusion in classical Unani herbal traditions..."
                  className="w-full px-3.5 py-2.5 border border-[#AFC7A5]/40 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#183F32]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#183F32] mb-1">
                  Directions for Application & Ritual
                </label>
                <textarea
                  rows={2}
                  value={directions}
                  onChange={(e) => setDirections(e.target.value)}
                  placeholder="e.g. Dispense 8-12 drops onto palms, warm between hands, and gently massage into scalp for 5-10 minutes..."
                  className="w-full px-3.5 py-2.5 border border-[#AFC7A5]/40 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#183F32]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#183F32] mb-1">
                  Precautions & Allergy Safety Notice
                </label>
                <textarea
                  rows={2}
                  value={precautions}
                  onChange={(e) => setPrecautions(e.target.value)}
                  placeholder="e.g. For external topical application only. Perform a 24-hour patch test on the inner forearm prior to full use..."
                  className="w-full px-3.5 py-2.5 border border-[#AFC7A5]/40 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#183F32]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#183F32] mb-1">
                  Packaging, Glass Bottle & Storage Guidelines
                </label>
                <input
                  type="text"
                  value={packagingInfo}
                  onChange={(e) => setPackagingInfo(e.target.value)}
                  placeholder="e.g. Hand-poured in pharmaceutical-grade amber glass to shield delicate cold-pressed oils from UV light..."
                  className="w-full px-3.5 py-2 border border-[#AFC7A5]/40 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#183F32]"
                />
              </div>
            </div>
          )}

          {/* ================= TAB 5: PHOTOS & GALLERY ================= */}
          {activeTab === 'images' && (
            <div className="space-y-6 animate-fade-in">
              {/* Primary Image */}
              <div className="p-4 bg-white rounded-2xl border border-[#AFC7A5]/40 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#183F32] flex items-center gap-2">
                    <span>Primary Bottle Photo *</span>
                    {uploadSuccessPrimary && (
                      <span className="text-emerald-700 bg-emerald-100 text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                        <Check className="w-3 h-3" /> Uploaded
                      </span>
                    )}
                  </label>
                  {image && (
                    <button
                      type="button"
                      onClick={() => setImage('')}
                      className="text-xs text-red-600 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" /> Clear
                    </button>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  {image ? (
                    <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-[#183F32]/30 shrink-0 bg-[#FAF9F3]">
                      <img src={image} alt="Primary" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-24 h-24 rounded-2xl border-2 border-dashed border-[#AFC7A5]/50 flex flex-col items-center justify-center text-[#26312B]/40 shrink-0 bg-[#FAF9F3]">
                      <ImageIcon className="w-6 h-6 mb-1" />
                      <span className="text-[9px]">No photo</span>
                    </div>
                  )}

                  <div className="flex-1 w-full space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <label className="px-3.5 py-1.5 bg-[#183F32] text-white hover:bg-[#285844] rounded-xl text-xs font-semibold cursor-pointer inline-flex items-center gap-1.5 transition-all">
                        {uploadingPrimary ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Uploading...</span>
                          </>
                        ) : (
                          <>
                            <Upload className="w-3.5 h-3.5" />
                            <span>Upload Primary Photo</span>
                          </>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageFileChange}
                          disabled={uploadingPrimary}
                          className="hidden"
                        />
                      </label>
                    </div>
                    <input
                      type="text"
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                      placeholder="Or paste direct image URL (https://...)"
                      className="w-full px-3 py-1.5 border border-[#AFC7A5]/40 rounded-xl text-xs bg-white"
                    />

                    {/* Presets */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-[10px] text-[#26312B]/60 font-semibold">Quick Presets:</span>
                      {BOTANICAL_PRESETS.map((p) => (
                        <button
                          key={p.name}
                          type="button"
                          onClick={() => setImage(p.url)}
                          className="text-[10px] px-2 py-0.5 rounded bg-[#FAF9F3] hover:bg-[#E3EBDD] border border-[#AFC7A5]/30 cursor-pointer"
                        >
                          {p.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Secondary Image */}
              <div className="p-4 bg-white rounded-2xl border border-[#AFC7A5]/40 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#183F32]">
                    Secondary Image (Hover / Alternate Angle)
                  </label>
                  {secondaryImage && (
                    <button
                      type="button"
                      onClick={() => setSecondaryImage('')}
                      className="text-xs text-red-600 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" /> Clear
                    </button>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  {secondaryImage ? (
                    <div className="w-20 h-20 rounded-2xl overflow-hidden border border-[#183F32]/30 shrink-0 bg-[#FAF9F3]">
                      <img src={secondaryImage} alt="Secondary" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-20 h-20 rounded-2xl border-2 border-dashed border-[#AFC7A5]/50 flex items-center justify-center text-[#26312B]/40 shrink-0 bg-[#FAF9F3] text-[10px]">
                      Optional
                    </div>
                  )}

                  <div className="flex-1 w-full space-y-2">
                    <label className="px-3 py-1.5 bg-[#FAF9F3] border border-[#AFC7A5]/60 hover:bg-[#E3EBDD] text-[#183F32] rounded-xl text-xs font-semibold cursor-pointer inline-flex items-center gap-1.5">
                      {uploadingSecondary ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Upload className="w-3.5 h-3.5" />
                      )}
                      <span>Upload Secondary Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleSecondaryImageFileChange}
                        disabled={uploadingSecondary}
                        className="hidden"
                      />
                    </label>
                    <input
                      type="text"
                      value={secondaryImage}
                      onChange={(e) => setSecondaryImage(e.target.value)}
                      placeholder="Or paste secondary image URL"
                      className="w-full px-3 py-1.5 border border-[#AFC7A5]/40 rounded-xl text-xs bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Additional Gallery Images */}
              <div className="p-4 bg-white rounded-2xl border border-[#AFC7A5]/40 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-[#183F32]">
                      Additional Product Gallery Images
                    </label>
                    <p className="text-[11px] text-[#26312B]/70">
                      Add multiple packaging photos, ingredient macro shots, or unboxing images.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <input
                    type="text"
                    value={newGalleryUrl}
                    onChange={(e) => setNewGalleryUrl(e.target.value)}
                    placeholder="Paste additional image URL (https://...)"
                    className="flex-1 px-3 py-1.5 border border-[#AFC7A5]/40 rounded-xl text-xs bg-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddGalleryUrl}
                    className="px-3 py-1.5 bg-[#183F32] text-white text-xs font-bold rounded-xl hover:bg-[#285844] cursor-pointer"
                  >
                    + Add URL
                  </button>

                  <label className="px-3 py-1.5 bg-[#FAF9F3] border border-[#AFC7A5]/50 hover:bg-[#E3EBDD] text-[#183F32] rounded-xl text-xs font-semibold cursor-pointer inline-flex items-center gap-1">
                    {uploadingGallery ? <Loader2 className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />}
                    <span>Upload File</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleGalleryFileUpload}
                      disabled={uploadingGallery}
                      className="hidden"
                    />
                  </label>
                </div>

                {additionalImages.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                    {additionalImages.map((imgUrl, i) => (
                      <div
                        key={i}
                        className="relative group w-full h-24 rounded-xl overflow-hidden border border-[#AFC7A5]/40 bg-stone-100"
                      >
                        <img src={imgUrl} alt={`Gallery ${i}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemoveGalleryImage(i)}
                          className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-lg shadow-sm hover:bg-red-700 transition-colors cursor-pointer opacity-90 group-hover:opacity-100"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-4 border-t border-[#AFC7A5]/20 flex items-center justify-between sticky bottom-0 bg-white py-3">
            <div className="text-xs text-[#26312B]/60 hidden sm:block">
              All changes sync instantly to Firestore database & live catalogue.
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 text-xs font-semibold text-[#26312B] bg-[#FAF9F3] hover:bg-[#E3EBDD]/40 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving || uploadingPrimary || uploadingSecondary || uploadingGallery}
                className="px-6 py-2.5 bg-[#183F32] hover:bg-[#122F25] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-sm disabled:opacity-50 cursor-pointer flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>{saving ? 'Saving...' : isEditing ? 'Save Changes' : 'Publish Product'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
