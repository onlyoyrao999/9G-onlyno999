---
name: 9G-onlyno999
description: 仙法打斗漫剧 3×3 九宫格大招分镜生成与 2008 经典港片动作/色彩基调技能库 (Xianxia & 2008 HK Cinema 9-Grid Ultimate Action Storyboard Skill)
version: 1.4.0
author: onlyno999
source: https://github.com/onlyoyrao999/D-Z-P-Z-W
---

# 9G-onlyno999 · 仙法打斗漫剧 3×3 九宫格分镜 Skill 动作与色彩基调规范

## 1. 核心触发与执行准则 (Core Operating Principle)

> **⚠️ 核心准则**：
> **当用户明确表达需要画九宫格（如“画九宫格”、“生成九宫格图片”、“绘制分镜图”、“渲染3×3矩阵”等）时，系统才执行 3×3 矩阵图像绘制与分镜切片；若用户未明确提出画图需求，默认一律按多引擎结构化提示词工程（Prompt Compilation）格式精准输出。**

### 交互模式定义：
1. **【提示词输出模式 / Prompt-First Mode (默认)】**：
   - 优先输出包含全局画风锁死、2008 港片调色、角色特征绑定、大招法相与 9 大分镜镜头序列的完整提示词包。
   - 提供 中文母版、Midjourney v6.1、Flux / SDXL、Gemini / Imagen 与负向提示词。
   - 逐镜提供 1~9 镜头独立调度提示词，方便用户直接复制到视频生成 AI（可灵、Runway、即梦、Sora）作为连续首尾帧。
2. **【九宫格绘图与分镜切片模式 / 9-Grid Painting Mode (按需触发)】**：
   - 触发条件：用户点击界面【🎨 立即绘制九宫格】按钮，或对话中明确指令“画九宫格”。
   - 执行流程：调用 Imagen 3 / 仙法视觉引擎渲染 3×3 九宫格全景母图，自动执行 16:9 画幅精准切片（带水印与焦距标号），载入 9 帧动态漫剧播放器，支持一键 ZIP 打包下载。

---

## 2. 视频深度提取：2008 经典港产动作玄幻色彩基调体系 (Video Color Palette & Aesthetics)

基于对 2008 年代经典港产玄幻/动作大片（以《风云》、《蜀山传》、《龙虎门》、《功夫》为代表）核心电影片段的逐帧深度解析，提炼出以下核心色彩基调与影调美学密码：

### 🎨 核心色彩基调与十六进制色谱 (Color Palette)

```text
┌─────────────────┬─────────────────┬─────────────────┬─────────────────┬─────────────────┐
│ 翡翠冷翠绿/玉魄 │ 纯阳朱红/暗赤血 │ 苍蓝深靛/风云水 │ 暗黑石窟/纯净黑 │ 纯阳金煞/通天白 │
│ #10b981 #064e3b │ #dc2626 #991b1b │ #38bdf8 #1e3a8a │ #020617 #18181b │ #f59e0b #ffffff │
└─────────────────┴─────────────────┴─────────────────┴─────────────────┴─────────────────┘
```

1. **翡翠冷翠绿 / 幽冥碧玉 (Emerald & Translucent Jade Green)**：
   - **核心色值**：`#10b981` (明亮翠绿), `#064e3b` (深墨绿阴影), `#6ee7b7` (通透玉光高光), `#042f2e` (暗部青墨)
   - **视觉质感**：呈现半透明水晶水体流动质感、内发光灵气氤氲、高饱和发光核心与青白电弧拉丝。
   - **电影场景**：雄霸三分归元气神球、碧霄青龙法相、九天苍龙灵体。

2. **纯阳朱红与暗赤血气 (Vermilion Crimson & Deep Blood Red)**：
   - **核心色值**：`#dc2626` (朱砂赤红), `#991b1b` (暗血赤褐), `#f87171` (亮红边缘光)
   - **视觉质感**：背景高悬朱红长幡布幔、步惊云撕臂激射的血雾与排云掌血气、聂风迎风狂舞的赤红披帛。
   - **补色对冲**：与翡翠青绿形成极高视觉张力的冷暖补色对冲（Red-Green Complementary Contrast），打破单调沉闷，营造经典港片戏剧张力。

