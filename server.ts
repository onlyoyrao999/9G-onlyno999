import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Initialize Google GenAI
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

// API: Analyze Character Reference Image
app.post('/api/analyze-character-image', async (req, res) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg' } = req.body;
    if (!imageBase64) {
      return res.status(400).json({ error: 'No image provided' });
    }

    if (!ai) {
      return res.json({
        analysis: '身着玄青暗纹修仙长袍，银白长发以白玉簪高束，腰悬流光佩玉，神情冷峻深沉，周身灵气隐隐流转。',
        suggestedTags: ['玄青暗纹长袍', '银发玉簪', '冷峻剑修', '玉佩法宝', '仙风道骨'],
      });
    }

    const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [
            {
              inlineData: {
                data: cleanBase64,
                mimeType,
              },
            },
            {
              text: `你是一位专业影视CG与修仙动画的分镜美术指导。请分析这张角色参考图【图1】，提取出用于AI连续生成分镜的【固定角色特征描述词】。
请以JSON格式输出，包含以下字段：
{
  "summary": "一句紧凑完整的角色外观描述（包含性别/发型/服饰材质/配色/法宝/神态表情，适合直接拼入分镜提示词）",
  "gender": "性别特征",
  "hairStyle": "发型与发饰",
  "costume": "服饰造型与主色调",
  "accessories": "随身法宝、玉佩或武器",
  "expression": "面部神情与气质",
  "suggestedTags": ["标签1", "标签2", "标签3", "标签4", "标签5"]
}`,
            },
          ],
        },
      ],
      config: {
        responseMimeType: 'application/json',
      },
    });

    const resultText = response.text || '{}';
    let parsedData = {};
    try {
      parsedData = JSON.parse(resultText);
    } catch {
      parsedData = { summary: resultText, suggestedTags: ['修仙角色', '3D写实CG', '国风服饰'] };
    }

    return res.json(parsedData);
  } catch (error: any) {
    console.error('Error analyzing character image:', error);
    return res.status(500).json({
      error: error.message || 'Analysis failed',
      fallback: '身着玄青暗纹修仙长袍，长发随气浪狂舞，神情冷峻威严，周身仙光流转。',
    });
  }
});

// API: Fetch & Parse Skill from GitHub (e.g., https://github.com/onlyoyrao999/D-Z-P-Z-W)
app.post('/api/fetch-github-skill', async (req, res) => {
  try {
    const { repoUrl = 'https://github.com/onlyoyrao999/D-Z-P-Z-W' } = req.body;
    
    // Attempt fetching raw files from GitHub repository
    const rawCandidates = [
      'https://raw.githubusercontent.com/onlyoyrao999/D-Z-P-Z-W/main/SKILL.md',
      'https://raw.githubusercontent.com/onlyoyrao999/D-Z-P-Z-W/main/skill.md',
      'https://raw.githubusercontent.com/onlyoyrao999/D-Z-P-Z-W/main/README.md',
      'https://raw.githubusercontent.com/onlyoyrao999/D-Z-P-Z-W/master/README.md',
    ];

    let fetchedText = '';
    let fetchedUrl = '';

    for (const url of rawCandidates) {
      try {
        const response = await fetch(url);
        if (response.ok) {
          fetchedText = await response.text();
          fetchedUrl = url;
          break;
        }
      } catch (err) {
        // continue trying
      }
    }

    // If fetched content is found, parse with Gemini AI
    if (fetchedText && ai) {
      const parsePrompt = `你是一位顶级修仙动作导演。请分析以下来自 GitHub 仓库 (${repoUrl}) 的动作与技能文档：
---
${fetchedText.slice(0, 4000)}
---
请提取并重构为标准的 3×3 九宫格终极奥义分镜设定，输出为严格的 JSON 格式：
{
  "repoName": "D-Z-P-Z-W 终极奥义动作库",
  "spellName": "提炼出的终极大招奥义名称（4-10字）",
  "summonEntity": "核心法相/召唤实体完整描述",
  "element": "法术属性（如：木/龙、金/剑、雷/劫等）",
  "primaryColor": "主色调 Hex",
  "particleEffects": "法术粒子与特效描述",
  "conceptDescription": "奥义核心意境与动作亮点",
  "shots": [
    { "index": 1, "stepName": "掐诀", "action": "第1镜动作", "shotType": "35mm 微距特写" },
    { "index": 2, "stepName": "蓄力出招", "action": "第2镜动作", "shotType": "24mm 仰拍透视" },
    { "index": 3, "stepName": "术法显现", "action": "第3镜动作", "shotType": "28mm 中景" },
    { "index": 4, "stepName": "术法凝聚", "action": "第4镜动作", "shotType": "18mm 广角向心" },
    { "index": 5, "stepName": "术法舒展", "action": "第5镜动作", "shotType": "14mm 超广角全景" },
    { "index": 6, "stepName": "大招爆发", "action": "第6镜动作", "shotType": "16mm 鱼眼冲击" },
    { "index": 7, "stepName": "出招冲击", "action": "第7镜动作", "shotType": "50mm 追焦贯穿" },
    { "index": 8, "stepName": "大招特写", "action": "第8镜动作", "shotType": "85mm 肖像微距" },
    { "index": 9, "stepName": "攻击威能", "action": "第9镜动作", "shotType": "12mm 远景全景" }
  ]
}`;

      const aiResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: parsePrompt,
        config: { responseMimeType: 'application/json' },
      });

      const parsed = JSON.parse(aiResponse.text || '{}');
      return res.json({
        success: true,
        source: fetchedUrl || repoUrl,
        rawContent: fetchedText,
        data: parsed,
      });
    }

    // Built-in D-Z-P-Z-W 终极奥义 Default Library
    return res.json({
      success: true,
      source: repoUrl,
      isBuiltinPreset: true,
      data: {
        repoName: 'D-Z-P-Z-W 终极奥义动作心法',
        spellName: '九天苍龙·万界破虚终极奥义',
        summonEntity: '半透明灵体青苍神龙(至尊青龙能量真身)与八荒乾坤法阵',
        element: '木/风/太虚',
        primaryColor: '#10b981',
        particleEffects: '碧绿苍龙神火、碎空流光粒子、太虚符文光轨、动态消散氤氲灵气',
        conceptDescription: '融合青龙神魄与太虚破界法则，九步动作紧凑连贯，大透视空间冲击力拉满。',
      },
    });
  } catch (error: any) {
    console.error('Fetch github skill error:', error);
    return res.status(500).json({ error: error.message || 'Failed to fetch github skill' });
  }
});

