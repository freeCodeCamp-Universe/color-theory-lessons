import { memo, useState } from 'react';
import { ExerciseStage } from './ExerciseStage.tsx';
import type { ExerciseStageDefinition, ExerciseToolProps } from './exercise-stage.ts';
import shellStyles from './ToolShell.module.css';
import { useExerciseStages } from './useExerciseStages.ts';

interface RGB { r: number; g: number; b: number }
interface Prediction { id: string; label: string }
interface Target { id: string; name: string; value: RGB; correctPrediction: string }

const PREDICTIONS: readonly Prediction[] = [
  { id: 'red-high-blue-mid-green-low', label: 'Red high, blue in the middle, green low' },
  { id: 'blue-high-green-mid-red-low', label: 'Blue high, green in the middle, red low' },
  { id: 'channels-close', label: 'Red, green, and blue close to equal' },
  { id: 'red-green-high-blue-low', label: 'Red and green high, blue low' },
];

const TARGETS: readonly Target[] = [
  { id: 'warm-pink', name: 'warm pink accent', value: { r: 220, g: 45, b: 110 }, correctPrediction: 'red-high-blue-mid-green-low' },
  { id: 'pale-sky-blue', name: 'pale sky blue', value: { r: 155, g: 195, b: 230 }, correctPrediction: 'blue-high-green-mid-red-low' },
  { id: 'soft-gray', name: 'soft gray surface', value: { r: 115, g: 115, b: 122 }, correctPrediction: 'channels-close' },
  { id: 'warning-yellow', name: 'warning yellow', value: { r: 240, g: 195, b: 10 }, correctPrediction: 'red-green-high-blue-low' },
  { id: 'dark-navy', name: 'dark navy panel', value: { r: 18, g: 28, b: 72 }, correctPrediction: 'blue-high-green-mid-red-low' },
];

const STAGES: readonly ExerciseStageDefinition[] = TARGETS.flatMap((target) => [
  {
    id: `predict-${target.id}`,
    title: `Predict ${target.name}`,
    instruction: 'Choose the relative RGB channel pattern before using the sliders.',
    nextActionLabel: 'mix this target →',
  },
  {
    id: `match-${target.id}`,
    title: `Match ${target.name}`,
    instruction: 'Adjust the RGB sliders until every channel is within 22 points of the target.',
    nextActionLabel: 'next target →',
  },
]);

const TOLERANCE = 22;
const CHANNEL_META = [
  { key: 'r' as const, label: 'Red', color: '#e03030' },
  { key: 'g' as const, label: 'Green', color: '#22c55e' },
  { key: 'b' as const, label: 'Blue', color: '#3b82f6' },
];

function rgbString({ r, g, b }: RGB) { return `rgb(${r}, ${g}, ${b})`; }
function isMatch(a: RGB, b: RGB) {
  return Math.abs(a.r - b.r) <= TOLERANCE
    && Math.abs(a.g - b.g) <= TOLERANCE
    && Math.abs(a.b - b.b) <= TOLERANCE;
}

interface RGBMixerToolProps extends ExerciseToolProps {
  previewMode?: 'extremes' | 'channel-pairs' | 'neutral-grays';
}

