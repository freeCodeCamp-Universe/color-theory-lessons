import { memo, useState } from 'react';
import { hexToHsl, hexToRgb, contrastRatioWcag } from '../../utils/color.ts';
import { ExerciseStage } from './ExerciseStage.tsx';
import type { ExerciseStageDefinition, ExerciseToolProps } from './exercise-stage.ts';
import shellStyles from './ToolShell.module.css';
import { useExerciseStages } from './useExerciseStages.ts';

type RoleKey = 'page-bg' | 'surface' | 'primary-text' | 'secondary-text' | 'action' | 'success' | 'error';

const TEXT_CONTRAST_MINIMUM = 4.5;
const STATUS_HUE_DIFFERENCE_MINIMUM = 30;
const STATUS_LUMINANCE_CONTRAST_MINIMUM = 1.5;

const LIGHT_THEME: Record<RoleKey, string> = {
  'page-bg': '#f9fafb',
  'surface': '#ffffff',
  'primary-text': '#111827',
  'secondary-text': '#6b7280',
  'action': '#2563eb',
  'success': '#16a34a',
  'error': '#dc2626',
};

const DARK_DEFAULTS: Record<RoleKey, string> = {
  'page-bg': '#ffffff',
  'surface': '#f9fafb',
  'primary-text': '#111827',
  'secondary-text': '#6b7280',
  'action': '#2563eb',
  'success': '#16a34a',
  'error': '#dc2626',
};

const STAGES: readonly ExerciseStageDefinition[] = [{
  id: 'translate-dark-theme',
  title: 'Translate the theme to dark mode',
  instruction: 'Choose dark-theme values for all seven roles, compare both previews, and make every displayed check pass.',
}];

function getContrast(fg: string, bg: string): number {
  if (!isValidHex(fg) || !isValidHex(bg)) return 1;
  try { return contrastRatioWcag(hexToRgb(fg), hexToRgb(bg)); } catch { return 1; }
}

