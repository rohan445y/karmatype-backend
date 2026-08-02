'use client';

import React, { useState } from 'react';
import { 
  Wallet, 
  Coins, 
  ArrowUpRight, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  ShieldCheck, 
  CreditCard,
  Building2,
  PhoneCall,
  Crown
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { coinsToNpr, nprToCoins } from '@/lib/rewards';

import Link from 'next/link';

export default function WalletPage() {
  const { 
    currentUser, 
    wallet, 
    withdrawals, 
    submitWithdrawal, 
    systemConfig 
  } = useAppStore();

  const isLoggedIn = Boolean(currentUser.email);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [method] = useState<'esewa'>('esewa');
  const [accountDetails, setAccountDetails] = useState('');
  const [amountNpr, setAmountNpr] = useState<number>(20);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Filter to show ONLY the current user's own transactions
  const userWithdrawals = withdrawals.filter((req) => req.userId === currentUser.id);

  const maxDailyLimitNpr = currentUser.isPremium 
    ? systemConfig.maxWithdrawalPremiumNpr 
    : systemConfig.maxWithdrawalFreeNpr;

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      setErrorMessage('Please log in to withdraw funds.');
      return;
    }
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!accountDetails.trim()) {
      setErrorMessage('Please enter a valid eSewa ID / Mobile Number.');
      return;
    }

    if (amountNpr < 10) {
      setErrorMessage('Minimum withdrawal amount is Rs. 10 NPR.');
      return;
    }

    if (amountNpr > maxDailyLimitNpr) {
      setErrorMessage(`Your daily withdrawal limit is Rs. ${maxDailyLimitNpr} NPR.`);
      return;
    }

    try {
      submitWithdrawal('esewa', accountDetails, amountNpr);
      setSuccessMessage(`Withdrawal request for Rs. ${amountNpr} NPR submitted successfully via eSewa! Status set to Pending.`);
      setIsWithdrawModalOpen(false);
      setAccountDetails('');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('Failed to submit withdrawal request.');
      }
    }
  };

  const coinsRequired = nprToCoins(amountNpr, systemConfig);

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16 text-center">
        <div className="max-w-lg w-full rounded-3xl border border-zinc-800 bg-zinc-950/90 p-10 shadow-2xl">
          <h1 className="text-3xl font-extrabold text-white mb-4">Login Required</h1>
          <p className="text-sm text-zinc-400 mb-6">
            You must be logged in to view your wallet balance, withdrawals, and payout ledger.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-2xl bg-purple-600 px-6 py-3 text-sm font-bold text-white hover:bg-purple-500 transition-colors"
          >
            Sign In to Continue
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="text-center space-y-2 max-w-xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-500/30 text-purple-300 text-xs font-semibold">
          <Wallet className="w-3.5 h-3.5 text-purple-400" />
          <span>Financial Dashboard</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">Wallet & Cash Payouts</h1>
        <p className="text-xs text-zinc-400">
          Request cash withdrawals directly to your eSewa Wallet in Nepal.
        </p>
      </div>

      {/* Messages */}
      {successMessage && (
        <div className="bg-emerald-950/60 border border-emerald-500/40 p-4 rounded-2xl text-emerald-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{successMessage}</span>
          </div>
          <button onClick={() => setSuccessMessage(null)} className="text-zinc-400 hover:text-white">Dismiss</button>
        </div>
      )}

      {/* Balances & Daily Cap Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        {/* Available Balance */}
        <div className="glass-panel p-6 rounded-3xl border border-purple-500/30 bg-gradient-to-br from-purple-600/10 to-transparent space-y-3 md:col-span-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-purple-300">Available Balance</span>
            <Coins className="w-5 h-5 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-black text-white font-mono">
              Rs. {coinsToNpr(currentUser.coins, systemConfig)}
            </span>
            <span className="text-sm text-amber-400 font-mono font-bold">
              ({currentUser.coins.toLocaleString()} Coins)
            </span>
          </div>
          <div className="pt-2 flex items-center justify-between">
            <button
              onClick={() => setIsWithdrawModalOpen(true)}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition-all shadow-lg shadow-purple-600/20 flex items-center gap-2"
            >
              <ArrowUpRight className="w-4 h-4" /> Withdraw Funds
            </button>
            <span className="text-[10px] text-zinc-400 font-medium">1,000 Coins = Rs. 10 NPR</span>
          </div>
        </div>

        {/* Pending Payouts */}
        <div className="glass-panel p-6 rounded-3xl border border-zinc-800 space-y-2">
          <span className="text-xs text-zinc-400 font-medium block">Pending Requests</span>
          <span className="text-2xl font-black text-amber-400 font-mono block">
            Rs. {wallet.pendingWithdrawalNpr}
          </span>
          <span className="text-[10px] text-zinc-500">Under Admin Review</span>
        </div>

        {/* Lifetime Withdrawn */}
        <div className="glass-panel p-6 rounded-3xl border border-zinc-800 space-y-2">
          <span className="text-xs text-zinc-400 font-medium block">Lifetime Paid Out</span>
          <span className="text-2xl font-black text-emerald-400 font-mono block">
            Rs. {wallet.totalWithdrawnNpr}
          </span>
          <span className="text-[10px] text-zinc-500">Successfully Completed</span>
        </div>

      </div>

      {/* Daily Withdrawal Limit Indicator */}
      <div className="glass-panel p-5 rounded-2xl border border-zinc-800 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Crown className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-2">
              <span>Daily Withdrawal Tier: {currentUser.isPremium ? 'Premium Plan' : 'Free Plan'}</span>
              {!currentUser.isPremium && (
                <span className="text-[10px] bg-purple-950 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded">
                  Upgrade for Rs. 100 Cap
                </span>
              )}
            </div>
            <p className="text-xs text-zinc-400">
              Maximum daily withdrawable amount is Rs. {maxDailyLimitNpr} NPR per day.
            </p>
          </div>
        </div>
      </div>

      {/* WITHDRAWAL HISTORY LEDGER */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Clock className="w-5 h-5 text-purple-400" /> My Transaction & Payout Ledger
        </h2>

        <div className="glass-panel rounded-2xl border border-zinc-800 overflow-hidden">
          {userWithdrawals.length === 0 ? (
            <div className="p-8 text-center text-xs text-zinc-500">
              No withdrawal transactions logged yet.
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-900/80 text-zinc-400 uppercase text-[10px] font-semibold border-b border-zinc-800">
                <tr>
                  <th className="py-3.5 px-4">Transaction ID</th>
                  <th className="py-3.5 px-4">Method</th>
                  <th className="py-3.5 px-4">eSewa Account Details</th>
                  <th className="py-3.5 px-4">Amount (NPR)</th>
                  <th className="py-3.5 px-4">Coins Deducted</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {userWithdrawals.map((req) => (
                  <tr key={req.id} className="hover:bg-zinc-800/30 transition-colors">
                    <td className="py-4 px-4 font-mono text-purple-300 font-bold">{req.id}</td>
                    <td className="py-4 px-4 font-semibold uppercase text-zinc-200">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                        eSewa
                      </span>
                    </td>
                    <td className="py-4 px-4 text-zinc-300 font-mono">{req.accountDetails}</td>
                    <td className="py-4 px-4 font-mono font-bold text-white">Rs. {req.amountNpr}</td>
                    <td className="py-4 px-4 font-mono text-amber-400">{req.coinsDeducted} Coins</td>
                    <td className="py-4 px-4">
                      {req.status === 'approved' && (
                        <span className="inline-flex items-center gap-1 text-emerald-400 bg-emerald-950/40 border border-emerald-800/50 px-2.5 py-1 rounded-full text-[10px] font-bold">
                          <CheckCircle2 className="w-3 h-3" /> Approved
                        </span>
                      )}
                      {req.status === 'pending' && (
                        <span className="inline-flex items-center gap-1 text-amber-400 bg-amber-950/40 border border-amber-800/50 px-2.5 py-1 rounded-full text-[10px] font-bold">
                          <Clock className="w-3 h-3" /> Pending Review
                        </span>
                      )}
                      {req.status === 'rejected' && (
                        <span className="inline-flex items-center gap-1 text-red-400 bg-red-950/40 border border-red-800/50 px-2.5 py-1 rounded-full text-[10px] font-bold">
                          <XCircle className="w-3 h-3" /> Rejected
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-right text-zinc-500 text-[10px]">
                      {new Date(req.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* WITHDRAWAL MODAL */}
      {isWithdrawModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-6 relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-purple-400" />
                <h3 className="text-lg font-bold text-white">Withdraw via eSewa</h3>
              </div>
              <button onClick={() => setIsWithdrawModalOpen(false)} className="text-zinc-400 hover:text-white text-xs bg-zinc-800 px-2.5 py-1 rounded-lg">
                Cancel
              </button>
            </div>

            {errorMessage && (
              <div className="bg-red-950/60 border border-red-500/40 p-3 rounded-xl text-red-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleWithdrawSubmit} className="space-y-4 text-xs">
              
              {/* Payment method fixed to eSewa */}
              <div className="space-y-1.5">
                <label className="text-zinc-400 font-semibold">Payment Method</label>
                <div className="p-3 rounded-xl border border-emerald-500/50 bg-emerald-950/40 text-emerald-300 font-bold flex items-center gap-2">
                  <span>🟢 eSewa Direct Transfer</span>
                </div>
              </div>

              {/* Account details input */}
              <div className="space-y-1.5">
                <label className="text-zinc-400 font-semibold">eSewa ID (Registered Mobile Number)</label>
                <input
                  type="text"
                  placeholder="9841234567"
                  value={accountDetails}
                  onChange={(e) => setAccountDetails(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white font-mono focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              {/* Amount in NPR */}
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <label className="text-zinc-400 font-semibold">Amount (NPR)</label>
                  <span className="text-amber-400 font-mono font-bold">Required: {coinsRequired} Coins</span>
                </div>
                <input
                  type="number"
                  min="10"
                  max={maxDailyLimitNpr}
                  value={amountNpr}
                  onChange={(e) => setAmountNpr(Number(e.target.value))}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white font-mono text-lg focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              {/* Submit button */}
              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-emerald-600/20 text-sm"
              >
                Submit eSewa Withdrawal Request
              </button>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
