'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, SystemConfig, TypingResult, Wallet, WithdrawalRequest, Achievement, Mission, UserRole } from './types';
import { DEFAULT_SYSTEM_CONFIG } from './rewards';
import { DEVELOPMENT_MODE } from './anti-cheat';

const INITIAL_USER: User = {
  id: 'guest',
  name: 'Guest',
  email: '',
  avatar: '',
  role: 'user',
  isPremium: false,
  premiumExpiresAt: undefined,
  level: 1,
  xp: 0,
  coins: 0,
  streak: 0,
  lastActiveDate: new Date().toISOString(),
  referralCode: 'GUEST',
  totalTestsCompleted: 0,
  bestWpm: 0,
  avgWpm: 0,
  avgAccuracy: 0,
  country: 'Nepal',
  joinedAt: new Date().toISOString(),
  username: 'guest',
  membershipPlan: 'Free',
  walletBalance: 0,
  status: 'active',
  emailVerified: false,
  lastLogin: new Date().toISOString(),
};

const INITIAL_WALLET: Wallet = {
  userId: 'guest',
  coinsBalance: 0,
  nprBalance: 0,
  pendingWithdrawalNpr: 0,
  totalWithdrawnNpr: 0,
  totalEarnedCoins: 0,
};

const INITIAL_WITHDRAWALS: WithdrawalRequest[] = [];

const INITIAL_RESULTS: TypingResult[] = [];

const INITIAL_ACHIEVEMENTS: Achievement[] = [
  { id: 'ach-1', title: 'Speed Demon', description: 'Reach 100 WPM in any typing test', icon: 'Zap', rewardCoins: 100, rewardXp: 500, progress: 100, maxProgress: 100, unlocked: true },
  { id: 'ach-2', title: 'Accuracy Master', description: 'Complete 10 tests with 100% accuracy', icon: 'Target', rewardCoins: 150, rewardXp: 600, progress: 7, maxProgress: 10, unlocked: false },
  { id: 'ach-3', title: 'Nepali Ace', description: 'Complete 20 Nepali typing tests', icon: 'Globe', rewardCoins: 200, rewardXp: 800, progress: 14, maxProgress: 20, unlocked: false },
  { id: 'ach-4', title: 'Seven Day Streak', description: 'Maintain a 7-day typing streak', icon: 'Flame', rewardCoins: 250, rewardXp: 1000, progress: 7, maxProgress: 7, unlocked: true },
];

const INITIAL_MISSIONS: Mission[] = [
  { id: 'mis-1', title: 'Daily Warmup', description: 'Complete 3 typing tests today', rewardCoins: 30, rewardXp: 150, progress: 2, target: 3, completed: false, type: 'daily' },
  { id: 'mis-2', title: 'Precision Master', description: 'Achieve > 96% accuracy on a 60s test', rewardCoins: 50, rewardXp: 200, progress: 1, target: 1, completed: true, type: 'daily' },
  { id: 'mis-3', title: 'Code Warrior', description: 'Complete 5 programming code typing sessions', rewardCoins: 120, rewardXp: 400, progress: 3, target: 5, completed: false, type: 'weekly' },
];

