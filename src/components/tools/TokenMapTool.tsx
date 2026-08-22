import { memo, useState } from 'react';
import { hslToHex, hexToHsl } from '../../utils/color.ts';
import shellStyles from './ToolShell.module.css';

interface TokenRole {
  name: string;
  hueOffset: number;
  satMult: number;
  lightness: number;
}

const ROLES: TokenRole[] = [
  { name: '--color-text-primary',   hueOffset: 0,   satMult: 0.15, lightness: 90 },
  { name: '--color-surface',        hueOffset: 0,   satMult: 0.3,  lightness: 15 },
  { name: '--color-border',         hueOffset: 0,   satMult: 0.2,  lightness: 30 },
  { name: '--color-action-primary', hueOffset: 0,   satMult: 1.0,  lightness: 55 },
  { name: '--color-success-bg',     hueOffset: 120, satMult: 0.7,  lightness: 40 },
  { name: '--color-error-bg',       hueOffset: 240, satMult: 0.8,  lightness: 45 },
];

function deriveColor(baseH: number, baseS: number, role: TokenRole): string {
  const h = (baseH + role.hueOffset) % 360;
  const s = Math.min(100, Math.round(baseS * role.satMult));
  return hslToHex(h, s, role.lightness);
}

// Sort challenge items
interface SortItem {
  label: string;
  category: 'raw' | 'palette' | 'role';
}

const SORT_ITEMS: SortItem[] = [
  { label: '#0B57D0',               category: 'raw' },
  { label: 'rgb(34 34 34)',         category: 'raw' },
  { label: '--blue-600',            category: 'palette' },
  { label: '--gray-900',            category: 'palette' },
  { label: '--color-text-primary',  category: 'role' },
  { label: '--color-success-bg',    category: 'role' },
  { label: '--color-action-primary', category: 'role' },
  { label: '#1a1a1a',               category: 'raw' },
  { label: '--green-500',           category: 'palette' },
];

interface TokenMapToolProps {
  interactive?: boolean;
  onComplete?: () => void;
}

