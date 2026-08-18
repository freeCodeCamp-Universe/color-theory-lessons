import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { TemperatureSorterTool } from './TemperatureSorterTool.tsx';

const SWATCH_ANSWERS = {
  Coral: 'warm',
  Teal: 'cool',
  'Stone gray': 'neutral',
  Navy: 'cool',
  Rust: 'warm',
  Cream: 'neutral',
  Sand: 'neutral',
  Amber: 'warm',
  'Slate blue': 'cool',
} as const;

const GOAL_ANSWERS = {
  'Lively event sign-up': 'warm',
  'Calm data dashboard': 'cool',
  'Artwork-centered portfolio': 'neutral',
} as const;

afterEach(() => cleanup());

function answerSwatches() {
  for (const [label, answer] of Object.entries(SWATCH_ANSWERS)) {
    fireEvent.change(screen.getByRole('combobox', { name: `Temperature for ${label}` }), {
      target: { value: answer },
    });
  }
}

function advanceToGoalStage() {
  answerSwatches();
  fireEvent.click(screen.getByRole('button', { name: 'check stage' }));
  fireEvent.click(screen.getByRole('button', { name: /next stage/ }));
}

describe('TemperatureSorterTool stages', () => {
  it('shows one exercise stage at a time', () => {
    render(<TemperatureSorterTool />);

    expect(screen.getByText('Stage 1 of 2')).toBeInTheDocument();
    expect(screen.getByText('classify the colors')).toBeInTheDocument();
    expect(screen.queryByText('Lively event sign-up')).not.toBeInTheDocument();

    advanceToGoalStage();

    expect(screen.getByText('Stage 2 of 2')).toBeInTheDocument();
    expect(screen.getByText('match temperature to interface goals')).toBeInTheDocument();
    expect(screen.queryByText('Coral')).not.toBeInTheDocument();
  });

  it('requires the interface-goal stage to pass before completing', () => {
    const onComplete = vi.fn();
    render(<TemperatureSorterTool onComplete={onComplete} />);
    advanceToGoalStage();

    for (const [label, answer] of Object.entries(GOAL_ANSWERS)) {
      fireEvent.change(screen.getByRole('combobox', { name: `Palette direction for ${label}` }), {
        target: { value: answer === 'warm' ? 'cool' : 'warm' },
      });
    }
    fireEvent.click(screen.getByRole('button', { name: 'check stage' }));

    expect(screen.getByText('0 / 3 correct')).toBeInTheDocument();
    expect(onComplete).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: 'try stage again' }));
    for (const [label, answer] of Object.entries(GOAL_ANSWERS)) {
      fireEvent.change(screen.getByRole('combobox', { name: `Palette direction for ${label}` }), {
        target: { value: answer },
      });
    }
    fireEvent.click(screen.getByRole('button', { name: 'check stage' }));

    expect(onComplete).toHaveBeenCalledOnce();
  });
});
