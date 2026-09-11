import React, { useState, useEffect } from 'react';
import {
  UserProfile,
  CategoryType,
  AvatarConfig,
  AvatarItem,
  GlobalWorldStats,
  RecyclingSpot,
  Verification,
  Contribution,
} from './types';
import {
  loadUserProfile,
  saveUserProfile,
  loadWorldStats,
  saveWorldStats,
  getLevelForXp,
  checkNewlyUnlockedItems,
  evaluateAchievements,
  evaluateContributionType,
} from './utils/gameHelpers';
import {
  INITIAL_USER,
  INITIAL_WORLD_STATS,
  AVATAR_ITEMS,
  RECYCLING_SPOTS,
} from './data/initialData';
import { RPG_ITEMS } from './data/items';
import { Header } from './components/Header';
import { Navbar, TabType } from './components/Navbar';
import { HomeView } from './views/HomeView';
import { QuestView } from './views/QuestView';
import { SocialView } from './views/SocialView';
import { AvatarView } from './views/AvatarView';
import { BattleView } from './views/BattleView';
import { ProfileView } from './views/ProfileView';
import { ContributionModal } from './components/ContributionModal';
import { LevelUpModal } from './components/LevelUpModal';
import { WorldTreeModal } from './components/WorldTreeModal';
import { QRScannerModal } from './components/QRScannerModal';
import { TestQRCodeModal } from './components/TestQRCodeModal';
import { audio } from './utils/audio';

