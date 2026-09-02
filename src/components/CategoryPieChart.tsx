import React, { useState } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { CategoryType, Contribution } from '../types';
import { CATEGORIES } from '../data/initialData';
import { evaluateContributionType } from '../utils/gameHelpers';
import { audio } from '../utils/audio';
import { Sparkles, PieChart as PieIcon, Award, Zap, ChevronRight } from 'lucide-react';

interface CategoryPieChartProps {
  contributions: Contribution[];
  compact?: boolean;
  onSelectCategory?: (category: CategoryType) => void;
  className?: string;
  title?: string;
}

export const CategoryPieChart: React.FC<CategoryPieChartProps> = ({
  contributions,
  compact = false,
  onSelectCategory,
  className = '',
  title = 'ジャンル別 貢献度チャート',
}) => {
  const [metricMode, setMetricMode] = useState<'count' | 'xp'>('count');
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const typeResult = evaluateContributionType(contributions);
  const totalCount = contributions.length;
  const totalXp = contributions.reduce((sum, c) => sum + (c.xpEarned || 0), 0);

  // Prepare chart data
  const chartData = typeResult.breakdowns.map((b, idx) => {
    const cat = CATEGORIES[b.category];
    const value = metricMode === 'count' ? b.count : b.xpTotal;
    const total = metricMode === 'count' ? totalCount : totalXp;
    const percentage = total > 0 ? Math.round((value / total) * 100) : 0;

    return {
      index: idx,
      category: b.category,
      name: cat?.name || b.category,
      icon: cat?.icon || '🌱',
      color: cat?.color || '#10B981',
      value: value,
      count: b.count,
      xpTotal: b.xpTotal,
      percentage: percentage,
      description: cat?.description || '',
    };
  });

  // Check if all zero
  const hasData = chartData.some((d) => d.value > 0);

  // Fallback empty data if no contributions yet
  const displayData = hasData
    ? chartData.filter((d) => d.value > 0)
    : [
        {
          index: 0,
          category: 'environment' as CategoryType,
          name: '未記録',
          icon: '🌱',
          color: '#334155',
          value: 1,
          count: 0,
          xpTotal: 0,
          percentage: 0,
          description: 'まだ貢献記録がありません',
        },
      ];

  const activeItem = activeIndex !== null && hasData ? displayData[activeIndex] : null;

  // Custom Pie Chart Tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      if (!hasData) return null;

      return (
        <div className="bg-slate-950/95 border-2 border-slate-700 p-2.5 rounded-xl shadow-2xl font-pixel text-xs text-slate-200 min-w-[140px] z-50 pointer-events-none animate-fade-in">
          <div className="flex items-center gap-1.5 font-bold mb-1 pb-1 border-b border-slate-800">
            <span className="text-base">{data.icon}</span>
            <span style={{ color: data.color }}>{data.name}</span>
          </div>
          <div className="space-y-0.5 text-[11px]">
            <div className="flex justify-between text-slate-300">
              <span>貢献回数:</span>
              <strong className="text-white font-bold">{data.count} 回</strong>
            </div>
            <div className="flex justify-between text-amber-300">
              <span>獲得XP:</span>
              <strong className="font-bold">+{data.xpTotal} XP</strong>
            </div>
            <div className="flex justify-between text-emerald-400 font-bold pt-0.5">
              <span>割合:</span>
              <span>{data.percentage}%</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div
      className={`rounded-2xl bg-slate-900/95 border border-slate-800 p-4 pixel-box text-slate-200 ${className}`}
      id="category-pie-chart-card"
    >
      {/* Header & Metric Toggle */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center text-amber-400">
            <PieIcon className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold font-pixel text-xs sm:text-sm text-slate-100 flex items-center gap-1.5">
              <span>{title}</span>
            </h3>
            <span className="text-[10px] font-pixel text-slate-400 block">
              {metricMode === 'count' ? 'アクション回数ベース' : '獲得ソーシャルXPベース'}
            </span>
          </div>
        </div>

        {/* Mode Toggle Pills */}
        <div className="flex items-center p-0.5 rounded-lg bg-slate-950 border border-slate-800 text-[10px] font-pixel shrink-0">
          <button
            type="button"
            onClick={() => {
              audio.playClick();
              setMetricMode('count');
            }}
            className={`px-2.5 py-1 rounded-md transition font-bold flex items-center gap-1 ${
              metricMode === 'count'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            id="pie-metric-count-btn"
          >
            <span>回数</span>
          </button>
          <button
            type="button"
            onClick={() => {
              audio.playClick();
              setMetricMode('xp');
            }}
            className={`px-2.5 py-1 rounded-md transition font-bold flex items-center gap-1 ${
              metricMode === 'xp'
                ? 'bg-emerald-600 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            id="pie-metric-xp-btn"
          >
            <Zap className="w-3 h-3 text-slate-950 fill-current" />
            <span>XP</span>
          </button>
        </div>
      </div>

      {/* Main Chart Section */}
      <div className={`grid ${compact ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-12'} gap-4 items-center`}>
        {/* Pie Chart Canvas with Central Retro Label */}
        <div className={`${compact ? 'col-span-1' : 'md:col-span-6'} relative flex flex-col items-center justify-center`}>
          <div className="w-full h-48 sm:h-52 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip content={<CustomTooltip />} />
                <Pie
                  data={displayData}
                  cx="50%"
                  cy="50%"
                  innerRadius={compact ? 45 : 55}
                  outerRadius={compact ? 75 : 85}
                  paddingAngle={hasData ? 3 : 0}
                  dataKey="value"
                  animationDuration={800}
                  animationEasing="ease-out"
                  onMouseEnter={(_: any, index: number) => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(null)}
                  onClick={(entry: any) => {
                    const cat = entry?.payload?.category || entry?.category;
                    if (hasData && onSelectCategory && cat) {
                      audio.playClick();
                      onSelectCategory(cat);
                    }
                  }}
                  cursor={hasData && onSelectCategory ? 'pointer' : 'default'}
                >
                  {displayData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      stroke="#090d16"
                      strokeWidth={2}
                      className="transition-all duration-300 hover:opacity-90"
                      style={{
                        filter: activeIndex === index ? 'drop-shadow(0px 0px 6px rgba(255,255,255,0.4))' : 'none',
                        transform: activeIndex === index ? 'scale(1.03)' : 'scale(1)',
                        transformOrigin: 'center center',
                      }}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            {/* Central Badge / Summary inside Donut */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
              {hasData ? (
                activeItem ? (
                  <div className="space-y-0.5 animate-fade-in">
                    <span className="text-xl leading-none">{activeItem.icon}</span>
                    <strong className="text-xs font-bold font-pixel block text-white truncate max-w-[80px]">
                      {activeItem.name}
                    </strong>
                    <span className="text-[10px] font-pixel text-amber-300 font-bold block">
                      {activeItem.percentage}%
                    </span>
                  </div>
                ) : (
                  <div className="space-y-0.5">
                    <span className="text-lg leading-none">{typeResult.badge}</span>
                    <span className="text-[9px] font-pixel text-slate-400 uppercase block">
                      {metricMode === 'count' ? '総貢献数' : '総獲得XP'}
                    </span>
                    <strong className="text-xs font-press-start text-amber-300 block">
                      {metricMode === 'count' ? `${totalCount}回` : `${totalXp}XP`}
                    </strong>
                  </div>
                )
              ) : (
                <div className="space-y-0.5">
                  <span className="text-lg">🌱</span>
                  <span className="text-[9px] font-pixel text-slate-500 block">データなし</span>
                </div>
              )}
            </div>
          </div>

          {/* Quick Subtitle or Hint */}
          <div className="text-center mt-1">
            <span className="text-[10px] font-pixel text-slate-400 inline-flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>
                冒険者タイプ: <strong className="text-amber-300 font-bold">{typeResult.title}</strong>
              </span>
            </span>
          </div>
        </div>

        {/* Legend & Breakdown List */}
        <div className={`${compact ? 'col-span-1' : 'md:col-span-6'} space-y-1.5`}>
          {chartData.map((d, idx) => {
            const isHovered = activeIndex === idx;
            const isClickable = !!onSelectCategory;

            return (
              <div
                key={d.category}
                onMouseEnter={() => setActiveIndex(idx)}
                onMouseLeave={() => setActiveIndex(null)}
                onClick={() => {
                  if (onSelectCategory) {
                    audio.playClick();
                    onSelectCategory(d.category);
                  }
                }}
                className={`p-2 rounded-xl transition-all border flex items-center justify-between gap-2 ${
                  isHovered
                    ? 'bg-slate-800/90 border-slate-600 shadow-md ring-1 ring-slate-500/40'
                    : 'bg-slate-950/80 border-slate-800/80'
                } ${isClickable ? 'cursor-pointer hover:bg-slate-800' : ''}`}
                title={`${d.name}の貢献を記録・確認`}
              >
                {/* Left: Color Dot, Icon, Title */}
                <div className="flex items-center gap-2 min-w-0">
                  <div
                    className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm"
                    style={{ backgroundColor: d.color }}
                  />
                  <span className="text-base w-6 h-6 rounded bg-slate-900 flex items-center justify-center border border-slate-800 shrink-0">
                    {d.icon}
                  </span>
                  <div className="min-w-0">
                    <span className="text-xs font-bold font-pixel text-slate-200 truncate block">
                      {d.name}
                    </span>
                    <span className="text-[9px] font-pixel text-slate-400 block truncate">
                      {d.count} 回 • {d.xpTotal} XP
                    </span>
                  </div>
                </div>

                {/* Right: Percentage & Progress Bar & Action */}
                <div className="flex items-center gap-2 shrink-0">
                  <div className="w-14 sm:w-16 bg-slate-900 rounded-full h-1.5 overflow-hidden border border-slate-800">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${d.percentage}%`, backgroundColor: d.color }}
                    />
                  </div>
                  <strong className="text-xs font-pixel font-bold text-amber-400 w-8 text-right">
                    {d.percentage}%
                  </strong>
                  {isClickable && (
                    <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
