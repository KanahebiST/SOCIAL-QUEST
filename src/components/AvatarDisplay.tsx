import React from 'react';
import { AvatarConfig } from '../types';

interface AvatarDisplayProps {
  avatar: AvatarConfig;
  size?: 'sm' | 'md' | 'lg' | 'xl' | number;
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
  // Dimensions mapping (increased avatar pixel presence and scale)
  const sizeMap: Record<string, string> = {
    sm: 'w-18 h-18 sm:w-22 sm:h-22',
    md: 'w-32 h-32 sm:w-38 sm:h-38',
    lg: 'w-56 h-56 sm:w-68 sm:h-68',
    xl: 'w-72 h-72 sm:w-92 sm:h-92',
  };

  const customStyle = typeof size === 'number' ? { width: `${size}px`, height: `${size}px` } : undefined;
  const sizeClass = typeof size === 'string' ? sizeMap[size] || sizeMap.lg : '';

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
      className={`relative rounded-2xl overflow-hidden pixel-box bg-slate-950 flex items-center justify-center select-none ${sizeClass} ${className} ${
        isFloating ? 'animate-pixel-float' : ''
      }`}
      style={customStyle}
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
        {/* 2. LAYER: BACK (背中装備・羽・マント・リュック - 高密度ピクセルアート) */}
        {/* ============================================================ */}
        <g id="layer-pixel-back">
          {(avatar.back === 'back_angel_wings' || avatar.special === 'spec_angel_wings') && (
            <g id="pixel-wings">
              {/* Left Feathered Wing - High-Density Feathers */}
              {/* Outer feather tips */}
              <rect x="2" y="27" width="2" height="13" fill="#CBD5E1" />
              <rect x="3" y="24" width="2" height="18" fill="#E2E8F0" />
              <rect x="4" y="20" width="3" height="22" fill="#F8FAFC" />
              <rect x="7" y="18" width="3" height="20" fill="#FFFFFF" />
              <rect x="10" y="17" width="3" height="18" fill="#FFFFFF" />
              <rect x="13" y="19" width="3" height="14" fill="#F1F5F9" />
              {/* Wing joints & inner shadow feathering */}
              <rect x="5" y="26" width="1" height="8" fill="#94A3B8" />
              <rect x="8" y="24" width="1" height="9" fill="#CBD5E1" />
              <rect x="11" y="23" width="1" height="7" fill="#E2E8F0" />
              <rect x="6" y="18" width="4" height="2" fill="#FFFFFF" />
              <rect x="10" y="16" width="3" height="2" fill="#C7D2FE" />
              <rect x="7" y="16.5" width="2" height="1" fill="#EEF2FF" />

              {/* Right Feathered Wing - High-Density Feathers */}
              <rect x="60" y="27" width="2" height="13" fill="#CBD5E1" />
              <rect x="59" y="24" width="2" height="18" fill="#E2E8F0" />
              <rect x="57" y="20" width="3" height="22" fill="#F8FAFC" />
              <rect x="54" y="18" width="3" height="20" fill="#FFFFFF" />
              <rect x="51" y="17" width="3" height="18" fill="#FFFFFF" />
              <rect x="48" y="19" width="3" height="14" fill="#F1F5F9" />
              {/* Right Wing joints & feather shadows */}
              <rect x="58" y="26" width="1" height="8" fill="#94A3B8" />
              <rect x="55" y="24" width="1" height="9" fill="#CBD5E1" />
              <rect x="52" y="23" width="1" height="7" fill="#E2E8F0" />
              <rect x="54" y="18" width="4" height="2" fill="#FFFFFF" />
              <rect x="51" y="16" width="3" height="2" fill="#C7D2FE" />
              <rect x="55" y="16.5" width="2" height="1" fill="#EEF2FF" />
            </g>
          )}

          {avatar.back === 'back_supporter_cape' && (
            <g id="pixel-cape">
              {/* Outer mantle border */}
              <rect x="15" y="37" width="34" height="19" fill="#064E3B" />
              {/* Cape Base Body */}
              <rect x="16.5" y="38" width="31" height="17" fill="#059669" />
              {/* High-density folds and drape gradients */}
              <rect x="18" y="39" width="4" height="15" fill="#10B981" />
              <rect x="23" y="39" width="2" height="15" fill="#047857" />
              <rect x="26" y="39" width="5" height="15" fill="#10B981" />
              <rect x="32" y="39" width="2" height="15" fill="#047857" />
              <rect x="35" y="39" width="4" height="15" fill="#10B981" />
              <rect x="40" y="39" width="2" height="15" fill="#047857" />
              <rect x="43" y="39" width="3" height="15" fill="#10B981" />
              {/* Golden Hem Trim */}
              <rect x="17" y="53.5" width="30" height="2" fill="#F59E0B" />
              <rect x="18" y="54" width="28" height="1" fill="#FDE047" />
              <rect x="22" y="53" width="1" height="2" fill="#B45309" />
              <rect x="32" y="53" width="1" height="2" fill="#B45309" />
              <rect x="42" y="53" width="1" height="2" fill="#B45309" />
            </g>
          )}

          {avatar.back === 'back_plasma_wings' && (
            <g id="pixel-plasma-wings" className="animate-pixel-float">
              {/* Left Plasma Wing - Multi-segment energy discharge */}
              <polygon points="12,23 -3,11 6,37" fill="#0891B2" opacity="0.6" />
              <polygon points="11,24 0,14 7,33" fill="#06B6D4" opacity="0.85" />
              <polygon points="10,25 3,17 7,30" fill="#22D3EE" />
              <polygon points="9,26 5,20 8,28" fill="#67E8F9" />
              <line x1="8" y1="27" x2="2" y2="18" stroke="#FFFFFF" strokeWidth="1" />
              <rect x="1" y="16" width="1.5" height="1.5" fill="#FFFFFF" />
              <rect x="5" y="23" width="1" height="1" fill="#A5F3FC" />

              {/* Right Plasma Wing */}
              <polygon points="52,23 67,11 58,37" fill="#0891B2" opacity="0.6" />
              <polygon points="53,24 64,14 57,33" fill="#06B6D4" opacity="0.85" />
              <polygon points="54,25 61,17 57,30" fill="#22D3EE" />
              <polygon points="55,26 59,20 56,28" fill="#67E8F9" />
              <line x1="56" y1="27" x2="62" y2="18" stroke="#FFFFFF" strokeWidth="1" />
              <rect x="61.5" y="16" width="1.5" height="1.5" fill="#FFFFFF" />
              <rect x="58" y="23" width="1" height="1" fill="#A5F3FC" />
            </g>
          )}

          {avatar.back === 'back_eco_knapsack' && (
            <g id="pixel-knapsack">
              {/* Straps with stitches and buckles */}
              <rect x="13.5" y="37" width="5.5" height="14" fill="#78350F" />
              <rect x="14.5" y="38" width="3.5" height="12" fill="#B45309" />
              <rect x="15" y="41" width="2.5" height="2" fill="#F59E0B" />
              <rect x="15.5" y="41.5" width="1.5" height="1" fill="#FEF3C7" />

              <rect x="45" y="37" width="5.5" height="14" fill="#78350F" />
              <rect x="46" y="38" width="3.5" height="12" fill="#B45309" />
              <rect x="46.5" y="41" width="2.5" height="2" fill="#F59E0B" />
              <rect x="47" y="41.5" width="1.5" height="1" fill="#FEF3C7" />
            </g>
          )}
        </g>

        {/* ============================================================ */}
        {/* 3. LAYER: HAIR BACK (後ろ髪・ハイディテール毛束) */}
        {/* ============================================================ */}
        <g id="layer-pixel-hair-back">
          {avatar.hairStyle === 'hair_wavy_long' && (
            <g id="pixel-hair-back-long">
              <rect x="7" y="9" width="50" height="36" fill={hairCol.shadow} />
              <rect x="5.5" y="15" width="11" height="29" fill={hairCol.base} />
              <rect x="47.5" y="15" width="11" height="29" fill={hairCol.base} />
              {/* Strand curls and micro pixel shading */}
              <rect x="7" y="22" width="4" height="20" fill={hairCol.highlight} />
              <rect x="53" y="22" width="4" height="20" fill={hairCol.highlight} />
              <rect x="9" y="38" width="3" height="6" fill={hairCol.shadow} />
              <rect x="52" y="38" width="3" height="6" fill={hairCol.shadow} />
              <rect x="5" y="42" width="2" height="3" fill={hairCol.base} />
              <rect x="57" y="42" width="2" height="3" fill={hairCol.base} />
            </g>
          )}
          {avatar.hairStyle === 'hair_ponytail' && (
            <g id="pixel-hair-back-ponytail">
              <rect x="45" y="5" width="14" height="20" fill={hairCol.base} />
              <rect x="47" y="17" width="12" height="16" fill={hairCol.shadow} />
              <rect x="49" y="10" width="8" height="14" fill={hairCol.highlight} />
              <rect x="55" y="28" width="4" height="6" fill={hairCol.base} />
              {/* Cute hairband / ribbon with shine */}
              <rect x="43" y="7" width="5" height="5" fill="#E11D48" />
              <rect x="44" y="8" width="3" height="3" fill="#FB7185" />
              <rect x="44.5" y="8.5" width="1" height="1" fill="#FFFFFF" />
            </g>
          )}
        </g>

        {/* ============================================================ */}
        {/* 4. LAYER: BODY (高解像度・細密ピクセルアートアバター素体) */}
        {/* ============================================================ */}
        <g id="layer-pixel-body">
          {/* Ground shadow beneath chibi avatar */}
          <ellipse cx="32" cy="59.5" rx="15" ry="3" fill="#000000" opacity="0.35" />

          {/* ============================================================ */}
          {/* LOWER BODY: DETAILED LEGS & PANTS (細密ステッチ＆立体ブーツ) */}
          {/* ============================================================ */}
          <g id="pixel-chibi-lower-body">
            {/* Pelvis / Pants Base (X: 21〜43) */}
            <rect x="20.5" y="46.5" width="23" height="5.5" fill="#0F172A" />
            <rect x="21.5" y="47" width="21" height="4.5" fill="#1E293B" />
            <rect x="22.5" y="48" width="19" height="2" fill="#334155" />
            <rect x="23" y="48.5" width="18" height="0.8" fill="#475569" />
            
            {/* Belt & Buckle with metallic shine */}
            <rect x="21.5" y="46" width="21" height="1.8" fill="#0F172A" />
            <rect x="22" y="46.3" width="20" height="1.2" fill="#1E293B" />
            <rect x="29.5" y="45.5" width="5" height="2.8" fill="#CBD5E1" />
            <rect x="30" y="46" width="4" height="1.8" fill="#F8FAFC" />
            <rect x="31" y="46.4" width="2" height="1" fill="#475569" />

