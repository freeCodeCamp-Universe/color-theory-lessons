import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { THEME_FROM_SCRATCH_SESSION_PREFIX } from '../../../state/persistence.ts';
import { ThemeFromScratchChallenge } from './ThemeFromScratchChallenge.tsx';

function setSlider(name: string, value: number) {
  fireEvent.change(screen.getByRole('slider', { name }), { target: { value } });
}

function passTextStage() {
  setSlider('Background lightness', 0);
  setSlider('Primary text lightness', 95);
  setSlider('Secondary text lightness', 80);
  fireEvent.click(screen.getByRole('button', { name: 'check set text readability' }));
  fireEvent.click(screen.getByRole('button', { name: 'continue to surface separation' }));
}

function passSurfaceStage() {
  fireEvent.click(screen.getByRole('button', { name: 'check separate the surface' }));
  fireEvent.click(screen.getByRole('button', { name: 'continue to accent visibility' }));
}

beforeEach(() => sessionStorage.clear());
afterEach(() => cleanup());

describe('ThemeFromScratchChallenge', () => {
  it('shows only the controls and checks for the active stage', () => {
    render(<ThemeFromScratchChallenge onComplete={vi.fn()} />);

    expect(screen.getByText('Stage 1 of 3')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Set text readability' })).toBeInTheDocument();
    expect(screen.getAllByRole('group')).toHaveLength(4);
    expect(screen.queryByRole('slider', { name: 'Accent lightness' })).not.toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(3);
  });

  it('supports failure, retry focus, and ordered advancement', async () => {
    render(<ThemeFromScratchChallenge onComplete={vi.fn()} />);
    setSlider('Secondary text lightness', 40);
    fireEvent.click(screen.getByRole('button', { name: 'check set text readability' }));
    expect(screen.getByRole('status')).toHaveTextContent(/of 3 checks pass/);
    fireEvent.click(screen.getByRole('button', { name: 'try stage again' }));
    await waitFor(() => expect(screen.getByRole('heading', { name: 'Set text readability' })).toHaveFocus());

    passTextStage();
    expect(screen.getByText('Stage 2 of 3')).toBeInTheDocument();
    expect(screen.getAllByRole('group')).toHaveLength(4);
    expect(screen.getByRole('slider', { name: 'Background lightness' })).toBeInTheDocument();
  });

  it('lets the learner repair a Stage 1 theme that cannot pass surface separation as saved', () => {
    render(<ThemeFromScratchChallenge onComplete={vi.fn()} />);

    for (const role of ['Background', 'Surface', 'Primary text', 'Secondary text']) {
      setSlider(`${role} saturation`, 0);
    }
    setSlider('Background lightness', 46);
    setSlider('Surface lightness', 46);
    setSlider('Primary text lightness', 0);
    setSlider('Secondary text lightness', 100);
    fireEvent.click(screen.getByRole('button', { name: 'check set text readability' }));
    fireEvent.click(screen.getByRole('button', { name: 'continue to surface separation' }));

    setSlider('Background lightness', 0);
    setSlider('Surface lightness', 14);
    setSlider('Primary text lightness', 95);
    setSlider('Secondary text lightness', 80);
    fireEvent.click(screen.getByRole('button', { name: 'check separate the surface' }));

    expect(screen.getByRole('status')).toHaveTextContent('All 1 checks in this stage pass.');
    expect(screen.getByRole('button', { name: 'continue to accent visibility' })).toBeEnabled();
  });

  it('completes only after text, surface, and accent stages pass', () => {
    const onComplete = vi.fn();
    render(<ThemeFromScratchChallenge onComplete={onComplete} />);
    passTextStage();
    passSurfaceStage();
    setSlider('Accent lightness', 47);

    fireEvent.click(screen.getByRole('button', { name: 'check set accent visibility' }));

    expect(screen.getByRole('status')).toHaveTextContent('Theme challenge complete');
    expect(onComplete).toHaveBeenCalledOnce();
  });

  it('restores role values and the active stage after reload', async () => {
    const sessionKey = 'milestone-3:1';
    const first = render(<ThemeFromScratchChallenge onComplete={vi.fn()} sessionKey={sessionKey} />);
    passTextStage();
    setSlider('Surface hue', 120);
    await waitFor(() => expect(sessionStorage.getItem(`${THEME_FROM_SCRATCH_SESSION_PREFIX}${sessionKey}`)).toContain('surface-separation'));

    first.unmount();
    render(<ThemeFromScratchChallenge onComplete={vi.fn()} sessionKey={sessionKey} />);

    expect(screen.getByText('Stage 2 of 3')).toBeInTheDocument();
    expect(screen.getByRole('slider', { name: 'Surface hue' })).toHaveValue('120');
  });
});
