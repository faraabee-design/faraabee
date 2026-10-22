import React, { useRef, useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  PenTool,
  RotateCcw,
  Trash2,
  Save,
  Check,
  Mail,
  Sparkles,
  Eye,
  Info,
  Upload,
  Download,
  Palette,
  ExternalLink,
} from 'lucide-react';

const INK_COLORS = [
  { name: 'Imperial Gold', hex: '#D4AF37' },
  { name: 'Warm Ivory', hex: '#FAF9F3' },
  { name: 'Botanical Sage', hex: '#AFC7A5' },
  { name: 'Pure White', hex: '#FFFFFF' },
  { name: 'Emerald Jade', hex: '#2ECC71' },
];

const PEN_WIDTHS = [
  { label: 'Fine', width: 2 },
  { label: 'Medium', width: 3.5 },
  { label: 'Bold', width: 5.5 },
];

interface Point {
  x: number;
  y: number;
}

export const AdminDeveloperSignature: React.FC = () => {
  const { developerSignatureSettings, updateDeveloperSignatureSettings, language } = useStore();
  const isUrdu = language === 'ur';

  // Local form state initialized from store
  const [enabled, setEnabled] = useState(developerSignatureSettings.enabled ?? true);
  const [customText, setCustomText] = useState(
    developerSignatureSettings.customText ||
      'This website was created by me. If you want your own custom website, contact:'
  );
  const [customTextUrdu, setCustomTextUrdu] = useState(
    developerSignatureSettings.customTextUrdu ||
      'یہ ویب سائٹ میرے ہاتھوں سے تیار کی گئی ہے۔ اگر آپ اپنی مرضی کی ویب سائٹ بنوانا چاہتے ہیں تو رابطہ کریں:'
  );
  const [email, setEmail] = useState(developerSignatureSettings.email || 'faraabee@gmail.com');
  const [creatorName, setCreatorName] = useState(developerSignatureSettings.creatorName || '');
  const [badgeTitle, setBadgeTitle] = useState(developerSignatureSettings.badgeTitle || 'Website Creator');
  const [penColor, setPenColor] = useState(developerSignatureSettings.penColor || '#D4AF37');
  const [penWidth, setPenWidth] = useState(3.5);

  // Canvas drawing state
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [strokes, setStrokes] = useState<Array<{ points: Point[]; color: string; width: number }>>([]);
  const [currentStroke, setCurrentStroke] = useState<Point[]>([]);
  const [signatureDataUrl, setSignatureDataUrl] = useState(developerSignatureSettings.signatureImage || '');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Redraw canvas whenever strokes or pen settings change
  const redrawCanvas = (
    strokeList: Array<{ points: Point[]; color: string; width: number }>,
    inProgress?: Point[]
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas to full transparency
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const drawSingleStroke = (points: Point[], strokeColor: string, strokeWidth: number) => {
      if (points.length === 0) return;
      ctx.beginPath();
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = strokeWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      if (points.length === 1) {
        ctx.arc(points[0].x, points[0].y, strokeWidth / 2, 0, Math.PI * 2);
        ctx.fillStyle = strokeColor;
        ctx.fill();
        return;
      }

      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length - 1; i++) {
        const xc = (points[i].x + points[i + 1].x) / 2;
        const yc = (points[i].y + points[i + 1].y) / 2;
        ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
      }
      ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
      ctx.stroke();
    };

    strokeList.forEach((s) => drawSingleStroke(s.points, s.color, s.width));
    if (inProgress && inProgress.length > 0) {
      drawSingleStroke(inProgress, penColor, penWidth);
    }
  };

  // Load existing signature on initial mount if available and no strokes yet
  useEffect(() => {
    if (developerSignatureSettings.signatureImage && strokes.length === 0) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
      img.src = developerSignatureSettings.signatureImage;
    }
  }, [developerSignatureSettings.signatureImage]);

  // Coordinate helper that handles canvas scaling / high-DPI
  const getCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    let clientX = 0;
    let clientY = 0;

    if ('touches' in e && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if ('clientX' in e) {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  const handleStartDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    setIsDrawing(true);
    const pt = getCanvasCoords(e);
    const newPts = [pt];
    setCurrentStroke(newPts);
    redrawCanvas(strokes, newPts);
  };

  const handleDraw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();
    const pt = getCanvasCoords(e);
    const newPts = [...currentStroke, pt];
    setCurrentStroke(newPts);
    redrawCanvas(strokes, newPts);
  };

  const handleEndDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();
    setIsDrawing(false);

    if (currentStroke.length > 0) {
      const newStrokes = [...strokes, { points: currentStroke, color: penColor, width: penWidth }];
      setStrokes(newStrokes);
      setCurrentStroke([]);
      redrawCanvas(newStrokes);

      // Export transparent PNG data URL
      const canvas = canvasRef.current;
      if (canvas) {
        setSignatureDataUrl(canvas.toDataURL('image/png'));
      }
    }
  };

  const handleClearSignature = () => {
    setStrokes([]);
    setCurrentStroke([]);
    setSignatureDataUrl('');
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const handleUndo = () => {
    if (strokes.length === 0) return;
    const newStrokes = strokes.slice(0, -1);
    setStrokes(newStrokes);
    redrawCanvas(newStrokes);
    const canvas = canvasRef.current;
    if (canvas) {
      setSignatureDataUrl(newStrokes.length > 0 ? canvas.toDataURL('image/png') : '');
    }
  };

  const handleUploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setSignatureDataUrl(result);
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const img = new Image();
        img.onload = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          // Scale to fit nicely
          const hRatio = canvas.width / img.width;
          const vRatio = canvas.height / img.height;
          const ratio = Math.min(hRatio, vRatio) * 0.9;
          const centerShiftX = (canvas.width - img.width * ratio) / 2;
          const centerShiftY = (canvas.height - img.height * ratio) / 2;
          ctx.drawImage(img, 0, 0, img.width, img.height, centerShiftX, centerShiftY, img.width * ratio, img.height * ratio);
        };
        img.src = result;
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDownloadSignature = () => {
    if (!signatureDataUrl) return;
    const a = document.createElement('a');
    a.href = signatureDataUrl;
    a.download = 'faraabee_signature.png';
    a.click();
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      let finalSignature = signatureDataUrl;
      const canvas = canvasRef.current;
      if (canvas && strokes.length > 0) {
        finalSignature = canvas.toDataURL('image/png');
      }

      await updateDeveloperSignatureSettings({
        enabled,
        signatureImage: finalSignature,
        customText: customText.trim(),
        customTextUrdu: customTextUrdu.trim(),
        email: email.trim(),
        creatorName: creatorName.trim(),
        badgeTitle: badgeTitle.trim(),
        penColor,
      });

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3500);
    } catch (err) {
      console.error('Failed to save signature settings:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16 max-w-5xl">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#183F32] via-[#245242] to-[#183F32] text-white p-6 sm:p-8 rounded-3xl shadow-lg border border-[#AFC7A5]/30">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-[11px] font-semibold text-[#AFC7A5] tracking-wider uppercase border border-white/15">
              <PenTool className="w-3.5 h-3.5" />
              <span>{isUrdu ? 'ڈویلپر و ڈیزائنر سگنیچر' : 'Website Creator Attribution'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-[#FAF9F3]">
              {isUrdu ? 'ماؤس سے سگنیچر کریں اور اپنی ای میل شامل کریں' : 'Interactive Signature & Creator Attribution'}
            </h2>
            <p className="text-xs sm:text-sm text-[#FAF9F3]/80 max-w-2xl leading-relaxed">
              {isUrdu
                ? 'اپنے ماؤس یا فنگر ٹچ کی مدد سے کینوس پر اپنا اصلی سائن کریں۔ یہ سگنیچر، آپ کی لکھی ہوئی کسٹم لائن اور ای میل پبلک اسٹور کے فوٹر میں نیوز لیٹر باکس کے بالکل نیچے جلوہ گر ہوں گی۔'
                : 'Use your mouse cursor or touchscreen to draw your real handwritten signature. It will display in the website footer directly below the newsletter box with your custom credit line and contact email.'}
            </p>
          </div>

          {/* Master Enable Toggle */}
          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/20 flex items-center gap-3 shrink-0">
            <div className="text-right">
              <span className="block text-xs font-bold text-white">
                {enabled ? (isUrdu ? 'فعال ہے' : 'Active on Footer') : isUrdu ? 'غیر فعال' : 'Hidden'}
              </span>
              <span className="block text-[10px] text-[#AFC7A5]">
                {isUrdu ? 'فوٹر میں دکھائی دے گا' : 'Public Store Visibility'}
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={enabled}
                onChange={(e) => setEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
            </label>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Canvas Signature Studio */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white p-6 sm:p-7 rounded-3xl shadow-sm border border-[#AFC7A5]/30 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#AFC7A5]/20">
              <div className="flex items-center gap-2">
                <PenTool className="w-5 h-5 text-[#183F32]" />
                <h3 className="text-base font-serif font-bold text-[#183F32]">
                  {isUrdu ? 'ماؤس سے سائن کریں (سگنیچر پیڈ)' : 'Digital Signature Pad (Mouse / Touch)'}
                </h3>
              </div>
              <span className="text-[11px] font-mono text-[#183F32]/70 bg-[#FAF9F3] px-2.5 py-1 rounded-full border border-[#AFC7A5]/40">
                {strokes.length > 0 ? `${strokes.length} strokes` : 'Canvas Ready'}
              </span>
            </div>

            {/* Canvas Ink & Pen Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
              {/* Color Choices */}
              <div className="flex items-center gap-2">
                <span className="text-[#26312B]/70 font-medium flex items-center gap-1">
                  <Palette className="w-3.5 h-3.5" />
                  <span>Ink:</span>
                </span>
                <div className="flex items-center gap-1.5">
                  {INK_COLORS.map((c) => (
                    <button
                      key={c.hex}
                      type="button"
                      title={c.name}
                      onClick={() => setPenColor(c.hex)}
                      className={`w-6 h-6 rounded-full border-2 transition-transform cursor-pointer ${
                        penColor === c.hex
                          ? 'border-[#183F32] scale-125 shadow-md ring-2 ring-[#183F32]/20'
                          : 'border-gray-300 hover:scale-110'
                      }`}
                      style={{ backgroundColor: c.hex }}
                    />
                  ))}
                </div>
              </div>

              {/* Pen Thickness */}
              <div className="flex items-center gap-1.5">
                <span className="text-[#26312B]/70 font-medium">Stroke:</span>
                {PEN_WIDTHS.map((w) => (
                  <button
                    key={w.width}
                    type="button"
                    onClick={() => setPenWidth(w.width)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                      penWidth === w.width
                        ? 'bg-[#183F32] text-white shadow-sm'
                        : 'bg-[#FAF9F3] text-[#26312B]/70 hover:bg-[#AFC7A5]/20'
                    }`}
                  >
                    {w.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Interactive Drawing Canvas */}
            <div className="relative rounded-2xl overflow-hidden border-2 border-dashed border-[#183F32]/30 bg-[#183F32] shadow-inner select-none">
              {/* Background watermark hint */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                <span className="text-white font-serif text-lg tracking-widest uppercase">
                  Sign Here With Mouse Cursor
                </span>
              </div>

              <canvas
                ref={canvasRef}
                width={700}
                height={260}
                onMouseDown={handleStartDrawing}
                onMouseMove={handleDraw}
                onMouseUp={handleEndDrawing}
                onMouseLeave={handleEndDrawing}
                onTouchStart={handleStartDrawing}
                onTouchMove={handleDraw}
                onTouchEnd={handleEndDrawing}
                className="w-full h-[220px] sm:h-[260px] cursor-crosshair block relative z-10 touch-none"
              />
            </div>

            {/* Canvas Actions */}
            <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleUndo}
                  disabled={strokes.length === 0}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-gray-100 hover:bg-gray-200 text-[#26312B] transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{isUrdu ? 'واپس' : 'Undo Stroke'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleClearSignature}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-red-50 hover:bg-red-100 text-red-700 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{isUrdu ? 'مٹائیں' : 'Clear Canvas'}</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/png,image/svg+xml,image/jpeg"
                  onChange={handleUploadImage}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-[#FAF9F3] hover:bg-[#AFC7A5]/30 text-[#183F32] border border-[#AFC7A5]/40 transition-colors cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{isUrdu ? 'تصویر اپلوڈ کریں' : 'Upload PNG'}</span>
                </button>
                {signatureDataUrl && (
                  <button
                    type="button"
                    onClick={handleDownloadSignature}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-[#FAF9F3] hover:bg-[#AFC7A5]/30 text-[#183F32] border border-[#AFC7A5]/40 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                )}
              </div>
            </div>

            <p className="text-[11px] text-[#26312B]/60 flex items-center gap-1.5 pt-1">
              <Info className="w-3.5 h-3.5 text-[#183F32] shrink-0" />
              <span>
                {isUrdu
                  ? 'دستخط شفاف بیک گراؤنڈ کے ساتھ خود بخود محفوظ ہو جاتے ہیں تاکہ گہرے سبز فوٹر پر نفاست سے نظر آئیں۔'
                  : 'Your handwritten stroke is saved as a crisp transparent PNG so it sits elegantly over the dark green apothecary footer.'}
              </span>
            </p>
          </div>

          {/* Description & Contact Details Form */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl shadow-sm border border-[#AFC7A5]/30 space-y-5">
            <h3 className="text-base font-serif font-bold text-[#183F32] pb-3 border-b border-[#AFC7A5]/20 flex items-center gap-2">
              <Mail className="w-5 h-5 text-[#183F32]" />
              <span>{isUrdu ? 'پیغام و ای میل کی ترتیبات' : 'Custom Description & Contact Details'}</span>
            </h3>

            {/* Custom Description Line (English) */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#183F32] uppercase tracking-wider">
                {isUrdu ? 'تفصیل / کسٹم لائن (انگریزی)' : 'Custom Description Line (English) *'}
              </label>
              <textarea
                rows={2}
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="This website was created by me. If you want your own custom website, contact:"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-[#AFC7A5]/50 rounded-xl focus:ring-2 focus:ring-[#183F32] focus:outline-none bg-[#FAF9F3]"
              />
              <span className="text-[11px] text-[#26312B]/60 block">
                This exact text displays right above your signature and email in the website footer.
              </span>
            </div>

            {/* Custom Description Line (Urdu) */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#183F32] uppercase tracking-wider">
                {isUrdu ? 'تفصیل / کسٹم لائن (اردو)' : 'Custom Description Line (Urdu Optional)'}
              </label>
              <textarea
                rows={2}
                dir="rtl"
                value={customTextUrdu}
                onChange={(e) => setCustomTextUrdu(e.target.value)}
                placeholder="یہ ویب سائٹ میرے ہاتھوں سے تیار کی گئی ہے۔ اگر آپ اپنی مرضی کی ویب سائٹ بنوانا چاہتے ہیں تو رابطہ کریں:"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-[#AFC7A5]/50 rounded-xl focus:ring-2 focus:ring-[#183F32] focus:outline-none bg-[#FAF9F3] text-right font-serif"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Creator Email */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#183F32] uppercase tracking-wider">
                  {isUrdu ? 'آپ کی ای میل ایڈریس *' : 'Your Contact Email *'}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#183F32]/50 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your-name@gmail.com"
                    className="w-full pl-9 pr-3.5 py-2.5 text-xs sm:text-sm border border-[#AFC7A5]/50 rounded-xl focus:ring-2 focus:ring-[#183F32] focus:outline-none bg-[#FAF9F3]"
                  />
                </div>
              </div>

              {/* Creator Name or Studio */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#183F32] uppercase tracking-wider">
                  {isUrdu ? 'ڈویلپر / دستخط کنندہ کا نام' : 'Creator / Developer Name (Optional)'}
                </label>
                <input
                  type="text"
                  value={creatorName}
                  onChange={(e) => setCreatorName(e.target.value)}
                  placeholder="e.g. Farabi Craftsman"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-[#AFC7A5]/50 rounded-xl focus:ring-2 focus:ring-[#183F32] focus:outline-none bg-[#FAF9F3]"
                />
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-3">
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="w-full py-3.5 px-6 rounded-2xl bg-[#183F32] hover:bg-[#285844] text-[#FAF9F3] font-bold text-xs uppercase tracking-widest shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {savedSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>{isUrdu ? 'کامیابی سے محفوظ ہو گیا!' : 'Signature & Attribution Published!'}</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 text-[#AFC7A5]" />
                    <span>{saving ? 'Publishing...' : isUrdu ? 'ترتیبات محفوظ کریں' : 'Save & Publish to Footer'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right: Live Interactive Footer Preview Simulator */}
        <div className="lg:col-span-5 space-y-6">
          <div className="sticky top-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-[#183F32]" />
                <h3 className="text-sm font-serif font-bold text-[#183F32]">
                  {isUrdu ? 'لائیو فوٹر پریویو (کسٹمر کی نظر میں)' : 'Live Store Footer Preview'}
                </h3>
              </div>
              <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Sync
              </span>
            </div>

            {/* Simulated Footer Card */}
            <div className="bg-[#183F32] text-white p-6 rounded-3xl shadow-xl border border-white/10 space-y-5">
              {/* Context header representing the newsletter */}
              <div className="pb-4 border-b border-white/10 space-y-2 opacity-75">
                <span className="text-[10px] uppercase font-semibold tracking-wider text-[#AFC7A5]">
                  Botanical Journal Dispatch
                </span>
                <p className="text-[11px] text-[#FAF9F3]/70">
                  Receive new product updates and herbal journal essays...
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <div className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-[11px] text-white/50">
                    Enter your email
                  </div>
                  <div className="px-3 py-2 bg-[#AFC7A5] text-[#183F32] font-semibold text-[11px] rounded-lg">
                    Send
                  </div>
                </div>
              </div>

              {/* THE SIGNATURE & CREATOR ATTRIBUTION SECTION (Directly beneath newsletter) */}
              {enabled ? (
                <div className="p-4 rounded-2xl bg-white/5 border border-[#AFC7A5]/30 space-y-3.5 backdrop-blur-sm relative overflow-hidden group">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-[#D4AF37] tracking-wider uppercase">
                      <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                      <span>{badgeTitle || 'Website Creator'}</span>
                    </span>
                    {creatorName && (
                      <span className="text-[10px] font-mono text-[#FAF9F3]/60">{creatorName}</span>
                    )}
                  </div>

                  {/* Custom Description Line */}
                  <p className="text-xs text-[#FAF9F3]/90 leading-relaxed font-sans">
                    {customText || 'This website was created by me. If you want your own custom website, contact:'}
                  </p>

                  {/* Signature graphic & Email Button side by side */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                    {/* Drawn Signature */}
                    <div className="bg-black/20 rounded-xl px-3 py-2 border border-white/10 min-w-[140px] max-w-[220px] flex items-center justify-center">
                      {signatureDataUrl ? (
                        <img
                          src={signatureDataUrl}
                          alt="Handwritten Creator Signature"
                          className="max-h-14 w-auto object-contain filter drop-shadow-sm"
                        />
                      ) : (
                        <div className="text-[10px] italic font-serif text-[#D4AF37]/80 py-1 tracking-wider">
                          [ Sign on pad to appear here ]
                        </div>
                      )}
                    </div>

                    {/* Contact Email Button */}
                    <a
                      href={`mailto:${email}`}
                      onClick={(e) => e.preventDefault()}
                      className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#FAF9F3] hover:bg-white text-[#183F32] text-xs font-bold transition-all shadow-md shrink-0 cursor-pointer"
                    >
                      <Mail className="w-3.5 h-3.5 text-[#183F32]" />
                      <span className="truncate max-w-[170px]">{email || 'contact@example.com'}</span>
                      <ExternalLink className="w-3 h-3 text-[#183F32]/50" />
                    </a>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl border border-dashed border-white/20 text-center py-6 text-xs text-white/50">
                  Creator attribution is currently toggled OFF. Switch the toggle above to enable it.
                </div>
              )}

              {/* Physical contact footer touchpoint simulation */}
              <div className="pt-2 border-t border-white/10 text-[11px] text-[#FAF9F3]/50 flex items-center justify-between">
                <span>© 2026 FARAABEE Apothecary</span>
                <span className="text-emerald-400 font-mono text-[10px]">Footer View</span>
              </div>
            </div>

            {/* Quick Tips */}
            <div className="bg-emerald-50/70 border border-emerald-200/60 p-4 rounded-2xl text-xs text-emerald-900 space-y-1.5">
              <span className="font-bold flex items-center gap-1.5 text-emerald-950">
                <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                <span>Tips for a crisp signature</span>
              </span>
              <ul className="list-disc list-inside space-y-1 text-emerald-800 text-[11px] leading-relaxed">
                <li>Draw at a steady, continuous speed with your mouse or stylus.</li>
                <li>Imperial Gold (#D4AF37) gives a distinguished calligraphic herbal seal.</li>
                <li>You can click "Undo Stroke" at any time if a curve goes off-track.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
