import { memo, useState } from 'react';
import { hslToHex, hexToRgb } from '../../utils/color.ts';
import { HUE_MAX, HueWheel } from './HueWheel.tsx';
import shellStyles from './ToolShell.module.css';

interface Target {
  label: string;
  h: number;
  s: number;
  l: number;
}

const TARGETS: Target[] = [
  { label: 'Muted teal surface', h: 180, s: 25, l: 70 },
  { label: 'Vivid coral accent', h: 12, s: 85, l: 55 },
  { label: 'Dark desaturated navy', h: 225, s: 30, l: 22 },
];

const TOLERANCE = 12;

function isClose(a: number, b: number, range: number): boolean {
  return Math.abs(a - b) <= range;
}

function hueClose(a: number, b: number, range: number): boolean {
  const d = Math.abs(a - b);
  return d <= range || 360 - d <= range;
}

interface HslPlaygroundToolProps {
  interactive?: boolean;
  onComplete?: () => void;
}

export const HslPlaygroundTool = memo(function HslPlaygroundTool({ interactive = false, onComplete }: HslPlaygroundToolProps) {
  const [h, setH] = useState(200);
  const [s, setS] = useState(50);
  const [l, setL] = useState(50);
  const [targetIdx, setTargetIdx] = useState(0);
  const [matched, setMatched] = useState<boolean[]>(TARGETS.map(() => false));
  const [completed, setCompleted] = useState(false);

  const hex = hslToHex(h, s, l);
  const rgb = hexToRgb(hex);
  const hslValue = `hsl(${h} ${s}% ${l}%)`;
  const rgbValue = `rgb(${rgb.r} ${rgb.g} ${rgb.b})`;
  const target = TARGETS[targetIdx];
  const targetHex = hslToHex(target.h, target.s, target.l);

  function checkMatch() {
    if (!interactive || completed) return;
    if (
      hueClose(h, target.h, TOLERANCE) &&
      isClose(s, target.s, TOLERANCE) &&
      isClose(l, target.l, TOLERANCE)
    ) {
      const next = [...matched];
      next[targetIdx] = true;
      setMatched(next);
      if (next.every(Boolean)) {
        setCompleted(true);
        onComplete?.();
      } else {
        const nextUnmatched = next.findIndex((m) => !m);
        if (nextUnmatched !== -1) setTargetIdx(nextUnmatched);
      }
    }
  }

  const allDone = matched.every(Boolean);

  return (
    <div className={shellStyles.shell}>
      <span className={shellStyles.toolLabel}>hsl playground</span>

      <div style={{ display: 'flex', gap: 'var(--spacing-lg)', flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <HueWheel
          hue={h}
          interactive={interactive && !allDone}
          onChange={setH}
        />
        <div style={{ flex: 1, minWidth: '180px' }}>
          {/* Current color display */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', alignItems: 'stretch' }}>
            <div style={{
              width: 80, minHeight: 80, borderRadius: 'var(--radius-md)',
              background: hex, border: '2px solid var(--border)',
            }} />
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', lineHeight: 1.7 }}>
              <div><span style={{ color: 'var(--muted)' }}>HSL</span> {hslValue}</div>
              <div><span style={{ color: 'var(--muted)' }}>HEX</span> {hex}</div>
              <div><span style={{ color: 'var(--muted)' }}>RGB</span> {rgbValue}</div>
            </div>
          </div>

          {/* Sliders */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1rem' }}>
            <label style={{ fontSize: '0.82rem' }}>
              Hue: {h}°
              <input type="range" min={0} max={HUE_MAX} value={h} disabled={!interactive || allDone}
                onChange={(e) => setH(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--yellow)' }}
                aria-label={`Hue: ${h} degrees`}
              />
            </label>
            <label style={{ fontSize: '0.82rem' }}>
              Saturation: {s}%
              <input type="range" min={0} max={100} value={s} disabled={!interactive || allDone}
                onChange={(e) => setS(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--yellow)' }}
                aria-label={`Saturation: ${s} percent`}
              />
            </label>
            <label style={{ fontSize: '0.82rem' }}>
              Lightness: {l}%
              <input type="range" min={0} max={100} value={l} disabled={!interactive || allDone}
                onChange={(e) => setL(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--yellow)' }}
                aria-label={`Lightness: ${l} percent`}
              />
            </label>
          </div>
        </div>
      </div>

      {/* Target area */}
      {interactive && !allDone && (
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '0.75rem' }}>
          <p style={{ fontSize: '0.82rem', color: 'var(--muted)', marginBottom: '0.5rem' }}>
            Target {targetIdx + 1}/{TARGETS.length}: <strong style={{ color: 'var(--primary-foreground)' }}>{target.label}</strong>
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <div style={{
              width: 48, height: 48, borderRadius: 'var(--radius-sm)',
              background: targetHex, border: '2px solid var(--border)',
            }} />
            <button onClick={checkMatch} style={{
              padding: '0.4rem 1rem', background: 'var(--yellow)', color: '#111',
              border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer',
              fontFamily: 'var(--font-mono)', fontSize: '0.82rem',
            }}>
              check match
            </button>
          </div>
          <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.5rem' }}>
            {TARGETS.map((t, i) => (
              <span key={t.label} style={{
                fontSize: '0.78rem', color: matched[i] ? 'var(--green)' : 'var(--muted)',
              }}>
                {matched[i] ? '✓' : '○'} {t.label}
              </span>
            ))}
          </div>
        </div>
      )}

      {allDone && (
        <p style={{ color: 'var(--green)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
          All three targets matched. The HSL, HEX, and RGB readouts describe the same final color.
        </p>
      )}
    </div>
  );
});
