/// <reference types="node" />

import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const STYLE_DIRECTORY = 'src/components/milestone/challenges';

const CHALLENGE_STYLES = [
  'AccessibilityRescueChallenge.module.css',
  'ChannelPredictionChallenge.module.css',
  'DarkModeStressChallenge.module.css',
  'ReadInterfaceChallenge.module.css',
  'SemanticAuditChallenge.module.css',
  'SimulationSpotterChallenge.module.css',
  'ThemeFromScratchChallenge.module.css',
] as const;

const AUTHORED_SMALL_TYPE_COUNTS: Partial<Record<(typeof CHALLENGE_STYLES)[number], number>> = {
  'AccessibilityRescueChallenge.module.css': 2,
  'DarkModeStressChallenge.module.css': 1,
  'ThemeFromScratchChallenge.module.css': 3,
};

const TECHNICAL_OR_AUTHORED_MONO_COUNTS: Partial<Record<(typeof CHALLENGE_STYLES)[number], number>> = {
  'AccessibilityRescueChallenge.module.css': 1,
  'ChannelPredictionChallenge.module.css': 1,
  'DarkModeStressChallenge.module.css': 1,
  'ThemeFromScratchChallenge.module.css': 3,
};

function stylesheet(file: (typeof CHALLENGE_STYLES)[number]): string {
  return readFileSync(`${STYLE_DIRECTORY}/${file}`, 'utf8');
}

function declarations(css: string, selector: string): string {
  const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = css.match(new RegExp(`${escapedSelector}\\s*\\{([^}]*)\\}`));
  if (!match) throw new Error(`Missing selector ${selector}`);
  return match[1];
}

describe('milestone challenge application styles', () => {
  it.each(CHALLENGE_STYLES)('%s keeps learner UI at the 18px floor', (file) => {
    const css = stylesheet(file);
    const smallTypeCount = css.match(/font-size:\s*0\./g)?.length ?? 0;

    expect(smallTypeCount).toBe(AUTHORED_SMALL_TYPE_COUNTS[file] ?? 0);
  });

  it.each(CHALLENGE_STYLES)('%s limits monospace to technical or authored content', (file) => {
    const css = stylesheet(file);
    const monoCount = css.match(/font-family:\s*var\(--font-mono\)/g)?.length ?? 0;

    expect(monoCount).toBe(TECHNICAL_OR_AUTHORED_MONO_COUNTS[file] ?? 0);
  });

  it.each([
    ['AccessibilityRescueChallenge.module.css', '.toggle'],
    ['AccessibilityRescueChallenge.module.css', '.button'],
    ['ChannelPredictionChallenge.module.css', '.choice'],
    ['ChannelPredictionChallenge.module.css', '.swatch'],
    ['ChannelPredictionChallenge.module.css', '.button'],
    ['DarkModeStressChallenge.module.css', '.button'],
    ['ReadInterfaceChallenge.module.css', '.select'],
    ['ReadInterfaceChallenge.module.css', '.button'],
    ['SemanticAuditChallenge.module.css', '.swatch'],
    ['SemanticAuditChallenge.module.css', '.role'],
    ['SemanticAuditChallenge.module.css', '.problem select'],
    ['SemanticAuditChallenge.module.css', '.button'],
    ['SimulationSpotterChallenge.module.css', '.toggle'],
    ['SimulationSpotterChallenge.module.css', '.flag'],
    ['SimulationSpotterChallenge.module.css', '.select'],
    ['SimulationSpotterChallenge.module.css', '.button'],
    ['ThemeFromScratchChallenge.module.css', '.button'],
  ] as const)('%s gives enabled %s controls a strong boundary', (file, selector) => {
    expect(declarations(stylesheet(file), selector)).toContain(
      'border: 1px solid var(--border-strong)',
    );
  });

  it('contains the semantic conflict selector at narrow widths', () => {
    const css = stylesheet('SemanticAuditChallenge.module.css');

    expect(declarations(css, '.problem')).toContain('min-width: 0');
    expect(declarations(css, '.problem select')).toContain('width: 100%');
    expect(declarations(css, '.problem select')).toContain('min-width: 0');
    expect(declarations(css, '.problem select')).toContain('max-width: 100%');
  });
});
