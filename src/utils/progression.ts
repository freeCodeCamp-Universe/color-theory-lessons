import { units } from '../data/units.ts';
import type { ProgressState } from '../types/progress.ts';

type ProgressSnapshot = Pick<
  ProgressState,
  'completedLessons' | 'completedMilestones'
>;

export function isDevelopmentMode(): boolean {
  return Boolean(import.meta.env.VITE_DEV_MODE);
}

function isUnitComplete(
  unitIndex: number,
  { completedLessons, completedMilestones }: ProgressSnapshot,
): boolean {
  const unit = units[unitIndex];
  if (!unit) return false;

  return unit.lessons.every((lessonId) => completedLessons.includes(lessonId))
    && completedMilestones.includes(unit.milestoneId);
}

export function isUnitUnlocked(
  unitId: string,
  progress: ProgressSnapshot,
): boolean {
  const unitIndex = units.findIndex((unit) => unit.id === unitId);
  if (unitIndex < 0) return false;

  return units.slice(0, unitIndex).every((_, index) => isUnitComplete(index, progress));
}

export function isLessonUnlocked(
  lessonId: string,
  progress: ProgressSnapshot,
): boolean {
  const unit = units.find((candidate) => candidate.lessons.includes(lessonId));
  if (!unit || !isUnitUnlocked(unit.id, progress)) return false;

  const lessonIndex = unit.lessons.indexOf(lessonId);
  return unit.lessons
    .slice(0, lessonIndex)
    .every((previousLessonId) => progress.completedLessons.includes(previousLessonId));
}

export function isMilestoneUnlocked(
  milestoneId: string,
  progress: ProgressSnapshot,
): boolean {
  const unit = units.find((candidate) => candidate.milestoneId === milestoneId);
  if (!unit || !isUnitUnlocked(unit.id, progress)) return false;

  return unit.lessons.every((lessonId) => progress.completedLessons.includes(lessonId));
}

export function getNextLearningPath(progress: ProgressSnapshot): string {
  for (const unit of units) {
    const nextLessonId = unit.lessons.find(
      (lessonId) => !progress.completedLessons.includes(lessonId),
    );
    if (nextLessonId) return `/lesson/${nextLessonId}`;

    if (!progress.completedMilestones.includes(unit.milestoneId)) {
      return `/milestone/${unit.milestoneId}`;
    }
  }

  return `/lesson/${units[0]?.lessons[0] ?? ''}`;
}
