import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { THEME_FROM_SCRATCH_SESSION_PREFIX } from '../../../state/persistence.ts';
import { ThemeFromScratchChallenge } from './ThemeFromScratchChallenge.tsx';

function setSlider(name: string, value: number) {
  fireEvent.change(screen.getByRole('slider', { name }), { target: { value } });
}

function makePassingTheme() {
  setSlider('Background lightness', 0);
  setSlider('Primary text lightness', 95);
  setSlider('Secondary text lightness', 80);
  setSlider('Accent lightness', 47);
}

beforeEach(() => sessionStorage.clear());
afterEach(() => cleanup());

describe('ThemeFromScratchChallenge', () => {
  it('renders fifteen named HSL sliders grouped by their five roles', () => {
    render(<ThemeFromScratchChallenge onComplete={vi.fn()} />);

    expect(screen.getAllByRole('group')).toHaveLength(5);
    expect(screen.getAllByRole('slider')).toHaveLength(15);
    expect(screen.getByRole('slider', { name: 'Background hue' })).toHaveValue('215');
    expect(screen.getByRole('slider', { name: 'Surface saturation' })).toHaveValue('24');
    expect(screen.getByRole('slider', { name: 'Accent lightness' })).toHaveValue('44');
  });

  it('supports native keyboard focus for every HSL control', async () => {
    const user = userEvent.setup();
    render(<ThemeFromScratchChallenge onComplete={vi.fn()} />);

    await user.tab();
    expect(screen.getByRole('slider', { name: 'Background hue' })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole('slider', { name: 'Background saturation' })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole('slider', { name: 'Background lightness' })).toHaveFocus();
  });

  it('requires all text, surface, and accent checks before completion', () => {
    const onComplete = vi.fn();
    render(<ThemeFromScratchChallenge onComplete={onComplete} />);

    const finishButton = screen.getByRole('button', { name: 'finish challenge' });
    expect(finishButton).toBeDisabled();
    expect(screen.getByText(/Not passed: Primary text on accent/)).toBeInTheDocument();
    expect(screen.getByText(/Secondary text on surface: .*target: 4\.5:1/)).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent(/of 6 theme checks pass/);
    expect(onComplete).not.toHaveBeenCalled();

    makePassingTheme();

    expect(screen.getByText(/Pass: Primary text on background/)).toBeInTheDocument();
    expect(screen.getByText(/Pass: Primary text on surface/)).toBeInTheDocument();
    expect(screen.getByText(/Pass: Secondary text on surface/)).toBeInTheDocument();
    expect(screen.getByText(/Pass: Surface against background/)).toBeInTheDocument();
    expect(screen.getByText(/Pass: Accent against surface/)).toBeInTheDocument();
    expect(screen.getByText(/Pass: Primary text on accent/)).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('All six theme checks pass.');
    expect(finishButton).toBeEnabled();

    fireEvent.click(finishButton);
    fireEvent.click(finishButton);
    expect(onComplete).toHaveBeenCalledOnce();
  });

  it('updates the preview and check text without relying on color alone', () => {
    render(<ThemeFromScratchChallenge onComplete={vi.fn()} />);

    const primaryPreview = screen.getByText('Palette preview');
    const initialColor = primaryPreview.style.color;
    setSlider('Primary text lightness', 95);

    expect(primaryPreview.style.color).not.toBe(initialColor);
    expect(screen.getAllByRole('listitem')).toHaveLength(6);
  });

  it('restores the five role values after a reload during an attempt', async () => {
    const sessionKey = 'milestone-3:1';
    const first = render(
      <ThemeFromScratchChallenge onComplete={vi.fn()} sessionKey={sessionKey} />,
    );
    setSlider('Background hue', 120);
    setSlider('Surface saturation', 40);
    setSlider('Accent lightness', 60);

    await waitFor(() => {
      expect(sessionStorage.getItem(`${THEME_FROM_SCRATCH_SESSION_PREFIX}${sessionKey}`)).toContain('"h":120');
    });
    first.unmount();
    render(<ThemeFromScratchChallenge onComplete={vi.fn()} sessionKey={sessionKey} />);

    expect(screen.getByRole('slider', { name: 'Background hue' })).toHaveValue('120');
    expect(screen.getByRole('slider', { name: 'Surface saturation' })).toHaveValue('40');
    expect(screen.getByRole('slider', { name: 'Accent lightness' })).toHaveValue('60');
  });

  it('ignores invalid saved channels instead of restoring an impossible slider state', () => {
    const sessionKey = 'milestone-3:1';
    sessionStorage.setItem(
      `${THEME_FROM_SCRATCH_SESSION_PREFIX}${sessionKey}`,
      JSON.stringify({
        version: 1,
        roles: {
          bg: { h: 999, s: 30, l: 12 },
          surface: { h: 100, s: 40, l: 20 },
        },
      }),
    );

    render(<ThemeFromScratchChallenge onComplete={vi.fn()} sessionKey={sessionKey} />);

    expect(screen.getByRole('slider', { name: 'Background hue' })).toHaveValue('215');
    expect(screen.getByRole('slider', { name: 'Surface hue' })).toHaveValue('100');
  });
});
