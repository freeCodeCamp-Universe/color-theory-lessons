import { memo, useState } from 'react';
import { hexToRgb, contrastRatioWcag } from '../../utils/color.ts';
import { ExerciseStage } from './ExerciseStage.tsx';
import type { ExerciseStageDefinition, ExerciseToolProps } from './exercise-stage.ts';
import { useExerciseStages } from './useExerciseStages.ts';
import { VisualDescription } from '../accessibility/VisualDescription.tsx';
import shellStyles from './ToolShell.module.css';

interface RoleDef {
  key: string;
  label: string;
  defaultValue: string;
}

const ROLES: RoleDef[] = [
  { key: 'bg',        label: 'Background',    defaultValue: '#1a1a2e' },
  { key: 'surface',   label: 'Surface',       defaultValue: '#252542' },
  { key: 'textPri',   label: 'Primary text',  defaultValue: '#e0e0e0' },
  { key: 'textSec',   label: 'Secondary text', defaultValue: '#6e6e86' },
  { key: 'border',    label: 'Border',        defaultValue: '#3a3a55' },
  { key: 'accent',    label: 'Primary action', defaultValue: '#6366f1' },
  { key: 'success',   label: 'Success',       defaultValue: '#22c55e' },
  { key: 'warning',   label: 'Warning',       defaultValue: '#eab308' },
  { key: 'error',     label: 'Error',         defaultValue: '#ef4444' },
];

const GRADIENT_DEFAULTS = { start: '#4f46e5', end: '#7c3aed' };
const TEXT_CONTRAST_TARGET = 4.5;
const HERO_TEXT_COLOR = '#ffffff';

function formatContrastRatio(ratio: number): string {
  return (Math.floor(ratio * 10) / 10).toFixed(1);
}

const STAGES: readonly ExerciseStageDefinition[] = [{
  id: 'build-readable-theme',
  title: 'Build a readable theme',
  instruction: 'Adjust the role colors and gradient until all five text contrast checks pass.',
}];

