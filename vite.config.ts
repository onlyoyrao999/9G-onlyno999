import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

function apiDevMiddleware(): Plugin {
  return {
    name: 'api-dev-middleware',
    configureServer(server) {
      const apiKey = process.env.GEMINI_API_KEY || '';
      const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api/')) {
          return next();
        }

        const url = req.url.split('?')[0];

        // Helper to read JSON body
        let body: any = {};
        if (req.method === 'POST') {
          const chunks: any[] = [];
          for await (const chunk of req) {
            chunks.push(chunk);
          }
          const raw = Buffer.concat(chunks).toString('utf-8');
          if (raw) {
            try {
              body = JSON.parse(raw);
            } catch {
              body = {};
            }
          }
        }

        res.setHeader('Content-Type', 'application/json');

        if (url === '/api/fetch-github-skill' && req.method === 'POST') {
          try {
            const { repoUrl = 'https://github.com/onlyoyrao999/D-Z-P-Z-W' } = body;
            const rawCandidates = [
              'https://raw.githubusercontent.com/onlyoyrao999/D-Z-P-Z-W/main/SKILL.md',
              'https://raw.githubusercontent.com/onlyoyrao999/D-Z-P-Z-W/main/skill.md',
              'https://raw.githubusercontent.com/onlyoyrao999/D-Z-P-Z-W/main/README.md',
            ];

            let fetchedText = '';
            let fetchedUrl = '';
            for (const cUrl of rawCandidates) {
              try {
                const response = await fetch(cUrl);
                if (response.ok) {
                  fetchedText = await response.text();
                  fetchedUrl = cUrl;
                  break;
                }
              } catch {}
            }

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
  "element": "法术属性",
  "primaryColor": "主色调 Hex",
  "particleEffects": "法术粒子与特效描述",
  "conceptDescription": "奥义核心意境与动作亮点"
}`;
              const aiResp = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: parsePrompt,
                config: { responseMimeType: 'application/json' },
              });
              const parsed = JSON.parse(aiResp.text || '{}');
              return res.end(JSON.stringify({
                success: true,
                source: fetchedUrl || repoUrl,
                rawContent: fetchedText,
                data: parsed,
              }));
            }

            return res.end(JSON.stringify({
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
            }));
          } catch (err: any) {
            return res.end(JSON.stringify({
              success: true,
              data: {
                spellName: '九天苍龙·万界破虚终极奥义',
                summonEntity: '半透明灵体青苍神龙(至尊青龙能量真身)',
                element: '木/风/太虚',
                primaryColor: '#10b981',
                particleEffects: '碧绿苍龙神火、碎空流光粒子、动态消散氤氲灵气',
              },
            }));
          }
        }

        if (url === '/api/parse-custom-skill-text' && req.method === 'POST') {
          try {
            const { skillText } = body;
            if (!ai) {
              return res.end(JSON.stringify({
                spellName: '太虚万象终极奥义',
                summonEntity: '九霄灵体神相',
                primaryColor: '#10b981',
                particleEffects: '灵光流转与消散粒子',
              }));
            }

            const prompt = `将以下技能文本解析重构为 3×3 九宫格大招设定：
${skillText?.slice(0, 3000)}
JSON返回：{ "spellName": "名称", "summonEntity": "法相描述", "element": "五行属性", "primaryColor": "#10b981", "particleEffects": "粒子描述", "conceptDescription": "亮点" }`;

            const response = await ai.models.generateContent({
              model: 'gemini-2.5-flash',
              contents: prompt,
              config: { responseMimeType: 'application/json' },
            });
            return res.end(response.text || '{}');
          } catch (err: any) {
            res.statusCode = 500;
            return res.end(JSON.stringify({ error: err.message }));
          }
        }

        if (url === '/api/analyze-character-image' && req.method === 'POST') {
          try {
            const { imageBase64, mimeType = 'image/jpeg' } = body;
            if (!imageBase64) {
              res.statusCode = 400;
              return res.end(JSON.stringify({ error: 'No image provided' }));
            }

            if (!ai) {
              return res.end(
                JSON.stringify({
                  summary: '身着玄青暗纹长袍，银白长发以白玉簪高束，腰悬流光法玉，神情冷峻威严，周身仙气萦绕。',
                  gender: '青年剑仙',
                  hairStyle: '银白长发玉簪束冠',
                  costume: '玄青暗纹修仙长袍',
                  accessories: '流光法玉佩饰与悬浮护体神符',
                  expression: '冷峻沉稳，杀伐凌厉',
                  suggestedTags: ['玄青暗纹长袍', '银发玉簪', '冷峻剑修', '流光玉佩', '仙风道骨'],
                })
              );
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

            return res.end(JSON.stringify(parsedData));
          } catch (err: any) {
            return res.end(
              JSON.stringify({
                summary: '身着玄青暗纹修仙长袍，银白长发飘舞，眼神锐利如电，周身灵气流转。',
                suggestedTags: ['玄青长袍', '白发剑仙', '冷峻威严'],
              })
            );
          }
        }

        if (url === '/api/expand-custom-spell' && req.method === 'POST') {
          try {
            const { userIdea, elementHint } = body;
            if (!ai) {
              return res.end(
                JSON.stringify({
                  spellName: '九天苍龙破虚诀',
                  summonEntity: '半透明灵体绿龙(中国青龙能量形态)',
                  primaryColor: '#10b981',
                  secondaryColor: '#059669',
                  particleEffects: '绿色能量法术粒子，细腻绵密，自带动态消散、流光流转、翡翠灵光与能量氤氲效果',
                  conceptDescription: '融合苍龙神威与天地木灵，以极度大透视与撕裂空间的冲击波呈现。',
                })
              );
            }

            const prompt = `用户想要设计一个专属的修仙法术大招分镜，其核心构思为：“${userIdea || '自创修仙终极大招'}”，参考属性为：“${elementHint || '自适应'}”。
请按照顶级影视CG动画（如《凡人修仙传》《斗破》《遮天》《白蛇》等院线大片）标准，输出结构化的大招设定：
JSON格式返回：
{
  "spellName": "霸气古风功法大招名称（4-8字，如：九霄碧灵苍龙诀）",
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

            return res.end(response.text || '{}');
          } catch (err: any) {
            res.statusCode = 500;
            return res.end(JSON.stringify({ error: err.message }));
          }
        }

        if (url === '/api/generate-storyboard-image' && req.method === 'POST') {
          try {
            const { prompt, aspectRatio = '16:9' } = body;
            if (!ai) {
              res.statusCode = 503;
              return res.end(JSON.stringify({ error: 'Gemini API key is not configured' }));
            }

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
              return res.end(JSON.stringify({ imageUrl: base64, model: 'imagen-3.0-generate-002' }));
            }

            res.statusCode = 500;
            return res.end(JSON.stringify({ error: 'Image generation returned empty' }));
          } catch (err: any) {
            res.statusCode = 500;
            return res.end(JSON.stringify({ error: err.message || 'Image generation failed' }));
          }
        }

        next();
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), apiDevMiddleware()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});

