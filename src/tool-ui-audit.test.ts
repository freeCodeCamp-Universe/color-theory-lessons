/// <reference types="node" />

import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (path: string) => readFileSync(path, 'utf8');

describe('tool UI audit regressions', () => {
  it('collapses shared two-column tool grids below 500px', () => {
    const shellCss = read('src/components/tools/ToolShell.module.css');

    expect(shellCss).toMatch(
      /\.twoColumnGrid\s*{[^}]*grid-template-columns:\s*repeat\(2, minmax\(0, 1fr\)\)/s,
    );
    expect(shellCss).toMatch(
      /@media \(max-width: 499px\)[^{]*{[^}]*\.twoColumnGrid\s*{[^}]*grid-template-columns:\s*minmax\(0, 1fr\)/s,
    );

    for (const file of [
      'src/components/tools/ThemeSandboxTool.tsx',
      'src/components/tools/ColorOnlyDetectorTool.tsx',
      'src/components/tools/StateWorkshopTool.tsx',
    ]) {
      expect(read(file)).toContain('className={shellStyles.twoColumnGrid}');
    }
  });

  it('uses the AAA warning role for the System Comparison instruction', () => {
    const source = read('src/components/tools/SystemComparisonTool.tsx');

    expect(source).toContain(
      "<span style={{ color: 'var(--accent-warning)' }}>(click inconsistencies)</span>",
    );
    expect(source).not.toContain("color: '#f59e0b'");
  });

  it('uses proportional type for System Stress context legends', () => {
    const source = read('src/components/tools/SystemStressTestTool.tsx');

    expect(source).toContain(
      "<legend style={{ fontFamily: 'var(--font-sans)'",
    );
    expect(source).not.toContain(
      "<legend style={{ fontFamily: 'var(--font-mono)'",
    );
  });

  it('marks only the Color Space and Palette Builder previews as authored visuals', () => {
    expect(read('src/components/tools/ColorSpaceLabTool.tsx')).toMatch(
      /<div data-authored-visual style={{ display: 'flex', gap: '0\.5rem', overflowX: 'auto' }}>/,
    );
    expect(read('src/pages/PaletteBuilderPage.tsx')).toMatch(
      /className={styles\.miniPreview}\s+data-authored-visual/,
    );
  });
});
