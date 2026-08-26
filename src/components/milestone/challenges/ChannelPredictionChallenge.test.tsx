import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CHANNEL_PREDICTION_SESSION_PREFIX } from '../../../state/persistence.ts';
import { ChannelPredictionChallenge } from './ChannelPredictionChallenge.tsx';

const CHANNELS = ['B', 'G', 'R', 'B'];
const MIXES = ['#FFFF00', '#00FFFF', '#FF00FF', '#FFFFFF'];

function answerCurrentStage(answers: string[]) {
  answers.forEach((answer, index) => {
    const round = screen.getByRole('heading', { name: `Round ${index + 1}` }).closest('section');
    if (!round) throw new Error(`Round ${index + 1} was not rendered`);
    fireEvent.click(within(round).getByRole('button', { name: answer }));
  });
}

function passChannelStage() {
  answerCurrentStage(CHANNELS);
  fireEvent.click(screen.getByRole('button', { name: 'check channels' }));
  fireEvent.click(screen.getByRole('button', { name: 'continue to additive mixes' }));
}

beforeEach(() => sessionStorage.clear());
afterEach(() => cleanup());

describe('ChannelPredictionChallenge', () => {
  it('requires a separate pass for dominant channels before showing additive mixes', async () => {
    const onComplete = vi.fn();
    render(<ChannelPredictionChallenge onComplete={onComplete} />);

    expect(screen.getByText('Stage 1 of 2')).toBeInTheDocument();
    expect(screen.queryByText(/What does/)).not.toBeInTheDocument();
    answerCurrentStage(['B', 'G', 'G', 'R']);
    fireEvent.click(screen.getByRole('button', { name: 'check channels' }));
    expect(screen.getByRole('status')).toHaveTextContent('2 of 4 correct');

    fireEvent.click(screen.getByRole('button', { name: 'try stage again' }));
    await waitFor(() => expect(screen.getByRole('heading', { name: 'Predict dominant channels' })).toHaveFocus());
    ['B', 'G', 'G', 'R'].forEach((answer, index) => {
      const round = screen.getByRole('heading', { name: `Round ${index + 1}` }).closest('section');
      if (!round) throw new Error(`Round ${index + 1} was not rendered`);
      expect(within(round).getByRole('button', { name: answer })).toHaveAttribute('aria-pressed', 'true');
    });
    expect(screen.getByText('4 / 4 answered')).toBeInTheDocument();
    answerCurrentStage(CHANNELS);
    fireEvent.click(screen.getByRole('button', { name: 'check channels' }));
    fireEvent.click(screen.getByRole('button', { name: 'continue to additive mixes' }));

    expect(screen.getByText('Stage 2 of 2')).toBeInTheDocument();
    expect(screen.queryByText(/Which channel dominates/)).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Predict additive mixes' })).toHaveFocus();
    expect(onComplete).not.toHaveBeenCalled();
  });

  it('does not let a perfect channel stage compensate for a failed mix stage', () => {
    const onComplete = vi.fn();
    render(<ChannelPredictionChallenge onComplete={onComplete} />);
    passChannelStage();
    answerCurrentStage(['#FFFF00', '#00FFFF', '#00FF00', '#0000FF']);

    fireEvent.click(screen.getByRole('button', { name: 'check mixes' }));

    expect(screen.getByRole('status')).toHaveTextContent('2 of 4 correct');
    expect(onComplete).not.toHaveBeenCalled();
  });

  it('completes after both stages pass', () => {
    const onComplete = vi.fn();
    render(<ChannelPredictionChallenge onComplete={onComplete} />);
    passChannelStage();
    answerCurrentStage(MIXES);

    fireEvent.click(screen.getByRole('button', { name: 'check mixes' }));

    expect(screen.getByRole('status')).toHaveTextContent('Challenge complete');
    expect(onComplete).toHaveBeenCalledOnce();
  });

  it('restores the active stage and its answers after reload', async () => {
    const sessionKey = 'milestone-2:1';
    const first = render(<ChannelPredictionChallenge onComplete={vi.fn()} sessionKey={sessionKey} />);
    passChannelStage();
    answerCurrentStage([MIXES[0]]);
    await waitFor(() => expect(sessionStorage.getItem(`${CHANNEL_PREDICTION_SESSION_PREFIX}${sessionKey}`)).toContain('additive-mix'));

    first.unmount();
    render(<ChannelPredictionChallenge onComplete={vi.fn()} sessionKey={sessionKey} />);

    expect(screen.getByText('Stage 2 of 2')).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: MIXES[0] })[0]).toHaveAttribute('aria-pressed', 'true');
  });
});
