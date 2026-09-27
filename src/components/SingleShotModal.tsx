import React, { useState } from 'react';
import { X, Copy, Check, Sparkles, Download, Camera, Sliders, ExternalLink } from 'lucide-react';
import { ShotDefinition, ElementArchetype } from '../types/storyboard';

interface SingleShotModalProps {
  shot: ShotDefinition | null;
  onClose: () => void;
  imageUrl?: string;
  archetype: ElementArchetype;
  spellName: string;
}

export const SingleShotModal: React.FC<SingleShotModalProps> = ({
  shot,
  onClose,
  imageUrl,
  archetype,
  spellName,
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  if (!shot) return null;

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(shot.defaultPromptZh);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSingle = () => {
    if (!imageUrl) return;
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `分镜_0${shot.index}_${shot.stepName}_${shot.focalLength}.png`;
    link.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-[#090d14] border border-white/20 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-white/10 flex items-center justify-between bg-black/50">
          <div className="flex items-center gap-2.5">
            <span 
              className="text-xs font-mono font-black px-2.5 py-1 rounded-md"
              style={{ backgroundColor: `${archetype.primaryColor}22`, color: archetype.primaryColor, border: `1px solid ${archetype.primaryColor}55` }}
            >
              SHOT 0{shot.index} / 09
            </span>
            <h3 className="text-base font-bold text-white font-serif">
              {shot.stepName} · {shot.englishStep}
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              ({shot.stageType}阶段)
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          
          {/* Main Visual Preview */}
          <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black border border-white/10 flex items-center justify-center group shadow-2xl">
            {imageUrl ? (
              <img src={imageUrl} alt={shot.stepName} className="w-full h-full object-contain" />
            ) : (
              <div className="text-slate-500 text-xs">正在渲染预览...</div>
            )}
            
            {/* Quick download badge on image */}
            {imageUrl && (
              <button
                onClick={handleDownloadSingle}
                className="absolute top-3 right-3 p-2 rounded-lg bg-black/70 hover:bg-black/90 text-slate-300 hover:text-white border border-white/20 transition-all opacity-0 group-hover:opacity-100 flex items-center gap-1 text-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>下载单帧高清图</span>
              </button>
            )}
          </div>

          {/* Camera and Director Specs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">摄影机焦距与景别</span>
              <div className="font-bold text-slate-200">{shot.cameraShot}</div>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">镜头角度与透视</span>
              <div className="font-bold text-slate-200">{shot.cameraAngle}</div>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">光影与高光层次</span>
              <div className="font-bold text-slate-200">{shot.lightingDescription.slice(0, 28)}...</div>
            </div>
          </div>

          {/* Action and Visual FX description */}
          <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2">
            <div className="text-xs font-bold text-emerald-400">动作导演指令 (Director Note):</div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {shot.actionDescription}
            </p>
            <div className="text-xs font-bold text-sky-400 pt-1">法术粒子与特效要求:</div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {shot.visualEffectDescription}
            </p>
          </div>

          {/* Single Shot Prompt */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300">本镜专属AI提示词:</span>
              <button
                onClick={handleCopyPrompt}
                className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-medium transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? '已复制' : '复制本镜提示词'}</span>
              </button>
            </div>
            <div className="p-3 rounded-lg bg-black/70 border border-white/10 text-xs font-mono text-slate-300 leading-relaxed">
              {shot.defaultPromptZh}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-white/10 bg-[#07090e] flex items-center justify-between">
          <button
            onClick={handleDownloadSingle}
            className="text-xs text-slate-300 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>保存此单帧</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors"
          >
            完成
          </button>
        </div>

      </div>
    </div>
  );
};
