import { useEffect, useMemo, useState } from 'react';
import { SEMANTIC_AUDIT_SESSION_PREFIX } from '../../../state/persistence.ts';
import { ExerciseStage } from '../../tools/ExerciseStage.tsx';
import type { ExerciseStageDefinition, ExerciseStageResult } from '../../tools/exercise-stage.ts';
import { useExerciseStages } from '../../tools/useExerciseStages.ts';
import styles from './SemanticAuditChallenge.module.css';
import type { MilestoneChallengeProps, StoredMilestoneStage } from './milestone-stage.ts';
import { restoreMilestoneStage } from './milestone-stage.ts';

type Role = 'page-bg' | 'surface' | 'primary-text' | 'secondary-text' | 'action' | 'success' | 'warning' | 'error';

interface Swatch {
  id: string;
  hex: string;
  role: Role;
}

const SWATCHES: Swatch[] = [
  { id: 's1', hex: '#0b1220', role: 'page-bg' },
  { id: 's2', hex: '#1c2536', role: 'surface' },
  { id: 's3', hex: '#f8fafc', role: 'primary-text' },
  { id: 's4', hex: '#cbd5e1', role: 'secondary-text' },
  { id: 's5', hex: '#3b82f6', role: 'action' },
  { id: 's6', hex: '#84cc16', role: 'success' },
  { id: 's7', hex: '#f97316', role: 'warning' },
  { id: 's8', hex: '#fb7185', role: 'error' },
];

const ROLE_LABELS: Record<Role, string> = {
  'page-bg': 'Page background', surface: 'Surface', 'primary-text': 'Primary text',
  'secondary-text': 'Secondary text', action: 'Action', success: 'Success', warning: 'Warning', error: 'Error',
};
const ROLES = Object.keys(ROLE_LABELS) as Role[];
const PROBLEM_ANSWER = 'warning-error-too-close';
const STAGES: readonly ExerciseStageDefinition[] = [
  { id: 'assign-roles', title: 'Assign semantic roles', instruction: 'Assign every swatch to a role. At least seven assignments must be correct.', nextActionLabel: 'continue to conflict identification' },
  { id: 'identify-conflict', title: 'Identify the palette conflict', instruction: 'Inspect the palette and identify the role pair with weak separation.' },
];

interface SemanticAuditSession extends StoredMilestoneStage {
  version: 1;
  activeSwatch: string | null;
  assignments: Partial<Record<Role, string>>;
  problem: string;
}

const DEFAULT_SESSION: SemanticAuditSession = {
  version: 1,
  activeSwatch: null,
  assignments: {},
  problem: '',
  activeStageId: STAGES[0].id,
  stageResult: 'idle',
};

function loadSession(sessionKey?: string): SemanticAuditSession {
  if (!sessionKey) return DEFAULT_SESSION;
  try {
    const stored = sessionStorage.getItem(`${SEMANTIC_AUDIT_SESSION_PREFIX}${sessionKey}`);
    if (stored === null) return DEFAULT_SESSION;
    const parsed: unknown = JSON.parse(stored);
    if (typeof parsed !== 'object' || parsed === null) return DEFAULT_SESSION;
    const saved = parsed as Partial<SemanticAuditSession>;
    const assignments: Partial<Record<Role, string>> = {};

    if (typeof saved.assignments === 'object' && saved.assignments !== null) {
      for (const role of ROLES) {
        const swatchId = saved.assignments[role];
        if (typeof swatchId === 'string' && SWATCHES.some((swatch) => swatch.id === swatchId)) {
          assignments[role] = swatchId;
        }
      }
    }

    return {
      version: 1,
      activeSwatch: typeof saved.activeSwatch === 'string' && SWATCHES.some((swatch) => swatch.id === saved.activeSwatch) ? saved.activeSwatch : null,
      assignments,
      problem: typeof saved.problem === 'string' ? saved.problem : '',
      ...restoreMilestoneStage(saved, STAGES),
    };
  } catch {
    return DEFAULT_SESSION;
  }
}

function saveSession(sessionKey: string | undefined, session: SemanticAuditSession) {
  if (!sessionKey) return;
  try {
    sessionStorage.setItem(`${SEMANTIC_AUDIT_SESSION_PREFIX}${sessionKey}`, JSON.stringify(session));
  } catch {
    // Continue without per-tab challenge persistence when storage is unavailable.
  }
}

