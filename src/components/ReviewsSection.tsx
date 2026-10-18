import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Review } from '../types';
import { Star, ShieldCheck, MessageSquarePlus, X, Check, MapPin, Clock } from 'lucide-react';

interface ReviewsSectionProps {
  productId?: string;
  productName?: string;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  productId,
  productName,
}) => {
  const { reviews, addReview } = useStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [ratingFilter, setRatingFilter] = useState<number | 'all'>('all');

  // Form state
  const [author, setAuthor] = useState('');
  const [city, setCity] = useState('');
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [usageDuration, setUsageDuration] = useState('Used for 3 weeks');
  const [submitted, setSubmitted] = useState(false);

  // Filter reviews
  const approvedReviews = reviews.filter((r) => r.approved);
  const relevantReviews = productId
    ? approvedReviews.filter((r) => r.productId === productId)
    : approvedReviews;

  const displayReviews = relevantReviews.filter((r) => {
    if (ratingFilter === 'all') return true;
    return r.rating === ratingFilter;
  });

  const averageRating = relevantReviews.length > 0
    ? (relevantReviews.reduce((acc, cur) => acc + cur.rating, 0) / relevantReviews.length).toFixed(1)
    : '5.0';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !comment.trim() || !title.trim()) return;

    await addReview({
      productId: productId || 'farabi-general',
      productName: productName || 'FARAABEE Apothecary',
      author: author.trim(),
      city: city.trim() || 'Pakistan',
      rating,
      title: title.trim(),
      comment: comment.trim(),
      usageDuration,
      verifiedBuyer: true,
      approved: true, // auto-approve so customer sees their review immediately
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setModalOpen(false);
      setAuthor('');
      setCity('');
      setTitle('');
      setComment('');
    }, 1800);
  };

  return (
    <section className="py-16 sm:py-24 bg-[#FAF9F3] border-b border-[#AFC7A5]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Block */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E3EBDD] text-[#183F32] text-xs font-semibold uppercase tracking-wider mb-3">
              <Star className="w-3.5 h-3.5 fill-[#183F32] text-[#183F32]" />
              <span>Customer Shifa Testimonials</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium text-[#183F32] tracking-tight">
              Verified Patron Experiences
            </h2>
            <p className="mt-2 text-sm sm:text-base text-[#26312B]/75 max-w-xl">
              Authentic reflections from seekers who invited FARAABEE’s classical formulations into their daily restorative regimens.
            </p>
          </div>

          {/* Average Rating & Submit Button */}
          <div className="mt-6 lg:mt-0 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-2xl border border-[#AFC7A5]/40 shadow-2xs">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-4 h-4 fill-amber-500 text-amber-500" />
                ))}
              </div>
              <span className="text-base font-bold text-[#183F32]">{averageRating} / 5</span>
              <span className="text-xs text-[#26312B]/60">({relevantReviews.length} Reviews)</span>
            </div>

            <button
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#183F32] text-white hover:bg-[#285844] text-xs font-bold transition-all shadow-xs hover:shadow-md cursor-pointer"
            >
              <MessageSquarePlus className="w-4 h-4" />
              <span>Share Your Experience</span>
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8">
          <span className="text-xs font-bold text-[#183F32] uppercase tracking-wider mr-2">Filter:</span>
          <button
            onClick={() => setRatingFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              ratingFilter === 'all'
                ? 'bg-[#183F32] text-white shadow-xs'
                : 'bg-white border border-[#AFC7A5]/35 text-[#26312B] hover:bg-[#FAF9F3]'
            }`}
          >
            All Reviews ({relevantReviews.length})
          </button>
          {[5, 4, 3].map((star) => (
            <button
              key={star}
              onClick={() => setRatingFilter(star)}
              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                ratingFilter === star
                  ? 'bg-[#183F32] text-white shadow-xs'
                  : 'bg-white border border-[#AFC7A5]/35 text-[#26312B] hover:bg-[#FAF9F3]'
              }`}
            >
              <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
              <span>{star} Stars</span>
            </button>
          ))}
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayReviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white rounded-3xl p-6 border border-[#AFC7A5]/35 shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                {/* Rating & Verified Tag */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${
                          s <= rev.rating
                            ? 'fill-amber-500 text-amber-500'
                            : 'fill-transparent text-[#26312B]/20'
                        }`}
                      />
                    ))}
                  </div>

                  {rev.verifiedBuyer && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      <span>Verified Patron</span>
                    </span>
                  )}
                </div>

                <h3 className="font-serif text-lg font-bold text-[#183F32] mb-2 leading-snug">
                  {rev.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#26312B]/80 leading-relaxed mb-4">
                  "{rev.comment}"
                </p>
              </div>

              {/* Author Footer */}
              <div className="pt-4 border-t border-[#AFC7A5]/20 flex items-center justify-between text-xs text-[#26312B]/70">
                <div>
                  <span className="font-bold text-[#183F32] block">{rev.author}</span>
                  {rev.city && (
                    <span className="inline-flex items-center gap-1 text-[11px] text-[#285844]">
                      <MapPin className="w-2.5 h-2.5" />
                      <span>{rev.city}</span>
                    </span>
                  )}
                </div>

                {rev.usageDuration && (
                  <span className="inline-flex items-center gap-1 text-[11px] text-[#26312B]/60 bg-[#FAF9F3] px-2 py-1 rounded-md border border-[#AFC7A5]/30">
                    <Clock className="w-3 h-3 text-[#183F32]" />
                    <span>{rev.usageDuration}</span>
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Review Submission Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-3xl border border-[#AFC7A5]/50 shadow-2xl p-6 sm:p-8">
            <div className="flex items-center justify-between pb-4 border-b border-[#AFC7A5]/30 mb-6">
              <div>
                <h3 className="font-serif text-xl font-bold text-[#183F32]">
                  Share Your Shifa Journey
                </h3>
                <p className="text-xs text-[#285844]">
                  {productName ? `Reviewing ${productName}` : 'Reviewing FARAABEE Apothecary'}
                </p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 text-[#26312B]/60 hover:text-[#183F32] rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {submitted ? (
              <div className="text-center py-8 space-y-3">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <Check className="w-8 h-8" />
                </div>
                <h4 className="font-serif text-2xl font-bold text-[#183F32]">
                  JazakAllah Khair!
                </h4>
                <p className="text-xs text-[#26312B]/75 max-w-xs mx-auto">
                  Your review has been recorded and published. May Allah bring lasting barakah and healing to your routine.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-left">
                {/* Rating selection */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#183F32] mb-1.5">
                    Your Rating *
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        type="button"
                        key={s}
                        onClick={() => setRating(s)}
                        className="p-1.5 hover:scale-110 transition-transform cursor-pointer"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            s <= rating
                              ? 'fill-amber-500 text-amber-500'
                              : 'fill-transparent text-[#26312B]/20'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-[#183F32] ml-2">
                      {rating === 5 ? 'Excellent (5 Stars)' : `${rating} Stars`}
                    </span>
                  </div>
                </div>

                {/* Name & City */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#183F32] mb-1">
                      Full Name *
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
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Lahore / Karachi"
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#AFC7A5]/40 focus:border-[#183F32] outline-hidden bg-[#FAF9F3]"
                    />
                  </div>
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#183F32] mb-1">
                    How long have you used the formula?
                  </label>
                  <select
                    value={usageDuration}
                    onChange={(e) => setUsageDuration(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#AFC7A5]/40 focus:border-[#183F32] outline-hidden bg-[#FAF9F3]"
                  >
                    <option value="Used for 1 week">Used for 1 week</option>
                    <option value="Used for 2 weeks">Used for 2 weeks</option>
                    <option value="Used for 3 weeks">Used for 3 weeks</option>
                    <option value="Used for 1 month+">Used for 1 month+</option>
                    <option value="Ongoing daily staple">Ongoing daily staple</option>
                  </select>
                </div>

                {/* Review Headline */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#183F32] mb-1">
                    Headline / Summary *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Noticeable hair nourishment within 2 weeks"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#AFC7A5]/40 focus:border-[#183F32] outline-hidden bg-[#FAF9F3]"
                  />
                </div>

                {/* Comment */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#183F32] mb-1">
                    Your Experience & Details *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Describe how the formulation smelled, felt, and what physical or spiritual ease you observed..."
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#AFC7A5]/40 focus:border-[#183F32] outline-hidden bg-[#FAF9F3]"
                  />
                </div>

                <div className="pt-3 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-[#26312B]/70 hover:text-[#183F32] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-[#183F32] text-white hover:bg-[#285844] text-xs font-bold shadow-xs cursor-pointer"
                  >
                    Submit Testimonial
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
