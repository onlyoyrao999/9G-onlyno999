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
  ZoomIn
} from 'lucide-react';
import { SHOT_DEFINITIONS } from '../data/presets';
import { ElementArchetype, ShotDefinition } from '../types/storyboard';
import { SingleShotModal } from './SingleShotModal';

interface GridVisualizerProps {
  gridImageUrl: string;
  slicedImages: string[];
  archetype: ElementArchetype;
  spellName: string;
  onOpenPlayer: () => void;
  onDownloadZip: () => void;
  onReSlice: () => void;
  isGenerating: boolean;
}

export const GridVisualizer: React.FC<GridVisualizerProps> = ({
  gridImageUrl,
  slicedImages,
  archetype,
  spellName,
  onOpenPlayer,
  onDownloadZip,
  onReSlice,
  isGenerating,
}) => {
  const [selectedShot, setSelectedShot] = useState<ShotDefinition | null>(null);
  const [selectedShotImage, setSelectedShotImage] = useState<string>('');
  const [showFullMasterModal, setShowFullMasterModal] = useState<boolean>(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const handleOpenShot = (shot: ShotDefinition, imgUrl: string) => {
    setSelectedShot(shot);
    setSelectedShotImage(imgUrl);
  };

  return (
    <div className="space-y-4">
      
      {/* Visualizer Header Bar */}
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
                3×3 影视大招分镜全景矩阵
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
              当前功法：<strong className="text-slate-200">{spellName}</strong> · 核心召唤：{archetype.summonEntity.slice(0, 20)}...
            </p>
          </div>
        </div>

        {/* Right: Quick actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenPlayer}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-sky-300 bg-sky-950/50 hover:bg-sky-900/60 border border-sky-500/30 transition-all active:scale-95 cursor-pointer"
          >
            <Film className="w-3.5 h-3.5" />
            <span>播放动态漫剧</span>
          </button>

          <button
            onClick={onDownloadZip}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-emerald-300 bg-emerald-950/50 hover:bg-emerald-900/60 border border-emerald-500/30 transition-all active:scale-95 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>打包下载9切片 (ZIP)</span>
          </button>
        </div>

      </div>

      {/* Centerpiece 3x3 Grid Canvas Container */}
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
                    0{shot.index} 渲染中...
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
