import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ChartTunerTool } from './ChartTunerTool.tsx';

const SERIES_COLOR_LABELS = ['Revenue', 'Expenses', 'Profit', 'Forecast'];

function passColorStage() {
  fireEvent.change(screen.getByLabelText('Change Expenses color'), { target: { value: '#000000' } });
  fireEvent.click(screen.getByRole('button', { name: 'check stage' }));
  fireEvent.click(screen.getByRole('button', { name: 'assign series patterns' }));
}

function assignDistinctPatterns() {
  fireEvent.change(screen.getByRole('combobox', { name: 'Pattern for Expenses' }), { target: { value: 'horizontal' } });
  fireEvent.change(screen.getByRole('combobox', { name: 'Pattern for Profit' }), { target: { value: 'dots' } });
  fireEvent.change(screen.getByRole('combobox', { name: 'Pattern for Forecast' }), { target: { value: 'crosshatch' } });
}

function passPatternStage() {
  assignDistinctPatterns();
  fireEvent.click(screen.getByRole('button', { name: 'check stage' }));
  fireEvent.click(screen.getByRole('button', { name: 'inspect the data table' }));
}

afterEach(cleanup);

describe('ChartTunerTool', () => {
  it('shows one ordered task at a time', () => {
    render(<ChartTunerTool interactive />);

    expect(screen.getByText('Stage 1 of 3')).toBeInTheDocument();
    expect(screen.getByRole('group', { name: 'Series color controls' })).toBeVisible();
    expect(screen.queryByRole('combobox', { name: 'Pattern for Revenue' })).not.toBeInTheDocument();
    expect(screen.queryByRole('checkbox', { name: 'Show the chart data table' })).not.toBeInTheDocument();

    passColorStage();

    expect(screen.getByText('Stage 2 of 3')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Assign the series patterns' })).toHaveFocus();
    expect(screen.getByRole('group', { name: 'Series pattern controls' })).toBeVisible();
    expect(screen.queryByLabelText('Change Revenue color')).not.toBeInTheDocument();
    expect(screen.queryByRole('checkbox', { name: 'Show the chart data table' })).not.toBeInTheDocument();

    passPatternStage();

    expect(screen.getByText('Stage 3 of 3')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Inspect the chart data' })).toHaveFocus();
    expect(screen.getByRole('checkbox', { name: 'Show the chart data table' })).toBeVisible();
    expect(screen.queryByRole('group', { name: 'Series pattern controls' })).not.toBeInTheDocument();
  });

  it('keeps a failed color attempt in the first stage for retry', () => {
    const onComplete = vi.fn();
    render(<ChartTunerTool interactive onComplete={onComplete} />);

    fireEvent.click(screen.getByRole('button', { name: 'check stage' }));

    expect(screen.getByText(/Some series remain below the tool's difference threshold/)).toBeInTheDocument();
    expect(screen.queryByText('Stage 2 of 3')).not.toBeInTheDocument();
    expect(onComplete).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: 'try stage again' }));
    expect(screen.getByLabelText('Change Expenses color')).toHaveValue('#ef4444');
  });

  it('applies series patterns to the chart in both views', () => {
    render(<ChartTunerTool interactive />);
    passColorStage();

    fireEvent.change(screen.getByRole('combobox', { name: 'Pattern for Revenue' }), { target: { value: 'horizontal' } });
    expect(screen.getByTitle('Revenue: 80')).toHaveStyle({
      backgroundImage: 'repeating-linear-gradient(0deg, rgba(0, 0, 0, 0.7) 0 2px, rgba(255, 255, 255, 0.7) 2px 4px)',
    });

    fireEvent.click(screen.getByRole('button', { name: 'Deuteranopia simulation' }));
    expect(screen.getByTitle('Revenue: 80')).toHaveStyle({
      backgroundImage: 'repeating-linear-gradient(0deg, rgba(0, 0, 0, 0.7) 0 2px, rgba(255, 255, 255, 0.7) 2px 4px)',
    });
  });

  it('completes once after the data-table stage passes', () => {
    const onComplete = vi.fn();
    const onStageChange = vi.fn();
    render(<ChartTunerTool interactive onComplete={onComplete} onStageChange={onStageChange} />);

    passColorStage();
    passPatternStage();
    expect(onComplete).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('checkbox', { name: 'Show the chart data table' }));
    const table = screen.getByRole('table', { name: 'Chart data in normal view' });
    expect(table).toBeVisible();
    expect(screen.getByRole('columnheader', { name: /Revenue/ })).toHaveTextContent('#3B82F6');
    expect(screen.getByRole('row', { name: 'Jan 80 60 20 75' })).toBeInTheDocument();
    expect(screen.getByRole('row', { name: 'May 88 68 20 82' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'check stage' }));

    expect(screen.getByText('The data table identifies every chart value, color, and pattern.')).toBeInTheDocument();
    expect(onComplete).toHaveBeenCalledOnce();
    expect(onStageChange.mock.calls.map(([stage]) => stage.id)).toEqual([
      'tune-series-colors',
      'assign-series-patterns',
      'inspect-data-table',
    ]);
    SERIES_COLOR_LABELS.forEach((name) => {
      expect(screen.queryByLabelText(`Change ${name} color`)).not.toBeInTheDocument();
    });
  });
});
