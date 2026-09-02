import React from 'react';

interface MonsterPixelArtProps {
  type: string;
  size?: number;
  className?: string;
  isHit?: boolean;
  isAttacking?: boolean;
  isPurified?: boolean;
  isDefeated?: boolean;
}

export const MonsterPixelArt: React.FC<MonsterPixelArtProps> = ({
  type,
  size = 180,
  className = '',
  isHit = false,
  isAttacking = false,
  isPurified = false,
  isDefeated = false,
}) => {
  return (
    <div
      className={`relative inline-flex items-center justify-center select-none transition-all duration-300 ${
        isHit ? 'brightness-200 saturate-200 translate-x-2' : ''
      } ${isAttacking ? '-translate-y-4 scale-110' : ''} ${
        isPurified ? 'hue-rotate-90 filter drop-shadow-[0_0_20px_rgba(52,211,153,0.9)] animate-pulse' : ''
      } ${isDefeated ? 'opacity-40 scale-90 blur-[1px]' : ''} ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 64 64"
        width={size}
        height={size}
        className="w-full h-full [image-rendering:pixelated] drop-shadow-xl overflow-visible"
      >
        {/* ============================================================ */}
        {/* 1. PLASTIC SLIME (プラスチックスライム) */}
        {/* ============================================================ */}
        {type === 'plastic_slime' && (
          <g id="monster-plastic-slime" className={!isDefeated && !isHit ? 'animate-bounce-gentle' : ''}>
            {/* Slime Base Gelatinous Body */}
            <ellipse cx="32" cy="40" rx="22" ry="18" fill="#0891B2" opacity="0.9" />
            <ellipse cx="32" cy="38" rx="20" ry="16" fill="#06B6D4" />
            <ellipse cx="30" cy="35" rx="16" ry="12" fill="#22D3EE" />

            {/* Trapped Plastic Bottle Floating Inside */}
            <rect x="24" y="32" width="6" height="12" rx="1" fill="#FFFFFF" opacity="0.85" />
            <rect x="25.5" y="30" width="3" height="3" fill="#3B82F6" />
            <line x1="24" y1="36" x2="30" y2="36" stroke="#0284C7" strokeWidth="1" />

            {/* Plastic Straw */}
            <line x1="38" y1="24" x2="33" y2="44" stroke="#F43F5E" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="38" y1="24" x2="43" y2="20" stroke="#F43F5E" strokeWidth="2.5" strokeLinecap="round" />

            {/* Plastic Bag Bits */}
            <polygon points="16,36 12,30 18,32" fill="#E2E8F0" opacity="0.75" />
            <polygon points="46,38 52,32 48,34" fill="#E2E8F0" opacity="0.75" />

            {/* Pixel Highlight Gloss */}
            <rect x="20" y="26" width="6" height="3" fill="#FFFFFF" opacity="0.9" />
            <rect x="26" y="29" width="3" height="2" fill="#FFFFFF" opacity="0.8" />

            {/* Monster Eyes */}
            <rect x="22" y="32" width="4" height="6" fill="#0F172A" />
            <rect x="23" y="33" width="2" height="2" fill="#FFFFFF" />
            <rect x="38" y="32" width="4" height="6" fill="#0F172A" />
            <rect x="39" y="33" width="2" height="2" fill="#FFFFFF" />

            {/* Angry/Dripping Mouth */}
            <path d="M 28 42 Q 32 46 36 42" stroke="#083344" strokeWidth="2" fill="none" strokeLinecap="round" />
            {/* Dripping Ooze Bottom */}
            <rect x="18" y="52" width="4" height="3" fill="#0891B2" />
            <rect x="42" y="52" width="5" height="4" fill="#0891B2" />
          </g>
        )}

        {/* ============================================================ */}
        {/* 2. SMOG GHOST (スモッグゴースト) */}
        {/* ============================================================ */}
        {type === 'smog_ghost' && (
          <g id="monster-smog-ghost" className={!isDefeated && !isHit ? 'animate-pixel-float' : ''}>
            {/* Dark Cloud Shadow / Smoke Body */}
            <circle cx="32" cy="26" r="16" fill="#334155" />
            <circle cx="20" cy="28" r="12" fill="#475569" />
            <circle cx="44" cy="28" r="12" fill="#475569" />
            <circle cx="28" cy="16" r="10" fill="#64748B" />
            <circle cx="38" cy="18" r="9" fill="#64748B" />

            {/* Ghost Smoky Tail */}
            <path d="M 18 36 Q 32 58 20 60 Q 34 50 44 48 Q 48 38 46 34 Z" fill="#334155" />
            <circle cx="16" cy="56" r="3" fill="#64748B" opacity="0.6" />
            <circle cx="46" cy="52" r="4" fill="#475569" opacity="0.7" />

            {/* Exhaust Pipe Stuck on Head */}
            <rect x="28" y="4" width="8" height="12" fill="#1E293B" stroke="#0F172A" strokeWidth="1" />
            <rect x="27" y="3" width="10" height="3" fill="#0F172A" />
            {/* Smoke Poof from Pipe */}
            <circle cx="32" cy="0" r="4" fill="#94A3B8" opacity="0.7" />
            <circle cx="36" cy="-4" r="3" fill="#CBD5E1" opacity="0.5" />

            {/* Glowing Yellow-Red Smog Eyes */}
            <rect x="22" y="24" width="6" height="5" fill="#EF4444" />
            <rect x="24" y="25" width="2" height="3" fill="#FEF08A" />
            <rect x="36" y="24" width="6" height="5" fill="#EF4444" />
            <rect x="38" y="25" width="2" height="3" fill="#FEF08A" />

            {/* Jagged Ghost Mouth */}
            <polygon points="26,35 28,38 30,35 32,38 34,35 36,38 38,35 32,41" fill="#0F172A" />
          </g>
        )}

        {/* ============================================================ */}
        {/* 3. FOOD LOSS DEMON (フードロスデーモン) */}
        {/* ============================================================ */}
        {type === 'food_loss_demon' && (
          <g id="monster-food-demon" className={!isDefeated && !isHit ? 'animate-bounce-gentle' : ''}>
            {/* Giant Moldy Burger Demon Body */}
            {/* Top Bun */}
            <ellipse cx="32" cy="22" rx="20" ry="12" fill="#C2410C" />
            <ellipse cx="32" cy="20" rx="18" ry="10" fill="#EA580C" />
            {/* Mold Patches */}
            <circle cx="24" cy="18" r="3" fill="#15803D" />
            <circle cx="40" cy="16" r="2.5" fill="#166534" />
            <circle cx="32" cy="14" r="2" fill="#22C55E" />

            {/* Demonic Horns */}
            <polygon points="14,16 8,6 18,12" fill="#7C2D12" />
            <polygon points="50,16 56,6 46,12" fill="#7C2D12" />

            {/* Rotten Patty / Middle Layer with Teeth */}
            <rect x="12" y="28" width="40" height="10" rx="4" fill="#451A03" />
            {/* Sharp Rotten Teeth in Burger Mouth */}
            <polygon points="16,28 19,34 22,28" fill="#FEF08A" />
            <polygon points="24,28 27,35 30,28" fill="#FEF08A" />
            <polygon points="32,28 35,35 38,28" fill="#FEF08A" />
            <polygon points="40,28 43,34 46,28" fill="#FEF08A" />
            <polygon points="20,38 23,32 26,38" fill="#FEF08A" />
            <polygon points="28,38 31,31 34,38" fill="#FEF08A" />
            <polygon points="36,38 39,32 42,38" fill="#FEF08A" />

            {/* Dripping Purple/Green Rotten Sauce */}
            <path d="M 14 38 C 14 44 18 44 18 38 C 22 46 26 46 26 38 C 30 48 34 48 34 38 C 38 46 42 46 42 38 C 46 44 50 44 50 38 Z" fill="#65A30D" />

            {/* Bottom Bun */}
            <rect x="14" y="44" width="36" height="8" rx="3" fill="#C2410C" />

            {/* Wicked Demon Eyes */}
            <circle cx="22" cy="22" r="4" fill="#7F1D1D" />
            <circle cx="22" cy="22" r="2" fill="#FACC15" />
            <circle cx="42" cy="22" r="4" fill="#7F1D1D" />
            <circle cx="42" cy="22" r="2" fill="#FACC15" />

            {/* Little Fork & Knife Arms */}
            <line x1="8" y1="32" x2="2" y2="24" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
            <line x1="56" y1="32" x2="62" y2="24" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
          </g>
        )}

        {/* ============================================================ */}
        {/* 4. FAKE NEWS GOLEM (フェイクニュースゴーレム) */}
        {/* ============================================================ */}
        {type === 'fake_news_golem' && (
          <g id="monster-fake-news-golem" className={!isDefeated && !isHit ? 'animate-bounce-gentle' : ''}>
            {/* Golem Mud/Stone Torso */}
            <rect x="16" y="20" width="32" height="34" rx="4" fill="#3B0764" />
            <rect x="18" y="22" width="28" height="30" fill="#581C87" />

            {/* Embedded Smartphone & Glitched Screens */}
            <rect x="22" y="26" width="20" height="22" rx="2" fill="#0F172A" stroke="#A855F7" strokeWidth="1.5" />
            {/* Glitch Scanlines on Screen */}
            <line x1="24" y1="30" x2="40" y2="30" stroke="#EF4444" strokeWidth="1.5" />
            <line x1="24" y1="34" x2="36" y2="34" stroke="#22D3EE" strokeWidth="1.5" />
            <line x1="24" y1="38" x2="38" y2="38" stroke="#FACC15" strokeWidth="1.5" />
            <line x1="24" y1="42" x2="34" y2="42" stroke="#A855F7" strokeWidth="1.5" />

            {/* Massive Golem Shoulders & Arms */}
            <rect x="6" y="22" width="10" height="24" rx="3" fill="#3B0764" />
            <rect x="48" y="22" width="10" height="24" rx="3" fill="#3B0764" />
            {/* Spiked Knuckles */}
            <circle cx="11" cy="46" r="3" fill="#A855F7" />
            <circle cx="53" cy="46" r="3" fill="#A855F7" />

            {/* Head with Antenna */}
            <rect x="24" y="8" width="16" height="12" rx="2" fill="#581C87" />
            <line x1="32" y1="8" x2="32" y2="2" stroke="#C084FC" strokeWidth="2" />
            <circle cx="32" cy="2" r="2.5" fill="#EF4444" className="animate-ping" />

            {/* Evil Digital Pixel Eyes */}
            <rect x="26" y="12" width="4" height="3" fill="#EF4444" />
            <rect x="34" y="12" width="4" height="3" fill="#EF4444" />
            {/* Exclamation & Question Marks Orbiting */}
            <text x="6" y="16" fill="#FACC15" fontSize="12" fontWeight="bold" fontFamily="monospace">!?</text>
            <text x="48" y="16" fill="#EF4444" fontSize="12" fontWeight="bold" fontFamily="monospace">FAKE</text>
          </g>
        )}

        {/* ============================================================ */}
        {/* 5. CARBON TITAN (メガ・カーボンギガント BOSS) */}
        {/* ============================================================ */}
        {type === 'carbon_titan' && (
          <g id="monster-carbon-titan" className={!isDefeated && !isHit ? 'animate-pixel-float' : ''}>
            {/* Burning Magma / Coal Colossus Torso */}
            <polygon points="32,8 54,20 50,54 14,54 10,20" fill="#18181B" stroke="#7F1D1D" strokeWidth="2" />
            {/* Magma Cracks */}
            <path d="M 32 14 L 30 26 L 38 34 L 32 48" stroke="#EF4444" strokeWidth="2.5" fill="none" />
            <path d="M 22 28 L 30 36 L 24 46" stroke="#F97316" strokeWidth="2" fill="none" />
            <path d="M 44 26 L 38 36 L 42 46" stroke="#FACC15" strokeWidth="2" fill="none" />

            {/* Core Reactor in Chest (Greenhouse Core) */}
            <circle cx="32" cy="34" r="8" fill="#7F1D1D" />
            <circle cx="32" cy="34" r="6" fill="#DC2626" />
            <circle cx="32" cy="34" r="3" fill="#FEF08A" className="animate-pulse" />

            {/* Factory Chimneys on Shoulders Emitting Smoke */}
            <rect x="12" y="4" width="7" height="16" fill="#27272A" />
            <rect x="45" y="4" width="7" height="16" fill="#27272A" />
            {/* Smoke Plumes */}
            <ellipse cx="15.5" cy="0" rx="5" ry="3" fill="#475569" opacity="0.8" />
            <ellipse cx="48.5" cy="0" rx="5" ry="3" fill="#475569" opacity="0.8" />
            <ellipse cx="13" cy="-4" rx="4" ry="2.5" fill="#64748B" opacity="0.6" />
            <ellipse cx="51" cy="-4" rx="4" ry="2.5" fill="#64748B" opacity="0.6" />

            {/* Titan Crown / Horns of Scorched Earth */}
            <polygon points="26,8 20,-2 28,4" fill="#991B1B" />
            <polygon points="38,8 44,-2 36,4" fill="#991B1B" />
            <polygon points="32,6 32,-4 34,2" fill="#DC2626" />

            {/* Fierce Glowing Flame Eyes */}
            <polygon points="22,18 28,20 22,22" fill="#FACC15" />
            <polygon points="42,18 36,20 42,22" fill="#FACC15" />

            {/* Heatwave Aura Distortion Lines */}
            <path d="M 4 28 Q 8 20 4 12" stroke="#F97316" strokeWidth="1.5" fill="none" opacity="0.7" />
            <path d="M 60 28 Q 56 20 60 12" stroke="#F97316" strokeWidth="1.5" fill="none" opacity="0.7" />
          </g>
        )}
      </svg>
    </div>
  );
};
