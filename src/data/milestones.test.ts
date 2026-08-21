import { describe, expect, it } from 'vitest';
import { getMilestoneById } from './milestones.ts';

describe('Milestone 1 configuration', () => {
  it('has one three-point challenge, three quiz questions, and a four-point pass threshold', () => {
    const milestone = getMilestoneById('milestone-1');
    expect(milestone).toBeDefined();
    if (!milestone) return;

    const challengePoints = milestone.parts.reduce(
      (total, part) => total + (part.kind === 'challenge' ? part.pointValue : 0),
      0,
    );
    const quizQuestions = milestone.parts.reduce(
      (total, part) => total + (part.kind === 'quiz' ? part.questions.length : 0),
      0,
    );

    expect(milestone.parts.map((part) => part.kind)).toEqual(['challenge', 'quiz']);
    expect(challengePoints).toBe(3);
    expect(quizQuestions).toBe(3);
    expect(challengePoints + quizQuestions).toBe(6);
    expect(milestone.passThreshold).toBe(4);

    const correctChoiceIds = milestone.parts.flatMap((part) =>
      part.kind === 'quiz'
        ? part.questions.map((question) => question.choices.find((choice) => choice.isCorrect)?.id)
        : [],
    );
    expect(correctChoiceIds).toEqual(['c', 'b', 'd']);
  });
});

describe('Milestone 2 configuration', () => {
  it('has one three-point challenge, three quiz questions, and a four-point pass threshold', () => {
    const milestone = getMilestoneById('milestone-2');
    expect(milestone).toBeDefined();
    if (!milestone) return;

    const challengePoints = milestone.parts.reduce(
      (total, part) => total + (part.kind === 'challenge' ? part.pointValue : 0),
      0,
    );
    const quizQuestions = milestone.parts.reduce(
      (total, part) => total + (part.kind === 'quiz' ? part.questions.length : 0),
      0,
    );

    expect(milestone.parts.map((part) => part.kind)).toEqual(['challenge', 'quiz']);
    expect(challengePoints).toBe(3);
    expect(quizQuestions).toBe(3);
    expect(challengePoints + quizQuestions).toBe(6);
    expect(milestone.passThreshold).toBe(4);

    const correctChoiceIds = milestone.parts.flatMap((part) =>
      part.kind === 'quiz'
        ? part.questions.map((question) => question.choices.find((choice) => choice.isCorrect)?.id)
        : [],
    );
    expect(correctChoiceIds).toEqual(['a', 'a', 'a']);
  });
});
