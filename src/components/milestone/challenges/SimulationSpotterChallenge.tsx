import { useEffect, useMemo, useState } from 'react';
import { SIMULATION_SPOTTER_SESSION_PREFIX } from '../../../state/persistence.ts';
import { simulateDeuteranopia } from '../../../utils/color.ts';
import { ExerciseStage } from '../../tools/ExerciseStage.tsx';
import type { ExerciseStageDefinition, ExerciseStageResult } from '../../tools/exercise-stage.ts';
import { useExerciseStages } from '../../tools/useExerciseStages.ts';
import styles from './SimulationSpotterChallenge.module.css';
import type { MilestoneChallengeProps, StoredMilestoneStage } from './milestone-stage.ts';
import { restoreMilestoneStage } from './milestone-stage.ts';

type Fix = 'icon' | 'pattern' | 'label' | 'contrast';

interface Item {
  id: string;
  label: string;
  colors: string[];
  fragile: boolean;
  validFixes: Fix[];
  fixLabels: Record<Fix, string>;
  invalidFixFeedback: Partial<Record<Fix, string>>;
}

interface SimulationSpotterSession extends StoredMilestoneStage {
  version: 1;
  simulated: boolean;
  flagged: Record<string, boolean>;
  fixes: Record<string, Fix | ''>;
}

const ITEMS: Item[] = [
  {
    id: 'status', label: 'Status badges: green and red backgrounds', colors: ['#22c55e', '#ef4444'], fragile: true, validFixes: ['icon', 'label'],
    fixLabels: { icon: 'Add success and error icons', pattern: 'Use different fill patterns only', label: 'Add labels naming each status', contrast: 'Increase background contrast only' },
    invalidFixFeedback: { pattern: 'Patterns distinguish the badges, but do not identify which badge means success or error without labels or a key.', contrast: 'Higher contrast makes the badges easier to see, but does not identify what each badge means.' },
  },
  {
    id: 'bars', label: 'Chart bars: red and green series', colors: ['#ef4444', '#22c55e'], fragile: true, validFixes: ['pattern', 'label'],
    fixLabels: { icon: 'Add the same icon to every series', pattern: 'Use distinct patterns identified in the legend', label: 'Label each series directly', contrast: 'Increase contrast with the background only' },
    invalidFixFeedback: { icon: 'The same icon on every series does not distinguish one series from another.', contrast: 'Background contrast makes the bars visible, but does not identify which series each bar belongs to.' },
  },
  {
    id: 'form', label: 'Form error: red label text', colors: ['#ef4444'], fragile: true, validFixes: ['icon', 'label'],
    fixLabels: { icon: 'Add an error icon beside the field', pattern: 'Add a background pattern only', label: 'Add an inline error message', contrast: 'Increase the red text contrast only' },
    invalidFixFeedback: { pattern: 'A background pattern does not identify the field as having an error or explain what needs attention.', contrast: 'Higher text contrast makes the label easier to read, but still uses color alone to communicate the error.' },
  },
  {
    id: 'link', label: 'Link: blue text with an underline', colors: ['#3b82f6'], fragile: false, validFixes: ['label'],
    fixLabels: { icon: 'Add an icon beside the link', pattern: 'Add a pattern behind the link', label: 'Add another text label', contrast: 'Increase the link contrast' }, invalidFixFeedback: {},
  },
  {
    id: 'toggle', label: 'Toggle: purple switch with On/Off text', colors: ['#8b5cf6'], fragile: false, validFixes: ['label'],
    fixLabels: { icon: 'Add an icon to the toggle', pattern: 'Add a pattern to the switch', label: 'Add another On/Off label', contrast: 'Increase the toggle contrast' }, invalidFixFeedback: {},
  },
  {
    id: 'alert', label: 'Alert: yellow background with an icon and heading', colors: ['#eab308'], fragile: false, validFixes: ['icon'],
    fixLabels: { icon: 'Add another alert icon', pattern: 'Add a pattern to the alert background', label: 'Add another alert heading', contrast: 'Increase the alert contrast' }, invalidFixFeedback: {},
  },
];

