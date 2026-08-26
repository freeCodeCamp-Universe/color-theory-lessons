import { memo, useState } from 'react';
import { ExerciseStage } from './ExerciseStage.tsx';
import type { ExerciseStageDefinition, ExerciseToolProps } from './exercise-stage.ts';
import shellStyles from './ToolShell.module.css';
import { useExerciseStages } from './useExerciseStages.ts';

const SYSTEM_COLORS = {
  surface: '#f3f4f6',
  secondaryText: '#4b5563',
  success: '#15803d',
  onSuccess: '#ffffff',
} as const;

const INCONSISTENCIES = [
  { id: 'btn-color', label: 'Button color', explanation: 'The action button uses #3b82f6 instead of the system\'s #1e40af action-primary color. Assign the button background to the action-primary role.' },
  { id: 'success-color', label: 'Success badge color', explanation: 'The success badge uses #14b8a6 instead of the system\'s #15803d success color. Assign the badge background to the success role.' },
  { id: 'surface-color', label: 'Card surface color', explanation: 'The second card uses #ffffff instead of the system\'s #f3f4f6 card-surface color. Assign both card backgrounds to the surface-card role.' },
  { id: 'text-weight', label: 'Secondary text lightness', explanation: 'The first card uses #9ca3af instead of the system\'s #4b5563 secondary-text color. Assign secondary text in both cards to the secondary-text role.' },
];

const STAGES: readonly ExerciseStageDefinition[] = [{
  id: 'find-inconsistencies',
  title: 'Find the system inconsistencies',
  instruction: 'Inspect the ad-hoc interface and find all four elements that do not use the system roles shown in the consistent version.',
}];

