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
    <header className="sticky top-0 z-30 bg-slate-950/95 border-b-2 border-slate-800 backdrop-blur-md shadow-lg" id="app-header">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 py-2.5 flex items-center justify-between gap-3">
        {/* Left: Brand Logo & Tagline */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-9 h-9 bg-amber-500 pixel-box-gold rounded-lg flex items-center justify-center text-slate-950 font-bold font-press-start text-base shadow-sm shrink-0">
            S
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-bold font-press-start tracking-wider text-amber-300">
                SOCIAL QUEST
              </h1>
              <span className="text-[9px] font-bold font-pixel uppercase px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40 hidden sm:inline-block">
                8-BIT RPG
              </span>
            </div>
            <p className="text-[9px] text-slate-400 font-pixel uppercase tracking-widest hidden xs:block">
              社会貢献でドット絵キャラクターを育てよう
            </p>
          </div>
        </div>

        {/* Center/Right: Level & XP Bar + Quick Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Level & XP Gauge */}
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-[9px] font-bold font-press-start text-amber-400">
                LV.{level}
              </span>
              <div className="w-20 sm:w-36 h-2 bg-slate-900 rounded overflow-hidden border border-slate-700">
                <div
                  className="h-full bg-emerald-500 rounded transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="text-[10px] font-pixel text-emerald-400 whitespace-nowrap hidden sm:inline">
                {currentXp}/{nextLevelXp} XP
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-pixel mt-0.5 hidden md:block">
              冒険者: <span className="text-slate-200 font-bold">{user.name}</span>
            </p>
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Sound Toggle */}
            <button
              onClick={handleToggleMute}
              className="w-8 h-8 rounded-lg border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-300 flex items-center justify-center transition pixel-btn"
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
                className="h-8 px-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-amber-300 text-xs font-pixel font-bold flex items-center gap-1 transition pixel-btn hidden sm:flex"
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
              className="h-8 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold font-pixel text-xs pixel-btn flex items-center gap-1 shadow-md"
              id="header-record-btn"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>記録</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
