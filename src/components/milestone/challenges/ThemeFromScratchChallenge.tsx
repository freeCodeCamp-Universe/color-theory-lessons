import { useEffect, useMemo, useState } from 'react';
import { THEME_FROM_SCRATCH_SESSION_PREFIX } from '../../../state/persistence.ts';
import { contrastRatioWcag, hexToRgb, hslToHex } from '../../../utils/color.ts';
import { ExerciseStage } from '../../tools/ExerciseStage.tsx';
import type { ExerciseStageDefinition, ExerciseStageResult } from '../../tools/exercise-stage.ts';
import { useExerciseStages } from '../../tools/useExerciseStages.ts';
import styles from './ThemeFromScratchChallenge.module.css';
import type { MilestoneChallengeProps, StoredMilestoneStage } from './milestone-stage.ts';
import { restoreMilestoneStage } from './milestone-stage.ts';

type RoleKey = 'bg' | 'surface' | 'primaryText' | 'secondaryText' | 'accent';

interface RoleHsl {
  h: number;
  s: number;
  l: number;
}

interface ThemeFromScratchSession extends StoredMilestoneStage {
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

const STAGES: readonly ExerciseStageDefinition[] = [
  {
    id: 'text-readability',
    title: 'Set text readability',
    instruction: 'Adjust the background, surface, and text roles until all three text pairs reach 4.5:1.',
    nextActionLabel: 'continue to surface separation',
  },
  {
    id: 'surface-separation',
    title: 'Separate the surface',
    instruction: 'Adjust the background, surface, and text roles until the surface reaches the 1.2:1 exercise target and the text remains readable.',
    nextActionLabel: 'continue to accent visibility',
  },
  {
    id: 'accent-visibility',
    title: 'Set accent visibility',
    instruction: 'Adjust the accent until it separates from the surface and keeps its text readable.',
  },
];

const STAGE_ROLE_KEYS: Record<string, RoleKey[]> = {
  'text-readability': ['bg', 'surface', 'primaryText', 'secondaryText'],
  'surface-separation': ['bg', 'surface', 'primaryText', 'secondaryText'],
  'accent-visibility': ['accent'],
};

const STAGE_CHECK_IDS: Record<string, string[]> = {
  'text-readability': ['primary-background', 'primary-surface', 'secondary-surface'],
  'surface-separation': ['surface-background'],
  'accent-visibility': ['accent-surface', 'primary-accent'],
};

function ratio(a: string, b: string): number {
  return contrastRatioWcag(hexToRgb(a), hexToRgb(b));
}

function validChannel(value: unknown, maximum: number): value is number {
  return Number.isInteger(value) && Number(value) >= 0 && Number(value) <= maximum;
}

function loadSession(sessionKey?: string): ThemeFromScratchSession {
  const fallback: ThemeFromScratchSession = {
    version: 1,
    roles: DEFAULTS,
    activeStageId: STAGES[0].id,
    stageResult: 'idle',
  };
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

    return { version: 1, roles, ...restoreMilestoneStage(saved, STAGES) };
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

export function ThemeFromScratchChallenge({
  onComplete,
  sessionKey,
  onStageChange,
}: MilestoneChallengeProps) {
  const [initialSession] = useState(() => loadSession(sessionKey));
  const [roles, setRoles] = useState<Record<RoleKey, RoleHsl>>(initialSession.roles);
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
      roles,
      activeStageId: stageController.activeStage.id,
      stageResult: stageController.result,
    });
  }, [roles, sessionKey, stageController.activeStage.id, stageController.result]);

  const hex = useMemo(() => ({
    bg: hslToHex(roles.bg.h, roles.bg.s, roles.bg.l),
    surface: hslToHex(roles.surface.h, roles.surface.s, roles.surface.l),
    primaryText: hslToHex(roles.primaryText.h, roles.primaryText.s, roles.primaryText.l),
    secondaryText: hslToHex(roles.secondaryText.h, roles.secondaryText.s, roles.secondaryText.l),
    accent: hslToHex(roles.accent.h, roles.accent.s, roles.accent.l),
  }), [roles]);

  const checks = useMemo<ThemeCheck[]>(() => [
    { id: 'primary-background', label: 'Primary text on background', ratio: ratio(hex.primaryText, hex.bg), target: TEXT_CONTRAST_TARGET },
    { id: 'primary-surface', label: 'Primary text on surface', ratio: ratio(hex.primaryText, hex.surface), target: TEXT_CONTRAST_TARGET },
    { id: 'secondary-surface', label: 'Secondary text on surface', ratio: ratio(hex.secondaryText, hex.surface), target: TEXT_CONTRAST_TARGET },
    { id: 'surface-background', label: 'Surface against background', ratio: ratio(hex.surface, hex.bg), target: SURFACE_SEPARATION_TARGET },
    { id: 'accent-surface', label: 'Accent against surface', ratio: ratio(hex.accent, hex.surface), target: ACCENT_SEPARATION_TARGET },
    { id: 'primary-accent', label: 'Primary text on accent', ratio: ratio(hex.primaryText, hex.accent), target: TEXT_CONTRAST_TARGET },
  ], [hex]);

  const activeChecks = checks.filter((check) => (
    STAGE_CHECK_IDS[stageController.activeStage.id].includes(check.id)
  ));
  const activeRoleKeys = STAGE_ROLE_KEYS[stageController.activeStage.id];
  const passedCount = activeChecks.filter((check) => check.ratio >= check.target).length;
  const completedTextChecksStillPass = checks
    .filter((check) => STAGE_CHECK_IDS['text-readability'].includes(check.id))
    .every((check) => check.ratio >= check.target);
  const stagePassed = passedCount === activeChecks.length
    && (stageController.activeStage.id !== 'surface-separation' || completedTextChecksStillPass);

  function setChannel(key: RoleKey, channel: keyof RoleHsl, value: number) {
    setRoles((previous) => ({
      ...previous,
      [key]: { ...previous[key], [channel]: value },
    }));
  }

  function checkThemeStage() {
    if (stagePassed) stageController.markPassed();
    else stageController.markIncorrect();
  }

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <span>Build a five-role theme with HSL</span>
        <span className={styles.brand}>Starting hue: {BASE_HUE}°</span>
      </div>

      <ExerciseStage
        controller={stageController}
        incorrectFeedback={stageController.activeStage.id === 'surface-separation' && !completedTextChecksStillPass
          ? 'The surface meets its target only when the completed text checks also remain at 4.5:1.'
          : `${passedCount} of ${activeChecks.length} checks pass. Adjust this stage and try again.`}
        passedFeedback={`All ${activeChecks.length} checks in this stage pass.`}
        completionFeedback="Both accent checks pass. Theme challenge complete."
      >
        <div className={styles.grid}>
          {activeRoleKeys.map((key) => (
            <fieldset key={key} className={styles.roleCard} disabled={stageController.result !== 'idle'}>
              <legend className={styles.roleTop}>
                <span>{ROLE_LABELS[key]}</span>
                <code>{hex[key].toUpperCase()}</code>
              </legend>
              {(['h', 's', 'l'] as const).map((channel) => {
                const channelLabel = channel === 'h' ? 'Hue' : channel === 's' ? 'Saturation' : 'Lightness';
                const suffix = channel === 'h' ? '°' : '%';
                return (
                  <div key={channel} className={styles.sliderRow}>
                    <label htmlFor={`${key}-${channel}`}>{channelLabel}</label>
                    <input
                      id={`${key}-${channel}`}
                      type="range"
                      min={0}
                      max={channel === 'h' ? 360 : 100}
                      value={roles[key][channel]}
                      aria-label={`${ROLE_LABELS[key]} ${channelLabel.toLowerCase()}`}
                      onChange={(event) => setChannel(key, channel, Number(event.target.value))}
                    />
                    <span className={styles.sliderValue} aria-hidden="true">{roles[key][channel]}{suffix}</span>
                  </div>
                );
              })}
            </fieldset>
          ))}
        </div>

        <div className={styles.preview} style={{ backgroundColor: hex.bg }}>
          <p className={styles.backgroundText} style={{ color: hex.primaryText }}>Page background</p>
          <div className={styles.previewCard} style={{ backgroundColor: hex.surface }}>
            <p className={styles.previewTitle} style={{ color: hex.primaryText }}>Palette preview</p>
            <p className={styles.previewBody} style={{ color: hex.secondaryText }}>Secondary text supports the primary heading.</p>
            <span className={styles.previewButton} style={{ backgroundColor: hex.accent, color: hex.primaryText }} aria-hidden="true">Primary action</span>
          </div>
        </div>

        <div className={styles.checks} role="list" aria-label="Current stage checks">
          {activeChecks.map((check) => {
            const checkPassed = check.ratio >= check.target;
            return (
              <p key={check.id} role="listitem" className={checkPassed ? styles.good : styles.bad}>
                <span aria-hidden="true">{checkPassed ? '✓' : '✗'}</span>{' '}
                {checkPassed ? 'Pass' : 'Not passed'}: {check.label}: {check.ratio.toFixed(2)}:1 (target: {check.target.toFixed(1)}:1)
              </p>
            );
          })}
        </div>

        {stageController.result === 'idle' && (
          <div className={styles.actions}>
            <button type="button" className={styles.button} onClick={checkThemeStage}>
              check {stageController.activeStage.title.toLowerCase()}
            </button>
          </div>
        )}
      </ExerciseStage>
    </div>
  );
}
