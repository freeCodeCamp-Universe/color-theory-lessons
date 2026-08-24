import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { getMilestoneById } from '../../data/milestones.ts';
import { AppProvider } from '../../state/app-provider.tsx';
import { useAppState } from '../../state/app-context.tsx';
import { MilestonePlayer } from './MilestonePlayer.tsx';

function StateReader() {
  const state = useAppState();
  return <div data-testid="completed-milestones">{state.completedMilestones.join(',')}</div>;
}

function renderMilestone5() {
  const milestone = getMilestoneById('milestone-5');
  if (!milestone) throw new Error('Milestone 5 configuration was not found');

  return render(
    <MemoryRouter>
      <AppProvider>
        <MilestonePlayer milestone={milestone} />
        <StateReader />
      </AppProvider>
    </MemoryRouter>,
  );
}

function completeAccessibilityRescue() {
  fireEvent.change(screen.getByRole('slider', { name: /Text lightness/ }), {
    target: { value: '20' },
  });
  fireEvent.click(screen.getByRole('button', { name: 'add icon and text cue' }));
  fireEvent.click(screen.getByRole('button', { name: 'add focus indicator' }));
  fireEvent.change(screen.getByRole('slider', { name: /Icon lightness/ }), {
    target: { value: '20' },
  });
  fireEvent.click(screen.getByRole('button', { name: 'finish challenge' }));
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

describe('Milestone 5 rendered flow', () => {
  it('passes at six points and unlocks the first Unit 6 lesson', async () => {
    renderMilestone5();

    expect(screen.getByText('Repair four accessibility failures, then answer four questions about accessible color.')).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '1');
    completeAccessibilityRescue();
    expect(screen.getByRole('group', { name: /At WCAG Level AA/ })).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '2');

    answerQuiz(2);

    expect(screen.getByText('6 of 8 points.', { exact: false })).toBeInTheDocument();
    expect(screen.getByText('milestone passed')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'continue to Unit 6 →' })).toHaveAttribute(
      'href',
      '/lesson/u6-l1',
    );
    await waitFor(() => {
      expect(screen.getByTestId('completed-milestones')).toHaveTextContent('milestone-5');
    });
  });

  it('does not unlock Unit 6 at five points and starts a clean retry', () => {
    renderMilestone5();
    completeAccessibilityRescue();
    answerQuiz(1);

    expect(screen.getByText('5 of 8 points.', { exact: false })).toBeInTheDocument();
    expect(screen.getByText('milestone not passed')).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'continue to Unit 6 →' })).not.toBeInTheDocument();
    expect(screen.getByTestId('completed-milestones')).toHaveTextContent('');

    fireEvent.click(screen.getByRole('button', { name: 'retry milestone' }));

    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '1');
    expect(screen.getByRole('status')).toHaveTextContent('0 of 4 fixed');
    expect(screen.getByRole('slider', { name: /Text lightness/ })).toHaveValue('55');
    expect(screen.getByRole('button', { name: 'finish challenge' })).toBeDisabled();
    expect(screen.queryByText(/of 8 points/)).not.toBeInTheDocument();
  });
});
