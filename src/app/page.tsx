'use client';

import React from 'react';
import { TypingEngine } from '@/components/typing/TypingEngine';
import { Keyboard } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2 max-w-xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-500/30 text-purple-300 text-xs font-semibold">
          <Keyboard className="w-3.5 h-3.5 text-purple-400" />
          <span>Keystroke Reward Engine</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">Live Typing Arena</h1>
        <p className="text-xs text-zinc-400">
          Focus on your flow. Maintain high accuracy and speed to maximize your Karma Coins payout.
        </p>
      </div>

      <TypingEngine />
    </div>
  );
}
