import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { SIMULATION_SPOTTER_SESSION_PREFIX } from '../../../state/persistence.ts';
import { SimulationSpotterChallenge } from './SimulationSpotterChallenge.tsx';

const FRAGILE_LABELS = [
  'Status badges: green and red backgrounds',
  'Chart bars: red and green series',
  'Form error: red label text',
];

function flagFragileExamples() {
  for (const label of FRAGILE_LABELS) {
    fireEvent.click(screen.getByRole('button', { name: `Flag ${label} as relying on color alone` }));
  }
}

function passIdentificationStage() {
  flagFragileExamples();
  fireEvent.click(screen.getByRole('button', { name: 'check examples' }));
  fireEvent.click(screen.getByRole('button', { name: 'continue to repairs' }));
}

function chooseRepairs() {
  const fixes = ['icon', 'pattern', 'label'];
  FRAGILE_LABELS.forEach((label, index) => {
    fireEvent.change(screen.getByRole('combobox', { name: `Fix for ${label}` }), {
      target: { value: fixes[index] },
    });
  });
}

beforeEach(() => sessionStorage.clear());
afterEach(() => cleanup());

describe('SimulationSpotterChallenge', () => {
  it('separates identification from repair controls', () => {
    render(<SimulationSpotterChallenge onComplete={vi.fn()} />);

    expect(screen.getByText('Stage 1 of 2')).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /as relying on color alone/ })).toHaveLength(6);
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument();

    passIdentificationStage();
    expect(screen.getByText('Stage 2 of 2')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /as relying on color alone/ })).not.toBeInTheDocument();
    expect(screen.getAllByRole('combobox')).toHaveLength(3);
  });

  it('reports identification failure and focuses the same stage on retry', async () => {
    render(<SimulationSpotterChallenge onComplete={vi.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: 'check examples' }));
    expect(screen.getByRole('status')).toHaveTextContent('flagged set is not correct');

    fireEvent.click(screen.getByRole('button', { name: 'try stage again' }));
    await waitFor(() => expect(screen.getByRole('heading', { name: 'Identify color-only examples' })).toHaveFocus());
  });

  it('completes after valid repairs pass the second stage', () => {
    const onComplete = vi.fn();
    render(<SimulationSpotterChallenge onComplete={onComplete} />);
    passIdentificationStage();
    chooseRepairs();

    fireEvent.click(screen.getByRole('button', { name: 'check repairs' }));

    expect(screen.getByRole('status')).toHaveTextContent('Challenge complete');
    expect(onComplete).toHaveBeenCalledOnce();
  });

  it('restores the repair stage and its selections after reload', async () => {
    const sessionKey = 'milestone-4:1';
    const first = render(<SimulationSpotterChallenge onComplete={vi.fn()} sessionKey={sessionKey} />);
    passIdentificationStage();
    fireEvent.change(screen.getByRole('combobox', { name: `Fix for ${FRAGILE_LABELS[0]}` }), { target: { value: 'icon' } });
    await waitFor(() => expect(sessionStorage.getItem(`${SIMULATION_SPOTTER_SESSION_PREFIX}${sessionKey}`)).toContain('choose-repairs'));

    first.unmount();
    render(<SimulationSpotterChallenge onComplete={vi.fn()} sessionKey={sessionKey} />);

    expect(screen.getByText('Stage 2 of 2')).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: `Fix for ${FRAGILE_LABELS[0]}` })).toHaveValue('icon');
  });
});
