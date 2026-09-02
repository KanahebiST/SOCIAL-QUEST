export type CategoryType = 'environment' | 'support' | 'community' | 'volunteer' | 'learning';

export type ContributionTypeId = 
  | 'ecologist'       // 環境系多め
  | 'supporter'       // 支援系多め
  | 'communityMaker'  // 地域系多め
  | 'volunteerHero'   // ボランティア多め
  | 'socialLearner'   // 学習・啓発多め
  | 'allRounder';     // バランス型

export interface CategoryInfo {
  id: CategoryType;
  name: string;
  icon: string;
  color: string;
  bgLight: string;
  borderColor: string;
  description: string;
  rpgAreaName?: string;
}

export interface ActivityTemplate {
  id: string;
  category: CategoryType;
  title: string;
  icon: string;
  baseXp: number;
  unit: string;
  defaultAmount: number;
  maxDailyAmount: number;
  description: string;
  reason: string;
  sdgsNumber?: number;
}

export type VerificationType = 'manual' | 'qr';

export interface Contribution {
  id: string;
  category: CategoryType;
  activityId: string;
  activityTitle: string;
  icon: string;
  amount: number;
  unit: string;
  xpEarned: number;
  date: string; // ISO date string or YYYY-MM-DD
  memo?: string;
  verificationType: VerificationType;
  spotId?: string;
  spotName?: string;
  verifiedAt?: string;
}

export interface RecyclingSpot {
  id: string;
  name: string;
  description: string;
  location: string;
  rewardXP: number;
  active: boolean;
  dailyLimit: number;
  icon?: string;
  category?: CategoryType;
  acceptedItems?: string[];
  lastUsedDate?: string;
}

export interface Verification {
  id: string;
  userId: string;
  spotId: string;
  spotName?: string;
  verifiedAt: string;
  rewardXP: number;
}

export interface QRSpotPayload {
  type: 'recycling_spot';
  spotId: string;
  timestamp?: number;
  nonce?: string;
}

// 5-Tier RPG Item Rarities
export type ItemRarity = 'common' | 'rare' | 'epic' | 'legendary' | 'world';

export type AvatarCategory = 
  | 'skin' 
  | 'hair' 
  | 'clothes' 
  | 'hat'
  | 'accessory' 
  | 'back'
  | 'pet' 
  | 'effect' 
  | 'special' // alias for effect compatibility
  | 'background'
  | 'weapon'
  | 'tool'
  | 'title'
  | 'aura';

export interface AvatarItem {
  id: string;
  name: string;
  category: AvatarCategory;
  description: string;
  icon: string;
  svgType: string;
  rarity: ItemRarity;
  requiredLevel: number;
  requiredCategory?: CategoryType;
  requiredCategoryCount?: number;
  requiredCategoryXp?: number;
  requiredVerifiedRecycleCount?: number;
  requiredAchievementId?: string;
  colorOptions?: string[];
  asset?: string;
  pixelArtKey?: string;
  flavorText?: string;
}

// Alias for RPGItem
export type RPGItem = AvatarItem;

export interface AvatarConfig {
  skinColor: string;
  hairStyle: string;
  hairColor: string;
  clothes: string;
  hat?: string;
  accessory: string;
  back?: string;
  special: string; // Effect
  pet: string;
  background: string;
  weapon?: string;
  tool?: string;
}

export interface Mission {
  id: string;
  type: 'daily' | 'weekly';
  title: string;
  description: string;
  category?: CategoryType;
  targetCount: number;
  currentCount: number;
  rewardXp: number;
  rewardItemId?: string;
  rewardPoints?: number;
  completed: boolean;
  claimed: boolean;
  expiresAt: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category?: CategoryType;
  targetCount: number;
  currentCount: number;
  unlocked: boolean;
  unlockedAt?: string;
  rewardXp: number;
  rewardTitle?: string;
  rewardItemId?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  title: string;
  level: number;
  xp: number;
  streakDays: number;
  lastActiveDate: string;
  avatar: AvatarConfig;
  unlockedItemIds: string[];
  equippedItems: AvatarConfig;
  contributions: Contribution[];
  missions: Mission[];
  achievements: Achievement[];
  verifications?: Verification[];
}

export interface WorldArea {
  id: string;
  name: string;
  nameEn: string;
  category: CategoryType;
  icon: string;
  level: number;
  progress: number;
  maxProgress: number;
  description: string;
  growthStage: string;
  unlockedPerks: string[];
  bgGradient: string;
  pixelTheme: string;
}

export interface GlobalWorldStats {
  totalContributions: number;
  worldTreeLevel: number;
  currentLevelTarget: number;
  previousLevelTarget: number;
  activeExplorers: number;
  co2SavedKg: number;
  donationsTotalYen: number;
  volunteerHours: number;
  areas?: Record<string, WorldArea>;
}
