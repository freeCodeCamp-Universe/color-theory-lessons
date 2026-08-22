import { memo, useState } from 'react';
import shellStyles from './ToolShell.module.css';

interface Step {
  name: string;
  description: string;
  implication: string;
}

const STEPS: Step[] = [
  {
    name: 'Light from Screen',
    description:
      'Screens emit light by activating red, green, and blue sub-pixels at different intensities.',
    implication:
      'The physical signal reaching the eye depends on display brightness, ambient light, and screen calibration.',
  },
  {
    name: 'Eye Receives Light',
    description:
      'Light passes through the cornea and lens, focusing on the retina at the back of the eye.',
    implication:
      'Physical differences in the eye, including optical lens yellowing with age, alter what signal reaches the retina.',
  },
  {
    name: 'Retina Processes Signal',
    description:
      'The retina contains cones (color-sensitive, concentrated at center) and rods (low-light, at edges). Cones come in three types sensitive to different wavelength ranges.',
    implication:
      'If some cone types are missing or less responsive, certain color distinctions become harder to perceive.',
  },
  {
    name: 'Brain Interprets Signal',
    description:
      'The brain converts retinal signals into the experience of color through complex visual processing.',
    implication:
      'Context, memory, and surrounding colors all influence final perception. Color is not just a pixel value — it is a constructed experience.',
  },
];

interface EyeDiagramToolProps {
  interactive?: boolean;
  onComplete?: () => void;
}

export const EyeDiagramTool = memo(function EyeDiagramTool({ interactive = false, onComplete }: EyeDiagramToolProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [explored, setExplored] = useState<boolean[]>(() => STEPS.map((_, idx) => idx === 0));
  const [completed, setCompleted] = useState(false);

  function handleStepClick(idx: number) {
    if (!interactive || completed) return;
    if (idx !== activeStep + 1 && idx !== activeStep) return;
    const next = [...explored];
    next[idx] = true;
    setExplored(next);
    setActiveStep(idx);
    if (next.every(Boolean) && !completed) {
      setCompleted(true);
      onComplete?.();
    }
  }

  function handleNext() {
    if (!interactive || completed) return;
    const nextIdx = activeStep + 1;
    if (nextIdx >= STEPS.length) return;
    const next = [...explored];
    next[nextIdx] = true;
    setExplored(next);
    setActiveStep(nextIdx);
    if (next.every(Boolean) && !completed) {
      setCompleted(true);
      onComplete?.();
    }
  }

  const allDone = explored.every(Boolean);

  return (
    <div className={shellStyles.shell}>
      <span className={shellStyles.toolLabel}>visual pathway</span>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '0.75rem' }}>
        {STEPS.map((step, idx) => {
          const isActive = idx === activeStep;
          const isDone = explored[idx] && !isActive;
          const isLocked = !interactive || (idx > activeStep + 1);
          const canActivate = interactive && !completed && idx === activeStep + 1;
          const descriptionId = `eye-pathway-step-${idx}-description`;
          const implicationId = `eye-pathway-step-${idx}-implication`;
          return (
            <button
              type="button"
              key={step.name}
              onClick={() => handleStepClick(idx)}
              disabled={!canActivate}
              aria-current={isActive ? 'step' : undefined}
              aria-describedby={isActive ? `${descriptionId} ${implicationId}` : undefined}
              aria-label={`${step.name}${isDone ? ', completed' : isLocked ? ', locked' : isActive ? ', current step' : ''}`}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: 'var(--radius-md)',
                border: `1px solid ${isActive ? 'var(--accent-cta)' : 'var(--border)'}`,
                background: isActive
                  ? 'color-mix(in srgb, var(--accent-cta) 10%, transparent)'
                  : isDone
                  ? 'color-mix(in srgb, var(--accent-success) 6%, transparent)'
                  : 'transparent',
                color: 'inherit',
                cursor: canActivate ? 'pointer' : 'default',
                font: 'inherit',
                opacity: isLocked ? 0.45 : 1,
                textAlign: 'left',
                transition: 'all 0.15s',
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: isActive ? '0.5rem' : 0 }}>
                <span style={{
                  width: 22, height: 22, borderRadius: '50%',
                  background: isActive ? 'var(--accent-cta)' : isDone ? 'var(--accent-success)' : 'var(--border)',
                  color: isActive || isDone ? '#111' : 'var(--muted)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.7rem', fontWeight: 700, flexShrink: 0,
                }}>
                  {isDone ? '✓' : idx + 1}
                </span>
                <strong style={{ fontSize: '0.88rem', color: isActive ? 'var(--accent-cta)' : isDone ? 'var(--accent-success)' : 'var(--primary-foreground)' }}>
                  {step.name}
                </strong>
              </span>
              {isActive && (
                <span style={{ display: 'block', paddingLeft: '1.875rem' }}>
                  <span id={descriptionId} style={{ display: 'block', fontSize: '0.82rem', lineHeight: 1.6, marginBottom: '0.4rem' }}>
                    {step.description}
                  </span>
                  <span id={implicationId} style={{ display: 'block', fontSize: '0.78rem', color: 'var(--muted)', lineHeight: 1.5 }}>
                    <em>Design implication:</em> {step.implication}
                  </span>
                </span>
              )}
            </button>
          );
        })}
      </div>

      {interactive && !allDone && activeStep < STEPS.length - 1 && (
        <button
          onClick={handleNext}
          style={{
            padding: '0.4rem 1rem',
            background: 'var(--accent-cta)',
            color: '#111',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.82rem',
          }}
        >
          next step →
        </button>
      )}

      {allDone && (
        <p style={{ color: 'var(--accent-success)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
          Full visual pathway explored. Color is a constructed experience, not a pixel value.
        </p>
      )}
    </div>
  );
});
