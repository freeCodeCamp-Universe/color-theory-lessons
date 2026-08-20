import type { ProgressState } from '../types/progress.ts';

const STORAGE_KEY = 'color-theory-course-state';
const VERSION = 3;

interface StoredState {
  version: number;
  progress: ProgressState;
  preferences: {
    reducedMotion: boolean;
    colorBlindnessMode: string | null;
  };
}

const defaultProgress: ProgressState = {
  completedLessons: [],
  completedQuizzes: [],
  quizBestScores: {},
  completedMilestones: [],
};

const defaultPreferences = {
  reducedMotion: false,
  colorBlindnessMode: null,
};

export function loadState(): {
  progress: ProgressState;
  preferences: { reducedMotion: boolean; colorBlindnessMode: string | null };
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
      preferences: parsed.preferences,
    };
  } catch {
    return { progress: defaultProgress, preferences: defaultPreferences };
  }
}

export function saveState(
  progress: ProgressState,
  preferences: { reducedMotion: boolean; colorBlindnessMode: string | null },
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
