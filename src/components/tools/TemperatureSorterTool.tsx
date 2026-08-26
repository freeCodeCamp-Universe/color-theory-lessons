import { memo, useState } from 'react';
import { ExerciseStage } from './ExerciseStage.tsx';
import shellStyles from './ToolShell.module.css';
import type { ExerciseStageDefinition, ExerciseToolProps } from './exercise-stage.ts';
import { useExerciseStages } from './useExerciseStages.ts';

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

const STAGES: readonly ExerciseStageDefinition[] = [
  {
    id: 'classify-colors',
    title: 'classify the colors',
    instruction: 'Classify each swatch as warm, cool, or neutral.',
    nextActionLabel: 'next stage →',
  },
  {
    id: 'match-interface-goals',
    title: 'match temperature to interface goals',
    instruction: 'Choose the palette direction that best supports each interface goal.',
  },
];

export const TemperatureSorterTool = memo(function TemperatureSorterTool({
  interactive = true,
  onComplete,
  onStageChange,
}: ExerciseToolProps) {
  const [swatchAnswers, setSwatchAnswers] = useState<Record<string, Temperature | ''>>(() =>
    Object.fromEntries(SWATCHES.map((s) => [s.id, ''])),
  );
  const [goalAnswers, setGoalAnswers] = useState<Record<string, Temperature | ''>>(() =>
    Object.fromEntries(INTERFACE_GOALS.map((g) => [g.id, ''])),
  );
  const [swatchesChecked, setSwatchesChecked] = useState(false);
  const [goalsChecked, setGoalsChecked] = useState(false);
  const stageController = useExerciseStages({ stages: STAGES, onComplete, onStageChange });

  const swatchCorrect = SWATCHES.filter((s) => swatchAnswers[s.id] === s.correct).length;
  const goalCorrect = INTERFACE_GOALS.filter((g) => goalAnswers[g.id] === g.correct).length;
  const allSwatchesAnswered = SWATCHES.every((s) => swatchAnswers[s.id] !== '');
  const allGoalsAnswered = INTERFACE_GOALS.every((g) => goalAnswers[g.id] !== '');
  function handleCheckSwatches() {
    setSwatchesChecked(true);
    if (swatchCorrect === SWATCHES.length) stageController.markPassed();
    else stageController.markIncorrect();
  }

  function handleCheckGoals() {
    setGoalsChecked(true);
    if (goalCorrect >= Math.ceil(INTERFACE_GOALS.length * 0.7)) stageController.markPassed();
    else stageController.markIncorrect();
  }

  function handleRetrySwatches() {
    setSwatchesChecked(false);
  }

  function handleRetryGoals() {
    setGoalsChecked(false);
  }

  const tempColor = (t: Temperature | '') =>
    t === 'warm' ? '#f59e0b' : t === 'cool' ? '#60a5fa' : t === 'neutral' ? '#9ca3af' : 'transparent';

  return (
    <div className={shellStyles.shell}>
      <span className={shellStyles.toolLabel}>color temperature exercise</span>

      <ExerciseStage
        controller={stageController}
        incorrectFeedback={(
          <span style={{ color: 'var(--accent-warning)' }}>
            {stageController.activeStage.id === 'classify-colors'
              ? `${swatchCorrect} / ${SWATCHES.length} correct`
              : `${goalCorrect} / ${INTERFACE_GOALS.length} correct`}
          </span>
        )}
        passedFeedback={(
          <span style={{ color: 'var(--accent-success)' }}>{swatchCorrect} / {SWATCHES.length} correct</span>
        )}
        completionFeedback={(
          <span style={{ color: 'var(--accent-success)' }}>
            ✓ Color temperature exercise complete. {goalCorrect} / {INTERFACE_GOALS.length} correct.
          </span>
        )}
        onRetry={stageController.activeStage.id === 'classify-colors'
          ? handleRetrySwatches
          : handleRetryGoals}
      >

      {stageController.activeStage.id === 'classify-colors' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
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
                    border: `1px solid ${isCorrect ? 'var(--accent-success)' : isWrong ? 'var(--accent-danger)' : 'var(--border)'}`,
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
                    <span style={{ fontSize: '1rem', color: isCorrect ? 'var(--accent-success)' : isWrong ? 'var(--accent-danger)' : 'var(--muted)' }}>
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
              onClick={handleCheckSwatches}
              style={{
                alignSelf: 'flex-start',
                padding: '0.5rem 1.25rem',
                background: allSwatchesAnswered ? 'var(--accent-cta)' : 'var(--border)',
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

        </div>
      )}

      {stageController.activeStage.id === 'match-interface-goals' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
          {INTERFACE_GOALS.map((g) => {
            const chosen = goalAnswers[g.id];
            const isCorrect = goalsChecked && chosen === g.correct;
            const isWrong = goalsChecked && chosen !== '' && chosen !== g.correct;
            return (
              <div
                key={g.id}
                style={{
                  background: 'var(--surface)',
                  border: `1px solid ${isCorrect ? 'var(--accent-success)' : isWrong ? 'var(--accent-danger)' : 'var(--border)'}`,
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
                  <span style={{ fontSize: '1rem', color: isCorrect ? 'var(--accent-success)' : isWrong ? 'var(--accent-danger)' : 'var(--muted)', width: '80px' }}>
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
                background: allGoalsAnswered ? 'var(--accent-cta)' : 'var(--border)',
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

        </div>
      )}
      </ExerciseStage>
    </div>
  );
});
