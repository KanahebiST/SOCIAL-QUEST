import React, { useState } from 'react';
import { UserProfile } from '../types';
import { getLevelForXp } from '../data/initialData';
import { Volume2, VolumeX, Flame, Plus, Sparkles, Compass } from 'lucide-react';
import { audio } from '../utils/audio';

interface HeaderProps {
  user: UserProfile;
  onOpenContributionModal: () => void;
  onOpenWorldTree: () => void;
  onOpenWorldMap?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  onOpenContributionModal,
  onOpenWorldTree,
  onOpenWorldMap,
}) => {
  const [isMuted, setIsMuted] = useState<boolean>(audio.getMuted());
  const { level, currentXp, nextLevelXp, progressPercent } = getLevelForXp(user.xp);

  const handleToggleMute = () => {
    const next = audio.toggleMute();
    setIsMuted(next);
  };

  return (
    <header className="sticky top-0 z-30 bg-slate-950/95 border-b-2 border-slate-800 backdrop-blur-md shadow-lg w-full" id="app-header">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 py-2 sm:py-2.5 flex items-center justify-between gap-2 sm:gap-3">
        {/* Left: Brand Logo & Tagline */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-0 flex-shrink">
          <div className="w-7 h-7 sm:w-9 sm:h-9 bg-amber-500 pixel-box-gold rounded-lg flex items-center justify-center text-slate-950 font-bold font-press-start text-xs sm:text-base shadow-sm shrink-0">
            S
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1 sm:gap-2">
              <h1 className="text-[10px] sm:text-sm md:text-base font-bold font-press-start tracking-tight sm:tracking-wider text-amber-300 truncate">
                SOCIAL QUEST
              </h1>
              <span className="text-[8px] sm:text-[9px] font-bold font-pixel uppercase px-1 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40 hidden md:inline-block">
                8-BIT RPG
              </span>
            </div>
            <p className="text-[8px] sm:text-[9px] text-slate-400 font-pixel uppercase tracking-widest hidden md:block">
              社会貢献でドット絵キャラクターを育てよう
            </p>
          </div>
        </div>

        {/* Center/Right: Level & XP Bar + Quick Actions */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0 ml-auto pl-1">
          {/* Level & XP Gauge */}
          <div className="flex flex-col items-end shrink-0">
            <div className="flex items-center gap-1 sm:gap-1.5">
              <span className="text-[8px] sm:text-[9px] font-bold font-press-start text-amber-400 whitespace-nowrap">
                LV.{level}
              </span>
              <div className="w-10 sm:w-28 md:w-36 h-1.5 sm:h-2 bg-slate-900 rounded overflow-hidden border border-slate-700 shrink-0">
                <div
                  className="h-full bg-emerald-500 rounded transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="text-[9px] sm:text-[10px] font-pixel text-emerald-400 whitespace-nowrap">
                次のLvまで{Math.max(0, nextLevelXp - currentXp)}XP
              </span>
            </div>
            <p className="text-[9px] text-slate-400 font-pixel mt-0.5 hidden lg:block">
              冒険者: <span className="text-slate-200 font-bold">{user.name}</span>
            </p>
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Sound Toggle */}
            <button
              onClick={handleToggleMute}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-300 flex items-center justify-center transition pixel-btn shrink-0"
              title={isMuted ? '音声ミュート解除' : '8-bit サウンドをミュート'}
              id="sound-toggle-btn"
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5 text-slate-500" /> : <Volume2 className="w-3.5 h-3.5 text-amber-400" />}
            </button>

            {/* World Map quick button */}
            {onOpenWorldMap && (
              <button
                onClick={() => {
                  audio.playClick();
                  onOpenWorldMap();
                }}
                className="h-7 sm:h-8 px-2 sm:px-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-amber-300 text-[10px] sm:text-xs font-pixel font-bold flex items-center gap-1 transition pixel-btn hidden sm:flex shrink-0"
                title="ワールドマップ"
                id="header-world-map-btn"
              >
                <span>🗺️</span>
                <span>地図</span>
              </button>
            )}

            {/* Quick Log CTA */}
            <button
              onClick={() => {
                audio.playClick();
                onOpenContributionModal();
              }}
              className="h-7 sm:h-8 px-2.5 sm:px-3.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold font-pixel text-xs pixel-btn flex items-center gap-1 shadow-md shrink-0 whitespace-nowrap active:scale-95 transition-transform border border-emerald-300/40"
              id="header-record-btn"
            >
              <Plus className="w-3.5 h-3.5 shrink-0 stroke-[2.5]" />
              <span className="font-bold">記録</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
