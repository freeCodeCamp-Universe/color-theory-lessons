import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ChartTunerTool } from './ChartTunerTool.tsx';

afterEach(() => cleanup());

describe('ChartTunerTool', () => {
  it('adds a visible series label to every bar when selected', () => {
    render(<ChartTunerTool interactive />);

    expect(screen.queryAllByTestId(/^direct-label-/)).toHaveLength(0);

    fireEvent.click(screen.getByRole('checkbox', { name: 'Add direct labels to every bar' }));

    const directLabels = screen.getAllByTestId(/^direct-label-/);
    expect(directLabels).toHaveLength(20);
    directLabels.forEach((label) => expect(label).toBeVisible());
    expect(screen.getAllByText('Revenue')).toHaveLength(6);
    expect(screen.getAllByText('Forecast')).toHaveLength(6);
  });

  it('requires a passing palette and direct labels before completion', () => {
    const onComplete = vi.fn();
    render(<ChartTunerTool interactive onComplete={onComplete} />);

    fireEvent.change(screen.getByLabelText('Pick color for Expenses'), { target: { value: '#000000' } });

    expect(screen.getByText('Palette passes both views. Add direct labels so the bars do not rely on color alone.')).toBeInTheDocument();
    expect(onComplete).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('checkbox', { name: 'Add direct labels to every bar' }));

    expect(screen.getByText('The palette passes normal and CVD views, and direct labels identify every series.')).toBeInTheDocument();
    expect(onComplete).toHaveBeenCalledOnce();
    expect(screen.getByRole('checkbox', { name: 'Add direct labels to every bar' })).toBeDisabled();
  });

  it('does not complete when direct labels are added to a failing palette', () => {
    const onComplete = vi.fn();
    render(<ChartTunerTool interactive onComplete={onComplete} />);

    fireEvent.click(screen.getByRole('checkbox', { name: 'Add direct labels to every bar' }));

    expect(screen.getByText(/Expenses\/Profit under simulation/)).toBeInTheDocument();
    expect(onComplete).not.toHaveBeenCalled();
  });
});
