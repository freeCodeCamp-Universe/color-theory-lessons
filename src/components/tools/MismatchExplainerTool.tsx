import { memo, useState, useEffect, useRef } from 'react';
import shellStyles from './ToolShell.module.css';

interface Reason {
  id: string;
  label: string;
  isCorrect: boolean;
}

interface Scenario {
  title: string;
  description: string;
  screenColor: string;
  reasons: Reason[];
}

const SCENARIOS: Scenario[] = [
  {
    title: 'Website button vs printed brochure',
    description: 'A designer chose a vivid blue for their primary button. The printed brochure version looks duller.',
    screenColor: '#1a5fe8',
    reasons: [
      { id: 'a', label: 'The screen emits light, while the printed ink reflects light from the surroundings.', isCorrect: true },
      { id: 'b', label: 'The blue falls outside the gamut of the ink, printer, and paper used for the brochure.', isCorrect: true },
      { id: 'c', label: 'A duller print proves that the designer chose the wrong blue.', isCorrect: false },
      { id: 'd', label: 'Printed colors always look the same as screen colors under good lighting.', isCorrect: false },
    ],
  },
  {
    title: 'Brand green on screen vs painted wall',
    description: 'A brand\'s signature green looks consistent across two phones but different on a freshly painted wall sample.',
    screenColor: '#00b450',
    reasons: [
      { id: 'a', label: 'Paint pigments absorb and reflect incoming light, while phone screens emit light from RGB subpixels.', isCorrect: true },
      { id: 'b', label: 'Phones always show color more accurately than any other medium.', isCorrect: false },
      { id: 'c', label: 'The wall surface and finish affect how ambient light reflects off the color.', isCorrect: true },
      { id: 'd', label: 'The phones agreeing proves that the painted wall must match them.', isCorrect: false },
    ],
  },
  {
    title: 'App accent vs product packaging',
    description: 'A vivid orange used as the app\'s accent color arrives on printed packaging looking less saturated and slightly brownish.',
    screenColor: '#e85a10',
    reasons: [
      { id: 'a', label: 'A brownish result proves that the printer made a calibration error.', isCorrect: false },
      { id: 'b', label: 'The orange falls outside the gamut of the inks and packaging material used for this print run.', isCorrect: true },
      { id: 'c', label: 'The screen creates orange with emitted RGB light, while the printed inks absorb and reflect incoming light.', isCorrect: true },
      { id: 'd', label: 'Orange cannot be mixed from CMYK inks at all.', isCorrect: false },
    ],
  },
];

function printFilter(): string {
  // Returns a CSS filter string that simulates print desaturation/brightness loss
  // We use this on a div rather than the color itself
  return 'saturate(0.58) brightness(0.78)';
}

interface MismatchExplainerToolProps {
  interactive?: boolean;
  onComplete?: () => void;
}

