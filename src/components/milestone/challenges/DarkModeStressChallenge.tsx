import { useEffect, useMemo, useState } from 'react';
import { DARK_MODE_STRESS_SESSION_PREFIX } from '../../../state/persistence.ts';
import { contrastRatioWcag, hexToRgb, hslToHex } from '../../../utils/color.ts';
import { ExerciseStage } from '../../tools/ExerciseStage.tsx';
import type { ExerciseStageDefinition, ExerciseStageResult } from '../../tools/exercise-stage.ts';
import { useExerciseStages } from '../../tools/useExerciseStages.ts';
import styles from './DarkModeStressChallenge.module.css';
import type { MilestoneChallengeProps, StoredMilestoneStage } from './milestone-stage.ts';
import { restoreMilestoneStage } from './milestone-stage.ts';

interface DarkModeStressSession extends StoredMilestoneStage {
  version: 1;
  textLightness: number;
  surfaceLightness: number;
  actionLightness: number;
}

const STAGES: readonly ExerciseStageDefinition[] = [
  { id: 'text-contrast', title: 'Repair text contrast', instruction: 'Adjust the text until it reaches 4.5:1 against the card surface.', nextActionLabel: 'continue to surface hierarchy' },
  { id: 'surface-hierarchy', title: 'Repair surface hierarchy', instruction: 'Adjust the card surface until it reaches the 1.2:1 exercise target without breaking text readability.', nextActionLabel: 'continue to action contrast' },
  { id: 'action-contrast', title: 'Repair action contrast', instruction: 'Adjust the action until it reaches 3:1 against the card surface.' },
];

const DEFAULT_SESSION: DarkModeStressSession = {
  version: 1,
  textLightness: 70,
  surfaceLightness: 40,
  actionLightness: 40,
  activeStageId: STAGES[0].id,
  stageResult: 'idle',
};

function formatContrastRatio(ratio: number): string {
  return (Math.floor(ratio * 10) / 10).toFixed(1);
}

function validInteger(value: unknown, minimum: number, maximum: number): value is number {
  return Number.isInteger(value) && (value as number) >= minimum && (value as number) <= maximum;
}

function loadSession(sessionKey?: string): DarkModeStressSession {
  if (!sessionKey) return DEFAULT_SESSION;
  try {
    const stored = sessionStorage.getItem(`${DARK_MODE_STRESS_SESSION_PREFIX}${sessionKey}`);
    if (stored === null) return DEFAULT_SESSION;
    const parsed: unknown = JSON.parse(stored);
    if (typeof parsed !== 'object' || parsed === null) return DEFAULT_SESSION;
    const saved = parsed as Partial<DarkModeStressSession>;

    return {
      version: 1,
      textLightness: validInteger(saved.textLightness, 60, 100) ? saved.textLightness : DEFAULT_SESSION.textLightness,
      surfaceLightness: validInteger(saved.surfaceLightness, 10, 40) ? saved.surfaceLightness : DEFAULT_SESSION.surfaceLightness,
      actionLightness: validInteger(saved.actionLightness, 35, 85) ? saved.actionLightness : DEFAULT_SESSION.actionLightness,
      ...restoreMilestoneStage(saved, STAGES),
    };
  } catch {
    return DEFAULT_SESSION;
  }
}

function saveSession(sessionKey: string | undefined, session: DarkModeStressSession) {
  if (!sessionKey) return;
  try {
    sessionStorage.setItem(`${DARK_MODE_STRESS_SESSION_PREFIX}${sessionKey}`, JSON.stringify(session));
  } catch {
    // Continue without per-tab challenge persistence when storage is unavailable.
  }
}

