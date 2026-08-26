import { describe, expect, it } from 'vitest';
import { lesson6_5 } from './lesson-6-5.ts';
import { lesson6_6 } from './lesson-6-6.ts';
import { lesson6_7 } from './lesson-6-7.ts';

describe('Unit 6 stage prompts', () => {
  it.each([
    [lesson6_5, ['tune-series-colors', 'assign-series-patterns', 'inspect-data-table']],
    [lesson6_6, ['classify-color-terms', 'classify-gamut-mapping']],
    [lesson6_7, ['find-system-weaknesses', 'classify-system-weaknesses']],
  ])('maps every $title hint to one of its stages', (lesson, stageIds) => {
    expect(lesson.challenge.hints).not.toHaveLength(0);
    for (const hint of lesson.challenge.hints) {
      expect(hint).not.toEqual(expect.any(String));
      if (typeof hint !== 'string') expect(stageIds).toContain(hint.stageId);
    }
  });
});
