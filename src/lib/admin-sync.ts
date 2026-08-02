import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import path from 'path';
import type { User, WithdrawalRequest } from './types';

const STORE_FILE = path.join(process.cwd(), 'data', 'admin-sync.json');

export interface AdminUserRecord extends User {
  username: string;
  membershipPlan: 'Free' | 'Premium';
  walletBalance: number;
  status: 'active' | 'suspended' | 'banned';
  emailVerified: boolean;
  lastLogin: string;
  password?: string;
}

export interface AdminPayoutRecord extends WithdrawalRequest {
  requestId: string;
  screenshotUrl?: string;
  coinsUsed: number;
  paymentMethod: 'esewa';
  transactionId?: string;
}

export interface AdminNotification {
  id: string;
  type: 'user' | 'payout' | 'premium' | 'referral' | 'login' | 'payment';
  message: string;
  timestamp: string;
  read: boolean;
}

export interface ActivityLog {
  id: string;
  action: string;
  userId?: string;
  adminId?: string;
  timestamp: string;
  ipAddress?: string;
  device?: string;
  browser?: string;
}

interface AdminSyncStore {
  users: AdminUserRecord[];
  payouts: AdminPayoutRecord[];
  notifications: AdminNotification[];
  logs: ActivityLog[];
}

const createDefaultStore = (): AdminSyncStore => ({
  users: [],
  payouts: [],
  notifications: [],
  logs: [],
});

const ensureStorePath = () => {
  mkdirSync(path.dirname(STORE_FILE), { recursive: true });
};

const readStore = (): AdminSyncStore => {
  ensureStorePath();

  if (!existsSync(STORE_FILE)) {
    const defaults = createDefaultStore();
    writeFileSync(STORE_FILE, JSON.stringify(defaults, null, 2), 'utf8');
    return defaults;
  }

  try {
    const raw = readFileSync(STORE_FILE, 'utf8');
    const parsed = JSON.parse(raw) as Partial<AdminSyncStore>;
    return {
      users: Array.isArray(parsed.users) ? parsed.users : [],
      payouts: Array.isArray(parsed.payouts) ? parsed.payouts : [],
      notifications: Array.isArray(parsed.notifications) ? parsed.notifications : [],
      logs: Array.isArray(parsed.logs) ? parsed.logs : [],
    };
  } catch {
    const defaults = createDefaultStore();
    writeFileSync(STORE_FILE, JSON.stringify(defaults, null, 2), 'utf8');
    return defaults;
  }
};

const writeStore = (next: AdminSyncStore) => {
  ensureStorePath();
  writeFileSync(STORE_FILE, JSON.stringify(next, null, 2), 'utf8');
};

const listeners = new Set<() => void>();

const nowIso = () => new Date().toISOString();

const generateId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

const sortUsersDesc = (items: AdminUserRecord[]) =>
  [...items].sort((a, b) => new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime());

const sortPayoutsDesc = (items: AdminPayoutRecord[]) =>
  [...items].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

const normalizeUser = (payload: Partial<AdminUserRecord> & Partial<User>): AdminUserRecord => {
  const safeName = payload.name?.trim() || 'Unnamed User';
  const safeEmail = payload.email?.trim().toLowerCase() || 'unknown@karmatype.com';
  const createdAt = payload.joinedAt || nowIso();
  const userId = payload.id || generateId('user');

  return {
    id: userId,
    name: safeName,
    email: safeEmail,
    avatar: payload.avatar || '',
    role: payload.role || 'user',
    isPremium: Boolean(payload.isPremium),
    premiumExpiresAt: payload.premiumExpiresAt,
    level: payload.level ?? 1,
    xp: payload.xp ?? 0,
    coins: payload.coins ?? 0,
    streak: payload.streak ?? 0,
    lastActiveDate: payload.lastActiveDate || createdAt,
    referralCode: payload.referralCode || safeEmail.split('@')[0].toUpperCase(),
    referredBy: payload.referredBy,
    totalTestsCompleted: payload.totalTestsCompleted ?? 0,
    bestWpm: payload.bestWpm ?? 0,
    avgWpm: payload.avgWpm ?? 0,
    avgAccuracy: payload.avgAccuracy ?? 0,
    country: payload.country || 'Nepal',
    joinedAt: createdAt,
    username: payload.username || safeEmail.split('@')[0],
    membershipPlan: payload.membershipPlan || (payload.isPremium ? 'Premium' : 'Free'),
    walletBalance: payload.walletBalance ?? 0,
    status: payload.status || 'active',
    emailVerified: payload.emailVerified ?? true,
    lastLogin: payload.lastLogin || createdAt,
    password: payload.password,
  };
};

const normalizePayout = (payload: Partial<AdminPayoutRecord> & Partial<WithdrawalRequest>): AdminPayoutRecord => {
  const now = nowIso();
  return {
    id: payload.id || generateId('trx'),
    requestId: payload.requestId || payload.id || generateId('req'),
    userId: payload.userId || 'guest',
    userName: payload.userName || 'Unknown User',
    userEmail: payload.userEmail || 'unknown@karmatype.com',
    method: payload.method || 'esewa',
    paymentMethod: payload.paymentMethod || payload.method || 'esewa',
    accountDetails: payload.accountDetails || '',
    amountNpr: payload.amountNpr ?? 0,
    coinsDeducted: payload.coinsDeducted ?? payload.coinsUsed ?? 0,
    coinsUsed: payload.coinsUsed ?? payload.coinsDeducted ?? 0,
    status: payload.status || 'pending',
    adminNote: payload.adminNote,
    transactionRef: payload.transactionRef,
    transactionId: payload.transactionId || payload.transactionRef,
    createdAt: payload.createdAt || now,
    processedAt: payload.processedAt,
    screenshotUrl: payload.screenshotUrl,
  };
};

