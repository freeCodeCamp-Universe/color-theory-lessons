import { memo, useState } from 'react';
import { hexToRgb, contrastRatioWcag } from '../../utils/color.ts';
import shellStyles from './ToolShell.module.css';

interface BrandPressureToolProps {
  interactive?: boolean;
  onComplete?: () => void;
}

const BRAND = '#7c3aed';
const SECONDARY_ACTION = '#a78bfa';

type RoleKey = 'page-bg' | 'surface' | 'primary-text' | 'neutral-divider';

const ROLE_LABELS: Record<RoleKey, string> = {
  'page-bg': 'Page background',
  'surface': 'Card surface',
  'primary-text': 'Primary text',
  'neutral-divider': 'Divider',
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

function getContrast(fg: string, bg: string): number {
  try { return contrastRatioWcag(hexToRgb(fg), hexToRgb(bg)); } catch { return 1; }
}

function isValidHex(h: string) { return /^#[0-9a-fA-F]{6}$/.test(h); }

function brandPressurePercent(roles: Record<RoleKey, string>): number {
  let count = 0;
  const brandHue = 262;
  for (const val of Object.values(roles)) {
    if (!isValidHex(val)) continue;
    try {
      const rgb = hexToRgb(val);
      const r = rgb.r / 255, g = rgb.g / 255, b = rgb.b / 255;
      const max = Math.max(r, g, b), min = Math.min(r, g, b);
      if (max === min) continue;
      let h = 0;
      if (max === r) h = ((g - b) / (max - min)) * 60;
      else if (max === g) h = (2 + (b - r) / (max - min)) * 60;
      else h = (4 + (r - g) / (max - min)) * 60;
      if (h < 0) h += 360;
      const diff = Math.abs(h - brandHue);
      const wrapped = Math.min(diff, 360 - diff);
      const s = (max - min) / max;
      if (wrapped < 50 && s > 0.3) count++;
    } catch { /* skip */ }
  }
  // count is out of 4 editable roles + 2 read-only = 6 total visual areas
  const total = 6;
  const brandCount = count + 2; // action and secondary_action always brand
  return Math.round((brandCount / total) * 100);
}

export const BrandPressureTool = memo(function BrandPressureTool({ interactive = false, onComplete }: BrandPressureToolProps) {
  const defaults = interactive ? INTERACTIVE_DEFAULTS : NON_INTERACTIVE_DEFAULTS;
  const [roles, setRoles] = useState<Record<RoleKey, string>>(defaults);
  const [completed, setCompleted] = useState(false);

  function update(key: RoleKey, val: string) {
    if (!interactive) return;
    setRoles(prev => ({ ...prev, [key]: val }));
  }

  const textContrast = getContrast(roles['primary-text'], roles['page-bg']);
  const surfaceContrast = getContrast(roles['surface'], roles['page-bg']);
  const pressure = brandPressurePercent(roles);

  const textOk = textContrast >= 4.5;
  const surfaceOk = surfaceContrast >= 1.2;
  const pressureOk = pressure < 40;
  const allPass = textOk && surfaceOk && pressureOk;

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
          {[['Primary action', BRAND], ['Secondary action', SECONDARY_ACTION]].map(([label, val]) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.3rem', opacity: 0.7 }}>
              <div style={{ width: 18, height: 18, borderRadius: 3, background: val, border: '1px solid var(--border)', flexShrink: 0 }} />
              <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--muted)', width: 110, flexShrink: 0 }}>{label} (fixed)</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--primary-foreground)' }}>{val}</span>
            </div>
          ))}

          <div style={{ borderTop: '1px solid var(--border)', margin: '0.4rem 0' }} />

          {(Object.keys(defaults) as RoleKey[]).map(key => {
            const val = roles[key];
            return (
              <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.3rem' }}>
                <div style={{ width: 18, height: 18, borderRadius: 3, background: isValidHex(val) ? val : '#888', border: '1px solid var(--border)', flexShrink: 0 }} />
                <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--muted)', width: 110, flexShrink: 0 }}>{ROLE_LABELS[key]}</span>
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
              <button style={{ background: BRAND, color: '#fff', border: 'none', borderRadius: 4, padding: '0.2rem 0.5rem', fontSize: '0.75rem', cursor: 'default' }}>
                Save
              </button>
              <button style={{ background: SECONDARY_ACTION, color: '#fff', border: 'none', borderRadius: 4, padding: '0.2rem 0.5rem', fontSize: '0.75rem', cursor: 'default' }}>
                Cancel
              </button>
            </div>
          </div>
        </div>

        {/* Checks */}
        <div style={{ flex: '0 0 190px' }}>
          <p style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--muted)', marginBottom: '0.5rem' }}>CHECKS</p>
          {[
            { label: 'Text contrast (4.5:1)', pass: textOk, ratio: textContrast },
            { label: 'Page / surface (target 1.2:1)', pass: surfaceOk, ratio: surfaceContrast },
          ].map(({ label, pass, ratio }) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', padding: '0.2rem 0' }}>
              <span style={{ color: 'var(--primary-foreground)' }}>{label}</span>
              <span style={{ color: pass ? '#22c55e' : '#ef4444', fontFamily: 'var(--font-mono)' }}>
                {pass ? '✓' : '✗'} {ratio.toFixed(1)}:1
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
            <div style={{ fontSize: '0.7rem', color: 'var(--muted)', marginTop: '0.2rem' }}>Activity target: under 40%</div>
          </div>
        </div>
      </div>

      {completed && (
        <p style={{ color: 'var(--accent-success)', fontSize: '0.85rem' }}>
          The two brand actions remain prominent while neutral supporting roles define the page structure.
        </p>
      )}
    </div>
  );
});
