import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChannelPredictionChallenge } from './ChannelPredictionChallenge.tsx';

const correctAnswers = [
  { channel: 'B', mix: '#FFFF00' },
  { channel: 'G', mix: '#00FFFF' },
  { channel: 'R', mix: '#FF00FF' },
  { channel: 'B', mix: '#FFFFFF' },
];

function answerRound(index: number, channel: string, mix: string) {
  const round = screen.getByRole('heading', { name: `Round ${index + 1}` }).closest('section');
  if (!round) throw new Error(`Round ${index + 1} was not rendered`);

  fireEvent.click(within(round).getByRole('button', { name: channel }));
  fireEvent.click(within(round).getByRole('button', { name: mix }));
}

function answerAllCorrect() {
  correctAnswers.forEach((answer, index) => answerRound(index, answer.channel, answer.mix));
}

function answerFiveCorrect() {
  answerRound(0, 'B', '#FFFF00');
  answerRound(1, 'G', '#00FFFF');
  answerRound(2, 'R', '#00FF00');
  answerRound(3, 'R', '#0000FF');
}

function answerSixCorrect() {
  answerRound(0, 'B', '#FFFF00');
  answerRound(1, 'G', '#00FFFF');
  answerRound(2, 'R', '#FF00FF');
  answerRound(3, 'R', '#0000FF');
}

beforeEach(() => sessionStorage.clear());
afterEach(() => cleanup());

describe('ChannelPredictionChallenge', () => {
  it('requires both answers in all four rounds before checking', () => {
    render(<ChannelPredictionChallenge onComplete={vi.fn()} />);
    const checkButton = screen.getByRole('button', { name: 'check answers' });

    expect(screen.getAllByRole('group')).toHaveLength(8);
    expect(checkButton).toBeDisabled();

    correctAnswers.slice(0, 3).forEach((answer, index) => {
      answerRound(index, answer.channel, answer.mix);
    });
    const fourthRound = screen.getByRole('heading', { name: 'Round 4' }).closest('section');
    if (!fourthRound) throw new Error('Round 4 was not rendered');
    fireEvent.click(within(fourthRound).getByRole('button', { name: 'B' }));

    expect(screen.getByText('7 / 8 answered')).toBeInTheDocument();
    expect(checkButton).toBeDisabled();

    fireEvent.click(within(fourthRound).getByRole('button', { name: '#FFFFFF' }));
    expect(checkButton).toBeEnabled();
  });

  it('supports keyboard operation and exposes each selected button state', async () => {
    const user = userEvent.setup();
    render(<ChannelPredictionChallenge onComplete={vi.fn()} />);

    await user.tab();
    const redButton = screen.getAllByRole('button', { name: 'R' })[0];
    expect(redButton).toHaveFocus();
    await user.keyboard(' ');
    expect(redButton).toHaveAttribute('aria-pressed', 'true');

    await user.tab();
    expect(screen.getAllByRole('button', { name: 'G' })[0]).toHaveFocus();
  });

  it('reports a five-point failure without completing the challenge', () => {
    const onComplete = vi.fn();
    render(<ChannelPredictionChallenge onComplete={onComplete} />);
    answerFiveCorrect();

    fireEvent.click(screen.getByRole('button', { name: 'check answers' }));

    expect(screen.getByRole('status')).toHaveTextContent('5 of 8 correct');
    expect(screen.getByRole('status')).toHaveTextContent('at least 6 correct');
    expect(screen.getByRole('button', { name: 'try again' })).toBeEnabled();
    expect(onComplete).not.toHaveBeenCalled();
  });

  it('clears all eight answers and returns focus to the first choice after a failed attempt', async () => {
    render(<ChannelPredictionChallenge onComplete={vi.fn()} />);
    answerFiveCorrect();
    fireEvent.click(screen.getByRole('button', { name: 'check answers' }));
    fireEvent.click(screen.getByRole('button', { name: 'try again' }));

    expect(screen.getByText('0 / 8 answered')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'check answers' })).toBeDisabled();
    for (const answer of screen.getAllByRole('button').filter((button) => button.hasAttribute('aria-pressed'))) {
      expect(answer).toHaveAttribute('aria-pressed', 'false');
      expect(answer).toBeEnabled();
    }
    await waitFor(() => expect(screen.getAllByRole('button', { name: 'R' })[0]).toHaveFocus());
  });

  it('completes only after at least six correct answers are checked', () => {
    const onComplete = vi.fn();
    render(<ChannelPredictionChallenge onComplete={onComplete} />);
    answerSixCorrect();

    expect(onComplete).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: 'check answers' }));
    expect(screen.getByRole('status')).toHaveTextContent('6 of 8 correct');
    expect(onComplete).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: 'finish challenge' }));
    expect(onComplete).toHaveBeenCalledOnce();
  });

  it('scores every dominant-channel and additive-mix answer', () => {
    render(<ChannelPredictionChallenge onComplete={vi.fn()} />);
    answerAllCorrect();
    fireEvent.click(screen.getByRole('button', { name: 'check answers' }));

    expect(screen.getByRole('status')).toHaveTextContent('8 of 8 correct');
    for (let round = 1; round <= 4; round += 1) {
      expect(screen.getByText(`2 of 2 correct in round ${round}.`)).toBeInTheDocument();
    }
  });

  it('restores all answers and submitted feedback after a reload', async () => {
    const first = render(
      <ChannelPredictionChallenge onComplete={vi.fn()} sessionKey="milestone-2:1" />,
    );
    answerSixCorrect();
    fireEvent.click(screen.getByRole('button', { name: 'check answers' }));

    await waitFor(() => expect(sessionStorage.length).toBe(1));
    first.unmount();
    render(<ChannelPredictionChallenge onComplete={vi.fn()} sessionKey="milestone-2:1" />);

    expect(screen.getByRole('status')).toHaveTextContent('6 of 8 correct');
    expect(screen.getByRole('button', { name: 'finish challenge' })).toBeEnabled();
    expect(screen.getAllByRole('button', { name: 'B' })[0]).toHaveAttribute('aria-pressed', 'true');
    for (const answer of screen.getAllByRole('button').filter((button) => button.hasAttribute('aria-pressed'))) {
      expect(answer).toBeDisabled();
    }
  });
});
