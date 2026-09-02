import React from 'react';
import { audio } from '../utils/audio';

export type TabType = 'home' | 'quest' | 'battle' | 'social' | 'avatar' | 'profile';

interface NavbarProps {
  currentTab: TabType;
  onChangeTab: (tab: TabType) => void;
  unclaimedMissionsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onChangeTab,
  unclaimedMissionsCount,
}) => {
  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: 'home', label: 'ホーム', icon: '🏠' },
    { id: 'quest', label: 'クエスト', icon: '📜' },
    { id: 'battle', label: 'バトル', icon: '⚔️' },
    { id: 'social', label: 'ワールド', icon: '🌍' },
    { id: 'avatar', label: 'アバター', icon: '👕' },
    { id: 'profile', label: 'ステータス', icon: '🛡️' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 border-t-2 border-slate-800 h-14 sm:h-16 shadow-2xl backdrop-blur-md" id="bottom-navbar">
      <div className="max-w-6xl mx-auto h-full px-1 sm:px-4 md:px-8 flex items-center justify-around">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                audio.playClick();
                onChangeTab(tab.id);
              }}
              className={`relative flex flex-col items-center justify-center transition-all px-1 xs:px-2 sm:px-3 py-1 flex-1 max-w-[70px] sm:max-w-none ${
                isActive
                  ? 'text-amber-300 font-bold scale-105'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
              id={`nav-tab-${tab.id}`}
            >
              <div className="relative text-lg sm:text-xl leading-none">
                <span>{tab.icon}</span>
                {tab.id === 'quest' && unclaimedMissionsCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-rose-500 text-white text-[8px] sm:text-[9px] font-bold font-pixel flex items-center justify-center animate-bounce">
                    {unclaimedMissionsCount}
                  </span>
                )}
              </div>
              <span className="text-[9px] sm:text-[10px] font-bold font-pixel mt-0.5 sm:mt-1 tracking-tight truncate max-w-full">
                {tab.label}
              </span>
              {isActive && (
                <div className="w-4 sm:w-5 h-0.5 sm:h-1 rounded-full bg-amber-400 mt-0.5 shadow-sm" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
