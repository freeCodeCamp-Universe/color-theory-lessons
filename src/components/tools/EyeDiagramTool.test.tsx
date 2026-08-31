import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EyeDiagramTool } from './EyeDiagramTool.tsx';

afterEach(() => cleanup());

describe('EyeDiagramTool stage flow', () => {
  it('reveals the visual pathway in order and completes after the final stage passes', async () => {
    const user = userEvent.setup();
    const onComplete = vi.fn();
    const onStageChange = vi.fn();

    render(
      <EyeDiagramTool
        interactive
        onComplete={onComplete}
        onStageChange={onStageChange}
      />,
    );

    expect(screen.getByText('Stage 1 of 4')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Light from the screen' })).toBeInTheDocument();
    expect(screen.queryByText(/The cornea and lens focus incoming light/)).not.toBeInTheDocument();

    for (const position of [2, 3, 4]) {
      await user.click(screen.getByRole('button', { name: 'mark stage reviewed' }));
      expect(onComplete).not.toHaveBeenCalled();
      await user.click(screen.getByRole('button', { name: 'next pathway stage' }));
      expect(screen.getByText(`Stage ${position} of 4`)).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 2 })).toHaveFocus();
      expect(screen.getByText(`Stage ${position} of 4:`, { exact: false })).toBeInTheDocument();
    }

    await user.click(screen.getByRole('button', { name: 'finish pathway' }));

    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(screen.getByText(/You explored the full visual pathway from the screen to the brain/)).toBeInTheDocument();
    expect(onStageChange.mock.calls.map(([stage]) => stage.id)).toEqual([
      'screen-light',
      'eye-receives-light',
      'retina-processes-signals',
      'brain-interprets-signals',
    ]);
  });
});
