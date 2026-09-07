import {
  Contribution,
  CategoryType,
  ContributionTypeId,
  UserProfile,
  AvatarItem,
  GlobalWorldStats,
  RecyclingSpot,
  Verification,
  QRSpotPayload,
} from '../types';
import {
  AVATAR_ITEMS,
  LEVEL_THRESHOLDS,
  INITIAL_USER,
  INITIAL_WORLD_STATS,
  RECYCLING_SPOTS,
  getLevelForXp,
} from '../data/initialData';

export { getLevelForXp };

export interface CategoryBreakdown {
  category: CategoryType;
  count: number;
  xpTotal: number;
  percentage: number;
}

export interface ContributionTypeResult {
  id: ContributionTypeId;
  title: string;
  badge: string;
  tagline: string;
  color: string;
  bgClass: string;
  breakdowns: CategoryBreakdown[];
}

export function getCategoryCounts(contributions: Contribution[]): Record<CategoryType, number> {
  const counts: Record<CategoryType, number> = {
    environment: 0,
    support: 0,
    learning: 0,
  };

  contributions.forEach((c) => {
    if (counts[c.category as CategoryType] !== undefined) {
      counts[c.category as CategoryType]++;
    }
  });

  return counts;
}

export function getVerifiedRecycleCount(user: UserProfile): number {
  if (user.verifications && user.verifications.length > 0) {
    return user.verifications.length;
  }
  return user.contributions.filter((c) => c.verificationType === 'qr').length;
}

export function getVerificationRate(user: UserProfile): {
  total: number;
  verified: number;
  rate: number;
} {
  const total = user.contributions.length;
  const verified = getVerifiedRecycleCount(user);
  const rate = total > 0 ? Math.round((verified / total) * 100) : 0;
  return { total, verified, rate };
}

export function getTodayDateString(): string {
  const now = new Date();
  return `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')}`;
}

export function isSpotUsedToday(spotId: string, user: UserProfile): boolean {
  const todayPrefix = getTodayDateString();
  
  // Check in user verifications
  if (user.verifications) {
    const verifiedToday = user.verifications.some(
      (v) => v.spotId === spotId && (v.verifiedAt.startsWith(todayPrefix) || v.verifiedAt.includes(todayPrefix))
    );
    if (verifiedToday) return true;
  }

  // Check in user contributions
  return user.contributions.some(
    (c) => c.spotId === spotId && c.verificationType === 'qr' && c.date.startsWith(todayPrefix)
  );
}

export function validateRecyclingQR(
  qrString: string,
  spots: RecyclingSpot[] = RECYCLING_SPOTS,
  user?: UserProfile
): {
  valid: boolean;
  spot?: RecyclingSpot;
  error?: string;
  errorCode?: 'INVALID_FORMAT' | 'NOT_RECYCLING_TYPE' | 'NOT_FOUND' | 'INACTIVE' | 'DAILY_LIMIT_REACHED' | 'EXPIRED';
} {
  if (!qrString || typeof qrString !== 'string') {
    return {
      valid: false,
      error: 'QRコードの内容を読み取れませんでした。',
      errorCode: 'INVALID_FORMAT',
    };
  }

  const trimmed = qrString.trim();
  let spotId = '';

  // Try JSON parse
  if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
    try {
      const parsed: QRSpotPayload = JSON.parse(trimmed);
      if (parsed.type !== 'recycling_spot') {
        return {
          valid: false,
          error: 'このQRコードはSOCIAL QUESTのリサイクル認証用ではありません。',
          errorCode: 'NOT_RECYCLING_TYPE',
        };
      }
      if (!parsed.spotId) {
        return {
          valid: false,
          error: 'リサイクルスポットIDが含まれていません。',
          errorCode: 'INVALID_FORMAT',
        };
      }
      // Check timestamp if present (> 24 hours old dynamic QR safeguard)
      if (parsed.timestamp) {
        const now = Date.now();
        if (parsed.timestamp > now + 600000 || parsed.timestamp < now - 86400000) {
          return {
            valid: false,
            error: 'このQRコードは期限切れです。最新のコードをスキャンしてください。',
            errorCode: 'EXPIRED',
          };
        }
      }
      spotId = parsed.spotId;
    } catch {
      return {
        valid: false,
        error: 'このQRコードはSOCIAL QUESTで認証できません。',
        errorCode: 'INVALID_FORMAT',
      };
    }
  } else {
    // Plain spot ID or URL pattern
    if (trimmed.startsWith('RECYCLE-') || trimmed.startsWith('TEST-RECYCLE-')) {
      spotId = trimmed;
    } else if (trimmed.includes('spotId=')) {
      const match = trimmed.match(/spotId=([A-Za-z0-9_-]+)/);
      if (match && match[1]) {
        spotId = match[1];
      }
    } else {
      return {
        valid: false,
        error: 'このQRコードはSOCIAL QUESTで認証できません。',
        errorCode: 'NOT_RECYCLING_TYPE',
      };
    }
  }

  // Find registered spot
  const spot = spots.find((s) => s.id.toUpperCase() === spotId.toUpperCase());
  if (!spot) {
    return {
      valid: false,
      error: `登録されていないリサイクルスポットです。(ID: ${spotId})`,
      errorCode: 'NOT_FOUND',
    };
  }

  if (!spot.active) {
    return {
      valid: false,
      error: 'このリサイクルスポットは現在メンテナンス中・休止中です。',
      errorCode: 'INACTIVE',
    };
  }

  // Check daily limit if user profile provided
  if (user && isSpotUsedToday(spot.id, user)) {
    return {
      valid: false,
      spot,
      error: 'このリサイクルスポットでは本日の認証が完了しています。また明日ご利用ください。',
      errorCode: 'DAILY_LIMIT_REACHED',
    };
  }

  return {
    valid: true,
    spot,
  };
}