3. **苍蓝深靛与风云水汽 (Deep Indigo & Storm Warriors Blue)**：
   - **核心色值**：`#0f172a` (深渊夜墨), `#1e3a8a` (幽蓝披风与发丝), `#38bdf8` (青白风罡与电弧)
   - **视觉质感**：步惊云标志性微卷蓝发、暗蓝长袍与冷峻影调，排云掌万重重叠残影中的冷色水汽波光。

4. **暗黑石窟与高反差虚空 (Pure Inky Black Void & Dark Stone Temple)**：
   - **核心色值**：`#020617` (纯粹黑底), `#18181b` (古刹青石地面), `#27272a` (浮空石块与浑天仪玄铁)
   - **视觉质感**：35mm 胶片大银幕影调，极深暗部无噪点杂色，使得前景半透明发光体与高光轮廓如同刀刻般锐利。

5. **纯阳破晓金与通天白光 (Solar Gold & Spectral White Lightning)**：
   - **核心色值**：`#f59e0b` (纯阳金煞), `#fbbf24` (耀眼金芒), `#ffffff` (核爆级通天高光白柱与音爆环)
   - **视觉质感**：降龙廿八掌金龙、如来神掌破天金芒、空气音爆压缩环瞬爆高光、变形宽银幕眩光（Anamorphic Flare）。

---

## 3. 2008 港影影调与光影配方 (Cinematography & Lighting Formula)

### ① 三点布光与刀锋轮廓光 (Razor-Sharp Rim Lighting)
- **主光源 (Key Light)**：法术本体（如掌心翡翠水球或金龙法相）自发光作为强向心主光，照亮角色面部、臂膀与肌肉纹理。
- **逆光/边缘光 (Rim Light)**：青白电弧或冷蓝背光从角色后方 45 度极速打亮飞扬长发与衣袍边缘，产生极高锐度的刀锋金边/青边。
- **辅光 (Fill Light)**：极低比例（Key:Fill = 8:1），保持阴影部位深邃纯净。

### ② 35mm 胶片大银幕质感 (35mm Film Stock Aesthetics)
- **胶片微颗粒 (Organic Film Grain)**：带有 2008 电影胶片自然颗粒感，彻底杜绝廉价塑料感与过度磨皮平滑。
- **变形宽银幕光斑 (Anamorphic Lens Streaks)**：强光爆发瞬间产生水平向青蓝或纯白横向拉丝光晕。
- **暗角效果 (Vignette)**：四周边缘自然压暗 15%~25%，聚拢视觉焦点于中央大招核心。

---

## 4. 2008 港片经典招式与动作设计规范 (Action Choreography)

1. **实打实硬桥硬马与真气外放融合**：
   - 下盘马步沉身、丹田引气、双手极速翻飞结印。
   - 动作具有极其清晰的身体发力力竭点与顿挫感（Snap & Weight）。
2. **高速快门动作残影 (Staccato Shutter Action Trails)**：
   - 推掌出拳伴随千重重叠掌印残影（如排云掌“万掌齐发”）。
3. **空气音爆环 (Concentric Sonic Boom Discs)**：
   - 大招轰出瞬间空气被压缩炸裂出同心白色圆环气爆。
4. **念力飞石与地表崩碎 (Telekinetic Debris Floating)**：
   - 强大的真气压迫感引动四周地砖、碎石反重力浮空吸附旋转。

---

## 5. 九大分镜动作与拍摄调度表 (3×3 Grid Matrix)

| 序号 | 分镜阶段 | 镜头景别与焦距 | 拍摄角度与透视 | 动作导演指令 | 视觉特效与光影重点 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **01** | **掐诀** (Mudra) | 35mm 特写/微距 | 45度侧视半特写 | 双手指法翻飞，结出玄奥古印 | 指尖符文流光微绽，微观灵气粒子升腾与手印重叠残影 |
| **02** | **蓄力出招** (Charge) | 24mm 仰拍大透视 | 极低角度大仰角 | 身形微沉引气，衣袍长发狂舞 | 周天灵气漏斗倒灌，脚下阵图旋转，地表碎石浮空 |
| **03** | **术法显现** (Manifest) | 28mm 中景纵深 | 斜侧45度大空间 | 剑指点出，撕裂虚空 | 半透明灵体虚影破界初露峥嵘 |
| **04** | **术法凝聚** (Condense) | 18mm 广角大张力 | 正面大广角向心 | 双臂引纳，天地能量极限压缩 | 能量光轨疯狂向心凝实，空间扭曲，青白电弧激荡 |
| **05** | **术法舒展** (Unfurl) | 14mm 超广角全景 | 大旋转俯仰镜头 | 巨型法相仰天咆哮，腾空盘旋 | 绵延千丈横贯画面，龙须符文锁链飞舞 |
| **06** | **大招爆发** (Release) | 16mm 鱼眼广角 | 近身极度夸张透视 | 倾尽修为双掌悍然轰出 | 核爆级能量冲击波，多重空气音爆环炸裂 |
| **07** | **出招冲击** (Impact) | 50mm 追焦跟随 | 过肩侧后方高速跟随 | 法相化作破虚光柱极速贯穿 | 超音速流光尾迹与空间碎裂拉丝 |
| **08** | **大招特写** (Close-Up) | 85mm 影视肖像微距 | 微距低角度仰视 | 核心龙首怒目圆睁，口含龙珠 | 晶莹翡翠鳞片纤毫毕现，三点布光 |
| **09** | **攻击威能** (Apocalypse) | 12mm 远景全景 | 极远高空俯瞰全景 | 命中天地引发通天光柱与毁灭涟漪 | 环形能量波荡平万里，漫天光尘如雨 |

