import React, { useState } from 'react';
import { CategoryType, ActivityTemplate, RecyclingSpot, UserProfile } from '../types';
import { CATEGORIES, ACTIVITIES, RECYCLING_SPOTS } from '../data/initialData';
import { isSpotUsedToday } from '../utils/gameHelpers';
import { SocialWorldMap } from '../components/SocialWorldMap';
import {
  Sparkles,
  Globe,
  ArrowRight,
  BookOpen,
  ShieldCheck,
  Heart,
  QrCode,
  MapPin,
  CheckCircle2,
  Zap,
  ExternalLink,
  Camera,
  Compass,
} from 'lucide-react';
import { audio } from '../utils/audio';

interface SocialViewProps {
  user: UserProfile;
  onOpenContributionModal: (category?: CategoryType, activityId?: string) => void;
  onOpenWorldTree: () => void;
  onOpenQRScanner: (spot?: RecyclingSpot) => void;
  onOpenTestQRModal: (spotId?: string) => void;
}

export const SocialView: React.FC<SocialViewProps> = ({
  user,
  onOpenContributionModal,
  onOpenWorldTree,
  onOpenQRScanner,
  onOpenTestQRModal,
}) => {
  const [activeCategory, setActiveCategory] = useState<CategoryType>('environment');
  const [viewTab, setViewTab] = useState<'map' | 'activities' | 'spots'>('map');

  const categoryList: CategoryType[] = ['environment', 'support', 'community', 'volunteer', 'learning'];
  const filteredActivities = ACTIVITIES.filter((a) => a.category === activeCategory);
  const currentCatInfo = CATEGORIES[activeCategory];

  return (
    <div className="space-y-4 pb-8 animate-fade-in" id="social-view">
      {/* 1. QR Recycling Verification Hero Action Card */}
      <div
        className="rounded-2xl bg-slate-900 pixel-box-emerald text-slate-200 p-4 sm:p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
        id="qr-recycle-hero-card"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="text-[9px] font-bold font-press-start uppercase px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/50 inline-flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              実機認証アクション
            </span>
            <span className="text-[10px] font-bold font-pixel bg-amber-400 text-slate-950 px-2 py-0.5 rounded">
              +10 XP / 本
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-bold font-pixel text-emerald-300">
            ♻️ QRコード実機リサイクル認証
          </h3>
          <p className="text-xs text-slate-300 font-pixel mt-0.5 leading-relaxed max-w-xl">
            現実世界のスマート回収ボックスにペットボトルを投入し、BOXのQRコードをスキャンしてSOCIAL XPを獲得！
          </p>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto shrink-0 flex-wrap">
          <button
            type="button"
            onClick={() => {
              audio.playClick();
              onOpenQRScanner();
            }}
            className="flex-1 md:flex-initial px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold font-pixel text-xs pixel-btn flex items-center justify-center gap-2 shadow-lg"
            id="hero-open-qr-scanner-btn"
          >
            <Camera className="w-4 h-4" />
            <span>QRスキャンで認証</span>
          </button>

          <button
            type="button"
            onClick={() => {
              audio.playClick();
              onOpenTestQRModal();
            }}
            className="px-3.5 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-emerald-400 font-bold font-pixel text-xs border border-emerald-500/40 pixel-btn flex items-center justify-center gap-1.5"
            id="hero-open-test-qr-btn"
            title="実機テスト用のQRコードを表示"
          >
            <QrCode className="w-4 h-4 text-emerald-400" />
            <span>QR表示</span>
          </button>
        </div>
      </div>

      {/* Main Mode Sub-navigation: World Map vs Activities vs Spots */}
      <div className="flex items-center justify-between gap-2 p-1.5 bg-slate-900/90 rounded-2xl pixel-box">
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={() => {
              setViewTab('map');
              audio.playClick();
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold font-pixel transition flex items-center gap-1.5 ${
              viewTab === 'map'
                ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            id="tab-world-map-btn"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>🗺️ ワールドマップ</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setViewTab('activities');
              audio.playClick();
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold font-pixel transition ${
              viewTab === 'activities'
                ? 'bg-emerald-600 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            id="tab-activities-btn"
          >
            <span>📋 社会貢献アクション一覧</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setViewTab('spots');
              audio.playClick();
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold font-pixel transition flex items-center gap-1.5 ${
              viewTab === 'spots'
                ? 'bg-teal-600 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            id="tab-spots-btn"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>📍 リサイクルスポット ({RECYCLING_SPOTS.length})</span>
          </button>
        </div>
      </div>

      {/* --- TAB 1: WORLD MAP VIEW --- */}
      {viewTab === 'map' && (
        <div className="space-y-4">
          <SocialWorldMap
            userContributionsCount={user.contributions.length}
            onSelectArea={(area) => {
              audio.playClick();
              if (area.targetCategory) {
                setActiveCategory(area.targetCategory as CategoryType);
                setViewTab('activities');
              }
            }}
          />
        </div>
      )}

      {/* --- TAB 2: ACTIVITIES VIEW --- */}
      {viewTab === 'activities' && (
        <div className="space-y-4">
          {/* Category Selector Tabs */}
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <div>
                <span className="text-[9px] font-bold font-press-start text-emerald-400 block">
                  カテゴリ
                </span>
                <h3 className="font-bold font-pixel text-sm text-slate-100">
                  社会貢献カテゴリを選択
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-pixel">全5ジャンル</span>
            </div>

            <div className="grid grid-cols-5 gap-1.5 p-1.5 bg-slate-900/90 rounded-2xl pixel-box">
              {categoryList.map((catKey) => {
                const cat = CATEGORIES[catKey];
                const isSelected = activeCategory === catKey;
                return (
                  <button
                    key={catKey}
                    onClick={() => {
                      audio.playClick();
                      setActiveCategory(catKey);
                    }}
                    className={`py-2 px-1 rounded-xl text-center flex flex-col items-center justify-center gap-1 transition ${
                      isSelected
                        ? 'bg-emerald-600 text-slate-950 font-bold shadow-md'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                    id={`social-cat-btn-${catKey}`}
                  >
                    <span className="text-xl">{cat.icon}</span>
                    <span className="text-[11px] font-pixel font-bold truncate w-full">{cat.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Category Overview Card */}
          <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/90 pixel-box text-slate-200">
            <div className="flex items-center gap-3">
              <span className="text-2xl w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center">
                {currentCatInfo.icon}
              </span>
              <div>
                <h4 className="font-bold font-pixel text-sm text-slate-100">
                  {currentCatInfo.name}ジャンル
                </h4>
                <p className="text-xs font-pixel text-slate-400 mt-0.5">
                  {currentCatInfo.description}
                </p>
              </div>
            </div>
          </div>

          {/* Activity Catalog Cards */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <h3 className="font-bold font-pixel text-sm text-slate-100">
                対応アクション一覧 ({filteredActivities.length} 件)
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredActivities.map((act) => {
                const isBottleRecycle = act.id === 'act_bottle_recycle';

                return (
                  <div
                    key={act.id}
                    className={`p-4 rounded-xl bg-slate-900 border transition-all space-y-3 flex flex-col justify-between pixel-box ${
                      isBottleRecycle
                        ? 'border-emerald-400 ring-1 ring-emerald-400/40'
                        : 'border-slate-800'
                    }`}
                    id={`act-item-${act.id}`}
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-2.5">
                          <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-xl shrink-0">
                            {act.icon}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <h4 className="font-bold font-pixel text-sm text-slate-100">
                                {act.title}
                              </h4>
                              {isBottleRecycle && (
                                <span className="text-[9px] font-pixel bg-emerald-950 text-emerald-300 px-1.5 py-0.2 rounded border border-emerald-500/50">
                                  QR認証対応
                                </span>
                              )}
                            </div>
                            <p className="text-xs font-pixel text-slate-400 mt-0.5 leading-relaxed">
                              {act.description}
                            </p>
                          </div>
                        </div>

                        {/* XP Badge */}
                        <div className="text-right shrink-0">
                          <span className="text-xs font-bold font-pixel text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/50 block text-center">
                            +{act.baseXp} XP
                          </span>
                          <span className="text-[9px] font-pixel text-slate-400 block mt-0.5">
                            / 1 {act.unit}
                          </span>
                        </div>
                      </div>

                      {/* Reason */}
                      <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-pixel text-slate-300 flex items-start gap-1.5">
                        <span className="text-amber-400 mt-0.5">💡</span>
                        <div>
                          <strong className="text-slate-200">社会へのインパクト: </strong>
                          {act.reason}
                        </div>
                      </div>
                    </div>

                    {/* Action CTA Buttons */}
                    <div className="flex items-center gap-2 pt-1">
                      {isBottleRecycle && (
                        <button
                          type="button"
                          onClick={() => {
                            audio.playClick();
                            onOpenQRScanner();
                          }}
                          className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold font-pixel text-xs pixel-btn flex items-center justify-center gap-1.5"
                          id="recycle-qr-action-btn"
                        >
                          <Camera className="w-3.5 h-3.5" />
                          <span>QRで認証する</span>
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          audio.playClick();
                          onOpenContributionModal(activeCategory, act.id);
                        }}
                        className={`py-2.5 rounded-xl font-bold font-pixel text-xs pixel-btn transition flex items-center justify-center gap-1.5 ${
                          isBottleRecycle
                            ? 'px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                            : 'w-full bg-amber-500 hover:bg-amber-400 text-slate-950'
                        }`}
                        id={`record-act-btn-${act.id}`}
                      >
                        <span>{isBottleRecycle ? '手動記録' : 'この活動を記録する'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 3: RECYCLING SPOTS LIST --- */}
      {viewTab === 'spots' && (
        <div className="space-y-3" id="recycling-spots-tab-content">
          <div className="flex items-center justify-between px-1">
            <div>
              <span className="text-[9px] font-bold font-press-start text-emerald-400 block">
                公式スポット
              </span>
              <h3 className="font-bold font-pixel text-sm text-slate-100">
                公式リサイクルスポット一覧
              </h3>
            </div>
            <span className="text-xs text-emerald-300 font-pixel font-bold bg-emerald-950 px-2.5 py-0.5 rounded border border-emerald-500/40">
              全 {RECYCLING_SPOTS.length} 拠点
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {RECYCLING_SPOTS.map((spot) => {
              const usedToday = isSpotUsedToday(spot.id, user);

              return (
                <div
                  key={spot.id}
                  className="p-4 rounded-xl bg-slate-900 border border-slate-800 pixel-box text-slate-200 flex flex-col justify-between space-y-3"
                  id={`spot-card-${spot.id}`}
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2.5">
                        <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-500/50 flex items-center justify-center text-xl shrink-0">
                          {spot.icon || '♻️'}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h4 className="font-bold font-pixel text-sm text-slate-100">{spot.name}</h4>
                          </div>
                          <p className="text-[10px] text-slate-500 font-mono mt-0.5">{spot.id}</p>
                        </div>
                      </div>

                      {/* Status badge */}
                      {usedToday ? (
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px] font-pixel shrink-0 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          <span>本日利用済</span>
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 text-[10px] font-pixel shrink-0 border border-emerald-500/50">
                          🟢 利用可能
                        </span>
                      )}
                    </div>

                    <p className="text-xs font-pixel text-slate-300 leading-relaxed">{spot.description}</p>

                    <div className="text-xs font-pixel text-slate-400 flex items-center gap-1.5 pt-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="truncate">{spot.location}</span>
                    </div>

                    {/* Accepted Items */}
                    {spot.acceptedItems && (
                      <div className="flex gap-1 flex-wrap pt-1">
                        {spot.acceptedItems.map((item, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded bg-slate-950 text-slate-300 text-[10px] font-pixel border border-slate-800"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                    <button
                      type="button"
                      disabled={usedToday}
                      onClick={() => {
                        audio.playClick();
                        onOpenQRScanner(spot);
                      }}
                      className={`flex-1 py-2.5 rounded-xl font-bold font-pixel text-xs pixel-btn flex items-center justify-center gap-1.5 ${
                        usedToday
                          ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                          : 'bg-emerald-600 hover:bg-emerald-500 text-slate-950'
                      }`}
                      id={`scan-spot-btn-${spot.id}`}
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>{usedToday ? '本日認証完了' : 'このスポットで認証'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        audio.playClick();
                        onOpenTestQRModal(spot.id);
                      }}
                      className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold font-pixel text-xs border border-slate-700 pixel-btn flex items-center gap-1"
                      id={`preview-spot-qr-btn-${spot.id}`}
                      title="QRコード画像を表示"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span>QR表示</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
