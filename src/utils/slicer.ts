import JSZip from 'jszip';
import { SHOT_DEFINITIONS } from '../data/presets';
import { ElementArchetype } from '../types/storyboard';

/**
 * Slices a 3x3 grid image into 9 individual shot images (Data URLs).
 */
export async function slice3x3GridImage(
  imageUrl: string,
  options?: {
    addWatermarkOverlay?: boolean;
    archetype?: ElementArchetype;
    spellName?: string;
  }
): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const slicedUrls: string[] = [];
        const fullW = img.naturalWidth || img.width;
        const fullH = img.naturalHeight || img.height;

        const cellW = fullW / 3;
        const cellH = fullH / 3;

        for (let row = 0; row < 3; row++) {
          for (let col = 0; col < 3; col++) {
            const index = row * 3 + col; // 0 to 8
            const shotDef = SHOT_DEFINITIONS[index];

            const canvas = document.createElement('canvas');
            canvas.width = cellW;
            canvas.height = cellH;
            const ctx = canvas.getContext('2d');

            if (!ctx) {
              throw new Error('Canvas context not available');
            }

            // Draw cropped cell
            const sx = col * cellW;
            const sy = row * cellH;
            ctx.drawImage(img, sx, sy, cellW, cellH, 0, 0, cellW, cellH);

            if (options?.addWatermarkOverlay && shotDef) {
              // Draw cinematic lower third badge
              ctx.save();
              const bannerH = Math.max(32, cellH * 0.12);
              const grad = ctx.createLinearGradient(0, cellH - bannerH * 1.5, 0, cellH);
              grad.addColorStop(0, 'rgba(0, 0, 0, 0)');
              grad.addColorStop(0.5, 'rgba(0, 0, 0, 0.7)');
              grad.addColorStop(1, 'rgba(0, 0, 0, 0.95)');
              ctx.fillStyle = grad;
              ctx.fillRect(0, cellH - bannerH * 1.5, cellW, bannerH * 1.5);

              // Badge Pill
              const padX = cellW * 0.04;
              const padY = cellH - bannerH * 0.4;
              ctx.fillStyle = options.archetype?.primaryColor || '#10b981';
              ctx.font = `bold ${Math.max(12, cellW * 0.028)}px sans-serif`;
              ctx.fillText(`【0${shotDef.index}】${shotDef.stepName} · ${shotDef.focalLength}`, padX, padY);

              // English Subtitle
              ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
              ctx.font = `${Math.max(10, cellW * 0.02)}px sans-serif`;
              ctx.fillText(`${shotDef.englishStep} / ${shotDef.cameraAngle}`, padX, padY + bannerH * 0.28);

              ctx.restore();
            }

            slicedUrls.push(canvas.toDataURL('image/png'));
          }
        }
        resolve(slicedUrls);
      } catch (err) {
        reject(err);
      }
    };
    img.onerror = (e) => reject(new Error('Failed to load grid image for slicing: ' + e));
    img.src = imageUrl;
  });
}

/**
 * Creates a Zip file containing all 9 cut shots + full grid image + prompt README
 */
export async function downloadStoryboardZip(
  gridImageUrl: string,
  slicedUrls: string[],
  fullPromptText: string,
  archetype: ElementArchetype,
  spellName: string
): Promise<void> {
  const zip = new JSZip();
  const folderName = `修仙分镜_${spellName.replace(/\s+/g, '_')}_3x3九宫格`;
  const folder = zip.folder(folderName) || zip;

  // Add prompts text
  folder.file('提示词与分镜脚本_Prompt.txt', fullPromptText);

  // Add sliced images
  for (let i = 0; i < slicedUrls.length; i++) {
    const shot = SHOT_DEFINITIONS[i];
    const dataUrl = slicedUrls[i];
    const base64Data = dataUrl.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');
    const filename = `分镜_${String(i + 1).padStart(2, '0')}_${shot.stepName}_${shot.focalLength}.png`;
    folder.file(filename, base64Data, { base64: true });
  }

  // Add master grid if available
  if (gridImageUrl.startsWith('data:image/')) {
    const masterBase64 = gridImageUrl.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');
    folder.file(`九宫格全景图_Master_3x3.png`, masterBase64, { base64: true });
  }

  const content = await zip.generateAsync({ type: 'blob' });
  const downloadLink = document.createElement('a');
  downloadLink.href = URL.createObjectURL(content);
  downloadLink.download = `${folderName}.zip`;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  URL.revokeObjectURL(downloadLink.href);
}

/**
 * Procedurally generates a cinematic 3x3 placeholder canvas grid
 * for instant visualization when no AI image has been generated yet.
 */
