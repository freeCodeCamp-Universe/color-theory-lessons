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

function ChartBars({ colors, simulated }: { colors: string[]; simulated: boolean }) {
  const displayColors = simulated ? colors.map(simulateDeuteranopia) : colors;
  const maxVal = 100;
  return (
    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end', height: 100 }}>
      {MONTHS.map((month, mi) => (
        <div key={month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <div style={{ display: 'flex', gap: 1, alignItems: 'flex-end', height: 80 }}>
            {SERIES.map((_, si) => {
              const h = (CHART_DATA[mi][si] / maxVal) * 80;
              return (
                <div
                  key={si}
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

function isValidHex(h: string) { return /^#[0-9a-fA-F]{6}$/.test(h); }

/**
 * An interactive tool for testing and repairing chart color palettes.
 * It simulates deuteranopia (green-blindness) and calculates the perceptual 
 * distance between series to ensure they are distinguishable.
 */
export const ChartTunerTool = memo(function ChartTunerTool({ interactive = false, onComplete }: ChartTunerToolProps) {
  const [colors, setColors] = useState<string[]>(DEFAULTS);
  const [simulated, setSimulated] = useState(false);
  const [completed, setCompleted] = useState(false);

  /**
   * Updates a specific series color and checks if the new palette passes 
   * the distinguishability threshold (MIN_DIFF) in both normal and CVD views.
   */
  function update(i: number, val: string) {
    if (!interactive) return;
    const next = [...colors];
    next[i] = val;
    setColors(next);

    if (!completed && isValidHex(val)) {
      const pairs = [];
      for (let a = 0; a < 4; a++) for (let b = a + 1; b < 4; b++) pairs.push([next[a], next[b]]);
      const simPairs = pairs.map(([a, b]) => [simulateDeuteranopia(a), simulateDeuteranopia(b)]);
      const allOk = pairs.every(([a, b]) => colorDiff(a, b) >= MIN_DIFF) &&
        simPairs.every(([a, b]) => colorDiff(a, b) >= MIN_DIFF);
      if (allOk) {
        setCompleted(true);
        onComplete?.();
      }
    }
  }

  const simColors = colors.map(simulateDeuteranopia);

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

      <ChartBars colors={colors} simulated={simulated} />

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
              />
            )}
          </div>
        ))}
      </div>

      {interactive && (
        <div style={{ marginTop: '0.75rem', fontSize: '0.78rem', color: 'var(--muted)' }}>
          {(() => {
            const pairs: [number, number][] = [];
            for (let a = 0; a < 4; a++) for (let b = a + 1; b < 4; b++) pairs.push([a, b]);
            const weak = pairs.filter(([a, b]) => colorDiff(simColors[a], simColors[b]) < MIN_DIFF);
            return weak.length > 0
              ? <span style={{ color: 'var(--accent-cta)' }}>⚠ Pairs that are hard to distinguish under simulation: {weak.map(([a, b]) => `${SERIES[a]}/${SERIES[b]}`).join(', ')}</span>
              : <span style={{ color: 'var(--accent-success)' }}>✓ All series distinguishable in both views</span>;
          })()}
        </div>
      )}

      {completed && (
        <p style={{ color: 'var(--accent-success)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
          The series meet the tool's difference threshold in both normal view and the deuteranopia simulation.
        </p>
      )}
    </div>
  );
});
