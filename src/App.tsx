import React, { useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { 
  ElementArchetype, 
  CharacterConfig, 
  RenderStyleConfig 
} from './types/storyboard';
import { ELEMENT_ARCHETYPES, SHOT_DEFINITIONS } from './data/presets';
import { buildCompletePromptBundle } from './utils/promptEngine';
import { slice3x3GridImage, downloadStoryboardZip, generateProcedural3x3GridCanvas } from './utils/slicer';
import { Navbar } from './components/Navbar';
import { GridVisualizer } from './components/GridVisualizer';
import { PromptConfigPanel } from './components/PromptConfigPanel';
import { SkillKnowledgeModal } from './components/SkillKnowledgeModal';
import { CinematicPlayerModal } from './components/CinematicPlayerModal';
import { GitHubSkillLoaderModal } from './components/GitHubSkillLoaderModal';

export default function App() {
  // 1. Core State
  const [currentArchetype, setCurrentArchetype] = useState<ElementArchetype>(ELEMENT_ARCHETYPES[0]);
  const [customSpellName, setCustomSpellName] = useState<string>(ELEMENT_ARCHETYPES[0].ultimateSpellName);
  const [customSummonEntity, setCustomSummonEntity] = useState<string>(ELEMENT_ARCHETYPES[0].summonEntity);

  const [character, setCharacter] = useState<CharacterConfig>({
    name: '青云剑修',
    gender: '青年剑尊',
    costume: '玄青暗纹修仙长袍，金丝刺绣流云纹',
    hairStyle: '银白长发以白玉簪高束，发丝随气浪狂舞',
    accessories: '腰悬流光法玉，周身悬浮九枚护体神符',
    expression: '冷峻沉稳，杀伐凌厉，神威逼人',
  });

  const [renderStyle, setRenderStyle] = useState<RenderStyleConfig>({
    stylePreset: '3d-cg-cinematic',
    lightingQuality: 'cinematic-volumetric',
    aspectRatio: '16:9',
    resolutionLevel: '8k-octane',
    enableParticleAura: true,
    enableDynamicMotionBlur: true,
    enableBlackVoidBackground: true,
  });

  // Images & Slices
  const [gridImageUrl, setGridImageUrl] = useState<string>('');
  const [slicedImages, setSlicedImages] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // Modals & UI States
  const [isSkillModalOpen, setIsSkillModalOpen] = useState<boolean>(false);
  const [isGitHubModalOpen, setIsGitHubModalOpen] = useState<boolean>(false);
  const [isPlayerOpen, setIsPlayerOpen] = useState<boolean>(false);
  const [isCopiedGlobal, setIsCopiedGlobal] = useState<boolean>(false);

  // 2. Compute dynamic prompt bundle
  const promptBundle = useMemo(() => {
    return buildCompletePromptBundle(
      currentArchetype,
      character,
      renderStyle,
      customSpellName,
      customSummonEntity
    );
  }, [currentArchetype, character, renderStyle, customSpellName, customSummonEntity]);

  // 3. Initial Procedural Generation on mount
  useEffect(() => {
    const proceduralDataUrl = generateProcedural3x3GridCanvas(
      currentArchetype,
      character.name,
      customSpellName
    );
    setGridImageUrl(proceduralDataUrl);

    slice3x3GridImage(proceduralDataUrl, {
      addWatermarkOverlay: true,
      archetype: currentArchetype,
      spellName: customSpellName,
    }).then((slices) => {
      setSlicedImages(slices);
    });
  }, [currentArchetype, customSpellName]);

  // 4. AI Generation Handler
  const handleGenerateGrid = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/generate-storyboard-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptBundle.midjourneyPrompt,
          aspectRatio: renderStyle.aspectRatio,
        }),
      });

      const data = await res.json();
      if (data.imageUrl) {
        setGridImageUrl(data.imageUrl);
        const slices = await slice3x3GridImage(data.imageUrl, {
          addWatermarkOverlay: true,
          archetype: currentArchetype,
          spellName: customSpellName,
        });
        setSlicedImages(slices);

        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 },
        });
      } else {
        throw new Error('No image returned');
      }
    } catch (err) {
      console.warn('AI Image Generation fallback to high quality procedural matrix', err);
      // Fallback update procedural matrix with current archetype
      const proceduralDataUrl = generateProcedural3x3GridCanvas(
        currentArchetype,
        character.name,
        customSpellName
      );
      setGridImageUrl(proceduralDataUrl);
      const slices = await slice3x3GridImage(proceduralDataUrl, {
        addWatermarkOverlay: true,
        archetype: currentArchetype,
        spellName: customSpellName,
      });
      setSlicedImages(slices);
    } finally {
      setIsGenerating(false);
    }
  };

  // 5. Download ZIP
  const handleDownloadZip = async () => {
    if (slicedImages.length === 0) return;
    await downloadStoryboardZip(
      gridImageUrl,
      slicedImages,
      promptBundle.fullChinesePrompt,
      currentArchetype,
      customSpellName
    );
    confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
  };

  // 6. Copy All Prompts
  const handleCopyAll = () => {
    navigator.clipboard.writeText(promptBundle.fullChinesePrompt);
    setIsCopiedGlobal(true);
    confetti({ particleCount: 30, spread: 50, origin: { y: 0.8 } });
    setTimeout(() => setIsCopiedGlobal(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-black font-sans">
      
      {/* Top Navbar */}
      <Navbar
        currentArchetype={currentArchetype}
        onOpenSkillModal={() => setIsSkillModalOpen(true)}
        onOpenGitHubModal={() => setIsGitHubModalOpen(true)}
        onOpenPlayer={() => setIsPlayerOpen(true)}
        onDownloadZip={handleDownloadZip}
        onCopyAllPrompts={handleCopyAll}
        isCopied={isCopiedGlobal}
        onGenerateGrid={handleGenerateGrid}
        isGenerating={isGenerating}
        onResetToDefault={() => {
          setCurrentArchetype(ELEMENT_ARCHETYPES[0]);
          setCustomSpellName(ELEMENT_ARCHETYPES[0].ultimateSpellName);
          setCustomSummonEntity(ELEMENT_ARCHETYPES[0].summonEntity);
        }}
      />

      {/* Main Workspace Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Top Hero Banner */}
        <div 
          className="relative rounded-2xl p-5 sm:p-6 border overflow-hidden shadow-2xl transition-all"
          style={{
            background: `radial-gradient(ellipse at top left, ${currentArchetype.primaryColor}18, #0b0e14 70%)`,
            borderColor: `${currentArchetype.primaryColor}33`,
          }}
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">{currentArchetype.avatarIcon}</span>
                <h2 className="text-lg sm:text-xl font-black text-white font-serif tracking-wide">
                  {currentArchetype.name} · {customSpellName}
                </h2>
                <span 
                  className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full border"
                  style={{
                    backgroundColor: `${currentArchetype.primaryColor}20`,
                    borderColor: `${currentArchetype.primaryColor}40`,
                    color: currentArchetype.primaryColor,
                  }}
                >
                  {currentArchetype.element}
                </span>
              </div>
              <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
                {currentArchetype.magicDescriptionZh} {currentArchetype.particleEffects}
              </p>
            </div>

            {/* Quick stats badges */}
            <div className="flex items-center gap-2 text-xs flex-shrink-0">
              <div className="px-3 py-1.5 rounded-xl bg-black/60 border border-white/10 text-slate-300 text-center">
                <div className="text-[10px] text-slate-400">分镜规格</div>
                <div className="font-mono font-bold text-white">3×3 矩阵 / 16:9</div>
              </div>

              <div className="px-3 py-1.5 rounded-xl bg-black/60 border border-white/10 text-slate-300 text-center">
                <div className="text-[10px] text-slate-400">动作阶段</div>
                <div className="font-bold text-emerald-400">9 步连贯节奏</div>
              </div>
            </div>
          </div>

          {/* Background Ambient Glow */}
          <div 
            className="absolute -top-24 -right-24 w-72 h-72 rounded-full blur-3xl opacity-20 pointer-events-none"
            style={{ backgroundColor: currentArchetype.primaryColor }}
          />
        </div>

        {/* 2-Column Grid: Visualizer & Workbench */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left / Center 7 cols: 3x3 Grid Visualizer */}
          <div className="lg:col-span-7 space-y-4">
            <GridVisualizer
              gridImageUrl={gridImageUrl}
              slicedImages={slicedImages}
              archetype={currentArchetype}
              spellName={customSpellName}
              onOpenPlayer={() => setIsPlayerOpen(true)}
              onDownloadZip={handleDownloadZip}
              onReSlice={() => {
                if (gridImageUrl) {
                  slice3x3GridImage(gridImageUrl, {
                    addWatermarkOverlay: true,
                    archetype: currentArchetype,
                    spellName: customSpellName,
                  }).then(setSlicedImages);
                }
              }}
              isGenerating={isGenerating}
            />
          </div>

          {/* Right 5 cols: Prompt Configuration & Character Locking */}
          <div className="lg:col-span-5">
            <PromptConfigPanel
              currentArchetype={currentArchetype}
              onSelectArchetype={(arch) => {
                setCurrentArchetype(arch);
                setCustomSpellName(arch.ultimateSpellName);
                setCustomSummonEntity(arch.summonEntity);
              }}
              character={character}
              onCharacterChange={(updated) => setCharacter((prev) => ({ ...prev, ...updated }))}
              renderStyle={renderStyle}
              onRenderStyleChange={(updated) => setRenderStyle((prev) => ({ ...prev, ...updated }))}
              customSpellName={customSpellName}
              onSpellNameChange={setCustomSpellName}
              customSummonEntity={customSummonEntity}
              onSummonEntityChange={setCustomSummonEntity}
              promptBundle={promptBundle}
              onOpenGitHubModal={() => setIsGitHubModalOpen(true)}
            />
          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-6 text-center text-xs text-slate-500 bg-[#06080c]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            九宫格修仙大招分镜工坊 · 专业影视CG与动作镜头生成工作台
          </div>
          <div className="text-[11px] text-slate-400">
            起手 ➜ 蓄力 ➜ 显形 ➜ 凝聚 ➜ 舒展 ➜ 爆发 ➜ 冲击 ➜ 特写 ➜ 威能
          </div>
        </div>
      </footer>

      {/* Modals */}
      <SkillKnowledgeModal
        isOpen={isSkillModalOpen}
        onClose={() => setIsSkillModalOpen(false)}
      />

      <GitHubSkillLoaderModal
        isOpen={isGitHubModalOpen}
        onClose={() => setIsGitHubModalOpen(false)}
        onApplyArcana={(arch, spell, summon) => {
          setCurrentArchetype(arch);
          setCustomSpellName(spell);
          setCustomSummonEntity(summon);
          confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
        }}
      />

      <CinematicPlayerModal
        isOpen={isPlayerOpen}
        onClose={() => setIsPlayerOpen(false)}
        slicedImages={slicedImages}
        archetype={currentArchetype}
        spellName={customSpellName}
      />

    </div>
  );
}