export function generateProcedural3x3GridCanvas(
  archetype: ElementArchetype,
  characterName: string,
  spellName: string
): string {
  const canvas = document.createElement('canvas');
  canvas.width = 1920;
  canvas.height = 1080; // 16:9 aspect ratio standard
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  const w = canvas.width;
  const h = canvas.height;
  const cellW = w / 3;
  const cellH = h / 3;

  // Dark background
  ctx.fillStyle = '#06080d';
  ctx.fillRect(0, 0, w, h);

  // Draw 9 cinematic cells
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      const idx = r * 3 + c;
      const def = SHOT_DEFINITIONS[idx];
      const x = c * cellW;
      const y = r * cellH;

      // Cell background gradient
      const grad = ctx.createRadialGradient(
        x + cellW / 2,
        y + cellH / 2,
        10,
        x + cellW / 2,
        y + cellH / 2,
        cellW * 0.7
      );
      grad.addColorStop(0, '#0c121d');
      grad.addColorStop(0.7, '#080c13');
      grad.addColorStop(1, '#030508');
      ctx.fillStyle = grad;
      ctx.fillRect(x + 2, y + 2, cellW - 4, cellH - 4);

      // Outer glow and magical energy swirls
      ctx.save();
      ctx.beginPath();
      ctx.rect(x + 2, y + 2, cellW - 4, cellH - 4);
      ctx.clip();

      // Energy aura curves
      ctx.strokeStyle = archetype.primaryColor;
      ctx.lineWidth = 2 + (idx % 4) * 1.5;
      ctx.shadowColor = archetype.primaryColor;
      ctx.shadowBlur = 15;

      const progress = (idx + 1) / 9; // 0.1 to 1.0

      // Dynamic cinematic illustration per shot
      if (idx === 0) {
        // 掐诀 Hand seal
        ctx.beginPath();
        ctx.arc(x + cellW / 2, y + cellH / 2, 45, 0, Math.PI * 2);
        ctx.stroke();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.strokeRect(x + cellW / 2 - 25, y + cellH / 2 - 25, 50, 50);
      } else if (idx === 1) {
        // 蓄力 Upward vortex
        ctx.beginPath();
        ctx.moveTo(x + cellW * 0.2, y + cellH * 0.9);
        ctx.bezierCurveTo(x + cellW * 0.3, y + cellH * 0.4, x + cellW * 0.7, y + cellH * 0.6, x + cellW * 0.8, y + cellH * 0.1);
        ctx.stroke();
      } else if (idx === 2) {
        // 显现 Emergence
        ctx.beginPath();
        ctx.arc(x + cellW * 0.6, y + cellH * 0.4, 60, Math.PI * 0.2, Math.PI * 1.6);
        ctx.stroke();
      } else if (idx === 3) {
        // 凝聚 Condensation
        for (let rad = 20; rad < 80; rad += 18) {
          ctx.beginPath();
          ctx.arc(x + cellW / 2, y + cellH / 2, rad, 0, Math.PI * 1.5);
          ctx.stroke();
        }
      } else if (idx === 4) {
        // 舒展 Unfurling
        ctx.beginPath();
        ctx.moveTo(x + cellW * 0.1, y + cellH * 0.8);
        ctx.bezierCurveTo(x + cellW * 0.4, y + cellH * 0.1, x + cellW * 0.6, y + cellH * 0.9, x + cellW * 0.9, y + cellH * 0.2);
        ctx.stroke();
      } else if (idx === 5) {
        // 爆发 Explosive
        ctx.beginPath();
        for (let a = 0; a < Math.PI * 2; a += Math.PI / 6) {
          ctx.moveTo(x + cellW / 2, y + cellH / 2);
          ctx.lineTo(x + cellW / 2 + Math.cos(a) * 90, y + cellH / 2 + Math.sin(a) * 90);
        }
        ctx.stroke();
      } else if (idx === 6) {
        // 冲击 Piercing beam
        ctx.beginPath();
        ctx.moveTo(x + cellW * 0.05, y + cellH * 0.5);
        ctx.lineTo(x + cellW * 0.95, y + cellH * 0.5);
        ctx.stroke();
      } else if (idx === 7) {
        // 特写 Dragon Maw Macro
        ctx.beginPath();
        ctx.arc(x + cellW * 0.45, y + cellH * 0.5, 75, 0, Math.PI * 2);
        ctx.stroke();
      } else {
        // 威能 Apocalypse pillar
        ctx.beginPath();
        ctx.moveTo(x + cellW * 0.4, y + cellH);
        ctx.lineTo(x + cellW * 0.48, y);
        ctx.lineTo(x + cellW * 0.52, y);
        ctx.lineTo(x + cellW * 0.6, y + cellH);
        ctx.closePath();
        ctx.stroke();
      }

      // Sparkles & floating particles
      ctx.fillStyle = archetype.primaryColor;
      for (let p = 0; p < 12; p++) {
        const px = x + 30 + (Math.sin(p * 99 + idx) * 0.5 + 0.5) * (cellW - 60);
        const py = y + 30 + (Math.cos(p * 77 + idx) * 0.5 + 0.5) * (cellH - 60);
        ctx.beginPath();
        ctx.arc(px, py, 1.5 + (p % 3), 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();

      // Grid dividers border
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(x, y, cellW, cellH);

      // Shot info overlay header
      ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
      ctx.fillRect(x + 12, y + 12, 160, 48);

      ctx.fillStyle = archetype.primaryColor;
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText(`0${def.index} ${def.stepName}`, x + 20, y + 32);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.font = '12px sans-serif';
      ctx.fillText(`${def.focalLength} · ${def.stageType}`, x + 20, y + 50);

      // Sub-caption at bottom
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.font = '13px sans-serif';
      ctx.fillText(def.actionDescription.slice(0, 24) + '...', x + 16, y + cellH - 18);
    }
  }

  return canvas.toDataURL('image/png');
}