---

## 6. 终极奥义库 (Ultimate Arcana Repetoire)

### 🎬 经典港片武侠电影绝学体系 (1998~2008 典藏美学)
1. **三分归元气 · 雄霸天下 (08港片巅峰极意)**：手托半透明晶莹碧绿水球，青白电弧跳跃，万石浮空旋转，35mm电影胶片高反差青冷暗调。
2. **风云绝响 · 摩诃无量 (08港影终极绝学)**：冰火风云双螺旋龙卷，撕裂维度虚空，红蓝对冲电影级光影。
3. **降龙廿八掌 · 亢龙有悔 (08港武金青双龙)**：硬桥硬马马步推掌，纯金金煞苍龙破体咆哮。
4. **万剑归宗 · 青蓝剑煞 (徐克蜀山式剑仙)**：徐克蜀山式青蓝万剑天河，庚金剑罡倒灌。
5. **如来神掌 · 万佛朝宗 (08港片天穹金掌)**：金色天穹巨掌洞穿九天云海，荡平山河。
6. **排云掌 · 步惊云 (不哭死神)**：蓝发披肩，千重重叠残影推掌，撕臂飞血化为狂暴血气排云印。
7. **风神腿 · 聂风 (风中之神)**：红巾黑袍，凌空旋踢掀起通天龙卷狂风，青白风刃激荡。

### 🐉 东方修仙玄幻法相体系 (D-Z-P-Z-W 终极奥义)
8. **九天苍龙 · 万界破虚 (D-Z-P-Z-W 核心)**：半透明灵体绿龙(中国青龙能量形态)，翡翠流光与动态消散灵气粒子。
9. **诛仙剑阵 · 四象绝杀 (D-Z-P-Z-W 剑道)**：四象巨型诛仙神剑与万千金色飞剑天河。
10. **幽冥紫极 · 九幽焚天 (D-Z-P-Z-W 魔尊)**：半透明紫晶光焰与巨型紫焰魔兽法相。
11. **太初天劫 · 紫霄神雷 (D-Z-P-Z-W 雷劫)**：猩红雷龙电浆法相，高频狂舞电蛇。
12. **业火红莲 · 净世 (太上真火)**：九瓣纯阳八宝琉璃业火红莲神台。
13. **乾坤八卦 · 阴阳 (混元天师)**：立体旋转太极双鱼图与悬浮八卦乾坤盘。
14. **虚空破灭 · 坍缩 (空间法则)**：撕裂维度的镜面碎裂光刃与坍缩奇点。

---

## 7. 标准提示词输出模板 (Standard Prompt Outputs)

