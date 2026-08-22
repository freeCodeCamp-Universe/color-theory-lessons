import { memo, useState } from 'react';
import shellStyles from './ToolShell.module.css';

interface Example {
  id: string;
  name: string;
  isColorOnly: boolean;
  visual: React.ReactNode;
  correctFeedback: string;
  incorrectFeedback: string;
}

const EXAMPLES: Example[] = [
  {
    id: 'status-dots',
    name: 'Status dots',
    isColorOnly: true,
    visual: (
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        {[
          { color: '#ef4444' },
          { color: '#22c55e' },
          { color: '#f59e0b' },
        ].map((dot) => (
          <span
            key={dot.color}
            style={{
              width: 12, height: 12, borderRadius: '50%',
              background: dot.color, display: 'inline-block',
            }}
          />
        ))}
      </div>
    ),
    correctFeedback: 'Correct — color-only. Adding a label (Error / Active / Warning) would fix this.',
    incorrectFeedback: '',
  },
  {
    id: 'form-validation',
    name: 'Form validation',
    isColorOnly: true,
    visual: (
      <input
        readOnly
        value="Sample input"
        style={{
          padding: '0.25rem 0.4rem', fontSize: '0.78rem',
          border: '2px solid #ef4444', borderRadius: 3, background: '#fff', color: '#111',
          width: '100%', boxSizing: 'border-box',
        }}
      />
    ),
    correctFeedback: 'Correct — color-only. An error icon and text message would fix this.',
    incorrectFeedback: '',
  },
  {
    id: 'chart-series',
    name: 'Chart series',
    isColorOnly: true,
    visual: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
        <div style={{ display: 'flex', gap: '0.3rem', alignItems: 'flex-end', height: 44 }}>
          {[
            { h: 80, color: '#22c55e' },
            { h: 55, color: '#ef4444' },
            { h: 70, color: '#f59e0b' },
          ].map((bar) => (
            <div
              key={bar.color}
              style={{
                flex: 1, height: `${bar.h}%`, background: bar.color,
                borderRadius: '3px 3px 0 0',
              }}
            />
          ))}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', fontSize: '0.68rem' }}>
          {[
            { label: 'Series A', color: '#22c55e' },
            { label: 'Series B', color: '#ef4444' },
            { label: 'Series C', color: '#f59e0b' },
          ].map((series) => (
            <span key={series.label} style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
              <span
                style={{
                  width: 10, height: 10, background: series.color,
                  display: 'inline-block',
                }}
              />
              {series.label}
            </span>
          ))}
        </div>
      </div>
    ),
    correctFeedback: 'Correct — color-only. Direct labels or patterns on each bar would fix this.',
    incorrectFeedback: '',
  },
  {
    id: 'link-text',
    name: 'Link text',
    isColorOnly: false,
    visual: (
      <p style={{ fontSize: '0.8rem', lineHeight: 1.5, margin: 0 }}>
        Read our{' '}
        <a href="#" onClick={(e) => e.preventDefault()} style={{ color: '#2563eb', textDecoration: 'underline' }}>
          privacy policy
        </a>{' '}
        for details.
      </p>
    ),
    correctFeedback: '',
    incorrectFeedback: 'Not quite — this link has an underline as a backup cue, so it is not color-only.',
  },
  {
    id: 'error-message',
    name: 'Error message',
    isColorOnly: false,
    visual: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
        <input
          readOnly
          value="bad@"
          style={{
            padding: '0.25rem 0.4rem', fontSize: '0.78rem',
            border: '2px solid #ef4444', borderRadius: 3, background: '#fff', color: '#111',
            width: '100%', boxSizing: 'border-box',
          }}
        />
        <span style={{ fontSize: '0.72rem', color: '#ef4444', display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
          <span>✕</span> Please enter a valid email
        </span>
      </div>
    ),
    correctFeedback: '',
    incorrectFeedback: 'Not quite — this one has an error icon and text message backing up the color.',
  },
  {
    id: 'selected-tab',
    name: 'Selected tab',
    isColorOnly: false,
    visual: (
      <div style={{ display: 'flex', gap: '0' }}>
        {['Overview', 'Details', 'Settings'].map((tab, i) => (
          <div
            key={tab}
            style={{
              padding: '0.3rem 0.6rem',
              fontSize: '0.78rem',
              fontWeight: i === 0 ? 700 : 400,
              borderBottom: i === 0 ? '2px solid #2563eb' : '2px solid transparent',
              color: i === 0 ? '#2563eb' : '#6b7280',
              cursor: 'default',
            }}
          >
            {tab}
          </div>
        ))}
      </div>
    ),
    correctFeedback: '',
    incorrectFeedback: 'Not quite — the selected tab has bold text and a bottom border as backup cues.',
  },
];