// API: Parse arbitrary Skill Markdown / text into 9-grid format
app.post('/api/parse-custom-skill-text', async (req, res) => {
  try {
    const { skillText } = req.body;
    if (!skillText) {
      return res.status(400).json({ error: 'No skill text provided' });
    }

    if (!ai) {
      return res.json({
        spellName: '太虚玄天终极奥义',
        summonEntity: '太古灵体神兽真身',
        primaryColor: '#10b981',
        particleEffects: '灵光流转与动态消散粒子',
      });
    }

    const prompt = `请作为专业修仙动作指导，将以下用户输入的技能/动作/奥义文本，解析重构为专业的 3×3 九宫格大招分镜设定：
---
${skillText.slice(0, 3000)}
---
输出严格 JSON 格式：
{
  "spellName": "大招名称",
  "summonEntity": "核心法相或召唤物描述",
  "element": "五行属性",
  "primaryColor": "主色调 Hex",
  "secondaryColor": "辅助色调 Hex",
  "particleEffects": "法术粒子特效描述",
  "conceptDescription": "视觉设计亮点"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});
app.post('/api/expand-custom-spell', async (req, res) => {
  try {
    const { userIdea, elementHint } = req.body;
    if (!ai) {
      return res.json({
        spellName: '九天玄霄太虚破厄决',
        summonEntity: '通体琉璃璀璨的九天灵体神兽法相',
        particleEffects: '绚烂灵光粒子、虚空撕裂微光、能量氤氲流转',
        conceptDescription: '融合阴阳五行极致法力，引动九霄天劫神威的至高道法。',
      });
    }

    const prompt = `用户想要设计一个专属的修仙法术大招分镜，其核心构思为：“${userIdea || '自创修仙终极大招'}”，参考属性为：“${elementHint || '自适应'}”。
请按照顶级影视CG动画（如《凡人修仙传》《斗破》《遮天》《白蛇》等院线大片）标准，输出结构化的大招设定：
JSON格式返回：
{
  "spellName": "霸气古风功法大招名称（4-8字，如：九天苍龙破虚诀）",
  "summonEntity": "大招核心法相或召唤实体（如：半透明灵体绿龙(中国青龙能量形态)）",
  "primaryColor": "主色调Hex（如 #10b981）",
  "secondaryColor": "辅助色调Hex",
  "particleEffects": "法术粒子与特效描述（细腻绵密、动态消散、光流流转等）",
  "conceptDescription": "大招核心设计理念与视觉冲击亮点（100字内）"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error expanding spell:', error);
    return res.status(500).json({ error: error.message });
  }
});

// API: Generate Storyboard Master Grid Image using Imagen 3
app.post('/api/generate-storyboard-image', async (req, res) => {
  try {
    const { prompt, aspectRatio = '16:9' } = req.body;
    if (!ai) {
      return res.status(503).json({ error: 'Gemini API key is not configured' });
    }

    // Try Imagen 3 first
    try {
      const imgResponse = await ai.models.generateImages({
        model: 'imagen-3.0-generate-002',
        prompt: prompt + ' -- 3x3 cinematic grid storyboard contact sheet, 9 panels, high contrast, pure black background, 8k resolution, photorealistic cinematic 3d render',
        config: {
          numberOfImages: 1,
          aspectRatio: aspectRatio === '1:1' ? '1:1' : aspectRatio === '4:3' ? '4:3' : '16:9',
        },
      });

      if (imgResponse.generatedImages?.[0]?.image?.imageBytes) {
        const base64 = `data:image/png;base64,${imgResponse.generatedImages[0].image.imageBytes}`;
        return res.json({ imageUrl: base64, model: 'imagen-3.0-generate-002' });
      }
    } catch (imagenErr: any) {
      console.warn('Imagen 3 generation error, trying fallback:', imagenErr.message);
    }

    return res.status(500).json({ error: 'Image generation service returned empty result' });
  } catch (error: any) {
    console.error('Generate image error:', error);
    return res.status(500).json({ error: error.message || 'Failed to generate image' });
  }
});

// Serve static assets in production
app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