            {/* Left Chibi Leg & Boot (X: 20〜29.5) */}
            <g id="chibi-left-leg">
              <rect x="20.5" y="49.5" width="8.5" height="5.5" fill="#0F172A" />
              <rect x="21.5" y="50" width="6.5" height="4.5" fill="#1E293B" />
              <rect x="22" y="50.5" width="4" height="3" fill="#334155" />
              {/* Left Boot - Detailed with seams, toe cap, soles */}
              <rect x="19.5" y="53.5" width="10" height="5.5" fill="#090D16" />
              <rect x="20.5" y="54" width="8" height="4" fill="#1E293B" />
              <rect x="20.5" y="54" width="7" height="1" fill="#334155" />
              {/* Laces & Eyelets */}
              <rect x="23.5" y="54.5" width="2.5" height="0.8" fill="#E2E8F0" />
              <rect x="23.5" y="55.8" width="2.5" height="0.8" fill="#E2E8F0" />
              {/* Emerald Accent Tag */}
              <rect x="22.5" y="54.5" width="0.8" height="2" fill="#10B981" />
              {/* Boot Sole & Tread */}
              <rect x="19.5" y="57.5" width="10" height="1.5" fill="#F1F5F9" />
              <rect x="19.5" y="58.5" width="10" height="0.5" fill="#64748B" />
            </g>

            {/* Right Chibi Leg & Boot (X: 34.5〜43.5) */}
            <g id="chibi-right-leg">
              <rect x="35" y="49.5" width="8.5" height="5.5" fill="#0F172A" />
              <rect x="36" y="50" width="6.5" height="4.5" fill="#1E293B" />
              <rect x="38" y="50.5" width="4" height="3" fill="#334155" />
              {/* Right Boot - Detailed */}
              <rect x="34.5" y="53.5" width="10" height="5.5" fill="#090D16" />
              <rect x="35.5" y="54" width="8" height="4" fill="#1E293B" />
              <rect x="36.5" y="54" width="7" height="1" fill="#334155" />
              {/* Laces & Eyelets */}
              <rect x="38" y="54.5" width="2.5" height="0.8" fill="#E2E8F0" />
              <rect x="38" y="55.8" width="2.5" height="0.8" fill="#E2E8F0" />
              {/* Emerald Accent Tag */}
              <rect x="40.5" y="54.5" width="0.8" height="2" fill="#10B981" />
              {/* Boot Sole & Tread */}
              <rect x="34.5" y="57.5" width="10" height="1.5" fill="#F1F5F9" />
              <rect x="34.5" y="58.5" width="10" height="0.5" fill="#64748B" />
            </g>

            {/* Inverted-V Crotch Gap */}
            <polygon points="27.5,50 36.5,50 32,54" fill="#0F172A" />
          </g>

          {/* ============================================================ */}
          {/* CHIBI TORSO BASE (胴体: 細密シャドウ) */}
          {/* ============================================================ */}
          <rect x="20.5" y="36.5" width="23" height="11.5" fill="#1E1510" />
          <rect x="21.5" y="37" width="21" height="10.5" fill={skin.shadow} />
          <rect x="22.5" y="38" width="19" height="8.5" fill={skin.base} />
          <rect x="25" y="38.5" width="14" height="2" fill={skin.highlight} />

          {/* Chibi Neck with clavicle shadow */}
          <rect x="27.5" y="34.5" width="9" height="3.5" fill={skin.shadow} />
          <rect x="28.5" y="35" width="7" height="2" fill={skin.base} />
          <rect x="31" y="36.5" width="2" height="1" fill={skin.shadow} />

          {/* ============================================================ */}
          {/* DEFORMED CHIBI HEAD (高密度ピクセル・愛らしい大きな頭部) */}
          {/* ============================================================ */}
          {/* Outer Outline with multi-step pixel curve */}
          <rect x="12" y="4.5" width="40" height="34" fill="#1E130D" />
          <rect x="10" y="7" width="44" height="30" fill="#1E130D" />
          <rect x="8.5" y="10" width="47" height="24" fill="#1E130D" />

          {/* Head Base Skin (滑らかなステップ丸み＆立体陰影) */}
          <rect x="13.5" y="6" width="37" height="31" fill={skin.shadow} />
          <rect x="11.5" y="8" width="41" height="27" fill={skin.shadow} />
          <rect x="10" y="11" width="44" height="21" fill={skin.shadow} />

          {/* Base Face Tone */}
          <rect x="14" y="7" width="36" height="29" fill={skin.base} />
          <rect x="12" y="9" width="40" height="25" fill={skin.base} />
          <rect x="11" y="12" width="42" height="19" fill={skin.base} />

          {/* Forehead Light & Volume Highlight */}
          <rect x="16" y="8" width="32" height="6" fill={skin.highlight} />
          <rect x="19" y="7" width="26" height="3" fill={skin.highlight} />

          {/* Cute Chibi Ears with intricate cartilage & shadow */}
          <g id="chibi-ears">
            {/* Left Ear */}
            <rect x="6.5" y="16.5" width="4.5" height="9.5" fill="#1E130D" />
            <rect x="8" y="17.5" width="3.5" height="7.5" fill={skin.shadow} />
            <rect x="9.5" y="18.5" width="2" height="5.5" fill={skin.base} />
            <rect x="8.5" y="20" width="1.5" height="2.5" fill={skin.shadow} />
            {/* Right Ear */}
            <rect x="53" y="16.5" width="4.5" height="9.5" fill="#1E130D" />
            <rect x="52.5" y="17.5" width="3.5" height="7.5" fill={skin.shadow} />
            <rect x="52.5" y="18.5" width="2" height="5.5" fill={skin.base} />
            <rect x="54" y="20" width="1.5" height="2.5" fill={skin.shadow} />
          </g>

          {/* ============================================================ */}
          {/* HIGH-RES PIXEL ANIME EYES & FACE (細密アニメ瞳＆豊かな表情) */}
          {/* ============================================================ */}
          <g id="pixel-chibi-face">
            {/* Eyelid Creases (二重まぶたのシャドウライン) */}
            <rect x="20.5" y="15" width="7" height="0.8" fill="#7C2D12" opacity="0.6" />
            <rect x="36.5" y="15" width="7" height="0.8" fill="#7C2D12" opacity="0.6" />

            {/* Left Anime Eye (緻密な多層グラデーション・星光ハイライト) */}
            {/* Eyelash / Outer Frame */}
            <rect x="19.5" y="16.2" width="8.5" height="11.5" fill="#0A0F1D" />
            <rect x="19" y="16.2" width="9.5" height="2" fill="#0A0F1D" />
            {/* Sclera (White of the eye with soft shadow at top) */}
            <rect x="20.5" y="17.5" width="6.8" height="9.5" fill="#E2E8F0" />
            <rect x="20.5" y="17.5" width="6.8" height="1.8" fill="#CBD5E1" />
            <rect x="20.5" y="19" width="6.8" height="8" fill="#FFFFFF" />

            {/* Iris Base (Multi-tone gradient layers) */}
            <rect x="21.5" y="17.5" width="5.5" height="9.2" fill="#0F172A" />
            <rect x="21.5" y="19" width="5.5" height="6.5" fill="#1E3A8A" />
            <rect x="21.5" y="21" width="5.5" height="4.5" fill="#0284C7" />
            <rect x="21.5" y="23.5" width="5.5" height="2.8" fill="#38BDF8" />
            <rect x="22.5" y="25" width="3.5" height="1.2" fill="#7DD3FC" />
            {/* Pupil Depth */}
            <rect x="23.5" y="20.5" width="1.8" height="3" fill="#020617" />
            {/* Master Sparkle (Big White Highlight) */}
            <rect x="21" y="17.5" width="2.5" height="3.5" fill="#FFFFFF" />
            <rect x="21" y="17.5" width="3.5" height="2" fill="#FFFFFF" />
            {/* Micro-pixel Iris Shimmer Dots */}
            <rect x="22.2" y="24.2" width="1" height="0.8" fill="#BAE6FD" />
            <rect x="23.5" y="25.2" width="1.2" height="0.6" fill="#E0F2FE" />
            <rect x="20.8" y="22" width="0.6" height="1.2" fill="#7DD3FC" />
            {/* Secondary Star Reflection */}
            <rect x="24.8" y="23.5" width="1.8" height="1.8" fill="#F0F9FF" />
            <rect x="25.2" y="24" width="0.8" height="0.8" fill="#FFFFFF" />
            <rect x="24.4" y="24.4" width="0.5" height="0.5" fill="#FFFFFF" />

            {/* Right Anime Eye */}
            {/* Eyelash / Outer Frame */}
            <rect x="36" y="16.2" width="8.5" height="11.5" fill="#0A0F1D" />
            <rect x="35.5" y="16.2" width="9.5" height="2" fill="#0A0F1D" />
            {/* Eyelash Micro Wing Pixels */}
            <rect x="44.2" y="15.8" width="1.2" height="1" fill="#0A0F1D" />
            <rect x="45" y="15.2" width="0.8" height="0.8" fill="#0A0F1D" />
            {/* Sclera */}
            <rect x="36.7" y="17.5" width="6.8" height="9.5" fill="#E2E8F0" />
            <rect x="36.7" y="17.5" width="6.8" height="1.8" fill="#CBD5E1" />
            <rect x="36.7" y="19" width="6.8" height="8" fill="#FFFFFF" />

            {/* Iris Base */}
            <rect x="37" y="17.5" width="5.5" height="9.2" fill="#0F172A" />
            <rect x="37" y="19" width="5.5" height="6.5" fill="#1E3A8A" />
            <rect x="37" y="21" width="5.5" height="4.5" fill="#0284C7" />
            <rect x="37" y="23.5" width="5.5" height="2.8" fill="#38BDF8" />
            <rect x="38" y="25" width="3.5" height="1.2" fill="#7DD3FC" />
            {/* Pupil Depth */}
            <rect x="38.7" y="20.5" width="1.8" height="3" fill="#020617" />
            {/* Master Sparkle */}
            <rect x="36.5" y="17.5" width="2.5" height="3.5" fill="#FFFFFF" />
            <rect x="36.5" y="17.5" width="3.5" height="2" fill="#FFFFFF" />
            {/* Micro-pixel Iris Shimmer Dots */}
            <rect x="37.8" y="24.2" width="1" height="0.8" fill="#BAE6FD" />
            <rect x="39" y="25.2" width="1.2" height="0.6" fill="#E0F2FE" />
            <rect x="41.8" y="22" width="0.6" height="1.2" fill="#7DD3FC" />
            {/* Secondary Star Reflection */}
            <rect x="40.3" y="23.5" width="1.8" height="1.8" fill="#F0F9FF" />
            <rect x="40.7" y="24" width="0.8" height="0.8" fill="#FFFFFF" />
            <rect x="41.2" y="24.4" width="0.5" height="0.5" fill="#FFFFFF" />

