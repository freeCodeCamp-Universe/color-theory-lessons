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
    expect(screen.getByText(/You explored the full visual pathway from the screen to the brain/i)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /next step/i })).toBeNull();
  });

  it('focuses the available pathway card and activates it with Enter', async () => {
    const user = userEvent.setup();

    render(<EyeDiagramTool interactive={true} />);

    const availableStep = screen.getByRole('button', { name: 'The eye receives light' });
    await user.tab();

    expect(availableStep).toHaveFocus();

    await user.keyboard('{Enter}');

    expect(screen.getByRole('button', { name: /The eye receives light/ })).toHaveAttribute('aria-current', 'step');
    expect(screen.getByText(/The cornea and lens focus incoming light onto the retina/)).toBeInTheDocument();
  });

  it('activates the available pathway card with Space', async () => {
    const user = userEvent.setup();

    render(<EyeDiagramTool interactive={true} />);

    await user.tab();
    await user.keyboard(' ');

    expect(screen.getByRole('button', { name: /The eye receives light/ })).toHaveAttribute('aria-current', 'step');
  });

  it('keeps current, completed, and locked pathway cards noninteractive', async () => {
    const user = userEvent.setup();

    render(<EyeDiagramTool interactive={true} />);

    expect(screen.getByRole('button', { name: /Light from the screen, current step/ })).toBeDisabled();
    expect(screen.getByRole('button', { name: /The retina processes signals, locked/ })).toBeDisabled();

    await user.click(screen.getByRole('button', { name: 'The eye receives light' }));

    expect(screen.getByRole('button', { name: /Light from the screen, completed/ })).toBeDisabled();
    expect(screen.getByRole('button', { name: /The eye receives light, current step/ })).toBeDisabled();
  });
});
