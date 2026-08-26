import { memo, useState } from 'react';
import type { CSSProperties } from 'react';
import { hexToHsl, hexToRgb } from '../../utils/color.ts';
import {
  DISPLAY_P3_SAMPLES,
  isDisplayP3OutsideSrgb,
} from './color-space-lab-data.ts';
import type { DisplayP3Sample } from './color-space-lab-data.ts';
import styles from './ColorSpaceLabTool.module.css';
import { ExerciseStage } from './ExerciseStage.tsx';
import type { ExerciseStageDefinition, ExerciseToolProps } from './exercise-stage.ts';
import shellStyles from './ToolShell.module.css';
import { useExerciseStages } from './useExerciseStages.ts';

interface SortItem {
  label: string;
  category: 'value' | 'role' | 'context';
}

const SORT_ITEMS: SortItem[] = [
  { label: '#0B57D0', category: 'value' },
  { label: '--color-text-primary', category: 'role' },
  { label: 'wide-gamut display', category: 'context' },
  { label: 'chart bar fill', category: 'context' },
  { label: 'rgb(34 34 34)', category: 'value' },
  { label: '--color-success-bg', category: 'role' },
  { label: 'SVG icon fill', category: 'context' },
  { label: '#22c55e', category: 'value' },
  { label: '--color-border', category: 'role' },
];

type GamutAnswer = 'maps' | 'within';

type PreviewProperties = CSSProperties & {
  '--p3-color': string;
  '--srgb-fallback': string;
};

const STAGES: readonly ExerciseStageDefinition[] = [
  {
    id: 'classify-color-terms',
    title: 'Classify the color terms',
    instruction: 'Sort each item as a raw value, semantic role, or usage context.',
    nextActionLabel: 'classify gamut mapping',
  },
  {
    id: 'classify-gamut-mapping',
    title: 'Classify the gamut samples',
    instruction: 'Decide whether each Display P3 sample needs gamut mapping for sRGB output.',
  },
];

