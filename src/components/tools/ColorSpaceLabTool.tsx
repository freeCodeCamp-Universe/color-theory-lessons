import { memo, useState } from 'react';
import { hexToRgb, hexToHsl } from '../../utils/color.ts';
import shellStyles from './ToolShell.module.css';

// Sort items for the challenge
interface SortItem {
  label: string;
  category: 'value' | 'role' | 'context';
}

const SORT_ITEMS: SortItem[] = [
  { label: '#0B57D0',              category: 'value' },
  { label: '--color-text-primary', category: 'role' },
  { label: 'wide-gamut display', category: 'context' },
  { label: 'chart bar fill',      category: 'context' },
  { label: 'rgb(34, 34, 34)',     category: 'value' },
  { label: '--color-success-bg',  category: 'role' },
  { label: 'SVG icon fill',       category: 'context' },
  { label: '#22c55e',             category: 'value' },
  { label: '--color-border',      category: 'role' },
];

// Sample accent colors for exploration
const ACCENTS = [
  { label: 'Bright blue', hex: '#0066FF' },
  { label: 'Pink',        hex: '#FF1493' },
  { label: 'Green',       hex: '#00FF66' },
  { label: 'Dark blue',   hex: '#2563EB' },
  { label: 'Coral',       hex: '#E05252' },
];

interface ColorSpaceLabToolProps {
  interactive?: boolean;
  onComplete?: () => void;
}

