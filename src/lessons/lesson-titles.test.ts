import { describe, it, expect } from 'vitest';
import { units } from '../data/units.ts';
import { lessonRegistry } from './lesson-registry.ts';
import { LESSON_TITLES } from './lesson-titles.ts';

describe('lesson title consistency', () => {
  it('every lesson ID in the registry resolves to a title in LESSON_TITLES', () => {
    for (const lesson of lessonRegistry) {
      expect(
        LESSON_TITLES[lesson.id],
        `Lesson "${lesson.id}" has no entry in LESSON_TITLES`,
      ).toBeDefined();
    }
  });

  it('every lesson ID in the unit configuration resolves to a registered lesson and title', () => {
    const registryIds = new Set(lessonRegistry.map((lesson) => lesson.id));

    for (const unit of units) {
      for (const lessonId of unit.lessons) {
        expect(
          registryIds.has(lessonId),
          `Unit "${unit.id}" contains unregistered lesson ID "${lessonId}"`,
        ).toBe(true);
        expect(
          LESSON_TITLES[lessonId],
          `Unit "${unit.id}" lesson "${lessonId}" has no entry in LESSON_TITLES`,
        ).toBeDefined();
      }
    }
  });

  it('every lesson title in the registry matches the LESSON_TITLES map', () => {
    for (const lesson of lessonRegistry) {
      expect(
        lesson.title,
        `Lesson "${lesson.id}" title in registry does not match LESSON_TITLES`,
      ).toBe(LESSON_TITLES[lesson.id]);
    }
  });

  it('LESSON_TITLES has no IDs that are absent from the registry', () => {
    const registryIds = new Set(lessonRegistry.map((l) => l.id));
    for (const id of Object.keys(LESSON_TITLES)) {
      expect(registryIds.has(id), `LESSON_TITLES contains unknown lesson ID "${id}"`).toBe(true);
    }
  });
});
