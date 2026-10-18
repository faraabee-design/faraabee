import React, { useState } from 'react';
import { Product, Category } from '../../types';
import { X, Upload, Check, Image as ImageIcon, Trash2, RefreshCw, Sparkles, Loader2 } from 'lucide-react';
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
  const [shortDescription, setShortDescription] = useState(product?.shortDescription || '');
  const [description, setDescription] = useState(product?.description || '');
  const [image, setImage] = useState(product?.image || '');
  const [secondaryImage, setSecondaryImage] = useState(product?.secondaryImage || '');
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

  // Apothecary rich attributes
  const [traditionalUse, setTraditionalUse] = useState(product?.traditionalUse || '');
  const [directions, setDirections] = useState(product?.directions || '');
  const [precautions, setPrecautions] = useState(product?.precautions || '');
  const [packagingInfo, setPackagingInfo] = useState(product?.packagingInfo || '');

  const [uploadingPrimary, setUploadingPrimary] = useState(false);
  const [uploadingSecondary, setUploadingSecondary] = useState(false);
  const [uploadSuccessPrimary, setUploadSuccessPrimary] = useState(false);
  const [uploadSuccessSecondary, setUploadSuccessSecondary] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const inputEl = e.target;

    // Instant local preview in 1ms so user sees their chosen file right away
    try {
      const localUrl = URL.createObjectURL(file);
      setImage(localUrl);
    } catch {
      // ignore
    }

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
    } catch (err) {
      setError('Failed to process image. Please try again or paste a URL.');
    } finally {
      setUploadingPrimary(false);
      inputEl.value = ''; // Reset input so re-selecting same file works seamlessly
    }
  };

  const handleSecondaryImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const inputEl = e.target;

    try {
      const localUrl = URL.createObjectURL(file);
      setSecondaryImage(localUrl);
    } catch {
      // ignore
    }

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
      setError('Please upload or provide a product image.');
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
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-[#AFC7A5]/40 my-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#AFC7A5]/20 flex items-center justify-between bg-[#FAF9F3] rounded-t-3xl">
          <div>
            <h2 className="text-xl font-serif font-bold text-[#183F32]">
              {isEditing ? `Edit Formulation: ${product.name}` : 'Add New Herbal Formulation'}
            </h2>
            <p className="text-xs text-[#26312B]/70 mt-0.5">
              Updates will instantly sync to the live store catalogue.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#26312B]/60 hover:text-[#183F32] hover:bg-[#E3EBDD]/40 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {error && (
            <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-medium">
              {error}
            </div>
          )}

          {/* Section 1: Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#183F32] mb-1">
                Product Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Farabi Herbal Oil"
                className="w-full px-3.5 py-2.5 border border-[#AFC7A5]/40 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#183F32]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#183F32] mb-1">
                Urdu Calligraphy / Subtitle (Optional)
              </label>
              <input
                type="text"
                value={urduName}
                onChange={(e) => setUrduName(e.target.value)}
                placeholder="e.g. مقویِ مو ہربل تیل"
                dir="rtl"
                className="w-full px-3.5 py-2.5 border border-[#AFC7A5]/40 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#183F32]"
              />
            </div>

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
                  <option key={c.id || c.name} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Section 2: Pricing & Multi-Currency Options (PKR & USD) */}
          <div className="p-5 bg-[#FAF9F3] rounded-3xl border border-[#AFC7A5]/35 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#AFC7A5]/25">
              <div>
                <span className="block text-xs font-bold uppercase tracking-wider text-[#183F32]">
                  Pricing & Currency Tagging
                </span>
                <p className="text-[11px] text-[#26312B]/70">
                  Tag this remedy with prices in PKR (Rs.) and USD ($), or both for dual currency.
                </p>
              </div>

              {/* Currency Tag Mode Selector */}
              <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-[#AFC7A5]/40 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setCurrencyTag('PKR');
                    setCurrency('PKR');
                  }}
                  className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                    currencyTag === 'PKR'
                      ? 'bg-[#183F32] text-white shadow-2xs'
                      : 'text-[#26312B]/70 hover:text-[#183F32]'
                  }`}
                >
                  🇵🇰 PKR (Rs.)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCurrencyTag('USD');
                    setCurrency('USD');
                  }}
                  className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                    currencyTag === 'USD'
                      ? 'bg-[#183F32] text-white shadow-2xs'
                      : 'text-[#26312B]/70 hover:text-[#183F32]'
                  }`}
                >
                  🇺🇸 USD ($)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCurrencyTag('DUAL');
                    setCurrency('PKR');
                  }}
                  className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                    currencyTag === 'DUAL'
                      ? 'bg-[#183F32] text-white shadow-2xs'
                      : 'text-[#26312B]/70 hover:text-[#183F32]'
                  }`}
                >
                  🌐 Dual (PKR + USD)
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* PKR Price Tag Module */}
              <div className="p-3.5 bg-white rounded-2xl border border-[#AFC7A5]/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#183F32] flex items-center gap-1">
                    <span>🇵🇰 Pakistani Rupee Price (PKR)</span>
                    <span className="text-red-500">*</span>
                  </span>
                  {price && (
                    <button
                      type="button"
                      onClick={() => {
                        const num = Number(price);
                        if (num > 0) {
                          const usdVal = (num / 280).toFixed(2);
                          setPriceUSD(usdVal);
                          if (salePrice && Number(salePrice) > 0) {
                            setSalePriceUSD((Number(salePrice) / 280).toFixed(2));
                          }
                        }
                      }}
                      className="text-[10px] text-[#183F32] hover:underline font-semibold bg-[#E8F1DF]/70 px-2 py-0.5 rounded cursor-pointer"
                      title="Convert PKR to USD at ~280 rate"
                    >
                      ⚡ Auto-calc USD ($)
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#26312B]/60 mb-1">
                      Regular Price (PKR)
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center text-xs font-bold text-[#183F32]">
                        Rs.
                      </span>
                      <input
                        type="number"
                        required
                        min="0"
                        step="any"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="1850"
                        className="w-full pl-9 pr-2.5 py-2 border border-[#AFC7A5]/40 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#183F32] bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#26312B]/60 mb-1">
                      Sale Price (PKR)
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center text-xs font-bold text-[#183F32]">
                        Rs.
                      </span>
                      <input
                        type="number"
                        min="0"
                        step="any"
                        value={salePrice}
                        onChange={(e) => setSalePrice(e.target.value)}
                        placeholder="1650"
                        className="w-full pl-9 pr-2.5 py-2 border border-[#AFC7A5]/40 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#183F32] bg-white"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* USD Price Tag Module */}
              <div className="p-3.5 bg-white rounded-2xl border border-[#AFC7A5]/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#183F32] flex items-center gap-1">
                    <span>🇺🇸 US Dollar Price (USD)</span>
                    <span className="text-[10px] font-normal text-[#26312B]/60">
                      {currencyTag === 'USD' || currencyTag === 'DUAL' ? '(Active)' : '(Optional)'}
                    </span>
                  </span>
                  {priceUSD && (
                    <button
                      type="button"
                      onClick={() => {
                        const num = Number(priceUSD);
                        if (num > 0) {
                          setPrice(String(Math.round(num * 280)));
                          if (salePriceUSD && Number(salePriceUSD) > 0) {
                            setSalePrice(String(Math.round(Number(salePriceUSD) * 280)));
                          }
                        }
                      }}
                      className="text-[10px] text-[#183F32] hover:underline font-semibold bg-[#E8F1DF]/70 px-2 py-0.5 rounded cursor-pointer"
                      title="Convert USD to PKR at ~280 rate"
                    >
                      ⚡ Auto-calc PKR (Rs.)
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#26312B]/60 mb-1">
                      Regular Price (USD)
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center text-xs font-bold text-[#183F32]">
                        $
                      </span>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={priceUSD}
                        onChange={(e) => setPriceUSD(e.target.value)}
                        placeholder="12.00"
                        className="w-full pl-7 pr-2.5 py-2 border border-[#AFC7A5]/40 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#183F32] bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#26312B]/60 mb-1">
                      Sale Price (USD)
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center text-xs font-bold text-[#183F32]">
                        $
                      </span>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={salePriceUSD}
                        onChange={(e) => setSalePriceUSD(e.target.value)}
                        placeholder="9.50"
                        className="w-full pl-7 pr-2.5 py-2 border border-[#AFC7A5]/40 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#183F32] bg-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Volume, Stock & SKU row */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#183F32] mb-1">
                  Volume / Unit Size
                </label>
                <input
                  type="text"
                  value={volume}
                  onChange={(e) => setVolume(e.target.value)}
                  placeholder="100 ml / 50 g"
                  className="w-full px-3 py-2 border border-[#AFC7A5]/40 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#183F32] bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#183F32] mb-1">
                  Stock Units Available
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
                  SKU / Internal Code
                </label>
                <input
                  type="text"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  placeholder="FAR-001"
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
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as Product['status'])}
                  className="w-full px-3 py-2 border border-[#AFC7A5]/40 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#183F32] bg-white cursor-pointer"
                >
                  <option value="active">Active (Visible)</option>
                  <option value="draft">Draft (Hidden)</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Switches (In Stock & Featured) */}
          <div className="flex flex-wrap items-center gap-6 p-4 bg-white rounded-2xl border border-[#AFC7A5]/30">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={inStock}
                onChange={(e) => setInStock(e.target.checked)}
                className="w-4 h-4 text-[#183F32] rounded-md focus:ring-[#183F32]"
              />
              <span className="text-sm font-semibold text-[#183F32]">
                In Stock (Available for Purchase)
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
                Featured Product (Show in Homepage Featured Section)
              </span>
            </label>
          </div>

          {/* Section 4: Images */}
          <div className="space-y-5 p-5 bg-[#FAF9F3]/60 rounded-2xl border border-[#AFC7A5]/30">
            {/* Primary Product Image */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#183F32] flex items-center gap-2">
                  <span>Primary Product Image *</span>
                  {uploadSuccessPrimary && (
                    <span className="text-emerald-700 bg-emerald-100 text-[11px] px-2 py-0.5 rounded-full font-semibold flex items-center gap-1 animate-fade-in">
                      <Check className="w-3 h-3" /> Updated & Saved
                    </span>
                  )}
                  {uploadingPrimary && (
                    <span className="text-amber-800 bg-amber-100 text-[11px] px-2 py-0.5 rounded-full font-semibold flex items-center gap-1 animate-pulse">
                      <Loader2 className="w-3 h-3 animate-spin" /> Optimizing Image...
                    </span>
                  )}
                </label>
                {image && (
                  <button
                    type="button"
                    onClick={() => setImage('')}
                    className="text-xs text-red-600 hover:text-red-700 flex items-center gap-1 font-medium hover:underline cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" /> Remove Image
                  </button>
                )}
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                {image ? (
                  <div className="relative w-28 h-28 rounded-2xl overflow-hidden border-2 border-[#183F32]/20 shrink-0 bg-white shadow-xs group">
                    <img
                      src={image}
                      alt="Primary Product Preview"
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      onError={() => {
                        // ignore broken urls
                      }}
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => setImage('')}
                        title="Remove image"
                        className="p-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-xs"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="w-28 h-28 rounded-2xl border-2 border-dashed border-[#AFC7A5]/60 flex flex-col items-center justify-center text-[#26312B]/40 shrink-0 bg-white/70">
                    <ImageIcon className="w-8 h-8 mb-1" />
                    <span className="text-[10px] font-medium text-center px-1">No Image Yet</span>
                  </div>
                )}

                <div className="flex-1 w-full space-y-2.5">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <label className="px-4 py-2 bg-[#183F32] text-white hover:bg-[#122F26] rounded-xl text-xs font-semibold cursor-pointer transition-all shadow-xs inline-flex items-center gap-2 active:scale-95">
                      {uploadingPrimary ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Optimizing & Uploading...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-3.5 h-3.5" />
                          <span>{image ? 'Change / Replace Image' : 'Upload From Device'}</span>
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

                    {image && (
                      <button
                        type="button"
                        onClick={() => setImage('')}
                        className="px-3 py-2 bg-red-50 text-red-700 hover:bg-red-100 rounded-xl text-xs font-semibold border border-red-200 transition-colors flex items-center gap-1.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Clear Image</span>
                      </button>
                    )}
                  </div>

                  <div>
                    <input
                      type="text"
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                      placeholder="Or paste direct image URL (e.g. https://...)"
                      className="w-full px-3.5 py-2 border border-[#AFC7A5]/40 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#183F32] bg-white"
                    />
                  </div>

                  {/* Botanical Quick Presets */}
                  <div className="pt-1">
                    <span className="text-[11px] font-medium text-[#26312B]/60 flex items-center gap-1 mb-1.5">
                      <Sparkles className="w-3 h-3 text-[#B39359]" /> Quick Botanical Photo Presets:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {BOTANICAL_PRESETS.map((preset) => (
                        <button
                          key={preset.name}
                          type="button"
                          onClick={() => {
                            setImage(preset.url);
                            setUploadSuccessPrimary(true);
                            setTimeout(() => setUploadSuccessPrimary(false), 2500);
                          }}
                          className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                            image === preset.url
                              ? 'bg-[#183F32] text-white border-[#183F32] font-semibold'
                              : 'bg-white hover:bg-[#E3EBDD] text-[#183F32] border-[#AFC7A5]/40'
                          }`}
                        >
                          {preset.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Secondary Product Image (Hover / Detail) */}
            <div className="pt-4 border-t border-[#AFC7A5]/25">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#183F32] flex items-center gap-2">
                  <span>Secondary Image (Detail View / Hover)</span>
                  {uploadSuccessSecondary && (
                    <span className="text-emerald-700 bg-emerald-100 text-[11px] px-2 py-0.5 rounded-full font-semibold flex items-center gap-1 animate-fade-in">
                      <Check className="w-3 h-3" /> Updated
                    </span>
                  )}
                  {uploadingSecondary && (
                    <span className="text-amber-800 bg-amber-100 text-[11px] px-2 py-0.5 rounded-full font-semibold flex items-center gap-1 animate-pulse">
                      <Loader2 className="w-3 h-3 animate-spin" /> Optimizing...
                    </span>
                  )}
                </label>
                {secondaryImage && (
                  <button
                    type="button"
                    onClick={() => setSecondaryImage('')}
                    className="text-xs text-red-600 hover:text-red-700 flex items-center gap-1 font-medium hover:underline cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" /> Remove
                  </button>
                )}
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                {secondaryImage ? (
                  <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-[#183F32]/20 shrink-0 bg-white shadow-xs group">
                    <img
                      src={secondaryImage}
                      alt="Secondary Preview"
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => setSecondaryImage('')}
                        className="p-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-2xl border-2 border-dashed border-[#AFC7A5]/50 flex flex-col items-center justify-center text-[#26312B]/40 shrink-0 bg-white/70">
                    <ImageIcon className="w-6 h-6 mb-0.5" />
                    <span className="text-[9px] font-medium text-center">Optional</span>
                  </div>
                )}

                <div className="flex-1 w-full space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <label className="px-3 py-1.5 bg-[#FAF9F3] border border-[#AFC7A5]/60 hover:bg-[#E3EBDD] text-[#183F32] rounded-xl text-xs font-medium cursor-pointer inline-flex items-center gap-1.5 transition-colors">
                      {uploadingSecondary ? (
                        <>
                          <Loader2 className="w-3 h-3 animate-spin" />
                          <span>Uploading...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-3 h-3" />
                          <span>{secondaryImage ? 'Change Secondary File' : 'Upload Secondary File'}</span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleSecondaryImageFileChange}
                        disabled={uploadingSecondary}
                        className="hidden"
                      />
                    </label>

                    {secondaryImage && (
                      <button
                        type="button"
                        onClick={() => setSecondaryImage('')}
                        className="px-2.5 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl text-xs font-medium border border-red-200 transition-colors"
                      >
                        Clear
                      </button>
                    )}
                  </div>

                  <input
                    type="text"
                    value={secondaryImage}
                    onChange={(e) => setSecondaryImage(e.target.value)}
                    placeholder="Secondary image URL (optional)"
                    className="w-full px-3 py-1.5 border border-[#AFC7A5]/40 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#183F32] bg-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 5: Descriptions */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#183F32] mb-1">
                Short Description (Cards & Previews) *
              </label>
              <textarea
                required
                rows={2}
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                placeholder="A restorative botanical oil handcrafted to nourish scalp and hair vitality..."
                className="w-full px-3.5 py-2.5 border border-[#AFC7A5]/40 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#183F32]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#183F32] mb-1">
                Full Formulation Description (Detail Page)
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detailed herbal breakdown, extraction methodology, and benefits..."
                className="w-full px-3.5 py-2.5 border border-[#AFC7A5]/40 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#183F32]"
              />
            </div>
          </div>

          {/* Section 6: Herbal Wellness Details (Directions, Traditional Use) */}
          <details className="p-4 bg-[#FAF9F3]/60 rounded-2xl border border-[#AFC7A5]/30 group">
            <summary className="text-xs font-bold uppercase tracking-wider text-[#183F32] cursor-pointer flex items-center justify-between">
              <span>Apothecary Details (Usage, Directions & Precautions)</span>
              <span className="text-[#26312B]/40 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="mt-4 space-y-3 pt-3 border-t border-[#AFC7A5]/20">
              <div>
                <label className="block text-xs font-semibold text-[#183F32] mb-1">
                  Traditional Use
                </label>
                <input
                  type="text"
                  value={traditionalUse}
                  onChange={(e) => setTraditionalUse(e.target.value)}
                  placeholder="Historically applied as a warm scalp massage..."
                  className="w-full px-3 py-2 border border-[#AFC7A5]/40 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#183F32] mb-1">
                  Directions for Use
                </label>
                <input
                  type="text"
                  value={directions}
                  onChange={(e) => setDirections(e.target.value)}
                  placeholder="Dispense 8-12 drops and gently massage..."
                  className="w-full px-3 py-2 border border-[#AFC7A5]/40 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#183F32] mb-1">
                  Precautions
                </label>
                <input
                  type="text"
                  value={precautions}
                  onChange={(e) => setPrecautions(e.target.value)}
                  placeholder="Conduct a patch test prior to first use..."
                  className="w-full px-3 py-2 border border-[#AFC7A5]/40 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#183F32] mb-1">
                  Packaging & Storage
                </label>
                <input
                  type="text"
                  value={packagingInfo}
                  onChange={(e) => setPackagingInfo(e.target.value)}
                  placeholder="Supplied in amber UV-protective pharmaceutical glass..."
                  className="w-full px-3 py-2 border border-[#AFC7A5]/40 rounded-xl text-xs"
                />
              </div>
            </div>
          </details>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-[#AFC7A5]/20 flex items-center justify-end gap-3 sticky bottom-0 bg-white py-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-medium text-[#26312B] bg-[#FAF9F3] hover:bg-[#E3EBDD]/40 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || uploadingPrimary || uploadingSecondary}
              className="px-6 py-2.5 bg-[#183F32] hover:bg-[#122F25] text-white text-sm font-semibold rounded-xl transition-colors shadow-sm disabled:opacity-50 cursor-pointer flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>{saving ? 'Saving...' : isEditing ? 'Update Product' : 'Add Product'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