const FRAGILE_ITEMS = ITEMS.filter((item) => item.fragile);
const ITEM_IDS = new Set(ITEMS.map((item) => item.id));
const FIXES: Fix[] = ['icon', 'pattern', 'label', 'contrast'];
const STAGES: readonly ExerciseStageDefinition[] = [
  {
    id: 'identify-color-only',
    title: 'Identify color-only examples',
    instruction: 'Flag exactly the three examples that rely on color alone.',
    nextActionLabel: 'continue to repairs',
  },
  {
    id: 'choose-repairs',
    title: 'Choose non-color repairs',
    instruction: 'Choose a repair that communicates the same information without color for each flagged example.',
  },
];

function loadSession(sessionKey?: string): SimulationSpotterSession {
  const fallback: SimulationSpotterSession = {
    version: 1,
    simulated: false,
    flagged: {},
    fixes: {},
    activeStageId: STAGES[0].id,
    stageResult: 'idle',
  };
  if (!sessionKey) return fallback;

  try {
    const stored = sessionStorage.getItem(`${SIMULATION_SPOTTER_SESSION_PREFIX}${sessionKey}`);
    if (stored === null) return fallback;
    const parsed: unknown = JSON.parse(stored);
    if (typeof parsed !== 'object' || parsed === null) return fallback;
    const saved = parsed as Partial<SimulationSpotterSession>;
    const flagged: Record<string, boolean> = {};
    const fixes: Record<string, Fix | ''> = {};

    if (typeof saved.flagged === 'object' && saved.flagged !== null) {
      for (const [id, value] of Object.entries(saved.flagged)) {
        if (ITEM_IDS.has(id) && typeof value === 'boolean') flagged[id] = value;
      }
    }
    if (typeof saved.fixes === 'object' && saved.fixes !== null) {
      for (const [id, value] of Object.entries(saved.fixes)) {
        if (ITEM_IDS.has(id) && (value === '' || FIXES.includes(value as Fix))) {
          fixes[id] = value as Fix | '';
        }
      }
    }

    return {
      version: 1,
      simulated: saved.simulated === true,
      flagged,
      fixes,
      ...restoreMilestoneStage(saved, STAGES),
    };
  } catch {
    return fallback;
  }
}

function saveSession(sessionKey: string | undefined, session: SimulationSpotterSession) {
  if (!sessionKey) return;
  try {
    sessionStorage.setItem(`${SIMULATION_SPOTTER_SESSION_PREFIX}${sessionKey}`, JSON.stringify(session));
  } catch {
    // Continue without per-tab challenge persistence when storage is unavailable.
  }
}

