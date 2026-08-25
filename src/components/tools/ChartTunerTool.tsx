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

const PATTERN_OPTIONS = [
  { value: 'diagonal', label: 'Diagonal stripes' },
  { value: 'horizontal', label: 'Horizontal stripes' },
  { value: 'dots', label: 'Dots' },
  { value: 'crosshatch', label: 'Crosshatch' },
] as const;

type Pattern = typeof PATTERN_OPTIONS[number]['value'];

const DEFAULT_PATTERNS: Pattern[] = SERIES.map(() => 'diagonal');

function patternStyle(pattern: Pattern, color: string) {
  const base = { backgroundColor: color };

  switch (pattern) {
    case 'diagonal':
      return {
        ...base,
        backgroundImage: 'repeating-linear-gradient(135deg, rgba(0, 0, 0, 0.7) 0 2px, rgba(255, 255, 255, 0.7) 2px 4px)',
      };
    case 'horizontal':
      return {
        ...base,
        backgroundImage: 'repeating-linear-gradient(0deg, rgba(0, 0, 0, 0.7) 0 2px, rgba(255, 255, 255, 0.7) 2px 4px)',
      };
    case 'dots':
      return {
        ...base,
        backgroundImage: 'radial-gradient(circle at 1.5px 1.5px, rgba(255, 255, 255, 0.9) 0 1px, transparent 1.2px), radial-gradient(circle at 4.5px 4.5px, rgba(0, 0, 0, 0.9) 0 1px, transparent 1.2px)',
        backgroundSize: '6px 6px',
      };
    case 'crosshatch':
      return {
        ...base,
        backgroundImage: 'repeating-linear-gradient(45deg, transparent 0 3px, rgba(255, 255, 255, 0.8) 3px 4px), repeating-linear-gradient(135deg, transparent 0 3px, rgba(0, 0, 0, 0.8) 3px 4px)',
      };
  }
}

function patternLabel(pattern: Pattern) {
  return PATTERN_OPTIONS.find((option) => option.value === pattern)?.label ?? pattern;
}

function getWeakPairs(colors: string[]) {
  const pairs: [number, number][] = [];
  for (let a = 0; a < SERIES.length; a++) {
    for (let b = a + 1; b < SERIES.length; b++) {
      if (colorDiff(colors[a], colors[b]) < MIN_DIFF) pairs.push([a, b]);
    }
  }
  return pairs;
}

