import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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

  it('focuses the available pathway card and activates it with Enter', async () => {
    const user = userEvent.setup();

    render(<EyeDiagramTool interactive={true} />);

    const availableStep = screen.getByRole('button', { name: 'Eye Receives Light' });
    await user.tab();

    expect(availableStep).toHaveFocus();

    await user.keyboard('{Enter}');

    expect(screen.getByRole('button', { name: /Eye Receives Light/ })).toHaveAttribute('aria-current', 'step');
    expect(screen.getByText(/Light passes through the cornea and lens/)).toBeInTheDocument();
  });

  it('activates the available pathway card with Space', async () => {
    const user = userEvent.setup();

    render(<EyeDiagramTool interactive={true} />);

    await user.tab();
    await user.keyboard(' ');

    expect(screen.getByRole('button', { name: /Eye Receives Light/ })).toHaveAttribute('aria-current', 'step');
  });

  it('keeps current, completed, and locked pathway cards noninteractive', async () => {
    const user = userEvent.setup();

    render(<EyeDiagramTool interactive={true} />);

    expect(screen.getByRole('button', { name: /Light from Screen, current step/ })).toBeDisabled();
    expect(screen.getByRole('button', { name: /Retina Processes Signal, locked/ })).toBeDisabled();

    await user.click(screen.getByRole('button', { name: 'Eye Receives Light' }));

    expect(screen.getByRole('button', { name: /Light from Screen, completed/ })).toBeDisabled();
    expect(screen.getByRole('button', { name: /Eye Receives Light, current step/ })).toBeDisabled();
  });
});
