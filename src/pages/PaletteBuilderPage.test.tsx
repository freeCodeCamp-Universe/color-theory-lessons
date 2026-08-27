import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';
import {
  clamp,
  getRelatedHues,
  hexToHsl,
  hexToRgb,
  hslToHex,
} from '../utils/color.ts';
import { PaletteBuilderPage } from './PaletteBuilderPage.tsx';

afterEach(() => cleanup());

function expectSwatchColor(element: HTMLElement, hex: string) {
  const { r, g, b } = hexToRgb(hex);
  expect(element).toHaveStyle({ backgroundColor: `rgb(${r}, ${g}, ${b})` });
}

async function enterPrimary(user: ReturnType<typeof userEvent.setup>, hex: string) {
  const input = screen.getByRole('textbox', { name: 'Hex color value' });
  await user.clear(input);
  await user.type(input, hex);
  await user.keyboard('{Enter}');
}

function expectedHarmony(primary: string, relationship: 'analogous' | 'complementary' | 'triadic') {
  const { h, s, l } = hexToHsl(primary);
  return getRelatedHues(h, relationship).map((relatedHue) => ({
    base: hslToHex(relatedHue, s, l),
    lighter: hslToHex(relatedHue, s, clamp(l + 25, 0, 96)),
    darker: hslToHex(relatedHue, s, clamp(l - 25, 5, 100)),
  }));
}

describe('PaletteBuilderPage color input', () => {
  it('shows validation for an invalid primary color and accepts a valid short hex', async () => {
    const user = userEvent.setup();
    render(<PaletteBuilderPage />);

    await enterPrimary(user, 'not-a-color');

    const input = screen.getByRole('textbox', { name: 'Hex color value' });
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByText('Error: enter a 3- or 6-digit hex color.')).toBeVisible();
    expect(screen.getByText('Pick a primary color to get started.')).toBeVisible();

    await enterPrimary(user, '#abc');

    expect(input).toHaveValue('#AABBCC');
    expect(input).toHaveAttribute('aria-invalid', 'false');
    expect(screen.queryByText('Error: enter a 3- or 6-digit hex color.')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Edit primary — #AABBCC' })).toBeVisible();
  });

  it('keeps RGB, HSL, and hex values synchronized', async () => {
    const user = userEvent.setup();
    render(<PaletteBuilderPage />);

    fireEvent.change(screen.getByRole('slider', { name: 'R channel' }), { target: { value: '255' } });
    fireEvent.change(screen.getByRole('slider', { name: 'G channel' }), { target: { value: '0' } });
    fireEvent.change(screen.getByRole('slider', { name: 'B channel' }), { target: { value: '0' } });

    expect(screen.getByRole('textbox', { name: 'Hex color value' })).toHaveValue('#FF0000');
    expect(screen.getByText(/H 0 .* S 100 .* L 50/)).toBeVisible();

    await user.click(screen.getByRole('button', { name: 'HSL' }));
    const hueSliders = screen.getAllByRole('slider', { name: 'Hue' });
    fireEvent.change(hueSliders.at(-1)!, { target: { value: '120' } });

    expect(screen.getByRole('textbox', { name: 'Hex color value' })).toHaveValue('#00FF00');
    expect(screen.getByRole('slider', { name: 'Saturation' })).toHaveValue('100');
    expect(screen.getByRole('slider', { name: 'Lightness' })).toHaveValue('50');

    await user.click(screen.getByRole('button', { name: 'RGB' }));
    expect(screen.getByRole('slider', { name: 'R channel' })).toHaveValue('0');
    expect(screen.getByRole('slider', { name: 'G channel' })).toHaveValue('255');
    expect(screen.getByRole('slider', { name: 'B channel' })).toHaveValue('0');
  });

  it('synchronizes a named swatch with the hex, RGB, and HSL displays', async () => {
    const user = userEvent.setup();
    render(<PaletteBuilderPage />);

    await user.click(screen.getByRole('button', { name: 'SWATCHES' }));
    await user.click(screen.getByRole('button', { name: 'rebeccapurple (#663399)' }));

    expect(screen.getByRole('textbox', { name: 'Hex color value' })).toHaveValue('#663399');
    expect(screen.getByText(/H 270 .* S 50 .* L 40/)).toBeVisible();

    await user.click(screen.getByRole('button', { name: 'RGB' }));
    expect(screen.getByRole('slider', { name: 'R channel' })).toHaveValue('102');
    expect(screen.getByRole('slider', { name: 'G channel' })).toHaveValue('51');
    expect(screen.getByRole('slider', { name: 'B channel' })).toHaveValue('153');
  });
});

