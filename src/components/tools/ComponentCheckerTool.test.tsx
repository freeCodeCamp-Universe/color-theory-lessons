import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ComponentCheckerTool } from './ComponentCheckerTool.tsx';

afterEach(() => cleanup());

describe('ComponentCheckerTool contrast threshold', () => {
  it.each([
    ['immediately below 3:1', '#959595', '2.99:1, FAIL', 'Passing components: 0 of 4.'],
    ['immediately above 3:1', '#949494', '3.03:1, PASS', 'Passing components: 1 of 4.'],
  ])('displays and validates a value %s', (_boundary, color, result, count) => {
    render(<ComponentCheckerTool interactive />);

    fireEvent.change(screen.getByRole('textbox', { name: 'Input border hex color' }), {
      target: { value: color },
    });

    expect(screen.queryByText(result)).not.toBeInTheDocument();
    expect(screen.queryByText(count)).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'check stage' }));

    expect(screen.getByText(result)).toBeInTheDocument();
    expect(screen.getByText(count)).toBeInTheDocument();
  });
});

describe('ComponentCheckerTool stages', () => {
  it('keeps all component repairs in one stage and requires a check', () => {
    const onComplete = vi.fn();
    render(<ComponentCheckerTool interactive onComplete={onComplete} />);

    expect(screen.getByText('Stage 1 of 1')).toBeInTheDocument();

    for (const name of ['Input border', 'Icon button', 'Focus ring', 'Toggle track']) {
      fireEvent.change(screen.getByRole('textbox', { name: `${name} hex color` }), {
        target: { value: '#000000' },
      });
    }

    expect(screen.queryByText(/Passing components: 4 of 4/)).not.toBeInTheDocument();
    expect(onComplete).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: 'check stage' }));

    expect(screen.getByText(/Passing components: 4 of 4/)).toBeInTheDocument();
    expect(screen.getByText(/All four components have at least 3:1 contrast/)).toBeInTheDocument();
    expect(onComplete).toHaveBeenCalledOnce();
  });

  it('preserves component colors for retry after a failed check', () => {
    render(<ComponentCheckerTool interactive />);

    const borderColor = screen.getByRole('textbox', { name: 'Input border hex color' });
    fireEvent.change(borderColor, { target: { value: '#000000' } });
    fireEvent.click(screen.getByRole('button', { name: 'check stage' }));

    expect(screen.getByText(/Not all components meet 3:1 yet/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'try stage again' }));

    expect(borderColor).toHaveValue('#000000');
    expect(borderColor).toBeEnabled();
  });
});