export const ColorSpaceLabTool = memo(function ColorSpaceLabTool({
  interactive = false,
  onComplete,
  onStageChange,
}: ExerciseToolProps) {
  const [accentIdx, setAccentIdx] = useState(0);
  const [sortAnswers, setSortAnswers] = useState<Record<string, string>>({});
  const [gamutAnswers, setGamutAnswers] = useState<Record<string, string>>({});
  const stageController = useExerciseStages({ stages: STAGES, onComplete, onStageChange });
  const activeStageId = stageController.activeStage.id;

  const accent = DISPLAY_P3_SAMPLES[accentIdx];
  const rgb = hexToRgb(accent.srgbFallback);
  const hsl = hexToHsl(accent.srgbFallback);
  const outsideSrgb = isDisplayP3OutsideSrgb(accent.p3Channels);
  const previewProperties: PreviewProperties = {
    '--p3-color': accent.p3,
    '--srgb-fallback': accent.srgbFallback,
  };

  function expectedGamutAnswer(sample: DisplayP3Sample): GamutAnswer {
    return isDisplayP3OutsideSrgb(sample.p3Channels) ? 'maps' : 'within';
  }

  function checkChallenge() {
    if (!interactive || stageController.result === 'passed') return;

    const sortIsCorrect = SORT_ITEMS.every((item) => sortAnswers[item.label] === item.category);
    const gamutIsCorrect = DISPLAY_P3_SAMPLES.every(
      (sample) => gamutAnswers[sample.id] === expectedGamutAnswer(sample),
    );

    const stageIsCorrect = activeStageId === 'classify-color-terms'
      ? sortIsCorrect
      : gamutIsCorrect;
    if (stageIsCorrect) stageController.markPassed();
    else stageController.markIncorrect();
  }

  const sortCorrectCount = SORT_ITEMS.filter(
    (item) => sortAnswers[item.label] === item.category,
  ).length;
  const gamutCorrectCount = DISPLAY_P3_SAMPLES.filter(
    (sample) => gamutAnswers[sample.id] === expectedGamutAnswer(sample),
  ).length;

  return (
    <div className={shellStyles.shell}>
      <span className={shellStyles.toolLabel}>color space lab</span>

      <ExerciseStage
        controller={stageController}
        incorrectFeedback={activeStageId === 'classify-color-terms'
          ? `Correct classifications: ${sortCorrectCount}/${SORT_ITEMS.length}.`
          : `Correct gamut decisions: ${gamutCorrectCount}/${DISPLAY_P3_SAMPLES.length}.`}
        passedFeedback="Every term is classified by its role in the color system."
        completionFeedback="The P3 samples outside sRGB are marked for gamut mapping."
      >
      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
        {DISPLAY_P3_SAMPLES.map((sample, index) => (
          <button
            key={sample.id}
            onClick={() => interactive && setAccentIdx(index)}
            disabled={!interactive}
            style={{
              padding: '0.25rem 0.5rem',
              fontSize: '0.75rem',
              fontFamily: 'var(--font-mono)',
              background: index === accentIdx ? 'var(--hover-background)' : 'transparent',
              color: index === accentIdx ? 'var(--primary-foreground)' : 'var(--muted)',
              border: `1px solid ${index === accentIdx ? 'var(--border-strong)' : 'var(--border)'}`,
              borderRadius: 'var(--radius-sm)',
              cursor: interactive ? 'pointer' : 'default',
            }}
          >
            {sample.label}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.5rem' }}>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: '0.72rem', color: 'var(--muted)', marginBottom: '0.25rem' }}>
            sRGB fallback
          </p>
          <div
            data-testid="srgb-preview"
            style={{
              height: 60,
              borderRadius: 'var(--radius-sm)',
              background: accent.srgbFallback,
              border: '1px solid var(--border)',
            }}
          />
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: '0.72rem', color: 'var(--muted)', marginBottom: '0.25rem' }}>
            Display P3 original
          </p>
          <div
            className={styles.p3Preview}
            data-testid="display-p3-preview"
            style={previewProperties}
          />
        </div>
      </div>

      <p style={{ fontSize: '0.75rem', color: 'var(--muted)', margin: '0 0 0.5rem' }}>
        Your display or browser may render these panels alike. The values and gamut result below identify the intended comparison without relying on a visible difference.
      </p>

      <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', marginBottom: '0.75rem' }}>
        <div><span style={{ color: 'var(--muted)' }}>Display P3</span> {accent.p3}</div>
        <div><span style={{ color: 'var(--muted)' }}>sRGB fallback</span> {accent.srgbFallback}</div>
        {(!interactive || (activeStageId === 'classify-gamut-mapping' && stageController.result === 'passed')) && (
          <div style={{ color: outsideSrgb ? 'var(--accent-warning)' : 'var(--accent-success)', marginTop: '0.2rem' }}>
            {outsideSrgb
              ? 'Outside sRGB: this sample needs gamut mapping for sRGB output.'
              : 'Inside sRGB: this sample can be represented in both color spaces.'}
          </div>
        )}
      </div>

      <div style={{ marginBottom: '0.75rem' }}>
        <p style={{ fontSize: '0.78rem', color: 'var(--muted)', marginBottom: '0.3rem' }}>
          sRGB fallback in different contexts:
        </p>
        <div data-authored-visual style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto' }}>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <div style={{
              height: 36,
              borderRadius: 'var(--radius-sm)',
              background: accent.srgbFallback,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <span style={{ color: '#fff', fontSize: '0.7rem', fontFamily: 'var(--font-mono)' }}>CSS button</span>
            </div>
            <span style={{ fontSize: '0.68rem', color: 'var(--muted)' }}>HTML/CSS</span>
          </div>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <svg width="100%" height="36" viewBox="0 0 60 36">
              <circle cx="30" cy="18" r="14" fill={accent.srgbFallback} />
            </svg>
            <span style={{ fontSize: '0.68rem', color: 'var(--muted)' }}>SVG icon</span>
          </div>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <div style={{
              height: 36,
              borderRadius: 'var(--radius-sm)',
              background: '#1a1a2e',
              display: 'flex',
              alignItems: 'flex-end',
              padding: '0 4px',
              gap: 2,
            }}>
              <div style={{ flex: 1, height: '60%', background: accent.srgbFallback, borderRadius: '2px 2px 0 0' }} />
              <div style={{ flex: 1, height: '40%', background: accent.srgbFallback, borderRadius: '2px 2px 0 0', opacity: 0.6 }} />
              <div style={{ flex: 1, height: '80%', background: accent.srgbFallback, borderRadius: '2px 2px 0 0' }} />
            </div>
            <span style={{ fontSize: '0.68rem', color: 'var(--muted)' }}>Canvas chart</span>
          </div>
        </div>
      </div>

      <div style={{
        fontSize: '0.75rem',
        fontFamily: 'var(--font-mono)',
        marginBottom: '0.75rem',
        color: 'var(--primary-foreground)',
      }}>
        <span style={{ color: 'var(--muted)' }}>Fallback RGB</span> rgb({rgb.r} {rgb.g} {rgb.b})
        {' · '}
        <span style={{ color: 'var(--muted)' }}>Fallback HSL</span> hsl({hsl.h} {hsl.s}% {hsl.l}%)
      </div>

      {interactive && (
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '0.6rem' }}>
          {activeStageId === 'classify-color-terms' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginBottom: '0.75rem' }}>
            {SORT_ITEMS.map((item) => {
              const answer = sortAnswers[item.label] ?? '';
              const isWrong = stageController.result === 'incorrect' && answer !== item.category;
              return (
                <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <code style={{
                    fontSize: '0.75rem',
                    minWidth: 0,
                    flex: '1 1 170px',
                    overflowWrap: 'anywhere',
                    color: isWrong ? 'var(--accent-danger)' : 'var(--primary-foreground)',
                  }}>
                    {item.label}
                  </code>
                  <select
                    value={answer}
                    disabled={stageController.result === 'passed'}
                    onChange={(event) => {
                      setSortAnswers((previous) => ({
                        ...previous,
                        [item.label]: event.target.value,
                      }));
                      stageController.retry();
                    }}
                    style={{
                      fontSize: '0.75rem',
                      fontFamily: 'var(--font-mono)',
                      background: 'var(--surface)',
                      color: 'var(--primary-foreground)',
                      border: `1px solid ${isWrong ? 'var(--accent-danger)' : 'var(--border)'}`,
                      borderRadius: 'var(--radius-sm)',
                      padding: '0.2rem 0.3rem',
                      minWidth: 0,
                      maxWidth: '100%',
                      flex: '1 1 140px',
                    }}
                    aria-label={`Category for ${item.label}`}
                  >
                    <option value="">choose</option>
                    <option value="value">raw value</option>
                    <option value="role">semantic role</option>
                    <option value="context">usage context</option>
                  </select>
                </div>
              );
            })}
          </div>
          )}

          {activeStageId === 'classify-gamut-mapping' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginBottom: '0.5rem' }}>
            {DISPLAY_P3_SAMPLES.map((sample) => {
              const answer = gamutAnswers[sample.id] ?? '';
              const isWrong = stageController.result === 'incorrect' && answer !== expectedGamutAnswer(sample);
              return (
                <div key={sample.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <code style={{
                    fontSize: '0.75rem',
                    minWidth: 0,
                    flex: '1 1 170px',
                    overflowWrap: 'anywhere',
                    color: isWrong ? 'var(--accent-danger)' : 'var(--primary-foreground)',
                  }}>
                    {sample.label}
                  </code>
                  <select
                    value={answer}
                    disabled={stageController.result === 'passed'}
                    onChange={(event) => {
                      setGamutAnswers((previous) => ({
                        ...previous,
                        [sample.id]: event.target.value,
                      }));
                      stageController.retry();
                    }}
                    style={{
                      fontSize: '0.75rem',
                      fontFamily: 'var(--font-mono)',
                      background: 'var(--surface)',
                      color: 'var(--primary-foreground)',
                      border: `1px solid ${isWrong ? 'var(--accent-danger)' : 'var(--border)'}`,
                      borderRadius: 'var(--radius-sm)',
                      padding: '0.2rem 0.3rem',
                      minWidth: 0,
                      maxWidth: '100%',
                      flex: '1 1 140px',
                    }}
                    aria-label={`Gamut mapping for ${sample.label}`}
                  >
                    <option value="">choose</option>
                    <option value="maps">needs gamut mapping</option>
                    <option value="within">within sRGB</option>
                  </select>
                </div>
              );
            })}
          </div>
          )}

          {stageController.result !== 'passed' && (
            <button onClick={checkChallenge} style={{
              padding: '0.4rem 1rem',
              background: 'var(--accent-cta)',
              color: 'var(--cta-foreground)',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.82rem',
            }}>
              check stage
            </button>
          )}
        </div>
      )}
      </ExerciseStage>
    </div>
  );
});