export const ThemeSandboxTool = memo(function ThemeSandboxTool({
  interactive = false,
  onComplete,
  onStageChange,
}: ExerciseToolProps) {
  const [colors, setColors] = useState<Record<string, string>>(
    Object.fromEntries(ROLES.map((r) => [r.key, r.defaultValue]))
  );
  const [gradStart, setGradStart] = useState(GRADIENT_DEFAULTS.start);
  const [gradEnd, setGradEnd] = useState(GRADIENT_DEFAULTS.end);
  const stageController = useExerciseStages({ stages: STAGES, onComplete, onStageChange });
  const inputsDisabled = !interactive || stageController.result !== 'idle';

  function setColor(key: string, value: string) {
    setColors((prev) => ({ ...prev, [key]: value }));
  }

  function checkTheme() {
    if (!interactive || stageController.result !== 'idle') return;
    if (allPass) stageController.markPassed();
    else stageController.markIncorrect();
  }

  const bgRgb = hexToRgb(colors.bg);
  const surfRgb = hexToRgb(colors.surface);
  const textPriRgb = hexToRgb(colors.textPri);
  const textSecRgb = hexToRgb(colors.textSec);
  const heroTextRgb = hexToRgb(HERO_TEXT_COLOR);
  const gradStartRgb = hexToRgb(gradStart);
  const gradEndRgb = hexToRgb(gradEnd);
  const priOnBg = contrastRatioWcag(textPriRgb, bgRgb);
  const priOnSurf = contrastRatioWcag(textPriRgb, surfRgb);
  const secOnSurf = contrastRatioWcag(textSecRgb, surfRgb);
  const heroOnGradStart = contrastRatioWcag(heroTextRgb, gradStartRgb);
  const heroOnGradEnd = contrastRatioWcag(heroTextRgb, gradEndRgb);
  const allPass = priOnBg >= TEXT_CONTRAST_TARGET
    && priOnSurf >= TEXT_CONTRAST_TARGET
    && secOnSurf >= TEXT_CONTRAST_TARGET
    && heroOnGradStart >= TEXT_CONTRAST_TARGET
    && heroOnGradEnd >= TEXT_CONTRAST_TARGET;
  const showResults = stageController.attemptedStageIds.includes(stageController.activeStage.id);
  const themeDescription = `Theme preview. Background ${colors.bg}; surface ${colors.surface}; primary text ${colors.textPri}; secondary text ${colors.textSec}; border ${colors.border}; action ${colors.accent}; success ${colors.success}; warning ${colors.warning}; error ${colors.error}. Gradient starts at ${gradStart} and ends at ${gradEnd}.`;

  function resultColor(passes: boolean) {
    if (!showResults) return 'var(--muted)';
    return passes ? 'var(--accent-success)' : 'var(--accent-danger)';
  }

  function resultSymbol(passes: boolean) {
    if (!showResults) return '';
    return passes ? '✓ ' : '✗ ';
  }

  return (
    <div className={shellStyles.shell}>
      <span className={shellStyles.toolLabel}>theme sandbox</span>

      <ExerciseStage
        controller={stageController}
        incorrectFeedback="At least one text pair is below 4.5:1. Try this stage again."
        completionFeedback="Theme complete. All five checked text pairs meet 4.5:1."
      >
      {/* Live preview */}
      <div data-authored-visual style={{
        background: colors.bg, borderRadius: 'var(--radius-md)', padding: '0.75rem',
        border: `1px solid ${colors.border}`, marginBottom: '0.75rem',
      }}>
        <VisualDescription id="theme-description">{themeDescription}</VisualDescription>
        {/* Hero gradient */}
        <div style={{
          background: `linear-gradient(135deg, ${gradStart}, ${gradEnd})`,
          borderRadius: 'var(--radius-sm)', padding: '1rem', marginBottom: '0.6rem',
        }}>
          <span style={{ color: HERO_TEXT_COLOR, fontFamily: 'var(--font-mono)', fontSize: '0.82rem' }}>
            Hero gradient
          </span>
        </div>

        {/* Card */}
        <div style={{
          background: colors.surface, borderRadius: 'var(--radius-sm)', padding: '0.75rem',
          border: `1px solid ${colors.border}`,
        }}>
          <p style={{ color: colors.textPri, fontSize: '0.85rem', margin: '0 0 0.3rem' }}>
            Primary text on surface
          </p>
          <p style={{ color: colors.textSec, fontSize: '0.78rem', margin: '0 0 0.5rem' }}>
            Secondary text for supporting details
          </p>
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            <span style={{
              padding: '0.2rem 0.5rem', borderRadius: 3, fontSize: '0.72rem',
              background: colors.accent, color: '#fff', fontFamily: 'var(--font-mono)',
            }}>Action</span>
            <span style={{
              padding: '0.2rem 0.5rem', borderRadius: 3, fontSize: '0.72rem',
              background: colors.success, color: '#111', fontFamily: 'var(--font-mono)',
            }}>Success</span>
            <span style={{
              padding: '0.2rem 0.5rem', borderRadius: 3, fontSize: '0.72rem',
              background: colors.warning, color: '#111', fontFamily: 'var(--font-mono)',
            }}>Warning</span>
            <span style={{
              padding: '0.2rem 0.5rem', borderRadius: 3, fontSize: '0.72rem',
              background: colors.error, color: '#fff', fontFamily: 'var(--font-mono)',
            }}>Error</span>
          </div>
        </div>
      </div>

      {/* Color role editors */}
      <div className={shellStyles.twoColumnGrid} style={{ gap: '0.35rem 0.75rem', marginBottom: '0.6rem' }}>
        {ROLES.map((role) => (
          <label key={role.key} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem' }}>
            <input type="color" value={colors[role.key]}
              disabled={inputsDisabled}
              onChange={(e) => setColor(role.key, e.target.value)}
              style={{ width: 24, height: 24, border: 'none', padding: 0, cursor: interactive ? 'pointer' : 'default' }}
              aria-label={role.label}
              aria-describedby="theme-description"
            />
            <span style={{ color: 'var(--muted)' }}>{role.label}</span>
          </label>
        ))}
      </div>

      {/* Gradient editors */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.6rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.78rem' }}>
          <input type="color" value={gradStart} disabled={inputsDisabled}
            onChange={(e) => setGradStart(e.target.value)}
            style={{ width: 24, height: 24, border: 'none', padding: 0 }}
            aria-label="Gradient start"
            aria-describedby="theme-description"
          />
          <span style={{ color: 'var(--muted)' }}>Gradient start</span>
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.78rem' }}>
          <input type="color" value={gradEnd} disabled={inputsDisabled}
            onChange={(e) => setGradEnd(e.target.value)}
            style={{ width: 24, height: 24, border: 'none', padding: 0 }}
            aria-label="Gradient end"
            aria-describedby="theme-description"
          />
          <span style={{ color: 'var(--muted)' }}>Gradient end</span>
        </label>
      </div>

      {/* Contrast readout */}
      <div aria-live="polite" aria-atomic="true" style={{ fontSize: '0.78rem', fontFamily: 'var(--font-sans)', marginBottom: '0.5rem' }}>
        <div style={{ color: resultColor(priOnBg >= TEXT_CONTRAST_TARGET) }}>
          {resultSymbol(priOnBg >= TEXT_CONTRAST_TARGET)}Primary text on background: {formatContrastRatio(priOnBg)}:1 (target: 4.5:1)
        </div>
        <div style={{ color: resultColor(priOnSurf >= TEXT_CONTRAST_TARGET) }}>
          {resultSymbol(priOnSurf >= TEXT_CONTRAST_TARGET)}Primary text on surface: {formatContrastRatio(priOnSurf)}:1 (target: 4.5:1)
        </div>
        <div style={{ color: resultColor(secOnSurf >= TEXT_CONTRAST_TARGET) }}>
          {resultSymbol(secOnSurf >= TEXT_CONTRAST_TARGET)}Secondary text on surface: {formatContrastRatio(secOnSurf)}:1 (target: 4.5:1)
        </div>
        <div style={{ color: resultColor(heroOnGradStart >= TEXT_CONTRAST_TARGET) }}>
          {resultSymbol(heroOnGradStart >= TEXT_CONTRAST_TARGET)}Hero text on gradient start: {formatContrastRatio(heroOnGradStart)}:1 (target: 4.5:1)
        </div>
        <div style={{ color: resultColor(heroOnGradEnd >= TEXT_CONTRAST_TARGET) }}>
          {resultSymbol(heroOnGradEnd >= TEXT_CONTRAST_TARGET)}Hero text on gradient end: {formatContrastRatio(heroOnGradEnd)}:1 (target: 4.5:1)
        </div>
      </div>

      {interactive && stageController.result === 'idle' && (
        <button onClick={checkTheme} style={{
          padding: '0.4rem 1rem', background: 'var(--accent-cta)',
          color: 'var(--cta-foreground)',
          border: 'none', borderRadius: 'var(--radius-sm)',
          cursor: 'pointer',
          fontFamily: 'var(--font-mono)', fontSize: '0.82rem',
        }}>
          check theme
        </button>
      )}
      </ExerciseStage>
    </div>
  );
});
