import { afterEach, describe, expect, it, vi } from 'vitest';
import { units } from '../data/units.ts';
import {
  getNextLearningPath,
  isDevelopmentMode,
  isLessonUnlocked,
  isMilestoneUnlocked,
  isUnitUnlocked,
} from './progression.ts';

afterEach(() => vi.unstubAllEnvs());

const emptyProgress = {
  completedLessons: [] as string[],
  completedMilestones: [] as string[],
};

describe('progression', () => {
  it('defaults to production mode and enables development mode when VITE_DEV_MODE is set', () => {
    expect(isDevelopmentMode()).toBe(false);

    vi.stubEnv('VITE_DEV_MODE', 'false');
    expect(isDevelopmentMode()).toBe(true);
  });

  it('unlocks units only after every earlier unit and milestone is complete', () => {
    expect(isUnitUnlocked('unit-1', emptyProgress)).toBe(true);
    expect(isUnitUnlocked('unit-2', emptyProgress)).toBe(false);
    expect(isUnitUnlocked('unit-2', {
      completedLessons: units[0].lessons,
      completedMilestones: [],
    })).toBe(false);
    expect(isUnitUnlocked('unit-2', {
      completedLessons: units[0].lessons,
      completedMilestones: ['milestone-1'],
    })).toBe(true);
  });

  it('unlocks lessons in order within an unlocked unit', () => {
    expect(isLessonUnlocked('u1-l1', emptyProgress)).toBe(true);
    expect(isLessonUnlocked('u1-l2', emptyProgress)).toBe(false);
    expect(isLessonUnlocked('u1-l2', {
      ...emptyProgress,
      completedLessons: ['u1-l1'],
    })).toBe(true);
    expect(isLessonUnlocked('u2-l1', {
      completedLessons: units[0].lessons,
      completedMilestones: [],
    })).toBe(false);
  });

  it('unlocks a milestone only after its unit lessons and all earlier units are complete', () => {
    expect(isMilestoneUnlocked('milestone-1', emptyProgress)).toBe(false);
    expect(isMilestoneUnlocked('milestone-1', {
      completedLessons: units[0].lessons,
      completedMilestones: [],
    })).toBe(true);
    expect(isMilestoneUnlocked('milestone-2', {
      completedLessons: [...units[0].lessons, ...units[1].lessons],
      completedMilestones: [],
    })).toBe(false);
  });

  it('returns the first incomplete lesson or milestone in course order', () => {
    expect(getNextLearningPath(emptyProgress)).toBe('/lesson/u1-l1');
    expect(getNextLearningPath({
      completedLessons: units[0].lessons,
      completedMilestones: [],
    })).toBe('/milestone/milestone-1');
    expect(getNextLearningPath({
      completedLessons: units[0].lessons,
      completedMilestones: ['milestone-1'],
    })).toBe('/lesson/u2-l1');
  });
});
