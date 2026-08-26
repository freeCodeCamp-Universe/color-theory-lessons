/// <reference types="node" />

import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const globalCss = readFileSync('src/index.css', 'utf8');
const paletteCss = readFileSync('src/pages/PaletteBuilderPage.module.css', 'utf8');

describe('form control boundary styles', () => {
  it('lets component state classes override the shared enabled boundary', () => {
    expect(globalCss).toMatch(
      /:where\(\s*input:not\(\[type='color'\]\):not\(\[type='range'\]\):not\(:disabled\),\s*select:not\(:disabled\),\s*textarea:not\(:disabled\)\s*\)\s*{\s*border-color: var\(--border-strong\);\s*}/,
    );
    expect(paletteCss).toMatch(
      /\.hexInputInvalid\s*{\s*border-color: var\(--accent-danger\);\s*}/,
    );
  });
});
