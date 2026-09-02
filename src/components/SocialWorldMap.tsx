import React, { useState } from 'react';
import { WorldArea, CategoryType } from '../types';
import { WORLD_AREAS } from '../data/worldMapData';

interface SocialWorldMapProps {
  onSelectArea?: (area: WorldArea) => void;
  onOpenQRScanner?: () => void;
  onActionClick?: (category: CategoryType) => void;
}

export const SocialWorldMap: React.FC<SocialWorldMapProps> = ({
  onSelectArea,
  onOpenQRScanner,
  onActionClick,
}) => {
  const [selectedAreaId, setSelectedAreaId] = useState<string>('eco_forest');
  const activeArea = WORLD_AREAS[selectedAreaId] || WORLD_AREAS.eco_forest;

  return (
    <div className="space-y-4" id="social-world-map-wrapper">
      {/* Map Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm sm:text-base font-bold font-pixel text-emerald-400 flex items-center gap-2">
            <span>🗺️</span> ソーシャル・ワールドマップ
          </h3>
          <p className="text-xs text-slate-400 font-pixel">
            あなたの社会貢献で各地が豊かに発展していきます
          </p>
        </div>
        <div className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-xs font-pixel text-slate-300">
          全エリア解放中
        </div>
      </div>

      {/* Retro Pixel Map Canvas */}
      <div className="relative rounded-2xl overflow-hidden pixel-box bg-slate-950 p-2 sm:p-4">
        {/* World Grid Map */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
          {Object.values(WORLD_AREAS).map((area) => {
            const isSelected = area.id === selectedAreaId;
            return (
              <button
                key={area.id}
                id={`world-map-area-${area.id}`}
                onClick={() => {
                  setSelectedAreaId(area.id);
                  if (onSelectArea) onSelectArea(area);
                }}
                className={`relative rounded-xl p-3 text-left transition-all pixel-btn border-2 ${
                  isSelected
                    ? 'border-amber-400 bg-slate-900 ring-2 ring-amber-400/40 shadow-lg'
                    : 'border-slate-800 bg-slate-900/60 hover:border-slate-600'
                }`}
              >
                <div className="flex items-start justify-between">
                  <span className="text-2xl sm:text-3xl filter drop-shadow">{area.icon}</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-pixel bg-slate-950 border border-slate-700 text-amber-300">
                    Lv.{area.level}
                  </span>
                </div>

                <div className="mt-2">
                  <div className="font-bold text-xs sm:text-sm text-slate-100 font-pixel truncate">
                    {area.name}
                  </div>
                  <div className="text-[10px] text-slate-400 font-press-start truncate">
                    {area.nameEn}
                  </div>
                </div>

                {/* Mini progress bar */}
                <div className="mt-2 w-full bg-slate-950 rounded-full h-1.5 overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: `${Math.min(100, (area.progress / area.maxProgress) * 100)}%` }}
                  />
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Area Detail Inspection Panel */}
        <div className="mt-4 rounded-xl border border-slate-700 bg-slate-900/90 p-3 sm:p-4 text-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">{activeArea.icon}</span>
              <div>
                <h4 className="font-bold font-pixel text-amber-300 text-sm sm:text-base">
                  {activeArea.name} ({activeArea.nameEn})
                </h4>
                <p className="text-xs text-slate-400 font-pixel">
                  発展状況: <span className="text-emerald-400">{activeArea.growthStage}</span>
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs font-pixel text-slate-300">
                貢献値: <span className="text-emerald-400 font-bold">{activeArea.progress}</span> / {activeArea.maxProgress} XP
              </div>
            </div>
          </div>

          <p className="mt-3 text-xs text-slate-300 leading-relaxed font-pixel">
            {activeArea.description}
          </p>

          {/* Area Perks */}
          <div className="mt-3">
            <div className="text-[11px] font-bold text-amber-400 font-pixel mb-1.5 flex items-center gap-1">
              <span>✨</span> 解放された恩恵:
            </div>
            <div className="flex flex-wrap gap-1.5">
              {activeArea.unlockedPerks.map((perk, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded text-[11px] bg-slate-950 border border-emerald-500/40 text-emerald-300 font-pixel"
                >
                  ✓ {perk}
                </span>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="mt-4 flex flex-wrap gap-2 pt-2 border-t border-slate-800">
            {activeArea.category === 'environment' && onOpenQRScanner && (
              <button
                id="world-map-btn-qr"
                onClick={onOpenQRScanner}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold font-pixel text-xs pixel-btn flex items-center gap-1.5"
              >
                <span>📷</span> リサイクルQRスキャンで発展させる
              </button>
            )}
            {onActionClick && (
              <button
                id="world-map-btn-record"
                onClick={() => onActionClick(activeArea.category)}
                className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold font-pixel text-xs pixel-btn flex items-center gap-1.5"
              >
                <span>⚡</span> このエリアの社会貢献を記録する
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
