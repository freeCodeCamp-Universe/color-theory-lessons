import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DARK_MODE_STRESS_SESSION_PREFIX } from '../../../state/persistence.ts';
import { DarkModeStressChallenge } from './DarkModeStressChallenge.tsx';

function setSlider(name: RegExp, value: number) {
  fireEvent.change(screen.getByRole('slider', { name }), { target: { value } });
}

function makePassingTheme() {
  setSlider(/Text lightness/, 100);
  setSlider(/Surface lightness/, 20);
  setSlider(/Action lightness/, 70);
}

beforeEach(() => sessionStorage.clear());
afterEach(() => cleanup());

describe('DarkModeStressChallenge', () => {
  it('checks text against its rendered surface and requires all three repairs', () => {
    const onComplete = vi.fn();
    render(<DarkModeStressChallenge onComplete={onComplete} />);
    const finishButton = screen.getByRole('button', { name: 'finish challenge' });

    setSlider(/Surface lightness/, 40);
    setSlider(/Text lightness/, 60);
    expect(screen.getByText(/Not passed: Text against surface/)).toBeInTheDocument();
    expect(finishButton).toBeDisabled();

    makePassingTheme();
    expect(screen.getByText(/Pass: Text against surface: .*target: 4\.5:1/)).toBeInTheDocument();
    expect(screen.getByText(/Pass: Surface against background: .*exercise target: 1\.2:1/)).toBeInTheDocument();
    expect(screen.getByText(/Pass: Action against surface: .*target: 3\.0:1/)).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('All three dark-theme checks pass.');
    expect(finishButton).toBeEnabled();

    fireEvent.click(finishButton);
    fireEvent.click(finishButton);
    expect(onComplete).toHaveBeenCalledOnce();
  });

  it('supports keyboard changes on each named range control', async () => {
    const user = userEvent.setup();
    render(<DarkModeStressChallenge onComplete={vi.fn()} />);

    await user.tab();
    expect(screen.getByRole('slider', { name: /Text lightness/ })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole('slider', { name: /Surface lightness/ })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole('slider', { name: /Action lightness/ })).toHaveFocus();
  });

  it('restores all three controls after reload during an attempt', async () => {
    const sessionKey = 'milestone-6:1';
    const first = render(
      <DarkModeStressChallenge onComplete={vi.fn()} sessionKey={sessionKey} />,
    );
    makePassingTheme();

    await waitFor(() => {
      const stored = sessionStorage.getItem(`${DARK_MODE_STRESS_SESSION_PREFIX}${sessionKey}`);
      expect(stored).toContain('"textLightness":100');
      expect(stored).toContain('"surfaceLightness":20');
      expect(stored).toContain('"actionLightness":70');
    });
    first.unmount();
    render(<DarkModeStressChallenge onComplete={vi.fn()} sessionKey={sessionKey} />);

    expect(screen.getByRole('slider', { name: /Text lightness/ })).toHaveValue('100');
    expect(screen.getByRole('slider', { name: /Surface lightness/ })).toHaveValue('20');
    expect(screen.getByRole('slider', { name: /Action lightness/ })).toHaveValue('70');
    expect(screen.getByRole('status')).toHaveTextContent('All three dark-theme checks pass.');
  });

  it('starts from the defaults when the retry attempt key changes', () => {
    sessionStorage.setItem(
      `${DARK_MODE_STRESS_SESSION_PREFIX}milestone-6:1`,
      JSON.stringify({
        version: 1,
        textLightness: 100,
        surfaceLightness: 20,
        actionLightness: 70,
      }),
    );

    render(<DarkModeStressChallenge onComplete={vi.fn()} sessionKey="milestone-6:2" />);

    expect(screen.getByRole('slider', { name: /Text lightness/ })).toHaveValue('70');
    expect(screen.getByRole('slider', { name: /Surface lightness/ })).toHaveValue('12');
    expect(screen.getByRole('slider', { name: /Action lightness/ })).toHaveValue('40');
  });
});
