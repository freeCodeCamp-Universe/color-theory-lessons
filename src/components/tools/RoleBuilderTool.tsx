import { memo, useState } from 'react';
import { hexToRgb, contrastRatioWcag, hexToHsl } from '../../utils/color.ts';
import shellStyles from './ToolShell.module.css';

interface RoleBuilderToolProps {
  interactive?: boolean;
  onComplete?: () => void;
}

type RoleKey = 'page-bg' | 'surface' | 'primary-text' | 'secondary-text' | 'action' | 'success' | 'warning' | 'error';

const DEFAULTS: Record<RoleKey, string> = {
  'page-bg': '#f9fafb',
  'surface': '#ffffff',
  'primary-text': '#111827',
  'secondary-text': '#9ca3af',
  'action': '#3b82f6',
  'success': '#22c55e',
  'warning': '#f59e0b',
  'error': '#ef4444',
};

const ROLE_LABELS: Record<RoleKey, string> = {
  'page-bg': 'page-bg',
  'surface': 'surface',
  'primary-text': 'primary-text',
  'secondary-text': 'secondary-text',
  'action': 'action',
  'success': 'success',
  'warning': 'warning',
  'error': 'error',
};

function getContrast(fg: string, bg: string): number {
  try { return contrastRatioWcag(hexToRgb(fg), hexToRgb(bg)); } catch { return 1; }
}

function isValidHex(h: string) { return /^#[0-9a-fA-F]{6}$/.test(h); }

function CheckRow({ label, pass, ratio }: { label: string; pass: boolean; ratio?: number }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', padding: '0.2rem 0' }}>
      <span style={{ color: 'var(--primary-foreground)' }}>{label}</span>
      <span style={{ color: pass ? '#22c55e' : '#ef4444', fontFamily: 'var(--font-mono)' }}>
        {pass ? '✓' : '✗'} {ratio !== undefined ? ratio.toFixed(1) + ':1' : ''}
      </span>
    </div>
  );
}

function validateRoles(roles: Record<RoleKey, string>) {
  const primaryContrast = getContrast(roles['primary-text'], roles['page-bg']);
  const secondaryContrast = getContrast(roles['secondary-text'], roles['surface']);
  const actionContrast = getContrast('#ffffff', roles['action']);

  const warnHue = isValidHex(roles.warning) ? hexToHsl(roles.warning).h : 0;
  const errHue = isValidHex(roles.error) ? hexToHsl(roles.error).h : 0;
  const hueDiff = Math.abs(warnHue - errHue);
  const hueDiffWrapped = Math.min(hueDiff, 360 - hueDiff);
  const statusDistinct = hueDiffWrapped >= 30;

  const primaryOk = primaryContrast >= 4.5;
  const secondaryOk = secondaryContrast >= 4.5;
  const actionOk = actionContrast >= 4.5;
  const allPass = primaryOk && secondaryOk && actionOk && statusDistinct;

  return { primaryContrast, secondaryContrast, actionContrast, primaryOk, secondaryOk, actionOk, statusDistinct, allPass };
}

