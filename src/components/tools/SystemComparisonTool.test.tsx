import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
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
});
