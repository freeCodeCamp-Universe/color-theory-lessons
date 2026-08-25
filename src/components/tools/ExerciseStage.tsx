import type { ReactNode } from 'react';
import type { ExerciseStageController } from './exercise-stage.ts';
import styles from './ExerciseStage.module.css';

interface ExerciseStageProps {
  controller: ExerciseStageController;
  children: ReactNode;
  incorrectFeedback?: ReactNode;
  passedFeedback?: ReactNode;
  completionFeedback?: ReactNode;
  onRetry?: () => void;
}

/** Shared progress, instructions, feedback, and transition actions for one active stage. */
export function ExerciseStage({
  controller,
  children,
  incorrectFeedback,
  passedFeedback,
  completionFeedback,
  onRetry,
}: ExerciseStageProps) {
  const {
    stages,
    activeStage,
    completedStageIds,
    result,
    isFinalStage,
    stageHeadingRef,
    retry,
    advance,
  } = controller;
  const instructionId = `exercise-stage-${activeStage.id}-instruction`;

  function handleRetry() {
    onRetry?.();
    retry();
  }

  return (
    <div className={styles.stageLayout}>
      <div className={styles.progressTrack} aria-hidden="true">
        {stages.map((stage) => (
          <span
            key={stage.id}
            className={`${styles.progressSegment} ${
              completedStageIds.includes(stage.id)
                ? styles.completed
                : stage.id === activeStage.id
                  ? styles.active
                  : ''
            }`}
          />
        ))}
      </div>
      <p className={styles.position}>Stage {activeStage.position} of {activeStage.total}</p>

      <section className={styles.stagePanel}>
        <h2
          ref={stageHeadingRef}
          className={styles.title}
          tabIndex={-1}
          aria-describedby={instructionId}
        >
          {activeStage.title}
        </h2>
        <p id={instructionId} className={styles.instruction}>{activeStage.instruction}</p>

        {children}

        <div className={styles.result} role="status" aria-live="polite" aria-atomic="true">
          {result === 'incorrect' && incorrectFeedback}
          {result === 'passed' && (isFinalStage ? completionFeedback : passedFeedback)}
        </div>

        {result === 'incorrect' && (
          <button type="button" className={styles.retryButton} onClick={handleRetry}>
            try stage again
          </button>
        )}
        {result === 'passed' && !isFinalStage && (
          <button type="button" className={styles.nextButton} onClick={advance}>
            {activeStage.nextActionLabel ?? 'next stage'}
          </button>
        )}
      </section>
    </div>
  );
}
