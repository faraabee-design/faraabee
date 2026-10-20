import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { WheelSlice, SpinWheelSettings, HakeemBargainSettings } from '../../types';
import {
  Gift,
  Handshake,
  Sparkles,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Save,
  RotateCw,
  Coins,
  ShieldCheck,
  Percent,
  Eye,
  Sliders,
  Smile,
  MessageSquare,
} from 'lucide-react';

interface AdminGamificationProps {
  onNotify: (msg: string) => void;
}

export const AdminGamification: React.FC<AdminGamificationProps> = ({ onNotify }) => {
  const {
    spinWheelSettings,
    updateSpinWheelSettings,
    hakeemBargainSettings,
    updateHakeemBargainSettings,
  } = useStore();

  const [activeSubTab, setActiveSubTab] = useState<'wheel' | 'bargain'>('wheel');

  // Spin Wheel Local State
  const [wheelEnabled, setWheelEnabled] = useState(spinWheelSettings.enabled);
  const [wheelTitle, setWheelTitle] = useState(spinWheelSettings.title);
  const [wheelTitleUrdu, setWheelTitleUrdu] = useState(spinWheelSettings.titleUrdu);
  const [wheelSubtitle, setWheelSubtitle] = useState(spinWheelSettings.subtitle);
  const [wheelSubtitleUrdu, setWheelSubtitleUrdu] = useState(spinWheelSettings.subtitleUrdu);
  const [wheelTrigger, setWheelTrigger] = useState(spinWheelSettings.triggerButtonText);
  const [wheelTriggerUrdu, setWheelTriggerUrdu] = useState(spinWheelSettings.triggerButtonTextUrdu);
  const [cooldownHours, setCooldownHours] = useState(spinWheelSettings.cooldownHours);
  const [slices, setSlices] = useState<WheelSlice[]>(spinWheelSettings.slices);

  // Slice Edit Modal State
  const [editingSlice, setEditingSlice] = useState<WheelSlice | null>(null);
  const [sliceModalOpen, setSliceModalOpen] = useState(false);

  // Hakeem Bargain Local State
  const [bargainEnabled, setBargainEnabled] = useState(hakeemBargainSettings.enabled);
  const [hakeemName, setHakeemName] = useState(hakeemBargainSettings.hakeemName);
  const [hakeemNameUrdu, setHakeemNameUrdu] = useState(hakeemBargainSettings.hakeemNameUrdu);
  const [hakeemTitle, setHakeemTitle] = useState(hakeemBargainSettings.hakeemTitle);
  const [hakeemTitleUrdu, setHakeemTitleUrdu] = useState(hakeemBargainSettings.hakeemTitleUrdu);
  const [bargainButtonText, setBargainButtonText] = useState(hakeemBargainSettings.buttonText);
  const [bargainButtonTextUrdu, setBargainButtonTextUrdu] = useState(hakeemBargainSettings.buttonTextUrdu);
  const [maxDiscount, setMaxDiscount] = useState(hakeemBargainSettings.maxDiscountPercent);
  const [counterDiscount, setCounterDiscount] = useState(hakeemBargainSettings.counterOfferDiscountPercent);
  const [tooLowThreshold, setTooLowThreshold] = useState(hakeemBargainSettings.tooLowThresholdPercent);
  const [couponPrefix, setCouponPrefix] = useState(hakeemBargainSettings.couponPrefix || 'HAKEEM');

  // Dialogues state
  const [dialogues, setDialogues] = useState(hakeemBargainSettings.dialogues);
  const [newDialogueCategory, setNewDialogueCategory] = useState<
    'tooLowUrdu' | 'tooLowEnglish' | 'counterOfferUrdu' | 'counterOfferEnglish' | 'acceptedUrdu' | 'acceptedEnglish'
  >('tooLowUrdu');
  const [newDialogueText, setNewDialogueText] = useState('');

  // Simulator state for Hakeem testing
  const [simPrice, setSimPrice] = useState(2000);
  const [simOffer, setSimOffer] = useState(1500);
  const [simResult, setSimResult] = useState<string | null>(null);

  const [savingWheel, setSavingWheel] = useState(false);
  const [savingBargain, setSavingBargain] = useState(false);

  // Save Spin Wheel
  const handleSaveWheel = async () => {
    setSavingWheel(true);
    try {
      await updateSpinWheelSettings({
        enabled: wheelEnabled,
        title: wheelTitle.trim(),
        titleUrdu: wheelTitleUrdu.trim(),
        subtitle: wheelSubtitle.trim(),
        subtitleUrdu: wheelSubtitleUrdu.trim(),
        triggerButtonText: wheelTrigger.trim(),
        triggerButtonTextUrdu: wheelTriggerUrdu.trim(),
        cooldownHours: Number(cooldownHours) || 0,
        slices,
      });
      onNotify('Spin the Shifa Wheel configuration updated successfully!');
    } catch {
      onNotify('Failed to save Spin Wheel settings.');
    } finally {
      setSavingWheel(false);
    }
  };

  // Save Hakeem Bargain
  const handleSaveBargain = async () => {
    setSavingBargain(true);
    try {
      await updateHakeemBargainSettings({
        enabled: bargainEnabled,
        hakeemName: hakeemName.trim(),
        hakeemNameUrdu: hakeemNameUrdu.trim(),
        hakeemTitle: hakeemTitle.trim(),
        hakeemTitleUrdu: hakeemTitleUrdu.trim(),
        buttonText: bargainButtonText.trim(),
        buttonTextUrdu: bargainButtonTextUrdu.trim(),
        maxDiscountPercent: Number(maxDiscount) || 15,
        counterOfferDiscountPercent: Number(counterDiscount) || 10,
        tooLowThresholdPercent: Number(tooLowThreshold) || 25,
        couponPrefix: couponPrefix.trim().toUpperCase() || 'HAKEEM',
        dialogues,
      });
      onNotify('Hakeem Sahib Bargain settings updated successfully!');
    } catch {
      onNotify('Failed to save Bargain settings.');
    } finally {
      setSavingBargain(false);
    }
  };

  // Slice Management
  const handleOpenAddSlice = () => {
    setEditingSlice({
      id: `slice-${Date.now()}`,
      label: '10% OFF',
      labelUrdu: '10% رعایت',
      couponCode: 'SHIFA10',
      type: 'discount_percent',
      value: 10,
      color: '#183F32',
      textColor: '#FAF9F3',
      probability: 20,
    });
    setSliceModalOpen(true);
  };

  const handleSaveSliceModal = (slice: WheelSlice) => {
    const existingIndex = slices.findIndex((s) => s.id === slice.id);
    if (existingIndex >= 0) {
      const updated = [...slices];
      updated[existingIndex] = slice;
      setSlices(updated);
    } else {
      setSlices([...slices, slice]);
    }
    setSliceModalOpen(false);
    setEditingSlice(null);
  };

  const handleDeleteSlice = (id: string) => {
    if (slices.length <= 2) {
      onNotify('The wheel must have at least 2 slices.');
      return;
    }
    setSlices(slices.filter((s) => s.id !== id));
  };

  // Dialogue Add / Remove
  const handleAddDialogue = () => {
    if (!newDialogueText.trim()) return;
    setDialogues({
      ...dialogues,
      [newDialogueCategory]: [...dialogues[newDialogueCategory], newDialogueText.trim()],
    });
    setNewDialogueText('');
    onNotify('New dialogue quote added!');
  };

  const handleDeleteDialogue = (
    cat: 'tooLowUrdu' | 'tooLowEnglish' | 'counterOfferUrdu' | 'counterOfferEnglish' | 'acceptedUrdu' | 'acceptedEnglish',
    index: number
  ) => {
    const updatedList = [...dialogues[cat]];
    updatedList.splice(index, 1);
    setDialogues({
      ...dialogues,
      [cat]: updatedList,
    });
  };

  // Test Simulator for Hakeem
  const runSimulator = () => {
    const discount = Math.max(0, simPrice - simOffer);
    const pct = Math.round((discount / simPrice) * 100);

    if (pct > tooLowThreshold) {
      setSimResult(
        `😲 REJECTED (Too Greedy! ${pct}% requested). Hakeem says: "${dialogues.tooLowUrdu[0] || 'Be fair!'}"`
      );
    } else if (pct > maxDiscount) {
      setSimResult(
        `🤔 COUNTER-OFFER (${pct}% requested). Hakeem compromises: "${dialogues.counterOfferUrdu[0] || 'Take 10% off'}"`
      );
    } else {
      setSimResult(
        `✨ ACCEPTED (${pct}% requested <= ${maxDiscount}% max). Hakeem approves coupon: "${couponPrefix}-${pct}"!`
      );
    }
  };

  return (
    <div className="space-y-8 max-w-5xl pb-16 animate-fade-in">
      {/* Top Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#183F32] flex items-center gap-2.5">
            <Sparkles className="w-6 h-6 text-[#C5A880]" />
            <span>Interactive Gamification & Fun Features</span>
          </h1>
          <p className="text-xs text-[#26312B]/70 mt-1">
            Complete administrative control over the Spin the Shifa Wheel and Hakeem Sahib Bargain Meter.
          </p>
        </div>

        {/* Sub-Tab Switcher */}
        <div className="flex items-center rounded-2xl border border-[#AFC7A5]/40 bg-white p-1 shadow-2xs">
          <button
            type="button"
            onClick={() => setActiveSubTab('wheel')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'wheel'
                ? 'bg-[#183F32] text-white shadow-2xs'
                : 'text-[#26312B]/70 hover:text-[#183F32]'
            }`}
          >
            <Gift className="w-4 h-4 text-[#C5A880]" />
            <span>1. Spin the Shifa Wheel</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('bargain')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'bargain'
                ? 'bg-[#183F32] text-white shadow-2xs'
                : 'text-[#26312B]/70 hover:text-[#183F32]'
            }`}
          >
            <Handshake className="w-4 h-4 text-[#C5A880]" />
            <span>2. Hakeem Sahib Bargain</span>
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* TAB 1: SPIN THE SHIFA WHEEL MANAGER */}
      {/* ============================================================== */}
      {activeSubTab === 'wheel' && (
        <div className="space-y-6">
          {/* Main Controls Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#AFC7A5]/35 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#AFC7A5]/25">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-[#E8F1DF] text-[#183F32] rounded-2xl">
                  <Gift className="w-5 h-5 text-[#285844]" />
                </div>
                <div>
                  <h2 className="font-serif text-lg font-bold text-[#183F32]">
                    Shifa Lucky Wheel Configuration
                  </h2>
                  <span className="text-xs text-[#26312B]/70">
                    Controls visibility, titles, cooldown duration, and floating button
                  </span>
                </div>
              </div>

              {/* Master Enabled Switch */}
              <label className="flex items-center gap-2 text-xs font-bold text-[#183F32] cursor-pointer">
                <span>{wheelEnabled ? 'Active on Storefront' : 'Disabled'}</span>
                <input
                  type="checkbox"
                  checked={wheelEnabled}
                  onChange={(e) => setWheelEnabled(e.target.checked)}
                  className="w-5 h-5 text-[#183F32] rounded border-gray-300 focus:ring-[#183F32]"
                />
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#183F32] mb-1">
                  Wheel Title (English) *
                </label>
                <input
                  type="text"
                  value={wheelTitle}
                  onChange={(e) => setWheelTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-[#AFC7A5]/40 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#183F32]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#183F32] mb-1">
                  Wheel Title (Urdu) *
                </label>
                <input
                  type="text"
                  dir="rtl"
                  value={wheelTitleUrdu}
                  onChange={(e) => setWheelTitleUrdu(e.target.value)}
                  className="w-full px-3 py-2 border border-[#AFC7A5]/40 rounded-xl text-xs font-serif font-semibold focus:outline-none focus:ring-2 focus:ring-[#183F32]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#183F32] mb-1">
                  Subtitle Description (English)
                </label>
                <input
                  type="text"
                  value={wheelSubtitle}
                  onChange={(e) => setWheelSubtitle(e.target.value)}
                  className="w-full px-3 py-2 border border-[#AFC7A5]/40 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#183F32]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#183F32] mb-1">
                  Subtitle Description (Urdu)
                </label>
                <input
                  type="text"
                  dir="rtl"
                  value={wheelSubtitleUrdu}
                  onChange={(e) => setWheelSubtitleUrdu(e.target.value)}
                  className="w-full px-3 py-2 border border-[#AFC7A5]/40 rounded-xl text-xs font-serif focus:outline-none focus:ring-2 focus:ring-[#183F32]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#183F32] mb-1">
                  Floating Button Label (English)
                </label>
                <input
                  type="text"
                  value={wheelTrigger}
                  onChange={(e) => setWheelTrigger(e.target.value)}
                  className="w-full px-3 py-2 border border-[#AFC7A5]/40 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#183F32]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#183F32] mb-1">
                  Floating Button Label (Urdu)
                </label>
                <input
                  type="text"
                  dir="rtl"
                  value={wheelTriggerUrdu}
                  onChange={(e) => setWheelTriggerUrdu(e.target.value)}
                  className="w-full px-3 py-2 border border-[#AFC7A5]/40 rounded-xl text-xs font-serif focus:outline-none focus:ring-2 focus:ring-[#183F32]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#183F32] mb-1">
                  Cooldown Period (Hours between spins per visitor)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="0"
                    max="720"
                    value={cooldownHours}
                    onChange={(e) => setCooldownHours(Number(e.target.value))}
                    className="w-32 px-3 py-2 border border-[#AFC7A5]/40 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#183F32]"
                  />
                  <span className="text-xs text-[#26312B]/70">
                    Set to <strong>0</strong> for unlimited testing spins, or <strong>24</strong> for standard daily spin.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Slices Management Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#AFC7A5]/35 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#AFC7A5]/25">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#183F32]">
                  Wheel Slices & Prizes ({slices.length} Slices)
                </h3>
                <p className="text-xs text-[#26312B]/70">
                  Configure slice colors, coupon codes, prize categories, and probability win weights.
                </p>
              </div>

              <button
                type="button"
                onClick={handleOpenAddSlice}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#183F32] hover:bg-[#285844] text-white text-xs font-semibold uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Add Slice</span>
              </button>
            </div>

            {/* Slices Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {slices.map((slice, index) => (
                <div
                  key={slice.id}
                  className="p-4 rounded-2xl border border-[#AFC7A5]/35 bg-[#FAF9F3]/60 flex flex-col justify-between space-y-3 shadow-2xs hover:border-[#183F32] transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-6 h-6 rounded-full border border-black/20 shadow-xs"
                        style={{ backgroundColor: slice.color }}
                      />
                      <span className="text-xs font-bold text-[#183F32]">
                        Slice #{index + 1}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingSlice(slice);
                          setSliceModalOpen(true);
                        }}
                        className="p-1 text-[#285844] hover:bg-[#E8F1DF] rounded-md transition-colors cursor-pointer"
                        title="Edit Slice"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteSlice(slice.id)}
                        className="p-1 text-red-700 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                        title="Delete Slice"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-serif font-bold text-sm text-[#183F32]">
                      {slice.label} <span className="font-serif font-normal text-xs text-[#285844]">({slice.labelUrdu})</span>
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-mono text-[11px] bg-white px-2 py-0.5 rounded border border-[#AFC7A5]/40 text-[#183F32] font-bold">
                        {slice.couponCode}
                      </span>
                      <span className="text-[11px] text-[#26312B]/70">
                        {slice.type.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#AFC7A5]/25 flex items-center justify-between text-[11px] text-[#26312B]/75">
                    <span>Probability Weight: <strong>{slice.probability}%</strong></span>
                    <span>Val: <strong>{slice.value}</strong></span>
                  </div>
                </div>
              ))}
            </div>

            {/* Save Wheel Action */}
            <div className="pt-4 border-t border-[#AFC7A5]/25 flex justify-end">
              <button
                type="button"
                onClick={handleSaveWheel}
                disabled={savingWheel}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#183F32] hover:bg-[#122F25] text-white text-xs font-semibold uppercase tracking-wider rounded-xl transition-all shadow-xs cursor-pointer disabled:opacity-50"
              >
                {savingWheel ? (
                  <span>Saving Wheel...</span>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Wheel Settings</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: HAKEEM SAHIB KA BARGAIN MANAGER */}
      {/* ============================================================== */}
      {activeSubTab === 'bargain' && (
        <div className="space-y-6">
          {/* Main Bargain Parameters */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#AFC7A5]/35 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#AFC7A5]/25">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-[#E8F1DF] text-[#183F32] rounded-2xl">
                  <Handshake className="w-5 h-5 text-[#285844]" />
                </div>
                <div>
                  <h2 className="font-serif text-lg font-bold text-[#183F32]">
                    Hakeem Sahib Bargain Meter Controls
                  </h2>
                  <span className="text-xs text-[#26312B]/70">
                    Set Hakeem identity, discount thresholds, and humorous haggling rules
                  </span>
                </div>
              </div>

              {/* Master Enabled Switch */}
              <label className="flex items-center gap-2 text-xs font-bold text-[#183F32] cursor-pointer">
                <span>{bargainEnabled ? 'Active on Storefront' : 'Disabled'}</span>
                <input
                  type="checkbox"
                  checked={bargainEnabled}
                  onChange={(e) => setBargainEnabled(e.target.checked)}
                  className="w-5 h-5 text-[#183F32] rounded border-gray-300 focus:ring-[#183F32]"
                />
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#183F32] mb-1">
                  Hakeem Persona Name (English) *
                </label>
                <input
                  type="text"
                  value={hakeemName}
                  onChange={(e) => setHakeemName(e.target.value)}
                  className="w-full px-3 py-2 border border-[#AFC7A5]/40 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#183F32]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#183F32] mb-1">
                  Hakeem Persona Name (Urdu) *
                </label>
                <input
                  type="text"
                  dir="rtl"
                  value={hakeemNameUrdu}
                  onChange={(e) => setHakeemNameUrdu(e.target.value)}
                  className="w-full px-3 py-2 border border-[#AFC7A5]/40 rounded-xl text-xs font-serif font-semibold focus:outline-none focus:ring-2 focus:ring-[#183F32]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#183F32] mb-1">
                  Hakeem Title (English)
                </label>
                <input
                  type="text"
                  value={hakeemTitle}
                  onChange={(e) => setHakeemTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-[#AFC7A5]/40 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#183F32]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#183F32] mb-1">
                  Hakeem Title (Urdu)
                </label>
                <input
                  type="text"
                  dir="rtl"
                  value={hakeemTitleUrdu}
                  onChange={(e) => setHakeemTitleUrdu(e.target.value)}
                  className="w-full px-3 py-2 border border-[#AFC7A5]/40 rounded-xl text-xs font-serif focus:outline-none focus:ring-2 focus:ring-[#183F32]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#183F32] mb-1">
                  Bargain Button CTA (English)
                </label>
                <input
                  type="text"
                  value={bargainButtonText}
                  onChange={(e) => setBargainButtonText(e.target.value)}
                  className="w-full px-3 py-2 border border-[#AFC7A5]/40 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#183F32]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#183F32] mb-1">
                  Bargain Button CTA (Urdu)
                </label>
                <input
                  type="text"
                  dir="rtl"
                  value={bargainButtonTextUrdu}
                  onChange={(e) => setBargainButtonTextUrdu(e.target.value)}
                  className="w-full px-3 py-2 border border-[#AFC7A5]/40 rounded-xl text-xs font-serif focus:outline-none focus:ring-2 focus:ring-[#183F32]"
                />
              </div>
            </div>

            {/* Threshold Sliders */}
            <div className="pt-2 border-t border-[#AFC7A5]/25 space-y-4">
              <h3 className="font-serif text-sm font-bold text-[#183F32]">
                Discount Approval Limits & Zones
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200 space-y-1">
                  <label className="block text-xs font-bold text-emerald-900 uppercase">
                    Max Direct Acceptance (%)
                  </label>
                  <p className="text-[10px] text-emerald-800/80">
                    Offers asking up to this discount are accepted immediately.
                  </p>
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="number"
                      min="5"
                      max="30"
                      value={maxDiscount}
                      onChange={(e) => setMaxDiscount(Number(e.target.value))}
                      className="w-20 px-2.5 py-1.5 border border-emerald-300 rounded-lg text-sm font-bold bg-white text-emerald-900"
                    />
                    <span className="text-xs font-bold text-emerald-900">%</span>
                  </div>
                </div>

                <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200 space-y-1">
                  <label className="block text-xs font-bold text-amber-900 uppercase">
                    Counter-Offer Compromise (%)
                  </label>
                  <p className="text-[10px] text-amber-800/80">
                    The discount Hakeem offers when meeting the buyer halfway.
                  </p>
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="number"
                      min="5"
                      max="20"
                      value={counterDiscount}
                      onChange={(e) => setCounterDiscount(Number(e.target.value))}
                      className="w-20 px-2.5 py-1.5 border border-amber-300 rounded-lg text-sm font-bold bg-white text-amber-900"
                    />
                    <span className="text-xs font-bold text-amber-900">%</span>
                  </div>
                </div>

                <div className="p-4 bg-red-50/70 rounded-2xl border border-red-200 space-y-1">
                  <label className="block text-xs font-bold text-red-900 uppercase">
                    Too Greedy Threshold (%)
                  </label>
                  <p className="text-[10px] text-red-800/80">
                    Offers asking more than this discount trigger funny rejection.
                  </p>
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="number"
                      min="15"
                      max="50"
                      value={tooLowThreshold}
                      onChange={(e) => setTooLowThreshold(Number(e.target.value))}
                      className="w-20 px-2.5 py-1.5 border border-red-300 rounded-lg text-sm font-bold bg-white text-red-900"
                    />
                    <span className="text-xs font-bold text-red-900">%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Dialogues Management Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#AFC7A5]/35 shadow-xs space-y-6">
            <div>
              <h3 className="font-serif text-lg font-bold text-[#183F32]">
                Hakeem Witty Dialogue Library
              </h3>
              <p className="text-xs text-[#26312B]/70">
                Customize the humorous sayings Hakeem says when rejecting, counter-offering, or accepting deals.
              </p>
            </div>

            {/* Add New Dialogue */}
            <div className="p-4 bg-[#FAF9F3] rounded-2xl border border-[#AFC7A5]/30 space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#183F32]">
                Add Custom Witty Response:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <select
                  value={newDialogueCategory}
                  onChange={(e) => setNewDialogueCategory(e.target.value as any)}
                  className="px-3 py-2 border border-[#AFC7A5]/40 rounded-xl text-xs font-semibold bg-white"
                >
                  <option value="tooLowUrdu">😲 Too Greedy / Low (Urdu)</option>
                  <option value="tooLowEnglish">😲 Too Greedy / Low (English)</option>
                  <option value="counterOfferUrdu">🤔 Counter-Offer (Urdu)</option>
                  <option value="counterOfferEnglish">🤔 Counter-Offer (English)</option>
                  <option value="acceptedUrdu">✨ Accepted Deal (Urdu)</option>
                  <option value="acceptedEnglish">✨ Accepted Deal (English)</option>
                </select>

                <input
                  type="text"
                  value={newDialogueText}
                  onChange={(e) => setNewDialogueText(e.target.value)}
                  placeholder="Type Hakeem's funny dialogue here..."
                  className="sm:col-span-2 px-3 py-2 border border-[#AFC7A5]/40 rounded-xl text-xs bg-white"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleAddDialogue}
                  className="px-4 py-1.5 bg-[#183F32] hover:bg-[#285844] text-white text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Quote</span>
                </button>
              </div>
            </div>

            {/* Dialogues List */}
            <div className="space-y-4 divide-y divide-[#AFC7A5]/25 text-xs">
              {/* Too Low Urdu */}
              <div className="pt-3 space-y-2">
                <span className="font-bold text-red-900 block">
                  😲 Rejection Responses (Urdu) ({dialogues.tooLowUrdu.length}):
                </span>
                <div className="space-y-1.5">
                  {dialogues.tooLowUrdu.map((text, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 bg-red-50/50 rounded-xl border border-red-200 flex items-center justify-between gap-3 text-red-950 font-serif"
                      dir="rtl"
                    >
                      <span className="flex-1 leading-relaxed">&ldquo;{text}&rdquo;</span>
                      <button
                        type="button"
                        onClick={() => handleDeleteDialogue('tooLowUrdu', idx)}
                        className="text-red-600 hover:text-red-900 p-1 cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Counter-Offer Urdu */}
              <div className="pt-3 space-y-2">
                <span className="font-bold text-amber-900 block">
                  🤔 Counter-Offer Responses (Urdu) ({dialogues.counterOfferUrdu.length}):
                </span>
                <div className="space-y-1.5">
                  {dialogues.counterOfferUrdu.map((text, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 bg-amber-50/50 rounded-xl border border-amber-200 flex items-center justify-between gap-3 text-amber-950 font-serif"
                      dir="rtl"
                    >
                      <span className="flex-1 leading-relaxed">&ldquo;{text}&rdquo;</span>
                      <button
                        type="button"
                        onClick={() => handleDeleteDialogue('counterOfferUrdu', idx)}
                        className="text-amber-600 hover:text-amber-900 p-1 cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Accepted Urdu */}
              <div className="pt-3 space-y-2">
                <span className="font-bold text-emerald-900 block">
                  ✨ Acceptance Responses (Urdu) ({dialogues.acceptedUrdu.length}):
                </span>
                <div className="space-y-1.5">
                  {dialogues.acceptedUrdu.map((text, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 bg-emerald-50/50 rounded-xl border border-emerald-200 flex items-center justify-between gap-3 text-emerald-950 font-serif"
                      dir="rtl"
                    >
                      <span className="flex-1 leading-relaxed">&ldquo;{text}&rdquo;</span>
                      <button
                        type="button"
                        onClick={() => handleDeleteDialogue('acceptedUrdu', idx)}
                        className="text-emerald-600 hover:text-emerald-900 p-1 cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Live Testing Simulator */}
            <div className="p-5 bg-gradient-to-br from-[#FAF9F3] to-white rounded-2xl border border-[#AFC7A5]/40 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#183F32] flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-[#285844]" />
                <span>Live Haggling Simulator (Test Hakeem’s Reaction)</span>
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] text-[#26312B]/70 mb-1">Original Price (Rs.):</label>
                  <input
                    type="number"
                    value={simPrice}
                    onChange={(e) => setSimPrice(Number(e.target.value))}
                    className="w-full px-3 py-1.5 border border-[#AFC7A5]/40 rounded-xl text-xs bg-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-[#26312B]/70 mb-1">Customer Offer (Rs.):</label>
                  <input
                    type="number"
                    value={simOffer}
                    onChange={(e) => setSimOffer(Number(e.target.value))}
                    className="w-full px-3 py-1.5 border border-[#AFC7A5]/40 rounded-xl text-xs bg-white font-bold"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={runSimulator}
                    className="w-full py-2 bg-[#285844] hover:bg-[#183F32] text-white text-xs font-bold uppercase rounded-xl transition-colors cursor-pointer"
                  >
                    Test Offer
                  </button>
                </div>
              </div>

              {simResult && (
                <div className="p-3 bg-white rounded-xl border border-[#AFC7A5]/40 text-xs text-[#183F32] font-medium animate-fade-in">
                  {simResult}
                </div>
              )}
            </div>

            {/* Save Bargain Action */}
            <div className="pt-4 border-t border-[#AFC7A5]/25 flex justify-end">
              <button
                type="button"
                onClick={handleSaveBargain}
                disabled={savingBargain}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#183F32] hover:bg-[#122F25] text-white text-xs font-semibold uppercase tracking-wider rounded-xl transition-all shadow-xs cursor-pointer disabled:opacity-50"
              >
                {savingBargain ? (
                  <span>Saving Bargain Rules...</span>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Bargain Rules</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Slice Add / Edit Modal */}
      {sliceModalOpen && editingSlice && (
        <div className="fixed inset-0 z-50 bg-[#183F32]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-[#AFC7A5]/40 animate-scale-in">
            <div className="flex items-center justify-between pb-3 border-b border-[#AFC7A5]/25">
              <h3 className="font-serif text-lg font-bold text-[#183F32]">
                {editingSlice.id.startsWith('slice-') ? 'Edit Wheel Slice' : 'Add New Slice'}
              </h3>
              <button
                type="button"
                onClick={() => setSliceModalOpen(false)}
                className="p-1 text-[#26312B] hover:text-[#183F32] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#183F32] mb-1">Slice Label (English) *</label>
                <input
                  type="text"
                  value={editingSlice.label}
                  onChange={(e) => setEditingSlice({ ...editingSlice, label: e.target.value })}
                  placeholder="e.g. 10% OFF"
                  className="w-full px-3 py-2 border border-[#AFC7A5]/40 rounded-xl font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-[#183F32] mb-1">Slice Label (Urdu) *</label>
                <input
                  type="text"
                  dir="rtl"
                  value={editingSlice.labelUrdu}
                  onChange={(e) => setEditingSlice({ ...editingSlice, labelUrdu: e.target.value })}
                  placeholder="مثلاً: 10% رعایت"
                  className="w-full px-3 py-2 border border-[#AFC7A5]/40 rounded-xl font-serif font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-[#183F32] mb-1">Coupon Code *</label>
                <input
                  type="text"
                  value={editingSlice.couponCode}
                  onChange={(e) => setEditingSlice({ ...editingSlice, couponCode: e.target.value.toUpperCase() })}
                  placeholder="e.g. SHIFA10"
                  className="w-full px-3 py-2 border border-[#AFC7A5]/40 rounded-xl font-mono font-bold uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#183F32] mb-1">Prize Type</label>
                  <select
                    value={editingSlice.type}
                    onChange={(e) => setEditingSlice({ ...editingSlice, type: e.target.value as any })}
                    className="w-full px-3 py-2 border border-[#AFC7A5]/40 rounded-xl bg-white"
                  >
                    <option value="discount_percent">Percent Discount (%)</option>
                    <option value="discount_fixed">Fixed Amount (Rs.)</option>
                    <option value="free_shipping">Free Shipping</option>
                    <option value="free_gift">Free Gift Sample</option>
                    <option value="blessing">Spiritual Blessing / Dua</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#183F32] mb-1">Value Amount</label>
                  <input
                    type="number"
                    value={editingSlice.value}
                    onChange={(e) => setEditingSlice({ ...editingSlice, value: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-[#AFC7A5]/40 rounded-xl font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#183F32] mb-1">Slice Background Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={editingSlice.color}
                      onChange={(e) => setEditingSlice({ ...editingSlice, color: e.target.value })}
                      className="w-9 h-8 rounded border cursor-pointer"
                    />
                    <input
                      type="text"
                      value={editingSlice.color}
                      onChange={(e) => setEditingSlice({ ...editingSlice, color: e.target.value })}
                      className="w-full px-2 py-1.5 border border-[#AFC7A5]/40 rounded-lg font-mono text-[11px]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-[#183F32] mb-1">Win Probability Weight (1-100)</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={editingSlice.probability}
                    onChange={(e) => setEditingSlice({ ...editingSlice, probability: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-[#AFC7A5]/40 rounded-xl font-bold"
                  />
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#AFC7A5]/25 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setSliceModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-xl text-xs font-semibold hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleSaveSliceModal(editingSlice)}
                className="px-5 py-2 bg-[#183F32] hover:bg-[#285844] text-white rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer shadow-xs"
              >
                Apply Slice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
