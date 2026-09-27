import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Sparkles, 
  Film,
  Zap
} from 'lucide-react';
import { SHOT_DEFINITIONS } from '../data/presets';
import { ElementArchetype } from '../types/storyboard';

interface CinematicPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  slicedImages: string[];
  archetype: ElementArchetype;
  spellName: string;
}

export const CinematicPlayerModal: React.FC<CinematicPlayerModalProps> = ({
  isOpen,
  onClose,
  slicedImages,
  archetype,
  spellName,
}) => {
  const [currentFrame, setCurrentFrame] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [speed, setSpeed] = useState<number>(1000); // ms per frame
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isShaking, setIsShaking] = useState<boolean>(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Play audio synthetic SFX for xianxia energy
  const playSfx = (shotIdx: number) => {
    if (!soundEnabled) return;
    try {
      if (!audioContextRef.current) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        audioContextRef.current = new AudioCtx();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      // Pitch and sound changes with action phase
      if (shotIdx === 0) {
        // Mudra high chime
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      } else if (shotIdx >= 1 && shotIdx <= 4) {
        // Charging hum
        osc.frequency.setValueAtTime(120 + shotIdx * 50, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(300 + shotIdx * 80, ctx.currentTime + 0.5);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);
      } else if (shotIdx === 5 || shotIdx === 6) {
        // Explosion roar
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.6);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.7);
      } else {
        // Majestic reverb chord
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
      }

      osc.start();
      osc.stop(ctx.currentTime + 0.8);
    } catch (e) {
      // Audio context policy fallback
    }
  };

  useEffect(() => {
    if (!isOpen || !isPlaying) return;

    const timer = setInterval(() => {
      setCurrentFrame((prev) => {
        const next = (prev + 1) % 9;
        if (next === 5 || next === 6) {
          setIsShaking(true);
          setTimeout(() => setIsShaking(false), 400);
        }
        playSfx(next);
        return next;
      });
    }, speed);

    return () => clearInterval(timer);
  }, [isOpen, isPlaying, speed, soundEnabled]);

  if (!isOpen) return null;

  const currentShot = SHOT_DEFINITIONS[currentFrame];
  const currentImage = slicedImages[currentFrame] || '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-xl animate-fadeIn">
      <div className="relative w-full max-w-5xl bg-[#090d14] border border-white/20 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* Top Header */}
        <div className="px-5 py-3.5 border-b border-white/10 flex items-center justify-between bg-black/50">
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded-lg bg-sky-500/20 text-sky-400 border border-sky-500/30">
              <Film className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2 font-serif">
                <span>动态漫剧分镜播放器</span>
                <span className="text-xs font-mono font-normal text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                  {spellName}
                </span>
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cinematic Main Screen */}
        <div className="relative aspect-video w-full bg-black flex items-center justify-center overflow-hidden group">
          {currentImage ? (
            <img
              src={currentImage}
              alt={`Shot ${currentFrame + 1}`}
              className={`w-full h-full object-contain transition-transform duration-300 ${
                isShaking ? 'scale-105 animate-shake' : 'scale-100'
              }`}
            />
          ) : (
            <div className="text-center p-8">
              <Sparkles className="w-12 h-12 text-slate-600 mx-auto mb-3 animate-pulse" />
              <p className="text-sm text-slate-400">正在等待切片生成或AI渲染...</p>
            </div>
          )}

          {/* Letterbox Overlays & Film Vignette */}
          <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_80px_rgba(0,0,0,0.8)]" />

          {/* Top-Left Shot Metadata HUD */}
          <div className="absolute top-4 left-4 flex flex-col gap-1 bg-black/75 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/15 pointer-events-none">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-black text-emerald-400">
                FRAME 0{currentFrame + 1}/09
              </span>
              <span className="text-[11px] font-bold text-slate-300 bg-white/10 px-1.5 py-0.5 rounded">
                {currentShot.stepName}
              </span>
              <span className="text-[10px] text-sky-300 font-mono">
                {currentShot.focalLength}
              </span>
            </div>
            <div className="text-[11px] text-slate-400">
              {currentShot.cameraAngle}
            </div>
          </div>

          {/* Bottom Subtitle Caption */}
          <div className="absolute bottom-4 inset-x-4 flex justify-center pointer-events-none">
            <div className="max-w-2xl bg-black/85 backdrop-blur-md border border-white/15 px-4 py-2 rounded-xl text-center shadow-2xl">
              <p className="text-xs sm:text-sm font-medium text-white">
                {currentShot.actionDescription}
              </p>
            </div>
          </div>
        </div>

        {/* Timeline Thumbnails Bar */}
        <div className="px-4 py-2.5 bg-black/60 border-t border-white/10 overflow-x-auto">
          <div className="flex items-center gap-2 min-w-max">
            {SHOT_DEFINITIONS.map((def, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setCurrentFrame(idx);
                  setIsPlaying(false);
                  playSfx(idx);
                }}
                className={`relative rounded-lg overflow-hidden border-2 transition-all w-24 aspect-video flex-shrink-0 group ${
                  currentFrame === idx
                    ? 'border-emerald-400 ring-2 ring-emerald-500/30 scale-105'
                    : 'border-white/10 opacity-60 hover:opacity-100'
                }`}
              >
                {slicedImages[idx] ? (
                  <img src={slicedImages[idx]} alt={def.stepName} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-slate-900 flex items-center justify-center text-[10px] text-slate-500">
                    0{idx + 1}
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-1">
                  <span className="text-[9px] font-bold text-white leading-none">
                    0{idx + 1} {def.stepName}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Bottom Playback Controls */}
        <div className="px-5 py-3.5 bg-[#07090e] border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
          
          {/* Left: Speed & Sound */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 rounded-lg text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
              title={soundEnabled ? '静音' : '开启音效'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <div className="flex items-center bg-white/5 rounded-lg p-0.5 border border-white/10 text-xs">
              {[
                { label: '0.5s', val: 500 },
                { label: '1.0s', val: 1000 },
                { label: '1.5s', val: 1500 },
                { label: '2.0s', val: 2000 },
              ].map((s) => (
                <button
                  key={s.val}
                  onClick={() => setSpeed(s.val)}
                  className={`px-2.5 py-1 rounded-md transition-all font-mono ${
                    speed === s.val ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Center: Play / Pause Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setCurrentFrame((prev) => (prev - 1 + 9) % 9);
                setIsPlaying(false);
              }}
              className="p-2 rounded-lg text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg transition-transform active:scale-95"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
            </button>

            <button
              onClick={() => {
                setCurrentFrame((prev) => (prev + 1) % 9);
                setIsPlaying(false);
              }}
              className="p-2 rounded-lg text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>

          {/* Right: Info */}
          <div className="text-xs text-slate-400 hidden sm:block">
            按影视动作节奏循环演绎 (起手 ➜ 蓄力 ➜ 爆发 ➜ 收尾)
          </div>

        </div>

      </div>
    </div>
  );
};
