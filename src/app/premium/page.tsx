'use client';

import React, { useState } from 'react';
import { Crown, CheckCircle2, Sparkles, Zap, Shield, Flame, Palette, BarChart2 } from 'lucide-react';
import { useAppStore } from '@/lib/store';

export default function PremiumPage() {
  const { currentUser, switchRole } = useAppStore();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [comingSoon, setComingSoon] = useState(false);

  const handleDemoUpgrade = () => {
    setComingSoon(true);
  };

  return (
    <div className="space-y-12 max-w-4xl mx-auto pb-12">
      
      {/* Header */}
      <div className="text-center space-y-3 max-w-xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold">
          <Crown className="w-3.5 h-3.5" />
          <span>Karma Type Pro</span>
        </div>
        <h1 className="text-4xl font-black text-white">Unlock Your Full Potential</h1>
        <p className="text-xs sm:text-sm text-zinc-400">
          Supercharge your typing journey with 5x earning limits, zero ads, priority payouts, and exclusive themes.
        </p>
      </div>

      {comingSoon && (
        <div className="bg-amber-950/60 border border-amber-500/50 p-4 rounded-2xl text-center text-amber-300 text-xs font-bold space-y-1 animate-pulse">
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <span>Premium is Coming Soon!</span>
          </div>
          <p className="text-zinc-400 font-normal">We&apos;re working hard to bring you Karma Type Pro. Stay tuned for the launch!</p>
        </div>
      )}

      {/* Pricing Billing Toggle */}
      <div className="flex items-center justify-center gap-3">
        <span className={`text-xs font-semibold ${billingCycle === 'monthly' ? 'text-white' : 'text-zinc-500'}`}>Monthly</span>
        <button
          onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
          className="w-12 h-6 rounded-full bg-zinc-800 p-1 relative border border-zinc-700 transition-colors"
        >
          <div className={`w-4 h-4 rounded-full bg-purple-500 transition-transform ${billingCycle === 'annual' ? 'translate-x-6' : ''}`} />
        </button>
        <span className={`text-xs font-semibold flex items-center gap-1 ${billingCycle === 'annual' ? 'text-white' : 'text-zinc-500'}`}>
          Annual <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-1.5 py-0.5 rounded font-bold">Save 25%</span>
        </span>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Free Plan */}
        <div className="glass-panel p-8 rounded-3xl border border-zinc-800 space-y-6">
          <div>
            <h3 className="text-xl font-bold text-white mb-1">Free Tier</h3>
            <p className="text-xs text-zinc-400">Basic typing practice & standard rewards</p>
          </div>
          <div>
            <span className="text-4xl font-black text-white font-mono">Rs. 0</span>
            <span className="text-xs text-zinc-500"> / forever</span>
          </div>

          <ul className="space-y-3 text-xs text-zinc-300">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0" />
              <span>Unlimited practice typing sessions</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0" />
              <span>Max daily withdrawal: Rs. 20 NPR</span>
            </li>
            <li className="flex items-center gap-2 text-zinc-500">
              <span className="w-4 text-center">✕</span>
              <span className="line-through">Contains unobtrusive advertisements</span>
            </li>
            <li className="flex items-center gap-2 text-zinc-500">
              <span className="w-4 text-center">✕</span>
              <span className="line-through">Access to 4 basic themes only</span>
            </li>
          </ul>
        </div>

        {/* Premium Plan */}
        <div className="glass-panel-glow p-8 rounded-3xl border border-purple-500/50 bg-gradient-to-b from-purple-950/30 via-zinc-900 to-zinc-900 space-y-6 relative overflow-hidden">
          <div className="absolute top-4 right-4 bg-amber-500/20 text-amber-300 text-[10px] font-extrabold px-2.5 py-1 rounded-full border border-amber-500/40">
            RECOMMENDED
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
              Karma Pro <Crown className="w-5 h-5 text-amber-400" />
            </h3>
            <p className="text-xs text-zinc-300">Maximum earnings, analytics & custom aesthetics</p>
          </div>

          <div>
            <span className="text-4xl font-black text-amber-400 font-mono">
              {billingCycle === 'annual' ? 'Rs. 199' : 'Rs. 249'}
            </span>
            <span className="text-xs text-zinc-400"> / month</span>
          </div>

          <ul className="space-y-3 text-xs text-zinc-200">
            <li className="flex items-center gap-2 font-bold text-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Max daily withdrawal: Rs. 100 NPR (5x limit)</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0" />
              <span>100% Zero Advertisements</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0" />
              <span>All 12+ Themes Unlocked (RGB, Matrix, AMOLED)</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0" />
              <span>Typing Heatmap & WPM Analytics Chart</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0" />
              <span>Priority 4-hour Withdrawal Processing</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0" />
              <span>Animated PRO Badge & Profile Frame</span>
            </li>
          </ul>

          <button
            onClick={handleDemoUpgrade}
            disabled={comingSoon}
            className={`w-full font-extrabold py-4 rounded-2xl transition-all text-sm flex items-center justify-center gap-2 ${
              comingSoon
                ? 'bg-zinc-800 border border-zinc-700 text-amber-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-amber-500 via-purple-600 to-pink-600 hover:from-amber-400 hover:to-pink-500 text-white shadow-xl shadow-purple-600/30'
            }`}
          >
            {comingSoon ? (
              <><Sparkles className="w-4 h-4 text-amber-400" /> Available Soon</>
            ) : (
              <><Crown className="w-4 h-4 text-amber-300" /> Activate Premium Now</>
            )}
          </button>
        </div>

      </div>

    </div>
  );
}
