'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { 
  ShieldAlert, 
  Settings, 
  Users, 
  Wallet, 
  TrendingUp, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Coins, 
  Bell, 
  Sliders, 
  Lock,
  Save,
  Clock,
  RotateCcw,
  Zap,
  Check
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { SystemConfig, UserRole } from '@/lib/types';

export default function AdminPage() {
  const { 
    currentUser, 
    setCurrentUser,
    systemConfig, 
    setSystemConfig, 
    updateWithdrawalStatus,
    typingResults,
    wallet,
    isDevMode,
    resetAllData
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<'analytics' | 'config' | 'withdrawals' | 'users'>('analytics');
  const [editableConfig, setEditableConfig] = useState<SystemConfig>(systemConfig);
  const [configSaveSuccess, setConfigSaveSuccess] = useState(false);
  const [trxRef, setTrxRef] = useState<Record<string, string>>({});
  const [resetSuccess, setResetSuccess] = useState(false);
  const [adminUsers, setAdminUsers] = useState<any[]>([]);
  const [adminPayouts, setAdminPayouts] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    const loadAdminState = async () => {
      try {
        const [usersRes, payoutsRes] = await Promise.all([
          fetch('/api/admin/users', { cache: 'no-store' }),
          fetch('/api/admin/payouts', { cache: 'no-store' }),
        ]);

        const usersPayload = await usersRes.json();
        const payoutsPayload = await payoutsRes.json();
        setAdminUsers(usersPayload.users || []);
        setAdminPayouts(payoutsPayload.payouts || []);
      } catch (error) {
        console.error('Failed to fetch admin dashboard state', error);
      }
    };

    loadAdminState();

    const eventSource = new EventSource('/api/admin/events');
    eventSource.onmessage = (event) => {
      const payload = JSON.parse(event.data);
      setAdminUsers(payload.users || []);
      setAdminPayouts(payload.payouts || []);
      setNotifications(payload.notifications || []);
      setLogs(payload.logs || []);
    };
    eventSource.onerror = () => {
      eventSource.close();
    };

    return () => eventSource.close();
  }, []);

  // Restrict view if user is not admin
  if (currentUser.role !== 'admin') {
    return (
      <div className="glass-panel p-10 rounded-3xl text-center space-y-6 max-w-md mx-auto my-12 border border-purple-500/40 shadow-2xl relative overflow-hidden">
        <div className="w-16 h-16 rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center mx-auto text-purple-400">
          <ShieldAlert className="w-8 h-8" />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-white">Admin Command Center</h2>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Admin access is required to view this page. Please sign in with an administrator account to continue.
          </p>
        </div>
      </div>
    );
  }

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    setSystemConfig(editableConfig);
    setConfigSaveSuccess(true);
    setTimeout(() => setConfigSaveSuccess(false), 3000);
  };

  const handleResetData = () => {
    if (confirm('Reset all app data back to clean default state?')) {
      resetAllData();
      setResetSuccess(true);
      setTimeout(() => setResetSuccess(false), 3000);
    }
  };

  // Live real data metrics calculations
  const totalSessions = typingResults.length;
  const avgWpm = totalSessions > 0 ? Math.round(typingResults.reduce((acc, r) => acc + r.wpm, 0) / totalSessions) : 0;
  const avgAccuracy = totalSessions > 0 ? (typingResults.reduce((acc, r) => acc + r.accuracy, 0) / totalSessions).toFixed(1) : '100';
  const totalCoinsDistributed = typingResults.reduce((acc, r) => acc + (r.coinsEarned || 0), 0) + wallet.totalEarnedCoins;
  const pendingWithdrawals = adminPayouts.filter((w) => w.status === 'pending');
  const pendingCount = pendingWithdrawals.length;
  const pendingNprSum = pendingWithdrawals.reduce((acc, w) => acc + (w.amountNpr || 0), 0);
  const totalWithdrawnNpr = adminPayouts.filter((w) => w.status === 'approved').reduce((acc, w) => acc + (w.amountNpr || 0), 0);
  const flaggedSessionsCount = typingResults.filter((r) => r.flaggedForCheat).length;

  const knownUsersList = useMemo(() => {
    const map = new Map<string, any>();

    adminUsers.forEach((user) => {
      map.set(user.id, {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
        role: user.role,
        coins: user.coins,
        bestWpm: user.bestWpm,
        joinedAt: user.joinedAt,
        referralCode: user.referralCode,
        membershipPlan: user.membershipPlan || 'Free',
        walletBalance: user.walletBalance ?? 0,
        status: user.status || 'active',
        emailVerified: user.emailVerified ?? true,
        lastLogin: user.lastLogin,
      });
    });

    if (!map.has(currentUser.id)) {
      map.set(currentUser.id, {
        id: currentUser.id,
        name: currentUser.name,
        email: currentUser.email,
        avatar: currentUser.avatar,
        role: currentUser.role,
        coins: currentUser.coins,
        bestWpm: currentUser.bestWpm,
        joinedAt: currentUser.joinedAt,
        referralCode: currentUser.referralCode,
        membershipPlan: currentUser.membershipPlan || 'Free',
        walletBalance: currentUser.walletBalance ?? 0,
        status: currentUser.status || 'active',
        emailVerified: currentUser.emailVerified ?? false,
        lastLogin: currentUser.lastLogin || currentUser.lastActiveDate,
      });
    }

    adminPayouts.forEach((w) => {
      if (!map.has(w.userId)) {
        map.set(w.userId, {
          id: w.userId,
          name: w.userName,
          email: w.userEmail,
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
          role: 'user',
          coins: 0,
          bestWpm: 0,
          joinedAt: w.createdAt,
          referralCode: 'UNKNOWN',
          membershipPlan: 'Free',
          walletBalance: 0,
          status: 'active',
          emailVerified: false,
          lastLogin: w.createdAt,
        });
      }
    });

    typingResults.forEach((r) => {
      if (!map.has(r.userId)) {
        map.set(r.userId, {
          id: r.userId,
          name: r.userName,
          email: `${r.userName.toLowerCase().replace(/\s+/g, '.')}@karmatype.com`,
          avatar: r.userAvatar,
          role: 'user',
          coins: 0,
          bestWpm: r.wpm,
          joinedAt: r.createdAt,
          referralCode: 'UNKNOWN',
          membershipPlan: 'Free',
          walletBalance: 0,
          status: 'active',
          emailVerified: false,
          lastLogin: r.createdAt,
        });
      }
    });

    return Array.from(map.values()).sort((a, b) => new Date(b.joinedAt || 0).getTime() - new Date(a.joinedAt || 0).getTime());
  }, [adminUsers, adminPayouts, currentUser, typingResults]);

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-400">
              <ShieldAlert className="w-5 h-5" />
            </span>
            <h1 className="text-3xl font-extrabold text-white">Admin Command Center</h1>
            {isDevMode && (
              <span className="px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-bold uppercase tracking-wider">
                DEV MODE ACTIVE
              </span>
            )}
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Real-time configuration, financial payout management, security guard & user analytics.
          </p>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="flex items-center gap-1 bg-zinc-900/90 p-1.5 rounded-2xl border border-zinc-800">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'analytics' ? 'bg-purple-600 text-white shadow-md' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" /> Overview
          </button>
          <button
            onClick={() => setActiveTab('withdrawals')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 relative ${
              activeTab === 'withdrawals' ? 'bg-purple-600 text-white shadow-md' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Wallet className="w-3.5 h-3.5" /> Payouts
            {pendingCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-amber-500 text-black text-[10px] font-bold flex items-center justify-center">
                {pendingCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('config')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'config' ? 'bg-purple-600 text-white shadow-md' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" /> Rewards & Limits
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'users' ? 'bg-purple-600 text-white shadow-md' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" /> Users
          </button>
        </div>
      </div>

      {resetSuccess && (
        <div className="bg-emerald-950/60 border border-emerald-500/40 p-4 rounded-xl text-emerald-300 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>All store data has been reset to default state!</span>
        </div>
      )}

      {/* TAB 1: REAL ANALYTICS DASHBOARD */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="glass-panel p-6 rounded-3xl border border-zinc-800 space-y-2">
              <span className="text-xs text-zinc-400 font-semibold block">Total Active Typists</span>
              <span className="text-3xl font-black text-white font-mono">{adminUsers.length} Users</span>
              <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                Live Registered Users
              </span>
            </div>
            <div className="glass-panel p-6 rounded-3xl border border-zinc-800 space-y-2">
              <span className="text-xs text-zinc-400 font-semibold block">Total Sessions Logged</span>
              <span className="text-3xl font-black text-purple-400 font-mono">{totalSessions} Tests</span>
              <span className="text-[10px] text-purple-300 font-medium">Avg {avgWpm} WPM ({avgAccuracy}% Acc)</span>
            </div>
            <div className="glass-panel p-6 rounded-3xl border border-zinc-800 space-y-2">
              <span className="text-xs text-zinc-400 font-semibold block">Coins Awarded</span>
              <span className="text-3xl font-black text-amber-400 font-mono">{totalCoinsDistributed.toLocaleString()}</span>
              <span className="text-[10px] text-zinc-500">≈ Rs. {(totalCoinsDistributed / systemConfig.coinsToNprRate).toFixed(0)} NPR</span>
            </div>
            <div className="glass-panel p-6 rounded-3xl border border-zinc-800 space-y-2">
              <span className="text-xs text-zinc-400 font-semibold block">Pending Payouts</span>
              <span className="text-3xl font-black text-orange-400 font-mono">Rs. {pendingNprSum}</span>
              <span className="text-[10px] text-orange-300 font-medium">{pendingCount} Action Required</span>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-zinc-800 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">System Health & Security Guard</h2>
              <button
                onClick={handleResetData}
                className="px-3 py-1 rounded-xl bg-red-950/60 border border-red-500/30 text-red-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset App Data
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 space-y-1">
                <span className="text-zinc-400 block font-semibold">Anti-Cheat Mode</span>
                <span className="text-emerald-400 font-bold uppercase">
                  {isDevMode ? 'BYPASSED (DEV MODE)' : `${systemConfig.antiCheatSensitivity} Sensitivity`}
                </span>
              </div>
              <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 space-y-1">
                <span className="text-zinc-400 block font-semibold">Bot Attacks Blocked</span>
                <span className="text-purple-400 font-bold">{flaggedSessionsCount} Flagged Sessions</span>
              </div>
              <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 space-y-1">
                <span className="text-zinc-400 block font-semibold">Maintenance Status</span>
                <span className={systemConfig.maintenanceMode ? 'text-red-400 font-bold' : 'text-emerald-400 font-bold'}>
                  {systemConfig.maintenanceMode ? 'MAINTENANCE ACTIVE' : 'SYSTEM OPERATIONAL'}
                </span>
              </div>
            </div>
          </div>

          {/* Recent Real Typing Activity Stream */}
          <div className="glass-panel p-6 rounded-3xl border border-zinc-800 space-y-4">
            <h2 className="text-lg font-bold text-white">Recent Typing Tests Stream</h2>
            <div className="divide-y divide-zinc-800 text-xs">
              {typingResults.slice(0, 5).map((r) => (
                <div key={r.id} className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={r.userAvatar} alt={r.userName} className="w-8 h-8 rounded-full object-cover" />
                    <div>
                      <div className="font-bold text-white">{r.userName}</div>
                      <div className="text-[10px] text-zinc-500 font-mono">{r.mode} mode • {r.duration}s • {r.language}</div>
                    </div>
                  </div>
                  <div className="text-right font-mono">
                    <div className="font-bold text-purple-300">{r.wpm} WPM ({r.accuracy}%)</div>
                    <div className="text-[10px] text-amber-400">+{r.coinsEarned} Coins</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: WITHDRAWALS REQUEST MANAGER */}
      {activeTab === 'withdrawals' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Wallet className="w-5 h-5 text-purple-400" /> Real Payout Requests ({adminPayouts.length})
            </h2>
            <div className="text-xs font-mono text-zinc-400">
              Approved Total: <span className="text-emerald-400 font-bold">Rs. {totalWithdrawnNpr}</span>
            </div>
          </div>

          <div className="glass-panel rounded-2xl border border-zinc-800 overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-900/80 text-zinc-400 uppercase text-[10px] font-semibold border-b border-zinc-800">
                <tr>
                  <th className="py-3.5 px-4">Request ID</th>
                  <th className="py-3.5 px-4">User</th>
                  <th className="py-3.5 px-4">Method & Account</th>
                  <th className="py-3.5 px-4">Amount (NPR)</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {adminPayouts.map((req) => (
                  <tr key={req.id} className="hover:bg-zinc-800/30 transition-colors">
                    <td className="py-4 px-4 font-mono text-purple-300 font-bold">{req.id}</td>
                    <td className="py-4 px-4">
                      <div className="font-semibold text-white">{req.userName}</div>
                      <div className="text-[10px] text-zinc-500">{req.userEmail}</div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-bold uppercase text-amber-400 block">{req.method}</span>
                      <span className="font-mono text-zinc-300 text-[11px]">{req.accountDetails}</span>
                    </td>
                    <td className="py-4 px-4 font-mono font-black text-emerald-400 text-sm">
                      Rs. {req.amountNpr}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold capitalize ${
                        req.status === 'approved' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                        req.status === 'pending' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                        'bg-red-950 text-red-300 border border-red-800'
                      }`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right space-y-2">
                      {req.status === 'pending' ? (
                        <div className="flex flex-col items-end gap-1.5">
                          <input
                            type="text"
                            placeholder="Trx Reference ID (optional)"
                            value={trxRef[req.id] || ''}
                            onChange={(e) => setTrxRef({ ...trxRef, [req.id]: e.target.value })}
                            className="bg-zinc-950 border border-zinc-800 text-[10px] px-2 py-1 rounded text-zinc-200 font-mono w-40"
                          />
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateWithdrawalStatus(req.id, 'approved', 'Approved by Admin', trxRef[req.id] || 'MANUAL-PAYOUT')}
                              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1 rounded-lg text-[10px] flex items-center gap-1"
                            >
                              <CheckCircle2 className="w-3 h-3" /> Approve
                            </button>
                            <button
                              onClick={() => updateWithdrawalStatus(req.id, 'rejected', 'Rejected by Admin - Coins Refunded')}
                              className="bg-red-600 hover:bg-red-500 text-white font-bold px-3 py-1 rounded-lg text-[10px] flex items-center gap-1"
                            >
                              <XCircle className="w-3 h-3" /> Reject
                            </button>
                          </div>
                        </div>
                      ) : (
                        <span className="text-[10px] text-zinc-500 font-mono">
                          {req.transactionRef || 'Processed'}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: DYNAMIC CONFIG EDITOR */}
      {activeTab === 'config' && (
        <form onSubmit={handleSaveConfig} className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Sliders className="w-5 h-5 text-purple-400" /> Reward & System Settings
            </h2>
            <button
              type="submit"
              className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition-all shadow-lg shadow-purple-600/20 flex items-center gap-2"
            >
              <Save className="w-4 h-4" /> Save Configuration
            </button>
          </div>

          {configSaveSuccess && (
            <div className="bg-emerald-950/60 border border-emerald-500/40 p-4 rounded-xl text-emerald-300 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>System settings updated successfully! All changes are live immediately across the app.</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            
            {/* Reward Calculations */}
            <div className="glass-panel p-6 rounded-3xl border border-zinc-800 space-y-4">
              <h3 className="font-bold text-white text-sm border-b border-zinc-800 pb-2">Coin Calculation Rates</h3>
              
              <div className="space-y-1.5">
                <label className="text-zinc-400 font-semibold block">Coins per WPM</label>
                <input
                  type="number"
                  step="0.05"
                  value={editableConfig.coinsPerWpm}
                  onChange={(e) => setEditableConfig({ ...editableConfig, coinsPerWpm: Number(e.target.value) })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-white font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-zinc-400 font-semibold block">Coins per Accuracy % (over 85%)</label>
                <input
                  type="number"
                  step="0.05"
                  value={editableConfig.coinsPerAccuracyPercent}
                  onChange={(e) => setEditableConfig({ ...editableConfig, coinsPerAccuracyPercent: Number(e.target.value) })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-white font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-zinc-400 font-semibold block">Coins to NPR Conversion Rate (coins per 1 NPR)</label>
                <input
                  type="number"
                  value={editableConfig.coinsToNprRate}
                  onChange={(e) => setEditableConfig({ ...editableConfig, coinsToNprRate: Number(e.target.value) })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-white font-mono"
                />
              </div>
            </div>

            {/* Withdrawal Limits */}
            <div className="glass-panel p-6 rounded-3xl border border-zinc-800 space-y-4">
              <h3 className="font-bold text-white text-sm border-b border-zinc-800 pb-2">Daily Withdrawal Caps</h3>
              
              <div className="space-y-1.5">
                <label className="text-zinc-400 font-semibold block">Free Tier Max Daily Withdrawal (NPR)</label>
                <input
                  type="number"
                  value={editableConfig.maxWithdrawalFreeNpr}
                  onChange={(e) => setEditableConfig({ ...editableConfig, maxWithdrawalFreeNpr: Number(e.target.value) })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-white font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-zinc-400 font-semibold block">Premium Tier Max Daily Withdrawal (NPR)</label>
                <input
                  type="number"
                  value={editableConfig.maxWithdrawalPremiumNpr}
                  onChange={(e) => setEditableConfig({ ...editableConfig, maxWithdrawalPremiumNpr: Number(e.target.value) })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-white font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-zinc-400 font-semibold block">Referral Bonus (Karma Coins)</label>
                <input
                  type="number"
                  value={editableConfig.referralBonusCoins}
                  onChange={(e) => setEditableConfig({ ...editableConfig, referralBonusCoins: Number(e.target.value) })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-white font-mono"
                />
              </div>
            </div>

            {/* System Banner & Maintenance */}
            <div className="glass-panel p-6 rounded-3xl border border-zinc-800 space-y-4 md:col-span-2">
              <h3 className="font-bold text-white text-sm border-b border-zinc-800 pb-2">Announcement Banner & Maintenance</h3>

              <div className="space-y-1.5">
                <label className="text-zinc-400 font-semibold block">Announcement Banner Text</label>
                <input
                  type="text"
                  value={editableConfig.announcementBanner}
                  onChange={(e) => setEditableConfig({ ...editableConfig, announcementBanner: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="maintToggle"
                  checked={editableConfig.maintenanceMode}
                  onChange={(e) => setEditableConfig({ ...editableConfig, maintenanceMode: e.target.checked })}
                  className="w-4 h-4 accent-purple-600"
                />
                <label htmlFor="maintToggle" className="text-white font-semibold cursor-pointer">
                  Enable System Maintenance Mode (locks non-admin access)
                </label>
              </div>
            </div>

          </div>
        </form>
      )}

      {/* TAB 4: USER MANAGEMENT */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-400" /> Active Platform Users ({knownUsersList.length})
          </h2>

          <div className="glass-panel rounded-2xl border border-zinc-800 overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-900/80 text-zinc-400 uppercase text-[10px] font-semibold border-b border-zinc-800">
                <tr>
                  <th className="py-3.5 px-4">User</th>
                  <th className="py-3.5 px-4">Role</th>
                  <th className="py-3.5 px-4">Karma Coins</th>
                  <th className="py-3.5 px-4">Top Speed</th>
                  <th className="py-3.5 px-4 text-right">Quick Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {knownUsersList.map((u) => (
                  <tr key={u.id} className="hover:bg-zinc-800/30">
                    <td className="py-4 px-4 flex items-center gap-3">
                      <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full object-cover" />
                      <div>
                        <div className="font-bold text-white flex items-center gap-1.5">
                          {u.name}
                          {u.id === currentUser.id && (
                            <span className="px-1.5 py-0.2 bg-purple-950 text-purple-300 text-[9px] rounded font-bold">YOU</span>
                          )}
                        </div>
                        <div className="text-[10px] text-zinc-500 font-mono">{u.email}</div>
                        <div className="text-[10px] text-zinc-500 font-mono">Joined {new Date(u.joinedAt || Date.now()).toLocaleString()}</div>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-bold text-purple-400 uppercase">{u.role}</td>
                    <td className="py-4 px-4 font-mono font-bold text-amber-400">{u.coins.toLocaleString()} Coins</td>
                    <td className="py-4 px-4 font-mono font-bold text-white">{u.bestWpm} WPM</td>
                    <td className="py-4 px-4 text-right">
                      {u.id === currentUser.id ? (
                        <button
                          onClick={() => {
                            const roles: UserRole[] = ['user', 'premium_user', 'admin'];
                            const nextRole = roles[(roles.indexOf(currentUser.role) + 1) % roles.length];
                            setCurrentUser((prev) => ({
                              ...prev,
                              role: nextRole,
                              isPremium: nextRole !== 'user',
                            }));
                          }}
                          className="px-2.5 py-1 rounded bg-purple-950 border border-purple-500/40 text-purple-300 text-[10px] font-bold hover:text-white"
                        >
                          Switch Role ({currentUser.role})
                        </button>
                      ) : (
                        <span className="text-[10px] text-zinc-500 font-mono">Active Account</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