            {/* Detailed Eyebrows with arch & shading */}
            <rect x="19.5" y="13.5" width="8" height="1.5" fill={hairCol.shadow} />
            <rect x="20.5" y="13" width="7" height="1.2" fill={hairCol.base} />
            <rect x="22" y="12.5" width="4" height="0.8" fill={hairCol.highlight} />

            <rect x="36.5" y="13.5" width="8" height="1.5" fill={hairCol.shadow} />
            <rect x="36.5" y="13" width="7" height="1.2" fill={hairCol.base} />
            <rect x="38" y="12.5" width="4" height="0.8" fill={hairCol.highlight} />

            {/* Rosy Dithered Cheeks (ふんわり微細チーク) */}
            {/* Left Cheek */}
            <rect x="14" y="24.5" width="6" height="4" fill="#FB7185" opacity="0.85" />
            <rect x="15" y="25.5" width="4" height="2" fill="#FDA4AF" />
            <rect x="14.5" y="25" width="1" height="1" fill="#FFFFFF" opacity="0.6" />
            <rect x="17.5" y="26" width="1" height="1" fill="#FFFFFF" opacity="0.6" />

            {/* Right Cheek */}
            <rect x="44" y="24.5" width="6" height="4" fill="#FB7185" opacity="0.85" />
            <rect x="45" y="25.5" width="4" height="2" fill="#FDA4AF" />
            <rect x="45.5" y="25" width="1" height="1" fill="#FFFFFF" opacity="0.6" />
            <rect x="48.5" y="26" width="1" height="1" fill="#FFFFFF" opacity="0.6" />

            {/* Cute Smile with lip curve, tongue & tooth glint */}
            <rect x="28.5" y="26.8" width="7" height="3.5" fill="#1E130D" />
            <rect x="29" y="27.3" width="6" height="2.8" fill="#E11D48" />
            <rect x="30" y="28.5" width="4" height="1.5" fill="#FB7185" />
            <rect x="30" y="27.3" width="3" height="0.8" fill="#FFFFFF" />
          </g>

          {/* Chibi Arms with wrist contour & knuckles */}
          <g id="pixel-chibi-arms">
            {/* Left Arm (X: 13〜21) */}
            <rect x="12.5" y="36.5" width="8.5" height="9.5" fill="#1E130D" />
            <rect x="13.5" y="37.5" width="6.5" height="7.5" fill={skin.shadow} />
            <rect x="14" y="41.5" width="5.5" height="3" fill={skin.base} />
            <rect x="14.5" y="43" width="2" height="1.5" fill={skin.highlight} />
            <rect x="13" y="42" width="1" height="2" fill={skin.shadow} />
            {/* Right Arm (X: 43〜51) */}
            <rect x="43" y="36.5" width="8.5" height="9.5" fill="#1E130D" />
            <rect x="44" y="37.5" width="6.5" height="7.5" fill={skin.shadow} />
            <rect x="44.5" y="41.5" width="5.5" height="3" fill={skin.base} />
            <rect x="47.5" y="43" width="2" height="1.5" fill={skin.highlight} />
            <rect x="50" y="42" width="1" height="2" fill={skin.shadow} />
          </g>
        </g>

