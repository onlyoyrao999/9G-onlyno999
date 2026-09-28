import React, { useState } from 'react';
import { 
  Sparkles, 
  Wand2, 
  Copy, 
  Check, 
  Layers, 
  Flame, 
  Sliders, 
  Camera, 
  Palette, 
  ShieldCheck, 
  RefreshCw,
  Info,
  Film,
  Zap
} from 'lucide-react';
import { 
  CharacterConfig, 
  ElementArchetype, 
  ElementArchetypeId, 
  RenderStyleConfig 
} from '../types/storyboard';
import { ELEMENT_ARCHETYPES, COLOR_GRADING_PRESETS_08_HK } from '../data/presets';
import { ReferenceImageUploader } from './ReferenceImageUploader';
import { PromptOutputBundle } from '../utils/promptEngine';

interface PromptConfigPanelProps {
  currentArchetype: ElementArchetype;
  onSelectArchetype: (archetype: ElementArchetype) => void;
  character: CharacterConfig;
  onCharacterChange: (updated: Partial<CharacterConfig>) => void;
  renderStyle: RenderStyleConfig;
  onRenderStyleChange: (updated: Partial<RenderStyleConfig>) => void;
  customSpellName: string;
  onSpellNameChange: (val: string) => void;
  customSummonEntity: string;
  onSummonEntityChange: (val: string) => void;
  promptBundle: PromptOutputBundle;
  onOpenGitHubModal?: () => void;
  onGenerateGrid?: () => void;
  isGenerating?: boolean;
}