### 中文原版母版 (Master Chinese Prompt)
```text
3×3网格分镜布局，全景图包含9个独立画面，每个画面均为16:9比例，参【图1】角色特征，呈现角色施展【九霄碧灵苍龙诀】终极大招的专业影视制作级动作场面分镜表，视觉布局严谨规整。

整体风格：2008年香港巅峰玄幻动作电影风格，【2008经典港片青冷暗调：高反差青冷暗调 Teal & Emerald (#064e3b, #10b981)，冷暖对冲点缀纯阳朱红 (#dc2626)，纯黑深邃背景搭配通透翡翠绿/青幽流光，锐利高光与35mm电影胶片微颗粒】。实打实硬桥硬马武指动作与真气外放完美结合，高速快门动作残影，空气撕裂音爆环，念力飞石悬浮，极度夸张大透视构图。
角色招式：修仙角色释放终极法术大招，绿色能量法术，以半透明灵体绿龙(中国青龙能量形态)为大招核心，多元修仙术法融合爆发。
画面核心要求：全程极度夸张大透视构图，超强空间纵深感与视觉张力，彻底规避平面化呈现；法术粒子细腻绵密，自带动态消散、流光流转、翡翠灵光与能量氤氲效果，光影层次丰富立体，高光锐利通透、暗部深邃干净，兼顾法术爆发冲击力与微观细节质感，每帧达院线3D动画影视级渲染精度。

9个独立分镜镜头动作编排：
1. 掐诀：修仙者双手结玄奥法印，指尖流淌符文微光（35mm 特写）
2. 蓄力出招：身姿凌空微沉蓄力，衣袍长发狂舞，灵能风暴倒灌，碎石悬浮（24mm 仰拍大透视）
3. 术法显现：剑指点出，身后虚空撕裂，巨大半透明灵体绿龙破界显现（28mm 中景）
4. 术法凝聚：漫天狂暴灵能化作光轨疯狂向核心凝聚，空间剧烈扭曲（18mm 广角）
5. 术法舒展：万丈灵体神龙咆哮舒展，盘旋环绕遮天蔽日（14mm 超广角）
6. 大招爆发：双掌悍然轰出，大招法能如核爆爆发，气爆环炸裂（16mm 鱼眼广角）
7. 出招冲击：灵龙化作破虚光柱以极速贯穿天地，留下一道流光拉丝（50mm 过肩追焦）
8. 大招特写：威严龙首怒目圆睁，口含湮灭龙珠，龙鳞晶莹剔透（85mm 微距特写）
9. 攻击威能：命中爆发通天贯地光柱，环形能量涟漪横扫万里苍穹（12mm 极远景全景）
```

### Midjourney v6.1
```text
3x3 grid storyboard layout, contact sheet of 9 distinct sequential cinematic shots, each frame 16:9 ratio, 2008 classic Hong Kong martial arts fantasy cinema aesthetic, high-contrast dark teal and deep emerald shadows (#064e3b, #10b981) contrasting with vivid vermilion red banners (#dc2626), pure void backdrop, luminous jade neon aura with crackling cyan electric arcs, volumetric god rays piercing dark stone temple, 35mm film stock grain, sharp cinematic rim lighting, authentic Hong Kong stunt action choreography, staccato shutter motion trails, concentric air-compression sonic boom rings, ultimate spell cast action sequence of cultivator, casting supreme magic 'Nine Heavens Azure Dragon', core entity: translucent glowing emerald Chinese dragon, pure black background, hyper-dramatic wide perspective depth, volumetric glowing particles, sharp crystal highlights, Octane Render 8k cinema quality, dynamic action sequence panels: 1. hand mudra close-up 2. chi accumulation upward tilt 3. spirit entity emergence 4. extreme energy vortex compression 5. massive entity unfurling 6. explosive palm blast shockwave 7. supersonic tracking piercing beam 8. ferocious macro portrait close-up 9. apocalyptic cataclysmic light pillar --ar 16:9 --style raw --v 6.1 --q 2 --s 250
```

---

## 8. 视频生成后处理工作流 (Video Workflow)
1. 在 **9G-onlyno999 工坊** 中一键切片导出 9 张独立 16:9 PNG 图像。
2. 导入 **可灵 AI (Kling)** / **Runway Gen-3** / **即梦 (Jimeng)** / **Sora**。
3. 首尾帧/图生视频设置：使用每两张相邻切片作为前后引导帧，由于动作按起手-蓄力-爆发编排，生成的法术动作天然丝滑无断层。

---

## 9. GitHub 仓库与终极奥义在线载入 (D-Z-P-Z-W Integration)
- **在线仓库源**：`https://github.com/onlyoyrao999/D-Z-P-Z-W`
- **终极奥义系列**：
  1. **九天苍龙·万界破虚终极奥义** (D-Z-P-Z-W 核心青龙绝学)
  2. **诛仙剑阵·四象绝杀终极奥义** (D-Z-P-Z-W 剑道天河)
  3. **幽冥紫极·九幽焚天终极奥义** (D-Z-P-Z-W 魔尊煞焰)
  4. **太初天劫·紫霄神雷终极奥义** (D-Z-P-Z-W 天罚雷帝)
