import { memo, useState } from 'react';
import shellStyles from './ToolShell.module.css';

interface Swatch {
  id: string;
  label: string;
  color: string;
  correct: 'warm' | 'cool' | 'neutral';
}

const SWATCHES: Swatch[] = [
  { id: 'coral', label: 'Coral', color: '#ff6b6b', correct: 'warm' },
  { id: 'teal', label: 'Teal', color: '#14b8a6', correct: 'cool' },
  { id: 'stone', label: 'Stone gray', color: '#78716c', correct: 'neutral' },
  { id: 'navy', label: 'Navy', color: '#1a3a6b', correct: 'cool' },
  { id: 'rust', label: 'Rust', color: '#c2410c', correct: 'warm' },
  { id: 'cream', label: 'Cream', color: '#fef9c3', correct: 'neutral' },
  { id: 'sand', label: 'Sand', color: '#c9b99a', correct: 'neutral' },
  { id: 'amber', label: 'Amber', color: '#f59e0b', correct: 'warm' },
  { id: 'slate', label: 'Slate blue', color: '#475569', correct: 'cool' },
];

const INTERFACE_GOALS = [
  { id: 'event', label: 'Lively event sign-up', correct: 'warm' as const },
  { id: 'dashboard', label: 'Calm data dashboard', correct: 'cool' as const },
  { id: 'portfolio', label: 'Artwork-centered portfolio', correct: 'neutral' as const },
];

type Temperature = 'warm' | 'cool' | 'neutral';

interface TemperatureSorterToolProps {
  interactive?: boolean;
  onComplete?: () => void;
}

