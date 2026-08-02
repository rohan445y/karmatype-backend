'use client';

import React, { useState } from 'react';
import { 
  User as UserIcon, 
  Crown, 
  Flame, 
  Trophy, 
  Coins, 
  Copy, 
  Check, 
  Globe, 
  Calendar, 
  BarChart2, 
  History, 
  Share2 
} from 'lucide-react';
import { useAppStore } from '@/lib/store';

export default function ProfilePage() {
  const { currentUser, typingResults, wallet } = useAppStore();
  const [copied, setCopied] = useState(false);

  const referralLink = `https://karmatype.com/register?ref=${currentUser.referralCode}`;

  const copyReferral = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Mock heatmap days
  const heatmapDays = Array.from({ length: 90 }, (_, i) => ({
    date: i,
    count: Math.floor(Math.random() * 5),
  }));

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      
      {/* Cover Banner & Profile Card */}
      <div className="glass-panel rounded-3xl border border-zinc-800 overflow-hidden relative">
        <div className="h-36 bg-gradient-to-r from-purple-900 via-pink-900 to-zinc-900 relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-500/20 via-transparent to-transparent" />
        </div>

        <div className="p-6 sm:p-8 pt-0 relative flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 -mt-16">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">
            <img 
              src={currentUser.avatar} 
              alt={currentUser.name} 
              className="w-24 h-24 rounded-2xl border-4 border-[#09090B] object-cover shadow-2xl bg-zinc-800" 
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-white">{currentUser.name}</h1>
                {currentUser.isPremium && (
                  <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                    <Crown className="w-3 h-3" /> PRO
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-400 font-mono">@{currentUser.name.toLowerCase().replace(/\s+/g, '')}</p>
              <div className="flex items-center gap-4 text-xs text-zinc-500 pt-1">
                <span className="flex items-center gap-1"><Globe className="w-3.5 h-3.5" /> {currentUser.country}</span>
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Joined {new Date(currentUser.joinedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-xl text-center">
              <span className="text-[10px] text-zinc-500 uppercase block font-semibold">Streak</span>
              <span className="text-sm font-bold text-orange-400 font-mono flex items-center gap-1">
                <Flame className="w-3.5 h-3.5" /> {currentUser.streak}d
              </span>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-xl text-center">
              <span className="text-[10px] text-zinc-500 uppercase block font-semibold">Level</span>
              <span className="text-sm font-bold text-purple-400 font-mono">Lvl {currentUser.level}</span>
            </div>
          </div>
        </div>
      </div>

      {/* STATS OVERVIEW GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-zinc-800 text-center">
          <span className="text-xs text-zinc-400 uppercase tracking-wider block mb-1">Top WPM</span>
          <span className="text-3xl font-black text-purple-400 font-mono">{currentUser.bestWpm}</span>
        </div>
        <div className="glass-panel p-5 rounded-2xl border border-zinc-800 text-center">
          <span className="text-xs text-zinc-400 uppercase tracking-wider block mb-1">Avg WPM</span>
          <span className="text-3xl font-black text-white font-mono">{currentUser.avgWpm}</span>
        </div>
        <div className="glass-panel p-5 rounded-2xl border border-zinc-800 text-center">
          <span className="text-xs text-zinc-400 uppercase tracking-wider block mb-1">Avg Accuracy</span>
          <span className="text-3xl font-black text-emerald-400 font-mono">{currentUser.avgAccuracy}%</span>
        </div>
        <div className="glass-panel p-5 rounded-2xl border border-zinc-800 text-center">
          <span className="text-xs text-zinc-400 uppercase tracking-wider block mb-1">Tests Done</span>
          <span className="text-3xl font-black text-amber-400 font-mono">{currentUser.totalTestsCompleted}</span>
        </div>
      </div>

      {/* PERFORMANCE GRAPH PREVIEW */}
      <div className="glass-panel p-6 rounded-3xl border border-zinc-800 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-purple-400" /> Recent WPM Performance History
          </h2>
          <span className="text-xs text-zinc-500">Last 10 Tests</span>
        </div>

        {/* SVG Bar Chart Visualization */}
        <div className="h-40 flex items-end gap-3 pt-6 pb-2 px-2 border-b border-zinc-800">
          {[88, 92, 85, 96, 102, 94, 108, 112, 105, 112].map((wpmVal, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center gap-2 group relative">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-7 bg-zinc-800 text-purple-300 text-[10px] font-mono px-2 py-0.5 rounded border border-zinc-700">
                {wpmVal} WPM
              </div>
              <div 
                className="w-full bg-gradient-to-t from-purple-600 to-pink-500 rounded-t-md hover:brightness-125 transition-all"
                style={{ height: `${(wpmVal / 140) * 100}%` }}
              />
              <span className="text-[10px] text-zinc-500 font-mono">#{idx + 1}</span>
            </div>
          ))}
        </div>
      </div>

      {/* TYPING HEATMAP (GITHUB STYLE GRID) */}
      <div className="glass-panel p-6 rounded-3xl border border-zinc-800 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white">365-Day Activity Heatmap</h2>
          <span className="text-xs text-purple-400 font-semibold">Active Streak: {currentUser.streak} days</span>
        </div>
        
        <div className="flex flex-wrap gap-1.5 pt-2">
          {heatmapDays.map((day) => {
            const intensity = day.count === 0 ? 'bg-zinc-900 border-zinc-800' :
              day.count === 1 ? 'bg-purple-950 border-purple-800' :
              day.count === 2 ? 'bg-purple-800 border-purple-700' :
              'bg-purple-500 border-purple-400';
            return (
              <div 
                key={day.date}
                className={`w-3.5 h-3.5 rounded-sm border ${intensity}`}
                title={`Day ${day.date + 1}: ${day.count} sessions completed`}
              />
            );
          })}
        </div>
      </div>

      {/* REFERRAL SYSTEM DASHBOARD */}
      <div className="glass-panel p-6 rounded-3xl border border-purple-500/30 bg-gradient-to-br from-purple-950/20 to-transparent space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Share2 className="w-5 h-5 text-amber-400" /> Invite Friends & Earn Coins
            </h2>
            <p className="text-xs text-zinc-400">
              Get +500 Karma Coins for every friend who registers using your code!
            </p>
          </div>

          <div className="flex items-center gap-2 bg-zinc-950 p-2 rounded-xl border border-zinc-800 w-full sm:w-auto">
            <span className="text-xs font-mono font-bold text-amber-400 px-2">{currentUser.referralCode}</span>
            <button
              onClick={copyReferral}
              className="bg-purple-600 hover:bg-purple-500 text-white p-2 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Link'}</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 pt-2 text-center text-xs">
          <div className="bg-zinc-900 p-3 rounded-xl border border-zinc-800">
            <span className="text-[10px] text-zinc-500 block uppercase">Link Clicks</span>
            <span className="font-mono font-bold text-white text-base">142</span>
          </div>
          <div className="bg-zinc-900 p-3 rounded-xl border border-zinc-800">
            <span className="text-[10px] text-zinc-500 block uppercase">Signups</span>
            <span className="font-mono font-bold text-purple-400 text-base">18</span>
          </div>
          <div className="bg-zinc-900 p-3 rounded-xl border border-zinc-800">
            <span className="text-[10px] text-zinc-500 block uppercase">Coins Earned</span>
            <span className="font-mono font-bold text-amber-400 text-base">9,000</span>
          </div>
        </div>
      </div>

    </div>
  );
}