        {/* ============================================================ */}
        {/* 5. LAYER: CLOTHES (高密度ピクセルアート・精密ステッチ・陰影) */}
        {/* ============================================================ */}
        <g id="layer-pixel-clothes">
          {avatar.clothes === 'cloth_hoodie' ? (
            <g id="pixel-hoodie">
              {/* Hoodie Outer Contour */}
              <rect x="19.5" y="35.5" width="25" height="13.5" fill="#042F2E" />
              <rect x="20.5" y="36.5" width="23" height="12" fill="#065F46" />
              <rect x="21.5" y="37" width="21" height="11" fill="#059669" />
              <rect x="23" y="37.5" width="18" height="2" fill="#10B981" />
              {/* Hoodie Ribbed Hem & Cuffs */}
              <rect x="20.5" y="47" width="23" height="1.5" fill="#044E3B" />
              <line x1="22" y1="47" x2="42" y2="47" stroke="#022C22" strokeWidth="0.5" />
              {/* Front Kangaroo Pocket with double-needle stitching */}
              <rect x="24.5" y="41" width="15" height="5.5" fill="#047857" />
              <rect x="25.5" y="41.5" width="13" height="4.5" fill="#059669" />
              <rect x="26" y="42" width="12" height="1" fill="#10B981" />
              <rect x="24.5" y="41" width="1" height="5" fill="#022C22" />
              <rect x="38.5" y="41" width="1" height="5" fill="#022C22" />
              {/* Sleeves with folds and shadows */}
              <rect x="12.5" y="36.5" width="8.5" height="7.5" fill="#065F46" />
              <rect x="13.5" y="37" width="7" height="6.5" fill="#059669" />
              <rect x="13" y="42.5" width="7.5" height="1.2" fill="#044E3B" />
              <rect x="43" y="36.5" width="8.5" height="7.5" fill="#065F46" />
              <rect x="43.5" y="37" width="7" height="6.5" fill="#059669" />
              <rect x="43.5" y="42.5" width="7.5" height="1.2" fill="#044E3B" />
              {/* Hood Collar & Drawstrings with silver aglets */}
              <polygon points="26,36 38,36 32,40" fill="#022C22" />
              <rect x="27.5" y="37" width="1.2" height="5" fill="#F8FAFC" />
              <rect x="27.5" y="41.5" width="1.2" height="1" fill="#94A3B8" />
              <rect x="35.3" y="37" width="1.2" height="5" fill="#F8FAFC" />
              <rect x="35.3" y="41.5" width="1.2" height="1" fill="#94A3B8" />
              {/* Mini Eco Leaf Embroidered Badge */}
              <rect x="29.5" y="38.5" width="2" height="2" fill="#34D399" />
              <rect x="31" y="38" width="1" height="1" fill="#6EE7B7" />
            </g>
          ) : avatar.clothes === 'cloth_jacket' ? (
            <g id="pixel-jacket">
              {/* Jacket Base */}
              <rect x="19.5" y="35.5" width="25" height="13.5" fill="#0F172A" />
              <rect x="20.5" y="36.5" width="23" height="12" fill="#1E3A8A" />
              <rect x="21" y="37" width="22" height="11" fill="#2563EB" />
              {/* Crisp Lapels (襟の折り返し立体感) */}
              <polygon points="20.5,36.5 27,36.5 25,43 21,43" fill="#1D4ED8" />
              <polygon points="43.5,36.5 37,36.5 39,43 43,43" fill="#1D4ED8" />
              {/* Inner White Shirt & Shadow */}
              <polygon points="27,36.5 37,36.5 32,42.5" fill="#E2E8F0" />
              <polygon points="28,36.5 36,36.5 32,41.5" fill="#FFFFFF" />
              <rect x="31.5" y="38" width="1" height="4" fill="#CBD5E1" />
              {/* Sleeves with cuff buttons */}
              <rect x="12.5" y="36.5" width="8.5" height="7.5" fill="#1E3A8A" />
              <rect x="13.5" y="37" width="7" height="6.5" fill="#2563EB" />
              <rect x="13.5" y="42" width="1" height="1" fill="#FBBF24" />
              <rect x="43" y="36.5" width="8.5" height="7.5" fill="#1E3A8A" />
              <rect x="43.5" y="37" width="7" height="6.5" fill="#2563EB" />
              <rect x="49.5" y="42" width="1" height="1" fill="#FBBF24" />
              {/* Golden Brass Buttons */}
              <rect x="31" y="43.5" width="2" height="2" fill="#F59E0B" />
              <rect x="31.5" y="44" width="1" height="1" fill="#FEF08A" />
              <rect x="31" y="46.5" width="2" height="2" fill="#F59E0B" />
              <rect x="31.5" y="47" width="1" height="1" fill="#FEF08A" />
              {/* Breast Pocket with folded silk kerchief */}
              <rect x="23" y="40.5" width="3.5" height="0.8" fill="#1E3A8A" />
              <rect x="23.5" y="39.8" width="2" height="0.8" fill="#F43F5E" />
            </g>
          ) : avatar.clothes === 'cloth_volunteer_vest' ? (
            <g id="pixel-vest">
              {/* Purple Vest over White Sleeves */}
              <rect x="19.5" y="35.5" width="25" height="13.5" fill="#3B0764" />
              <rect x="20.5" y="36.5" width="23" height="12" fill="#6B21A8" />
              <rect x="21" y="37" width="22" height="11" fill="#7E22CE" />
              {/* High-Visibility Neon Yellow Grid Stripes */}
              <rect x="20.5" y="41" width="23" height="3" fill="#EAB308" />
              <rect x="20.5" y="41.5" width="23" height="2" fill="#FACC15" />
              <rect x="21" y="42" width="22" height="1" fill="#FEF08A" />
              {/* Central Zipper Line */}
              <rect x="31.5" y="37" width="1" height="11.5" fill="#CBD5E1" />
              <rect x="31" y="39" width="2" height="1.5" fill="#94A3B8" />
              {/* Volunteer ID Badge */}
              <rect x="23.5" y="38" width="3.5" height="2.5" fill="#F8FAFC" />
              <rect x="24" y="38.5" width="2.5" height="1" fill="#3B82F6" />
              {/* White Inner Shirt Sleeves with detailed fold shadows */}
              <rect x="12.5" y="36.5" width="8.5" height="6.5" fill="#CBD5E1" />
              <rect x="13.5" y="37" width="7" height="5.5" fill="#FFFFFF" />
              <rect x="15" y="41" width="5" height="1.5" fill="#E2E8F0" />
              <rect x="43" y="36.5" width="8.5" height="6.5" fill="#CBD5E1" />
              <rect x="43.5" y="37" width="7" height="5.5" fill="#FFFFFF" />
              <rect x="44" y="41" width="5" height="1.5" fill="#E2E8F0" />
            </g>
          ) : avatar.clothes === 'cloth_uniform' ? (
            <g id="pixel-uniform">
              <rect x="19.5" y="35.5" width="25" height="13.5" fill="#020617" />
              <rect x="20.5" y="36.5" width="23" height="12" fill="#0F172A" />
              <rect x="21" y="37" width="22" height="11" fill="#1E293B" />
              {/* Formal Lapels */}
              <polygon points="20.5,36.5 26.5,36.5 24.5,43 21,43" fill="#0F172A" />
              <polygon points="43.5,36.5 37.5,36.5 39.5,43 43,43" fill="#0F172A" />
              {/* Crisp White Shirt Collar & Placket */}
              <polygon points="26.5,36.5 37.5,36.5 32,42" fill="#E2E8F0" />
              <polygon points="27.5,36.5 36.5,36.5 32,41" fill="#FFFFFF" />
              {/* Striped Crimson & Gold Tie with knot */}
              <rect x="30.5" y="38" width="3" height="2" fill="#BE123C" />
              <rect x="31" y="40" width="2" height="6.5" fill="#E11D48" />
              <rect x="31" y="41.5" width="2" height="0.8" fill="#FBBF24" />
              <rect x="31" y="44" width="2" height="0.8" fill="#FBBF24" />
              {/* Crest Badge on Blazer */}
              <rect x="23.5" y="39.5" width="3" height="3" fill="#F59E0B" />
              <rect x="24" y="40" width="2" height="2" fill="#1E293B" />
              {/* Sleeves */}
              <rect x="12.5" y="36.5" width="8.5" height="7.5" fill="#0F172A" />
              <rect x="13.5" y="37" width="7" height="6.5" fill="#1E293B" />
              <rect x="43" y="36.5" width="8.5" height="7.5" fill="#0F172A" />
              <rect x="43.5" y="37" width="7" height="6.5" fill="#1E293B" />
            </g>
          ) : avatar.clothes === 'cloth_gaia_robe' ? (
            <g id="pixel-gaia-robe">
              {/* Flowing Nature Robe with multi-step pixel embroidery */}
              <rect x="17.5" y="35.5" width="29" height="14.5" fill="#022C22" />
              <rect x="18.5" y="36.5" width="27" height="13.5" fill="#064E3B" />
              <rect x="19.5" y="37" width="25" height="12.5" fill="#047857" />
              {/* Intricate Gold Filigree & Ivy Trim */}
              <rect x="22" y="36.5" width="20" height="2" fill="#F59E0B" />
              <rect x="22.5" y="37" width="19" height="1" fill="#FDE047" />
              <rect x="30.5" y="38" width="3" height="11" fill="#065F46" />
              <rect x="31.2" y="38.5" width="1.6" height="10" fill="#10B981" />
              <rect x="31.5" y="39" width="1" height="9" fill="#6EE7B7" />
              {/* Hem Gold Trim with emerald insets */}
              <rect x="19" y="47.5" width="26" height="2.5" fill="#F59E0B" />
              <rect x="19.5" y="48" width="25" height="1.5" fill="#FDE047" />
              <rect x="24" y="48.3" width="1.5" height="1" fill="#059669" />
              <rect x="31.2" y="48.3" width="1.5" height="1" fill="#059669" />
              <rect x="38.5" y="48.3" width="1.5" height="1" fill="#059669" />
              {/* Flowing Wide Robe Sleeves */}
              <rect x="11.5" y="36.5" width="9.5" height="11" fill="#064E3B" />
              <rect x="12" y="37" width="8.5" height="10" fill="#047857" />
              <rect x="11.5" y="46.5" width="9.5" height="1.5" fill="#F59E0B" />
              <rect x="43" y="36.5" width="9.5" height="11" fill="#064E3B" />
              <rect x="43.5" y="37" width="8.5" height="10" fill="#047857" />
              <rect x="43" y="46.5" width="9.5" height="1.5" fill="#F59E0B" />
            </g>
          ) : avatar.clothes === 'cloth_cyber_suit' ? (
            <g id="pixel-cyber-suit">
              <rect x="19.5" y="35.5" width="25" height="13.5" fill="#020617" />
              <rect x="20.5" y="36.5" width="23" height="12" fill="#090D16" />
              <rect x="21" y="37" width="22" height="11" fill="#0F172A" />
              {/* High-density Neon Circuitry (0.5px sub-pixel luminous tracks) */}
              <rect x="23.5" y="38" width="5" height="1" fill="#0891B2" />
              <rect x="23.5" y="38.5" width="5" height="0.6" fill="#22D3EE" />
              <rect x="28" y="38" width="1" height="6.5" fill="#06B6D4" />
              <rect x="28.2" y="38.5" width="0.6" height="5.5" fill="#A5F3FC" />
              <rect x="24.5" y="44" width="4.5" height="1" fill="#0891B2" />
              
              <rect x="35.5" y="38" width="5" height="1" fill="#0891B2" />
              <rect x="35.5" y="38.5" width="5" height="0.6" fill="#22D3EE" />
              <rect x="35" y="38" width="1" height="6.5" fill="#06B6D4" />
              <rect x="35.2" y="38.5" width="0.6" height="5.5" fill="#A5F3FC" />
              <rect x="35" y="44" width="4.5" height="1" fill="#0891B2" />

              {/* Arc Reactor Chest Core */}
              <rect x="29.5" y="40.5" width="5" height="5" fill="#083344" />
              <rect x="30" y="41" width="4" height="4" fill="#06B6D4" />
              <rect x="30.5" y="41.5" width="3" height="3" fill="#38BDF8" />
              <rect x="31" y="42" width="2" height="2" fill="#FFFFFF" />
              {/* Sleeves with illuminated cuffs */}
              <rect x="12.5" y="36.5" width="8.5" height="7.5" fill="#090D16" />
              <rect x="13.5" y="37" width="7" height="6.5" fill="#0F172A" />
              <rect x="13" y="42.5" width="8" height="1.2" fill="#06B6D4" />
              <rect x="14" y="42.8" width="6" height="0.6" fill="#E0F2FE" />
              <rect x="43" y="36.5" width="8.5" height="7.5" fill="#090D16" />
              <rect x="43.5" y="37" width="7" height="6.5" fill="#0F172A" />
              <rect x="43" y="42.5" width="8" height="1.2" fill="#06B6D4" />
              <rect x="44" y="42.8" width="6" height="0.6" fill="#E0F2FE" />
            </g>
          ) : avatar.clothes === 'cloth_clean_ranger' ? (
            <g id="pixel-clean-ranger">
              <rect x="17.5" y="35.5" width="29" height="14.5" fill="#064E3B" />
              <rect x="18.5" y="36.5" width="27" height="13.5" fill="#047857" />
              <rect x="19.5" y="37" width="25" height="12.5" fill="#10B981" />
              {/* Tactical White & Safety-Orange Harness */}
              <rect x="19.5" y="40.5" width="25" height="2.5" fill="#F8FAFC" />
              <rect x="20" y="41" width="24" height="1.5" fill="#EA580C" />
              <rect x="29.5" y="36.5" width="5" height="13.5" fill="#C2410C" />
              <rect x="30" y="37" width="4" height="12.5" fill="#F97316" />
              {/* Tactical Center Buckle */}
              <rect x="29.5" y="40.5" width="5" height="2.5" fill="#CBD5E1" />
              <rect x="30.5" y="41" width="3" height="1.5" fill="#1E293B" />
              {/* Arm Guards with safety badges */}
              <rect x="12.5" y="36.5" width="8.5" height="8.5" fill="#047857" />
              <rect x="13.5" y="37" width="7" height="7.5" fill="#10B981" />
              <rect x="12.5" y="40.5" width="8.5" height="2" fill="#F97316" />
              <rect x="43" y="36.5" width="8.5" height="8.5" fill="#047857" />
              <rect x="43.5" y="37" width="7" height="7.5" fill="#10B981" />
              <rect x="43" y="40.5" width="8.5" height="2" fill="#F97316" />
            </g>
          ) : avatar.clothes === 'cloth_world_champion' ? (
            <g id="pixel-world-cloak">
              <rect x="16.5" y="35.5" width="31" height="15.5" fill="#083344" />
              <rect x="17.5" y="36.5" width="29" height="14" fill="#0E7490" />
              <rect x="18.5" y="37" width="27" height="13" fill="#06B6D4" />
              {/* Gold Brocade Stole */}
              <rect x="26.5" y="36.5" width="11" height="12.5" fill="#B45309" />
              <rect x="27.5" y="37" width="9" height="11.5" fill="#F59E0B" />
              <rect x="28.5" y="37" width="7" height="11" fill="#FDE047" />
              {/* World Tree Emblem in Center */}
              <rect x="30" y="40" width="4" height="4.5" fill="#FFFFFF" />
              <rect x="31" y="41" width="2" height="2" fill="#0284C7" />
              <rect x="31.5" y="42" width="1" height="1" fill="#22C55E" />
              {/* Cloak Shoulders */}
              <rect x="12.5" y="36.5" width="8.5" height="8" fill="#083344" />
              <rect x="13.5" y="37" width="7" height="7" fill="#0E7490" />
              <rect x="13" y="43" width="8" height="1.5" fill="#F59E0B" />
              <rect x="43" y="36.5" width="8.5" height="8" fill="#083344" />
              <rect x="43.5" y="37" width="7" height="7" fill="#0E7490" />
              <rect x="43" y="43" width="8" height="1.5" fill="#F59E0B" />
            </g>
          ) : (
            /* Default T-Shirt - High Detail Cotton Finish */
            <g id="pixel-tshirt">
              <rect x="19.5" y="35.5" width="25" height="13.5" fill="#1E3A8A" />
              <rect x="20.5" y="36.5" width="23" height="12" fill="#2563EB" />
              <rect x="21" y="37" width="22" height="11" fill="#3B82F6" />
              {/* Crew Neck Ribbing with subtle collar shadow */}
              <rect x="26.5" y="36.5" width="11" height="2" fill="#1D4ED8" />
              <rect x="27" y="36.5" width="10" height="1.2" fill="#93C5FD" />
              <polygon points="28,36.5 36,36.5 32,38.5" fill={skin.shadow} />
              {/* Short Sleeves with folded cuffs */}
              <rect x="12.5" y="36.5" width="8.5" height="6.5" fill="#1E3A8A" />
              <rect x="13.5" y="37" width="7" height="5.5" fill="#3B82F6" />
              <rect x="13" y="41.5" width="8" height="1" fill="#1D4ED8" />
              <rect x="43" y="36.5" width="8.5" height="6.5" fill="#1E3A8A" />
              <rect x="43.5" y="37" width="7" height="5.5" fill="#3B82F6" />
              <rect x="43" y="41.5" width="8" height="1" fill="#1D4ED8" />
              {/* Detailed Sprout Icon with veined leaves on chest */}
              <rect x="31" y="42" width="2" height="3" fill="#15803D" />
              <rect x="29.5" y="40" width="2.5" height="2" fill="#22C55E" />
              <rect x="30" y="40.2" width="1.5" height="0.8" fill="#86EFAC" />
              <rect x="32" y="39.2" width="2.5" height="2" fill="#22C55E" />
              <rect x="32.5" y="39.4" width="1.5" height="0.8" fill="#86EFAC" />
            </g>
          )}
        </g>

