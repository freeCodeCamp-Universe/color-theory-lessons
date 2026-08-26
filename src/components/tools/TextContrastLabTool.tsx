import { memo, useState } from 'react';
import { contrastRatioWcag, hexToRgb } from '../../utils/color.ts';
import { ExerciseStage } from './ExerciseStage.tsx';
import shellStyles from './ToolShell.module.css';
import type { ExerciseStageDefinition, ExerciseToolProps } from './exercise-stage.ts';
import { useExerciseStages } from './useExerciseStages.ts';

interface Pair {
  id: string;
  label: string;
  defaultText: string;
  defaultBg: string;
  threshold: number;
  thresholdLabel: string;
}

const PAIRS: Pair[] = [
  { id: 'body-copy', label: 'Body copy', defaultText: '#9ca3af', defaultBg: '#ffffff', threshold: 4.5, thresholdLabel: 'Normal text (≥4.5:1)' },
  { id: 'badge-label', label: 'Badge label', defaultText: '#ef4444', defaultBg: '#fef2f2', threshold: 4.5, thresholdLabel: 'Normal text (≥4.5:1)' },
  { id: 'sidebar-text', label: 'Sidebar text', defaultText: '#6b7280', defaultBg: '#f3f4f6', threshold: 4.5, thresholdLabel: 'Normal text (≥4.5:1)' },
];

function calcRatio(text: string, bg: string): number {
  try {
    return contrastRatioWcag(hexToRgb(text), hexToRgb(bg));
  } catch {
    return 1;
  }
}

function isValidHex(hex: string): boolean {
  return /^#[0-9a-fA-F]{6}$/.test(hex);
}

function formatRatio(ratio: number, digits: number): string {
  const factor = 10 ** digits;
  return (Math.floor(ratio * factor) / factor).toFixed(digits);
}

const STAGES = [{
  id: 'repair-text-contrast',
  title: 'Repair text contrast',
  instruction: 'Fix all three pairs so their normal text reaches a contrast ratio of at least 4.5:1, then check the stage.',
}] satisfies readonly ExerciseStageDefinition[];

