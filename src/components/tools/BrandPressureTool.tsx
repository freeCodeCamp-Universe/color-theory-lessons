import { memo, useState } from 'react';
import { ExerciseStage } from './ExerciseStage.tsx';
import type { ExerciseStageDefinition, ExerciseToolProps } from './exercise-stage.ts';
import shellStyles from './ToolShell.module.css';
import { useExerciseStages } from './useExerciseStages.ts';
import {
  FIXED_ACTIONS,
  getBrandPressureStatus,
  type RoleKey,
} from './brand-pressure-validation.ts';

const ROLE_LABELS: Record<RoleKey, string> = {
  'page-bg': 'Page background',
  'surface': 'Card surface',
  'primary-text': 'Primary text',
  'neutral-divider': 'Divider',
};

const FIXED_ROLE_LABELS: Record<string, string> = {
  action: 'Primary action',
  'secondary-action': 'Secondary action',
};

const NON_INTERACTIVE_DEFAULTS: Record<RoleKey, string> = {
  'page-bg': '#7c3aed',
  'surface': '#6d28d9',
  'primary-text': '#ffffff',
  'neutral-divider': '#8b5cf6',
};

const INTERACTIVE_DEFAULTS: Record<RoleKey, string> = {
  'page-bg': '#f8f7ff',
  'surface': '#ede9fe',
  'primary-text': '#1c1917',
  'neutral-divider': '#e2e8f0',
};

const STAGES: readonly ExerciseStageDefinition[] = [{
  id: 'balance-brand-pressure',
  title: 'Balance the brand roles',
  instruction: 'Edit the four supporting roles so every contrast check passes and brand pressure stays below 40%.',
}];

