import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { LessonPlayer } from './LessonPlayer.tsx';
import { AppProvider } from '../../state/app-provider.tsx';
import { useAppState } from '../../state/app-context.tsx';
import { ErrorBoundary } from '../ErrorBoundary.tsx';
import type { LessonConfig } from '../../types/lesson.ts';
import { lesson1_2 } from '../../lessons/unit-1/lesson-1-2.ts';
import { lesson1_6 } from '../../lessons/unit-1/lesson-1-6.ts';

const sessionKey = (lessonId: string) => `color-theory-course-lesson-session:${lessonId}`;

vi.mock('../tools/ToolRenderer.tsx', async () => {
  const { useEffect, useRef } = await import('react');
  return {
    ToolRenderer: ({
      onChallengeComplete,
      onStageChange,
    }: {
      onChallengeComplete?: () => void;
      onStageChange?: (stage: {
        id: string;
        title: string;
        instruction: string;
        position: number;
        total: number;
      }) => void;
    }) => {
      const initialOnStageChange = useRef(onStageChange);
      useEffect(() => {
        initialOnStageChange.current?.({
          id: 'hue',
          title: 'Match the hue',
          instruction: 'Match the hue target.',
          position: 1,
          total: 3,
        });
      }, []);
      return (
        <>
          <button onClick={onChallengeComplete}>complete mock challenge</button>
          <button onClick={() => onStageChange?.({
            id: 'saturation',
            title: 'Match the saturation',
            instruction: 'Match the saturation target.',
            position: 2,
            total: 3,
          })}>
            advance mock stage
          </button>
        </>
      );
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
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

function renderLesson(lesson: LessonConfig) {
  return render(
    <MemoryRouter>
      <AppProvider>
        <ErrorBoundary>
          <LessonPlayer lesson={lesson} />
        </ErrorBoundary>
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
          { stableId: 'correct-answer', label: 'Correct Answer', isCorrect: true },
          { stableId: 'wrong-answer', label: 'Wrong Answer', isCorrect: false },
        ],
      },
      {
        id: 'q2',
        prompt: 'Second question?',
        choices: [
          { stableId: 'right-choice', label: 'Right Choice', isCorrect: true },
          { stableId: 'bad-choice', label: 'Bad Choice', isCorrect: false },
        ],
      },
    ],
    reviewTags: [],
    ...overrides,
  };
}

async function advanceThroughChallenge() {
  fireEvent.click(screen.getByRole('button', { name: 'complete mock challenge' }));
  const quizBtn = await screen.findByRole('button', { name: 'take the quiz →' });
  fireEvent.click(quizBtn);
}

describe('LessonPlayer', () => {
  it('makes the scrollable instruction area keyboard focusable', () => {
    renderLesson(makeLesson());

    expect(screen.getByRole('region', { name: 'Lesson instructions' }))
      .toHaveAttribute('tabindex', '0');
  });

  it.each(lesson1_2.quizItems.filter((item) => item.colorSwatches))(
    'renders the authored assessment-safe swatches for $id',
    async (quizItem) => {
      renderLesson(makeLesson({ quizItems: [quizItem] }));
      await advanceThroughChallenge();

      for (const swatch of quizItem.colorSwatches ?? []) {
        const visual = screen.getByRole('img', { name: swatch.label });
        const descriptionId = visual.getAttribute('aria-describedby');
        expect(descriptionId).toBeTruthy();
        const description = document.getElementById(descriptionId!);
        expect(description).toHaveClass('sr-only');
        expect(description).toHaveTextContent(swatch.accessibleDescription!);
        expect(description).toHaveTextContent(`Color value: ${swatch.color.toUpperCase()}.`);
        expect(screen.getByText(swatch.label).previousElementSibling).toHaveAttribute('aria-hidden', 'true');
      }
    },
  );

  it('exposes progress and announces lesson, challenge, quiz, result, and completion changes once', async () => {
    renderLesson(makeLesson({
      steps: [{ text: 'Step one' }, { text: 'Step two' }, { text: 'Step three' }],
      quizItems: [
        {
          id: 'q1',
          prompt: 'First question?',
          choices: [
            { stableId: 'correct-answer', label: 'Correct Answer', isCorrect: true },
            {
              stableId: 'wrong-answer',
              label: 'Wrong Answer',
              isCorrect: false,
              explanation: 'The selected answer does not match the lesson.',
            },
          ],
        },
      ],
    }));

    const progress = screen.getByRole('progressbar', { name: /^Lesson progress:/ });
    const status = screen.getByRole('status');
    expect(progress).toHaveAttribute('aria-valuemin', '1');
    expect(progress).toHaveAttribute('aria-valuemax', '5');
    expect(progress).toHaveAttribute('aria-valuenow', '1');
    expect(progress).toHaveAttribute('aria-valuetext', 'Lesson step 1 of 3');
    expect(progress).toHaveAccessibleName('Lesson progress: Lesson step 1 of 3');
    expect(screen.getByText('Lesson step 1 of 3')).toBeInTheDocument();
    expect(status).toBeEmptyDOMElement();

    fireEvent.click(screen.getByRole('button', { name: 'next' }));
    expect(status).toHaveTextContent('Lesson step 2 of 3.');
    expect(progress).toHaveAttribute('aria-valuenow', '2');

    fireEvent.click(screen.getByRole('button', { name: 'next' }));
    expect(status).toHaveTextContent(
      'Challenge. Read lesson step 3 of 3, then complete the exercise.',
    );
    expect(progress).toHaveAttribute('aria-valuenow', '3');
    await waitFor(() => {
      expect(progress).toHaveAttribute(
        'aria-valuetext',
        'Lesson step 3 of 3, challenge stage 1 of 3',
      );
    });

    fireEvent.click(screen.getByRole('button', { name: 'complete mock challenge' }));
    expect(status).toHaveTextContent(/^The quiz is ready\.$/);
    expect(progress).toHaveAttribute('aria-valuetext', 'Challenge complete');

    fireEvent.click(await screen.findByRole('button', { name: 'take the quiz →' }));
    expect(status).toHaveTextContent('Quiz. Question 1 of 1.');
    expect(progress).toHaveAttribute('aria-valuenow', '5');
    expect(progress).toHaveAttribute('aria-valuetext', 'Quiz question 1 of 1');

    const wrongAnswer = screen.getByRole('button', { name: /Wrong Answer/i });
    fireEvent.click(wrongAnswer);
    expect(wrongAnswer).toHaveAttribute('aria-pressed', 'true');
    expect(wrongAnswer).toHaveAccessibleName(/Wrong Answer.*selected/);
    expect(status).toHaveTextContent(/^Selected Wrong Answer\.$/);

    fireEvent.click(screen.getByRole('button', { name: 'check' }));
    expect(status).toHaveTextContent(
      'Incorrect. Correct answer: Correct Answer. The selected answer does not match the lesson.',
    );
    expect(screen.getByRole('button', { name: /Correct Answer.*correct/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Wrong Answer.*your answer: incorrect/ }))
      .toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'finish lesson →' }));
    expect(status).toHaveTextContent('Lesson complete. 0 of 1 quiz questions correct.');
    expect(progress).toHaveAttribute('aria-valuetext', 'Lesson complete');
    expect(progress).toHaveAccessibleName('Lesson progress: Lesson complete');
  });

  describe('session storage failures', () => {
    it('starts a new lesson when the saved session is malformed', () => {
      const lesson = makeLesson();
      sessionStorage.setItem(sessionKey(lesson.id), '{not valid json');

      renderLesson(lesson);

      expect(screen.getByText('1 / 1')).toBeInTheDocument();
      expect(screen.queryByText('something went wrong.')).not.toBeInTheDocument();
      fireEvent.click(screen.getByRole('button', { name: 'complete mock challenge' }));
      expect(screen.getByRole('button', { name: 'take the quiz →' })).toBeInTheDocument();
    });

    it('starts and continues a lesson when reading the session throws', () => {
      const originalGetItem = Storage.prototype.getItem;
      const getItem = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(function (this: Storage, key) {
        if (key === sessionKey('test-lesson')) throw new Error('session storage is unavailable');
        return originalGetItem.call(this, key);
      });

      renderLesson(makeLesson());

      expect(getItem).toHaveBeenCalledWith(sessionKey('test-lesson'));
      expect(screen.queryByText('something went wrong.')).not.toBeInTheDocument();
      fireEvent.click(screen.getByRole('button', { name: 'complete mock challenge' }));
      expect(screen.getByRole('button', { name: 'take the quiz →' })).toBeInTheDocument();
    });

    it('continues a lesson when writing the session throws', async () => {
      const originalSetItem = Storage.prototype.setItem;
      const setItem = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(function (this: Storage, key, value) {
        if (key === sessionKey('test-lesson')) throw new Error('session storage is unavailable');
        return originalSetItem.call(this, key, value);
      });

      renderLesson(makeLesson());

      await waitFor(() => expect(setItem).toHaveBeenCalledWith(
        sessionKey('test-lesson'),
        expect.any(String),
      ));
      fireEvent.click(screen.getByRole('button', { name: 'complete mock challenge' }));
      expect(screen.getByRole('button', { name: 'take the quiz →' })).toBeInTheDocument();
      expect(screen.queryByText('something went wrong.')).not.toBeInTheDocument();
    });
  });

  it('moves through the complete lesson flow and preserves completion after redo', async () => {
    localStorage.setItem('color-theory-course-state', JSON.stringify({
      version: 3,
      progress: {
        completedLessons: ['u1-l6'],
        completedQuizzes: ['u1-l6'],
        quizBestScores: { 'u1-l6': 100 },
        completedMilestones: ['milestone-1'],
      },
      preferences: {},
    }));

    renderLesson(makeLesson({
      id: 'u1-l1',
      unitId: 'unit-1',
      steps: [
        { text: 'Step one' },
        { text: 'Step two' },
        { text: 'Step three' },
      ],
      challenge: { prompt: 'Complete the color challenge.', hints: [] },
      quizItems: [
        {
          id: 'q1',
          prompt: 'First question?',
          choices: [
            {
              stableId: 'correct-answer',
              label: 'Correct Answer',
              isCorrect: true,
              explanation: 'This is why the first answer is correct.',
            },
            {
              stableId: 'wrong-answer',
              label: 'Wrong Answer',
              isCorrect: false,
              explanation: 'This is why the first answer is incorrect.',
            },
          ],
        },
        {
          id: 'q2',
          prompt: 'Second question?',
          choices: [
            {
              stableId: 'right-choice',
              label: 'Right Choice',
              isCorrect: true,
              explanation: 'This is why the second answer is correct.',
            },
            { stableId: 'bad-choice', label: 'Bad Choice', isCorrect: false },
          ],
        },
      ],
    }));

    expect(screen.getByText('Step one')).toBeInTheDocument();
    expect(screen.getByText('1 / 3')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'back' })).toBeDisabled();
    expect(screen.queryByRole('button', { name: 'take the quiz →' })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'next' }));
    expect(screen.getByText('Step two')).toBeInTheDocument();
    expect(screen.getByText('2 / 3')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'back' }));
    expect(screen.getByText('Step one')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'next' }));
    fireEvent.click(screen.getByRole('button', { name: 'next' }));
    expect(screen.getByText('Step three')).toBeInTheDocument();
    expect(screen.getByText('Complete the color challenge.')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'take the quiz →' })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'complete mock challenge' }));
    fireEvent.click(await screen.findByRole('button', { name: 'take the quiz →' }));

    expect(screen.getByText('question 1 of 2')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'check' })).toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: /Wrong Answer/i }));
    expect(screen.getByRole('button', { name: 'check' })).toBeEnabled();
    fireEvent.click(screen.getByRole('button', { name: 'check' }));
    expect(screen.getByRole('button', { name: /Wrong Answer/i })).toHaveClass(/incorrect/);
    expect(screen.getByRole('button', { name: /Correct Answer/i })).toHaveClass(/correct/);
    expect(screen.getByText('This is why the first answer is incorrect.')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'next question →' }));
    expect(screen.getByText('question 2 of 2')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'check' })).toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: /Right Choice/i }));
    fireEvent.click(screen.getByRole('button', { name: 'check' }));
    expect(screen.getByRole('button', { name: /Right Choice/i })).toHaveClass(/correct/);
    expect(screen.getByText('This is why the second answer is correct.')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'finish lesson →' }));

    await waitFor(() => {
      expect(screen.getByText('1 of 2 quiz questions correct.')).toBeInTheDocument();
    });
    expect(screen.getByRole('link', { name: 'next lesson →' })).toHaveAttribute('href', '/lesson/u1-l2');
    expect(screen.getByRole('link', { name: '← all units' })).toHaveAttribute('href', '/');
    expect(screen.getByTestId('completed-lessons')).toHaveTextContent('u1-l6,u1-l1');
    expect(screen.getByTestId('quiz-scores')).toHaveTextContent('"u1-l1":50');

    fireEvent.click(screen.getByRole('button', { name: 'redo lesson' }));
    expect(screen.getByText('Step one')).toBeInTheDocument();
    expect(screen.getByText('1 / 3')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'back' })).toBeDisabled();
    expect(screen.queryByText('1 of 2 quiz questions correct.')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'take the quiz →' })).not.toBeInTheDocument();
    expect(screen.getByTestId('completed-lessons')).toHaveTextContent('u1-l6,u1-l1');
    expect(screen.getByTestId('quiz-scores')).toHaveTextContent('"u1-l1":50');
  });

  it('links a completed final lesson to its unit milestone', async () => {
    renderLesson(lesson1_6);

    for (let step = 1; step < lesson1_6.steps.length; step += 1) {
      fireEvent.click(screen.getByRole('button', { name: 'next' }));
    }
    fireEvent.click(screen.getByRole('button', { name: 'complete mock challenge' }));
    fireEvent.click(await screen.findByRole('button', { name: 'take the quiz →' }));

    for (const [index, quizItem] of lesson1_6.quizItems.entries()) {
      const correctChoice = quizItem.choices.find((choice) => choice.isCorrect);
      expect(correctChoice).toBeDefined();
      fireEvent.click(screen.getByText(correctChoice!.label).closest('button')!);
      fireEvent.click(screen.getByRole('button', { name: 'check' }));
      fireEvent.click(await screen.findByRole('button', {
        name: index < lesson1_6.quizItems.length - 1 ? 'next question →' : 'finish lesson →',
      }));
    }

    expect(await screen.findByRole('link', { name: 'start milestone →' }))
      .toHaveAttribute('href', '/milestone/milestone-1');
  });

  describe('challenge content', () => {
    it('renders the prompt with a closed hint interaction', () => {
      renderLesson(makeLesson({
        challenge: {
          prompt: 'Match the target color.',
          hints: ['Adjust one channel at a time.'],
        },
      }));

      expect(screen.getByText('Match the target color.')).toBeInTheDocument();
      expect(screen.queryByText('Adjust one channel at a time.')).not.toBeInTheDocument();
      fireEvent.click(screen.getByRole('button', { name: 'show hint' }));
      expect(screen.getByText('Adjust one channel at a time.')).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /hint/ })).not.toBeInTheDocument();
    });

    it('resets and filters mapped hints when the active stage changes', async () => {
      renderLesson(makeLesson({
        challenge: {
          prompt: 'Match each HSL target.',
          hints: [
            { stageId: 'hue', text: 'Hue hint' },
            { stageId: 'saturation', text: 'Saturation hint' },
          ],
        },
      }));

      fireEvent.click(await screen.findByRole('button', { name: 'show hint' }));
      expect(screen.getByText('Hue hint')).toBeInTheDocument();
      expect(screen.queryByText('Saturation hint')).not.toBeInTheDocument();

      fireEvent.click(screen.getByRole('button', { name: 'advance mock stage' }));
      expect(screen.queryByText('Hue hint')).not.toBeInTheDocument();
      fireEvent.click(screen.getByRole('button', { name: 'show hint' }));
      expect(screen.getByText('Saturation hint')).toBeInTheDocument();
    });

    it('uses the closed hint interaction in the challenge phase', () => {
      const lesson = makeLesson({
        id: 'challenge-phase-lesson',
        challenge: { prompt: 'Challenge phase prompt', hints: ['Challenge phase hint'] },
      });
      sessionStorage.setItem(sessionKey(lesson.id), JSON.stringify({
        version: 2,
        phase: 'challenge',
        stepIndex: 0,
        challengeDone: false,
        quizIndex: 0,
        answers: [],
        selectedChoice: null,
        submitted: false,
        quizSignature: null,
      }));

      renderLesson(lesson);
      expect(screen.getByText('Challenge phase prompt')).toBeInTheDocument();
      expect(screen.queryByText('Challenge phase hint')).not.toBeInTheDocument();
      fireEvent.click(screen.getByRole('button', { name: 'show hint' }));
      expect(screen.getByText('Challenge phase hint')).toBeInTheDocument();
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

    it('finishes a no-quiz lesson only after the tool reports success', async () => {
      renderLesson(makeLesson({ quizItems: [] }));

      expect(screen.queryByRole('button', { name: 'finish lesson →' })).not.toBeInTheDocument();
      fireEvent.click(screen.getByRole('button', { name: 'complete mock challenge' }));
      const finishBtn = await screen.findByRole('button', { name: 'finish lesson →' });
      fireEvent.click(finishBtn);

      await waitFor(() => {
        expect(screen.getByText('0 of 0 quiz questions correct.')).toBeInTheDocument();
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
            { stableId: 'wrong-answer', label: 'Wrong Answer', isCorrect: false },
            { stableId: 'correct-answer', label: 'Correct Answer', isCorrect: true },
          ],
        },
        {
          id: 'q2',
          prompt: 'Second question?',
          choices: [
            { stableId: 'bad-choice', label: 'Bad Choice', isCorrect: false },
            { stableId: 'right-choice', label: 'Right Choice', isCorrect: true },
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
            { stableId: 'correct-answer', label: 'Updated Correct Answer', isCorrect: true },
            { stableId: 'wrong-answer', label: 'Wrong Answer', isCorrect: false },
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
