import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { hexToRgb, hslToHex } from '../../utils/color.ts';
import { FormatRevealTool } from './FormatRevealTool.tsx';

afterEach(() => cleanup());

const ELEMENT_LABELS = [
  'Nav background',
  'Nav text',
  'Hero surface',
  'CTA button',
  'Button text',
  'Card background',
  'Card border',
  'Success accent',
];

function parseRgbString(value: string) {
  const match = value.match(/^rgb\((\d+) (\d+) (\d+)\)$/);
  if (!match) throw new Error(`Invalid RGB string: ${value}`);
  return { r: Number(match[1]), g: Number(match[2]), b: Number(match[3]) };
}

function parseHslString(value: string) {
  const match = value.match(/^hsl\(([\d.]+) ([\d.]+)% ([\d.]+)%\)$/);
  if (!match) throw new Error(`Invalid HSL string: ${value}`);
  return { h: Number(match[1]), s: Number(match[2]), l: Number(match[3]) };
}

describe('FormatRevealTool', () => {
  it('displays HSL values that round-trip to the source RGB for every color', () => {
    render(<FormatRevealTool />);

    for (const label of ELEMENT_LABELS) {
      fireEvent.click(screen.getByLabelText(label));

      const hexValue = screen.getByText(/^#[0-9A-F]{6}$/).textContent;
      const rgbValue = screen.getByText(/^rgb\(/).textContent;
      const hslValue = screen.getByText(/^hsl\(/).textContent;

      expect(hexValue).toBeTruthy();
      expect(rgbValue).toBeTruthy();
      expect(hslValue).toBeTruthy();

      const sourceRgb = parseRgbString(rgbValue!);
      const { h, s, l } = parseHslString(hslValue!);
      const roundTripRgb = hexToRgb(hslToHex(h, s, l).toUpperCase());

      expect(roundTripRgb).toEqual(sourceRgb);
      expect(hslToHex(h, s, l).toUpperCase()).toBe(hexValue);
    }
  });
});
