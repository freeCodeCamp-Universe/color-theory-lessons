import { useMemo, useState } from 'react';
import type { ChallengeHint } from '../../types/lesson.ts';
import styles from './LessonPlayer.module.css';

interface ChallengeHintsProps {
  hints: readonly ChallengeHint[];
  activeStageId: string | null;
  resetKey: string;
}

function hintText(hint: ChallengeHint) {
  return typeof hint === 'string' ? hint : hint.text;
}

function hintStageId(hint: ChallengeHint) {
  return typeof hint === 'string' ? undefined : hint.stageId;
}

/** Reveals challenge hints one at a time for the active exercise stage. */
function HintList({ hints, activeStageId }: Omit<ChallengeHintsProps, 'resetKey'>) {
  const [revealedCount, setRevealedCount] = useState(0);
  const availableHints = useMemo(() => hints.filter((hint) => {
    const stageId = hintStageId(hint);
    return stageId === undefined || stageId === activeStageId;
  }), [activeStageId, hints]);

  if (availableHints.length === 0) return null;

  const revealedHints = availableHints.slice(0, revealedCount);
  const latestHint = revealedHints.at(-1);

  return (
    <div className={styles.hints}>
      {revealedHints.length > 0 && (
        <>
          <span className={styles.hintsLabel}>hints</span>
          {revealedHints.map((hint, index) => (
            <p key={`${hintText(hint)}-${index}`} className={styles.hint}>{hintText(hint)}</p>
          ))}
        </>
      )}
      <span className={styles.srOnly} role="status" aria-live="polite" aria-atomic="true">
        {latestHint ? `Hint: ${hintText(latestHint)}` : ''}
      </span>
      {revealedCount < availableHints.length && (
        <button
          type="button"
          className={styles.btnSecondary}
          onClick={() => setRevealedCount((count) => count + 1)}
        >
          {revealedCount === 0 ? 'show hint' : 'show next hint'}
        </button>
      )}
    </div>
  );
}

export function ChallengeHints({ hints, activeStageId, resetKey }: ChallengeHintsProps) {
  return (
    <HintList
      key={`${resetKey}:${activeStageId ?? 'exercise'}`}
      hints={hints}
      activeStageId={activeStageId}
    />
  );
}
