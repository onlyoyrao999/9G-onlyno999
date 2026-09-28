import { CharacterConfig, ElementArchetype, RenderStyleConfig, ShotDefinition } from '../types/storyboard';
import { SHOT_DEFINITIONS } from '../data/presets';

export interface PromptOutputBundle {
  fullChinesePrompt: string;
  midjourneyPrompt: string;
  fluxSdPrompt: string;
  geminiImagenPrompt: string;
  negativePrompt: string;
  shotPrompts: { index: number; name: string; promptZh: string; promptEn: string }[];
}

export function buildCompletePromptBundle(
  archetype: ElementArchetype,
  character: CharacterConfig,
  renderStyle: RenderStyleConfig,
  customSpellName?: string,
  customSummonEntity?: string
): PromptOutputBundle {
  const summonEntity = customSummonEntity || archetype.summonEntity;
  const spellName = customSpellName || archetype.ultimateSpellName;
  const charTag = character.referenceImageDescription 
    ? `参考角色特征: 【${character.referenceImageDescription}】` 
    : `角色外观: 【${character.gender}，${character.costume}，${character.hairStyle}，${character.accessories}，${character.expression}】`;

  const isHkStyle = renderStyle.is08HKCinematicMode || renderStyle.stylePreset === 'hk-classic-wuxia-vfx' || archetype.eraBadge === '2008 港片巅峰' || archetype.id === 'sanfen-guiyuan' || archetype.id === 'mohe-wuliang' || archetype.id === 'xianglong-zhang' || archetype.id === 'paiyun-zhang' || archetype.id === 'fengshen-tui' || archetype.id === 'wanjian-guizong' || archetype.id === 'rulai-shenzhang';

  const hkGradingTag = renderStyle.hkColorGrading === '08-amber-gold-fiery'
    ? '【2008港影纯阳金煞调色：高反差深邃暗部与爆裂琥珀金光形成极致戏剧性明暗对比，浓郁35mm胶片颗粒质感】'
    : renderStyle.hkColorGrading === '08-storm-cyan-blue'
    ? '【2008风云苍蓝冰煞调色：极速快门动感残影，冷峻高级苍蓝水雾与青白风罡，胶片暗角与锐利高光】'
    : renderStyle.hkColorGrading === '08-ink-shadow-spectral'
    ? '【2008徐克蜀山水墨幽冥调色：撕裂虚空的半透明幽紫青蓝灵光，高反差黑底，东方魔幻银幕质感】'
    : '【2008经典港片青冷暗调：高反差青冷暗调 Teal & Emerald，纯黑深邃背景搭配通透翡翠绿/青幽流光，锐利高光与35mm电影胶片微颗粒】';

  const hkGradingEn = renderStyle.hkColorGrading === '08-amber-gold-fiery'
    ? '2008 Hong Kong martial arts cinema golden amber film grade, intense chiaroscuro contrast between inky black shadow and blinding golden fiery aura, 35mm motion picture film grain'
    : renderStyle.hkColorGrading === '08-storm-cyan-blue'
    ? '2008 Storm Warriors cinematic icy cyan and royal blue palette, high-speed shutter action trails, crisp edge lighting'
    : renderStyle.hkColorGrading === '08-ink-shadow-spectral'
    ? '2008 Tsui Hark Zu Mountain cinematic dark fantasy palette, inky blacks with spectral amethyst and cyan luminescent energy'
    : '2008 Hong Kong classic fantasy action cinema color grading, high-contrast dark teal and deep emerald shadows, pure void backdrop, luminous jade neon aura, 35mm film stock grain';

  const cinematographyZh = '运镜与摄影心法：全程遵循【一镜到底零剪辑点长镜头（Continuous One-Take）、动感手持跟拍（Handheld Tracking）、出招即换向的高速甩镜（Action-Triggered Whip Pan）、贴身中景与低机位仰拍（Low-Angle Medium Shot）、镜头不停/环境挨打/重力落体物理实感（Environmental Destruction & Weighty Impact）】。';
  const cinematographyEn = 'seamless continuous one-take long shot style, kinetic handheld tracking camera with action-triggered whip pan, forward push-in, low-angle dramatic medium framing, environmental dust kick-up and debris destruction with backlit god rays, authentic physical weight and shockwave recoil';

  const styleHeadingZh = isHkStyle
    ? `整体风格：2008年香港巅峰玄幻动作电影风格（如《风云》《蜀山传》《龙虎门》黄金年代院线美学），${hkGradingTag}。${cinematographyZh}实打实硬桥硬马武指动作与真气外放完美结合，高速快门动作残影（Staccato Action），空气撕裂音爆环，念力飞石悬浮，极度夸张大透视构图与35mm胶片暗角。`
    : `整体风格：中国风修仙主题，顶级影视CG动画风格，超写实3D渲染画质，黑色背景，高反差电影级光影。${cinematographyZh}`;

  const styleHeadingEn = isHkStyle
    ? `2008 classic Hong Kong martial arts fantasy cinema aesthetic, ${hkGradingEn}, ${cinematographyEn}, authentic Hong Kong stunt action choreography, staccato shutter motion trails, concentric air-compression sonic boom rings, telekinetic floating debris, anamorphic lens flare, high-contrast dramatic chiaroscuro`
    : `Chinese xianxia dark fantasy 3D animation style, ${cinematographyEn}, Octane Render 8k cinema quality, pure black background, hyper-dramatic wide perspective depth`;

  // 1. Full Chinese Prompt (Core Master Specification)
  const fullChinesePrompt = `3×3网格分镜布局，全景图包含9个独立画面，每个画面均为16:9比例，${character.referenceImageBase64 ? '参【图1】角色特征' : charTag}，呈现角色施展【${spellName}】终极大招的专业影视制作级动作场面分镜表，视觉布局严谨规整。

${styleHeadingZh}
角色招式：角色释放终极武侠法术大招【${spellName}】，${archetype.element}属性法术，以【${summonEntity}】为大招核心，多元术法招式融合爆发。
画面核心要求：全程极度夸张大透视构图，超强空间纵深感与视觉张力，彻底规避平面化呈现；${archetype.particleEffects}，光影层次丰富立体，高光锐利通透、暗部深邃干净，兼顾招式爆发冲击力与微观细节质感，每帧达院线经典电影级渲染精度。

9个独立分镜镜头动作编排（严格按动作逻辑排布）：
1. 掐诀/起势：${SHOT_DEFINITIONS[0].actionDescription}（${SHOT_DEFINITIONS[0].cameraShot}，${archetype.primaryColor}微光符文与重叠手印残影流转）
2. 蓄力出招：${SHOT_DEFINITIONS[1].actionDescription}（${SHOT_DEFINITIONS[1].cameraShot}，能量倒灌，周遭碎石悬浮升腾，衣袍长发狂舞）
3. 术法显现：${SHOT_DEFINITIONS[2].actionDescription}（${SHOT_DEFINITIONS[2].cameraShot}，${summonEntity}初露峥嵘）
4. 术法凝聚：${SHOT_DEFINITIONS[3].actionDescription}（${SHOT_DEFINITIONS[3].cameraShot}，能量光轨与青白电弧极限向心压缩）
5. 术法舒展：${SHOT_DEFINITIONS[4].actionDescription}（${SHOT_DEFINITIONS[4].cameraShot}，${summonEntity}腾空舒展，浑天仪大阵盘旋纵深）
6. 大招爆发：${SHOT_DEFINITIONS[5].actionDescription}（${SHOT_DEFINITIONS[5].cameraShot}，双掌轰出，巨型能量冲击波与气爆环炸裂）
7. 出招冲击：${SHOT_DEFINITIONS[6].actionDescription}（${SHOT_DEFINITIONS[6].cameraShot}，光柱极速贯穿，空间碎裂流光拉丝）
8. 大招特写：${SHOT_DEFINITIONS[7].actionDescription}（${SHOT_DEFINITIONS[7].cameraShot}，核心法相霸气极近特写，眼神霸气冷峻，纤毫毕现）
9. 攻击威能：${SHOT_DEFINITIONS[8].actionDescription}（${SHOT_DEFINITIONS[8].cameraShot}，浩瀚通天光柱荡平寰宇，漫天光尘如雨）`;

  // 2. Midjourney V6 Format
  const midjourneyPrompt = `3x3 grid storyboard layout, contact sheet of 9 distinct sequential cinematic shots, each frame 16:9 ratio, ${styleHeadingEn}, ultimate martial arts spell cast action sequence of ${character.gender} ${character.costume} ${character.hairStyle}, casting supreme magic '${spellName}', core entity: ${archetype.magicDescriptionEn}, pure black background, hyper-dramatic wide perspective depth, volumetric glowing particles, sharp crystal highlights, dynamic action sequence panels: 1. hand mudra close-up 2. chi accumulation upward tilt 3. spirit entity emergence 4. extreme energy vortex compression 5. massive entity unfurling 6. explosive palm blast shockwave 7. supersonic tracking piercing beam 8. ferocious macro portrait close-up 9. apocalyptic cataclysmic light pillar --ar 16:9 --style raw --v 6.1 --q 2 --s 250`;

  // 3. Flux / SDXL Format
  const fluxSdPrompt = `masterpiece, best quality, cinematic 3x3 storyboard grid layout, contact sheet showing 9 separate chronological action sequence panels in 16:9 aspect ratio. Subject: Chinese fantasy immortal cultivator unleashing ultimate spell '${spellName}'. Visual elements: ${archetype.magicDescriptionEn}, pure black void backdrop, extreme dynamic depth perspective, glowing volumetric particles, crystal clear refractive magic aura, Unreal Engine 5 Lumen cinematics, ray tracing, sharp rim lighting, ultra-detailed textures, sequential action from mudra hand seals to cataclysmic blast.`;

  // 4. Gemini / Imagen Prompt
  const geminiImagenPrompt = `A professional cinematic 3x3 grid storyboard contact sheet containing 9 distinct consecutive 16:9 action panels on a pure dark background. The sequence showcases a Chinese xianxia cultivator casting an ultimate celestial spell featuring ${archetype.summonEntity}.
Style: Premium 3D CG blockbuster donghua animation, extreme depth of field, hyper-perspective composition, crystalline sharp specular highlights, rich volumetric lighting.
Panels sequence:
Panel 1: Close-up of delicate hands weaving mystical mudra hand seal with glowing elemental runes.
Panel 2: Dramatic low-angle shot of cultivator charging immense chi power, clothes and hair whipping in vortex.
Panel 3: Medium shot showing ethereal translucent ${archetype.summonEntity} manifesting from spatial tear.
Panel 4: Dynamic wide-angle showing immense glowing energy vortex condensing into a solid radiant form.
Panel 5: Panoramic majestic shot of the giant entity fully uncoiling and ascending into the void.
Panel 6: Explosive fisheye burst as cultivator pushes palms forward, triggering concentric sonic boom shockwaves.
Panel 7: Over-the-shoulder tracking shot of the entity rocketing forward as a devastating light beam.
Panel 8: Micro macro portrait close-up of the entity maw and fierce eyes with intricate luminous scales.
Panel 9: Apocalyptic wide long shot of a titanic sky-piercing light pillar with floating golden stardust.`;

  // 5. Negative Prompt
  const negativePrompt = `blurry, low quality, flat 2D anime, amateur drawing, ugly hands, distorted fingers, cropped frames, messy borders, uneven grid, watermark, text, signature, low resolution, noisy, bad anatomy, deformed face, cartoon sketch, oversaturated muddy colors, bright white background, washed out lighting`;

  // 6. Shot Prompts breakdown
  const shotPrompts = SHOT_DEFINITIONS.map((def) => {
    return {
      index: def.index,
      name: def.stepName,
      promptZh: `【第${def.index}镜·${def.stepName}】(${def.cameraShot}) ${character.gender}施展${spellName}。${def.actionDescription} ${archetype.particleEffects}。纯黑背景，顶级影视3D渲染画质。`,
      promptEn: `Shot ${def.index} [${def.englishStep}]: (${def.cameraShot}) Chinese cultivator casting ${spellName}. ${def.actionDescription} Featuring ${archetype.magicDescriptionEn}. Pure black background, 8k cinematic Octane render.`,
    };
  });

  return {
    fullChinesePrompt,
    midjourneyPrompt,
    fluxSdPrompt,
    geminiImagenPrompt,
    negativePrompt,
    shotPrompts,
  };
}
