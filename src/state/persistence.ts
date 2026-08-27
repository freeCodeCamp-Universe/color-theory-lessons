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
  preferences: AppPreferences;
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
    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed) || parsed.version !== VERSION) {
      return { progress: defaultProgress, preferences: defaultPreferences };
    }
    return {
      progress: sanitizeProgress(parsed.progress),
      preferences: sanitizePreferences(parsed.preferences),
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

function isColorBlindnessMode(value: unknown): value is string {
  return value === 'deuteranopia'
    || value === 'protanopia'
    || value === 'tritanopia'
    || value === 'achromatopsia';
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

function isScoreRecord(value: unknown): value is Record<string, number> {
  return isRecord(value)
    && Object.values(value).every((score) => typeof score === 'number');
}

function sanitizeProgress(value: unknown): ProgressState {
  const progress = isRecord(value) ? value : {};

  return {
    completedLessons: isStringArray(progress.completedLessons)
      ? progress.completedLessons
      : defaultProgress.completedLessons,
    completedQuizzes: isStringArray(progress.completedQuizzes)
      ? progress.completedQuizzes
      : defaultProgress.completedQuizzes,
    quizBestScores: isScoreRecord(progress.quizBestScores)
      ? progress.quizBestScores
      : defaultProgress.quizBestScores,
    completedMilestones: isStringArray(progress.completedMilestones)
      ? progress.completedMilestones
      : defaultProgress.completedMilestones,
  };
}

function sanitizePreferences(value: unknown): AppPreferences {
  const preferences = isRecord(value) ? value : {};

  return {
    theme: isThemePreference(preferences.theme)
      ? preferences.theme
      : defaultPreferences.theme,
    reducedMotion: typeof preferences.reducedMotion === 'boolean'
      ? preferences.reducedMotion
      : defaultPreferences.reducedMotion,
    colorBlindnessMode: isColorBlindnessMode(preferences.colorBlindnessMode)
      || preferences.colorBlindnessMode === null
      ? preferences.colorBlindnessMode
      : defaultPreferences.colorBlindnessMode,
  };
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