export const subscribeAdminSync = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const notifyListeners = () => {
  listeners.forEach((listener) => listener());
};

export const getAdminUsers = () => {
  const current = readStore();
  return sortUsersDesc(current.users);
};

export const getAdminPayouts = () => {
  const current = readStore();
  return sortPayoutsDesc(current.payouts);
};

export const getAdminNotifications = () => {
  const current = readStore();
  return [...current.notifications].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

export const getAdminLogs = () => {
  const current = readStore();
  return [...current.logs].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

export const addAdminUser = (payload: Partial<AdminUserRecord> & Partial<User>) => {
  const current = readStore();
  const normalized = normalizeUser(payload);
  const existingIndex = current.users.findIndex((user) => user.email.toLowerCase() === normalized.email.toLowerCase() || user.id === normalized.id);

  if (existingIndex >= 0) {
    current.users[existingIndex] = normalized;
  } else {
    current.users.unshift(normalized);
  }

  current.notifications.unshift({
    id: generateId('notice'),
    type: 'user',
    message: `New registration logged for ${normalized.name} (${normalized.email})`,
    timestamp: nowIso(),
    read: false,
  });

  current.logs.unshift({
    id: generateId('log'),
    action: 'Registration',
    userId: normalized.id,
    timestamp: nowIso(),
    browser: 'unknown',
    device: 'desktop',
  });

  writeStore(current);
  notifyListeners();
  return normalized;
};

export const addAdminPayout = (payload: Partial<AdminPayoutRecord> & Partial<WithdrawalRequest>) => {
  const current = readStore();
  const normalized = normalizePayout(payload);
  const existingIndex = current.payouts.findIndex((item) => item.requestId === normalized.requestId || item.id === normalized.id);

  if (existingIndex >= 0) {
    current.payouts[existingIndex] = normalized;
  } else {
    current.payouts.unshift(normalized);
  }

  current.notifications.unshift({
    id: generateId('notice'),
    type: 'payout',
    message: `New payout request submitted by ${normalized.userName} for Rs. ${normalized.amountNpr}`,
    timestamp: nowIso(),
    read: false,
  });

  current.logs.unshift({
    id: generateId('log'),
    action: 'Payout Request',
    userId: normalized.userId,
    timestamp: nowIso(),
    browser: 'unknown',
    device: 'desktop',
  });

  writeStore(current);
  notifyListeners();
  return normalized;
};

export const updateAdminPayout = (id: string, status: 'approved' | 'rejected', adminNote?: string, transactionRef?: string) => {
  const current = readStore();
  const payoutIndex = current.payouts.findIndex((item) => item.id === id || item.requestId === id);
  if (payoutIndex < 0) return undefined;

  const payout = current.payouts[payoutIndex];
  const updated = {
    ...payout,
    status,
    adminNote,
    transactionRef,
    transactionId: transactionRef || payout.transactionId,
    processedAt: nowIso(),
  };

  current.payouts[payoutIndex] = updated;
  current.logs.unshift({
    id: generateId('log'),
    action: status === 'approved' ? 'Admin Approval' : 'Admin Rejection',
    userId: updated.userId,
    adminId: 'admin-001',
    timestamp: nowIso(),
    browser: 'unknown',
    device: 'desktop',
  });

  current.notifications.unshift({
    id: generateId('notice'),
    type: 'payout',
    message: `Payout ${status} for ${updated.userName} (${updated.amountNpr} NPR)`,
    timestamp: nowIso(),
    read: false,
  });

  writeStore(current);
  notifyListeners();
  return updated;
};

export const seedDemoData = () => {
  const current = readStore();
  if (current.users.some((user) => user.email.toLowerCase() === 'admin@karmatype.com')) {
    return;
  }

  const adminUser = normalizeUser({
    id: 'admin-001',
    name: 'Administrator',
    email: 'admin@karmatype.com',
    role: 'admin',
    isPremium: true,
    avatar: '',
    coins: 0,
    xp: 0,
    streak: 0,
    level: 1,
    totalTestsCompleted: 0,
    bestWpm: 0,
    avgWpm: 0,
    avgAccuracy: 0,
    premiumExpiresAt: undefined,
    lastActiveDate: nowIso(),
    referralCode: 'ADMIN',
    country: 'Nepal',
    joinedAt: nowIso(),
    username: 'admin',
    membershipPlan: 'Premium',
    walletBalance: 0,
    status: 'active',
    emailVerified: true,
    lastLogin: nowIso(),
    password: 'admin123',
  });

  current.users.unshift(adminUser);
  current.logs.unshift({
    id: generateId('log'),
    action: 'Admin Seed',
    userId: adminUser.id,
    timestamp: nowIso(),
    browser: 'unknown',
    device: 'desktop',
  });
  current.notifications.unshift({
    id: generateId('notice'),
    type: 'user',
    message: 'Seed admin account loaded.',
    timestamp: nowIso(),
    read: false,
  });

  writeStore(current);
  notifyListeners();
};

export const resetAdminStore = () => {
  const fresh = createDefaultStore();
  writeStore(fresh);
  notifyListeners();
};
