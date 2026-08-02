export const DEVELOPMENT_MODE = process.env.NEXT_PUBLIC_DEVELOPMENT_MODE === 'true' || process.env.NODE_ENV === 'development';

export interface AntiCheatReport {
  isValid: boolean;
  reason?: string;
  flaggedForBot?: boolean;
  flaggedForPaste?: boolean;
  flaggedForTabSwitch?: boolean;
  flaggedForImpossibleSpeed?: boolean;
  varianceMs?: number;
}

export function validateTypingSession(
  keystrokeTimings: number[],
  wpm: number,
  accuracy: number,
  tabSwitches: number,
  pasteCount: number,
  sensitivity: 'low' | 'medium' | 'high' = 'medium'
): AntiCheatReport {
  // If Development Mode is active, bypass anti-cheat checks
  if (DEVELOPMENT_MODE) {
    return {
      isValid: true,
      reason: 'Bypassed in Development Mode'
    };
  }

  // Production Mode Validation Logic
  if (pasteCount > 0) {
    return {
      isValid: false,
      flaggedForPaste: true,
      reason: 'Pasting text into typing field is prohibited.'
    };
  }

  if (tabSwitches > 2) {
    return {
      isValid: false,
      flaggedForTabSwitch: true,
      reason: 'Excessive tab switching detected during session.'
    };
  }

  // WPM upper sanity bound check
  const maxWpmThreshold = sensitivity === 'high' ? 220 : sensitivity === 'medium' ? 260 : 300;
  if (wpm > maxWpmThreshold) {
    return {
      isValid: false,
      flaggedForImpossibleSpeed: true,
      reason: `WPM exceeds human maximum threshold (${maxWpmThreshold} WPM).`
    };
  }

  // Keystroke variance bot detection check
  if (keystrokeTimings && keystrokeTimings.length > 10) {
    const intervals = [];
    for (let i = 1; i < keystrokeTimings.length; i++) {
      intervals.push(keystrokeTimings[i] - keystrokeTimings[i - 1]);
    }
    const mean = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    const variance = intervals.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / intervals.length;

    // Exceptionally low variance (< 5ms) indicates scripted/bot typing
    if (variance < 5) {
      return {
        isValid: false,
        flaggedForBot: true,
        varianceMs: variance,
        reason: 'Robotic keystroke cadence detected.'
      };
    }
  }

  return {
    isValid: true
  };
}
