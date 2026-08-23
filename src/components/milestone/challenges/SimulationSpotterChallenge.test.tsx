import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SIMULATION_SPOTTER_SESSION_PREFIX } from '../../../state/persistence.ts';
import { SimulationSpotterChallenge } from './SimulationSpotterChallenge.tsx';

const STATUS_LABEL = 'Status badges: green and red backgrounds';
const BARS_LABEL = 'Chart bars: red and green series';
const FORM_LABEL = 'Form error: red label text';

function flag(label: string) {
  fireEvent.click(screen.getByRole('button', {
    name: `Flag ${label} as relying on color alone`,
  }));
}

function chooseFix(label: string, fix: string) {
  fireEvent.change(screen.getByRole('combobox', { name: `Fix for ${label}` }), {
    target: { value: fix },
  });
}

function makePassingSelection() {
  flag(STATUS_LABEL);
  chooseFix(STATUS_LABEL, 'icon');
  flag(BARS_LABEL);
  chooseFix(BARS_LABEL, 'pattern');
  flag(FORM_LABEL);
  chooseFix(FORM_LABEL, 'label');
}

beforeEach(() => sessionStorage.clear());
afterEach(() => cleanup());

describe('SimulationSpotterChallenge', () => {
  it('labels every row control and exposes toggle states', () => {
    render(<SimulationSpotterChallenge onComplete={vi.fn()} />);

    expect(screen.getAllByRole('group')).toHaveLength(6);
    expect(screen.getAllByRole('button', { name: /as relying on color alone/ })).toHaveLength(6);
    expect(screen.getAllByRole('combobox')).toHaveLength(6);
    expect(screen.getByRole('button', { name: 'Deuteranopia simulation: off' })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
    expect(screen.getByRole('button', {
      name: `Flag ${STATUS_LABEL} as relying on color alone`,
    })).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByRole('combobox', { name: `Fix for ${STATUS_LABEL}` })).toBeDisabled();
    expect(screen.getByRole('combobox', { name: `Fix for ${STATUS_LABEL}` })).toHaveTextContent(
      'Add success and error icons',
    );
    expect(screen.getByRole('combobox', { name: `Fix for ${BARS_LABEL}` })).toHaveTextContent(
      'Use distinct patterns identified in the legend',
    );
    expect(screen.getByRole('combobox', { name: `Fix for ${FORM_LABEL}` })).toHaveTextContent(
      'Add an inline error message',
    );
  });

  it('supports keyboard operation for the simulation, flags, and fix controls', async () => {
    const user = userEvent.setup();
    render(<SimulationSpotterChallenge onComplete={vi.fn()} />);

    await user.tab();
    const simulation = screen.getByRole('button', { name: 'Deuteranopia simulation: off' });
    expect(simulation).toHaveFocus();
    await user.keyboard(' ');
    expect(screen.getByRole('button', { name: 'Deuteranopia simulation: on' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );

    await user.tab();
    const statusFlag = screen.getByRole('button', {
      name: `Flag ${STATUS_LABEL} as relying on color alone`,
    });
    expect(statusFlag).toHaveFocus();
    await user.keyboard(' ');
    expect(statusFlag).toHaveAttribute('aria-pressed', 'true');

    await user.tab();
    expect(screen.getByRole('combobox', { name: `Fix for ${STATUS_LABEL}` })).toHaveFocus();
  });

  it('rejects incorrect flags and fixes before accepting all three valid repairs', () => {
    const onComplete = vi.fn();
    render(<SimulationSpotterChallenge onComplete={onComplete} />);
    const finishButton = screen.getByRole('button', { name: 'finish challenge' });

    expect(finishButton).toBeDisabled();
    expect(screen.getByRole('status')).toHaveTextContent(
      'Not passed: Flag exactly the three examples that rely on color alone.',
    );

    flag('Link: blue text with an underline');
    chooseFix('Link: blue text with an underline', 'label');
    makePassingSelection();
    expect(finishButton).toBeDisabled();

    flag('Link: blue text with an underline');
    chooseFix(FORM_LABEL, 'contrast');
    expect(screen.getByRole('status')).toHaveTextContent(
      'Not passed: Review the repair choices below.',
    );
    expect(screen.getByRole('status')).toHaveTextContent(
      'Form error: red label text: Higher text contrast makes the label easier to read, but still uses color alone to communicate the error.',
    );
    expect(finishButton).toBeDisabled();

    chooseFix(FORM_LABEL, 'label');
    expect(screen.getByRole('status')).toHaveTextContent(
      'Passed: Flag exactly the three examples that rely on color alone.',
    );
    expect(screen.getByRole('status')).toHaveTextContent(
      'Passed: Each color-only example has a cue that communicates the same information without color.',
    );
    expect(finishButton).toBeEnabled();

    fireEvent.click(finishButton);
    fireEvent.click(finishButton);
    expect(onComplete).toHaveBeenCalledOnce();
  });

  it('explains why a pattern alone does not communicate status meaning', () => {
    render(<SimulationSpotterChallenge onComplete={vi.fn()} />);

    flag(STATUS_LABEL);
    chooseFix(STATUS_LABEL, 'pattern');

    expect(screen.getByRole('status')).toHaveTextContent(
      'Status badges: green and red backgrounds: Patterns distinguish the badges, but do not identify which badge means success or error without labels or a key.',
    );
  });

  it('clears a selected fix when its row is unflagged', () => {
    render(<SimulationSpotterChallenge onComplete={vi.fn()} />);

    flag(STATUS_LABEL);
    chooseFix(STATUS_LABEL, 'icon');
    expect(screen.getByRole('combobox', { name: `Fix for ${STATUS_LABEL}` })).toHaveValue('icon');

    flag(STATUS_LABEL);
    expect(screen.getByRole('combobox', { name: `Fix for ${STATUS_LABEL}` })).toBeDisabled();
    expect(screen.getByRole('combobox', { name: `Fix for ${STATUS_LABEL}` })).toHaveValue('');
  });

  it('restores simulation, flag, and fix state after a reload during an attempt', async () => {
    const sessionKey = 'milestone-4:1';
    const first = render(
      <SimulationSpotterChallenge onComplete={vi.fn()} sessionKey={sessionKey} />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Deuteranopia simulation: off' }));
    flag(STATUS_LABEL);
    chooseFix(STATUS_LABEL, 'icon');

    await waitFor(() => {
      const stored = sessionStorage.getItem(
        `${SIMULATION_SPOTTER_SESSION_PREFIX}${sessionKey}`,
      );
      expect(stored).toContain('"simulated":true');
      expect(stored).toContain('"status":"icon"');
    });

    first.unmount();
    render(<SimulationSpotterChallenge onComplete={vi.fn()} sessionKey={sessionKey} />);

    expect(screen.getByRole('button', { name: 'Deuteranopia simulation: on' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(screen.getByRole('button', {
      name: `Flag ${STATUS_LABEL} as relying on color alone`,
    })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('combobox', { name: `Fix for ${STATUS_LABEL}` })).toHaveValue('icon');
  });

  it('starts a clean retry when the attempt key changes', () => {
    sessionStorage.setItem(
      `${SIMULATION_SPOTTER_SESSION_PREFIX}milestone-4:1`,
      JSON.stringify({
        version: 1,
        simulated: true,
        flagged: { status: true },
        fixes: { status: 'icon' },
      }),
    );

    render(<SimulationSpotterChallenge onComplete={vi.fn()} sessionKey="milestone-4:2" />);

    expect(screen.getByRole('button', { name: 'Deuteranopia simulation: off' })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
    expect(screen.getByRole('button', {
      name: `Flag ${STATUS_LABEL} as relying on color alone`,
    })).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByRole('combobox', { name: `Fix for ${STATUS_LABEL}` })).toHaveValue('');
  });
});
