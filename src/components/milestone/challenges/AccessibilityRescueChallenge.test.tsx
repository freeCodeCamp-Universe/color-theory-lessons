import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ACCESSIBILITY_RESCUE_SESSION_PREFIX } from '../../../state/persistence.ts';
import { AccessibilityRescueChallenge } from './AccessibilityRescueChallenge.tsx';
import styles from './AccessibilityRescueChallenge.module.css';

function makeAllRepairs() {
  fireEvent.change(screen.getByRole('slider', { name: /Text lightness/ }), {
    target: { value: '20' },
  });
  fireEvent.click(screen.getByRole('button', { name: 'add icon and text cue' }));
  fireEvent.click(screen.getByRole('button', { name: 'add focus indicator' }));
  fireEvent.change(screen.getByRole('slider', { name: /Icon lightness/ }), {
    target: { value: '20' },
  });
}

beforeEach(() => sessionStorage.clear());
afterEach(() => cleanup());

describe('AccessibilityRescueChallenge', () => {
  it('requires all four independent repairs before completion', () => {
    const onComplete = vi.fn();
    render(<AccessibilityRescueChallenge onComplete={onComplete} />);
    const finishButton = screen.getByRole('button', { name: 'finish challenge' });

    expect(screen.getByRole('status')).toHaveTextContent('0 of 4 fixed');
    expect(finishButton).toBeDisabled();

    fireEvent.change(screen.getByRole('slider', { name: /Text lightness/ }), {
      target: { value: '20' },
    });
    expect(screen.getByRole('status')).toHaveTextContent('1 of 4 fixed');
    expect(finishButton).toBeDisabled();

    fireEvent.click(screen.getByRole('button', { name: 'add icon and text cue' }));
    expect(screen.getByRole('status')).toHaveTextContent('2 of 4 fixed');
    expect(finishButton).toBeDisabled();

    fireEvent.click(screen.getByRole('button', { name: 'add focus indicator' }));
    expect(screen.getByRole('status')).toHaveTextContent('3 of 4 fixed');
    expect(finishButton).toBeDisabled();

    fireEvent.change(screen.getByRole('slider', { name: /Icon lightness/ }), {
      target: { value: '20' },
    });
    expect(screen.getByRole('status')).toHaveTextContent('4 of 4 fixed');
    expect(finishButton).toBeEnabled();

    fireEvent.click(finishButton);
    fireEvent.click(finishButton);
    expect(onComplete).toHaveBeenCalledOnce();
  });

  it('exposes headings, toggle states, contrast units, and the icon name', () => {
    render(<AccessibilityRescueChallenge onComplete={vi.fn()} />);

    expect(screen.getByRole('heading', { name: '1) Body text needs at least 4.5:1 contrast' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '2) Required field uses color alone' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '3) Submit button has no visible focus indicator' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '4) Settings icon needs at least 3:1 contrast' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'add icon and text cue' })).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByRole('button', { name: 'add focus indicator' })).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByRole('img', { name: 'Settings' })).toBeInTheDocument();
    expect(screen.getByText(/minimum 4\.5:1/)).toBeInTheDocument();
    expect(screen.getByText(/minimum 3:1/)).toBeInTheDocument();
  });

  it('uses native range inputs and supports keyboard operation for both toggles', async () => {
    const user = userEvent.setup();
    render(<AccessibilityRescueChallenge onComplete={vi.fn()} />);

    const textSlider = screen.getByRole('slider', { name: /Text lightness/ });
    textSlider.focus();
    expect(textSlider).toHaveFocus();
    expect(textSlider).not.toBeDisabled();
    fireEvent.change(textSlider, { target: { value: '20' } });

    const cueToggle = screen.getByRole('button', { name: 'add icon and text cue' });
    cueToggle.focus();
    await user.keyboard(' ');
    expect(screen.getByRole('button', { name: 'remove icon and text cue' })).toHaveAttribute('aria-pressed', 'true');

    const focusToggle = screen.getByRole('button', { name: 'add focus indicator' });
    const submitPreview = screen.getByRole('button', { name: 'Submit' });
    expect(submitPreview).not.toHaveClass(styles.focusOn);
    focusToggle.focus();
    await user.keyboard('{Enter}');
    expect(screen.getByRole('button', { name: 'remove focus indicator' })).toHaveAttribute('aria-pressed', 'true');
    expect(submitPreview).toHaveClass(styles.focusOn);

    const iconSlider = screen.getByRole('slider', { name: /Icon lightness/ });
    iconSlider.focus();
    expect(iconSlider).toHaveFocus();
    expect(iconSlider).not.toBeDisabled();
    fireEvent.change(iconSlider, { target: { value: '20' } });
    expect(screen.getByRole('button', { name: 'finish challenge' })).toBeEnabled();
  });

  it('restores all repairs after a reload during an attempt', async () => {
    const sessionKey = 'milestone-5:1';
    const first = render(
      <AccessibilityRescueChallenge onComplete={vi.fn()} sessionKey={sessionKey} />,
    );
    makeAllRepairs();

    await waitFor(() => {
      const stored = sessionStorage.getItem(
        `${ACCESSIBILITY_RESCUE_SESSION_PREFIX}${sessionKey}`,
      );
      expect(stored).toContain('"textLightness":20');
      expect(stored).toContain('"requiredCueOn":true');
      expect(stored).toContain('"focusVisible":true');
      expect(stored).toContain('"iconLightness":20');
    });

    first.unmount();
    render(<AccessibilityRescueChallenge onComplete={vi.fn()} sessionKey={sessionKey} />);

    expect(screen.getByRole('slider', { name: /Text lightness/ })).toHaveValue('20');
    expect(screen.getByRole('button', { name: 'remove icon and text cue' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'remove focus indicator' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('slider', { name: /Icon lightness/ })).toHaveValue('20');
    expect(screen.getByRole('status')).toHaveTextContent('4 of 4 fixed');
  });

  it('starts a clean retry when the attempt key changes', () => {
    sessionStorage.setItem(
      `${ACCESSIBILITY_RESCUE_SESSION_PREFIX}milestone-5:1`,
      JSON.stringify({
        version: 1,
        textLightness: 20,
        requiredCueOn: true,
        focusVisible: true,
        iconLightness: 20,
      }),
    );

    render(
      <AccessibilityRescueChallenge onComplete={vi.fn()} sessionKey="milestone-5:2" />,
    );

    expect(screen.getByRole('slider', { name: /Text lightness/ })).toHaveValue('55');
    expect(screen.getByRole('button', { name: 'add icon and text cue' })).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByRole('button', { name: 'add focus indicator' })).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByRole('slider', { name: /Icon lightness/ })).toHaveValue('72');
    expect(screen.getByRole('status')).toHaveTextContent('0 of 4 fixed');
  });
});
