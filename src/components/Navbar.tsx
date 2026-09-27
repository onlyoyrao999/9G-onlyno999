import React from 'react';
import { 
  Sparkles, 
  Play, 
  Download, 
  BookOpen, 
  Layers, 
  Wand2, 
  Copy, 
  Check, 
  RotateCcw,
  Film,
  Zap,
  Github
} from 'lucide-react';
import { ElementArchetype } from '../types/storyboard';

interface NavbarProps {
  currentArchetype: ElementArchetype;
  onOpenSkillModal: () => void;
  onOpenGitHubModal: () => void;
  onOpenPlayer: () => void;
  onDownloadZip: () => void;
  onCopyAllPrompts: () => void;
  isCopied: boolean;
  onGenerateGrid: () => void;
  isGenerating: boolean;
  onResetToDefault: () => void;
  activeViewMode?: 'prompt' | 'grid';
  onViewModeChange?: (mode: 'prompt' | 'grid') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentArchetype,
  onOpenSkillModal,
  onOpenGitHubModal,
  onOpenPlayer,
  onDownloadZip,
  onCopyAllPrompts,
  isCopied,
  onGenerateGrid,
  isGenerating,
  onResetToDefault,
  activeViewMode = 'prompt',
  onViewModeChange,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#07090e]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Left: Branding */}
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-lg border border-white/15 cursor-pointer hover:scale-105 transition-transform"
            onClick={onOpenGitHubModal}
            title="点击载入 D-Z-P-Z-W 终极奥义"
            style={{ 
              background: `linear-gradient(135deg, ${currentArchetype.primaryColor}33, #0f172a)`,
              boxShadow: `0 0 20px ${currentArchetype.glowColor}`
            }}
          >
            {currentArchetype.avatarIcon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black tracking-wide bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent font-serif">
                9G-onlyno999 · 九宫格修仙分镜
              </h1>
              <button 
                onClick={onOpenGitHubModal}
                className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono hover:bg-emerald-500/20 transition-colors"
                title="加载 GitHub D-Z-P-Z-W 终极奥义动作库"
              >
                <Zap className="w-3 h-3" />
                <span>终极奥义 (D-Z-P-Z-W)</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              9步动作节奏 · 16:9 影视透视 · 青龙/紫焰/金剑全功法流派一键生成
            </p>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* GitHub Arcana Loader Modal Button */}
          <button
            onClick={onOpenGitHubModal}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-emerald-300 bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-500/40 transition-all shadow-sm active:scale-95 cursor-pointer"
            title="载入 GitHub D-Z-P-Z-W 终极奥义动作库"
          >
            <Zap className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">终极奥义</span>
          </button>

          {/* Skill Cheatsheet Modal */}
          <button
            onClick={onOpenSkillModal}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
            title="查看九宫格分镜动作逻辑秘籍与提示词核心心法"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">分镜秘籍 (Skill)</span>
          </button>

          {/* Animatic Player */}
          <button
            onClick={onOpenPlayer}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
            title="播放 1~9 动作镜头连贯动态漫剧预览"
          >
            <Film className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden sm:inline">漫剧播放器</span>
          </button>

          {/* Download Zip */}
          <button
            onClick={onDownloadZip}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
            title="一键打包下载9张高清切片图与提示词"
          >
            <Download className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden md:inline">导出切片包</span>
          </button>

          {/* Copy Prompt */}
          <button
            onClick={onCopyAllPrompts}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-200 bg-white/10 hover:bg-white/15 border border-white/20 transition-all active:scale-95"
            title="复制完整 3×3 九宫格提示词"
          >
            {isCopied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-300">已复制!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>复制提示词</span>
              </>
            )}
          </button>

          {/* Primary AI Generate Button */}
          <button
            onClick={onGenerateGrid}
            disabled={isGenerating}
            className="relative inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-bold text-white shadow-lg transition-all active:scale-95 disabled:opacity-50 cursor-pointer overflow-hidden group"
            style={{
              background: `linear-gradient(135deg, ${currentArchetype.primaryColor}, ${currentArchetype.secondaryColor})`,
              boxShadow: `0 0 20px ${currentArchetype.glowColor}`,
            }}
          >
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>炼化生成中...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4" />
                <span>AI 生成九宫格</span>
              </>
            )}
          </button>
        </div>

      </div>
    </header>
  );
};
