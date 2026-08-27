/// <reference types="node" />

import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const globalCss = readFileSync('src/index.css', 'utf8');
const paletteCss = readFileSync('src/pages/PaletteBuilderPage.module.css', 'utf8');
const paletteSource = readFileSync('src/pages/PaletteBuilderPage.tsx', 'utf8');
const brandPressureSource = readFileSync('src/components/tools/BrandPressureTool.tsx', 'utf8');
const darkTranslatorSource = readFileSync('src/components/tools/DarkTranslatorTool.tsx', 'utf8');
const roleBuilderSource = readFileSync('src/components/tools/RoleBuilderTool.tsx', 'utf8');

describe('form control boundary styles', () => {
  it('keeps shared defaults at zero specificity so component state classes override them', () => {
    expect(globalCss).toMatch(
      /:where\(\s*input:not\(\[type='color'\]\):not\(\[type='range'\]\):not\(:disabled\),\s*select:not\(:disabled\),\s*textarea:not\(:disabled\)\s*\)\s*{\s*border-color: var\(--border-strong\);\s*}/,
    );
    expect(paletteCss).toMatch(
      /\.hexInputInvalid\s*{\s*border-color: var\(--accent-danger\);\s*}/,
    );
  });

  it('gives component-styled valid inputs a strong boundary', () => {
    expect(paletteCss).toMatch(
      /\.hexInput\s*{[^}]*border: 1px solid var\(--border-strong\);/s,
    );
    expect(paletteCss).toMatch(
      /\.editInlineInput\s*{[^}]*border: 1px solid var\(--border-strong\);/s,
    );

    for (const source of [brandPressureSource, darkTranslatorSource, roleBuilderSource]) {
      expect(source).toContain(
        "invalid ? 'var(--accent-danger)' : 'var(--border-strong)'",
      );
    }
  });

  it('restores the visible focus ring on Palette Builder sliders', () => {
    expect(paletteCss).toMatch(
      /\.slider:focus-visible\s*{\s*outline:\s*2px solid var\(--focus-ring\);\s*outline-offset:\s*2px;\s*}/,
    );
  });

  it('pairs Palette Builder invalid borders with described text errors', () => {
    expect(paletteSource).toMatch(
      /aria-invalid={!isValid}\s+aria-describedby={!isValid \? 'palette-primary-hex-error' : undefined}/,
    );
    expect(paletteSource).toMatch(
      /aria-invalid={parseHex\(editHexInput\) === null}\s+aria-describedby={parseHex\(editHexInput\) === null \? `palette-color-\$\{i}-hex-error` : undefined}/,
    );
    expect(paletteSource.match(/Error: enter a 3- or 6-digit hex color\./g)).toHaveLength(2);
    expect(paletteCss).toMatch(
      /\.inputError\s*{[^}]*color: var\(--accent-danger\);[^}]*font-family: var\(--font-sans\);[^}]*font-size: 1rem;/s,
    );
    expect(paletteCss).toMatch(
      /\.twoColumn\s*{[^}]*grid-template-columns: repeat\(2, minmax\(0, 1fr\)\);/s,
    );
    expect(paletteCss).toMatch(
      /@media \(max-width: 800px\)\s*{\s*\.twoColumn\s*{\s*grid-template-columns: minmax\(0, 1fr\);/,
    );
    expect(paletteCss).toMatch(
      /\.arrangerRow\s*{[^}]*grid-template-columns: repeat\(2, minmax\(0, 1fr\)\);/s,
    );
    expect(paletteCss).toMatch(
      /@media \(max-width: 800px\)\s*{\s*\.arrangerRow\s*{\s*grid-template-columns: minmax\(0, 1fr\);/,
    );
  });
});
