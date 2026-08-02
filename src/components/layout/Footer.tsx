'use client';

import React from 'react';
import { Keyboard } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#09090B] border-t border-zinc-800/80 text-zinc-400 py-6 px-4 sm:px-6 lg:px-8 mt-20 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center text-white">
            <Keyboard className="w-4 h-4" />
          </div>
          <span className="font-bold text-lg text-white tracking-tight">
            Karma<span className="text-purple-500">Type</span>
          </span>
        </div>
        <div className="text-xs sm:text-sm text-zinc-500">
          © {new Date().getFullYear()} Karma Type Platform. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
