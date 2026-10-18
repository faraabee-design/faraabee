import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Review } from '../../types';
import {
  Star,
  ShieldCheck,
  Check,
  X,
  Trash2,
  Plus,
  MessageSquare,
  ThumbsUp,
  MapPin,
  Clock,
} from 'lucide-react';

interface AdminReviewsProps {
  onNotify: (msg: string) => void;
}

export const AdminReviews: React.FC<AdminReviewsProps> = ({ onNotify }) => {
  const { reviews, addReview, approveReview, deleteReview, products } = useStore();
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('all');
  const [isCreating, setIsCreating] = useState(false);

  // Form states for manual review
  const [author, setAuthor] = useState('');
  const [city, setCity] = useState('');
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [usageDuration, setUsageDuration] = useState('Used for 3 weeks');
  const [productId, setProductId] = useState('farabi-herbal-oil');

  const filteredReviews = reviews.filter((r) => {
    if (filter === 'pending') return !r.approved;
    if (filter === 'approved') return r.approved;
    return true;
  });

  const averageRating = reviews.length > 0
    ? (reviews.reduce((acc, cur) => acc + cur.rating, 0) / reviews.length).toFixed(1)
    : '5.0';

  const handleCreateReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !comment.trim()) return;

    const matchedProduct = products.find((p) => p.id === productId || p.slug === productId);

    await addReview({
      productId,
      productName: matchedProduct ? matchedProduct.name : 'Farabi Herbal Oil',
      author: author.trim(),
      city: city.trim() || 'Pakistan',
      rating,
      title: title.trim(),
      comment: comment.trim(),
      usageDuration,
      verifiedBuyer: true,
      approved: true,
    });

    onNotify('Customer Review added and published.');
    setIsCreating(false);
    setAuthor('');
    setCity('');
    setTitle('');
    setComment('');
  };

  const handleToggleApprove = async (id: string, current: boolean) => {
    await approveReview(id, !current);
    onNotify(!current ? 'Review approved for public display.' : 'Review hidden from store.');
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this review permanently?')) {
      await deleteReview(id);
      onNotify('Review deleted.');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#AFC7A5]/35 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E3EBDD] text-[#183F32] text-xs font-bold uppercase tracking-wider mb-2">
            <Star className="w-3.5 h-3.5 fill-[#183F32] text-[#183F32]" />
            <span>Patron Experiences</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#183F32]">
            Customer Reviews & Shifa Testimonials
          </h2>
          <p className="text-xs sm:text-sm text-[#26312B]/75 mt-1 max-w-xl">
            Moderate submitted reviews, publish new authentic feedback, and manage verified buyer testimonials displayed across the store.
          </p>
        </div>

        {!isCreating && (
          <button
            onClick={() => setIsCreating(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#183F32] text-white hover:bg-[#285844] text-xs font-bold shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Verified Review</span>
          </button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#AFC7A5]/30">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#26312B]/60">Total Reviews</span>
          <p className="text-2xl font-bold text-[#183F32] mt-1">{reviews.length}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-[#AFC7A5]/30">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#26312B]/60">Average Score</span>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-2xl font-bold text-[#183F32]">{averageRating}</span>
            <div className="flex text-amber-500">
              <Star className="w-4 h-4 fill-amber-500" />
            </div>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-[#AFC7A5]/30">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#26312B]/60">Approved / Live</span>
          <p className="text-2xl font-bold text-emerald-700 mt-1">
            {reviews.filter((r) => r.approved).length}
          </p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-[#AFC7A5]/30">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#26312B]/60">Pending Moderation</span>
          <p className="text-2xl font-bold text-amber-600 mt-1">
            {reviews.filter((r) => !r.approved).length}
          </p>
        </div>
      </div>

      {/* Manual Creation Form */}
      {isCreating && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#183F32]/40 shadow-lg animate-fade-in">
          <div className="flex items-center justify-between pb-4 border-b border-[#AFC7A5]/30 mb-6">
            <h3 className="font-serif text-xl font-bold text-[#183F32]">
              Record Verified Customer Review
            </h3>
            <button
              onClick={() => setIsCreating(false)}
              className="p-1.5 text-[#26312B]/60 hover:text-[#183F32] rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleCreateReview} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#183F32] mb-1">
                  Customer Name *
                </label>
                <input
                  type="text"
                  required
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="e.g. Tariq Mehmood"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#AFC7A5]/40 focus:border-[#183F32] outline-hidden bg-[#FAF9F3]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#183F32] mb-1">
                  City
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Lahore / Islamabad"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#AFC7A5]/40 focus:border-[#183F32] outline-hidden bg-[#FAF9F3]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#183F32] mb-1">
                  Product
                </label>
                <select
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#AFC7A5]/40 focus:border-[#183F32] outline-hidden bg-[#FAF9F3]"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.slug}>
                      {p.name}
                    </option>
                  ))}
                  <option value="farabi-general">General Apothecary Experience</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#183F32] mb-1">
                  Rating
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      type="button"
                      key={s}
                      onClick={() => setRating(s)}
                      className="p-1 cursor-pointer"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          s <= rating ? 'fill-amber-500 text-amber-500' : 'text-[#26312B]/20'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-[#183F32] ml-2">{rating} Stars</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#183F32] mb-1">
                  Usage Duration
                </label>
                <input
                  type="text"
                  value={usageDuration}
                  onChange={(e) => setUsageDuration(e.target.value)}
                  placeholder="e.g. Used for 3 weeks"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#AFC7A5]/40 focus:border-[#183F32] outline-hidden bg-[#FAF9F3]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#183F32] mb-1">
                Headline *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Remarkable scalp softness within 2 weeks"
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#AFC7A5]/40 focus:border-[#183F32] outline-hidden bg-[#FAF9F3]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#183F32] mb-1">
                Comment / Feedback *
              </label>
              <textarea
                rows={3}
                required
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write client testimonial..."
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#AFC7A5]/40 focus:border-[#183F32] outline-hidden bg-[#FAF9F3]"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#AFC7A5]/30">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 text-xs font-semibold text-[#26312B]/70 hover:text-[#183F32] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[#183F32] text-white hover:bg-[#285844] text-xs font-bold shadow-xs cursor-pointer"
              >
                Publish Review
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
            filter === 'all'
              ? 'bg-[#183F32] text-white'
              : 'bg-white border border-[#AFC7A5]/40 text-[#26312B] hover:bg-[#FAF9F3]'
          }`}
        >
          All ({reviews.length})
        </button>
        <button
          onClick={() => setFilter('approved')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
            filter === 'approved'
              ? 'bg-[#183F32] text-white'
              : 'bg-white border border-[#AFC7A5]/40 text-[#26312B] hover:bg-[#FAF9F3]'
          }`}
        >
          Approved & Live ({reviews.filter((r) => r.approved).length})
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
            filter === 'pending'
              ? 'bg-[#183F32] text-white'
              : 'bg-white border border-[#AFC7A5]/40 text-[#26312B] hover:bg-[#FAF9F3]'
          }`}
        >
          Pending Moderation ({reviews.filter((r) => !r.approved).length})
        </button>
      </div>

      {/* Reviews Table / Cards */}
      <div className="space-y-4">
        {filteredReviews.map((rev) => (
          <div
            key={rev.id}
            className="bg-white rounded-3xl p-6 border border-[#AFC7A5]/35 shadow-xs flex flex-col sm:flex-row items-start justify-between gap-4"
          >
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex text-amber-500">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-3.5 h-3.5 ${
                        s <= rev.rating ? 'fill-amber-500' : 'text-[#26312B]/20'
                      }`}
                    />
                  ))}
                </div>
                <span className="font-serif font-bold text-base text-[#183F32]">
                  {rev.title}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                    rev.approved
                      ? 'bg-emerald-50 text-emerald-800'
                      : 'bg-amber-50 text-amber-800'
                  }`}
                >
                  {rev.approved ? 'Live on Store' : 'Hidden'}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-[#26312B]/85 leading-relaxed">
                "{rev.comment}"
              </p>

              <div className="flex items-center gap-3 text-xs text-[#26312B]/60 flex-wrap">
                <span className="font-bold text-[#183F32]">{rev.author}</span>
                {rev.city && (
                  <span className="flex items-center gap-1 text-[#285844]">
                    <MapPin className="w-2.5 h-2.5" />
                    <span>{rev.city}</span>
                  </span>
                )}
                {rev.productName && (
                  <span className="bg-[#FAF9F3] px-2 py-0.5 rounded-md border border-[#AFC7A5]/30 text-[#183F32]">
                    {rev.productName}
                  </span>
                )}
                {rev.usageDuration && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#183F32]" />
                    <span>{rev.usageDuration}</span>
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
              <button
                onClick={() => handleToggleApprove(rev.id, rev.approved)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer inline-flex items-center gap-1 ${
                  rev.approved
                    ? 'border border-amber-300 text-amber-800 hover:bg-amber-50'
                    : 'bg-emerald-700 text-white hover:bg-emerald-800'
                }`}
              >
                {rev.approved ? (
                  <>
                    <X className="w-3.5 h-3.5" />
                    <span>Hide</span>
                  </>
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Approve & Show</span>
                  </>
                )}
              </button>

              <button
                onClick={() => handleDelete(rev.id)}
                className="p-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 cursor-pointer"
                title="Delete"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
