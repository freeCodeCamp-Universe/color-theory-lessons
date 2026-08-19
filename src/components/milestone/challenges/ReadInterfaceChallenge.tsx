import { useEffect, useMemo, useState } from 'react';
import styles from './ReadInterfaceChallenge.module.css';
import { InterfaceMockup } from '../InterfaceMockup.tsx';

interface ReadInterfaceChallengeProps {
  onComplete: () => void;
  sessionKey?: string;
}

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

const READ_INTERFACE_SESSION_PREFIX = 'color-theory-course-read-interface-session:';

interface ReadInterfaceSession {
  version: 1;
  answers: Record<string, RoleId | ''>;
  submitted: boolean;
}

function loadSession(sessionKey?: string): ReadInterfaceSession {
  const fallback: ReadInterfaceSession = { version: 1, answers: {}, submitted: false };
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

    const allAnswered = TARGETS.every((target) => answers[target.id]);
    return { version: 1, answers, submitted: saved.submitted === true && allAnswered };
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

export function ReadInterfaceChallenge({ onComplete, sessionKey }: ReadInterfaceChallengeProps) {
  const [initialSession] = useState(() => loadSession(sessionKey));
  const [answers, setAnswers] = useState<Record<string, RoleId | ''>>(initialSession.answers);
  const [submitted, setSubmitted] = useState(initialSession.submitted);

  useEffect(() => {
    saveSession(sessionKey, { version: 1, answers, submitted });
  }, [answers, sessionKey, submitted]);

  const correctCount = useMemo(() => {
    return TARGETS.reduce((acc, target) => {
      return answers[target.id] === target.correctRole ? acc + 1 : acc;
    }, 0);
  }, [answers]);

  const allAnswered = TARGETS.every((target) => answers[target.id]);
  const passed = correctCount >= MIN_TO_PASS;
  const answeredCount = TARGETS.filter((target) => answers[target.id]).length;

  function handleAction() {
    if (!submitted) {
      if (allAnswered) setSubmitted(true);
      return;
    }

    if (passed) {
      onComplete();
      return;
    }

    setAnswers({});
    setSubmitted(false);
  }

  return (
    <div className={styles.panel}>
      <InterfaceMockup />

      <div className={styles.meta}>
        <span>Label 5 interface regions</span>
        <span className={styles.score}>
          {submitted ? `${correctCount} / 5 correct` : `${answeredCount} / 5 answered`}
        </span>
      </div>

      <div className={styles.grid}>
        {TARGETS.map((target) => {
          const selected = answers[target.id] ?? '';
          const isCorrect = submitted && selected === target.correctRole;
          const isWrong = submitted && selected !== target.correctRole;
          return (
            <label key={target.id} className={styles.row}>
              <span className={styles.label}>{target.label}</span>
              <select
                className={styles.select}
                value={selected}
                onChange={(event) => {
                  const value = event.target.value as RoleId | '';
                  setAnswers((prev) => ({ ...prev, [target.id]: value }));
                }}
                disabled={submitted}
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

      {submitted && (
        <p className={styles.result} role="status" aria-live="polite">
          {passed
            ? `${correctCount} of 5 correct. You can finish the challenge.`
            : `${correctCount} of 5 correct. You need at least 4 correct. Try again.`}
        </p>
      )}

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.button}
          onClick={handleAction}
          disabled={!submitted && !allAnswered}
        >
          {!submitted ? 'check answers' : passed ? 'finish challenge' : 'try again'}
        </button>
      </div>
    </div>
  );
}
