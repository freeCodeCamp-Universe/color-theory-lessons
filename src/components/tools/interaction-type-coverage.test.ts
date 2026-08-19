import { describe, it, expect } from 'vitest';
import { lessonRegistry } from '../../lessons/lesson-registry.ts';
import type { InteractionType } from '../../types/lesson.ts';

/**
 * Every value in the InteractionType union must be used by at least one
 * configured lesson. This list is kept in sync with the union manually;
 * the TypeScript compiler enforces exhaustiveness in ToolRenderer and
 * tool-prefetch via the `never` default branch.
 */
const ALL_INTERACTION_TYPES: InteractionType[] = [
  'color-wheel',
  'rgb-mixer',
  'temperature-sorter',
  'contrast-checker',
  'before-after',
  'slider-explore',
  'additive-sort',
  'logic-fixer',
  'mismatch-explainer',
  'background-shift',
  'format-reveal',
  'hex-rgb-editor',
  'hsl-playground',
  'alpha-layer',
  'theme-sandbox',
  'token-map',
  'color-space-lab',
  'eye-diagram',
  'vision-cards',
  'interface-gallery',
  'color-only-detector',
  'state-workshop',
  'inclusive-review',
  'text-contrast-lab',
  'component-checker',
  'audit-flow',
  'pattern-repair',
  'system-comparison',
  'role-builder',
  'brand-pressure',
  'dark-translator',
  'chart-tuner',
  'system-stress',
];

describe('InteractionType coverage', () => {
  const usedTypes = new Set(lessonRegistry.map((l) => l.interactionType));

  it.each(ALL_INTERACTION_TYPES)('%s is used by at least one lesson', (type) => {
    expect(usedTypes.has(type)).toBe(true);
  });

  it('no lesson uses an interaction type outside the known set', () => {
    for (const lesson of lessonRegistry) {
      expect(ALL_INTERACTION_TYPES).toContain(lesson.interactionType);
    }
  });
});
