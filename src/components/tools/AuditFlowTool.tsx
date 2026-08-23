import { memo, useState } from 'react';
import shellStyles from './ToolShell.module.css';

interface AuditStage {
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
    title: 'Stage 1: Priority Elements',
    instruction: 'Which elements convey information or identify controls and need a contrast check? Select all that apply.',
    type: 'multi-select',
    options: ['Text content', 'Decorative background pattern', 'Status indicators', 'Chart series marks', 'Border that identifies a button', 'Page margin'],
    correctOptions: ['Text content', 'Status indicators', 'Chart series marks', 'Border that identifies a button'],
    explanation: 'Text and visual cues needed to identify controls, states, and graphics require contrast checks. The decorative pattern and page margin do not convey information.',
  },
  {
    id: 'contrast-check',
    title: 'Stage 2: Contrast Check',
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
    title: 'Stage 3: CVD Simulation',
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
    title: 'Stage 4: Task Verification',
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

interface AuditFlowToolProps {
  interactive?: boolean;
  onComplete?: () => void;
}

export const AuditFlowTool = memo(function AuditFlowTool({ interactive = false, onComplete }: AuditFlowToolProps) {
  const [currentStage, setCurrentStage] = useState(0);
  const [multiSelected, setMultiSelected] = useState<string[]>([]);
  const [singleSelected, setSingleSelected] = useState<string | null>(null);
  const [stageResult, setStageResult] = useState<'correct' | 'incorrect' | null>(null);
  const [completedStages, setCompletedStages] = useState<string[]>([]);
  const [completed, setCompleted] = useState(false);

  const stage = STAGES[currentStage];

  function toggleMulti(option: string) {
    if (!interactive || stageResult === 'correct') return;
    setMultiSelected((prev) =>
      prev.includes(option) ? prev.filter((o) => o !== option) : [...prev, option],
    );
    setStageResult(null);
  }

  function selectSingle(option: string) {
    if (!interactive || stageResult === 'correct') return;
    setSingleSelected(option);
    setStageResult(null);
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
    setStageResult(correct ? 'correct' : 'incorrect');
    if (correct) {
      const newCompleted = [...completedStages, stage.id];
      setCompletedStages(newCompleted);
      if (newCompleted.length === STAGES.length && !completed) {
        setCompleted(true);
        onComplete?.();
      }
    }
  }

  function advance() {
    if (currentStage < STAGES.length - 1) {
      setCurrentStage((s) => s + 1);
      setMultiSelected([]);
      setSingleSelected(null);
      setStageResult(null);
    }
  }

  return (
    <div className={shellStyles.shell}>
      <span className={shellStyles.toolLabel}>accessibility audit flow</span>

      {/* Stage progress */}
      <div style={{ display: 'flex', gap: '0.3rem' }}>
        {STAGES.map((s, i) => (
          <div
            key={s.id}
            style={{
              flex: 1, height: 4, borderRadius: 2,
              background: completedStages.includes(s.id)
                ? 'var(--accent-success)'
                : i === currentStage
                ? 'var(--accent-cta)'
                : 'var(--border)',
            }}
          />
        ))}
      </div>
      <p style={{ fontSize: '0.72rem', color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>
        Stage {currentStage + 1} of {STAGES.length}: {completedStages.length} complete
      </p>

      {/* Current stage */}
      <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '0.75rem' }}>
        <p style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.35rem', color: 'var(--primary-foreground)' }}>
          {stage.title}
        </p>
        <p style={{ fontSize: '0.78rem', color: 'var(--muted)', marginBottom: '0.65rem' }}>
          {stage.instruction}
        </p>

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
                  fontSize: '0.78rem', cursor: interactive && stageResult !== 'correct' ? 'pointer' : 'default',
                  padding: '0.3rem 0.5rem', borderRadius: 'var(--radius-sm)',
                  border: `1px solid ${isSelected ? 'var(--accent-cta)' : 'var(--border)'}`,
                  background: isSelected ? 'color-mix(in srgb, var(--accent-cta) 10%, transparent)' : 'transparent',
                }}
              >
                <input
                  type={stage.type === 'multi-select' ? 'checkbox' : 'radio'}
                  name={stage.id}
                  checked={isSelected}
                  disabled={!interactive || stageResult === 'correct'}
                  onChange={() => stage.type === 'multi-select' ? toggleMulti(option) : selectSingle(option)}
                  style={{ accentColor: 'var(--accent-cta)', marginTop: 2 }}
                />
                {option}
              </label>
            );
          })}
        </div>

        {interactive && stageResult !== 'correct' && (
          <button
            onClick={checkAnswer}
            style={{
              marginTop: '0.65rem', padding: '0.35rem 0.75rem',
              fontSize: '0.78rem', borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--accent-cta)', background: 'color-mix(in srgb, var(--accent-cta) 15%, transparent)',
              color: 'var(--primary-foreground)', cursor: 'pointer',
            }}
          >
            Check answer
          </button>
        )}

        {stageResult === 'incorrect' && (
          <p style={{ fontSize: '0.75rem', color: 'var(--accent-danger)', marginTop: '0.4rem' }}>
            Not quite. Review your selection and try again.
          </p>
        )}

        {stageResult === 'correct' && (
          <div style={{ marginTop: '0.4rem' }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--accent-success)' }}>
              ✓ {stage.explanation}
            </p>
            {currentStage < STAGES.length - 1 && (
              <button
                onClick={advance}
                style={{
                  marginTop: '0.4rem', padding: '0.3rem 0.65rem',
                  fontSize: '0.75rem', borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--accent-success)', background: 'color-mix(in srgb, var(--accent-success) 10%, transparent)',
                  color: 'var(--primary-foreground)', cursor: 'pointer',
                }}
              >
                Next stage →
              </button>
            )}
          </div>
        )}
      </div>

      {completed && (
        <p style={{ color: 'var(--accent-success)', fontSize: '0.85rem' }}>
          ✓ Audit activity complete. Use these four stages to structure another interface audit.
        </p>
      )}
    </div>
  );
});
