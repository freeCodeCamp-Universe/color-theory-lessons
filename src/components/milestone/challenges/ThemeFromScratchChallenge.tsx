import { useEffect, useMemo, useRef, useState } from 'react';
import { THEME_FROM_SCRATCH_SESSION_PREFIX } from '../../../state/persistence.ts';
import { contrastRatioWcag, hexToRgb, hslToHex } from '../../../utils/color.ts';
import styles from './ThemeFromScratchChallenge.module.css';

interface ThemeFromScratchChallengeProps {
  onComplete: () => void;
  sessionKey?: string;
}

type RoleKey = 'bg' | 'surface' | 'primaryText' | 'secondaryText' | 'accent';

interface RoleHsl {
  h: number;
  s: number;
  l: number;
}

interface ThemeFromScratchSession {
  version: 1;
  roles: Record<RoleKey, RoleHsl>;
}

interface ThemeCheck {
  id: string;
  label: string;
  ratio: number;
  target: number;
}

const BASE_HUE = 215;
const TEXT_CONTRAST_TARGET = 4.5;
const SURFACE_SEPARATION_TARGET = 1.2;
const ACCENT_SEPARATION_TARGET = 3;

const ROLE_LABELS: Record<RoleKey, string> = {
  bg: 'Background',
  surface: 'Surface',
  primaryText: 'Primary text',
  secondaryText: 'Secondary text',
  accent: 'Accent',
};

const ROLE_KEYS = Object.keys(ROLE_LABELS) as RoleKey[];

const DEFAULTS: Record<RoleKey, RoleHsl> = {
  bg: { h: BASE_HUE, s: 30, l: 12 },
  surface: { h: BASE_HUE, s: 24, l: 14 },
  primaryText: { h: BASE_HUE, s: 20, l: 78 },
  secondaryText: { h: BASE_HUE, s: 16, l: 56 },
  accent: { h: BASE_HUE, s: 82, l: 44 },
};

function ratio(a: string, b: string): number {
  return contrastRatioWcag(hexToRgb(a), hexToRgb(b));
}

function validChannel(value: unknown, maximum: number): value is number {
  return Number.isInteger(value) && Number(value) >= 0 && Number(value) <= maximum;
}

function loadSession(sessionKey?: string): ThemeFromScratchSession {
  const fallback: ThemeFromScratchSession = { version: 1, roles: DEFAULTS };
  if (!sessionKey) return fallback;

  try {
    const stored = sessionStorage.getItem(`${THEME_FROM_SCRATCH_SESSION_PREFIX}${sessionKey}`);
    if (stored === null) return fallback;
    const parsed: unknown = JSON.parse(stored);
    if (typeof parsed !== 'object' || parsed === null) return fallback;
    const saved = parsed as Partial<ThemeFromScratchSession>;
    if (typeof saved.roles !== 'object' || saved.roles === null) return fallback;

    const roles = { ...DEFAULTS };
    for (const key of ROLE_KEYS) {
      const role = saved.roles[key];
      if (
        typeof role === 'object'
        && role !== null
        && validChannel(role.h, 360)
        && validChannel(role.s, 100)
        && validChannel(role.l, 100)
      ) {
        roles[key] = { h: role.h, s: role.s, l: role.l };
      }
    }

    return { version: 1, roles };
  } catch {
    return fallback;
  }
}

function saveSession(sessionKey: string | undefined, session: ThemeFromScratchSession) {
  if (!sessionKey) return;
  try {
    sessionStorage.setItem(
      `${THEME_FROM_SCRATCH_SESSION_PREFIX}${sessionKey}`,
      JSON.stringify(session),
    );
  } catch {
    // Continue without per-tab challenge persistence when storage is unavailable.
  }
}

