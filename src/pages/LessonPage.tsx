import { lazy, Suspense, useEffect, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import type { LessonConfig } from '../types/lesson.ts';
import { loadLessonById, prefetchLessonById } from '../lessons/lesson-loader.ts';
import { prefetchToolByInteractionType } from '../components/tools/tool-prefetch.ts';
import { units } from '../data/units.ts';
import { useAppState } from '../state/app-context.tsx';
import { isDevelopmentMode, isLessonUnlocked } from '../utils/progression.ts';

const LessonPlayer = lazy(() => import('../components/lesson/LessonPlayer.tsx').then((m) => ({ default: m.LessonPlayer })));

export function LessonPage() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const { completedLessons, completedMilestones } = useAppState();
  const [lesson, setLesson] = useState<LessonConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isRegisteredLesson = units.some((unit) => unit.lessons.includes(lessonId ?? ''));
  const isLocked = isRegisteredLesson
    && !isDevelopmentMode()
    && !isLessonUnlocked(lessonId ?? '', { completedLessons, completedMilestones });

  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (!lessonId) {
        setLesson(null);
        setIsLoading(false);
        return;
      }

      if (isLocked) {
        setLesson(null);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      const loaded = await loadLessonById(lessonId);
      if (!cancelled) {
        setLesson(loaded ?? null);
        if (loaded) {
          prefetchToolByInteractionType(loaded.interactionType);

          const allLessonIds = units.flatMap((unit) => unit.lessons);
          const idx = allLessonIds.indexOf(loaded.id);
          const nextLessonId = idx >= 0 ? allLessonIds[idx + 1] : undefined;
          if (nextLessonId) {
            prefetchLessonById(nextLessonId);
          }

          const currentUnit = units.find((unit) => unit.id === loaded.unitId);
          const isLastLessonInUnit = currentUnit
            ? currentUnit.lessons[currentUnit.lessons.length - 1] === loaded.id
            : false;
          if (isLastLessonInUnit && currentUnit?.milestoneId) {
            void import('../pages/MilestonePage.tsx');
            void import('../data/milestones.ts');
          }
        }
        setIsLoading(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [isLocked, lessonId]);

  if (isLocked) {
    return (
      <Navigate
        to="/"
        replace
        state={{ routeNotice: 'This lesson is not unlocked yet.' }}
      />
    );
  }

  if (isLoading) {
    return (
      <p style={{ color: 'var(--muted)', fontSize: '1rem' }}>
        loading lesson...
      </p>
    );
  }

  if (!lesson) {
    return (
      <div>
        <p style={{ color: 'var(--muted)', fontSize: '1rem' }}>
          lesson not found: {lessonId}
        </p>
        <Link to="/" style={{ marginTop: '1rem', display: 'inline-block' }}>
          ← back to home
        </Link>
      </div>
    );
  }

  return (
    <Suspense
      fallback={
        <p style={{ color: 'var(--muted)', fontSize: '1rem' }}>
          loading lesson player...
        </p>
      }
    >
      <LessonPlayer key={lesson.id} lesson={lesson} />
    </Suspense>
  );
}
