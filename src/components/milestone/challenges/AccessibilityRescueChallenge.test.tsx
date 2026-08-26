import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ACCESSIBILITY_RESCUE_SESSION_PREFIX } from '../../../state/persistence.ts';
import { AccessibilityRescueChallenge } from './AccessibilityRescueChallenge.tsx';

function passCurrentRepair(nextAction?: string) {
  fireEvent.click(screen.getByRole('button', { name: 'check repair' }));
  if (nextAction) fireEvent.click(screen.getByRole('button', { name: nextAction }));
}

function advanceToFocusStage() {
  fireEvent.change(screen.getByRole('slider', { name: /Text lightness/ }), { target: { value: 20 } });
  passCurrentRepair('continue to required-field cue');
  fireEvent.click(screen.getByRole('button', { name: 'add icon and text cue' }));
  passCurrentRepair('continue to focus indicator');
}

beforeEach(() => sessionStorage.clear());
afterEach(() => cleanup());

describe('AccessibilityRescueChallenge', () => {
  it('renders the four repairs as ordered active-only stages', () => {
    render(<AccessibilityRescueChallenge onComplete={vi.fn()} />);

    expect(screen.getByText('Stage 1 of 4')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Repair body text contrast' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'add icon and text cue' })).not.toBeInTheDocument();

    fireEvent.change(screen.getByRole('slider', { name: /Text lightness/ }), { target: { value: 20 } });
    passCurrentRepair('continue to required-field cue');
    expect(screen.getByText('Stage 2 of 4')).toBeInTheDocument();
    expect(screen.queryByRole('slider', { name: /Text lightness/ })).not.toBeInTheDocument();
  });

  it('reports failure and focuses the same repair on retry', async () => {
    render(<AccessibilityRescueChallenge onComplete={vi.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: 'check repair' }));
    expect(screen.getByRole('status')).toHaveTextContent('does not pass');

    fireEvent.click(screen.getByRole('button', { name: 'try stage again' }));
    await waitFor(() => expect(screen.getByRole('heading', { name: 'Repair body text contrast' })).toHaveFocus());
  });

  it('completes only after all four repairs pass', () => {
    const onComplete = vi.fn();
    render(<AccessibilityRescueChallenge onComplete={onComplete} />);
    advanceToFocusStage();
    fireEvent.click(screen.getByRole('button', { name: 'add focus indicator' }));
    passCurrentRepair('continue to icon contrast');
    fireEvent.change(screen.getByRole('slider', { name: /Icon lightness/ }), { target: { value: 20 } });

    passCurrentRepair();

    expect(screen.getByRole('status')).toHaveTextContent('All four repairs are complete');
    expect(onComplete).toHaveBeenCalledOnce();
  });

  it('restores the active repair and completed input values after reload', async () => {
    const sessionKey = 'milestone-5:1';
    const first = render(<AccessibilityRescueChallenge onComplete={vi.fn()} sessionKey={sessionKey} />);
    advanceToFocusStage();
    await waitFor(() => expect(sessionStorage.getItem(`${ACCESSIBILITY_RESCUE_SESSION_PREFIX}${sessionKey}`)).toContain('focus-indicator'));

    first.unmount();
    render(<AccessibilityRescueChallenge onComplete={vi.fn()} sessionKey={sessionKey} />);

    expect(screen.getByText('Stage 3 of 4')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'add focus indicator' })).toHaveAttribute('aria-pressed', 'false');
    expect(sessionStorage.getItem(`${ACCESSIBILITY_RESCUE_SESSION_PREFIX}${sessionKey}`)).toContain('"requiredCueOn":true');
  });
});
