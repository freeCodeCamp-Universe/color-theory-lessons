import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';
import {
  clamp,
  contrastRatioWcag,
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

type ThemeMode = 'dark' | 'light';

type ThemeRole =
  | 'background'
  | 'surface'
  | 'primary text'
  | 'secondary text'
  | 'accent'
  | 'accent 2';

type ThemeRoles = Record<ThemeRole, string>;

async function addCustomColor(
  user: ReturnType<typeof userEvent.setup>,
  hex: string,
) {
  await user.click(screen.getByRole('button', { name: '+ add color' }));
  const customSwatches = screen.getAllByRole('button', { name: /Edit custom \d+ — #808080/ });
  await user.click(customSwatches.at(-1)!);
  const editInput = screen.getAllByRole('textbox', { name: 'Hex color value' })[1];
  fireEvent.change(editInput, { target: { value: hex } });
  fireEvent.keyDown(editInput, { key: 'Enter' });
}

function getModePanel(mode: ThemeMode) {
  return screen.getByRole('heading', { name: `${mode} mode` })
    .closest('[class*="modePanel"]') as HTMLElement;
}

function getRoleRow(panel: HTMLElement, role: ThemeRole) {
  return within(panel).getByText(role, { selector: 'span' })
    .closest('[class*="roleRow"]') as HTMLElement;
}

function expectedBadge(a: string, b: string) {
  const ratio = contrastRatioWcag(hexToRgb(a), hexToRgb(b));
  const level = ratio >= 7 ? 'AAA' : ratio >= 4.5 ? 'AA' : 'fail';
  return `${level} ${ratio.toFixed(1)}:1`;
}

function cssColor(hex: string) {
  const { r, g, b } = hexToRgb(hex);
  return `rgb(${r}, ${g}, ${b})`;
}

function getRenderedContrastRows() {
  const matrix = screen.getByRole('heading', { name: 'contrast pairings' }).parentElement!;

  return within(matrix).getAllByText('sample').map((sample) => {
    const previewCell = sample.parentElement!;
    const pairCell = previewCell.previousElementSibling!
      .previousElementSibling!
      .previousElementSibling! as HTMLElement;
    const swatches = Array.from(
      pairCell.querySelectorAll<HTMLElement>('[class*="matrixHeaderSwatch"]'),
    );

    return `${swatches[0].style.backgroundColor} on ${swatches[1].style.backgroundColor}`;
  });
}

function expectThemeChecks(panel: HTMLElement, roles: ThemeRoles) {
  const checks = Array.from(panel.querySelectorAll<HTMLElement>('[class*="checkRow"]'));
  expect(checks[0]).toHaveTextContent(`text/bg: ${expectedBadge(roles['primary text'], roles.background)}`);
  expect(checks[1]).toHaveTextContent(`text/surface: ${expectedBadge(roles['secondary text'], roles.surface)}`);
  expect(checks[2]).toHaveTextContent(`accent/bg: ${expectedBadge(roles.accent, roles.background)}`);
}

function expectThemePanel(panel: HTMLElement, roles: ThemeRoles) {
  for (const [role, hex] of Object.entries(roles) as [ThemeRole, string][]) {
    expect(getRoleRow(panel, role)).toHaveTextContent(hex.toUpperCase());
  }

  const preview = within(panel).getByText('Card heading').closest('[data-authored-visual]') as HTMLElement;
  const card = within(panel).getByText('Card heading').parentElement!;
  const primaryText = within(panel).getByText('Card heading');
  const secondaryText = within(panel).getByText('Secondary body text on surface.');
  const accent = within(panel).getByText('accent button');
  const accentSecondary = within(panel).getByText('secondary action');

  expect(preview).toHaveStyle({
    backgroundColor: cssColor(roles.background),
    borderColor: cssColor(roles.surface),
  });
  expect(card).toHaveStyle({ backgroundColor: cssColor(roles.surface) });
  expect(primaryText).toHaveStyle({ color: cssColor(roles['primary text']) });
  expect(secondaryText).toHaveStyle({ color: cssColor(roles['secondary text']) });
  expect(accent).toHaveStyle({ backgroundColor: cssColor(roles.accent) });
  expect(accentSecondary).toHaveStyle({ backgroundColor: cssColor(roles['accent 2']) });

  expectThemeChecks(panel, roles);
}

function expectThemeRoleChange(
  panel: HTMLElement,
  role: ThemeRole,
  roles: ThemeRoles,
) {
  expect(getRoleRow(panel, role)).toHaveTextContent(roles[role].toUpperCase());

  const assertions: Record<ThemeRole, () => void> = {
    background: () => expect(
      within(panel).getByText('Card heading').closest('[data-authored-visual]'),
    ).toHaveStyle({ backgroundColor: cssColor(roles.background) }),
    surface: () => expect(within(panel).getByText('Card heading').parentElement)
      .toHaveStyle({ backgroundColor: cssColor(roles.surface) }),
    'primary text': () => expect(within(panel).getByText('Card heading'))
      .toHaveStyle({ color: cssColor(roles['primary text']) }),
    'secondary text': () => expect(within(panel).getByText('Secondary body text on surface.'))
      .toHaveStyle({ color: cssColor(roles['secondary text']) }),
    accent: () => expect(within(panel).getByText('accent button'))
      .toHaveStyle({ backgroundColor: cssColor(roles.accent) }),
    'accent 2': () => expect(within(panel).getByText('secondary action'))
      .toHaveStyle({ backgroundColor: cssColor(roles['accent 2']) }),
  };

  assertions[role]();
  expectThemeChecks(panel, roles);
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
    ['muted', '#668099', 'missing neutral colors'],
  ] as const)('shows the expected missing %s color suggestion', async (variant, primary, heading) => {
    const user = userEvent.setup();
    render(<PaletteBuilderPage />);
    await enterPrimary(user, primary);
    await user.click(screen.getByRole('button', { name: 'Add analogous +30 to palette' }));

    const { h, s, l } = hexToHsl(primary);
    const expected = variant === 'lighter'
      ? hslToHex(h, s, clamp(l + 25, 0, 96))
      : variant === 'darker'
        ? hslToHex(h, s, clamp(l - 25, 5, 100))
        : hslToHex(h, Math.round(s * 0.4), l);
    expect(screen.getByRole('heading', { name: heading })).toBeVisible();
    const section = screen.getByRole('heading', { name: heading }).parentElement!;
    const suggestion = within(section).getByRole('button', {
      name: `Add ${expected.toUpperCase()} to palette`,
    });
    expect(suggestion).toHaveAttribute('title', `${expected.toUpperCase()} — click to add`);
    expectSwatchColor(suggestion, expected);
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

  it('does not add the default custom color more than once', async () => {
    const user = userEvent.setup();
    render(<PaletteBuilderPage />);
    await enterPrimary(user, '#336699');

    const addButton = screen.getByRole('button', { name: '+ add color' });
    await user.click(addButton);
    await user.click(addButton);

    expect(screen.getAllByRole('button', { name: /Edit custom \d+ — #808080/ }))
      .toHaveLength(1);
    expect(screen.getByRole('status')).toHaveTextContent(
      '#808080 is already in your palette.',
    );
    expect(screen.getAllByRole('textbox', { name: 'Hex color value' })[1])
      .toHaveValue('#808080');
  });

  it('rejects an edit that matches another palette color', async () => {
    const user = userEvent.setup();
    render(<PaletteBuilderPage />);
    await enterPrimary(user, '#336699');
    await user.click(screen.getByRole('button', { name: '+ add color' }));
    await user.click(screen.getByRole('button', { name: 'Edit custom 1 — #808080' }));

    const editInput = screen.getAllByRole('textbox', { name: 'Hex color value' })[1];
    await user.clear(editInput);
    await user.type(editInput, '#336699');
    await user.keyboard('{Enter}');

    expect(editInput).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByText('Error: that color is already in your palette.')).toBeVisible();
    expect(screen.getByRole('button', { name: 'Edit custom 1 — #808080' })).toBeVisible();
    expect(screen.getAllByRole('button', { name: /Edit .* — #336699/ })).toHaveLength(1);
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

describe('PaletteBuilderPage contrast pairings', () => {
  it.each([
    ['fail', '#777777'],
    ['AA', '#767676'],
    ['AAA', '#595959'],
  ] as const)('classifies the %s boundary from the displayed WCAG ratio', async (level, foreground) => {
    const user = userEvent.setup();
    render(<PaletteBuilderPage />);
    await enterPrimary(user, '#FFFFFF');
    await addCustomColor(user, foreground);

    const ratio = contrastRatioWcag(hexToRgb(foreground), hexToRgb('#FFFFFF'));
    const matrix = screen.getByRole('heading', { name: 'contrast pairings' }).parentElement!;
    expect(within(matrix).getByText(`${ratio.toFixed(1)}:1`, { selector: '[class*="matrixRatio"]' }))
      .toBeVisible();
    expect(within(matrix).getByText(`${level} ${ratio.toFixed(1)}:1`)).toBeVisible();
  });

  it('updates the matrix when a palette color is added, edited, and removed', async () => {
    const user = userEvent.setup();
    render(<PaletteBuilderPage />);
    await enterPrimary(user, '#000000');

    expect(screen.queryByRole('heading', { name: 'contrast pairings' })).not.toBeInTheDocument();

    await addCustomColor(user, '#FFFFFF');
    const matrix = screen.getByRole('heading', { name: 'contrast pairings' }).parentElement!;
    expect(within(matrix).getByText('21.0:1', { selector: '[class*="matrixRatio"]' })).toBeVisible();
    expect(within(matrix).getByText('AAA 21.0:1')).toBeVisible();

    await user.click(screen.getByRole('button', { name: 'Edit custom 1 — #FFFFFF' }));
    const editInput = screen.getAllByRole('textbox', { name: 'Hex color value' })[1];
    await user.clear(editInput);
    await user.type(editInput, '#777777');
    await user.keyboard('{Enter}');

    const editedRatio = contrastRatioWcag(hexToRgb('#000000'), hexToRgb('#777777'));
    expect(within(matrix).queryByText('21.0:1', { selector: '[class*="matrixRatio"]' })).not.toBeInTheDocument();
    expect(within(matrix).getByText(`${editedRatio.toFixed(1)}:1`, { selector: '[class*="matrixRatio"]' }))
      .toBeVisible();
    expect(within(matrix).getByText(`AA ${editedRatio.toFixed(1)}:1`)).toBeVisible();

    await user.click(screen.getByRole('button', { name: 'Remove custom 1' }));
    expect(screen.queryByRole('heading', { name: 'contrast pairings' })).not.toBeInTheDocument();
  });

  it('keeps pairs at or above the 30-point lightness boundary', async () => {
    const user = userEvent.setup();
    render(<PaletteBuilderPage />);
    await enterPrimary(user, '#000000');
    await addCustomColor(user, '#4A4A4A');
    await addCustomColor(user, '#4D4D4D');
    await addCustomColor(user, '#4F4F4F');

    expect(hexToHsl('#4A4A4A').l).toBe(29);
    expect(hexToHsl('#4D4D4D').l).toBe(30);
    expect(hexToHsl('#4F4F4F').l).toBe(31);

    const renderedPairs = getRenderedContrastRows();
    expect(renderedPairs).toEqual([
      `${cssColor('#000000')} on ${cssColor('#4F4F4F')}`,
      `${cssColor('#000000')} on ${cssColor('#4D4D4D')}`,
    ]);
    expect(renderedPairs).not.toContain(
      `${cssColor('#000000')} on ${cssColor('#4A4A4A')}`,
    );
  });

  it('limits the rendered contrast matrix to 20 rows', async () => {
    const user = userEvent.setup();
    render(<PaletteBuilderPage />);
    const lowColors = [0, 1, 2, 3, 4].map((lightness) =>
      hslToHex(0, 0, lightness));
    const highColors = [60, 61, 62, 63, 64].map((lightness) =>
      hslToHex(0, 0, lightness));

    await enterPrimary(user, lowColors[0]);
    for (const color of [...lowColors.slice(1), ...highColors]) {
      await addCustomColor(user, color);
    }

    expect(getRenderedContrastRows()).toHaveLength(20);
  }, 10_000);
});

describe('PaletteBuilderPage theme arranger', () => {
  it('assigns all light and dark roles from palette order and luminance', async () => {
    const user = userEvent.setup();
    render(<PaletteBuilderPage />);
    await enterPrimary(user, '#336699');
    await addCustomColor(user, '#FFFFFF');
    await addCustomColor(user, '#000000');
    await addCustomColor(user, '#808080');

    expectThemePanel(getModePanel('dark'), {
      background: '#000000',
      surface: '#336699',
      'primary text': '#FFFFFF',
      'secondary text': '#808080',
      accent: '#336699',
      'accent 2': '#FFFFFF',
    });
    expectThemePanel(getModePanel('light'), {
      background: '#FFFFFF',
      surface: '#808080',
      'primary text': '#000000',
      'secondary text': '#336699',
      accent: '#336699',
      'accent 2': '#FFFFFF',
    });
  });

  it.each([
    {
      mode: 'dark' as const,
      roles: {
        background: '#000000', surface: '#336699', 'primary text': '#FFFFFF',
        'secondary text': '#FFFF00', accent: '#336699', 'accent 2': '#FFFFFF',
      },
      targets: {
        background: '#FFFFFF', surface: '#000000', 'primary text': '#336699',
        'secondary text': '#FF0000', accent: '#808080', 'accent 2': '#FFFF00',
      },
    },
    {
      mode: 'light' as const,
      roles: {
        background: '#FFFFFF', surface: '#FFFF00', 'primary text': '#000000',
        'secondary text': '#336699', accent: '#336699', 'accent 2': '#FFFFFF',
      },
      targets: {
        background: '#000000', surface: '#FFFFFF', 'primary text': '#FFFF00',
        'secondary text': '#336699', accent: '#FF0000', 'accent 2': '#808080',
      },
    },
  ] satisfies { mode: ThemeMode; roles: ThemeRoles; targets: ThemeRoles }[])(
    'updates every $mode mode role picker, preview property, and related contrast result',
    async ({ mode, roles, targets }) => {
      const user = userEvent.setup();
      render(<PaletteBuilderPage />);
      await enterPrimary(user, '#336699');
      for (const hex of ['#FFFFFF', '#000000', '#FF0000', '#FFFF00', '#808080']) {
        await addCustomColor(user, hex);
      }

      const panel = getModePanel(mode);
      expectThemePanel(panel, roles);

      for (const role of Object.keys(targets) as ThemeRole[]) {
        const target = targets[role];
        await user.click(within(getRoleRow(panel, role)).getByRole('button', {
          name: `Change ${mode} ${role} color`,
        }));
        await user.click(within(panel).getByRole('button', { name: `Select ${target}` }));
        roles[role] = target;
        expectThemeRoleChange(panel, role, roles);
      }
    },
    15_000,
  );

  it('adds an accessible suggestion and assigns it to the named role', async () => {
    const user = userEvent.setup();
    render(<PaletteBuilderPage />);
    await enterPrimary(user, '#000000');
    await addCustomColor(user, '#FFFFFF');

    const suggestions = screen.getByRole('heading', { name: 'accessibility suggestions' }).parentElement!;
    const apply = within(suggestions).getByRole('button', {
      name: /Add #[0-9A-F]{6} and assign as accent/,
    });
    const suggestedHex = apply.getAttribute('aria-label')!.match(/#[0-9A-F]{6}/)![0];

    await user.click(apply);

    const darkPanel = getModePanel('dark');
    expect(getRoleRow(darkPanel, 'accent')).toHaveTextContent(suggestedHex);
    expect(within(darkPanel).getByText('accent button')).toHaveStyle({
      backgroundColor: (() => {
        const { r, g, b } = hexToRgb(suggestedHex);
        return `rgb(${r}, ${g}, ${b})`;
      })(),
    });
    const accentCheck = Array.from(
      darkPanel.querySelectorAll<HTMLElement>('[class*="checkRow"]'),
    )[2];
    expect(accentCheck).toHaveTextContent(`accent/bg: ${expectedBadge(suggestedHex, '#000000')}`);
    expect(screen.getByRole('button', {
      name: new RegExp(`Edit lighter accent — ${suggestedHex}`),
    })).toBeVisible();
  });

  it('remaps every role that uses an edited palette color and clears roles below two colors', async () => {
    const user = userEvent.setup();
    render(<PaletteBuilderPage />);
    await enterPrimary(user, '#000000');
    await addCustomColor(user, '#FFFFFF');

    const darkPanel = getModePanel('dark');
    await user.click(within(getRoleRow(darkPanel, 'surface')).getByRole('button', {
      name: 'Change dark surface color',
    }));
    await user.click(within(darkPanel).getByRole('button', { name: 'Select #000000' }));
    expect(getRoleRow(darkPanel, 'background')).toHaveTextContent('#000000');
    expect(getRoleRow(darkPanel, 'surface')).toHaveTextContent('#000000');
    expect(getRoleRow(darkPanel, 'accent')).toHaveTextContent('#000000');

    await user.click(screen.getByRole('button', { name: 'Edit primary — #000000' }));
    const editInput = screen.getAllByRole('textbox', { name: 'Hex color value' })[1];
    await user.clear(editInput);
    await user.type(editInput, '#112233');
    await user.keyboard('{Enter}');

    for (const role of ['background', 'surface', 'accent'] as ThemeRole[]) {
      expect(getRoleRow(darkPanel, role)).toHaveTextContent('#112233');
      expect(getRoleRow(darkPanel, role)).not.toHaveTextContent('#000000');
    }
    expect(within(darkPanel).getByText('accent button')).toHaveStyle({
      backgroundColor: 'rgb(17, 34, 51)',
    });

    await user.click(screen.getByRole('button', { name: 'Remove custom 1' }));
    expect(screen.queryByRole('heading', { name: 'theme arranger' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Change (dark|light)/ })).not.toBeInTheDocument();

    await addCustomColor(user, '#FFFFFF');
    const restoredDarkPanel = getModePanel('dark');
    expect(getRoleRow(restoredDarkPanel, 'background')).toHaveTextContent('#112233');
    expect(getRoleRow(restoredDarkPanel, 'surface')).toHaveTextContent('#FFFFFF');
    expect(getRoleRow(restoredDarkPanel, 'accent')).toHaveTextContent('#112233');
  });
});
