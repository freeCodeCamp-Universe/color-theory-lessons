import { useEffect, useMemo, useRef, useState } from 'react';
import { ACCESSIBILITY_RESCUE_SESSION_PREFIX } from '../../../state/persistence.ts';
import { contrastRatioWcag, hexToRgb, hslToHex } from '../../../utils/color.ts';
import styles from './AccessibilityRescueChallenge.module.css';

interface AccessibilityRescueChallengeProps {
  onComplete: () => void;
  sessionKey?: string;
}

interface AccessibilityRescueSession {
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
};

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
      textLightness: validInteger(saved.textLightness, 20, 70)
        ? saved.textLightness
        : DEFAULT_SESSION.textLightness,
      requiredCueOn: saved.requiredCueOn === true,
      focusVisible: saved.focusVisible === true,
      iconLightness: validInteger(saved.iconLightness, 20, 90)
        ? saved.iconLightness
        : DEFAULT_SESSION.iconLightness,
    };
  } catch {
    return DEFAULT_SESSION;
  }
}

function saveSession(sessionKey: string | undefined, session: AccessibilityRescueSession) {
  if (!sessionKey) return;
  try {
    sessionStorage.setItem(
      `${ACCESSIBILITY_RESCUE_SESSION_PREFIX}${sessionKey}`,
      JSON.stringify(session),
    );
  } catch {
    // Continue without per-tab challenge persistence when storage is unavailable.
  }
}

function textColorFromLightness(lightness: number): string {
  return hslToHex(220, 18, lightness);
}

export function AccessibilityRescueChallenge({ onComplete, sessionKey }: AccessibilityRescueChallengeProps) {
  const [initialSession] = useState(() => loadSession(sessionKey));
  const [textLightness, setTextLightness] = useState(initialSession.textLightness);
  const [requiredCueOn, setRequiredCueOn] = useState(initialSession.requiredCueOn);
  const [focusVisible, setFocusVisible] = useState(initialSession.focusVisible);
  const [iconLightness, setIconLightness] = useState(initialSession.iconLightness);
  const completionSent = useRef(false);

  useEffect(() => {
    saveSession(sessionKey, {
      version: 1,
      textLightness,
      requiredCueOn,
      focusVisible,
      iconLightness,
    });
  }, [focusVisible, iconLightness, requiredCueOn, sessionKey, textLightness]);

  const checks = useMemo(() => {
    const textColor = textColorFromLightness(textLightness);
    const textBackground = '#f5f7fb';
    const textContrast = contrastRatioWcag(hexToRgb(textColor), hexToRgb(textBackground));

    const iconColor = hslToHex(220, 14, iconLightness);
    const iconBackground = '#ffffff';
    const iconContrast = contrastRatioWcag(hexToRgb(iconColor), hexToRgb(iconBackground));

    return {
      textColor,
      iconColor,
      textContrast,
      iconContrast,
      textPass: textContrast >= 4.5,
      cuePass: requiredCueOn,
      focusPass: focusVisible,
      iconPass: iconContrast >= 3,
    };
  }, [textLightness, requiredCueOn, focusVisible, iconLightness]);

  const passed = checks.textPass && checks.cuePass && checks.focusPass && checks.iconPass;

  function handleComplete() {
    if (!passed || completionSent.current) return;
    completionSent.current = true;
    onComplete();
  }

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <span>Repair four accessibility failures</span>
        <span className={styles.progress} role="status" aria-atomic="true">
          {[checks.textPass, checks.cuePass, checks.focusPass, checks.iconPass].filter(Boolean).length} of 4 fixed
        </span>
      </div>

      <section className={styles.block}>
        <h2 className={styles.title}>1) Body text needs at least 4.5:1 contrast</h2>
        <p className={styles.sample} style={{ color: checks.textColor, backgroundColor: '#f5f7fb' }}>
          This paragraph starts below the required contrast ratio.
        </p>
        <label className={styles.sliderLabel}>
          Text lightness: {textLightness}
          <input type="range" min={20} max={70} value={textLightness} onChange={(event) => setTextLightness(Number(event.target.value))} />
        </label>
        <p className={checks.textPass ? styles.good : styles.bad}>Contrast: {checks.textContrast.toFixed(2)}:1 (minimum 4.5:1)</p>
      </section>

      <section className={styles.block}>
        <h2 className={styles.title}>2) Required field uses color alone</h2>
        <div className={styles.row}>
          <span className={styles.colorOnlyLabel}>Email address</span>
          <button
            type="button"
            className={styles.toggle}
            aria-pressed={requiredCueOn}
            onClick={() => setRequiredCueOn((prev) => !prev)}
          >
            {requiredCueOn ? 'remove icon and text cue' : 'add icon and text cue'}
          </button>
        </div>
        {requiredCueOn && <p className={styles.note}>! Required field</p>}
        <p className={checks.cuePass ? styles.good : styles.bad}>{checks.cuePass ? 'Non-color cue added.' : 'Still color-only.'}</p>
      </section>

      <section className={styles.block}>
        <h2 className={styles.title}>3) Submit button has no visible focus indicator</h2>
        <div className={styles.row}>
          <button type="button" className={`${styles.fakeButton} ${focusVisible ? styles.focusOn : ''}`}>Submit</button>
          <button
            type="button"
            className={styles.toggle}
            aria-pressed={focusVisible}
            onClick={() => setFocusVisible((prev) => !prev)}
          >
            {focusVisible ? 'remove focus indicator' : 'add focus indicator'}
          </button>
        </div>
        <p className={checks.focusPass ? styles.good : styles.bad}>{checks.focusPass ? 'Focus indicator is visible.' : 'Focus indicator missing.'}</p>
      </section>

      <section className={styles.block}>
        <h2 className={styles.title}>4) Settings icon needs at least 3:1 contrast</h2>
        <div className={styles.iconPreview}>
          <span className={styles.icon} style={{ color: checks.iconColor }} role="img" aria-label="Settings">⚙</span>
        </div>
        <label className={styles.sliderLabel}>
          Icon lightness: {iconLightness}
          <input type="range" min={20} max={90} value={iconLightness} onChange={(event) => setIconLightness(Number(event.target.value))} />
        </label>
        <p className={checks.iconPass ? styles.good : styles.bad}>Contrast: {checks.iconContrast.toFixed(2)}:1 (minimum 3:1)</p>
      </section>

      <div className={styles.actions}>
        <button type="button" className={styles.button} disabled={!passed} onClick={handleComplete}>
          finish challenge
        </button>
      </div>
    </div>
  );
}
