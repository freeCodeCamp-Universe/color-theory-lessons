import { memo } from 'react';
import { ExerciseStage } from './ExerciseStage.tsx';
import type { ExerciseStageDefinition, ExerciseToolProps } from './exercise-stage.ts';
import shellStyles from './ToolShell.module.css';
import { useExerciseStages } from './useExerciseStages.ts';

interface PathwayStep {
  id: string;
  name: string;
  description: string;
  implication: string;
}

const STEPS: readonly PathwayStep[] = [
  {
    id: 'screen-light',
    name: 'Light from the screen',
    description:
      'Screens produce colors by controlling the light from red, green, and blue subpixels.',
    implication:
      'The spectrum and intensity of the light reaching the eye depend on the display, its settings, and the viewing environment.',
  },
  {
    id: 'eye-receives-light',
    name: 'The eye receives light',
    description:
      'The cornea and lens focus incoming light onto the retina at the back of the eye.',
    implication:
      'As the lens yellows with age, it transmits less short-wavelength light. This changes the light that reaches the retina.',
  },
  {
    id: 'retina-processes-signals',
    name: 'The retina processes signals',
    description:
      'Cones support color vision and are most densely packed in the fovea, at the center of the retina. Rods support vision in dim light and are more numerous away from the fovea. Most people have three types of cones with different wavelength sensitivity ranges.',
    implication:
      'Differences in cone types or their sensitivity can make some colors harder to distinguish.',
  },
  {
    id: 'brain-interprets-signals',
    name: 'The brain interprets signals',
    description:
      'Neural pathways carry processed retinal signals to the brain, which uses them to produce the experience of color.',
    implication:
      'Surrounding colors and other visual context can change how a color appears even when its pixel value stays the same.',
  },
];

const STAGES: readonly ExerciseStageDefinition[] = STEPS.map((step, index) => ({
  id: step.id,
  title: step.name,
  instruction: `Review how stage ${index + 1} contributes to the visual pathway.`,
  nextActionLabel: 'next pathway stage',
}));

export const EyeDiagramTool = memo(function EyeDiagramTool({
  interactive = false,
  onComplete,
  onStageChange,
}: ExerciseToolProps) {
  const stageController = useExerciseStages({ stages: STAGES, onComplete, onStageChange });
  const step = STEPS.find(({ id }) => id === stageController.activeStage.id) ?? STEPS[0];

  const content = (
    <div style={{ padding: '0.75rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
      <p style={{ fontSize: '0.82rem', lineHeight: 1.6, marginBottom: '0.4rem' }}>
        {step.description}
      </p>
      <p style={{ fontSize: '0.78rem', color: 'var(--muted)', lineHeight: 1.5, margin: 0 }}>
        <em>Design implication:</em> {step.implication}
      </p>
    </div>
  );

  return (
    <div className={shellStyles.shell}>
      <span className={shellStyles.toolLabel}>visual pathway</span>

      {interactive ? (
        <ExerciseStage
          controller={stageController}
          passedFeedback="Pathway stage reviewed. Continue when you are ready."
          completionFeedback="You explored the full visual pathway from the screen to the brain."
        >
          {content}
          {stageController.result === 'idle' && (
            <button type="button" onClick={stageController.markPassed}>
              {stageController.isFinalStage ? 'finish pathway' : 'mark stage reviewed'}
            </button>
          )}
        </ExerciseStage>
      ) : content}
    </div>
  );
});
