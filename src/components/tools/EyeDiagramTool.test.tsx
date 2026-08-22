import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { EyeDiagramTool } from './EyeDiagramTool.tsx';

afterEach(() => cleanup());

describe('EyeDiagramTool completion flow', () => {
  it('completes when a learner advances through every step with next step', () => {
    const onComplete = vi.fn();

    render(<EyeDiagramTool interactive={true} onComplete={onComplete} />);

    fireEvent.click(screen.getByRole('button', { name: /next step/i }));
    fireEvent.click(screen.getByRole('button', { name: /next step/i }));
    fireEvent.click(screen.getByRole('button', { name: /next step/i }));

    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(screen.getByText(/full visual pathway explored/i)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /next step/i })).toBeNull();
  });
});
