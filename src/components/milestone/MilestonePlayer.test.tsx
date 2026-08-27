import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { MilestonePlayer } from './MilestonePlayer.tsx';
import { AppProvider } from '../../state/app-provider.tsx';
import { useAppState } from '../../state/app-context.tsx';
import { getMilestoneById } from '../../data/milestones.ts';
import { ErrorBoundary } from '../ErrorBoundary.tsx';
import type { MilestoneConfig } from '../../types/milestone.ts';

vi.mock('./ChallengeRenderer.tsx', () => ({
  ChallengeRenderer: ({ onComplete }: { onComplete: () => void }) => (
    <button onClick={onComplete}>complete test challenge</button>
  ),
}));
vi.mock('./InterfaceMockup.tsx', () => ({ InterfaceMockup: () => null }));

function StateReader() {
  const state = useAppState();
  return (
    <div data-testid="completed-milestones">{state.completedMilestones.join(',')}</div>
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

function renderMilestone(milestone: MilestoneConfig) {
  return render(
    <MemoryRouter>
      <AppProvider>
        <ErrorBoundary>
          <MilestonePlayer milestone={milestone} />
        </ErrorBoundary>
        <StateReader />
      </AppProvider>
    </MemoryRouter>,
  );
}

const singleQuestionMilestone: MilestoneConfig = {
  id: 'test-milestone',
  unitId: 'unit-99',
  title: 'Test Milestone',
  description: '',
  estimatedMinutes: 5,
  passThreshold: 1,
  parts: [
    {
      kind: 'quiz',
      id: 'part-1',
      title: 'Core Concepts',
      description: 'Check your knowledge',
      questions: [
        {
          id: 'mq1',
          prompt: 'What color is the sky?',
          choices: [
            { id: 'a', label: 'Blue', isCorrect: true },
            { id: 'b', label: 'Red', isCorrect: false },
          ],
        },
      ],
    },
  ],
};

const twoPartMilestone: MilestoneConfig = {
  id: 'two-part-milestone',
  unitId: 'unit-99',
  title: 'Two-Part Milestone',
  description: '',
  estimatedMinutes: 10,
  passThreshold: 2,
  parts: [
    {
      kind: 'quiz',
      id: 'part-1',
      title: 'Part One',
      description: '',
      questions: [
        {
          id: 'p1q1',
          prompt: 'Question one?',
          choices: [
            { id: 'a', label: 'Yes', isCorrect: true },
            { id: 'b', label: 'No', isCorrect: false },
          ],
        },
      ],
    },
    {
      kind: 'quiz',
      id: 'part-2',
      title: 'Part Two',
      description: '',
      questions: [
        {
          id: 'p2q1',
          prompt: 'Question two?',
          choices: [
            { id: 'a', label: 'Maybe', isCorrect: true },
            { id: 'b', label: 'Never', isCorrect: false },
          ],
        },
      ],
    },
  ],
};

const scoredMilestone: MilestoneConfig = {
  id: 'milestone-1',
  unitId: 'unit-1',
  title: 'Scored Milestone',
  description: 'Test the complete scored flow.',
  estimatedMinutes: 10,
  passThreshold: 4,
  parts: [
    {
      kind: 'challenge',
      id: 'challenge-1',
      title: 'Challenge',
      description: 'Complete the challenge.',
      challengeType: 'read-interface',
      briefing: 'Complete the test challenge.',
      successMessage: 'Challenge complete.',
      pointValue: 3,
    },
    {
      kind: 'quiz',
      id: 'quiz-1',
      title: 'Quiz',
      description: 'Answer three questions.',
      questions: [1, 2, 3].map((number) => ({
        id: `question-${number}`,
        prompt: `Question ${number}?`,
        choices: [
          { id: 'a', label: `Correct ${number}`, isCorrect: true, explanation: 'Correct explanation.' },
          { id: 'b', label: `Wrong ${number}`, isCorrect: false, explanation: 'Wrong explanation.' },
        ],
      })),
    },
  ],
};

function completeChallengePart() {
  fireEvent.click(screen.getByRole('button', { name: 'complete test challenge' }));
  fireEvent.click(screen.getByRole('button', { name: 'next part →' }));
}

function completeQuiz(correctAnswers: number) {
  for (let index = 1; index <= 3; index += 1) {
    const label = index <= correctAnswers ? `Correct ${index}` : `Wrong ${index}`;
    fireEvent.click(screen.getByRole('radio', { name: new RegExp(label) }));
    fireEvent.click(screen.getByRole('button', { name: 'check' }));
    fireEvent.click(screen.getByRole('button', {
      name: index < 3 ? 'next →' : 'finish milestone →',
    }));
  }
}

describe('MilestonePlayer', () => {
  describe('session storage failures', () => {
    const sessionKey = 'color-theory-course-milestone-session:test-milestone';

    it('starts a new milestone when the saved session is malformed', () => {
      sessionStorage.setItem(sessionKey, '{not valid json');

      renderMilestone(singleQuestionMilestone);

      expect(screen.getByRole('group', { name: 'What color is the sky?' })).toBeInTheDocument();
      expect(screen.queryByText('something went wrong.')).not.toBeInTheDocument();
      fireEvent.click(screen.getByRole('radio', { name: /Blue/i }));
      expect(screen.getByRole('button', { name: 'check' })).toBeEnabled();
    });

    it('starts and continues a milestone when reading the session throws', () => {
      const originalGetItem = Storage.prototype.getItem;
      const getItem = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(function (this: Storage, key) {
        if (key === sessionKey) throw new Error('session storage is unavailable');
        return originalGetItem.call(this, key);
      });

      renderMilestone(singleQuestionMilestone);

      expect(getItem).toHaveBeenCalledWith(sessionKey);
      expect(screen.queryByText('something went wrong.')).not.toBeInTheDocument();
      fireEvent.click(screen.getByRole('radio', { name: /Blue/i }));
      expect(screen.getByRole('button', { name: 'check' })).toBeEnabled();
    });

    it('continues a milestone when writing the session throws', async () => {
      const originalSetItem = Storage.prototype.setItem;
      const setItem = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(function (this: Storage, key, value) {
        if (key === sessionKey) throw new Error('session storage is unavailable');
        return originalSetItem.call(this, key, value);
      });

      renderMilestone(singleQuestionMilestone);

      await waitFor(() => expect(setItem).toHaveBeenCalledWith(sessionKey, expect.any(String)));
      fireEvent.click(screen.getByRole('radio', { name: /Blue/i }));
      fireEvent.click(screen.getByRole('button', { name: 'check' }));
      expect(screen.getByRole('button', { name: 'finish milestone →' })).toBeInTheDocument();
      expect(screen.queryByText('something went wrong.')).not.toBeInTheDocument();
    });
  });

  describe('accessible radio roles', () => {
    it('renders choices as radio inputs', () => {
      renderMilestone(singleQuestionMilestone);
      expect(screen.getAllByRole('radio')).toHaveLength(2);
    });

    it('renders choices inside a radio group (fieldset/group role)', () => {
      renderMilestone(singleQuestionMilestone);
      expect(screen.getByRole('group')).toBeInTheDocument();
    });

    it('radio inputs are unchecked by default', () => {
      renderMilestone(singleQuestionMilestone);
      screen.getAllByRole('radio').forEach((r) => {
        expect(r).not.toBeChecked();
      });
    });

    it('selecting a choice checks that radio and unchecks others', () => {
      renderMilestone(singleQuestionMilestone);
      const [blueRadio, redRadio] = screen.getAllByRole('radio');

      fireEvent.click(blueRadio);
      expect(blueRadio).toBeChecked();
      expect(redRadio).not.toBeChecked();

      fireEvent.click(redRadio);
      expect(redRadio).toBeChecked();
      expect(blueRadio).not.toBeChecked();
    });

    it('supports native radio focus and keyboard selection', async () => {
      const user = userEvent.setup();
      renderMilestone(singleQuestionMilestone);
      const [blueRadio, redRadio] = screen.getAllByRole('radio');

      await user.tab();
      expect(blueRadio).toHaveFocus();

      await user.keyboard(' ');
      expect(blueRadio).toBeChecked();

      await user.keyboard('{ArrowDown}');
      expect(redRadio).toHaveFocus();
      expect(redRadio).toBeChecked();
      expect(blueRadio).not.toBeChecked();
    });

    it('radio inputs are disabled after submission', async () => {
      renderMilestone(singleQuestionMilestone);
      const [blueRadio] = screen.getAllByRole('radio');

      fireEvent.click(blueRadio);
      fireEvent.click(screen.getByRole('button', { name: 'check' }));

      await waitFor(() => {
        screen.getAllByRole('radio').forEach((r) => {
          expect(r).toBeDisabled();
        });
      });
    });

    it('selected radio remains checked after submission', async () => {
      renderMilestone(singleQuestionMilestone);
      const [blueRadio] = screen.getAllByRole('radio');

      fireEvent.click(blueRadio);
      fireEvent.click(screen.getByRole('button', { name: 'check' }));

      await waitFor(() => {
        expect(blueRadio).toBeChecked();
      });
    });
  });

  describe('COMPLETE_MILESTONE dispatch', () => {
    it('dispatches COMPLETE_MILESTONE after completing the only quiz part', async () => {
      renderMilestone(singleQuestionMilestone);

      fireEvent.click(screen.getByRole('radio', { name: /Blue/i }));
      fireEvent.click(screen.getByRole('button', { name: 'check' }));
      await waitFor(() => screen.getByRole('button', { name: 'finish milestone →' }));
      fireEvent.click(screen.getByRole('button', { name: 'finish milestone →' }));

      await waitFor(() => {
        expect(screen.getByTestId('completed-milestones').textContent).toContain('test-milestone');
      });
    });

    it('dispatches with the correct milestone id', async () => {
      renderMilestone({ ...singleQuestionMilestone, id: 'milestone-specific-id' });

      fireEvent.click(screen.getByRole('radio', { name: /Blue/i }));
      fireEvent.click(screen.getByRole('button', { name: 'check' }));
      fireEvent.click(await screen.findByRole('button', { name: 'finish milestone →' }));

      await waitFor(() => {
        expect(screen.getByTestId('completed-milestones').textContent).toContain('milestone-specific-id');
      });
    });

    it('dispatches only once even if milestone is retried', async () => {
      renderMilestone(singleQuestionMilestone);

      // Complete the milestone
      fireEvent.click(screen.getByRole('radio', { name: /Blue/i }));
      fireEvent.click(screen.getByRole('button', { name: 'check' }));
      fireEvent.click(await screen.findByRole('button', { name: 'finish milestone →' }));
      await waitFor(() => screen.getByRole('button', { name: 'retry milestone' }));

      // Retry and complete again
      fireEvent.click(screen.getByRole('button', { name: 'retry milestone' }));
      fireEvent.click(await screen.findByRole('radio', { name: /Blue/i }));
      fireEvent.click(screen.getByRole('button', { name: 'check' }));
      fireEvent.click(await screen.findByRole('button', { name: 'finish milestone →' }));

      await waitFor(() => {
        // Reducer is idempotent — still only one entry
        const text = screen.getByTestId('completed-milestones').textContent ?? '';
        const count = text.split(',').filter((s) => s === 'test-milestone').length;
        expect(count).toBe(1);
      });
    });
  });

  describe('multi-part milestone', () => {
    it('dispatches COMPLETE_MILESTONE only after the final part', async () => {
      renderMilestone(twoPartMilestone);

      // Part 1
      fireEvent.click(screen.getByRole('radio', { name: /Yes/i }));
      fireEvent.click(screen.getByRole('button', { name: 'check' }));
      fireEvent.click(await screen.findByRole('button', { name: 'finish part →' }));

      // Confirm milestone not yet dispatched at part-summary
      await waitFor(() => screen.getByRole('button', { name: 'next part →' }));
      expect(screen.getByTestId('completed-milestones').textContent).toBe('');

      // Advance to part 2
      fireEvent.click(screen.getByRole('button', { name: 'next part →' }));

      // Part 2
      fireEvent.click(await screen.findByRole('radio', { name: /Maybe/i }));
      fireEvent.click(screen.getByRole('button', { name: 'check' }));
      fireEvent.click(await screen.findByRole('button', { name: 'finish milestone →' }));

      await waitFor(() => {
        expect(screen.getByTestId('completed-milestones').textContent).toContain('two-part-milestone');
      });
    });
  });

  describe('scoring and unlock behavior', () => {
    it.each([
      { correctAnswers: 0, score: 3, passed: false },
      { correctAnswers: 1, score: 4, passed: true },
      { correctAnswers: 2, score: 5, passed: true },
    ])('handles a score of $score at the pass boundary', async ({ correctAnswers, score, passed }) => {
      renderMilestone(scoredMilestone);
      completeChallengePart();
      completeQuiz(correctAnswers);

      expect(screen.getByText(`${score} of 6 points.`, { exact: false })).toBeInTheDocument();
      expect(screen.getByText(passed ? 'milestone passed' : 'milestone not passed')).toBeInTheDocument();
      expect(screen.queryByRole('link', { name: 'continue to Unit 2 →' })).toBe(
        passed ? screen.getByRole('link', { name: 'continue to Unit 2 →' }) : null
      );

      await waitFor(() => {
        const completed = screen.getByTestId('completed-milestones').textContent ?? '';
        expect(completed.includes('milestone-1')).toBe(passed);
      });
    });

    it('shows the configured description, time, part progress, and score', () => {
      renderMilestone(scoredMilestone);

      expect(screen.getByText('Test the complete scored flow.')).toBeInTheDocument();
      expect(screen.getByText('About 10 minutes')).toBeInTheDocument();
      expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '1');

      fireEvent.click(screen.getByRole('button', { name: 'complete test challenge' }));
      expect(screen.getByText('3 of 3 points earned')).toBeInTheDocument();
      expect(screen.getByTestId('completed-milestones')).toHaveTextContent('');
    });

    it('unlocks Unit 3 after passing the configured Milestone 2 flow', async () => {
      const milestone = getMilestoneById('milestone-2');
      if (!milestone) throw new Error('Milestone 2 configuration was not found');
      renderMilestone(milestone);
      completeChallengePart();

      for (let index = 0; index < 3; index += 1) {
        const choices = screen.getAllByRole('radio');
        fireEvent.click(choices[index === 0 ? 0 : 1]);
        fireEvent.click(screen.getByRole('button', { name: 'check' }));
        fireEvent.click(screen.getByRole('button', {
          name: index < 2 ? 'next →' : 'finish milestone →',
        }));
      }

      expect(screen.getByText('4 of 6 points.', { exact: false })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'continue to Unit 3 →' })).toHaveAttribute(
        'href',
        '/lesson/u3-l1',
      );
      await waitFor(() => {
        expect(screen.getByTestId('completed-milestones')).toHaveTextContent('milestone-2');
      });
    });

    it.each([
      { correctAnswers: 0, score: 4, passed: false },
      { correctAnswers: 1, score: 5, passed: true },
      { correctAnswers: 2, score: 6, passed: true },
    ])('handles Milestone 3 score $score at its pass boundary', async ({ correctAnswers, score, passed }) => {
      const milestone = getMilestoneById('milestone-3');
      if (!milestone) throw new Error('Milestone 3 configuration was not found');
      renderMilestone(milestone);

      fireEvent.click(screen.getByRole('button', { name: 'complete test challenge' }));
      expect(screen.getByText('4 of 4 points earned')).toBeInTheDocument();
      expect(screen.getByText('Your theme passed the text readability, surface separation, and accent visibility stages.')).toBeInTheDocument();
      fireEvent.click(screen.getByRole('button', { name: 'next part →' }));

      for (let index = 0; index < 3; index += 1) {
        const choices = screen.getAllByRole('radio');
        fireEvent.click(choices[index < correctAnswers ? 0 : 1]);
        fireEvent.click(screen.getByRole('button', { name: 'check' }));
        fireEvent.click(screen.getByRole('button', {
          name: index < 2 ? 'next →' : 'finish milestone →',
        }));
      }

      expect(screen.getByText(`${score} of 7 points.`, { exact: false })).toBeInTheDocument();
      expect(screen.getByText(passed ? 'milestone passed' : 'milestone not passed')).toBeInTheDocument();
      expect(screen.queryByRole('link', { name: 'continue to Unit 4 →' })).toBe(
        passed ? screen.getByRole('link', { name: 'continue to Unit 4 →' }) : null,
      );
      if (passed) {
        expect(screen.getByRole('link', { name: 'continue to Unit 4 →' })).toHaveAttribute(
          'href',
          '/lesson/u4-l1',
        );
      }

      await waitFor(() => {
        const completed = screen.getByTestId('completed-milestones').textContent ?? '';
        expect(completed.includes('milestone-3')).toBe(passed);
      });
    });

    it.each([
      { correctAnswers: 0, score: 4, passed: false },
      { correctAnswers: 1, score: 5, passed: true },
      { correctAnswers: 2, score: 6, passed: true },
    ])('handles Milestone 4 score $score at its pass boundary', async ({ correctAnswers, score, passed }) => {
      const milestone = getMilestoneById('milestone-4');
      if (!milestone) throw new Error('Milestone 4 configuration was not found');
      renderMilestone(milestone);

      fireEvent.click(screen.getByRole('button', { name: 'complete test challenge' }));
      expect(screen.getByText('4 of 4 points earned')).toBeInTheDocument();
      expect(screen.getByText('You identified all three color-only designs and chose a valid non-color repair for each one.')).toBeInTheDocument();
      fireEvent.click(screen.getByRole('button', { name: 'next part →' }));

      for (let index = 0; index < 3; index += 1) {
        const choices = screen.getAllByRole('radio');
        fireEvent.click(choices[index < correctAnswers ? 0 : 1]);
        fireEvent.click(screen.getByRole('button', { name: 'check' }));
        fireEvent.click(screen.getByRole('button', {
          name: index < 2 ? 'next →' : 'finish milestone →',
        }));
      }

      expect(screen.getByText(`${score} of 7 points.`, { exact: false })).toBeInTheDocument();
      expect(screen.getByText(passed ? 'milestone passed' : 'milestone not passed')).toBeInTheDocument();
      expect(screen.queryByRole('link', { name: 'continue to Unit 5 →' })).toBe(
        passed ? screen.getByRole('link', { name: 'continue to Unit 5 →' }) : null,
      );
      if (passed) {
        expect(screen.getByRole('link', { name: 'continue to Unit 5 →' })).toHaveAttribute(
          'href',
          '/lesson/u5-l1',
        );
      }

      await waitFor(() => {
        const completed = screen.getByTestId('completed-milestones').textContent ?? '';
        expect(completed.includes('milestone-4')).toBe(passed);
      });
    });

    it.each([
      { correctAnswers: 1, score: 5, passed: false },
      { correctAnswers: 2, score: 6, passed: true },
      { correctAnswers: 3, score: 7, passed: true },
    ])('handles Milestone 5 score $score at its pass boundary', async ({ correctAnswers, score, passed }) => {
      const milestone = getMilestoneById('milestone-5');
      if (!milestone) throw new Error('Milestone 5 configuration was not found');
      renderMilestone(milestone);

      fireEvent.click(screen.getByRole('button', { name: 'complete test challenge' }));
      expect(screen.getByText('4 of 4 points earned')).toBeInTheDocument();
      expect(screen.getByText('You passed all four repair stages: body text, required-field cue, focus indicator, and icon contrast.')).toBeInTheDocument();
      fireEvent.click(screen.getByRole('button', { name: 'next part →' }));

      for (let index = 0; index < 4; index += 1) {
        const choices = screen.getAllByRole('radio');
        fireEvent.click(choices[index < correctAnswers ? 0 : 1]);
        fireEvent.click(screen.getByRole('button', { name: 'check' }));
        fireEvent.click(screen.getByRole('button', {
          name: index < 3 ? 'next →' : 'finish milestone →',
        }));
      }

      expect(screen.getByText(`${score} of 8 points.`, { exact: false })).toBeInTheDocument();
      expect(screen.getByText(passed ? 'milestone passed' : 'milestone not passed')).toBeInTheDocument();
      expect(screen.queryByRole('link', { name: 'continue to Unit 6 →' })).toBe(
        passed ? screen.getByRole('link', { name: 'continue to Unit 6 →' }) : null,
      );
      if (passed) {
        expect(screen.getByRole('link', { name: 'continue to Unit 6 →' })).toHaveAttribute(
          'href',
          '/lesson/u6-l1',
        );
      }

      await waitFor(() => {
        const completed = screen.getByTestId('completed-milestones').textContent ?? '';
        expect(completed.includes('milestone-5')).toBe(passed);
      });
    });

    it('moves focus when the learner advances to a new phase or question', () => {
      renderMilestone(scoredMilestone);
      fireEvent.click(screen.getByRole('button', { name: 'complete test challenge' }));

      expect(document.activeElement).toHaveTextContent('Part 1 complete');
      fireEvent.click(screen.getByRole('button', { name: 'next part →' }));
      expect(document.activeElement).toHaveTextContent('Question 1?');

      fireEvent.click(screen.getByRole('radio', { name: /Correct 1/ }));
      fireEvent.click(screen.getByRole('button', { name: 'check' }));
      fireEvent.click(screen.getByRole('button', { name: 'next →' }));
      expect(document.activeElement).toHaveTextContent('Question 2?');
    });

    it.each([
      { choice: 'Blue', result: 'milestone passed' },
      { choice: 'Red', result: 'milestone not passed' },
    ])('moves focus to the final $result result', ({ choice, result }) => {
      renderMilestone(singleQuestionMilestone);

      fireEvent.click(screen.getByRole('radio', { name: new RegExp(choice) }));
      fireEvent.click(screen.getByRole('button', { name: 'check' }));
      fireEvent.click(screen.getByRole('button', { name: 'finish milestone →' }));

      expect(document.activeElement).toHaveTextContent(result);
      expect(document.activeElement).toHaveTextContent(/\d of 1 points/);
    });

    it('returns to a clean first part after retrying', () => {
      renderMilestone(scoredMilestone);
      completeChallengePart();
      completeQuiz(0);
      fireEvent.click(screen.getByRole('button', { name: 'retry milestone' }));

      expect(screen.getByText('Part 1 of 2: Challenge')).toBeInTheDocument();
      expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '1');
      expect(screen.queryByText(/of 6 points/)).not.toBeInTheDocument();
      expect(screen.getByTestId('completed-milestones')).toHaveTextContent('');

      completeChallengePart();
      expect(screen.getByRole('group', { name: 'Question 1?' })).toBeInTheDocument();
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
      for (const choice of screen.getAllByRole('radio', { name: /Correct 1|Wrong 1/ })) {
        expect(choice).not.toBeChecked();
      }
    });
  });

  describe('reload behavior', () => {
    it('resumes an unfinished attempt with its selected answer', async () => {
      const first = renderMilestone(scoredMilestone);
      completeChallengePart();
      fireEvent.click(screen.getByRole('radio', { name: /Correct 1/ }));

      await waitFor(() => expect(sessionStorage.length).toBeGreaterThan(0));
      first.unmount();
      renderMilestone(scoredMilestone);

      expect(screen.getByRole('group', { name: 'Question 1?' })).toBeInTheDocument();
      expect(screen.getByRole('radio', { name: /Correct 1/ })).toBeChecked();
      expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '2');
    });

    it('restores failed results without unlocking the next unit', async () => {
      const first = renderMilestone(scoredMilestone);
      completeChallengePart();
      completeQuiz(0);
      await waitFor(() => expect(sessionStorage.length).toBeGreaterThan(0));

      first.unmount();
      renderMilestone(scoredMilestone);

      expect(screen.getByText('milestone not passed')).toBeInTheDocument();
      expect(screen.queryByRole('link', { name: 'continue to Unit 2 →' })).not.toBeInTheDocument();
      expect(screen.getByTestId('completed-milestones')).toHaveTextContent('');
    });

    it('restores passed results and persisted completion', async () => {
      const first = renderMilestone(scoredMilestone);
      completeChallengePart();
      completeQuiz(1);
      await waitFor(() => expect(screen.getByTestId('completed-milestones')).toHaveTextContent('milestone-1'));
      await waitFor(() => expect(localStorage.getItem('color-theory-course-state')).toContain('milestone-1'));

      first.unmount();
      renderMilestone(scoredMilestone);

      expect(screen.getByText('milestone passed')).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'continue to Unit 2 →' })).toHaveAttribute('href', '/lesson/u2-l1');
      expect(screen.getByTestId('completed-milestones')).toHaveTextContent('milestone-1');
    });
  });
});
