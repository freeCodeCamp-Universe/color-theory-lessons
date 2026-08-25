import { memo, useState } from 'react';
import shellStyles from './ToolShell.module.css';
import {
  FIXED_ACTIONS,
  getBrandPressureStatus,
  type RoleKey,
} from './brand-pressure-validation.ts';

interface BrandPressureToolProps {
  interactive?: boolean;
  onComplete?: () => void;
}

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

function isValidHex(h: string) { return /^#[0-9a-fA-F]{6}$/.test(h); }

function formatContrastRatio(ratio: number): string {
  return (Math.floor(ratio * 10) / 10).toFixed(1);
}

export const BrandPressureTool = memo(function BrandPressureTool({ interactive = false, onComplete }: BrandPressureToolProps) {
  const defaults = interactive ? INTERACTIVE_DEFAULTS : NON_INTERACTIVE_DEFAULTS;
  const [roles, setRoles] = useState<Record<RoleKey, string>>(defaults);
  const [completed, setCompleted] = useState(false);

  function update(key: RoleKey, val: string) {
    if (!interactive) return;
    setRoles(prev => ({ ...prev, [key]: val }));
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

  if (interactive && allPass && !completed) {
    setCompleted(true);
    onComplete?.();
  }

  const bg = isValidHex(roles['page-bg']) ? roles['page-bg'] : '#f8f7ff';
  const surf = isValidHex(roles['surface']) ? roles['surface'] : '#ede9fe';
  const pt = isValidHex(roles['primary-text']) ? roles['primary-text'] : '#1c1917';
  const div = isValidHex(roles['neutral-divider']) ? roles['neutral-divider'] : '#e2e8f0';

  const meterColor = pressure < 40 ? '#22c55e' : pressure < 60 ? '#f59e0b' : '#ef4444';

  return (
    <div className={shellStyles.shell}>
      <span className={shellStyles.toolLabel}>brand pressure</span>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        {/* Inputs */}
        <div style={{ flex: '0 0 220px' }}>
          <p style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--muted)', marginBottom: '0.5rem' }}>ROLES</p>

          {/* Read-only brand roles */}
          {FIXED_ACTIONS.map(action => (
            <div key={action.role} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.3rem', opacity: 0.7 }}>
              <div style={{ width: 18, height: 18, borderRadius: 3, background: action.background, border: '1px solid var(--border)', flexShrink: 0 }} />
              <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--muted)', width: 110, flexShrink: 0 }}>{action.role} (fixed)</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--primary-foreground)' }}>{action.background}</span>
            </div>
          ))}

          <div style={{ borderTop: '1px solid var(--border)', margin: '0.4rem 0' }} />

          {(Object.keys(defaults) as RoleKey[]).map(key => {
            const val = roles[key];
            return (
              <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.3rem' }}>
                <div style={{ width: 18, height: 18, borderRadius: 3, background: isValidHex(val) ? val : '#888', border: '1px solid var(--border)', flexShrink: 0 }} />
                <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--muted)', width: 110, flexShrink: 0 }}>{key}</span>
                <input
                  type="text"
                  value={val}
                  onChange={e => update(key, e.target.value)}
                  disabled={!interactive}
                  maxLength={7}
                  style={{
                    fontFamily: 'var(--font-mono)', fontSize: '0.78rem',
                    background: 'var(--surface, #1e293b)', color: 'var(--primary-foreground)',
                    border: `1px solid ${isValidHex(val) ? 'var(--border)' : '#ef4444'}`,
                    borderRadius: 3, padding: '0.15rem 0.3rem', width: 90,
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* Preview */}
        <div style={{ flex: '1 1 180px', minWidth: 160 }}>
          <p style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--muted)', marginBottom: '0.5rem' }}>PREVIEW</p>
          <div style={{ background: bg, padding: '0.75rem', borderRadius: 6, border: '1px solid #e5e7eb' }}>
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
          <p style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--muted)', marginBottom: '0.5rem' }}>CHECKS</p>
          {[
            { label: 'Primary text / page background (4.5:1)', pass: pageTextOk, ratio: pageTextContrast },
            { label: 'Primary text / card surface (4.5:1)', pass: cardTextOk, ratio: cardTextContrast },
            { label: 'Page/surface separation', pass: surfaceOk, ratio: surfaceContrast },
            ...actionChecks.map(action => ({
              label: `${action.label} text (4.5:1)`,
              pass: action.pass,
              ratio: action.ratio,
            })),
          ].map(({ label, pass, ratio }) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', padding: '0.2rem 0' }}>
              <span style={{ color: 'var(--primary-foreground)' }}>{label}</span>
              <span style={{ color: pass ? '#22c55e' : '#ef4444', fontFamily: 'var(--font-mono)' }}>
                {pass ? '✓' : '✗'} {formatContrastRatio(ratio)}:1
              </span>
            </div>
          ))}
          <div style={{ marginTop: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
              <span style={{ color: 'var(--primary-foreground)' }}>Brand pressure</span>
              <span style={{ color: meterColor, fontFamily: 'var(--font-mono)' }}>{pressureOk ? '✓' : '✗'} {pressure}%</span>
            </div>
            <div style={{ background: 'var(--border)', borderRadius: 99, height: 6, marginTop: '0.25rem', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${Math.min(pressure, 100)}%`, background: meterColor, borderRadius: 99, transition: 'width 0.3s' }} />
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--muted)', marginTop: '0.2rem' }}>Target: &lt; 40%</div>
          </div>
        </div>
      </div>

      {completed && (
        <p style={{ color: 'var(--accent-success)', fontSize: '0.85rem' }}>
          Brand is present but not overwhelming. Neutrals carry the structural weight.
        </p>
      )}
    </div>
  );
});
