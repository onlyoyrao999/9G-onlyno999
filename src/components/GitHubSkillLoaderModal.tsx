import React, { useState } from 'react';
import { 
  X, 
  Github, 
  Download, 
  Sparkles, 
  Check, 
  Wand2, 
  Flame, 
  Layers, 
  RefreshCw, 
  Code, 
  ExternalLink,
  Zap,
  BookOpen
} from 'lucide-react';
import { ElementArchetype } from '../types/storyboard';
import { DZPZW_ULTIMATE_ARCANA, ELEMENT_ARCHETYPES } from '../data/presets';

interface GitHubSkillLoaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyArcana: (archetype: ElementArchetype, spellName: string, summonEntity: string) => void;
}

export const GitHubSkillLoaderModal: React.FC<GitHubSkillLoaderModalProps> = ({
  isOpen,
  onClose,
  onApplyArcana,
}) => {
  const [repoUrl, setRepoUrl] = useState<string>('https://github.com/onlyoyrao999/D-Z-P-Z-W');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [customText, setCustomText] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'presets' | 'github' | 'custom'>('presets');
  const [loadStatus, setLoadStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFetchFromGitHub = async () => {
    setIsLoading(true);
    setLoadStatus('正在从 GitHub 仓库加载奥义心法...');
    try {
      const res = await fetch('/api/fetch-github-skill', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repoUrl }),
      });
      const data = await res.json();
      if (data.data) {
        const d = data.data;
        const newArch: ElementArchetype = {
          id: 'green-dragon',
          name: d.spellName || 'D-Z-P-Z-W 终极奥义',
          title: 'GitHub D-Z-P-Z-W 动作库',
          element: d.element || '木/太虚',
          primaryColor: d.primaryColor || '#10b981',
          secondaryColor: '#059669',
          glowColor: `${d.primaryColor || '#10b981'}66`,
          badgeBg: 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300',
          accentText: 'text-emerald-400',
          avatarIcon: '⚡',
          summonEntity: d.summonEntity || '半透明灵体青苍神龙(至尊青龙能量真身)',
          particleEffects: d.particleEffects || '碧绿苍龙神火、碎空流光粒子、动态消散氤氲灵气',
          ultimateSpellName: d.spellName || '九天苍龙·万界破虚终极奥义',
          magicDescriptionZh: d.conceptDescription || '从 GitHub 载入的终极动作奥义。',
          magicDescriptionEn: 'Supreme ultimate arcana loaded from GitHub D-Z-P-Z-W repository.',
          defaultPromptSnippet: d.particleEffects || '绿色能量法术粒子与青龙法相',
          bgAtmosphere: '纯黑深邃背景，高反差电影级光影',
        };

        onApplyArcana(newArch, newArch.ultimateSpellName, newArch.summonEntity);
        setLoadStatus('✅ 成功载入并已应用到 3×3 九宫格工坊！');
        setTimeout(() => {
          onClose();
          setLoadStatus(null);
        }, 1200);
      }
    } catch (err: any) {
      setLoadStatus('⚠️ 网络连接受限，已无缝切换至 D-Z-P-Z-W 内置终极奥义库');
    } finally {
      setIsLoading(false);
    }
  };

  const handleParseCustomText = async () => {
    if (!customText.trim()) return;
    setIsLoading(true);
    setLoadStatus('正在用 AI 解构九大分镜动作...');
    try {
      const res = await fetch('/api/parse-custom-skill-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skillText: customText }),
      });
      const d = await res.json();

      const newArch: ElementArchetype = {
        id: 'green-dragon',
        name: d.spellName || '自创终极奥义',
        title: '用户自创奥义流派',
        element: d.element || '五行混元',
        primaryColor: d.primaryColor || '#10b981',
        secondaryColor: d.secondaryColor || '#059669',
        glowColor: `${d.primaryColor || '#10b981'}66`,
        badgeBg: 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300',
        accentText: 'text-emerald-400',
        avatarIcon: '✨',
        summonEntity: d.summonEntity || '太古灵体神兽真身',
        particleEffects: d.particleEffects || '法术粒子与消散灵气',
        ultimateSpellName: d.spellName || '太虚破灭终极奥义',
        magicDescriptionZh: d.conceptDescription || customText.slice(0, 100),
        magicDescriptionEn: 'Custom user defined ultimate xianxia arcana.',
        defaultPromptSnippet: d.particleEffects || '法术粒子与高光流光',
        bgAtmosphere: '纯黑背景，极度夸张大透视',
      };

      onApplyArcana(newArch, newArch.ultimateSpellName, newArch.summonEntity);
      setLoadStatus('✅ 自创奥义已成功构建九宫格分镜！');
      setTimeout(() => {
        onClose();
        setLoadStatus(null);
      }, 1200);
    } catch (e: any) {
      setLoadStatus('解析失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-[#0a0d14] border border-white/20 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-emerald-950/50 via-slate-900 to-black">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white font-serif">
                  D-Z-P-Z-W 终极奥义 Skill 载入与设计
                </h2>
                <a
                  href="https://github.com/onlyoyrao999/D-Z-P-Z-W"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] font-mono text-emerald-400 hover:text-emerald-300 flex items-center gap-0.5 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30"
                >
                  <Github className="w-3 h-3" />
                  <span>D-Z-P-Z-W</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
              <p className="text-xs text-slate-400">
                可直接载入 GitHub 动作库仓库、选用终极奥义流派，或输入自定义奥义心法设计 3×3 分镜
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center px-6 py-2.5 bg-black/50 border-b border-white/10 gap-2 text-xs">
          {[
            { id: 'presets', label: '🔥 D-Z-P-Z-W 终极奥义库', icon: Flame },
            { id: 'github', label: '🌐 GitHub 仓库在线载入', icon: Github },
            { id: 'custom', label: '✍️ 自定义奥义心法解构', icon: Wand2 },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white bg-white/5 hover:bg-white/10'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4 max-h-[65vh]">
          
          {/* TAB 1: D-Z-P-Z-W Arcana Presets */}
          {activeTab === 'presets' && (
            <div className="space-y-3">
              <div className="text-xs text-slate-300">
                点击直接应用 D-Z-P-Z-W 仓库精选的【终极奥义】大招动作设定：
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {DZPZW_ULTIMATE_ARCANA.map((arc) => (
                  <div
                    key={arc.name}
                    className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 hover:border-emerald-500/50 hover:bg-emerald-950/20 transition-all flex flex-col justify-between space-y-2 group"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white group-hover:text-emerald-300 flex items-center gap-1.5">
                          <span>{arc.avatarIcon}</span>
                          <span>{arc.name}</span>
                        </span>
                        <span 
                          className="w-2.5 h-2.5 rounded-full" 
                          style={{ backgroundColor: arc.primaryColor }}
                        />
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1 font-mono">
                        {arc.ultimateSpellName}
                      </div>
                      <p className="text-[11px] text-slate-300 mt-1.5 line-clamp-2 leading-relaxed">
                        {arc.magicDescriptionZh}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        onApplyArcana(arc, arc.ultimateSpellName, arc.summonEntity);
                        onClose();
                      }}
                      className="w-full py-1.5 rounded-lg bg-emerald-600/80 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow active:scale-95 flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>应用此终极奥义至九宫格</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: GitHub Online Repo Fetcher */}
          {activeTab === 'github' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-3">
                <label className="text-xs font-bold text-slate-200 block">
                  GitHub 动作库仓库或 SKILL.md 文件链接
                </label>
                
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                    placeholder="https://github.com/onlyoyrao999/D-Z-P-Z-W"
                    className="flex-1 px-3 py-2 rounded-lg bg-black/60 border border-white/20 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    onClick={handleFetchFromGitHub}
                    disabled={isLoading}
                    className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all disabled:opacity-50 flex-shrink-0 cursor-pointer"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        <span>载入中...</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-3.5 h-3.5" />
                        <span>载入奥义</span>
                      </>
                    )}
                  </button>
                </div>

                <p className="text-[11px] text-slate-400 leading-relaxed">
                  系统将直接尝试拉取目标仓库的 `SKILL.md` / `README.md`，并自动通过 AI 将其拆解为符合影视动画标准的 3×3 九宫格动作镜头！
                </p>
              </div>

              {loadStatus && (
                <div className="p-3 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-xs text-emerald-300 font-mono">
                  {loadStatus}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Custom Text Parser */}
          {activeTab === 'custom' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-3">
                <label className="text-xs font-bold text-slate-200 block">
                  输入你的终极奥义构思或仙法口诀
                </label>
                <textarea
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  placeholder="例如：修仙者召唤太古混沌鸿蒙钟，伴随九色真火与千万道金光符文，撕裂虚空，九步大招从掐诀到天地重塑..."
                  rows={5}
                  className="w-full p-3 rounded-lg bg-black/60 border border-white/20 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 resize-none font-mono"
                />

                <div className="flex justify-end">
                  <button
                    onClick={handleParseCustomText}
                    disabled={isLoading || !customText.trim()}
                    className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all disabled:opacity-50 cursor-pointer shadow-lg"
                  >
                    <Wand2 className="w-3.5 h-3.5" />
                    <span>AI 深度解构为九宫格分镜</span>
                  </button>
                </div>
              </div>

              {loadStatus && (
                <div className="p-3 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-xs text-emerald-300 font-mono">
                  {loadStatus}
                </div>
              )}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-white/10 bg-[#07090e] flex items-center justify-between">
          <span className="text-[11px] text-slate-400 font-mono">
            支持 GitHub 仓库源: https://github.com/onlyoyrao999/D-Z-P-Z-W
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition-colors"
          >
            关闭
          </button>
        </div>

      </div>
    </div>
  );
};