export const RoleBuilderTool = memo(function RoleBuilderTool({ interactive = false, onComplete }: RoleBuilderToolProps) {
  const [roles, setRoles] = useState<Record<RoleKey, string>>(DEFAULTS);
  const [completed, setCompleted] = useState(false);

  function update(key: RoleKey, val: string) {
    if (!interactive) return;
    setRoles((prev) => {
      const next = { ...prev, [key]: val };
      if (!completed) {
        const metrics = validateRoles(next);
        if (metrics.allPass) {
          setCompleted(true);
          onComplete?.();
        }
      }
      return next;
    });
  }

  const { primaryContrast, secondaryContrast, actionContrast, primaryOk, secondaryOk, actionOk, statusDistinct } = validateRoles(roles);

  const bg = isValidHex(roles['page-bg']) ? roles['page-bg'] : '#f9fafb';
  const surf = isValidHex(roles['surface']) ? roles['surface'] : '#ffffff';
  const pt = isValidHex(roles['primary-text']) ? roles['primary-text'] : '#111827';
  const st = isValidHex(roles['secondary-text']) ? roles['secondary-text'] : '#9ca3af';
  const act = isValidHex(roles['action']) ? roles['action'] : '#3b82f6';
  const suc = isValidHex(roles['success']) ? roles['success'] : '#22c55e';
  const warn = isValidHex(roles['warning']) ? roles['warning'] : '#f59e0b';
  const err = isValidHex(roles['error']) ? roles['error'] : '#ef4444';

  return (
    <div className={shellStyles.shell}>
      <span className={shellStyles.toolLabel}>role builder</span>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        {/* Inputs */}
        <div style={{ flex: '0 0 220px' }}>
          <p style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--muted)', marginBottom: '0.5rem' }}>SEMANTIC ROLES</p>
          {(Object.keys(DEFAULTS) as RoleKey[]).map((roleKey) => {
            const val = roles[roleKey];
            return (
              <div key={roleKey} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.3rem' }}>
                <div style={{ width: 18, height: 18, borderRadius: 3, background: isValidHex(val) ? val : '#888', border: '1px solid var(--border)', flexShrink: 0 }} />
                <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--muted)', width: 110, flexShrink: 0 }}>{ROLE_LABELS[roleKey]}</span>
                <input
                  type="text"
                  value={val}
                  onChange={(e) => update(roleKey, e.target.value)}
                  disabled={!interactive}
                  maxLength={7}
                  style={{
                    fontFamily: 'var(--font-mono)', fontSize: '0.78rem',
                    background: 'var(--surface)', color: 'var(--primary-foreground)',
                    border: `1px solid ${isValidHex(val) ? 'var(--border)' : '#ef4444'}`,
                    borderRadius: 3, padding: '0.15rem 0.3rem', width: 90,
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* Preview */}
        <div style={{ flex: '1 1 200px', minWidth: 180 }}>
          <p style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--muted)', marginBottom: '0.5rem' }}>LIVE PREVIEW</p>
          <div style={{ background: bg, padding: '0.75rem', borderRadius: 6, border: '1px solid #e5e7eb' }}>
            <div style={{ background: surf, borderRadius: 4, padding: '0.5rem', marginBottom: '0.5rem', border: '1px solid #e5e7eb' }}>
              <div style={{ color: pt, fontWeight: 600, fontSize: '0.85rem' }}>Card Title</div>
              <div style={{ color: st, fontSize: '0.75rem' }}>Supporting information</div>
              <button style={{ marginTop: '0.4rem', background: act, color: '#fff', border: 'none', borderRadius: 4, padding: '0.2rem 0.5rem', fontSize: '0.75rem', cursor: 'default' }}>
                Action
              </button>
            </div>
            <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
              <span style={{ background: suc, color: '#fff', padding: '0.15rem 0.4rem', borderRadius: 99, fontSize: '0.7rem' }}>Success</span>
              <span style={{ background: warn, color: '#fff', padding: '0.15rem 0.4rem', borderRadius: 99, fontSize: '0.7rem' }}>Warning</span>
              <span style={{ background: err, color: '#fff', padding: '0.15rem 0.4rem', borderRadius: 99, fontSize: '0.7rem' }}>Error</span>
            </div>
          </div>
        </div>

        {/* Checks */}
        <div style={{ flex: '0 0 200px' }}>
          <p style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--muted)', marginBottom: '0.5rem' }}>VALIDATION</p>
          <CheckRow label="Primary text / page-bg" pass={primaryOk} ratio={primaryContrast} />
          <CheckRow label="Secondary text / surface" pass={secondaryOk} ratio={secondaryContrast} />
          <CheckRow label="White / action" pass={actionOk} ratio={actionContrast} />
          <CheckRow label="Warning ≠ Error (hue)" pass={statusDistinct} />
        </div>
      </div>

      {completed && (
        <p style={{ color: 'var(--accent-success)', fontSize: '0.85rem' }}>
          All validation checks pass.
        </p>
      )}
    </div>
  );
});
