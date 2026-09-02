import React from 'react';
import { AvatarConfig } from '../types';

interface AvatarDisplayProps {
  avatar: AvatarConfig;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showBackground?: boolean;
  className?: string;
  isFloating?: boolean;
}

export const AvatarDisplay: React.FC<AvatarDisplayProps> = ({
  avatar,
  size = 'lg',
  showBackground = true,
  className = '',
  isFloating = false,
}) => {
  // Dimensions mapping
  const sizeMap = {
    sm: 'w-16 h-16',
    md: 'w-28 h-28',
    lg: 'w-48 h-48 sm:w-56 sm:h-56',
    xl: 'w-64 h-64 sm:w-80 sm:h-80',
  };

  // Skin tones
  const skinColorMap: Record<string, { base: string; shadow: string; highlight: string }> = {
    skin_fair: { base: '#FFDFD0', shadow: '#E2B8A4', highlight: '#FFF5F0' },
    skin_natural: { base: '#F6C8A6', shadow: '#D9A17C', highlight: '#FDE4D0' },
    skin_warm: { base: '#D49B72', shadow: '#B2764E', highlight: '#E5B793' },
    skin_deep: { base: '#8D5B3A', shadow: '#6A3D22', highlight: '#A87451' },
  };
  const skin = skinColorMap[avatar.skinColor] || skinColorMap.skin_natural;

  // Hair color
  const hairColorMap: Record<string, { base: string; shadow: string; highlight: string }> = {
    '#38281F': { base: '#38281F', shadow: '#22160F', highlight: '#5A4335' },
    '#1E293B': { base: '#1E293B', shadow: '#0F172A', highlight: '#334155' },
    '#D97706': { base: '#D97706', shadow: '#B45309', highlight: '#FBBF24' },
    '#10B981': { base: '#10B981', shadow: '#059669', highlight: '#34D399' },
    '#EC4899': { base: '#EC4899', shadow: '#DB2777', highlight: '#F472B6' },
  };
  const hairCol = hairColorMap[avatar.hairColor || '#38281F'] || {
    base: avatar.hairColor || '#38281F',
    shadow: '#1F140D',
    highlight: '#5E4334',
  };

  return (
    <div
      className={`relative rounded-2xl overflow-hidden pixel-box bg-slate-950 flex items-center justify-center select-none ${sizeMap[size]} ${className} ${
        isFloating ? 'animate-pixel-float' : ''
      }`}
      id="avatar-pixel-canvas-container"
    >
      <svg
        viewBox="0 0 64 64"
        className="w-full h-full object-contain pixelated pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
        shapeRendering="crispEdges"
      >
        <defs>
          {/* Pixel patterns & filters if needed */}
        </defs>

        {/* ============================================================ */}
        {/* 1. LAYER: BACKGROUND (ドット絵背景) */}
        {/* ============================================================ */}
        {showBackground && (
          <g id="layer-pixel-background">
            {avatar.background === 'bg_forest' ? (
              <g id="bg-pixel-forest">
                {/* Sky Gradient in pixels */}
                <rect x="0" y="0" width="64" height="24" fill="#064E3B" />
                <rect x="0" y="24" width="64" height="16" fill="#065F46" />
                <rect x="0" y="40" width="64" height="24" fill="#047857" />
                {/* Distant pixel trees */}
                <rect x="4" y="20" width="8" height="20" fill="#022C22" />
                <rect x="6" y="14" width="4" height="6" fill="#022C22" />
                <rect x="52" y="18" width="8" height="22" fill="#022C22" />
                <rect x="54" y="12" width="4" height="6" fill="#022C22" />
                {/* Pixel sunbeam / fireflies */}
                <rect x="12" y="10" width="2" height="2" fill="#A7F3D0" opacity="0.8" />
                <rect x="48" y="8" width="2" height="2" fill="#6EE7B7" opacity="0.8" />
                <rect x="22" y="16" width="2" height="2" fill="#A7F3D0" opacity="0.6" />
                {/* Pixel ground with grass blades */}
                <rect x="0" y="52" width="64" height="12" fill="#064E3B" />
                <rect x="6" y="50" width="2" height="2" fill="#10B981" />
                <rect x="20" y="50" width="2" height="2" fill="#10B981" />
                <rect x="44" y="50" width="2" height="2" fill="#10B981" />
                <rect x="56" y="50" width="2" height="2" fill="#10B981" />
              </g>
            ) : avatar.background === 'bg_sunset_town' ? (
              <g id="bg-pixel-town">
                <rect x="0" y="0" width="64" height="18" fill="#7C2D12" />
                <rect x="0" y="18" width="64" height="18" fill="#C2410C" />
                <rect x="0" y="36" width="64" height="28" fill="#EA580C" />
                {/* Pixel Sunset Sun */}
                <rect x="26" y="12" width="12" height="12" fill="#FDE047" />
                <rect x="28" y="10" width="8" height="16" fill="#FEF08A" />
                {/* Pixel Roof Silhouettes */}
                <polygon points="2,38 12,28 22,38" fill="#431407" />
                <polygon points="42,38 52,28 62,38" fill="#431407" />
                <rect x="6" y="38" width="12" height="26" fill="#431407" />
                <rect x="46" y="38" width="12" height="26" fill="#431407" />
                <rect x="10" y="42" width="4" height="6" fill="#FACC15" />
                <rect x="50" y="42" width="4" height="6" fill="#FACC15" />
                {/* Cobblestone ground */}
                <rect x="0" y="54" width="64" height="10" fill="#292524" />
                <rect x="8" y="56" width="4" height="2" fill="#44403C" />
                <rect x="24" y="58" width="4" height="2" fill="#44403C" />
                <rect x="48" y="56" width="4" height="2" fill="#44403C" />
              </g>
            ) : avatar.background === 'bg_ocean_bay' ? (
              <g id="bg-pixel-ocean">
                <rect x="0" y="0" width="64" height="20" fill="#0284C7" />
                <rect x="0" y="20" width="64" height="20" fill="#0369A1" />
                <rect x="0" y="40" width="64" height="24" fill="#075985" />
                {/* White pixel waves */}
                <rect x="4" y="34" width="10" height="2" fill="#E0F2FE" />
                <rect x="36" y="32" width="14" height="2" fill="#E0F2FE" />
                <rect x="18" y="42" width="12" height="2" fill="#BAE6FD" />
                <rect x="48" y="46" width="10" height="2" fill="#BAE6FD" />
                {/* Sandy beach */}
                <rect x="0" y="52" width="64" height="12" fill="#CA8A04" />
                <rect x="0" y="54" width="64" height="10" fill="#A16207" />
                <rect x="12" y="56" width="2" height="2" fill="#EAB308" />
                <rect x="42" y="58" width="2" height="2" fill="#EAB308" />
              </g>
            ) : avatar.background === 'bg_cyber_future' ? (
              <g id="bg-pixel-cyber">
                <rect x="0" y="0" width="64" height="64" fill="#0F172A" />
                {/* Neon buildings */}
                <rect x="4" y="16" width="12" height="48" fill="#1E1B4B" />
                <rect x="48" y="12" width="12" height="52" fill="#1E1B4B" />
                {/* Neon windows */}
                <rect x="6" y="20" width="2" height="4" fill="#06B6D4" />
                <rect x="12" y="28" width="2" height="4" fill="#EC4899" />
                <rect x="50" y="18" width="2" height="4" fill="#3B82F6" />
                <rect x="56" y="26" width="2" height="4" fill="#10B981" />
                {/* Cyber Grid Ground */}
                <rect x="0" y="52" width="64" height="12" fill="#020617" />
                <line x1="0" y1="56" x2="64" y2="56" stroke="#06B6D4" strokeWidth="1" opacity="0.6" />
                <line x1="0" y1="60" x2="64" y2="60" stroke="#06B6D4" strokeWidth="1" opacity="0.8" />
                <line x1="16" y1="52" x2="6" y2="64" stroke="#06B6D4" strokeWidth="1" opacity="0.5" />
                <line x1="48" y1="52" x2="58" y2="64" stroke="#06B6D4" strokeWidth="1" opacity="0.5" />
              </g>
            ) : avatar.background === 'bg_clean_paradise' ? (
              <g id="bg-pixel-clean-beach">
                <rect x="0" y="0" width="64" height="20" fill="#38BDF8" />
                <rect x="0" y="20" width="64" height="18" fill="#7DD3FC" />
                <rect x="0" y="38" width="64" height="12" fill="#06B6D4" />
                <rect x="0" y="50" width="64" height="14" fill="#FEF08A" />
                {/* Sun & Sea Sparkles */}
                <rect x="48" y="4" width="8" height="8" fill="#FACC15" />
                <rect x="10" y="42" width="4" height="1.5" fill="#FFFFFF" opacity="0.8" />
                <rect x="28" y="46" width="6" height="1.5" fill="#FFFFFF" opacity="0.8" />
                <rect x="44" y="40" width="5" height="1.5" fill="#FFFFFF" opacity="0.8" />
                {/* Palm Tree in Distance */}
                <rect x="4" y="26" width="3" height="14" fill="#78350F" />
                <polygon points="5,26 -2,22 4,24" fill="#15803D" />
                <polygon points="5,26 12,22 6,24" fill="#15803D" />
              </g>
            ) : avatar.background === 'bg_starry_sky' ? (
              <g id="bg-pixel-starry">
                <rect x="0" y="0" width="64" height="64" fill="#0B0F19" />
                {/* Stars */}
                <rect x="8" y="6" width="2" height="2" fill="#FFFFFF" />
                <rect x="30" y="10" width="2" height="2" fill="#FDE047" />
                <rect x="54" y="4" width="2" height="2" fill="#BAE6FD" />
                <rect x="14" y="22" width="1" height="1" fill="#FFFFFF" />
                <rect x="46" y="18" width="1" height="1" fill="#FFFFFF" />
                <rect x="2" y="38" width="2" height="2" fill="#C084FC" />
                <rect x="60" y="32" width="2" height="2" fill="#F472B6" />
                {/* Distant Pixel World Tree Silhouette */}
                <rect x="30" y="26" width="4" height="26" fill="#1E1B4B" />
                <rect x="22" y="18" width="20" height="12" fill="#312E81" opacity="0.7" />
                <rect x="26" y="14" width="12" height="8" fill="#4338CA" opacity="0.8" />
                {/* Glowing Ground */}
                <rect x="0" y="52" width="64" height="12" fill="#1E1B4B" />
                <rect x="0" y="52" width="64" height="2" fill="#818CF8" />
              </g>
            ) : (
              /* Default Park */
              <g id="bg-pixel-park">
                <rect x="0" y="0" width="64" height="22" fill="#7DD3FC" />
                <rect x="0" y="22" width="64" height="18" fill="#BAE6FD" />
                <rect x="0" y="40" width="64" height="24" fill="#86EFAC" />
                {/* Pixel Sun */}
                <rect x="50" y="4" width="8" height="8" fill="#FDE047" />
                {/* Pixel Clouds */}
                <rect x="6" y="6" width="12" height="4" fill="#FFFFFF" opacity="0.9" />
                <rect x="8" y="4" width="8" height="2" fill="#FFFFFF" opacity="0.9" />
                {/* Grass Hill & Flowers */}
                <rect x="0" y="48" width="64" height="16" fill="#22C55E" />
                <rect x="0" y="54" width="64" height="10" fill="#16A34A" />
                <rect x="8" y="50" width="2" height="2" fill="#F43F5E" />
                <rect x="18" y="52" width="2" height="2" fill="#FBBF24" />
                <rect x="46" y="50" width="2" height="2" fill="#EC4899" />
                <rect x="56" y="52" width="2" height="2" fill="#FFFFFF" />
              </g>
            )}
          </g>
        )}

        {/* ============================================================ */}
        {/* 2. LAYER: BACK (背中装備・羽・マント・リュック) */}
        {/* ============================================================ */}
        <g id="layer-pixel-back">
          {(avatar.back === 'back_angel_wings' || avatar.special === 'spec_angel_wings') && (
            <g id="pixel-wings">
              {/* Left Wing */}
              <rect x="4" y="24" width="14" height="18" fill="#FFFFFF" />
              <rect x="2" y="28" width="4" height="14" fill="#E2E8F0" />
              <rect x="6" y="22" width="10" height="4" fill="#FFFFFF" />
              <rect x="10" y="20" width="4" height="4" fill="#C7D2FE" />
              {/* Right Wing */}
              <rect x="46" y="24" width="14" height="18" fill="#FFFFFF" />
              <rect x="58" y="28" width="4" height="14" fill="#E2E8F0" />
              <rect x="48" y="22" width="10" height="4" fill="#FFFFFF" />
              <rect x="50" y="20" width="4" height="4" fill="#C7D2FE" />
            </g>
          )}

          {avatar.back === 'back_supporter_cape' && (
            <g id="pixel-cape">
              <rect x="16" y="38" width="32" height="18" fill="#059669" />
              <rect x="18" y="40" width="28" height="15" fill="#10B981" />
              <rect x="20" y="53" width="24" height="3" fill="#047857" />
            </g>
          )}

          {avatar.back === 'back_plasma_wings' && (
            <g id="pixel-plasma-wings" className="animate-pixel-float">
              {/* Left Plasma Wing */}
              <polygon points="12,24 -2,12 8,36" fill="#06B6D4" opacity="0.85" />
              <polygon points="10,26 2,16 8,32" fill="#67E8F9" />
              <line x1="8" y1="28" x2="0" y2="16" stroke="#FFFFFF" strokeWidth="1.5" />
              {/* Right Plasma Wing */}
              <polygon points="52,24 66,12 56,36" fill="#06B6D4" opacity="0.85" />
              <polygon points="54,26 62,16 56,32" fill="#67E8F9" />
              <line x1="56" y1="28" x2="64" y2="16" stroke="#FFFFFF" strokeWidth="1.5" />
            </g>
          )}

          {avatar.back === 'back_eco_knapsack' && (
            <g id="pixel-knapsack">
              <rect x="14" y="38" width="5" height="12" fill="#92400E" />
              <rect x="45" y="38" width="5" height="12" fill="#92400E" />
            </g>
          )}
        </g>

        {/* ============================================================ */}
        {/* 3. LAYER: HAIR BACK (後ろ髪・デフォルメ2頭身ボリューム) */}
        {/* ============================================================ */}
        <g id="layer-pixel-hair-back">
          {avatar.hairStyle === 'hair_wavy_long' && (
            <g id="pixel-hair-back-long">
              <rect x="8" y="10" width="48" height="34" fill={hairCol.shadow} />
              <rect x="6" y="16" width="10" height="28" fill={hairCol.base} />
              <rect x="48" y="16" width="10" height="28" fill={hairCol.base} />
            </g>
          )}
          {avatar.hairStyle === 'hair_ponytail' && (
            <g id="pixel-hair-back-ponytail">
              <rect x="46" y="6" width="12" height="18" fill={hairCol.base} />
              <rect x="48" y="18" width="10" height="14" fill={hairCol.shadow} />
              <rect x="44" y="8" width="4" height="4" fill="#F43F5E" />
            </g>
          )}
        </g>

        {/* ============================================================ */}
        {/* 4. LAYER: BODY (愛らしいデフォルメ2頭身・クラシックRPGプロポーション) */}
        {/* ============================================================ */}
        <g id="layer-pixel-body">
          {/* Ground shadow beneath chibi avatar */}
          <ellipse cx="32" cy="59.5" rx="15" ry="3" fill="#000000" opacity="0.35" />

          {/* ============================================================ */}
          {/* LOWER BODY: CHIBI LEGS & PANTS (均等で愛らしいデフォルメ脚部) */}
          {/* ============================================================ */}
          <g id="pixel-chibi-lower-body">
            {/* Pelvis / Pants Base (X: 22〜42, 幅20) */}
            <rect x="21" y="47" width="22" height="5" fill="#0F172A" />
            <rect x="22" y="47" width="20" height="4" fill="#1E293B" />
            <rect x="23" y="48" width="18" height="2" fill="#334155" />
            
            {/* Belt & Buckle */}
            <rect x="22" y="46.5" width="20" height="1.5" fill="#0F172A" />
            <rect x="30" y="46" width="4" height="2.5" fill="#E2E8F0" />
            <rect x="31" y="46.5" width="2" height="1.5" fill="#475569" />

            {/* Left Chibi Leg & Boot (X: 21〜29, 幅8) */}
            <g id="chibi-left-leg">
              <rect x="21" y="50" width="8" height="5" fill="#0F172A" />
              <rect x="22" y="50" width="6" height="4" fill="#334155" />
              {/* Left Cute Boot */}
              <rect x="20" y="54" width="9" height="5" fill="#0F172A" />
              <rect x="21" y="54" width="7" height="3.5" fill="#1E293B" />
              <rect x="20" y="57.5" width="9" height="1.5" fill="#F8FAFC" />
              <rect x="23" y="55" width="3" height="1" fill="#10B981" />
            </g>

            {/* Right Chibi Leg & Boot (X: 35〜43, 幅8) */}
            <g id="chibi-right-leg">
              <rect x="35" y="50" width="8" height="5" fill="#0F172A" />
              <rect x="36" y="50" width="6" height="4" fill="#334155" />
              {/* Right Cute Boot */}
              <rect x="35" y="54" width="9" height="5" fill="#0F172A" />
              <rect x="36" y="54" width="7" height="3.5" fill="#1E293B" />
              <rect x="35" y="57.5" width="9" height="1.5" fill="#F8FAFC" />
              <rect x="38" y="55" width="3" height="1" fill="#10B981" />
            </g>

            {/* Inverted-V Crotch Gap */}
            <polygon points="28,50 36,50 32,54" fill="#0F172A" />
          </g>

          {/* ============================================================ */}
          {/* CHIBI TORSO BASE (胴体: X: 22〜42, 幅20) */}
          {/* ============================================================ */}
          <rect x="21" y="37" width="22" height="11" fill="#0F172A" />
          <rect x="22" y="37" width="20" height="10" fill={skin.shadow} />
          <rect x="23" y="38" width="18" height="8" fill={skin.base} />

          {/* Chibi Neck */}
          <rect x="28" y="35" width="8" height="3" fill={skin.shadow} />

          {/* ============================================================ */}
          {/* DEFORMED 2-HEAD CHIBI HEAD (愛らしい大きなデフォルメ頭部) */}
          {/* ============================================================ */}
          {/* Outer Outline */}
          <rect x="11" y="5" width="42" height="33" fill="#24140D" />
          <rect x="9" y="9" width="46" height="25" fill="#24140D" />

          {/* Head Base Skin (丸みのあるふんわり輪郭) */}
          <rect x="13" y="7" width="38" height="29" fill={skin.shadow} />
          <rect x="14" y="8" width="36" height="27" fill={skin.base} />
          <rect x="17" y="8" width="30" height="6" fill={skin.highlight} />

          {/* Cute Chibi Ears */}
          <rect x="7" y="17" width="4" height="9" fill="#24140D" />
          <rect x="9" y="19" width="3" height="6" fill={skin.shadow} />
          <rect x="10" y="20" width="2" height="4" fill={skin.base} />

          <rect x="53" y="17" width="4" height="9" fill="#24140D" />
          <rect x="52" y="19" width="3" height="6" fill={skin.shadow} />
          <rect x="52" y="20" width="2" height="4" fill={skin.base} />

          {/* Cute Big Chibi Anime Eyes & Expression */}
          <g id="pixel-chibi-face">
            {/* Left Chibi Eye (大きなうるうる瞳・グラデーション＆輝くハイライト) */}
            <rect x="21" y="17" width="6" height="10" fill="#0F172A" />
            <rect x="21" y="17" width="6" height="6" fill="#0284C7" />
            <rect x="21" y="22" width="6" height="5" fill="#38BDF8" />
            {/* Left Eye Sparkle */}
            <rect x="21" y="17" width="3" height="4" fill="#FFFFFF" />
            <rect x="24" y="23" width="2.5" height="2.5" fill="#E0F2FE" />

            {/* Right Chibi Eye */}
            <rect x="37" y="17" width="6" height="10" fill="#0F172A" />
            <rect x="37" y="17" width="6" height="6" fill="#0284C7" />
            <rect x="37" y="22" width="6" height="5" fill="#38BDF8" />
            {/* Right Eye Sparkle */}
            <rect x="37" y="17" width="3" height="4" fill="#FFFFFF" />
            <rect x="40" y="23" width="2.5" height="2.5" fill="#E0F2FE" />

            {/* Cute Eyebrows */}
            <rect x="20" y="14" width="7" height="2" fill={hairCol.base} />
            <rect x="37" y="14" width="7" height="2" fill={hairCol.base} />

            {/* Rosy Blushing Cheeks (愛らしいふんわりピンクチーク) */}
            <rect x="15" y="25" width="5" height="3.5" fill="#FB7185" />
            <rect x="16" y="26" width="3" height="1.5" fill="#FDA4AF" />
            <rect x="44" y="25" width="5" height="3.5" fill="#FB7185" />
            <rect x="45" y="26" width="3" height="1.5" fill="#FDA4AF" />

            {/* Cute Smile */}
            <rect x="29" y="27" width="6" height="3" fill="#24140D" />
            <rect x="30" y="28" width="4" height="2" fill="#F43F5E" />
            <rect x="31" y="28" width="2" height="1" fill="#FFFFFF" />
          </g>

          {/* Chibi Arms (コンパクトで可愛い手足) */}
          <g id="pixel-chibi-arms">
            {/* Left Arm (X: 14〜21) */}
            <rect x="13" y="37" width="8" height="9" fill="#0F172A" />
            <rect x="14" y="38" width="6" height="7" fill={skin.shadow} />
            <rect x="14" y="42" width="6" height="3" fill={skin.base} />
            {/* Right Arm (X: 43〜50) */}
            <rect x="43" y="37" width="8" height="9" fill="#0F172A" />
            <rect x="44" y="38" width="6" height="7" fill={skin.shadow} />
            <rect x="44" y="42" width="6" height="3" fill={skin.base} />
          </g>
        </g>

        {/* ============================================================ */}
        {/* 5. LAYER: CLOTHES (デフォルメ2頭身フィット・服) */}
        {/* ============================================================ */}
        <g id="layer-pixel-clothes">
          {avatar.clothes === 'cloth_hoodie' ? (
            <g id="pixel-hoodie">
              {/* Hoodie Body */}
              <rect x="20" y="36" width="24" height="13" fill="#064E3B" />
              <rect x="21" y="37" width="22" height="11" fill="#059669" />
              {/* Front Pocket */}
              <rect x="25" y="41" width="14" height="5" fill="#047857" />
              {/* Sleeves */}
              <rect x="13" y="37" width="8" height="7" fill="#059669" />
              <rect x="43" y="37" width="8" height="7" fill="#059669" />
              {/* Strings */}
              <rect x="27" y="37" width="2" height="4" fill="#FFFFFF" />
              <rect x="35" y="37" width="2" height="4" fill="#FFFFFF" />
              <rect x="30" y="39" width="4" height="3" fill="#10B981" />
            </g>
          ) : avatar.clothes === 'cloth_jacket' ? (
            <g id="pixel-jacket">
              <rect x="20" y="36" width="24" height="13" fill="#1E3A8A" />
              <rect x="21" y="37" width="22" height="11" fill="#2563EB" />
              {/* White V-neck shirt */}
              <polygon points="28,37 36,37 32,42" fill="#FFFFFF" />
              {/* Sleeves */}
              <rect x="13" y="37" width="8" height="7" fill="#2563EB" />
              <rect x="43" y="37" width="8" height="7" fill="#2563EB" />
              {/* Pockets */}
              <rect x="23" y="42" width="4" height="3" fill="#1D4ED8" />
              <rect x="37" y="42" width="4" height="3" fill="#1D4ED8" />
            </g>
          ) : avatar.clothes === 'cloth_volunteer_vest' ? (
            <g id="pixel-vest">
              <rect x="20" y="36" width="24" height="13" fill="#4A044E" />
              <rect x="21" y="37" width="22" height="11" fill="#7E22CE" />
              {/* Neon Yellow Stripe */}
              <rect x="21" y="41" width="22" height="3" fill="#FACC15" />
              {/* White Sleeves */}
              <rect x="13" y="37" width="8" height="6" fill="#FFFFFF" />
              <rect x="43" y="37" width="8" height="6" fill="#FFFFFF" />
            </g>
          ) : avatar.clothes === 'cloth_uniform' ? (
            <g id="pixel-uniform">
              <rect x="20" y="36" width="24" height="13" fill="#0F172A" />
              <rect x="21" y="37" width="22" height="11" fill="#1E293B" />
              {/* White collar & Tie */}
              <polygon points="27,37 37,37 32,42" fill="#FFFFFF" />
              <rect x="31" y="39" width="2" height="6" fill="#E11D48" />
              {/* Sleeves */}
              <rect x="13" y="37" width="8" height="7" fill="#1E293B" />
              <rect x="43" y="37" width="8" height="7" fill="#1E293B" />
            </g>
          ) : avatar.clothes === 'cloth_gaia_robe' ? (
            <g id="pixel-gaia-robe">
              <rect x="18" y="36" width="28" height="14" fill="#064E3B" />
              <rect x="20" y="37" width="24" height="13" fill="#047857" />
              {/* Gold trim */}
              <rect x="23" y="37" width="18" height="2" fill="#FBBF24" />
              <rect x="31" y="39" width="2" height="10" fill="#10B981" />
              <rect x="23" y="47" width="18" height="2" fill="#FBBF24" />
              {/* Sleeves */}
              <rect x="12" y="37" width="9" height="10" fill="#047857" />
              <rect x="43" y="37" width="9" height="10" fill="#047857" />
            </g>
          ) : avatar.clothes === 'cloth_cyber_suit' ? (
            <g id="pixel-cyber-suit">
              <rect x="20" y="36" width="24" height="13" fill="#020617" />
              <rect x="21" y="37" width="22" height="11" fill="#0F172A" />
              {/* Neon circuits */}
              <rect x="24" y="39" width="4" height="2" fill="#06B6D4" />
              <rect x="27" y="39" width="2" height="6" fill="#06B6D4" />
              <rect x="36" y="39" width="4" height="2" fill="#06B6D4" />
              <rect x="35" y="39" width="2" height="6" fill="#06B6D4" />
              <rect x="30" y="41" width="4" height="4" fill="#38BDF8" />
              {/* Sleeves */}
              <rect x="13" y="37" width="8" height="7" fill="#0F172A" />
              <rect x="43" y="37" width="8" height="7" fill="#0F172A" />
            </g>
          ) : avatar.clothes === 'cloth_clean_ranger' ? (
            <g id="pixel-clean-ranger">
              <rect x="18" y="36" width="28" height="14" fill="#047857" />
              <rect x="20" y="37" width="24" height="13" fill="#10B981" />
              {/* Tactical White/Orange Chest Straps */}
              <rect x="20" y="41" width="24" height="2" fill="#FFFFFF" />
              <rect x="30" y="37" width="4" height="13" fill="#F97316" />
              <rect x="31" y="41" width="2" height="2" fill="#FFFFFF" />
              {/* Arm Guards */}
              <rect x="13" y="37" width="8" height="8" fill="#047857" />
              <rect x="13" y="41" width="8" height="2" fill="#F97316" />
              <rect x="43" y="37" width="8" height="8" fill="#047857" />
              <rect x="43" y="41" width="8" height="2" fill="#F97316" />
            </g>
          ) : avatar.clothes === 'cloth_world_champion' ? (
            <g id="pixel-world-cloak">
              <rect x="17" y="36" width="30" height="15" fill="#083344" />
              <rect x="19" y="37" width="26" height="13" fill="#0E7490" />
              <rect x="28" y="37" width="8" height="11" fill="#FBBF24" />
              <rect x="21" y="37" width="4" height="11" fill="#10B981" />
              <rect x="39" y="37" width="4" height="11" fill="#10B981" />
              {/* World Crest */}
              <rect x="30" y="41" width="4" height="4" fill="#FFFFFF" />
            </g>
          ) : (
            /* Default T-Shirt */
            <g id="pixel-tshirt">
              <rect x="20" y="36" width="24" height="13" fill="#1D4ED8" />
              <rect x="21" y="37" width="22" height="11" fill="#3B82F6" />
              {/* Short Sleeves */}
              <rect x="13" y="37" width="8" height="6" fill="#3B82F6" />
              <rect x="43" y="37" width="8" height="6" fill="#3B82F6" />
              {/* Sprout Logo on Chest */}
              <rect x="30" y="40" width="4" height="3" fill="#22C55E" />
              <rect x="31" y="38" width="2" height="2" fill="#4ADE80" />
            </g>
          )}
        </g>

        {/* ============================================================ */}
        {/* 6. LAYER: HAIR FRONT (デフォルメ2頭身ヘアスタイル) */}
        {/* ============================================================ */}
        <g id="layer-pixel-hair-front">
          {avatar.hairStyle === 'hair_medium' ? (
            <g id="pixel-hair-bob">
              {/* Top Hair Dome */}
              <rect x="11" y="3" width="42" height="14" fill={hairCol.shadow} />
              <rect x="13" y="5" width="38" height="11" fill={hairCol.base} />
              <rect x="17" y="5" width="30" height="3" fill={hairCol.highlight} />
              {/* Bob Sides */}
              <rect x="8" y="9" width="8" height="20" fill={hairCol.shadow} />
              <rect x="10" y="9" width="6" height="18" fill={hairCol.base} />
              <rect x="48" y="9" width="8" height="20" fill={hairCol.shadow} />
              <rect x="48" y="9" width="6" height="18" fill={hairCol.base} />
              {/* Bangs */}
              <polygon points="16,15 22,21 27,15 33,22 38,15 44,20 48,15" fill={hairCol.base} />
              <rect x="18" y="13" width="28" height="3" fill={hairCol.base} />
            </g>
          ) : avatar.hairStyle === 'hair_spiky' ? (
            <g id="pixel-hair-spiky">
              {/* Spiky Crown */}
              <polygon points="13,6 18,0 23,6 32,-2 41,6 46,0 51,6" fill={hairCol.shadow} />
              <polygon points="14,7 18,2 22,7 32,0 40,7 46,2 50,7" fill={hairCol.base} />
              <rect x="11" y="5" width="42" height="12" fill={hairCol.base} />
              <rect x="18" y="5" width="28" height="3" fill={hairCol.highlight} />
              {/* Side Spikes */}
              <rect x="7" y="9" width="9" height="18" fill={hairCol.shadow} />
              <rect x="9" y="9" width="7" height="16" fill={hairCol.base} />
              <rect x="48" y="9" width="9" height="18" fill={hairCol.shadow} />
              <rect x="48" y="9" width="7" height="16" fill={hairCol.base} />
              {/* Bangs */}
              <polygon points="16,15 22,22 27,15 32,23 37,15 43,22 48,15" fill={hairCol.base} />
            </g>
          ) : avatar.hairStyle === 'hair_cyber_braids' ? (
            <g id="pixel-hair-braids">
              <rect x="11" y="3" width="42" height="14" fill={hairCol.shadow} />
              <rect x="13" y="5" width="38" height="11" fill={hairCol.base} />
              {/* Left Braid */}
              <rect x="9" y="9" width="7" height="7" fill={hairCol.base} />
              <rect x="7" y="16" width="7" height="5" fill="#06B6D4" />
              <rect x="9" y="21" width="7" height="7" fill={hairCol.base} />
              <rect x="7" y="28" width="7" height="5" fill="#06B6D4" />
              <rect x="9" y="33" width="5" height="6" fill={hairCol.base} />
              {/* Right Braid */}
              <rect x="48" y="9" width="7" height="7" fill={hairCol.base} />
              <rect x="50" y="16" width="7" height="5" fill="#06B6D4" />
              <rect x="48" y="21" width="7" height="7" fill={hairCol.base} />
              <rect x="50" y="28" width="7" height="5" fill="#06B6D4" />
              <rect x="50" y="33" width="5" height="6" fill={hairCol.base} />
              {/* Bangs */}
              <rect x="16" y="13" width="32" height="4" fill={hairCol.base} />
            </g>
          ) : avatar.hairStyle === 'hair_wavy_long' ? (
            <g id="pixel-hair-long-front">
              <rect x="11" y="3" width="42" height="14" fill={hairCol.shadow} />
              <rect x="13" y="5" width="38" height="11" fill={hairCol.base} />
              <rect x="17" y="5" width="30" height="3" fill={hairCol.highlight} />
              {/* Side Tresses */}
              <rect x="7" y="9" width="9" height="26" fill={hairCol.shadow} />
              <rect x="9" y="9" width="7" height="24" fill={hairCol.base} />
              <rect x="48" y="9" width="9" height="26" fill={hairCol.shadow} />
              <rect x="48" y="9" width="7" height="24" fill={hairCol.base} />
              {/* Bangs */}
              <rect x="16" y="13" width="32" height="5" fill={hairCol.base} />
            </g>
          ) : (
            /* Default Short Hair (Cute, fluffy & voluminous chibi hair) */
            <g id="pixel-hair-short">
              {/* Top Hair Base & Highlights */}
              <rect x="11" y="3" width="42" height="14" fill={hairCol.shadow} />
              <rect x="13" y="5" width="38" height="11" fill={hairCol.base} />
              <rect x="19" y="5" width="26" height="3" fill={hairCol.highlight} />
              {/* Side Tufts */}
              <rect x="8" y="9" width="8" height="16" fill={hairCol.shadow} />
              <rect x="10" y="9" width="6" height="14" fill={hairCol.base} />
              <rect x="6" y="15" width="5" height="5" fill={hairCol.base} />

              <rect x="48" y="9" width="8" height="16" fill={hairCol.shadow} />
              <rect x="48" y="9" width="6" height="14" fill={hairCol.base} />
              <rect x="53" y="15" width="5" height="5" fill={hairCol.base} />

              {/* Bangs */}
              <polygon points="16,15 21,21 26,15 32,22 37,15 43,21 48,15" fill={hairCol.base} />
              <rect x="18" y="13" width="28" height="3" fill={hairCol.base} />
              <rect x="22" y="14" width="4" height="2" fill={hairCol.highlight} />
              <rect x="38" y="14" width="4" height="2" fill={hairCol.highlight} />
            </g>
          )}
        </g>

        {/* ============================================================ */}
        {/* 7. LAYER: HAT (デフォルメ2頭身・帽子・頭装備) */}
        {/* ============================================================ */}
        <g id="layer-pixel-hat">
          {avatar.hat === 'hat_eco_cap' && (
            <g id="pixel-hat-cap">
              <rect x="11" y="1" width="42" height="11" fill="#15803D" />
              <rect x="15" y="-1" width="34" height="4" fill="#16A34A" />
              {/* Visor */}
              <rect x="7" y="10" width="50" height="4.5" fill="#14532D" />
              <rect x="30" y="3" width="4" height="4" fill="#FACC15" />
            </g>
          )}

          {(avatar.hat === 'hat_sprout_hairpin' || avatar.accessory === 'acc_plant_sprout') && (
            <g id="pixel-hat-sprout">
              {/* Sprout stalk */}
              <rect x="31" y="-3" width="2" height="9" fill="#15803D" />
              {/* Left leaf */}
              <rect x="22" y="-3" width="9" height="4" fill="#22C55E" />
              <rect x="24" y="-4.5" width="5" height="2" fill="#4ADE80" />
              {/* Right leaf */}
              <rect x="33" y="-4.5" width="9" height="4" fill="#4ADE80" />
              <rect x="33" y="0" width="7" height="2" fill="#22C55E" />
            </g>
          )}

          {avatar.hat === 'hat_explorer_helm' && (
            <g id="pixel-hat-safari">
              <rect x="11" y="-1" width="42" height="13" fill="#D97706" />
              <rect x="15" y="-3" width="34" height="4" fill="#F59E0B" />
              {/* Wide Brim */}
              <rect x="5" y="10" width="54" height="4.5" fill="#B45309" />
              <rect x="12" y="8" width="40" height="2" fill="#78350F" />
            </g>
          )}

          {avatar.hat === 'hat_graduate_cap' && (
            <g id="pixel-hat-graduate">
              <polygon points="5,4 32,-3 59,4 32,9" fill="#1E293B" />
              <rect x="8" y="3" width="48" height="4" fill="#0F172A" />
              <rect x="20" y="5" width="24" height="7" fill="#0F172A" />
              {/* Gold Tassel */}
              <rect x="49" y="3" width="2" height="10" fill="#FBBF24" />
              <rect x="49" y="13" width="4" height="4" fill="#F59E0B" />
            </g>
          )}

          {(avatar.hat === 'hat_flower_crown' || avatar.accessory === 'acc_flower_crown') && (
            <g id="pixel-hat-crown">
              <rect x="11" y="5" width="42" height="4.5" fill="#15803D" />
              <rect x="13" y="3" width="5" height="4.5" fill="#F43F5E" />
              <rect x="22" y="2" width="5" height="4.5" fill="#FDE047" />
              <rect x="31" y="2" width="5" height="4.5" fill="#EC4899" />
              <rect x="40" y="2" width="5" height="4.5" fill="#38BDF8" />
              <rect x="47" y="3" width="5" height="4.5" fill="#F43F5E" />
            </g>
          )}

          {avatar.hat === 'hat_golden_halo' && (
            <g id="pixel-hat-halo" className="animate-pulse">
              <rect x="16" y="-3" width="32" height="4" fill="#FBBF24" />
              <rect x="18" y="-1.5" width="28" height="2" fill="#FEF08A" />
            </g>
          )}

          {avatar.hat === 'hat_purifier_crown' && (
            <g id="pixel-hat-purifier-crown">
              {/* Crown Base */}
              <polygon points="12,6 18,1 24,6 32,-1 40,6 46,1 52,6 50,11 14,11" fill="#059669" />
              <rect x="14" y="9" width="36" height="3" fill="#10B981" />
              {/* Emerald Gems */}
              <rect x="22" y="8" width="3" height="3" fill="#34D399" />
              <rect x="31" y="5" width="3" height="4" fill="#6EE7B7" />
              <rect x="39" y="8" width="3" height="3" fill="#34D399" />
              {/* Purifier Waterdrop Halo */}
              <rect x="31" y="-4" width="2" height="3" fill="#38BDF8" className="animate-bounce-gentle" />
            </g>
          )}
        </g>

        {/* ============================================================ */}
        {/* 8. LAYER: ACCESSORY (デフォルメ2頭身・アクセサリー・眼鏡) */}
        {/* ============================================================ */}
        <g id="layer-pixel-accessory">
          {avatar.accessory === 'acc_glasses' && (
            <g id="pixel-glasses">
              {/* Left Lens Frame */}
              <rect x="19" y="16" width="10" height="11" fill="none" stroke="#78350F" strokeWidth="1.5" />
              <rect x="20" y="17" width="8" height="9" fill="#FFFFFF" opacity="0.35" />
              {/* Right Lens Frame */}
              <rect x="35" y="16" width="10" height="11" fill="none" stroke="#78350F" strokeWidth="1.5" />
              <rect x="36" y="17" width="8" height="9" fill="#FFFFFF" opacity="0.35" />
              {/* Bridge */}
              <rect x="28" y="19" width="8" height="1.5" fill="#78350F" />
            </g>
          )}

          {avatar.accessory === 'acc_star_necklace' && (
            <g id="pixel-necklace">
              <rect x="25" y="37" width="14" height="2" fill="#F59E0B" />
              <rect x="30" y="39" width="4" height="4" fill="#FBBF24" />
              <rect x="31" y="40" width="2" height="2" fill="#FFFFFF" />
            </g>
          )}

          {avatar.accessory === 'acc_earth_badge' && (
            <g id="pixel-earth-badge">
              <rect x="36" y="38" width="5" height="5" fill="#0284C7" />
              <rect x="37" y="39" width="2" height="2" fill="#22C55E" />
              <rect x="39" y="41" width="2" height="2" fill="#22C55E" />
            </g>
          )}

          {avatar.accessory === 'acc_eco_bag' && (
            <g id="pixel-eco-bag">
              <rect x="44" y="38" width="2" height="9" fill="#D97706" />
              <rect x="42" y="45" width="11" height="10" fill="#FEF3C7" />
              <rect x="44" y="47" width="7" height="6" fill="#FDE68A" />
              <rect x="46" y="49" width="3" height="3" fill="#22C55E" />
            </g>
          )}

          {avatar.accessory === 'acc_volunteer_whistle' && (
            <g id="pixel-whistle">
              <rect x="25" y="38" width="4" height="5" fill="#EA580C" />
            </g>
          )}
        </g>

        {/* ============================================================ */}
        {/* 9. LAYER: PET (ペット・お供) */}
        {/* ============================================================ */}
        <g id="layer-pixel-pet">
          {avatar.pet === 'pet_sprout_spirit' && (
            <g id="pixel-pet-spirit" transform="translate(44, 40)" className="animate-pixel-float">
              <rect x="2" y="4" width="10" height="10" fill="#4ADE80" />
              <rect x="4" y="2" width="6" height="4" fill="#22C55E" />
              {/* Little Sprout on Pet Head */}
              <rect x="6" y="0" width="2" height="4" fill="#16A34A" />
              <rect x="4" y="0" width="2" height="2" fill="#86EFAC" />
              {/* Pet Face */}
              <rect x="4" y="7" width="2" height="2" fill="#064E3B" />
              <rect x="8" y="7" width="2" height="2" fill="#064E3B" />
              <rect x="3" y="10" width="2" height="1" fill="#F43F5E" />
              <rect x="9" y="10" width="2" height="1" fill="#F43F5E" />
            </g>
          )}

          {avatar.pet === 'pet_calico_cat' && (
            <g id="pixel-pet-cat" transform="translate(44, 44)">
              <rect x="2" y="4" width="12" height="10" fill="#F8FAFC" />
              {/* Ears */}
              <rect x="2" y="1" width="3" height="4" fill="#F97316" />
              <rect x="11" y="1" width="3" height="4" fill="#334155" />
              {/* Calico Patch */}
              <rect x="2" y="5" width="4" height="4" fill="#F97316" />
              {/* Eyes */}
              <rect x="5" y="7" width="2" height="2" fill="#0F172A" />
              <rect x="9" y="7" width="2" height="2" fill="#0F172A" />
              {/* Pink Nose */}
              <rect x="7" y="9" width="2" height="1" fill="#F43F5E" />
              {/* Tail */}
              <rect x="14" y="6" width="2" height="6" fill="#F97316" />
            </g>
          )}

          {avatar.pet === 'pet_shiba_dog' && (
            <g id="pixel-pet-dog" transform="translate(6, 44)">
              <rect x="2" y="4" width="12" height="10" fill="#D97706" />
              <rect x="4" y="6" width="8" height="8" fill="#FEF3C7" />
              {/* Triangular Ears */}
              <rect x="2" y="1" width="3" height="4" fill="#B45309" />
              <rect x="11" y="1" width="3" height="4" fill="#B45309" />
              {/* Face */}
              <rect x="4" y="7" width="2" height="2" fill="#1E293B" />
              <rect x="10" y="7" width="2" height="2" fill="#1E293B" />
              <rect x="7" y="8" width="2" height="2" fill="#0F172A" />
              {/* Tail */}
              <rect x="0" y="4" width="2" height="4" fill="#D97706" />
            </g>
          )}

          {avatar.pet === 'pet_white_bunny' && (
            <g id="pixel-pet-bunny" transform="translate(8, 42)">
              <rect x="2" y="6" width="10" height="10" fill="#FFFFFF" />
              {/* Long Ears */}
              <rect x="3" y="0" width="3" height="7" fill="#FFFFFF" />
              <rect x="4" y="1" width="1" height="5" fill="#FCE7F3" />
              <rect x="8" y="0" width="3" height="7" fill="#FFFFFF" />
              <rect x="9" y="1" width="1" height="5" fill="#FCE7F3" />
              {/* Face */}
              <rect x="4" y="9" width="2" height="2" fill="#BE185D" />
              <rect x="8" y="9" width="2" height="2" fill="#BE185D" />
              <rect x="6" y="11" width="2" height="1" fill="#FB7185" />
            </g>
          )}

          {avatar.pet === 'pet_forest_owl' && (
            <g id="pixel-pet-owl" transform="translate(46, 40)">
              <rect x="2" y="2" width="10" height="12" fill="#78350F" />
              <rect x="4" y="4" width="6" height="8" fill="#FEF3C7" />
              {/* Big Eyes */}
              <rect x="3" y="4" width="3" height="3" fill="#FEF08A" />
              <rect x="4" y="5" width="1" height="1" fill="#0F172A" />
              <rect x="8" y="4" width="3" height="3" fill="#FEF08A" />
              <rect x="9" y="5" width="1" height="1" fill="#0F172A" />
              {/* Beak */}
              <rect x="6" y="7" width="2" height="2" fill="#F59E0B" />
            </g>
          )}

          {avatar.pet === 'pet_world_dragon' && (
            <g id="pixel-pet-dragon" transform="translate(44, 38)" className="animate-pixel-float">
              <rect x="2" y="4" width="12" height="12" fill="#065F46" />
              <rect x="4" y="6" width="8" height="8" fill="#34D399" />
              {/* Horns */}
              <rect x="2" y="1" width="2" height="4" fill="#FBBF24" />
              <rect x="12" y="1" width="2" height="4" fill="#FBBF24" />
              {/* Eyes */}
              <rect x="4" y="7" width="2" height="2" fill="#FDE047" />
              <rect x="10" y="7" width="2" height="2" fill="#FDE047" />
              {/* Blue Flame */}
              <rect x="6" y="14" width="4" height="3" fill="#38BDF8" />
            </g>
          )}

          {avatar.pet === 'pet_pure_slime' && (
            <g id="pixel-pet-pure-slime" transform="translate(44, 42)" className="animate-bounce-gentle">
              <ellipse cx="7" cy="8" rx="6" ry="5" fill="#38BDF8" />
              <ellipse cx="7" cy="7" rx="5" ry="4" fill="#7DD3FC" />
              {/* Cute Waterdrop Sprout */}
              <rect x="6" y="1" width="2" height="3" fill="#0284C7" />
              {/* Slime Face */}
              <rect x="4" y="6" width="2" height="2" fill="#0369A1" />
              <rect x="8" y="6" width="2" height="2" fill="#0369A1" />
              <rect x="6" y="8" width="2" height="1" fill="#F43F5E" />
              {/* Sparkle */}
              <rect x="3" y="4" width="1.5" height="1.5" fill="#FFFFFF" />
            </g>
          )}
        </g>

        {/* ============================================================ */}
        {/* 10. LAYER: SPECIAL EFFECT (特殊ドットエフェクト) */}
        {/* ============================================================ */}
        <g id="layer-pixel-effect">
          {avatar.special === 'spec_purify_rays' && (
            <g id="pixel-effect-purify-rays" className="animate-pulse">
              <polygon points="20,0 44,0 52,64 12,64" fill="url(#purifyRayGrad)" opacity="0.35" />
              <defs>
                <linearGradient id="purifyRayGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#67E8F9" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#34D399" stopOpacity="0.1" />
                </linearGradient>
              </defs>
              <rect x="22" y="8" width="2" height="2" fill="#FFFFFF" className="animate-sparkle" />
              <rect x="40" y="14" width="2" height="2" fill="#FEF08A" className="animate-sparkle" />
              <rect x="18" y="32" width="2" height="2" fill="#67E8F9" className="animate-sparkle" />
              <rect x="44" y="40" width="2" height="2" fill="#34D399" className="animate-sparkle" />
            </g>
          )}

          {avatar.special === 'spec_leaf_swirl' && (
            <g id="pixel-effect-leaves">
              <rect x="10" y="38" width="3" height="3" fill="#10B981" className="animate-sparkle" />
              <rect x="50" y="34" width="3" height="3" fill="#34D399" className="animate-sparkle" />
              <rect x="8" y="24" width="3" height="3" fill="#059669" className="animate-sparkle" />
              <rect x="52" y="20" width="3" height="3" fill="#6EE7B7" className="animate-sparkle" />
            </g>
          )}

          {avatar.special === 'spec_heart_sparkle' && (
            <g id="pixel-effect-hearts">
              {/* Left Heart */}
              <rect x="8" y="20" width="5" height="4" fill="#F43F5E" className="animate-sparkle" />
              <rect x="9" y="24" width="3" height="2" fill="#F43F5E" className="animate-sparkle" />
              {/* Right Heart */}
              <rect x="50" y="18" width="5" height="4" fill="#FB7185" className="animate-sparkle" />
              <rect x="51" y="22" width="3" height="2" fill="#FB7185" className="animate-sparkle" />
            </g>
          )}

          {avatar.special === 'spec_knowledge_spark' && (
            <g id="pixel-effect-sparks" className="animate-pixel-glow">
              <rect x="10" y="12" width="2" height="6" fill="#38BDF8" />
              <rect x="8" y="14" width="6" height="2" fill="#38BDF8" />
              <rect x="52" y="10" width="2" height="6" fill="#67E8F9" />
              <rect x="50" y="12" width="6" height="2" fill="#67E8F9" />
            </g>
          )}

          {avatar.special === 'spec_glowing_aura' && (
            <g id="pixel-effect-aura" className="animate-pulse" opacity="0.75">
              <rect x="14" y="6" width="36" height="52" fill="none" stroke="#FBBF24" strokeWidth="2" strokeDasharray="4 4" />
              <rect x="18" y="2" width="2" height="2" fill="#FEF08A" />
              <rect x="44" y="2" width="2" height="2" fill="#FEF08A" />
              <rect x="6" y="28" width="2" height="2" fill="#FEF08A" />
              <rect x="56" y="28" width="2" height="2" fill="#FEF08A" />
            </g>
          )}

          {avatar.special === 'spec_cosmic_stardust' && (
            <g id="pixel-effect-cosmic">
              <rect x="6" y="8" width="2" height="2" fill="#C084FC" className="animate-sparkle" />
              <rect x="54" y="12" width="2" height="2" fill="#818CF8" className="animate-sparkle" />
              <rect x="12" y="44" width="2" height="2" fill="#38BDF8" className="animate-sparkle" />
              <rect x="50" y="48" width="2" height="2" fill="#F472B6" className="animate-sparkle" />
            </g>
          )}
        </g>

        {/* ============================================================ */}
        {/* 11. LAYER: WEAPONS & HELD GEAR (武器・道具・盾) */}
        {/* ============================================================ */}
        <g id="layer-pixel-weapon">
          {avatar.weapon === 'wpn_tongs_blade' && (
            <g id="pixel-tongs-blade" transform="translate(46, 30)">
              {/* Grip */}
              <rect x="4" y="14" width="3" height="6" fill="#1E293B" />
              {/* Tongs metallic arms */}
              <rect x="3" y="2" width="2" height="13" fill="#94A3B8" />
              <rect x="7" y="2" width="2" height="13" fill="#CBD5E1" />
              {/* Tongs tips */}
              <polygon points="3,2 1,5 3,5" fill="#64748B" />
              <polygon points="9,2 11,5 9,5" fill="#64748B" />
              {/* Green energy glow */}
              <rect x="4" y="6" width="4" height="2" fill="#22C55E" />
            </g>
          )}

          {avatar.weapon === 'wpn_gaia_staff' && (
            <g id="pixel-gaia-staff" transform="translate(46, 22)" className="animate-pixel-float">
              {/* Staff Shaft */}
              <rect x="4" y="6" width="3" height="26" fill="#78350F" />
              <rect x="5" y="6" width="1" height="26" fill="#B45309" />
              {/* Staff Head World Tree Crystal */}
              <polygon points="5,-2 0,5 5,12 10,5" fill="#10B981" />
              <polygon points="5,0 2,5 5,10 8,5" fill="#6EE7B7" />
              <circle cx="5.5" cy="5" r="1.5" fill="#FFFFFF" className="animate-sparkle" />
              {/* Vine Sprout */}
              <rect x="2" y="12" width="2" height="3" fill="#22C55E" />
              <rect x="7" y="16" width="2" height="3" fill="#22C55E" />
            </g>
          )}

          {avatar.weapon === 'wpn_eco_shield' && (
            <g id="pixel-eco-shield" transform="translate(8, 34)">
              {/* Shield Plate */}
              <polygon points="6,2 16,2 18,10 11,20 4,10" fill="#0284C7" opacity="0.8" />
              <polygon points="7,4 15,4 16,10 11,18 6,10" fill="#38BDF8" opacity="0.9" />
              <circle cx="11" cy="9" r="3" fill="#FFFFFF" opacity="0.8" />
              {/* Recycle Arrow on Shield */}
              <polygon points="11,7 13,10 9,10" fill="#0284C7" />
            </g>
          )}

          {avatar.weapon === 'wpn_recycle_saber' && (
            <g id="pixel-recycle-saber" transform="translate(46, 20)">
              {/* Hilt */}
              <rect x="4" y="20" width="4" height="6" fill="#0F172A" />
              <rect x="3" y="19" width="6" height="2" fill="#F59E0B" />
              {/* Glowing Laser Blade */}
              <rect x="4.5" y="0" width="3" height="19" fill="#06B6D4" className="animate-pulse" />
              <rect x="5" y="0" width="2" height="19" fill="#FFFFFF" />
              <polygon points="6,-3 4.5,0 7.5,0" fill="#FFFFFF" />
              {/* Aura Particles */}
              <circle cx="3" cy="6" r="1" fill="#67E8F9" className="animate-sparkle" />
              <circle cx="9" cy="12" r="1" fill="#67E8F9" className="animate-sparkle" />
            </g>
          )}
        </g>
      </svg>
    </div>
  );
};