export const SystemComparisonTool = memo(function SystemComparisonTool({
  interactive = false,
  onComplete,
  onStageChange,
}: ExerciseToolProps) {
  const [found, setFound] = useState<Set<string>>(new Set());
  const [revealed, setRevealed] = useState<string | null>(null);
  const stageController = useExerciseStages({ stages: STAGES, onComplete, onStageChange });

  function handleClick(id: string) {
    if (!interactive || stageController.result === 'passed') return;
    setRevealed(id);
    if (found.has(id)) return;

    const next = new Set(found);
    next.add(id);
    setFound(next);
    if (next.size === INCONSISTENCIES.length) stageController.markPassed();
  }

  const clickableStyle = (id: string): React.CSSProperties => ({
    position: 'relative',
    cursor: interactive ? 'pointer' : 'default',
    outline: found.has(id) ? '2px solid #22c55e' : interactive ? '2px dashed #f59e0b' : 'none',
    outlineOffset: 2,
    borderRadius: 3,
  });

  return (
    <div className={shellStyles.shell}>
      <span className={shellStyles.toolLabel}>system comparison</span>

      <ExerciseStage
        controller={stageController}
        completionFeedback="All inconsistencies found. The consistent version assigns each highlighted element to its defined color role."
      >
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        {/* Ad-hoc mockup */}
        <div style={{ flex: '1 1 220px', minWidth: 200 }}>
          <p style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--muted)', marginBottom: '0.4rem' }}>
            AD-HOC {interactive && <span style={{ color: '#f59e0b' }}>(click inconsistencies)</span>}
          </p>
          <div style={{ border: '1px solid #e5e7eb', borderRadius: 6, overflow: 'hidden', fontSize: '0.8rem' }}>
            {/* Header */}
            <div style={{ background: '#2563EB', padding: '0.4rem 0.6rem', color: '#fff', fontWeight: 600 }}>My App</div>
            {/* Card 1 */}
            <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', margin: '0.5rem', padding: '0.5rem', borderRadius: 4 }}>
              <div style={{ color: '#111827', fontWeight: 600, marginBottom: '0.25rem' }}>Account Overview</div>
              {/* Inconsistency 4: secondary text too light */}
              <div
                style={clickableStyle('text-weight')}
                onClick={() => handleClick('text-weight')}
                title={interactive ? 'Click to inspect' : undefined}
              >
                <div style={{ color: '#9ca3af', fontSize: '0.75rem' }}>Last updated: today</div>
              </div>
              <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.4rem', alignItems: 'center' }}>
                {/* Inconsistency 1: different blue than header */}
                <div style={clickableStyle('btn-color')} onClick={() => handleClick('btn-color')} title={interactive ? 'Click to inspect' : undefined}>
                  <div style={{ background: '#3b82f6', color: '#fff', padding: '0.2rem 0.5rem', borderRadius: 4, fontSize: '0.75rem', display: 'inline-block' }}>
                    View
                  </div>
                </div>
                {/* Inconsistency 2: teal success badge */}
                <div style={clickableStyle('success-color')} onClick={() => handleClick('success-color')} title={interactive ? 'Click to inspect' : undefined}>
                  <div style={{ background: '#14b8a6', color: '#fff', padding: '0.2rem 0.4rem', borderRadius: 99, fontSize: '0.7rem', display: 'inline-block' }}>
                    Active
                  </div>
                </div>
              </div>
            </div>
            {/* Card 2 — Inconsistency 3: white instead of off-white */}
            <div
              style={{ ...clickableStyle('surface-color'), background: '#ffffff', border: '1px solid #e5e7eb', margin: '0 0.5rem 0.5rem', padding: '0.5rem', borderRadius: 4 }}
              onClick={() => handleClick('surface-color')}
              title={interactive ? 'Click to inspect' : undefined}
            >
              <div style={{ color: '#111827', fontWeight: 600, marginBottom: '0.25rem' }}>Settings</div>
              <div style={{ color: '#6b7280', fontSize: '0.75rem' }}>Manage your preferences</div>
            </div>
          </div>
          {interactive && (
            <p style={{ fontSize: '0.75rem', color: found.size === INCONSISTENCIES.length ? 'var(--accent-success)' : 'var(--muted)', marginTop: '0.3rem' }}>
              Found {found.size}/{INCONSISTENCIES.length} inconsistencies
            </p>
          )}
        </div>

        {/* System mockup */}
        <div style={{ flex: '1 1 220px', minWidth: 200 }}>
          <p style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--muted)', marginBottom: '0.4rem' }}>SYSTEM (consistent)</p>
          <div style={{ border: '1px solid #e5e7eb', borderRadius: 6, overflow: 'hidden', fontSize: '0.8rem' }}>
            <div style={{ background: '#1e40af', padding: '0.4rem 0.6rem', color: '#fff', fontWeight: 600 }}>My App</div>
            <div style={{ background: SYSTEM_COLORS.surface, border: '1px solid #e5e7eb', margin: '0.5rem', padding: '0.5rem', borderRadius: 4 }}>
              <div style={{ color: '#111827', fontWeight: 600, marginBottom: '0.25rem' }}>Account Overview</div>
              <div style={{ color: SYSTEM_COLORS.secondaryText, fontSize: '0.75rem' }}>Last updated: today</div>
              <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.4rem', alignItems: 'center' }}>
                <div style={{ background: '#1e40af', color: '#fff', padding: '0.2rem 0.5rem', borderRadius: 4, fontSize: '0.75rem', display: 'inline-block' }}>View</div>
                <div style={{ background: SYSTEM_COLORS.success, color: SYSTEM_COLORS.onSuccess, padding: '0.2rem 0.4rem', borderRadius: 99, fontSize: '0.7rem', display: 'inline-block' }}>Active</div>
              </div>
            </div>
            <div style={{ background: SYSTEM_COLORS.surface, border: '1px solid #e5e7eb', margin: '0 0.5rem 0.5rem', padding: '0.5rem', borderRadius: 4 }}>
              <div style={{ color: '#111827', fontWeight: 600, marginBottom: '0.25rem' }}>Settings</div>
              <div style={{ color: SYSTEM_COLORS.secondaryText, fontSize: '0.75rem' }}>Manage your preferences</div>
            </div>
          </div>
        </div>
      </div>

      {/* Explanation panel */}
      {revealed && (
        <div style={{ background: 'var(--surface, #1e293b)', border: '1px solid var(--border)', borderRadius: 4, padding: '0.6rem 0.75rem', fontSize: '0.82rem' }}>
          <strong style={{ color: 'var(--accent-cta)' }}>{INCONSISTENCIES.find(i => i.id === revealed)?.label}:</strong>{' '}
          <span style={{ color: 'var(--primary-foreground)' }}>{INCONSISTENCIES.find(i => i.id === revealed)?.explanation}</span>
        </div>
      )}
      </ExerciseStage>
    </div>
  );
});
