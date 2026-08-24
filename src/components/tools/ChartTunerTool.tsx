import { memo, useState } from 'react';
import { hexToRgb, colorDistance, simulateDeuteranopia } from '../../utils/color.ts';
import shellStyles from './ToolShell.module.css';

interface ChartTunerToolProps {
  interactive?: boolean;
  onComplete?: () => void;
}

const SERIES = ['Revenue', 'Expenses', 'Profit', 'Forecast'];

const DEFAULTS = ['#3b82f6', '#ef4444', '#22c55e', '#f59e0b'];

const colorDiff = (a: string, b: string) => colorDistance(hexToRgb(a), hexToRgb(b));

const CHART_DATA = [
  [80, 60, 20, 75],
  [65, 55, 10, 68],
  [90, 70, 20, 85],
  [72, 64, 8, 78],
  [88, 68, 20, 82],
];

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May'];

const MIN_DIFF = 80;

function getWeakPairs(colors: string[]) {
  const pairs: [number, number][] = [];
  for (let a = 0; a < SERIES.length; a++) {
    for (let b = a + 1; b < SERIES.length; b++) {
      if (colorDiff(colors[a], colors[b]) < MIN_DIFF) pairs.push([a, b]);
    }
  }
  return pairs;
}

function palettePasses(colors: string[]) {
  if (!colors.every(isValidHex)) return false;
  return getWeakPairs(colors).length === 0 &&
    getWeakPairs(colors.map(simulateDeuteranopia)).length === 0;
}

function ChartBars({ colors, simulated, showLabels }: { colors: string[]; simulated: boolean; showLabels: boolean }) {
  const displayColors = simulated ? colors.map(simulateDeuteranopia) : colors;
  const maxVal = 100;
  return (
    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end', height: 100 }}>
      {MONTHS.map((month, mi) => (
        <div key={month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <div style={{ display: 'flex', gap: 1, alignItems: 'flex-end', height: 80 }}>
            {SERIES.map((name, si) => {
              const h = (CHART_DATA[mi][si] / maxVal) * 80;
              return (
                <div
                  key={name}
                  style={{ width: 8, height: h, background: displayColors[si], borderRadius: '2px 2px 0 0', flexShrink: 0 }}
                  title={`${SERIES[si]}: ${CHART_DATA[mi][si]}`}
                />
              );
            })}
          </div>
          {showLabels && (
            <div style={{ display: 'flex', gap: 1, alignItems: 'flex-start', height: 48 }}>
              {SERIES.map((name) => (
                <span
                  key={name}
                  data-testid={`direct-label-${month}-${name}`}
                  style={{
                    width: 8,
                    color: 'var(--primary-foreground)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.5rem',
                    lineHeight: 1,
                    writingMode: 'vertical-rl',
                    transform: 'rotate(180deg)',
                  }}
                >
                  {name}
                </span>
              ))}
            </div>
          )}
          <span style={{ fontSize: '0.6rem', color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>{month}</span>
        </div>
      ))}
    </div>
  );
}

function isValidHex(h: string) { return /^#[0-9a-fA-F]{6}$/.test(h); }

/**
 * An interactive tool for testing and repairing chart color palettes.
 * It simulates deuteranopia (green-blindness) and calculates the perceptual 
 * distance between series to ensure they are distinguishable.
 */
export const ChartTunerTool = memo(function ChartTunerTool({ interactive = false, onComplete }: ChartTunerToolProps) {
  const [colors, setColors] = useState<string[]>(DEFAULTS);
  const [simulated, setSimulated] = useState(false);
  const [showLabels, setShowLabels] = useState(false);
  const [completed, setCompleted] = useState(false);

  function completeIfReady(nextColors: string[], nextShowLabels: boolean) {
    if (!completed && nextShowLabels && palettePasses(nextColors)) {
      setCompleted(true);
      onComplete?.();
    }
  }

  function update(i: number, val: string) {
    if (!interactive) return;
    const next = [...colors];
    next[i] = val;
    setColors(next);
    completeIfReady(next, showLabels);
  }

  function toggleLabels(checked: boolean) {
    if (!interactive || completed) return;
    setShowLabels(checked);
    completeIfReady(colors, checked);
  }

  const simColors = colors.map(simulateDeuteranopia);
  const weakNormal = getWeakPairs(colors);
  const weakSimulated = getWeakPairs(simColors);
  const paletteIsReady = weakNormal.length === 0 && weakSimulated.length === 0;

  return (
    <div className={shellStyles.shell}>
      <span className={shellStyles.toolLabel}>chart tuner</span>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
        <button
          onClick={() => setSimulated(false)}
          disabled={!interactive}
          style={{
            fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: 4, cursor: interactive ? 'pointer' : 'default',
            background: !simulated ? 'var(--accent-cta)' : 'var(--border)', color: !simulated ? '#000' : 'var(--primary-foreground)',
            border: 'none',
          }}
        >
          Normal
        </button>
        <button
          onClick={() => setSimulated(true)}
          disabled={!interactive}
          style={{
            fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: 4, cursor: interactive ? 'pointer' : 'default',
            background: simulated ? 'var(--accent-cta)' : 'var(--border)', color: simulated ? '#000' : 'var(--primary-foreground)',
            border: 'none',
          }}
        >
          Deuteranopia sim
        </button>
      </div>

      <ChartBars colors={colors} simulated={simulated} showLabels={showLabels} />

      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.75rem' }}>
        {SERIES.map((name, i) => (
          <div key={name} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem' }}>
            <div style={{ width: 12, height: 12, background: simulated ? simColors[i] : colors[i], borderRadius: 2, flexShrink: 0 }} />
            <span style={{ color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>{name}</span>
            {interactive && (
              <input
                type="color"
                value={isValidHex(colors[i]) ? colors[i] : '#000000'}
                onChange={e => update(i, e.target.value)}
                style={{ width: 22, height: 22, padding: 0, border: 'none', cursor: 'pointer', background: 'transparent' }}
                title={`Pick color for ${name}`}
                aria-label={`Pick color for ${name}`}
              />
            )}
          </div>
        ))}
      </div>

      {interactive && (
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.75rem', fontSize: '0.78rem', color: 'var(--primary-foreground)' }}>
          <input
            type="checkbox"
            checked={showLabels}
            disabled={completed}
            onChange={(event) => toggleLabels(event.target.checked)}
          />
          Add direct labels to every bar
        </label>
      )}

      {interactive && (
        <div style={{ marginTop: '0.5rem', fontSize: '0.78rem', color: 'var(--muted)' }}>
          {!paletteIsReady ? (
            <span style={{ color: 'var(--accent-cta)' }}>
              ⚠ Hard to distinguish: {[
                ...weakNormal.map(([a, b]) => `${SERIES[a]}/${SERIES[b]} in normal view`),
                ...weakSimulated.map(([a, b]) => `${SERIES[a]}/${SERIES[b]} under simulation`),
              ].join('; ')}
            </span>
          ) : showLabels ? (
            <span style={{ color: 'var(--accent-success)' }}>✓ Palette passes both views and direct labels identify every series</span>
          ) : (
            <span style={{ color: 'var(--accent-cta)' }}>Palette passes both views. Add direct labels so the bars do not rely on color alone.</span>
          )}
        </div>
      )}

      {completed && (
        <p style={{ color: 'var(--accent-success)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
          The palette passes normal and CVD views, and direct labels identify every series.
        </p>
      )}
    </div>
  );
});
