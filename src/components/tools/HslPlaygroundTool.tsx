import { memo, useState } from 'react';
import { hslToHex, hexToRgb } from '../../utils/color.ts';
import { ExerciseStage } from './ExerciseStage.tsx';
import type { ExerciseStageDefinition, ExerciseToolProps } from './exercise-stage.ts';
import { HUE_MAX, HueWheel } from './HueWheel.tsx';
import { useExerciseStages } from './useExerciseStages.ts';
import { VisualDescription } from '../accessibility/VisualDescription.tsx';
import shellStyles from './ToolShell.module.css';

interface Target {
  label: string;
  h: number;
  s: number;
  l: number;
}

const TARGETS: Target[] = [
  { label: 'Muted teal surface', h: 180, s: 25, l: 70 },
  { label: 'Vivid coral accent', h: 12, s: 85, l: 55 },
  { label: 'Dark desaturated navy', h: 225, s: 30, l: 22 },
];

const TOLERANCE = 12;

function isClose(a: number, b: number, range: number): boolean {
  return Math.abs(a - b) <= range;
}

function hueClose(a: number, b: number, range: number): boolean {
  const d = Math.abs(a - b);
  return d <= range || 360 - d <= range;
}

const STAGES: readonly ExerciseStageDefinition[] = TARGETS.map((target) => ({
  id: target.label.toLowerCase().replaceAll(' ', '-'),
  title: `Match ${target.label.toLowerCase()}`,
  instruction: `Adjust hue, saturation, and lightness to match the ${target.label.toLowerCase()} target.`,
  nextActionLabel: 'next target',
}));

export const HslPlaygroundTool = memo(function HslPlaygroundTool({
  interactive = false,
  onComplete,
  onStageChange,
}: ExerciseToolProps) {
  const [h, setH] = useState(200);
  const [s, setS] = useState(50);
  const [l, setL] = useState(50);
  const stageController = useExerciseStages({ stages: STAGES, onComplete, onStageChange });
  const targetIdx = stageController.activeStage.position - 1;

  const hex = hslToHex(h, s, l);
  const rgb = hexToRgb(hex);
  const hslValue = `hsl(${h} ${s}% ${l}%)`;
  const rgbValue = `rgb(${rgb.r} ${rgb.g} ${rgb.b})`;
  const target = TARGETS[targetIdx];
  const targetHex = hslToHex(target.h, target.s, target.l);
  const currentDescription = `Current color: HSL ${h} degrees, ${s} percent saturation, ${l} percent lightness; HEX ${hex}; RGB ${rgb.r}, ${rgb.g}, ${rgb.b}.`;

  function checkMatch() {
    if (!interactive || stageController.result !== 'idle') return;
    if (
      hueClose(h, target.h, TOLERANCE) &&
      isClose(s, target.s, TOLERANCE) &&
      isClose(l, target.l, TOLERANCE)
    ) {
      stageController.markPassed();
    } else stageController.markIncorrect();
  }

  const inputsDisabled = !interactive || stageController.result !== 'idle';

  const playground = (
    <>
        <div style={{ display: 'flex', gap: 'var(--spacing-lg)', flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <HueWheel
          hue={h}
          interactive={!inputsDisabled}
          onChange={setH}
        />
        <div style={{ flex: 1, minWidth: '180px' }}>
          {/* Current color display */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', alignItems: 'stretch' }}>
            <div style={{
              width: 80, minHeight: 80, borderRadius: 'var(--radius-md)',
              background: hex, border: '2px solid var(--border)',
            }} aria-hidden="true" />
            <VisualDescription id="hsl-current-description">{currentDescription}</VisualDescription>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', lineHeight: 1.7 }}>
              <div><span style={{ color: 'var(--muted)' }}>HSL</span> {hslValue}</div>
              <div><span style={{ color: 'var(--muted)' }}>HEX</span> {hex}</div>
              <div><span style={{ color: 'var(--muted)' }}>RGB</span> {rgbValue}</div>
            </div>
          </div>

          {/* Sliders */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1rem' }}>
            <label style={{ fontSize: '0.82rem' }}>
              Hue: {h}°
              <input type="range" min={0} max={HUE_MAX} value={h} disabled={inputsDisabled}
                onChange={(e) => setH(Number(e.target.value))}
                style={{ width: '100%', accentColor: interactive ? 'var(--accent-warning)' : 'var(--yellow)' }}
                aria-label={`Hue: ${h} degrees`}
                aria-describedby="hsl-current-description"
              />
            </label>
            <label style={{ fontSize: '0.82rem' }}>
              Saturation: {s}%
              <input type="range" min={0} max={100} value={s} disabled={inputsDisabled}
                onChange={(e) => setS(Number(e.target.value))}
                style={{ width: '100%', accentColor: interactive ? 'var(--accent-warning)' : 'var(--yellow)' }}
                aria-label={`Saturation: ${s} percent`}
                aria-describedby="hsl-current-description"
              />
            </label>
            <label style={{ fontSize: '0.82rem' }}>
              Lightness: {l}%
              <input type="range" min={0} max={100} value={l} disabled={inputsDisabled}
                onChange={(e) => setL(Number(e.target.value))}
                style={{ width: '100%', accentColor: interactive ? 'var(--accent-warning)' : 'var(--yellow)' }}
                aria-label={`Lightness: ${l} percent`}
                aria-describedby="hsl-current-description"
              />
            </label>
          </div>
        </div>
      </div>

      {/* Target area */}
      {interactive && stageController.result === 'idle' && (
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '0.75rem' }}>
          <p style={{ fontSize: '0.82rem', color: 'var(--muted)', marginBottom: '0.5rem' }}>
            Current target: <strong style={{ color: 'var(--primary-foreground)' }}>{target.label}</strong>
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <div style={{
              width: 48, height: 48, borderRadius: 'var(--radius-sm)',
              background: targetHex, border: '2px solid var(--border)',
            }} aria-hidden="true" />
            <VisualDescription>{`Target appearance: ${target.label}. Its exact HSL values are not disclosed before checking the match.`}</VisualDescription>
            <button onClick={checkMatch} style={{
              padding: '0.4rem 1rem', background: 'var(--accent-cta)', color: 'var(--cta-foreground)',
              border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer',
              fontFamily: 'var(--font-mono)', fontSize: '0.82rem',
            }}>
              check match
            </button>
          </div>
        </div>
      )}
    </>
  );

  return (
    <div className={shellStyles.shell}>
      <span className={shellStyles.toolLabel}>hsl playground</span>

      {interactive ? (
        <ExerciseStage
          controller={stageController}
          incorrectFeedback="The color is outside the target range. Try this stage again."
          passedFeedback="Target matched. Continue to the next target."
          completionFeedback="All three HSL targets matched."
        >
          {playground}
        </ExerciseStage>
      ) : <div data-authored-visual>{playground}</div>}
    </div>
  );
});
