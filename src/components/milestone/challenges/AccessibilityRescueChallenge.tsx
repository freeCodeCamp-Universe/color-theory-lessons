import { useEffect, useMemo, useState } from 'react';
import { ACCESSIBILITY_RESCUE_SESSION_PREFIX } from '../../../state/persistence.ts';
import { contrastRatioWcag, hexToRgb, hslToHex } from '../../../utils/color.ts';
import { ExerciseStage } from '../../tools/ExerciseStage.tsx';
import type { ExerciseStageDefinition, ExerciseStageResult } from '../../tools/exercise-stage.ts';
import { useExerciseStages } from '../../tools/useExerciseStages.ts';
import styles from './AccessibilityRescueChallenge.module.css';
import type { MilestoneChallengeProps, StoredMilestoneStage } from './milestone-stage.ts';
import { restoreMilestoneStage } from './milestone-stage.ts';

interface AccessibilityRescueSession extends StoredMilestoneStage {
  version: 1;
  textLightness: number;
  requiredCueOn: boolean;
  focusVisible: boolean;
  iconLightness: number;
}

const DEFAULT_SESSION: AccessibilityRescueSession = {
  version: 1,
  textLightness: 55,
  requiredCueOn: false,
  focusVisible: false,
  iconLightness: 72,
  activeStageId: 'body-text-contrast',
  stageResult: 'idle',
};

const STAGES: readonly ExerciseStageDefinition[] = [
  { id: 'body-text-contrast', title: 'Repair body text contrast', instruction: 'Adjust the body text until it reaches at least 4.5:1 contrast.', nextActionLabel: 'continue to required-field cue' },
  { id: 'required-field-cue', title: 'Add a required-field cue', instruction: 'Add a non-color cue that identifies the required field.', nextActionLabel: 'continue to focus indicator' },
  { id: 'focus-indicator', title: 'Add a focus indicator', instruction: 'Give the submit button a visible keyboard focus indicator.', nextActionLabel: 'continue to icon contrast' },
  { id: 'icon-contrast', title: 'Repair icon contrast', instruction: 'Adjust the settings icon until it reaches at least 3:1 contrast.' },
];

function validInteger(value: unknown, minimum: number, maximum: number): value is number {
  return Number.isInteger(value) && (value as number) >= minimum && (value as number) <= maximum;
}

function loadSession(sessionKey?: string): AccessibilityRescueSession {
  if (!sessionKey) return DEFAULT_SESSION;

  try {
    const stored = sessionStorage.getItem(`${ACCESSIBILITY_RESCUE_SESSION_PREFIX}${sessionKey}`);
    if (stored === null) return DEFAULT_SESSION;
    const parsed: unknown = JSON.parse(stored);
    if (typeof parsed !== 'object' || parsed === null) return DEFAULT_SESSION;
    const saved = parsed as Partial<AccessibilityRescueSession>;

    return {
      version: 1,
      textLightness: validInteger(saved.textLightness, 20, 70) ? saved.textLightness : DEFAULT_SESSION.textLightness,
      requiredCueOn: saved.requiredCueOn === true,
      focusVisible: saved.focusVisible === true,
      iconLightness: validInteger(saved.iconLightness, 20, 90) ? saved.iconLightness : DEFAULT_SESSION.iconLightness,
      ...restoreMilestoneStage(saved, STAGES),
    };
  } catch {
    return DEFAULT_SESSION;
  }
}

function saveSession(sessionKey: string | undefined, session: AccessibilityRescueSession) {
  if (!sessionKey) return;
  try {
    sessionStorage.setItem(`${ACCESSIBILITY_RESCUE_SESSION_PREFIX}${sessionKey}`, JSON.stringify(session));
  } catch {
    // Continue without per-tab challenge persistence when storage is unavailable.
  }
}

function textColorFromLightness(lightness: number): string {
  return hslToHex(220, 18, lightness);
}