        {/* ============================================================ */}
        {/* 6. LAYER: HAIR FRONT (高密度ピクセル・エンジェルリング・毛束) */}
        {/* ============================================================ */}
        <g id="layer-pixel-hair-front">
          {avatar.hairStyle === 'hair_medium' ? (
            <g id="pixel-hair-bob">
              {/* Top Hair Dome with multi-step steps */}
              <rect x="10.5" y="2.5" width="43" height="15" fill={hairCol.shadow} />
              <rect x="12.5" y="4.5" width="39" height="12" fill={hairCol.base} />
              {/* Angel Ring (天使の輪ハイライト) */}
              <rect x="16" y="4.5" width="32" height="2.5" fill={hairCol.highlight} />
              <rect x="20" y="5" width="10" height="1.2" fill="#FFFFFF" opacity="0.65" />
              <rect x="34" y="5" width="10" height="1.2" fill="#FFFFFF" opacity="0.65" />
              {/* Bob Sides with inner curves */}
              <rect x="7.5" y="8.5" width="9" height="21" fill={hairCol.shadow} />
              <rect x="9.5" y="8.5" width="7" height="19" fill={hairCol.base} />
              <rect x="11.5" y="11" width="3" height="14" fill={hairCol.highlight} />
              <rect x="47.5" y="8.5" width="9" height="21" fill={hairCol.shadow} />
              <rect x="47.5" y="8.5" width="7" height="19" fill={hairCol.base} />
              <rect x="49.5" y="11" width="3" height="14" fill={hairCol.highlight} />
              {/* Detailed Bangs (細密な毛先の分かれ目) */}
              <polygon points="15,15 20,22 25,15 31,23 37,15 43,22 49,15" fill={hairCol.base} />
              <polygon points="17,15 20,20 23,15 31,21 35,15 43,20 47,15" fill={hairCol.highlight} />
              <rect x="17" y="12.5" width="30" height="3.5" fill={hairCol.base} />
            </g>
          ) : avatar.hairStyle === 'hair_spiky' ? (
            <g id="pixel-hair-spiky">
              {/* Spiky Crown with intricate peaks & shadow */}
              <polygon points="12,6 18,-1 23,5 32,-3 41,5 46,-1 52,6" fill={hairCol.shadow} />
              <polygon points="13.5,6.5 18,0.5 22.5,6 32,-1.5 40.5,6 46,0.5 50.5,6.5" fill={hairCol.base} />
              <rect x="10.5" y="4.5" width="43" height="13" fill={hairCol.base} />
              {/* Spiky Highlights */}
              <polygon points="18,1.5 20,5 17,5" fill={hairCol.highlight} />
              <polygon points="32,-0.5 35,5 30,5" fill={hairCol.highlight} />
              <polygon points="46,1.5 48,5 45,5" fill={hairCol.highlight} />
              <rect x="17" y="5" width="30" height="2.5" fill={hairCol.highlight} />
              {/* Side Spikes */}
              <rect x="6.5" y="8.5" width="10" height="19" fill={hairCol.shadow} />
              <rect x="8.5" y="8.5" width="8" height="17" fill={hairCol.base} />
              <rect x="10" y="12" width="4" height="10" fill={hairCol.highlight} />
              <rect x="47.5" y="8.5" width="10" height="19" fill={hairCol.shadow} />
              <rect x="47.5" y="8.5" width="8" height="17" fill={hairCol.base} />
              <rect x="50" y="12" width="4" height="10" fill={hairCol.highlight} />
              {/* Bangs */}
              <polygon points="15,15 21,23 26,15 32,24 38,15 44,23 49,15" fill={hairCol.base} />
              <polygon points="18,15 21,21 24,15 32,22 36,15 44,21 46,15" fill={hairCol.highlight} />
            </g>
          ) : avatar.hairStyle === 'hair_cyber_braids' ? (
            <g id="pixel-hair-braids">
              <rect x="10.5" y="2.5" width="43" height="15" fill={hairCol.shadow} />
              <rect x="12.5" y="4.5" width="39" height="12" fill={hairCol.base} />
              <rect x="16" y="5" width="32" height="2.5" fill={hairCol.highlight} />
              {/* Left Intricate Braids with neon hair-ties */}
              <rect x="8.5" y="8.5" width="7.5" height="7.5" fill={hairCol.base} />
              <rect x="9" y="9" width="6.5" height="3" fill={hairCol.highlight} />
              <rect x="6.5" y="16" width="8" height="4.5" fill="#06B6D4" />
              <rect x="7" y="16.5" width="7" height="1.5" fill="#E0F2FE" />
              <rect x="8.5" y="20.5" width="7.5" height="7.5" fill={hairCol.base} />
              <rect x="6.5" y="28" width="8" height="4.5" fill="#06B6D4" />
              <rect x="7" y="28.5" width="7" height="1.5" fill="#E0F2FE" />
              <rect x="8.5" y="32.5" width="6.5" height="6.5" fill={hairCol.base} />
              {/* Right Intricate Braids */}
              <rect x="48" y="8.5" width="7.5" height="7.5" fill={hairCol.base} />
              <rect x="48.5" y="9" width="6.5" height="3" fill={hairCol.highlight} />
              <rect x="49.5" y="16" width="8" height="4.5" fill="#06B6D4" />
              <rect x="50" y="16.5" width="7" height="1.5" fill="#E0F2FE" />
              <rect x="48" y="20.5" width="7.5" height="7.5" fill={hairCol.base} />
              <rect x="49.5" y="28" width="8" height="4.5" fill="#06B6D4" />
              <rect x="50" y="28.5" width="7" height="1.5" fill="#E0F2FE" />
              <rect x="49" y="32.5" width="6.5" height="6.5" fill={hairCol.base} />
              {/* Clean Front Bangs */}
              <rect x="15" y="12.5" width="34" height="4" fill={hairCol.base} />
              <rect x="18" y="13.5" width="28" height="1.5" fill={hairCol.highlight} />
            </g>
          ) : avatar.hairStyle === 'hair_wavy_long' ? (
            <g id="pixel-hair-long-front">
              <rect x="10.5" y="2.5" width="43" height="15" fill={hairCol.shadow} />
              <rect x="12.5" y="4.5" width="39" height="12" fill={hairCol.base} />
              <rect x="16" y="4.5" width="32" height="2.5" fill={hairCol.highlight} />
              {/* Long Flowing Side Tresses with curls */}
              <rect x="6.5" y="8.5" width="10" height="27" fill={hairCol.shadow} />
              <rect x="8.5" y="8.5" width="8" height="25" fill={hairCol.base} />
              <rect x="10" y="12" width="4" height="16" fill={hairCol.highlight} />
              <rect x="47.5" y="8.5" width="10" height="27" fill={hairCol.shadow} />
              <rect x="47.5" y="8.5" width="8" height="25" fill={hairCol.base} />
              <rect x="50" y="12" width="4" height="16" fill={hairCol.highlight} />
              {/* Bangs */}
              <rect x="15" y="12.5" width="34" height="4.5" fill={hairCol.base} />
              <polygon points="16,17 21,21 26,17 32,22 38,17 43,21 48,17" fill={hairCol.base} />
            </g>
          ) : (
            /* Default Short Hair - High-Density Chibi anime hair */
            <g id="pixel-hair-short">
              {/* Top Hair Base & Highlights */}
              <rect x="10.5" y="2.5" width="43" height="15" fill={hairCol.shadow} />
              <rect x="12.5" y="4.5" width="39" height="12" fill={hairCol.base} />
              {/* Angel Ring (天使の輪) */}
              <rect x="17" y="4.5" width="30" height="2.5" fill={hairCol.highlight} />
              <rect x="21" y="5" width="9" height="1" fill="#FFFFFF" opacity="0.65" />
              <rect x="34" y="5" width="9" height="1" fill="#FFFFFF" opacity="0.65" />
              {/* Side Tufts with fluff */}
              <rect x="7.5" y="8.5" width="9" height="17" fill={hairCol.shadow} />
              <rect x="9.5" y="8.5" width="7" height="15" fill={hairCol.base} />
              <rect x="5.5" y="14.5" width="5.5" height="5.5" fill={hairCol.base} />
              <rect x="6.5" y="15" width="2" height="2" fill={hairCol.highlight} />

              <rect x="47.5" y="8.5" width="9" height="17" fill={hairCol.shadow} />
              <rect x="47.5" y="8.5" width="7" height="15" fill={hairCol.base} />
              <rect x="53" y="14.5" width="5.5" height="5.5" fill={hairCol.base} />
              <rect x="55.5" y="15" width="2" height="2" fill={hairCol.highlight} />

              {/* Feathered Bangs with highlights */}
              <polygon points="15,15 20.5,22 25.5,15 32,23 37.5,15 43.5,22 49,15" fill={hairCol.base} />
              <polygon points="17,15 20.5,20 24,15 32,21 36,15 43.5,20 47,15" fill={hairCol.highlight} />
              <rect x="17" y="12.5" width="30" height="3.5" fill={hairCol.base} />
              <rect x="21" y="13.5" width="5" height="2" fill={hairCol.highlight} />
              <rect x="38" y="13.5" width="5" height="2" fill={hairCol.highlight} />
            </g>
          )}
        </g>

        {/* ============================================================ */}
        {/* 7. LAYER: HAT (高密度ピクセル・装飾ヘッドギア・立体ステッチ) */}
        {/* ============================================================ */}
        <g id="layer-pixel-hat">
          {avatar.hat === 'hat_eco_cap' && (
            <g id="pixel-hat-cap">
              {/* Cap Crown with panel seams */}
              <rect x="10.5" y="0.5" width="43" height="11.5" fill="#14532D" />
              <rect x="12.5" y="1" width="39" height="10" fill="#15803D" />
              <rect x="14.5" y="-1.5" width="35" height="4.5" fill="#16A34A" />
              {/* Panel Seam Lines */}
              <line x1="32" y1="-1" x2="32" y2="10" stroke="#14532D" strokeWidth="0.8" />
              <line x1="22" y1="1" x2="20" y2="10" stroke="#14532D" strokeWidth="0.6" />
              <line x1="42" y1="1" x2="44" y2="10" stroke="#14532D" strokeWidth="0.6" />
              {/* Top Button */}
              <rect x="30.5" y="-2.5" width="3" height="2" fill="#14532D" />
              <rect x="31" y="-2" width="2" height="1" fill="#4ADE80" />
              {/* 3D Curved Visor / Bill */}
              <rect x="6.5" y="9.5" width="51" height="5" fill="#052E16" />
              <rect x="7" y="10" width="50" height="3.8" fill="#14532D" />
              <rect x="8" y="10.5" width="48" height="1.5" fill="#15803D" />
              {/* Embroidered Gold Eco Leaf Emblem */}
              <rect x="29" y="3" width="6" height="5" fill="#052E16" />
              <rect x="29.5" y="3.5" width="5" height="4" fill="#FACC15" />
              <rect x="30" y="4" width="2" height="2" fill="#FEF08A" />
              <rect x="32" y="5" width="1.5" height="1.5" fill="#15803D" />
            </g>
          )}

