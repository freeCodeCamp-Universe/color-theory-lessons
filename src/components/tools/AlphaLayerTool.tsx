import { memo, useState } from 'react';
import { contrastRatioWcag } from '../../utils/color.ts';
import { ExerciseStage } from './ExerciseStage.tsx';
import type { ExerciseStageDefinition, ExerciseToolProps } from './exercise-stage.ts';
import { useExerciseStages } from './useExerciseStages.ts';
import shellStyles from './ToolShell.module.css';

interface OverlayContext {
  id: string;
  label: string;
  description: string;
  bgColor: string;
  bgLabel: string;
  targetAlphaMin: number;
  targetAlphaMax: number;
  targetColorDark: boolean; // true = foreground should be dark-ish, false = light-ish
}

const IMAGE_TEXT_CONTRAST_TARGET = 4.5;
const IMAGE_TEXT_COLOR = { r: 255, g: 255, b: 255 };

const CONTEXTS: OverlayContext[] = [
  {
    id: 'scrim',
    label: 'Modal scrim',
    description: 'Dim the background behind a dialog.',
    bgColor: '#e8e8e8',
    bgLabel: 'Light page',
    targetAlphaMin: 0.35,
    targetAlphaMax: 0.65,
    targetColorDark: true,
  },
  {
    id: 'hover',
    label: 'Card hover',
    description: 'Add a subtle highlight when the pointer is over the card.',
    bgColor: '#1e293b',
    bgLabel: 'Dark card',
    targetAlphaMin: 0.05,
    targetAlphaMax: 0.25,
    targetColorDark: false,
  },
  {
    id: 'image',
    label: 'Image text overlay',
    description: 'Darken the photo region before placing light text over it.',
    bgColor: '#7ca582',
    bgLabel: 'Photo region',
    targetAlphaMin: 0.45,
    targetAlphaMax: 0.8,
    targetColorDark: true,
  },
  {
    id: 'disabled',
    label: 'Disabled button',
    description: 'Show a button is inactive without hiding it.',
    bgColor: '#3b82f6',
    bgLabel: 'Active button',
    targetAlphaMin: 0.3,
    targetAlphaMax: 0.6,
    targetColorDark: false,
  },
];

function blendChannel(fg: number, bg: number, alpha: number): number {
  return Math.round(fg * alpha + bg * (1 - alpha));
}

function blendRgb(fgR: number, fgG: number, fgB: number, alpha: number, bgHex: string): { r: number; g: number; b: number } {
  const bg = parseInt(bgHex.slice(1), 16);
  const bgR = (bg >> 16) & 255, bgG = (bg >> 8) & 255, bgB = bg & 255;
  const r = blendChannel(fgR, bgR, alpha);
  const g = blendChannel(fgG, bgG, alpha);
  const b = blendChannel(fgB, bgB, alpha);
  return { r, g, b };
}

function rgbCss({ r, g, b }: { r: number; g: number; b: number }): string {
  return `rgb(${r} ${g} ${b})`;
}

function formatContrastRatio(ratio: number): string {
  return (Math.floor(ratio * 10) / 10).toFixed(1);
}

const STAGES: readonly ExerciseStageDefinition[] = CONTEXTS.map((context) => ({
  id: context.id,
  title: context.label,
  instruction: context.description,
  nextActionLabel: 'next overlay',
}));