export const PromptConfigPanel: React.FC<PromptConfigPanelProps> = ({
  currentArchetype,
  onSelectArchetype,
  character,
  onCharacterChange,
  renderStyle,
  onRenderStyleChange,
  customSpellName,
  onSpellNameChange,
  customSummonEntity,
  onSummonEntityChange,
  promptBundle,
  onOpenGitHubModal,
  onGenerateGrid,
  isGenerating,
}) => {
  const [activeTab, setActiveTab] = useState<'archetypes' | 'character' | 'render' | 'prompts'>('archetypes');
  const [promptFormatTab, setPromptFormatTab] = useState<'chinese' | 'midjourney' | 'flux' | 'gemini' | 'negative'>('chinese');
  const [isExpandingSpell, setIsExpandingSpell] = useState<boolean>(false);
  const [customIdeaInput, setCustomIdeaInput] = useState<string>('');
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);

  const handleCopy = (text: string, formatName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFormat(formatName);
    setTimeout(() => setCopiedFormat(null), 2000);
  };

  const handleAIExpandSpell = async () => {
    setIsExpandingSpell(true);
    try {
      const res = await fetch('/api/expand-custom-spell', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userIdea: customIdeaInput || `${currentArchetype.name} 终极大招`,
          elementHint: currentArchetype.element,
        }),
      });
      const data = await res.json();
      if (data.spellName) onSpellNameChange(data.spellName);
      if (data.summonEntity) onSummonEntityChange(data.summonEntity);
    } catch (e) {
      console.warn('AI spell expansion failed', e);
    } finally {
      setIsExpandingSpell(false);
    }
  };

  return (
    <div className="bg-[#0b0e14] border border-white/10 rounded-2xl shadow-xl flex flex-col overflow-hidden">
      
      {/* Navigation Tabs */}
      <div className="flex border-b border-white/10 bg-black/40 px-2 pt-2 gap-1 overflow-x-auto">
        {[
          { id: 'archetypes', label: '功法流派', icon: Flame, badge: `${ELEMENT_ARCHETYPES.length}套` },
          { id: 'character', label: '角色与人设', icon: Palette, badge: character.referenceImageBase64 ? '已锁定图1' : undefined },
          { id: 'render', label: '08港影胶片/画质', icon: Film, badge: renderStyle.is08HKCinematicMode ? '08港片模式' : '16:9' },
          { id: 'prompts', label: '提示词工坊', icon: Copy, badge: '一键复制' },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-t-xl text-xs font-bold transition-all border-t border-x relative ${
                isActive
                  ? 'bg-[#0b0e14] text-white border-white/15 border-b-[#0b0e14] shadow-lg'
                  : 'text-slate-400 hover:text-slate-200 border-transparent hover:bg-white/[0.02]'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? currentArchetype.accentText : 'text-slate-400'}`} />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className="text-[10px] px-1.5 py-0.2 rounded font-mono bg-white/10 text-slate-300">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      <div className="p-4 sm:p-5 flex-1 overflow-y-auto space-y-4">
        
        {/* TAB 1: ARCHETYPES */}
        {activeTab === 'archetypes' && (
          <div className="space-y-4">
            
            {/* 2008 HK Action Cinema Quick Banner */}
            <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-amber-950/70 border border-emerald-500/30 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-sm">
                  🎬
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>2008 港产玄幻/动作大片视觉规范</span>
                    <span className="text-[10px] px-1.5 py-0.2 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded font-mono">
                      08 HK Classic
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    高反差青冷暗调 (Teal & Emerald)、实打实硬桥硬马武指动作、高速快门残影与空气音爆环
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <label className="flex items-center gap-1.5 text-xs text-emerald-300 font-bold bg-black/40 px-2.5 py-1 rounded-lg border border-emerald-500/30 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!renderStyle.is08HKCinematicMode}
                    onChange={(e) => onRenderStyleChange({ is08HKCinematicMode: e.target.checked })}
                    className="accent-emerald-500 rounded cursor-pointer"
                  />
                  <span>08 港片模式</span>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  选择修仙/港武法术大招流派 (一键切换招式与特效)
                </h3>
                <p className="text-[11px] text-slate-500">
                  点击任意功法流派，系统将自动调整对应的法相召唤物、粒子特效和光影配色
                </p>
              </div>

              {onOpenGitHubModal && (
                <button
                  onClick={onOpenGitHubModal}
                  className="px-2.5 py-1 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-1 shadow-sm active:scale-95 transition-all cursor-pointer"
                  title="加载 GitHub D-Z-P-Z-W 终极奥义"
                >
                  <Flame className="w-3.5 h-3.5 text-emerald-400" />
                  <span>D-Z-P-Z-W 终极奥义</span>
                </button>
              )}
            </div>

            {/* Grid of Archetypes */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {ELEMENT_ARCHETYPES.map((arch) => {
                const isSelected = currentArchetype.id === arch.id;
                return (
                  <button
                    key={arch.id}
                    onClick={() => {
                      onSelectArchetype(arch);
                      onSpellNameChange(arch.ultimateSpellName);
                      onSummonEntityChange(arch.summonEntity);
                    }}
                    className={`p-3 rounded-xl text-left border transition-all relative overflow-hidden flex flex-col justify-between group ${
                      isSelected
                        ? 'border-emerald-500/60 bg-emerald-950/30 shadow-lg ring-1 ring-emerald-500/30'
                        : 'border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/20'
                    }`}
                    style={
                      isSelected
                        ? { borderColor: arch.primaryColor, boxShadow: `0 0 15px ${arch.glowColor}` }
                        : {}
                    }
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{arch.avatarIcon}</span>
                        <div>
                          <div className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors flex items-center gap-1">
                            <span>{arch.name}</span>
                          </div>
                          <div className="text-[10px] text-slate-400 flex items-center gap-1">
                            <span>{arch.title}</span>
                            {arch.eraBadge && (
                              <span className="text-[9px] px-1 py-0 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded">
                                {arch.eraBadge}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <span 
                        className="w-2.5 h-2.5 rounded-full mt-1 flex-shrink-0"
                        style={{ backgroundColor: arch.primaryColor }}
                      />
                    </div>

                    <div className="mt-2 text-[10px] text-slate-400 line-clamp-2 leading-relaxed">
                      {arch.summonEntity}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Custom Spell Name & Entity Editor */}
            <div className="p-4 rounded-xl bg-black/30 border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-xs font-bold text-slate-200">
                    功法大招与召唤法相设定
                  </span>
                </div>
                <button
                  onClick={handleAIExpandSpell}
                  disabled={isExpandingSpell}
                  className="text-[11px] font-bold text-amber-300 hover:text-amber-200 flex items-center gap-1 bg-amber-950/40 hover:bg-amber-950/80 px-2.5 py-1 rounded-md border border-amber-500/30 transition-all cursor-pointer"
                >
                  <Wand2 className="w-3 h-3" />
                  {isExpandingSpell ? 'AI 构思中...' : 'AI 灵感生成大招'}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">
                    大招功法名称
                  </label>
                  <input
                    type="text"
                    value={customSpellName}
                    onChange={(e) => onSpellNameChange(e.target.value)}
                    placeholder="如：九霄碧灵苍龙诀"
                    className="w-full px-3 py-1.5 rounded-lg bg-black/50 border border-white/15 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">
                    大招核心召唤法相/实体
                  </label>
                  <input
                    type="text"
                    value={customSummonEntity}
                    onChange={(e) => onSummonEntityChange(e.target.value)}
                    placeholder="如：半透明灵体绿龙(中国青龙能量形态)"
                    className="w-full px-3 py-1.5 rounded-lg bg-black/50 border border-white/15 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: CHARACTER & REFERENCE */}
        {activeTab === 'character' && (
          <div className="space-y-4">
            
            {/* Image Uploader */}
            <ReferenceImageUploader
              character={character}
              onChange={onCharacterChange}
            />

            {/* Manual Character Trait Inputs */}
            <div className="p-4 rounded-xl bg-black/30 border border-white/10 space-y-3">
              <h4 className="text-xs font-bold text-slate-300">
                角色人设细节配置 (若未上传图片则使用以下配置)
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">角色身份/性别</label>
                  <select
                    value={character.gender}
                    onChange={(e) => onCharacterChange({ gender: e.target.value as any })}
                    className="w-full px-3 py-1.5 rounded-lg bg-black/50 border border-white/15 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="港影武宗大侠">港影武宗大侠 (硬桥硬马气概)</option>
                    <option value="青年剑尊">青年剑尊 (冷峻凌厉)</option>
                    <option value="男修仙者">男修仙者 (儒雅沉稳)</option>
                    <option value="女修仙者">女修仙者 (风姿绝代)</option>
                    <option value="白发仙君">白发仙君 (超凡脱俗)</option>
                    <option value="魔道天骄">魔道天骄 (霸道狂放)</option>
                    <option value="神秘道袍宗师">神秘道袍宗师 (仙风道骨)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">服饰造型与材质</label>
                  <input
                    type="text"
                    value={character.costume}
                    onChange={(e) => onCharacterChange({ costume: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-black/50 border border-white/15 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">发型与发冠</label>
                  <input
                    type="text"
                    value={character.hairStyle}
                    onChange={(e) => onCharacterChange({ hairStyle: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-black/50 border border-white/15 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">法宝饰品与神态</label>
                  <input
                    type="text"
                    value={character.accessories}
                    onChange={(e) => onCharacterChange({ accessories: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-black/50 border border-white/15 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

          </div>
        )}

        {/* TAB 3: RENDER & CAMERA */}
        {activeTab === 'render' && (
          <div className="space-y-4">
            
            {/* 2008 HK Color Grading Presets */}
            <div className="p-4 rounded-xl bg-black/30 border border-emerald-500/20 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-emerald-400" />
                  <span>2008 港产电影胶片调色方案 (Color Grading)</span>
                </h4>
                <span className="text-[10px] text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                  35mm Film Stock
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {COLOR_GRADING_PRESETS_08_HK.map((preset) => {
                  const isSelected = renderStyle.hkColorGrading === preset.id;
                  return (
                    <button
                      key={preset.id}
                      onClick={() => onRenderStyleChange({ hkColorGrading: preset.id as any, is08HKCinematicMode: true })}
                      className={`p-2.5 rounded-xl text-left border transition-all ${
                        isSelected
                          ? 'bg-emerald-950/50 border-emerald-500 text-white shadow-md ring-1 ring-emerald-500/40'
                          : 'bg-white/[0.02] border-white/10 text-slate-300 hover:bg-white/[0.05]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="text-xs font-bold text-white">{preset.name}</div>
                        <div className="flex items-center gap-1">
                          {preset.palette.map((color, idx) => (
                            <span
                              key={idx}
                              className="w-2.5 h-2.5 rounded-full border border-black/50"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="text-[10px] text-slate-400 leading-relaxed">
                        {preset.description}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4 Core Seamless Cinematography Principles Display */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-sky-950/40 via-slate-900 to-emerald-950/40 border border-sky-500/20 space-y-2.5">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-sky-300 flex items-center gap-1.5">
                  <Film className="w-3.5 h-3.5 text-sky-400" />
                  <span>打斗丝滑运镜心法体系 (Seamless Cinematography Rules)</span>
                </h4>
                <span className="text-[10px] text-sky-300 bg-sky-950/60 border border-sky-500/30 px-2 py-0.5 rounded font-mono">
                  已全局写入提示词
                </span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded-lg bg-black/40 border border-white/5 space-y-0.5">
                  <div className="text-sky-300 font-bold text-[11px] flex items-center gap-1">
                    <span>⚡ 一镜到底 (One-Take)</span>
                  </div>
                  <div className="text-[10px] text-slate-400">10秒+连贯长镜头，零剪辑点硬切，动作连贯丝滑</div>
                </div>

                <div className="p-2 rounded-lg bg-black/40 border border-white/5 space-y-0.5">
                  <div className="text-emerald-300 font-bold text-[11px] flex items-center gap-1">
                    <span>🔄 动感手持与甩镜 (Whip-Pan)</span>
                  </div>
                  <div className="text-[10px] text-slate-400">镜头不落定，招式转向微秒级甩镜，前推压迫不后退</div>
                </div>

                <div className="p-2 rounded-lg bg-black/40 border border-white/5 space-y-0.5">
                  <div className="text-amber-300 font-bold text-[11px] flex items-center gap-1">
                    <span>📐 中景贴身与低仰拍 (Low Angle)</span>
                  </div>
                  <div className="text-[10px] text-slate-400">贴身中景保留神情与全身动作，低角度仰拍拉满压迫感</div>
                </div>

                <div className="p-2 rounded-lg bg-black/40 border border-white/5 space-y-0.5">
                  <div className="text-rose-300 font-bold text-[11px] flex items-center gap-1">
                    <span>💥 环境挨打与物理重力 (Physics & Impact)</span>
                  </div>
                  <div className="text-[10px] text-slate-400">激扬沙土与逆光，地砖碎裂摊位撞翻，落地沉坠重力感</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div className="p-4 rounded-xl bg-black/30 border border-white/10 space-y-3">
                <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-sky-400" />
                  <span>画风渲染引擎 (画风锁死)</span>
                </h4>

                <div className="space-y-2">
                  {[
                    { id: 'hk-classic-wuxia-vfx', name: '🎬 2008 港产玄幻/动作大片风格', desc: '高反差青冷暗调，胶片暗角，高速快门残影与音爆环' },
                    { id: '3d-cg-cinematic', name: '院线级顶级影视CG动画', desc: '超写实3D渲染画质，高锐度光影层次' },
                    { id: 'unreal-engine-5', name: '虚幻引擎5 (UE5 Lumen)', desc: '次世代实时光追与全局体积光' },
                    { id: 'donghua-masterpiece', name: '国风顶流玄幻大片画质', desc: '兼顾唯美东方仙侠与狂暴粒子爆发' },
                  ].map((style) => (
                    <button
                      key={style.id}
                      onClick={() => onRenderStyleChange({ stylePreset: style.id as any })}
                      className={`w-full p-2.5 rounded-lg text-left border transition-all text-xs ${
                        renderStyle.stylePreset === style.id
                          ? 'bg-sky-950/40 border-sky-500 text-sky-200'
                          : 'bg-white/[0.02] border-white/10 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <div className="font-bold">{style.name}</div>
                      <div className="text-[10px] opacity-75">{style.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-black/30 border border-white/10 space-y-3">
                <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-emerald-400" />
                  <span>核心视觉与动作特征开关</span>
                </h4>

                <div className="space-y-2.5 text-xs">
                  <label className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02] border border-white/5 cursor-pointer">
                    <span className="text-slate-300">纯黑深邃虚空背景 (Black Void)</span>
                    <input
                      type="checkbox"
                      checked={renderStyle.enableBlackVoidBackground}
                      onChange={(e) => onRenderStyleChange({ enableBlackVoidBackground: e.target.checked })}
                      className="accent-emerald-500 rounded cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02] border border-white/5 cursor-pointer">
                    <span className="text-slate-300">动态消散灵气粒子 (Particle Aura)</span>
                    <input
                      type="checkbox"
                      checked={renderStyle.enableParticleAura}
                      onChange={(e) => onRenderStyleChange({ enableParticleAura: e.target.checked })}
                      className="accent-emerald-500 rounded cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02] border border-white/5 cursor-pointer">
                    <span className="text-slate-300">高速快门残影/动感模糊 (Staccato Action)</span>
                    <input
                      type="checkbox"
                      checked={renderStyle.enableDynamicMotionBlur}
                      onChange={(e) => onRenderStyleChange({ enableDynamicMotionBlur: e.target.checked })}
                      className="accent-emerald-500 rounded cursor-pointer"
                    />
                  </label>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB 4: PROMPTS EXPORTER */}
        {activeTab === 'prompts' && (
          <div className="space-y-4">
            
            {/* Mode Banner */}
            <div className="p-3 rounded-xl bg-slate-900/90 border border-white/10 flex items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-slate-300">
                  当前处于<strong>【按提示词输出模式】</strong>，已实时编译为 9 镜头提示词工程。
                </span>
              </div>
              {onGenerateGrid && (
                <button
                  onClick={onGenerateGrid}
                  disabled={isGenerating}
                  className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] flex items-center gap-1 transition-all active:scale-95 disabled:opacity-50 cursor-pointer flex-shrink-0"
                >
                  <Wand2 className="w-3 h-3" />
                  <span>画九宫格</span>
                </button>
              )}
            </div>

            {/* Format Sub-tabs */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1 bg-black/50 p-1 rounded-xl border border-white/10 text-xs">
                {[
                  { id: 'chinese', label: '中文原版分镜' },
                  { id: 'midjourney', label: 'Midjourney v6.1' },
                  { id: 'flux', label: 'Flux / SDXL' },
                  { id: 'gemini', label: 'Gemini / Imagen' },
                  { id: 'negative', label: '负向提示词' },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setPromptFormatTab(f.id as any)}
                    className={`px-3 py-1 rounded-lg font-medium transition-all ${
                      promptFormatTab === f.id
                        ? 'bg-emerald-600 text-white font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              <button
                onClick={() => {
                  let textToCopy = promptBundle.fullChinesePrompt;
                  if (promptFormatTab === 'midjourney') textToCopy = promptBundle.midjourneyPrompt;
                  if (promptFormatTab === 'flux') textToCopy = promptBundle.fluxSdPrompt;
                  if (promptFormatTab === 'gemini') textToCopy = promptBundle.geminiImagenPrompt;
                  if (promptFormatTab === 'negative') textToCopy = promptBundle.negativePrompt;
                  handleCopy(textToCopy, promptFormatTab);
                }}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
              >
                {copiedFormat === promptFormatTab ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>已复制到剪贴板</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>一键复制当前格式</span>
                  </>
                )}
              </button>
            </div>

            {/* Prompt Display Box */}
            <div className="relative rounded-xl overflow-hidden border border-white/15 bg-black/70">
              <textarea
                readOnly
                value={
                  promptFormatTab === 'chinese'
                    ? promptBundle.fullChinesePrompt
                    : promptFormatTab === 'midjourney'
                    ? promptBundle.midjourneyPrompt
                    : promptFormatTab === 'flux'
                    ? promptBundle.fluxSdPrompt
                    : promptFormatTab === 'gemini'
                    ? promptBundle.geminiImagenPrompt
                    : promptBundle.negativePrompt
                }
                rows={12}
                className="w-full p-4 bg-transparent text-xs text-slate-200 font-mono focus:outline-none resize-none leading-relaxed select-all"
              />
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
