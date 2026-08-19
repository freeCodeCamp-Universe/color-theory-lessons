import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { LessonPlayer } from './LessonPlayer.tsx';
import { AppProvider } from '../../state/app-provider.tsx';
import { useAppState } from '../../state/app-context.tsx';
import type { LessonConfig } from '../../types/lesson.ts';

vi.mock('../tools/ToolRenderer.tsx', async () => {
  const { useEffect } = await import('react');
  return {
    ToolRenderer: ({ onChallengeComplete }: { onChallengeComplete?: () => void }) => {
      useEffect(() => { onChallengeComplete?.(); }, []);
      return null;
    },
  };
});

vi.mock('./StepPanelRenderer.tsx', () => ({ default: () => null }));

function StateReader() {
  const state = useAppState();
  return (
    <>
      <div data-testid="quiz-scores">{JSON.stringify(state.quizBestScores)}</div>
      <div data-testid="completed-lessons">{state.completedLessons.join(',')}</div>
      <div data-testid="glossary-terms">{state.glossaryTermsSeen.join(',')}</div>
      <div data-testid="completed-quizzes">{state.completedQuizzes.join(',')}</div>
    </>
  );
}

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
});
afterEach(() => cleanup());

function renderLesson(lesson: LessonConfig) {
  return render(
    <MemoryRouter>
      <AppProvider>
        <LessonPlayer lesson={lesson} />
        <StateReader />
      </AppProvider>
    </MemoryRouter>,
  );
}

function makeLesson(overrides?: Partial<LessonConfig>): LessonConfig {
  return {
    id: 'test-lesson',
    unitId: 'unit-test',
    title: 'Test Lesson',
    interactionType: 'color-wheel',
    steps: [{ text: 'Step one' }],
    challenge: { prompt: 'Do the thing', hints: [] },
    quizItems: [
      {
        id: 'q1',
        prompt: 'First question?',
        choices: [
          { id: 'a', label: 'Correct Answer', isCorrect: true },
          { id: 'b', label: 'Wrong Answer', isCorrect: false },
        ],
      },
      {
        id: 'q2',
        prompt: 'Second question?',
        choices: [
          { id: 'a', label: 'Right Choice', isCorrect: true },
          { id: 'b', label: 'Bad Choice', isCorrect: false },
        ],
      },
    ],
    glossaryTerms: [],
    reviewTags: [],
    ...overrides,
  };
}

async function advanceThroughChallenge() {
  const quizBtn = await screen.findByRole('button', { name: 'take the quiz →' });
  fireEvent.click(quizBtn);
}

