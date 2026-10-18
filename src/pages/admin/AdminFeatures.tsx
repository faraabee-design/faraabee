import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { HikmatCard, AudioTrack } from '../../types';
import {
  BookOpen,
  Music,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Volume2,
  Sparkles,
  Link,
} from 'lucide-react';

interface AdminFeaturesProps {
  onNotify: (msg: string) => void;
}

export const AdminFeatures: React.FC<AdminFeaturesProps> = ({ onNotify }) => {
  const { hikmatCards, addHikmatCard, updateHikmatCard, deleteHikmatCard, audioTracks, updateAudioTracks, products } = useStore();

  const [activeSubTab, setActiveSubTab] = useState<'hikmat' | 'audio'>('hikmat');

  // Hikmat form states
  const [editingHikmat, setEditingHikmat] = useState<HikmatCard | null>(null);
  const [isCreatingHikmat, setIsCreatingHikmat] = useState(false);
  const [hTitle, setHTitle] = useState('');
  const [hUrduTitle, setHUrduTitle] = useState('');
  const [hRef, setHRef] = useState('');
  const [hHadith, setHHadith] = useState('');
  const [hUrduHadith, setHUrduHadith] = useState('');
  const [hHerb, setHHerb] = useState('');
  const [hModern, setHModern] = useState('');
  const [hSlug, setHSlug] = useState('farabi-herbal-oil');

  // Audio track states
  const [tracks, setTracks] = useState<AudioTrack[]>(audioTracks);
  const [newTitle, setNewTitle] = useState('');
  const [newUrduTitle, setNewUrduTitle] = useState('');
  const [newReciter, setNewReciter] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newDuration, setNewDuration] = useState('2:30');
  const [newCategory, setNewCategory] = useState<'quran' | 'ruqyah' | 'adhkar'>('quran');

  const startCreateHikmat = () => {
    setHTitle('');
    setHUrduTitle('');
    setHRef('Sahih al-Bukhari');
    setHHadith('');
    setHUrduHadith('');
    setHHerb('Nigella Sativa (Kalonji)');
    setHModern('');
    setHSlug('farabi-herbal-oil');
    setIsCreatingHikmat(true);
    setEditingHikmat(null);
  };

  const startEditHikmat = (card: HikmatCard) => {
    setEditingHikmat(card);
    setHTitle(card.title);
    setHUrduTitle(card.urduTitle || '');
    setHRef(card.propheticReference);
    setHHadith(card.hadithText);
    setHUrduHadith(card.urduHadithText || '');
    setHHerb(card.botanicalHerb);
    setHModern(card.modernSignificance);
    setHSlug(card.relatedProductSlug || 'farabi-herbal-oil');
    setIsCreatingHikmat(false);
  };

  const handleSaveHikmat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hTitle.trim() || !hHadith.trim()) return;

    if (isCreatingHikmat) {
      await addHikmatCard({
        title: hTitle.trim(),
        urduTitle: hUrduTitle.trim(),
        propheticReference: hRef.trim(),
        hadithText: hHadith.trim(),
        urduHadithText: hUrduHadith.trim(),
        botanicalHerb: hHerb.trim(),
        modernSignificance: hModern.trim(),
        relatedProductSlug: hSlug,
        active: true,
      });
      onNotify('Hikmat Card created successfully.');
    } else if (editingHikmat) {
      await updateHikmatCard(editingHikmat.id, {
        title: hTitle.trim(),
        urduTitle: hUrduTitle.trim(),
        propheticReference: hRef.trim(),
        hadithText: hHadith.trim(),
        urduHadithText: hUrduHadith.trim(),
        botanicalHerb: hHerb.trim(),
        modernSignificance: hModern.trim(),
        relatedProductSlug: hSlug,
      });
      onNotify('Hikmat Card updated.');
    }

    setIsCreatingHikmat(false);
    setEditingHikmat(null);
  };

  const handleDeleteHikmat = async (id: string) => {
    if (confirm('Delete this Prophetic Hikmat Card?')) {
      await deleteHikmatCard(id);
      onNotify('Hikmat Card deleted.');
    }
  };

  // Audio track management
  const handleAddTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newUrl.trim()) return;

    const newTrack: AudioTrack = {
      id: `track-${Date.now()}`,
      title: newTitle.trim(),
      urduTitle: newUrduTitle.trim(),
      reciter: newReciter.trim(),
      url: newUrl.trim(),
      duration: newDuration.trim(),
      category: newCategory,
      active: true,
    };

    const updated = [...tracks, newTrack];
    setTracks(updated);
    await updateAudioTracks(updated);
    onNotify('Audio track added to sanctuary player.');

    setNewTitle('');
    setNewUrduTitle('');
    setNewReciter('');
    setNewUrl('');
  };

  const handleToggleTrackActive = async (id: string) => {
    const updated = tracks.map((t) => (t.id === id ? { ...t, active: !t.active } : t));
    setTracks(updated);
    await updateAudioTracks(updated);
    onNotify('Audio track status updated.');
  };

  const handleDeleteTrack = async (id: string) => {
    if (confirm('Remove this track from Audio Sanctuary?')) {
      const updated = tracks.filter((t) => t.id !== id);
      setTracks(updated);
      await updateAudioTracks(updated);
      onNotify('Track removed.');
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#AFC7A5]/35 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E3EBDD] text-[#183F32] text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#285844]" />
            <span>Storefront Wisdom & Spiritual Audio</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#183F32]">
            Prophetic Wisdom & Audio Sanctuary
          </h2>
          <p className="text-xs sm:text-sm text-[#26312B]/75 mt-1 max-w-xl">
            Customize Tibb-e-Nabawi cards (Hadith references, Urdu translations, science notes) and Quranic Ruqyah audio tracks.
          </p>
        </div>

        {/* Sub-tab pills */}
        <div className="flex items-center gap-2 bg-[#FAF9F3] p-1.5 rounded-2xl border border-[#AFC7A5]/35">
          <button
            onClick={() => setActiveSubTab('hikmat')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'hikmat'
                ? 'bg-[#183F32] text-white shadow-xs'
                : 'text-[#26312B] hover:text-[#183F32]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Tibb Wisdom Cards</span>
          </button>
          <button
            onClick={() => setActiveSubTab('audio')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'audio'
                ? 'bg-[#183F32] text-white shadow-xs'
                : 'text-[#26312B] hover:text-[#183F32]'
            }`}
          >
            <Music className="w-3.5 h-3.5" />
            <span>Audio Sanctuary</span>
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: Hikmat Wisdom Cards */}
      {activeSubTab === 'hikmat' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-xl font-bold text-[#183F32]">
              Tibb-e-Nabawi Cards ({hikmatCards.length})
            </h3>
            {!isCreatingHikmat && !editingHikmat && (
              <button
                onClick={startCreateHikmat}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#183F32] text-white hover:bg-[#285844] text-xs font-bold cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Wisdom Card</span>
              </button>
            )}
          </div>

          {/* Form */}
          {(isCreatingHikmat || editingHikmat) && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#183F32]/40 shadow-lg animate-fade-in">
              <div className="flex items-center justify-between pb-4 border-b border-[#AFC7A5]/30 mb-6">
                <h4 className="font-serif text-lg font-bold text-[#183F32]">
                  {isCreatingHikmat ? 'New Tibb-e-Nabawi Card' : `Edit: ${editingHikmat?.title}`}
                </h4>
                <button
                  onClick={() => {
                    setIsCreatingHikmat(false);
                    setEditingHikmat(null);
                  }}
                  className="p-1.5 text-[#26312B]/60 hover:text-[#183F32] cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveHikmat} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#183F32] mb-1">
                      Title (English) *
                    </label>
                    <input
                      type="text"
                      required
                      value={hTitle}
                      onChange={(e) => setHTitle(e.target.value)}
                      placeholder="e.g. The Prophetic Panacea: Black Seed"
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#AFC7A5]/40 focus:border-[#183F32] outline-hidden bg-[#FAF9F3]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#183F32] mb-1">
                      Urdu Title (اردو عنوان)
                    </label>
                    <input
                      type="text"
                      value={hUrduTitle}
                      onChange={(e) => setHUrduTitle(e.target.value)}
                      placeholder="طبِ نبوی میں کلونجی کی برکت و شفا"
                      dir="rtl"
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#AFC7A5]/40 focus:border-[#183F32] outline-hidden bg-[#FAF9F3] font-urdu text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#183F32] mb-1">
                      Hadith Reference *
                    </label>
                    <input
                      type="text"
                      required
                      value={hRef}
                      onChange={(e) => setHRef(e.target.value)}
                      placeholder="e.g. Sahih al-Bukhari #5688"
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#AFC7A5]/40 focus:border-[#183F32] outline-hidden bg-[#FAF9F3]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#183F32] mb-1">
                      Botanical Herb *
                    </label>
                    <input
                      type="text"
                      required
                      value={hHerb}
                      onChange={(e) => setHHerb(e.target.value)}
                      placeholder="e.g. Nigella Sativa (Kalonji)"
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#AFC7A5]/40 focus:border-[#183F32] outline-hidden bg-[#FAF9F3]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#183F32] mb-1">
                      Associated Product
                    </label>
                    <select
                      value={hSlug}
                      onChange={(e) => setHSlug(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#AFC7A5]/40 focus:border-[#183F32] outline-hidden bg-[#FAF9F3]"
                    >
                      {products.map((p) => (
                        <option key={p.id} value={p.slug}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#183F32] mb-1">
                    Hadith Text (English) *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={hHadith}
                    onChange={(e) => setHHadith(e.target.value)}
                    placeholder="The Prophet (ﷺ) said: In the black seed there is healing for every disease except death."
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#AFC7A5]/40 focus:border-[#183F32] outline-hidden bg-[#FAF9F3]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#183F32] mb-1">
                    Urdu Hadith Text (اردو ترجمہ)
                  </label>
                  <textarea
                    rows={2}
                    value={hUrduHadith}
                    onChange={(e) => setHUrduHadith(e.target.value)}
                    placeholder="نبی کریم ﷺ نے فرمایا: کلونجی میں موت کے سوا ہر بیماری سے شفا ہے۔"
                    dir="rtl"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#AFC7A5]/40 focus:border-[#183F32] outline-hidden bg-[#FAF9F3] font-urdu text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#183F32] mb-1">
                    Modern Pharmacological Rationale *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={hModern}
                    onChange={(e) => setHModern(e.target.value)}
                    placeholder="Rich in Thymoquinone, clinical studies confirm its exceptional anti-inflammatory..."
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#AFC7A5]/40 focus:border-[#183F32] outline-hidden bg-[#FAF9F3]"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#AFC7A5]/30">
                  <button
                    type="button"
                    onClick={() => {
                      setIsCreatingHikmat(false);
                      setEditingHikmat(null);
                    }}
                    className="px-4 py-2 text-xs font-semibold text-[#26312B]/70 hover:text-[#183F32] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-[#183F32] text-white hover:bg-[#285844] text-xs font-bold shadow-xs cursor-pointer"
                  >
                    Save Card
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Cards List */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {hikmatCards.map((card) => (
              <div
                key={card.id}
                className="bg-white rounded-3xl p-6 border border-[#AFC7A5]/35 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#183F32] bg-[#FAF9F3] px-2 py-0.5 rounded-md border border-[#AFC7A5]/30">
                    {card.propheticReference}
                  </span>
                  <h4 className="font-serif text-lg font-bold text-[#183F32] mt-2">
                    {card.title}
                  </h4>
                  {card.urduTitle && (
                    <p className="font-urdu text-sm text-[#285844] mt-0.5" dir="rtl">
                      {card.urduTitle}
                    </p>
                  )}
                  <p className="text-xs text-[#26312B]/80 italic mt-3 line-clamp-2">
                    "{card.hadithText}"
                  </p>
                </div>

                <div className="pt-4 border-t border-[#AFC7A5]/25 flex items-center justify-end gap-2 mt-4">
                  <button
                    onClick={() => startEditHikmat(card)}
                    className="p-2 rounded-xl border border-[#AFC7A5]/40 hover:bg-[#FAF9F3] text-[#183F32] cursor-pointer"
                    title="Edit"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteHikmat(card.id)}
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
      )}

      {/* SUB-TAB 2: Audio Sanctuary Tracks */}
      {activeSubTab === 'audio' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-[#AFC7A5]/35 shadow-xs">
            <h3 className="font-serif text-xl font-bold text-[#183F32] mb-1">
              Add New Quranic Recitation / Ruqyah Track
            </h3>
            <p className="text-xs text-[#26312B]/75 mb-6">
              Provide direct MP3 audio stream URLs (e.g. from Alafasy, Sudais, or classical recitations) for the floating spiritual sanctuary player.
            </p>

            <form onSubmit={handleAddTrack} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#183F32] mb-1">
                    Surah / Track Title (English) *
                  </label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Surah Al-Mulk (The Sovereignty)"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#AFC7A5]/40 focus:border-[#183F32] outline-hidden bg-[#FAF9F3]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#183F32] mb-1">
                    Urdu Title (اردو عنوان)
                  </label>
                  <input
                    type="text"
                    value={newUrduTitle}
                    onChange={(e) => setNewUrduTitle(e.target.value)}
                    placeholder="سورۃ الملک — عذابِ قبر سے حفاظت"
                    dir="rtl"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#AFC7A5]/40 focus:border-[#183F32] outline-hidden bg-[#FAF9F3] font-urdu text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#183F32] mb-1">
                    Reciter
                  </label>
                  <input
                    type="text"
                    value={newReciter}
                    onChange={(e) => setNewReciter(e.target.value)}
                    placeholder="e.g. Mishary Rashid Alafasy"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#AFC7A5]/40 focus:border-[#183F32] outline-hidden bg-[#FAF9F3]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#183F32] mb-1">
                    Duration (e.g. 3:45)
                  </label>
                  <input
                    type="text"
                    value={newDuration}
                    onChange={(e) => setNewDuration(e.target.value)}
                    placeholder="3:45"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#AFC7A5]/40 focus:border-[#183F32] outline-hidden bg-[#FAF9F3]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#183F32] mb-1">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#AFC7A5]/40 focus:border-[#183F32] outline-hidden bg-[#FAF9F3]"
                  >
                    <option value="quran">Quran Recitation</option>
                    <option value="ruqyah">Ruqyah Shifa</option>
                    <option value="adhkar">Morning/Evening Adhkar</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#183F32] mb-1">
                  Audio Stream MP3 URL *
                </label>
                <input
                  type="url"
                  required
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="https://cdn.islamic.network/quran/audio/128/ar.alafasy/67.mp3"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#AFC7A5]/40 focus:border-[#183F32] outline-hidden bg-[#FAF9F3]"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#183F32] text-white hover:bg-[#285844] text-xs font-bold shadow-xs cursor-pointer inline-flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Track to Sanctuary</span>
                </button>
              </div>
            </form>
          </div>

          {/* Current Tracks List */}
          <div className="bg-white rounded-3xl p-6 border border-[#AFC7A5]/35 shadow-xs space-y-3">
            <h4 className="font-serif text-lg font-bold text-[#183F32] mb-4">
              Active Audio Tracks ({tracks.length})
            </h4>

            {tracks.map((track) => (
              <div
                key={track.id}
                className="p-4 rounded-2xl bg-[#FAF9F3] border border-[#AFC7A5]/30 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#E3EBDD] text-[#183F32] flex items-center justify-center shrink-0">
                    <Volume2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-serif text-sm font-bold text-[#183F32]">
                      {track.title}
                    </h5>
                    {track.urduTitle && (
                      <p className="font-urdu text-xs text-[#285844]" dir="rtl">
                        {track.urduTitle}
                      </p>
                    )}
                    <span className="text-[11px] text-[#26312B]/60">
                      {track.reciter || 'Classical Recitation'} · {track.duration} · {track.category}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleTrackActive(track.id)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                      track.active
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {track.active ? 'Active' : 'Muted'}
                  </button>
                  <button
                    onClick={() => handleDeleteTrack(track.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                    title="Remove Track"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
