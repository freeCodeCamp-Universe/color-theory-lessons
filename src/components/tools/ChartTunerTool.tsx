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

function ChartBars({ colors, simulated }: { colors: string[]; simulated: boolean }) {
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
          <span style={{ fontSize: '0.6rem', color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>{month}</span>
        </div>
      ))}
    </div>
  );
}

function ChartDataTable({ colors, simulated }: { colors: string[]; simulated: boolean }) {
  const displayColors = simulated ? colors.map(simulateDeuteranopia) : colors;
  const viewName = simulated ? 'Deuteranopia simulation' : 'Normal view';

  return (
    <div style={{ overflowX: 'auto', marginTop: '0.75rem' }}>
      <table
        aria-label={`Chart data in ${viewName.toLowerCase()}`}
        style={{ width: '100%', minWidth: 400, borderCollapse: 'collapse', fontFamily: 'var(--font-mono)', fontSize: '0.72rem' }}
      >
        <caption style={{ textAlign: 'left', color: 'var(--primary-foreground)', fontWeight: 700, marginBottom: '0.4rem' }}>
          Chart data · {viewName}
        </caption>
        <thead>
          <tr>
            <th scope="col" style={{ textAlign: 'left', padding: '0.35rem', borderBottom: '1px solid var(--border)' }}>Month</th>
            {SERIES.map((name, index) => (
              <th key={name} scope="col" style={{ textAlign: 'center', padding: '0.35rem', borderBottom: '1px solid var(--border)' }}>
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem', whiteSpace: 'nowrap' }}>
                  <span
                    aria-hidden="true"
                    style={{ width: 10, height: 10, background: displayColors[index], borderRadius: 2, flexShrink: 0 }}
                  />
                  {name}
                </span>
                <span style={{ display: 'block', marginTop: 2, color: 'var(--muted)', fontSize: '0.65rem' }}>
                  {displayColors[index].toUpperCase()}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {MONTHS.map((month, monthIndex) => (
            <tr key={month}>
              <th scope="row" style={{ textAlign: 'left', padding: '0.35rem', borderBottom: '1px solid var(--border)' }}>{month}</th>
              {SERIES.map((name, seriesIndex) => (
                <td key={name} style={{ textAlign: 'center', padding: '0.35rem', borderBottom: '1px solid var(--border)' }}>
                  {CHART_DATA[monthIndex][seriesIndex]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
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
  const [showDataTable, setShowDataTable] = useState(false);
  const [completed, setCompleted] = useState(false);

  function completeIfReady(nextColors: string[], nextShowDataTable: boolean) {
    if (!completed && nextShowDataTable && palettePasses(nextColors)) {
      setCompleted(true);
      onComplete?.();
    }
  }

  function update(i: number, val: string) {
    if (!interactive) return;
    const next = [...colors];
    next[i] = val;
    setColors(next);
    completeIfReady(next, showDataTable);
  }

  function toggleDataTable(checked: boolean) {
    if (!interactive || completed) return;
    setShowDataTable(checked);
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

      <ChartBars colors={colors} simulated={simulated} />

      <div role="group" aria-label="Series color controls" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.5rem', marginTop: '0.75rem' }}>
        {SERIES.map((name, i) => (
          <label
            key={name}
            style={{ display: 'grid', gridTemplateColumns: '32px 1fr', gap: '0.15rem 0.5rem', alignItems: 'center', padding: '0.5rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', cursor: interactive ? 'pointer' : 'default' }}
          >
            {interactive && (
              <input
                type="color"
                value={isValidHex(colors[i]) ? colors[i] : '#000000'}
                onChange={e => update(i, e.target.value)}
                style={{ gridRow: '1 / span 2', width: 32, height: 32, padding: 0, border: '1px solid var(--border)', borderRadius: 4, cursor: 'pointer', background: 'transparent' }}
                aria-label={`Change ${name} color`}
              />
            )}
            <span style={{ color: 'var(--primary-foreground)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 700 }}>{name}</span>
            <span style={{ color: 'var(--muted)', fontFamily: 'var(--font-mono)', fontSize: '0.68rem' }}>
              {interactive ? `Change color · ${colors[i].toUpperCase()}` : (simulated ? simColors[i] : colors[i]).toUpperCase()}
            </span>
          </label>
        ))}
      </div>

      {interactive && (
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.75rem', fontSize: '0.78rem', color: 'var(--primary-foreground)' }}>
          <input
            type="checkbox"
            checked={showDataTable}
            disabled={completed}
            onChange={(event) => toggleDataTable(event.target.checked)}
          />
          Show the chart data table
        </label>
      )}

      {showDataTable && <ChartDataTable colors={colors} simulated={simulated} />}

      {interactive && (
        <div style={{ marginTop: '0.5rem', fontSize: '0.78rem', color: 'var(--muted)' }}>
          {!paletteIsReady ? (
            <span style={{ color: 'var(--accent-cta)' }}>
              ⚠ Hard to distinguish: {[
                ...weakNormal.map(([a, b]) => `${SERIES[a]}/${SERIES[b]} in normal view`),
                ...weakSimulated.map(([a, b]) => `${SERIES[a]}/${SERIES[b]} under simulation`),
              ].join('; ')}
            </span>
          ) : showDataTable ? (
            <span style={{ color: 'var(--accent-success)' }}>✓ Palette passes both views and the data table identifies every bar</span>
          ) : (
            <span style={{ color: 'var(--accent-cta)' }}>Palette passes both views. Show the data table so the bars do not rely on color alone.</span>
          )}
        </div>
      )}

      {completed && (
        <p style={{ color: 'var(--accent-success)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
          The palette passes normal and CVD views, and the data table identifies every bar.
        </p>
      )}
    </div>
  );
});