export const AlphaLayerTool = memo(function AlphaLayerTool({
  interactive = false,
  onComplete,
  onStageChange,
}: ExerciseToolProps) {
  const [alpha, setAlpha] = useState(0.5);
  const [isDark, setIsDark] = useState(true);
  const stageController = useExerciseStages({ stages: STAGES, onComplete, onStageChange });
  const ctxIdx = stageController.activeStage.position - 1;

  const ctx = CONTEXTS[ctxIdx];
  const fgR = isDark ? 0 : 255;
  const fgG = isDark ? 0 : 255;
  const fgB = isDark ? 0 : 255;
  const fgLabel = isDark ? 'black' : 'white';
  const blendedRgb = blendRgb(fgR, fgG, fgB, alpha, ctx.bgColor);
  const blended = rgbCss(blendedRgb);
  const imageTextContrast = ctx.id === 'image'
    ? contrastRatioWcag(IMAGE_TEXT_COLOR, blendedRgb)
    : null;
  const imageTextPassesContrast = imageTextContrast !== null && imageTextContrast >= IMAGE_TEXT_CONTRAST_TARGET;
  const inputsDisabled = !interactive || stageController.result !== 'idle';

  function checkOverlay() {
    if (!interactive || stageController.result !== 'idle') return;
    const colorMatch = isDark === ctx.targetColorDark;
    const alphaInRange = alpha >= ctx.targetAlphaMin && alpha <= ctx.targetAlphaMax;
    const passesContextCheck = ctx.id === 'image' ? imageTextPassesContrast : alphaInRange;
    if (colorMatch && passesContextCheck) stageController.markPassed();
    else stageController.markIncorrect();
  }

  return (
    <div className={shellStyles.shell}>
      <span className={shellStyles.toolLabel}>layer stack simulator</span>

      <ExerciseStage
        controller={stageController}
        incorrectFeedback="The overlay does not meet this context's requirements. Try this stage again."
        passedFeedback="Overlay complete. Continue to the next context."
        completionFeedback="All four overlay contexts completed."
      >

      {/* Preview */}
      <div data-authored-visual style={{
        position: 'relative', width: '100%', height: 120, borderRadius: 'var(--radius-md)',
        background: ctx.bgColor, marginBottom: '0.75rem', overflow: 'hidden',
        border: '1px solid var(--border)',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: `rgba(${fgR}, ${fgG}, ${fgB}, ${alpha})`,
        }} />
        {ctx.id === 'image' && (
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: '0.95rem',
            fontWeight: 700,
            letterSpacing: '0.02em',
            fontFamily: 'var(--font-mono)',
          }}>
            Readable overlay text
          </div>
        )}
        <div style={{
          position: 'absolute', bottom: 8, left: 10,
          fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--muted)',
          background: 'rgba(0,0,0,0.5)', padding: '2px 6px', borderRadius: 3,
        }}>
          {ctx.bgLabel} + {fgLabel} @ {(alpha * 100).toFixed(0)}%
        </div>
      </div>

      {/* Blended result */}
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '0.75rem' }}>
        <div style={{
          width: 40, height: 40, borderRadius: 'var(--radius-sm)',
          background: blended, border: '1px solid var(--border)',
        }} />
        <div style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>
          <span style={{ color: 'var(--muted)' }}>Result:</span> {blended}
          {ctx.id === 'image' && imageTextContrast !== null && (
            <div style={{ marginTop: '0.25rem' }}>
              <span style={{ color: 'var(--muted)' }}>Text contrast:</span>{' '}
              {formatContrastRatio(imageTextContrast)}:1 (target: {IMAGE_TEXT_CONTRAST_TARGET}:1)
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div style={{ marginBottom: '0.5rem' }}>
        <label style={{ fontSize: '0.82rem', display: 'block', marginBottom: '0.3rem' }}>
          Alpha: {alpha.toFixed(2)}
          <input type="range" min={0} max={100} value={Math.round(alpha * 100)}
            disabled={inputsDisabled}
            onChange={(e) => setAlpha(Number(e.target.value) / 100)}
            style={{ width: '100%', accentColor: 'var(--accent-cta)' }}
            aria-label={`Alpha: ${(alpha * 100).toFixed(0)} percent`}
          />
        </label>
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.3rem' }}>
          <button onClick={() => interactive && setIsDark(true)} disabled={inputsDisabled}
            style={{
              padding: '0.3rem 0.6rem', fontSize: '0.78rem', fontFamily: 'var(--font-mono)',
              background: isDark ? '#222' : 'transparent', color: isDark ? '#fff' : 'var(--muted)',
              border: `1px solid ${isDark ? '#555' : 'var(--border)'}`, borderRadius: 'var(--radius-sm)',
              cursor: interactive ? 'pointer' : 'default',
            }}>
            dark overlay
          </button>
          <button onClick={() => interactive && setIsDark(false)} disabled={inputsDisabled}
            style={{
              padding: '0.3rem 0.6rem', fontSize: '0.78rem', fontFamily: 'var(--font-mono)',
              background: !isDark ? '#eee' : 'transparent', color: !isDark ? '#111' : 'var(--muted)',
              border: `1px solid ${!isDark ? '#aaa' : 'var(--border)'}`, borderRadius: 'var(--radius-sm)',
              cursor: interactive ? 'pointer' : 'default',
            }}>
            light overlay
          </button>
        </div>
      </div>

      {/* Task info and check */}
      {interactive && stageController.result === 'idle' && (
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '0.6rem', marginTop: '0.5rem' }}>
          <button onClick={checkOverlay} style={{
            padding: '0.4rem 1rem', background: 'var(--accent-cta)', color: 'var(--cta-foreground)',
            border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer',
            fontFamily: 'var(--font-mono)', fontSize: '0.82rem',
          }}>
            check
          </button>
        </div>
      )}

      </ExerciseStage>
    </div>
  );
});
