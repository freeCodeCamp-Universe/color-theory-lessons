/// <reference types="node" />

import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { contrastRatioWcag, hexToRgb, type RGB } from './utils/color.ts';

const css = readFileSync('src/index.css', 'utf8');

function declarations(selector: string): Record<string, string> {
  const selectorStart = css.indexOf(selector);
  const blockStart = css.indexOf('{', selectorStart);
  const blockEnd = css.indexOf('}', blockStart);
  const block = css.slice(blockStart + 1, blockEnd);

  return Object.fromEntries(
    [...block.matchAll(/--([\w-]+):\s*([^;]+);/g)].map((match) => [match[1], match[2].trim()]),
  );
}

const root = declarations(':root {');
const dark = declarations(":root[data-theme='dark']");
const light = declarations(":root[data-theme='light']");

function resolveColor(theme: Record<string, string>, token: string): string {
  const value = theme[token] ?? root[token];
  if (!value) throw new Error(`Missing color token: ${token}`);
  const reference = value.match(/^var\(--([\w-]+)\)$/)?.[1];
  return reference ? resolveColor(theme, reference) : value;
}

function ratio(theme: Record<string, string>, foreground: string, background: string): number {
  return contrastRatioWcag(
    hexToRgb(resolveColor(theme, foreground)),
    hexToRgb(resolveColor(theme, background)),
  );
}

function mix(foreground: RGB, background: RGB, foregroundPercentage: number): RGB {
  return {
    r: foreground.r * foregroundPercentage + background.r * (1 - foregroundPercentage),
    g: foreground.g * foregroundPercentage + background.g * (1 - foregroundPercentage),
    b: foreground.b * foregroundPercentage + background.b * (1 - foregroundPercentage),
  };
}

function badgeRatio(
  theme: Record<string, string>,
  foreground: string,
  foregroundPercentage: number,
): number {
  const foregroundRgb = hexToRgb(resolveColor(theme, foreground));
  const surfaceRgb = hexToRgb(resolveColor(theme, 'surface'));
  return contrastRatioWcag(
    foregroundRgb,
    mix(foregroundRgb, surfaceRgb, foregroundPercentage),
  );
}

describe.each([
  ['dark', dark],
  ['light', light],
] as const)('%s theme contrast', (_name, theme) => {
  const textColors = [
    'primary-foreground',
    'secondary-foreground',
    'muted',
    'accent-warning',
    'accent-link',
    'accent-success',
    'accent-danger',
    'accent-emphasis',
  ];
  const textBackgrounds = ['primary-background', 'secondary-background', 'surface'];

  it.each(textColors.flatMap((foreground) => (
    textBackgrounds.map((background) => [foreground, background] as const)
  )))('%s reaches AAA on %s', (foreground, background) => {
    expect(ratio(theme, foreground, background)).toBeGreaterThanOrEqual(7);
  });

  it('keeps CTA text at AAA', () => {
    expect(ratio(theme, 'cta-foreground', 'accent-cta')).toBeGreaterThanOrEqual(7);
  });

  it.each(['primary-background', 'secondary-background', 'surface', 'hover-background'])(
    'keeps the focus ring distinguishable on %s',
    (background) => {
      expect(ratio(theme, 'focus-ring', background)).toBeGreaterThanOrEqual(3);
    },
  );

  it.each(['primary-background', 'secondary-background', 'surface'])(
    'keeps required control boundaries distinguishable on %s',
    (background) => {
      expect(ratio(theme, 'border-strong', background)).toBeGreaterThanOrEqual(3);
    },
  );

  it('keeps selected text at AAA', () => {
    expect(ratio(theme, 'selection-foreground', 'selection-background')).toBeGreaterThanOrEqual(7);
  });

  it.each([
    ['accent-link', 'badge-link-background', 6],
    ['accent-success', 'badge-success-background', 6],
    ['accent-warning', 'badge-warning-background', 6],
    ['accent-danger', 'badge-danger-background', 5],
  ] as const)('%s reaches AAA on its rendered %s tint', (foreground, background, percentage) => {
    expect(dark[background]).toBe(
      `color-mix(in srgb, var(--${foreground}) ${percentage}%, var(--surface))`,
    );
    expect(badgeRatio(theme, foreground, percentage / 100)).toBeGreaterThanOrEqual(7);
  });
});

describe('authored lesson visual tokens', () => {
  it.each(['yellow', 'blue', 'green', 'red', 'purple'])('keeps --%s fixed across themes', (token) => {
    expect(resolveColor(light, token)).toBe(resolveColor(dark, token));
  });
});
