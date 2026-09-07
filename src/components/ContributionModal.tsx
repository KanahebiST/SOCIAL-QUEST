import React, { useState } from 'react';
import { CategoryType, ActivityTemplate, Contribution } from '../types';
import { CATEGORIES, ACTIVITIES } from '../data/initialData';
import { audio } from '../utils/audio';
import { X, Plus, Minus, CheckCircle, Sparkles, ShieldCheck, Camera, MapPin, QrCode, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ContributionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRecordContribution: (contribution: {
    category: CategoryType;
    activityId: string;
    activityTitle: string;
    icon: string;
    amount: number;
    unit: string;
    xpEarned: number;
    memo?: string;
  }) => void;
  onOpenQRScanner?: () => void;
  preselectedCategory?: CategoryType;
  preselectedActivityId?: string;
}

export const ContributionModal: React.FC<ContributionModalProps> = ({
  isOpen,
  onClose,
  onRecordContribution,
  onOpenQRScanner,
  preselectedCategory = 'environment',
  preselectedActivityId,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>(preselectedCategory);
  const [selectedActivityId, setSelectedActivityId] = useState<string>(
    preselectedActivityId || ACTIVITIES.find((a) => a.category === preselectedCategory)?.id || ACTIVITIES[0].id
  );
  const [amount, setAmount] = useState<number>(1);
  const [memo, setMemo] = useState<string>('');
  const [isSuccessShowing, setIsSuccessShowing] = useState<boolean>(false);
  const [lastEarnedXp, setLastEarnedXp] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Sync activity if category changes
  const categoryActivities = ACTIVITIES.filter((a) => a.category === selectedCategory);
  const currentActivity: ActivityTemplate =
    ACTIVITIES.find((a) => a.id === selectedActivityId) || categoryActivities[0] || ACTIVITIES[0];

  const handleCategoryChange = (cat: CategoryType) => {
    setSelectedCategory(cat);
    const firstInCat = ACTIVITIES.find((a) => a.category === cat);
    if (firstInCat) {
      setSelectedActivityId(firstInCat.id);
      setAmount(firstInCat.defaultAmount);
    }
    setErrorMsg('');
    audio.playClick();
  };

  const handleActivitySelect = (actId: string) => {
    setSelectedActivityId(actId);
    const act = ACTIVITIES.find((a) => a.id === actId);
    if (act) {
      setAmount(act.defaultAmount);
    }
    setErrorMsg('');
    audio.playClick();
  };

  const totalXp = (currentActivity?.baseXp || 10) * amount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || amount <= 0) {
      setErrorMsg('数量を1以上入力してください。');
      return;
    }

    if (currentActivity && amount > currentActivity.maxDailyAmount * 3) {
      setErrorMsg(`一度に登録できる上限（${currentActivity.maxDailyAmount * 3}${currentActivity.unit}）を超えています。`);
      return;
    }

    setErrorMsg('');
    setLastEarnedXp(totalXp);
    setIsSuccessShowing(true);
    audio.playSuccess();

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10B981', '#F59E0B', '#38BDF8', '#F43F5E', '#A855F7'],
      });
    } catch {
      // Ignore
    }

    setTimeout(() => {
      onRecordContribution({
        category: selectedCategory,
        activityId: currentActivity.id,
        activityTitle: currentActivity.title,
        icon: currentActivity.icon,
        amount,
        unit: currentActivity.unit,
        xpEarned: totalXp,
        memo: memo.trim() ? memo.trim() : undefined,
      });
      setIsSuccessShowing(false);
      setMemo('');
      onClose();
    }, 1400);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div
        className="relative w-full max-w-lg bg-slate-900 pixel-box-gold rounded-2xl shadow-2xl border text-slate-200 overflow-hidden max-h-[90vh] flex flex-col"
        id="contribution-modal-card"
      >
        {/* Success Overlay Animation */}
        {isSuccessShowing && (
          <div className="absolute inset-0 z-20 bg-slate-950 flex flex-col items-center justify-center text-white p-6 text-center animate-scale-up">
            <div className="w-20 h-20 rounded-2xl bg-amber-500 pixel-box-gold flex items-center justify-center mb-3 text-4xl animate-bounce">
              🎉
            </div>
            <span className="text-[10px] font-bold font-press-start text-amber-400">
              記録完了
            </span>
            <h3 className="text-xl sm:text-2xl font-bold font-press-start text-amber-300 mt-2">
              社会貢献達成！
            </h3>
            <p className="text-slate-300 text-xs font-pixel mt-1">
              社会貢献のアクションが記録されました！
            </p>
            <div className="mt-4 px-5 py-2 rounded-xl bg-slate-900 border-2 border-emerald-400 text-emerald-400 font-bold font-pixel text-xl shadow-lg inline-flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400 animate-spin" />
              +{lastEarnedXp} SOCIAL XP
            </div>
          </div>
        )}

        {/* Modal Header */}
        <div className="px-5 py-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500 pixel-box-gold flex items-center justify-center text-slate-950 text-base font-bold">
              🌱
            </div>
            <div>
              <h3 className="font-bold font-pixel text-sm text-amber-300 leading-tight">
                社会貢献アクションを記録
              </h3>
              <p className="text-[10px] text-slate-400 font-pixel">
                現実世界のアクションがドット絵キャラクターを成長させます
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-colors text-slate-400 hover:text-white"
            id="close-contribution-modal-btn"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-3.5 flex-1">
          {/* Prominent QR Code Verification CTA Banner */}
          {onOpenQRScanner && (
            <div className="p-3 bg-slate-950 border border-emerald-500/50 rounded-xl flex items-center justify-between gap-3 pixel-box-emerald">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-emerald-950 border border-emerald-500 text-emerald-300 flex items-center justify-center text-base shrink-0">
                  ♻️
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold font-pixel text-emerald-300 truncate">QRコードで実機リサイクル認証</span>
                    <span className="text-[9px] bg-emerald-600 text-slate-950 px-1 py-0.2 rounded font-bold font-pixel shrink-0">公式認証</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-pixel truncate">
                    回収BOXのQRをカメラで直接読み取って確実にXP獲得
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenQRScanner();
                }}
                className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs font-bold font-pixel shrink-0 flex items-center gap-1 pixel-btn"
                id="open-qr-scanner-from-modal-btn"
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>QR認証へ</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* Category Selector Tabs */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold font-pixel text-slate-200">
                1. 手動記録カテゴリを選択
              </label>
              <span className="text-[9px] font-pixel text-slate-500">手動アクション</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800">
              {(Object.keys(CATEGORIES) as CategoryType[]).map((catKey) => {
                const cat = CATEGORIES[catKey];
                const isSelected = selectedCategory === catKey;
                return (
                  <button
                    key={catKey}
                    type="button"
                    onClick={() => handleCategoryChange(catKey)}
                    className={`py-1.5 px-1 rounded-lg text-center flex flex-col items-center justify-center gap-0.5 transition-all ${
                      isSelected
                        ? 'bg-emerald-600 text-slate-950 font-bold shadow-md'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                    id={`cat-tab-${catKey}`}
                  >
                    <span className="text-base">{cat.icon}</span>
                    <span className="text-[10px] font-pixel font-bold truncate w-full">{cat.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Activity Selector */}
          <div>
            <label className="block text-xs font-bold font-pixel text-slate-200 mb-1">
              2. 活動内容を選択
            </label>
            <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
              {categoryActivities.map((act) => {
                const isSelected = act.id === selectedActivityId;
                return (
                  <div
                    key={act.id}
                    onClick={() => handleActivitySelect(act.id)}
                    className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-start gap-2.5 pixel-box ${
                      isSelected
                        ? 'border-amber-400 bg-amber-950/40 ring-1 ring-amber-400/50'
                        : 'border-slate-800 hover:border-slate-700 bg-slate-950/80'
                    }`}
                    id={`act-card-${act.id}`}
                  >
                    <span className="text-xl mt-0.5">{act.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold font-pixel text-xs text-slate-100 truncate">
                          {act.title}
                        </h4>
                        <span className="text-[10px] font-bold font-pixel text-emerald-300 bg-emerald-950 border border-emerald-500/50 px-1.5 py-0.2 rounded shrink-0">
                          +{act.baseXp} XP / {act.unit}
                        </span>
                      </div>
                      <p className="text-[10px] font-pixel text-slate-400 mt-0.5 line-clamp-1">
                        {act.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Amount / Multiplier */}
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-xs font-bold font-pixel text-slate-200">
                  3. 実施数量
                </label>
                <span className="text-[10px] font-pixel text-slate-400">
                  単位: {currentActivity.unit}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setAmount((prev) => Math.max(1, prev - 1));
                    audio.playClick();
                  }}
                  className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 hover:bg-slate-700 flex items-center justify-center font-bold text-slate-200 transition pixel-btn"
                  id="amount-decrement-btn"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={amount}
                  onChange={(e) => setAmount(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-14 h-8 text-center font-bold font-pixel text-sm text-amber-300 bg-slate-900 border border-slate-700 rounded-lg focus:ring-1 focus:ring-amber-400 focus:outline-none"
                  id="amount-input"
                />
                <button
                  type="button"
                  onClick={() => {
                    setAmount((prev) => prev + 1);
                    audio.playClick();
                  }}
                  className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 hover:bg-slate-700 flex items-center justify-center font-bold text-slate-200 transition pixel-btn"
                  id="amount-increment-btn"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Optional Memo */}
          <div>
            <label className="block text-xs font-bold font-pixel text-slate-200 mb-1">
              4. 一言メモ（任意）
            </label>
            <input
              type="text"
              placeholder="例: 近所の公園を散歩しながらゴミ拾いを実施"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              maxLength={60}
              className="w-full px-3 py-2 text-xs font-pixel text-slate-200 bg-slate-950 border border-slate-800 rounded-xl focus:ring-1 focus:ring-emerald-400 focus:outline-none placeholder-slate-600"
              id="contribution-memo-input"
            />
          </div>

          {/* Error Message */}
          {errorMsg && (
            <p className="text-xs font-pixel text-rose-400 bg-rose-950/60 p-2 rounded-lg border border-rose-500/40">
              ⚠️ {errorMsg}
            </p>
          )}

          {/* Submit CTA & Live XP Calculation */}
          <div className="pt-1">
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold font-pixel text-xs pixel-btn flex items-center justify-center gap-2 shadow-lg"
              id="submit-contribution-btn"
            >
              <Sparkles className="w-4 h-4" />
              <span>記録して +{totalXp} XP を獲得！</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
