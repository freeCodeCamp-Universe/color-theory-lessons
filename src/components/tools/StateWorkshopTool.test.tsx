import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { StateWorkshopTool } from './StateWorkshopTool.tsx';

afterEach(() => cleanup());

describe('StateWorkshopTool', () => {
  it('does not complete when two states have the same border-only treatment', () => {
    const onComplete = vi.fn();
    render(<StateWorkshopTool interactive onComplete={onComplete} />);

    for (const checkbox of screen.getAllByRole('checkbox', { name: 'Border style' })) {
      fireEvent.click(checkbox);
    }
    fireEvent.click(screen.getByRole('button', { name: 'check stage' }));

    expect(onComplete).not.toHaveBeenCalled();
    expect(screen.getByText(/Every state needs a non-color treatment/)).toBeInTheDocument();
  });

  it('completes when each state has a distinct label', () => {
    const onComplete = vi.fn();
    render(<StateWorkshopTool interactive onComplete={onComplete} />);

    for (const stateName of ['Success', 'Warning', 'Error', 'Info']) {
      fireEvent.click(screen.getByRole('checkbox', { name: `Label "${stateName}"` }));
    }

    expect(screen.getByText('Stage 1 of 1')).toBeInTheDocument();
    expect(onComplete).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: 'check stage' }));

    expect(onComplete).toHaveBeenCalledOnce();
    expect(screen.getByText('Each state has a distinct non-color treatment.')).toBeInTheDocument();
  });
});
