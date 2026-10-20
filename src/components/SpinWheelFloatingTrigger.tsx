import React from 'react';
import { useStore } from '../context/StoreContext';
import { Gift, Sparkles } from 'lucide-react';

interface SpinWheelFloatingTriggerProps {
  onOpen: () => void;
}

export const SpinWheelFloatingTrigger: React.FC<SpinWheelFloatingTriggerProps> = ({ onOpen }) => {
  const { spinWheelSettings, language } = useStore();

  if (!spinWheelSettings.enabled) return null;

  const isUrdu = language === 'ur';

  return (
    <div className={`fixed bottom-6 ${isUrdu ? 'left-6' : 'right-6 sm:right-auto sm:left-6'} z-40 animate-bounce-subtle`}>
      <button
        type="button"
        onClick={onOpen}
        className="group relative flex items-center gap-2.5 px-4 py-2.5 bg-gradient-to-r from-[#183F32] via-[#235843] to-[#183F32] text-white rounded-full shadow-2xl border-2 border-[#C5A880] hover:scale-105 active:scale-95 transition-all cursor-pointer overflow-hidden"
        title={isUrdu ? 'قسمت کا شفا پہیہ گھمائیں اور انعام جیتیں' : 'Spin the Shifa Wheel & Win'}
      >
        {/* Shimmer sweep effect */}
        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        <div className="relative p-1.5 bg-[#C5A880] text-[#183F32] rounded-full shadow-inner animate-spin-slow">
          <Gift className="w-4 h-4" />
        </div>

        <div className="relative text-left">
          <span className="block text-[9px] uppercase font-bold tracking-widest text-[#C5A880]">
            {isUrdu ? 'مفت انعامات' : 'LUCKY REWARD'}
          </span>
          <span className="block text-xs font-serif font-bold text-white">
            {isUrdu ? spinWheelSettings.triggerButtonTextUrdu : spinWheelSettings.triggerButtonText}
          </span>
        </div>

        <Sparkles className="w-3.5 h-3.5 text-[#C5A880] animate-pulse" />
      </button>
    </div>
  );
};
