import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { PatternRepairTool } from './PatternRepairTool.tsx';

afterEach(() => cleanup());

function selectOption(name: string) {
  fireEvent.click(screen.getByRole('checkbox', { name }));
}

describe('PatternRepairTool', () => {
  it('keeps comparison labels outside the authored samples', () => {
    render(<PatternRepairTool interactive />);

    for (const label of ['Before', 'After']) {
      for (const element of screen.getAllByText(label, { exact: true })) {
        expect(element.closest('[data-authored-visual]')).not.toBeInTheDocument();
        expect(getComputedStyle(element).fontSize).toBe('1rem');
        expect(getComputedStyle(element).fontFamily).toContain('var(--font-sans)');
      }
    }
  });

  it('does not reveal repair requirements before checking', () => {
    render(<PatternRepairTool interactive />);

    expect(screen.getByText('Stage 1 of 1')).toBeInTheDocument();
    expect(screen.queryByText('not checked')).not.toBeInTheDocument();
    expect(screen.queryByText(/needs error text/)).not.toBeInTheDocument();
    expect(screen.queryByText(/needs direct labels/)).not.toBeInTheDocument();
  });

  it('explains why form validation fails without error message text', () => {
    render(<PatternRepairTool interactive />);

    selectOption('Add error icon ✕');
    selectOption('Make label bold and red');
    fireEvent.click(screen.getByRole('button', { name: 'check repairs' }));

    expect(screen.getByText(/Repaired patterns: 0 of 4/)).toBeInTheDocument();
    expect(screen.getByText('The form does not explain what is wrong. A visible error description is still missing.')).toBeInTheDocument();
    const feedback = screen.getByTestId('feedback-form-validation');
    expect(feedback.parentElement?.lastElementChild).toBe(feedback);
  });

  it('repairs form validation with error message text alone', () => {
    render(<PatternRepairTool interactive />);

    selectOption('Add error message text');
    fireEvent.click(screen.getByRole('button', { name: 'check repairs' }));

    expect(screen.getByText(/Repaired patterns: 1 of 4/)).toBeInTheDocument();
  });

  it('explains why value labels do not repair chart series', () => {
    render(<PatternRepairTool interactive />);

    selectOption('Add value labels at top');
    fireEvent.click(screen.getByRole('button', { name: 'check repairs' }));

    expect(screen.getByText(/Repaired patterns: 0 of 4/)).toBeInTheDocument();
    expect(screen.getByText('The values show amounts, but they do not identify the series.')).toBeInTheDocument();
  });

  it.each(['Add direct labels', 'Add pattern fills'])('repairs chart series with %s', (option) => {
    render(<PatternRepairTool interactive />);

    selectOption(option);
    fireEvent.click(screen.getByRole('button', { name: 'check repairs' }));

    expect(screen.getByText(/Repaired patterns: 1 of 4/)).toBeInTheDocument();
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

    expect(screen.getByText(/Repaired patterns: 1 of 4/)).toBeInTheDocument();
  });

  it.each([
    'Add status icons (✓/⚠/✕)',
    'Add status text labels',
  ])('repairs service statuses with %s alone', (option) => {
    render(<PatternRepairTool interactive />);

    selectOption(option);
    fireEvent.click(screen.getByRole('button', { name: 'check repairs' }));

    expect(screen.getByText(/Repaired patterns: 1 of 4/)).toBeInTheDocument();
  });

  it('adds text labels that identify each service status', () => {
    render(<PatternRepairTool interactive />);

    expect(screen.queryByText('Operational')).not.toBeInTheDocument();
    expect(screen.queryByText('Degraded')).not.toBeInTheDocument();
    expect(screen.queryByText('Offline')).not.toBeInTheDocument();

    selectOption('Add status text labels');

    expect(screen.getByText('Operational')).toBeInTheDocument();
    expect(screen.getByText('Degraded')).toBeInTheDocument();
    expect(screen.getByText('Offline')).toBeInTheDocument();
  });

  it('does not repair service statuses with colored outlines alone', () => {
    render(<PatternRepairTool interactive />);

    selectOption('Add colored outlines');
    fireEvent.click(screen.getByRole('button', { name: 'check repairs' }));

    expect(screen.getByText(/Repaired patterns: 0 of 4/)).toBeInTheDocument();
    expect(screen.getByText('The dots and outlines still use hue as the only way to identify each service status.')).toBeInTheDocument();
  });

  it('explains when the service status dashboard has no selected cues', () => {
    render(<PatternRepairTool interactive />);

    fireEvent.click(screen.getByRole('button', { name: 'check repairs' }));

    expect(screen.getByText('The colored dots are the only cues that identify each service status.')).toBeInTheDocument();
    expect(screen.queryByText('The dots and outlines still use hue as the only way to identify each service status.')).not.toBeInTheDocument();
  });

  it('preserves selections when retrying an invalid repair', () => {
    render(<PatternRepairTool interactive />);

    selectOption('Add value labels at top');
    fireEvent.click(screen.getByRole('button', { name: 'check repairs' }));

    const valueLabels = screen.getByRole('checkbox', { name: 'Add value labels at top' });
    expect(valueLabels).toBeChecked();
    expect(valueLabels).toBeDisabled();

    fireEvent.click(screen.getByRole('button', { name: 'try stage again' }));

    expect(valueLabels).toBeChecked();
    expect(valueLabels).toBeEnabled();
    expect(screen.queryByText('The values show amounts, but they do not identify the series.')).not.toBeInTheDocument();
  });

  it('completes only after checking four valid repairs', () => {
    const onComplete = vi.fn();
    render(<PatternRepairTool interactive onComplete={onComplete} />);

    selectOption('Add error icon ✕');
    selectOption('Make label bold and red');
    selectOption('Add underline to links');
    selectOption('Add status icons (✓/⚠/✕)');
    selectOption('Add status text labels');
    selectOption('Add value labels at top');

    expect(onComplete).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: 'check repairs' }));

    expect(screen.getByText(/Repaired patterns: 2 of 4/)).toBeInTheDocument();
    expect(onComplete).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: 'try stage again' }));
    selectOption('Add error message text');
    selectOption('Add direct labels');
    fireEvent.click(screen.getByRole('button', { name: 'check repairs' }));

    expect(screen.getByText(/Repaired patterns: 4 of 4/)).toBeInTheDocument();
    expect(screen.getByText(/All patterns are repaired/)).toBeInTheDocument();
    expect(onComplete).toHaveBeenCalledOnce();
  });
});
