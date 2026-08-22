import { memo, useState } from 'react';
import shellStyles from './ToolShell.module.css';

interface Step {
  name: string;
  description: string;
  implication: string;
}

const STEPS: Step[] = [
  {
    name: 'Light from the screen',
    description:
      'Screens produce colors by controlling the light from red, green, and blue subpixels.',
    implication:
      'The spectrum and intensity of the light reaching the eye depend on the display, its settings, and the viewing environment.',
  },
  {
    name: 'The eye receives light',
    description:
      'The cornea and lens focus incoming light onto the retina at the back of the eye.',
    implication:
      'As the lens yellows with age, it transmits less short-wavelength light. This changes the light that reaches the retina.',
  },
  {
    name: 'The retina processes signals',
    description:
      'Cones support color vision and are most densely packed in the fovea, at the center of the retina. Rods support vision in dim light and are more numerous away from the fovea. Most people have three types of cones with different wavelength sensitivity ranges.',
    implication:
      'Differences in cone types or their sensitivity can make some colors harder to distinguish.',
  },
  {
    name: 'The brain interprets signals',
    description:
      'Neural pathways carry processed retinal signals to the brain, which uses them to produce the experience of color.',
    implication:
      'Surrounding colors and other visual context can change how a color appears even when its pixel value stays the same.',
  },
];

interface EyeDiagramToolProps {
  interactive?: boolean;
  onComplete?: () => void;
}

export const EyeDiagramTool = memo(function EyeDiagramTool({ interactive = false, onComplete }: EyeDiagramToolProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [explored, setExplored] = useState<boolean[]>(STEPS.map(() => false));
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
          return (
            <div
              key={step.name}
              onClick={() => handleStepClick(idx)}
              style={{
                padding: '0.75rem',
                borderRadius: 'var(--radius-md)',
                border: `1px solid ${isActive ? 'var(--accent-cta)' : 'var(--border)'}`,
                background: isActive
                  ? 'color-mix(in srgb, var(--accent-cta) 10%, transparent)'
                  : isDone
                  ? 'color-mix(in srgb, var(--accent-success) 6%, transparent)'
                  : 'transparent',
                cursor: interactive && !isLocked && !completed ? 'pointer' : 'default',
                opacity: isLocked ? 0.45 : 1,
                transition: 'all 0.15s',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: isActive ? '0.5rem' : 0 }}>
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
              </div>
              {isActive && (
                <div style={{ paddingLeft: '1.875rem' }}>
                  <p style={{ fontSize: '0.82rem', lineHeight: 1.6, marginBottom: '0.4rem' }}>
                    {step.description}
                  </p>
                  <p style={{ fontSize: '0.78rem', color: 'var(--muted)', lineHeight: 1.5, margin: 0 }}>
                    <em>Design implication:</em> {step.implication}
                  </p>
                </div>
              )}
            </div>
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
          You explored the full visual pathway from the screen to the brain.
        </p>
      )}
    </div>
  );
});