export const ColorSpaceLabTool = memo(function ColorSpaceLabTool({ interactive = false, onComplete }: ColorSpaceLabToolProps) {
  const [accentIdx, setAccentIdx] = useState(0);
  const [sortAnswers, setSortAnswers] = useState<Record<string, string>>({});
  const [sortChecked, setSortChecked] = useState(false);
  const [completed, setCompleted] = useState(false);

  const accent = ACCENTS[accentIdx];
  const rgb = hexToRgb(accent.hex);
  const hsl = hexToHsl(accent.hex);

  // Simplified "P3 risk" heuristic: any channel at 0 or 255 could be clipped in sRGB
  const maxChannel = Math.max(rgb.r, rgb.g, rgb.b);
  const minChannel = Math.min(rgb.r, rgb.g, rgb.b);
  const isVivid = maxChannel >= 250 || minChannel <= 5;

  function checkSort() {
    if (!interactive || completed) return;
    setSortChecked(true);
    const allCorrect = SORT_ITEMS.every((item) => sortAnswers[item.label] === item.category);
    if (allCorrect) {
      setCompleted(true);
      onComplete?.();
    }
  }

  const correctCount = SORT_ITEMS.filter((item) => sortAnswers[item.label] === item.category).length;

  return (
    <div className={shellStyles.shell}>
      <span className={shellStyles.toolLabel}>color space lab</span>

      {/* Accent selector */}
      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
        {ACCENTS.map((a, i) => (
          <button key={a.label} onClick={() => interactive && setAccentIdx(i)} disabled={!interactive}
            style={{
              padding: '0.25rem 0.5rem', fontSize: '0.75rem', fontFamily: 'var(--font-mono)',
              background: i === accentIdx ? a.hex : 'transparent',
              color: i === accentIdx ? '#fff' : 'var(--muted)',
              border: `1px solid ${i === accentIdx ? a.hex : 'var(--border)'}`,
              borderRadius: 'var(--radius-sm)', cursor: interactive ? 'pointer' : 'default',
            }}>
            {a.label}
          </button>
        ))}
      </div>

      {/* Side-by-side gamut preview */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem' }}>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: '0.72rem', color: 'var(--muted)', marginBottom: '0.25rem' }}>sRGB</p>
          <div style={{
            height: 60, borderRadius: 'var(--radius-sm)', background: accent.hex,
            border: '1px solid var(--border)',
          }} />
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: '0.72rem', color: 'var(--muted)', marginBottom: '0.25rem' }}>
            Saturation comparison {isVivid ? '(30% increase)' : '(no increase)'}
          </p>
          <div style={{
            height: 60, borderRadius: 'var(--radius-sm)', background: accent.hex,
            border: `1px solid ${isVivid ? 'var(--yellow)' : 'var(--border)'}`,
            filter: isVivid ? 'saturate(1.3)' : 'none',
          }} />
        </div>
      </div>

      {/* Context panel: same color in CSS, SVG, Canvas */}
      <div style={{ marginBottom: '0.75rem' }}>
        <p style={{ fontSize: '0.78rem', color: 'var(--muted)', marginBottom: '0.3rem' }}>
          Same color in different contexts:
        </p>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <div style={{
              height: 36, borderRadius: 'var(--radius-sm)', background: accent.hex,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ color: '#fff', fontSize: '0.7rem', fontFamily: 'var(--font-mono)' }}>CSS button</span>
            </div>
            <span style={{ fontSize: '0.68rem', color: 'var(--muted)' }}>HTML/CSS</span>
          </div>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <svg width="100%" height="36" viewBox="0 0 60 36">
              <circle cx="30" cy="18" r="14" fill={accent.hex} />
            </svg>
            <span style={{ fontSize: '0.68rem', color: 'var(--muted)' }}>SVG icon</span>
          </div>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <div style={{
              height: 36, borderRadius: 'var(--radius-sm)', background: '#1a1a2e',
              display: 'flex', alignItems: 'flex-end', padding: '0 4px', gap: 2,
            }}>
              <div style={{ flex: 1, height: '60%', background: accent.hex, borderRadius: '2px 2px 0 0' }} />
              <div style={{ flex: 1, height: '40%', background: accent.hex, borderRadius: '2px 2px 0 0', opacity: 0.6 }} />
              <div style={{ flex: 1, height: '80%', background: accent.hex, borderRadius: '2px 2px 0 0' }} />
            </div>
            <span style={{ fontSize: '0.68rem', color: 'var(--muted)' }}>Canvas chart</span>
          </div>
        </div>
      </div>

      {/* Color info */}
      <div style={{
        fontSize: '0.75rem', fontFamily: 'var(--font-mono)', marginBottom: '0.75rem',
        color: 'var(--primary-foreground)',
      }}>
        <span style={{ color: 'var(--muted)' }}>HEX</span> {accent.hex}
        {' · '}
        <span style={{ color: 'var(--muted)' }}>RGB</span> {rgb.r},{rgb.g},{rgb.b}
        {' · '}
        <span style={{ color: 'var(--muted)' }}>HSL</span> {hsl.h}°,{hsl.s}%,{hsl.l}%
        {isVivid && (
          <span style={{ color: 'var(--yellow)', marginLeft: '0.5rem' }}>
            The right preview increases CSS saturation by 30%. It does not display a P3 color.
          </span>
        )}
      </div>

      {/* Sort challenge */}
      {interactive && (
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '0.6rem' }}>
          <p style={{ fontSize: '0.82rem', color: 'var(--muted)', marginBottom: '0.4rem' }}>
            Classify each item as a raw value, semantic role, or usage context:
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginBottom: '0.5rem' }}>
            {SORT_ITEMS.map((item) => {
              const answer = sortAnswers[item.label] ?? '';
              const isWrong = sortChecked && answer !== item.category;
              return (
                <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <code style={{
                    fontSize: '0.75rem', minWidth: 170,
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
                    <option value="">choose</option>
                    <option value="value">raw value</option>
                    <option value="role">semantic role</option>
                    <option value="context">usage context</option>
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
              check ({correctCount}/{SORT_ITEMS.length})
            </button>
          )}

          {sortChecked && !completed && (
            <p style={{ fontSize: '0.78rem', color: 'var(--red)', marginTop: '0.3rem' }}>
              Some items are miscategorized. Try again.
            </p>
          )}
        </div>
      )}

      {completed && (
        <p style={{ color: 'var(--green)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
          All nine items are correctly classified.
        </p>
      )}
    </div>
  );
});
