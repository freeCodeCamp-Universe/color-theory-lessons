import { memo, useState } from 'react';
import { ExerciseStage } from './ExerciseStage.tsx';
import shellStyles from './ToolShell.module.css';
import type { ExerciseStageDefinition, ExerciseToolProps } from './exercise-stage.ts';
import { useExerciseStages } from './useExerciseStages.ts';

interface AuditStage extends ExerciseStageDefinition {
  id: string;
  title: string;
  instruction: string;
  type: 'multi-select' | 'single-choice';
  options: string[];
  correctOptions: string[];
  correctSingle?: string;
  explanation: string;
}

const STAGES: AuditStage[] = [
  {
    id: 'priority',
    title: 'Priority elements',
    instruction: 'Which elements convey information or identify controls and need a contrast check? Select all that apply.',
    type: 'multi-select',
    options: ['Text content', 'Decorative background pattern', 'Status indicators', 'Chart series marks', 'Border that identifies a button', 'Page margin'],
    correctOptions: ['Text content', 'Status indicators', 'Chart series marks', 'Border that identifies a button'],
    explanation: 'Text and visual cues needed to identify controls, states, and graphics require contrast checks. The decorative pattern and page margin do not convey information.',
  },
  {
    id: 'contrast-check',
    title: 'Contrast check',
    instruction: 'The normal-size secondary text (#aaaaaa on white) has a contrast ratio of 2.3:1. What is your verdict?',
    type: 'single-choice',
    options: [
      'Pass because it looks readable',
      'Fail because 2.3:1 is below the 4.5:1 threshold for normal text',
      'Pass because the text is large',
      'Cannot determine without testing',
    ],
    correctOptions: [],
    correctSingle: 'Fail because 2.3:1 is below the 4.5:1 threshold for normal text',
    explanation: 'A ratio of 2.3:1 is below the 4.5:1 threshold for normal text.',
  },
  {
    id: 'cvd-sim',
    title: 'Color vision deficiency simulation',
    instruction: 'After simulating deuteranopia, the green and red status dots look similar. What should you do?',
    type: 'single-choice',
    options: [
      'Nothing because both dot colors are still visible',
      'Add a text label or icon to each dot so meaning does not depend on color alone',
      'Make the green brighter',
      'Remove one of the status colors',
    ],
    correctOptions: [],
    correctSingle: 'Add a text label or icon to each dot so meaning does not depend on color alone',
    explanation: 'Add a text label or icon so users do not have to distinguish the dot colors to identify each status.',
  },
  {
    id: 'task-verify',
    title: 'Task verification',
    instruction: 'A chart identifies its series only with colored lines and a color-only legend. What is the impact?',
    type: 'single-choice',
    options: [
      'No impact because charts are decorative',
      'Users who cannot distinguish the hues cannot tell the series apart',
      'The legend solves this',
      'Chart contrast is not part of accessibility',
    ],
    correctOptions: [],
    correctSingle: 'Users who cannot distinguish the hues cannot tell the series apart',
    explanation: 'A color-only legend still requires users to match hues. Direct labels or patterns identify each series without relying on color alone.',
  },
];

export const AuditFlowTool = memo(function AuditFlowTool({
  interactive = false,
  onComplete,
  onStageChange,
}: ExerciseToolProps) {
  const [multiSelected, setMultiSelected] = useState<string[]>([]);
  const [singleSelected, setSingleSelected] = useState<string | null>(null);
  const stageController = useExerciseStages({ stages: STAGES, onComplete, onStageChange });
  const stage = STAGES.find(({ id }) => id === stageController.activeStage.id) ?? STAGES[0];

  function toggleMulti(option: string) {
    if (!interactive || stageController.result === 'passed') return;
    setMultiSelected((prev) =>
      prev.includes(option) ? prev.filter((o) => o !== option) : [...prev, option],
    );
    stageController.retry();
  }

  function selectSingle(option: string) {
    if (!interactive || stageController.result === 'passed') return;
    setSingleSelected(option);
    stageController.retry();
  }

  function checkAnswer() {
    if (!interactive) return;
    let correct = false;
    if (stage.type === 'multi-select') {
      const sortedSelected = [...multiSelected].sort().join(',');
      const sortedCorrect = [...stage.correctOptions].sort().join(',');
      correct = sortedSelected === sortedCorrect;
    } else {
      correct = singleSelected === stage.correctSingle;
    }
    if (correct) stageController.markPassed();
    else stageController.markIncorrect();
  }

  function prepareNextStage() {
    setMultiSelected([]);
    setSingleSelected(null);
    stageController.advance();
  }

  return (
    <div className={shellStyles.shell}>
      <span className={shellStyles.toolLabel}>accessibility audit flow</span>

      <ExerciseStage
        controller={{ ...stageController, advance: prepareNextStage }}
        incorrectFeedback={(
          <span style={{ color: 'var(--accent-danger)' }}>
            Not quite. Review your selection and try again.
          </span>
        )}
        passedFeedback={<span style={{ color: 'var(--accent-success)' }}>✓ {stage.explanation}</span>}
        completionFeedback={(
          <span style={{ color: 'var(--accent-success)' }}>
            ✓ Audit activity complete. Use these four stages to structure another interface audit.
          </span>
        )}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          {stage.options.map((option) => {
            const isSelected = stage.type === 'multi-select'
              ? multiSelected.includes(option)
              : singleSelected === option;
            return (
              <label
                key={option}
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: '0.4rem',
                  fontSize: '0.78rem', cursor: interactive && stageController.result !== 'passed' ? 'pointer' : 'default',
                  padding: '0.3rem 0.5rem', borderRadius: 'var(--radius-sm)',
                  border: `1px solid ${isSelected ? 'var(--accent-warning)' : 'var(--border-strong)'}`,
                  background: isSelected ? 'color-mix(in srgb, var(--accent-warning) 6%, transparent)' : 'transparent',
                }}
              >
                <input
                  type={stage.type === 'multi-select' ? 'checkbox' : 'radio'}
                  name={stage.id}
                  checked={isSelected}
                  disabled={!interactive || stageController.result === 'passed'}
                  onChange={() => stage.type === 'multi-select' ? toggleMulti(option) : selectSingle(option)}
                  style={{ accentColor: 'var(--accent-warning)', marginTop: 2 }}
                />
                {option}
              </label>
            );
          })}
        </div>

        {interactive && stageController.result !== 'passed' && (
          <button
            onClick={checkAnswer}
            style={{
              marginTop: '0.65rem', padding: '0.35rem 0.75rem',
              fontSize: '0.78rem', borderRadius: 'var(--radius-sm)',
              border: 'none', background: 'var(--accent-cta)',
              color: 'var(--cta-foreground)', cursor: 'pointer',
            }}
          >
            Check answer
          </button>
        )}

      </ExerciseStage>
    </div>
  );
});