          {(avatar.hat === 'hat_sprout_hairpin' || avatar.accessory === 'acc_plant_sprout') && (
            <g id="pixel-hat-sprout">
              {/* Sprout Stem with gradient & root clip */}
              <rect x="30.5" y="-4.5" width="3" height="11" fill="#14532D" />
              <rect x="31" y="-4" width="2" height="10" fill="#16A34A" />
              <rect x="31.5" y="-3.5" width="1" height="9" fill="#4ADE80" />
              {/* Hairpin Clip on Head */}
              <rect x="28" y="5" width="8" height="1.5" fill="#334155" />
              <rect x="29" y="5.2" width="6" height="0.8" fill="#94A3B8" />
              {/* Left Leaf (intricate pixel curves & veins) */}
              <rect x="21" y="-4.5" width="10" height="5.5" fill="#14532D" />
              <rect x="22" y="-4" width="8.5" height="4.5" fill="#16A34A" />
              <rect x="23" y="-3.5" width="7" height="3.5" fill="#22C55E" />
              <rect x="24" y="-3" width="5" height="1.5" fill="#86EFAC" />
              <rect x="22" y="-2" width="1" height="1" fill="#FFFFFF" />
              {/* Right Leaf */}
              <rect x="33" y="-6" width="10.5" height="5.5" fill="#14532D" />
              <rect x="33.5" y="-5.5" width="9" height="4.5" fill="#22C55E" />
              <rect x="34" y="-5" width="7.5" height="3.5" fill="#4ADE80" />
              <rect x="35" y="-4.5" width="5" height="1.5" fill="#BBF7D0" />
              {/* Fresh Morning Dew Drop */}
              <rect x="41.5" y="-3" width="1.8" height="1.8" fill="#38BDF8" />
              <rect x="42" y="-2.8" width="0.8" height="0.8" fill="#FFFFFF" />
            </g>
          )}

          {avatar.hat === 'hat_explorer_helm' && (
            <g id="pixel-hat-safari">
              {/* Dome */}
              <rect x="10.5" y="-1.5" width="43" height="13.5" fill="#92400E" />
              <rect x="11.5" y="-0.5" width="41" height="11.5" fill="#D97706" />
              <rect x="14.5" y="-3.5" width="35" height="4.5" fill="#F59E0B" />
              <rect x="18" y="-2.5" width="28" height="2" fill="#FDE68A" />
              {/* Vent Eyelets */}
              <rect x="20" y="2" width="2" height="2" fill="#78350F" />
              <rect x="42" y="2" width="2" height="2" fill="#78350F" />
              {/* Leather Hat Band with Brass Buckle */}
              <rect x="11.5" y="8" width="41" height="3" fill="#451A03" />
              <rect x="11.5" y="8.5" width="41" height="1.8" fill="#78350F" />
              <rect x="30" y="7.5" width="4" height="4" fill="#F59E0B" />
              <rect x="30.5" y="8.2" width="3" height="2.5" fill="#FEF08A" />
              <rect x="31.2" y="8.8" width="1.5" height="1.3" fill="#451A03" />
              {/* Wide Reinforced Brim */}
              <rect x="4.5" y="10" width="55" height="5.5" fill="#78350F" />
              <rect x="5.5" y="10.5" width="53" height="4" fill="#B45309" />
              <rect x="7" y="11" width="50" height="1.8" fill="#D97706" />
            </g>
          )}

          {avatar.hat === 'hat_graduate_cap' && (
            <g id="pixel-hat-graduate">
              {/* Diamond Mortarboard with perspective shadow */}
              <polygon points="4,4 32,-3.5 60,4 32,10" fill="#020617" />
              <polygon points="5,4 32,-2.8 59,4 32,9" fill="#0F172A" />
              <polygon points="7,4 32,-2 57,4 32,8" fill="#1E293B" />
              <polygon points="12,4 32,-1 52,4 32,7" fill="#334155" />
              {/* Skull Cap under-layer */}
              <rect x="19.5" y="5.5" width="25" height="7.5" fill="#020617" />
              <rect x="20.5" y="6" width="23" height="6.5" fill="#0F172A" />
              {/* Center Golden Button */}
              <rect x="30.5" y="2.5" width="3" height="2.5" fill="#F59E0B" />
              <rect x="31" y="3" width="2" height="1.5" fill="#FEF08A" />
              {/* Hanging Silk Tassel with cord */}
              <line x1="32" y1="4" x2="49" y2="4.5" stroke="#F59E0B" strokeWidth="0.8" />
              <rect x="48.5" y="4" width="2" height="9" fill="#F59E0B" />
              <rect x="49" y="4.5" width="1" height="8" fill="#FDE047" />
              {/* Tassel Band & Brush */}
              <rect x="47.5" y="12.5" width="4" height="1.5" fill="#B45309" />
              <rect x="47" y="14" width="5" height="4" fill="#F59E0B" />
              <rect x="48" y="14.5" width="3" height="3" fill="#FEF08A" />
            </g>
          )}

          {(avatar.hat === 'hat_flower_crown' || avatar.accessory === 'acc_flower_crown') && (
            <g id="pixel-hat-crown">
              {/* Vine circlet */}
              <rect x="10.5" y="5.5" width="43" height="4" fill="#064E3B" />
              <rect x="11.5" y="6" width="41" height="2.5" fill="#15803D" />
              {/* Flower 1: Rose (Left) */}
              <rect x="12" y="2.5" width="6" height="6" fill="#9F1239" />
              <rect x="13" y="3" width="4" height="4" fill="#E11D48" />
              <rect x="14" y="4" width="2" height="2" fill="#FDA4AF" />
              {/* Flower 2: Sunflower */}
              <rect x="20.5" y="1.5" width="6" height="6" fill="#CA8A04" />
              <rect x="21" y="2" width="5" height="5" fill="#FACC15" />
              <rect x="22.5" y="3.5" width="2" height="2" fill="#713F12" />
              {/* Flower 3: Center Orchid */}
              <rect x="29" y="0.5" width="6.5" height="6.5" fill="#86198F" />
              <rect x="29.5" y="1" width="5.5" height="5.5" fill="#C026D3" />
              <rect x="30.5" y="2" width="3.5" height="3.5" fill="#F472B6" />
              <rect x="31.5" y="3" width="1.5" height="1.5" fill="#FEF08A" />
              {/* Flower 4: Blue Cornflower */}
              <rect x="38" y="1.5" width="6" height="6" fill="#0369A1" />
              <rect x="38.5" y="2" width="5" height="5" fill="#0284C7" />
              <rect x="39.5" y="3" width="3" height="3" fill="#7DD3FC" />
              <rect x="40.5" y="4" width="1" height="1" fill="#FFFFFF" />
              {/* Flower 5: Poppy (Right) */}
              <rect x="46" y="2.5" width="6" height="6" fill="#991B1B" />
              <rect x="47" y="3" width="4" height="4" fill="#DC2626" />
              <rect x="48" y="4" width="2" height="2" fill="#FCA5A5" />
            </g>
          )}

          {avatar.hat === 'hat_golden_halo' && (
            <g id="pixel-hat-halo" className="animate-pulse">
              {/* Floating Radiant Halo with inner shimmer */}
              <ellipse cx="32" cy="-2" rx="17" ry="4.5" fill="none" stroke="#B45309" strokeWidth="2.5" />
              <ellipse cx="32" cy="-2" rx="17" ry="4.5" fill="none" stroke="#F59E0B" strokeWidth="1.8" />
              <ellipse cx="32" cy="-2" rx="16.5" ry="4" fill="none" stroke="#FDE047" strokeWidth="1" />
              <ellipse cx="32" cy="-2" rx="16" ry="3.5" fill="none" stroke="#FFFFFF" strokeWidth="0.6" strokeDasharray="3 4" />
              {/* Sparkles */}
              <rect x="17" y="-5" width="1.5" height="1.5" fill="#FFFFFF" className="animate-sparkle" />
              <rect x="46" y="-5" width="1.5" height="1.5" fill="#FFFFFF" className="animate-sparkle" />
              <rect x="32" y="-7" width="2" height="2" fill="#FEF08A" className="animate-sparkle" />
            </g>
          )}

          {avatar.hat === 'hat_purifier_crown' && (
            <g id="pixel-hat-purifier-crown">
              {/* Crown Base with Emerald & Platinum Accents */}
              <polygon points="11,6 17,0.5 24,5.5 32,-1.5 40,5.5 47,0.5 53,6 51,11.5 13,11.5" fill="#064E3B" />
              <polygon points="12,6.5 17,1.5 24,6 32,-0.5 40,6 47,1.5 52,6.5 50,11 14,11" fill="#059669" />
              <rect x="13.5" y="9" width="37" height="3" fill="#10B981" />
              <rect x="14" y="9.5" width="36" height="1.5" fill="#6EE7B7" />
              {/* Cut Emerald Facets */}
              <rect x="21" y="7.5" width="3.5" height="3.5" fill="#047857" />
              <rect x="21.5" y="8" width="2.5" height="2.5" fill="#34D399" />
              <rect x="22" y="8.5" width="1.5" height="1.5" fill="#FFFFFF" />

              <rect x="30" y="4" width="4" height="5" fill="#047857" />
              <rect x="30.5" y="4.5" width="3" height="4" fill="#34D399" />
              <rect x="31" y="5" width="1.5" height="2" fill="#FFFFFF" />

              <rect x="39.5" y="7.5" width="3.5" height="3.5" fill="#047857" />
              <rect x="40" y="8" width="2.5" height="2.5" fill="#34D399" />
              <rect x="40.5" y="8.5" width="1.5" height="1.5" fill="#FFFFFF" />
              {/* Purifier Floating Tear Gem */}
              <polygon points="32,-6 30,-3 34,-3" fill="#0284C7" />
              <polygon points="32,-6.5 30.5,-3.5 33.5,-3.5" fill="#38BDF8" />
              <rect x="31" y="-3" width="2" height="2" fill="#E0F2FE" />
            </g>
          )}
        </g>