export function AccessibilityRescueChallenge({
  onComplete,
  sessionKey,
  onStageChange,
}: MilestoneChallengeProps) {
  const [initialSession] = useState(() => loadSession(sessionKey));
  const [textLightness, setTextLightness] = useState(initialSession.textLightness);
  const [requiredCueOn, setRequiredCueOn] = useState(initialSession.requiredCueOn);
  const [focusVisible, setFocusVisible] = useState(initialSession.focusVisible);
  const [iconLightness, setIconLightness] = useState(initialSession.iconLightness);
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
      textLightness,
      requiredCueOn,
      focusVisible,
      iconLightness,
      activeStageId: stageController.activeStage.id,
      stageResult: stageController.result,
    });
  }, [focusVisible, iconLightness, requiredCueOn, sessionKey, stageController.activeStage.id, stageController.result, textLightness]);

  const checks = useMemo(() => {
    const textColor = textColorFromLightness(textLightness);
    const textContrast = contrastRatioWcag(hexToRgb(textColor), hexToRgb('#f5f7fb'));
    const iconColor = hslToHex(220, 14, iconLightness);
    const iconContrast = contrastRatioWcag(hexToRgb(iconColor), hexToRgb('#ffffff'));

    return {
      textColor,
      iconColor,
      textContrast,
      iconContrast,
      'body-text-contrast': textContrast >= 4.5,
      'required-field-cue': requiredCueOn,
      'focus-indicator': focusVisible,
      'icon-contrast': iconContrast >= 3,
    };
  }, [focusVisible, iconLightness, requiredCueOn, textLightness]);

  const stagePassed = checks[stageController.activeStage.id as keyof typeof checks] === true;
  const showResult = stageController.attemptedStageIds.includes(stageController.activeStage.id);

  function checkRepair() {
    if (stagePassed) stageController.markPassed();
    else stageController.markIncorrect();
  }

  return (
    <div className={styles.panel}>
      <ExerciseStage
        controller={stageController}
        incorrectFeedback="This repair does not pass its target yet. Adjust it and try again."
        passedFeedback={`This accessibility repair passes. Next action: ${stageController.activeStage.nextActionLabel}.`}
        completionFeedback="The icon reaches 3:1 contrast. All four repairs are complete."
      >
        {stageController.activeStage.id === 'body-text-contrast' && (
          <section className={styles.block}>
            <p data-authored-visual className={styles.sample} style={{ color: checks.textColor, backgroundColor: '#f5f7fb' }}>This paragraph starts below the required contrast ratio.</p>
            <label className={styles.sliderLabel}>
              Text lightness: {textLightness}
              <input type="range" min={20} max={70} value={textLightness} disabled={stageController.result !== 'idle'} onChange={(event) => setTextLightness(Number(event.target.value))} />
            </label>
            <p className={showResult ? (checks['body-text-contrast'] ? styles.good : styles.bad) : undefined}>
              {showResult ? (checks['body-text-contrast'] ? 'Pass: ' : 'Not passed: ') : ''}Contrast: {checks.textContrast.toFixed(2)}:1 (minimum 4.5:1)
            </p>
          </section>
        )}

        {stageController.activeStage.id === 'required-field-cue' && (
          <section className={styles.block}>
            <div className={styles.row}>
              <span className={styles.colorOnlyLabel}>Email address</span>
              <button type="button" className={styles.toggle} aria-pressed={requiredCueOn} disabled={stageController.result !== 'idle'} onClick={() => setRequiredCueOn((previous) => !previous)}>
                {requiredCueOn ? 'remove icon and text cue' : 'add icon and text cue'}
              </button>
            </div>
            {requiredCueOn && <p className={styles.note}>! Required field</p>}
            <p className={showResult ? (requiredCueOn ? styles.good : styles.bad) : undefined}>
              {showResult ? (requiredCueOn ? 'Pass: non-color cue added.' : 'Not passed: still color-only.') : `Current cue: ${requiredCueOn ? 'icon and text' : 'color only'}.`}
            </p>
          </section>
        )}

        {stageController.activeStage.id === 'focus-indicator' && (
          <section className={styles.block}>
            <div className={styles.row}>
              <button data-authored-visual type="button" className={`${styles.fakeButton} ${focusVisible ? styles.focusOn : ''}`}>Submit</button>
              <button type="button" className={styles.toggle} aria-pressed={focusVisible} disabled={stageController.result !== 'idle'} onClick={() => setFocusVisible((previous) => !previous)}>
                {focusVisible ? 'remove focus indicator' : 'add focus indicator'}
              </button>
            </div>
            <p className={showResult ? (focusVisible ? styles.good : styles.bad) : undefined}>
              {showResult ? (focusVisible ? 'Pass: focus indicator is visible.' : 'Not passed: focus indicator missing.') : `Current focus indicator: ${focusVisible ? 'visible' : 'none'}.`}
            </p>
          </section>
        )}

        {stageController.activeStage.id === 'icon-contrast' && (
          <section className={styles.block}>
            <div className={styles.iconPreview}>
              <span className={styles.icon} style={{ color: checks.iconColor }} role="img" aria-label="Settings">⚙</span>
            </div>
            <label className={styles.sliderLabel}>
              Icon lightness: {iconLightness}
              <input type="range" min={20} max={90} value={iconLightness} disabled={stageController.result !== 'idle'} onChange={(event) => setIconLightness(Number(event.target.value))} />
            </label>
            <p className={showResult ? (checks['icon-contrast'] ? styles.good : styles.bad) : undefined}>
              {showResult ? (checks['icon-contrast'] ? 'Pass: ' : 'Not passed: ') : ''}Contrast: {checks.iconContrast.toFixed(2)}:1 (minimum 3:1)
            </p>
          </section>
        )}

        {stageController.result === 'idle' && (
          <div className={styles.actions}>
            <button type="button" className={styles.button} onClick={checkRepair}>check repair</button>
          </div>
        )}
      </ExerciseStage>
    </div>
  );
}
