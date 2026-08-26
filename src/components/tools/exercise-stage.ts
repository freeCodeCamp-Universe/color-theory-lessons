import type { RefObject } from 'react';

/** Static data that identifies one task in an exercise. */
export interface ExerciseStageDefinition {
  /** Stable within the exercise. Do not derive this value from its position. */
  id: string;
  title: string;
  instruction: string;
  nextActionLabel?: string;
}

/** Stage data reported to the lesson flow when the active task changes. */
export interface ActiveExerciseStage extends ExerciseStageDefinition {
  position: number;
  total: number;
}

export type ExerciseStageResult = 'idle' | 'incorrect' | 'passed';

export type ExerciseStageChangeHandler = (stage: ActiveExerciseStage) => void;

/** Shared props implemented by lesson exercise tools. */
export interface ExerciseToolProps {
  interactive?: boolean;
  onComplete?: () => void;
  onStageChange?: ExerciseStageChangeHandler;
}

/** State and transitions returned by useExerciseStages. */
export interface ExerciseStageController {
  stages: readonly ExerciseStageDefinition[];
  activeStage: ActiveExerciseStage;
  completedStageIds: readonly string[];
  attemptedStageIds: readonly string[];
  result: ExerciseStageResult;
  isFinalStage: boolean;
  stageHeadingRef: RefObject<HTMLHeadingElement | null>;
  markIncorrect: () => void;
  markPassed: () => void;
  retry: () => void;
  advance: () => void;
}
