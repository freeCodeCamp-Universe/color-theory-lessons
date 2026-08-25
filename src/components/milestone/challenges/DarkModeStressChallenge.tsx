import { useEffect, useMemo, useRef, useState } from 'react';
import { DARK_MODE_STRESS_SESSION_PREFIX } from '../../../state/persistence.ts';
import { contrastRatioWcag, hexToRgb, hslToHex } from '../../../utils/color.ts';
import styles from './DarkModeStressChallenge.module.css';

interface DarkModeStressChallengeProps {
  onComplete: () => void;
  sessionKey?: string;
}

interface DarkModeStressSession {
  version: 1;
  textLightness: number;
  surfaceLightness: number;
  actionLightness: number;
}

const DEFAULT_SESSION: DarkModeStressSession = {
  version: 1,
  textLightness: 70,
  surfaceLightness: 12,
  actionLightness: 40,
};

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
      textLightness: validInteger(saved.textLightness, 60, 100)
        ? saved.textLightness
        : DEFAULT_SESSION.textLightness,
      surfaceLightness: validInteger(saved.surfaceLightness, 10, 40)
        ? saved.surfaceLightness
        : DEFAULT_SESSION.surfaceLightness,
      actionLightness: validInteger(saved.actionLightness, 35, 85)
        ? saved.actionLightness
        : DEFAULT_SESSION.actionLightness,
    };
  } catch {
    return DEFAULT_SESSION;
  }
}

function saveSession(sessionKey: string | undefined, session: DarkModeStressSession) {
  if (!sessionKey) return;
  try {
    sessionStorage.setItem(
      `${DARK_MODE_STRESS_SESSION_PREFIX}${sessionKey}`,
      JSON.stringify(session),
    );
  } catch {
    // Continue without per-tab challenge persistence when storage is unavailable.
  }
}

export function DarkModeStressChallenge({ onComplete, sessionKey }: DarkModeStressChallengeProps) {
  const [initialSession] = useState(() => loadSession(sessionKey));
  const [textL, setTextL] = useState(initialSession.textLightness);
  const [surfaceL, setSurfaceL] = useState(initialSession.surfaceLightness);
  const [actionL, setActionL] = useState(initialSession.actionLightness);
  const completionSent = useRef(false);

  useEffect(() => {
    saveSession(sessionKey, {
      version: 1,
      textLightness: textL,
      surfaceLightness: surfaceL,
      actionLightness: actionL,
    });
  }, [actionL, sessionKey, surfaceL, textL]);

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
    const actionText = contrastRatioWcag(hexToRgb(darkActionText), hexToRgb(action))
      >= contrastRatioWcag(hexToRgb(lightActionText), hexToRgb(action))
      ? darkActionText
      : lightActionText;

    return {
      bg,
      text,
      surface,
      action,
      actionText,
      textContrast,
      hierarchyContrast,
      actionContrast,
      textPass: textContrast >= 4.5,
      hierarchyPass: hierarchyContrast >= 1.2,
      actionPass: actionContrast >= 3,
    };
  }, [textL, surfaceL, actionL]);

  const passed = checks.textPass && checks.hierarchyPass && checks.actionPass;

  function handleComplete() {
    if (!passed || completionSent.current) return;
    completionSent.current = true;
    onComplete();
  }

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <span>Repair a broken dark theme</span>
        <span>{[checks.textPass, checks.hierarchyPass, checks.actionPass].filter(Boolean).length} / 3 fixed</span>
      </div>

      <div className={styles.preview} style={{ backgroundColor: checks.bg }} aria-hidden="true">
        <div className={styles.surface} style={{ backgroundColor: checks.surface }}>
          <p className={styles.title} style={{ color: checks.text }}>Dashboard title</p>
          <span className={styles.action} style={{ backgroundColor: checks.action, color: checks.actionText }}>Apply changes</span>
        </div>
      </div>

      <div className={styles.row}>
        <label htmlFor="dark-text">Text lightness ({textL})</label>
        <input id="dark-text" type="range" min={60} max={100} value={textL} onChange={(event) => setTextL(Number(event.target.value))} />
        <span className={checks.textPass ? styles.good : styles.bad}>{checks.textPass ? 'Pass' : 'Not passed'}: Text against surface: {checks.textContrast.toFixed(2)}:1 (target: 4.5:1)</span>
      </div>

      <div className={styles.row}>
        <label htmlFor="dark-surface">Surface lightness ({surfaceL})</label>
        <input id="dark-surface" type="range" min={10} max={40} value={surfaceL} onChange={(event) => setSurfaceL(Number(event.target.value))} />
        <span className={checks.hierarchyPass ? styles.good : styles.bad}>{checks.hierarchyPass ? 'Pass' : 'Not passed'}: Surface against background: {checks.hierarchyContrast.toFixed(2)}:1 (exercise target: 1.2:1)</span>
      </div>

      <div className={styles.row}>
        <label htmlFor="dark-action">Action lightness ({actionL})</label>
        <input id="dark-action" type="range" min={35} max={85} value={actionL} onChange={(event) => setActionL(Number(event.target.value))} />
        <span className={checks.actionPass ? styles.good : styles.bad}>{checks.actionPass ? 'Pass' : 'Not passed'}: Action against surface: {checks.actionContrast.toFixed(2)}:1 (target: 3.0:1)</span>
      </div>

      <p className={styles.result} role="status" aria-live="polite" aria-atomic="true">
        {passed
          ? 'All three dark-theme checks pass.'
          : `${[checks.textPass, checks.hierarchyPass, checks.actionPass].filter(Boolean).length} of 3 dark-theme checks pass.`}
      </p>

      <div className={styles.actions}>
        <button type="button" className={styles.button} disabled={!passed} onClick={handleComplete}>
          finish challenge
        </button>
      </div>
    </div>
  );
}
