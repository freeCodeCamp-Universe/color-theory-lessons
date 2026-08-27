import type { ProgressState } from '../types/progress.ts';
import type { AppPreferences, ThemePreference } from './app-context.tsx';

const STORAGE_KEY = 'color-theory-course-state';
const VERSION = 3;

export const MILESTONE_SESSION_PREFIX = 'color-theory-course-milestone-session:';
export const READ_INTERFACE_SESSION_PREFIX = 'color-theory-course-read-interface-session:';
export const CHANNEL_PREDICTION_SESSION_PREFIX = 'color-theory-course-channel-prediction-session:';
export const THEME_FROM_SCRATCH_SESSION_PREFIX = 'color-theory-course-theme-from-scratch-session:';
export const SIMULATION_SPOTTER_SESSION_PREFIX = 'color-theory-course-simulation-spotter-session:';
export const ACCESSIBILITY_RESCUE_SESSION_PREFIX = 'color-theory-course-accessibility-rescue-session:';
export const SEMANTIC_AUDIT_SESSION_PREFIX = 'color-theory-course-semantic-audit-session:';
export const DARK_MODE_STRESS_SESSION_PREFIX = 'color-theory-course-dark-mode-stress-session:';

interface StoredState {
  version: number;
  progress: ProgressState;
  preferences: Partial<AppPreferences>;
}

const defaultProgress: ProgressState = {
  completedLessons: [],
  completedQuizzes: [],
  quizBestScores: {},
  completedMilestones: [],
};

const defaultPreferences = {
  theme: 'system' as ThemePreference,
  reducedMotion: false,
  colorBlindnessMode: null,
};

export function loadState(): {
  progress: ProgressState;
  preferences: AppPreferences;
} {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { progress: defaultProgress, preferences: defaultPreferences };
    }
    const parsed: StoredState = JSON.parse(raw);
    if (parsed.version !== VERSION) {
      return { progress: defaultProgress, preferences: defaultPreferences };
    }
    return {
      progress: parsed.progress,
      preferences: {
        ...defaultPreferences,
        ...parsed.preferences,
        theme: isThemePreference(parsed.preferences.theme)
          ? parsed.preferences.theme
          : defaultPreferences.theme,
      },
    };
  } catch {
    return { progress: defaultProgress, preferences: defaultPreferences };
  }
}

export function saveState(
  progress: ProgressState,
  preferences: AppPreferences,
): void {
  try {
    const stored: StoredState = {
      version: VERSION,
      progress,
      preferences,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
  } catch {
    // Storage full or unavailable — silently ignore
  }
}

function isThemePreference(value: unknown): value is ThemePreference {
  return value === 'dark' || value === 'light' || value === 'system';
}

export function clearMilestoneSessions(): void {
  try {
    const keys = Array.from(
      { length: sessionStorage.length },
      (_, index) => sessionStorage.key(index),
    );

    for (const key of keys) {
      if (
        key?.startsWith(MILESTONE_SESSION_PREFIX)
        || key?.startsWith(READ_INTERFACE_SESSION_PREFIX)
        || key?.startsWith(CHANNEL_PREDICTION_SESSION_PREFIX)
        || key?.startsWith(THEME_FROM_SCRATCH_SESSION_PREFIX)
        || key?.startsWith(SIMULATION_SPOTTER_SESSION_PREFIX)
        || key?.startsWith(ACCESSIBILITY_RESCUE_SESSION_PREFIX)
        || key?.startsWith(SEMANTIC_AUDIT_SESSION_PREFIX)
        || key?.startsWith(DARK_MODE_STRESS_SESSION_PREFIX)
      ) {
        sessionStorage.removeItem(key);
      }
    }
  } catch {
    // Continue resetting persisted progress when session storage is unavailable.
  }
}
