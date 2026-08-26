import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DARK_MODE_STRESS_SESSION_PREFIX } from '../../../state/persistence.ts';
import { DarkModeStressChallenge } from './DarkModeStressChallenge.tsx';

function setSlider(name: RegExp, value: number) {
  fireEvent.change(screen.getByRole('slider', { name }), { target: { value } });
}

function passTextStage() {
  setSlider(/Text lightness/, 100);
  fireEvent.click(screen.getByRole('button', { name: 'check contrast' }));
  fireEvent.click(screen.getByRole('button', { name: 'continue to surface hierarchy' }));
}

function passSurfaceStage() {
  setSlider(/Surface lightness/, 20);
  fireEvent.click(screen.getByRole('button', { name: 'check contrast' }));
  fireEvent.click(screen.getByRole('button', { name: 'continue to action contrast' }));
}

beforeEach(() => sessionStorage.clear());
afterEach(() => cleanup());

describe('DarkModeStressChallenge', () => {
  it('renders only the active contrast check', () => {
    render(<DarkModeStressChallenge onComplete={vi.fn()} />);

    expect(screen.getByText('Stage 1 of 3')).toBeInTheDocument();
    expect(screen.getByRole('slider', { name: /Text lightness/ })).toBeInTheDocument();
    expect(screen.queryByRole('slider', { name: /Surface lightness/ })).not.toBeInTheDocument();
    expect(screen.queryByRole('slider', { name: /Action lightness/ })).not.toBeInTheDocument();
  });

  it('reports failure and focuses the same contrast stage on retry', async () => {
    render(<DarkModeStressChallenge onComplete={vi.fn()} />);
    setSlider(/Text lightness/, 60);
    expect(screen.queryByText(/Not passed: Text against surface/)).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'check contrast' }));
    expect(screen.getByText(/Not passed: Text against surface/)).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('not met yet');

    fireEvent.click(screen.getByRole('button', { name: 'try stage again' }));
    await waitFor(() => expect(screen.getByRole('heading', { name: 'Repair text contrast' })).toHaveFocus());
  });

  it('does not round a failing action ratio up to its target', () => {
    render(<DarkModeStressChallenge onComplete={vi.fn()} />);
    passTextStage();
    setSlider(/Surface lightness/, 25);
    fireEvent.click(screen.getByRole('button', { name: 'check contrast' }));
    fireEvent.click(screen.getByRole('button', { name: 'continue to action contrast' }));
    setSlider(/Action lightness/, 62);
    fireEvent.click(screen.getByRole('button', { name: 'check contrast' }));

    expect(screen.getByText(/Not passed: Action against surface: 2\.9:1/)).toBeInTheDocument();
  });

  it('completes only after all three contrast stages pass', () => {
    const onComplete = vi.fn();
    render(<DarkModeStressChallenge onComplete={onComplete} />);
    passTextStage();
    passSurfaceStage();
    setSlider(/Action lightness/, 70);

    fireEvent.click(screen.getByRole('button', { name: 'check contrast' }));

    expect(screen.getByRole('status')).toHaveTextContent('All three checks are complete');
    expect(onComplete).toHaveBeenCalledOnce();
  });

  it('restores the active stage and contrast settings after reload', async () => {
    const sessionKey = 'milestone-6:1';
    const first = render(<DarkModeStressChallenge onComplete={vi.fn()} sessionKey={sessionKey} />);
    passTextStage();
    setSlider(/Surface lightness/, 20);
    await waitFor(() => expect(sessionStorage.getItem(`${DARK_MODE_STRESS_SESSION_PREFIX}${sessionKey}`)).toContain('surface-hierarchy'));

    first.unmount();
    render(<DarkModeStressChallenge onComplete={vi.fn()} sessionKey={sessionKey} />);

    expect(screen.getByText('Stage 2 of 3')).toBeInTheDocument();
    expect(screen.getByRole('slider', { name: /Surface lightness/ })).toHaveValue('20');
  });
});
