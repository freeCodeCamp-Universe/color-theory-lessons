import { describe, expect, it } from 'vitest';
import { lesson1_1 } from './lesson-1-1.ts';
import { lesson1_2 } from './lesson-1-2.ts';
import { lesson1_3 } from './lesson-1-3.ts';
import { lesson1_4 } from './lesson-1-4.ts';
import { lesson1_5 } from './lesson-1-5.ts';
import { lesson1_6 } from './lesson-1-6.ts';

describe('Unit 1 stage prompts', () => {
  it.each([
    [lesson1_1, 'one stage'],
    [lesson1_2, 'three stages'],
    [lesson1_3, 'one stage'],
    [lesson1_4, 'two stages'],
    [lesson1_5, 'one stage'],
    [lesson1_6, 'two stages'],
  ])('states the stage count for $title', (lesson, stageCount) => {
    expect(lesson.challenge.prompt.toLowerCase()).toContain(stageCount);
  });

  it('maps Color Wheel hints only to the stage where they apply', () => {
    expect(lesson1_6.challenge.hints).toEqual([
      expect.objectContaining({ stageId: 'build-palette' }),
      expect.objectContaining({ stageId: 'identify-relationship' }),
      expect.objectContaining({ stageId: 'identify-relationship' }),
    ]);
  });
});
