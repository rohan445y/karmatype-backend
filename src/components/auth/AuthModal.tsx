'use client';

import React, { useState } from 'react';
import { 
  Keyboard, 
  Mail, 
  Lock, 
  User as UserIcon, 
  ArrowRight, 
  X, 
  CheckCircle2, 
  ShieldCheck
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import type { User, UserRole } from '@/lib/types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

export function AuthModal({ isOpen, onClose, initialMode = 'login' }: AuthModalProps) {
  const { setCurrentUser, addRegisteredUser } = useAppStore();
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

  if (!isOpen) return null;

  const handleGoogleAuth = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const newUser: User = {
        id: `user-${Date.now()}`,
        name: 'Google User',
        email: 'user@gmail.com',
        role: 'user',
        isPremium: false,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80',
        coins: 0,
        xp: 0,
        streak: 0,
        level: 1,
        totalTestsCompleted: 0,
        bestWpm: 0,
        avgWpm: 0,
        avgAccuracy: 0,
        premiumExpiresAt: undefined,
        lastActiveDate: new Date().toISOString(),
        referralCode: 'GOOGLE',
        country: 'Nepal',
        joinedAt: new Date().toISOString(),
        username: 'googleuser',
        membershipPlan: 'Free',
        walletBalance: 0,
        status: 'active',
        emailVerified: true,
        lastLogin: new Date().toISOString(),
      };
      setCurrentUser((prev) => ({
        ...prev,
        ...newUser,
      }));
      addRegisteredUser(newUser);
      setMessageType('success');
      setMessage('Logged in with Google!');
      setTimeout(() => onClose(), 400);
    }, 300);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const cleanEmail = email.trim().toLowerCase();
      const endpoint = mode === 'register' ? '/api/auth/register' : '/api/auth/login';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email: cleanEmail,
          password,
        }),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || 'Authentication failed.');
      }

      const normalizedUser: User = {
        ...payload.user,
        id: payload.user?.id || `user-${Date.now()}`,
        name: payload.user?.name || name || cleanEmail.split('@')[0],
        email: payload.user?.email || cleanEmail,
        role: (payload.user?.role || 'user') as UserRole,
        isPremium: Boolean(payload.user?.isPremium),
        coins: payload.user?.coins ?? 0,
        xp: payload.user?.xp ?? 0,
        streak: payload.user?.streak ?? 0,
        level: payload.user?.level ?? 1,
        totalTestsCompleted: payload.user?.totalTestsCompleted ?? 0,
        bestWpm: payload.user?.bestWpm ?? 0,
        avgWpm: payload.user?.avgWpm ?? 0,
        avgAccuracy: payload.user?.avgAccuracy ?? 0,
        premiumExpiresAt: payload.user?.premiumExpiresAt,
        lastActiveDate: payload.user?.lastActiveDate || new Date().toISOString(),
        referralCode: payload.user?.referralCode || 'AUTO',
        country: payload.user?.country || 'Nepal',
        joinedAt: payload.user?.joinedAt || new Date().toISOString(),
        username: payload.user?.username || cleanEmail.split('@')[0],
        membershipPlan: payload.user?.membershipPlan || (payload.user?.isPremium ? 'Premium' : 'Free'),
        walletBalance: payload.user?.walletBalance ?? 0,
        status: payload.user?.status || 'active',
        emailVerified: payload.user?.emailVerified ?? true,
        lastLogin: payload.user?.lastLogin || new Date().toISOString(),
      };

      setCurrentUser((prev) => ({
        ...prev,
        ...normalizedUser,
      }));
      addRegisteredUser(normalizedUser);
      setMessageType('success');
      setMessage(mode === 'register' ? 'Account created & logged in!' : 'Logged in successfully!');

      window.setTimeout(() => {
        setMessage(null);
        onClose();
      }, 500);
    } catch (error) {
      setMessageType('error');
      setMessage(error instanceof Error ? error.message : 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-md w-full p-7 shadow-2xl relative space-y-6 overflow-hidden">
        
        {/* Glow backdrop */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-purple-600/10 blur-3xl rounded-full pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-zinc-400 hover:text-white p-1 rounded-xl bg-zinc-800/60"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center mx-auto text-white shadow-lg shadow-purple-500/20">
            <Keyboard className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-white">
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-xs text-zinc-400">
            {mode === 'login'
              ? 'Log in effortlessly to track WPM & earn rewards.'
              : 'Sign up now and start typing instantly.'}
          </p>
        </div>

        {message && (
          <div className={`border p-3 rounded-xl text-xs flex items-center gap-2 ${messageType === 'success'
            ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
            : 'bg-red-950/60 border-red-500/40 text-red-300'}`}
          >
            <CheckCircle2 className={`w-4 h-4 flex-shrink-0 ${messageType === 'success' ? 'text-emerald-400' : 'text-red-400'}`} />
            <span>{message}</span>
          </div>
        )}

        <div className="relative flex items-center justify-center my-3">
          <div className="border-t border-zinc-800 w-full" />
        </div>

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {mode === 'register' && (
            <div className="space-y-1">
              <label className="text-zinc-400 font-semibold">Full Name</label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 pl-9 text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-zinc-400 font-semibold">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 pl-9 text-white focus:outline-none focus:border-purple-500"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-zinc-400 font-semibold">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 pl-9 text-white focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-purple-600/20 text-sm flex items-center justify-center"
          >
            {loading ? (
              <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <span>
                {mode === 'login' ? 'Sign In' : 'Create Account'}
              </span>
            )}
          </button>
        </form>

        {/* Mode Switch Footer */}
        <div className="text-center text-xs text-zinc-400 pt-2 border-t border-zinc-800/60">
          {mode === 'login' ? (
            <span>
              Don't have an account?{' '}
              <button onClick={() => setMode('register')} className="text-purple-400 font-bold hover:underline">
                Sign Up
              </button>
            </span>
          ) : (
            <span>
              Already have an account?{' '}
              <button onClick={() => setMode('login')} className="text-purple-400 font-bold hover:underline">
                Sign In
              </button>
            </span>
          )}
        </div>

      </div>
    </div>
  );
}
