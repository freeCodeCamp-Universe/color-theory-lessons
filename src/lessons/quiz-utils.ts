import type { LessonConfig, QuizChoice, QuizItem } from '../types/lesson.ts';

function normalizeChoiceMeaning(label: string): string {
  return label.trim().replace(/\s+/g, ' ').toLowerCase();
}

export function getQuizChoiceStableId(choice: QuizChoice): string {
  return choice.stableId?.trim() || normalizeChoiceMeaning(choice.label);
}

export function getLessonChoiceLabel(index: number): string {
  let value = index;
  let label = '';

  do {
    label = String.fromCharCode(65 + (value % 26)) + label;
    value = Math.floor(value / 26) - 1;
  } while (value >= 0);

  return label;
}

function getQuizSignatureItem(question: QuizItem) {
  return {
    id: question.id,
    prompt: question.prompt,
    colorSwatches: question.colorSwatches ?? [],
    choices: question.choices
      .map((choice) => ({
        id: getQuizChoiceStableId(choice),
        label: choice.label,
        isCorrect: choice.isCorrect,
      }))
      .sort((left, right) => left.id.localeCompare(right.id)),
  };
}

export function getLessonQuizSignature(lesson: Pick<LessonConfig, 'quizItems'>): string | null {
  if (lesson.quizItems.length === 0) return null;
  return JSON.stringify(lesson.quizItems.map(getQuizSignatureItem));
}

export function validateLessonQuiz(lesson: LessonConfig): LessonConfig {
  const questionIds = new Set<string>();

  for (const question of lesson.quizItems) {
    if (questionIds.has(question.id)) {
      throw new Error(`Duplicate quiz question id "${question.id}" in lesson "${lesson.id}".`);
    }

    questionIds.add(question.id);

    const choiceIds = new Set<string>();
    for (const choice of question.choices) {
      const choiceId = getQuizChoiceStableId(choice);
      if (choiceIds.has(choiceId)) {
        throw new Error(
          `Duplicate quiz choice id "${choiceId}" in lesson "${lesson.id}" question "${question.id}".`,
        );
      }
      choiceIds.add(choiceId);
    }
  }

  return lesson;
}
