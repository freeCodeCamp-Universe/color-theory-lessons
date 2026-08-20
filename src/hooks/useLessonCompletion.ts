import { useAppDispatch } from '../state/app-context.tsx';
import type { LessonConfig } from '../types/lesson.ts';

export interface QuizAnswer {
  questionId: string;
  choiceId: string;
  isCorrect: boolean;
}

export function useLessonCompletion(lesson: LessonConfig) {
  const dispatch = useAppDispatch();

  function completeLesson(answers: QuizAnswer[]) {
    dispatch({ type: 'COMPLETE_LESSON', lessonId: lesson.id });
    if (lesson.quizItems.length > 0) {
      const correctCount = answers.filter((a) => a.isCorrect).length;
      dispatch({
        type: 'COMPLETE_QUIZ',
        quizId: lesson.id,
        score: Math.round((correctCount / lesson.quizItems.length) * 100),
      });
    }
  }

  return { completeLesson };
}
