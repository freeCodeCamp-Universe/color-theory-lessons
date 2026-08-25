import { StrictMode } from 'react';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { InclusiveReviewTool } from './InclusiveReviewTool.tsx';

afterEach(() => cleanup());

describe('InclusiveReviewTool', () => {
  it.each([
    ['Deuteranopia', 'url(#inclusive-review-deuteranopia)'],
    ['Protanopia', 'url(#inclusive-review-protanopia)'],
    ['Tritanopia', 'url(#inclusive-review-tritanopia)'],
    ['Complete achromatopsia', 'url(#inclusive-review-achromatopsia)'],
  ])('shows the mockup under %s simulation', (mode, filter) => {
    render(<InclusiveReviewTool interactive />);

    const mockup = screen.getByTestId('inclusive-review-mockup');
    expect(mockup).toHaveStyle({ filter: 'none' });
    expect(screen.getByRole('group', { name: 'CVD simulation mode' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: mode }));

    expect(screen.getByRole('button', { name: mode })).toHaveAttribute('aria-pressed', 'true');
    expect(mockup).toHaveStyle({ filter });
  });

  it('uses the visible simulation evidence to explain the expected answer', () => {
    render(<InclusiveReviewTool interactive />);

    fireEvent.click(screen.getByRole('button', { name: 'Deuteranopia' }));

    const simulationCheck = screen.getByTestId('checklist-simulation');
    expect(within(simulationCheck).getByText('Does the interface remain understandable under CVD simulation modes?')).toBeInTheDocument();

    fireEvent.click(within(simulationCheck).getByRole('button', { name: 'Pass' }));
    expect(within(simulationCheck).getByText(/chart bars become hard to distinguish/)).toBeInTheDocument();

    fireEvent.click(within(simulationCheck).getByRole('button', { name: 'Needs work' }));
    expect(within(simulationCheck).queryByText(/chart bars become hard to distinguish/)).not.toBeInTheDocument();
  });

  it('completes only after every incorrect assessment is revised', () => {
    const onComplete = vi.fn();
    render(
      <StrictMode>
        <InclusiveReviewTool interactive onComplete={onComplete} />
      </StrictMode>,
    );

    screen.getAllByRole('button', { name: 'Pass' }).forEach((button) => fireEvent.click(button));

    expect(onComplete).not.toHaveBeenCalled();
    expect(screen.queryByText(/Review complete/)).not.toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: 'Needs work' })[0]).toBeEnabled();

    screen.getAllByRole('button', { name: 'Needs work' }).forEach((button) => fireEvent.click(button));

    expect(onComplete).toHaveBeenCalledOnce();
    expect(screen.getByText(/Review complete/)).toBeInTheDocument();
  });
});
