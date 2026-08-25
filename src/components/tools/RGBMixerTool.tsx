import { memo, useState, useEffect, useRef } from 'react';
import shellStyles from './ToolShell.module.css';

interface RGB { r: number; g: number; b: number }

interface Target {
  name: string;
  value: RGB;
}

const TARGETS: Target[] = [
  { name: 'warm pink accent', value: { r: 220, g: 45, b: 110 } },
  { name: 'pale sky blue', value: { r: 155, g: 195, b: 230 } },
  { name: 'soft gray surface', value: { r: 115, g: 115, b: 122 } },
  { name: 'warning yellow', value: { r: 240, g: 195, b: 10 } },
  { name: 'dark navy panel', value: { r: 18, g: 28, b: 72 } },
];

const TOLERANCE = 22;

function rgbString({ r, g, b }: RGB) {
  return `rgb(${r}, ${g}, ${b})`;
}

function isMatch(a: RGB, b: RGB) {
  return (
    Math.abs(a.r - b.r) <= TOLERANCE &&
    Math.abs(a.g - b.g) <= TOLERANCE &&
    Math.abs(a.b - b.b) <= TOLERANCE
  );
}

const CHANNEL_META = [
  { key: 'r' as const, label: 'Red',   color: '#e03030' },
  { key: 'g' as const, label: 'Green', color: '#22c55e' },
  { key: 'b' as const, label: 'Blue',  color: '#3b82f6' },
];

interface RGBMixerToolProps {
  interactive?: boolean;
  onComplete?: () => void;
  previewMode?: 'extremes' | 'channel-pairs' | 'neutral-grays';
}

