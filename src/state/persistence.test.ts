import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  CHANNEL_PREDICTION_SESSION_PREFIX,
  clearMilestoneSessions,
  loadState,
  MILESTONE_SESSION_PREFIX,
  READ_INTERFACE_SESSION_PREFIX,
  saveState,
  THEME_FROM_SCRATCH_SESSION_PREFIX,
} from './persistence.ts';
import type { ProgressState } from '../types/progress.ts';

const STORAGE_KEY = 'color-theory-course-state';
const VERSION = 3;

const emptyProgress: ProgressState = {
  completedLessons: [],
  completedQuizzes: [],
  quizBestScores: {},
  completedMilestones: [],
};

const defaultPrefs = { reducedMotion: false, colorBlindnessMode: null };

const sampleProgress: ProgressState = {
  completedLessons: ['unit-1-l1', 'unit-1-l2'],
  completedQuizzes: ['unit-1-l1'],
  quizBestScores: { 'unit-1-l1': 80 },
  completedMilestones: ['milestone-1'],
};

const samplePrefs = { reducedMotion: true, colorBlindnessMode: 'deuteranopia' };

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
});

describe('loadState', () => {
  it('returns defaults when localStorage is empty', () => {
    const { progress, preferences } = loadState();
    expect(progress).toEqual(emptyProgress);
    expect(preferences).toEqual(defaultPrefs);
  });

  it('returns stored data when valid JSON at correct version is present', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      version: VERSION,
      progress: sampleProgress,
      preferences: samplePrefs,
    }));

    const { progress, preferences } = loadState();
    expect(progress).toEqual(sampleProgress);
    expect(preferences).toEqual(samplePrefs);
  });

  it('returns defaults when stored version does not match', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      version: VERSION - 1,
      progress: sampleProgress,
      preferences: samplePrefs,
    }));

    const { progress, preferences } = loadState();
    expect(progress).toEqual(emptyProgress);
    expect(preferences).toEqual(defaultPrefs);
  });

  it('returns defaults when stored JSON is corrupt', () => {
    localStorage.setItem(STORAGE_KEY, 'not valid json {{{{');

    const { progress, preferences } = loadState();
    expect(progress).toEqual(emptyProgress);
    expect(preferences).toEqual(defaultPrefs);
  });

  it('returns defaults when stored JSON is valid but not an object', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(null));

    const { progress } = loadState();
    expect(progress).toEqual(emptyProgress);
  });
});

describe('saveState', () => {
  it('writes JSON to localStorage with the correct version key', () => {
    saveState(sampleProgress, samplePrefs);

    const raw = localStorage.getItem(STORAGE_KEY);
    expect(raw).not.toBeNull();
    const parsed = JSON.parse(raw!);
    expect(parsed.version).toBe(VERSION);
  });

  it('persists progress fields correctly', () => {
    saveState(sampleProgress, defaultPrefs);

    const { progress } = loadState();
    expect(progress.completedLessons).toEqual(sampleProgress.completedLessons);
    expect(progress.quizBestScores).toEqual(sampleProgress.quizBestScores);
    expect(progress.completedMilestones).toEqual(sampleProgress.completedMilestones);
  });

  it('persists preferences correctly', () => {
    saveState(emptyProgress, samplePrefs);

    const { preferences } = loadState();
    expect(preferences.reducedMotion).toBe(true);
    expect(preferences.colorBlindnessMode).toBe('deuteranopia');
  });

  it('does not throw when localStorage is full', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementationOnce(() => {
      throw new Error('QuotaExceededError');
    });

    expect(() => saveState(sampleProgress, defaultPrefs)).not.toThrow();
  });
});

describe('round-trip', () => {
  it('loadState returns the same data that was saved by saveState', () => {
    saveState(sampleProgress, samplePrefs);
    const { progress, preferences } = loadState();

    expect(progress).toEqual(sampleProgress);
    expect(preferences).toEqual(samplePrefs);
  });

  it('overwrites previous save with new data', () => {
    saveState(sampleProgress, samplePrefs);
    saveState(emptyProgress, defaultPrefs);

    const { progress, preferences } = loadState();
    expect(progress.completedLessons).toHaveLength(0);
    expect(preferences.reducedMotion).toBe(false);
  });
});

describe('clearMilestoneSessions', () => {
  it('removes milestone player and challenge sessions', () => {
    sessionStorage.setItem(`${MILESTONE_SESSION_PREFIX}milestone-1`, 'milestone state');
    sessionStorage.setItem(`${READ_INTERFACE_SESSION_PREFIX}milestone-1:1`, 'challenge state');
    sessionStorage.setItem(`${CHANNEL_PREDICTION_SESSION_PREFIX}milestone-2:1`, 'challenge state');
    sessionStorage.setItem(`${THEME_FROM_SCRATCH_SESSION_PREFIX}milestone-3:1`, 'challenge state');
    sessionStorage.setItem('color-theory-course-lesson-session:u1-l1', 'lesson state');
    sessionStorage.setItem('unrelated-key', 'unrelated state');

    clearMilestoneSessions();

    expect(sessionStorage.getItem(`${MILESTONE_SESSION_PREFIX}milestone-1`)).toBeNull();
    expect(sessionStorage.getItem(`${READ_INTERFACE_SESSION_PREFIX}milestone-1:1`)).toBeNull();
    expect(sessionStorage.getItem(`${CHANNEL_PREDICTION_SESSION_PREFIX}milestone-2:1`)).toBeNull();
    expect(sessionStorage.getItem(`${THEME_FROM_SCRATCH_SESSION_PREFIX}milestone-3:1`)).toBeNull();
    expect(sessionStorage.getItem('color-theory-course-lesson-session:u1-l1')).toBe('lesson state');
    expect(sessionStorage.getItem('unrelated-key')).toBe('unrelated state');
  });

  it('does not throw when session storage is unavailable', () => {
    sessionStorage.setItem(`${MILESTONE_SESSION_PREFIX}milestone-1`, 'milestone state');
    vi.spyOn(Storage.prototype, 'key').mockImplementationOnce(() => {
      throw new Error('SecurityError');
    });

    expect(() => clearMilestoneSessions()).not.toThrow();
  });
});
