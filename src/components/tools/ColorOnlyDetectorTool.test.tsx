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

    expect(screen.getByText(/This link also has an underline/)).toBeInTheDocument();
    expect(screen.getByText(/The icon and message identify the error/)).toBeInTheDocument();
    expect(screen.getByText(/Bold text and a bottom border identify the selected tab/)).toBeInTheDocument();
    expect(screen.getByText(/0\/3 found/)).toBeInTheDocument();
    expect(screen.queryByText(/You found all three examples that rely on hue alone/)).not.toBeInTheDocument();
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
    expect(screen.getByText(/You found all three examples that rely on hue alone/)).toBeInTheDocument();
    expect(onComplete).toHaveBeenCalledOnce();
  });
});
