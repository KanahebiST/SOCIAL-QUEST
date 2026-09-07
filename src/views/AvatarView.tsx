import React, { useState } from 'react';
import { UserProfile, AvatarConfig, AvatarCategory, AvatarItem, ItemRarity } from '../types';
import { RPG_ITEMS, RARITY_CONFIG } from '../data/items';
import { AvatarDisplay } from '../components/AvatarDisplay';
import { Lock, Sparkles, Check, RefreshCw, Share2, Palette, Shield, Info, Eye } from 'lucide-react';
import { audio } from '../utils/audio';
import confetti from 'canvas-confetti';

interface AvatarViewProps {
  user: UserProfile;
  onSaveAvatar: (newAvatar: AvatarConfig) => void;
}

export const AvatarView: React.FC<AvatarViewProps> = ({
  user,
  onSaveAvatar,
}) => {
  const [currentConfig, setCurrentConfig] = useState<AvatarConfig>({ ...(user.avatar || user.equippedItems) });
  const [mainViewMode, setMainViewMode] = useState<'equip' | 'itembox'>('equip');
  const [activeCategory, setActiveCategory] = useState<AvatarCategory>('weapon');
  const [rarityFilter, setRarityFilter] = useState<string>('all');
  const [selectedItemDetail, setSelectedItemDetail] = useState<AvatarItem | null>(null);
  const [saveToast, setSaveToast] = useState<boolean>(false);
  const [copiedToast, setCopiedToast] = useState<boolean>(false);

  const categories: { id: AvatarCategory; label: string; icon: string }[] = [
    { id: 'weapon', label: '武器・盾', icon: '⚔️' },
    { id: 'clothes', label: '衣装', icon: '👕' },
    { id: 'hat', label: '帽子', icon: '🧢' },
    { id: 'hair', label: '髪型', icon: '💇' },
    { id: 'skin', label: '肌色', icon: '👤' },
    { id: 'accessory', label: '装飾', icon: '🎒' },
    { id: 'back', label: '背中', icon: '🪽' },
    { id: 'pet', label: 'ペット', icon: '🐾' },
    { id: 'special', label: 'エフェクト', icon: '✨' },
    { id: 'background', label: '背景', icon: '🌄' },
  ];

  const hairColorPalette = [
    { name: 'ダークブラウン', color: '#38281F' },
    { name: 'スレートブラック', color: '#1E293B' },
    { name: 'アンバーゴールド', color: '#D97706' },
    { name: 'フォレストグリーン', color: '#10B981' },
    { name: 'サクラピンク', color: '#EC4899' },
  ];

  const unlockedSet = new Set([...(user.unlockedItems || []), ...(user.unlockedItemIds || [])]);

  // Filter items
  const categoryItems = RPG_ITEMS.filter((i) => {
    const matchesCategory = i.category === activeCategory;
    const matchesRarity = rarityFilter === 'all' || i.rarity === rarityFilter;
    return matchesCategory && matchesRarity;
  });

  const allItemsWithFilter = RPG_ITEMS.filter((i) => {
    const matchesRarity = rarityFilter === 'all' || i.rarity === rarityFilter;
    return matchesRarity;
  });

  const handleSelectItem = (item: AvatarItem) => {
    const isUnlocked = unlockedSet.has(item.id);
    if (!isUnlocked) {
      audio.playClick();
      setSelectedItemDetail(item);
      return;
    }

    audio.playEquip();
    setCurrentConfig((prev) => {
      const next = { ...prev };
      if (item.category === 'weapon') next.weapon = item.id;
      if (item.category === 'skin') next.skinColor = item.id;
      if (item.category === 'hair') next.hairStyle = item.svgType;
      if (item.category === 'clothes') next.clothes = item.id;
      if (item.category === 'hat') next.hat = item.id;
      if (item.category === 'accessory') next.accessory = item.id;
      if (item.category === 'back') next.back = item.id;
      if (item.category === 'pet') next.pet = item.id;
      if (item.category === 'special') next.special = item.id;
      if (item.category === 'background') next.background = item.id;
      return next;
    });
  };

  const handleSave = () => {
    audio.playSuccess();
    onSaveAvatar(currentConfig);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2200);
  };

  const handleReset = () => {
    audio.playClick();
    setCurrentConfig({ ...(user.avatar || user.equippedItems) });
  };

  const handleShare = () => {
    audio.playSuccess();
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.4 },
      });
    } catch {
      // Ignore
    }
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 2500);
  };

  const isCurrentEquipped = (item: AvatarItem) => {
    if (item.category === 'skin') return currentConfig.skinColor === item.id;
    if (item.category === 'hair') return currentConfig.hairStyle === item.svgType;
    if (item.category === 'clothes') return currentConfig.clothes === item.id;
    if (item.category === 'hat') return currentConfig.hat === item.id;
    if (item.category === 'accessory') return currentConfig.accessory === item.id;
    if (item.category === 'back') return currentConfig.back === item.id;
    if (item.category === 'pet') return currentConfig.pet === item.id;
    if (item.category === 'special') return currentConfig.special === item.id;
    if (item.category === 'background') return currentConfig.background === item.id;
    return false;
  };

  return (
    <div className="space-y-4 pb-8 animate-fade-in" id="avatar-view">
      {/* Toast notifications */}
      {saveToast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-xl bg-emerald-600 border-2 border-emerald-400 text-slate-950 font-bold font-pixel text-xs shadow-2xl flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4" />
          装備コーディネートを保存しました！
        </div>
      )}
      {copiedToast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-xl bg-amber-500 border-2 border-amber-300 text-slate-950 font-bold font-pixel text-xs shadow-2xl flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4" />
          マイアバターカードのリンクをコピーしました！
        </div>
      )}

      {/* Main View Mode Selector: EQUIP vs ITEM BOX */}
      <div className="flex items-center justify-between bg-slate-900/90 p-1.5 rounded-2xl pixel-box">
        <div className="flex gap-2">
          <button
            id="tab-mode-equip"
            onClick={() => {
              audio.playClick();
              setMainViewMode('equip');
            }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold font-pixel flex items-center gap-1.5 transition ${
              mainViewMode === 'equip'
                ? 'bg-emerald-600 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>⚔️</span>
            <span>装備変更</span>
          </button>
          <button
            id="tab-mode-itembox"
            onClick={() => {
              audio.playClick();
              setMainViewMode('itembox');
            }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold font-pixel flex items-center gap-1.5 transition ${
              mainViewMode === 'itembox'
                ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>📦</span>
            <span>所持品・図鑑</span>
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-2 px-3 text-xs font-pixel text-slate-400">
          <span>所持アイテム:</span>
          <span className="text-emerald-400 font-bold">{unlockedSet.size}</span> / {RPG_ITEMS.length}
        </div>
      </div>

      <div className="lg:grid lg:grid-cols-12 lg:gap-5 items-start">
        {/* Left Column: Pixel Avatar Live Stage (5 cols on desktop) */}
        <div className="lg:col-span-5 space-y-3 mb-4 lg:mb-0">
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 pixel-box text-slate-200 shadow-xl flex flex-col items-center relative overflow-hidden">
            {/* Header / Title */}
            <div className="w-full flex items-center justify-between mb-2">
              <span className="text-[10px] sm:text-xs font-bold font-pixel text-emerald-400 tracking-wider flex items-center gap-1">
                <span>🎮</span> アバタープレビュー
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleShare}
                  className="px-2 py-1 rounded bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700 text-xs font-pixel flex items-center gap-1 transition"
                  title="アバターカードをシェア"
                >
                  <Share2 className="w-3 h-3 text-amber-400" />
                  <span>共有</span>
                </button>
                <button
                  onClick={handleReset}
                  className="p-1 rounded bg-slate-800 border border-slate-700 text-slate-400 hover:text-white transition"
                  title="装備を元に戻す"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Live Pixel Avatar Component */}
            <div className="my-2">
              <AvatarDisplay
                avatar={currentConfig}
                size="xl"
                isFloating={true}
                className="shadow-2xl"
              />
            </div>

            {/* Character Info Strip */}
            <div className="w-full mt-2 p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
              <div className="text-xs font-bold font-pixel text-amber-300">
                Lv.{user.level} {user.name}
              </div>
              <div className="text-[11px] text-slate-400 font-pixel">
                称号: <span className="text-emerald-400">{user.title}</span>
              </div>
            </div>

            {/* Save CTA */}
            <div className="w-full mt-3">
              <button
                onClick={handleSave}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold font-pixel text-xs sm:text-sm pixel-btn flex items-center justify-center gap-2 shadow-lg"
                id="save-avatar-btn"
              >
                <Check className="w-4 h-4" />
                <span>この装備で冒険に出る (保存)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Equip Slots / Item Grid (7 cols on desktop) */}
        <div className="lg:col-span-7 space-y-3">
          {/* Category Selector Tabs */}
          <div className="overflow-x-auto pb-1 scrollbar-none">
            <div className="flex gap-1.5 p-1.5 bg-slate-900/90 rounded-2xl pixel-box min-w-max">
              {categories.map((cat) => {
                const isSelected = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      audio.playClick();
                      setActiveCategory(cat.id);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold font-pixel flex items-center gap-1.5 transition ${
                      isSelected
                        ? 'bg-emerald-600 text-slate-950 font-black shadow-md'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                    id={`avatar-tab-${cat.id}`}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Rarity Filter Selector */}
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-1 overflow-x-auto">
              <span className="text-[11px] font-pixel text-slate-400 mr-1">レア度:</span>
              {[
                { id: 'all', label: 'すべて' },
                { id: 'common', label: 'コモン' },
                { id: 'rare', label: 'レア' },
                { id: 'epic', label: 'エピック' },
                { id: 'legendary', label: 'レジェンダリー' },
                { id: 'world', label: 'ワールド' },
              ].map((r) => {
                const isSelected = rarityFilter === r.id;
                return (
                  <button
                    key={r.id}
                    onClick={() => {
                      audio.playClick();
                      setRarityFilter(r.id);
                    }}
                    className={`px-2 py-0.5 rounded text-[10px] font-pixel transition ${
                      isSelected
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'bg-slate-900 text-slate-400 border border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {r.label}
                  </button>
                );
              })}
            </div>

            <span className="text-xs text-slate-400 font-pixel">
              {categoryItems.filter((i) => unlockedSet.has(i.id)).length} / {categoryItems.length} 解放
            </span>
          </div>

          {/* Hair Color Sub-palette if hair tab is selected */}
          {activeCategory === 'hair' && (
            <div className="p-3 rounded-xl bg-slate-900/90 pixel-box">
              <div className="flex items-center gap-1.5 mb-2">
                <Palette className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-xs font-bold font-pixel text-slate-300">髪色を選択</span>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {hairColorPalette.map((c) => {
                  const isSelected = currentConfig.hairColor === c.color;
                  return (
                    <button
                      key={c.color}
                      onClick={() => {
                        audio.playEquip();
                        setCurrentConfig((prev) => ({ ...prev, hairColor: c.color }));
                      }}
                      className={`w-7 h-7 rounded-lg border-2 transition-all flex items-center justify-center shrink-0 ${
                        isSelected ? 'ring-2 ring-emerald-400 scale-110 border-white' : 'border-slate-700'
                      }`}
                      style={{ backgroundColor: c.color }}
                      title={c.name}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 text-white drop-shadow" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Items Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {categoryItems.map((item) => {
              const isUnlocked = unlockedSet.has(item.id);
              const isEquipped = isCurrentEquipped(item);
              const rarityStyle = RARITY_CONFIG[item.rarity] || RARITY_CONFIG.common;

              return (
                <div
                  key={item.id}
                  onClick={() => handleSelectItem(item)}
                  className={`p-3 rounded-xl border relative flex flex-col justify-between transition-all cursor-pointer pixel-box ${
                    isEquipped
                      ? 'border-emerald-400 bg-emerald-950/40 ring-2 ring-emerald-400/50'
                      : isUnlocked
                      ? `${rarityStyle.border} ${rarityStyle.frameBg} hover:scale-[1.02]`
                      : 'border-slate-800 bg-slate-950/80 opacity-65'
                  }`}
                  id={`avatar-item-${item.id}`}
                >
                  {/* Equipped Badge */}
                  {isEquipped && (
                    <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-emerald-500 text-slate-950 text-[9px] font-bold font-pixel flex items-center gap-0.5 shadow-md">
                      <Check className="w-2.5 h-2.5" /> 装備中
                    </span>
                  )}

                  {/* Locked overlay */}
                  {!isUnlocked && (
                    <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-400 text-[9px] font-pixel flex items-center gap-0.5">
                      <Lock className="w-2.5 h-2.5" /> 未解放
                    </span>
                  )}

                  <div>
                    {/* Item Icon */}
                    <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-2xl mb-2 shadow-inner">
                      {item.icon}
                    </div>
                    <h4 className="font-bold font-pixel text-xs text-slate-100 line-clamp-1">
                      {item.name}
                    </h4>
                    <p className="text-[10px] font-pixel text-slate-400 mt-0.5 line-clamp-2 leading-tight">
                      {item.description}
                    </p>
                  </div>

                  {/* Rarity / Unlock requirement footnote */}
                  <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between">
                    <span className={`text-[9px] font-pixel px-1.5 py-0.5 rounded ${rarityStyle.badgeBg}`}>
                      {rarityStyle.labelEn}
                    </span>
                    {!isUnlocked && (
                      <span className="text-[9px] font-pixel text-amber-400 truncate max-w-[100px]">
                        Lv.{item.requiredLevel} 解放
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Item Detail Modal / Inspection Popup */}
      {selectedItemDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-sm rounded-2xl bg-slate-900 pixel-box-gold p-5 text-slate-200 relative">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-3xl">
                  {selectedItemDetail.icon}
                </div>
                <div>
                  <h3 className="font-bold font-pixel text-base text-amber-300">
                    {selectedItemDetail.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`text-[10px] font-pixel px-1.5 py-0.5 rounded ${RARITY_CONFIG[selectedItemDetail.rarity].badgeBg}`}>
                      {RARITY_CONFIG[selectedItemDetail.rarity].labelEn}
                    </span>
                    <span className="text-xs text-amber-400 font-pixel">
                      {RARITY_CONFIG[selectedItemDetail.rarity].stars}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <p className="mt-3 text-xs text-slate-300 font-pixel leading-relaxed">
              {selectedItemDetail.description}
            </p>

            {selectedItemDetail.flavorText && (
              <div className="mt-2 p-2 rounded bg-slate-950/80 border border-slate-800 text-[11px] text-slate-400 font-pixel italic">
                "{selectedItemDetail.flavorText}"
              </div>
            )}

            {/* Unlock requirement */}
            <div className="mt-3 p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/40">
              <div className="text-xs font-bold font-pixel text-amber-400 flex items-center gap-1 mb-1">
                <Lock className="w-3 h-3" /> 解放条件:
              </div>
              <p className="text-xs text-slate-200 font-pixel">
                {selectedItemDetail.requiredLevel > 1 && `・プレイヤーレベル Lv.${selectedItemDetail.requiredLevel} 以上\n`}
                {selectedItemDetail.requiredCategory && `・${selectedItemDetail.requiredCategory} の社会貢献を ${selectedItemDetail.requiredCategoryCount || 1}回 以上実施\n`}
                {selectedItemDetail.requiredAchievementId && '・特定の実績を達成\n'}
              </p>
            </div>

            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setSelectedItemDetail(null)}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold font-pixel text-xs pixel-btn"
              >
                閉じる
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
