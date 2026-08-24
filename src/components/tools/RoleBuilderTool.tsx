import { memo, useEffect, useRef, useState } from 'react';
import { hexToRgb, contrastRatioWcag, hexToHsl } from '../../utils/color.ts';
import shellStyles from './ToolShell.module.css';

interface RoleBuilderToolProps {
  interactive?: boolean;
  onComplete?: () => void;
}

type RoleKey = 'page-bg' | 'surface' | 'primary-text' | 'secondary-text' | 'action' | 'success' | 'warning' | 'error';

const STATUS_KEYS = ['success', 'warning', 'error'] as const satisfies readonly RoleKey[];
const TEXT_CONTRAST_MINIMUM = 4.5;
const AAA_CONTRAST_MINIMUM = 7;
const SURFACE_CONTRAST_MINIMUM = 1.5;
const STATUS_HUE_DIFFERENCE_MINIMUM = 30;
const STATUS_LUMINANCE_CONTRAST_MINIMUM = 1.5;

const DEFAULTS: Record<RoleKey, string> = {
  'page-bg': '#c4cbd4',
  'surface': '#ffffff',
  'primary-text': '#111827',
  'secondary-text': '#4b5563',
  'action': '#1e40af',
  'success': '#052e16',
  'warning': '#facc15',
  'error': '#991b1b',
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

function getReadableForeground(background: string) {
  const whiteContrast = getContrast('#ffffff', background);
  const blackContrast = getContrast('#000000', background);
  return whiteContrast >= blackContrast
    ? { color: '#ffffff', contrast: whiteContrast }
    : { color: '#000000', contrast: blackContrast };
}

function getHueDifference(first: string, second: string) {
  const firstHsl = hexToHsl(first);
  const secondHsl = hexToHsl(second);
  if (firstHsl.s === 0 || secondHsl.s === 0) return null;

  const difference = Math.abs(firstHsl.h - secondHsl.h);
  return Math.min(difference, 360 - difference);
}

function CheckRow({ label, pass, ratio }: { label: string; pass: boolean; ratio?: number }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', padding: '0.2rem 0' }}>
      <span style={{ color: 'var(--primary-foreground)' }}>{label}</span>
      <span style={{ color: pass ? '#22c55e' : '#ef4444', fontFamily: 'var(--font-mono)' }}>
        {pass ? '✓' : '✗'} {ratio !== undefined ? ratio.toFixed(2) + ':1' : ''}
      </span>
    </div>
  );
}

function validateRoles(roles: Record<RoleKey, string>) {
  const validRoles = (Object.keys(roles) as RoleKey[]).every((role) => isValidHex(roles[role]));
  const primaryContrast = getContrast(roles['primary-text'], roles['surface']);
  const secondaryContrast = getContrast(roles['secondary-text'], roles['surface']);
  const actionForeground = getReadableForeground(roles.action);
  const statusForegrounds = Object.fromEntries(
    STATUS_KEYS.map((role) => [role, getReadableForeground(roles[role])]),
  ) as Record<(typeof STATUS_KEYS)[number], ReturnType<typeof getReadableForeground>>;

  const statusPairs = STATUS_KEYS.flatMap((role, index) =>
    STATUS_KEYS.slice(index + 1).map((otherRole) => [role, otherRole] as const),
  );
  const statusesValid = STATUS_KEYS.every((role) => isValidHex(roles[role]));
  const statusHueDistinct = statusesValid && statusPairs.every(([first, second]) => {
    const difference = getHueDifference(roles[first], roles[second]);
    return difference !== null && difference >= STATUS_HUE_DIFFERENCE_MINIMUM;
  });
  const statusLuminanceContrasts = statusesValid
    ? statusPairs.map(([first, second]) => getContrast(roles[first], roles[second]))
    : [1];
  const minimumStatusLuminanceContrast = Math.min(...statusLuminanceContrasts);
  const statusLuminanceDistinct = minimumStatusLuminanceContrast >= STATUS_LUMINANCE_CONTRAST_MINIMUM;
  const surfaceContrast = getContrast(roles['page-bg'], roles.surface);

  const primaryOk = isValidHex(roles['primary-text']) && isValidHex(roles.surface)
    && primaryContrast >= TEXT_CONTRAST_MINIMUM;
  const secondaryOk = isValidHex(roles['secondary-text']) && isValidHex(roles.surface)
    && secondaryContrast >= TEXT_CONTRAST_MINIMUM;
  const actionOk = isValidHex(roles.action) && actionForeground.contrast >= AAA_CONTRAST_MINIMUM;
  const statusTextPasses = Object.fromEntries(
    STATUS_KEYS.map((role) => [
      role,
      isValidHex(roles[role]) && statusForegrounds[role].contrast >= AAA_CONTRAST_MINIMUM,
    ]),
  ) as Record<(typeof STATUS_KEYS)[number], boolean>;
  const statusTextOk = STATUS_KEYS.every((role) => statusTextPasses[role]);
  const surfaceHierarchyOk = isValidHex(roles['page-bg']) && isValidHex(roles.surface)
    && surfaceContrast >= SURFACE_CONTRAST_MINIMUM;
  const allPass = validRoles && primaryOk && secondaryOk && actionOk && statusTextOk
    && statusHueDistinct && statusLuminanceDistinct && surfaceHierarchyOk;

  return {
    validRoles,
    primaryContrast,
    secondaryContrast,
    actionForeground,
    statusForegrounds,
    statusTextPasses,
    surfaceContrast,
    minimumStatusLuminanceContrast,
    primaryOk,
    secondaryOk,
    actionOk,
    statusTextOk,
    statusHueDistinct,
    statusLuminanceDistinct,
    surfaceHierarchyOk,
    allPass,
  };
}

