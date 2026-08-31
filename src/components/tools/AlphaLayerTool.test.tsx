import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { AlphaLayerTool } from './AlphaLayerTool.tsx';

function passCurrentStage() {
  fireEvent.click(screen.getByRole('button', { name: 'check' }));
  fireEvent.click(screen.getByRole('button', { name: 'next overlay' }));
}

function advanceToImageOverlay() {
  passCurrentStage();
  fireEvent.click(screen.getByRole('button', { name: 'light overlay' }));
  setAlpha(10);
  passCurrentStage();
  fireEvent.click(screen.getByRole('button', { name: 'dark overlay' }));
}

function setAlpha(value: number) {
  fireEvent.change(screen.getByRole('slider', { name: /Alpha:/ }), { target: { value } });
}

afterEach(cleanup);

describe('AlphaLayerTool image text overlay context', () => {
  it('presents the four contexts as ordered stages', () => {
    render(<AlphaLayerTool interactive />);

    expect(screen.getByText('Stage 1 of 4')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Modal scrim' })).toBeInTheDocument();
    expect(screen.queryByText('Card hover')).not.toBeInTheDocument();

    passCurrentStage();
    expect(screen.getByText('Stage 2 of 4')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Card hover' })).toBeInTheDocument();
  });

  it('fails completion without rounding a below-target contrast ratio up to the target', () => {
    render(<AlphaLayerTool interactive />);

    advanceToImageOverlay();
    setAlpha(23);
    expect(screen.getByText('Text contrast:').parentElement).toHaveTextContent(
      'Text contrast: 4.4:1 (target: 4.5:1)',
    );
    expect(screen.getAllByRole('status').some((status) => status.textContent?.includes('White overlay text contrast is 4.4 to 1 and does not pass'))).toBe(true);
    fireEvent.click(screen.getByRole('button', { name: 'check' }));

    expect(screen.getByText('Stage 3 of 4')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'try stage again' })).toBeInTheDocument();
  });

  it('completes after all four overlay stages pass', () => {
    const onComplete = vi.fn();
    render(<AlphaLayerTool interactive onComplete={onComplete} />);

    advanceToImageOverlay();
    setAlpha(25);
    expect(screen.getByText('Text contrast:').parentElement).toHaveTextContent(
      /Text contrast:\s+\d+\.\d:1 \(target: 4\.5:1\)/,
    );
    fireEvent.click(screen.getByRole('button', { name: 'check' }));
    expect(onComplete).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: 'next overlay' }));

    fireEvent.click(screen.getByRole('button', { name: 'light overlay' }));
    setAlpha(40);
    fireEvent.click(screen.getByRole('button', { name: 'check' }));

    expect(onComplete).toHaveBeenCalledOnce();
    expect(screen.getByText('All four overlay contexts completed.')).toBeInTheDocument();
  });
});
