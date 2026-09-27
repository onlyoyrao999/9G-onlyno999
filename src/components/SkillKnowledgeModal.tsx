import React, { useState } from 'react';
import { X, Sparkles, BookOpen, Film, Eye, Flame, Shield, ArrowRight, Check, Copy, FileText, Download, Code } from 'lucide-react';
import { SHOT_DEFINITIONS } from '../data/presets';

interface SkillKnowledgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectArchetype?: (id: string) => void;
}

export const SkillKnowledgeModal: React.FC<SkillKnowledgeModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'visual' | 'skillmd'>('visual');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedSkillMd, setCopiedSkillMd] = useState<boolean>(false);

  if (!isOpen) return null;

  const copyText = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const skillMdContent = `---
name: 9G-onlyno999
description: 仙法打斗漫剧 3×3 九宫格大招分镜生成与动作拆解技能库 (Xianxia 9-Grid Ultimate Spell Action Storyboard Skill)
version: 1.0.0
author: onlyno999
source: https://github.com/onlyoyrao999/D-Z-P-Z-W
---

# 9G-onlyno999 · 仙法打斗漫剧 3×3 九宫格分镜 Skill 动作规范

## 1. 技能概述 (Skill Overview)
9G-onlyno999 是专为仙侠漫剧、3D国风动画、动作短剧打造的 3×3 九宫格动作分镜与提示词生成规范。
它将一个完整的修仙法术终极大招，精准拆解为 9 个符合专业影视摄影机调度的连续动作镜头：
掐诀 → 蓄力 → 术法显现 → 术法凝聚 → 术法舒展 → 大招爆发 → 出招冲击 → 大招特写 → 攻击威能。

## 2. 三大核心不可动摇原则 (Core Tenets)
1. 画风锁死：中国风修仙主题，顶级影视CG动画风格，超写实3D渲染画质，黑色背景，高反差电影级光影。
2. 特效核心：半透明灵体神兽/法相为主体，自带动态消散、流光流转、能量氤氲效果。
3. 镜头逻辑：严格按“起手 → 蓄力 → 显形 → 聚能 → 舒展 → 爆发 → 冲击 → 特写 → 收尾”动作节奏排布。

## 3. 九大分镜动作与拍摄调度表 (3×3 Grid Matrix)
- 01 掐诀 (Mudra): 35mm 特写微距，双手结印，指尖符文流光微绽。
- 02 蓄力出招 (Charge): 24mm 仰拍大透视，身形微沉引气，衣袍长发狂舞，灵能倒灌。
- 03 术法显现 (Manifest): 28mm 中景纵深，剑指点出，撕裂虚空，灵体破界初现。
- 04 术法凝聚 (Condense): 18mm 广角大张力，漫天狂暴灵能光轨向心极限压缩。
- 05 术法舒展 (Unfurl): 14mm 超广角全景，万丈法相神龙咆哮腾空，盘旋纵深。
- 06 大招爆发 (Release): 16mm 鱼眼广角，双掌轰出，核爆级能量冲击波与气爆环炸裂。
- 07 出招冲击 (Impact): 50mm 过肩追焦，法相化作破虚光柱极速贯穿，空间碎裂流光拉丝。
- 08 大招特写 (Close-Up): 85mm 影视肖像微距，核心龙首怒目圆睁口含龙珠，晶莹鳞片纤毫毕现。
- 09 攻击威能 (Apocalypse): 12mm 远景全景，通天贯地光柱横扫万里，漫天光尘如雨。`;

  const handleCopySkillMd = () => {
    navigator.clipboard.writeText(skillMdContent);
    setCopiedSkillMd(true);
    setTimeout(() => setCopiedSkillMd(false), 2000);
  };

  const handleDownloadSkillMd = () => {
    const blob = new Blob([skillMdContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'SKILL.md';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#0c1017] border border-white/15 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-emerald-950/40 via-slate-900 to-black">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white font-serif">
                  9G-onlyno999 · 修仙大招 3×3 九宫格分镜 Skill 秘籍
                </h2>
                <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded">
                  SKILL.md
                </span>
              </div>
              <p className="text-xs text-slate-400">
                专为漫剧/动画/视频博主打造的标准影视动作分镜逻辑库 (源自 GitHub onlyoyrao999/D-Z-P-Z-W 动作心法)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center justify-between px-6 py-2 bg-black/40 border-b border-white/10">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('visual')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'visual'
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-400 hover:text-white bg-white/5'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>动作分镜心法 (视觉导图)</span>
            </button>
            <button
              onClick={() => setActiveTab('skillmd')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'skillmd'
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-400 hover:text-white bg-white/5'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>SKILL.md 源码文档</span>
            </button>
          </div>

          {activeTab === 'skillmd' && (
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopySkillMd}
                className="px-2.5 py-1 rounded-lg text-xs font-bold text-emerald-300 bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-500/30 flex items-center gap-1"
              >
                {copiedSkillMd ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                <span>{copiedSkillMd ? '已复制' : '复制 SKILL.md'}</span>
              </button>
              <button
                onClick={handleDownloadSkillMd}
                className="px-2.5 py-1 rounded-lg text-xs font-bold text-slate-300 bg-white/5 hover:bg-white/10 border border-white/10 flex items-center gap-1"
              >
                <Download className="w-3 h-3" />
                <span>下载 .md</span>
              </button>
            </div>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-300">
          
          {activeTab === 'skillmd' ? (
            <div className="relative rounded-xl overflow-hidden border border-white/10 bg-black/80">
              <pre className="p-4 text-xs font-mono text-emerald-300/90 whitespace-pre-wrap leading-relaxed select-all">
                {skillMdContent}
              </pre>
            </div>
          ) : (
            <>
              {/* Top Key Takeaways Card */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold">
                    <Shield className="w-4 h-4" />
                    <span>1. 画风锁死</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    直接套用<strong className="text-white">“中国风修仙主题，顶级影视CG动画风格，超写实3D渲染画质，黑色背景”</strong>，锁定高反差体积光，杜绝AI生成画面风格混杂混乱。
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/30 space-y-2">
                  <div className="flex items-center gap-2 text-purple-400 font-bold">
                    <Flame className="w-4 h-4" />
                    <span>2. 特效核心</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    以<strong className="text-white">“绿色半透明灵体青龙”</strong>（或紫焰/金剑/冰凤）为大招主体，自带动态消散、流光流转、能量氤氲效果，空间张力与层次感拉满。
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-sky-950/30 border border-sky-500/30 space-y-2">
                  <div className="flex items-center gap-2 text-sky-400 font-bold">
                    <Film className="w-4 h-4" />
                    <span>3. 镜头逻辑</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    严格按<strong className="text-white">“起手 → 蓄力 → 爆发 → 收尾”</strong>的影视动作节拍编排，全景切片后导入剪映/Runway/可灵生成视频，动作天然连贯绝不跳脱！
                  </p>
                </div>

              </div>

              {/* Core Tip Banner */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-amber-950/50 via-slate-900 to-black border border-amber-500/40 flex items-start gap-3">
                <span className="text-xl">💡</span>
                <div>
                  <h4 className="text-sm font-bold text-amber-300">终极高阶小技巧：万能功法流派替换</h4>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    你可以直接把这套提示词里的“绿色青龙”一键替换为<strong>紫焰魔尊、纯阳金剑、冰凤凌霄、赤霄神雷、业火红莲、幽冥黑龙、乾坤八卦、虚空坍缩</strong>等其他属性的术法，即可瞬间生成不同角色的专属对战大招分镜，无需重写整套提示词！
                  </p>
                </div>
              </div>

              {/* 9 Sequential Steps Detail Grid */}
              <div className="space-y-3">
                <h3 className="text-base font-bold text-white font-serif flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span>9 大动作分镜标准镜头调度表 (16:9)</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {SHOT_DEFINITIONS.map((shot) => (
                    <div
                      key={shot.index}
                      className="p-3 rounded-xl bg-white/[0.03] border border-white/10 hover:border-emerald-500/40 transition-all group"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/20">
                          0{shot.index} · {shot.stepName}
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {shot.focalLength}
                        </span>
                      </div>
                      
                      <div className="text-[12px] font-medium text-slate-200 mb-1">
                        {shot.cameraShot}
                      </div>

                      <p className="text-[11px] text-slate-400 line-clamp-2 mb-2 leading-relaxed">
                        {shot.actionDescription}
                      </p>

                      <div className="flex items-center justify-between pt-2 border-t border-white/5">
                        <span className="text-[10px] text-emerald-300/80 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                          {shot.stageType}阶段
                        </span>
                        <button
                          onClick={() => copyText(shot.defaultPromptZh, shot.index)}
                          className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
                        >
                          {copiedIndex === shot.index ? (
                            <span className="text-emerald-400 flex items-center gap-0.5">
                              <Check className="w-3 h-3" /> 已复制
                            </span>
                          ) : (
                            <span className="flex items-center gap-0.5">
                              <Copy className="w-3 h-3" /> 复制本镜
                            </span>
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-white/10 bg-[#07090e] flex items-center justify-between">
          <span className="text-xs text-slate-400 font-mono">
            项目名: 9G-onlyno999 · 遵循 16:9 极度透视构图
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors shadow-lg"
          >
            开启分镜创作
          </button>
        </div>

      </div>
    </div>
  );
};