export const TemperatureSorterTool = memo(function TemperatureSorterTool({ interactive = true, onComplete }: TemperatureSorterToolProps) {
  const [stage, setStage] = useState<1 | 2>(1);
  const [swatchAnswers, setSwatchAnswers] = useState<Record<string, Temperature | ''>>(() =>
    Object.fromEntries(SWATCHES.map((s) => [s.id, ''])),
  );
  const [goalAnswers, setGoalAnswers] = useState<Record<string, Temperature | ''>>(() =>
    Object.fromEntries(INTERFACE_GOALS.map((g) => [g.id, ''])),
  );
  const [swatchesChecked, setSwatchesChecked] = useState(false);
  const [goalsChecked, setGoalsChecked] = useState(false);

  const swatchCorrect = SWATCHES.filter((s) => swatchAnswers[s.id] === s.correct).length;
  const goalCorrect = INTERFACE_GOALS.filter((g) => goalAnswers[g.id] === g.correct).length;
  const allSwatchesAnswered = SWATCHES.every((s) => swatchAnswers[s.id] !== '');
  const allGoalsAnswered = INTERFACE_GOALS.every((g) => goalAnswers[g.id] !== '');
  const swatchesPassed = swatchesChecked && swatchCorrect === SWATCHES.length;
  const goalsPassed = goalsChecked && goalCorrect >= Math.ceil(INTERFACE_GOALS.length * 0.7);

  function handleCheckGoals() {
    setGoalsChecked(true);
    if (goalCorrect >= Math.ceil(INTERFACE_GOALS.length * 0.7)) {
      onComplete?.();
    }
  }

  function handleRetrySwatches() {
    setSwatchAnswers(Object.fromEntries(SWATCHES.map((s) => [s.id, ''])));
    setSwatchesChecked(false);
  }

  function handleRetryGoals() {
    setGoalAnswers(Object.fromEntries(INTERFACE_GOALS.map((g) => [g.id, ''])));
    setGoalsChecked(false);
  }

  const tempColor = (t: Temperature | '') =>
    t === 'warm' ? '#f59e0b' : t === 'cool' ? '#60a5fa' : t === 'neutral' ? '#9ca3af' : 'transparent';

  return (
    <div className={shellStyles.shell}>
      <span className={shellStyles.toolLabel}>color temperature exercise</span>

      <div style={{ display: 'flex', gap: '0.3rem' }} aria-hidden="true">
        {[1, 2].map((stageNumber) => (
          <div
            key={stageNumber}
            style={{
              flex: 1,
              height: 4,
              borderRadius: 2,
              background: stageNumber < stage
                ? 'var(--accent-success)'
                : stageNumber === stage
                  ? 'var(--accent-cta)'
                  : 'var(--border)',
            }}
          />
        ))}
      </div>
      <p style={{ fontSize: '0.72rem', color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>
        Stage {stage} of 2
      </p>

      {stage === 1 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--muted)', textTransform: 'uppercase' }}>
            classify the colors
          </span>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 'var(--spacing-sm)' }}>
            {SWATCHES.map((s) => {
              const chosen = swatchAnswers[s.id];
              const isCorrect = swatchesChecked && chosen === s.correct;
              const isWrong = swatchesChecked && chosen !== '' && chosen !== s.correct;
              return (
                <div
                  key={s.id}
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
                  <div
                    style={{
                      height: '40px',
                      borderRadius: '3px',
                      backgroundColor: s.color,
                      border: `2px solid ${tempColor(chosen)}`,
                      transition: 'border-color 0.2s ease',
                    }}
                  />
                  <span style={{ fontSize: '0.8rem', color: 'var(--secondary-foreground)' }}>{s.label}</span>
                  <select
                    value={swatchAnswers[s.id]}
                    disabled={swatchesChecked || !interactive}
                    onChange={(e) => setSwatchAnswers((prev) => ({ ...prev, [s.id]: e.target.value as Temperature }))}
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.75rem',
                      background: 'var(--primary-background)',
                      color: 'var(--primary-foreground)',
                      border: '1px solid var(--border)',
                      borderRadius: '3px',
                      padding: '0.25rem 0.35rem',
                      cursor: swatchesChecked ? 'not-allowed' : 'pointer',
                    }}
                    aria-label={`Temperature for ${s.label}`}
                  >
                    <option value="">choose temperature</option>
                    <option value="warm">warm</option>
                    <option value="cool">cool</option>
                    <option value="neutral">neutral</option>
                  </select>
                  {swatchesChecked && (
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: isCorrect ? 'var(--green)' : isWrong ? 'var(--red)' : 'var(--muted)' }}>
                      {isCorrect ? '✓' : isWrong ? `→ ${s.correct}` : 'not answered'}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {interactive && !swatchesChecked && (
            <button
              disabled={!allSwatchesAnswered}
              onClick={() => setSwatchesChecked(true)}
              style={{
                alignSelf: 'flex-start',
                padding: '0.5rem 1.25rem',
                background: allSwatchesAnswered ? 'var(--yellow)' : 'var(--border)',
                color: 'var(--gray-90)',
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                fontSize: '0.85rem',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                cursor: allSwatchesAnswered ? 'pointer' : 'not-allowed',
              }}
            >
              check stage
            </button>
          )}

          {swatchesChecked && (
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: swatchesPassed ? 'var(--green)' : 'var(--yellow)' }}>
              {swatchCorrect} / {SWATCHES.length} correct
            </p>
          )}

          {swatchesPassed && (
            <button
              onClick={() => setStage(2)}
              style={{
                alignSelf: 'flex-start',
                padding: '0.5rem 1.25rem',
                background: 'var(--accent-success)',
                color: 'var(--gray-90)',
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                fontSize: '0.85rem',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              next stage →
            </button>
          )}

          {swatchesChecked && !swatchesPassed && (
            <button
              onClick={handleRetrySwatches}
              style={{
                alignSelf: 'flex-start',
                padding: '0.5rem 1.25rem',
                background: 'transparent',
                color: 'var(--secondary-foreground)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.85rem',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
              }}
            >
              try stage again
            </button>
          )}
        </div>
      )}

      {stage === 2 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--muted)', textTransform: 'uppercase' }}>
            match temperature to interface goals
          </span>
          {INTERFACE_GOALS.map((g) => {
            const chosen = goalAnswers[g.id];
            const isCorrect = goalsChecked && chosen === g.correct;
            const isWrong = goalsChecked && chosen !== '' && chosen !== g.correct;
            return (
              <div
                key={g.id}
                style={{
                  background: 'var(--surface)',
                  border: `1px solid ${isCorrect ? 'var(--green)' : isWrong ? 'var(--red)' : 'var(--border)'}`,
                  borderRadius: 'var(--radius-sm)',
                  padding: 'var(--spacing-sm) var(--spacing-md)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-md)',
                }}
              >
                <span style={{ flex: 1, fontSize: '0.9rem' }}>{g.label}</span>
                <select
                  value={goalAnswers[g.id]}
                  disabled={goalsChecked || !interactive}
                  onChange={(e) => setGoalAnswers((prev) => ({ ...prev, [g.id]: e.target.value as Temperature }))}
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.8rem',
                    background: 'var(--primary-background)',
                    color: 'var(--primary-foreground)',
                    border: '1px solid var(--border)',
                    borderRadius: '3px',
                    padding: '0.3rem 0.5rem',
                    cursor: goalsChecked ? 'not-allowed' : 'pointer',
                  }}
                  aria-label={`Palette direction for ${g.label}`}
                >
                  <option value="">choose palette direction</option>
                  <option value="warm">warm</option>
                  <option value="cool">cool</option>
                  <option value="neutral">neutral</option>
                </select>
                {goalsChecked && (
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: isCorrect ? 'var(--green)' : isWrong ? 'var(--red)' : 'var(--muted)', width: '80px' }}>
                    {isCorrect ? '✓ correct' : isWrong ? `→ ${g.correct}` : 'not answered'}
                  </span>
                )}
              </div>
            );
          })}

          {interactive && !goalsChecked && (
            <button
              disabled={!allGoalsAnswered}
              onClick={handleCheckGoals}
              style={{
                alignSelf: 'flex-start',
                padding: '0.5rem 1.25rem',
                background: allGoalsAnswered ? 'var(--yellow)' : 'var(--border)',
                color: 'var(--gray-90)',
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                fontSize: '0.85rem',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                cursor: allGoalsAnswered ? 'pointer' : 'not-allowed',
              }}
            >
              check stage
            </button>
          )}

          {goalsChecked && (
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: goalsPassed ? 'var(--green)' : 'var(--yellow)' }}>
              {goalCorrect} / {INTERFACE_GOALS.length} correct
            </p>
          )}

          {goalsChecked && !goalsPassed && (
            <button
              onClick={handleRetryGoals}
              style={{
                alignSelf: 'flex-start',
                padding: '0.5rem 1.25rem',
                background: 'transparent',
                color: 'var(--secondary-foreground)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.85rem',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
              }}
            >
              try stage again
            </button>
          )}
        </div>
      )}
    </div>
  );
});
