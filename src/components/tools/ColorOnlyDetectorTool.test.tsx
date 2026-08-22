import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ColorOnlyDetectorTool } from './ColorOnlyDetectorTool.tsx';

afterEach(() => cleanup());

function selectExample(name: string) {
  const example = screen.getByText(name).parentElement;

  if (!example) {
    throw new Error(`Could not find the ${name} example`);
  }

  fireEvent.click(example);
}

describe('ColorOnlyDetectorTool', () => {
  it('shows three hue-only examples and three examples with non-color cues', () => {
    render(<ColorOnlyDetectorTool interactive />);

    expect(screen.getByDisplayValue('Sample input')).toBeInTheDocument();
    expect(screen.getByText('Series A')).toBeInTheDocument();
    expect(screen.getByText('Series B')).toBeInTheDocument();
    expect(screen.getByText('Series C')).toBeInTheDocument();

    for (const name of ['Link text', 'Error message', 'Selected tab']) {
      selectExample(name);
    }

    expect(screen.getAllByText(/Not quite/)).toHaveLength(3);
    expect(screen.getByText(/0\/3 found/)).toBeInTheDocument();
    expect(screen.queryByText(/All color-only problems identified/)).not.toBeInTheDocument();
  });

  it('completes after selecting the same three hue-only examples', () => {
    const onComplete = vi.fn();
    render(<ColorOnlyDetectorTool interactive onComplete={onComplete} />);

    selectExample('Status dots');
    selectExample('Form validation');

    expect(screen.getByText(/2\/3 found/)).toBeInTheDocument();
    expect(onComplete).not.toHaveBeenCalled();

    selectExample('Chart series');

    expect(screen.getByText(/3\/3 found/)).toBeInTheDocument();
    expect(screen.getByText(/All color-only problems identified/)).toBeInTheDocument();
    expect(onComplete).toHaveBeenCalledOnce();
  });
});
