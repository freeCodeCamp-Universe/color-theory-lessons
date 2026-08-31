import { memo, useState } from 'react';
import { contrastRatioWcag, hexToRgb } from '../../utils/color.ts';
import { ExerciseStage } from './ExerciseStage.tsx';
import shellStyles from './ToolShell.module.css';
import type { ExerciseStageDefinition, ExerciseToolProps } from './exercise-stage.ts';
import { useExerciseStages } from './useExerciseStages.ts';
import { StatusAnnouncement } from '../accessibility/StatusAnnouncement.tsx';
import { VisualDescription } from '../accessibility/VisualDescription.tsx';

const WHITE: ReturnType<typeof hexToRgb> = { r: 255, g: 255, b: 255 };
const THRESHOLD = 3;

interface Component {
  id: string;
  label: string;
  defaultColor: string;
  description: string;
  renderPreview: (color: string) => React.ReactNode;
}

const COMPONENTS: Component[] = [
  {
    id: 'input-border',
    label: 'Input border',
    defaultColor: '#e5e7eb',
    description: 'Input border against white.',
    renderPreview: (color) => (
      <input
        readOnly
        value="Enter email…"
        style={{
          padding: '0.4rem 0.6rem', fontSize: '0.8rem',
          border: `2px solid ${color}`, borderRadius: 4,
          background: '#ffffff', color: '#111', width: '100%',
          boxSizing: 'border-box',
        }}
      />
    ),
  },
  {
    id: 'icon-button',
    label: 'Icon button',
    defaultColor: '#9ca3af',
    description: 'Gear icon against white.',
    renderPreview: (color) => (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#ffffff', borderRadius: 4, width: 40, height: 40, border: '1px solid #f3f4f6' }}>
        <span style={{ fontSize: '1.2rem', color }}>⚙</span>
      </div>
    ),
  },
  {
    id: 'focus-ring',
    label: 'Focus ring',
    defaultColor: '#bfdbfe',
    description: 'Focus outline against white.',
    renderPreview: (color) => (
      <button
        style={{
          padding: '0.35rem 0.8rem', fontSize: '0.8rem',
          background: '#ffffff', color: '#111',
          border: '1px solid #d1d5db', borderRadius: 4,
          outline: `3px solid ${color}`, outlineOffset: 2,
          cursor: 'default',
        }}
      >
        Save
      </button>
    ),
  },
  {
    id: 'toggle',
    label: 'Toggle track',
    defaultColor: '#e5e7eb',
    description: 'Off-state toggle track against white.',
    renderPreview: (color) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <div style={{ width: 36, height: 20, borderRadius: 10, background: color, position: 'relative', border: '1px solid rgba(0,0,0,0.1)' }}>
          <div style={{ position: 'absolute', left: 2, top: 2, width: 16, height: 16, borderRadius: '50%', background: '#ffffff', boxShadow: '0 1px 2px rgba(0,0,0,0.2)' }} />
        </div>
        <span style={{ fontSize: '0.78rem', color: '#333' }}>Notifications off</span>
      </div>
    ),
  },
];

function isValidHex(hex: string): boolean {
  return /^#[0-9a-fA-F]{6}$/.test(hex);
}

function calcRatio(hex: string): number {
  try {
    return contrastRatioWcag(hexToRgb(hex), WHITE);
  } catch {
    return 1;
  }
}

function formatRatio(ratio: number): string {
  return (Math.floor(ratio * 100) / 100).toFixed(2);
}

const STAGES = [{
  id: 'repair-component-contrast',
  title: 'Repair component contrast',
  instruction: 'Adjust all four component colors to at least 3:1 contrast against white, then check the stage.',
}] satisfies readonly ExerciseStageDefinition[];

