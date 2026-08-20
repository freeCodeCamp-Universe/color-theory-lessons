import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { LessonPlayer } from './LessonPlayer.tsx';
import { AppProvider } from '../../state/app-provider.tsx';
import { useAppState } from '../../state/app-context.tsx';
import type { LessonConfig } from '../../types/lesson.ts';

const sessionKey = (lessonId: string) => `color-theory-course-lesson-session:${lessonId}`;

vi.mock('../tools/ToolRenderer.tsx', async () => {
  const { useEffect, useRef } = await import('react');
  return {
    ToolRenderer: ({ onChallengeComplete }: { onChallengeComplete?: () => void }) => {
      const initialOnChallengeComplete = useRef(onChallengeComplete);
      useEffect(() => { initialOnChallengeComplete.current?.(); }, []);
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
          { id: 'legacy-a', stableId: 'correct-answer', label: 'Correct Answer', isCorrect: true },
          { id: 'legacy-b', stableId: 'wrong-answer', label: 'Wrong Answer', isCorrect: false },
        ],
      },
      {
        id: 'q2',
        prompt: 'Second question?',
        choices: [
          { id: 'legacy-a', stableId: 'right-choice', label: 'Right Choice', isCorrect: true },
          { id: 'legacy-b', stableId: 'bad-choice', label: 'Bad Choice', isCorrect: false },
        ],
      },
    ],
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

  it('restores the selected choice and submitted feedback on the final quiz question after remounting', async () => {
    const lesson = makeLesson();
    const firstRender = renderLesson(lesson);
    await advanceThroughChallenge();

    fireEvent.click(screen.getByRole('button', { name: /Correct Answer/i }));
    fireEvent.click(screen.getByRole('button', { name: 'check' }));
    fireEvent.click(await screen.findByRole('button', { name: 'next question →' }));

    fireEvent.click(screen.getByRole('button', { name: /Right Choice/i }));
    fireEvent.click(screen.getByRole('button', { name: 'check' }));
    expect(screen.getByRole('button', { name: 'finish lesson →' })).toBeInTheDocument();
    firstRender.unmount();

    renderLesson(lesson);
    expect(screen.getByText('question 2 of 2')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'finish lesson →' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'finish lesson →' }));

    await waitFor(() => {
      expect(screen.getByText('2 of 2 quiz questions correct.')).toBeInTheDocument();
    });
  });

  it('restores the final score screen after remounting an unchanged completed quiz', async () => {
    const lesson = makeLesson();
    const firstRender = renderLesson(lesson);
    await advanceThroughChallenge();

    fireEvent.click(screen.getByRole('button', { name: /Correct Answer/i }));
    fireEvent.click(screen.getByRole('button', { name: 'check' }));
    fireEvent.click(await screen.findByRole('button', { name: 'next question →' }));
    fireEvent.click(screen.getByRole('button', { name: /Right Choice/i }));
    fireEvent.click(screen.getByRole('button', { name: 'check' }));
    fireEvent.click(await screen.findByRole('button', { name: 'finish lesson →' }));

    await waitFor(() => {
      expect(screen.getByText('2 of 2 quiz questions correct.')).toBeInTheDocument();
    });
    firstRender.unmount();

    renderLesson(lesson);
    expect(screen.getByText('2 of 2 quiz questions correct.')).toBeInTheDocument();
  });

  it('keeps saved answers attached to the same logical choice after a harmless choice reorder', async () => {
    const originalLesson = makeLesson();
    const firstRender = renderLesson(originalLesson);
    await advanceThroughChallenge();

    fireEvent.click(screen.getByRole('button', { name: /Correct Answer/i }));
    fireEvent.click(screen.getByRole('button', { name: 'check' }));
    fireEvent.click(await screen.findByRole('button', { name: 'next question →' }));
    firstRender.unmount();

    const reorderedLesson = makeLesson({
      quizItems: [
        {
          id: 'q1',
          prompt: 'First question?',
          choices: [
            { id: 'a', stableId: 'wrong-answer', label: 'Wrong Answer', isCorrect: false },
            { id: 'b', stableId: 'correct-answer', label: 'Correct Answer', isCorrect: true },
          ],
        },
        {
          id: 'q2',
          prompt: 'Second question?',
          choices: [
            { id: 'a', stableId: 'bad-choice', label: 'Bad Choice', isCorrect: false },
            { id: 'b', stableId: 'right-choice', label: 'Right Choice', isCorrect: true },
          ],
        },
      ],
    });

    renderLesson(reorderedLesson);
    expect(screen.getByText('question 2 of 2')).toBeInTheDocument();
    expect(screen.getByText('Second question?')).toBeInTheDocument();
    expect(screen.getByText('A.')).toBeInTheDocument();
    expect(screen.getByText('B.')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Right Choice/i }));
    fireEvent.click(screen.getByRole('button', { name: 'check' }));
    fireEvent.click(await screen.findByRole('button', { name: 'finish lesson →' }));

    await waitFor(() => {
      const scores = JSON.parse(screen.getByTestId('quiz-scores').textContent ?? '{}');
      expect(scores['test-lesson']).toBe(100);
    });
  });

  it('restarts only the quiz when the saved quiz signature no longer matches', async () => {
    const lesson = makeLesson();
    const firstRender = renderLesson(lesson);
    await advanceThroughChallenge();

    fireEvent.click(screen.getByRole('button', { name: /Correct Answer/i }));
    fireEvent.click(screen.getByRole('button', { name: 'check' }));
    fireEvent.click(await screen.findByRole('button', { name: 'next question →' }));
    firstRender.unmount();

    renderLesson(makeLesson({
      quizItems: [
        {
          id: 'q1',
          prompt: 'First question?',
          choices: [
            { id: 'legacy-a', stableId: 'correct-answer', label: 'Updated Correct Answer', isCorrect: true },
            { id: 'legacy-b', stableId: 'wrong-answer', label: 'Wrong Answer', isCorrect: false },
          ],
        },
        ...lesson.quizItems.slice(1),
      ],
    }));

    expect(screen.getByText('question 1 of 2')).toBeInTheDocument();
    expect(screen.queryByText('1 / 1')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'check' })).toBeDisabled();
  });

  it('invalidates legacy quiz sessions without a quiz signature while preserving challenge completion', async () => {
    const lesson = makeLesson();

    sessionStorage.setItem(sessionKey(lesson.id), JSON.stringify({
      version: 1,
      phase: 'quiz',
      stepIndex: 0,
      challengeDone: true,
      quizIndex: 1,
      answers: [{ questionId: 'q1', choiceId: 'a', isCorrect: true }],
      selectedChoice: 'b',
      submitted: true,
    }));

    renderLesson(lesson);

    expect(screen.getByText('question 1 of 2')).toBeInTheDocument();
    expect(screen.getByText('First question?')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'check' })).toBeDisabled();
  });
});