describe('PaletteBuilderPage suggestions', () => {
  it('shows analogous, complementary, and triadic colors and variants for a known primary', async () => {
    const user = userEvent.setup();
    render(<PaletteBuilderPage />);
    await enterPrimary(user, '#336699');

    const cases = [
      ['analogous', ['analogous +30', 'analogous −30']],
      ['complementary', ['complement']],
      ['triadic', ['triadic +120', 'triadic +240']],
    ] as const;

    for (const [relationship, labels] of cases) {
      const expected = expectedHarmony('#336699', relationship);
      expect(screen.getByRole('heading', { name: relationship })).toBeVisible();

      labels.forEach((label, index) => {
        const base = screen.getByRole('button', { name: `Add ${label} to palette` });
        const lighter = screen.getByRole('button', { name: `Add ${label} lighter to palette` });
        const darker = screen.getByRole('button', { name: `Add ${label} darker to palette` });
        expectSwatchColor(base, expected[index].base);
        expectSwatchColor(lighter, expected[index].lighter);
        expectSwatchColor(darker, expected[index].darker);
        expect(base).toHaveAttribute('title', expect.stringContaining(expected[index].base.toUpperCase()));
      });
    }
  });

  it.each([
    ['lighter', '#6699CC', 'missing lighter colors'],
    ['darker', '#336699', 'missing darker colors'],
    ['neutral', '#668099', 'missing neutral colors'],
  ])('shows a labeled missing %s color suggestion', async (_, primary, heading) => {
    const user = userEvent.setup();
    render(<PaletteBuilderPage />);
    await enterPrimary(user, primary);
    await user.click(screen.getByRole('button', { name: 'Add analogous +30 to palette' }));

    expect(screen.getByRole('heading', { name: heading })).toBeVisible();
    const section = screen.getByRole('heading', { name: heading }).parentElement!;
    const suggestion = within(section).getAllByRole('button')[0];
    expect(suggestion).toHaveAccessibleName(/^Add #[0-9A-F]{6} to palette$/);
    expect(suggestion).toHaveAttribute('title', expect.stringMatching(/^#[0-9A-F]{6} — click to add$/));
    expect(suggestion.style.backgroundColor).not.toBe('');
  });
});

describe('PaletteBuilderPage palette editing', () => {
  it('adds suggested and custom colors without offering an added suggestion twice', async () => {
    const user = userEvent.setup();
    render(<PaletteBuilderPage />);
    await enterPrimary(user, '#336699');

    await user.click(screen.getByRole('button', { name: 'Add complement to palette' }));

    expect(screen.getByRole('button', { name: 'Edit complement — #996633' })).toBeVisible();
    expect(screen.queryByRole('button', { name: 'Add complement to palette' })).not.toBeInTheDocument();
    expect(screen.getAllByText('#996633')).not.toHaveLength(0);

    await user.click(screen.getByRole('button', { name: '+ add color' }));
    expect(screen.getByRole('button', { name: 'Edit custom 1 — #808080' })).toBeVisible();
  });

  it('updates palette-dependent displays when a color is edited or removed', async () => {
    const user = userEvent.setup();
    render(<PaletteBuilderPage />);
    await enterPrimary(user, '#336699');
    await user.click(screen.getByRole('button', { name: 'Add complement to palette' }));

    const paletteColumn = screen.getByRole('heading', { name: 'your palette' }).closest('[class*="paletteColumn"]') as HTMLElement;
    expect(within(paletteColumn).getAllByText('#996633').length).toBeGreaterThan(1);

    await user.click(screen.getByRole('button', { name: 'Edit complement — #996633' }));
    const editInput = screen.getAllByRole('textbox', { name: 'Hex color value' })[1];
    await user.clear(editInput);
    await user.type(editInput, '#000000');
    await user.keyboard('{Enter}');

    expect(screen.getByRole('button', { name: 'Edit complement — #000000' })).toBeVisible();
    expect(within(paletteColumn).queryByText('#996633')).not.toBeInTheDocument();
    expect(within(paletteColumn).getAllByText('#000000').length).toBeGreaterThan(1);
    const oldRgb = 'rgb(153, 102, 51)';
    expect(Array.from(paletteColumn.querySelectorAll<HTMLElement>('[style]')).some((element) =>
      element.getAttribute('style')?.includes(oldRgb),
    )).toBe(false);

    await user.click(screen.getByRole('button', { name: 'Remove complement' }));

    expect(screen.queryByRole('button', { name: /Edit complement/ })).not.toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'theme arranger' })).not.toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'contrast pairings' })).not.toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /Edit/ })).toHaveLength(1);
  });

  it('resets a customized palette to its primary color', async () => {
    const user = userEvent.setup();
    render(<PaletteBuilderPage />);
    await enterPrimary(user, '#336699');
    await user.click(screen.getByRole('button', { name: '+ add color' }));
    await user.click(screen.getByRole('button', { name: 'Edit custom 1 — #808080' }));

    const editInput = screen.getAllByRole('textbox', { name: 'Hex color value' })[1];
    await user.clear(editInput);
    await user.type(editInput, '#FFFFFF');
    await user.keyboard('{Enter}');
    await user.click(screen.getByRole('button', { name: '↺ reset' }));

    expect(screen.getByRole('button', { name: 'Edit primary — #336699' })).toBeVisible();
    expect(screen.queryByRole('button', { name: /Edit custom/ })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: '↺ reset' })).not.toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'theme arranger' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add complement to palette' })).toBeVisible();
  });
});
