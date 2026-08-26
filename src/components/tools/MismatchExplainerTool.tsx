import { memo, useState } from 'react';
import { ExerciseStage } from './ExerciseStage.tsx';
import type { ExerciseStageDefinition, ExerciseToolProps } from './exercise-stage.ts';
import shellStyles from './ToolShell.module.css';
import { useExerciseStages } from './useExerciseStages.ts';

interface Reason { id: string; label: string; isCorrect: boolean }
interface Scenario { id: string; title: string; description: string; screenColor: string; reasons: Reason[] }

const SCENARIOS: readonly Scenario[] = [
  {
    id: 'brochure-blue', title: 'Website button vs printed brochure',
    description: 'A designer chose a vivid blue for their primary button. The printed brochure version looks duller.',
    screenColor: '#1a5fe8',
    reasons: [
      { id: 'a', label: 'The screen emits light, while the printed ink reflects light from the surroundings.', isCorrect: true },
      { id: 'b', label: 'The brochure’s printer, inks, and paper may have a gamut that does not include the screen blue.', isCorrect: true },
      { id: 'c', label: 'A duller print proves that the designer chose the wrong blue.', isCorrect: false },
      { id: 'd', label: 'Printed colors always look the same as screen colors under good lighting.', isCorrect: false },
    ],
  },
  {
    id: 'painted-wall-green', title: 'Brand green on screen vs painted wall',
    description: 'A brand’s signature green looks consistent across two phones but different on a freshly painted wall sample.',
    screenColor: '#00b450',
    reasons: [
      { id: 'a', label: 'Paint pigments absorb and reflect incoming light, while phone screens emit light from RGB subpixels.', isCorrect: true },
      { id: 'b', label: 'Phones always show color more accurately than any other medium.', isCorrect: false },
      { id: 'c', label: 'The wall surface and finish affect how ambient light reflects off the color.', isCorrect: true },
      { id: 'd', label: 'The phones agreeing proves that the painted wall must match them.', isCorrect: false },
    ],
  },
  {
    id: 'packaging-orange', title: 'App accent vs product packaging',
    description: 'A vivid orange used as the app’s accent color arrives on printed packaging looking less saturated and slightly brownish.',
    screenColor: '#e85a10',
    reasons: [
      { id: 'a', label: 'A brownish result proves that the printer made a calibration error.', isCorrect: false },
      { id: 'b', label: 'A print gamut that does not include the orange used in the app.', isCorrect: true },
      { id: 'c', label: 'The screen creates orange with emitted RGB light, while the printed inks absorb and reflect incoming light.', isCorrect: true },
      { id: 'd', label: 'Orange cannot be mixed from CMYK inks at all.', isCorrect: false },
    ],
  },
];

const STAGES: readonly ExerciseStageDefinition[] = SCENARIOS.map((scenario) => ({
  id: scenario.id,
  title: scenario.title,
  instruction: 'Select every factor that could explain the difference.',
  nextActionLabel: 'next stage →',
}));

export const MismatchExplainerTool = memo(function MismatchExplainerTool({
  interactive = true, onComplete, onStageChange,
}: ExerciseToolProps) {
  const stageController = useExerciseStages({ stages: STAGES, onComplete, onStageChange });
  const scenario = SCENARIOS.find(({ id }) => id === stageController.activeStage.id) ?? SCENARIOS[0];
  const [selections, setSelections] = useState<Record<string, Set<string>>>({});
  const selected = selections[scenario.id] ?? new Set<string>();
  const correctIds = new Set(scenario.reasons.filter(({ isCorrect }) => isCorrect).map(({ id }) => id));
  const allCorrectSelected = [...correctIds].every((id) => selected.has(id));
  const noWrongSelected = [...selected].every((id) => correctIds.has(id));
  const isPerfect = allCorrectSelected && noWrongSelected;

  function toggleReason(id: string) {
    if (stageController.result !== 'idle' || !interactive) return;
    const next = new Set(selected);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelections((current) => ({ ...current, [scenario.id]: next }));
  }

  function handleCheck() {
    if (selected.size === 0) return;
    if (isPerfect) stageController.markPassed();
    else stageController.markIncorrect();
  }

  const incorrectFeedback = allCorrectSelected
    ? 'The correct factors are selected, but at least one incorrect factor is also selected.'
    : 'At least one factor that explains the mismatch is missing.';

  return (
    <div className={shellStyles.shell}>
      <span className={shellStyles.toolLabel}>screen vs material</span>
      {interactive && (
        <ExerciseStage
          controller={stageController}
          incorrectFeedback={incorrectFeedback}
          passedFeedback="✓ The relevant factors are selected."
          completionFeedback="✓ All three screen-to-material mismatches are explained."
        >
          <div style={{ display: 'flex', gap: 'var(--spacing-md)', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1, minWidth: '110px' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--muted)', textTransform: 'uppercase' }}>on screen</span>
              <div style={{ height: '60px', borderRadius: 'var(--radius-sm)', backgroundColor: scenario.screenColor, border: '1px solid rgba(255,255,255,0.08)' }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--muted)' }}>emits light</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1, minWidth: '110px' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--muted)', textTransform: 'uppercase' }}>material simulation</span>
              <div style={{ height: '60px', borderRadius: 'var(--radius-sm)', backgroundColor: scenario.screenColor, filter: 'saturate(0.58) brightness(0.78)', border: '1px solid rgba(0,0,0,0.08)' }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--muted)' }}>reflects light</span>
            </div>
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--secondary-foreground)', margin: 0 }}>{scenario.description}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)' }}>
            {scenario.reasons.map((reason) => {
              const isSelected = selected.has(reason.id);
              return (
                <button
                  key={reason.id} type="button" onClick={() => toggleReason(reason.id)}
                  disabled={stageController.result !== 'idle'} aria-pressed={isSelected}
                  style={{ padding: 'var(--spacing-sm) var(--spacing-md)', background: isSelected ? 'color-mix(in srgb, var(--accent-warning) 10%, var(--surface))' : 'var(--surface)', border: `1px solid ${isSelected ? 'var(--accent-warning)' : 'var(--border)'}`, borderRadius: 'var(--radius-sm)', color: 'var(--primary-foreground)', fontFamily: 'var(--font-sans)', fontSize: '1rem', textAlign: 'left' }}
                >
                  {reason.label}
                </button>
              );
            })}
          </div>
          {stageController.result === 'idle' && (
            <button type="button" onClick={handleCheck} disabled={selected.size === 0} style={{ alignSelf: 'flex-start' }}>check stage</button>
          )}
        </ExerciseStage>
      )}
    </div>
  );
});
