import { useEffect, useMemo, useState } from 'react';
import { READ_INTERFACE_SESSION_PREFIX } from '../../../state/persistence.ts';
import { ExerciseStage } from '../../tools/ExerciseStage.tsx';
import type { ExerciseStageDefinition, ExerciseStageResult } from '../../tools/exercise-stage.ts';
import { useExerciseStages } from '../../tools/useExerciseStages.ts';
import styles from './ReadInterfaceChallenge.module.css';
import type { MilestoneChallengeProps, StoredMilestoneStage } from './milestone-stage.ts';
import { restoreMilestoneStage } from './milestone-stage.ts';
import { InterfaceMockup } from '../InterfaceMockup.tsx';

type RoleId = 'focal' | 'low-contrast' | 'competing-accent' | 'readable-text' | 'section-separator';

type Target = {
  id: string;
  label: string;
  correctRole: RoleId;
};

const ROLE_OPTIONS: { id: RoleId; label: string }[] = [
  { id: 'focal', label: 'Focal point' },
  { id: 'low-contrast', label: 'Low-contrast failure' },
  { id: 'competing-accent', label: 'Competing accent' },
  { id: 'readable-text', label: 'Readable text' },
  { id: 'section-separator', label: 'Section separator' },
];

const TARGETS: Target[] = [
  { id: 'cta', label: 'Green “Try it free” button', correctRole: 'focal' },
  { id: 'nav', label: 'Navigation links on blue header', correctRole: 'low-contrast' },
  { id: 'card', label: 'Orange card labels', correctRole: 'competing-accent' },
  { id: 'hero', label: 'Hero headline text', correctRole: 'readable-text' },
  { id: 'hero-bg', label: 'Blue hero section', correctRole: 'section-separator' },
];

const MIN_TO_PASS = 4;
const STAGES: readonly ExerciseStageDefinition[] = [{
  id: 'classify-interface-regions',
  title: 'Classify interface regions',
  instruction: 'Assign a color role to each region, then check your classifications.',
}];

interface ReadInterfaceSession extends StoredMilestoneStage {
  version: 1;
  answers: Record<string, RoleId | ''>;
}

function loadSession(sessionKey?: string): ReadInterfaceSession {
  const fallback: ReadInterfaceSession = {
    version: 1,
    answers: {},
    activeStageId: STAGES[0].id,
    stageResult: 'idle',
  };
  if (!sessionKey) return fallback;

  try {
    const stored = sessionStorage.getItem(`${READ_INTERFACE_SESSION_PREFIX}${sessionKey}`);
    if (stored === null) return fallback;
    const parsed: unknown = JSON.parse(stored);
    if (typeof parsed !== 'object' || parsed === null) return fallback;
    const saved = parsed as Partial<ReadInterfaceSession>;
    const roleIds = new Set(ROLE_OPTIONS.map((role) => role.id));
    const answers: Record<string, RoleId | ''> = {};

    if (typeof saved.answers === 'object' && saved.answers !== null) {
      for (const target of TARGETS) {
        const value = saved.answers[target.id];
        if (value === '' || roleIds.has(value as RoleId)) answers[target.id] = value as RoleId | '';
      }
    }

    const stage = restoreMilestoneStage(saved, STAGES);
    const allAnswered = TARGETS.every((target) => answers[target.id]);
    return {
      version: 1,
      answers,
      ...stage,
      stageResult: allAnswered ? stage.stageResult : 'idle',
    };
  } catch {
    return fallback;
  }
}

function saveSession(sessionKey: string | undefined, session: ReadInterfaceSession) {
  if (!sessionKey) return;
  try {
    sessionStorage.setItem(`${READ_INTERFACE_SESSION_PREFIX}${sessionKey}`, JSON.stringify(session));
  } catch {
    // Continue without per-tab challenge persistence when storage is unavailable.
  }
}

export function ReadInterfaceChallenge({
  onComplete,
  sessionKey,
  onStageChange,
}: MilestoneChallengeProps) {
  const [initialSession] = useState(() => loadSession(sessionKey));
  const [answers, setAnswers] = useState<Record<string, RoleId | ''>>(initialSession.answers);
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
      answers,
      activeStageId: stageController.activeStage.id,
      stageResult: stageController.result,
    });
  }, [answers, sessionKey, stageController.activeStage.id, stageController.result]);

  const correctCount = useMemo(() => TARGETS.reduce((count, target) => (
    count + Number(answers[target.id] === target.correctRole)
  ), 0), [answers]);
  const allAnswered = TARGETS.every((target) => answers[target.id]);
  const passed = correctCount >= MIN_TO_PASS;

  function checkAnswers() {
    if (!allAnswered) return;
    if (passed) stageController.markPassed();
    else stageController.markIncorrect();
  }

  return (
    <div className={styles.panel}>
      <InterfaceMockup />

      <ExerciseStage
        controller={stageController}
        incorrectFeedback={`${correctCount} of 5 correct. You need at least 4 correct.`}
        completionFeedback={`${correctCount} of 5 correct. Interface classification complete.`}
        onRetry={() => setAnswers({})}
      >
        <div className={styles.meta}>
          <span>Label 5 interface regions</span>
          <span className={styles.score}>
            {stageController.result === 'idle'
              ? `${TARGETS.filter((target) => answers[target.id]).length} / 5 answered`
              : `${correctCount} / 5 correct`}
          </span>
        </div>

        <div className={styles.grid}>
          {TARGETS.map((target) => {
            const selected = answers[target.id] ?? '';
            const isCorrect = stageController.result !== 'idle' && selected === target.correctRole;
            const isWrong = stageController.result !== 'idle' && selected !== target.correctRole;
            return (
              <label key={target.id} className={styles.row}>
                <span className={styles.label}>{target.label}</span>
                <select
                  className={styles.select}
                  value={selected}
                  onChange={(event) => {
                    const value = event.target.value as RoleId | '';
                    setAnswers((previous) => ({ ...previous, [target.id]: value }));
                  }}
                  disabled={stageController.result !== 'idle'}
                  aria-invalid={isWrong || undefined}
                >
                  <option value="">Choose role...</option>
                  {ROLE_OPTIONS.map((role) => (
                    <option key={role.id} value={role.id}>{role.label}</option>
                  ))}
                </select>
                <span className={`${styles.hint} ${isCorrect ? styles.good : isWrong ? styles.bad : ''}`}>
                  {isCorrect ? 'Correct role.' : isWrong ? 'Try another role.' : ''}
                </span>
              </label>
            );
          })}
        </div>

        {stageController.result === 'idle' && (
          <div className={styles.actions}>
            <button
              type="button"
              className={styles.button}
              onClick={checkAnswers}
              disabled={!allAnswered}
            >
              check classifications
            </button>
          </div>
        )}
      </ExerciseStage>
    </div>
  );
}
