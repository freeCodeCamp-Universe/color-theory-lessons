import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ChartTunerTool } from './ChartTunerTool.tsx';

const SERIES_COLOR_LABELS = ['Revenue', 'Expenses', 'Profit', 'Forecast'];

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

    fireEvent.click(screen.getByRole('button', { name: 'Deuteranopia sim' }));
    expect(screen.getByRole('table', { name: 'Chart data in deuteranopia simulation' })).toBeVisible();
  });

  it('makes every series color control visible and explicit', () => {
    render(<ChartTunerTool interactive />);

    expect(screen.getByRole('group', { name: 'Series color controls' })).toBeVisible();
    expect(screen.getAllByText(/Change color ·/)).toHaveLength(4);
    SERIES_COLOR_LABELS.forEach((name) => {
      expect(screen.getByLabelText(`Change ${name} color`)).toBeVisible();
    });
  });

  it('requires a passing palette and the data table before completion', () => {
    const onComplete = vi.fn();
    render(<ChartTunerTool interactive onComplete={onComplete} />);

    fireEvent.change(screen.getByLabelText('Change Expenses color'), { target: { value: '#000000' } });

    expect(screen.getByText('Palette passes both views. Show the data table so the bars do not rely on color alone.')).toBeInTheDocument();
    expect(onComplete).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('checkbox', { name: 'Show the chart data table' }));

    expect(screen.getByText('The palette passes normal and CVD views, and the data table identifies every bar.')).toBeInTheDocument();
    expect(onComplete).toHaveBeenCalledOnce();
    expect(screen.getByRole('checkbox', { name: 'Show the chart data table' })).toBeDisabled();
  });

  it('does not complete when the data table is shown with a failing palette', () => {
    const onComplete = vi.fn();
    render(<ChartTunerTool interactive onComplete={onComplete} />);

    fireEvent.click(screen.getByRole('checkbox', { name: 'Show the chart data table' }));

    expect(screen.getByText(/Expenses\/Profit under simulation/)).toBeInTheDocument();
    expect(onComplete).not.toHaveBeenCalled();
  });
});
