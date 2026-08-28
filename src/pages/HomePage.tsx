import { useState } from 'react';
import { Link } from 'react-router-dom';
import { units } from '../data/units.ts';
import { getMilestoneById } from '../data/milestones.ts';
import { LESSON_TITLES } from '../lessons/lesson-titles.ts';
import { useAppState, useAppDispatch } from '../state/app-context.tsx';
import {
  getNextLearningPath,
  isDevelopmentMode,
  isUnitUnlocked,
} from '../utils/progression.ts';
import styles from './HomePage.module.css';
import { DocumentTitle } from '../components/accessibility/DocumentTitle.tsx';

export function HomePage() {
  const { completedLessons, completedMilestones } = useAppState();
  const progress = { completedLessons, completedMilestones };
  const developmentMode = isDevelopmentMode();
  const dispatch = useAppDispatch();
  // Start with the current unit expanded: the first unit that is unlocked
  // (previous unit fully finished) but not yet fully finished itself.
  const [expandedUnit, setExpandedUnit] = useState<string | null>(() => {
    let prevFinished = true;
    for (const unit of units) {
      const lessonsDone = unit.lessons.every((id) => completedLessons.includes(id));
      const milestoneDone = !unit.milestoneId || completedMilestones.includes(unit.milestoneId);
      const finished = lessonsDone && milestoneDone;
      if (prevFinished && !finished) return unit.id;
      prevFinished = finished;
    }
    return null;
  });

  function handleResetProgress() {
    if (window.confirm('Reset all progress? This cannot be undone.')) {
      dispatch({ type: 'RESET_PROGRESS' });
    }
  }

  const nextLearningPath = getNextLearningPath(progress);
  const nextLearningName = (() => {
    const lessonMatch = nextLearningPath.match(/^\/lesson\/(.+)$/);
    if (lessonMatch) return LESSON_TITLES[lessonMatch[1]] ?? lessonMatch[1];
    const milestoneMatch = nextLearningPath.match(/^\/milestone\/(.+)$/);
    if (milestoneMatch) return getMilestoneById(milestoneMatch[1])?.title ?? milestoneMatch[1];
    return 'course dashboard';
  })();

  return (
    <>
      <DocumentTitle />
      <section className={styles.hero}>
        <h1 className={styles.title}>
          Color Theory
          <br />
          for Developers
        </h1>
        <p className={styles.subtitle}>
          Six units of hands-on lessons covering color perception, digital color
          models, accessibility, and design systems — built for people who write code.
        </p>
        <Link
          to={nextLearningPath}
          className={styles.startBtn}
          aria-label={`${completedLessons.length === 0 ? 'Start learning' : 'Continue'}: ${nextLearningName}`}
        >
          {completedLessons.length === 0 ? 'start learning' : 'continue →'}
        </Link>
      </section>

      <section>
        <p className={styles.unitsHeading}>units</p>
        <div className={styles.units}>
          {units.map((unit, i) => {
            const total = unit.lessons.length;
            const done = unit.lessons.filter((id) => completedLessons.includes(id)).length;
            const milestoneDone = !unit.milestoneId || completedMilestones.includes(unit.milestoneId);
            const complete = total > 0 && done === total && milestoneDone;
            const started = done > 0 && !complete;
            const firstLesson = unit.lessons[0];

            const isUnlocked = developmentMode || isUnitUnlocked(unit.id, progress);
            const isExpanded = expandedUnit === unit.id;
            const lessonListId = `${unit.id}-lessons`;

            function toggleExpand() {
              setExpandedUnit((prev) => (prev === unit.id ? null : unit.id));
            }

            return (
              <div key={unit.id} className={styles.unitGroup}>
                <div
                  className={`${styles.unitCard} ${isUnlocked ? styles.unitInteractive : ''} ${complete ? styles.unitComplete : ''} ${isExpanded ? styles.unitExpanded : ''}`}
                >
                  {isUnlocked ? (
                    <button
                      type="button"
                      className={styles.unitDisclosure}
                      onClick={toggleExpand}
                      aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${unit.title}`}
                      aria-controls={lessonListId}
                      aria-expanded={isExpanded}
                    >
                      <span className={styles.unitIndex}>{String(i + 1).padStart(2, '0')}</span>
                      <span className={styles.unitInfo}>
                        <span className={styles.unitTitle}>{unit.title}</span>
                        <span className={styles.unitDesc}>{unit.description}</span>
                      </span>
                      <span className={styles.expandChevron} aria-hidden="true">
                        {isExpanded ? '▲' : '▼'}
                      </span>
                    </button>
                  ) : (
                    <div className={styles.unitSummary}>
                      <span className={styles.unitIndex}>{String(i + 1).padStart(2, '0')}</span>
                      <span className={styles.unitInfo}>
                        <span className={styles.unitTitle}>{unit.title}</span>
                        <span className={styles.unitDesc}>{unit.description}</span>
                      </span>
                    </div>
                  )}
                  <div className={styles.unitMeta}>
                    {complete ? (
                      <span className={styles.unitBadge} style={{ color: 'var(--accent-success)', borderColor: 'var(--accent-success)' }}>
                        ✓ done
                      </span>
                    ) : started ? (
                      <span className={styles.unitBadge}>
                        {done}/{total}
                      </span>
                    ) : firstLesson && isUnlocked ? (
                      <Link
                        to={`/lesson/${firstLesson}`}
                        className={styles.unitStart}
                        aria-label={`Start: ${LESSON_TITLES[firstLesson] ?? firstLesson}`}
                      >
                        start →
                      </Link>
                    ) : (
                      <span className={styles.unitBadge} style={{ color: 'var(--muted)', borderColor: 'var(--border)' }}>
                        locked
                      </span>
                    )}
                  </div>
                </div>
                {isUnlocked && (
                  <ul id={lessonListId} className={styles.lessonList} hidden={!isExpanded}>
                    {unit.lessons.map((lessonId, li) => {
                      const isDone = completedLessons.includes(lessonId);
                      // The list belongs to an unlocked unit, so its first lesson is
                      // always startable when not done.
                      const isNext = !isDone && (
                        developmentMode
                        || li === 0
                        || completedLessons.includes(unit.lessons[li - 1])
                      );
                      const isLocked = !isDone && !isNext;
                      return (
                        <li key={lessonId} className={styles.lessonRow}>
                          <span className={styles.lessonNum}>{String(li + 1).padStart(2, '0')}</span>
                          <span className={styles.lessonName}>{LESSON_TITLES[lessonId] ?? lessonId}</span>
                          {isDone && (
                            <Link
                              to={`/lesson/${lessonId}`}
                              className={styles.lessonRedo}
                              aria-label={`Redo: ${LESSON_TITLES[lessonId] ?? lessonId}`}
                            >redo →</Link>
                          )}
                          {isNext && (
                            <Link
                              to={`/lesson/${lessonId}`}
                              className={styles.lessonContinue}
                              aria-label={`Continue: ${LESSON_TITLES[lessonId] ?? lessonId}`}
                            >continue →</Link>
                          )}
                          {isLocked && (
                            <span className={styles.lessonLockedLabel}>locked</span>
                          )}
                        </li>
                      );
                    })}
                    {unit.milestoneId && (() => {
                      const milestone = getMilestoneById(unit.milestoneId);
                      if (!milestone) return null;
                      const allLessonsDone = total > 0 && done === total;
                      const milestoneDone = completedMilestones.includes(unit.milestoneId);
                      const milestoneNext = !milestoneDone && (developmentMode || allLessonsDone);
                      const milestoneLocked = !milestoneDone && !milestoneNext;
                      return (
                        <li
                          key={unit.milestoneId}
                          className={`${styles.lessonRow} ${styles.milestoneRow}`}
                        >
                          <span className={`${styles.lessonNum} ${styles.milestoneIcon}`}>★</span>
                          <span className={styles.lessonName}>{milestone.title}</span>
                          {milestoneDone && (
                            <Link
                              to={`/milestone/${unit.milestoneId}`}
                              className={styles.lessonRedo}
                              aria-label={`Redo: ${milestone.title}`}
                            >redo →</Link>
                          )}
                          {milestoneNext && (
                            <Link
                              to={`/milestone/${unit.milestoneId}`}
                              className={styles.lessonContinue}
                              aria-label={`Start: ${milestone.title}`}
                            >start →</Link>
                          )}
                          {milestoneLocked && (
                            <span className={styles.lessonLockedLabel}>locked</span>
                          )}
                        </li>
                      );
                    })()}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section className={styles.resetSection}>
        <button className={styles.resetBtn} onClick={handleResetProgress}>
          reset progress
        </button>
      </section>
    </>
  );
}
