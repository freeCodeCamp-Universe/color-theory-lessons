import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { SEMANTIC_AUDIT_SESSION_PREFIX } from '../../../state/persistence.ts';
import { SemanticAuditChallenge } from './SemanticAuditChallenge.tsx';

const ASSIGNMENTS = [
  ['#0b1220', 'Page background'], ['#1c2536', 'Surface'], ['#f8fafc', 'Primary text'],
  ['#cbd5e1', 'Secondary text'], ['#3b82f6', 'Action'], ['#84cc16', 'Success'],
  ['#f97316', 'Warning'], ['#fb7185', 'Error'],
] as const;

function assignSwatch(hex: string, role: string) {
  fireEvent.click(screen.getByRole('button', { name: `Select swatch ${hex}` }));
  fireEvent.click(screen.getByRole('button', { name: new RegExp(`^${role}`) }));
}

function passRoleStage() {
  ASSIGNMENTS.forEach(([hex, role]) => assignSwatch(hex, role));
  fireEvent.click(screen.getByRole('button', { name: 'check roles' }));
  fireEvent.click(screen.getByRole('button', { name: 'continue to conflict identification' }));
}

beforeEach(() => sessionStorage.clear());
afterEach(() => cleanup());

describe('SemanticAuditChallenge', () => {
  it('keeps conflict identification hidden until role assignment passes', () => {
    render(<SemanticAuditChallenge onComplete={vi.fn()} />);

    expect(screen.getByText('Stage 1 of 2')).toBeInTheDocument();
    expect(screen.queryByRole('combobox', { name: 'Which role issue exists in this set?' })).not.toBeInTheDocument();
    passRoleStage();
    expect(screen.getByText('Stage 2 of 2')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Select swatch/ })).not.toBeInTheDocument();
  });

  it('reports an incomplete role stage and focuses it on retry', async () => {
    render(<SemanticAuditChallenge onComplete={vi.fn()} />);
    expect(screen.getByText('0 / 8 assigned')).toBeInTheDocument();
    expect(screen.queryByText(/correct$/)).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'check roles' }));
    expect(screen.getByText('0 / 8 correct')).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('Assign every role');

    fireEvent.click(screen.getByRole('button', { name: 'try stage again' }));
    await waitFor(() => expect(screen.getByRole('heading', { name: 'Assign semantic roles' })).toHaveFocus());
  });

  it('completes after role assignment and conflict identification both pass', () => {
    const onComplete = vi.fn();
    render(<SemanticAuditChallenge onComplete={onComplete} />);
    passRoleStage();
    fireEvent.change(screen.getByRole('combobox', { name: 'Which role issue exists in this set?' }), {
      target: { value: 'warning-error-too-close' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'check conflict' }));

    expect(screen.getByRole('status')).toHaveTextContent('Challenge complete');
    expect(onComplete).toHaveBeenCalledOnce();
  });

  it('restores the conflict stage and its selected answer after reload', async () => {
    const sessionKey = 'milestone-6:1';
    const first = render(<SemanticAuditChallenge onComplete={vi.fn()} sessionKey={sessionKey} />);
    passRoleStage();
    fireEvent.change(screen.getByRole('combobox', { name: 'Which role issue exists in this set?' }), {
      target: { value: 'warning-error-too-close' },
    });
    await waitFor(() => expect(sessionStorage.getItem(`${SEMANTIC_AUDIT_SESSION_PREFIX}${sessionKey}`)).toContain('identify-conflict'));

    first.unmount();
    render(<SemanticAuditChallenge onComplete={vi.fn()} sessionKey={sessionKey} />);

    expect(screen.getByText('Stage 2 of 2')).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: 'Which role issue exists in this set?' })).toHaveValue('warning-error-too-close');
  });
});
