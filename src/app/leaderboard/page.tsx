'use client';

import React, { useState } from 'react';
import { Trophy, Crown, Globe, Flame, Medal, Search, Filter } from 'lucide-react';
import { useAppStore } from '@/lib/store';

interface LeaderboardUser {
  id: string;
  rank: number;
  name: string;
  avatar: string;
  wpm: number;
  accuracy: number;
  coins: number;
  streak: number;
  isPremium: boolean;
  country: string;
}

const SEED_LEADERBOARD: LeaderboardUser[] = [
  { id: 'u-1', rank: 1, name: 'Sohan Tamang', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80', wpm: 142, accuracy: 99.4, coins: 18400, streak: 42, isPremium: true, country: 'Nepal' },
  { id: 'u-2', rank: 2, name: 'Alex Rivera', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80', wpm: 138, accuracy: 98.8, coins: 16200, streak: 28, isPremium: true, country: 'USA' },
  { id: 'user-002', rank: 4, name: 'Bipul Thapa', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80', wpm: 108, accuracy: 97.5, coins: 9400, streak: 19, isPremium: false, country: 'Nepal' },
  { id: 'u-5', rank: 5, name: 'Elena Rostova', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80', wpm: 105, accuracy: 96.9, coins: 8100, streak: 14, isPremium: true, country: 'Estonia' },
  { id: 'u-6', rank: 6, name: 'Rohan Bhattarai', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80', wpm: 99, accuracy: 96.0, coins: 6500, streak: 11, isPremium: false, country: 'Nepal' },
];

export default function LeaderboardPage() {
  const { currentUser, typingResults } = useAppStore();
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly' | 'alltime'>('weekly');
  const [regionFilter, setRegionFilter] = useState<'global' | 'nepal'>('nepal');
  const [onlyPremium, setOnlyPremium] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Dynamically blend active currentUser and typing results into leaderboard rankings
  const activeUserEntry: LeaderboardUser = {
    id: currentUser.id,
    rank: 0,
    name: currentUser.name,
    avatar: currentUser.avatar,
    wpm: currentUser.bestWpm,
    accuracy: currentUser.avgAccuracy,
    coins: currentUser.coins,
    streak: currentUser.streak,
    isPremium: currentUser.isPremium,
    country: currentUser.country,
  };

  const combinedList = [...SEED_LEADERBOARD.filter((u) => u.id !== currentUser.id), activeUserEntry];
  
  // Sort by WPM descending then accuracy
  combinedList.sort((a, b) => b.wpm - a.wpm || b.accuracy - a.accuracy);

  const rankedUsers = combinedList.map((user, idx) => ({
    ...user,
    rank: idx + 1,
  }));

  const filteredUsers = rankedUsers.filter((user) => {
    if (regionFilter === 'nepal' && user.country !== 'Nepal') return false;
    if (onlyPremium && !user.isPremium) return false;
    if (searchQuery && !user.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      
      {/* Header */}
      <div className="text-center space-y-2 max-w-xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-500/30 text-purple-300 text-xs font-semibold">
          <Trophy className="w-3.5 h-3.5 text-amber-400" />
          <span>Hall of Fame</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">Typing Leaderboard</h1>
        <p className="text-xs text-zinc-400">
          Rankings are updated dynamically based on highest verified WPM speed and accuracy.
        </p>
      </div>

      {/* Controls Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-zinc-800 flex flex-wrap items-center justify-between gap-4">
        
        {/* Timeframe Tabs */}
        <div className="flex items-center gap-1 bg-zinc-900/80 p-1 rounded-xl border border-zinc-800">
          {(['daily', 'weekly', 'monthly', 'alltime'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setTimeframe(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                timeframe === tab ? 'bg-purple-600 text-white shadow-md' : 'text-zinc-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Nepal vs Global */}
          <div className="flex items-center gap-1 bg-zinc-900/80 p-1 rounded-xl border border-zinc-800">
            <button
              onClick={() => setRegionFilter('nepal')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                regionFilter === 'nepal' ? 'bg-purple-950 text-purple-300 border border-purple-500/40' : 'text-zinc-400 hover:text-white'
              }`}
            >
              🇳🇵 Nepal Ranking
            </button>
            <button
              onClick={() => setRegionFilter('global')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                regionFilter === 'global' ? 'bg-purple-950 text-purple-300 border border-purple-500/40' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Globe className="w-3.5 h-3.5 text-blue-400" /> Global
            </button>
          </div>

          {/* Premium Filter */}
          <button
            onClick={() => setOnlyPremium(!onlyPremium)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-all ${
              onlyPremium 
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' 
                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            <Crown className="w-3.5 h-3.5 text-amber-400" /> Premium Only
          </button>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search typist..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 pl-8 pr-3 py-1.5 rounded-xl focus:outline-none focus:border-purple-500 w-36 sm:w-48"
            />
          </div>

        </div>

      </div>

      {/* Top 3 Podium Graphic */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        {filteredUsers.slice(0, 3).map((user, idx) => {
          const podiumColor = idx === 0 ? 'from-amber-500/20 border-amber-500/50 text-amber-400' : idx === 1 ? 'from-slate-400/20 border-slate-400/50 text-slate-300' : 'from-amber-700/20 border-amber-700/50 text-amber-600';
          return (
            <div key={user.id} className={`glass-panel p-6 rounded-3xl border bg-gradient-to-b ${podiumColor} text-center space-y-3 relative overflow-hidden`}>
              <div className="absolute top-3 right-3 font-mono font-black text-2xl opacity-20">
                #{user.rank}
              </div>
              <img src={user.avatar} alt={user.name} className="w-16 h-16 rounded-full mx-auto border-2 border-purple-500/40 object-cover shadow-xl" />
              <div>
                <h3 className="font-bold text-white text-base flex items-center justify-center gap-1.5">
                  {user.name}
                  {user.isPremium && <Crown className="w-3.5 h-3.5 text-amber-400" />}
                </h3>
                <span className="text-[10px] text-zinc-400">{user.country}</span>
              </div>
              <div className="pt-2 border-t border-zinc-800/60 grid grid-cols-2 text-xs font-mono">
                <div>
                  <span className="text-zinc-500 text-[10px] block font-sans">Speed</span>
                  <span className="font-extrabold text-white text-base">{user.wpm} WPM</span>
                </div>
                <div>
                  <span className="text-zinc-500 text-[10px] block font-sans">Accuracy</span>
                  <span className="font-extrabold text-emerald-400 text-base">{user.accuracy}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Leaderboard Table */}
      <div className="glass-panel rounded-3xl border border-zinc-800 overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-zinc-900/90 text-zinc-400 uppercase text-[10px] font-semibold border-b border-zinc-800">
            <tr>
              <th className="py-4 px-6">Rank</th>
              <th className="py-4 px-6">Typist</th>
              <th className="py-4 px-6 font-mono text-right">Top Speed</th>
              <th className="py-4 px-6 font-mono text-right">Accuracy</th>
              <th className="py-4 px-6 font-mono text-right">Coins Earned</th>
              <th className="py-4 px-6 font-mono text-right">Streak</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60">
            {filteredUsers.map((user) => (
              <tr key={user.id} className={`hover:bg-zinc-800/30 transition-colors ${user.id === currentUser.id ? 'bg-purple-950/30 font-semibold' : ''}`}>
                <td className="py-4 px-6 font-mono font-bold text-sm">
                  {user.rank === 1 && <span className="text-amber-400">🥇 #1</span>}
                  {user.rank === 2 && <span className="text-slate-300">🥈 #2</span>}
                  {user.rank === 3 && <span className="text-amber-600">🥉 #3</span>}
                  {user.rank > 3 && <span className="text-zinc-500">#{user.rank}</span>}
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full object-cover border border-zinc-700" />
                    <div>
                      <div className="font-bold text-white text-sm flex items-center gap-1.5">
                        {user.name}
                        {user.isPremium && <Crown className="w-3.5 h-3.5 text-amber-400" />}
                        {user.id === currentUser.id && (
                          <span className="px-1.5 py-0.2 bg-purple-950 text-purple-300 text-[9px] rounded font-bold">YOU</span>
                        )}
                      </div>
                      <span className="text-[10px] text-zinc-500">{user.country}</span>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6 text-right font-mono font-black text-white text-base">
                  {user.wpm} <span className="text-[10px] text-purple-400 font-sans font-normal">WPM</span>
                </td>
                <td className="py-4 px-6 text-right font-mono font-bold text-emerald-400 text-sm">
                  {user.accuracy}%
                </td>
                <td className="py-4 px-6 text-right font-mono font-bold text-amber-400 text-sm">
                  {user.coins.toLocaleString()}
                </td>
                <td className="py-4 px-6 text-right font-mono font-bold text-orange-400 text-sm flex items-center justify-end gap-1">
                  <Flame className="w-3.5 h-3.5 text-orange-500" /> {user.streak}d
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
