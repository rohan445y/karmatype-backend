'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Keyboard,
  Wallet,
  Crown,
  ShieldAlert,
  Coins,
  Sparkles,
  LogIn,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { AuthModal } from '@/components/auth/AuthModal';

export function Navbar() {
  const pathname = usePathname();
  const {
    currentUser,
    setCurrentUser,
    setWallet,
    systemConfig
  } = useAppStore();

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isLoggedIn = Boolean(currentUser.email);

  const handleLogout = () => {
    setCurrentUser((prev) => ({
      ...prev,
      id: 'guest',
      name: 'Guest',
      email: '',
      avatar: '',
      role: 'user',
      isPremium: false,
      coins: 0,
      streak: 0,
      xp: 0,
      level: 1,
      totalTestsCompleted: 0,
      bestWpm: 0,
      avgWpm: 0,
      avgAccuracy: 0,
      referralCode: 'GUEST',
    }));
    setWallet({
      userId: 'guest',
      coinsBalance: 0,
      nprBalance: 0,
      pendingWithdrawalNpr: 0,
      totalWithdrawnNpr: 0,
      totalEarnedCoins: 0,
    });
  };

  const navLinks = [
    { href: '/type', label: 'Typing', icon: Keyboard },
    { href: '/wallet', label: 'Wallet', icon: Wallet },
    { href: '/premium', label: 'Go Premium', icon: Crown, highlight: true },
  ];

  if (currentUser.role === 'admin') {
    navLinks.push({ href: '/admin', label: 'Admin', icon: ShieldAlert });
  }

  return (
    <>
      {/* Top Announcement Banner */}
      {systemConfig.announcementBanner && (
        <div className="bg-gradient-to-r from-purple-900/90 via-purple-600/90 to-pink-600/90 text-white text-[11px] sm:text-xs py-1 px-4 text-center font-medium flex items-center justify-center gap-2 overflow-hidden">
          <Sparkles className="w-3.5 h-3.5 animate-pulse text-amber-300 flex-shrink-0" />
          <span className="truncate">{systemConfig.announcementBanner}</span>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#09090B]/95 backdrop-blur-xl border-b border-zinc-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">

          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/20 group-hover:scale-105 transition-transform">
              <Keyboard className="w-4 h-4 text-white" />
            </div>
            <div className="flex items-center gap-1.5 whitespace-nowrap">
              <span className="font-extrabold text-lg tracking-tight text-white group-hover:text-purple-300 transition-colors">
                Karma<span className="text-purple-500">Type</span>
              </span>
              {currentUser.isPremium && (
                <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                  <Crown className="w-2.5 h-2.5" /> PRO
                </span>
              )}
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 flex-shrink-0">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${isActive
                      ? 'bg-purple-600/20 text-purple-300 border border-purple-500/40'
                      : link.highlight
                        ? 'bg-gradient-to-r from-amber-500/15 via-purple-500/15 to-pink-500/15 text-amber-300 hover:bg-amber-500/25 border border-amber-500/40 shadow-sm'
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                    }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-purple-400' : ''}`} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center gap-2 flex-shrink-0">

            {/* Karma Coins Pill */}
          {isLoggedIn && (
            <Link
              href="/wallet"
              className="bg-zinc-900 border border-zinc-800 hover:border-purple-500/40 px-2.5 sm:px-3 py-1.5 rounded-xl flex items-center gap-1.5 group transition-all whitespace-nowrap"
            >
              <div className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400">
                <Coins className="w-3 h-3" />
              </div>
              <span className="font-bold text-amber-400 font-mono text-xs">{(currentUser?.coins ?? 0).toLocaleString()}</span>
            </Link>
          )}


            {/* Active Account Role Badge */}
            {isLoggedIn && (
              <div className="hidden sm:flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 px-2.5 py-1.5 rounded-xl text-xs font-bold text-zinc-300 whitespace-nowrap">
                <span className={`w-2 h-2 rounded-full ${currentUser?.role === 'admin' ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}`} />
                <span className="capitalize text-zinc-300">{currentUser?.role === 'admin' ? 'Admin Active' : currentUser?.name || 'User'}</span>
              </div>
            )}

            {/* Auth Action Button (Log In vs Log Out) */}
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="hidden sm:flex bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-1.5 rounded-xl font-bold text-xs items-center gap-1.5 transition-all whitespace-nowrap"
                title="Log Out of current session"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setAuthMode('login');
                  setIsAuthModalOpen(true);
                }}
                className="hidden sm:flex bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs px-3 py-1.5 rounded-xl transition-all shadow-md shadow-purple-600/20 whitespace-nowrap"
              >
                Log In
              </button>
            )}

            {/* Mobile Hamburger Toggle Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>

        </div>

        {/* Mobile Dropdown Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-zinc-950 border-b border-zinc-800 px-4 py-4 space-y-3 shadow-2xl animate-in slide-in-from-top duration-200">
            <div className="grid grid-cols-2 gap-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-all ${isActive
                        ? 'bg-purple-600/20 text-purple-300 border-purple-500/40'
                        : link.highlight
                          ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-300'
                      }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </div>

            <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between gap-2">
              {isLoggedIn ? (
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="flex-1 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" /> Log Out
                </button>
              ) : (
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setAuthMode('login');
                    setIsAuthModalOpen(true);
                  }}
                  className="flex-1 bg-purple-600 hover:bg-purple-500 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center"
                >
                  Log In
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authMode}
      />
    </>
  );
}
