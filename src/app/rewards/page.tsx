'use client';

import React from 'react';
import { 
  Coins, 
  Gift, 
  Flame, 
  CheckCircle2, 
  Sparkles, 
  Zap, 
  Target, 
  Globe, 
  Award, 
  Crown 
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { coinsToNpr } from '@/lib/rewards';

export default function RewardsPage() {
  const { currentUser, wallet, achievements, missions, systemConfig } = useAppStore();

  const xpForNextLevel = currentUser.level * 300;
  const levelProgress = Math.min(100, Math.round((currentUser.xp / xpForNextLevel) * 100));

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="text-center space-y-2 max-w-xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-500/30 text-purple-300 text-xs font-semibold">
          <Gift className="w-3.5 h-3.5 text-pink-400" />
          <span>Reward & Mission Center</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">Gamification & Karma Coins</h1>
        <p className="text-xs text-zinc-400">
          Complete daily missions, maintain typing streaks, unlock badges, and earn financial rewards.
        </p>
      </div>

      {/* Level & Coins Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Card 1: Coins & NPR Balance */}
        <div className="glass-panel p-6 rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-transparent space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-300">Karma Coins Balance</span>
            <Coins className="w-5 h-5 text-amber-400" />
          </div>
          <div className="space-y-1">
            <span className="text-3xl font-black text-amber-400 font-mono block">
              {currentUser.coins.toLocaleString()}
            </span>
            <span className="text-xs text-zinc-400">
              ≈ Rs. {coinsToNpr(currentUser.coins, systemConfig)} NPR
            </span>
          </div>
        </div>

        {/* Card 2: Level Progression */}
        <div className="glass-panel p-6 rounded-3xl border border-purple-500/30 bg-gradient-to-br from-purple-500/10 to-transparent space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-purple-300">Level {currentUser.level} Typist</span>
            <Sparkles className="w-5 h-5 text-purple-400" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-zinc-400">{currentUser.xp} XP</span>
              <span className="text-purple-300">{xpForNextLevel} XP</span>
            </div>
            <div className="w-full bg-zinc-900 h-2.5 rounded-full overflow-hidden border border-zinc-800">
              <div 
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full transition-all duration-500" 
                style={{ width: `${levelProgress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Card 3: Daily Streak */}
        <div className="glass-panel p-6 rounded-3xl border border-orange-500/30 bg-gradient-to-br from-orange-500/10 to-transparent space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-orange-300">Active Typing Streak</span>
            <Flame className="w-5 h-5 text-orange-500 animate-pulse" />
          </div>
          <div className="space-y-1">
            <span className="text-3xl font-black text-orange-400 font-mono block">
              {currentUser.streak} Days
            </span>
            <span className="text-xs text-zinc-400">+15 Karma Coins daily streak bonus</span>
          </div>
        </div>

      </div>

      {/* DAILY & WEEKLY MISSIONS */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Target className="w-5 h-5 text-purple-400" /> Active Missions
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {missions.map((mission) => (
            <div 
              key={mission.id}
              className={`glass-panel p-5 rounded-2xl border space-y-3 transition-all ${
                mission.completed 
                  ? 'border-emerald-500/40 bg-emerald-950/20' 
                  : 'border-zinc-800 bg-zinc-900/60'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">
                  {mission.type}
                </span>
                {mission.completed ? (
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                  </span>
                ) : (
                  <span className="text-xs font-mono text-amber-400 font-bold">
                    +{mission.rewardCoins} Coins
                  </span>
                )}
              </div>

              <div>
                <h3 className="font-bold text-sm text-white mb-1">{mission.title}</h3>
                <p className="text-xs text-zinc-400">{mission.description}</p>
              </div>

              <div className="space-y-1 pt-2">
                <div className="flex justify-between text-[10px] text-zinc-400 font-mono">
                  <span>Progress</span>
                  <span>{mission.progress} / {mission.target}</span>
                </div>
                <div className="w-full bg-zinc-950 h-1.5 rounded-full overflow-hidden border border-zinc-800">
                  <div 
                    className="bg-purple-500 h-full rounded-full" 
                    style={{ width: `${(mission.progress / mission.target) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ACHIEVEMENTS GRID */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-400" /> Achievement Badges
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {achievements.map((ach) => (
            <div 
              key={ach.id}
              className={`p-5 rounded-2xl border transition-all ${
                ach.unlocked 
                  ? 'glass-panel-glow border-purple-500/50 bg-purple-950/20' 
                  : 'bg-zinc-900/40 border-zinc-800 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  ach.unlocked ? 'bg-purple-600/20 text-purple-400 border border-purple-500/40' : 'bg-zinc-800 text-zinc-600'
                }`}>
                  <Award className="w-5 h-5" />
                </div>
                {ach.unlocked && (
                  <span className="text-[10px] font-bold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/40">
                    Unlocked
                  </span>
                )}
              </div>
              <h3 className="font-bold text-sm text-white mb-1">{ach.title}</h3>
              <p className="text-xs text-zinc-400 mb-3 leading-relaxed">{ach.description}</p>
              <div className="text-xs font-mono font-bold text-amber-400">
                +{ach.rewardCoins} Karma Coins
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
