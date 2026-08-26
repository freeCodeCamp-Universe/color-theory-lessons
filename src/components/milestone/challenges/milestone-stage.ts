import type {
  ExerciseStageChangeHandler,
  ExerciseStageDefinition,
  ExerciseStageResult,
} from '../../tools/exercise-stage.ts';

export interface MilestoneChallengeProps {
  onComplete: () => void;
  sessionKey?: string;
  onStageChange?: ExerciseStageChangeHandler;
}

export interface StoredMilestoneStage {
  activeStageId?: unknown;
  stageResult?: unknown;
}

export function restoreMilestoneStage(
  saved: StoredMilestoneStage,
  stages: readonly ExerciseStageDefinition[],
): { activeStageId: string; stageResult: ExerciseStageResult } {
  const activeStageId = typeof saved.activeStageId === 'string'
    && stages.some(({ id }) => id === saved.activeStageId)
    ? saved.activeStageId
    : stages[0].id;
  const stageResult = saved.stageResult === 'incorrect' || saved.stageResult === 'passed'
    ? saved.stageResult
    : 'idle';

  return { activeStageId, stageResult };
}
