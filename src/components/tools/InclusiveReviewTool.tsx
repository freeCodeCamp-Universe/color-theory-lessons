import { memo, useState } from 'react';
import shellStyles from './ToolShell.module.css';

type Assessment = 'pass' | 'needs-work' | null;
type SimulationMode = 'normal' | 'deuteranopia' | 'protanopia' | 'tritanopia' | 'achromatopsia';

const SIMULATION_FILTERS = `
<svg style="position:absolute;width:0;height:0;overflow:hidden" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <defs>
    <filter id="inclusive-review-deuteranopia">
      <feColorMatrix type="matrix" values="0.625 0.375 0 0 0  0.7 0.3 0 0 0  0 0.3 0.7 0 0  0 0 0 1 0"/>
    </filter>
    <filter id="inclusive-review-protanopia">
      <feColorMatrix type="matrix" values="0.567 0.433 0 0 0  0.558 0.442 0 0 0  0 0.242 0.758 0 0  0 0 0 1 0"/>
    </filter>
    <filter id="inclusive-review-tritanopia">
      <feColorMatrix type="matrix" values="0.95 0.05 0 0 0  0 0.433 0.567 0 0  0 0.475 0.525 0 0  0 0 0 1 0"/>
    </filter>
    <filter id="inclusive-review-achromatopsia">
      <feColorMatrix type="saturate" values="0"/>
    </filter>
  </defs>
</svg>`;

const SIMULATION_MODES: { id: SimulationMode; label: string; filter: string }[] = [
  { id: 'normal', label: 'Original', filter: 'none' },
  { id: 'deuteranopia', label: 'Deuteranopia', filter: 'url(#inclusive-review-deuteranopia)' },
  { id: 'protanopia', label: 'Protanopia', filter: 'url(#inclusive-review-protanopia)' },
  { id: 'tritanopia', label: 'Tritanopia', filter: 'url(#inclusive-review-tritanopia)' },
  { id: 'achromatopsia', label: 'Complete achromatopsia', filter: 'url(#inclusive-review-achromatopsia)' },
];

interface ChecklistItem {
  id: string;
  label: string;
  detail: string;
  correctAnswer: Assessment;
}

const CHECKLIST: ChecklistItem[] = [
  {
    id: 'simulation',
    label: 'Simulation check',
    detail: 'Does the interface remain understandable under CVD simulation modes?',
    correctAnswer: 'needs-work',
  },
  {
    id: 'label-backup',
    label: 'Label backup',
    detail: 'Does every color-coded element have a text label or icon?',
    correctAnswer: 'needs-work',
  },
  {
    id: 'task-testing',
    label: 'Task-based testing',
    detail: 'Can a user complete the main task without relying on hue?',
    correctAnswer: 'needs-work',
  },
  {
    id: 'chart-distinction',
    label: 'Chart distinction',
    detail: 'Are chart series distinguishable by more than color?',
    correctAnswer: 'needs-work',
  },
  {
    id: 'form-clarity',
    label: 'Form clarity',
    detail: 'Do form errors include text messages, not just colored borders?',
    correctAnswer: 'needs-work',
  },
];

interface InclusiveReviewToolProps {
  interactive?: boolean;
  onComplete?: () => void;
}

