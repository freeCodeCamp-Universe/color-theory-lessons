import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SEMANTIC_AUDIT_SESSION_PREFIX } from '../../../state/persistence.ts';
import { SemanticAuditChallenge } from './SemanticAuditChallenge.tsx';

const assignments = [
  ['#0b1220', 'Page background'],
  ['#1c2536', 'Surface'],
  ['#f8fafc', 'Primary text'],
  ['#cbd5e1', 'Secondary text'],
  ['#3b82f6', 'Action'],
  ['#84cc16', 'Success'],
  ['#f97316', 'Warning'],
  ['#fb7185', 'Error'],
] as const;

function assignSwatch(hex: string, role: string) {
  fireEvent.click(screen.getByRole('button', { name: `Select swatch ${hex}` }));
  fireEvent.click(screen.getByRole('button', { name: new RegExp(`^${role}`) }));
}

function completeAssignments(correctCount = 8) {
  assignments.forEach(([hex, role], index) => {
    assignSwatch(index < correctCount ? hex : '#0b1220', role);
  });
}

beforeEach(() => sessionStorage.clear());
afterEach(() => cleanup());

describe('SemanticAuditChallenge', () => {
  it('requires every role, at least seven correct assignments, and the conflict answer', () => {
    const onComplete = vi.fn();
    render(<SemanticAuditChallenge onComplete={onComplete} />);

    const finishButton = screen.getByRole('button', { name: 'finish challenge' });
    expect(finishButton).toBeDisabled();
    expect(screen.getByRole('status')).toHaveTextContent('Not passed: Assign a swatch to every role with at least seven correct.');

    completeAssignments(6);
    fireEvent.change(screen.getByRole('combobox', { name: 'Which role issue exists in this set?' }), {
      target: { value: 'warning-error-too-close' },
    });
    expect(finishButton).toBeDisabled();

    assignSwatch('#f97316', 'Warning');
    expect(screen.getByText('7 / 8 correct')).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('Pass: Assign a swatch to every role with at least seven correct.');
    expect(screen.getByRole('status')).toHaveTextContent('Pass: Identify the color conflict in the palette.');
    expect(finishButton).toBeEnabled();

    fireEvent.click(finishButton);
    fireEvent.click(finishButton);
    expect(onComplete).toHaveBeenCalledOnce();
  });

  it('exposes pressed swatch state and supports keyboard assignment', async () => {
    const user = userEvent.setup();
    render(<SemanticAuditChallenge onComplete={vi.fn()} />);

    const pageBackground = screen.getByRole('button', { name: /^Page background/ });
    expect(pageBackground).toBeDisabled();

    const firstSwatch = screen.getByRole('button', { name: 'Select swatch #0b1220' });
    firstSwatch.focus();
    await user.keyboard(' ');
    expect(firstSwatch).toHaveAttribute('aria-pressed', 'true');
    expect(pageBackground).toBeEnabled();

    pageBackground.focus();
    await user.keyboard('{Enter}');
    expect(screen.getByRole('button', { name: 'Page background: #0B1220' })).toBeInTheDocument();
  });

  it('restores assignments, selected swatch, and the conflict answer after reload', async () => {
    const sessionKey = 'milestone-6:1';
    const first = render(
      <SemanticAuditChallenge onComplete={vi.fn()} sessionKey={sessionKey} />,
    );
    assignSwatch('#0b1220', 'Page background');
    fireEvent.click(screen.getByRole('button', { name: 'Select swatch #1c2536' }));
    fireEvent.change(screen.getByRole('combobox', { name: 'Which role issue exists in this set?' }), {
      target: { value: 'warning-error-too-close' },
    });

    await waitFor(() => {
      const stored = sessionStorage.getItem(`${SEMANTIC_AUDIT_SESSION_PREFIX}${sessionKey}`);
      expect(stored).toContain('"page-bg":"s1"');
      expect(stored).toContain('"activeSwatch":"s2"');
      expect(stored).toContain('"problem":"warning-error-too-close"');
    });
    first.unmount();
    render(<SemanticAuditChallenge onComplete={vi.fn()} sessionKey={sessionKey} />);

    expect(screen.getByRole('button', { name: 'Page background: #0B1220' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Select swatch #1c2536' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('combobox', { name: 'Which role issue exists in this set?' })).toHaveValue('warning-error-too-close');
  });

  it('starts a clean challenge when the retry attempt key changes', () => {
    sessionStorage.setItem(
      `${SEMANTIC_AUDIT_SESSION_PREFIX}milestone-6:1`,
      JSON.stringify({
        version: 1,
        activeSwatch: 's1',
        assignments: { 'page-bg': 's1' },
        problem: 'warning-error-too-close',
      }),
    );

    render(<SemanticAuditChallenge onComplete={vi.fn()} sessionKey="milestone-6:2" />);

    expect(screen.getByRole('button', { name: 'Page background: unassigned' })).toBeDisabled();
    expect(screen.getByRole('combobox', { name: 'Which role issue exists in this set?' })).toHaveValue('');
    expect(screen.getByRole('status')).toHaveTextContent('Not passed');
  });
});
