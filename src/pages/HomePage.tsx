import { useState } from 'react';
import { Link } from 'react-router-dom';
import { units } from '../data/units.ts';
import { getMilestoneById } from '../data/milestones.ts';
import { LESSON_TITLES } from '../data/lessonTitles.ts';
import { useAppState, useAppDispatch } from '../state/app-context.tsx';
import styles from './HomePage.module.css';

export function HomePage() {
  const { completedLessons, completedMilestones } = useAppState();
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

  // Find the first lesson the user hasn't completed yet
  const allLessonIds = units.flatMap((u) => u.lessons);
  const nextLessonId = allLessonIds.find((id) => !completedLessons.includes(id)) ?? allLessonIds[0];

  return (
    <>
      <section className={styles.hero}>
        <span className={styles.prompt}>~/color-theory-course $ learn --interactive</span>
        <h1 className={styles.title}>
          Color Theory
          <br />
          for Developers
        </h1>
        <p className={styles.subtitle}>
          Six units of hands-on lessons covering color perception, digital color
          models, accessibility, and design systems — built for people who write code.
        </p>
        <Link to={`/lesson/${nextLessonId}`} className={styles.startBtn}>
          {completedLessons.length === 0 ? 'start learning' : 'continue →'}
        </Link>
      </section>

      <section>
        <p className={styles.unitsHeading}>units</p>
        <div className={styles.units}>
          {units.map((unit, i) => {
            const total = unit.lessons.length;
            const done = unit.lessons.filter((id) => completedLessons.includes(id)).length;
            const complete = total > 0 && done === total;
            const started = done > 0 && !complete;
            const firstLesson = unit.lessons[0];

            const prevUnit = i > 0 ? units[i - 1] : null;
            const prevUnitLessonsDone = prevUnit
              ? prevUnit.lessons.every((id) => completedLessons.includes(id))
              : true;
            const prevUnitMilestoneDone = prevUnit?.milestoneId
              ? completedMilestones.includes(prevUnit.milestoneId)
              : true;
            const prevUnitComplete = prevUnitLessonsDone && prevUnitMilestoneDone;
            const isUnlocked = i === 0 || prevUnitComplete;
            const canExpand = isUnlocked;
            const isExpanded = expandedUnit === unit.id;

            function toggleExpand() {
              setExpandedUnit((prev) => (prev === unit.id ? null : unit.id));
            }

            return (
              <div key={unit.id} className={styles.unitGroup}>
                <div
                  className={`${styles.unitCard} ${complete ? styles.unitComplete : ''} ${isExpanded ? styles.unitExpanded : ''}`}
                  onClick={canExpand ? toggleExpand : undefined}
                  role={canExpand ? 'button' : undefined}
                  tabIndex={canExpand ? 0 : undefined}
                  aria-label={canExpand ? `${unit.title} — click to ${isExpanded ? 'collapse' : 'expand'}` : undefined}
                  aria-expanded={canExpand ? isExpanded : undefined}
                  onKeyDown={(e) => canExpand && (e.key === 'Enter' || e.key === ' ') && toggleExpand()}
                  style={{ cursor: canExpand ? 'pointer' : 'default' }}
                >
                  <span className={styles.unitIndex}>{String(i + 1).padStart(2, '0')}</span>
                  <div className={styles.unitInfo}>
                    <span className={styles.unitTitle}>{unit.title}</span>
                    <span className={styles.unitDesc}>{unit.description}</span>
                  </div>
                  <div className={styles.unitMeta}>
                    {complete ? (
                      <span className={styles.unitBadge} style={{ color: 'var(--green)', borderColor: 'var(--green)' }}>
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
                        onClick={(e) => e.stopPropagation()}
                      >
                        start →
                      </Link>
                    ) : (
                      <span className={styles.unitBadge} style={{ color: 'var(--muted)', borderColor: 'var(--border)' }}>
                        locked
                      </span>
                    )}
                    {canExpand && (
                      <span className={styles.expandChevron}>{isExpanded ? '▲' : '▼'}</span>
                    )}
                  </div>
                </div>
                {isExpanded && (
                  <ul className={styles.lessonList}>
                    {unit.lessons.map((lessonId, li) => {
                      const isDone = completedLessons.includes(lessonId);
                      // The list only renders inside an expanded (therefore unlocked)
                      // unit, so its first lesson is always startable when not done.
                      const isNext = !isDone && (li === 0 || completedLessons.includes(unit.lessons[li - 1]));
                      const isLocked = !isDone && !isNext;
                      return (
                        <li key={lessonId} className={`${styles.lessonRow} ${isLocked ? styles.lessonLocked : ''}`}>
                          <span className={styles.lessonNum}>{String(li + 1).padStart(2, '0')}</span>
                          <span className={styles.lessonName}>{LESSON_TITLES[lessonId] ?? lessonId}</span>
                          {isDone && (
                            <Link to={`/lesson/${lessonId}`} className={styles.lessonRedo}>redo →</Link>
                          )}
                          {isNext && (
                            <Link to={`/lesson/${lessonId}`} className={styles.lessonContinue}>continue →</Link>
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
                      const milestoneNext = allLessonsDone && !milestoneDone;
                      const milestoneLocked = !allLessonsDone && !milestoneDone;
                      return (
                        <li
                          key={unit.milestoneId}
                          className={`${styles.lessonRow} ${styles.milestoneRow} ${milestoneLocked ? styles.lessonLocked : ''}`}
                        >
                          <span className={`${styles.lessonNum} ${styles.milestoneIcon}`}>★</span>
                          <span className={styles.lessonName}>{milestone.title}</span>
                          {milestoneDone && (
                            <Link to={`/milestone/${unit.milestoneId}`} className={styles.lessonRedo}>redo →</Link>
                          )}
                          {milestoneNext && (
                            <Link to={`/milestone/${unit.milestoneId}`} className={styles.lessonContinue}>start →</Link>
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
