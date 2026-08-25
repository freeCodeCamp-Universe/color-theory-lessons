import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ChartTunerTool } from './ChartTunerTool.tsx';

const SERIES_COLOR_LABELS = ['Revenue', 'Expenses', 'Profit', 'Forecast'];

function assignDistinctPatterns() {
  fireEvent.change(screen.getByRole('combobox', { name: 'Pattern for Expenses' }), { target: { value: 'horizontal' } });
  fireEvent.change(screen.getByRole('combobox', { name: 'Pattern for Profit' }), { target: { value: 'dots' } });
  fireEvent.change(screen.getByRole('combobox', { name: 'Pattern for Forecast' }), { target: { value: 'crosshatch' } });
}

afterEach(() => cleanup());

describe('ChartTunerTool', () => {
  it('shows a readable table with every chart value when selected', () => {
    render(<ChartTunerTool interactive />);

    expect(screen.queryByRole('table')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('checkbox', { name: 'Show the chart data table' }));

    const table = screen.getByRole('table', { name: 'Chart data in normal view' });
    expect(table).toBeVisible();
    expect(screen.getByRole('columnheader', { name: /Revenue/ })).toHaveTextContent('#3B82F6');
    expect(screen.getByRole('row', { name: 'Jan 80 60 20 75' })).toBeInTheDocument();
    expect(screen.getByRole('row', { name: 'May 88 68 20 82' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Deuteranopia simulation' }));
    expect(screen.getByRole('table', { name: 'Chart data in deuteranopia simulation' })).toBeVisible();
  });

  it('makes every series color control visible and explicit', () => {
    render(<ChartTunerTool interactive />);

    expect(screen.getByRole('group', { name: 'Series color and pattern controls' })).toBeVisible();
    expect(screen.getAllByText(/Change color ·/)).toHaveLength(4);
    SERIES_COLOR_LABELS.forEach((name) => {
      expect(screen.getByLabelText(`Change ${name} color`)).toBeVisible();
      expect(screen.getByRole('combobox', { name: `Pattern for ${name}` })).toBeVisible();
    });
  });

  it('applies series patterns to the bars in both chart views', () => {
    render(<ChartTunerTool interactive />);

    fireEvent.change(screen.getByRole('combobox', { name: 'Pattern for Revenue' }), { target: { value: 'horizontal' } });

    expect(screen.getByTitle('Revenue: 80')).toHaveStyle({
      backgroundImage: 'repeating-linear-gradient(0deg, rgba(0, 0, 0, 0.7) 0 2px, rgba(255, 255, 255, 0.7) 2px 4px)',
    });

    fireEvent.click(screen.getByRole('button', { name: 'Deuteranopia simulation' }));

    expect(screen.getByTitle('Revenue: 80')).toHaveStyle({
      backgroundImage: 'repeating-linear-gradient(0deg, rgba(0, 0, 0, 0.7) 0 2px, rgba(255, 255, 255, 0.7) 2px 4px)',
    });
  });

  it('requires a passing palette, distinct patterns, the data table, and an explicit completion action', () => {
    const onComplete = vi.fn();
    render(<ChartTunerTool interactive onComplete={onComplete} />);

    fireEvent.change(screen.getByLabelText('Change Expenses color'), { target: { value: '#000000' } });

    expect(screen.getByText("The colors meet the tool's difference threshold in both views. Assign a different pattern to each series.")).toBeInTheDocument();
    expect(onComplete).not.toHaveBeenCalled();

    assignDistinctPatterns();

    expect(screen.getByText("The colors and patterns meet the tool's criteria. Show the data table to inspect each bar.")).toBeInTheDocument();

    fireEvent.click(screen.getByRole('checkbox', { name: 'Show the chart data table' }));

    expect(screen.getByRole('table', { name: 'Chart data in normal view' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'Complete chart' })).toBeEnabled();
    expect(onComplete).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: 'Complete chart' }));

    expect(screen.getByText("The colors meet the tool's difference threshold in normal view and the deuteranopia simulation. Each series has a distinct pattern, and the data table identifies every bar.")).toBeInTheDocument();
    expect(onComplete).toHaveBeenCalledOnce();
    expect(screen.getByRole('checkbox', { name: 'Show the chart data table' })).toBeDisabled();
    SERIES_COLOR_LABELS.forEach((name) => {
      expect(screen.getByLabelText(`Change ${name} color`)).toBeDisabled();
      expect(screen.getByRole('combobox', { name: `Pattern for ${name}` })).toBeDisabled();
    });

    fireEvent.change(screen.getByRole('combobox', { name: 'Pattern for Expenses' }), { target: { value: 'diagonal' } });

    expect(screen.queryByText("The colors meet the tool's difference threshold in both views. Assign a different pattern to each series.")).not.toBeInTheDocument();
    expect(screen.getByText("The colors meet the tool's difference threshold in normal view and the deuteranopia simulation. Each series has a distinct pattern, and the data table identifies every bar.")).toBeInTheDocument();
  });

  it('does not enable completion with a failing palette or duplicate patterns', () => {
    const onComplete = vi.fn();
    render(<ChartTunerTool interactive onComplete={onComplete} />);

    fireEvent.click(screen.getByRole('checkbox', { name: 'Show the chart data table' }));

    expect(screen.getByText(/Expenses\/Profit under simulation/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Complete chart' })).toBeDisabled();

    fireEvent.change(screen.getByLabelText('Change Expenses color'), { target: { value: '#000000' } });

    expect(screen.getByText("The colors meet the tool's difference threshold in both views. Assign a different pattern to each series.")).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Complete chart' })).toBeDisabled();
    expect(onComplete).not.toHaveBeenCalled();
  });
});
