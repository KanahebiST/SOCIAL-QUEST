import React, { useEffect } from 'react';
import { AvatarItem } from '../types';
import { Sparkles, ArrowRight, Shirt, Check } from 'lucide-react';
import { audio } from '../utils/audio';
import { RARITY_CONFIG } from '../data/items';
import confetti from 'canvas-confetti';

interface LevelUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  newLevel: number;
  unlockedItems: AvatarItem[];
  onOpenAvatarView?: () => void;
}

export const LevelUpModal: React.FC<LevelUpModalProps> = ({
  isOpen,
  onClose,
  newLevel,
  unlockedItems,
  onOpenAvatarView,
}) => {
  useEffect(() => {
    if (isOpen) {
      audio.playLevelUp();
      try {
        confetti({
          particleCount: 80,
          spread: 80,
          origin: { y: 0.5 },
          colors: ['#F59E0B', '#10B981', '#F43F5E', '#38BDF8'],
        });
      } catch {
        // Ignore
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-fade-in">
      <div
        className="relative w-full max-w-md bg-slate-900 pixel-box-gold rounded-2xl p-5 sm:p-6 shadow-2xl text-center overflow-hidden flex flex-col items-center"
        id="level-up-modal-card"
      >
        {/* Retro 8-bit Level Badge */}
        <div className="relative mb-3 animate-pixel-float">
          <div className="w-20 h-20 rounded-2xl bg-amber-500 pixel-box-gold p-1 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-xl flex flex-col items-center justify-center text-white">
              <span className="text-[9px] font-bold font-press-start text-amber-400">
                LV
              </span>
              <span className="text-3xl font-bold font-press-start text-amber-300 leading-none mt-1">
                {newLevel}
              </span>
            </div>
          </div>
          <Sparkles className="w-6 h-6 text-amber-300 absolute -top-2 -right-2 animate-spin" />
        </div>

        <span className="text-xs font-pixel text-amber-300 font-bold flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5" /> おめでとうございます！ <Sparkles className="w-3.5 h-3.5" />
        </span>

        <h2 className="text-2xl sm:text-3xl font-bold font-press-start text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 mt-1">
          LEVEL UP!
        </h2>

        <p className="text-slate-300 text-xs font-pixel mt-1 max-w-xs">
          あなたの社会貢献により、冒険者レベルが <span className="text-amber-300 font-bold">Lv.{newLevel}</span> にアップしました！
        </p>

        {/* Unlocked Items Section */}
        {unlockedItems.length > 0 ? (
          <div className="w-full mt-4 p-3.5 rounded-xl bg-slate-950/90 border border-amber-500/40 text-left">
            <div className="flex items-center gap-1.5 mb-2">
              <span className="text-base">🎁</span>
              <h4 className="text-xs font-bold font-pixel text-amber-300 uppercase tracking-wide">
                新しいアイテムが解放されました！
              </h4>
            </div>

            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
              {unlockedItems.map((item) => {
                const rarityStyle = RARITY_CONFIG[item.rarity] || RARITY_CONFIG.common;
                return (
                  <div
                    key={item.id}
                    className={`flex items-center gap-3 p-2 rounded-lg bg-slate-900 border ${rarityStyle.border} ${rarityStyle.glow}`}
                  >
                    <span className="text-2xl">{item.icon}</span>
                    <div className="flex-1 min-w-0">
                      <h5 className="text-xs font-bold font-pixel text-slate-100 truncate">
                        {item.name}
                      </h5>
                      <p className="text-[10px] font-pixel text-slate-400 truncate">
                        {item.description}
                      </p>
                    </div>
                    <span className={`text-[9px] font-pixel px-1.5 py-0.5 rounded ${rarityStyle.badgeBg}`}>
                      {rarityStyle.labelEn}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="w-full mt-3 p-2.5 rounded-xl bg-slate-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-pixel">
            🌱 ソーシャル世界樹と世界がさらに豊かに成長しました！
          </div>
        )}

        {/* Action Buttons */}
        <div className="w-full mt-5 space-y-2">
          {onOpenAvatarView && (
            <button
              type="button"
              onClick={() => {
                audio.playClick();
                onClose();
                onOpenAvatarView();
              }}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold font-pixel text-xs pixel-btn flex items-center justify-center gap-2 shadow-lg"
              id="goto-avatar-from-levelup-btn"
            >
              <Shirt className="w-4 h-4" />
              <span>装備変更画面へ移動</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              audio.playClick();
              onClose();
            }}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold font-pixel text-xs pixel-btn"
            id="close-levelup-modal-btn"
          >
            冒険を続ける
          </button>
        </div>
      </div>
    </div>
  );
};
