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

  it('marks instructional previews as authored visuals without exempting their controls', () => {
    expect(read('src/components/tools/ColorSpaceLabTool.tsx')).toMatch(
      /<div data-authored-visual style={{ display: 'flex', gap: '0\.5rem', overflowX: 'auto' }}>/,
    );
    expect(read('src/pages/PaletteBuilderPage.tsx')).toMatch(
      /className={styles\.miniPreview}\s+data-authored-visual/,
    );
    expect(read('src/components/tools/BeforeAfterTool.tsx')).toMatch(
      /<div data-authored-visual style={{ background: 'var\(--surface\)'[^>]*>\s*{HIERARCHY_ITEMS\.map/,
    );

    const accessibilityRescue = read(
      'src/components/milestone/challenges/AccessibilityRescueChallenge.tsx',
    );
    expect(accessibilityRescue).toContain(
      '<span data-authored-visual className={styles.colorOnlyLabel}>Email address</span>',
    );
    expect(accessibilityRescue).toContain(
      '<div data-authored-visual className={styles.iconPreview}>',
    );
    expect(accessibilityRescue).not.toMatch(
      /<section data-authored-visual[^>]*className={styles\.block}/,
    );

    const accessibilityRescueCss = read(
      'src/components/milestone/challenges/AccessibilityRescueChallenge.module.css',
    );
    expect(accessibilityRescueCss).toMatch(
      /\.colorOnlyLabel\s*{[^}]*color: var\(--red\);[^}]*font-size: 0\.78rem;/s,
    );
  });

  it('gives unstyled enabled tool buttons a zero-specificity strong boundary', () => {
    const shellCss = read('src/components/tools/ToolShell.module.css');

    expect(shellCss).toMatch(
      /\.shell :where\(\s*button:not\(:disabled\):not\(\[class\]\):not\(\[data-authored-visual\]\):not\(\[data-authored-visual\] \*\)\s*\)\s*{\s*border: 1px solid var\(--border-strong\);\s*}/,
    );
  });

  it('uses the semantic focus token for custom application indicators', () => {
    expect(read('src/components/tools/HueWheel.tsx')).toContain('stroke="var(--focus-ring)"');
    expect(read('src/components/tools/ColorWheelTool.tsx')).toContain('stroke="var(--focus-ring)"');
    expect(read('src/components/tools/ExerciseStage.module.css')).toMatch(
      /\.title:focus-visible\s*{\s*outline: 2px solid var\(--focus-ring\);/,
    );
    expect(read('src/components/milestone/MilestonePlayer.module.css')).toMatch(
      /\.choice:has\(input:focus-visible\)\s*{\s*outline: 2px solid var\(--focus-ring\);/,
    );
  });

  it.each([
    ['src/components/tools/AdditiveSortTool.tsx', "active ? 'var(--accent-warning)' : 'var(--border-strong)'"],
    ['src/components/tools/AuditFlowTool.tsx', "isSelected ? 'var(--accent-warning)' : 'var(--border-strong)'"],
    ['src/components/tools/BackgroundShiftTool.tsx', ": 'var(--border-strong)';"],
    ['src/components/tools/ColorOnlyDetectorTool.tsx', "isSelected ? 'var(--accent-warning)' : 'var(--border-strong)'"],
    ['src/components/tools/ColorWheelTool.tsx', "selected ? 'var(--accent-warning)' : 'var(--border-strong)'"],
    ['src/components/tools/DarkTranslatorTool.tsx', "preview === m ? 'var(--accent-warning)' : 'var(--border-strong)'"],
    ['src/components/tools/InclusiveReviewTool.tsx', "simulationMode === mode.id ? 'var(--accent-warning)' : 'var(--border-strong)'"],
    ['src/components/tools/InterfaceGalleryTool.tsx', "mode === m.id ? 'var(--accent-warning)' : 'var(--border-strong)'"],
    ['src/components/tools/LogicFixerTool.tsx', "isSelected ? 'var(--accent-warning)' : 'var(--border-strong)'"],
    ['src/components/tools/MismatchExplainerTool.tsx', "isSelected ? 'var(--accent-warning)' : 'var(--border-strong)'"],
    ['src/components/tools/RGBMixerTool.tsx', "prediction === option.id ? 'var(--accent-warning)' : 'var(--border-strong)'"],
    ['src/components/tools/TextContrastLabTool.tsx', "activePair === i ? 'var(--accent-warning)' : 'var(--border-strong)'"],
  ] as const)('%s gives its enabled choices a strong default boundary', (file, boundary) => {
    expect(read(file)).toContain(boundary);
  });
});