export function SemanticAuditChallenge({
  onComplete,
  sessionKey,
  onStageChange,
}: MilestoneChallengeProps) {
  const [initialSession] = useState(() => loadSession(sessionKey));
  const [activeSwatch, setActiveSwatch] = useState<string | null>(initialSession.activeSwatch);
  const [assignments, setAssignments] = useState<Partial<Record<Role, string>>>(initialSession.assignments);
  const [problem, setProblem] = useState(initialSession.problem);
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
      activeSwatch,
      assignments,
      problem,
      activeStageId: stageController.activeStage.id,
      stageResult: stageController.result,
    });
  }, [activeSwatch, assignments, problem, sessionKey, stageController.activeStage.id, stageController.result]);

  const correctCount = useMemo(() => ROLES.reduce((count, role) => {
    const swatch = SWATCHES.find((candidate) => candidate.id === assignments[role]);
    return count + Number(swatch?.role === role);
  }, 0), [assignments]);
  const labelsAssigned = ROLES.every((role) => Boolean(assignments[role]));
  const isAssignmentStage = stageController.activeStage.id === 'assign-roles';
  const stagePassed = isAssignmentStage
    ? labelsAssigned && correctCount >= 7
    : problem === PROBLEM_ANSWER;

  function assignActiveSwatch(role: Role) {
    if (!activeSwatch || stageController.result !== 'idle') return;
    setAssignments((previous) => ({ ...previous, [role]: activeSwatch }));
  }

  function checkStage() {
    if (stagePassed) stageController.markPassed();
    else stageController.markIncorrect();
  }

  return (
    <div className={styles.panel}>
      <ExerciseStage
        controller={stageController}
        incorrectFeedback={isAssignmentStage
          ? `${correctCount} of 8 assignments are correct. Assign every role with at least seven correct.`
          : 'That is not the weak role pair in this palette.'}
        passedFeedback={`${correctCount} of 8 role assignments are correct.`}
        completionFeedback="The warning and error colors have weak luminance separation. Challenge complete."
      >
        <div className={styles.header}>
          <span>{isAssignmentStage ? 'Assign semantic roles' : 'Inspect semantic conflicts'}</span>
          {isAssignmentStage && <span>{correctCount} / 8 correct</span>}
        </div>

        <div className={styles.swatches}>
          {SWATCHES.map((swatch) => isAssignmentStage ? (
            <button
              key={swatch.id}
              type="button"
              className={`${styles.swatch} ${activeSwatch === swatch.id ? styles.active : ''}`}
              onClick={() => setActiveSwatch(swatch.id)}
              aria-label={`Select swatch ${swatch.hex}`}
              aria-pressed={activeSwatch === swatch.id}
              disabled={stageController.result !== 'idle'}
            >
              <span className={styles.color} style={{ backgroundColor: swatch.hex }} />
              <code>{swatch.hex.toUpperCase()}</code>
            </button>
          ) : (
            <div key={swatch.id} className={styles.swatch}>
              <span className={styles.color} style={{ backgroundColor: swatch.hex }} />
              <code>{swatch.hex.toUpperCase()}</code>
            </div>
          ))}
        </div>

        {isAssignmentStage ? (
          <>
            <div className={styles.roles}>
              {ROLES.map((role) => (
                <button
                  key={role}
                  type="button"
                  className={styles.role}
                  onClick={() => assignActiveSwatch(role)}
                  disabled={!activeSwatch || stageController.result !== 'idle'}
                  aria-label={`${ROLE_LABELS[role]}: ${assignments[role] ? SWATCHES.find((swatch) => swatch.id === assignments[role])?.hex.toUpperCase() : 'unassigned'}`}
                >
                  <span>{ROLE_LABELS[role]}</span>
                  <code>{assignments[role] ? SWATCHES.find((swatch) => swatch.id === assignments[role])?.hex.toUpperCase() : 'unassigned'}</code>
                </button>
              ))}
            </div>
            <p className={styles.help}>Select a swatch first, then click a role label to assign it.</p>
          </>
        ) : (
          <div className={styles.problem}>
            <label htmlFor="semantic-role-problem">Which role issue exists in this set?</label>
            <select id="semantic-role-problem" value={problem} disabled={stageController.result !== 'idle'} onChange={(event) => setProblem(event.target.value)}>
              <option value="">Choose issue...</option>
              <option value="warning-error-too-close">Warning and error have too little luminance contrast</option>
              <option value="surface-too-bright">Page background and surface have the same lightness</option>
              <option value="action-too-muted">Action and success use the same hue</option>
              <option value="success-too-dark">Primary and secondary text use the same color value</option>
            </select>
          </div>
        )}

        {stageController.result === 'idle' && (
          <div className={styles.actions}>
            <button type="button" className={styles.button} onClick={checkStage}>check {isAssignmentStage ? 'roles' : 'conflict'}</button>
          </div>
        )}
      </ExerciseStage>
    </div>
  );
}
