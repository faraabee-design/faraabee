import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { WheelSlice } from '../types';
import { X, Sparkles, Gift, Check, Copy, ArrowRight, RotateCw, ShieldCheck } from 'lucide-react';

interface SpinWheelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCheckout?: () => void;
}

// Lightweight Web Audio API synthesizer for realistic mechanical clicks & victory chime
const playTickSound = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(450, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.04);

    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.04);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.04);
  } catch {}
};

const playFanfareSound = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    const notes = [261.63, 329.63, 392.0, 523.25]; // C4, E4, G4, C5
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.1);

      gain.gain.setValueAtTime(0, ctx.currentTime + idx * 0.1);
      gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + idx * 0.1 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.1 + 0.5);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + idx * 0.1);
      osc.stop(ctx.currentTime + idx * 0.1 + 0.5);
    });
  } catch {}
};

export const SpinWheelModal: React.FC<SpinWheelModalProps> = ({
  isOpen,
  onClose,
  onOpenCheckout,
}) => {
  const { spinWheelSettings, applyCoupon, language } = useStore();
  const isUrdu = language === 'ur';

  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [winningSlice, setWinningSlice] = useState<WheelSlice | null>(null);
  const [copied, setCopied] = useState(false);
  const [alreadySpun, setAlreadySpun] = useState(false);
  const [cooldownRemaining, setCooldownRemaining] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const slices = spinWheelSettings.slices.length > 0 ? spinWheelSettings.slices : [];

  // Check cooldown on open
  useEffect(() => {
    if (!isOpen) return;
    try {
      const lastSpin = localStorage.getItem('faraabee_last_spin_time');
      if (lastSpin && spinWheelSettings.cooldownHours > 0) {
        const lastTime = parseInt(lastSpin, 10);
        const elapsedHours = (Date.now() - lastTime) / (1000 * 60 * 60);
        if (elapsedHours < spinWheelSettings.cooldownHours) {
          setAlreadySpun(true);
          const remainingHours = Math.ceil(spinWheelSettings.cooldownHours - elapsedHours);
          setCooldownRemaining(
            isUrdu
              ? `اگلی باری ${remainingHours} گھنٹوں بعد میسر ہوگی`
              : `Next spin available in ${remainingHours} hours`
          );
        } else {
          setAlreadySpun(false);
          setCooldownRemaining(null);
        }
      } else {
        setAlreadySpun(false);
        setCooldownRemaining(null);
      }
    } catch {
      setAlreadySpun(false);
    }
  }, [isOpen, spinWheelSettings.cooldownHours, isUrdu]);

  if (!isOpen || !spinWheelSettings.enabled) return null;

  const numSlices = slices.length || 6;
  const sliceAngle = 360 / numSlices;

  const handleSpin = () => {
    if (isSpinning || slices.length === 0) return;

    setIsSpinning(true);
    setWinningSlice(null);
    setCopied(false);

    // Weighted random selection based on slice probability
    const totalWeight = slices.reduce((acc, s) => acc + (s.probability || 10), 0);
    let rand = Math.random() * totalWeight;
    let selectedIndex = 0;

    for (let i = 0; i < slices.length; i++) {
      rand -= slices[i].probability || 10;
      if (rand <= 0) {
        selectedIndex = i;
        break;
      }
    }

    // Target slice angle: The pointer is at TOP (270 deg or 90 deg relative)
    // We calculate extra spins (5 to 8 full spins) + offset to land on selected slice center
    const sliceCenter = selectedIndex * sliceAngle + sliceAngle / 2;
    const extraSpins = (5 + Math.floor(Math.random() * 3)) * 360;
    // Pointer is at top (270 deg)
    const targetRotation = rotation + extraSpins + (360 - (sliceCenter % 360)) + 270;

    // Tick sound effect interval during spin
    let tickCount = 0;
    const maxTicks = 45;
    const interval = setInterval(() => {
      tickCount++;
      playTickSound();
      if (tickCount >= maxTicks) {
        clearInterval(interval);
      }
    }, 90);

    setRotation(targetRotation);

    setTimeout(() => {
      clearInterval(interval);
      const chosen = slices[selectedIndex];
      setWinningSlice(chosen);
      setIsSpinning(false);
      playFanfareSound();

      // Automatically apply coupon code
      if (chosen.couponCode) {
        applyCoupon(chosen.couponCode);
      }

      // Record spin time
      try {
        localStorage.setItem('faraabee_last_spin_time', Date.now().toString());
        localStorage.setItem('faraabee_won_prize', JSON.stringify(chosen));
      } catch {}
    }, 4500);
  };

  const handleCopyCode = () => {
    if (!winningSlice?.couponCode) return;
    try {
      navigator.clipboard.writeText(winningSlice.couponCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {}
  };

  return (
    <div
      className={`fixed inset-0 z-50 overflow-y-auto bg-[#183F32]/75 backdrop-blur-xs flex items-center justify-center p-4 ${
        isUrdu ? 'rtl' : 'ltr'
      }`}
    >
      <div className="relative bg-white rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden border border-[#AFC7A5]/40 my-8 animate-scale-in">
        {/* Modal Top Bar */}
        <div className="p-5 bg-gradient-to-r from-[#183F32] via-[#235843] to-[#183F32] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-[#FAF9F3]/15 rounded-xl">
              <Gift className="w-5 h-5 text-[#C5A880]" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#C5A880] block">
                {isUrdu ? 'فارابی مبارک انعامات' : 'FARAABEE APOTHECARY REWARDS'}
              </span>
              <h3 className="font-serif text-lg sm:text-xl font-bold">
                {isUrdu ? spinWheelSettings.titleUrdu : spinWheelSettings.title}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 flex flex-col items-center text-center space-y-6 bg-gradient-to-b from-[#FAF9F3]/60 to-white">
          <p className="text-xs sm:text-sm text-[#26312B]/80 max-w-md leading-relaxed">
            {isUrdu ? spinWheelSettings.subtitleUrdu : spinWheelSettings.subtitle}
          </p>

          {/* Wheel Graphic Container */}
          <div className="relative w-72 h-72 sm:w-80 sm:h-80 mx-auto select-none">
            {/* Outer Brass / Gold Ring Border */}
            <div className="absolute inset-0 rounded-full border-8 border-[#C5A880] shadow-2xl bg-[#183F32] p-1 flex items-center justify-center">
              {/* Rotating Wheel Container */}
              <div
                className="w-full h-full rounded-full overflow-hidden relative"
                style={{
                  transform: `rotate(${rotation}deg)`,
                  transition: isSpinning
                    ? 'transform 4.5s cubic-bezier(0.15, 0.9, 0.25, 1)'
                    : 'none',
                }}
              >
                <svg viewBox="0 0 300 300" className="w-full h-full">
                  {slices.map((slice, index) => {
                    const startAngle = (index * sliceAngle * Math.PI) / 180;
                    const endAngle = (((index + 1) * sliceAngle) * Math.PI) / 180;
                    const x1 = 150 + 150 * Math.cos(startAngle);
                    const y1 = 150 + 150 * Math.sin(startAngle);
                    const x2 = 150 + 150 * Math.cos(endAngle);
                    const y2 = 150 + 150 * Math.sin(endAngle);

                    const textAngle = (index * sliceAngle + sliceAngle / 2);
                    const textRad = (textAngle * Math.PI) / 180;
                    const textX = 150 + 95 * Math.cos(textRad);
                    const textY = 150 + 95 * Math.sin(textRad);

                    return (
                      <g key={slice.id}>
                        {/* Slice Path */}
                        <path
                          d={`M150,150 L${x1},${y1} A150,150 0 0,1 ${x2},${y2} Z`}
                          fill={slice.color}
                          stroke="#C5A880"
                          strokeWidth="1.5"
                        />
                        {/* Slice Text */}
                        <text
                          x={textX}
                          y={textY}
                          fill={slice.textColor}
                          fontSize="10"
                          fontWeight="bold"
                          textAnchor="middle"
                          dominantBaseline="middle"
                          transform={`rotate(${textAngle + 90}, ${textX}, ${textY})`}
                          className="font-serif uppercase tracking-wider"
                        >
                          {isUrdu && slice.labelUrdu ? slice.labelUrdu : slice.label}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>

              {/* Center Apothecary Hub Button */}
              <button
                type="button"
                onClick={handleSpin}
                disabled={isSpinning || (alreadySpun && !winningSlice)}
                className="absolute inset-0 m-auto w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-[#183F32] via-[#285844] to-[#C5A880] border-4 border-[#C5A880] shadow-lg flex flex-col items-center justify-center text-white cursor-pointer hover:scale-105 active:scale-95 transition-all disabled:opacity-75 z-20"
              >
                <Sparkles className="w-4 h-4 text-[#C5A880]" />
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider mt-0.5">
                  {isSpinning ? '...' : isUrdu ? 'گھمائیں' : 'SPIN'}
                </span>
              </button>
            </div>

            {/* Top Indicator Triangle Pointer */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-30 filter drop-shadow-md">
              <div className="w-0 h-0 border-x-10 border-x-transparent border-t-16 border-t-[#C5A880]" />
            </div>
          </div>

          {/* Outcome Card / Winning Alert */}
          {winningSlice ? (
            <div className="w-full p-5 bg-gradient-to-br from-[#E8F1DF] via-white to-[#FAF9F3] rounded-2xl border-2 border-emerald-500/60 shadow-md space-y-3 animate-fade-in">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-900 rounded-full text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                <span>{isUrdu ? 'مبارک ہو! آپ جیت چکے ہیں' : 'Congratulations! You Won!'}</span>
              </div>

              <h4 className="font-serif text-2xl font-bold text-[#183F32]">
                {isUrdu && winningSlice.labelUrdu ? winningSlice.labelUrdu : winningSlice.label}
              </h4>

              <p className="text-xs text-[#26312B]/75">
                {isUrdu
                  ? 'یہ کوپن کوڈ آپ کے آرڈر پر خودکار طور پر لاگو کر دیا گیا ہے:'
                  : 'This voucher code is automatically activated for your checkout:'}
              </p>

              {/* Coupon Code Box */}
              <div className="flex items-center justify-center gap-2 max-w-xs mx-auto">
                <div className="flex-1 px-4 py-2 bg-white rounded-xl border border-emerald-400 font-mono font-bold text-sm text-[#183F32] tracking-wider shadow-inner">
                  {winningSlice.couponCode}
                </div>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="px-3.5 py-2 bg-[#183F32] hover:bg-[#285844] text-white rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? (isUrdu ? 'کاپی ہوا' : 'Copied') : (isUrdu ? 'کاپی' : 'Copy')}</span>
                </button>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row justify-center gap-2">
                {onOpenCheckout && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenCheckout();
                    }}
                    className="px-6 py-2.5 bg-[#183F32] hover:bg-[#285844] text-white text-xs font-semibold uppercase tracking-wider rounded-xl transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>{isUrdu ? 'رعایت کے ساتھ آرڈر مکمل کریں' : 'Claim & Checkout'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 bg-white border border-[#AFC7A5]/50 hover:bg-[#FAF9F3] text-[#183F32] text-xs font-semibold uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
                >
                  {isUrdu ? 'خریداری جاری رکھیں' : 'Continue Shopping'}
                </button>
              </div>
            </div>
          ) : alreadySpun && cooldownRemaining ? (
            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 max-w-sm">
              <span className="font-bold block mb-1">
                {isUrdu ? 'روزانہ کی باری مکمل ہو چکی ہے' : 'Daily Spin Used'}
              </span>
              <span>{cooldownRemaining}</span>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-2">
              <button
                type="button"
                onClick={handleSpin}
                disabled={isSpinning}
                className="px-8 py-3.5 bg-[#183F32] hover:bg-[#285844] text-white text-xs font-bold uppercase tracking-widest rounded-2xl shadow-lg hover:shadow-xl transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
              >
                <RotateCw className={`w-4 h-4 ${isSpinning ? 'animate-spin' : ''}`} />
                <span>
                  {isSpinning
                    ? isUrdu
                      ? 'پہیہ گھوم رہا ہے...'
                      : 'Spinning...'
                    : isUrdu
                    ? spinWheelSettings.triggerButtonTextUrdu
                    : spinWheelSettings.triggerButtonText}
                </span>
              </button>
              <span className="text-[11px] text-[#26312B]/60">
                {isUrdu ? spinWheelSettings.disclaimerUrdu : spinWheelSettings.disclaimer}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