export const ComponentCheckerTool = memo(function ComponentCheckerTool({
  interactive = false,
  onComplete,
  onStageChange,
}: ExerciseToolProps) {
  const [colors, setColors] = useState<Record<string, string>>(
    Object.fromEntries(COMPONENTS.map((c) => [c.id, c.defaultColor])),
  );
  const stageController = useExerciseStages({ stages: STAGES, onComplete, onStageChange });
  const passed = Object.fromEntries(COMPONENTS.map((component) => [
    component.id,
    isValidHex(colors[component.id]) && calcRatio(colors[component.id]) >= THRESHOLD,
  ]));

  function handleChange(id: string, val: string) {
    if (!interactive || stageController.result === 'passed') return;
    setColors((prev) => ({ ...prev, [id]: val }));
    stageController.retry();
  }

  const passedCount = Object.values(passed).filter(Boolean).length;
  const showResults = stageController.attemptedStageIds.includes(stageController.activeStage.id);

  function checkRepairs() {
    if (!interactive) return;
    if (passedCount === COMPONENTS.length) stageController.markPassed();
    else stageController.markIncorrect();
  }

  return (
    <div className={shellStyles.shell}>
      <span className={shellStyles.toolLabel}>component visibility checker</span>

      <ExerciseStage
        controller={stageController}
        incorrectFeedback="Not all components meet 3:1 yet. Adjust the failing colors and check again."
        completionFeedback="All four components have at least 3:1 contrast against white."
      >
        {interactive && showResults && <StatusAnnouncement message={`Validation complete. ${passedCount} of ${COMPONENTS.length} components meet the 3 to 1 contrast threshold.`} />}
        {interactive && showResults && (
          <p style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>
            Passing components: {passedCount} of {COMPONENTS.length}.
          </p>
        )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {COMPONENTS.map((comp) => {
          const color = colors[comp.id];
          const ratio = isValidHex(color) ? calcRatio(color) : 1;
          const pass = ratio >= THRESHOLD;

          return (
            <div
              key={comp.id}
              style={{
                border: `1px solid ${showResults && pass ? 'var(--accent-success)' : 'var(--border)'}`,
                borderRadius: 'var(--radius-md)',
                padding: '0.65rem',
                background: showResults && pass ? 'color-mix(in srgb, var(--accent-success) 6%, transparent)' : 'transparent',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.72rem', color: 'var(--muted)', textTransform: 'uppercase' }}>
                  {comp.label}
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: showResults ? (pass ? 'var(--accent-success)' : 'var(--accent-danger)') : 'var(--muted)' }}>
                  {formatRatio(ratio)}:1{showResults ? `, ${pass ? 'PASS' : 'FAIL'}` : ''}
                </span>
              </div>

              <VisualDescription id={`component-${comp.id}-description`}>
                {`${comp.label} preview. ${comp.description} Component color: ${color}. White background: #FFFFFF. Current contrast ratio: ${formatRatio(ratio)} to 1.${showResults ? ` Result: ${pass ? 'pass' : 'fail'}.` : ''}`}
              </VisualDescription>
              {/* Preview on white */}
              <div data-authored-visual aria-describedby={`component-${comp.id}-description`} style={{ background: '#ffffff', padding: '0.5rem', borderRadius: 'var(--radius-sm)', marginBottom: '0.4rem', border: '1px solid #f0f0f0' }}>
                {comp.renderPreview(isValidHex(color) ? color : comp.defaultColor)}
              </div>

              {interactive && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                  <div style={{ width: 20, height: 20, borderRadius: 3, background: isValidHex(color) ? color : '#ccc', border: '1px solid var(--border)', flexShrink: 0 }} />
                  <input
                    type="text"
                    value={color}
                    disabled={stageController.result === 'passed'}
                    onChange={(e) => handleChange(comp.id, e.target.value)}
                    style={{
                      fontFamily: 'var(--font-mono)', fontSize: '0.78rem',
                      padding: '0.2rem 0.4rem', borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-strong)', background: 'var(--surface)',
                      color: 'var(--primary-foreground)', width: '7rem', maxWidth: '100%', minWidth: 0, flex: '1 1 7rem',
                    }}
                    aria-label={`${comp.label} hex color`}
                    aria-describedby={`component-${comp.id}-description`}
                  />
                  <span style={{ fontSize: '0.72rem', color: 'var(--muted)', flex: '1 1 100%' }}>{comp.description}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

        {interactive && stageController.result !== 'passed' && (
          <button
            type="button"
            onClick={checkRepairs}
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
