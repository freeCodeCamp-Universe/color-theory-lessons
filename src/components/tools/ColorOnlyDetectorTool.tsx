import { memo, useState } from 'react';
import { ExerciseStage } from './ExerciseStage.tsx';
import type { ExerciseStageDefinition, ExerciseToolProps } from './exercise-stage.ts';
import shellStyles from './ToolShell.module.css';
import { useExerciseStages } from './useExerciseStages.ts';
import { StatusAnnouncement } from '../accessibility/StatusAnnouncement.tsx';
import { VisualDescription } from '../accessibility/VisualDescription.tsx';

interface Example {
  id: string;
  name: string;
  isColorOnly: boolean;
  visual: React.ReactNode;
  correctFeedback: string;
  incorrectFeedback: string;
  description: string;
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
    correctFeedback: 'Correct. Color is the only status cue. Labels such as Error, Active, and Warning would identify each status.',
    incorrectFeedback: '',
    description: 'Three unlabeled circular dots: red, green, and amber. No text, icon, pattern, or shape distinguishes their statuses.',
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
    correctFeedback: 'Correct. The red border is the only error cue. An error icon and message would identify the field and explain the problem.',
    incorrectFeedback: '',
    description: 'A text input reading “Sample input” has a red border. No error icon or explanatory message appears.',
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
    correctFeedback: 'Correct. Color is the only series cue. Direct labels or patterns would distinguish the series.',
    incorrectFeedback: '',
    description: 'Three chart bars have heights of 80%, 55%, and 70% and are green, red, and amber. The legend names Series A, Series B, and Series C beside matching color chips; the bars themselves have no direct labels or patterns.',
  },
  {
    id: 'link-text',
    name: 'Link text',
    isColorOnly: false,
    visual: (
      <p style={{ fontSize: '0.8rem', lineHeight: 1.5, margin: 0 }}>
        Read our{' '}
        <a
          href="#"
          onClick={(e) => e.preventDefault()}
          style={{ color: '#2563eb', textDecoration: 'underline' }}
          data-target-size-exception="inline"
        >
          privacy policy
        </a>{' '}
        for details.
      </p>
    ),
    correctFeedback: '',
    incorrectFeedback: 'This link also has an underline, so viewers do not need its blue hue to identify it as a link.',
    description: 'The words “privacy policy” appear in blue and underlined within a sentence.',
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
    incorrectFeedback: 'The icon and message identify the error even if the red hue is hard to perceive.',
    description: 'A text input reading “bad@” has a red border. A nearby X icon precedes the text “Please enter a valid email.”',
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
    incorrectFeedback: 'Bold text and a bottom border identify the selected tab without color.',
    description: 'Three tabs read Overview, Details, and Settings. Overview is bold with a bottom border as well as blue text.',
  },
];

const STAGES: readonly ExerciseStageDefinition[] = [{
  id: 'identify-color-only-cues',
  title: 'Identify color-only meaning',
  instruction: 'Select the three examples where hue is the only visual cue, then check your answer.',
}];

const PROBLEM_COUNT = EXAMPLES.filter((example) => example.isColorOnly).length;

export const ColorOnlyDetectorTool = memo(function ColorOnlyDetectorTool({
  interactive = false,
  onComplete,
  onStageChange,
}: ExerciseToolProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [selectionAnnouncement, setSelectionAnnouncement] = useState('');
  const stageController = useExerciseStages({ stages: STAGES, onComplete, onStageChange });

  function toggleExample(id: string) {
    if (!interactive || stageController.result !== 'idle') return;
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
    const example = EXAMPLES.find((candidate) => candidate.id === id);
    setSelectionAnnouncement(`${example?.name} ${next.has(id) ? 'selected' : 'not selected'}. ${next.size} of ${PROBLEM_COUNT} examples selected.`);
  }

  function checkAnswer() {
    const isCorrect = selected.size === PROBLEM_COUNT
      && EXAMPLES.every((example) => selected.has(example.id) === example.isColorOnly);
    if (isCorrect) stageController.markPassed();
    else stageController.markIncorrect();
  }

  return (
    <div className={shellStyles.shell}>
      <span className={shellStyles.toolLabel}>color-only detector</span>
      {selectionAnnouncement && <StatusAnnouncement message={selectionAnnouncement} />}

      <ExerciseStage
        controller={stageController}
        incorrectFeedback="That selection includes a redundant-cue example or misses a color-only example. Review the cues and try again."
        completionFeedback="You found all three examples that rely on hue alone. Each one needs a label, icon, pattern, or another non-color cue."
      >
        <p style={{ fontSize: '0.78rem', color: 'var(--muted)', marginBottom: '0.6rem' }}>
          {selected.size}/3 examples selected
        </p>

        <div className={shellStyles.twoColumnGrid} style={{ gap: '0.5rem' }}>
          {EXAMPLES.map((example) => {
            const isSelected = selected.has(example.id);
            const showCorrect = stageController.result === 'passed' && example.isColorOnly;
            const showIncorrect = stageController.result === 'incorrect' && isSelected && !example.isColorOnly;
            return (
              <div
                key={example.id}
                style={{
                  padding: '0.6rem',
                  borderRadius: 'var(--radius-md)',
                  border: `1px solid ${showCorrect ? 'var(--accent-success)' : showIncorrect ? 'var(--accent-danger)' : isSelected ? 'var(--accent-warning)' : 'var(--border-strong)'}`,
                  background: showCorrect
                    ? 'color-mix(in srgb, var(--accent-success) 8%, transparent)'
                    : showIncorrect
                      ? 'color-mix(in srgb, var(--accent-danger) 8%, transparent)'
                      : 'transparent',
                }}
              >
                <p style={{ fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--primary-foreground)' }}>
                  {example.name}
                </p>
                <div data-authored-visual aria-describedby={`color-only-example-${example.id}-description`} style={{ marginBottom: '0.4rem' }}>
                  <div aria-hidden={example.id === 'link-text' ? undefined : 'true'}>{example.visual}</div>
                </div>
                <VisualDescription id={`color-only-example-${example.id}-description`}>
                  {example.description}
                </VisualDescription>
                {interactive && (
                  <button
                    type="button"
                    aria-pressed={isSelected}
                    aria-label={`${isSelected ? 'Deselect' : 'Select'} ${example.name} example`}
                    disabled={stageController.result !== 'idle'}
                    onClick={() => toggleExample(example.id)}
                  >
                    {isSelected ? 'selected' : 'select example'}
                  </button>
                )}
                {showCorrect && (
                  <p style={{ fontSize: '0.72rem', color: 'var(--accent-success)', margin: 0 }}>
                    ✓ {example.correctFeedback}
                  </p>
                )}
                {showIncorrect && (
                  <p style={{ fontSize: '0.72rem', color: 'var(--accent-danger)', margin: 0 }}>
                    {example.incorrectFeedback}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {interactive && stageController.result === 'idle' && (
          <button type="button" onClick={checkAnswer} disabled={selected.size !== PROBLEM_COUNT}>
            check selections
          </button>
        )}
      </ExerciseStage>
    </div>
  );
});
