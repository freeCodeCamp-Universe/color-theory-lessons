import { describe, it, expect } from 'vitest';
import { appReducer } from './app-context.tsx';
import type { ProgressState } from '../types/progress.ts';

const baseState = {
  completedLessons: [],
  completedQuizzes: [],
  quizBestScores: {},
  completedMilestones: [],
  preferences: { theme: 'system', reducedMotion: false, colorBlindnessMode: null },
} satisfies ProgressState & { preferences: { theme: 'system'; reducedMotion: boolean; colorBlindnessMode: string | null } };

describe('appReducer', () => {
  describe('COMPLETE_LESSON', () => {
    it('adds a lesson id to completedLessons', () => {
      const next = appReducer(baseState, { type: 'COMPLETE_LESSON', lessonId: 'unit-1-l1' });
      expect(next.completedLessons).toContain('unit-1-l1');
    });

    it('is idempotent — does not add duplicates', () => {
      const first = appReducer(baseState, { type: 'COMPLETE_LESSON', lessonId: 'unit-1-l1' });
      const second = appReducer(first, { type: 'COMPLETE_LESSON', lessonId: 'unit-1-l1' });
      expect(second.completedLessons).toHaveLength(1);
      expect(second).toBe(first);
    });
  });

  describe('COMPLETE_QUIZ', () => {
    it('adds quiz id and records score', () => {
      const next = appReducer(baseState, { type: 'COMPLETE_QUIZ', quizId: 'unit-1-l1', score: 75 });
      expect(next.completedQuizzes).toContain('unit-1-l1');
      expect(next.quizBestScores['unit-1-l1']).toBe(75);
    });

    it('keeps the best score on repeat completion', () => {
      const first = appReducer(baseState, { type: 'COMPLETE_QUIZ', quizId: 'q1', score: 50 });
      const second = appReducer(first, { type: 'COMPLETE_QUIZ', quizId: 'q1', score: 100 });
      expect(second.quizBestScores['q1']).toBe(100);
      const third = appReducer(second, { type: 'COMPLETE_QUIZ', quizId: 'q1', score: 75 });
      expect(third.quizBestScores['q1']).toBe(100);
    });

    it('does not add duplicate quiz ids', () => {
      const first = appReducer(baseState, { type: 'COMPLETE_QUIZ', quizId: 'q1', score: 50 });
      const second = appReducer(first, { type: 'COMPLETE_QUIZ', quizId: 'q1', score: 80 });
      expect(second.completedQuizzes).toHaveLength(1);
    });
  });

  describe('COMPLETE_MILESTONE', () => {
    it('adds milestone id to completedMilestones', () => {
      const next = appReducer(baseState, { type: 'COMPLETE_MILESTONE', milestoneId: 'milestone-1' });
      expect(next.completedMilestones).toContain('milestone-1');
    });

    it('is idempotent', () => {
      const first = appReducer(baseState, { type: 'COMPLETE_MILESTONE', milestoneId: 'milestone-1' });
      const second = appReducer(first, { type: 'COMPLETE_MILESTONE', milestoneId: 'milestone-1' });
      expect(second.completedMilestones).toHaveLength(1);
      expect(second).toBe(first);
    });
  });

  describe('SET_PREFERENCE', () => {
    it('updates the specified preference key', () => {
      const next = appReducer(baseState, { type: 'SET_PREFERENCE', key: 'reducedMotion', value: true });
      expect(next.preferences.reducedMotion).toBe(true);
    });

    it('sets colorBlindnessMode', () => {
      const next = appReducer(baseState, { type: 'SET_PREFERENCE', key: 'colorBlindnessMode', value: 'deuteranopia' });
      expect(next.preferences.colorBlindnessMode).toBe('deuteranopia');
    });

    it('can clear colorBlindnessMode to null', () => {
      const with_ = appReducer(baseState, { type: 'SET_PREFERENCE', key: 'colorBlindnessMode', value: 'deuteranopia' });
      const cleared = appReducer(with_, { type: 'SET_PREFERENCE', key: 'colorBlindnessMode', value: null });
      expect(cleared.preferences.colorBlindnessMode).toBeNull();
    });
  });

  describe('RESET_PROGRESS', () => {
    it('clears all progress fields', () => {
      const withProgress = {
        ...baseState,
        completedLessons: ['unit-1-l1'],
        completedQuizzes: ['unit-1-l1'],
        quizBestScores: { 'unit-1-l1': 80 },
        completedMilestones: ['milestone-1'],
      };
      const next = appReducer(withProgress, { type: 'RESET_PROGRESS' });
      expect(next.completedLessons).toHaveLength(0);
      expect(next.completedQuizzes).toHaveLength(0);
      expect(next.quizBestScores).toEqual({});
      expect(next.completedMilestones).toHaveLength(0);
    });

    it('preserves preferences', () => {
      const withPref = appReducer(baseState, { type: 'SET_PREFERENCE', key: 'reducedMotion', value: true });
      const reset = appReducer(withPref, { type: 'RESET_PROGRESS' });
      expect(reset.preferences.reducedMotion).toBe(true);
    });
  });
});
