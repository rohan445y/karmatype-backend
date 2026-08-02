import { SystemConfig } from './types';
import { DEVELOPMENT_MODE } from './anti-cheat';

export const DEFAULT_SYSTEM_CONFIG: SystemConfig = {
  coinsPerWpm: 0.02,
  coinsPerAccuracyPercent: 0.01,
  dailyCoinLimitFree: 50,
  dailyCoinLimitPremium: 200,
  maxWithdrawalFreeNpr: 20,
  maxWithdrawalPremiumNpr: 100,
  coinsToNprRate: 100, // 100 coins = 1 NPR (1000 coins = 10 NPR)
  referralBonusCoins: 50,
  dailyStreakBonusCoins: 2,
  antiCheatSensitivity: 'medium',
  maintenanceMode: false,
  announcementBanner: '🔥 Welcome to Karma Type! Improve your WPM and convert Karma Coins to eSewa cash.',
  adsEnabled: true,
};

export function calculateRewardCoins(
  wpm: number,
  accuracy: number,
  streak: number,
  config: SystemConfig = DEFAULT_SYSTEM_CONFIG
): { coins: number; xp: number; bonusBreakdown: { wpmCoins: number; accuracyCoins: number; streakBonus: number } } {
  // Improved payout reward calculation
  const wpmCoins = Math.floor(wpm * 0.15); // 60 WPM = ~9 coins, 100 WPM = ~15 coins

  let accuracyCoins = 0;
  if (accuracy >= 98) {
    accuracyCoins = 5;
  } else if (accuracy >= 95) {
    accuracyCoins = 3;
  } else if (accuracy >= 90) {
    accuracyCoins = 2;
  } else if (accuracy >= 80) {
    accuracyCoins = 1;
  }

  const streakBonus = Math.min(streak, 3); // Up to 3 bonus coins for streaks
  const totalCoins = Math.max(2, wpmCoins + accuracyCoins + streakBonus);
  const xp = Math.floor(wpm * (accuracy / 100)) + 15;

  return {
    coins: totalCoins,
    xp,
    bonusBreakdown: {
      wpmCoins,
      accuracyCoins,
      streakBonus
    }
  };
}

export function coinsToNpr(coins: number, config: SystemConfig = DEFAULT_SYSTEM_CONFIG): number {
  return Math.round((coins / config.coinsToNprRate) * 100) / 100;
}

export function nprToCoins(npr: number, config: SystemConfig = DEFAULT_SYSTEM_CONFIG): number {
  return Math.round(npr * config.coinsToNprRate);
}
