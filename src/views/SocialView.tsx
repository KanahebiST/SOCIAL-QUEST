import React, { useState } from 'react';
import { ArrowRight, Camera, Compass } from 'lucide-react';
import { CategoryType, UserProfile } from '../types';
import { ACTIVITIES, CATEGORIES } from '../data/initialData';
import { SocialWorldMap } from '../components/SocialWorldMap';
import { audio } from '../utils/audio';

interface SocialViewProps {
  user: UserProfile;
  onOpenContributionModal: (category?: CategoryType, activityId?: string) => void;
  onOpenWorldTree: () => void;
  onOpenBarcodeScanner: () => void;
}

export const SocialView: React.FC<SocialViewProps> = ({
  onOpenContributionModal,
  onOpenWorldTree,
  onOpenBarcodeScanner,
}) => {
  const [activeCategory, setActiveCategory] = useState<CategoryType>('environment');
  const [viewTab, setViewTab] = useState<'map' | 'activities'>('map');
  const categoryList: CategoryType[] = ['environment', 'support', 'learning'];
  const filteredActivities = ACTIVITIES.filter((activity) => activity.category === activeCategory);
  const currentCatInfo = CATEGORIES[activeCategory];

  return (
    <div className="space-y-4 pb-8 animate-fade-in" id="social-view">
      <div className="rounded-2xl bg-slate-900 pixel-box-emerald text-slate-200 p-4 sm:p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4" id="barcode-recycle-hero-card">
        <div>
          <h3 className="font-bold font-pixel text-sm text-emerald-300">🧴 バーコードでリサイクル記録</h3>
          <p className="text-xs font-pixel text-slate-400 mt-1">ペットボトルの商品バーコードをスキャンして、自己申告でSOCIAL XPを獲得しよう！</p>
        </div>
        <button
          onClick={() => {
            audio.playClick();
            onOpenBarcodeScanner();
          }}
          className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 text-xs font-bold font-pixel flex items-center gap-1.5 shrink-0"
          id="hero-open-barcode-scanner-btn"
        >
          <Camera className="w-4 h-4" />
          <span>バーコードをスキャン</span>
        </button>
      </div>

      <div className="flex items-center gap-1.5 p-1.5 bg-slate-900/90 rounded-2xl pixel-box">
        <button
          type="button"
          onClick={() => {
            setViewTab('map');
            audio.playClick();
          }}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold font-pixel flex items-center gap-1.5 ${viewTab === 'map' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
          id="tab-world-map-btn"
        >
          <Compass className="w-3.5 h-3.5" />🗺️ ワールドマップ
        </button>
        <button
          type="button"
          onClick={() => {
            setViewTab('activities');
            audio.playClick();
          }}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold font-pixel ${viewTab === 'activities' ? 'bg-emerald-600 text-slate-950 shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
          id="tab-activities-btn"
        >
          📋 社会貢献アクション一覧
        </button>
      </div>

      {viewTab === 'map' && (
        <SocialWorldMap
          onSelectArea={(area) => setActiveCategory(area.category)}
          onOpenBarcodeScanner={onOpenBarcodeScanner}
          onActionClick={(category) => onOpenContributionModal(category)}
        />
      )}

      {viewTab === 'activities' && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-1.5 p-1.5 bg-slate-900/90 rounded-2xl pixel-box">
            {categoryList.map((category) => {
              const info = CATEGORIES[category];
              const selected = activeCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => {
                    audio.playClick();
                    setActiveCategory(category);
                  }}
                  className={`py-2 px-1 rounded-xl text-center flex flex-col items-center gap-1 ${selected ? 'bg-emerald-600 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  <span className="text-xl">{info.icon}</span>
                  <span className="text-[11px] font-pixel font-bold truncate w-full">{info.name}</span>
                </button>
              );
            })}
          </div>

          <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/90 pixel-box text-slate-200">
            <h3 className="font-bold font-pixel text-sm text-slate-100">{currentCatInfo.name}ジャンル</h3>
            <p className="text-xs font-pixel text-slate-400 mt-0.5">{currentCatInfo.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredActivities.map((activity) => {
              const isBottleRecycle = activity.id === 'act_bottle_recycle';
              return (
                <div key={activity.id} className={`p-4 rounded-xl bg-slate-900 border space-y-3 flex flex-col justify-between pixel-box ${isBottleRecycle ? 'border-emerald-400 ring-1 ring-emerald-400/40' : 'border-slate-800'}`}>
                  <div className="space-y-2.5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2.5">
                        <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-xl shrink-0">{activity.icon}</div>
                        <div>
                          <h4 className="font-bold font-pixel text-sm text-slate-100">{activity.title}</h4>
                          <p className="text-xs font-pixel text-slate-400 mt-0.5 leading-relaxed">{activity.description}</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold font-pixel text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/50 shrink-0">+{activity.baseXp} XP</span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-pixel text-slate-300">💡 {activity.reason}</div>
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    {isBottleRecycle && (
                      <button type="button" onClick={onOpenBarcodeScanner} className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold font-pixel text-xs flex items-center justify-center gap-1.5" id="recycle-barcode-action-btn">
                        <Camera className="w-3.5 h-3.5" />バーコードで記録
                      </button>
                    )}
                    <button type="button" onClick={() => onOpenContributionModal(activeCategory, activity.id)} className={`${isBottleRecycle ? 'px-3' : 'w-full'} py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold font-pixel text-xs flex items-center justify-center gap-1.5`}>
                      {isBottleRecycle ? '手動記録' : 'この活動を記録する'}<ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <button onClick={onOpenWorldTree} className="sr-only" aria-hidden="true">世界樹</button>
    </div>
  );
};