export function evaluateContributionType(contributions: Contribution[]): ContributionTypeResult {
  const counts = getCategoryCounts(contributions);
  const total = contributions.length || 1;

  const xpTotals: Record<CategoryType, number> = {
    environment: 0,
    support: 0,
    learning: 0,
  };

  contributions.forEach((c) => {
    if (xpTotals[c.category as CategoryType] !== undefined) {
      xpTotals[c.category as CategoryType] += c.xpEarned;
    }
  });

  const breakdowns: CategoryBreakdown[] = [
    { category: 'environment', count: counts.environment, xpTotal: xpTotals.environment, percentage: Math.round((counts.environment / total) * 100) },
    { category: 'support', count: counts.support, xpTotal: xpTotals.support, percentage: Math.round((counts.support / total) * 100) },
    { category: 'learning', count: counts.learning, xpTotal: xpTotals.learning, percentage: Math.round((counts.learning / total) * 100) },
  ];

  // Sort by count
  const sorted = [...breakdowns].sort((a, b) => b.count - a.count);
  const top = sorted[0];

  // If at least 2 categories have actions and top is <= 55%, treat as all-rounder
  const activeCategories = breakdowns.filter((b) => b.count > 0).length;

  if (activeCategories >= 2 && top.percentage <= 55) {
    return {
      id: 'allRounder',
      title: 'オールラウンダー',
      badge: '🌍',
      tagline: '環境・支援・学習啓発の3大領域をバランスよく実践する万能プレイヤー',
      color: '#10B981',
      bgClass: 'from-emerald-500 to-teal-600',
      breakdowns,
    };
  }

  if (top.category === 'environment') {
    return {
      id: 'ecologist',
      title: 'エコロジスト',
      badge: '🌱',
      tagline: 'リサイクルやエコ活動を通じて地球環境を優しく守る自然の守護者',
      color: '#10B981',
      bgClass: 'from-emerald-500 to-green-600',
      breakdowns,
    };
  }

  if (top.category === 'support') {
    return {
      id: 'supporter',
      title: 'サポーター',
      badge: '💫',
      tagline: '困っている人々や社会活動を支える温かな思いやりの持ち主',
      color: '#F59E0B',
      bgClass: 'from-amber-500 to-orange-600',
      breakdowns,
    };
  }

  return {
    id: 'socialLearner',
    title: 'ソーシャルラーナー',
    badge: '📚',
    tagline: '社会問題の知識を貪欲に吸収し、確かな見識で未来を拓く探求者',
    color: '#EC4899',
    bgClass: 'from-pink-500 to-rose-600',
    breakdowns,
  };
}

