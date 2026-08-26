import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { getMilestoneById } from '../../data/milestones.ts';
import { AppProvider } from '../../state/app-provider.tsx';
import { useAppState } from '../../state/app-context.tsx';
import { MilestonePlayer } from './MilestonePlayer.tsx';

const roleAssignments = [
  ['#0b1220', 'Page background'],
  ['#1c2536', 'Surface'],
  ['#f8fafc', 'Primary text'],
  ['#cbd5e1', 'Secondary text'],
  ['#3b82f6', 'Action'],
  ['#84cc16', 'Success'],
  ['#f97316', 'Warning'],
  ['#fb7185', 'Error'],
] as const;

function StateReader() {
  const state = useAppState();
  return <div data-testid="completed-milestones">{state.completedMilestones.join(',')}</div>;
}

function renderMilestone6() {
  const milestone = getMilestoneById('milestone-6');
  if (!milestone) throw new Error('Milestone 6 configuration was not found');

  return render(
    <MemoryRouter>
      <AppProvider>
        <MilestonePlayer milestone={milestone} />
        <StateReader />
      </AppProvider>
    </MemoryRouter>,
  );
}

function completeSemanticAudit() {
  for (const [hex, role] of roleAssignments) {
    fireEvent.click(screen.getByRole('button', { name: `Select swatch ${hex}` }));
    fireEvent.click(screen.getByRole('button', { name: new RegExp(`^${role}:`) }));
  }
  fireEvent.click(screen.getByRole('button', { name: 'check roles' }));
  fireEvent.click(screen.getByRole('button', { name: 'continue to conflict identification' }));
  fireEvent.change(screen.getByRole('combobox', { name: 'Which role issue exists in this set?' }), {
    target: { value: 'warning-error-too-close' },
  });
  fireEvent.click(screen.getByRole('button', { name: 'check conflict' }));
}

function completeDarkThemeRepair() {
  if (screen.queryByRole('slider', { name: /Text lightness/ })) {
    fireEvent.change(screen.getByRole('slider', { name: /Text lightness/ }), {
      target: { value: '100' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'check contrast' }));
    fireEvent.click(screen.getByRole('button', { name: 'continue to surface hierarchy' }));
  }
  if (screen.queryByRole('slider', { name: /Surface lightness/ })) {
    fireEvent.change(screen.getByRole('slider', { name: /Surface lightness/ }), {
      target: { value: '20' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'check contrast' }));
    fireEvent.click(screen.getByRole('button', { name: 'continue to action contrast' }));
  }
  fireEvent.change(screen.getByRole('slider', { name: /Action lightness/ }), {
    target: { value: '70' },
  });
  fireEvent.click(screen.getByRole('button', { name: 'check contrast' }));
}

function completeBothChallenges() {
  completeSemanticAudit();
  fireEvent.click(screen.getByRole('button', { name: 'next part →' }));
  completeDarkThemeRepair();
  fireEvent.click(screen.getByRole('button', { name: 'next part →' }));
}

function answerQuiz(correctAnswers: number) {
  for (let index = 0; index < 4; index += 1) {
    const choices = screen.getAllByRole('radio');
    fireEvent.click(choices[index < correctAnswers ? 0 : 1]);
    fireEvent.click(screen.getByRole('button', { name: 'check' }));
    fireEvent.click(screen.getByRole('button', {
      name: index < 3 ? 'next →' : 'finish milestone →',
    }));
  }
}

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
});
afterEach(() => cleanup());

