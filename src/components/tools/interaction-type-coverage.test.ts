import { describe, it, expect } from 'vitest';
import { lessonRegistry } from '../../lessons/lesson-registry.ts';
import { INTERACTION_TYPES } from '../../types/lesson.ts';

/**
 * Every value in the InteractionType union must be used by at least one
 * configured lesson. InteractionType is derived from INTERACTION_TYPES,
 * while the TypeScript compiler enforces exhaustiveness in ToolRenderer
 * and tool-prefetch via the `never` default branch.
 */
describe('InteractionType coverage', () => {
  const usedTypes = new Set(lessonRegistry.map((l) => l.interactionType));

  it.each(INTERACTION_TYPES)('%s is used by at least one lesson', (type) => {
    expect(usedTypes.has(type)).toBe(true);
  });

  it('no lesson uses an interaction type outside the known set', () => {
    for (const lesson of lessonRegistry) {
      expect(INTERACTION_TYPES).toContain(lesson.interactionType);
    }
  });
});
