import React from 'react';

interface SocialTreeDisplayProps {
  level?: number;
  totalXp?: number;
  verifiedCount?: number;
  verifiedRecycleCount?: number;
  breakdowns?: any[];
  className?: string;
  isInteractive?: boolean;
  onTreeClick?: () => void;
}

export const SocialTreeDisplay: React.FC<SocialTreeDisplayProps> = ({
  level = 1,
  totalXp = 0,
  verifiedCount,
  verifiedRecycleCount,
  className = '',
  isInteractive = false,
  onTreeClick,
}) => {
  const actualLevel = level || 1;
  const actualXp = totalXp || 0;
  const actualVerifiedCount = verifiedCount ?? verifiedRecycleCount ?? 0;

  // Determine growth stage
  const getStageInfo = (lvl: number) => {
    if (lvl < 5) return { stage: 1, name: 'はじまりの双葉', tag: 'SEEDLING' };
    if (lvl < 10) return { stage: 2, name: '伸びゆく若木', tag: 'SAPLING' };
    if (lvl < 15) return { stage: 3, name: '緑陰の豊かな樹', tag: 'GREAT TREE' };
    if (lvl < 20) return { stage: 4, name: '花咲く満開樹', tag: 'BLOOMING' };
    if (lvl < 25) return { stage: 5, name: '精霊の古木', tag: 'ANCIENT' };
    return { stage: 6, name: '光のソーシャル世界樹', tag: 'WORLD TREE' };
  };

  const stage = getStageInfo(actualLevel);

  return (
    <div
      onClick={isInteractive ? onTreeClick : undefined}
      className={`relative rounded-2xl overflow-hidden pixel-box bg-slate-950 flex flex-col items-center justify-center p-4 ${
        isInteractive ? 'cursor-pointer hover:scale-[1.02] transition-transform' : ''
      } ${className}`}
      id="pixel-social-tree-container"
    >
      {/* Top stage badge */}
      <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900/90 border border-emerald-500/50 text-xs font-pixel text-emerald-300 shadow-md">
        <span className="animate-pulse">🌱</span>
        <span>第{stage.stage}段階: {stage.name}</span>
      </div>

      {actualVerifiedCount > 0 && (
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1 px-2 py-0.5 rounded bg-amber-950/80 border border-amber-500/60 text-[10px] font-pixel text-amber-300">
          <span>♻️ 実機認証: {actualVerifiedCount}回</span>
        </div>
      )}

      {/* Retro Pixel Canvas */}
      <svg
        viewBox="0 0 100 100"
        className="w-full h-48 sm:h-56 object-contain pixelated pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
        shapeRendering="crispEdges"
      >
        {/* Background Atmosphere */}
        <rect x="0" y="0" width="100" height="75" fill="#064E3B" opacity="0.4" />
        <rect x="0" y="75" width="100" height="25" fill="#022C22" />

        {/* Pixel Grass blades */}
        <rect x="10" y="73" width="4" height="2" fill="#10B981" />
        <rect x="25" y="74" width="4" height="2" fill="#10B981" />
        <rect x="40" y="73" width="4" height="2" fill="#10B981" />
        <rect x="65" y="74" width="4" height="2" fill="#10B981" />
        <rect x="80" y="73" width="4" height="2" fill="#10B981" />
        <rect x="90" y="74" width="4" height="2" fill="#10B981" />

        {/* Tree Roots / Soil Mound */}
        <rect x="35" y="72" width="30" height="6" fill="#78350F" />
        <rect x="40" y="70" width="20" height="4" fill="#92400E" />

        {/* Stage 1: Seedling */}
        {stage.stage === 1 && (
          <g id="pixel-tree-stage-1" className="animate-pixel-float">
            {/* Stem */}
            <rect x="48" y="58" width="4" height="14" fill="#15803D" />
            {/* Leaves */}
            <rect x="40" y="52" width="8" height="6" fill="#22C55E" />
            <rect x="42" y="48" width="6" height="4" fill="#4ADE80" />
            <rect x="52" y="52" width="8" height="6" fill="#22C55E" />
            <rect x="52" y="48" width="6" height="4" fill="#4ADE80" />
            {/* Sparkle */}
            <rect x="49" y="44" width="2" height="2" fill="#FEF08A" className="animate-sparkle" />
          </g>
        )}

        {/* Stage 2: Sapling */}
        {stage.stage === 2 && (
          <g id="pixel-tree-stage-2">
            {/* Trunk */}
            <rect x="46" y="48" width="8" height="24" fill="#78350F" />
            <rect x="48" y="48" width="4" height="24" fill="#92400E" />
            {/* Branches & Foliage */}
            <rect x="34" y="32" width="32" height="18" fill="#047857" />
            <rect x="38" y="24" width="24" height="14" fill="#059669" />
            <rect x="42" y="18" width="16" height="10" fill="#10B981" />
            <rect x="44" y="22" width="6" height="4" fill="#34D399" />
          </g>
        )}

        {/* Stage 3: Great Tree */}
        {stage.stage === 3 && (
          <g id="pixel-tree-stage-3">
            {/* Trunk */}
            <rect x="44" y="42" width="12" height="30" fill="#78350F" />
            <rect x="46" y="42" width="6" height="30" fill="#92400E" />
            <rect x="38" y="50" width="6" height="4" fill="#78350F" />
            <rect x="56" y="48" width="6" height="4" fill="#78350F" />
            {/* Broad Canopy */}
            <rect x="22" y="26" width="56" height="24" fill="#064E3B" />
            <rect x="26" y="18" width="48" height="20" fill="#047857" />
            <rect x="32" y="12" width="36" height="16" fill="#059669" />
            <rect x="38" y="8" width="24" height="10" fill="#10B981" />
            {/* Canopy Highlights */}
            <rect x="30" y="22" width="8" height="4" fill="#34D399" />
            <rect x="54" y="16" width="8" height="4" fill="#34D399" />
          </g>
        )}

        {/* Stage 4: Blooming Tree */}
        {stage.stage === 4 && (
          <g id="pixel-tree-stage-4">
            <rect x="42" y="40" width="16" height="32" fill="#78350F" />
            <rect x="46" y="40" width="8" height="32" fill="#92400E" />
            {/* Canopy */}
            <rect x="20" y="22" width="60" height="26" fill="#065F46" />
            <rect x="24" y="14" width="52" height="22" fill="#047857" />
            <rect x="30" y="8" width="40" height="18" fill="#10B981" />
            {/* Pink Blossoms */}
            <rect x="24" y="24" width="6" height="4" fill="#F43F5E" />
            <rect x="36" y="16" width="6" height="4" fill="#FB7185" />
            <rect x="52" y="18" width="6" height="4" fill="#FDA4AF" />
            <rect x="62" y="26" width="6" height="4" fill="#F43F5E" />
            <rect x="44" y="10" width="6" height="4" fill="#FFF1F2" />
          </g>
        )}

        {/* Stage 5 & 6: Ancient & World Tree */}
        {stage.stage >= 5 && (
          <g id="pixel-tree-stage-world">
            {/* Mystical Aura */}
            <rect x="14" y="4" width="72" height="68" fill="none" stroke="#FBBF24" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" className="animate-pulse" />
            {/* Ancient Mighty Trunk */}
            <rect x="38" y="36" width="24" height="36" fill="#451A03" />
            <rect x="42" y="36" width="16" height="36" fill="#78350F" />
            <rect x="46" y="36" width="8" height="36" fill="#B45309" />
            {/* Glowing Tree Core Crystal */}
            <rect x="46" y="50" width="8" height="8" fill="#38BDF8" className="animate-pixel-glow" />
            <rect x="48" y="52" width="4" height="4" fill="#FFFFFF" />
            {/* Massive Cosmic Canopy */}
            <rect x="12" y="18" width="76" height="28" fill="#064E3B" />
            <rect x="16" y="10" width="68" height="24" fill="#047857" />
            <rect x="22" y="4" width="56" height="20" fill="#10B981" />
            <rect x="30" y="0" width="40" height="14" fill="#34D399" />
            {/* Golden Star Leaves */}
            <rect x="20" y="14" width="4" height="4" fill="#FDE047" className="animate-sparkle" />
            <rect x="44" y="4" width="4" height="4" fill="#FDE047" className="animate-sparkle" />
            <rect x="68" y="12" width="4" height="4" fill="#FDE047" className="animate-sparkle" />
            <rect x="34" y="22" width="4" height="4" fill="#38BDF8" className="animate-sparkle" />
            <rect x="58" y="24" width="4" height="4" fill="#C084FC" className="animate-sparkle" />
          </g>
        )}

        {/* QR Recycling Verified Fruits (実る黄金の果実) */}
        {actualVerifiedCount > 0 && (
          <g id="pixel-verified-fruits">
            <rect x="28" y="36" width="6" height="6" fill="#F59E0B" className="animate-pixel-float" />
            <rect x="30" y="38" width="2" height="2" fill="#FEF3C7" />
            {actualVerifiedCount >= 2 && (
              <>
                <rect x="64" y="34" width="6" height="6" fill="#F59E0B" className="animate-pixel-float" />
                <rect x="66" y="36" width="2" height="2" fill="#FEF3C7" />
              </>
            )}
            {actualVerifiedCount >= 5 && (
              <>
                <rect x="46" y="20" width="8" height="8" fill="#F59E0B" className="animate-pixel-glow" />
                <rect x="48" y="22" width="4" height="4" fill="#FFFFFF" />
              </>
            )}
          </g>
        )}

        {/* Flying Pixel Fairies / Leaves */}
        <rect x="16" y="48" width="2" height="2" fill="#A7F3D0" className="animate-sparkle" />
        <rect x="84" y="42" width="2" height="2" fill="#A7F3D0" className="animate-sparkle" />
        <rect x="74" y="60" width="2" height="2" fill="#6EE7B7" className="animate-sparkle" />
      </svg>

      {/* Footer stats */}
      <div className="mt-2 text-center">
        <p className="text-xs text-slate-400 font-pixel">
          累計ソーシャルXP: <span className="text-emerald-400 font-bold">{(actualXp || 0).toLocaleString()} XP</span>
        </p>
      </div>
    </div>
  );
};