describe('Milestone 6 rendered flow', () => {
  it('uses the configured order, point values, total score, and threshold', () => {
    const milestone = getMilestoneById('milestone-6');

    expect(milestone?.estimatedMinutes).toBe(20);
    expect(milestone?.passThreshold).toBe(7);
    expect(milestone?.parts.map((part) => part.id)).toEqual(['m6-c1', 'm6-c2', 'm6-qz']);
    expect(milestone?.parts.map((part) => part.kind)).toEqual(['challenge', 'challenge', 'quiz']);
    expect(milestone?.parts.filter((part) => part.kind === 'challenge').map((part) => part.pointValue)).toEqual([3, 3]);
    expect(milestone?.parts.find((part) => part.kind === 'quiz')?.questions).toHaveLength(4);
  });

  it('requires each challenge before advancing and records separate three-point summaries', () => {
    renderMilestone6();

    expect(screen.getByText('Part 1 of 3: Semantic Audit')).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '1');
    expect(screen.getByText('Stage 1 of 2')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'next part →' })).not.toBeInTheDocument();

    completeSemanticAudit();
    expect(screen.getByText('3 of 3 points earned')).toBeInTheDocument();
    expect(screen.getByText(/identified the weak luminance separation between warning and error/)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'next part →' }));
    expect(screen.getByText('Part 2 of 3: Dark Theme Repair')).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '2');
    expect(screen.getByText('Stage 1 of 3')).toBeInTheDocument();

    completeDarkThemeRepair();
    expect(screen.getByText('3 of 3 points earned')).toBeInTheDocument();
    expect(screen.getByText('The text, card surface, and action passed their three contrast stages.')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'next part →' }));
    expect(screen.getByRole('group', { name: /A product uses its success color/ })).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '3');
  });

  it.each([
    { correctAnswers: 0, score: 6, passed: false },
    { correctAnswers: 1, score: 7, passed: true },
    { correctAnswers: 2, score: 8, passed: true },
  ])('handles $score points at the Milestone 6 pass boundary', async ({ correctAnswers, score, passed }) => {
    renderMilestone6();
    completeBothChallenges();
    answerQuiz(correctAnswers);

    expect(screen.getByText(`${score} of 10 points.`, { exact: false })).toBeInTheDocument();
    expect(screen.getByText(passed ? 'milestone passed' : 'milestone not passed')).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /continue to Unit 7/ })).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: '← all units' })).toHaveAttribute('href', '/');

    await waitFor(() => {
      const completed = screen.getByTestId('completed-milestones').textContent ?? '';
      expect(completed.includes('milestone-6')).toBe(passed);
    });
  });

  it('restores the second challenge and its first challenge points after reload', async () => {
    const first = renderMilestone6();
    completeSemanticAudit();
    fireEvent.click(screen.getByRole('button', { name: 'next part →' }));
    fireEvent.change(screen.getByRole('slider', { name: /Text lightness/ }), {
      target: { value: '100' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'check contrast' }));
    fireEvent.click(screen.getByRole('button', { name: 'continue to surface hierarchy' }));
    fireEvent.change(screen.getByRole('slider', { name: /Surface lightness/ }), {
      target: { value: '20' },
    });

    await waitFor(() => expect(sessionStorage.length).toBeGreaterThanOrEqual(2));
    first.unmount();
    renderMilestone6();

    expect(screen.getByText('Part 2 of 3: Dark Theme Repair')).toBeInTheDocument();
    expect(screen.getByRole('slider', { name: /Surface lightness/ })).toHaveValue('20');

    completeDarkThemeRepair();
    fireEvent.click(screen.getByRole('button', { name: 'next part →' }));
    answerQuiz(1);
    expect(screen.getByText('7 of 10 points.', { exact: false })).toBeInTheDocument();
  });

  it('restores a completed passing result and the course destination after reload', async () => {
    const first = renderMilestone6();
    completeBothChallenges();
    answerQuiz(1);

    await waitFor(() => expect(localStorage.getItem('color-theory-course-state')).toContain('milestone-6'));
    first.unmount();
    renderMilestone6();

    expect(screen.getByText('milestone passed')).toBeInTheDocument();
    expect(screen.getByText('7 of 10 points.', { exact: false })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '← all units' })).toHaveAttribute('href', '/');
    expect(screen.getByTestId('completed-milestones')).toHaveTextContent('milestone-6');
  });

  it('clears challenge work, quiz answers, scores, and progress on retry', () => {
    renderMilestone6();
    completeBothChallenges();
    answerQuiz(0);
    fireEvent.click(screen.getByRole('button', { name: 'retry milestone' }));

    expect(screen.getByText('Part 1 of 3: Semantic Audit')).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '1');
    expect(screen.getByText('0 / 8 correct')).toBeInTheDocument();
    expect(screen.queryByRole('combobox', { name: 'Which role issue exists in this set?' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'check roles' })).toBeEnabled();
    expect(screen.queryByText(/of 10 points/)).not.toBeInTheDocument();
    expect(screen.getByTestId('completed-milestones')).toHaveTextContent('');

    completeSemanticAudit();
    fireEvent.click(screen.getByRole('button', { name: 'next part →' }));
    expect(screen.getByRole('slider', { name: /Text lightness/ })).toHaveValue('70');
    expect(screen.queryByRole('slider', { name: /Surface lightness/ })).not.toBeInTheDocument();
    expect(screen.queryByRole('slider', { name: /Action lightness/ })).not.toBeInTheDocument();
  }, 10_000);
});