export const InclusiveReviewTool = memo(function InclusiveReviewTool({ interactive = false, onComplete }: InclusiveReviewToolProps) {
  const [simulationMode, setSimulationMode] = useState<SimulationMode>('normal');
  const [answers, setAnswers] = useState<Record<string, Assessment>>(
    Object.fromEntries(CHECKLIST.map((c) => [c.id, null])),
  );
  const [completed, setCompleted] = useState(false);

  function setAnswer(id: string, value: Assessment) {
    if (!interactive || completed) return;
    const next = { ...answers, [id]: value };
    setAnswers(next);
    const allCorrect = CHECKLIST.every((item) => next[item.id] === item.correctAnswer);
    if (allCorrect) {
      setCompleted(true);
      onComplete?.();
    }
  }

  const answeredCount = Object.values(answers).filter((a) => a !== null).length;
  const simulationFilter = SIMULATION_MODES.find((mode) => mode.id === simulationMode)?.filter ?? 'none';

  return (
    <div className={shellStyles.shell}>
      <span className={shellStyles.toolLabel}>inclusive review</span>
      <div dangerouslySetInnerHTML={{ __html: SIMULATION_FILTERS }} />

      <div
        role="group"
        aria-label="CVD simulation mode"
        style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}
      >
        {SIMULATION_MODES.map((mode) => (
          <button
            key={mode.id}
            type="button"
            disabled={!interactive}
            aria-pressed={simulationMode === mode.id}
            onClick={() => setSimulationMode(mode.id)}
            style={{
              padding: '0.25rem 0.5rem',
              fontSize: '0.72rem',
              fontFamily: 'var(--font-mono)',
              background: simulationMode === mode.id ? 'var(--accent-cta)' : 'transparent',
              color: simulationMode === mode.id ? '#111' : 'var(--muted)',
              border: `1px solid ${simulationMode === mode.id ? 'var(--accent-cta)' : 'var(--border)'}`,
              borderRadius: 'var(--radius-sm)',
              cursor: interactive ? 'pointer' : 'default',
            }}
          >
            {mode.label}
          </button>
        ))}
      </div>

      {/* Compact mockup reference */}
      <div data-testid="inclusive-review-mockup" style={{
        border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)',
        overflow: 'hidden', marginBottom: '0.75rem', fontSize: '0.72rem', filter: simulationFilter,
      }}>
        <div style={{ background: '#1e3a5f', padding: '0.35rem 0.6rem', display: 'flex', gap: '0.75rem' }}>
          <span style={{ color: '#4da6ff', fontWeight: 600 }}>Dashboard</span>
          <span style={{ color: '#9ca3af' }}>Reports</span>
          <span style={{ color: '#9ca3af' }}>Settings</span>
        </div>
        <div style={{ background: '#f8fafc', padding: '0.5rem 0.6rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            <span style={{ background: '#22c55e', color: '#fff', padding: '0.15rem 0.4rem', borderRadius: 99 }}>Active</span>
            <span style={{ background: '#ef4444', color: '#fff', padding: '0.15rem 0.4rem', borderRadius: 99 }}>Error</span>
          </div>
          <div style={{ display: 'flex', gap: '0.3rem', alignItems: 'flex-end', height: 36 }}>
            {[{ h: 80, c: '#22c55e' }, { h: 50, c: '#ef4444' }, { h: 65, c: '#3b82f6' }].map((b) => (
              <div key={b.c} style={{ flex: 1, height: `${b.h}%`, background: b.c, borderRadius: '2px 2px 0 0' }} />
            ))}
          </div>
          <input readOnly value="bad-input" style={{ padding: '0.2rem 0.35rem', border: '2px solid #ef4444', borderRadius: 3, background: '#fff', color: '#111', width: '100%', boxSizing: 'border-box' }} />
        </div>
      </div>

      {/* Checklist */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
        {CHECKLIST.map((item) => {
          const answer = answers[item.id];
          const isCorrect = answer === item.correctAnswer;
          return (
            <div
              key={item.id}
              data-testid={`checklist-${item.id}`}
              style={{
                padding: '0.5rem 0.65rem',
                borderRadius: 'var(--radius-sm)',
                border: `1px solid ${answer ? (isCorrect ? 'var(--accent-success)' : 'var(--accent-cta)') : 'var(--border)'}`,
                background: answer
                  ? isCorrect
                    ? 'color-mix(in srgb, var(--accent-success) 6%, transparent)'
                    : 'color-mix(in srgb, var(--accent-cta) 6%, transparent)'
                  : 'transparent',
              }}
            >
              <p style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.15rem' }}>{item.label}</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--muted)', marginBottom: '0.35rem' }}>{item.detail}</p>
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                {(['pass', 'needs-work'] as Assessment[]).map((opt) => (
                  <button
                    key={opt!}
                    disabled={!interactive || completed}
                    onClick={() => setAnswer(item.id, opt)}
                    style={{
                      padding: '0.2rem 0.5rem',
                      fontSize: '0.72rem',
                      fontFamily: 'var(--font-mono)',
                      border: `1px solid ${answer === opt ? (opt === 'pass' ? 'var(--accent-success)' : 'var(--accent-cta)') : 'var(--border)'}`,
                      background: answer === opt
                        ? opt === 'pass'
                          ? 'color-mix(in srgb, var(--accent-success) 20%, transparent)'
                          : 'color-mix(in srgb, var(--accent-cta) 20%, transparent)'
                        : 'transparent',
                      borderRadius: 'var(--radius-sm)',
                      cursor: interactive && !completed ? 'pointer' : 'default',
                      color: answer === opt ? 'var(--primary-foreground)' : 'var(--muted)',
                    }}
                  >
                    {opt === 'pass' ? 'Pass' : 'Needs work'}
                  </button>
                ))}
              </div>
              {answer && !isCorrect && (
                <p style={{ fontSize: '0.7rem', color: 'var(--accent-cta)', marginTop: '0.25rem', margin: '0.25rem 0 0' }}>
                  {item.id === 'simulation'
                    ? 'The chart bars become hard to distinguish under CVD simulation and have no labels or patterns. Choose "Needs work".'
                    : 'This mockup does not meet this check. Choose "Needs work".'}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {interactive && !completed && (
        <p style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: '0.4rem' }}>
          {answeredCount}/{CHECKLIST.length} items assessed
        </p>
      )}

      {completed && (
        <p style={{ color: 'var(--accent-success)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
          Review complete. This mockup needs work on all five checks. Its chart relies on color, and its input shows an error border without a message.
        </p>
      )}
    </div>
  );
});