        {/* ============================================================ */}
        {/* 8. LAYER: ACCESSORY (高密度ピクセル・装飾品・眼鏡・バッジ) */}
        {/* ============================================================ */}
        <g id="layer-pixel-accessory">
          {avatar.accessory === 'acc_glasses' && (
            <g id="pixel-glasses">
              {/* Left Lens Frame (Detailed Acetate Horn-rimmed) */}
              <rect x="18" y="15" width="11" height="12" fill="none" stroke="#451A03" strokeWidth="1.8" />
              <rect x="18.5" y="15.5" width="10" height="11" fill="none" stroke="#78350F" strokeWidth="1" />
              <rect x="19" y="16" width="9" height="10" fill="#E0F2FE" opacity="0.3" />
              {/* Anti-glare Lens Reflection */}
              <line x1="20" y1="17" x2="25" y2="23" stroke="#FFFFFF" strokeWidth="1" opacity="0.75" />
              <line x1="22" y1="17" x2="26" y2="22" stroke="#FFFFFF" strokeWidth="0.6" opacity="0.5" />
              {/* Right Lens Frame */}
              <rect x="35" y="15" width="11" height="12" fill="none" stroke="#451A03" strokeWidth="1.8" />
              <rect x="35.5" y="15.5" width="10" height="11" fill="none" stroke="#78350F" strokeWidth="1" />
              <rect x="36" y="16" width="9" height="10" fill="#E0F2FE" opacity="0.3" />
              <line x1="37" y1="17" x2="42" y2="23" stroke="#FFFFFF" strokeWidth="1" opacity="0.75" />
              <line x1="39" y1="17" x2="43" y2="22" stroke="#FFFFFF" strokeWidth="0.6" opacity="0.5" />
              {/* Keyhole Bridge & Temple Screws */}
              <rect x="28" y="18" width="8" height="1.8" fill="#451A03" />
              <rect x="28.5" y="18.5" width="7" height="0.8" fill="#D97706" />
              <rect x="17.5" y="17" width="1.5" height="1.5" fill="#F59E0B" />
              <rect x="45" y="17" width="1.5" height="1.5" fill="#F59E0B" />
            </g>
          )}

          {avatar.accessory === 'acc_star_necklace' && (
            <g id="pixel-necklace">
              {/* Gold Link Chain */}
              <line x1="25" y1="36" x2="32" y2="39.5" stroke="#B45309" strokeWidth="1.2" strokeDasharray="1 1" />
              <line x1="39" y1="36" x2="32" y2="39.5" stroke="#B45309" strokeWidth="1.2" strokeDasharray="1 1" />
              <line x1="25" y1="36" x2="32" y2="39.5" stroke="#F59E0B" strokeWidth="0.8" />
              <line x1="39" y1="36" x2="32" y2="39.5" stroke="#F59E0B" strokeWidth="0.8" />
              {/* 8-Pointed Star Pendant */}
              <rect x="30" y="39" width="4" height="4" fill="#B45309" />
              <polygon points="32,38 34,41 32,44 30,41" fill="#FBBF24" />
              <polygon points="29,41 32,39 35,41 32,43" fill="#FDE047" />
              <rect x="31.2" y="40.2" width="1.6" height="1.6" fill="#FFFFFF" />
            </g>
          )}

          {avatar.accessory === 'acc_earth_badge' && (
            <g id="pixel-earth-badge">
              {/* Detailed Earth Pin Badge */}
              <rect x="35" y="37" width="7" height="7" fill="#0C4A6E" />
              <rect x="35.5" y="37.5" width="6" height="6" fill="#0284C7" />
              {/* Continents */}
              <rect x="36.5" y="38" width="2" height="2" fill="#15803D" />
              <rect x="36" y="39.5" width="3" height="1.5" fill="#22C55E" />
              <rect x="39" y="40" width="2.2" height="2.5" fill="#22C55E" />
              <rect x="39.5" y="38.5" width="1.5" height="1" fill="#86EFAC" />
              {/* Pin Rim & Glint */}
              <rect x="35.5" y="37.5" width="1" height="1" fill="#FFFFFF" />
            </g>
          )}

          {avatar.accessory === 'acc_eco_bag' && (
            <g id="pixel-eco-bag">
              {/* Shoulder Strap */}
              <line x1="32" y1="36" x2="45" y2="44" stroke="#92400E" strokeWidth="1.8" />
              <line x1="32" y1="36" x2="45" y2="44" stroke="#D97706" strokeWidth="1" />
              {/* Canvas Tote Body with cross-weave texture */}
              <rect x="42.5" y="43.5" width="12" height="12" fill="#78350F" />
              <rect x="43" y="44" width="11" height="11" fill="#FEF3C7" />
              <rect x="44" y="45" width="9" height="9" fill="#FDE68A" />
              {/* Bag Handles */}
              <rect x="45.5" y="42" width="2" height="3" fill="#D97706" />
              <rect x="50.5" y="42" width="2" height="3" fill="#D97706" />
              {/* Vibrant Green Recycle Loop Emblem */}
              <rect x="46.5" y="47.5" width="4" height="4" fill="#15803D" />
              <rect x="47" y="48" width="3" height="3" fill="#22C55E" />
              <rect x="48" y="49" width="1" height="1" fill="#FDE68A" />
            </g>
          )}

          {avatar.accessory === 'acc_volunteer_whistle' && (
            <g id="pixel-whistle">
              <line x1="32" y1="37" x2="27" y2="40" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="1 1" />
              {/* Orange Whistle with metallic chamber */}
              <rect x="25" y="39" width="4.5" height="3.5" fill="#9A3412" />
              <rect x="25.5" y="39.5" width="3.5" height="2.5" fill="#EA580C" />
              <rect x="28.5" y="40" width="2.5" height="1.5" fill="#F97316" />
              <rect x="26" y="40" width="1" height="1" fill="#CBD5E1" />
            </g>
          )}
        </g>

        {/* ============================================================ */}
        {/* 9. LAYER: PET (高密度ピクセルペット・表情・ハイライト) */}
        {/* ============================================================ */}
        <g id="layer-pixel-pet">
          {avatar.pet === 'pet_sprout_spirit' && (
            <g id="pixel-pet-spirit" transform="translate(43, 38)" className="animate-pixel-float">
              {/* Spirit Body Shading */}
              <rect x="1.5" y="3.5" width="11" height="11" fill="#15803D" />
              <rect x="2" y="4" width="10" height="10" fill="#22C55E" />
              <rect x="3" y="3" width="8" height="10" fill="#4ADE80" />
              <rect x="4" y="4" width="6" height="8" fill="#86EFAC" />
              {/* Floating Sprout on Pet Head */}
              <rect x="6" y="-0.5" width="2" height="4.5" fill="#15803D" />
              <rect x="6.5" y="0" width="1" height="3.5" fill="#22C55E" />
              <rect x="3.5" y="-1" width="3" height="2.5" fill="#22C55E" />
              <rect x="4" y="-0.5" width="2" height="1.5" fill="#86EFAC" />
              <rect x="7.5" y="-1" width="3" height="2.5" fill="#4ADE80" />
              {/* Chibi Eyes with White Catchlights */}
              <rect x="3.5" y="6.5" width="2.5" height="3" fill="#064E3B" />
              <rect x="4" y="7" width="1" height="1" fill="#FFFFFF" />
              <rect x="8" y="6.5" width="2.5" height="3" fill="#064E3B" />
              <rect x="8.5" y="7" width="1" height="1" fill="#FFFFFF" />
              {/* Blush & Smile */}
              <rect x="2.5" y="9.5" width="2" height="1" fill="#FB7185" />
              <rect x="9.5" y="9.5" width="2" height="1" fill="#FB7185" />
              <rect x="6" y="9" width="2" height="1" fill="#064E3B" />
            </g>
          )}

          {avatar.pet === 'pet_calico_cat' && (
            <g id="pixel-pet-cat" transform="translate(43, 42)">
              {/* Cat Body with fur texture */}
              <rect x="1.5" y="3.5" width="13" height="11" fill="#94A3B8" />
              <rect x="2" y="4" width="12" height="10" fill="#F8FAFC" />
              {/* Pointed Ears with inner pink */}
              <rect x="2" y="0.5" width="3.5" height="4.5" fill="#C2410C" />
              <rect x="2.5" y="1" width="2.5" height="3.5" fill="#EA580C" />
              <rect x="3" y="2" width="1.5" height="2" fill="#FCE7F3" />
              <rect x="10.5" y="0.5" width="3.5" height="4.5" fill="#0F172A" />
              <rect x="11" y="1" width="2.5" height="3.5" fill="#334155" />
              <rect x="11.5" y="2" width="1.5" height="2" fill="#FCE7F3" />
              {/* Calico Patches */}
              <rect x="2" y="5" width="4.5" height="4" fill="#EA580C" />
              <rect x="9" y="4" width="4" height="4.5" fill="#334155" />
              {/* Big Cat Eyes & Whiskers */}
              <rect x="4.5" y="6.5" width="2.2" height="2.5" fill="#0F172A" />
              <rect x="5" y="7" width="1" height="1" fill="#6EE7B7" />
              <rect x="8.5" y="6.5" width="2.2" height="2.5" fill="#0F172A" />
              <rect x="9" y="7" width="1" height="1" fill="#6EE7B7" />
              {/* Nose & Mouth */}
              <rect x="7" y="8.5" width="1.5" height="1" fill="#FB7185" />
              {/* Tail */}
              <rect x="13.5" y="5.5" width="2.5" height="6.5" fill="#C2410C" />
              <rect x="14" y="6" width="1.5" height="5.5" fill="#EA580C" />
              <rect x="14" y="10" width="1.5" height="1.5" fill="#F8FAFC" />
            </g>
          )}

          {avatar.pet === 'pet_shiba_dog' && (
            <g id="pixel-pet-dog" transform="translate(5, 42)">
              {/* Shiba Body */}
              <rect x="1.5" y="3.5" width="13" height="11" fill="#92400E" />
              <rect x="2" y="4" width="12" height="10" fill="#D97706" />
              <rect x="3.5" y="5.5" width="9" height="8.5" fill="#FEF3C7" />
              {/* Ears */}
              <rect x="2" y="0.5" width="3.5" height="4.5" fill="#92400E" />
              <rect x="2.5" y="1" width="2.5" height="3.5" fill="#B45309" />
              <rect x="3" y="2" width="1.5" height="2" fill="#FEF3C7" />
              <rect x="10.5" y="0.5" width="3.5" height="4.5" fill="#92400E" />
              <rect x="11" y="1" width="2.5" height="3.5" fill="#B45309" />
              <rect x="11.5" y="2" width="1.5" height="2" fill="#FEF3C7" />
              {/* Shiba Brows (麿眉) */}
              <rect x="4" y="5" width="1.5" height="1" fill="#FFFFFF" />
              <rect x="10" y="5" width="1.5" height="1" fill="#FFFFFF" />
              {/* Eyes & Wet Nose */}
              <rect x="4" y="6.5" width="2" height="2" fill="#1E293B" />
              <rect x="4.5" y="7" width="0.8" height="0.8" fill="#FFFFFF" />
              <rect x="9.5" y="6.5" width="2" height="2" fill="#1E293B" />
              <rect x="10" y="7" width="0.8" height="0.8" fill="#FFFFFF" />
              <rect x="7" y="7.5" width="2" height="2" fill="#0F172A" />
              <rect x="7.2" y="7.8" width="0.8" height="0.6" fill="#64748B" />
              {/* Curly Tail */}
              <rect x="-0.5" y="3.5" width="3" height="4.5" fill="#D97706" />
              <rect x="0" y="4" width="2" height="3.5" fill="#FDE68A" />
            </g>
          )}