export function checkNewlyUnlockedItems(
  user: UserProfile,
  oldLevel: number,
  newLevel: number
): AvatarItem[] {
  const counts = getCategoryCounts(user.contributions);
  const unlockedItemIdsSet = new Set(user.unlockedItemIds);
  const newlyUnlocked: AvatarItem[] = [];

  AVATAR_ITEMS.forEach((item) => {
    if (unlockedItemIdsSet.has(item.id)) return;

    let canUnlock = false;

    // Check level condition
    const levelMatch = user.level >= item.requiredLevel;

    // Check category requirement if any
    let categoryMatch = true;
    if (item.requiredCategory && item.requiredCategoryCount) {
      categoryMatch = (counts[item.requiredCategory] || 0) >= item.requiredCategoryCount;
    }

    // Check achievement requirement if any
    let achievementMatch = true;
    if (item.requiredAchievementId) {
      const ach = user.achievements.find((a) => a.id === item.requiredAchievementId);
      achievementMatch = !!ach && ach.unlocked;
    }

    if (levelMatch && categoryMatch && achievementMatch) {
      canUnlock = true;
    }

    if (canUnlock) {
      newlyUnlocked.push(item);
    }
  });

  return newlyUnlocked;
}

export function evaluateAchievements(user: UserProfile): {
  updatedAchievements: UserProfile['achievements'];
  newlyCompleted: UserProfile['achievements'];
  bonusXp: number;
} {
  const counts = getCategoryCounts(user.contributions);
  const totalContributions = user.contributions.length;
  const verifiedRecycleCount = getVerifiedRecycleCount(user);
  const activeCategoriesCount = Object.values(counts).filter((c) => c > 0).length;

  let bonusXp = 0;
  const newlyCompleted: UserProfile['achievements'] = [];

  const updatedAchievements = user.achievements.map((ach) => {
    let currentCount = ach.currentCount;

    if (ach.id === 'ach_first_recycle' || ach.id === 'ach_recycler' || ach.id === 'ach_eco_master_qr' || ach.id === 'ach_green_hero') {
      currentCount = verifiedRecycleCount;
    } else if (ach.id === 'ach_recycle_beginner') {
      currentCount = counts.environment;
    } else if (ach.id === 'ach_community_power') {
      currentCount = totalContributions;
    } else if (ach.id === 'ach_warm_supporter') {
      currentCount = counts.support;
    } else if (ach.id === 'ach_knowledge_seeker') {
      currentCount = counts.learning;
    } else if (ach.id === 'ach_all_rounder') {
      currentCount = activeCategoriesCount;
    } else if (ach.id === 'ach_tree_grower') {
      currentCount = user.level;
    }

    const shouldUnlock = currentCount >= ach.targetCount;
    const wasUnlocked = ach.unlocked;

    if (shouldUnlock && !wasUnlocked) {
      bonusXp += ach.rewardXp;
      const updated = {
        ...ach,
        currentCount,
        unlocked: true,
        unlockedAt: new Date().toISOString().split('T')[0],
      };
      newlyCompleted.push(updated);
      return updated;
    }

    return {
      ...ach,
      currentCount,
    };
  });

  return {
    updatedAchievements,
    newlyCompleted,
    bonusXp,
  };
}

const STORAGE_KEY = 'socialquest_user_profile_v2';
const WORLD_STATS_KEY = 'socialquest_world_stats_v2';

export function loadUserProfile(): UserProfile {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Ensure all arrays and nested objects exist
      return {
        ...INITIAL_USER,
        ...parsed,
        avatar: { ...INITIAL_USER.avatar, ...(parsed.avatar || {}) },
        equippedItems: { ...INITIAL_USER.equippedItems, ...(parsed.equippedItems || {}) },
        unlockedItemIds: Array.from(new Set([...(parsed.unlockedItemIds || INITIAL_USER.unlockedItemIds)])),
        contributions: parsed.contributions || INITIAL_USER.contributions,
        missions: parsed.missions || INITIAL_USER.missions,
        achievements: parsed.achievements || INITIAL_USER.achievements,
        verifications: parsed.verifications || INITIAL_USER.verifications || [],
      };
    }
  } catch (e) {
    console.error('Error loading user profile from storage', e);
  }
  return INITIAL_USER;
}

export function saveUserProfile(user: UserProfile): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } catch (e) {
    console.error('Error saving user profile', e);
  }
}

export function loadWorldStats(): GlobalWorldStats {
  try {
    const saved = localStorage.getItem(WORLD_STATS_KEY);
    if (saved) {
      return { ...INITIAL_WORLD_STATS, ...JSON.parse(saved) };
    }
  } catch {
    // ignore
  }
  return INITIAL_WORLD_STATS;
}

export function saveWorldStats(stats: GlobalWorldStats): void {
  try {
    localStorage.setItem(WORLD_STATS_KEY, JSON.stringify(stats));
  } catch {
    // ignore
  }
}
