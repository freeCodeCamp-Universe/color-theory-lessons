import { memo, useState } from 'react';
import { ExerciseStage } from './ExerciseStage.tsx';
import shellStyles from './ToolShell.module.css';
import type { ExerciseStageDefinition, ExerciseToolProps } from './exercise-stage.ts';
import { useExerciseStages } from './useExerciseStages.ts';
import { StatusAnnouncement } from '../accessibility/StatusAnnouncement.tsx';
import { VisualDescription } from '../accessibility/VisualDescription.tsx';

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

const SIMULATION_MODES: { id: SimulationMode; label: string; filter: string; description: string }[] = [
  { id: 'normal', label: 'Original', filter: 'none', description: 'The original view shows green Active and red Error pills, green, red, and blue chart bars, and a red input border.' },
  { id: 'deuteranopia', label: 'Deuteranopia', filter: 'url(#inclusive-review-deuteranopia)', description: 'The simulation shifts the green and red status and chart colors toward similar yellow-brown tones. The Active and Error pill labels remain visible; the chart bars still have no labels or patterns.' },
  { id: 'protanopia', label: 'Protanopia', filter: 'url(#inclusive-review-protanopia)', description: 'The simulation shifts the green and red status and chart colors toward similar yellow-brown tones. The Active and Error pill labels remain visible; the chart bars still have no labels or patterns.' },
  { id: 'tritanopia', label: 'Tritanopia', filter: 'url(#inclusive-review-tritanopia)', description: 'The simulation changes the blue and yellow color relationship. The status pill labels remain visible; the chart bars still have no labels or patterns.' },
  { id: 'achromatopsia', label: 'Complete achromatopsia', filter: 'url(#inclusive-review-achromatopsia)', description: 'The simulation removes hue, leaving the status pills and chart bars as shades of gray. The status pill labels remain visible; the chart bars still have no labels or patterns.' },
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
    detail: 'Does the interface remain understandable under color vision deficiency simulation modes?',
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
    label: 'Evidence review',
    detail: 'Can a user identify every status, chart series, and form error without relying on hue?',
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

const STAGES = [{
  id: 'assess-inclusive-evidence',
  title: 'Assess inclusive design evidence',
  instruction: 'Inspect the mockup and simulation modes, assess all five checks, then submit the stage.',
}] satisfies readonly ExerciseStageDefinition[];

export const InclusiveReviewTool = memo(function InclusiveReviewTool({
  interactive = false,
  onComplete,
  onStageChange,
}: ExerciseToolProps) {
  const [simulationMode, setSimulationMode] = useState<SimulationMode>('normal');
  const [answers, setAnswers] = useState<Record<string, Assessment>>(
    Object.fromEntries(CHECKLIST.map((c) => [c.id, null])),
  );
  const [announcement, setAnnouncement] = useState('');
  const stageController = useExerciseStages({ stages: STAGES, onComplete, onStageChange });
  const submitted = stageController.result !== 'idle';

  function setAnswer(id: string, value: Assessment) {
    if (!interactive || submitted) return;
    setAnswers((current) => ({ ...current, [id]: value }));
    const item = CHECKLIST.find((check) => check.id === id);
    setAnnouncement(`${item?.label ?? 'Checklist item'} marked ${value === 'pass' ? 'Pass' : 'Needs work'}.`);
  }

  function checkReview() {
    if (!interactive || submitted) return;
    const allCorrect = CHECKLIST.every((item) => answers[item.id] === item.correctAnswer);
    if (allCorrect) {
      setAnnouncement('Review validation complete. All five checklist items are assessed.');
      stageController.markPassed();
    } else {
      setAnnouncement('Review validation complete. One or more checklist items need another assessment.');
      stageController.markIncorrect();
    }
  }

  const answeredCount = Object.values(answers).filter((a) => a !== null).length;
  const simulationFilter = SIMULATION_MODES.find((mode) => mode.id === simulationMode)?.filter ?? 'none';

  return (
    <div className={shellStyles.shell}>
      <span className={shellStyles.toolLabel}>inclusive review</span>
      <div dangerouslySetInnerHTML={{ __html: SIMULATION_FILTERS }} />

      <ExerciseStage
        controller={stageController}
        incorrectFeedback="One or more assessments do not match the mockup evidence. Review the item feedback and try the stage again."
        completionFeedback="Review complete. The mockup needs work on all five checks."
      >
      {announcement && <StatusAnnouncement message={announcement} />}

      <div
        role="group"
        aria-label="Color vision deficiency simulation mode"
        style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}
      >
        {SIMULATION_MODES.map((mode) => (
          <button
            key={mode.id}
            type="button"
            disabled={!interactive}
            aria-pressed={simulationMode === mode.id}
            onClick={() => {
              setSimulationMode(mode.id);
              setAnnouncement(`${mode.label} simulation selected. The mockup description has updated.`);
            }}
            style={{
              padding: '0.25rem 0.5rem',
              fontSize: '0.72rem',
              fontFamily: 'var(--font-mono)',
              background: simulationMode === mode.id ? 'color-mix(in srgb, var(--accent-warning) 6%, transparent)' : 'transparent',
              color: simulationMode === mode.id ? 'var(--accent-warning)' : 'var(--muted)',
              border: `1px solid ${simulationMode === mode.id ? 'var(--accent-warning)' : 'var(--border-strong)'}`,
              borderRadius: 'var(--radius-sm)',
              cursor: interactive ? 'pointer' : 'default',
            }}
          >
            {mode.label}
          </button>
        ))}
      </div>

      {/* Compact mockup reference */}
      <VisualDescription id="inclusive-review-mockup-description">
        {`${SIMULATION_MODES.find((mode) => mode.id === simulationMode)?.label ?? 'Original'} view. A dark blue #1E3A5F navigation bar contains Dashboard in light blue #4DA6FF, Reports and Settings in gray #9CA3AF. The light #F8FAFC content area has status pills, a three-bar chart at 80, 50, and 65 percent, and a bad-input field with a red #EF4444 border and no written error message. ${SIMULATION_MODES.find((mode) => mode.id === simulationMode)?.description ?? ''}`}
      </VisualDescription>
      <div data-authored-visual data-testid="inclusive-review-mockup" style={{
        border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)',
        overflow: 'hidden', marginBottom: '0.75rem', fontSize: '0.72rem', filter: simulationFilter,
      }} aria-describedby="inclusive-review-mockup-description">
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
          const showResult = stageController.attemptedStageIds.includes(stageController.activeStage.id);
          return (
            <div
              key={item.id}
              data-testid={`checklist-${item.id}`}
              style={{
                padding: '0.5rem 0.65rem',
                borderRadius: 'var(--radius-sm)',
                border: `1px solid ${answer ? (showResult && isCorrect ? 'var(--accent-success)' : 'var(--accent-warning)') : 'var(--border)'}`,
                background: answer
                  ? showResult && isCorrect
                    ? 'color-mix(in srgb, var(--accent-success) 6%, transparent)'
                    : 'color-mix(in srgb, var(--accent-warning) 6%, transparent)'
                  : 'transparent',
              }}
            >
              <p style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.15rem' }}>{item.label}</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--muted)', marginBottom: '0.35rem' }}>{item.detail}</p>
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                {(['pass', 'needs-work'] as Assessment[]).map((opt) => (
                  <button
                    key={opt!}
                    disabled={!interactive || submitted}
                    aria-pressed={answer === opt}
                    onClick={() => setAnswer(item.id, opt)}
                    style={{
                      padding: '0.2rem 0.5rem',
                      fontSize: '0.72rem',
                      fontFamily: 'var(--font-mono)',
                      border: `1px solid ${answer === opt
                        ? showResult
                          ? isCorrect ? 'var(--accent-success)' : 'var(--accent-danger)'
                          : 'var(--accent-warning)'
                        : 'var(--border-strong)'}`,
                      background: answer === opt
                        ? showResult
                          ? `color-mix(in srgb, ${isCorrect ? 'var(--accent-success)' : 'var(--accent-danger)'} 20%, transparent)`
                          : 'color-mix(in srgb, var(--accent-warning) 6%, transparent)'
                        : 'transparent',
                      borderRadius: 'var(--radius-sm)',
                      cursor: interactive && !submitted ? 'pointer' : 'default',
                      color: answer === opt ? 'var(--primary-foreground)' : 'var(--muted)',
                    }}
                  >
                    {opt === 'pass' ? 'Pass' : 'Needs work'}
                  </button>
                ))}
              </div>
              {stageController.result === 'incorrect' && answer && !isCorrect && (
                <p style={{ fontSize: '0.7rem', color: 'var(--accent-danger)', marginTop: '0.25rem', margin: '0.25rem 0 0' }}>
                  {item.id === 'simulation'
                    ? 'The chart bars become hard to distinguish under color vision deficiency simulation and have no labels or patterns.'
                    : item.id === 'task-testing'
                      ? 'The chart has no series labels, and the form error has no text message.'
                      : 'The mockup does not provide the evidence required to pass this check.'}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {interactive && stageController.result !== 'passed' && (
        <p style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: '0.4rem' }}>
          {answeredCount}/{CHECKLIST.length} items assessed
        </p>
      )}

      {interactive && stageController.result === 'idle' && (
        <button
          type="button"
          onClick={checkReview}
          style={{
            alignSelf: 'flex-start', padding: '0.5rem 1.25rem',
            background: 'var(--accent-cta)', color: 'var(--cta-foreground)',
            fontWeight: 700, fontSize: '1rem', borderRadius: 'var(--radius-sm)',
            border: 'none', cursor: 'pointer',
          }}
        >
          check stage
        </button>
      )}
      </ExerciseStage>
    </div>
  );
});
