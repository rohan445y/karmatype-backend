export type UserRole = 'user' | 'premium_user' | 'moderator' | 'admin';

export type TypingModeType = 'time' | 'words' | 'quote' | 'code' | 'nepali';
export type DifficultyType = 'easy' | 'medium' | 'hard' | 'expert';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  isPremium: boolean;
  premiumExpiresAt?: string;
  level: number;
  xp: number;
  coins: number;
  streak: number;
  lastActiveDate: string;
  referralCode: string;
  referredBy?: string;
  totalTestsCompleted: number;
  bestWpm: number;
  avgWpm: number;
  avgAccuracy: number;
  country: string;
  joinedAt: string;
  username?: string;
  membershipPlan?: 'Free' | 'Premium';
  walletBalance?: number;
  status?: 'active' | 'suspended' | 'banned';
  emailVerified?: boolean;
  lastLogin?: string;
  password?: string;
}

export interface SystemConfig {
  coinsPerWpm: number; // e.g. 0.2 coins per WPM
  coinsPerAccuracyPercent: number; // e.g. 0.1 coins per accuracy % over 90%
  dailyCoinLimitFree: number; // max coins earnable per day for free users
  dailyCoinLimitPremium: number; // max coins earnable per day for premium users
  maxWithdrawalFreeNpr: number; // Rs. 20
  maxWithdrawalPremiumNpr: number; // Rs. 100
  coinsToNprRate: number; // 100 coins = 1 NPR (1000 coins = 10 NPR)
  referralBonusCoins: number; // 500 coins
  dailyStreakBonusCoins: number; // 15 coins
  antiCheatSensitivity: 'low' | 'medium' | 'high';
  maintenanceMode: boolean;
  announcementBanner: string;
  adsEnabled: boolean;
}

export interface TypingResult {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  wpm: number;
  rawWpm: number;
  cpm: number;
  accuracy: number;
  errors: number;
  mode: TypingModeType;
  duration: number; // in seconds
  language: 'english' | 'nepali';
  difficulty: DifficultyType;
  coinsEarned: number;
  xpEarned: number;
  isRewardEligible: boolean;
  createdAt: string;
  keystrokeTimings?: number[];
  flaggedForCheat?: boolean;
}

export interface Wallet {
  userId: string;
  coinsBalance: number;
  nprBalance: number;
  pendingWithdrawalNpr: number;
  totalWithdrawnNpr: number;
  totalEarnedCoins: number;
}

export type WithdrawalMethod = 'esewa';
export type WithdrawalStatus = 'pending' | 'approved' | 'rejected';

export interface WithdrawalRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  method: WithdrawalMethod;
  accountDetails: string; // e.g., eSewa ID / Khalti number / Bank Account info
  amountNpr: number;
  coinsDeducted: number;
  status: WithdrawalStatus;
  adminNote?: string;
  transactionRef?: string;
  createdAt: string;
  processedAt?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  rewardCoins: number;
  rewardXp: number;
  progress: number;
  maxProgress: number;
  unlocked: boolean;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  rewardCoins: number;
  rewardXp: number;
  progress: number;
  target: number;
  completed: boolean;
  type: 'daily' | 'weekly';
}
