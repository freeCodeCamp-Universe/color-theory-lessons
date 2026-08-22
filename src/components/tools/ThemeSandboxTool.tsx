import { memo, useState } from 'react';
import { hexToRgb, contrastRatioWcag } from '../../utils/color.ts';
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

interface ThemeSandboxToolProps {
  interactive?: boolean;
  onComplete?: () => void;
}

export const ThemeSandboxTool = memo(function ThemeSandboxTool({ interactive = false, onComplete }: ThemeSandboxToolProps) {
  const [colors, setColors] = useState<Record<string, string>>(
    Object.fromEntries(ROLES.map((r) => [r.key, r.defaultValue]))
  );
  const [gradStart, setGradStart] = useState(GRADIENT_DEFAULTS.start);
  const [gradEnd, setGradEnd] = useState(GRADIENT_DEFAULTS.end);
  const [completed, setCompleted] = useState(false);

  function setColor(key: string, value: string) {
    setColors((prev) => ({ ...prev, [key]: value }));
  }

  function checkTheme() {
    if (!interactive || completed) return;
    if (allPass) {
      setCompleted(true);
      onComplete?.();
    }
  }

  const bgRgb = hexToRgb(colors.bg);
  const surfRgb = hexToRgb(colors.surface);
  const textPriRgb = hexToRgb(colors.textPri);
  const textSecRgb = hexToRgb(colors.textSec);
  const priOnBg = contrastRatioWcag(textPriRgb, bgRgb);
  const priOnSurf = contrastRatioWcag(textPriRgb, surfRgb);
  const secOnSurf = contrastRatioWcag(textSecRgb, surfRgb);
  const allPass = priOnBg >= TEXT_CONTRAST_TARGET
    && priOnSurf >= TEXT_CONTRAST_TARGET
    && secOnSurf >= TEXT_CONTRAST_TARGET;

  return (
    <div className={shellStyles.shell}>
      <span className={shellStyles.toolLabel}>theme sandbox</span>

      {/* Live preview */}
      <div style={{
        background: colors.bg, borderRadius: 'var(--radius-md)', padding: '0.75rem',
        border: `1px solid ${colors.border}`, marginBottom: '0.75rem',
      }}>
        {/* Hero gradient */}
        <div style={{
          background: `linear-gradient(135deg, ${gradStart}, ${gradEnd})`,
          borderRadius: 'var(--radius-sm)', padding: '1rem', marginBottom: '0.6rem',
        }}>
          <span style={{ color: '#fff', fontFamily: 'var(--font-mono)', fontSize: '0.82rem' }}>
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
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.35rem 0.75rem', marginBottom: '0.6rem' }}>
        {ROLES.map((role) => (
          <label key={role.key} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem' }}>
            <input type="color" value={colors[role.key]}
              disabled={!interactive || completed}
              onChange={(e) => setColor(role.key, e.target.value)}
              style={{ width: 24, height: 24, border: 'none', padding: 0, cursor: interactive ? 'pointer' : 'default' }}
              aria-label={role.label}
            />
            <span style={{ color: 'var(--muted)' }}>{role.label}</span>
          </label>
        ))}
      </div>

      {/* Gradient editors */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.6rem', alignItems: 'center' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.78rem' }}>
          <input type="color" value={gradStart} disabled={!interactive || completed}
            onChange={(e) => setGradStart(e.target.value)}
            style={{ width: 24, height: 24, border: 'none', padding: 0 }}
            aria-label="Gradient start"
          />
          <span style={{ color: 'var(--muted)' }}>Gradient start</span>
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.78rem' }}>
          <input type="color" value={gradEnd} disabled={!interactive || completed}
            onChange={(e) => setGradEnd(e.target.value)}
            style={{ width: 24, height: 24, border: 'none', padding: 0 }}
            aria-label="Gradient end"
          />
          <span style={{ color: 'var(--muted)' }}>Gradient end</span>
        </label>
      </div>

      {/* Contrast readout */}
      <div style={{ fontSize: '0.78rem', fontFamily: 'var(--font-mono)', marginBottom: '0.5rem' }}>
        <div style={{ color: priOnBg >= TEXT_CONTRAST_TARGET ? 'var(--green)' : 'var(--red)' }}>
          {priOnBg >= TEXT_CONTRAST_TARGET ? '✓' : '✗'} Primary text on background: {priOnBg.toFixed(1)}:1 (target: 4.5:1)
        </div>
        <div style={{ color: priOnSurf >= TEXT_CONTRAST_TARGET ? 'var(--green)' : 'var(--red)' }}>
          {priOnSurf >= TEXT_CONTRAST_TARGET ? '✓' : '✗'} Primary text on surface: {priOnSurf.toFixed(1)}:1 (target: 4.5:1)
        </div>
        <div style={{ color: secOnSurf >= TEXT_CONTRAST_TARGET ? 'var(--green)' : 'var(--red)' }}>
          {secOnSurf >= TEXT_CONTRAST_TARGET ? '✓' : '✗'} Secondary text on surface: {secOnSurf.toFixed(1)}:1 (target: 4.5:1)
        </div>
      </div>

      {interactive && !completed && (
        <button onClick={checkTheme} disabled={!allPass} style={{
          padding: '0.4rem 1rem', background: allPass ? 'var(--yellow)' : 'var(--surface)',
          color: allPass ? '#111' : 'var(--muted)',
          border: 'none', borderRadius: 'var(--radius-sm)',
          cursor: allPass ? 'pointer' : 'not-allowed',
          fontFamily: 'var(--font-mono)', fontSize: '0.82rem',
        }}>
          {allPass ? 'submit theme' : 'meet contrast targets to submit'}
        </button>
      )}

      {completed && (
        <p style={{ color: 'var(--green)', fontSize: '0.85rem' }}>
          Theme complete. The checked text pairs meet their contrast targets.
        </p>
      )}
    </div>
  );
});
