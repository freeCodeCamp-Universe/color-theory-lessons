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

    expect(onComplete).not.toHaveBeenCalled();
    expect(screen.queryByText('Each state now has a distinct non-color treatment.')).not.toBeInTheDocument();
  });

  it('completes when each state has a distinct label', () => {
    const onComplete = vi.fn();
    render(<StateWorkshopTool interactive onComplete={onComplete} />);

    for (const stateName of ['Success', 'Warning', 'Error', 'Info']) {
      fireEvent.click(screen.getByRole('checkbox', { name: `Label "${stateName}"` }));
    }

    expect(onComplete).toHaveBeenCalledOnce();
    expect(screen.getByText('Each state now has a distinct non-color treatment.')).toBeInTheDocument();
  });
});
