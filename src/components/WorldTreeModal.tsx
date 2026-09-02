import React, { useState } from 'react';
import { GlobalWorldStats } from '../types';
import { X, Sparkles, Globe, Heart, Users, Leaf, Shield, Award } from 'lucide-react';
import { audio } from '../utils/audio';
import confetti from 'canvas-confetti';

interface WorldTreeModalProps {
  isOpen: boolean;
  onClose: () => void;
  worldStats: GlobalWorldStats;
  onSendCheer: () => void;
}

export const WorldTreeModal: React.FC<WorldTreeModalProps> = ({
  isOpen,
  onClose,
  worldStats,
  onSendCheer,
}) => {
  const [cheered, setCheered] = useState<boolean>(false);

  if (!isOpen) return null;

  const currentSpan = worldStats.currentLevelTarget - worldStats.previousLevelTarget;
  const progressIntoSpan = Math.max(0, worldStats.totalContributions - worldStats.previousLevelTarget);
  const percent = Math.min(100, Math.round((progressIntoSpan / currentSpan) * 100));

  const handleCheer = () => {
    audio.playSuccess();
    setCheered(true);
    onSendCheer();
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.5 },
        colors: ['#38BDF8', '#34D399', '#FDE047'],
      });
    } catch {
      // Ignore
    }
  };

  const recentGlobalActivities = [
    { city: '東京・渋谷', text: 'ペットボトル3本をリサイクル', time: '1分前', icon: '♻️' },
    { city: '大阪・梅田', text: '公園の清掃ボランティアに参加', time: '3分前', icon: '🧹' },
    { city: '愛知・名古屋', text: '緑の基金へ少額募金を完了', time: '6分前', icon: '💰' },
    { city: '福岡・天神', text: 'SDGs学習クイズ全問正解！', time: '8分前', icon: '📚' },
    { city: '北海道・札幌', text: 'マイボトルで給水アクション', time: '12分前', icon: '🥤' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div
        className="relative w-full max-w-lg bg-slate-900 pixel-box-emerald text-slate-100 rounded-2xl border shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        id="world-tree-modal-card"
      >
        {/* Header */}
        <div className="px-5 py-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-950 border border-emerald-500 flex items-center justify-center text-base">
              🌍
            </div>
            <div>
              <h3 className="font-bold font-pixel text-sm text-emerald-300">
                グローバル世界樹（全プレイヤー共通）
              </h3>
              <p className="text-[10px] text-slate-400 font-pixel">
                みんなの社会貢献行動がひとつになり、地球規模の樹を育てます
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-colors text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* World Tree Visual Centerpiece */}
          <div className="relative rounded-xl bg-slate-950 border border-slate-800 p-4 text-center flex flex-col items-center pixel-box">
            {/* World Tree Stage SVG */}
            <div className="w-32 h-32 relative flex items-center justify-center">
              <svg viewBox="0 0 160 160" className="w-full h-full" style={{ imageRendering: 'pixelated' }}>
                <circle cx="80" cy="80" r="70" fill="#047857" opacity="0.15" />
                {/* Trunk */}
                <rect x="74" y="90" width="12" height="35" fill="#B45309" />
                <rect x="70" y="115" width="20" height="10" fill="#78350F" />
                {/* Pixel foliage layers */}
                <rect x="50" y="55" width="60" height="40" rx="4" fill="#059669" />
                <rect x="40" y="65" width="80" height="25" rx="4" fill="#10B981" />
                <rect x="60" y="35" width="40" height="30" rx="4" fill="#34D399" />
                <rect x="70" y="25" width="20" height="20" rx="2" fill="#6EE7B7" />
                {/* Orbs */}
                <rect x="55" y="70" width="6" height="6" fill="#FBBF24" />
                <rect x="95" y="60" width="6" height="6" fill="#38BDF8" />
                <rect x="75" y="45" width="8" height="8" fill="#F43F5E" />
              </svg>
            </div>

            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-emerald-950 text-emerald-300 text-[10px] font-bold font-press-start border border-emerald-500/50 mb-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>世界樹 Lv.{worldStats.worldTreeLevel}</span>
            </div>
            <h4 className="text-base font-bold font-pixel text-slate-100">
              芽吹きと希望のグローバルツリー
            </h4>
            <p className="text-xs font-pixel text-slate-400 mt-0.5 max-w-sm">
              現在、全プレイヤーによる累計社会貢献回数は{' '}
              <strong className="text-amber-400">
                {(worldStats?.totalContributions ?? 0).toLocaleString()} 回
              </strong>{' '}
              を突破！
            </p>

            {/* Level Target Progress Bar */}
            <div className="w-full mt-3 bg-slate-900 rounded-full h-3 p-0.5 border border-slate-800 relative overflow-hidden">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all duration-1000"
                style={{ width: `${percent}%` }}
              />
            </div>
            <div className="w-full flex justify-between text-[10px] font-pixel text-slate-400 mt-1">
              <span>Lv.{worldStats?.worldTreeLevel ?? 1}</span>
              <span className="font-bold text-amber-300">
                {percent}% (あと{Math.max(0, (worldStats?.currentLevelTarget ?? 100) - (worldStats?.totalContributions ?? 0)).toLocaleString()}回)
              </span>
              <span>Lv.{(worldStats?.worldTreeLevel ?? 1) + 1}</span>
            </div>
          </div>

          {/* Real-world collective impact metrics */}
          <div>
            <h4 className="text-[10px] font-bold font-press-start uppercase tracking-wider text-amber-400 mb-1.5 flex items-center gap-1">
              <Award className="w-3.5 h-3.5" />
              全プレイヤーの累計インパクト
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-950 text-emerald-400 flex items-center justify-center shrink-0">
                  <Leaf className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[9px] font-pixel text-slate-400 block">CO2削減推定</span>
                  <strong className="text-xs font-bold font-pixel text-slate-100">
                    {(worldStats?.co2SavedKg ?? 0).toLocaleString()} kg
                  </strong>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-950 text-amber-400 flex items-center justify-center shrink-0">
                  <Heart className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[9px] font-pixel text-slate-400 block">累計支援総額</span>
                  <strong className="text-xs font-bold font-pixel text-slate-100">
                    ¥{(worldStats?.donationsTotalYen ?? 0).toLocaleString()}
                  </strong>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-purple-950 text-purple-400 flex items-center justify-center shrink-0">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[9px] font-pixel text-slate-400 block">ボランティア</span>
                  <strong className="text-xs font-bold font-pixel text-slate-100">
                    {(worldStats?.volunteerHours ?? 0).toLocaleString()} 時間
                  </strong>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-950 text-blue-400 flex items-center justify-center shrink-0">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[9px] font-pixel text-slate-400 block">冒険者数</span>
                  <strong className="text-xs font-bold font-pixel text-slate-100">
                    {(worldStats?.activeExplorers ?? 0).toLocaleString()} 人
                  </strong>
                </div>
              </div>
            </div>
          </div>

          {/* Live Activity Stream */}
          <div>
            <h4 className="text-[10px] font-bold font-press-start uppercase tracking-wider text-cyan-400 mb-1.5 flex items-center gap-1">
              <Globe className="w-3.5 h-3.5" />
              全国のリアルタイムアクション
            </h4>
            <div className="space-y-1">
              {recentGlobalActivities.map((act, i) => (
                <div
                  key={i}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between text-xs font-pixel"
                >
                  <div className="flex items-center gap-1.5">
                    <span>{act.icon}</span>
                    <span className="text-amber-400">[{act.city}]</span>
                    <span className="text-slate-300">{act.text}</span>
                  </div>
                  <span className="text-[9px] text-slate-500">{act.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Cheer Button */}
          <div className="pt-1">
            <button
              type="button"
              onClick={handleCheer}
              className={`w-full py-3 rounded-xl font-bold font-pixel text-xs flex items-center justify-center gap-1.5 transition pixel-btn ${
                cheered
                  ? 'bg-slate-800 text-slate-400 cursor-default'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-slate-950 shadow-lg'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{cheered ? '世界樹にエールを送りました！✨' : '世界樹にエールを送る（+1 貢献加算）'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
