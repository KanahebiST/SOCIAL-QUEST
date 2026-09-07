import React from 'react';
import { UserProfile, Mission } from '../types';
import { AvatarDisplay } from '../components/AvatarDisplay';
import { SocialTreeDisplay } from '../components/SocialTreeDisplay';
import { CategoryPieChart } from '../components/CategoryPieChart';
import { evaluateContributionType, getCategoryCounts, getTodayDateString, getVerifiedRecycleCount } from '../utils/gameHelpers';
import { CATEGORIES } from '../data/initialData';
import { Sparkles, ArrowRight, CheckCircle, ChevronRight, Plus, Shirt, Globe, Flame, Camera, ShieldCheck, Compass, Swords } from 'lucide-react';
import { audio } from '../utils/audio';

interface HomeViewProps {
  user: UserProfile;
  onOpenContributionModal: (cat?: any, actId?: string) => void;
  onOpenAvatarView: () => void;
  onOpenQuestView: () => void;
  onOpenSocialView: () => void;
  onOpenWorldTree: () => void;
  onOpenWorldMap?: () => void;
  onOpenQRScanner?: () => void;
  onOpenBattleView?: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  user,
  onOpenContributionModal,
  onOpenAvatarView,
  onOpenQuestView,
  onOpenSocialView,
  onOpenWorldTree,
  onOpenWorldMap,
  onOpenQRScanner,
  onOpenBattleView,
}) => {
  const typeResult = evaluateContributionType(user.contributions);
  const categoryCounts = getCategoryCounts(user.contributions);
  const verifiedRecycleCount = getVerifiedRecycleCount(user);
  const receivedLoginBonusToday = user.lastLoginBonusDate === getTodayDateString();

  // Find today's recommended mission
  const todaysMission = user.missions.find((m) => m.type === 'daily' && !m.claimed) || user.missions[0];
  const recentContributions = [...user.contributions].slice(0, 4);

  return (
    <div className="space-y-4 sm:space-y-5 lg:space-y-0 lg:grid lg:grid-cols-12 lg:gap-5 animate-fade-in" id="home-view">
      {/* LEFT COLUMN: 8-Bit Pixel Avatar & Social Tree (4 cols on desktop) */}
      <div className="lg:col-span-4 space-y-4 sm:space-y-5">
        {/* Pixel Avatar Stage Card */}
        <section className="bg-slate-900/90 rounded-2xl pixel-box-gold p-4 sm:p-5 flex flex-col items-center justify-center relative overflow-hidden shadow-xl text-slate-200">
          {/* Top Badges */}
          <div className="w-full flex items-center justify-between mb-2 sm:mb-2.5">
            <span className="px-2.5 py-1 rounded bg-slate-950 text-[9px] sm:text-[10px] font-bold font-pixel text-amber-300 border border-slate-800 shadow-sm flex items-center gap-1">
              <span>{typeResult.badge}</span>
              <span className="truncate max-w-[130px] sm:max-w-none">Lv.{user.level} {user.name}</span>
            </span>
            <button
              onClick={() => {
                audio.playClick();
                onOpenAvatarView();
              }}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 rounded text-[9px] sm:text-[10px] font-bold font-pixel text-emerald-400 border border-slate-700 transition flex items-center gap-1 cursor-pointer pixel-btn"
              id="home-avatar-edit-btn"
            >
              <Shirt className="w-3 h-3 text-emerald-400" />
              <span>装備へ</span>
            </button>
          </div>

          {/* Central 8-Bit Avatar Visual */}
          <div className="my-2 sm:my-3">
            <AvatarDisplay
              avatar={user.equippedItems}
              size="lg"
              isFloating={true}
              className="shadow-2xl"
            />
          </div>

          {/* Character Title & Items Badge */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mt-1 mb-3 sm:mb-3.5">
            <span className="px-2.5 py-1 bg-slate-950 rounded text-[9px] sm:text-[10px] font-bold font-pixel text-amber-300 border border-amber-500/30">
              {user.title || typeResult.title}
            </span>
            <span className="px-2.5 py-1 bg-slate-950 rounded text-[9px] sm:text-[10px] font-bold font-pixel text-emerald-400 border border-emerald-500/30">
              所持装備: {user.unlockedItemIds.length} 個
            </span>
          </div>

          {/* Action CTAs */}
          <div className="w-full space-y-2 sm:space-y-2.5">
            {onOpenBattleView && (
              <button
                type="button"
                onClick={() => {
                  audio.playClick();
                  onOpenBattleView();
                }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold font-pixel text-xs sm:text-sm pixel-btn flex items-center justify-center gap-2 shadow-lg border border-indigo-400/40 animate-pulse"
                id="home-quick-battle-btn"
              >
                <Swords className="w-4 h-4 text-amber-300" />
                <span>⚔️ モンスター討伐・浄化バトルへ</span>
              </button>
            )}
            {onOpenQRScanner && (
              <button
                type="button"
                onClick={() => {
                  audio.playClick();
                  onOpenQRScanner();
                }}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold font-pixel text-xs sm:text-sm pixel-btn flex items-center justify-center gap-2 shadow-lg"
                id="home-quick-qr-scan-btn"
              >
                <Camera className="w-4 h-4" />
                <span>♻️ QRリサイクル認証 (実機)</span>
              </button>
            )}
            <button
              onClick={() => {
                audio.playClick();
                onOpenContributionModal();
              }}
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold font-pixel text-xs sm:text-sm pixel-btn flex items-center justify-center gap-2 shadow-lg"
              id="home-main-record-btn"
            >
              <Plus className="w-4 h-4" />
              <span>社会貢献アクションを手動記録</span>
            </button>
          </div>
        </section>

        {/* Social Tree Progression Card */}
        <section className="bg-slate-900/90 rounded-2xl pixel-box p-4 sm:p-5 shadow-xl text-slate-200 flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className="text-[9px] font-bold font-press-start text-emerald-400 block">
                YOUR TREE
              </span>
              <h3 className="font-bold font-pixel text-xs sm:text-sm text-slate-100">
                ソーシャル世界樹の成長
              </h3>
            </div>
            <span className="text-[10px] font-bold font-pixel text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/40">
              Lv.{user.level} 成長中
            </span>
          </div>

          <SocialTreeDisplay
            level={user.level}
            totalXp={user.xp}
            verifiedCount={verifiedRecycleCount}
            breakdowns={typeResult.breakdowns}
            isInteractive={true}
            onTreeClick={onOpenWorldTree}
            className="border border-slate-800"
          />

          <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between text-xs font-pixel">
            {onOpenWorldMap ? (
              <button
                onClick={() => {
                  audio.playClick();
                  onOpenWorldMap();
                }}
                className="font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1"
                id="home-view-world-map-link"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>🗺️ ワールドマップ</span>
              </button>
            ) : (
              <span className="text-slate-400">全体の世界樹と連動</span>
            )}
            <button
              onClick={() => {
                audio.playClick();
                onOpenWorldTree();
              }}
              className="font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-0.5"
              id="home-view-world-tree-link"
            >
              <span>🌍 みんなの世界樹</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </section>
      </div>

      {/* RIGHT COLUMN: Metrics, Today's Quest, Categories, Activities (8 cols on desktop) */}
      <div className="lg:col-span-8 space-y-4 sm:space-y-5">
        {/* 1. Top Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
          {/* Card 1: Contributions */}
          <div className="bg-slate-900/90 p-3 sm:p-3.5 rounded-xl pixel-box text-slate-200">
            <span className="text-[8px] sm:text-[9px] font-bold font-pixel text-slate-400 uppercase tracking-wider block mb-0.5 sm:mb-1">
              貢献回数
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-lg sm:text-2xl font-bold font-press-start text-slate-100">
                {user.contributions.length}
              </span>
              <span className="text-[10px] sm:text-xs font-pixel text-slate-400">回</span>
            </div>
            <span className="text-[9px] sm:text-[10px] font-pixel text-slate-400 block mt-0.5 truncate">
              社会貢献アクション
            </span>
          </div>

          {/* Card 2: QR Verified */}
          <div className="bg-slate-900/90 p-2.5 sm:p-3.5 rounded-xl pixel-box-emerald text-slate-200">
            <span className="text-[8px] sm:text-[9px] font-bold font-pixel text-emerald-400 uppercase tracking-wider block mb-0.5 sm:mb-1">
              QR実機認証
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-lg sm:text-2xl font-bold font-press-start text-emerald-400">
                {verifiedRecycleCount}
              </span>
              <span className="text-[10px] sm:text-xs font-pixel text-emerald-300">本</span>
            </div>
            <span className="text-[9px] sm:text-[10px] font-pixel text-emerald-300 block mt-0.5 truncate">
              実機リサイクル
            </span>
          </div>

          {/* Card 3: Social XP */}
          <div className="bg-slate-900/90 p-2.5 sm:p-3.5 rounded-xl pixel-box text-slate-200">
            <span className="text-[8px] sm:text-[9px] font-bold font-pixel text-slate-400 uppercase tracking-wider block mb-0.5 sm:mb-1">
              ソーシャルXP
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-base sm:text-xl font-bold font-press-start text-amber-400">
                {user.xp}
              </span>
              <span className="text-[10px] sm:text-xs font-pixel text-amber-300">XP</span>
            </div>
            <span className="text-[9px] sm:text-[10px] font-pixel text-slate-400 block mt-0.5 truncate">
              累積経験値
            </span>
          </div>

          {/* Card 4: Streak */}
          <div className="bg-slate-900/90 p-2.5 sm:p-3.5 rounded-xl pixel-box text-slate-200">
            <span className="text-[8px] sm:text-[9px] font-bold font-pixel text-slate-400 uppercase tracking-wider block mb-0.5 sm:mb-1">
              継続日数
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-lg sm:text-2xl font-bold font-press-start text-rose-400 flex items-center gap-0.5">
                🔥{user.streakDays}
              </span>
              <span className="text-[10px] sm:text-xs font-pixel text-slate-400">日連続</span>
            </div>
            <span className="text-[9px] sm:text-[10px] font-pixel text-slate-400 block mt-0.5 truncate">
              毎日の継続
            </span>
          </div>
        </div>

        {receivedLoginBonusToday && (
          <section className="bg-amber-950/70 pixel-box-gold rounded-2xl p-3.5 sm:p-4 text-amber-100 shadow-xl flex items-center gap-3 animate-fade-in">
            <div className="text-2xl sm:text-3xl" aria-hidden="true">🎁</div>
            <div className="min-w-0">
              <p className="font-bold font-pixel text-sm sm:text-base text-amber-300">デイリーログインボーナス獲得！</p>
              <p className="text-xs sm:text-sm font-pixel text-amber-100/80">+30 XP / +50 ソーシャルコイン　明日も遊びに来てね</p>
            </div>
          </section>
        )}

        {/* 2. Today's Quest Hero Card */}
        {todaysMission && (
          <section className="bg-slate-900 pixel-box-gold rounded-2xl p-3.5 sm:p-5 text-slate-200 shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 relative overflow-hidden">
            <div className="relative z-10 flex-1">
              <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
                <span className="text-[8px] sm:text-[9px] font-bold font-press-start px-2 py-0.5 rounded bg-amber-950 border border-amber-500/50 text-amber-300 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-300" />
                  DAILY QUEST
                </span>
                <span className="text-[10px] sm:text-[11px] font-pixel text-slate-400">
                  おすすめデイリークエスト
                </span>
              </div>
              <h4 className="text-sm sm:text-lg font-bold font-pixel text-slate-100 leading-tight">
                {todaysMission.title}
              </h4>
              <p className="text-slate-300 text-[11px] sm:text-xs font-pixel mt-1 leading-relaxed max-w-lg">
                {todaysMission.description}
              </p>

              <div className="mt-2.5 sm:mt-3 flex flex-wrap items-center gap-2 sm:gap-3">
                <button
                  onClick={() => {
                    audio.playClick();
                    onOpenContributionModal(todaysMission.category);
                  }}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl font-bold font-pixel text-xs pixel-btn flex items-center gap-1.5"
                  id="home-quest-record-btn"
                >
                  <span>この活動を実践・記録する</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    audio.playClick();
                    onOpenQuestView();
                  }}
                  className="text-xs font-bold font-pixel text-slate-300 hover:text-white underline underline-offset-2 transition"
                >
                  クエスト一覧
                </button>
              </div>
            </div>

            {/* Reward Box */}
            <div className="relative z-10 bg-slate-950 p-2.5 sm:p-3 rounded-xl border border-slate-800 text-center min-w-[90px] sm:min-w-[100px] shrink-0 self-stretch sm:self-auto flex flex-col justify-center">
              <span className="text-[8px] sm:text-[9px] font-bold font-press-start text-amber-400">
                報酬
              </span>
              <span className="text-base sm:text-xl font-bold font-press-start mt-0.5 text-amber-300">
                +{todaysMission.rewardXp} XP
              </span>
            </div>
          </section>
        )}

        {/* 3. Sub-Grid: Categories & Recent Activities */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Categories & Contribution Pie Chart Card */}
          <CategoryPieChart
            contributions={user.contributions}
            title="ジャンル別の貢献度"
            compact={true}
            onSelectCategory={(category) => {
              onOpenContributionModal(category);
            }}
          />

          {/* Recent Activity Card */}
          <section className="bg-slate-900/90 rounded-2xl pixel-box p-4 text-slate-200 shadow-xl">
            <div className="flex items-center justify-between mb-2.5">
              <div>
                <span className="text-[9px] font-bold font-press-start text-amber-400 block">
                  ACTIVITY LOG
                </span>
                <h3 className="font-bold font-pixel text-sm text-slate-100">
                  最近の社会貢献
                </h3>
              </div>
              <span className="text-[9px] text-slate-500 font-pixel uppercase">
                直近4件
              </span>
            </div>

            <div className="space-y-1.5">
              {recentContributions.length > 0 ? (
                recentContributions.map((c) => {
                  const isQR = c.verificationType === 'qr';

                  return (
                    <div
                      key={c.id}
                      className={`flex items-center justify-between p-2 rounded-xl bg-slate-950 border ${
                        isQR ? 'border-emerald-500/50' : 'border-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-base w-7 h-7 rounded bg-slate-900 flex items-center justify-center border border-slate-700 shrink-0">
                          {c.icon}
                        </span>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1">
                            <h4 className="font-bold font-pixel text-xs text-slate-200 truncate">
                              {c.activityTitle}
                            </h4>
                            {isQR && (
                              <span className="text-[8px] font-pixel bg-emerald-950 text-emerald-300 px-1 py-0.2 rounded border border-emerald-500/50 shrink-0">
                                QR認証
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] font-pixel text-slate-500 truncate">
                            {c.date} • {c.amount} {c.unit}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`text-xs font-bold font-pixel px-1.5 py-0.5 rounded border shrink-0 ${
                          isQR
                            ? 'text-emerald-300 bg-emerald-950 border-emerald-500/50'
                            : 'text-amber-400 bg-slate-900 border-slate-800'
                        }`}
                      >
                        +{c.xpEarned} XP
                      </span>
                    </div>
                  );
                })
              ) : (
                <div className="p-6 text-center rounded-xl bg-slate-950 text-slate-500 font-pixel text-xs border border-slate-800">
                  まだ記録がありません。「社会貢献を記録する」から冒険を始めましょう！
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