describe('LessonPlayer', () => {
  describe('challenge content', () => {
    it('renders the prompt and hints from the lesson challenge', () => {
      renderLesson(makeLesson({
        challenge: {
          prompt: 'Match the target color.',
          hints: ['Adjust one channel at a time.'],
        },
      }));

      expect(screen.getByText('Match the target color.')).toBeInTheDocument();
      expect(screen.getByText('Adjust one channel at a time.')).toBeInTheDocument();
    });
  });

  describe('step position', () => {
    it('restores the current step after the player remounts', () => {
      const lesson = makeLesson({
        steps: [
          { text: 'Step one' },
          { text: 'Step two' },
          { text: 'Step three' },
        ],
      });
      const firstRender = renderLesson(lesson);

      fireEvent.click(screen.getByRole('button', { name: 'next' }));
      expect(screen.getByText('2 / 3')).toBeInTheDocument();
      firstRender.unmount();

      renderLesson(lesson);
      expect(screen.getByText('2 / 3')).toBeInTheDocument();
      expect(screen.getByText('Step two')).toBeInTheDocument();
    });

    it('restores the current quiz question and earlier answers after remounting', async () => {
      const lesson = makeLesson();
      const firstRender = renderLesson(lesson);
      await advanceThroughChallenge();

      fireEvent.click(screen.getByRole('button', { name: /Correct Answer/i }));
      fireEvent.click(screen.getByRole('button', { name: 'check' }));
      fireEvent.click(await screen.findByRole('button', { name: 'next question →' }));
      expect(screen.getByText('question 2 of 2')).toBeInTheDocument();
      firstRender.unmount();

      renderLesson(lesson);
      expect(screen.getByText('question 2 of 2')).toBeInTheDocument();
      expect(screen.getByText('Second question?')).toBeInTheDocument();

      fireEvent.click(screen.getByRole('button', { name: /Right Choice/i }));
      fireEvent.click(screen.getByRole('button', { name: 'check' }));
      fireEvent.click(await screen.findByRole('button', { name: 'finish lesson →' }));

      await waitFor(() => {
        const scores = JSON.parse(screen.getByTestId('quiz-scores').textContent ?? '{}');
        expect(scores['test-lesson']).toBe(100);
      });
    });
  });

  describe('finishLesson score dispatch', () => {
    it('dispatches COMPLETE_QUIZ with score 100 when all answers are correct', async () => {
      renderLesson(makeLesson());
      await advanceThroughChallenge();

      // Q1 — correct
      fireEvent.click(screen.getByRole('button', { name: /Correct Answer/i }));
      fireEvent.click(screen.getByRole('button', { name: 'check' }));
      await waitFor(() => screen.getByRole('button', { name: 'next question →' }));
      fireEvent.click(screen.getByRole('button', { name: 'next question →' }));

      // Q2 — correct
      fireEvent.click(screen.getByRole('button', { name: /Right Choice/i }));
      fireEvent.click(screen.getByRole('button', { name: 'check' }));
      await waitFor(() => screen.getByRole('button', { name: 'finish lesson →' }));
      fireEvent.click(screen.getByRole('button', { name: 'finish lesson →' }));

      await waitFor(() => {
        const scores = JSON.parse(screen.getByTestId('quiz-scores').textContent ?? '{}');
        expect(scores['test-lesson']).toBe(100);
      });
    });

    it('dispatches COMPLETE_QUIZ with score 50 when half the answers are correct', async () => {
      renderLesson(makeLesson());
      await advanceThroughChallenge();

      // Q1 — wrong
      fireEvent.click(screen.getByRole('button', { name: /Wrong Answer/i }));
      fireEvent.click(screen.getByRole('button', { name: 'check' }));
      await waitFor(() => screen.getByRole('button', { name: 'next question →' }));
      fireEvent.click(screen.getByRole('button', { name: 'next question →' }));

      // Q2 — correct
      fireEvent.click(screen.getByRole('button', { name: /Right Choice/i }));
      fireEvent.click(screen.getByRole('button', { name: 'check' }));
      await waitFor(() => screen.getByRole('button', { name: 'finish lesson →' }));
      fireEvent.click(screen.getByRole('button', { name: 'finish lesson →' }));

      await waitFor(() => {
        const scores = JSON.parse(screen.getByTestId('quiz-scores').textContent ?? '{}');
        expect(scores['test-lesson']).toBe(50);
      });
    });

    it('dispatches COMPLETE_LESSON without COMPLETE_QUIZ when lesson has no quiz items', async () => {
      renderLesson(makeLesson({ quizItems: [] }));

      const finishBtn = await screen.findByRole('button', { name: 'finish lesson →' });
      fireEvent.click(finishBtn);

      await waitFor(() => {
        expect(screen.getByTestId('completed-lessons').textContent).toContain('test-lesson');
        expect(screen.getByTestId('completed-quizzes').textContent).toBe('');
      });
    });
  });

  describe('glossary terms dispatch', () => {
    it('dispatches ADD_GLOSSARY_TERMS when lesson has glossaryTerms', async () => {
      renderLesson(makeLesson({ quizItems: [], glossaryTerms: ['hue', 'saturation'] }));

      fireEvent.click(await screen.findByRole('button', { name: 'finish lesson →' }));

      await waitFor(() => {
        expect(screen.getByTestId('glossary-terms').textContent).toBe('hue,saturation');
      });
    });

    it('does not dispatch ADD_GLOSSARY_TERMS when glossaryTerms is empty', async () => {
      renderLesson(makeLesson({ quizItems: [], glossaryTerms: [] }));

      fireEvent.click(await screen.findByRole('button', { name: 'finish lesson →' }));

      await waitFor(() => {
        expect(screen.getByTestId('glossary-terms').textContent).toBe('');
      });
    });
  });
});
