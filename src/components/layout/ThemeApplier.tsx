'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { getTheme } from '@/lib/theme';

export function ThemeApplier() {
  const { currentTheme } = useAppStore();

  useEffect(() => {
    const themeObj = getTheme(currentTheme);
    const root = document.documentElement;

    root.style.setProperty('--bg-main', themeObj.bgMain);
    root.style.setProperty('--bg-card', themeObj.bgCard);
    root.style.setProperty('--border-color', themeObj.subtleBorder);
    root.style.setProperty('--primary', themeObj.primary);
    root.style.setProperty('--accent', themeObj.accent);
    root.style.setProperty('--text-main', themeObj.textMain);
    root.style.setProperty('--text-muted', themeObj.textMuted);
    root.style.setProperty('--caret', themeObj.caretColor);
    root.style.setProperty('--correct', themeObj.correctColor);
    root.style.setProperty('--incorrect', themeObj.incorrectColor);

    if (themeObj.gradientBg) {
      document.body.style.backgroundImage = themeObj.gradientBg;
    } else {
      document.body.style.backgroundImage = 'none';
    }
  }, [currentTheme]);

  return null;
}