export const RGBMixerTool = memo(function RGBMixerTool({
  interactive = true, onComplete, onStageChange, previewMode,
}: RGBMixerToolProps) {
  const stageController = useExerciseStages({ stages: STAGES, onComplete, onStageChange });
  const [current, setCurrent] = useState<RGB>({ r: 0, g: 0, b: 0 });
  const [predictions, setPredictions] = useState<Record<string, string>>({});

  if (previewMode) {
    type Swatch = { label: string; rgb: RGB; caption: string };
    const previewSwatches: Record<NonNullable<RGBMixerToolProps['previewMode']>, Swatch[]> = {
      extremes: [
        { label: 'black', rgb: { r: 0, g: 0, b: 0 }, caption: 'rgb(0 0 0): all channels off' },
        { label: 'white', rgb: { r: 255, g: 255, b: 255 }, caption: 'rgb(255 255 255): all channels full' },
      ],
      'channel-pairs': [
        { label: 'yellow', rgb: { r: 255, g: 255, b: 0 }, caption: 'red + green = yellow' },
        { label: 'cyan', rgb: { r: 0, g: 255, b: 255 }, caption: 'green + blue = cyan' },
        { label: 'magenta', rgb: { r: 255, g: 0, b: 255 }, caption: 'red + blue = magenta' },
      ],
      'neutral-grays': [
        { label: 'dark gray', rgb: { r: 64, g: 64, b: 64 }, caption: 'rgb(64 64 64)' },
        { label: 'mid gray', rgb: { r: 128, g: 128, b: 128 }, caption: 'rgb(128 128 128)' },
        { label: 'light gray', rgb: { r: 210, g: 210, b: 210 }, caption: 'rgb(210 210 210)' },
      ],
    };
    return (
      <div className={shellStyles.shell}>
        <span className={shellStyles.toolLabel}>RGB light mixer</span>
        <div data-authored-visual style={{ display: 'flex', gap: 'var(--spacing-md)', flexWrap: 'wrap' }}>
          {previewSwatches[previewMode].map((swatch) => (
            <div key={swatch.label} style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1, minWidth: '80px' }}>
              <div style={{ height: '64px', borderRadius: 'var(--radius-sm)', backgroundColor: rgbString(swatch.rgb), border: '1px solid rgba(255,255,255,0.08)' }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--muted)' }}>{swatch.caption}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const isPredictionStage = stageController.activeStage.id.startsWith('predict-');
  const targetId = stageController.activeStage.id.replace(/^(predict|match)-/, '');
  const target = TARGETS.find(({ id }) => id === targetId) ?? TARGETS[0];
  const prediction = predictions[target.id] ?? '';
  const predictionCorrect = prediction === target.correctPrediction;
  const close = isMatch(current, target.value);

  function choosePrediction(id: string) {
    if (stageController.result !== 'idle') return;
    setPredictions((value) => ({ ...value, [target.id]: id }));
  }

  function updateChannel(channel: keyof RGB, value: number) {
    if (stageController.result !== 'idle' || !interactive) return;
    setCurrent((previous) => ({ ...previous, [channel]: value }));
  }

  function handleCheck() {
    const passed = isPredictionStage ? predictionCorrect : close;
    if (passed) stageController.markPassed(); else stageController.markIncorrect();
  }

  function handleAdvance() {
    if (!isPredictionStage) setCurrent({ r: 0, g: 0, b: 0 });
    stageController.advance();
  }

  return (
    <div className={shellStyles.shell}>
      <span className={shellStyles.toolLabel}>RGB light mixer</span>
      {interactive && (
        <ExerciseStage
          controller={{ ...stageController, advance: handleAdvance }}
          incorrectFeedback={isPredictionStage ? 'That channel pattern does not match the target.' : 'The mix is not within 22 points on every channel.'}
          passedFeedback={isPredictionStage ? '✓ Prediction correct.' : '✓ Target matched.'}
          completionFeedback="✓ All five targets predicted and matched."
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: 'var(--muted)', textTransform: 'uppercase' }}>target</span>
            <div aria-label={`${target.name} target color`} style={{ height: '72px', borderRadius: 'var(--radius-sm)', backgroundColor: rgbString(target.value), border: '1px solid rgba(255,255,255,0.08)' }} />
          </div>

          {isPredictionStage ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)' }}>
              {PREDICTIONS.map((option) => (
                <button
                  key={option.id} type="button" onClick={() => choosePrediction(option.id)}
                  disabled={stageController.result !== 'idle'} aria-pressed={prediction === option.id}
                  style={{ textAlign: 'left', border: `1px solid ${prediction === option.id ? 'var(--accent-warning)' : 'var(--border-strong)'}` }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: 'var(--muted)', textTransform: 'uppercase' }}>your mix</span>
                <div aria-label="current RGB mix" style={{ height: '72px', borderRadius: 'var(--radius-sm)', backgroundColor: rgbString(current), border: '1px solid rgba(255,255,255,0.08)' }} />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--muted)' }}>R:{current.r} G:{current.g} B:{current.b}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                {CHANNEL_META.map(({ key, label, color }) => (
                  <label key={key} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color }}>{label}: {current[key]}</span>
                    <input type="range" min={0} max={255} value={current[key]} disabled={stageController.result !== 'idle'} onChange={(event) => updateChannel(key, Number(event.target.value))} aria-label={label} />
                  </label>
                ))}
              </div>
            </>
          )}

          {stageController.result === 'idle' && (
            <button type="button" onClick={handleCheck} disabled={isPredictionStage && prediction === ''} style={{ alignSelf: 'flex-start' }}>check stage</button>
          )}
        </ExerciseStage>
      )}
    </div>
  );
});
