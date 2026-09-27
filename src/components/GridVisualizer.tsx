import React, { useState } from 'react';
import { 
  Maximize2, 
  Download, 
  Film, 
  Eye, 
  Sparkles, 
  Layers, 
  Grid3X3, 
  Camera, 
  Check, 
  Share2, 
  ZoomIn,
  Code2,
  Copy,
  Wand2,
  FileText,
  Play
} from 'lucide-react';
import { SHOT_DEFINITIONS } from '../data/presets';
import { ElementArchetype, ShotDefinition } from '../types/storyboard';
import { SingleShotModal } from './SingleShotModal';
import { PromptOutputBundle } from '../utils/promptEngine';

interface GridVisualizerProps {
  gridImageUrl: string;
  slicedImages: string[];
  archetype: ElementArchetype;
  spellName: string;
  promptBundle: PromptOutputBundle;
  onOpenPlayer: () => void;
  onDownloadZip: () => void;
  onReSlice: () => void;
  onGenerateGrid: () => void;
  isGenerating: boolean;
  activeViewMode: 'prompt' | 'grid';
  onViewModeChange: (mode: 'prompt' | 'grid') => void;
}

export const GridVisualizer: React.FC<GridVisualizerProps> = ({
  gridImageUrl,
  slicedImages,
  archetype,
  spellName,
  promptBundle,
  onOpenPlayer,
  onDownloadZip,
  onReSlice,
  onGenerateGrid,
  isGenerating,
  activeViewMode,
  onViewModeChange,
}) => {
  const [selectedShot, setSelectedShot] = useState<ShotDefinition | null>(null);
  const [selectedShotImage, setSelectedShotImage] = useState<string>('');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [copiedShotIndex, setCopiedShotIndex] = useState<number | null>(null);
  const [copiedFullMaster, setCopiedFullMaster] = useState<boolean>(false);

  const handleOpenShot = (shot: ShotDefinition, imgUrl: string) => {
    setSelectedShot(shot);
    setSelectedShotImage(imgUrl);
  };

  const handleCopyShotPrompt = (idx: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedShotIndex(idx);
    setTimeout(() => setCopiedShotIndex(null), 2000);
  };

  const handleCopyFullChinese = () => {
    navigator.clipboard.writeText(promptBundle.fullChinesePrompt);
    setCopiedFullMaster(true);
    setTimeout(() => setCopiedFullMaster(false), 2000);
  };

  return (
    <div className="space-y-4">
      
      {/* Visualizer Header Bar & Mode Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0b0e14] p-3 sm:p-4 rounded-2xl border border-white/10 shadow-lg">
        
        {/* Left: Info */}
        <div className="flex items-center gap-3">
          <div 
            className="p-2.5 rounded-xl border border-white/15 text-lg flex items-center justify-center shadow-md"
            style={{ backgroundColor: `${archetype.primaryColor}22` }}
          >
            <Grid3X3 className="w-5 h-5" style={{ color: archetype.primaryColor }} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-bold text-white font-serif">
                3×3 大招分镜工作台
              </h2>
              <span 
                className="text-[10px] font-bold px-2 py-0.5 rounded-full border font-mono"
                style={{ 
                  backgroundColor: `${archetype.primaryColor}15`, 
                  borderColor: `${archetype.primaryColor}40`,
                  color: archetype.primaryColor 
                }}
              >
                9 镜头 16:9 标准画幅
              </span>
            </div>
            <p className="text-xs text-slate-400">
              当前功法：<strong className="text-slate-200">{spellName}</strong>
            </p>
          </div>
        </div>

        {/* Center: View Mode Toggle Tabs */}
        <div className="flex items-center gap-1.5 bg-black/60 p-1 rounded-xl border border-white/10 text-xs">
          <button
            onClick={() => onViewModeChange('prompt')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              activeViewMode === 'prompt'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>提示词输出模式 (默认)</span>
          </button>

          <button
            onClick={() => onViewModeChange('grid')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              activeViewMode === 'grid'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Grid3X3 className="w-3.5 h-3.5" />
            <span>九宫格绘图矩阵</span>
          </button>
        </div>

        {/* Right: Quick actions */}
        <div className="flex items-center gap-2">
          {activeViewMode === 'grid' && (
            <>
              <button
                onClick={onOpenPlayer}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-sky-300 bg-sky-950/50 hover:bg-sky-900/60 border border-sky-500/30 transition-all active:scale-95 cursor-pointer"
              >
                <Film className="w-3.5 h-3.5" />
                <span>漫剧播放</span>
              </button>

              <button
                onClick={onDownloadZip}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-emerald-300 bg-emerald-950/50 hover:bg-emerald-900/60 border border-emerald-500/30 transition-all active:scale-95 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>打包ZIP</span>
              </button>
            </>
          )}

          {/* Trigger Button: Draw 9-Grid on demand */}
          <button
            onClick={() => {
              onViewModeChange('grid');
              onGenerateGrid();
            }}
            disabled={isGenerating}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold text-white transition-all shadow-md active:scale-95 disabled:opacity-50 cursor-pointer"
            style={{
              background: `linear-gradient(135deg, ${archetype.primaryColor}, ${archetype.secondaryColor})`,
              boxShadow: `0 0 15px ${archetype.glowColor}`,
            }}
          >
            {isGenerating ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>正在绘制九宫格...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-3.5 h-3.5" />
                <span>🎨 立即绘制九宫格</span>
              </>
            )}
          </button>
        </div>

      </div>

      {/* MODE 1: PROMPT OUTPUT MODE (DEFAULT) */}
      {activeViewMode === 'prompt' && (
        <div className="space-y-4">
          
          {/* Status Alert Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/70 via-slate-900 to-sky-950/70 border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300 flex-shrink-0">
                <Code2 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                  <span>按提示词精准输出模式已就绪</span>
                  <span className="text-[10px] px-2 py-0.5 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded-full font-mono">
                    PROMPT ONLY (DEFAULT)
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-0.5">
                  系统遵循核心准则：<strong>默认按提示词体系输出</strong>。当您明确需要绘制九宫格图片时，随时点击右侧【🎨 立即绘制九宫格】。
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0 w-full sm:w-auto justify-end">
              <button
                onClick={handleCopyFullChinese}
                className="px-3.5 py-1.5 rounded-lg bg-black/60 hover:bg-black/90 border border-white/20 text-xs font-bold text-white flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-sm"
              >
                {copiedFullMaster ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-300">已复制母版提示词</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-emerald-400" />
                    <span>一键复制母版提示词</span>
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  onViewModeChange('grid');
                  onGenerateGrid();
                }}
                disabled={isGenerating}
                className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <Wand2 className="w-3.5 h-3.5" />
                <span>🎨 绘制九宫格图片</span>
              </button>
            </div>
          </div>

          {/* 9-Shot Chronological Prompt Breakdown Cards */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Film className="w-3.5 h-3.5 text-emerald-400" />
                <span>9 大连贯分镜逐镜提示词工程表 (起手 ➜ 蓄力 ➜ 显形 ➜ 凝聚 ➜ 舒展 ➜ 爆发 ➜ 冲击 ➜ 特写 ➜ 威能)</span>
              </h3>
              <span className="text-[11px] text-slate-400">
                可单镜复制或作为视频 AI 连续首尾帧
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
              {SHOT_DEFINITIONS.map((shot, idx) => {
                const shotPromptObj = promptBundle.shotPrompts[idx];
                const isCopied = copiedShotIndex === idx;

                return (
                  <div
                    key={shot.index}
                    className="p-3 rounded-xl bg-[#090c12] border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between group shadow-sm hover:shadow-md"
                  >
                    <div>
                      {/* Shot Top Tag */}
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1.5">
                          <span 
                            className="text-[10px] font-mono font-black px-1.5 py-0.5 rounded text-white"
                            style={{ backgroundColor: `${archetype.primaryColor}aa` }}
                          >
                            0{shot.index}
                          </span>
                          <span className="text-xs font-bold text-white">
                            {shot.stepName}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            ({shot.stageType})
                          </span>
                        </div>

                        <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-500/20">
                          {shot.focalLength}
                        </span>
                      </div>

                      {/* Camera and action */}
                      <div className="text-[11px] text-slate-300 font-medium line-clamp-2 mb-1.5">
                        {shot.actionDescription}
                      </div>

                      <div className="text-[10px] text-slate-500 line-clamp-1 mb-2">
                        {shot.cameraShot} · {shot.cameraAngle}
                      </div>
                    </div>

                    {/* Copy action for single shot prompt */}
                    <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                      <span className="text-[9px] text-slate-500 font-mono">
                        {shot.englishStep}
                      </span>
                      <button
                        onClick={() => handleCopyShotPrompt(idx, shotPromptObj?.promptZh || shot.defaultPromptZh)}
                        className="text-[10px] font-bold text-slate-300 hover:text-white flex items-center gap-1 px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 border border-white/10 transition-colors cursor-pointer"
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-300">已复制</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>复制单镜</span>
                          </>
                        )}
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* MODE 2: 3x3 GRID CANVAS VISUALIZER */}
      {activeViewMode === 'grid' && (
        <div className="relative rounded-2xl overflow-hidden border-2 border-white/15 bg-black shadow-2xl p-2 sm:p-3">
          
          {/* Loading Overlay */}
          {isGenerating && (
            <div className="absolute inset-0 z-30 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center">
              <div className="relative w-16 h-16 mb-4">
                <div 
                  className="w-full h-full rounded-full border-4 border-t-transparent animate-spin"
                  style={{ borderColor: `${archetype.primaryColor} transparent transparent transparent` }}
                />
                <Sparkles 
                  className="w-6 h-6 absolute inset-0 m-auto animate-pulse"
                  style={{ color: archetype.primaryColor }}
                />
              </div>
              <h3 className="text-base font-bold text-white font-serif mb-1">
                正在调用 Imagen 3 / 仙法大模型炼化 3×3 九宫格分镜...
              </h3>
              <p className="text-xs text-slate-400 max-w-md">
                正在构建 16:9 极度透视构图、掐诀-蓄力-显形-凝聚-舒展-爆发-冲击-特写-威能 9大镜头连续性
              </p>
            </div>
          )}

          {/* 3x3 Grid Cells Matrix */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 aspect-video w-full">
            {SHOT_DEFINITIONS.map((shot, idx) => {
              const cellImage = slicedImages[idx] || '';
              const isHovered = hoveredIndex === idx;

              return (
                <div
                  key={shot.index}
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onClick={() => handleOpenShot(shot, cellImage)}
                  className={`relative aspect-video rounded-xl overflow-hidden border transition-all duration-300 cursor-pointer group bg-[#06090e] shadow-lg flex flex-col justify-between ${
                    isHovered
                      ? 'scale-[1.02] z-20 ring-2'
                      : 'border-white/10 hover:border-white/30'
                  }`}
                  style={
                    isHovered
                      ? { borderColor: archetype.primaryColor, boxShadow: `0 0 25px ${archetype.glowColor}` }
                      : {}
                  }
                >
                  {/* Cell Image Preview */}
                  {cellImage ? (
                    <img
                      src={cellImage}
                      alt={shot.stepName}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-900/60 text-slate-500 text-xs">
                      0{shot.index} 待绘制
                    </div>
                  )}

                  {/* Dark Vignette Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/60 pointer-events-none" />

                  {/* Top Info HUD */}
                  <div className="relative z-10 p-2 sm:p-2.5 flex items-start justify-between">
                    <div className="flex items-center gap-1.5">
                      <span 
                        className="text-[10px] sm:text-xs font-mono font-black px-1.5 sm:px-2 py-0.5 rounded shadow-sm text-white"
                        style={{ backgroundColor: `${archetype.primaryColor}99` }}
                      >
                        0{shot.index}
                      </span>
                      <span className="text-[11px] sm:text-xs font-bold text-white drop-shadow">
                        {shot.stepName}
                      </span>
                    </div>

                    <span className="text-[9px] sm:text-[10px] font-mono font-bold text-slate-300 bg-black/60 backdrop-blur-sm px-1.5 py-0.5 rounded border border-white/10">
                      {shot.focalLength}
                    </span>
                  </div>

                  {/* Bottom Caption HUD */}
                  <div className="relative z-10 p-2 sm:p-2.5 flex items-end justify-between">
                    <div className="space-y-0.5 max-w-[80%]">
                      <div className="text-[10px] sm:text-[11px] font-medium text-slate-200 line-clamp-1 drop-shadow">
                        {shot.actionDescription}
                      </div>
                      <div className="text-[9px] text-slate-400 line-clamp-1 hidden sm:block">
                        {shot.cameraAngle}
                      </div>
                    </div>

                    {/* Hover Zoom Icon */}
                    <div className="p-1 sm:p-1.5 rounded-lg bg-black/80 text-slate-300 group-hover:text-white group-hover:bg-emerald-600 transition-all shadow-md">
                      <ZoomIn className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  {/* Lens Corner Marker */}
                  <div className="absolute top-1 right-1 w-2 h-2 border-t-2 border-r-2 border-white/30 pointer-events-none" />
                  <div className="absolute bottom-1 left-1 w-2 h-2 border-b-2 border-l-2 border-white/30 pointer-events-none" />

                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* Single Shot Inspector Modal */}
      <SingleShotModal
        shot={selectedShot}
        onClose={() => setSelectedShot(null)}
        imageUrl={selectedShotImage}
        archetype={archetype}
        spellName={spellName}
      />

    </div>
  );
};