export const MismatchExplainerTool = memo(function MismatchExplainerTool({ interactive = true, onComplete }: MismatchExplainerToolProps) {
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [checked, setChecked] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timerRef.current !== null) clearTimeout(timerRef.current); }, []);

  const scenario = SCENARIOS[scenarioIdx];
  const correctIds = new Set(scenario.reasons.filter((r) => r.isCorrect).map((r) => r.id));

  const allCorrectSelected = [...correctIds].every((id) => selected.has(id));
  const noWrongSelected = [...selected].every((id) => correctIds.has(id));
  const isPerfect = allCorrectSelected && noWrongSelected;

  function toggleReason(id: string) {
    if (checked || !interactive) return;
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); } else { next.add(id); }
      return next;
    });
  }

  function handleCheck() {
    if (selected.size === 0) return;
    setChecked(true);
    if (isPerfect) {
      if (scenarioIdx === SCENARIOS.length - 1) {
        timerRef.current = setTimeout(() => onComplete?.(), 600);
      }
    }
  }

  function handleNext() {
    setScenarioIdx((i) => i + 1);
    setSelected(new Set());
    setChecked(false);
  }

  function handleRetry() {
    setSelected(new Set());
    setChecked(false);
  }

  return (
    <div className={shellStyles.shell}>
      <span className={shellStyles.toolLabel}>screen vs material</span>

      {/* Color comparison — always visible */}
      <div style={{ display: 'flex', gap: 'var(--spacing-md)', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1, minWidth: '110px' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--muted)', textTransform: 'uppercase' }}>on screen</span>
          <div style={{ height: '60px', borderRadius: 'var(--radius-sm)', backgroundColor: scenario.screenColor, border: '1px solid rgba(255,255,255,0.08)' }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--muted)' }}>emits light</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1, minWidth: '110px' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--muted)', textTransform: 'uppercase' }}>print simulation</span>
          <div style={{ height: '60px', borderRadius: 'var(--radius-sm)', backgroundColor: scenario.screenColor, filter: printFilter(), border: '1px solid rgba(0,0,0,0.08)' }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--muted)' }}>reflects light</span>
        </div>
      </div>

      {/* Scenario + reasons — only when interactive */}
      {interactive && (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--yellow)' }}>
              scenario {scenarioIdx + 1} of {SCENARIOS.length}: {scenario.title}
            </span>
            <p style={{ fontSize: '0.9rem', color: 'var(--secondary-foreground)', margin: 0 }}>
              {scenario.description}
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--muted)', textTransform: 'uppercase' }}>
              why do they look different? select all that apply
            </span>
            {scenario.reasons.map((reason) => {
              const isSelected = selected.has(reason.id);
              const showResult = checked;
              const correct = reason.isCorrect;
              const borderColor = showResult
                ? correct && isSelected ? 'var(--green)'
                : correct && !isSelected ? 'color-mix(in srgb, var(--green) 50%, var(--border))'
                : !correct && isSelected ? 'var(--red)'
                : 'var(--border)'
                : isSelected ? 'var(--yellow)' : 'var(--border)';
              const bg = showResult
                ? correct && isSelected ? 'color-mix(in srgb, var(--green) 10%, var(--surface))'
                : !correct && isSelected ? 'color-mix(in srgb, var(--red) 10%, var(--surface))'
                : 'var(--surface)'
                : isSelected ? 'color-mix(in srgb, var(--yellow) 10%, var(--surface))' : 'var(--surface)';

              return (
                <button
                  key={reason.id}
                  onClick={() => toggleReason(reason.id)}
                  disabled={checked}
                  style={{
                    padding: 'var(--spacing-sm) var(--spacing-md)',
                    background: bg,
                    border: `1px solid ${borderColor}`,
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--primary-foreground)',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.875rem',
                    textAlign: 'left',
                    cursor: checked ? 'default' : 'pointer',
                    display: 'flex',
                    gap: 'var(--spacing-sm)',
                    alignItems: 'center',
                    transition: 'border-color 0.15s ease, background 0.15s ease',
                  }}
                >
                  <span style={{
                    width: '16px',
                    height: '16px',
                    borderRadius: '3px',
                    border: `1px solid ${isSelected ? 'var(--yellow)' : 'var(--border)'}`,
                    background: isSelected ? 'var(--yellow)' : 'transparent',
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.65rem',
                    color: 'var(--gray-90)',
                  }}>
                    {isSelected ? '✓' : ''}
                  </span>
                  <span style={{ flex: 1 }}>{reason.label}</span>
                  {showResult && (
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: correct ? 'var(--green)' : isSelected ? 'var(--red)' : 'var(--muted)', flexShrink: 0 }}>
                      {correct ? (isSelected ? '✓' : 'missed') : (isSelected ? '✗' : '')}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Result message */}
          {checked && (
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: isPerfect ? 'var(--green)' : 'var(--yellow)', margin: 0 }}>
              {isPerfect
                ? '✓ exactly right.'
                : allCorrectSelected
                ? 'You got the right ones but also selected some incorrect reasons.'
                : 'You missed some correct reasons.'}
            </p>
          )}

          {/* Actions */}
          {!checked && (
            <button
              onClick={handleCheck}
              disabled={selected.size === 0}
              style={{
                alignSelf: 'flex-start',
                padding: '0.5rem 1.25rem',
                background: selected.size > 0 ? 'var(--yellow)' : 'var(--border)',
                color: 'var(--gray-90)',
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                fontSize: '0.85rem',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                cursor: selected.size > 0 ? 'pointer' : 'not-allowed',
              }}
            >
              check
            </button>
          )}

          {checked && isPerfect && scenarioIdx < SCENARIOS.length - 1 && (
            <button
              onClick={handleNext}
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
              next scenario →
            </button>
          )}

          {checked && !isPerfect && (
            <button
              onClick={handleRetry}
              style={{
                alignSelf: 'flex-start',
                padding: '0.4rem 0.9rem',
                background: 'transparent',
                color: 'var(--secondary-foreground)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border)',
                cursor: 'pointer',
              }}
            >
              try again
            </button>
          )}
        </>
      )}
    </div>
  );
});
