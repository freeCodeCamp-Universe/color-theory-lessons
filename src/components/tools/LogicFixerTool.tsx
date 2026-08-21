import { memo, useState, useEffect, useRef } from 'react';
import shellStyles from './ToolShell.module.css';

interface Choice {
  id: string;
  label: string;
  isCorrect: boolean;
}

interface Scenario {
  statement: string;
  choices: Choice[];
}

const SCENARIOS: Scenario[] = [
  {
    statement: '"I\'ll make this button darker by mixing in black, like I would with paint."',
    choices: [
      { id: 'a', label: 'I\'ll reduce the R, G, and B values so the display outputs less light for this color.', isCorrect: true },
      { id: 'b', label: 'I\'ll raise the R, G, and B values until the color looks darker.', isCorrect: false },
      { id: 'c', label: 'Mixing black works the same way on screens as in paint.', isCorrect: false },
      { id: 'd', label: 'I\'ll reduce the saturation to make the color appear darker.', isCorrect: false },
    ],
  },
  {
    statement: '"Setting the red and green channels to full intensity will make a muddy brown."',
    choices: [
      { id: 'a', label: 'Red and green light behave the same way as red and green paint.', isCorrect: false },
      { id: 'b', label: 'Red and green light at full intensity produce yellow, not brown.', isCorrect: true },
      { id: 'c', label: 'Adding blue light is what makes red and green produce yellow.', isCorrect: false },
      { id: 'd', label: 'Mixing red and green channels gives orange, not brown.', isCorrect: false },
    ],
  },
  {
    statement: '"Raising all three RGB channels will make the color muddier and darker."',
    choices: [
      { id: 'a', label: 'That\'s true. Increasing channel values reduces the light from the screen.', isCorrect: false },
      { id: 'b', label: 'Raising all three channel values adds light and moves the color toward white.', isCorrect: true },
      { id: 'c', label: 'Muddiness only happens when colors share the same hue family.', isCorrect: false },
      { id: 'd', label: 'Raising all three channels increases contrast, not brightness.', isCorrect: false },
    ],
  },
];

interface LogicFixerToolProps {
  interactive?: boolean;
  onComplete?: () => void;
}

export const LogicFixerTool = memo(function LogicFixerTool({ interactive = true, onComplete }: LogicFixerToolProps) {
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const [completed, setCompleted] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timerRef.current !== null) clearTimeout(timerRef.current); }, []);

  const scenario = SCENARIOS[scenarioIdx];
  const correctId = scenario.choices.find((c) => c.isCorrect)?.id ?? '';
  const isCorrect = selected === correctId;

  function handleSelect(id: string) {
    if (checked || !interactive) return;
    setSelected(id);
  }

  function handleCheck() {
    if (!selected) return;
    setChecked(true);
    if (isCorrect && scenarioIdx === SCENARIOS.length - 1) {
      timerRef.current = setTimeout(() => {
        setCompleted(true);
        onComplete?.();
      }, 600);
    }
  }

  function handleNext() {
    setScenarioIdx((i) => i + 1);
    setSelected(null);
    setChecked(false);
  }

  function handleRetry() {
    setSelected(null);
    setChecked(false);
  }

  return (
    <div className={shellStyles.shell}>
      <span className={shellStyles.toolLabel}>paint logic vs screen logic</span>

      {/* Static reference — always visible */}
      <div style={{ display: 'flex', gap: 'var(--spacing-md)', flexWrap: 'wrap' }}>
        <div style={{
          flex: 1,
          minWidth: '120px',
          background: '#ede8e0',
          borderRadius: 'var(--radius-sm)',
          padding: 'var(--spacing-sm) var(--spacing-md)',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
        }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', textTransform: 'uppercase', color: '#7a5000', letterSpacing: '0.05em' }}>paint logic</span>
          <span style={{ fontSize: '0.8rem', color: '#4a3000' }}>mixed pigments → darker, less saturated</span>
          <span style={{ fontSize: '0.8rem', color: '#4a3000' }}>ideal subtractive primaries → black</span>
        </div>
        <div style={{
          flex: 1,
          minWidth: '120px',
          background: 'var(--surface)',
          borderRadius: 'var(--radius-sm)',
          padding: 'var(--spacing-sm) var(--spacing-md)',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          border: '1px solid var(--border)',
        }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--yellow)', letterSpacing: '0.05em' }}>screen logic</span>
          <span style={{ fontSize: '0.8rem', color: 'var(--secondary-foreground)' }}>higher RGB values → more light</span>
          <span style={{ fontSize: '0.8rem', color: 'var(--secondary-foreground)' }}>full RGB primaries → white</span>
        </div>
      </div>

      {/* Challenge — only when interactive */}
      {interactive && !completed && (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--yellow)' }}>
              scenario {scenarioIdx + 1} of {SCENARIOS.length}
            </span>
            <p style={{ fontSize: '0.9rem', color: 'var(--primary-foreground)', margin: 0, fontStyle: 'italic' }}>
              {scenario.statement}
            </p>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--muted)', textTransform: 'uppercase', marginTop: '4px' }}>
              pick the screen-first rewrite
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)' }}>
            {scenario.choices.map((choice) => {
              const isSelected = selected === choice.id;
              const showResult = checked;
              const borderColor = showResult
                ? choice.isCorrect
                  ? 'var(--green)'
                  : isSelected
                  ? 'var(--red)'
                  : 'var(--border)'
                : isSelected
                ? 'var(--yellow)'
                : 'var(--border)';
              const bg = showResult
                ? choice.isCorrect
                  ? 'color-mix(in srgb, var(--green) 10%, var(--surface))'
                  : isSelected
                  ? 'color-mix(in srgb, var(--red) 10%, var(--surface))'
                  : 'var(--surface)'
                : isSelected
                ? 'color-mix(in srgb, var(--yellow) 10%, var(--surface))'
                : 'var(--surface)';

              return (
                <button
                  key={choice.id}
                  onClick={() => handleSelect(choice.id)}
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
                    borderRadius: '50%',
                    border: `1px solid ${isSelected ? 'var(--yellow)' : 'var(--border)'}`,
                    background: isSelected ? 'var(--yellow)' : 'transparent',
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.6rem',
                    color: 'var(--gray-90)',
                  }}>
                    {isSelected ? '●' : ''}
                  </span>
                  <span style={{ flex: 1 }}>{choice.label}</span>
                  {showResult && (
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.7rem',
                      color: choice.isCorrect ? 'var(--green)' : isSelected ? 'var(--red)' : 'var(--muted)',
                      flexShrink: 0,
                    }}>
                      {choice.isCorrect ? '✓' : isSelected ? '✗' : ''}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {checked && (
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: isCorrect ? 'var(--green)' : 'var(--red)', margin: 0 }}>
              {isCorrect ? '✓ correct. Screen logic applied.' : '✗ not quite. Try again.'}
            </p>
          )}

          {!checked && (
            <button
              onClick={handleCheck}
              disabled={!selected}
              style={{
                alignSelf: 'flex-start',
                padding: '0.5rem 1.25rem',
                background: selected ? 'var(--yellow)' : 'var(--border)',
                color: 'var(--gray-90)',
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                fontSize: '0.85rem',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                cursor: selected ? 'pointer' : 'not-allowed',
              }}
            >
              check
            </button>
          )}

          {checked && isCorrect && scenarioIdx < SCENARIOS.length - 1 && (
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

          {checked && !isCorrect && (
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

      {interactive && completed && (
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--green)', margin: 0 }}>
          ✓ all three scenarios corrected using screen logic.
        </p>
      )}
    </div>
  );
});
