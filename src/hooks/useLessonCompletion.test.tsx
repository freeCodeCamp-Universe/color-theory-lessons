import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderHook, act, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import type { ReactNode } from 'react';
import { AppProvider } from '../state/app-provider.tsx';
import { useAppState } from '../state/app-context.tsx';
import { useLessonCompletion, type QuizAnswer } from './useLessonCompletion.ts';
import type { LessonConfig } from '../types/lesson.ts';

function wrapper({ children }: { children: ReactNode }) {
  return (
    <MemoryRouter>
      <AppProvider>{children}</AppProvider>
    </MemoryRouter>
  );
}

function useTestHook(lesson: LessonConfig) {
  return { hook: useLessonCompletion(lesson), state: useAppState() };
}

function makeLesson(overrides?: Partial<LessonConfig>): LessonConfig {
  return {
    id: 'hook-test-lesson',
    unitId: 'unit-test',
    title: 'Hook Test Lesson',
    interactionType: 'color-wheel',
    steps: [{ text: 'Step' }],
    challenge: { prompt: 'Do the thing', hints: [] },
    quizItems: [],
    glossaryTerms: [],
    reviewTags: [],
    ...overrides,
  };
}

function answer(isCorrect: boolean): QuizAnswer {
  return { questionId: 'q1', choiceId: 'a', isCorrect };
}

beforeEach(() => localStorage.clear());
afterEach(() => cleanup());

describe('useLessonCompletion', () => {
  describe('COMPLETE_LESSON dispatch', () => {
    it('adds the lesson id to completedLessons', () => {
      const lesson = makeLesson();
      const { result } = renderHook(() => useTestHook(lesson), { wrapper });

      act(() => result.current.hook.completeLesson([]));

      expect(result.current.state.completedLessons).toContain('hook-test-lesson');
    });

    it('does not dispatch COMPLETE_QUIZ when lesson has no quiz items', () => {
      const lesson = makeLesson({ quizItems: [] });
      const { result } = renderHook(() => useTestHook(lesson), { wrapper });

      act(() => result.current.hook.completeLesson([]));

      expect(result.current.state.completedQuizzes).toHaveLength(0);
    });
  });

  describe('COMPLETE_QUIZ dispatch', () => {
    const quizLesson = makeLesson({
      quizItems: [
        { id: 'q1', prompt: 'Q1?', choices: [{ id: 'a', label: 'A', isCorrect: true }] },
        { id: 'q2', prompt: 'Q2?', choices: [{ id: 'a', label: 'A', isCorrect: true }] },
      ],
    });

    it('records score 100 when all answers are correct', () => {
      const { result } = renderHook(() => useTestHook(quizLesson), { wrapper });

      act(() => result.current.hook.completeLesson([answer(true), answer(true)]));

      expect(result.current.state.quizBestScores['hook-test-lesson']).toBe(100);
    });

    it('records score 50 when half the answers are correct', () => {
      const { result } = renderHook(() => useTestHook(quizLesson), { wrapper });

      act(() => result.current.hook.completeLesson([answer(true), answer(false)]));

      expect(result.current.state.quizBestScores['hook-test-lesson']).toBe(50);
    });

    it('records score 0 when all answers are wrong', () => {
      const { result } = renderHook(() => useTestHook(quizLesson), { wrapper });

      act(() => result.current.hook.completeLesson([answer(false), answer(false)]));

      expect(result.current.state.quizBestScores['hook-test-lesson']).toBe(0);
    });

    it('adds quiz id to completedQuizzes', () => {
      const { result } = renderHook(() => useTestHook(quizLesson), { wrapper });

      act(() => result.current.hook.completeLesson([answer(true), answer(true)]));

      expect(result.current.state.completedQuizzes).toContain('hook-test-lesson');
    });
  });

  describe('ADD_GLOSSARY_TERMS dispatch', () => {
    it('adds terms when lesson has glossaryTerms', () => {
      const lesson = makeLesson({ glossaryTerms: ['hue', 'saturation'] });
      const { result } = renderHook(() => useTestHook(lesson), { wrapper });

      act(() => result.current.hook.completeLesson([]));

      expect(result.current.state.glossaryTermsSeen).toContain('hue');
      expect(result.current.state.glossaryTermsSeen).toContain('saturation');
    });

    it('does not dispatch ADD_GLOSSARY_TERMS when glossaryTerms is empty', () => {
      const lesson = makeLesson({ glossaryTerms: [] });
      const { result } = renderHook(() => useTestHook(lesson), { wrapper });

      act(() => result.current.hook.completeLesson([]));

      expect(result.current.state.glossaryTermsSeen).toHaveLength(0);
    });
  });
});