export const RoleBuilderTool = memo(function RoleBuilderTool({ interactive = false, onComplete }: RoleBuilderToolProps) {
  const [roles, setRoles] = useState<Record<RoleKey, string>>(DEFAULTS);
  const [hasInteracted, setHasInteracted] = useState(false);

  function update(key: RoleKey, val: string) {
    if (!interactive) return;
    setHasInteracted(true);
    setRoles((prev) => ({ ...prev, [key]: val }));
  }

  const metrics = validateRoles(roles);
  const completed = hasInteracted && metrics.allPass;
  const wasCompleted = useRef(false);

  useEffect(() => {
    if (completed && !wasCompleted.current) {
      onComplete?.();
    }
    wasCompleted.current = completed;
  }, [completed, onComplete]);

  const {
    validRoles,
    primaryContrast,
    secondaryContrast,
    actionForeground,
    statusForegrounds,
    statusTextPasses,
    surfaceContrast,
    minimumStatusLuminanceContrast,
    primaryOk,
    secondaryOk,
    actionOk,
    statusHueDistinct,
    statusLuminanceDistinct,
    surfaceHierarchyOk,
  } = metrics;

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
              <button style={{ marginTop: '0.4rem', background: act, color: actionForeground.color, border: 'none', borderRadius: 4, padding: '0.2rem 0.5rem', fontSize: '0.75rem', cursor: 'default' }}>
                Action
              </button>
            </div>
            <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
              <span style={{ background: suc, color: statusForegrounds.success.color, padding: '0.15rem 0.4rem', borderRadius: 99, fontSize: '0.7rem' }}><span aria-hidden="true">✓ </span>Success</span>
              <span style={{ background: warn, color: statusForegrounds.warning.color, padding: '0.15rem 0.4rem', borderRadius: 99, fontSize: '0.7rem' }}><span aria-hidden="true">⚠ </span>Warning</span>
              <span style={{ background: err, color: statusForegrounds.error.color, padding: '0.15rem 0.4rem', borderRadius: 99, fontSize: '0.7rem' }}><span aria-hidden="true">✕ </span>Error</span>
            </div>
          </div>
        </div>

        {/* Checks */}
        <div style={{ flex: '0 0 200px' }}>
          <p style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--muted)', marginBottom: '0.5rem' }}>VALIDATION</p>
          <CheckRow label="Valid role colors" pass={validRoles} />
          <CheckRow label="Primary text / surface" pass={primaryOk} ratio={primaryContrast} />
          <CheckRow label="Secondary text / surface" pass={secondaryOk} ratio={secondaryContrast} />
          <CheckRow label="Action text AAA" pass={actionOk} ratio={actionForeground.contrast} />
          <CheckRow label="Success text AAA" pass={statusTextPasses.success} ratio={statusForegrounds.success.contrast} />
          <CheckRow label="Warning text AAA" pass={statusTextPasses.warning} ratio={statusForegrounds.warning.contrast} />
          <CheckRow label="Error text AAA" pass={statusTextPasses.error} ratio={statusForegrounds.error.contrast} />
          <CheckRow label="Page / surface ≥ 1.5:1" pass={surfaceHierarchyOk} ratio={surfaceContrast} />
          <CheckRow label="Status hues ≥ 30° apart" pass={statusHueDistinct} />
          <CheckRow label="Status luminance ≥ 1.5:1" pass={statusLuminanceDistinct} ratio={minimumStatusLuminanceContrast} />
        </div>
      </div>

      {completed && (
        <p style={{ color: 'var(--accent-success)', fontSize: '0.85rem' }}>
          All color-role checks pass. The preview keeps labels and icons so meaning never depends on color alone.
        </p>
      )}
    </div>
  );
});
