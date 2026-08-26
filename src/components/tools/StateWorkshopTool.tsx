import { memo, useState } from 'react';
import { ExerciseStage } from './ExerciseStage.tsx';
import shellStyles from './ToolShell.module.css';
import type { ExerciseStageDefinition, ExerciseToolProps } from './exercise-stage.ts';
import { useExerciseStages } from './useExerciseStages.ts';

interface StateConfig {
  name: string;
  color: string;
  icon: string;
  label: string;
  borderPattern: 'solid' | 'dashed' | 'dotted';
}

const STATES: StateConfig[] = [
  { name: 'Success', color: '#22c55e', icon: '✓', label: 'Success', borderPattern: 'solid' },
  { name: 'Warning', color: '#f59e0b', icon: '⚠', label: 'Warning', borderPattern: 'dashed' },
  { name: 'Error',   color: '#ef4444', icon: '✕', label: 'Error',   borderPattern: 'solid' },
  { name: 'Info',    color: '#3b82f6', icon: 'ℹ', label: 'Info',    borderPattern: 'dotted' },
];

type CueKey = 'icon' | 'label' | 'border';

const STAGES = [{
  id: 'repair-semantic-states',
  title: 'Repair semantic states',
  instruction: 'Give every state a distinct non-color treatment with icons, labels, or border styles, then check the stage.',
}] satisfies readonly ExerciseStageDefinition[];

function hasDistinctNonColorTreatments(cues: Record<string, Record<CueKey, boolean>>) {
  const treatments = STATES.map((state) => {
    const stateCues = cues[state.name];
    return [
      stateCues.icon ? `icon:${state.icon}` : '',
      stateCues.label ? `label:${state.label}` : '',
      stateCues.border ? `border:${state.borderPattern}` : '',
    ].filter(Boolean).join('|');
  });

  return treatments.every(Boolean) && new Set(treatments).size === STATES.length;
}

export const StateWorkshopTool = memo(function StateWorkshopTool({
  interactive = false,
  onComplete,
  onStageChange,
}: ExerciseToolProps) {
  const [cues, setCues] = useState<Record<string, Record<CueKey, boolean>>>(
    Object.fromEntries(STATES.map((s) => [s.name, { icon: false, label: false, border: false }])),
  );
  const stageController = useExerciseStages({ stages: STAGES, onComplete, onStageChange });
  const stagePassed = stageController.result === 'passed';

  function toggleCue(stateName: string, cue: CueKey) {
    if (!interactive || stageController.result === 'passed') return;
    setCues((prev) => {
      return {
        ...prev,
        [stateName]: { ...prev[stateName], [cue]: !prev[stateName][cue] },
      };
    });
    stageController.retry();
  }

  function checkStates() {
    if (!interactive) return;
    if (hasDistinctNonColorTreatments(cues)) stageController.markPassed();
    else stageController.markIncorrect();
  }

  return (
    <div className={shellStyles.shell}>
      <span className={shellStyles.toolLabel}>state workshop</span>

      <ExerciseStage
        controller={stageController}
        incorrectFeedback="Every state needs a non-color treatment, and no two treatments can match. Change the cues and check again."
        completionFeedback="Each state has a distinct non-color treatment."
      >

      <div className={shellStyles.twoColumnGrid} style={{ gap: '0.5rem' }}>
        {STATES.map((state) => {
          const stateCues = cues[state.name];
          const hasAnyCue = Object.values(stateCues).some(Boolean);
          return (
            <div
              key={state.name}
              data-testid={`state-${state.name.toLowerCase()}`}
              style={{
                padding: '0.65rem',
                borderRadius: 'var(--radius-md)',
                border: `1px solid ${stagePassed ? 'var(--accent-success)' : hasAnyCue ? 'var(--accent-warning)' : 'var(--border)'}`,
                background: stagePassed
                  ? 'color-mix(in srgb, var(--accent-success) 5%, transparent)'
                  : 'transparent',
              }}
            >
              {/* State preview */}
              <div data-authored-visual style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.35rem 0.5rem',
                borderRadius: 'var(--radius-sm)',
                background: `color-mix(in srgb, ${state.color} 15%, transparent)`,
                border: stateCues.border ? `2px ${state.borderPattern} ${state.color}` : `1px solid ${state.color}`,
                marginBottom: '0.5rem',
                minHeight: 32,
              }}>
                {stateCues.icon && (
                  <span style={{ color: state.color, fontWeight: 700, fontSize: '0.85rem' }}>
                    {state.icon}
                  </span>
                )}
                <span style={{
                  width: 10, height: 10, borderRadius: '50%',
                  background: state.color, flexShrink: 0,
                }} />
                {stateCues.label && (
                  <span style={{ fontSize: '0.78rem', fontWeight: 600, color: state.color }}>
                    {state.label}
                  </span>
                )}
                {!stateCues.icon && !stateCues.label && (
                  <span style={{ fontSize: '0.72rem', color: 'var(--muted)', fontStyle: 'italic' }}>
                    color only
                  </span>
                )}
              </div>

              {/* Cue toggles */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                <p style={{ fontSize: '0.72rem', color: 'var(--muted)', marginBottom: '0.1rem', fontWeight: 600 }}>
                  {state.name} cues:
                </p>
                {(['icon', 'label', 'border'] as CueKey[]).map((cue) => (
                  <label
                    key={cue}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '0.35rem',
                      fontSize: '0.75rem', cursor: interactive ? 'pointer' : 'default',
                      opacity: interactive ? 1 : 0.6,
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={stateCues[cue]}
                      disabled={!interactive || stageController.result === 'passed'}
                      onChange={() => toggleCue(state.name, cue)}
                      style={{ accentColor: state.color }}
                    />
                    {cue === 'icon' ? `Icon (${state.icon})` : cue === 'label' ? `Label "${state.label}"` : 'Border style'}
                  </label>
                ))}
              </div>
            </div>
          );
        })}
      </div>

        {interactive && stageController.result !== 'passed' && (
          <button
            type="button"
            onClick={checkStates}
            style={{
              alignSelf: 'flex-start', padding: '0.5rem 1.25rem',
              background: 'var(--accent-cta)', color: 'var(--cta-foreground)',
              fontWeight: 700, fontSize: '1rem', borderRadius: 'var(--radius-sm)',
              border: 'none', cursor: 'pointer',
            }}
          >
            check stage
          </button>
        )}
      </ExerciseStage>
    </div>
  );
});
