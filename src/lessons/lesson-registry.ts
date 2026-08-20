import type { LessonConfig } from '../types/lesson.ts';
import { validateLessonQuiz } from './quiz-utils.ts';
import { lesson1_1 } from './unit-1/lesson-1-1.ts';
import { lesson1_2 } from './unit-1/lesson-1-2.ts';
import { lesson1_3 } from './unit-1/lesson-1-3.ts';
import { lesson1_4 } from './unit-1/lesson-1-4.ts';
import { lesson1_5 } from './unit-1/lesson-1-5.ts';
import { lesson1_6 } from './unit-1/lesson-1-6.ts';
import { lesson2_1 } from './unit-2/lesson-2-1.ts';
import { lesson2_2 } from './unit-2/lesson-2-2.ts';
import { lesson2_3 } from './unit-2/lesson-2-3.ts';
import { lesson2_4 } from './unit-2/lesson-2-4.ts';
import { lesson2_5 } from './unit-2/lesson-2-5.ts';
import { lesson3_1 } from './unit-3/lesson-3-1.ts';
import { lesson3_2 } from './unit-3/lesson-3-2.ts';
import { lesson3_3 } from './unit-3/lesson-3-3.ts';
import { lesson3_4 } from './unit-3/lesson-3-4.ts';
import { lesson3_5 } from './unit-3/lesson-3-5.ts';
import { lesson3_6 } from './unit-3/lesson-3-6.ts';
import { lesson4_1 } from './unit-4/lesson-4-1.ts';
import { lesson4_2 } from './unit-4/lesson-4-2.ts';
import { lesson4_3 } from './unit-4/lesson-4-3.ts';
import { lesson4_4 } from './unit-4/lesson-4-4.ts';
import { lesson5_1 } from './unit-5/lesson-5-1.ts';
import { lesson5_2 } from './unit-5/lesson-5-2.ts';
import { lesson5_3 } from './unit-5/lesson-5-3.ts';
import { lesson5_4 } from './unit-5/lesson-5-4.ts';
import { lesson5_5 } from './unit-5/lesson-5-5.ts';
import { lesson5_6 } from './unit-5/lesson-5-6.ts';
import { lesson6_1 } from './unit-6/lesson-6-1.ts';
import { lesson6_2 } from './unit-6/lesson-6-2.ts';
import { lesson6_3 } from './unit-6/lesson-6-3.ts';
import { lesson6_4 } from './unit-6/lesson-6-4.ts';
import { lesson6_5 } from './unit-6/lesson-6-5.ts';
import { lesson6_6 } from './unit-6/lesson-6-6.ts';
import { lesson6_7 } from './unit-6/lesson-6-7.ts';

export const lessonRegistry: LessonConfig[] = [
  lesson1_1,
  lesson1_2,
  lesson1_3,
  lesson1_4,
  lesson1_5,
  lesson1_6,
  lesson2_1,
  lesson2_2,
  lesson2_3,
  lesson2_4,
  lesson2_5,
  lesson3_1,
  lesson3_2,
  lesson3_3,
  lesson3_4,
  lesson3_5,
  lesson3_6,
  lesson4_1,
  lesson4_2,
  lesson4_3,
  lesson4_4,
  lesson5_1,
  lesson5_2,
  lesson5_3,
  lesson5_4,
  lesson5_5,
  lesson5_6,
  lesson6_1,
  lesson6_2,
  lesson6_3,
  lesson6_4,
  lesson6_5,
  lesson6_6,
  lesson6_7,
].map(validateLessonQuiz);

export function getLessonById(id: string): LessonConfig | undefined {
  return lessonRegistry.find((l) => l.id === id);
}

export function getLessonsForUnit(unitId: string): LessonConfig[] {
  return lessonRegistry.filter((l) => l.unitId === unitId);
}
