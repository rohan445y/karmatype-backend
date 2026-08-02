import { NextResponse } from 'next/server';
import { validateTypingSession } from '@/lib/anti-cheat';
import { calculateRewardCoins, DEFAULT_SYSTEM_CONFIG } from '@/lib/rewards';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { wpm, accuracy, keystrokes, tabSwitches, pasteAttempts } = body;

    // Validate anti-cheat
    const report = validateTypingSession(
      keystrokes || [],
      wpm || 0,
      accuracy || 100,
      tabSwitches || 0,
      pasteAttempts || 0,
      DEFAULT_SYSTEM_CONFIG.antiCheatSensitivity
    );

    if (!report.isValid) {
      return NextResponse.json({
        success: false,
        flagged: true,
        reason: report.reason,
        coinsEarned: 0
      }, { status: 400 });
    }

    const rewards = calculateRewardCoins(wpm, accuracy, 1, DEFAULT_SYSTEM_CONFIG);

    return NextResponse.json({
      success: true,
      flagged: false,
      coinsEarned: rewards.coins,
      xpEarned: rewards.xp
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
