import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ReadInterfaceChallenge } from './ReadInterfaceChallenge.tsx';

const CORRECT_ANSWERS = ['focal', 'low-contrast', 'competing-accent', 'readable-text', 'section-separator'];

function answerClassifications(answers: string[]) {
  answers.forEach((answer, index) => {
    fireEvent.change(screen.getAllByRole('combobox')[index], { target: { value: answer } });
  });
}

beforeEach(() => sessionStorage.clear());
afterEach(() => cleanup());

describe('ReadInterfaceChallenge', () => {
  it('renders one named classification stage', () => {
    render(<ReadInterfaceChallenge onComplete={vi.fn()} />);

    expect(screen.getByText('Stage 1 of 1')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Classify interface regions' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'check classifications' })).toBeDisabled();
  });

  it('reports failure and returns focus to a cleared classification stage on retry', async () => {
    const onComplete = vi.fn();
    render(<ReadInterfaceChallenge onComplete={onComplete} />);
    answerClassifications([...CORRECT_ANSWERS.slice(0, 3), 'focal', 'focal']);

    fireEvent.click(screen.getByRole('button', { name: 'check classifications' }));
    expect(screen.getByRole('status')).toHaveTextContent('3 of 5 correct');
    expect(onComplete).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: 'try stage again' }));
    await waitFor(() => expect(screen.getByRole('heading', { name: 'Classify interface regions' })).toHaveFocus());
    for (const select of screen.getAllByRole('combobox')) expect(select).toHaveValue('');
  });

  it('completes after the single stage passes', () => {
    const onComplete = vi.fn();
    render(<ReadInterfaceChallenge onComplete={onComplete} />);
    answerClassifications([...CORRECT_ANSWERS.slice(0, 4), 'focal']);

    fireEvent.click(screen.getByRole('button', { name: 'check classifications' }));

    expect(screen.getByRole('status')).toHaveTextContent('Interface classification complete');
    expect(onComplete).toHaveBeenCalledOnce();
  });

  it('restores an in-progress classification attempt', async () => {
    const sessionKey = 'milestone-1:1';
    const first = render(<ReadInterfaceChallenge onComplete={vi.fn()} sessionKey={sessionKey} />);
    answerClassifications(CORRECT_ANSWERS.slice(0, 2));
    await waitFor(() => expect(sessionStorage.length).toBe(1));

    first.unmount();
    render(<ReadInterfaceChallenge onComplete={vi.fn()} sessionKey={sessionKey} />);

    expect(screen.getByText('Stage 1 of 1')).toBeInTheDocument();
    expect(screen.getAllByRole('combobox')[0]).toHaveValue('focal');
    expect(screen.getAllByRole('combobox')[1]).toHaveValue('low-contrast');
    expect(screen.getByText('2 / 5 answered')).toBeInTheDocument();
  });
});
