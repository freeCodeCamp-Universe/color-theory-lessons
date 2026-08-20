import type { LessonConfig } from '../types/lesson.ts';
import { validateLessonQuiz } from './quiz-utils.ts';

type LessonLoader = () => Promise<LessonConfig>;

const lessonLoaders: Record<string, LessonLoader> = {
  'u1-l1': async () => (await import('./unit-1/lesson-1-1.ts')).lesson1_1,
  'u1-l2': async () => (await import('./unit-1/lesson-1-2.ts')).lesson1_2,
  'u1-l3': async () => (await import('./unit-1/lesson-1-3.ts')).lesson1_3,
  'u1-l4': async () => (await import('./unit-1/lesson-1-4.ts')).lesson1_4,
  'u1-l5': async () => (await import('./unit-1/lesson-1-5.ts')).lesson1_5,
  'u1-l6': async () => (await import('./unit-1/lesson-1-6.ts')).lesson1_6,
  'u2-l1': async () => (await import('./unit-2/lesson-2-1.ts')).lesson2_1,
  'u2-l2': async () => (await import('./unit-2/lesson-2-2.ts')).lesson2_2,
  'u2-l3': async () => (await import('./unit-2/lesson-2-3.ts')).lesson2_3,
  'u2-l4': async () => (await import('./unit-2/lesson-2-4.ts')).lesson2_4,
  'u2-l5': async () => (await import('./unit-2/lesson-2-5.ts')).lesson2_5,
  'u3-l1': async () => (await import('./unit-3/lesson-3-1.ts')).lesson3_1,
  'u3-l2': async () => (await import('./unit-3/lesson-3-2.ts')).lesson3_2,
  'u3-l3': async () => (await import('./unit-3/lesson-3-3.ts')).lesson3_3,
  'u3-l4': async () => (await import('./unit-3/lesson-3-4.ts')).lesson3_4,
  'u3-l5': async () => (await import('./unit-3/lesson-3-5.ts')).lesson3_5,
  'u3-l6': async () => (await import('./unit-3/lesson-3-6.ts')).lesson3_6,
  'u4-l1': async () => (await import('./unit-4/lesson-4-1.ts')).lesson4_1,
  'u4-l2': async () => (await import('./unit-4/lesson-4-2.ts')).lesson4_2,
  'u4-l3': async () => (await import('./unit-4/lesson-4-3.ts')).lesson4_3,
  'u4-l4': async () => (await import('./unit-4/lesson-4-4.ts')).lesson4_4,
  'u5-l1': async () => (await import('./unit-5/lesson-5-1.ts')).lesson5_1,
  'u5-l2': async () => (await import('./unit-5/lesson-5-2.ts')).lesson5_2,
  'u5-l3': async () => (await import('./unit-5/lesson-5-3.ts')).lesson5_3,
  'u5-l4': async () => (await import('./unit-5/lesson-5-4.ts')).lesson5_4,
  'u5-l5': async () => (await import('./unit-5/lesson-5-5.ts')).lesson5_5,
  'u5-l6': async () => (await import('./unit-5/lesson-5-6.ts')).lesson5_6,
  'u6-l1': async () => (await import('./unit-6/lesson-6-1.ts')).lesson6_1,
  'u6-l2': async () => (await import('./unit-6/lesson-6-2.ts')).lesson6_2,
  'u6-l3': async () => (await import('./unit-6/lesson-6-3.ts')).lesson6_3,
  'u6-l4': async () => (await import('./unit-6/lesson-6-4.ts')).lesson6_4,
  'u6-l5': async () => (await import('./unit-6/lesson-6-5.ts')).lesson6_5,
  'u6-l6': async () => (await import('./unit-6/lesson-6-6.ts')).lesson6_6,
  'u6-l7': async () => (await import('./unit-6/lesson-6-7.ts')).lesson6_7,
};

export async function loadLessonById(id: string): Promise<LessonConfig | undefined> {
  const loader = Object.hasOwn(lessonLoaders, id) ? lessonLoaders[id] : undefined;
  if (!loader) return undefined;
  return validateLessonQuiz(await loader());
}

export function prefetchLessonById(id: string): void {
  const loader = Object.hasOwn(lessonLoaders, id) ? lessonLoaders[id] : undefined;
  if (!loader) return;
  void loader();
}

export async function loadLessonsByIds(ids: string[]): Promise<LessonConfig[]> {
  const loaded = await Promise.all(ids.map((id) => loadLessonById(id)));
  return loaded.filter((lesson): lesson is LessonConfig => Boolean(lesson));
}
