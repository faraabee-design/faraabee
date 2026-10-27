import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import {
  X,
  Mic,
  Square,
  Play,
  Pause,
  RotateCcw,
  Calendar,
  Clock,
  Sparkles,
  Phone,
  MessageCircle,
  FileText,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Send,
  Heart,
  User,
  MapPin,
  Volume2,
} from 'lucide-react';
import { ConsultationType } from '../types';
import { FirewallEngine } from '../lib/firewallEngine';

interface SpiritualAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCategory?: string;
}

const PROBLEM_CATEGORIES = [
  { id: 'anxiety', label: 'Spiritual Serenity & Anxiety', urdu: 'دل کا سکون، گھبراہٹ و وسوسے' },
  { id: 'ruqyah', label: 'Ruqyah & Evil Eye Protection', urdu: 'نظر بد، سحر و روحانی حفاظت' },
  { id: 'tibb', label: 'Prophetic Medicine & Diet', urdu: 'طب نبوی، غذا و نباتاتی علاج' },
  { id: 'chronic', label: 'Chronic Physical Pain & Sleep', urdu: 'دائمی جسمانی درد، بے خوابی و جوڑوں کا درد' },
  { id: 'family', label: 'Family Wellbeing & Peace', urdu: 'گھریلو ناچاقی، سکون و برکت' },
  { id: 'general', label: 'General Herbal Consultation', urdu: 'عام نباتاتی و جڑی بوٹیوں کی رہنمائی' },
];

const TIME_SLOTS = [
  { id: 'morning', label: 'Morning (10:00 AM - 1:00 PM)', urdu: 'صبح (10:00 بجے تا 1:00 بجے)' },
  { id: 'afternoon', label: 'Afternoon (2:00 PM - 5:00 PM)', urdu: 'دوپہر (2:00 بجے تا 5:00 بجے)' },
  { id: 'evening', label: 'Evening (5:00 PM - 8:00 PM)', urdu: 'شام (5:00 بجے تا 8:00 بجے)' },
  { id: 'night', label: 'Night (8:00 PM - 10:00 PM)', urdu: 'رات (8:00 بجے تا 10:00 بجے)' },
];