interface AppContextType {
  currentUser: User;
  setCurrentUser: React.Dispatch<React.SetStateAction<User>>;
  registeredUsers: User[];
  setRegisteredUsers: React.Dispatch<React.SetStateAction<User[]>>;
  addRegisteredUser: (user: User) => void;
  switchRole: (role: UserRole) => void;
  currentTheme: string;
  changeTheme: (themeId: string) => void;
  systemConfig: SystemConfig;
  setSystemConfig: React.Dispatch<React.SetStateAction<SystemConfig>>;
  wallet: Wallet;
  setWallet: React.Dispatch<React.SetStateAction<Wallet>>;
  withdrawals: WithdrawalRequest[];
  submitWithdrawal: (method: 'esewa', accountDetails: string, amountNpr: number) => void;
  updateWithdrawalStatus: (id: string, status: 'approved' | 'rejected', adminNote?: string, transactionRef?: string) => void;
  typingResults: TypingResult[];
  addTypingResult: (result: TypingResult) => void;
  achievements: Achievement[];
  missions: Mission[];
  soundEnabled: boolean;
  setSoundEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  isDevMode: boolean;
  resetAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = 'karma_app_state_v2';

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User>(INITIAL_USER);
  const [currentTheme, setCurrentTheme] = useState<string>('neon-purple');
  const [systemConfig, setSystemConfig] = useState<SystemConfig>(DEFAULT_SYSTEM_CONFIG);
  const [wallet, setWallet] = useState<Wallet>(INITIAL_WALLET);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>(INITIAL_WITHDRAWALS);
  const [typingResults, setTypingResults] = useState<TypingResult[]>(INITIAL_RESULTS);
  const [registeredUsers, setRegisteredUsers] = useState<User[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>(INITIAL_ACHIEVEMENTS);
  const [missions, setMissions] = useState<Mission[]>(INITIAL_MISSIONS);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on client mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.currentUser) setCurrentUser(parsed.currentUser);
        if (parsed.currentTheme) setCurrentTheme(parsed.currentTheme);
        if (parsed.systemConfig) setSystemConfig({ ...parsed.systemConfig, coinsToNprRate: 100 });
        if (parsed.wallet) setWallet(parsed.wallet);
        if (parsed.withdrawals) setWithdrawals(parsed.withdrawals);
        if (parsed.typingResults) setTypingResults(parsed.typingResults);
        if (parsed.registeredUsers) setRegisteredUsers(parsed.registeredUsers);
        if (parsed.achievements) setAchievements(parsed.achievements);
        if (parsed.missions) setMissions(parsed.missions);
        if (parsed.soundEnabled !== undefined) setSoundEnabled(parsed.soundEnabled);
      }
    } catch (e) {
      console.error('Failed to load state from localStorage', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save to localStorage on state changes
  useEffect(() => {
    if (!isLoaded) return;
    try {
      const stateToSave = {
        currentUser,
        currentTheme,
        systemConfig,
        wallet,
        withdrawals,
        typingResults,
        registeredUsers,
        achievements,
        missions,
        soundEnabled,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (e) {
      console.error('Failed to save state to localStorage', e);
    }
  }, [currentUser, currentTheme, systemConfig, wallet, withdrawals, typingResults, registeredUsers, achievements, missions, soundEnabled, isLoaded]);

  const switchRole = (role: UserRole) => {
    setCurrentUser((prev) => ({
      ...prev,
      role,
      isPremium: role === 'premium_user' || role === 'admin',
    }));
  };

  const changeTheme = (themeId: string) => {
    setCurrentTheme(themeId);
  };

  const addRegisteredUser = (user: User) => {
    setRegisteredUsers((prev) => {
      if (prev.some((existing) => existing.email === user.email)) {
        return prev;
      }
      return [...prev, user];
    });
  };

  const addTypingResult = (result: TypingResult) => {
    setTypingResults((prev) => [result, ...prev]);

    // Recalculate dynamic user metrics
    setCurrentUser((prev) => {
      const totalTests = prev.totalTestsCompleted + 1;
      const bestWpm = Math.max(prev.bestWpm, result.wpm);
      const avgWpm = Math.round(((prev.avgWpm * prev.totalTestsCompleted + result.wpm) / totalTests) * 10) / 10;
      const avgAccuracy = Math.round(((prev.avgAccuracy * prev.totalTestsCompleted + result.accuracy) / totalTests) * 10) / 10;
      const coins = prev.coins + result.coinsEarned;
      const xp = prev.xp + result.xpEarned;
      const level = Math.floor(xp / 300) + 1;

      return {
        ...prev,
        bestWpm,
        avgWpm,
        avgAccuracy,
        totalTestsCompleted: totalTests,
        coins,
        xp,
        level,
        lastActiveDate: new Date().toISOString(),
      };
    });

    if (result.coinsEarned > 0) {
      setWallet((prev) => {
        const newCoins = prev.coinsBalance + result.coinsEarned;
        const newNpr = Math.round((newCoins / systemConfig.coinsToNprRate) * 100) / 100;
        return {
          ...prev,
          coinsBalance: newCoins,
          nprBalance: newNpr,
          totalEarnedCoins: prev.totalEarnedCoins + result.coinsEarned,
        };
      });
    }
  };

  const submitWithdrawal = (method: 'esewa', accountDetails: string, amountNpr: number) => {
    const coinsNeeded = Math.round(amountNpr * systemConfig.coinsToNprRate);
    if (!DEVELOPMENT_MODE && wallet.coinsBalance < coinsNeeded) {
      throw new Error(`Insufficient Karma Coins. You need ${coinsNeeded} coins for Rs. ${amountNpr}.`);
    }

    const newRequest: WithdrawalRequest = {
      id: `trx-${Date.now().toString().slice(-5)}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      method,
      accountDetails,
      amountNpr,
      coinsDeducted: coinsNeeded,
      status: DEVELOPMENT_MODE ? 'approved' : 'pending',
      adminNote: DEVELOPMENT_MODE ? 'Auto-approved in Development Mode' : undefined,
      transactionRef: DEVELOPMENT_MODE ? `DEV-AUTO-${Date.now().toString().slice(-4)}` : undefined,
      createdAt: new Date().toISOString(),
      processedAt: DEVELOPMENT_MODE ? new Date().toISOString() : undefined,
    };

    fetch('/api/wallet/withdraw', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: currentUser.id,
        userName: currentUser.name,
        userEmail: currentUser.email,
        method,
        accountDetails,
        amountNpr,
        coinsDeducted: coinsNeeded,
      }),
    }).catch((err) => console.error('Failed to sync payout request to backend', err));

    setWithdrawals((prev) => [newRequest, ...prev]);
    setWallet((prev) => {
      const remainingCoins = Math.max(0, prev.coinsBalance - coinsNeeded);
      const remainingNpr = Math.round((remainingCoins / systemConfig.coinsToNprRate) * 100) / 100;
      return {
        ...prev,
        coinsBalance: remainingCoins,
        nprBalance: remainingNpr,
        pendingWithdrawalNpr: DEVELOPMENT_MODE ? prev.pendingWithdrawalNpr : prev.pendingWithdrawalNpr + amountNpr,
        totalWithdrawnNpr: DEVELOPMENT_MODE ? prev.totalWithdrawnNpr + amountNpr : prev.totalWithdrawnNpr,
      };
    });
    setCurrentUser((prev) => ({ ...prev, coins: Math.max(0, prev.coins - coinsNeeded) }));
  };

  const updateWithdrawalStatus = (id: string, status: 'approved' | 'rejected', adminNote?: string, transactionRef?: string) => {
    fetch('/api/admin/payouts', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status, adminNote, transactionRef }),
    }).catch((err) => console.error('Failed to sync payout approval state', err));

    setWithdrawals((prev) =>
      prev.map((req) => {
        if (req.id === id) {
          return {
            ...req,
            status,
            adminNote,
            transactionRef,
            processedAt: new Date().toISOString(),
          };
        }
        return req;
      })
    );

    const targetReq = withdrawals.find((r) => r.id === id);
    if (targetReq && targetReq.status === 'pending') {
      if (status === 'approved') {
        setWallet((prev) => ({
          ...prev,
          pendingWithdrawalNpr: Math.max(0, prev.pendingWithdrawalNpr - targetReq.amountNpr),
          totalWithdrawnNpr: prev.totalWithdrawnNpr + targetReq.amountNpr,
        }));
      } else if (status === 'rejected') {
        setWallet((prev) => {
          const refundedCoins = prev.coinsBalance + targetReq.coinsDeducted;
          const refundedNpr = Math.round((refundedCoins / systemConfig.coinsToNprRate) * 100) / 100;
          return {
            ...prev,
            coinsBalance: refundedCoins,
            nprBalance: refundedNpr,
            pendingWithdrawalNpr: Math.max(0, prev.pendingWithdrawalNpr - targetReq.amountNpr),
          };
        });
        setCurrentUser((prev) => ({ ...prev, coins: prev.coins + targetReq.coinsDeducted }));
      }
    }
  };

  const resetAllData = () => {
    setCurrentUser(INITIAL_USER);
    setWallet(INITIAL_WALLET);
    setWithdrawals(INITIAL_WITHDRAWALS);
    setTypingResults(INITIAL_RESULTS);
    setRegisteredUsers([]);
    setSystemConfig(DEFAULT_SYSTEM_CONFIG);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        registeredUsers,
        setRegisteredUsers,
        addRegisteredUser,
        switchRole,
        currentTheme,
        changeTheme,
        systemConfig,
        setSystemConfig,
        wallet,
        setWallet,
        withdrawals,
        submitWithdrawal,
        updateWithdrawalStatus,
        typingResults,
        addTypingResult,
        achievements,
        missions,
        soundEnabled,
        setSoundEnabled,
        isDevMode: DEVELOPMENT_MODE,
        resetAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppStore() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppStore must be used within an AppProvider');
  }
  return context;
}
