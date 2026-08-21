import { describe, expect, it } from 'vitest';
import { getLessonQuizSignature, validateLessonQuiz } from './quiz-utils.ts';
import type { LessonConfig } from '../types/lesson.ts';

function makeLesson(overrides?: Partial<LessonConfig>): LessonConfig {
  return {
    id: 'test-lesson',
    unitId: 'unit-test',
    title: 'Test Lesson',
    interactionType: 'color-wheel',
    steps: [{ text: 'Step one' }],
    challenge: { prompt: 'Do the thing', hints: [] },
    quizItems: [
      {
        id: 'q1',
        prompt: 'Question one?',
        choices: [
          { stableId: 'alpha', label: 'Alpha', isCorrect: true },
          { stableId: 'beta', label: 'Beta', isCorrect: false },
        ],
      },
    ],
    reviewTags: [],
    ...overrides,
  };
}

describe('quiz-utils', () => {
  it('keeps the quiz signature stable across harmless choice reorders', () => {
    const original = makeLesson();
    const reordered = makeLesson({
      quizItems: [
        {
          id: 'q1',
          prompt: 'Question one?',
          choices: [
            { stableId: 'beta', label: 'Beta', isCorrect: false },
            { stableId: 'alpha', label: 'Alpha', isCorrect: true },
          ],
        },
      ],
    });

    expect(getLessonQuizSignature(reordered)).toBe(getLessonQuizSignature(original));
  });

  it('throws when a lesson repeats a quiz question id', () => {
    expect(() => validateLessonQuiz(makeLesson({
      quizItems: [
        ...makeLesson().quizItems,
        {
          id: 'q1',
          prompt: 'Another question?',
          choices: [{ stableId: 'gamma', label: 'Gamma', isCorrect: true }],
        },
      ],
    }))).toThrow(/Duplicate quiz question id "q1"/);
  });

  it('throws when a question repeats a stable choice id', () => {
    expect(() => validateLessonQuiz(makeLesson({
      quizItems: [
        {
          id: 'q1',
          prompt: 'Question one?',
          choices: [
            { stableId: 'alpha', label: 'Alpha', isCorrect: true },
            { stableId: 'alpha', label: 'Also Alpha', isCorrect: false },
          ],
        },
      ],
    }))).toThrow(/Duplicate quiz choice id "alpha"/);
  });

  it('throws when a choice has an empty stable id', () => {
    expect(() => validateLessonQuiz(makeLesson({
      quizItems: [
        {
          id: 'q1',
          prompt: 'Question one?',
          choices: [
            { stableId: '  ', label: 'Alpha', isCorrect: true },
          ],
        },
      ],
    }))).toThrow(/Empty stable quiz choice id/);
  });
});
