/// <reference types="node" />

import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const globalCss = readFileSync('src/index.css', 'utf8');
const paletteCss = readFileSync('src/pages/PaletteBuilderPage.module.css', 'utf8');
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
        "isValidHex(val) ? 'var(--border-strong)' : 'var(--accent-danger)'",
      );
    }
  });

  it('restores the visible focus ring on Palette Builder sliders', () => {
    expect(paletteCss).toMatch(
      /\.slider:focus-visible\s*{\s*outline:\s*2px solid var\(--focus-ring\);\s*outline-offset:\s*2px;\s*}/,
    );
  });
});
