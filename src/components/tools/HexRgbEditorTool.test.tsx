import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { HexRgbEditorTool } from './HexRgbEditorTool.tsx';

afterEach(() => cleanup());

describe('HexRgbEditorTool color readout', () => {
  it('shows the RGB value with modern space-separated syntax', () => {
    render(<HexRgbEditorTool interactive={true} />);

    expect(screen.getByText('#6366F1 · rgb(99 102 241)')).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('HEX color input'), {
      target: { value: '#3B82F6' },
    });

    expect(screen.getByText('#3B82F6 · rgb(59 130 246)')).toBeInTheDocument();
  });

  it('requires each target stage to pass before completing', () => {
    const onComplete = vi.fn();
    render(<HexRgbEditorTool interactive onComplete={onComplete} />);

    expect(screen.getByText('Stage 1 of 3')).toBeInTheDocument();
    expect(screen.getByText('link blue')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'check match' }));
    expect(screen.getByText(/not close enough/)).toBeInTheDocument();
    expect(screen.getByText('Stage 1 of 3')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'try stage again' }));

    for (const [hex, nextTarget] of [
      ['#3B82F6', 'error red'],
      ['#DC2626', 'light gray surface'],
    ] as const) {
      fireEvent.change(screen.getByLabelText('HEX color input'), { target: { value: hex } });
      fireEvent.click(screen.getByRole('button', { name: 'check match' }));
      expect(onComplete).not.toHaveBeenCalled();
      fireEvent.click(screen.getByRole('button', { name: 'next target' }));
      expect(screen.getByText(nextTarget)).toBeInTheDocument();
    }

    fireEvent.change(screen.getByLabelText('HEX color input'), { target: { value: '#F1F1F1' } });
    fireEvent.click(screen.getByRole('button', { name: 'check match' }));

    expect(onComplete).toHaveBeenCalledOnce();
    expect(screen.getByText('All three HEX targets matched.')).toBeInTheDocument();
  });
});