          {avatar.pet === 'pet_white_bunny' && (
            <g id="pixel-pet-bunny" transform="translate(7, 40)">
              {/* Bunny Body */}
              <rect x="1.5" y="5.5" width="11" height="11" fill="#CBD5E1" />
              <rect x="2" y="6" width="10" height="10" fill="#FFFFFF" />
              {/* Long Ears with inner pink gradients */}
              <rect x="2.5" y="-0.5" width="3.5" height="7.5" fill="#E2E8F0" />
              <rect x="3" y="0" width="2.5" height="6.5" fill="#FFFFFF" />
              <rect x="3.5" y="1" width="1.5" height="5" fill="#FBCFE8" />
              <rect x="7.5" y="-0.5" width="3.5" height="7.5" fill="#E2E8F0" />
              <rect x="8" y="0" width="2.5" height="6.5" fill="#FFFFFF" />
              <rect x="8.5" y="1" width="1.5" height="5" fill="#FBCFE8" />
              {/* Ruby Red Eyes */}
              <rect x="3.5" y="8.5" width="2.2" height="2.5" fill="#9F1239" />
              <rect x="4" y="9" width="1" height="1" fill="#FDA4AF" />
              <rect x="7.5" y="8.5" width="2.2" height="2.5" fill="#9F1239" />
              <rect x="8" y="9" width="1" height="1" fill="#FDA4AF" />
              {/* Twitching Pink Nose */}
              <rect x="5.8" y="10.5" width="1.8" height="1.2" fill="#F43F5E" />
            </g>
          )}

          {avatar.pet === 'pet_forest_owl' && (
            <g id="pixel-pet-owl" transform="translate(45, 38)">
              {/* Owl Body */}
              <rect x="1.5" y="1.5" width="11" height="13" fill="#451A03" />
              <rect x="2" y="2" width="10" height="12" fill="#78350F" />
              <rect x="3.5" y="3.5" width="7" height="9" fill="#FEF3C7" />
              {/* Tuft Ears */}
              <rect x="2" y="0" width="2" height="3" fill="#451A03" />
              <rect x="10" y="0" width="2" height="3" fill="#451A03" />
              {/* Huge Golden Eyes */}
              <rect x="2.5" y="3.5" width="3.5" height="3.5" fill="#CA8A04" />
              <rect x="3" y="4" width="2.5" height="2.5" fill="#FEF08A" />
              <rect x="4" y="5" width="1.2" height="1.2" fill="#0F172A" />
              <rect x="8" y="3.5" width="3.5" height="3.5" fill="#CA8A04" />
              <rect x="8.5" y="4" width="2.5" height="2.5" fill="#FEF08A" />
              <rect x="9.5" y="5" width="1.2" height="1.2" fill="#0F172A" />
              {/* Beak & Claws */}
              <polygon points="7,7 6,9 8,9" fill="#F59E0B" />
              <rect x="4" y="13.5" width="2" height="1.5" fill="#F59E0B" />
              <rect x="8" y="13.5" width="2" height="1.5" fill="#F59E0B" />
            </g>
          )}

          {avatar.pet === 'pet_world_dragon' && (
            <g id="pixel-pet-dragon" transform="translate(43, 36)" className="animate-pixel-float">
              {/* Dragon Scales Base */}
              <rect x="1.5" y="3.5" width="13" height="13" fill="#022C22" />
              <rect x="2" y="4" width="12" height="12" fill="#065F46" />
              <rect x="3.5" y="5.5" width="9" height="9" fill="#10B981" />
              <rect x="5" y="7" width="6" height="6" fill="#6EE7B7" />
              {/* Golden Horns with facets */}
              <polygon points="3,4 1,0 4,1" fill="#B45309" />
              <polygon points="3,3.5 1.5,0.5 3.5,1.5" fill="#FBBF24" />
              <polygon points="12,4 14,0 11,1" fill="#B45309" />
              <polygon points="12,3.5 13.5,0.5 11.5,1.5" fill="#FBBF24" />
              {/* Slit Dragon Eyes */}
              <rect x="3.5" y="6.5" width="2.5" height="2.5" fill="#EAB308" />
              <rect x="4.5" y="6.5" width="0.8" height="2.5" fill="#022C22" />
              <rect x="9.5" y="6.5" width="2.5" height="2.5" fill="#EAB308" />
              <rect x="10.5" y="6.5" width="0.8" height="2.5" fill="#022C22" />
              {/* Azure Mystic Flame from Maw */}
              <polygon points="7,15 5,18 9,18" fill="#0284C7" />
              <polygon points="7,15.5 5.8,17.5 8.2,17.5" fill="#38BDF8" />
              <rect x="6.5" y="16.5" width="1" height="1" fill="#FFFFFF" />
            </g>
          )}

          {avatar.pet === 'pet_pure_slime' && (
            <g id="pixel-pet-pure-slime" transform="translate(43, 40)" className="animate-bounce-gentle">
              {/* Translucent Water Slime Body with inner specular light */}
              <ellipse cx="7.5" cy="8.5" rx="6.5" ry="5.5" fill="#0284C7" />
              <ellipse cx="7.5" cy="8" rx="6" ry="5" fill="#38BDF8" />
              <ellipse cx="7.5" cy="7" rx="5" ry="4" fill="#7DD3FC" />
              <ellipse cx="7.5" cy="6" rx="3.5" ry="2.5" fill="#BAE6FD" />
              {/* Cute Waterdrop Sprout */}
              <polygon points="7.5,0.5 6,3 9,3" fill="#0369A1" />
              <polygon points="7.5,1 6.5,2.8 8.5,2.8" fill="#38BDF8" />
              {/* Cheerful Expression */}
              <rect x="4.5" y="6.5" width="1.8" height="2" fill="#0369A1" />
              <rect x="5" y="6.8" width="0.8" height="0.8" fill="#FFFFFF" />
              <rect x="8.5" y="6.5" width="1.8" height="2" fill="#0369A1" />
              <rect x="9" y="6.8" width="0.8" height="0.8" fill="#FFFFFF" />
              <rect x="6.5" y="8" width="2" height="1" fill="#F43F5E" />
              {/* Specular Highlight Glint */}
              <rect x="3.5" y="4.5" width="2" height="1.5" fill="#FFFFFF" opacity="0.9" />
            </g>
          )}
        </g>

        {/* ============================================================ */}
        {/* 10. LAYER: SPECIAL EFFECT (特殊ドットエフェクト・パーティクル) */}
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
        {/* 11. LAYER: WEAPONS & HELD GEAR (武器・道具・細密ドット) */}
        {/* ============================================================ */}
        <g id="layer-pixel-weapon">
          {avatar.weapon === 'wpn_tongs_blade' && (
            <g id="pixel-tongs-blade" transform="translate(46, 30)">
              {/* Grip */}
              <rect x="3.5" y="13.5" width="4" height="7" fill="#0F172A" />
              <rect x="4" y="14" width="3" height="6" fill="#1E293B" />
              <rect x="4.5" y="15" width="2" height="4" fill="#334155" />
              {/* Tongs metallic arms with bevel */}
              <rect x="2.5" y="1.5" width="2.5" height="13.5" fill="#475569" />
              <rect x="3" y="2" width="1.5" height="13" fill="#94A3B8" />
              <rect x="7" y="1.5" width="2.5" height="13.5" fill="#64748B" />
              <rect x="7.5" y="2" width="1.5" height="13" fill="#CBD5E1" />
              {/* Tips */}
              <polygon points="3,2 0.5,5 3,5" fill="#334155" />
              <polygon points="9.5,2 12,5 9.5,5" fill="#475569" />
              {/* Green Energy Core Glow */}
              <rect x="4" y="5.5" width="4" height="3" fill="#15803D" />
              <rect x="4.5" y="6" width="3" height="2" fill="#22C55E" />
              <rect x="5.2" y="6.5" width="1.6" height="1" fill="#86EFAC" />
            </g>
          )}

          {avatar.weapon === 'wpn_gaia_staff' && (
            <g id="pixel-gaia-staff" transform="translate(46, 22)" className="animate-pixel-float">
              {/* Staff Shaft with woodgrain */}
              <rect x="3.5" y="5.5" width="4" height="27" fill="#451A03" />
              <rect x="4" y="6" width="3" height="26" fill="#78350F" />
              <rect x="5" y="6" width="1" height="26" fill="#B45309" />
              {/* Crystal Head */}
              <polygon points="5.5,-3 -0.5,5 5.5,13 11.5,5" fill="#064E3B" />
              <polygon points="5.5,-2 0.5,5 5.5,12 10.5,5" fill="#10B981" />
              <polygon points="5.5,0 2.5,5 5.5,10 8.5,5" fill="#6EE7B7" />
              <polygon points="5.5,2 4,5 5.5,8 7,5" fill="#FFFFFF" />
              {/* Entwined Vine & Sprout */}
              <rect x="2" y="11.5" width="2.5" height="3.5" fill="#15803D" />
              <rect x="2.5" y="12" width="1.5" height="2.5" fill="#22C55E" />
              <rect x="6.5" y="15.5" width="2.5" height="3.5" fill="#15803D" />
              <rect x="7" y="16" width="1.5" height="2.5" fill="#22C55E" />
            </g>
          )}

          {avatar.weapon === 'wpn_eco_shield' && (
            <g id="pixel-eco-shield" transform="translate(8, 34)">
              {/* Shield Plate with metallic border */}
              <polygon points="5.5,1.5 16.5,1.5 18.5,10 11,21 3.5,10" fill="#075985" />
              <polygon points="6,2 16,2 18,10 11,20 4,10" fill="#0284C7" />
              <polygon points="7,4 15,4 16,10 11,18 6,10" fill="#38BDF8" />
              {/* Recycle Arrow on Shield */}
              <circle cx="11" cy="9" r="3.5" fill="#FFFFFF" opacity="0.85" />
              <polygon points="11,6.5 13.5,10 8.5,10" fill="#0284C7" />
            </g>
          )}

          {avatar.weapon === 'wpn_recycle_saber' && (
            <g id="pixel-recycle-saber" transform="translate(46, 20)">
              {/* Hilt */}
              <rect x="3.5" y="19.5" width="5" height="7" fill="#020617" />
              <rect x="4" y="20" width="4" height="6" fill="#0F172A" />
              <rect x="2.5" y="18.5" width="7" height="2.5" fill="#B45309" />
              <rect x="3" y="19" width="6" height="1.8" fill="#F59E0B" />
              {/* Luminous Blade */}
              <rect x="4" y="-0.5" width="4" height="20" fill="#0891B2" className="animate-pulse" />
              <rect x="4.5" y="0" width="3" height="19" fill="#06B6D4" />
              <rect x="5" y="0" width="2" height="19" fill="#FFFFFF" />
              <polygon points="6,-3.5 4,0 8,0" fill="#FFFFFF" />
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
