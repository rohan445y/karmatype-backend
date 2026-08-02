'use client';

import React from 'react';
import Link from 'next/link';
import { Keyboard, Heart, Shield, Sparkles, Trophy, Wallet, HelpCircle } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#09090B] border-t border-zinc-800/80 text-zinc-400 py-12 sm:py-10 px-4 sm:px-6 lg:px-8 mt-20 transition-colors">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-12">
        
        {/* Col 1: Brand */}
        <div className="space-y-4 md:col-span-1">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center text-white">
              <Keyboard className="w-4 h-4" />
            </div>
            <span className="font-bold text-lg text-white tracking-tight">
              Karma<span className="text-purple-500">Type</span>
            </span>
          </div>
          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
            Improve your typing, earn rewards, and enjoy a modern speed platform built for accuracy, leaderboard play, and real financial payout.
          </p>
          <div className="flex items-center gap-2 text-sm text-purple-400 font-medium">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>Built for gamers & productivity enthusiasts</span>
          </div>
        </div>

        {/* Col 2: Quick Links */}
        <div>
          <h4 className="text-xs sm:text-sm font-semibold text-zinc-200 uppercase tracking-wider mb-4">Typing Engine</h4>
          <ul className="space-y-2.5 text-sm">
            <li><Link href="/type" className="hover:text-purple-400 transition-colors">15s / 30s / 60s Speed Test</Link></li>
            <li><Link href="/type?mode=words" className="hover:text-purple-400 transition-colors">Words Mode</Link></li>
            <li><Link href="/type?mode=code" className="hover:text-purple-400 transition-colors">Programming Code Typing</Link></li>
            <li><Link href="/type?mode=nepali" className="hover:text-purple-400 transition-colors">Nepali Language Typing</Link></li>
            <li><Link href="/type?mode=quote" className="hover:text-purple-400 transition-colors">Quote Master Mode</Link></li>
          </ul>
        </div>

        {/* Col 3: Rewards & Financials */}
        <div>
          <h4 className="text-xs sm:text-sm font-semibold text-zinc-200 uppercase tracking-wider mb-4">Rewards & Wallet</h4>
          <ul className="space-y-2.5 text-sm">
            <li><Link href="/rewards" className="hover:text-purple-400 transition-colors">Karma Coins System</Link></li>
            <li><Link href="/wallet" className="hover:text-purple-400 transition-colors">eSewa & Khalti Withdrawals</Link></li>
            <li><Link href="/leaderboard" className="hover:text-purple-400 transition-colors">Nepal & Global Leaderboards</Link></li>
            <li><Link href="/premium" className="hover:text-purple-400 transition-colors">Premium Membership Perks</Link></li>
          </ul>
        </div>

        {/* Col 4: Trust & Support */}
        <div>
          <h4 className="text-xs sm:text-sm font-semibold text-zinc-200 uppercase tracking-wider mb-4">Security & Support</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2"><Shield className="w-4 h-4 text-emerald-400" /> <span>Anti-bot keystroke guard</span></li>
            <li className="flex items-center gap-2"><Trophy className="w-4 h-4 text-amber-400" /> <span>Verified fair leaderboard</span></li>
            <li className="flex items-center gap-2"><Wallet className="w-4 h-4 text-purple-400" /> <span>Instant payout ledger</span></li>
            <li className="flex items-center gap-2"><HelpCircle className="w-4 h-4 text-pink-400" /> <span>24/7 support tickets</span></li>
          </ul>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto pt-8 border-t border-zinc-800/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-sm text-zinc-500">
        <div className="w-full sm:w-auto">
          © {new Date().getFullYear()} Karma Type Platform. All rights reserved.
        </div>
        <div className="flex flex-wrap items-center gap-1 text-sm">
          <span>Made with</span>
          <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500" />
          <span>in Nepal for the world</span>
        </div>
      </div>
    </footer>
  );
}
