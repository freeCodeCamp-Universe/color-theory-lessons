import { useEffect, useMemo, useRef, useState } from 'react';
import { SEMANTIC_AUDIT_SESSION_PREFIX } from '../../../state/persistence.ts';
import styles from './SemanticAuditChallenge.module.css';

interface SemanticAuditChallengeProps {
  onComplete: () => void;
  sessionKey?: string;
}

type Role =
  | 'page-bg'
  | 'surface'
  | 'primary-text'
  | 'secondary-text'
  | 'action'
  | 'success'
  | 'warning'
  | 'error';

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
  'page-bg': 'Page background',
  surface: 'Surface',
  'primary-text': 'Primary text',
  'secondary-text': 'Secondary text',
  action: 'Action',
  success: 'Success',
  warning: 'Warning',
  error: 'Error',
};

const PROBLEM_ANSWER = 'warning-error-too-close';

const ROLES = Object.keys(ROLE_LABELS) as Role[];

interface SemanticAuditSession {
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
        if (
          typeof swatchId === 'string'
          && SWATCHES.some((swatch) => swatch.id === swatchId)
        ) {
          assignments[role] = swatchId;
        }
      }
    }

    return {
      version: 1,
      activeSwatch: typeof saved.activeSwatch === 'string'
        && SWATCHES.some((swatch) => swatch.id === saved.activeSwatch)
        ? saved.activeSwatch
        : null,
      assignments,
      problem: typeof saved.problem === 'string' ? saved.problem : '',
    };
  } catch {
    return DEFAULT_SESSION;
  }
}

function saveSession(sessionKey: string | undefined, session: SemanticAuditSession) {
  if (!sessionKey) return;
  try {
    sessionStorage.setItem(
      `${SEMANTIC_AUDIT_SESSION_PREFIX}${sessionKey}`,
      JSON.stringify(session),
    );
  } catch {
    // Continue without per-tab challenge persistence when storage is unavailable.
  }
}

export function SemanticAuditChallenge({ onComplete, sessionKey }: SemanticAuditChallengeProps) {
  const [initialSession] = useState(() => loadSession(sessionKey));
  const [activeSwatch, setActiveSwatch] = useState<string | null>(initialSession.activeSwatch);
  const [assignments, setAssignments] = useState<Partial<Record<Role, string>>>(initialSession.assignments);
  const [problem, setProblem] = useState(initialSession.problem);
  const completionSent = useRef(false);

  useEffect(() => {
    saveSession(sessionKey, { version: 1, activeSwatch, assignments, problem });
  }, [activeSwatch, assignments, problem, sessionKey]);

  const correctCount = useMemo(() => {
    return ROLES.reduce((acc, role) => {
      const selectedId = assignments[role];
      const swatch = SWATCHES.find((candidate) => candidate.id === selectedId);
      return swatch?.role === role ? acc + 1 : acc;
    }, 0);
  }, [assignments]);

  const labelsAssigned = ROLES.every((role) => !!assignments[role]);
  const rolePass = correctCount >= 7;
  const problemPass = problem === PROBLEM_ANSWER;
  const passed = labelsAssigned && rolePass && problemPass;

  function assignActiveSwatch(role: Role) {
    if (!activeSwatch) return;
    setAssignments((previous) => ({ ...previous, [role]: activeSwatch }));
  }

  function handleComplete() {
    if (!passed || completionSent.current) return;
    completionSent.current = true;
    onComplete();
  }

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <span>Assign semantic roles</span>
        <span>{correctCount} / 8 correct</span>
      </div>

      <div className={styles.swatches}>
        {SWATCHES.map((swatch) => (
          <button
            key={swatch.id}
            type="button"
            className={`${styles.swatch} ${activeSwatch === swatch.id ? styles.active : ''}`}
            onClick={() => setActiveSwatch(swatch.id)}
            aria-label={`Select swatch ${swatch.hex}`}
            aria-pressed={activeSwatch === swatch.id}
          >
            <span className={styles.color} style={{ backgroundColor: swatch.hex }} />
            <code>{swatch.hex.toUpperCase()}</code>
          </button>
        ))}
      </div>

      <div className={styles.roles}>
        {ROLES.map((role) => (
          <button
            key={role}
            type="button"
            className={styles.role}
            onClick={() => assignActiveSwatch(role)}
            disabled={!activeSwatch}
            aria-label={`${ROLE_LABELS[role]}: ${assignments[role]
              ? SWATCHES.find((swatch) => swatch.id === assignments[role])?.hex.toUpperCase()
              : 'unassigned'}`}
          >
            <span>{ROLE_LABELS[role]}</span>
            <code>{assignments[role] ? SWATCHES.find((swatch) => swatch.id === assignments[role])?.hex.toUpperCase() : 'unassigned'}</code>
          </button>
        ))}
      </div>

      <p className={styles.help}>
        Select a swatch first, then click a role label to assign it.
      </p>

      <div className={styles.problem}>
        <label htmlFor="semantic-role-problem">Which role issue exists in this set?</label>
        <select id="semantic-role-problem" value={problem} onChange={(event) => setProblem(event.target.value)}>
          <option value="">Choose issue...</option>
          <option value="warning-error-too-close">Warning and error hues are too close</option>
          <option value="surface-too-bright">Surface is brighter than primary text</option>
          <option value="action-too-muted">Action color is too muted for links</option>
          <option value="success-too-dark">Success color is darker than page background</option>
        </select>
      </div>

      <div className={styles.status} role="status" aria-live="polite" aria-atomic="true">
        <p className={rolePass && labelsAssigned ? styles.good : styles.bad}>
          {rolePass && labelsAssigned ? 'Pass' : 'Not passed'}: Assign all eight roles with at least seven correct.
        </p>
        <p className={problemPass ? styles.good : styles.bad}>
          {problemPass ? 'Pass' : 'Not passed'}: Identify the warning and error color conflict.
        </p>
      </div>

      <div className={styles.actions}>
        <button type="button" className={styles.button} disabled={!passed} onClick={handleComplete}>
          finish challenge
        </button>
      </div>
    </div>
  );
}
