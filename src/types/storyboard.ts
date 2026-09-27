export type ElementArchetypeId = 
  | 'green-dragon'
  | 'purple-flame'
  | 'golden-sword'
  | 'frost-phoenix'
  | 'crimson-thunder'
  | 'karmic-lotus'
  | 'dark-abyss-dragon'
  | 'taiji-bagua'
  | 'cosmic-void';

export interface ShotDefinition {
  index: number; // 1 to 9
  stepName: string; // 掐诀, 蓄力出招, 术法显现, 术法凝聚, 术法舒展, 大招爆发, 出招冲击, 大招特写, 攻击威能
  englishStep: string;
  stageType: '起手' | '蓄力' | '显形' | '聚能' | '舒展' | '爆发' | '冲击' | '特写' | '收尾';
  cameraShot: string; // 焦距与景别，如 '16mm 极度大透视仰拍特写'
  focalLength: string; // '16mm' | '24mm' | '35mm' | '50mm' | '85mm' | '200mm'
  cameraAngle: string; // '低角度仰视' | '大俯视纵深' | '鱼眼广角' | '侧后跟随' | '极近微距'
  actionDescription: string;
  visualEffectDescription: string;
  lightingDescription: string;
  defaultPromptEn: string;
  defaultPromptZh: string;
}

export interface ElementArchetype {
  id: ElementArchetypeId;
  name: string;
  title: string;
  element: string; // 木/风/火/金/水/雷/暗/阴阳/空间
  primaryColor: string; // Hex or CSS color
  secondaryColor: string;
  glowColor: string;
  badgeBg: string;
  accentText: string;
  avatarIcon: string;
  summonEntity: string; // e.g. "半透明灵体绿龙(中国青龙能量形态)"
  particleEffects: string; // e.g. "流光氤氲、翡翠灵光、龙鳞碎芒、绿色动态消散粒子"
  ultimateSpellName: string; // e.g. "九天苍龙破虚诀"
  magicDescriptionZh: string;
  magicDescriptionEn: string;
  defaultPromptSnippet: string;
  bgAtmosphere: string;
}

export interface CharacterConfig {
  name: string;
  gender: '男修仙者' | '女修仙者' | '青年剑尊' | '白发仙君' | '魔道天骄' | '神秘道袍宗师';
  costume: string; // 汉服长袍, 墨黑战甲, 飘逸白玉道袍, 锦绣云纹劲装
  hairStyle: string; // 束发玉冠, 银白长发随气浪狂舞, 黑色高马尾
  accessories: string; // 悬浮护身法宝, 腰佩古玉, 剑穗飘摇
  expression: string; // 冷峻沉稳, 杀伐凌厉, 仙风道骨, 极度专注
  referenceImageBase64?: string;
  referenceImageDescription?: string;
}

export interface RenderStyleConfig {
  stylePreset: '3d-cg-cinematic' | 'unreal-engine-5' | 'donghua-masterpiece' | 'dark-fantasy-realism';
  lightingQuality: 'cinematic-volumetric' | 'dramatic-rim-light' | 'celestial-god-rays' | 'high-contrast-chiaroscuro';
  aspectRatio: '16:9' | '1:1' | '4:3' | '9:16';
  resolutionLevel: '8k-octane' | 'ue5-lumen' | 'imax-cinema';
  enableParticleAura: boolean;
  enableDynamicMotionBlur: boolean;
  enableBlackVoidBackground: boolean;
}

export interface StoryboardProject {
  id: string;
  title: string;
  elementId: ElementArchetypeId;
  customElemental?: Partial<ElementArchetype>;
  character: CharacterConfig;
  renderStyle: RenderStyleConfig;
  customSpellName: string;
  customSummonEntity: string;
  notes: string;
  gridImageUrl?: string;
  slicedImages: string[]; // 9 sliced images data URLs
  isGenerating: boolean;
  createdAt: number;
}