export default function App() {
  const [user, setUser] = useState<UserProfile>(() => loadUserProfile());
  const [worldStats, setWorldStats] = useState<GlobalWorldStats>(() => loadWorldStats());
  const [currentTab, setCurrentTab] = useState<TabType>('home');

  // Modals state
  const [isContributionOpen, setIsContributionOpen] = useState<boolean>(false);
  const [preselectedCategory, setPreselectedCategory] = useState<CategoryType>('environment');
  const [preselectedActivityId, setPreselectedActivityId] = useState<string | undefined>();
  const [isWorldTreeOpen, setIsWorldTreeOpen] = useState<boolean>(false);
  const [isLevelUpOpen, setIsLevelUpOpen] = useState<boolean>(false);
  const [levelUpInfo, setLevelUpInfo] = useState<{ newLevel: number; unlockedItems: AvatarItem[] }>({
    newLevel: 1,
    unlockedItems: [],
  });

  // QR Scanner & Test QR Modals
  const [isQRScannerOpen, setIsQRScannerOpen] = useState<boolean>(false);
  const [isTestQROpen, setIsTestQROpen] = useState<boolean>(false);
  const [selectedSpotForScanner, setSelectedSpotForScanner] = useState<RecyclingSpot | undefined>();
  const [testQRInitialSpotId, setTestQRInitialSpotId] = useState<string | undefined>();

  // Save changes on state update
  useEffect(() => {
    saveUserProfile(user);
  }, [user]);

  useEffect(() => {
    saveWorldStats(worldStats);
  }, [worldStats]);

  // Open contribution modal helper
  const handleOpenContribution = (cat: CategoryType = 'environment', actId?: string) => {
    setPreselectedCategory(cat);
    setPreselectedActivityId(actId);
    setIsContributionOpen(true);
  };

  // Open QR Scanner helper
  const handleOpenQRScanner = (spot?: RecyclingSpot) => {
    setSelectedSpotForScanner(spot);
    setIsQRScannerOpen(true);
  };

  // Open Test QR Modal helper
  const handleOpenTestQRModal = (spotId?: string) => {
    setTestQRInitialSpotId(spotId);
    setIsTestQROpen(true);
  };

  // Record a manual social contribution
  const handleRecordContribution = (data: {
    category: CategoryType;
    activityId: string;
    activityTitle: string;
    icon: string;
    amount: number;
    unit: string;
    xpEarned: number;
    memo?: string;
  }) => {
    const oldLevel = user.level;
    const newXp = user.xp + data.xpEarned;
    const { level: calculatedLevel } = getLevelForXp(newXp);

    const nowStr = new Date();
    const dateFormatted = `${nowStr.getFullYear()}/${String(nowStr.getMonth() + 1).padStart(2, '0')}/${String(
      nowStr.getDate()
    ).padStart(2, '0')} ${String(nowStr.getHours()).padStart(2, '0')}:${String(nowStr.getMinutes()).padStart(2, '0')}`;

    const newContribution: Contribution = {
      id: `cnt_${Date.now()}`,
      category: data.category,
      activityId: data.activityId,
      activityTitle: data.activityTitle,
      icon: data.icon,
      amount: data.amount,
      unit: data.unit,
      xpEarned: data.xpEarned,
      date: dateFormatted,
      memo: data.memo,
      verificationType: 'manual',
    };

    const updatedContributions = [newContribution, ...user.contributions];

    // Update Missions progress
    const updatedMissions = user.missions.map((m) => {
      let increment = 0;
      if (m.category === data.category || !m.category) {
        increment = 1;
      }
      // Specific mission rules
      if (m.id === 'mis_daily_1' && (data.activityId === 'act_bottle_recycle' || data.activityId === 'act_can_recycle')) {
        increment = data.amount;
      }
      if (m.id === 'mis_daily_2' && (data.activityId === 'act_eco_bag' || data.activityId === 'act_my_bottle')) {
        increment = data.amount;
      }
      if (m.id === 'mis_daily_3' && (data.activityId === 'act_read_article' || data.activityId === 'act_sdgs_quiz')) {
        increment = 1;
      }
      if (m.id === 'mis_weekly_2') {
        increment = data.xpEarned;
      }

      const nextCount = Math.min(m.targetCount, m.currentCount + increment);
      const isCompleted = nextCount >= m.targetCount;
      return {
        ...m,
        currentCount: nextCount,
        completed: isCompleted,
      };
    });

    // Temp user for evaluation
    let evaluatedUser: UserProfile = {
      ...user,
      level: calculatedLevel,
      xp: newXp,
      contributions: updatedContributions,
      missions: updatedMissions,
    };

    // Update Achievements
    const { updatedAchievements } = evaluateAchievements(evaluatedUser);
    evaluatedUser.achievements = updatedAchievements;

    // Dynamic Title Update
    const typeResult = evaluateContributionType(evaluatedUser.contributions);
    evaluatedUser.title = `${typeResult.badge} ${typeResult.title}`;

    // Check newly unlocked items
    const newlyUnlocked = checkNewlyUnlockedItems(evaluatedUser, oldLevel, evaluatedUser.level);
    if (newlyUnlocked.length > 0) {
      const unlockedIdsSet = new Set(evaluatedUser.unlockedItemIds);
      newlyUnlocked.forEach((item) => unlockedIdsSet.add(item.id));
      evaluatedUser.unlockedItemIds = Array.from(unlockedIdsSet);
    }

    // Check level up event
    if (calculatedLevel > oldLevel) {
      setLevelUpInfo({
        newLevel: calculatedLevel,
        unlockedItems: newlyUnlocked,
      });
      setIsLevelUpOpen(true);
    }

    // Update user state
    setUser(evaluatedUser);

    // Update global world tree stats
    setWorldStats((prev) => {
      const newTotal = prev.totalContributions + 1;
      let newWorldLevel = prev.worldTreeLevel;
      let prevTarget = prev.previousLevelTarget;
      let curTarget = prev.currentLevelTarget;

      if (newTotal >= curTarget) {
        newWorldLevel++;
        prevTarget = curTarget;
        curTarget = curTarget * 2;
      }

      return {
        ...prev,
        totalContributions: newTotal,
        worldTreeLevel: newWorldLevel,
        previousLevelTarget: prevTarget,
        currentLevelTarget: curTarget,
        co2SavedKg: prev.co2SavedKg + (data.category === 'environment' ? 1.2 : 0.3),
        donationsTotalYen: prev.donationsTotalYen + (data.category === 'support' ? 500 : 0),
        learningActionsCount: (prev.learningActionsCount || 0) + (data.category === 'learning' ? 1 : 0),
      };
    });
  };

  // Battle画面から更新されたユーザー情報を受け取り、実績評価も行う
  const handleBattleUpdateUser = (updatedUser: UserProfile) => {
    const oldLevel = user.level;

    let evaluatedUser: UserProfile = { ...updatedUser };

    const { updatedAchievements } = evaluateAchievements(evaluatedUser);
    evaluatedUser.achievements = updatedAchievements;

    const newlyUnlocked = checkNewlyUnlockedItems(evaluatedUser, oldLevel, evaluatedUser.level);
    if (newlyUnlocked.length > 0) {
      const unlockedIdsSet = new Set(evaluatedUser.unlockedItemIds);
      newlyUnlocked.forEach((item) => unlockedIdsSet.add(item.id));
      evaluatedUser.unlockedItemIds = Array.from(unlockedIdsSet);
    }

    if (evaluatedUser.level > oldLevel) {
      setLevelUpInfo({
        newLevel: evaluatedUser.level,
        unlockedItems: newlyUnlocked,
      });
      setIsLevelUpOpen(true);
    }

    setUser(evaluatedUser);
  };

  // Record a verified QR code recycling action
  const handleConfirmQRVerification = (data: {
    spot: RecyclingSpot;
    amount: number;
    memo?: string;
  }) => {
    const earnedXp = data.spot.rewardXP * data.amount;
    const oldLevel = user.level;
    const newXp = user.xp + earnedXp;
    const { level: calculatedLevel } = getLevelForXp(newXp);

    const nowStr = new Date();
    const dateFormatted = `${nowStr.getFullYear()}/${String(nowStr.getMonth() + 1).padStart(2, '0')}/${String(
      nowStr.getDate()
    ).padStart(2, '0')} ${String(nowStr.getHours()).padStart(2, '0')}:${String(nowStr.getMinutes()).padStart(2, '0')}`;

    const newVerification: Verification = {
      id: `ver_${Date.now()}`,
      userId: user.id,
      spotId: data.spot.id,
      spotName: data.spot.name,
      verifiedAt: dateFormatted,
      rewardXP: earnedXp,
    };

    const newContribution: Contribution = {
      id: `cnt_qr_${Date.now()}`,
      category: 'environment',
      activityId: 'act_bottle_recycle',
      activityTitle: `${data.spot.name}でペットボトル回収`,
      icon: '♻️',
      amount: data.amount,
      unit: '本',
      xpEarned: earnedXp,
      date: dateFormatted,
      memo: data.memo || `QR認証回収BOX (${data.spot.location})`,
      verificationType: 'qr',
      spotId: data.spot.id,
      spotName: data.spot.name,
      verifiedAt: dateFormatted,
    };

    const updatedContributions = [newContribution, ...user.contributions];
    const updatedVerifications = [newVerification, ...(user.verifications || [])];

    // Update Missions progress
    const updatedMissions = user.missions.map((m) => {
      let increment = 0;
      if (m.category === 'environment' || !m.category) {
        increment = 1;
      }
      if (m.id === 'mis_daily_1') {
        increment = data.amount;
      }
      if (m.id === 'mis_weekly_2') {
        increment = earnedXp;
      }

      const nextCount = Math.min(m.targetCount, m.currentCount + increment);
      const isCompleted = nextCount >= m.targetCount;
      return {
        ...m,
        currentCount: nextCount,
        completed: isCompleted,
      };
    });

    let evaluatedUser: UserProfile = {
      ...user,
      level: calculatedLevel,
      xp: newXp,
      contributions: updatedContributions,
      verifications: updatedVerifications,
      missions: updatedMissions,
    };

    // Update Achievements
    const { updatedAchievements } = evaluateAchievements(evaluatedUser);
    evaluatedUser.achievements = updatedAchievements;

    // Dynamic Title Update
    const typeResult = evaluateContributionType(evaluatedUser.contributions);
    evaluatedUser.title = `${typeResult.badge} ${typeResult.title}`;

    // Check newly unlocked items
    const newlyUnlocked = checkNewlyUnlockedItems(evaluatedUser, oldLevel, evaluatedUser.level);
    if (newlyUnlocked.length > 0) {
      const unlockedIdsSet = new Set(evaluatedUser.unlockedItemIds);
      newlyUnlocked.forEach((item) => unlockedIdsSet.add(item.id));
      evaluatedUser.unlockedItemIds = Array.from(unlockedIdsSet);
    }

    // Check level up event
    if (calculatedLevel > oldLevel) {
      setLevelUpInfo({
        newLevel: calculatedLevel,
        unlockedItems: newlyUnlocked,
      });
      setIsLevelUpOpen(true);
    }

    setUser(evaluatedUser);

    // Update global world tree stats
    setWorldStats((prev) => {
      const newTotal = prev.totalContributions + 1;
      let newWorldLevel = prev.worldTreeLevel;
      let prevTarget = prev.previousLevelTarget;
      let curTarget = prev.currentLevelTarget;

      if (newTotal >= curTarget) {
        newWorldLevel++;
        prevTarget = curTarget;
        curTarget = curTarget * 2;
      }

      return {
        ...prev,
        totalContributions: newTotal,
        worldTreeLevel: newWorldLevel,
        previousLevelTarget: prevTarget,
        currentLevelTarget: curTarget,
        co2SavedKg: prev.co2SavedKg + data.amount * 0.5,
      };
    });
  };

  // Claim Mission Reward
  const handleClaimMission = (missionId: string) => {
    const mission = user.missions.find((m) => m.id === missionId);
    if (!mission || !mission.completed || mission.claimed) return;

    const newXp = user.xp + mission.rewardXp;
    const { level: newLevel } = getLevelForXp(newXp);
    const oldLevel = user.level;

    let updatedUnlocked = [...user.unlockedItemIds];
    if (mission.rewardItemId && !updatedUnlocked.includes(mission.rewardItemId)) {
      updatedUnlocked.push(mission.rewardItemId);
    }

    const updatedMissions = user.missions.map((m) =>
      m.id === missionId ? { ...m, claimed: true } : m
    );

    let updatedUser: UserProfile = {
      ...user,
      xp: newXp,
      level: newLevel,
      missions: updatedMissions,
      unlockedItemIds: updatedUnlocked,
    };

    if (newLevel > oldLevel) {
      const newlyUnlocked = checkNewlyUnlockedItems(updatedUser, oldLevel, newLevel);
      setLevelUpInfo({
        newLevel,
        unlockedItems: newlyUnlocked,
      });
      setIsLevelUpOpen(true);
    }

    setUser(updatedUser);
  };

  const handleClaimAchievement = (achievementId: string) => {
    const achievement = user.achievements.find((a) => a.id === achievementId);
    if (!achievement || !achievement.unlocked || achievement.claimed) return;

    const newXp = user.xp + achievement.rewardXp;
    const { level: newLevel } = getLevelForXp(newXp);
    const oldLevel = user.level;

    const updatedUnlockedItems = [...user.unlockedItemIds];
    if (achievement.rewardItemId && !updatedUnlockedItems.includes(achievement.rewardItemId)) {
      updatedUnlockedItems.push(achievement.rewardItemId);
    }

    const updatedAchievements = user.achievements.map((a) =>
      a.id === achievementId ? { ...a, claimed: true } : a
    );

    const updatedUser: UserProfile = {
      ...user,
      xp: newXp,
      level: newLevel,
      achievements: updatedAchievements,
      unlockedItemIds: updatedUnlockedItems,
      title: achievement.rewardTitle || user.title,
    };

    if (newLevel > oldLevel) {
      const newlyUnlocked = checkNewlyUnlockedItems(updatedUser, oldLevel, newLevel);
      setLevelUpInfo({
        newLevel,
        unlockedItems: newlyUnlocked,
      });
      setIsLevelUpOpen(true);
    }

    setUser(updatedUser);
  };

  const handleReadSocialArticle = (missionId: string) => {
    setUser((prev) => ({
      ...prev,
      missions: prev.missions.map((mission) => {
        if (mission.id !== missionId || mission.completed) return mission;
        const currentCount = Math.min(mission.targetCount, mission.currentCount + 1);
        return {
          ...mission,
          currentCount,
          completed: currentCount >= mission.targetCount,
        };
      }),
    }));
  };

  // Save Avatar configuration
  const handleSaveAvatar = (newConfig: AvatarConfig) => {
    setUser((prev) => ({
      ...prev,
      avatar: newConfig,
      equippedItems: newConfig,
    }));
  };

  // Send cheer to World Tree
  const handleSendCheer = () => {
    setWorldStats((prev) => ({
      ...prev,
      totalContributions: prev.totalContributions + 1,
    }));
  };

  // Reset demo user data
  const handleResetData = () => {
    audio.playClick();
    if (window.confirm('データを初期状態にリセットしますか？')) {
      setUser(INITIAL_USER);
      setWorldStats(INITIAL_WORLD_STATS);
      localStorage.removeItem('socialquest_user_profile_v2');
      localStorage.removeItem('socialquest_world_stats_v2');
    }
  };

  // Load Preset
  const handleLoadPreset = (preset: 'beginner' | 'explorer' | 'master') => {
    audio.playClick();
    if (preset === 'beginner') {
      setUser({
        ...INITIAL_USER,
        level: 1,
        xp: 0,
        contributions: [],
        verifications: [],
        equippedItems: {
          skinColor: 'skin_natural',
          hairStyle: 'hair_short',
          hairColor: '#38281F',
          clothes: 'cloth_tshirt',
          accessory: 'acc_none',
          special: 'spec_none',
          pet: 'pet_none',
          background: 'bg_park',
        },
        unlockedItemIds: ['skin_natural', 'hair_short', 'cloth_tshirt', 'acc_none', 'spec_none', 'pet_none', 'bg_park'],
      });
    } else if (preset === 'explorer') {
      setUser(INITIAL_USER);
    } else if (preset === 'master') {
      setUser({
        ...INITIAL_USER,
        name: 'Gaia Legend',
        level: 15,
        xp: 9800,
        streakDays: 18,
        title: '🌍 オールラウンダー',
        equippedItems: {
          skinColor: 'skin_natural',
          hairStyle: 'hair_spiky',
          hairColor: '#10B981',
          clothes: 'cloth_gaia_robe',
          accessory: 'acc_earth_badge',
          special: 'spec_glowing_aura',
          pet: 'pet_calico_cat',
          background: 'bg_starry_sky',
        },
        unlockedItemIds: RPG_ITEMS.map((i) => i.id),
      });
    }
  };

  const unclaimedCount = user.missions.filter((m) => m.completed && !m.claimed).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950" id="social-quest-app">
      {/* Top Retro HUD Header */}
      <Header
        user={user}
        onOpenContributionModal={() => handleOpenContribution()}
        onOpenWorldTree={() => setIsWorldTreeOpen(true)}
        onOpenWorldMap={() => setCurrentTab('social')}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-2.5 sm:px-6 pt-3 sm:pt-4 pb-20 sm:pb-24">
        {currentTab === 'home' && (
          <HomeView
            user={user}
            onOpenContributionModal={(cat, actId) => handleOpenContribution(cat, actId)}
            onOpenAvatarView={() => setCurrentTab('avatar')}
            onOpenQuestView={() => setCurrentTab('quest')}
            onOpenSocialView={() => setCurrentTab('social')}
            onOpenWorldTree={() => setIsWorldTreeOpen(true)}
            onOpenWorldMap={() => setCurrentTab('social')}
            onOpenQRScanner={() => handleOpenQRScanner()}
            onOpenBattleView={() => setCurrentTab('battle')}
          />
        )}

        {currentTab === 'quest' && (
          <QuestView
            user={user}
            onClaimMission={handleClaimMission}
            onOpenContributionModal={(cat) => handleOpenContribution(cat)}
            onOpenQRScanner={() => handleOpenQRScanner()}
            onReadSocialArticle={handleReadSocialArticle}
          />
        )}

        {currentTab === 'battle' && (
          <BattleView
            user={user}
            onUpdateUser={handleBattleUpdateUser}
            onUnlockItem={(item) => {
              setUser((prev) => ({
                ...prev,
                unlockedItems: Array.from(new Set([...prev.unlockedItems, item.id])),
              }));
            }}
            onEquipItem={(category, itemId) => {
              setUser((prev) => {
                const currentAvatar = { ...prev.avatar };
                if (category === 'weapon') currentAvatar.weapon = itemId;
                else if (category === 'hat') currentAvatar.hat = itemId;
                else if (category === 'clothes') currentAvatar.clothes = itemId;
                else if (category === 'pet') currentAvatar.pet = itemId;
                else if (category === 'back') currentAvatar.back = itemId;
                else if (category === 'special') currentAvatar.special = itemId;
                else if (category === 'background') currentAvatar.background = itemId;
                return { ...prev, avatar: currentAvatar };
              });
            }}
          />
        )}

        {currentTab === 'social' && (
          <SocialView
            user={user}
            onOpenContributionModal={(cat, actId) => handleOpenContribution(cat, actId)}
            onOpenWorldTree={() => setIsWorldTreeOpen(true)}
            onOpenQRScanner={(spot) => handleOpenQRScanner(spot)}
            onOpenTestQRModal={(spotId) => handleOpenTestQRModal(spotId)}
          />
        )}

        {currentTab === 'avatar' && (
          <AvatarView
            user={user}
            onSaveAvatar={handleSaveAvatar}
          />
        )}

        {currentTab === 'profile' && (
          <ProfileView
            user={user}
            onResetData={handleResetData}
            onLoadPreset={handleLoadPreset}
            onClaimAchievement={handleClaimAchievement}
          />
        )}
      </main>

      {/* Bottom 5-Tab Navigation */}
      <Navbar
        currentTab={currentTab}
        onChangeTab={setCurrentTab}
        unclaimedMissionsCount={unclaimedCount}
      />

      {/* Contribution Activity Logger Modal */}
      <ContributionModal
        isOpen={isContributionOpen}
        onClose={() => setIsContributionOpen(false)}
        onRecordContribution={handleRecordContribution}
        preselectedCategory={preselectedCategory}
        preselectedActivityId={preselectedActivityId}
      />

      {/* QR Code Scanner Verification Modal */}
      <QRScannerModal
        isOpen={isQRScannerOpen}
        onClose={() => setIsQRScannerOpen(false)}
        user={user}
        preselectedSpot={selectedSpotForScanner}
        onConfirmVerification={handleConfirmQRVerification}
        onOpenTestQRModal={(spotId) => handleOpenTestQRModal(spotId)}
      />

      {/* Test QR Code Display Modal */}
      <TestQRCodeModal
        isOpen={isTestQROpen}
        onClose={() => setIsTestQROpen(false)}
        initialSpotId={testQRInitialSpotId}
        onSelectSpotToScan={(spot) => {
          setIsTestQROpen(false);
          handleOpenQRScanner(spot);
        }}
      />

      {/* Celebratory Level Up Modal */}
      <LevelUpModal
        isOpen={isLevelUpOpen}
        onClose={() => setIsLevelUpOpen(false)}
        newLevel={levelUpInfo.newLevel}
        unlockedItems={levelUpInfo.unlockedItems}
        onOpenAvatarView={() => {
          setIsLevelUpOpen(false);
          setCurrentTab('avatar');
        }}
      />

      {/* Global Shared World Tree Modal */}
      <WorldTreeModal
        isOpen={isWorldTreeOpen}
        onClose={() => setIsWorldTreeOpen(false)}
        worldStats={worldStats}
        onSendCheer={handleSendCheer}
      />
    </div>
  );
}
