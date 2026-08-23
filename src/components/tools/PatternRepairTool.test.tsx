import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { PatternRepairTool } from './PatternRepairTool.tsx';

afterEach(() => cleanup());

function selectOption(name: string) {
  fireEvent.click(screen.getByRole('checkbox', { name }));
}

describe('PatternRepairTool', () => {
  it('does not repair form validation without error message text', () => {
    render(<PatternRepairTool interactive />);

    selectOption('Add error icon ✕');
    selectOption('Change label to bold+red');

    expect(screen.getByText(/0\/4 repaired/)).toBeInTheDocument();
    expect(screen.getByText('needs error text + 1 option')).toBeInTheDocument();
  });

  it('repairs form validation when error message text is paired with another cue', () => {
    render(<PatternRepairTool interactive />);

    selectOption('Add error message text');
    selectOption('Add error icon ✕');

    expect(screen.getByText(/1\/4 repaired/)).toBeInTheDocument();
  });

  it('does not repair chart series with value labels alone', () => {
    render(<PatternRepairTool interactive />);

    selectOption('Add value labels at top');

    expect(screen.getByText(/0\/4 repaired/)).toBeInTheDocument();
    expect(screen.getByText('needs direct labels or patterns')).toBeInTheDocument();
  });

  it.each(['Add direct labels', 'Add pattern fills'])('repairs chart series with %s', (option) => {
    render(<PatternRepairTool interactive />);

    selectOption(option);

    expect(screen.getByText(/1\/4 repaired/)).toBeInTheDocument();
  });

  it.each([
    'Add underline to links',
    'Add bold weight to links',
    'Add › arrow indicator',
  ])('keeps %s as a valid link repair', (option) => {
    render(<PatternRepairTool interactive />);

    selectOption(option);

    expect(screen.getByText(/1\/4 repaired/)).toBeInTheDocument();
  });

  it.each([
    ['Add icons (✓/⚠/✕)', 'Add structured heading'],
    ['Add icons (✓/⚠/✕)', 'Add border-left accent'],
    ['Add structured heading', 'Add border-left accent'],
  ])('keeps %s with %s as a valid alert repair', (firstOption, secondOption) => {
    render(<PatternRepairTool interactive />);

    selectOption(firstOption);
    selectOption(secondOption);

    expect(screen.getByText(/1\/4 repaired/)).toBeInTheDocument();
  });

  it('completes only after all four modules have valid repairs', () => {
    const onComplete = vi.fn();
    render(<PatternRepairTool interactive onComplete={onComplete} />);

    selectOption('Add error icon ✕');
    selectOption('Change label to bold+red');
    selectOption('Add underline to links');
    selectOption('Add icons (✓/⚠/✕)');
    selectOption('Add structured heading');
    selectOption('Add value labels at top');

    expect(screen.getByText(/2\/4 repaired/)).toBeInTheDocument();
    expect(onComplete).not.toHaveBeenCalled();

    selectOption('Add error message text');

    expect(screen.getByText(/3\/4 repaired/)).toBeInTheDocument();
    expect(onComplete).not.toHaveBeenCalled();

    selectOption('Add direct labels');

    expect(screen.getByText(/4\/4 repaired/)).toBeInTheDocument();
    expect(screen.getByText(/All patterns repaired/)).toBeInTheDocument();
    expect(onComplete).toHaveBeenCalledOnce();
  });
});
