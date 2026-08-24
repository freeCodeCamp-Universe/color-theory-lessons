import { memo, useState } from 'react';
import shellStyles from './ToolShell.module.css';

type Assessment = 'pass' | 'needs-work' | null;

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
    detail: 'Did you view the interface under CVD simulation modes?',
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
  const [answers, setAnswers] = useState<Record<string, Assessment>>(
    Object.fromEntries(CHECKLIST.map((c) => [c.id, null])),
  );
  const [completed, setCompleted] = useState(false);

  function setAnswer(id: string, value: Assessment) {
    if (!interactive || completed) return;
    setAnswers((prev) => {
      const next = { ...prev, [id]: value };
      const allAnswered = CHECKLIST.every((c) => next[c.id] !== null);
      if (allAnswered && !completed) {
        setCompleted(true);
        onComplete?.();
      }
      return next;
    });
  }

  const answeredCount = Object.values(answers).filter((a) => a !== null).length;

  return (
    <div className={shellStyles.shell}>
      <span className={shellStyles.toolLabel}>inclusive review</span>

      {/* Compact mockup reference */}
      <div style={{
        border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)',
        overflow: 'hidden', marginBottom: '0.75rem', fontSize: '0.72rem',
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
                  This mockup does not meet this check. Choose "Needs work."
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