function ChartBars({ colors, patterns, simulated }: { colors: string[]; patterns: Pattern[]; simulated: boolean }) {
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
                  style={{ width: 10, height: h, ...patternStyle(patterns[si], displayColors[si]), borderRadius: '2px 2px 0 0', flexShrink: 0 }}
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

function ChartDataTable({ colors, patterns, simulated }: { colors: string[]; patterns: Pattern[]; simulated: boolean }) {
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
                    style={{ width: 12, height: 12, ...patternStyle(patterns[index], displayColors[index]), borderRadius: 2, flexShrink: 0 }}
                  />
                  {name}
                </span>
                <span style={{ display: 'block', marginTop: 2, color: 'var(--muted)', fontSize: '0.65rem' }}>
                  {patternLabel(patterns[index])} · {displayColors[index].toUpperCase()}
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
  const [patterns, setPatterns] = useState<Pattern[]>(DEFAULT_PATTERNS);
  const [simulated, setSimulated] = useState(false);
  const [showDataTable, setShowDataTable] = useState(false);
  const [completed, setCompleted] = useState(false);

  function update(i: number, val: string) {
    if (!interactive || completed) return;
    const next = [...colors];
    next[i] = val;
    setColors(next);
  }

  function updatePattern(i: number, pattern: Pattern) {
    if (!interactive || completed) return;
    const next = [...patterns];
    next[i] = pattern;
    setPatterns(next);
  }

  function complete() {
    if (completed || !readyToComplete) return;
    setCompleted(true);
    onComplete?.();
  }

  const simColors = colors.map(simulateDeuteranopia);
  const weakNormal = getWeakPairs(colors);
  const weakSimulated = getWeakPairs(simColors);
  const paletteIsReady = weakNormal.length === 0 && weakSimulated.length === 0;
  const patternsAreDistinct = new Set(patterns).size === SERIES.length;
  const readyToComplete = paletteIsReady && patternsAreDistinct && showDataTable;

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
          Normal view
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
          Deuteranopia simulation
        </button>
      </div>

      <ChartBars colors={colors} patterns={patterns} simulated={simulated} />

      <div role="group" aria-label="Series color and pattern controls" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.5rem', marginTop: '0.75rem' }}>
        {SERIES.map((name, i) => (
          <div
            key={name}
            style={{ display: 'grid', gridTemplateColumns: '32px 1fr', gap: '0.3rem 0.5rem', alignItems: 'center', padding: '0.5rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}
          >
            {interactive && (
              <input
                id={`chart-color-${i}`}
                type="color"
                value={isValidHex(colors[i]) ? colors[i] : '#000000'}
                disabled={completed}
                onChange={e => update(i, e.target.value)}
                style={{ gridRow: '1 / span 2', width: 32, height: 32, padding: 0, border: '1px solid var(--border)', borderRadius: 4, cursor: completed ? 'not-allowed' : 'pointer', background: 'transparent' }}
                aria-label={`Change ${name} color`}
              />
            )}
            <label htmlFor={interactive ? `chart-color-${i}` : undefined} style={{ color: 'var(--primary-foreground)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 700 }}>{name}</label>
            <span style={{ color: 'var(--muted)', fontFamily: 'var(--font-mono)', fontSize: '0.68rem' }}>
              {interactive ? `Change color · ${colors[i].toUpperCase()}` : (simulated ? simColors[i] : colors[i]).toUpperCase()}
            </span>
            {interactive ? (
              <select
                aria-label={`Pattern for ${name}`}
                value={patterns[i]}
                disabled={completed}
                onChange={(event) => updatePattern(i, event.target.value as Pattern)}
                style={{ gridColumn: '1 / -1', width: '100%', fontFamily: 'var(--font-mono)', fontSize: '0.68rem', padding: '0.25rem', color: 'var(--primary-foreground)', background: 'var(--primary-background)', border: '1px solid var(--border)', borderRadius: 4 }}
              >
                {PATTERN_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            ) : (
              <span style={{ gridColumn: '1 / -1', color: 'var(--muted)', fontFamily: 'var(--font-mono)', fontSize: '0.68rem' }}>
                {patternLabel(patterns[i])}
              </span>
            )}
          </div>
        ))}
      </div>

      {interactive && (
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.75rem', fontSize: '0.78rem', color: 'var(--primary-foreground)' }}>
          <input
            type="checkbox"
            checked={showDataTable}
            disabled={completed}
            onChange={(event) => setShowDataTable(event.target.checked)}
          />
          Show the chart data table
        </label>
      )}

      {showDataTable && <ChartDataTable colors={colors} patterns={patterns} simulated={simulated} />}

      {interactive && (
        <div style={{ marginTop: '0.5rem', fontSize: '0.78rem', color: 'var(--muted)' }}>
          {!paletteIsReady ? (
            <span style={{ color: 'var(--accent-cta)' }}>
              ⚠ Below the tool's difference threshold: {[
                ...weakNormal.map(([a, b]) => `${SERIES[a]}/${SERIES[b]} in normal view`),
                ...weakSimulated.map(([a, b]) => `${SERIES[a]}/${SERIES[b]} under simulation`),
              ].join('; ')}
            </span>
          ) : !patternsAreDistinct ? (
            <span style={{ color: 'var(--accent-cta)' }}>The colors meet the tool's difference threshold in both views. Assign a different pattern to each series.</span>
          ) : !showDataTable ? (
            <span style={{ color: 'var(--accent-cta)' }}>The colors and patterns meet the tool's criteria. Show the data table to inspect each bar.</span>
          ) : (
            <span style={{ color: 'var(--accent-success)' }}>✓ The colors and patterns meet the tool's criteria, and the data table identifies every bar</span>
          )}
        </div>
      )}

      {interactive && (
        <button
          type="button"
          disabled={!readyToComplete || completed}
          onClick={complete}
          style={{ marginTop: '0.75rem', padding: '0.4rem 0.75rem', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 700, color: readyToComplete ? '#000' : 'var(--muted)', background: readyToComplete ? 'var(--accent-cta)' : 'var(--border)', border: 'none', borderRadius: 'var(--radius-sm)', cursor: readyToComplete ? 'pointer' : 'not-allowed' }}
        >
          Complete chart
        </button>
      )}

      {completed && (
        <p style={{ color: 'var(--accent-success)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
          The colors meet the tool's difference threshold in normal view and the deuteranopia simulation. Each series has a distinct pattern, and the data table identifies every bar.
        </p>
      )}
    </div>
  );
});
