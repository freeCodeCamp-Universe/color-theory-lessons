import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ReadInterfaceChallenge } from './ReadInterfaceChallenge.tsx';

const correctAnswers = [
  'focal',
  'low-contrast',
  'competing-accent',
  'readable-text',
  'section-separator',
];

function answerChallenge(answers: string[]) {
  const selects = screen.getAllByRole('combobox');
  answers.forEach((answer, index) => fireEvent.change(selects[index], { target: { value: answer } }));
}

beforeEach(() => sessionStorage.clear());
afterEach(() => cleanup());

describe('ReadInterfaceChallenge', () => {
  it('requires all five classifications before checking the answers', () => {
    render(<ReadInterfaceChallenge onComplete={vi.fn()} />);
    const checkButton = screen.getByRole('button', { name: 'check answers' });

    expect(checkButton).toBeDisabled();
    answerChallenge(correctAnswers.slice(0, 4));
    expect(checkButton).toBeDisabled();

    fireEvent.change(screen.getAllByRole('combobox')[4], { target: { value: correctAnswers[4] } });
    expect(checkButton).toBeEnabled();
  });

  it('places the native classification controls in keyboard order', async () => {
    const user = userEvent.setup();
    render(<ReadInterfaceChallenge onComplete={vi.fn()} />);

    await user.tab();
    expect(screen.getByRole('combobox', { name: 'Green “Try it free” button' })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole('combobox', { name: 'Navigation links on blue header' })).toHaveFocus();
  });

  it('reports a failed attempt without completing the challenge', () => {
    const onComplete = vi.fn();
    render(<ReadInterfaceChallenge onComplete={onComplete} />);
    answerChallenge([...correctAnswers.slice(0, 3), 'focal', 'focal']);

    fireEvent.click(screen.getByRole('button', { name: 'check answers' }));

    expect(screen.getByRole('status')).toHaveTextContent('3 of 5 correct');
    expect(screen.getByRole('button', { name: 'try again' })).toBeEnabled();
    expect(onComplete).not.toHaveBeenCalled();
  });

  it('clears every classification on retry', () => {
    render(<ReadInterfaceChallenge onComplete={vi.fn()} />);
    answerChallenge([...correctAnswers.slice(0, 3), 'focal', 'focal']);
    fireEvent.click(screen.getByRole('button', { name: 'check answers' }));
    fireEvent.click(screen.getByRole('button', { name: 'try again' }));

    for (const select of screen.getAllByRole('combobox')) expect(select).toHaveValue('');
    expect(screen.getByText('0 / 5 answered')).toBeInTheDocument();
  });

  it('completes only after at least four correct answers', () => {
    const onComplete = vi.fn();
    render(<ReadInterfaceChallenge onComplete={onComplete} />);
    answerChallenge([...correctAnswers.slice(0, 4), 'focal']);

    fireEvent.click(screen.getByRole('button', { name: 'check answers' }));
    expect(screen.getByRole('status')).toHaveTextContent('4 of 5 correct');
    expect(onComplete).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: 'finish challenge' }));
    expect(onComplete).toHaveBeenCalledOnce();
  });

  it('restores classifications and submitted feedback after a reload', async () => {
    const first = render(
      <ReadInterfaceChallenge onComplete={vi.fn()} sessionKey="milestone-1:1" />,
    );
    answerChallenge([...correctAnswers.slice(0, 4), 'focal']);
    fireEvent.click(screen.getByRole('button', { name: 'check answers' }));

    await waitFor(() => expect(sessionStorage.length).toBe(1));
    first.unmount();
    render(<ReadInterfaceChallenge onComplete={vi.fn()} sessionKey="milestone-1:1" />);

    expect(screen.getByRole('status')).toHaveTextContent('4 of 5 correct');
    expect(screen.getByRole('button', { name: 'finish challenge' })).toBeEnabled();
    expect(screen.getAllByRole('combobox')[0]).toHaveValue('focal');
  });
});
