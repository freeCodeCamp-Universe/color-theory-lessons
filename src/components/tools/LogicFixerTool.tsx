import { memo, useState } from 'react';
import { ExerciseStage } from './ExerciseStage.tsx';
import type { ExerciseStageDefinition, ExerciseToolProps } from './exercise-stage.ts';
import shellStyles from './ToolShell.module.css';
import { useExerciseStages } from './useExerciseStages.ts';
import { VisualDescription } from '../accessibility/VisualDescription.tsx';

interface Choice { id: string; label: string; isCorrect: boolean }
interface Scenario { id: string; title: string; statement: string; choices: Choice[] }

const SCENARIOS: readonly Scenario[] = [
  {
    id: 'darken-a-button', title: 'Darken a screen color',
    statement: '“I’ll make this button darker by mixing in black, like I would with paint.”',
    choices: [
      { id: 'a', label: 'I’ll reduce the R, G, and B values so the display outputs less light for this color.', isCorrect: true },
      { id: 'b', label: 'I’ll raise the R, G, and B values until the color looks darker.', isCorrect: false },
      { id: 'c', label: 'Mixing black works the same way on screens as in paint.', isCorrect: false },
      { id: 'd', label: 'I’ll reduce the saturation to make the color appear darker.', isCorrect: false },
    ],
  },
  {
    id: 'combine-red-green', title: 'Combine red and green light',
    statement: '“Setting the red and green channels to full intensity while blue remains off will make a muddy brown.”',
    choices: [
      { id: 'a', label: 'Red and green light behave the same way as red and green paint.', isCorrect: false },
      { id: 'b', label: 'With blue off, full-intensity red and green light produce yellow, not brown.', isCorrect: true },
      { id: 'c', label: 'Adding blue light is what makes red and green produce yellow.', isCorrect: false },
      { id: 'd', label: 'Mixing red and green channels gives orange, not brown.', isCorrect: false },
    ],
  },
  {
    id: 'raise-rgb-channels', title: 'Raise all RGB channels',
    statement: '“Raising all three RGB channels will make the color muddier and darker.”',
    choices: [
      { id: 'a', label: 'That’s true. Increasing channel values reduces the light from the screen.', isCorrect: false },
      { id: 'b', label: 'Raising all three channel values adds light and moves the color toward white.', isCorrect: true },
      { id: 'c', label: 'Muddiness only happens when colors share the same hue family.', isCorrect: false },
      { id: 'd', label: 'Raising all three channels increases contrast, not brightness.', isCorrect: false },
    ],
  },
];

const STAGES: readonly ExerciseStageDefinition[] = SCENARIOS.map((scenario) => ({
  id: scenario.id,
  title: scenario.title,
  instruction: 'Pick the rewrite that applies screen-first color reasoning.',
  nextActionLabel: 'next stage →',
}));

export const LogicFixerTool = memo(function LogicFixerTool({
  interactive = true, onComplete, onStageChange,
}: ExerciseToolProps) {
  const stageController = useExerciseStages({ stages: STAGES, onComplete, onStageChange });
  const scenario = SCENARIOS.find(({ id }) => id === stageController.activeStage.id) ?? SCENARIOS[0];
  const [selectedByStage, setSelectedByStage] = useState<Record<string, string | null>>({});
  const selected = selectedByStage[scenario.id] ?? null;
  const isCorrect = scenario.choices.some((choice) => choice.id === selected && choice.isCorrect);

  function handleSelect(id: string) {
    if (stageController.result !== 'idle' || !interactive) return;
    setSelectedByStage((current) => ({ ...current, [scenario.id]: id }));
  }

  function handleCheck() {
    if (!selected) return;
    if (isCorrect) stageController.markPassed();
    else stageController.markIncorrect();
  }

  return (
    <div className={shellStyles.shell}>
      <span className={shellStyles.toolLabel}>paint logic vs screen logic</span>
      <div role="group" aria-label="Paint and screen color logic comparison" aria-describedby="logic-comparison-description" style={{ display: 'flex', gap: 'var(--spacing-md)', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '120px', background: '#ede8e0', borderRadius: 'var(--radius-sm)', padding: 'var(--spacing-sm) var(--spacing-md)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span style={{ fontSize: '1rem', textTransform: 'uppercase', color: 'var(--yellow-dark)', letterSpacing: '0.05em' }}>paint logic</span>
          <span style={{ fontSize: '1rem', color: '#4a3000' }}>pigment mixtures often look darker and less saturated</span>
          <span style={{ fontSize: '1rem', color: '#4a3000' }}>ideal subtractive primaries → black</span>
        </div>
        <div style={{ flex: 1, minWidth: '120px', background: 'var(--surface)', borderRadius: 'var(--radius-sm)', padding: 'var(--spacing-sm) var(--spacing-md)', display: 'flex', flexDirection: 'column', gap: '4px', border: '1px solid var(--border)' }}>
          <span style={{ fontSize: '1rem', textTransform: 'uppercase', color: 'var(--accent-warning)', letterSpacing: '0.05em' }}>screen logic</span>
          <span style={{ fontSize: '1rem', color: 'var(--secondary-foreground)' }}>higher RGB values → more light</span>
          <span style={{ fontSize: '1rem', color: 'var(--secondary-foreground)' }}>full RGB primaries → white</span>
        </div>
      </div>
      <VisualDescription id="logic-comparison-description">
        Two panels compare color models. Paint uses pigments that absorb and reflect light; mixtures often become darker and less saturated. Screens emit light, so higher RGB values add light and full red, green, and blue produces white.
      </VisualDescription>
      {interactive && (
        <ExerciseStage
          controller={stageController}
          incorrectFeedback="That rewrite still applies the wrong color model."
          passedFeedback="✓ Screen logic applied."
          completionFeedback="✓ All three statements now use screen-first reasoning."
        >
          <p style={{ fontSize: '0.9rem', color: 'var(--primary-foreground)', margin: 0, fontStyle: 'italic' }}>{scenario.statement}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)' }}>
            {scenario.choices.map((choice) => {
              const isSelected = selected === choice.id;
              return (
                <button
                  key={choice.id} type="button" onClick={() => handleSelect(choice.id)}
                  disabled={stageController.result !== 'idle'} aria-pressed={isSelected}
                  style={{ padding: 'var(--spacing-sm) var(--spacing-md)', background: isSelected ? 'color-mix(in srgb, var(--accent-warning) 10%, var(--surface))' : 'var(--surface)', border: `1px solid ${isSelected ? 'var(--accent-warning)' : 'var(--border-strong)'}`, borderRadius: 'var(--radius-sm)', color: 'var(--primary-foreground)', fontFamily: 'var(--font-sans)', fontSize: '1rem', textAlign: 'left', cursor: stageController.result === 'idle' ? 'pointer' : 'default' }}
                >
                  {choice.label}
                </button>
              );
            })}
          </div>
          {stageController.result === 'idle' && (
            <button type="button" onClick={handleCheck} disabled={!selected} style={{ alignSelf: 'flex-start' }}>check stage</button>
          )}
        </ExerciseStage>
      )}
    </div>
  );
});