function isValidHex(h: string) { return /^#[0-9a-fA-F]{6}$/.test(h); }

function formatContrastRatio(ratio: number): string {
  return (Math.floor(ratio * 10) / 10).toFixed(1);
}

export const BrandPressureTool = memo(function BrandPressureTool({
  interactive = false,
  onComplete,
  onStageChange,
}: ExerciseToolProps) {
  const defaults = interactive ? INTERACTIVE_DEFAULTS : NON_INTERACTIVE_DEFAULTS;
  const [roles, setRoles] = useState<Record<RoleKey, string>>(defaults);
  const [hasInteracted, setHasInteracted] = useState(false);
  const stageController = useExerciseStages({ stages: STAGES, onComplete, onStageChange });

  function update(key: RoleKey, val: string) {
    if (!interactive || stageController.result === 'passed') return;
    setHasInteracted(true);
    setRoles(prev => ({ ...prev, [key]: val }));
    stageController.retry();
  }

  const {
    pageTextContrast,
    cardTextContrast,
    surfaceContrast,
    pressure,
    actionChecks,
    pageTextOk,
    cardTextOk,
    surfaceOk,
    pressureOk,
    allPass,
  } = getBrandPressureStatus(roles);

  const bg = isValidHex(roles['page-bg']) ? roles['page-bg'] : '#f8f7ff';
  const surf = isValidHex(roles['surface']) ? roles['surface'] : '#ede9fe';
  const pt = isValidHex(roles['primary-text']) ? roles['primary-text'] : '#1c1917';
  const div = isValidHex(roles['neutral-divider']) ? roles['neutral-divider'] : '#e2e8f0';

  const meterColor = pressure < 40
    ? 'var(--accent-success)'
    : pressure < 60
      ? 'var(--accent-warning)'
      : 'var(--accent-danger)';
  const showResults = stageController.attemptedStageIds.includes(stageController.activeStage.id);

  return (
    <div className={shellStyles.shell}>
      <span className={shellStyles.toolLabel}>brand pressure</span>

      <ExerciseStage
        controller={stageController}
        incorrectFeedback="One or more contrast or brand-pressure checks still fail. Adjust the supporting roles and try the stage again."
        completionFeedback="The supporting roles avoid saturated colors near the brand hue, and every contrast check passes."
      >
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        {/* Inputs */}
        <div style={{ flex: '0 0 220px' }}>
          <p style={{ fontSize: '0.75rem', fontFamily: 'var(--font-sans)', color: 'var(--muted)', marginBottom: '0.5rem' }}>ROLES</p>

          {/* Read-only brand roles */}
          {FIXED_ACTIONS.map(action => (
            <div key={action.role} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.3rem' }}>
              <div style={{ width: 18, height: 18, borderRadius: 3, background: action.background, border: '1px solid var(--border)', flexShrink: 0 }} />
              <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-sans)', color: 'var(--muted)', width: 110, flexShrink: 0 }}>{FIXED_ROLE_LABELS[action.role]} (fixed)</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--primary-foreground)' }}>{action.background}</span>
            </div>
          ))}

          <div style={{ borderTop: '1px solid var(--border)', margin: '0.4rem 0' }} />

          {(Object.keys(defaults) as RoleKey[]).map(key => {
            const val = roles[key];
            const invalid = !isValidHex(val);
            const errorId = `brand-pressure-${key}-hex-error`;
            return (
              <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.3rem', flexWrap: 'wrap' }}>
                <div style={{ width: 18, height: 18, borderRadius: 3, background: isValidHex(val) ? val : '#888', border: '1px solid var(--border)', flexShrink: 0 }} />
                <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-sans)', color: 'var(--muted)', width: 110, flexShrink: 0 }}>{ROLE_LABELS[key]}</span>
                <input
                  type="text"
                  value={val}
                  onChange={e => update(key, e.target.value)}
                  disabled={!interactive || stageController.result === 'passed'}
                  maxLength={7}
                  aria-label={`${ROLE_LABELS[key]} hex color`}
                  aria-invalid={invalid}
                  aria-describedby={invalid ? errorId : undefined}
                  style={{
                    fontFamily: 'var(--font-mono)', fontSize: '0.78rem',
                    background: 'var(--surface, #1e293b)', color: 'var(--primary-foreground)',
                    border: `1px solid ${invalid ? 'var(--accent-danger)' : 'var(--border-strong)'}`,
                    borderRadius: 3, padding: '0.15rem 0.3rem', width: 90,
                  }}
                />
                {invalid && (
                  <span id={errorId} className={shellStyles.inputError}>
                    Error: enter a 3- or 6-digit hex color for {ROLE_LABELS[key]}.
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Preview */}
        <div style={{ flex: '1 1 180px', minWidth: 160 }}>
          <p style={{ fontSize: '0.75rem', fontFamily: 'var(--font-sans)', color: 'var(--muted)', marginBottom: '0.5rem' }}>PREVIEW</p>
          <div data-authored-visual style={{ background: bg, padding: '0.75rem', borderRadius: 6, border: '1px solid #e5e7eb' }}>
            <div style={{ color: pt, fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.3rem' }}>Dashboard</div>
            <div style={{ background: surf, borderRadius: 4, padding: '0.4rem 0.5rem', border: `1px solid ${div}`, marginBottom: '0.4rem' }}>
              <div style={{ color: pt, fontSize: '0.8rem' }}>Recent activity</div>
            </div>
            <hr style={{ borderColor: div, margin: '0.3rem 0' }} />
            <div style={{ display: 'flex', gap: '0.3rem', marginTop: '0.3rem' }}>
              {FIXED_ACTIONS.map(action => (
                <button
                  key={action.role}
                  style={{ background: action.background, color: action.foreground, border: 'none', borderRadius: 4, padding: '0.2rem 0.5rem', fontSize: '0.75rem', cursor: 'default' }}
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Checks */}
        <div style={{ flex: '0 0 190px' }}>
          <p style={{ fontSize: '0.75rem', fontFamily: 'var(--font-sans)', color: 'var(--muted)', marginBottom: '0.5rem' }}>CHECKS</p>
          {[
            { label: 'Primary text / page background (4.5:1)', pass: pageTextOk, ratio: pageTextContrast },
            { label: 'Primary text / card surface (4.5:1)', pass: cardTextOk, ratio: cardTextContrast },
            { label: 'Page / surface (target 1.2:1)', pass: surfaceOk, ratio: surfaceContrast },
            ...actionChecks.map(action => ({
              label: `${action.label} text (4.5:1)`,
              pass: action.pass,
              ratio: action.ratio,
            })),
          ].map(({ label, pass, ratio }) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', padding: '0.2rem 0' }}>
              <span style={{ color: 'var(--primary-foreground)' }}>{label}</span>
              <span style={{ color: showResults ? (pass ? 'var(--accent-success)' : 'var(--accent-danger)') : 'var(--muted)', fontFamily: 'var(--font-mono)' }}>
                {showResults ? (pass ? '✓ ' : '✗ ') : ''}{formatContrastRatio(ratio)}:1
              </span>
            </div>
          ))}
          <div style={{ marginTop: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
              <span style={{ color: 'var(--primary-foreground)' }}>Brand pressure</span>
              <span style={{ color: showResults ? meterColor : 'var(--muted)', fontFamily: 'var(--font-mono)' }}>{showResults ? (pressureOk ? '✓ ' : '✗ ') : ''}{pressure}%</span>
            </div>
            <div style={{ background: 'var(--border)', borderRadius: 99, height: 6, marginTop: '0.25rem', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${Math.min(pressure, 100)}%`, background: showResults ? meterColor : 'var(--muted)', borderRadius: 99, transition: 'width 0.3s' }} />
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--muted)', marginTop: '0.2rem' }}>Activity target: under 40%</div>
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
