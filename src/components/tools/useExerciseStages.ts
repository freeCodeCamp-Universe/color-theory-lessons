import { useEffect, useMemo, useRef, useState } from 'react';
import type {
  ExerciseStageChangeHandler,
  ExerciseStageController,
  ExerciseStageDefinition,
  ExerciseStageResult,
} from './exercise-stage.ts';

interface UseExerciseStagesOptions {
  stages: readonly ExerciseStageDefinition[];
  onStageChange?: ExerciseStageChangeHandler;
  onComplete?: () => void;
  initialStageId?: string;
  initialResult?: ExerciseStageResult;
}

/**
 * Owns the transitions shared by evaluative, staged lesson exercises.
 * Answer data remains in the tool so retries can preserve or reset it as needed.
 */
export function useExerciseStages({
  stages,
  onStageChange,
  onComplete,
  initialStageId,
  initialResult = 'idle',
}: UseExerciseStagesOptions): ExerciseStageController {
  if (stages.length === 0) {
    throw new Error('An exercise must define at least one stage.');
  }
  if (new Set(stages.map(({ id }) => id)).size !== stages.length) {
    throw new Error('Exercise stage IDs must be unique.');
  }

  const initialActiveIndex = Math.max(
    0,
    stages.findIndex(({ id }) => id === initialStageId),
  );
  const [activeIndex, setActiveIndex] = useState(initialActiveIndex);
  const [completedStageIds, setCompletedStageIds] = useState<string[]>(() => (
    stages
      .slice(0, initialActiveIndex + Number(initialResult === 'passed'))
      .map(({ id }) => id)
  ));
  const [result, setResult] = useState<ExerciseStageResult>(initialResult);
  const stageHeadingRef = useRef<HTMLHeadingElement>(null);
  const previousStageId = useRef(stages[initialActiveIndex].id);
  const completionReported = useRef(
    initialResult === 'passed' && initialActiveIndex === stages.length - 1,
  );
  const onStageChangeRef = useRef(onStageChange);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onStageChangeRef.current = onStageChange;
  }, [onStageChange]);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const activeStage = useMemo(() => ({
    ...stages[activeIndex],
    position: activeIndex + 1,
    total: stages.length,
  }), [activeIndex, stages]);

  useEffect(() => {
    onStageChangeRef.current?.(activeStage);

    if (previousStageId.current !== activeStage.id) {
      previousStageId.current = activeStage.id;
      stageHeadingRef.current?.focus();
    }
  }, [activeStage]);

  function markIncorrect() {
    if (result !== 'passed') setResult('incorrect');
  }

  function markPassed() {
    if (result === 'passed') return;

    setResult('passed');
    setCompletedStageIds((current) => (
      current.includes(activeStage.id) ? current : [...current, activeStage.id]
    ));

    if (activeIndex === stages.length - 1 && !completionReported.current) {
      completionReported.current = true;
      onCompleteRef.current?.();
    }
  }

  function retry() {
    if (result !== 'incorrect') return;
    setResult('idle');
    stageHeadingRef.current?.focus();
  }

  function advance() {
    if (result !== 'passed' || activeIndex >= stages.length - 1) return;
    setResult('idle');
    setActiveIndex((index) => index + 1);
  }

  return {
    stages,
    activeStage,
    completedStageIds,
    result,
    isFinalStage: activeIndex === stages.length - 1,
    stageHeadingRef,
    markIncorrect,
    markPassed,
    retry,
    advance,
  };
}
