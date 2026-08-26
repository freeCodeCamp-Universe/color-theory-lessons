import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { TextContrastLabTool } from './TextContrastLabTool.tsx';

afterEach(() => cleanup());

function setTextColor(value: string) {
  fireEvent.change(screen.getByRole('textbox', { name: 'Text color hex' }), {
    target: { value },
  });
}

describe('TextContrastLabTool', () => {
  it.each([
    ['just below 4.5:1', '#9a6c5a', '4.49:1', 'Normal text (≥4.5:1): FAIL'],
    ['just above 4.5:1', '#7c7290', '4.50:1', 'Normal text (≥4.5:1): PASS'],
    ['just below 3:1', '#989a30', '2.99:1', 'Large text (≥3:1): FAIL'],
    ['just above 3:1', '#e969a1', '3.00:1', 'Large text (≥3:1): PASS'],
  ])('displays a ratio %s consistently with its threshold result', (_boundary, color, displayedRatio, result) => {
    render(<TextContrastLabTool interactive />);

    setTextColor(color);

    expect(screen.getByText(displayedRatio)).toBeInTheDocument();
    expect(screen.queryByText(result)).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'check stage' }));
    expect(screen.getByText(result)).toBeInTheDocument();
  });

  it('updates a pair from failing to passing and back to failing', () => {
    render(<TextContrastLabTool interactive />);

    expect(screen.getByText('Stage 1 of 1')).toBeInTheDocument();
    expect(screen.queryByText(/Passing pairs: 0 of 3/)).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'check stage' }));
    expect(screen.getByText(/Passing pairs: 0 of 3/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'try stage again' }));

    setTextColor('#000000');

    expect(screen.getByText(/Passing pairs: 1 of 3/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Body copy ✓' })).toBeInTheDocument();

    setTextColor('#999999');

    expect(screen.getByText(/Passing pairs: 0 of 3/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Body copy' })).toBeInTheDocument();
  });

  it('completes only while all three current pairs pass', () => {
    const onComplete = vi.fn();
    render(<TextContrastLabTool interactive onComplete={onComplete} />);

    setTextColor('#000000');
    fireEvent.click(screen.getByRole('button', { name: 'Badge label' }));
    setTextColor('#000000');
    fireEvent.click(screen.getByRole('button', { name: 'Sidebar text' }));
    setTextColor('#000000');

    expect(screen.queryByText(/Passing pairs: 3 of 3/)).not.toBeInTheDocument();
    expect(onComplete).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: 'check stage' }));

    expect(screen.getByText(/Passing pairs: 3 of 3/)).toBeInTheDocument();
    expect(screen.getByText(/All three pairs meet the 4.5:1 threshold for normal text/)).toBeInTheDocument();
    expect(onComplete).toHaveBeenCalledOnce();
  });

  it('keeps an incomplete repair in the stage for retry', () => {
    const onComplete = vi.fn();
    render(<TextContrastLabTool interactive onComplete={onComplete} />);

    setTextColor('#000000');
    fireEvent.click(screen.getByRole('button', { name: 'check stage' }));

    expect(screen.getByText(/Not all text pairs meet 4.5:1 yet/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'try stage again' })).toBeInTheDocument();
    expect(onComplete).not.toHaveBeenCalled();
  });
});
