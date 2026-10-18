import React, { useState, useMemo } from 'react';
import { Product, Category } from '../../types';
import { useStore } from '../../context/StoreContext';
import { ProductFormModal } from './ProductFormModal';
import { ConfirmDialog } from './ConfirmDialog';
import {
  Plus,
  Search,
  Filter,
  Copy,
  Edit2,
  Trash2,
  Star,
  CheckCircle2,
  XCircle,
  Eye,
  Download,
  Code2,
  ShieldCheck,
  Check,
  Sparkles,
  X,
} from 'lucide-react';

interface AdminProductsProps {
  onNotify: (msg: string) => void;
  onPreviewProduct?: (slug: string) => void;
}

export const AdminProducts: React.FC<AdminProductsProps> = ({ onNotify, onPreviewProduct }) => {
  const {
    products,
    categories,
    addProduct,
    updateProduct,
    deleteProduct,
    duplicateProduct,
    toggleProductFeatured,
    toggleProductStatus,
  } = useStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Confirm delete dialog
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        searchTerm === '' ||
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.shortDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.sku && p.sku.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchCategory =
        selectedCategory === 'all' || p.category === selectedCategory;

      const matchStatus =
        selectedStatus === 'all' || p.status === selectedStatus;

      return matchSearch && matchCategory && matchStatus;
    });
  }, [products, searchTerm, selectedCategory, selectedStatus]);

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setIsFormOpen(true);
  };

  const handleSaveProduct = async (productData: Partial<Product>) => {
    if (editingProduct) {
      await updateProduct(editingProduct.id, productData);
      onNotify('Product updated successfully');
    } else {
      await addProduct(productData);
      onNotify('Product added successfully');
    }
  };

  const handleDuplicate = async (p: Product) => {
    try {
      await duplicateProduct(p.id);
      onNotify(`Duplicated ${p.name} as Draft`);
    } catch {
      onNotify('Failed to duplicate product');
    }
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    try {
      await deleteProduct(productToDelete.id);
      onNotify('Product deleted successfully');
    } catch {
      onNotify('Failed to delete product');
    } finally {
      setProductToDelete(null);
    }
  };

  const handleDownloadBackup = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(products, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `farabi-products-backup-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    onNotify('Catalog JSON backup downloaded successfully');
  };

  const generatedCode = useMemo(() => {
    return `import { Product } from '../types';\n\nexport const products: Product[] = ${JSON.stringify(products, null, 2)};\n`;
  }, [products]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
    onNotify('TypeScript code copied to clipboard!');
  };

  return (
    <div className="space-y-6">
      {/* Real-time Sync & Code Safety Status Banner */}
      <div className="bg-[#FAF9F3] border border-[#AFC7A5]/50 p-4 sm:p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#183F32]/10 border border-[#183F32]/20 flex items-center justify-center shrink-0 text-[#183F32] mt-0.5">
            <ShieldCheck className="w-5 h-5 text-[#183F32]" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#E3EBDD] text-[#183F32]">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Real-Time Cloud Sync Active
              </span>
              <span className="text-xs text-[#26312B]/60 font-medium">
                Live on faraabee.com
              </span>
            </div>
            <p className="text-xs text-[#26312B]/80 mt-1 max-w-2xl leading-relaxed">
              <strong>Zero coding required:</strong> Any product, category, price, or picture you add here updates the live store instantly for all visitors. Your core website code, styling, and checkout security remain 100% locked and protected.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 self-end md:self-auto">
          <button
            onClick={handleDownloadBackup}
            title="Download full JSON backup of current catalog"
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-[#FAF9F3] text-[#183F32] border border-[#AFC7A5]/50 text-xs font-semibold rounded-xl shadow-2xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Backup Catalog</span>
          </button>
          <button
            onClick={() => setShowExportModal(true)}
            title="Export products as TypeScript code for repository backup"
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#E3EBDD] hover:bg-[#AFC7A5]/40 text-[#183F32] text-xs font-semibold rounded-xl transition-colors cursor-pointer"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Export Code</span>
          </button>
        </div>
      </div>

      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl shadow-xs border border-[#AFC7A5]/30">
        <div>
          <h2 className="text-xl font-serif font-bold text-[#183F32]">
            Herbal Products & Formulations
          </h2>
          <p className="text-xs text-[#26312B]/70 mt-0.5">
            Manage pricing, inventory, images, and live store catalog visibility.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#183F32] hover:bg-[#122F25] text-white text-sm font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Search & Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-4 rounded-2xl border border-[#AFC7A5]/30 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#26312B]/40" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, SKU, or keywords..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-[#AFC7A5]/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#183F32] bg-[#FAF9F3]/30"
          />
        </div>

        <div className="relative">
          <Filter className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#26312B]/40" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-[#AFC7A5]/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#183F32] bg-white cursor-pointer"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id || c.name} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-3 py-2 text-xs border border-[#AFC7A5]/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#183F32] bg-white cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active (Visible)</option>
            <option value="draft">Draft (Hidden)</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-[#AFC7A5]/30 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#AFC7A5]/25 bg-[#FAF9F3] text-[11px] font-bold uppercase tracking-wider text-[#183F32]">
                <th className="py-3.5 px-4">Product</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4">Stock</th>
                <th className="py-3.5 px-4 text-center">Featured</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#AFC7A5]/15 text-xs text-[#26312B]">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#26312B]/60">
                    No products found matching your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const isDiscounted = p.salePrice && p.salePrice < p.price;
                  return (
                    <tr key={p.id} className="hover:bg-[#FAF9F3]/60 transition-colors">
                      {/* Column 1: Image & Name */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-12 h-12 rounded-xl object-cover border border-[#AFC7A5]/30 shrink-0 bg-[#FAF9F3]"
                          />
                          <div>
                            <div className="font-semibold text-[#183F32] flex items-center gap-1.5">
                              <span>{p.name}</span>
                              {p.urduName && (
                                <span className="text-[10px] text-[#26312B]/50 font-serif" dir="rtl">
                                  {p.urduName}
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-[#26312B]/50 flex items-center gap-2 mt-0.5">
                              {p.sku && <span>SKU: {p.sku}</span>}
                              {p.volume && <span>• {p.volume}</span>}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Column 2: Category */}
                      <td className="py-3 px-4 font-medium text-[#26312B]/80">
                        {p.category}
                      </td>

                      {/* Column 3: Price */}
                      <td className="py-3 px-4 font-medium">
                        {isDiscounted ? (
                          <div>
                            <span className="font-bold text-[#183F32]">
                              {p.currency || 'PKR'} {p.salePrice?.toLocaleString()}
                            </span>
                            <span className="block text-[10px] text-[#26312B]/40 line-through">
                              {p.currency || 'PKR'} {p.price.toLocaleString()}
                            </span>
                          </div>
                        ) : (
                          <span className="font-bold text-[#183F32]">
                            {p.currency || 'PKR'} {p.price.toLocaleString()}
                          </span>
                        )}
                        {p.priceUSD !== undefined && p.priceUSD > 0 && (
                          <span className="inline-block mt-0.5 text-[10px] font-semibold text-emerald-800 bg-[#E8F1DF] px-1.5 py-0.2 rounded-md">
                            ${p.salePriceUSD && p.salePriceUSD > 0 ? p.salePriceUSD : p.priceUSD} USD
                          </span>
                        )}
                      </td>

                      {/* Column 4: Stock */}
                      <td className="py-3 px-4">
                        {p.inStock ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>In Stock ({p.stockQuantity ?? 50})</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-red-50 text-red-800 border border-red-200">
                            <XCircle className="w-3 h-3 text-red-600" />
                            <span>Out of Stock</span>
                          </span>
                        )}
                      </td>

                      {/* Column 5: Featured Toggle */}
                      <td className="py-3 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => toggleProductFeatured(p.id, p.featured)}
                          title={p.featured ? 'Featured on Homepage (Click to disable)' : 'Not Featured (Click to enable)'}
                          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                            p.featured
                              ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                              : 'text-[#26312B]/30 hover:bg-[#FAF9F3] hover:text-amber-600'
                          }`}
                        >
                          <Star className={`w-4 h-4 ${p.featured ? 'fill-amber-500' : ''}`} />
                        </button>
                      </td>

                      {/* Column 6: Status Toggle */}
                      <td className="py-3 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => toggleProductStatus(p.id, p.status)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                            p.status === 'active'
                              ? 'bg-[#E3EBDD] text-[#183F32] hover:bg-[#AFC7A5]/50'
                              : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
                          }`}
                        >
                          {p.status}
                        </button>
                      </td>

                      {/* Column 7: Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {onPreviewProduct && (
                            <button
                              type="button"
                              onClick={() => onPreviewProduct(p.slug)}
                              title="View on store"
                              className="p-1.5 text-[#26312B]/60 hover:text-[#183F32] hover:bg-[#E3EBDD]/40 rounded-lg transition-colors cursor-pointer"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleDuplicate(p)}
                            title="Duplicate product"
                            className="p-1.5 text-[#26312B]/60 hover:text-[#183F32] hover:bg-[#E3EBDD]/40 rounded-lg transition-colors cursor-pointer"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(p)}
                            title="Edit product"
                            className="p-1.5 text-[#26312B]/60 hover:text-[#183F32] hover:bg-[#E3EBDD]/40 rounded-lg transition-colors cursor-pointer"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setProductToDelete(p)}
                            title="Delete product"
                            className="p-1.5 text-[#26312B]/60 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Form Modal */}
      {isFormOpen && (
        <ProductFormModal
          isOpen={isFormOpen}
          product={editingProduct}
          categories={categories}
          onClose={() => setIsFormOpen(false)}
          onSave={handleSaveProduct}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!productToDelete}
        title="Delete Product"
        message={`Are you sure you want to delete "${productToDelete?.name}"? This action cannot be undone and will immediately remove this product from the live store.`}
        confirmLabel="Delete Permanently"
        isDestructive={true}
        onConfirm={handleConfirmDelete}
        onCancel={() => setProductToDelete(null)}
      />

      {/* Code Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-[#AFC7A5]/40 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-[#AFC7A5]/25">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#E3EBDD] flex items-center justify-center text-[#183F32]">
                  <Code2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-serif font-bold text-[#183F32]">
                    Sync Catalog to Code (`src/data/products.ts`)
                  </h3>
                  <p className="text-xs text-[#26312B]/70">
                    Optional: Copy this formatted code to update your offline repository backup.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowExportModal(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#26312B]/60 hover:text-[#183F32] hover:bg-[#FAF9F3] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <div className="p-3 bg-[#FAF9F3] rounded-xl border border-[#AFC7A5]/30 text-xs text-[#26312B]/80 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-[#183F32] shrink-0 mt-0.5" />
                <span>
                  <strong>Tip:</strong> Your live store on <strong>faraabee.com</strong> already shows your latest products automatically via Cloud Firestore. You only need this if you want to hardcode your latest catalog into your GitHub repository files.
                </span>
              </div>

              <div className="relative">
                <pre className="p-4 bg-[#122F25] text-[#FAF9F3] font-mono text-[11px] rounded-2xl max-h-64 overflow-y-auto leading-relaxed select-all">
                  {generatedCode}
                </pre>
                <button
                  onClick={handleCopyCode}
                  className="absolute top-3 right-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF9F3] text-[#183F32] hover:bg-white text-xs font-bold rounded-lg shadow-sm transition-all"
                >
                  {copiedCode ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-[#AFC7A5]/25">
              <button
                onClick={() => setShowExportModal(false)}
                className="px-4 py-2 text-xs font-semibold text-[#26312B]/70 hover:text-[#183F32] transition-colors"
              >
                Close
              </button>
              <button
                onClick={handleCopyCode}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#183F32] hover:bg-[#122F25] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? 'Copied to Clipboard' : 'Copy All Code'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
