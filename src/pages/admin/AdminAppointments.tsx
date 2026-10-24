import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  MessageCircle,
  Phone,
  Search,
  Filter,
  Play,
  Pause,
  Trash2,
  ExternalLink,
  Sparkles,
  User,
  Sliders,
  Send,
  Save,
  Volume2,
  CalendarCheck,
  Check,
  X,
  FileText,
  HelpCircle,
  RefreshCw,
} from 'lucide-react';
import { SpiritualAppointment, AppointmentStatus } from '../../types';

interface AdminAppointmentsProps {
  onNotify?: (msg: string) => void;
}

export const AdminAppointments: React.FC<AdminAppointmentsProps> = ({ onNotify }) => {
  const {
    appointments,
    appointmentConfig,
    updateAppointmentStatus,
    deleteAppointment,
    updateAppointmentConfig,
    language,
    contactInfo,
  } = useStore();
  const isUrdu = language === 'ur';

  // Navigation & Filter state
  const [activeTab, setActiveTab] = useState<'appointments' | 'timeline_settings'>('appointments');
  const [statusFilter, setStatusFilter] = useState<'all' | AppointmentStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected appointment modal for scheduling / review
  const [schedulingAppointment, setSchedulingAppointment] = useState<SpiritualAppointment | null>(null);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('16:00');
  const [scheduleSlotLabel, setScheduleSlotLabel] = useState('');
  const [adminNotes, setAdminNotes] = useState('');

  // Audio Player state
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  // Timeline Settings state
  const [timelineSettings, setTimelineSettings] = useState(appointmentConfig);
  const [savingSettings, setSavingSettings] = useState(false);

  // Audio Playback Handler
  const handleToggleAudio = (appointment: SpiritualAppointment) => {
    if (!appointment.audioRecordingUrl) return;

    if (playingAudioId === appointment.id) {
      audioElement?.pause();
      setPlayingAudioId(null);
    } else {
      audioElement?.pause();
      const audio = new Audio(appointment.audioRecordingUrl);
      audio.onended = () => setPlayingAudioId(null);
      audio.play();
      setAudioElement(audio);
      setPlayingAudioId(appointment.id);
    }
  };

  // Open scheduling modal for an appointment
  const openScheduleModal = (apt: SpiritualAppointment) => {
    setSchedulingAppointment(apt);
    setScheduleDate(apt.preferredDate || new Date().toISOString().split('T')[0]);
    setScheduleTime(apt.scheduledTime ? apt.scheduledTime.split('T')[1] || '16:00' : '16:00');
    setScheduleSlotLabel(
      apt.confirmedSlotLabel ||
        `${apt.preferredDate || 'Tomorrow'} • ${apt.preferredTimeSlot || 'Afternoon (4:00 PM PKT)'}`
    );
    setAdminNotes(apt.adminNotes || '');
  };

  const handleConfirmSchedule = async () => {
    if (!schedulingAppointment) return;
    try {
      await updateAppointmentStatus(
        schedulingAppointment.id,
        'confirmed',
        adminNotes.trim(),
        `${scheduleDate}T${scheduleTime}`,
        scheduleSlotLabel.trim(),
        true
      );
      onNotify?.(`Appointment ${schedulingAppointment.referenceId} confirmed & scheduled!`);
      setSchedulingAppointment(null);
    } catch {
      onNotify?.('Failed to update appointment schedule.');
    }
  };

  const getWhatsAppConfirmationUrl = (apt: SpiritualAppointment) => {
    const phone = apt.customerPhone.replace(/[^0-9]/g, '');
    const cleanPhone = phone.startsWith('0') ? `92${phone.slice(1)}` : phone;

    const message = `*FARAABEE APOTHECARY • روحانی و طبی مشورہ تصدیق*

محترم / محترمہ *${apt.customerName}* صاحب،
السلام علیکم ورحمۃ اللہ،

آپ کی روحانی مشاورت کی درخواست کامیابی سے منظور کر لی گئی ہے:

📌 *ریفرنس نمبر:* ${apt.referenceId}
🗓️ *مقررہ تاریخ و وقت:* ${apt.confirmedSlotLabel || apt.scheduledTime || 'جلد ہی رابطہ کیا جائے گا'}
🩺 *زمرہ:* ${apt.category}
📞 *طریقۂ مشاورت:* ${apt.consultationType === 'voice_recording' ? 'صوتی پیغام / وائس کال' : 'واٹس ایپ تحریری و صوتی مشاورت'}

${apt.adminNotes ? `🌿 *حکیم صاحب کی خصوصی ہدایات:*\n${apt.adminNotes}\n` : ''}
شکریہ،
*فارابی ہربل اینڈ روحانی کلینک*
رابطہ ڈیسک: ${appointmentConfig.whatsappDeskNumber || contactInfo.phone}`;

    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
  };

  const handleSaveTimelineSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      await updateAppointmentConfig(timelineSettings);
      onNotify?.('Timeline settings updated and published!');
    } catch {
      onNotify?.('Failed to save settings.');
    } finally {
      setSavingSettings(false);
    }
  };

  // Filtered appointments
  const filteredAppointments = appointments.filter((apt) => {
    const matchesStatus = statusFilter === 'all' || apt.status === statusFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      apt.customerName.toLowerCase().includes(q) ||
      apt.customerPhone.toLowerCase().includes(q) ||
      apt.referenceId.toLowerCase().includes(q) ||
      (apt.city && apt.city.toLowerCase().includes(q)) ||
      (apt.problemDescription && apt.problemDescription.toLowerCase().includes(q));

    return matchesStatus && matchesSearch;
  });

  // Stats calculation
  const totalCount = appointments.length;
  const pendingCount = appointments.filter((a) => a.status === 'pending').length;
  const confirmedCount = appointments.filter((a) => a.status === 'confirmed').length;
  const completedCount = appointments.filter((a) => a.status === 'completed').length;

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#183F32] via-[#245242] to-[#183F32] text-white p-6 sm:p-8 rounded-3xl shadow-lg border border-[#AFC7A5]/30">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-[11px] font-semibold text-[#AFC7A5] tracking-wider uppercase border border-white/15">
              <CalendarCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>{isUrdu ? 'روحانی مشاورت و اپوائنٹمنٹس' : 'Spiritual Consultations Desk'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#FAF9F3] tracking-tight">
              {isUrdu ? 'مریضوں کی اپوائنٹمنٹس و اوقات کار' : 'Spiritual Appointments & Timeline Manager'}
            </h2>
            <p className="text-xs sm:text-sm text-[#FAF9F3]/80 max-w-2xl leading-relaxed">
              {isUrdu
                ? 'مریضوں کے ریکارڈ شدہ صوتی پیغامات سنیں، اپوائنٹمنٹ کی منظوری دیں، واٹس ایپ پر نوٹیفکیشن ارسال کریں اور مشاورت کے اوقات کار کھولیں یا بند کریں۔'
                : 'Listen to patients’ voice notes, review submitted issues, schedule confirmed time slots, dispatch WhatsApp confirmations, and control clinic intake hours.'}
            </p>
          </div>

          {/* Quick Master Intake Toggle */}
          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/20 flex items-center gap-3 shrink-0">
            <div className="text-right">
              <span className="block text-xs font-bold text-white">
                {timelineSettings.acceptingAppointments
                  ? isUrdu
                    ? 'مشاورت کھلی ہے'
                    : 'Intake OPEN'
                  : isUrdu
                  ? 'مشاورت موقوف ہے'
                  : 'Intake PAUSED'}
              </span>
              <span className="block text-[10px] text-[#AFC7A5]">
                {timelineSettings.acceptingAppointments
                  ? 'Patients can request'
                  : 'Closed notice showing'}
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={timelineSettings.acceptingAppointments}
                onChange={async (e) => {
                  const val = e.target.checked;
                  setTimelineSettings((prev) => ({ ...prev, acceptingAppointments: val }));
                  await updateAppointmentConfig({ acceptingAppointments: val });
                  onNotify?.(val ? 'Intake opened for visitors' : 'Intake paused for visitors');
                }}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
            </label>
          </div>
        </div>

        {/* Quick KPI Stat Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-white/10 mt-6">
          <div className="bg-white/10 rounded-2xl p-3 text-center border border-white/10">
            <span className="text-xl sm:text-2xl font-bold font-mono text-white">{totalCount}</span>
            <span className="block text-[11px] text-[#AFC7A5] font-medium uppercase tracking-wider">
              Total Inquiries
            </span>
          </div>
          <div className="bg-white/10 rounded-2xl p-3 text-center border border-white/10">
            <span className="text-xl sm:text-2xl font-bold font-mono text-amber-300">{pendingCount}</span>
            <span className="block text-[11px] text-amber-200 font-medium uppercase tracking-wider">
              Pending Review
            </span>
          </div>
          <div className="bg-white/10 rounded-2xl p-3 text-center border border-white/10">
            <span className="text-xl sm:text-2xl font-bold font-mono text-emerald-300">{confirmedCount}</span>
            <span className="block text-[11px] text-emerald-200 font-medium uppercase tracking-wider">
              Confirmed / Scheduled
            </span>
          </div>
          <div className="bg-white/10 rounded-2xl p-3 text-center border border-white/10">
            <span className="text-xl sm:text-2xl font-bold font-mono text-blue-300">{completedCount}</span>
            <span className="block text-[11px] text-blue-200 font-medium uppercase tracking-wider">
              Completed
            </span>
          </div>
        </div>
      </div>

      {/* Tab Navigation (Inquiries List vs Clinic Timeline Settings) */}
      <div className="flex items-center gap-2 border-b border-[#AFC7A5]/30 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('appointments')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'appointments'
              ? 'bg-[#183F32] text-white shadow-sm'
              : 'bg-white text-[#26312B]/70 hover:bg-[#E8F1DF]'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Patient Appointment Inquiries ({appointments.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('timeline_settings')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'timeline_settings'
              ? 'bg-[#183F32] text-white shadow-sm'
              : 'bg-white text-[#26312B]/70 hover:bg-[#E8F1DF]'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Timeline & Clinic Working Hours</span>
        </button>
      </div>

      {/* TAB 1: Appointments List */}
      {activeTab === 'appointments' && (
        <div className="space-y-6">
          {/* Filters & Search Toolbar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-[#AFC7A5]/30 shadow-xs">
            {/* Status pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              {(['all', 'pending', 'confirmed', 'completed', 'cancelled'] as const).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                    statusFilter === st
                      ? 'bg-[#183F32] text-white shadow-xs'
                      : 'bg-[#FAF9F3] text-[#26312B]/70 hover:bg-[#E8F1DF]'
                  }`}
                >
                  {st === 'all' ? 'All Inquiries' : st}
                </button>
              ))}
            </div>

            {/* Search Box */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-[#26312B]/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search patient, phone, ref..."
                className="w-full pl-10 pr-4 py-2 text-xs border border-[#AFC7A5]/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#183F32] bg-[#FAF9F3]"
              />
            </div>
          </div>

          {/* Appointments Grid / Cards */}
          {filteredAppointments.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-dashed border-[#AFC7A5]/50 text-center space-y-3">
              <CalendarCheck className="w-12 h-12 text-[#183F32]/30 mx-auto" />
              <h3 className="font-serif text-lg font-bold text-[#183F32]">No Appointments Found</h3>
              <p className="text-xs text-[#26312B]/60 max-w-sm mx-auto">
                No appointment matches your selected filter or search query.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAppointments.map((apt) => (
                <div
                  key={apt.id}
                  className="bg-white p-5 sm:p-6 rounded-3xl border border-[#AFC7A5]/40 shadow-xs hover:border-[#183F32]/40 transition-all space-y-4"
                >
                  {/* Top Row: Patient Info & Status Badge */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#AFC7A5]/20">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-[#E8F1DF] text-[#183F32] flex items-center justify-center font-bold font-serif text-base shrink-0">
                        {apt.customerName.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-base font-bold text-[#183F32]">{apt.customerName}</h4>
                          <span className="font-mono text-[11px] font-bold text-[#183F32] bg-[#FAF9F3] px-2 py-0.5 rounded border border-[#AFC7A5]/50">
                            {apt.referenceId}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-[#26312B]/70 mt-0.5">
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3 text-[#183F32]" />
                            <a
                              href={`tel:${apt.customerPhone}`}
                              className="hover:underline font-mono text-emerald-800"
                            >
                              {apt.customerPhone}
                            </a>
                          </span>
                          {apt.city && <span>• {apt.city}</span>}
                          <span>
                            • Logged on {new Date(apt.createdAt).toLocaleDateString()} at{' '}
                            {new Date(apt.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Status Pill & Action */}
                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                          apt.status === 'confirmed'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : apt.status === 'pending'
                            ? 'bg-amber-100 text-amber-800 border border-amber-300 animate-pulse'
                            : apt.status === 'completed'
                            ? 'bg-blue-100 text-blue-800 border border-blue-300'
                            : 'bg-gray-100 text-gray-700 border border-gray-300'
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        <span>{apt.status}</span>
                      </span>
                    </div>
                  </div>

                  {/* Inquiry Topic & Requested Timeline */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs bg-[#FAF9F3] p-3.5 rounded-2xl border border-[#AFC7A5]/30">
                    <div className="space-y-1">
                      <span className="text-[#26312B]/60 font-semibold block uppercase text-[10px] tracking-wider">
                        Topic / Category:
                      </span>
                      <span className="font-bold text-[#183F32] flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>{apt.category}</span>
                      </span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[#26312B]/60 font-semibold block uppercase text-[10px] tracking-wider">
                        Requested Preference:
                      </span>
                      <span className="font-medium text-[#26312B]">
                        {apt.preferredDate} • {apt.preferredTimeSlot}
                      </span>
                    </div>
                  </div>

                  {/* Problem Description & Voice Audio Player */}
                  <div className="space-y-2">
                    {/* Voice Note Player if Present */}
                    {apt.audioRecordingUrl && (
                      <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <button
                            type="button"
                            onClick={() => handleToggleAudio(apt)}
                            className="w-9 h-9 rounded-full bg-[#183F32] hover:bg-[#285844] text-white flex items-center justify-center shadow-xs cursor-pointer"
                          >
                            {playingAudioId === apt.id ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 pl-0.5" />}
                          </button>
                          <div>
                            <span className="text-xs font-bold text-[#183F32] block flex items-center gap-1">
                              <Volume2 className="w-3.5 h-3.5" />
                              <span>Patient Voice Note</span>
                            </span>
                            <span className="text-[11px] text-emerald-800">
                              {apt.audioDurationSeconds ? `${apt.audioDurationSeconds} seconds` : 'Audio Attached'}
                            </span>
                          </div>
                        </div>

                        <span className="text-[11px] text-emerald-900 font-medium">
                          {playingAudioId === apt.id ? 'Playing...' : 'Click to listen'}
                        </span>
                      </div>
                    )}

                    {/* Problem Text Description */}
                    {apt.problemDescription && (
                      <div className="text-xs text-[#26312B]/85 leading-relaxed bg-white p-3 rounded-xl border border-[#AFC7A5]/30">
                        <span className="font-bold text-[#183F32] block text-[11px] mb-1">
                          Problem Description:
                        </span>
                        <p>{apt.problemDescription}</p>
                      </div>
                    )}
                  </div>

                  {/* Confirmed Timeline & Admin Notes (if scheduled) */}
                  {(apt.confirmedSlotLabel || apt.adminNotes) && (
                    <div className="p-3 bg-emerald-50/70 rounded-2xl border border-emerald-200 text-xs space-y-1">
                      {apt.confirmedSlotLabel && (
                        <div className="flex items-center gap-1.5 font-bold text-emerald-950">
                          <CalendarCheck className="w-4 h-4 text-emerald-700" />
                          <span>Confirmed Slot: {apt.confirmedSlotLabel}</span>
                        </div>
                      )}
                      {apt.adminNotes && (
                        <p className="text-[11px] text-emerald-900">
                          <span className="font-bold">Doctor/Hakeem Notes:</span> {apt.adminNotes}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Action Toolbar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#AFC7A5]/20">
                    <div className="flex flex-wrap items-center gap-2">
                      {/* Set Timeline / Schedule Button */}
                      <button
                        type="button"
                        onClick={() => openScheduleModal(apt)}
                        className="px-3.5 py-2 rounded-xl bg-[#183F32] hover:bg-[#285844] text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                      >
                        <Clock className="w-3.5 h-3.5 text-[#AFC7A5]" />
                        <span>{apt.status === 'confirmed' ? 'Reschedule Slot' : 'Confirm & Schedule Timeline'}</span>
                      </button>

                      {/* WhatsApp Confirmation Dispatcher */}
                      <a
                        href={getWhatsAppConfirmationUrl(apt)}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3.5 py-2 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                        title="Open WhatsApp with pre-filled appointment confirmation"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Send WhatsApp Confirmation</span>
                      </a>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Status Selector */}
                      <select
                        value={apt.status}
                        onChange={(e) => updateAppointmentStatus(apt.id, e.target.value as AppointmentStatus)}
                        className="px-3 py-1.5 text-xs font-bold border border-[#AFC7A5]/60 rounded-xl bg-white focus:outline-none focus:ring-1 focus:ring-[#183F32]"
                      >
                        <option value="pending">Mark Pending</option>
                        <option value="confirmed">Mark Confirmed</option>
                        <option value="completed">Mark Completed</option>
                        <option value="cancelled">Mark Cancelled</option>
                      </select>

                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Delete appointment ${apt.referenceId}?`)) {
                            deleteAppointment(apt.id);
                          }
                        }}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                        title="Delete inquiry"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Timeline & Clinic Working Hours Settings */}
      {activeTab === 'timeline_settings' && (
        <form onSubmit={handleSaveTimelineSettings} className="bg-white p-6 sm:p-8 rounded-3xl border border-[#AFC7A5]/40 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#AFC7A5]/20">
            <div>
              <h3 className="text-lg font-serif font-bold text-[#183F32]">
                Clinic Consultation Working Hours & Timeline
              </h3>
              <p className="text-xs text-[#26312B]/70 mt-0.5">
                Configure patient intake slots, operating hours, and closed notices.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Window Start */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#183F32] uppercase tracking-wider">
                Daily Consultation Start Time
              </label>
              <input
                type="text"
                value={timelineSettings.consultationWindowStart}
                onChange={(e) => setTimelineSettings({ ...timelineSettings, consultationWindowStart: e.target.value })}
                placeholder="10:00 AM"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-[#AFC7A5]/50 rounded-xl focus:ring-2 focus:ring-[#183F32] focus:outline-none bg-[#FAF9F3]"
              />
            </div>

            {/* Window End */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#183F32] uppercase tracking-wider">
                Daily Consultation End Time
              </label>
              <input
                type="text"
                value={timelineSettings.consultationWindowEnd}
                onChange={(e) => setTimelineSettings({ ...timelineSettings, consultationWindowEnd: e.target.value })}
                placeholder="08:00 PM"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-[#AFC7A5]/50 rounded-xl focus:ring-2 focus:ring-[#183F32] focus:outline-none bg-[#FAF9F3]"
              />
            </div>

            {/* Slot Duration */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#183F32] uppercase tracking-wider">
                Slot Duration (Minutes)
              </label>
              <select
                value={timelineSettings.slotDurationMinutes}
                onChange={(e) => setTimelineSettings({ ...timelineSettings, slotDurationMinutes: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-[#AFC7A5]/50 rounded-xl focus:ring-2 focus:ring-[#183F32] focus:outline-none bg-[#FAF9F3]"
              >
                <option value={15}>15 Minutes</option>
                <option value={30}>30 Minutes</option>
                <option value={45}>45 Minutes</option>
                <option value={60}>60 Minutes</option>
              </select>
            </div>

            {/* Daily Slots Limit */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#183F32] uppercase tracking-wider">
                Maximum Daily Patient Slots
              </label>
              <input
                type="number"
                min={1}
                max={50}
                value={timelineSettings.dailySlotsLimit}
                onChange={(e) => setTimelineSettings({ ...timelineSettings, dailySlotsLimit: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-[#AFC7A5]/50 rounded-xl focus:ring-2 focus:ring-[#183F32] focus:outline-none bg-[#FAF9F3]"
              />
            </div>

            {/* Clinic WhatsApp Desk Number */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="block text-xs font-bold text-[#183F32] uppercase tracking-wider">
                Clinic WhatsApp Desk Number (for Notifications & Direct Inquiries)
              </label>
              <input
                type="text"
                value={timelineSettings.whatsappDeskNumber}
                onChange={(e) => setTimelineSettings({ ...timelineSettings, whatsappDeskNumber: e.target.value })}
                placeholder="923091655743"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-[#AFC7A5]/50 rounded-xl focus:ring-2 focus:ring-[#183F32] focus:outline-none bg-[#FAF9F3]"
              />
            </div>

            {/* Closed Notice Message (English) */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="block text-xs font-bold text-[#183F32] uppercase tracking-wider">
                Closed / Paused Intake Notice (English)
              </label>
              <textarea
                rows={2}
                value={timelineSettings.closedNoticeMessage}
                onChange={(e) => setTimelineSettings({ ...timelineSettings, closedNoticeMessage: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-[#AFC7A5]/50 rounded-xl focus:ring-2 focus:ring-[#183F32] focus:outline-none bg-[#FAF9F3]"
              />
            </div>

            {/* Closed Notice Message (Urdu) */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="block text-xs font-bold text-[#183F32] uppercase tracking-wider">
                Closed / Paused Intake Notice (Urdu)
              </label>
              <textarea
                rows={2}
                dir="rtl"
                value={timelineSettings.closedNoticeMessageUrdu}
                onChange={(e) => setTimelineSettings({ ...timelineSettings, closedNoticeMessageUrdu: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-[#AFC7A5]/50 rounded-xl focus:ring-2 focus:ring-[#183F32] focus:outline-none bg-[#FAF9F3] text-right font-serif"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-[#AFC7A5]/20 flex justify-end">
            <button
              type="submit"
              disabled={savingSettings}
              className="py-3 px-8 rounded-2xl bg-[#183F32] hover:bg-[#285844] text-[#FAF9F3] font-bold text-xs uppercase tracking-wider shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4 text-[#AFC7A5]" />
              <span>{savingSettings ? 'Saving...' : 'Save & Publish Timeline'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Confirmed Slot & Timeline Scheduling Modal */}
      {schedulingAppointment && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#FAF9F3] w-full max-w-lg rounded-3xl shadow-2xl border border-[#AFC7A5]/50 overflow-hidden space-y-5 p-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#AFC7A5]/30">
              <div className="flex items-center gap-2">
                <CalendarCheck className="w-5 h-5 text-[#183F32]" />
                <h3 className="font-serif font-bold text-lg text-[#183F32]">
                  Schedule Consultation Slot
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSchedulingAppointment(null)}
                className="p-1 text-gray-500 hover:text-gray-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3 bg-white rounded-xl border border-[#AFC7A5]/40 space-y-1">
                <span className="font-bold text-[#183F32]">{schedulingAppointment.customerName}</span>
                <span className="text-[#26312B]/70 block font-mono">{schedulingAppointment.customerPhone}</span>
                <span className="text-emerald-800 font-semibold block">{schedulingAppointment.category}</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-[#183F32]">Confirmed Date:</label>
                  <input
                    type="date"
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl bg-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-[#183F32]">Confirmed Time:</label>
                  <input
                    type="time"
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl bg-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#183F32]">Slot Label for Patient:</label>
                <input
                  type="text"
                  value={scheduleSlotLabel}
                  onChange={(e) => setScheduleSlotLabel(e.target.value)}
                  placeholder="e.g. Tuesday, 27 Oct • 4:30 PM PKT"
                  className="w-full px-3 py-2 border rounded-xl bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#183F32]">Doctor / Hakeem Advice Notes:</label>
                <textarea
                  rows={3}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="e.g. Drink warm olive oil with lukewarm water before bedtime. Listen to Surah Al-Fatihah 7 times on audio player..."
                  className="w-full px-3 py-2 border rounded-xl bg-white"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSchedulingAppointment(null)}
                  className="px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmSchedule}
                  className="px-5 py-2.5 rounded-xl bg-[#183F32] hover:bg-[#285844] text-white font-bold cursor-pointer shadow-sm"
                >
                  Confirm & Lock Slot
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
