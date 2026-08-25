import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { InterfaceGalleryTool } from './InterfaceGalleryTool.tsx';
import { VisionCardsTool } from './VisionCardsTool.tsx';

afterEach(() => cleanup());

describe('Unit 4 exploration stages', () => {
  it('keeps vision-card progress visible and completes after all six cards are explored', async () => {
    const user = userEvent.setup();
    const onComplete = vi.fn();
    render(<VisionCardsTool interactive onComplete={onComplete} />);

    expect(screen.getByText('Stage 1 of 1')).toBeInTheDocument();
    expect(screen.getByText('0/6 cards explored')).toBeInTheDocument();

    const cards = [
      'Protanopia',
      'Protanomaly',
      'Deuteranopia',
      'Deuteranomaly',
      'Tritanopia',
      'Achromatopsia',
    ];
    for (const name of cards.slice(0, -1)) {
      await user.click(screen.getByRole('button', { name: new RegExp(name) }));
    }

    expect(screen.getByText('5/6 cards explored')).toBeInTheDocument();
    expect(onComplete).not.toHaveBeenCalled();

    await user.click(screen.getByRole('button', { name: /Achromatopsia/ }));

    expect(screen.getByText('6/6 cards explored')).toBeInTheDocument();
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it('tracks all four required simulation modes in one review stage', async () => {
    const user = userEvent.setup();
    const onComplete = vi.fn();
    render(<InterfaceGalleryTool interactive onComplete={onComplete} />);

    expect(screen.getByText('Stage 1 of 1')).toBeInTheDocument();
    expect(screen.getByText('0/4 simulation modes explored')).toBeInTheDocument();

    for (const mode of ['Deuteranopia', 'Protanopia', 'Tritanopia']) {
      await user.click(screen.getByRole('button', { name: mode }));
    }
    expect(screen.getByText('3/4 simulation modes explored')).toBeInTheDocument();
    expect(onComplete).not.toHaveBeenCalled();

    await user.click(screen.getByRole('button', { name: 'Complete achromatopsia' }));

    expect(screen.getByText('4/4 simulation modes explored')).toBeInTheDocument();
    expect(onComplete).toHaveBeenCalledTimes(1);
  });
});