export const TextContrastLabTool = memo(function TextContrastLabTool({
  interactive = false,
  onComplete,
  onStageChange,
}: ExerciseToolProps) {
  const [activePair, setActivePair] = useState(0);
  const [textColors, setTextColors] = useState<Record<string, string>>(
    Object.fromEntries(PAIRS.map((p) => [p.id, p.defaultText])),
  );
  const [bgColors, setBgColors] = useState<Record<string, string>>(
    Object.fromEntries(PAIRS.map((p) => [p.id, p.defaultBg])),
  );
  const passed = Object.fromEntries(PAIRS.map((p) => [
    p.id,
    isValidHex(textColors[p.id])
      && isValidHex(bgColors[p.id])
      && calcRatio(textColors[p.id], bgColors[p.id]) >= p.threshold,
  ]));
  const stageController = useExerciseStages({ stages: STAGES, onComplete, onStageChange });
  const completed = PAIRS.every((p) => passed[p.id]);

  const pair = PAIRS[activePair];
  const textColor = textColors[pair.id];
  const bgColor = bgColors[pair.id];
  const ratio = calcRatio(textColor, bgColor);
  const normalPass = ratio >= 4.5;
  const largePass = ratio >= 3;

  function handleTextChange(val: string) {
    if (!interactive || stageController.result === 'passed') return;
    setTextColors((prev) => ({ ...prev, [pair.id]: val }));
    stageController.retry();
  }

  function handleBgChange(val: string) {
    if (!interactive || stageController.result === 'passed') return;
    setBgColors((prev) => ({ ...prev, [pair.id]: val }));
    stageController.retry();
  }

  function checkRepairs() {
    if (!interactive) return;
    if (completed) stageController.markPassed();
    else stageController.markIncorrect();
  }

  const passedCount = Object.values(passed).filter(Boolean).length;

  return (
    <div className={shellStyles.shell}>
      <span className={shellStyles.toolLabel}>text contrast lab</span>

      <ExerciseStage
        controller={stageController}
        incorrectFeedback="Not all text pairs meet 4.5:1 yet. Adjust the failing pairs and check again."
        completionFeedback="All three pairs meet the 4.5:1 threshold for normal text."
      >
        {interactive && (
          <p style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>
            Passing pairs: {passedCount} of {PAIRS.length}.
          </p>
        )}

      {/* Pair tabs */}
      <div style={{ display: 'flex', gap: '0.25rem' }}>
        {PAIRS.map((p, i) => (
          <button
            key={p.id}
            onClick={() => interactive && setActivePair(i)}
            style={{
              padding: '0.3rem 0.65rem',
              fontSize: '0.75rem',
              borderRadius: 'var(--radius-sm)',
              border: `1px solid ${passed[p.id] ? 'var(--accent-success)' : activePair === i ? 'var(--accent-cta)' : 'var(--border)'}`,
              background: activePair === i
                ? 'color-mix(in srgb, var(--accent-cta) 15%, transparent)'
                : 'transparent',
              color: passed[p.id] ? 'var(--accent-success)' : 'var(--primary-foreground)',
              cursor: interactive ? 'pointer' : 'default',
              fontFamily: 'var(--font-mono)',
            }}
          >
            {p.label} {passed[p.id] ? '✓' : ''}
          </button>
        ))}
      </div>

      {/* Preview */}
      <div
        style={{
          background: isValidHex(bgColor) ? bgColor : '#ffffff',
          borderRadius: 'var(--radius-sm)',
          padding: '1rem',
          border: '1px solid var(--border)',
        }}
      >
        <p style={{ color: isValidHex(textColor) ? textColor : '#000', fontSize: '1rem', margin: '0 0 0.5rem' }}>
          Sample normal text (16px)
        </p>
        <p style={{ color: isValidHex(textColor) ? textColor : '#000', fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>
          Large heading (24px bold)
        </p>
      </div>

      {/* Ratio readout */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: '0.85rem',
          padding: '0.3rem 0.65rem', borderRadius: 'var(--radius-sm)',
          background: 'var(--surface)', border: '1px solid var(--border)',
        }}>
          ratio: <strong>{formatRatio(ratio, 2)}:1</strong>
        </div>
        <div style={{
          fontSize: '0.75rem', padding: '0.3rem 0.65rem',
          borderRadius: 'var(--radius-sm)',
          background: normalPass
            ? 'color-mix(in srgb, var(--accent-success) 12%, transparent)'
            : 'color-mix(in srgb, var(--accent-danger) 12%, transparent)',
          border: `1px solid ${normalPass ? 'var(--accent-success)' : 'var(--accent-danger)'}`,
          color: normalPass ? 'var(--accent-success)' : 'var(--accent-danger)',
        }}>
          Normal text (≥4.5:1): {normalPass ? 'PASS' : 'FAIL'}
        </div>
        <div style={{
          fontSize: '0.75rem', padding: '0.3rem 0.65rem',
          borderRadius: 'var(--radius-sm)',
          background: largePass
            ? 'color-mix(in srgb, var(--accent-success) 12%, transparent)'
            : 'color-mix(in srgb, var(--accent-danger) 12%, transparent)',
          border: `1px solid ${largePass ? 'var(--accent-success)' : 'var(--accent-danger)'}`,
          color: largePass ? 'var(--accent-success)' : 'var(--accent-danger)',
        }}>
          Large text (≥3:1): {largePass ? 'PASS' : 'FAIL'}
        </div>
      </div>

      {/* Color inputs */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <label style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.78rem', color: 'var(--muted)' }}>
          <span style={{ fontFamily: 'var(--font-mono)', textTransform: 'uppercase', fontSize: '0.7rem' }}>Text color</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <div style={{ width: 24, height: 24, borderRadius: 4, background: isValidHex(textColor) ? textColor : '#ccc', border: '1px solid var(--border)' }} />
            <input
              type="text"
              value={textColor}
              disabled={!interactive || stageController.result === 'passed'}
              onChange={(e) => handleTextChange(e.target.value)}
              style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.8rem',
                padding: '0.25rem 0.4rem', borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border)', background: 'var(--surface)',
                color: 'var(--primary-foreground)', width: '7rem',
              }}
              aria-label="Text color hex"
            />
          </div>
        </label>
        <label style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.78rem', color: 'var(--muted)' }}>
          <span style={{ fontFamily: 'var(--font-mono)', textTransform: 'uppercase', fontSize: '0.7rem' }}>Background color</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <div style={{ width: 24, height: 24, borderRadius: 4, background: isValidHex(bgColor) ? bgColor : '#ccc', border: '1px solid var(--border)' }} />
            <input
              type="text"
              value={bgColor}
              disabled={!interactive || stageController.result === 'passed'}
              onChange={(e) => handleBgChange(e.target.value)}
              style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.8rem',
                padding: '0.25rem 0.4rem', borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border)', background: 'var(--surface)',
                color: 'var(--primary-foreground)', width: '7rem',
              }}
              aria-label="Background color hex"
            />
          </div>
        </label>
      </div>

        {interactive && stageController.result !== 'passed' && (
          <button
            type="button"
            onClick={checkRepairs}
            style={{
              alignSelf: 'flex-start', padding: '0.5rem 1.25rem',
              background: 'var(--yellow)', color: 'var(--gray-90)',
              fontFamily: 'var(--font-mono)', fontWeight: 700,
              fontSize: '0.85rem', borderRadius: 'var(--radius-sm)',
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