export function ThemeFromScratchChallenge({ onComplete, sessionKey }: ThemeFromScratchChallengeProps) {
  const [initialSession] = useState(() => loadSession(sessionKey));
  const [roles, setRoles] = useState<Record<RoleKey, RoleHsl>>(initialSession.roles);
  const completionSent = useRef(false);

  useEffect(() => {
    saveSession(sessionKey, { version: 1, roles });
  }, [roles, sessionKey]);

  const hex = useMemo(() => ({
    bg: hslToHex(roles.bg.h, roles.bg.s, roles.bg.l),
    surface: hslToHex(roles.surface.h, roles.surface.s, roles.surface.l),
    primaryText: hslToHex(roles.primaryText.h, roles.primaryText.s, roles.primaryText.l),
    secondaryText: hslToHex(roles.secondaryText.h, roles.secondaryText.s, roles.secondaryText.l),
    accent: hslToHex(roles.accent.h, roles.accent.s, roles.accent.l),
  }), [roles]);

  const checks = useMemo<ThemeCheck[]>(() => [
    {
      id: 'primary-background',
      label: 'Primary text on background',
      ratio: ratio(hex.primaryText, hex.bg),
      target: TEXT_CONTRAST_TARGET,
    },
    {
      id: 'primary-surface',
      label: 'Primary text on surface',
      ratio: ratio(hex.primaryText, hex.surface),
      target: TEXT_CONTRAST_TARGET,
    },
    {
      id: 'secondary-surface',
      label: 'Secondary text on surface',
      ratio: ratio(hex.secondaryText, hex.surface),
      target: TEXT_CONTRAST_TARGET,
    },
    {
      id: 'surface-background',
      label: 'Surface against background',
      ratio: ratio(hex.surface, hex.bg),
      target: SURFACE_SEPARATION_TARGET,
    },
    {
      id: 'accent-surface',
      label: 'Accent against surface',
      ratio: ratio(hex.accent, hex.surface),
      target: ACCENT_SEPARATION_TARGET,
    },
    {
      id: 'primary-accent',
      label: 'Primary text on accent',
      ratio: ratio(hex.primaryText, hex.accent),
      target: TEXT_CONTRAST_TARGET,
    },
  ], [hex]);

  const passedCount = checks.filter((check) => check.ratio >= check.target).length;
  const passed = passedCount === checks.length;

  function setChannel(key: RoleKey, channel: keyof RoleHsl, value: number) {
    setRoles((previous) => ({
      ...previous,
      [key]: { ...previous[key], [channel]: value },
    }));
  }

  function handleComplete() {
    if (!passed || completionSent.current) return;
    completionSent.current = true;
    onComplete();
  }

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <span>Build a five-role theme with HSL</span>
        <span className={styles.brand}>Starting hue: {BASE_HUE}°</span>
      </div>

      <div className={styles.grid}>
        {ROLE_KEYS.map((key) => (
          <fieldset key={key} className={styles.roleCard}>
            <legend className={styles.roleTop}>
              <span>{ROLE_LABELS[key]}</span>
              <code>{hex[key].toUpperCase()}</code>
            </legend>
            <div className={styles.sliderRow}>
              <label htmlFor={`${key}-h`}>Hue</label>
              <input
                id={`${key}-h`}
                type="range"
                min={0}
                max={360}
                value={roles[key].h}
                aria-label={`${ROLE_LABELS[key]} hue`}
                onChange={(event) => setChannel(key, 'h', Number(event.target.value))}
              />
              <span className={styles.sliderValue} aria-hidden="true">{roles[key].h}°</span>
            </div>
            <div className={styles.sliderRow}>
              <label htmlFor={`${key}-s`}>Saturation</label>
              <input
                id={`${key}-s`}
                type="range"
                min={0}
                max={100}
                value={roles[key].s}
                aria-label={`${ROLE_LABELS[key]} saturation`}
                onChange={(event) => setChannel(key, 's', Number(event.target.value))}
              />
              <span className={styles.sliderValue} aria-hidden="true">{roles[key].s}%</span>
            </div>
            <div className={styles.sliderRow}>
              <label htmlFor={`${key}-l`}>Lightness</label>
              <input
                id={`${key}-l`}
                type="range"
                min={0}
                max={100}
                value={roles[key].l}
                aria-label={`${ROLE_LABELS[key]} lightness`}
                onChange={(event) => setChannel(key, 'l', Number(event.target.value))}
              />
              <span className={styles.sliderValue} aria-hidden="true">{roles[key].l}%</span>
            </div>
          </fieldset>
        ))}
      </div>

      <div className={styles.preview} style={{ backgroundColor: hex.bg }}>
        <p className={styles.backgroundText} style={{ color: hex.primaryText }}>
          Page background
        </p>
        <div className={styles.previewCard} style={{ backgroundColor: hex.surface }}>
          <p className={styles.previewTitle} style={{ color: hex.primaryText }}>Palette preview</p>
          <p className={styles.previewBody} style={{ color: hex.secondaryText }}>
            Secondary text supports the primary heading.
          </p>
          <span
            className={styles.previewButton}
            style={{ backgroundColor: hex.accent, color: hex.primaryText }}
            aria-hidden="true"
          >
            Primary action
          </span>
        </div>
      </div>

      <div className={styles.checks} role="list" aria-label="Theme checks">
        {checks.map((check) => {
          const checkPassed = check.ratio >= check.target;
          return (
            <p key={check.id} role="listitem" className={checkPassed ? styles.good : styles.bad}>
              <span aria-hidden="true">{checkPassed ? '✓' : '✗'}</span>{' '}
              {checkPassed ? 'Pass' : 'Not passed'}: {check.label}: {check.ratio.toFixed(2)}:1 (target: {check.target.toFixed(1)}:1)
            </p>
          );
        })}
      </div>

      <p className={styles.result} role="status" aria-live="polite">
        {passed ? 'All six theme checks pass.' : `${passedCount} of 6 theme checks pass.`}
      </p>

      <div className={styles.actions}>
        <button type="button" className={styles.button} disabled={!passed} onClick={handleComplete}>
          finish challenge
        </button>
      </div>
    </div>
  );
}
