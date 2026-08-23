import { memo, useState } from 'react';
import { contrastRatio, hexToRgb } from '../../utils/color.ts';
import shellStyles from './ToolShell.module.css';

const WHITE: ReturnType<typeof hexToRgb> = { r: 255, g: 255, b: 255 };
const THRESHOLD = 3;

interface Component {
  id: string;
  label: string;
  defaultColor: string;
  description: string;
  renderPreview: (color: string) => React.ReactNode;
}

const COMPONENTS: Component[] = [
  {
    id: 'input-border',
    label: 'Input border',
    defaultColor: '#e5e7eb',
    description: 'Input border against white.',
    renderPreview: (color) => (
      <input
        readOnly
        value="Enter email…"
        style={{
          padding: '0.4rem 0.6rem', fontSize: '0.8rem',
          border: `2px solid ${color}`, borderRadius: 4,
          background: '#ffffff', color: '#111', width: '100%',
          boxSizing: 'border-box',
        }}
      />
    ),
  },
  {
    id: 'icon-button',
    label: 'Icon button',
    defaultColor: '#9ca3af',
    description: 'Gear icon against white.',
    renderPreview: (color) => (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#ffffff', borderRadius: 4, width: 40, height: 40, border: '1px solid #f3f4f6' }}>
        <span style={{ fontSize: '1.2rem', color }}>⚙</span>
      </div>
    ),
  },
  {
    id: 'focus-ring',
    label: 'Focus ring',
    defaultColor: '#bfdbfe',
    description: 'Focus outline against white.',
    renderPreview: (color) => (
      <button
        style={{
          padding: '0.35rem 0.8rem', fontSize: '0.8rem',
          background: '#ffffff', color: '#111',
          border: '1px solid #d1d5db', borderRadius: 4,
          outline: `3px solid ${color}`, outlineOffset: 2,
          cursor: 'default',
        }}
      >
        Save
      </button>
    ),
  },
  {
    id: 'toggle',
    label: 'Toggle track',
    defaultColor: '#e5e7eb',
    description: 'Off-state toggle track against white.',
    renderPreview: (color) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <div style={{ width: 36, height: 20, borderRadius: 10, background: color, position: 'relative', border: '1px solid rgba(0,0,0,0.1)' }}>
          <div style={{ position: 'absolute', left: 2, top: 2, width: 16, height: 16, borderRadius: '50%', background: '#ffffff', boxShadow: '0 1px 2px rgba(0,0,0,0.2)' }} />
        </div>
        <span style={{ fontSize: '0.78rem', color: '#333' }}>Notifications off</span>
      </div>
    ),
  },
];

function isValidHex(hex: string): boolean {
  return /^#[0-9a-fA-F]{6}$/.test(hex);
}

function calcRatio(hex: string): number {
  try {
    return contrastRatio(hexToRgb(hex), WHITE);
  } catch {
    return 1;
  }
}

interface ComponentCheckerToolProps {
  interactive?: boolean;
  onComplete?: () => void;
}

export const ComponentCheckerTool = memo(function ComponentCheckerTool({ interactive = false, onComplete }: ComponentCheckerToolProps) {
  const [colors, setColors] = useState<Record<string, string>>(
    Object.fromEntries(COMPONENTS.map((c) => [c.id, c.defaultColor])),
  );
  const [passed, setPassed] = useState<Record<string, boolean>>({});
  const [completed, setCompleted] = useState(false);

  function handleChange(id: string, val: string) {
    if (!interactive) return;
    setColors((prev) => ({ ...prev, [id]: val }));
    if (isValidHex(val)) {
      const r = calcRatio(val);
      if (r >= THRESHOLD) {
        setPassed((prev) => {
          const next = { ...prev, [id]: true };
          const allPassed = COMPONENTS.every((c) => next[c.id]);
          if (allPassed && !completed) {
            setCompleted(true);
            onComplete?.();
          }
          return next;
        });
      } else {
        setPassed((prev) => ({ ...prev, [id]: false }));
      }
    }
  }

  const passedCount = Object.values(passed).filter(Boolean).length;

  return (
    <div className={shellStyles.shell}>
      <span className={shellStyles.toolLabel}>component visibility checker</span>

      {interactive && (
        <p style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>
          Adjust each component's color until it has at least 3:1 contrast against white. ({passedCount}/{COMPONENTS.length} passing)
        </p>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {COMPONENTS.map((comp) => {
          const color = colors[comp.id];
          const ratio = isValidHex(color) ? calcRatio(color) : 1;
          const pass = ratio >= THRESHOLD;

          return (
            <div
              key={comp.id}
              style={{
                border: `1px solid ${pass ? 'var(--accent-success)' : 'var(--border)'}`,
                borderRadius: 'var(--radius-md)',
                padding: '0.65rem',
                background: pass ? 'color-mix(in srgb, var(--accent-success) 6%, transparent)' : 'transparent',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--muted)', textTransform: 'uppercase' }}>
                  {comp.label}
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: pass ? 'var(--accent-success)' : 'var(--accent-danger)' }}>
                  {ratio.toFixed(2)}:1, {pass ? 'PASS' : 'FAIL'}
                </span>
              </div>

              {/* Preview on white */}
              <div style={{ background: '#ffffff', padding: '0.5rem', borderRadius: 'var(--radius-sm)', marginBottom: '0.4rem', border: '1px solid #f0f0f0' }}>
                {comp.renderPreview(isValidHex(color) ? color : comp.defaultColor)}
              </div>

              {interactive && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <div style={{ width: 20, height: 20, borderRadius: 3, background: isValidHex(color) ? color : '#ccc', border: '1px solid var(--border)', flexShrink: 0 }} />
                  <input
                    type="text"
                    value={color}
                    onChange={(e) => handleChange(comp.id, e.target.value)}
                    style={{
                      fontFamily: 'var(--font-mono)', fontSize: '0.78rem',
                      padding: '0.2rem 0.4rem', borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border)', background: 'var(--surface)',
                      color: 'var(--primary-foreground)', width: '7rem',
                    }}
                    aria-label={`${comp.label} hex color`}
                  />
                  <span style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>{comp.description}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {completed && (
        <p style={{ color: 'var(--accent-success)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
          ✓ All four components have at least 3:1 contrast against white.
        </p>
      )}
    </div>
  );
});