interface ColorOnlyDetectorToolProps {
  interactive?: boolean;
  onComplete?: () => void;
}

export const ColorOnlyDetectorTool = memo(function ColorOnlyDetectorTool({ interactive = false, onComplete }: ColorOnlyDetectorToolProps) {
  const [feedback, setFeedback] = useState<Record<string, 'correct' | 'incorrect' | null>>({});
  const [identified, setIdentified] = useState<Set<string>>(new Set());
  const [completed, setCompleted] = useState(false);

  const PROBLEM_COUNT = EXAMPLES.filter((e) => e.isColorOnly).length;

  function handleClick(ex: Example) {
    if (!interactive || completed) return;
    if (ex.isColorOnly) {
      setFeedback((prev) => ({ ...prev, [ex.id]: 'correct' }));
      setIdentified((prev) => {
        const next = new Set(prev);
        next.add(ex.id);
        if (next.size === PROBLEM_COUNT && !completed) {
          setCompleted(true);
          onComplete?.();
        }
        return next;
      });
    } else {
      setFeedback((prev) => ({ ...prev, [ex.id]: 'incorrect' }));
    }
  }

  return (
    <div className={shellStyles.shell}>
      <span className={shellStyles.toolLabel}>color-only detector</span>

      {interactive && (
        <p style={{ fontSize: '0.78rem', color: 'var(--muted)', marginBottom: '0.6rem' }}>
          Click all examples where meaning depends <strong>only</strong> on color with no backup cue.
          ({identified.size}/{PROBLEM_COUNT} found)
        </p>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
        {EXAMPLES.map((ex) => {
          const fb = feedback[ex.id];
          const isCorrect = fb === 'correct';
          const isWrong = fb === 'incorrect';
          return (
            <div
              key={ex.id}
              onClick={() => handleClick(ex)}
              style={{
                padding: '0.6rem',
                borderRadius: 'var(--radius-md)',
                border: `1px solid ${isCorrect ? 'var(--accent-success)' : isWrong ? 'var(--accent-danger)' : 'var(--border)'}`,
                background: isCorrect
                  ? 'color-mix(in srgb, var(--accent-success) 8%, transparent)'
                  : isWrong
                  ? 'color-mix(in srgb, var(--accent-danger) 8%, transparent)'
                  : 'transparent',
                cursor: interactive && !isCorrect && !completed ? 'pointer' : 'default',
              }}
            >
              <p style={{ fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--primary-foreground)' }}>
                {ex.name}
              </p>
              <div style={{ marginBottom: '0.4rem' }}>{ex.visual}</div>
              {isCorrect && (
                <p style={{ fontSize: '0.72rem', color: 'var(--accent-success)', margin: 0 }}>
                  ✓ {ex.correctFeedback}
                </p>
              )}
              {isWrong && (
                <p style={{ fontSize: '0.72rem', color: 'var(--accent-danger)', margin: 0 }}>
                  {ex.incorrectFeedback}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {completed && (
        <p style={{ color: 'var(--accent-success)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
          All color-only problems identified. Every one of them needs a backup cue.
        </p>
      )}
    </div>
  );
});