function isValidHex(h: string) { return /^#[0-9a-fA-F]{6}$/.test(h); }

function formatContrastRatio(ratio: number): string {
  return (Math.floor(ratio * 10) / 10).toFixed(1);
}

function getHueDifference(first: string, second: string) {
  const firstHsl = hexToHsl(first);
  const secondHsl = hexToHsl(second);
  if (firstHsl.s === 0 || secondHsl.s === 0) return null;

  const difference = Math.abs(firstHsl.h - secondHsl.h);
  return Math.min(difference, 360 - difference);
}

export const DarkTranslatorTool = memo(function DarkTranslatorTool({
  interactive = false,
  onComplete,
  onStageChange,
}: ExerciseToolProps) {
  const [dark, setDark] = useState<Record<RoleKey, string>>(DARK_DEFAULTS);
  const [preview, setPreview] = useState<'light' | 'dark'>('light');
  const [hasInteracted, setHasInteracted] = useState(false);
  const stageController = useExerciseStages({ stages: STAGES, onComplete, onStageChange });

  function update(key: RoleKey, val: string) {
    if (!interactive || stageController.result === 'passed') return;
    setHasInteracted(true);
    setDark(prev => ({ ...prev, [key]: val }));
    stageController.retry();
  }

  const d = dark;
  const primaryContrast = getContrast(d['primary-text'], d['surface']);
  const secondaryContrast = getContrast(d['secondary-text'], d['surface']);
  const surfaceContrast = getContrast(d['surface'], d['page-bg']);
  const actionContrast = getContrast('#ffffff', d['action']);
  const successContrast = getContrast('#ffffff', d.success);
  const errorContrast = getContrast('#ffffff', d.error);
  const semanticContrast = getContrast(d.success, d.error);
  const successValid = isValidHex(d.success);
  const errorValid = isValidHex(d.error);
  const semanticRolesValid = successValid && errorValid;
  const semanticHueDifference = semanticRolesValid ? getHueDifference(d.success, d.error) : null;

  const primaryOk = primaryContrast >= TEXT_CONTRAST_MINIMUM;
  const secondaryOk = secondaryContrast >= TEXT_CONTRAST_MINIMUM;
  const surfaceOk = surfaceContrast >= 1.1;
  const actionOk = actionContrast >= 4.5;
  const successOk = successValid && successContrast >= TEXT_CONTRAST_MINIMUM;
  const errorOk = errorValid && errorContrast >= TEXT_CONTRAST_MINIMUM;
  const semanticHueOk = semanticHueDifference !== null
    && semanticHueDifference >= STATUS_HUE_DIFFERENCE_MINIMUM;
  const semanticLuminanceOk = semanticRolesValid
    && semanticContrast >= STATUS_LUMINANCE_CONTRAST_MINIMUM;
  const allPass = primaryOk && secondaryOk && surfaceOk && actionOk
    && semanticRolesValid && successOk && errorOk && semanticHueOk && semanticLuminanceOk;
  const roles = preview === 'light' ? LIGHT_THEME : dark;
  const bg = isValidHex(roles['page-bg']) ? roles['page-bg'] : '#1e293b';
  const surf = isValidHex(roles['surface']) ? roles['surface'] : '#334155';
  const pt = isValidHex(roles['primary-text']) ? roles['primary-text'] : '#f8fafc';
  const st = isValidHex(roles['secondary-text']) ? roles['secondary-text'] : '#94a3b8';
  const act = isValidHex(roles['action']) ? roles['action'] : '#3b82f6';
  const suc = isValidHex(roles['success']) ? roles['success'] : '#22c55e';
  const err = isValidHex(roles['error']) ? roles['error'] : '#ef4444';

  const KEYS = Object.keys(DARK_DEFAULTS) as RoleKey[];
  const checks: { label: string; pass: boolean; ratio?: number }[] = [
    { label: 'Primary text / surface (4.5:1)', pass: primaryOk, ratio: primaryContrast },
    { label: 'Secondary text / surface (4.5:1)', pass: secondaryOk, ratio: secondaryContrast },
    { label: 'Surface ≠ page-bg (1.1:1)', pass: surfaceOk, ratio: surfaceContrast },
    { label: 'White / action (4.5:1)', pass: actionOk, ratio: actionContrast },
    { label: 'Valid success color', pass: successValid },
    { label: 'Valid error color', pass: errorValid },
    { label: 'White / success (4.5:1)', pass: successOk, ratio: successContrast },
    { label: 'White / error (4.5:1)', pass: errorOk, ratio: errorContrast },
    { label: 'Success / error luminance (1.5:1)', pass: semanticLuminanceOk, ratio: semanticContrast },
  ];
  const showResults = stageController.attemptedStageIds.includes(stageController.activeStage.id);

  return (
    <div className={shellStyles.shell}>
      <span className={shellStyles.toolLabel}>dark translator</span>

      <ExerciseStage
        controller={stageController}
        incorrectFeedback="One or more dark-theme checks still fail. Adjust the role values and try the stage again."
        completionFeedback="Your dark theme passes every displayed check. Compare the preview in both modes before continuing."
      >
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        {/* Light theme (read-only) */}
        <div style={{ flex: '0 0 200px' }}>
          <p style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--muted)', marginBottom: '0.5rem' }}>LIGHT (fixed)</p>
          {KEYS.map(key => (
            <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.3rem' }}>
              <div style={{ width: 16, height: 16, borderRadius: 3, background: LIGHT_THEME[key], border: '1px solid #e5e7eb', flexShrink: 0 }} />
              <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--muted)', width: 100, flexShrink: 0 }}>{key}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--primary-foreground)' }}>{LIGHT_THEME[key]}</span>
            </div>
          ))}
        </div>

        {/* Dark theme (editable) */}
        <div style={{ flex: '0 0 220px' }}>
          <p style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--muted)', marginBottom: '0.5rem' }}>
            DARK {interactive ? '(edit)' : '(default: failing)'}
          </p>
          {KEYS.map(key => {
            const val = dark[key];
            return (
              <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.3rem' }}>
                <div style={{ width: 16, height: 16, borderRadius: 3, background: isValidHex(val) ? val : '#888', border: '1px solid var(--border)', flexShrink: 0 }} />
                <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--muted)', width: 100, flexShrink: 0 }}>{key}</span>
                <input
                  type="text"
                  value={val}
                  onChange={e => update(key, e.target.value)}
                  disabled={!interactive || stageController.result === 'passed'}
                  maxLength={7}
                  style={{
                    fontFamily: 'var(--font-mono)', fontSize: '0.72rem',
                    background: 'var(--surface, #1e293b)', color: 'var(--primary-foreground)',
                    border: `1px solid ${isValidHex(val) ? 'var(--border-strong)' : 'var(--accent-danger)'}`,
                    borderRadius: 3, padding: '0.15rem 0.3rem', width: 80,
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* Preview + checks */}
        <div style={{ flex: '1 1 200px' }}>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
            {(['light', 'dark'] as const).map(m => (
              <button
                key={m}
                onClick={() => setPreview(m)}
                style={{
                  padding: '0.2rem 0.6rem', fontSize: '0.75rem', borderRadius: 4, cursor: 'pointer',
                  background: preview === m ? 'color-mix(in srgb, var(--accent-warning) 6%, transparent)' : 'var(--surface, #1e293b)',
                  color: preview === m ? 'var(--accent-warning)' : 'var(--primary-foreground)',
                  border: `1px solid ${preview === m ? 'var(--accent-warning)' : 'var(--border-strong)'}`,
                }}
              >
                {m} mode
              </button>
            ))}
          </div>

          <div data-authored-visual style={{ background: bg, padding: '0.75rem', borderRadius: 6, border: '1px solid #4a4a6a', marginBottom: '0.5rem' }}>
            <div style={{ background: surf, borderRadius: 4, padding: '0.4rem 0.5rem', border: '1px solid rgba(128,128,128,0.2)' }}>
              <div style={{ color: pt, fontWeight: 600, fontSize: '0.83rem' }}>Card Title</div>
              <div style={{ color: st, fontSize: '0.75rem' }}>Supporting detail</div>
              <div style={{ display: 'flex', gap: '0.3rem', marginTop: '0.3rem', flexWrap: 'wrap' }}>
                <button style={{ background: act, color: '#fff', border: 'none', borderRadius: 4, padding: '0.2rem 0.5rem', fontSize: '0.72rem', cursor: 'default' }}>Action</button>
                <span style={{ background: suc, color: '#fff', borderRadius: 99, padding: '0.1rem 0.4rem', fontSize: '0.7rem' }}>OK</span>
                <span style={{ background: err, color: '#fff', borderRadius: 99, padding: '0.1rem 0.4rem', fontSize: '0.7rem' }}>Error</span>
              </div>
            </div>
          </div>

          {/* Dark mode validation */}
          <p style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--muted)', marginBottom: '0.25rem' }}>DARK CHECKS</p>
          {checks.map(({ label, pass, ratio }) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', padding: '0.15rem 0' }}>
              <span style={{ color: 'var(--primary-foreground)' }}>{label}</span>
              <span style={{ color: showResults ? (pass ? 'var(--accent-success)' : 'var(--accent-danger)') : 'var(--muted)', fontFamily: 'var(--font-mono)' }}>
                {showResults ? (pass ? '✓ ' : '✗ ') : ''}{ratio === undefined ? '' : `${formatContrastRatio(ratio)}:1`}
              </span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', padding: '0.15rem 0' }}>
            <span style={{ color: 'var(--primary-foreground)' }}>Success / error hues (30°)</span>
            <span style={{ color: showResults ? (semanticHueOk ? 'var(--accent-success)' : 'var(--accent-danger)') : 'var(--muted)', fontFamily: 'var(--font-mono)' }}>
              {showResults ? (semanticHueOk ? '✓ ' : '✗ ') : ''}{semanticHueDifference === null
                ? (semanticRolesValid ? 'no hue (achromatic)' : 'invalid')
                : `${semanticHueDifference}°`}
            </span>
          </div>
        </div>
      </div>

      {interactive && stageController.result !== 'passed' && (
        <button
          type="button"
          disabled={!hasInteracted}
          onClick={() => allPass ? stageController.markPassed() : stageController.markIncorrect()}
        >
          check stage
        </button>
      )}
      </ExerciseStage>
    </div>
  );
});
