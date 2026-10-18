import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  SkipForward,
  Sparkles,
  X,
  ChevronUp,
  ChevronDown,
  Music,
} from 'lucide-react';

export const AudioSanctuaryPlayer: React.FC = () => {
  const { audioTracks } = useStore();
  const activeTracks = audioTracks.filter((t) => t.active);

  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = activeTracks[currentTrackIndex] || activeTracks[0];

  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.play().catch(() => setIsPlaying(false));
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % activeTracks.length);
    setIsPlaying(true);
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '0:00';
    const mins = Math.floor(secs / 60);
    const remainingSecs = Math.floor(secs % 60);
    return `${mins}:${remainingSecs < 10 ? '0' : ''}${remainingSecs}`;
  };

  if (!currentTrack || activeTracks.length === 0) return null;

  return (
    <>
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={() => {
          if (audioRef.current) setCurrentTime(audioRef.current.currentTime);
        }}
        onLoadedMetadata={() => {
          if (audioRef.current) setDuration(audioRef.current.duration);
        }}
        onEnded={handleNext}
      />

      {/* Floating Audio Sanctuary Dock */}
      <div className="fixed bottom-5 left-5 z-40 transition-all duration-300">
        {!isExpanded ? (
          // Compact Mini Pill
          <div className="flex items-center gap-2.5 bg-[#183F32] text-white p-2 sm:px-3 sm:py-2 rounded-2xl shadow-xl border border-[#AFC7A5]/30 backdrop-blur-md">
            <button
              onClick={togglePlay}
              className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
              title={isPlaying ? 'Pause Ruqyah Recitation' : 'Play Ruqyah Recitation'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
            </button>

            <button
              onClick={() => setIsExpanded(true)}
              className="text-left group cursor-pointer"
              title="Expand Audio Sanctuary"
            >
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-[#AFC7A5] animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#AFC7A5]">
                  Sanctuary Audio
                </span>
              </div>
              <p className="text-xs font-serif font-medium text-white/90 truncate max-w-[130px] sm:max-w-[180px]">
                {currentTrack.title}
              </p>
            </button>

            <button
              onClick={() => setIsExpanded(true)}
              className="p-1 text-white/60 hover:text-white rounded-md cursor-pointer ml-1"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
          </div>
        ) : (
          // Expanded Player Card
          <div className="w-80 bg-white rounded-3xl p-5 border border-[#AFC7A5]/40 shadow-2xl animate-fade-in text-left">
            <div className="flex items-center justify-between pb-3 border-b border-[#AFC7A5]/30 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#E3EBDD] flex items-center justify-center text-[#183F32]">
                  <Music className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#183F32]">
                    Spiritual Sanctuary
                  </h4>
                  <span className="text-[10px] text-[#285844]">Quranic Shifa & Peace</span>
                </div>
              </div>
              <button
                onClick={() => setIsExpanded(false)}
                className="p-1 text-[#26312B]/60 hover:text-[#183F32] rounded-md cursor-pointer"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>

            {/* Current Track Info */}
            <div className="mb-4">
              <h5 className="font-serif text-base font-bold text-[#183F32] leading-tight">
                {currentTrack.title}
              </h5>
              {currentTrack.urduTitle && (
                <p className="font-urdu text-sm text-[#285844] mt-0.5" dir="rtl">
                  {currentTrack.urduTitle}
                </p>
              )}
              {currentTrack.reciter && (
                <p className="text-[11px] text-[#26312B]/60 mt-1">
                  {currentTrack.reciter}
                </p>
              )}
            </div>

            {/* Time progress bar */}
            <div className="mb-3">
              <div className="h-1.5 w-full bg-[#FAF9F3] rounded-full overflow-hidden border border-[#AFC7A5]/30">
                <div
                  className="h-full bg-[#183F32] transition-all duration-300"
                  style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-[#26312B]/60 mt-1">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Playback Controls */}
            <div className="flex items-center justify-between pt-1">
              <button
                onClick={toggleMute}
                className="p-2 text-[#26312B]/70 hover:text-[#183F32] rounded-xl hover:bg-[#FAF9F3] cursor-pointer"
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={togglePlay}
                  className="w-10 h-10 rounded-2xl bg-[#183F32] text-white flex items-center justify-center hover:bg-[#285844] transition-colors cursor-pointer shadow-sm"
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                </button>

                <button
                  onClick={handleNext}
                  className="p-2 text-[#26312B]/70 hover:text-[#183F32] rounded-xl hover:bg-[#FAF9F3] cursor-pointer"
                  title="Next Track"
                >
                  <SkipForward className="w-4 h-4" />
                </button>
              </div>

              <span className="text-[10px] font-bold uppercase tracking-wider text-[#285844] bg-[#E3EBDD] px-2 py-0.5 rounded-md">
                {currentTrack.category}
              </span>
            </div>

            {/* Track Selector List */}
            <div className="mt-4 pt-3 border-t border-[#AFC7A5]/25 space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#183F32]/70 block">
                Select Recitation:
              </span>
              {activeTracks.map((track, idx) => (
                <button
                  key={track.id}
                  onClick={() => {
                    setCurrentTrackIndex(idx);
                    setIsPlaying(true);
                  }}
                  className={`w-full px-2.5 py-1.5 rounded-xl text-xs text-left flex items-center justify-between transition-colors cursor-pointer ${
                    currentTrackIndex === idx
                      ? 'bg-[#183F32] text-white font-semibold'
                      : 'hover:bg-[#FAF9F3] text-[#26312B]'
                  }`}
                >
                  <span className="truncate">{track.title}</span>
                  <span className="text-[10px] opacity-70 ml-2">{track.duration}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};
