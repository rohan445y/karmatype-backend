'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Timer,
  RotateCcw,
  Sparkles,
  ShieldAlert,
  Code,
  Globe,
  Quote,
  Award,
  CheckCircle2,
  Volume2,
  Keyboard,
  LogIn,
  Lock
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import confetti from 'canvas-confetti';
import { useAppStore } from '@/lib/store';
import { TypingModeType, DifficultyType, TypingResult } from '@/lib/types';
import { generateWords, CODE_SNIPPETS, QUOTES } from '@/lib/typing-content';
import { validateTypingSession } from '@/lib/anti-cheat';
import { calculateRewardCoins } from '@/lib/rewards';

export function TypingEngine() {
  const {
    currentUser,
    systemConfig,
    typingResults,
    addTypingResult,
    soundEnabled
  } = useAppStore();
  const router = useRouter();
  const isLoggedIn = Boolean(currentUser.email);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  // Daily test chances tracking (5 for Free, 15 for Premium)
  const todayStr = new Date().toDateString();
  const testsTodayCount = typingResults.filter(
    (r) => r.userId === currentUser.id && new Date(r.createdAt).toDateString() === todayStr
  ).length;

  const maxDailyChances = currentUser.isPremium || currentUser.role === 'premium_user' || currentUser.role === 'admin' ? 15 : 5;
  const chancesLeft = Math.max(0, maxDailyChances - testsTodayCount);
  const isDailyLimitReached = testsTodayCount >= maxDailyChances;

  // Config State
  const [mode] = useState<TypingModeType>('time');
  const [timeLimit] = useState<number>(15);
  const [wordCountLimit] = useState<number>(50);
  const [language] = useState<'english' | 'nepali'>('english');
  const [difficulty] = useState<DifficultyType>('medium');

  // Words & State
  const [words, setWords] = useState<string[]>([]);
  const [currentWordIdx, setCurrentWordIdx] = useState<number>(0);
  const [inputVal, setInputVal] = useState<string>('');
  const [history, setHistory] = useState<{ word: string; input: string; isCorrect: boolean }[]>([]);

  // Timer & Realtime Stats
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(15);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);

  // Raw metrics
  const [totalTypedChars, setTotalTypedChars] = useState<number>(0);
  const [correctTypedChars, setCorrectTypedChars] = useState<number>(0);
  const [errorCount, setErrorCount] = useState<number>(0);

  // Anti-cheat trackers
  const [keystrokeTimings, setKeystrokeTimings] = useState<number[]>([]);
  const [tabSwitches, setTabSwitches] = useState<number>(0);
  const [pasteAttempts, setPasteAttempts] = useState<number>(0);
  const [antiCheatWarning, setAntiCheatWarning] = useState<string | null>(null);

  // Result state
  const [lastResult, setLastResult] = useState<TypingResult | null>(null);
  const [completedSessionsCount, setCompletedSessionsCount] = useState<number>(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const startTimeRef = useRef<number | null>(null);

  // Monetag Ad Launcher
  const triggerMonetagAd = useCallback(() => {
    if (typeof window !== 'undefined') {
      try {
        // Zone 11485090 Rich / Onclick tag
        if (!document.querySelector('script[data-zone="11485090"]')) {
          (function (s: HTMLScriptElement) {
            s.dataset.zone = '11485090';
            s.src = 'https://al5sm.com/tag.min.js';
            ([document.documentElement, document.body].filter(Boolean).pop())?.appendChild(s);
          })(document.createElement('script'));
        }
        // Zone 11485082 Push tag
        if (!document.querySelector('script[src*="11485082"]')) {
          const s = document.createElement('script');
          s.src = 'https://5gvci.com/act/files/tag.min.js?z=11485082';
          s.setAttribute('data-cfasync', 'false');
          s.async = true;
          document.head.appendChild(s);
        }
      } catch (err) {
        console.error('Monetag ad launch error:', err);
      }
    }
  }, []);

  // Mechanical switch audio synthesizer (Web Audio API)
  const playKeystrokeSound = useCallback((isError: boolean = false) => {
    if (!soundEnabled) return;
    try {
      if (!audioContextRef.current) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioContextRef.current = new AudioCtx();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = isError ? 'sawtooth' : 'sine';
      osc.frequency.setValueAtTime(isError ? 180 : 540 + Math.random() * 80, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch {
      // Audio fallback
    }
  }, [soundEnabled]);

  // Reset engine
  const resetEngine = useCallback(() => {
    startTimeRef.current = null;
    setIsActive(false);
    setIsFinished(false);
    setCurrentWordIdx(0);
    setInputVal('');
    setHistory([]);
    setTotalTypedChars(0);
    setCorrectTypedChars(0);
    setErrorCount(0);
    setKeystrokeTimings([]);
    setTabSwitches(0);
    setPasteAttempts(0);
    setAntiCheatWarning(null);
    setLastResult(null);

    const generated = generateWords('time', 'english', 'medium', 120);
    setWords(generated);

    setTimeLeft(15);
    setElapsedSeconds(0);

    setTimeout(() => inputRef.current?.focus(), 50);
  }, []);

  useEffect(() => {
    resetEngine();
  }, [resetEngine]);

  // Key press shortcut listener (Esc to restart)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        resetEngine();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [resetEngine]);

  // Tab switch listener
  useEffect(() => {
    const handleBlur = () => {
      if (isActive) {
        setTabSwitches((prev) => prev + 1);
      }
    };
    window.addEventListener('blur', handleBlur);
    return () => window.removeEventListener('blur', handleBlur);
  }, [isActive]);

  // Finish session calculation
  const finishSession = useCallback((finalElapsedSeconds: number) => {
    setIsActive(false);
    setIsFinished(true);
    startTimeRef.current = null;

    const safeElapsed = Math.max(1, finalElapsedSeconds);
    const calculatedWpm = Math.round((correctTypedChars / 5) / (safeElapsed / 60));
    const calculatedCpm = Math.round(correctTypedChars / (safeElapsed / 60));
    const calculatedAccuracy = totalTypedChars > 0
      ? Math.round((correctTypedChars / totalTypedChars) * 1000) / 10
      : 100;

    // Validate anti-cheat
    const antiCheatReport = validateTypingSession(
      keystrokeTimings,
      calculatedWpm,
      calculatedAccuracy,
      tabSwitches,
      pasteAttempts,
      systemConfig.antiCheatSensitivity
    );

    if (!antiCheatReport.isValid) {
      setAntiCheatWarning(antiCheatReport.reason || 'Session invalidated by anti-cheat guard.');
    }

    // Reward calculation
    const rewards = calculateRewardCoins(calculatedWpm, calculatedAccuracy, currentUser.streak, systemConfig);
    const finalCoinsEarned = antiCheatReport.isValid ? rewards.coins : 0;

    const result: TypingResult = {
      id: `res-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      wpm: calculatedWpm,
      rawWpm: Math.round((totalTypedChars / 5) / (safeElapsed / 60)),
      cpm: calculatedCpm,
      accuracy: calculatedAccuracy,
      errors: errorCount,
      mode: 'time',
      duration: safeElapsed,
      language: 'english',
      difficulty: 'medium',
      coinsEarned: finalCoinsEarned,
      xpEarned: rewards.xp,
      isRewardEligible: antiCheatReport.isValid,
      createdAt: new Date().toISOString(),
      flaggedForCheat: !antiCheatReport.isValid,
    };

    setLastResult(result);
    addTypingResult(result);

    setCompletedSessionsCount((prev) => {
      const nextCount = prev + 1;
      if (nextCount >= 1) {
        triggerMonetagAd();
      }
      return nextCount;
    });

    if (antiCheatReport.isValid && calculatedWpm > 40) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [
    correctTypedChars,
    totalTypedChars,
    errorCount,
    keystrokeTimings,
    tabSwitches,
    pasteAttempts,
    systemConfig,
    currentUser,
    addTypingResult,
    triggerMonetagAd
  ]);

  const finishSessionRef = useRef(finishSession);
  useEffect(() => {
    finishSessionRef.current = finishSession;
  }, [finishSession]);

  // Main Timer Countdown loop - High precision timestamp-based
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && !isFinished) {
      if (!startTimeRef.current) {
        startTimeRef.current = Date.now();
      }

      interval = setInterval(() => {
        if (!startTimeRef.current) return;
        const now = Date.now();
        const elapsed = Math.floor((now - startTimeRef.current) / 1000);
        const remaining = Math.max(0, 15 - elapsed);

        setElapsedSeconds(elapsed);
        setTimeLeft(remaining);

        if (remaining <= 0) {
          clearInterval(interval);
          finishSessionRef.current(15);
        }
      }, 100);
    } else {
      startTimeRef.current = null;
    }
    return () => clearInterval(interval);
  }, [isActive, isFinished]);

  // Keystroke input handler
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isLoggedIn) {
      setShowLoginPrompt(true);
      e.target.blur();
      return;
    }
    if (isFinished || isDailyLimitReached) return;

    const val = e.target.value;
    const now = performance.now();

    if (!isActive) {
      setIsActive(true);
    }

    setKeystrokeTimings((prev) => [...prev, now]);

    const targetWord = words[currentWordIdx];

    // Space or completed word
    if (val.endsWith(' ')) {
      const typedWord = val.trim();
      const isWordCorrect = typedWord.toLowerCase() === targetWord.toLowerCase();

      playKeystrokeSound(!isWordCorrect);

      // Track correct characters (case-insensitive)
      let correctInThisWord = 0;
      for (let i = 0; i < Math.min(typedWord.length, targetWord.length); i++) {
        if (typedWord[i].toLowerCase() === targetWord[i].toLowerCase()) correctInThisWord++;
      }

      setCorrectTypedChars((prev) => prev + correctInThisWord + (isWordCorrect ? 1 : 0));
      setTotalTypedChars((prev) => prev + typedWord.length + 1);
      if (!isWordCorrect) setErrorCount((prev) => prev + 1);

      setHistory((prev) => [...prev, { word: targetWord, input: typedWord, isCorrect: isWordCorrect }]);
      setCurrentWordIdx((prev) => prev + 1);
      setInputVal('');

      // Check if finished words
      if (currentWordIdx + 1 >= words.length) {
        finishSession(elapsedSeconds || 1);
      }
    } else {
      setInputVal(val);
      playKeystrokeSound();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    setPasteAttempts((prev) => prev + 1);
    setAntiCheatWarning('Copying & Pasting is disabled during typing sessions!');
  };

  // Calculations for live UI stats
  const liveElapsed = Math.max(1, elapsedSeconds);
  const liveWpm = Math.round((correctTypedChars / 5) / (liveElapsed / 60));
  const liveAccuracy = totalTypedChars > 0 ? Math.round((correctTypedChars / totalTypedChars) * 100) : 100;

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      {/* Live Stats Bar */}
      <div className="flex items-center justify-between px-6 py-3 bg-zinc-950/40 border border-zinc-900 rounded-xl">
        <div className="flex items-center gap-8">
          <div>
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider block font-semibold">Time</span>
            <span className="text-2xl font-black text-white font-mono">
              {timeLeft}s
            </span>
          </div>
          <div>
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider block font-semibold">Live WPM</span>
            <span className="text-2xl font-black text-purple-400 font-mono">{liveWpm}</span>
          </div>
          <div>
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider block font-semibold">Accuracy</span>
            <span className="text-2xl font-black text-emerald-400 font-mono">{liveAccuracy}%</span>
          </div>
          <div>
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider block font-semibold">Chances Left</span>
            <span className={`text-2xl font-black font-mono ${chancesLeft > 0 ? 'text-amber-400' : 'text-red-400'}`}>
              {chancesLeft}/{maxDailyChances}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Anti-cheat Guard Pill */}
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/30 border border-emerald-800/40 px-3 py-1.5 rounded-full font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" /> Anti-Cheat Guard Active
          </div>
          {/* Restart Button */}
          <button
            onClick={resetEngine}
            disabled={isDailyLimitReached}
            className="p-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white transition-colors disabled:opacity-40"
            title="Restart Test (Esc)"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Anti-cheat Alert Warning if flagged */}
      {antiCheatWarning && (
        <div className="bg-red-950/60 border border-red-500/50 p-4 rounded-xl flex items-center gap-3 text-red-200 text-xs">
          <ShieldAlert className="w-5 h-5 text-red-400 flex-shrink-0" />
          <div>
            <span className="font-bold block">Security & Anti-Cheat Flag</span>
            {antiCheatWarning}
          </div>
        </div>
      )}

      {/* Main Interactive Typing Area */}
      <div
        className="glass-panel p-8 sm:p-10 rounded-3xl min-h-[220px] flex flex-col justify-between cursor-text relative overflow-hidden transition-all border border-zinc-800 hover:border-purple-500/30"
        onClick={() => { if (!isLoggedIn) setShowLoginPrompt(true); }}
      >
        {/* Login Required Overlay */}
        {showLoginPrompt && !isLoggedIn && (
          <div className="absolute inset-0 z-30 bg-black/70 backdrop-blur-md flex items-center justify-center rounded-3xl">
            <div className="text-center space-y-4 p-6 max-w-sm">
              <div className="inline-flex p-4 rounded-2xl bg-purple-600/20 border border-purple-500/40 mx-auto">
                <Lock className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-extrabold text-white">Login Required</h3>
              <p className="text-xs text-zinc-400">
                You need to log in to start typing and earn Karma Coins. Create an account or sign in to continue.
              </p>
              <div className="flex items-center gap-3 justify-center pt-2">
                <button
                  onClick={(e) => { e.stopPropagation(); router.push('/login'); }}
                  className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-2.5 px-6 rounded-xl transition-all shadow-lg shadow-purple-600/20 flex items-center gap-2 text-sm"
                >
                  <LogIn className="w-4 h-4" /> Log In / Sign Up
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setShowLoginPrompt(false); }}
                  className="text-zinc-500 hover:text-zinc-300 text-xs font-medium py-2.5 px-4 rounded-xl border border-zinc-800 hover:border-zinc-700 transition-colors"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Hidden Keystroke Listener Input */}
        <input
          ref={inputRef}
          type="text"
          value={inputVal}
          onChange={handleInputChange}
          onPaste={handlePaste}
          onFocus={() => { if (!isLoggedIn) { setShowLoginPrompt(true); inputRef.current?.blur(); } }}
          disabled={isFinished || isDailyLimitReached}
          className="absolute inset-0 opacity-0 cursor-default"
          autoFocus={isLoggedIn}
        />

        {/* Word Stream Presentation */}
        <div className="flex flex-wrap gap-x-2.5 sm:gap-x-3 gap-y-2.5 sm:gap-y-3 font-mono-typing text-lg sm:text-2xl leading-relaxed select-none">
          {/* Previous Words */}
          {history.map((h, i) => (
            <span
              key={i}
              className={h.isCorrect ? 'text-purple-400 font-medium' : 'text-red-400 underline decoration-red-500'}
            >
              {h.word}
            </span>
          ))}

          {/* Current Word Being Typed */}
          {words[currentWordIdx] && (
            <span className="relative bg-purple-950/40 px-1 rounded border-b-2 border-purple-500">
              {words[currentWordIdx].split('').map((char, charIdx) => {
                const typedChar = inputVal[charIdx];
                let charClass = 'text-zinc-400';
                if (typedChar !== undefined) {
                  charClass = typedChar.toLowerCase() === char.toLowerCase() ? 'text-purple-300 font-bold' : 'text-red-400 font-bold bg-red-950/50';
                }
                return (
                  <span key={charIdx} className={charClass}>
                    {char}
                  </span>
                );
              })}
              {inputVal.length > words[currentWordIdx].length && (
                <span className="text-red-400 bg-red-950/60 font-bold">
                  {inputVal.slice(words[currentWordIdx].length)}
                </span>
              )}
              {/* Animated Caret */}
              <span className="typing-caret h-5 sm:h-6 align-middle ml-0.5" />
            </span>
          )}

          {/* Future Words */}
          {words.slice(currentWordIdx + 1, currentWordIdx + 30).map((word, i) => (
            <span key={i} className="text-zinc-600">
              {word}
            </span>
          ))}
        </div>

        {/* Bottom Keyboard Shortcut Hint & Guest status */}
        <div className="mt-6 sm:mt-8 pt-4 border-t border-zinc-800/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-500">
          <span className="hidden sm:inline">
            {isLoggedIn ? `Logged in as ${currentUser.name}` : 'Guest Mode • Start typing directly'}
          </span>
          <span className="font-mono text-[11px]">Press Esc or tap restart button to reset</span>
        </div>
      </div>

      {/* Result Modal Celebration Overlay */}
      {isFinished && lastResult && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-lg flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-lg w-full p-8 shadow-2xl space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
              <Award className="w-48 h-48 text-purple-400" />
            </div>

            <div className="text-center space-y-2">
              <div className="inline-flex p-3 rounded-2xl bg-purple-600/20 text-purple-400 border border-purple-500/30 mb-2">
                <Sparkles className="w-8 h-8 animate-bounce" />
              </div>
              <h2 className="text-2xl font-extrabold text-white">Test Completed!</h2>
              <p className="text-xs text-zinc-400">Great session! Here is your performance breakdown.</p>
            </div>

            {/* Main Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 text-center">
                <span className="text-xs text-zinc-500 uppercase tracking-wider block font-semibold">Speed (WPM)</span>
                <span className="text-4xl font-black text-purple-400 font-mono">{lastResult.wpm}</span>
              </div>
              <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 text-center">
                <span className="text-xs text-zinc-500 uppercase tracking-wider block font-semibold">Accuracy</span>
                <span className="text-4xl font-black text-emerald-400 font-mono">{lastResult.accuracy}%</span>
              </div>
            </div>

            {/* Coins & XP Earned */}
            <div className="bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-pink-500/10 border border-amber-500/30 p-4 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-amber-300 block">Reward Earned</span>
                <span className="text-2xl font-black text-amber-400 font-mono flex items-center gap-1">
                  +{lastResult.coinsEarned} <span className="text-xs font-normal text-amber-300">Karma Coins</span>
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold text-purple-300 block">XP Gained</span>
                <span className="text-lg font-bold text-purple-400 font-mono">+{lastResult.xpEarned} XP</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => {
                  if (completedSessionsCount >= 1) {
                    triggerMonetagAd();
                  }
                  resetEngine();
                }}
                className="flex-1 bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-lg shadow-purple-600/20 flex items-center justify-center gap-2 text-sm"
              >
                <RotateCcw className="w-4 h-4" /> Try Again
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
