import React, { useState, useRef } from 'react';
import { Upload, Sparkles, X, Image as ImageIcon, CheckCircle, Tag, Wand2 } from 'lucide-react';
import { CharacterConfig } from '../types/storyboard';

interface ReferenceImageUploaderProps {
  character: CharacterConfig;
  onChange: (updated: Partial<CharacterConfig>) => void;
}

export const ReferenceImageUploader: React.FC<ReferenceImageUploaderProps> = ({
  character,
  onChange,
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [extractedTags, setExtractedTags] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      onChange({ referenceImageBase64: base64 });
      analyzeImage(base64, file.type);
    };
    reader.readAsDataURL(file);
  };

  const analyzeImage = async (base64: string, mimeType: string) => {
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/analyze-character-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: base64, mimeType }),
      });
      const data = await res.json();

      if (data.summary) {
        onChange({
          referenceImageDescription: data.summary,
          gender: data.gender || character.gender,
          hairStyle: data.hairStyle || character.hairStyle,
          costume: data.costume || character.costume,
          accessories: data.accessories || character.accessories,
          expression: data.expression || character.expression,
        });
      }
      if (data.suggestedTags && Array.isArray(data.suggestedTags)) {
        setExtractedTags(data.suggestedTags);
      }
    } catch (err) {
      console.warn('AI analysis error, using default tags');
      onChange({
        referenceImageDescription: '身着玄青暗纹长袍，长发飞扬，神情坚毅冷峻，周身仙气萦绕。',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const clearImage = () => {
    onChange({
      referenceImageBase64: undefined,
      referenceImageDescription: undefined,
    });
    setExtractedTags([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-bold text-slate-200">
            参考【图1】角色特征锁定 (Face & Outfit Locking)
          </span>
        </div>
        {character.referenceImageBase64 && (
          <button
            onClick={clearImage}
            className="text-[11px] text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors"
          >
            <X className="w-3 h-3" /> 清除参考图
          </button>
        )}
      </div>

      {!character.referenceImageBase64 ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-white/15 hover:border-emerald-500/50 rounded-xl p-5 text-center cursor-pointer transition-colors bg-black/20 group"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileUpload}
          />
          <Upload className="w-8 h-8 text-slate-500 group-hover:text-emerald-400 mx-auto mb-2 transition-colors" />
          <p className="text-xs font-medium text-slate-300">
            点击或拖拽上传【图1】角色参考图
          </p>
          <p className="text-[11px] text-slate-500 mt-1">
            AI将智能提取角色服饰、发冠、法宝、配色等特征，确保9张连贯画面人物一致！
          </p>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row gap-3 items-start">
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden border border-emerald-500/40 flex-shrink-0">
            <img
              src={character.referenceImageBase64}
              alt="Character Reference"
              className="w-full h-full object-cover"
            />
            {isAnalyzing && (
              <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center p-2 text-center">
                <div className="w-4 h-4 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin mb-1" />
                <span className="text-[10px] text-emerald-300">特征提取中...</span>
              </div>
            )}
          </div>

          <div className="flex-1 space-y-2 w-full">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-xs font-bold text-emerald-300">
                已锁定参考角色外观特征
              </span>
            </div>

            <textarea
              value={character.referenceImageDescription || ''}
              onChange={(e) => onChange({ referenceImageDescription: e.target.value })}
              placeholder="提取的角色外观特征描述..."
              className="w-full h-16 p-2 rounded-lg bg-black/40 border border-white/10 text-xs text-slate-200 focus:outline-none focus:border-emerald-500/50 resize-none font-mono"
            />

            {extractedTags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {extractedTags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-md bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 font-mono"
                  >
                    <Tag className="w-2.5 h-2.5" />
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
