import { memo, useState } from 'react';
import shellStyles from './ToolShell.module.css';

type Model = 'additive' | 'subtractive';

interface SortItem {
  id: string;
  label: string;
  correct: Model;
}

const ITEMS: SortItem[] = [
  { id: 'phone', label: 'Phone screen', correct: 'additive' },
  { id: 'watercolor', label: 'Watercolor painting', correct: 'subtractive' },
  { id: 'led', label: 'LED billboard', correct: 'additive' },
  { id: 'oil', label: 'Oil painting', correct: 'subtractive' },
  { id: 'magazine', label: 'Printed magazine', correct: 'subtractive' },
  { id: 'laptop', label: 'Laptop display', correct: 'additive' },
  { id: 'flyer', label: 'Printed flyer', correct: 'subtractive' },
  { id: 'projector', label: 'Projector beam', correct: 'additive' },
];

const PASS_THRESHOLD = 6;

/* ── Mixing diagram ─────────────────────────────────────────────────────── */

function MixingDiagram({ mode }: { mode: Model }) {
  const isAdditive = mode === 'additive';

  const bg = isAdditive ? 'var(--gray-90)' : '#ede8e0';
  const blendMode = isAdditive ? 'screen' : 'multiply';
  const circles = isAdditive
    ? [
        { color: 'rgb(230, 30, 30)', top: 0, left: 50 },
        { color: 'rgb(30, 210, 30)', top: 58, left: 8 },
        { color: 'rgb(30, 30, 230)', top: 58, left: 92 },
      ]
    : [
        { color: 'rgb(0, 200, 200)', top: 0, left: 50 },
        { color: 'rgb(200, 0, 200)', top: 58, left: 8 },
        { color: 'rgb(220, 220, 0)', top: 58, left: 92 },
      ];

  const caption = isAdditive
    ? 'overlapping light → brighter, toward white'
    : 'ideal subtractive mixing → darker, toward black';

  const captionColor = isAdditive ? 'var(--muted)' : '#888';

  return (
    <div
      style={{
        background: bg,
        borderRadius: 'var(--radius-md)',
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.75rem',
        flex: 1,
      }}
    >
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.75rem',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          color: isAdditive ? 'var(--yellow)' : '#a06000',
        }}
      >
        {isAdditive ? 'additive' : 'subtractive'}
      </span>
      <div
        style={{
          position: 'relative',
          width: '192px',
          height: '168px',
          isolation: 'isolate',
        }}
      >
        {circles.map((c) => (
          <div
            key={c.color}
            style={{
              position: 'absolute',
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              backgroundColor: c.color,
              top: c.top,
              left: c.left,
              mixBlendMode: blendMode as React.CSSProperties['mixBlendMode'],
            }}
          />
        ))}
      </div>
      <p
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.72rem',
          color: captionColor,
          textAlign: 'center',
          margin: 0,
        }}
      >
        {caption}
      </p>
    </div>
  );
}

/* ── Main tool ──────────────────────────────────────────────────────────── */

interface AdditiveSortToolProps {
  interactive?: boolean;
  onComplete?: () => void;
}

export const AdditiveSortTool = memo(function AdditiveSortTool({ interactive = true, onComplete }: AdditiveSortToolProps) {
  const [assignments, setAssignments] = useState<Record<string, Model | ''>>(() =>
    Object.fromEntries(ITEMS.map((item) => [item.id, ''])),
  );
  const [checked, setChecked] = useState(false);

  const allAssigned = ITEMS.every((item) => assignments[item.id] !== '');
  const correctCount = ITEMS.filter((item) => assignments[item.id] === item.correct).length;
  const passed = correctCount >= PASS_THRESHOLD;

  function assign(id: string, model: Model) {
    if (checked || !interactive) return;
    setAssignments((prev) => ({ ...prev, [id]: model }));
  }

  function handleCheck() {
    setChecked(true);
    if (passed) onComplete?.();
  }

  function handleRetry() {
    setAssignments(Object.fromEntries(ITEMS.map((item) => [item.id, ''])));
    setChecked(false);
  }

  return (
    <div className={shellStyles.shell}>
      <span className={shellStyles.toolLabel}>additive vs subtractive</span>

      {/* Diagrams — always visible */}
      <div style={{ display: 'flex', gap: 'var(--spacing-md)', flexWrap: 'wrap' }}>
        <MixingDiagram mode="additive" />
        <MixingDiagram mode="subtractive" />
      </div>

      {/* Sort activity — only when interactive */}
      {interactive && (
        <>
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: 'var(--spacing-md)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--muted)', textTransform: 'uppercase' }}>
              sort each example
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 'var(--spacing-sm)' }}>
              {ITEMS.map((item) => {
                const chosen = assignments[item.id];
                const isCorrect = checked && chosen === item.correct;
                const isWrong = checked && chosen !== '' && chosen !== item.correct;
                return (
                  <div
                    key={item.id}
                    style={{
                      background: 'var(--surface)',
                      border: `1px solid ${isCorrect ? 'var(--green)' : isWrong ? 'var(--red)' : 'var(--border)'}`,
                      borderRadius: 'var(--radius-sm)',
                      padding: 'var(--spacing-sm)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '6px',
                    }}
                  >
                    <span style={{ fontSize: '0.875rem', color: 'var(--primary-foreground)' }}>{item.label}</span>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      {(['additive', 'subtractive'] as Model[]).map((model) => {
                        const active = chosen === model;
                        return (
                          <button
                            key={model}
                            onClick={() => assign(item.id, model)}
                            disabled={checked}
                            style={{
                              flex: 1,
                              padding: '0.25rem 0.4rem',
                              fontFamily: 'var(--font-mono)',
                              fontSize: '0.7rem',
                              borderRadius: '3px',
                              border: `1px solid ${active ? 'var(--yellow)' : 'var(--border)'}`,
                              background: active ? 'color-mix(in srgb, var(--yellow) 12%, var(--surface))' : 'transparent',
                              color: active ? 'var(--yellow)' : 'var(--muted)',
                              cursor: checked ? 'not-allowed' : 'pointer',
                            }}
                          >
                            {model}
                          </button>
                        );
                      })}
                    </div>
                    {checked && (
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: isCorrect ? 'var(--green)' : isWrong ? 'var(--red)' : 'var(--muted)' }}>
                        {isCorrect ? '✓ correct' : isWrong ? `→ ${item.correct}` : 'not answered'}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          {!checked && (
            <button
              onClick={handleCheck}
              disabled={!allAssigned}
              style={{
                alignSelf: 'flex-start',
                padding: '0.5rem 1.25rem',
                background: allAssigned ? 'var(--yellow)' : 'var(--border)',
                color: 'var(--gray-90)',
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                fontSize: '0.85rem',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                cursor: allAssigned ? 'pointer' : 'not-allowed',
              }}
            >
              check answers
            </button>
          )}

          {checked && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)', flexWrap: 'wrap' }}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: passed ? 'var(--green)' : 'var(--yellow)', margin: 0 }}>
                {correctCount} / {ITEMS.length} correct
                {passed ? '. Well done!' : '. Review the incorrect ones.'}
              </p>
              {!passed && (
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
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
});
