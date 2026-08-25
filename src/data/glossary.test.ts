import { describe, expect, it } from 'vitest';
import { lessonRegistry } from '../lessons/lesson-registry.ts';
import { glossary } from './glossary.ts';

describe('glossary', () => {
  it('links every term to at least one registered lesson', () => {
    const lessonIds = new Set(lessonRegistry.map((lesson) => lesson.id));

    for (const entry of glossary) {
      expect(entry.relatedLessons.length, entry.term).toBeGreaterThan(0);
      for (const lessonId of entry.relatedLessons) {
        expect(lessonIds.has(lessonId), `${entry.term}: ${lessonId}`).toBe(true);
      }
    }
  });

  it('uses a unique term and a definition for every entry', () => {
    const normalizedTerms = glossary.map((entry) => entry.term.toLocaleLowerCase());

    expect(new Set(normalizedTerms).size).toBe(normalizedTerms.length);
    for (const entry of glossary) {
      expect(entry.definition.trim(), entry.term).not.toBe('');
    }
  });

  it('uses the terminology taught by the completed curriculum', () => {
    const terms = new Set(glossary.map((entry) => entry.term));

    expect(terms.has('alias')).toBe(true);
    expect(terms.has('palette token')).toBe(true);
    expect(terms.has('raw value')).toBe(true);
    expect(terms.has('alias token')).toBe(false);
    expect(terms.has('HSLA')).toBe(false);
    expect(terms.has('RGBA')).toBe(false);
  });

  it('unlocks final system-review terms from the final lesson', () => {
    for (const term of ['consistency audit', 'stress test', 'system review']) {
      expect(glossary.find((entry) => entry.term === term)?.relatedLessons).toContain('u6-l7');
    }
  });
});
