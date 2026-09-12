import React, { useState } from 'react';
import { UserProfile, Mission } from '../types';
import { SOCIAL_ARTICLES } from '../data/socialArticles';
import { Sparkles, CheckCircle2, Clock, Gift, Award, ArrowRight, ShieldCheck } from 'lucide-react';
import { audio } from '../utils/audio';
import confetti from 'canvas-confetti';

interface QuestViewProps {
  user: UserProfile;
  onClaimMission: (missionId: string) => void;
  onOpenContributionModal: (cat?: any) => void;
  onOpenBarcodeScanner?: () => void;
  onReadSocialArticle?: (missionId: string) => void;
}

export const QuestView: React.FC<QuestViewProps> = ({
  user,
  onClaimMission,
  onOpenContributionModal,
  onOpenBarcodeScanner,
  onReadSocialArticle,
}) => {
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly'>('daily');

  const dailyMissions = user.missions.filter((m) => m.type === 'daily');
  const weeklyMissions = user.missions.filter((m) => m.type === 'weekly');
  const currentMissions = activeTab === 'daily' ? dailyMissions : weeklyMissions;

  const handleClaim = (m: Mission) => {
    audio.playSuccess();
    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#F59E0B', '#10B981', '#38BDF8'],
      });
    } catch {
      // Ignore
    }
    onClaimMission(m.id);
  };

  return (
    <div className="space-y-4 pb-8 animate-fade-in" id="quest-view">
      {/* Header Banner */}
      <div className="rounded-2xl bg-slate-900 pixel-box-gold p-4 sm:p-5 text-slate-200 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold font-press-start px-2 py-0.5 rounded bg-amber-950 border border-amber-500/60 text-amber-300 inline-flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-300" />
              ギルド掲示板
            </span>
            <h2 className="text-base sm:text-lg font-bold font-pixel text-slate-100 mt-1">
              冒険者ギルドのソーシャルクエスト
            </h2>
            <p className="text-xs text-slate-400 font-pixel mt-0.5">
              社会貢献ミッションをクリアして、SOCIAL XPと限定装備を獲得しよう！
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-slate-950 flex items-center justify-center text-3xl border border-slate-800 shadow-inner">
            📜
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="mt-4 grid grid-cols-2 gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800">
          <button
            onClick={() => {
              audio.playClick();
              setActiveTab('daily');
            }}
            className={`py-2 rounded-lg text-xs font-bold font-pixel transition ${
              activeTab === 'daily'
                ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            id="quest-daily-tab-btn"
          >
            デイリークエスト ({dailyMissions.filter((m) => m.completed && !m.claimed).length} 件受取可)
          </button>
          <button
            onClick={() => {
              audio.playClick();
              setActiveTab('weekly');
            }}
            className={`py-2 rounded-lg text-xs font-bold font-pixel transition ${
              activeTab === 'weekly'
                ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            id="quest-weekly-tab-btn"
          >
            ウィークリークエスト
          </button>
        </div>
      </div>

      {/* Social Article Quests */}
      <section className="rounded-xl border border-pink-500/50 bg-slate-900 p-4 pixel-box" id="social-article-quests">
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="text-[10px] font-bold font-pixel text-pink-300">学習・啓発クエスト</span>
            <h3 className="font-bold font-pixel text-sm text-slate-100 mt-1">社会問題の記事を読む</h3>
            <p className="text-xs font-pixel text-slate-400 mt-1">記事を開いて、社会課題を知る一歩を記録しよう。</p>
          </div>
          <span className="text-2xl">📰</span>
        </div>

        <div className="mt-3 space-y-2">
          {SOCIAL_ARTICLES.map((article) => (
            <a
              key={article.id}
              href={article.url}
              target="_blank"
              rel="noreferrer"
              onClick={() => onReadSocialArticle?.(article.missionId)}
              className="block rounded-lg border border-slate-700 bg-slate-950 p-3 hover:border-pink-400 hover:bg-slate-800 transition"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-bold font-pixel text-slate-100">{article.title}</p>
                  <p className="text-[10px] font-pixel text-slate-400 mt-1">{article.summary}</p>
                  <p className="text-[10px] font-pixel text-pink-300 mt-2">{article.source} ・ {article.publishedAt}</p>
                </div>
                <ArrowRight className="w-4 h-4 shrink-0 text-pink-300" />
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Mission List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {currentMissions.map((m) => {
          const isReadyToClaim = m.completed && !m.claimed;
          const isFinished = m.completed && m.claimed;
          const progressPercent = Math.min(
            100,
            Math.round((m.currentCount / m.targetCount) * 100)
          );

          return (
            <div
              key={m.id}
              className={`p-4 rounded-xl border transition-all pixel-box ${
                isReadyToClaim
                  ? 'bg-slate-900 border-amber-400 ring-2 ring-amber-400/40 shadow-lg'
                  : isFinished
                  ? 'bg-slate-950/70 border-slate-800 opacity-60'
                  : 'bg-slate-900 border-slate-800'
              }`}
              id={`mission-card-${m.id}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold font-pixel text-amber-300 bg-amber-950 border border-amber-500/50 px-2 py-0.2 rounded">
                      {m.type === 'daily' ? 'デイリー' : 'ウィークリー'}
                    </span>
                    <span className="text-[10px] font-pixel text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {m.expiresAt}
                    </span>
                  </div>

                  <h3 className="font-bold font-pixel text-xs sm:text-sm text-slate-100 leading-snug">
                    {m.title}
                  </h3>
                  <p className="text-xs font-pixel text-slate-400 mt-0.5 leading-relaxed">
                    {m.description}
                  </p>
                </div>

                {/* Reward Preview */}
                <div className="text-right shrink-0">
                  <span className="text-xs font-bold font-pixel text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/50 block text-center">
                    +{m.rewardXp} XP
                  </span>
                  {m.rewardItemId && (
                    <span className="text-[10px] font-pixel text-purple-300 bg-purple-950 px-1.5 py-0.5 rounded border border-purple-500/50 mt-1 inline-flex items-center gap-0.5">
                      <Gift className="w-2.5 h-2.5" />
                      限定装備
                    </span>
                  )}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-3">
                <div className="flex justify-between text-[10px] font-pixel mb-1">
                  <span className="text-slate-400">進捗状況</span>
                  <span className={isReadyToClaim ? 'text-amber-400 font-bold' : 'text-slate-400'}>
                    {m.currentCount} / {m.targetCount} ({progressPercent}%)
                  </span>
                </div>
                <div className="w-full bg-slate-950 rounded h-2 overflow-hidden border border-slate-800">
                  <div
                    className={`h-full rounded transition-all duration-500 ${
                      isReadyToClaim
                        ? 'bg-amber-400 animate-pulse'
                        : isFinished
                        ? 'bg-slate-700'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-3 flex justify-end">
                {isReadyToClaim ? (
                  <button
                    onClick={() => handleClaim(m)}
                    className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold font-pixel text-xs pixel-btn flex items-center justify-center gap-1.5 shadow-md"
                    id={`claim-btn-${m.id}`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>クエスト達成報酬を受け取る (+{m.rewardXp} XP)</span>
                  </button>
                ) : isFinished ? (
                  <div className="w-full py-2 rounded-xl bg-slate-950 text-slate-500 font-pixel text-xs flex items-center justify-center gap-1 border border-slate-800">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span>報酬受け取り済み</span>
                  </div>
                ) : (
                  <div className="w-full flex gap-2">
                    {m.category === 'environment' && onOpenBarcodeScanner && (
                      <button
                        onClick={onOpenBarcodeScanner}
                        className="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold font-pixel text-xs pixel-btn flex items-center justify-center gap-1 shrink-0"
                      >
                          <span>📷</span> バーコード記録
                      </button>
                    )}
                    <button
                      onClick={() => {
                        audio.playClick();
                        onOpenContributionModal(m.category);
                      }}
                      className="flex-1 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-emerald-400 font-bold font-pixel text-xs border border-slate-700 flex items-center justify-center gap-1 transition"
                    >
                      <span>このクエストを実践する</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