export const RGBMixerTool = memo(function RGBMixerTool({ interactive = true, onComplete, previewMode }: RGBMixerToolProps) {
  const [targetIdx, setTargetIdx] = useState(0);
  const [current, setCurrent] = useState<RGB>({ r: 0, g: 0, b: 0 });
  const [checked, setChecked] = useState(false);
  const [allDone, setAllDone] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timerRef.current !== null) clearTimeout(timerRef.current); }, []);

  const target = TARGETS[targetIdx];
  const close = isMatch(current, target.value);

  function updateChannel(ch: keyof RGB, val: number) {
    if (checked || !interactive) return;
    setCurrent((prev) => ({ ...prev, [ch]: val }));
  }

  function handleCheck() {
    setChecked(true);
    if (close) {
      timerRef.current = setTimeout(() => {
        if (targetIdx < TARGETS.length - 1) {
          const next = targetIdx + 1;
          setTargetIdx(next);
          setCurrent({ r: 0, g: 0, b: 0 });
          setChecked(false);
        } else {
          setAllDone(true);
          onComplete?.();
        }
      }, 900);
    }
  }

  function handleRetry() {
    setCurrent({ r: 0, g: 0, b: 0 });
    setChecked(false);
  }

  if (previewMode) {
    type Swatch = { label: string; rgb: RGB; caption: string };
    const PREVIEW_SWATCHES: Record<string, Swatch[]> = {
      extremes: [
        { label: 'black', rgb: { r: 0, g: 0, b: 0 }, caption: 'rgb(0 0 0): all channels off' },
        { label: 'white', rgb: { r: 255, g: 255, b: 255 }, caption: 'rgb(255 255 255): all channels full' },
      ],
      'channel-pairs': [
        { label: 'yellow', rgb: { r: 255, g: 255, b: 0 }, caption: 'red + green = yellow' },
        { label: 'cyan', rgb: { r: 0, g: 255, b: 255 }, caption: 'green + blue = cyan' },
        { label: 'magenta', rgb: { r: 255, g: 0, b: 255 }, caption: 'red + blue = magenta' },
      ],
      'neutral-grays': [
        { label: 'dark gray', rgb: { r: 64, g: 64, b: 64 }, caption: 'rgb(64 64 64)' },
        { label: 'mid gray', rgb: { r: 128, g: 128, b: 128 }, caption: 'rgb(128 128 128)' },
        { label: 'light gray', rgb: { r: 210, g: 210, b: 210 }, caption: 'rgb(210 210 210)' },
      ],
    };
    const swatches = PREVIEW_SWATCHES[previewMode];
    return (
      <div className={shellStyles.shell}>
        <span className={shellStyles.toolLabel}>RGB light mixer</span>
        <div style={{ display: 'flex', gap: 'var(--spacing-md)', flexWrap: 'wrap' }}>
          {swatches.map((sw) => (
            <div key={sw.label} style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1, minWidth: '80px' }}>
              <div style={{ height: '64px', borderRadius: 'var(--radius-sm)', backgroundColor: rgbString(sw.rgb), border: '1px solid rgba(255,255,255,0.08)' }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--muted)' }}>{sw.caption}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={shellStyles.shell}>
      <span className={shellStyles.toolLabel}>RGB light mixer</span>

      {/* Swatches */}
      <div style={{ display: 'flex', gap: 'var(--spacing-md)', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1, minWidth: '120px' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--muted)', textTransform: 'uppercase' }}>target</span>
          <div style={{ height: '72px', borderRadius: 'var(--radius-sm)', backgroundColor: rgbString(target.value), border: '1px solid rgba(255,255,255,0.08)' }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--muted)' }}>
            {interactive ? target.name : 'preview'}
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1, minWidth: '120px' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--muted)', textTransform: 'uppercase' }}>your mix</span>
          <div style={{ height: '72px', borderRadius: 'var(--radius-sm)', backgroundColor: rgbString(current), border: '1px solid rgba(255,255,255,0.08)' }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--muted)' }}>
            R:{current.r} G:{current.g} B:{current.b}
          </span>
        </div>
      </div>

      {/* Progress label */}
      {interactive && !allDone && (
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--yellow)' }}>
          {targetIdx + 1} / {TARGETS.length}: {target.name}
        </span>
      )}

      {/* Sliders */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
        {CHANNEL_META.map(({ key, label, color }) => {
          const val = current[key];
          const gradient = key === 'r'
            ? `linear-gradient(to right, rgb(0,${current.g},${current.b}), rgb(255,${current.g},${current.b}))`
            : key === 'g'
            ? `linear-gradient(to right, rgb(${current.r},0,${current.b}), rgb(${current.r},255,${current.b}))`
            : `linear-gradient(to right, rgb(${current.r},${current.g},0), rgb(${current.r},${current.g},255))`;
          return (
            <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color }}>{label}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--secondary-foreground)' }}>{val}</span>
              </div>
              <input
                type="range"
                min={0}
                max={255}
                value={val}
                disabled={checked || !interactive}
                style={{
                  width: '100%',
                  background: gradient,
                  appearance: 'none',
                  WebkitAppearance: 'none',
                  height: '6px',
                  borderRadius: '3px',
                  cursor: checked || !interactive ? 'not-allowed' : 'pointer',
                }}
                onChange={(e) => updateChannel(key, Number(e.target.value))}
                aria-label={`${label}: ${val}`}
              />
            </div>
          );
        })}
      </div>

      {/* Actions */}
      {interactive && !allDone && !checked && (
        <button
          onClick={handleCheck}
          style={{
            alignSelf: 'flex-start',
            padding: '0.5rem 1.25rem',
            background: 'var(--yellow)',
            color: 'var(--gray-90)',
            fontFamily: 'var(--font-mono)',
            fontWeight: 700,
            fontSize: '0.85rem',
            borderRadius: 'var(--radius-sm)',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          check
        </button>
      )}

      {interactive && checked && !allDone && (
        close ? (
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--green)', margin: 0 }}>
            ✓ Match. Loading next target...
          </p>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--red)', margin: 0 }}>
              Not quite. Try again.
            </p>
            <button
              onClick={handleRetry}
              style={{
                padding: '0.3rem 0.75rem',
                background: 'transparent',
                color: 'var(--secondary-foreground)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border)',
                cursor: 'pointer',
              }}
            >
              retry
            </button>
          </div>
        )
      )}

      {allDone && (
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--green)', margin: 0 }}>
          ✓ All five targets matched.
        </p>
      )}
    </div>
  );
});
