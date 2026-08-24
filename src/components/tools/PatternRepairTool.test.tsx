import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { PatternRepairTool } from './PatternRepairTool.tsx';

afterEach(() => cleanup());

function selectOption(name: string) {
  fireEvent.click(screen.getByRole('checkbox', { name }));
}

describe('PatternRepairTool', () => {
  it('does not reveal repair requirements before checking', () => {
    render(<PatternRepairTool interactive />);

    expect(screen.queryByText('not checked')).not.toBeInTheDocument();
    expect(screen.queryByText(/needs error text/)).not.toBeInTheDocument();
    expect(screen.queryByText(/needs direct labels/)).not.toBeInTheDocument();
  });

  it('explains why form validation fails without error message text', () => {
    render(<PatternRepairTool interactive />);

    selectOption('Add error icon ✕');
    selectOption('Change label to bold+red');
    fireEvent.click(screen.getByRole('button', { name: 'check repairs' }));

    expect(screen.getByText(/0\/4 repaired/)).toBeInTheDocument();
    expect(screen.getByText('The form does not explain what is wrong. A visible error description is still missing.')).toBeInTheDocument();
    const feedback = screen.getByTestId('feedback-form-validation');
    expect(feedback.parentElement?.lastElementChild).toBe(feedback);
  });

  it('repairs form validation when error message text is paired with another cue', () => {
    render(<PatternRepairTool interactive />);

    selectOption('Add error message text');
    selectOption('Add error icon ✕');
    fireEvent.click(screen.getByRole('button', { name: 'check repairs' }));

    expect(screen.getByText(/1\/4 repaired/)).toBeInTheDocument();
  });

  it('explains why value labels do not repair chart series', () => {
    render(<PatternRepairTool interactive />);

    selectOption('Add value labels at top');
    fireEvent.click(screen.getByRole('button', { name: 'check repairs' }));

    expect(screen.getByText(/0\/4 repaired/)).toBeInTheDocument();
    expect(screen.getByText('The values show amounts, but they do not identify the series.')).toBeInTheDocument();
  });

  it.each(['Add direct labels', 'Add pattern fills'])('repairs chart series with %s', (option) => {
    render(<PatternRepairTool interactive />);

    selectOption(option);
    fireEvent.click(screen.getByRole('button', { name: 'check repairs' }));

    expect(screen.getByText(/1\/4 repaired/)).toBeInTheDocument();
  });

  it('keeps chart bars visible after selecting an option', () => {
    render(<PatternRepairTool interactive />);

    selectOption('Add value labels at top');

    const seriesA = screen.getByTestId('chart-series-a');
    const seriesB = screen.getByTestId('chart-series-b');
    expect(seriesA.parentElement).toHaveStyle({ height: '100%' });
    expect(seriesB.parentElement).toHaveStyle({ height: '100%' });
    expect(seriesA).toHaveStyle({ height: '75%' });
    expect(seriesB).toHaveStyle({ height: '50%' });
  });

  it('uses a different pattern for each chart series', () => {
    render(<PatternRepairTool interactive />);

    selectOption('Add pattern fills');

    const seriesABackground = screen.getByTestId('chart-series-a').style.background;
    const seriesBBackground = screen.getByTestId('chart-series-b').style.background;
    expect(seriesABackground).toContain('45deg');
    expect(seriesBBackground).toContain('0deg');
    expect(seriesABackground).not.toBe(seriesBBackground);
    expect(seriesABackground).toContain('transparent 6px');
    expect(screen.getByTestId('legend-series-a').style.background).toContain('transparent 4px');
    expect(screen.getByTestId('legend-series-b').style.background).toContain('transparent 4px');
    expect(screen.getByTestId('chart-series-a')).toHaveStyle({ border: '1px solid #777' });
    expect(screen.getByTestId('chart-series-b')).toHaveStyle({ border: '1px solid #777' });
    expect(screen.getByText('Series A')).toBeInTheDocument();
    expect(screen.getByText('Series B')).toBeInTheDocument();
  });

  it.each([
    'Add underline to links',
    'Add bold weight to links',
    'Add › arrow indicator',
  ])('keeps %s as a valid link repair', (option) => {
    render(<PatternRepairTool interactive />);

    selectOption(option);
    fireEvent.click(screen.getByRole('button', { name: 'check repairs' }));

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
    fireEvent.click(screen.getByRole('button', { name: 'check repairs' }));

    expect(screen.getByText(/1\/4 repaired/)).toBeInTheDocument();
  });

  it('preserves selections when retrying an invalid repair', () => {
    render(<PatternRepairTool interactive />);

    selectOption('Add value labels at top');
    fireEvent.click(screen.getByRole('button', { name: 'check repairs' }));

    const valueLabels = screen.getByRole('checkbox', { name: 'Add value labels at top' });
    expect(valueLabels).toBeChecked();
    expect(valueLabels).toBeDisabled();

    fireEvent.click(screen.getByRole('button', { name: 'try again' }));

    expect(valueLabels).toBeChecked();
    expect(valueLabels).toBeEnabled();
    expect(screen.queryByText('The values show amounts, but they do not identify the series.')).not.toBeInTheDocument();
  });

  it('completes only after checking four valid repairs', () => {
    const onComplete = vi.fn();
    render(<PatternRepairTool interactive onComplete={onComplete} />);

    selectOption('Add error icon ✕');
    selectOption('Change label to bold+red');
    selectOption('Add underline to links');
    selectOption('Add icons (✓/⚠/✕)');
    selectOption('Add structured heading');
    selectOption('Add value labels at top');

    expect(onComplete).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: 'check repairs' }));

    expect(screen.getByText(/2\/4 repaired/)).toBeInTheDocument();
    expect(onComplete).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: 'try again' }));
    selectOption('Add error message text');
    selectOption('Add direct labels');
    fireEvent.click(screen.getByRole('button', { name: 'check repairs' }));

    expect(screen.getByText(/4\/4 repaired/)).toBeInTheDocument();
    expect(screen.getByText(/All patterns repaired/)).toBeInTheDocument();
    expect(onComplete).toHaveBeenCalledOnce();
  });
});