export function DarkModeStressChallenge({
  onComplete,
  sessionKey,
  onStageChange,
}: MilestoneChallengeProps) {
  const [initialSession] = useState(() => loadSession(sessionKey));
  const [textL, setTextL] = useState(initialSession.textLightness);
  const [surfaceL, setSurfaceL] = useState(initialSession.surfaceLightness);
  const [actionL, setActionL] = useState(initialSession.actionLightness);
  const stageController = useExerciseStages({
    stages: STAGES,
    onComplete,
    onStageChange,
    initialStageId: initialSession.activeStageId as string,
    initialResult: initialSession.stageResult as ExerciseStageResult,
  });

  useEffect(() => {
    saveSession(sessionKey, {
      version: 1,
      textLightness: textL,
      surfaceLightness: surfaceL,
      actionLightness: actionL,
      activeStageId: stageController.activeStage.id,
      stageResult: stageController.result,
    });
  }, [actionL, sessionKey, stageController.activeStage.id, stageController.result, surfaceL, textL]);

  const checks = useMemo(() => {
    const bg = '#0a0a23';
    const text = hslToHex(220, 16, textL);
    const surface = hslToHex(222, 18, surfaceL);
    const action = hslToHex(221, 88, actionL);
    const darkActionText = '#0a0a23';
    const lightActionText = '#ffffff';
    const textContrast = contrastRatioWcag(hexToRgb(text), hexToRgb(surface));
    const hierarchyContrast = contrastRatioWcag(hexToRgb(surface), hexToRgb(bg));
    const actionContrast = contrastRatioWcag(hexToRgb(action), hexToRgb(surface));
    const actionText = contrastRatioWcag(hexToRgb(darkActionText), hexToRgb(action)) >= contrastRatioWcag(hexToRgb(lightActionText), hexToRgb(action)) ? darkActionText : lightActionText;

    return {
      bg, text, surface, action, actionText, textContrast, hierarchyContrast, actionContrast,
      textPass: textContrast >= 4.5,
      hierarchyPass: hierarchyContrast >= 1.2,
      actionPass: actionContrast >= 3,
    };
  }, [actionL, surfaceL, textL]);

  const stageId = stageController.activeStage.id;
  const stagePassed = stageId === 'text-contrast'
    ? checks.textPass
    : stageId === 'surface-hierarchy'
      ? checks.hierarchyPass && checks.textPass
      : checks.actionPass;
  const showResult = stageController.attemptedStageIds.includes(stageController.activeStage.id);

  function checkStage() {
    if (stagePassed) stageController.markPassed();
    else stageController.markIncorrect();
  }

  return (
    <div className={styles.panel}>
      <div className={styles.header}><span>Repair a broken dark theme</span></div>

      <ExerciseStage
        controller={stageController}
        incorrectFeedback={stageId === 'surface-hierarchy' && !checks.textPass
          ? 'The surface meets its target only when the completed text check also remains at 4.5:1.'
          : 'This contrast target is not met yet. Adjust the control and try again.'}
        passedFeedback={`This dark-theme contrast target passes. Next action: ${stageController.activeStage.nextActionLabel}.`}
        completionFeedback="The action reaches 3:1 against the surface. All three checks are complete."
      >
        <div className={styles.preview} style={{ backgroundColor: checks.bg }}>
          <div className={styles.surface} style={{ backgroundColor: checks.surface }}>
            <p className={styles.title} style={{ color: checks.text }}>Dashboard title</p>
            <span className={styles.action} style={{ backgroundColor: checks.action, color: checks.actionText }}>Apply changes</span>
          </div>
        </div>

        {stageId === 'text-contrast' && (
          <div className={styles.row}>
            <label htmlFor="dark-text">Text lightness ({textL})</label>
            <input id="dark-text" type="range" min={60} max={100} value={textL} disabled={stageController.result !== 'idle'} onChange={(event) => setTextL(Number(event.target.value))} />
            <span className={showResult ? (checks.textPass ? styles.good : styles.bad) : undefined}>{showResult ? `${checks.textPass ? 'Pass' : 'Not passed'}: ` : ''}Text against surface: {formatContrastRatio(checks.textContrast)}:1 (target: 4.5:1)</span>
          </div>
        )}

        {stageId === 'surface-hierarchy' && (
          <div className={styles.row}>
            <label htmlFor="dark-surface">Surface lightness ({surfaceL})</label>
            <input id="dark-surface" type="range" min={10} max={40} value={surfaceL} disabled={stageController.result !== 'idle'} onChange={(event) => setSurfaceL(Number(event.target.value))} />
            <span className={showResult ? (checks.hierarchyPass ? styles.good : styles.bad) : undefined}>{showResult ? `${checks.hierarchyPass ? 'Pass' : 'Not passed'}: ` : ''}Surface against background: {formatContrastRatio(checks.hierarchyContrast)}:1 (exercise target: 1.2:1)</span>
          </div>
        )}

        {stageId === 'action-contrast' && (
          <div className={styles.row}>
            <label htmlFor="dark-action">Action lightness ({actionL})</label>
            <input id="dark-action" type="range" min={35} max={85} value={actionL} disabled={stageController.result !== 'idle'} onChange={(event) => setActionL(Number(event.target.value))} />
            <span className={showResult ? (checks.actionPass ? styles.good : styles.bad) : undefined}>{showResult ? `${checks.actionPass ? 'Pass' : 'Not passed'}: ` : ''}Action against surface: {formatContrastRatio(checks.actionContrast)}:1 (target: 3.0:1)</span>
          </div>
        )}

        {stageController.result === 'idle' && (
          <div className={styles.actions}>
            <button type="button" className={styles.button} onClick={checkStage}>check contrast</button>
          </div>
        )}
      </ExerciseStage>
    </div>
  );
}
