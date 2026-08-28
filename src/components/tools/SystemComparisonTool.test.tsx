import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { contrastRatioWcag } from '../../utils/color.ts';
import type { RGB } from '../../utils/color.ts';
import { SystemComparisonTool } from './SystemComparisonTool.tsx';

const NORMAL_TEXT_THRESHOLD = 4.5;

afterEach(cleanup);

function rgbFromCss(value: string): RGB {
  const channels = value.match(/\d+/g)?.map(Number);
  if (!channels || channels.length < 3) {
    throw new Error(`Expected an RGB CSS color, received "${value}"`);
  }

  return { r: channels[0], g: channels[1], b: channels[2] };
}

describe('SystemComparisonTool text contrast', () => {
  it('meets WCAG AA for secondary text on the card surface', () => {
    render(<SystemComparisonTool />);
    const secondaryText = screen.getAllByText('Last updated: today')[1];
    const card = secondaryText.parentElement;
    if (!card) throw new Error('Expected secondary text to be inside a card');

    const ratio = contrastRatioWcag(
      rgbFromCss(getComputedStyle(secondaryText).color),
      rgbFromCss(getComputedStyle(card).backgroundColor),
    );

    expect(ratio).toBeGreaterThanOrEqual(NORMAL_TEXT_THRESHOLD);
  });

  it('meets WCAG AA for text on the success badge', () => {
    render(<SystemComparisonTool />);
    const successBadge = screen.getAllByText('Active')[1];

    const ratio = contrastRatioWcag(
      rgbFromCss(getComputedStyle(successBadge).color),
      rgbFromCss(getComputedStyle(successBadge).backgroundColor),
    );

    expect(ratio).toBeGreaterThanOrEqual(NORMAL_TEXT_THRESHOLD);
  });

  it('requires a successful check and preserves selections for retry', () => {
    const onComplete = vi.fn();
    render(<SystemComparisonTool interactive onComplete={onComplete} />);

    expect(screen.getByText('Stage 1 of 1')).toBeInTheDocument();
    const adHocSecondaryText = screen.getByRole('button', { name: 'Last updated: today' });
    const adHocButton = screen.getByRole('button', { name: 'View' });
    expect(adHocSecondaryText).toHaveStyle({ cursor: 'pointer', outline: 'none' });
    expect(adHocButton).toHaveStyle({ cursor: 'pointer', outline: 'none' });
    expect(adHocSecondaryText).not.toHaveAttribute('title');
    expect(adHocButton).not.toHaveAttribute('title');
    fireEvent.click(adHocSecondaryText);
    fireEvent.click(adHocButton);
    fireEvent.click(screen.getByRole('button', { name: 'Active' }));
    expect(screen.getByText('Selected 3/4 inconsistencies')).toBeInTheDocument();
    expect(screen.queryByText('Found 3/4 inconsistencies')).not.toBeInTheDocument();
    expect(screen.queryByText(/Secondary text lightness:/)).not.toBeInTheDocument();
    expect(onComplete).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: 'check stage' }));

    expect(screen.getByText('Find every inconsistency before continuing. 1 remaining.')).toBeInTheDocument();
    expect(screen.getByText(/Success badge color:/)).toBeInTheDocument();
    expect(onComplete).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: 'try stage again' }));
    expect(screen.getByText('Selected 3/4 inconsistencies')).toBeInTheDocument();
    expect(screen.queryByText(/Success badge color:/)).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Settings/ }));
    expect(screen.getByText('Selected 4/4 inconsistencies')).toBeInTheDocument();
    expect(screen.queryByText(/Success badge color:/)).not.toBeInTheDocument();
    expect(onComplete).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: 'check stage' }));

    expect(screen.getByText(/All inconsistencies found/)).toBeInTheDocument();
    for (const label of ['Button color:', 'Success badge color:', 'Card surface color:', 'Secondary text lightness:']) {
      expect(screen.getByText(label)).toBeInTheDocument();
    }
    expect(onComplete).toHaveBeenCalledOnce();
  });
});
