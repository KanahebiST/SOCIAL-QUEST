import React, { useState } from 'react';
import { UserProfile, CategoryType, Contribution } from '../types';
import { evaluateContributionType, getVerifiedRecycleCount } from '../utils/gameHelpers';
import { CATEGORIES } from '../data/initialData';
import { AvatarDisplay } from '../components/AvatarDisplay';
import { CategoryPieChart } from '../components/CategoryPieChart';
import { Award, Calendar, Flame, Sparkles, Filter, Search, RotateCcw, ShieldCheck, QrCode, MapPin, Share2, Copy, Check } from 'lucide-react';
import { audio } from '../utils/audio';
import confetti from 'canvas-confetti';

interface ProfileViewProps {
  user: UserProfile;
  onResetData: () => void;
  onLoadPreset: (presetType: 'beginner' | 'explorer' | 'master') => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  onResetData,
  onLoadPreset,
}) => {
  const [activeHistoryFilter, setActiveHistoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'card' | 'stats' | 'achievements' | 'history'>('card');
  const [copiedCardToast, setCopiedCardToast] = useState<boolean>(false);

  const typeResult = evaluateContributionType(user.contributions);
  const verifiedCount = getVerifiedRecycleCount(user);
  const manualCount = user.contributions.length - user.contributions.filter(c => c.verificationType === 'qr_scan' || c.verificationType === 'qr').length;

  // Filter history
  const filteredHistory = user.contributions.filter((c) => {
    let matchesCategory = true;
    if (activeHistoryFilter === 'all') {
      matchesCategory = true;
    } else if (activeHistoryFilter === 'verified') {
      matchesCategory = c.verificationType === 'qr_scan' || c.verificationType === 'qr';
    } else if (activeHistoryFilter === 'manual') {
      matchesCategory = c.verificationType !== 'qr_scan' && c.verificationType !== 'qr';
    } else {
      matchesCategory = c.category === activeHistoryFilter;
    }

    const matchesQuery =
      !searchQuery.trim() ||
      c.activityTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.memo && c.memo.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (c.spotName && c.spotName.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesQuery;
  });

  const totalContributions = user.contributions.length;
  const unlockedAchievements = user.achievements.filter((a) => a.unlocked);

  const handleShareCard = () => {
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
    setCopiedCardToast(true);
    setTimeout(() => setCopiedCardToast(false), 2500);
  };

  return (
    <div className="space-y-4 pb-8 animate-fade-in" id="profile-view">
      {/* Toast */}
      {copiedCardToast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-xl bg-amber-500 border-2 border-amber-300 text-slate-950 font-bold font-pixel text-xs shadow-2xl flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4" />
          ソーシャルアバターライセンスをクリップボードにコピーしました！
        </div>
      )}

      {/* Main Sub Tabs */}
      <div className="grid grid-cols-4 gap-1.5 p-1.5 bg-slate-900/90 rounded-2xl pixel-box">
        <button
          onClick={() => {
            audio.playClick();
            setActiveTab('card');
          }}
          className={`py-2 rounded-xl text-xs font-bold font-pixel transition ${
            activeTab === 'card' ? 'bg-amber-500 text-slate-950 font-black shadow-md' : 'text-slate-400 hover:text-slate-200'
          }`}
          id="profile-tab-card"
        >
          📇 ライセンス
        </button>
        <button
          onClick={() => {
            audio.playClick();
            setActiveTab('stats');
          }}
          className={`py-2 rounded-xl text-xs font-bold font-pixel transition ${
            activeTab === 'stats' ? 'bg-emerald-600 text-slate-950 font-black shadow-md' : 'text-slate-400 hover:text-slate-200'
          }`}
          id="profile-tab-stats"
        >
          📊 ステータス
        </button>
        <button
          onClick={() => {
            audio.playClick();
            setActiveTab('achievements');
          }}
          className={`py-2 rounded-xl text-xs font-bold font-pixel transition ${
            activeTab === 'achievements' ? 'bg-purple-600 text-white font-black shadow-md' : 'text-slate-400 hover:text-slate-200'
          }`}
          id="profile-tab-achievements"
        >
          🏆 実績 ({unlockedAchievements.length})
        </button>
        <button
          onClick={() => {
            audio.playClick();
            setActiveTab('history');
          }}
          className={`py-2 rounded-xl text-xs font-bold font-pixel transition ${
            activeTab === 'history' ? 'bg-blue-600 text-white font-black shadow-md' : 'text-slate-400 hover:text-slate-200'
          }`}
          id="profile-tab-history"
        >
          📜 冒険録 ({totalContributions})
        </button>
      </div>

      {/* 1. TAB: MY SOCIAL AVATAR LICENSE CARD */}
      {activeTab === 'card' && (
        <div className="space-y-4">
          <div className="max-w-md mx-auto rounded-2xl bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 pixel-box-gold p-5 text-slate-200 shadow-2xl relative">
            {/* Retro Card Header */}
            <div className="flex items-center justify-between border-b-2 border-amber-500/40 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">🛡️</span>
                <div>
                  <h3 className="font-bold font-press-start text-xs text-amber-300">
                    SOCIAL QUEST
                  </h3>
                  <p className="text-[10px] font-pixel text-slate-400">
                    公式ソーシャル冒険者ライセンス
                  </p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded bg-amber-950 border border-amber-500/60 text-amber-300 font-pixel text-[10px]">
                ランク: ゴールド
              </span>
            </div>

            {/* Character & Avatar Section */}
            <div className="mt-4 flex items-center gap-4">
              <div className="shrink-0">
                <AvatarDisplay
                  avatar={user.equippedItems}
                  size="md"
                  className="border-2 border-amber-400/80 shadow-lg"
                />
              </div>

              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xs font-pixel text-amber-400 font-bold">Lv.{user.level}</span>
                  <h4 className="text-base font-bold font-pixel text-slate-100 truncate">
                    {user.name}
                  </h4>
                </div>
                <div className="text-xs font-pixel text-emerald-400">
                  称号: <span className="font-bold">{user.title}</span>
                </div>
                <div className="text-[11px] font-pixel text-slate-300">
                  タイプ: <span className="text-amber-300 font-bold">{typeResult.title}</span>
                </div>
                <div className="text-[11px] font-pixel text-slate-400">
                  累計XP: <span className="text-emerald-300 font-bold">{(user.xp ?? 0).toLocaleString()} XP</span>
                </div>
              </div>
            </div>

            {/* Mini RPG Stats */}
            <div className="mt-4 grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
              <div>
                <span className="text-[9px] font-pixel text-slate-400 block">総アクション</span>
                <strong className="text-xs sm:text-sm font-pixel text-slate-200">{totalContributions} 回</strong>
              </div>
              <div className="border-x border-slate-800">
                <span className="text-[9px] font-pixel text-emerald-400 block">♻️ QR認証</span>
                <strong className="text-xs sm:text-sm font-pixel text-emerald-300">{verifiedCount} 本</strong>
              </div>
              <div>
                <span className="text-[9px] font-pixel text-amber-400 block">🔥 継続</span>
                <strong className="text-xs sm:text-sm font-pixel text-amber-300">{user.streakDays} 日</strong>
              </div>
            </div>

            {/* Card Footer */}
            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[10px] font-pixel text-slate-400">
              <span>ID: SQ-2026-HERO-{user.id}</span>
              <span className="flex items-center gap-1 text-emerald-400">
                <ShieldCheck className="w-3 h-3" /> 公式社会貢献認証済み
              </span>
            </div>

            {/* Share CTA */}
            <div className="mt-4">
              <button
                onClick={handleShareCard}
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold font-pixel text-xs pixel-btn flex items-center justify-center gap-2 shadow-lg"
              >
                <Share2 className="w-4 h-4" />
                <span>ライセンスカードを共有する (SNS/画像保存)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. TAB: STATS & RPG ATTRIBUTES */}
      {activeTab === 'stats' && (
        <div className="space-y-3">
          {/* Verified Recycling Highlight */}
          <div className="p-4 rounded-2xl bg-slate-900/90 pixel-box-emerald text-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-500/60 text-emerald-400 flex items-center justify-center text-xl">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-bold text-xs font-pixel text-emerald-300">実機リサイクル認証ステータス</h4>
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-pixel bg-emerald-950 border border-emerald-500/50 text-emerald-300">
                    公式認証済み
                  </span>
                </div>
                <p className="text-[11px] font-pixel text-slate-400 mt-0.5">
                  QR検証完了: <strong className="font-bold text-emerald-300">{verifiedCount} 本</strong> ({verifiedCount * 10} XP獲得) • 手動登録: {manualCount} 件
                </p>
              </div>
            </div>
            <span className="text-xs font-pixel text-emerald-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-emerald-500/40">
              信頼度 100%
            </span>
          </div>

          {/* Category Contribution Pie Chart */}
          <CategoryPieChart
            contributions={user.contributions}
            title="ジャンル別 貢献度円グラフ"
            onSelectCategory={(category) => {
              setActiveHistoryFilter(category);
              setActiveTab('history');
            }}
          />

          {/* 5 RPG Attributes Parameter Bars */}
          <div className="p-5 rounded-2xl bg-slate-900/90 pixel-box text-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold font-pixel text-sm text-amber-300 flex items-center gap-2">
                <span>⚔️</span> 3大ソーシャル属性パラメーター
              </h3>
              <span className="text-xs font-pixel text-slate-400">
                累計 {totalContributions} アクション
              </span>
            </div>

            {/* Combined Segmented Color Bar */}
            <div className="w-full h-3 rounded bg-slate-950 overflow-hidden flex p-0.5 border border-slate-800">
              {typeResult.breakdowns.map((b) => {
                if (b.percentage === 0) return null;
                const cat = CATEGORIES[b.category];
                return (
                  <div
                    key={b.category}
                    style={{ width: `${b.percentage}%`, backgroundColor: cat?.color || '#10B981' }}
                    className="h-full first:rounded-l last:rounded-r transition-all duration-500"
                    title={`${cat?.name}: ${b.percentage}%`}
                  />
                );
              })}
            </div>

            {/* Category breakdown details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              {typeResult.breakdowns.map((b) => {
                const cat = CATEGORIES[b.category];
                return (
                  <div key={b.category} className="space-y-1.5 p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="flex items-center justify-between text-xs font-pixel">
                      <div className="flex items-center gap-1.5 font-bold text-slate-200">
                        <span>{cat?.icon}</span>
                        <span>{cat?.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400">{b.count}回 ({b.xpTotal} XP)</span>
                        <strong className="text-amber-400 font-bold w-9 text-right">
                          {b.percentage}%
                        </strong>
                      </div>
                    </div>
                    <div className="w-full bg-slate-900 rounded h-2 overflow-hidden border border-slate-800">
                      <div
                        className="h-full rounded transition-all duration-700"
                        style={{ width: `${b.percentage}%`, backgroundColor: cat?.color || '#10B981' }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Social Impact Insights */}
          <div className="p-4 rounded-2xl bg-slate-900/90 pixel-box text-slate-200">
            <h4 className="font-bold font-pixel text-xs text-emerald-400 mb-1 flex items-center gap-1">
              <span>🌱</span> 冒険者タイプ診断結果: {typeResult.title}
            </h4>
            <p className="text-xs font-pixel text-slate-300 leading-relaxed">
              {typeResult.tagline}
            </p>
          </div>
        </div>
      )}

      {/* 3. TAB: ACHIEVEMENTS */}
      {activeTab === 'achievements' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-bold font-pixel text-sm text-slate-200">
              実績バッジ一覧
            </h3>
            <span className="text-xs font-pixel text-amber-400 font-bold">
              {unlockedAchievements.length} / {user.achievements.length} 達成
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {user.achievements.map((ach) => {
              const isUnlocked = ach.unlocked;
              const percent = Math.min(100, Math.round((ach.currentCount / ach.targetCount) * 100));

              return (
                <div
                  key={ach.id}
                  className={`p-3.5 rounded-xl border transition-all flex items-start gap-3 pixel-box ${
                    isUnlocked
                      ? 'bg-slate-900 border-purple-500/60 ring-1 ring-purple-500/30'
                      : 'bg-slate-950/80 border-slate-800 opacity-60'
                  }`}
                  id={`ach-card-${ach.id}`}
                >
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center text-2xl shrink-0 ${
                      isUnlocked ? 'bg-purple-950 border border-purple-400 shadow-md' : 'bg-slate-900 text-slate-600 grayscale'
                    }`}
                  >
                    {ach.icon}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold font-pixel text-xs text-slate-100 flex items-center gap-1.5">
                        <span>{ach.title}</span>
                        {isUnlocked && (
                          <span className="text-[9px] font-pixel text-purple-300 bg-purple-950 px-1.5 py-0.2 rounded border border-purple-500/50">
                            達成済み
                          </span>
                        )}
                      </h4>
                      <span className="text-xs font-pixel text-amber-400 font-bold">
                        +{ach.rewardXp} XP
                      </span>
                    </div>

                    <p className="text-[11px] font-pixel text-slate-400 mt-0.5 leading-snug">
                      {ach.description}
                    </p>

                    {/* Progress */}
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex-1 bg-slate-950 rounded h-1.5 overflow-hidden border border-slate-800">
                        <div
                          className={`h-full rounded ${
                            isUnlocked ? 'bg-purple-500' : 'bg-slate-700'
                          }`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-pixel text-slate-400 shrink-0">
                        {ach.currentCount} / {ach.targetCount}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. TAB: HISTORY LOG */}
      {activeTab === 'history' && (
        <div className="space-y-3">
          {/* Search & Filter */}
          <div className="space-y-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="活動名、スポット名、メモで検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs font-pixel text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              <button
                onClick={() => setActiveHistoryFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-pixel whitespace-nowrap transition ${
                  activeHistoryFilter === 'all'
                    ? 'bg-slate-700 text-white font-bold'
                    : 'bg-slate-900 text-slate-400 border border-slate-800 hover:border-slate-700'
                }`}
              >
                すべて ({totalContributions})
              </button>

              <button
                onClick={() => setActiveHistoryFilter('verified')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-pixel whitespace-nowrap flex items-center gap-1 transition ${
                  activeHistoryFilter === 'verified'
                    ? 'bg-emerald-600 text-slate-950 font-bold'
                    : 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-900/60'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>QR実機認証 ({user.contributions.filter(c => c.verificationType === 'qr_scan' || c.verificationType === 'qr').length})</span>
              </button>

              <button
                onClick={() => setActiveHistoryFilter('manual')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-pixel whitespace-nowrap transition ${
                  activeHistoryFilter === 'manual'
                    ? 'bg-slate-700 text-white font-bold'
                    : 'bg-slate-900 text-slate-400 border border-slate-800'
                }`}
              >
                手動登録 ({manualCount})
              </button>
            </div>
          </div>

          {/* History Item Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {filteredHistory.length > 0 ? (
              filteredHistory.map((c) => {
                const isQR = c.verificationType === 'qr_scan' || c.verificationType === 'qr';

                return (
                  <div
                    key={c.id}
                    className={`p-3.5 rounded-xl bg-slate-900 border flex items-center justify-between gap-3 pixel-box ${
                      isQR ? 'border-emerald-500/60' : 'border-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 ${
                          isQR
                            ? 'bg-emerald-950 border border-emerald-500/60 text-emerald-400'
                            : 'bg-slate-950 border border-slate-800'
                        }`}
                      >
                        {c.icon}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-bold font-pixel text-xs text-slate-200 truncate">
                            {c.activityTitle}
                          </h4>
                          {isQR ? (
                            <span className="text-[9px] font-pixel bg-emerald-950 text-emerald-300 px-1.5 py-0.2 rounded border border-emerald-500/60 shrink-0 inline-flex items-center gap-0.5">
                              <ShieldCheck className="w-2.5 h-2.5" />
                              <span>QR認証</span>
                            </span>
                          ) : (
                            <span className="text-[9px] font-pixel bg-slate-800 text-slate-400 px-1.5 py-0.2 rounded shrink-0">
                              手動
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] font-pixel text-slate-400 truncate">
                          {c.date} • {c.amount} {c.unit}
                          {c.spotName && ` • 📍${c.spotName}`}
                        </p>
                        {c.memo && (
                          <p className="text-[10px] font-pixel text-amber-300 bg-amber-950/40 px-2 py-0.5 rounded-md inline-block mt-0.5 border border-amber-500/30">
                            💬 {c.memo}
                          </p>
                        )}
                      </div>
                    </div>
                    <span
                      className={`text-xs font-pixel font-bold px-2 py-1 rounded-lg border shrink-0 ${
                        isQR
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-500/60'
                          : 'bg-slate-950 text-amber-400 border-slate-800'
                      }`}
                    >
                      +{c.xpEarned} XP
                    </span>
                  </div>
                );
              })
            ) : (
              <div className="p-6 text-center rounded-xl bg-slate-900 border border-slate-800 text-slate-500 font-pixel text-xs col-span-full">
                該当する活動履歴がありません。
              </div>
            )}
          </div>
        </div>
      )}

      {/* 5. Demo / Developer Presets */}
      <div className="p-4 rounded-2xl bg-slate-900/90 pixel-box text-slate-200 space-y-2">
        <span className="text-[10px] font-bold font-pixel uppercase text-slate-400 block tracking-wider">
          デモデータ・プリセット切替
        </span>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => onLoadPreset('beginner')}
            className="py-2 px-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-[11px] font-bold font-pixel text-slate-300 transition pixel-btn"
          >
            🌱 Lv.1 ビギナー
          </button>
          <button
            onClick={() => onLoadPreset('explorer')}
            className="py-2 px-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-[11px] font-bold font-pixel text-emerald-400 transition pixel-btn"
          >
            🧭 Lv.5 エクスプローラー
          </button>
          <button
            onClick={() => onLoadPreset('master')}
            className="py-2 px-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-[11px] font-bold font-pixel text-purple-400 transition pixel-btn"
          >
            👑 Lv.15 マスター
          </button>
        </div>
        <div className="pt-1 flex justify-end">
          <button
            onClick={onResetData}
            className="text-[11px] font-bold font-pixel text-rose-400 hover:text-rose-300 flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>データを初期状態にリセット</span>
          </button>
        </div>
      </div>
    </div>
  );
};