export function SimulationSpotterChallenge({
  onComplete,
  sessionKey,
  onStageChange,
}: MilestoneChallengeProps) {
  const [initialSession] = useState(() => loadSession(sessionKey));
  const [simulated, setSimulated] = useState(initialSession.simulated);
  const [flagged, setFlagged] = useState<Record<string, boolean>>(initialSession.flagged);
  const [fixes, setFixes] = useState<Record<string, Fix | ''>>(initialSession.fixes);
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
      simulated,
      flagged,
      fixes,
      activeStageId: stageController.activeStage.id,
      stageResult: stageController.result,
    });
  }, [fixes, flagged, sessionKey, simulated, stageController.activeStage.id, stageController.result]);

  const flagsGood = useMemo(() => ITEMS.every((item) => (
    Boolean(flagged[item.id]) === item.fragile
  )), [flagged]);
  const invalidFixes = FRAGILE_ITEMS.flatMap((item) => {
    const fix = fixes[item.id];
    if (!fix || item.validFixes.includes(fix)) return [];
    return [{
      id: item.id,
      label: item.label,
      feedback: item.invalidFixFeedback[fix]
        ?? 'The selected repair does not communicate the same information without color.',
    }];
  });
  const fixesGood = FRAGILE_ITEMS.every((item) => (
    fixes[item.id] && item.validFixes.includes(fixes[item.id] as Fix)
  ));
  const isIdentifyStage = stageController.activeStage.id === 'identify-color-only';
  const stagePassed = isIdentifyStage ? flagsGood : fixesGood;

  function checkStage() {
    if (stagePassed) stageController.markPassed();
    else stageController.markIncorrect();
  }

  return (
    <div className={styles.panel}>
      <ExerciseStage
        controller={stageController}
        incorrectFeedback={isIdentifyStage
          ? 'The flagged set is not correct. Review all six examples.'
          : invalidFixes.length > 0
            ? 'One or more repairs still rely on color or do not identify the meaning.'
            : 'Choose one repair for each example.'}
        passedFeedback="All three color-only examples are identified."
        completionFeedback="All three examples have a valid non-color repair. Challenge complete."
      >
        {isIdentifyStage && (
          <div className={styles.header}>
            <span>Review six interface examples</span>
            <button
              type="button"
              className={styles.toggle}
              aria-pressed={simulated}
              onClick={() => setSimulated((previous) => !previous)}
              disabled={stageController.result !== 'idle'}
            >
              Deuteranopia simulation: {simulated ? 'on' : 'off'}
            </button>
          </div>
        )}

        <div className={styles.list}>
          {(isIdentifyStage ? ITEMS : FRAGILE_ITEMS).map((item) => {
            const visibleColors = item.colors.map((color) => (simulated ? simulateDeuteranopia(color) : color));
            const isFlagged = Boolean(flagged[item.id]);
            return (
              <div key={item.id} className={styles.row} role="group" aria-labelledby={`simulation-item-${item.id}`}>
                {isIdentifyStage && (
                  <button
                    type="button"
                    className={`${styles.flag} ${isFlagged ? styles.flagged : ''}`}
                    aria-label={`Flag ${item.label} as relying on color alone`}
                    aria-pressed={isFlagged}
                    onClick={() => setFlagged((previous) => ({ ...previous, [item.id]: !previous[item.id] }))}
                    disabled={stageController.result !== 'idle'}
                  >
                    {isFlagged ? 'flagged' : 'flag'}
                  </button>
                )}
                <div className={styles.swatches} aria-hidden="true">
                  {visibleColors.map((visibleColor, index) => (
                    <span key={`${item.id}-${index}`} className={styles.dot} style={{ backgroundColor: visibleColor }} />
                  ))}
                </div>
                <span id={`simulation-item-${item.id}`} className={styles.label}>{item.label}</span>
                {!isIdentifyStage && (
                  <select
                    className={styles.select}
                    aria-label={`Fix for ${item.label}`}
                    value={fixes[item.id] ?? ''}
                    disabled={stageController.result !== 'idle'}
                    onChange={(event) => {
                      const value = event.target.value as Fix | '';
                      setFixes((previous) => ({ ...previous, [item.id]: value }));
                    }}
                  >
                    <option value="">Choose a fix</option>
                    {FIXES.map((fix) => <option key={fix} value={fix}>{item.fixLabels[fix]}</option>)}
                  </select>
                )}
              </div>
            );
          })}
        </div>

        {!isIdentifyStage && stageController.result === 'incorrect' && invalidFixes.map((invalidFix) => (
          <p key={invalidFix.id} className={styles.bad}>
            <strong>{invalidFix.label}:</strong> {invalidFix.feedback}
          </p>
        ))}

        {stageController.result === 'idle' && (
          <div className={styles.actions}>
            <button type="button" className={styles.button} onClick={checkStage}>
              check {isIdentifyStage ? 'examples' : 'repairs'}
            </button>
          </div>
        )}
      </ExerciseStage>
    </div>
  );
}