export const TokenMapTool = memo(function TokenMapTool({ interactive = false, onComplete }: TokenMapToolProps) {
  const [baseHue, setBaseHue] = useState(220);
  const [baseSat, setBaseSat] = useState(70);
  const [sortAnswers, setSortAnswers] = useState<Record<string, string>>({});
  const [sortChecked, setSortChecked] = useState(false);
  const [completed, setCompleted] = useState(false);

  const derived = ROLES.map((r) => ({
    ...r,
    color: deriveColor(baseHue, baseSat, r),
  }));

  // Check if the base hue produces a readable system: action not too close to error
  const actionHsl = hexToHsl(derived.find((d) => d.name === '--color-action-primary')!.color);
  const errorHsl = hexToHsl(derived.find((d) => d.name === '--color-error-bg')!.color);
  const hueDiff = Math.abs(actionHsl.h - errorHsl.h);
  const hueOk = hueDiff > 30 && hueDiff < 330;

  function checkSort() {
    if (!interactive || completed) return;
    setSortChecked(true);
    const allCorrect = SORT_ITEMS.every((item) => sortAnswers[item.label] === item.category);
    if (allCorrect && hueOk) {
      setCompleted(true);
      onComplete?.();
    }
  }

  const sortCorrectCount = SORT_ITEMS.filter((item) => sortAnswers[item.label] === item.category).length;

  return (
    <div className={shellStyles.shell}>
      <span className={shellStyles.toolLabel}>token map</span>

      {/* Base controls */}
      <div style={{ marginBottom: '0.75rem' }}>
        <label style={{ fontSize: '0.82rem', display: 'block', marginBottom: '0.3rem' }}>
          Base hue: {baseHue}°
          <input type="range" min={0} max={360} value={baseHue}
            disabled={!interactive || completed}
            onChange={(e) => setBaseHue(Number(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--yellow)' }}
            aria-label={`Base hue: ${baseHue} degrees`}
          />
        </label>
        <label style={{ fontSize: '0.82rem', display: 'block' }}>
          Base saturation: {baseSat}%
          <input type="range" min={0} max={100} value={baseSat}
            disabled={!interactive || completed}
            onChange={(e) => setBaseSat(Number(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--yellow)' }}
            aria-label={`Base saturation: ${baseSat} percent`}
          />
        </label>
      </div>

      {/* Derived token preview */}
      <div style={{ marginBottom: '0.75rem' }}>
        <p style={{ fontSize: '0.78rem', color: 'var(--muted)', marginBottom: '0.3rem' }}>Derived role colors:</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          {derived.map((d) => (
            <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{
                width: 20, height: 20, borderRadius: 3,
                background: d.color, border: '1px solid var(--border)',
                flexShrink: 0,
              }} />
              <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--primary-foreground)' }}>
                {d.name}
              </span>
              <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--muted)' }}>
                {d.color}
              </span>
            </div>
          ))}
        </div>
        {interactive && !hueOk && (
          <p style={{ fontSize: '0.78rem', color: 'var(--red)', marginTop: '0.3rem' }}>
            Action and error hues are too similar. Adjust the base hue so they are distinct.
          </p>
        )}
      </div>

      {/* Mini interface preview */}
      <div style={{
        background: derived.find((d) => d.name === '--color-surface')!.color,
        border: `1px solid ${derived.find((d) => d.name === '--color-border')!.color}`,
        borderRadius: 'var(--radius-sm)', padding: '0.6rem', marginBottom: '0.75rem',
      }}>
        <p style={{
          color: derived.find((d) => d.name === '--color-text-primary')!.color,
          fontSize: '0.82rem', margin: '0 0 0.4rem',
        }}>
          Sample card text
        </p>
        <div style={{ display: 'flex', gap: '0.3rem' }}>
          <span style={{
            padding: '0.2rem 0.4rem', borderRadius: 3, fontSize: '0.7rem',
            background: derived.find((d) => d.name === '--color-action-primary')!.color,
            color: '#fff', fontFamily: 'var(--font-mono)',
          }}>Action</span>
          <span style={{
            padding: '0.2rem 0.4rem', borderRadius: 3, fontSize: '0.7rem',
            background: derived.find((d) => d.name === '--color-success-bg')!.color,
            color: '#fff', fontFamily: 'var(--font-mono)',
          }}>Success</span>
          <span style={{
            padding: '0.2rem 0.4rem', borderRadius: 3, fontSize: '0.7rem',
            background: derived.find((d) => d.name === '--color-error-bg')!.color,
            color: '#fff', fontFamily: 'var(--font-mono)',
          }}>Error</span>
        </div>
      </div>

      {/* Sort activity */}
      {interactive && (
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '0.6rem' }}>
          <p style={{ fontSize: '0.82rem', color: 'var(--muted)', marginBottom: '0.4rem' }}>
            Classify each item as a raw value, palette token name, or role token name:
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', marginBottom: '0.5rem' }}>
            {SORT_ITEMS.map((item) => {
              const answer = sortAnswers[item.label] ?? '';
              const isWrong = sortChecked && answer !== item.category;
              return (
                <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <code style={{
                    fontSize: '0.75rem', minWidth: 180,
                    color: isWrong ? 'var(--red)' : 'var(--primary-foreground)',
                  }}>
                    {item.label}
                  </code>
                  <select
                    value={answer}
                    disabled={completed}
                    onChange={(e) => setSortAnswers((prev) => ({ ...prev, [item.label]: e.target.value }))}
                    style={{
                      fontSize: '0.75rem', fontFamily: 'var(--font-mono)',
                      background: 'var(--surface)', color: 'var(--primary-foreground)',
                      border: `1px solid ${isWrong ? 'var(--red)' : 'var(--border)'}`,
                      borderRadius: 'var(--radius-sm)', padding: '0.2rem 0.3rem',
                    }}
                    aria-label={`Category for ${item.label}`}
                  >
                    <option value="">choose category</option>
                    <option value="raw">raw value</option>
                    <option value="palette">palette token name</option>
                    <option value="role">role token name</option>
                  </select>
                </div>
              );
            })}
          </div>

          {!completed && (
            <button onClick={checkSort} style={{
              padding: '0.4rem 1rem', background: 'var(--yellow)', color: '#111',
              border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer',
              fontFamily: 'var(--font-mono)', fontSize: '0.82rem',
            }}>
              check ({sortCorrectCount}/{SORT_ITEMS.length} correct)
            </button>
          )}

          {sortChecked && !completed && (
            <p style={{ fontSize: '0.78rem', color: 'var(--red)', marginTop: '0.3rem' }}>
              {!hueOk ? 'Adjust the base hue so action and error are distinct. ' : ''}
              {sortCorrectCount < SORT_ITEMS.length ? 'Some items are miscategorized.' : ''}
            </p>
          )}
        </div>
      )}

      {completed && (
        <p style={{ color: 'var(--green)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
          Token map complete. One base change updated every derived role color.
        </p>
      )}
    </div>
  );
});