export const SpiritualAppointmentModal: React.FC<SpiritualAppointmentModalProps> = ({
  isOpen,
  onClose,
  defaultCategory,
}) => {
  const { appointmentConfig, createAppointment, language, contactInfo } = useStore();
  const isUrdu = language === 'ur';

  // Form State
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [city, setCity] = useState('');
  const [category, setCategory] = useState(defaultCategory || PROBLEM_CATEGORIES[0].label);
  const [consultationType, setConsultationType] = useState<ConsultationType>('voice_recording');
  const [preferredDate, setPreferredDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [preferredTimeSlot, setPreferredTimeSlot] = useState(TIME_SLOTS[1].label);
  const [problemDescription, setProblemDescription] = useState('');

  // Audio Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [micPermissionError, setMicPermissionError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<any>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  // Submission & Confirmation state
  const [submitting, setSubmitting] = useState(false);
  const [submittedReference, setSubmittedReference] = useState<string | null>(null);
  const [honeypotField, setHoneypotField] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (defaultCategory) {
      setCategory(defaultCategory);
    }
  }, [defaultCategory]);

  // Clean up audio & timers on modal close
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop();
      }
    };
  }, [isRecording]);

  if (!isOpen) return null;

  // Audio recording handlers using standard MediaRecorder API with mobile phone optimization
  const startRecording = async () => {
    setMicPermissionError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1, // Mono channel to optimize file size
          sampleRate: 16000, // Voice telephony sampling
          echoCancellation: true,
          noiseSuppression: true,
        },
      });
      audioChunksRef.current = [];

      const preferredMimes = [
        'audio/webm;codecs=opus',
        'audio/webm',
        'audio/mp4',
        'audio/aac',
      ];
      let chosenMime = '';
      for (const m of preferredMimes) {
        if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(m)) {
          chosenMime = m;
          break;
        }
      }

      const recorderOptions: MediaRecorderOptions = {
        audioBitsPerSecond: 16000,
      };
      if (chosenMime) recorderOptions.mimeType = chosenMime;

      const recorder = new MediaRecorder(stream, recorderOptions);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: chosenMime || 'audio/webm' });
        const reader = new FileReader();
        reader.onloadend = () => {
          setAudioUrl(reader.result as string);
        };
        reader.readAsDataURL(audioBlob);

        // Stop all audio tracks to release microphone
        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start(250);
      setIsRecording(true);
      setRecordingDuration(0);

      timerIntervalRef.current = setInterval(() => {
        setRecordingDuration((prev) => {
          if (prev >= 45) {
            // Auto stop at 45 seconds (optimized for phone data & voice intake)
            stopRecording();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (err: any) {
      console.warn('Microphone error:', err);
      setMicPermissionError(
        isUrdu
          ? 'مائیکروفون کی اجازت نہیں ملی۔ آپ اپنا مسئلہ نیچے لکھ کر بھی ارسال کر سکتے ہیں۔'
          : 'Microphone access denied or not supported. You can easily type your problem below instead.'
      );
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    }
  };

  const resetAudio = () => {
    setAudioUrl(null);
    setRecordingDuration(0);
    setIsPlayingAudio(false);
  };

  const togglePlayAudio = () => {
    if (!audioPlayerRef.current && audioUrl) {
      audioPlayerRef.current = new Audio(audioUrl);
      audioPlayerRef.current.onended = () => setIsPlayingAudio(false);
    }

    if (audioPlayerRef.current) {
      if (isPlayingAudio) {
        audioPlayerRef.current.pause();
        setIsPlayingAudio(false);
      } else {
        audioPlayerRef.current.play();
        setIsPlayingAudio(true);
      }
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!customerName.trim() || !customerPhone.trim()) {
      setFormError('Please enter both patient name and contact phone number.');
      return;
    }

    setSubmitting(true);

    // 1. Check Firewall Emergency Lockdown
    const lockdown = await FirewallEngine.checkLockdown();
    if (lockdown.isLocked) {
      setFormError(lockdown.message || 'Consultation bookings are temporarily paused for security.');
      setSubmitting(false);
      return;
    }

    // 2. Check Anti-Bot Honeypot Trap
    const botCheck = await FirewallEngine.verifyHoneypot(honeypotField, '/spiritual/book-appointment');
    if (!botCheck.passed) {
      setFormError('Verification failed. Automated submissions are blocked.');
      setSubmitting(false);
      return;
    }

    // 3. Check Sliding Window Rate Limiter
    const rateCheck = await FirewallEngine.checkRateLimit('appointment', '/spiritual/book-appointment');
    if (!rateCheck.passed) {
      setFormError(rateCheck.error || 'Too many submissions. Please wait a moment.');
      setSubmitting(false);
      return;
    }

    // 4. Inspect inputs for malicious code / script injection
    const rawInspectionString = [customerName, customerPhone, customerEmail, city, problemDescription].join(' ');
    const inspection = FirewallEngine.inspectString(rawInspectionString);
    if (inspection.isMalicious) {
      await FirewallEngine.recordThreatIncident({
        category: inspection.category || 'xss_injection',
        severity: 'high',
        description: `Blocked code injection in appointment booking: ${inspection.reason}`,
        sourceEndpoint: '/spiritual/book-appointment',
        payloadSnippet: inspection.snippet,
        actionTaken: 'blocked_and_quarantined',
      });
      setFormError('Security Notice: Code tags and script elements are blocked for safety. Please enter plain text only.');
      setSubmitting(false);
      return;
    }

    try {
      const randomDigits = Math.floor(10000 + Math.random() * 90000);
      const generatedRef = `APT-${randomDigits}`;

      await createAppointment({
        referenceId: generatedRef,
        customerName: FirewallEngine.sanitizeString(customerName.trim()),
        customerPhone: FirewallEngine.sanitizeString(customerPhone.trim()),
        customerEmail: customerEmail.trim() ? FirewallEngine.sanitizeString(customerEmail.trim()) : undefined,
        city: city.trim() ? FirewallEngine.sanitizeString(city.trim()) : 'Pakistan',
        preferredDate,
        preferredTimeSlot,
        consultationType,
        category,
        problemDescription: problemDescription.trim()
          ? FirewallEngine.sanitizeString(problemDescription.trim())
          : (audioUrl ? 'Voice consultation recording attached' : ''),
        audioRecordingUrl: audioUrl || undefined,
        audioDurationSeconds: recordingDuration > 0 ? recordingDuration : undefined,
        status: 'pending',
      });

      setSubmittedReference(generatedRef);
    } catch (err) {
      console.error('Failed to book appointment:', err);
      setFormError('Could not submit appointment. Please check your network connection and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const getWhatsAppFastTrackUrl = () => {
    const phone = appointmentConfig.whatsappDeskNumber || contactInfo.whatsappNumber || '923091655743';
    const msg = `Salam FARAABEE Apothecary,%0A%0AI have requested a Spiritual Consultation:%0A*Reference ID:* ${submittedReference}%0A*Patient:* ${customerName}%0A*Category:* ${category}%0A*Preferred Slot:* ${preferredDate} (${preferredTimeSlot})%0A%0APlease confirm my appointment timeline. Thank you!`;
    return `https://wa.me/${phone}?text=${msg}`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 animate-fade-in">
      <div className="relative bg-[#FAF9F3] text-[#26312B] w-full max-w-2xl rounded-3xl shadow-2xl border border-[#AFC7A5]/50 overflow-hidden my-6">
        {/* Modal Top Header with Sacred Botanical Accent */}
        <div className="bg-gradient-to-r from-[#183F32] via-[#245242] to-[#183F32] text-white p-6 sm:p-7 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#AFC7A5]/10 rounded-full blur-2xl pointer-events-none" />
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer z-10"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-[11px] font-semibold text-[#AFC7A5] tracking-wider uppercase border border-white/10">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>{isUrdu ? 'روحانی و نباتاتی مشاورت' : 'Confidential Spiritual & Tibb Consultation'}</span>
            </span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#FAF9F3] tracking-tight">
            {isUrdu ? 'مشورہ و شفا کے لیے اپوائنٹمنٹ بک کریں' : 'Request a Spiritual & Tibb Consultation'}
          </h3>
          <p className="text-xs sm:text-sm text-[#FAF9F3]/80 mt-1 max-w-xl leading-relaxed">
            {isUrdu
              ? 'اپنا مسئلہ بول کر آڈیو ریکارڈ کریں یا لکھ کر بھیجیں۔ حکیم صاحب اور روحانی معالج آپ کے لیے مخصوص وقت مقرر فرمائیں گے۔'
              : 'Easily record your voice explaining your issue or type your symptoms. Receive a confirmed appointment slot & personalized prophetic guidance.'}
          </p>
        </div>

        {/* Master Closed Notice Warning if Admin Paused Appointments */}
        {!appointmentConfig.acceptingAppointments && !submittedReference && (
          <div className="m-5 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">
                {isUrdu ? 'آج کے لیے اپوائنٹمنٹس عارضی طور پر موقوف ہیں' : 'Consultations Temporarily Paused'}
              </p>
              <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                {isUrdu ? appointmentConfig.closedNoticeMessageUrdu : appointmentConfig.closedNoticeMessage}
              </p>
            </div>
          </div>
        )}

        {/* Post-Submission Success Screen */}
        {submittedReference ? (
          <div className="p-6 sm:p-8 space-y-6 text-center animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 mx-auto flex items-center justify-center shadow-inner">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h4 className="text-xl sm:text-2xl font-serif font-bold text-[#183F32]">
                {isUrdu ? 'آپ کی درخواست موصول ہو چکی ہے' : 'Appointment Request Received'}
              </h4>
              <p className="text-xs sm:text-sm text-[#26312B]/80 max-w-md mx-auto leading-relaxed">
                {isUrdu
                  ? `محترم ${customerName}، آپ کی مشاورت کی درخواست کامیابی سے سسٹم میں درج ہو چکی ہے۔ ہمارا کیئر ڈیسک جلد آپ سے رابطہ کرے گا۔`
                  : `Thank you, ${customerName}. Your consultation request has been lodged in our apothecary system. Hakeem Sahib will review your details and confirm your consultation timeline.`}
              </p>
            </div>

            {/* Reference Badge Card */}
            <div className="p-5 bg-white rounded-2xl border border-[#AFC7A5]/40 shadow-xs max-w-md mx-auto text-left space-y-2.5">
              <div className="flex justify-between items-center pb-2 border-b border-[#AFC7A5]/20 text-xs">
                <span className="text-[#26312B]/70">{isUrdu ? 'اپوائنٹمنٹ ریفرنس:' : 'Reference ID:'}</span>
                <span className="font-mono font-bold text-[#183F32] bg-[#FAF9F3] px-2.5 py-1 rounded border border-[#AFC7A5]/50">
                  {submittedReference}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#26312B]/70">{isUrdu ? 'مطلوبہ وقت:' : 'Requested Window:'}</span>
                <span className="font-semibold text-[#183F32]">
                  {preferredDate} ({preferredTimeSlot})
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#26312B]/70">{isUrdu ? 'نوعیت مشاورت:' : 'Topic:'}</span>
                <span className="font-semibold text-[#183F32]">{category}</span>
              </div>
              {audioUrl && (
                <div className="flex justify-between items-center text-xs pt-1 text-emerald-800 font-medium">
                  <span className="flex items-center gap-1">
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Voice Message:</span>
                  </span>
                  <span>Attached ({formatTimer(recordingDuration)})</span>
                </div>
              )}
            </div>

            {/* Fast-Track WhatsApp Dispatch */}
            <div className="space-y-3 max-w-md mx-auto">
              <a
                href={getWhatsAppFastTrackUrl()}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3.5 px-6 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{isUrdu ? 'واٹس ایپ پر فوری تصدیق لیں' : 'Fast-Track on WhatsApp Desk'}</span>
              </a>

              <button
                onClick={onClose}
                className="w-full py-2.5 px-4 text-xs font-semibold text-[#26312B]/70 hover:text-[#183F32] cursor-pointer"
              >
                {isUrdu ? 'بند کریں' : 'Done & Return to Sanctuary'}
              </button>
            </div>
          </div>
        ) : (
          /* Form Content */
          <form onSubmit={handleSubmit} className="p-6 sm:p-7 space-y-6 max-h-[75vh] overflow-y-auto">
            {/* Anti-Bot Security Honeypot (Invisible to humans) */}
            <input
              type="text"
              name="farabi_bot_detector"
              value={honeypotField}
              onChange={(e) => setHoneypotField(e.target.value)}
              style={{ display: 'none', position: 'absolute', opacity: 0, pointerEvents: 'none' }}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
            />

            {/* Security or Validation Error Banner */}
            {formError && (
              <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span className="leading-relaxed font-medium">{formError}</span>
              </div>
            )}

            {/* Consultation Choice Mode */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-[#183F32] uppercase tracking-wider">
                {isUrdu ? '1. آپ اپنا مسئلہ کیسے بیان کرنا چاہتے ہیں؟' : '1. How would you like to explain your issue?'}
              </label>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setConsultationType('voice_recording')}
                  className={`p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-center gap-3 ${
                    consultationType === 'voice_recording'
                      ? 'border-[#183F32] bg-[#183F32]/5 shadow-xs'
                      : 'border-[#AFC7A5]/40 bg-white hover:border-[#183F32]/50'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      consultationType === 'voice_recording'
                        ? 'bg-[#183F32] text-white'
                        : 'bg-[#FAF9F3] text-[#183F32]'
                    }`}
                  >
                    <Mic className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-[#183F32]">
                      {isUrdu ? 'آواز ریکارڈ کریں' : 'Record Voice Audio'}
                    </span>
                    <span className="block text-[10px] text-[#26312B]/60">
                      {isUrdu ? 'بول کر آسانی سے بتائیں' : 'Speak easily into mic'}
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setConsultationType('written_text')}
                  className={`p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-center gap-3 ${
                    consultationType === 'written_text'
                      ? 'border-[#183F32] bg-[#183F32]/5 shadow-xs'
                      : 'border-[#AFC7A5]/40 bg-white hover:border-[#183F32]/50'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      consultationType === 'written_text'
                        ? 'bg-[#183F32] text-white'
                        : 'bg-[#FAF9F3] text-[#183F32]'
                    }`}
                  >
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-[#183F32]">
                      {isUrdu ? 'مسئلہ تحریر کریں' : 'Type Issue in Words'}
                    </span>
                    <span className="block text-[10px] text-[#26312B]/60">
                      {isUrdu ? 'تفصیل سے لکھیں' : 'Write text description'}
                    </span>
                  </div>
                </button>
              </div>
            </div>

            {/* Voice Audio Recording Studio */}
            {consultationType === 'voice_recording' && (
              <div className="p-5 rounded-2xl bg-white border border-[#AFC7A5]/50 shadow-xs space-y-4 animate-fade-in">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mic className="w-4 h-4 text-[#183F32]" />
                    <span className="text-xs font-bold text-[#183F32]">
                      {isUrdu ? 'صوتی پیغام / وائس ریکارڈر' : 'Voice Problem Recorder'}
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#183F32] bg-[#FAF9F3] px-2.5 py-1 rounded-full border border-[#AFC7A5]/40">
                    {formatTimer(recordingDuration)} / 3:00
                  </span>
                </div>

                {/* Recorder Control Bar */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-1">
                  {!isRecording && !audioUrl && (
                    <button
                      type="button"
                      onClick={startRecording}
                      className="w-full sm:w-auto px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer animate-pulse"
                    >
                      <Mic className="w-4 h-4" />
                      <span>{isUrdu ? 'ریکارڈنگ شروع کریں' : 'Tap to Start Recording'}</span>
                    </button>
                  )}

                  {isRecording && (
                    <div className="w-full flex items-center justify-between gap-3 p-3 bg-red-50 rounded-xl border border-red-200">
                      <div className="flex items-center gap-2 text-red-700 text-xs font-semibold">
                        <span className="w-3 h-3 rounded-full bg-red-600 animate-ping" />
                        <span>{isUrdu ? 'ریکارڈنگ جاری ہے...' : 'Recording in progress...'}</span>
                      </div>
                      <button
                        type="button"
                        onClick={stopRecording}
                        className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm"
                      >
                        <Square className="w-3.5 h-3.5" />
                        <span>{isUrdu ? 'مکمل کریں' : 'Finish Audio'}</span>
                      </button>
                    </div>
                  )}

                  {audioUrl && !isRecording && (
                    <div className="w-full flex items-center justify-between gap-3 p-3 bg-[#E8F1DF]/70 rounded-xl border border-[#AFC7A5]">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={togglePlayAudio}
                          className="w-9 h-9 rounded-full bg-[#183F32] hover:bg-[#285844] text-white flex items-center justify-center shadow-sm cursor-pointer"
                        >
                          {isPlayingAudio ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 pl-0.5" />}
                        </button>
                        <span className="text-xs font-medium text-[#183F32]">
                          {isPlayingAudio ? 'Playing your recording...' : 'Voice message ready for Hakeem'}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={resetAudio}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                        title="Re-record"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>{isUrdu ? 'دوبارہ' : 'Re-record'}</span>
                      </button>
                    </div>
                  )}
                </div>

                {micPermissionError && (
                  <p className="text-[11px] text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{micPermissionError}</span>
                  </p>
                )}

                {/* Optional helper text note */}
                <textarea
                  rows={2}
                  value={problemDescription}
                  onChange={(e) => setProblemDescription(e.target.value)}
                  placeholder={
                    isUrdu
                      ? 'اختیاری: آڈیو کے ساتھ کوئی تحریری نوٹ یا اہم بات لکھنا چاہیں تو یہاں لکھیں...'
                      : 'Optional: Add any brief written note alongside your voice message...'
                  }
                  className="w-full px-3.5 py-2 text-xs border border-[#AFC7A5]/40 rounded-xl focus:ring-2 focus:ring-[#183F32] focus:outline-none bg-[#FAF9F3]"
                />
              </div>
            )}

            {/* Written Problem Description Area */}
            {consultationType === 'written_text' && (
              <div className="space-y-2 animate-fade-in">
                <label className="block text-xs font-bold text-[#183F32] uppercase tracking-wider">
                  {isUrdu ? 'اپنے مسائل یا علامات کی تفصیل بیان کریں *' : 'Describe your health or spiritual condition *'}
                </label>
                <textarea
                  required
                  rows={4}
                  value={problemDescription}
                  onChange={(e) => setProblemDescription(e.target.value)}
                  placeholder={
                    isUrdu
                      ? 'اپنے مسائل (جیسے بے خوابی، ذہنی دباؤ، جسمانی درد، خوف، یا نباتاتی جڑی بوٹیوں کے بارے میں سوال) تفصیل سے تحریر فرمائیں...'
                      : 'Kindly mention your main symptoms, duration, spiritual anxiety, sleeplessness, or specific botanical remedies you are inquiring about...'
                  }
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-[#AFC7A5]/50 rounded-xl focus:ring-2 focus:ring-[#183F32] focus:outline-none bg-white shadow-xs"
                />
              </div>
            )}

            {/* Problem Category Selection */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#183F32] uppercase tracking-wider">
                {isUrdu ? '2. مشاورت کا زمرہ منتخب کریں' : '2. Select Problem / Inquiry Category'}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {PROBLEM_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.label)}
                    className={`px-3 py-2.5 rounded-xl text-xs text-left font-medium transition-all cursor-pointer border ${
                      category === cat.label
                        ? 'border-[#183F32] bg-[#183F32] text-white font-bold shadow-xs'
                        : 'border-[#AFC7A5]/40 bg-white text-[#26312B]/80 hover:bg-[#E8F1DF]'
                    }`}
                  >
                    <span>{isUrdu ? cat.urdu : cat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Preferred Appointment Date & Time Window */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#183F32] uppercase tracking-wider">
                {isUrdu ? '3. ترجیحی تاریخ و وقت کا انتخاب کریں' : '3. Preferred Appointment Timeline'}
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <span className="text-[11px] text-[#26312B]/70 block font-medium">Preferred Date:</span>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-[#183F32]/50 absolute left-3 top-2.5" />
                    <input
                      type="date"
                      required
                      min={new Date().toISOString().split('T')[0]}
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs border border-[#AFC7A5]/50 rounded-xl focus:ring-2 focus:ring-[#183F32] focus:outline-none bg-white font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] text-[#26312B]/70 block font-medium">Preferred Time Slot:</span>
                  <div className="relative">
                    <Clock className="w-4 h-4 text-[#183F32]/50 absolute left-3 top-2.5" />
                    <select
                      value={preferredTimeSlot}
                      onChange={(e) => setPreferredTimeSlot(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs border border-[#AFC7A5]/50 rounded-xl focus:ring-2 focus:ring-[#183F32] focus:outline-none bg-white font-medium"
                    >
                      {TIME_SLOTS.map((slot) => (
                        <option key={slot.id} value={slot.label}>
                          {isUrdu ? slot.urdu : slot.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-[#183F32]/70 italic pt-0.5">
                {isUrdu
                  ? `مشاورت کے عام اوقات: ${appointmentConfig.consultationWindowStart} تا ${appointmentConfig.consultationWindowEnd}`
                  : `Apothecary timeline window: ${appointmentConfig.consultationWindowStart} to ${appointmentConfig.consultationWindowEnd} (${appointmentConfig.slotDurationMinutes} mins).`}
              </p>
            </div>

            {/* Patient Contact Information */}
            <div className="space-y-3 pt-2 border-t border-[#AFC7A5]/30">
              <label className="block text-xs font-bold text-[#183F32] uppercase tracking-wider">
                {isUrdu ? '4. رابطہ و مریض کی تفصیلات' : '4. Your Contact Details'}
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="relative">
                  <User className="w-4 h-4 text-[#183F32]/50 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder={isUrdu ? 'مریض کا نام *' : 'Patient Full Name *'}
                    className="w-full pl-9 pr-3 py-2 text-xs border border-[#AFC7A5]/50 rounded-xl focus:ring-2 focus:ring-[#183F32] focus:outline-none bg-white font-medium"
                  />
                </div>

                <div className="relative">
                  <Phone className="w-4 h-4 text-[#183F32]/50 absolute left-3 top-2.5" />
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder={isUrdu ? 'واٹس ایپ / فون نمبر *' : 'WhatsApp / Mobile Number *'}
                    className="w-full pl-9 pr-3 py-2 text-xs border border-[#AFC7A5]/50 rounded-xl focus:ring-2 focus:ring-[#183F32] focus:outline-none bg-white font-medium"
                  />
                </div>

                <div className="relative">
                  <MapPin className="w-4 h-4 text-[#183F32]/50 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder={isUrdu ? 'شہر / علاقہ (مثلاً لاہور، کراچی)' : 'City / Location (e.g. Lahore, Karachi)'}
                    className="w-full pl-9 pr-3 py-2 text-xs border border-[#AFC7A5]/50 rounded-xl focus:ring-2 focus:ring-[#183F32] focus:outline-none bg-white font-medium"
                  />
                </div>

                <div className="relative">
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder={isUrdu ? 'ای میل ایڈریس (اختیاری)' : 'Email address (Optional)'}
                    className="w-full px-3 py-2 text-xs border border-[#AFC7A5]/50 rounded-xl focus:ring-2 focus:ring-[#183F32] focus:outline-none bg-white font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Privacy & Fee Notice */}
            <div className="p-3 bg-[#E8F1DF]/60 rounded-xl border border-[#AFC7A5]/40 flex items-center gap-2.5 text-[11px] text-[#183F32]">
              <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>
                {isUrdu ? appointmentConfig.consultationFeeNoticeUrdu : appointmentConfig.consultationFeeNotice}
              </span>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting || !appointmentConfig.acceptingAppointments}
                className="w-full py-3.5 px-6 rounded-2xl bg-[#183F32] hover:bg-[#285844] text-[#FAF9F3] font-bold text-xs uppercase tracking-widest shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {submitting ? (
                  <span>Lodging Consultation Request...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4 text-[#AFC7A5]" />
                    <span>
                      {isUrdu ? 'اپوائنٹمنٹ کی درخواست ارسال کریں' : 'Submit Consultation & Get Appointment'}
                    </span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
