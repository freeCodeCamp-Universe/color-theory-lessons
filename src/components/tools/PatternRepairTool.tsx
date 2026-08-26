import { memo, useState } from 'react';
import { ExerciseStage } from './ExerciseStage.tsx';
import shellStyles from './ToolShell.module.css';
import type { ExerciseStageDefinition, ExerciseToolProps } from './exercise-stage.ts';
import { useExerciseStages } from './useExerciseStages.ts';

interface Module {
  id: string;
  name: string;
  repairOptions: string[];
  isValidRepair: (checked: string[]) => boolean;
  invalidFeedback: (checked: string[]) => string;
  brokenPreview: React.ReactNode;
  repairedPreview: (checked: string[]) => React.ReactNode;
}

const CHART_SERIES = [
  { h: 75, color: '#22c55e', label: 'Series A', val: '75', patternAngle: 45 },
  { h: 50, color: '#ef4444', label: 'Series B', val: '50', patternAngle: 0 },
];

const SERVICE_STATUSES = [
  { service: 'Payments API', color: '#22c55e', status: 'Operational', icon: '✓' },
  { service: 'Email service', color: '#eab308', status: 'Degraded', icon: '⚠' },
  { service: 'User database', color: '#ef4444', status: 'Offline', icon: '✕' },
];

function chartPattern(color: string, angle: number, repeat = 6) {
  return `repeating-linear-gradient(${angle}deg, ${color}, ${color} 2px, transparent 2px, transparent ${repeat}px)`;
}

const MODULES: Module[] = [
  {
    id: 'form-validation',
    name: 'Form validation',
    repairOptions: ['Add error icon ✕', 'Add error message text', 'Make label bold and red'],
    isValidRepair: (checked) => checked.includes('Add error message text'),
    invalidFeedback: () => 'The form does not explain what is wrong. A visible error description is still missing.',
    brokenPreview: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        <label style={{ fontSize: '0.72rem', color: '#374151' }}>Email address</label>
        <input readOnly value="not-valid" style={{ padding: '0.3rem 0.4rem', fontSize: '0.75rem', border: '2px solid #ef4444', borderRadius: 3, width: '100%', boxSizing: 'border-box', background: '#fff' }} />
      </div>
    ),
    repairedPreview: (checked) => (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        <label style={{ fontSize: '0.72rem', color: checked.includes('Make label bold and red') ? '#ef4444' : '#374151', fontWeight: checked.includes('Make label bold and red') ? 700 : 400 }}>Email address</label>
        <input readOnly value="not-valid" style={{ padding: '0.3rem 0.4rem', fontSize: '0.75rem', border: '2px solid #ef4444', borderRadius: 3, width: '100%', boxSizing: 'border-box', background: '#fff' }} />
        {(checked.includes('Add error icon ✕') || checked.includes('Add error message text')) && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            {checked.includes('Add error icon ✕') && <span style={{ color: '#ef4444', fontWeight: 700, fontSize: '0.8rem' }}>✕</span>}
            {checked.includes('Add error message text') && <span style={{ color: '#ef4444', fontSize: '0.7rem' }}>Please enter a valid email address</span>}
          </div>
        )}
      </div>
    ),
  },
  {
    id: 'link-paragraph',
    name: 'Link paragraph',
    repairOptions: ['Add underline to links', 'Add bold weight to links', 'Add › arrow indicator'],
    isValidRepair: (checked) => checked.length >= 1,
    invalidFeedback: () => 'The links need a non-color cue that distinguishes them from the surrounding text.',
    brokenPreview: (
      <p style={{ fontSize: '0.75rem', color: '#374151', lineHeight: 1.6, margin: 0 }}>
        For more information, read our{' '}
        <span style={{ color: '#2563eb' }}>terms of service</span> and{' '}
        <span style={{ color: '#2563eb' }}>privacy policy</span>.
      </p>
    ),
    repairedPreview: (checked) => (
      <p style={{ fontSize: '0.75rem', color: '#374151', lineHeight: 1.6, margin: 0 }}>
        For more information, read our{' '}
        <span style={{
          color: '#2563eb',
          textDecoration: checked.includes('Add underline to links') ? 'underline' : 'none',
          fontWeight: checked.includes('Add bold weight to links') ? 700 : 400,
        }}>
          terms of service{checked.includes('Add › arrow indicator') ? ' ›' : ''}
        </span>{' '}
        and{' '}
        <span style={{
          color: '#2563eb',
          textDecoration: checked.includes('Add underline to links') ? 'underline' : 'none',
          fontWeight: checked.includes('Add bold weight to links') ? 700 : 400,
        }}>
          privacy policy{checked.includes('Add › arrow indicator') ? ' ›' : ''}
        </span>.
      </p>
    ),
  },
  {
    id: 'service-status',
    name: 'Service status dashboard',
    repairOptions: ['Add status icons (✓/⚠/✕)', 'Add status text labels', 'Add colored outlines'],
    isValidRepair: (checked) => checked.includes('Add status icons (✓/⚠/✕)') || checked.includes('Add status text labels'),
    invalidFeedback: (checked) => checked.length === 0
      ? 'The colored dots are the only cues that identify each service status.'
      : 'The dots and outlines still use hue as the only way to identify each service status.',
    brokenPreview: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
        {SERVICE_STATUSES.map((service) => (
          <div key={service.service} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.72rem', color: '#374151' }}>
            <span style={{ width: 9, height: 9, borderRadius: '50%', background: service.color, flexShrink: 0 }} />
            {service.service}
          </div>
        ))}
      </div>
    ),
    repairedPreview: (checked) => (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
        {SERVICE_STATUSES.map((service) => (
          <div
            key={service.service}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.35rem',
              border: checked.includes('Add colored outlines') ? `1px solid ${service.color}` : '1px solid transparent',
              borderRadius: 3, padding: '0.15rem 0.25rem', fontSize: '0.72rem', color: '#374151',
            }}
          >
            <span style={{ width: 9, height: 9, borderRadius: '50%', background: service.color, flexShrink: 0 }} />
            <span style={{ flex: 1 }}>{service.service}</span>
            {checked.includes('Add status icons (✓/⚠/✕)') && (
              <span style={{ fontWeight: 700 }}>{service.icon}</span>
            )}
            {checked.includes('Add status text labels') && <strong>{service.status}</strong>}
          </div>
        ))}
      </div>
    ),
  },
  {
    id: 'chart-series',
    name: 'Chart series',
    repairOptions: ['Add direct labels', 'Add pattern fills', 'Add value labels at top'],
    isValidRepair: (checked) => checked.includes('Add direct labels') || checked.includes('Add pattern fills'),
    invalidFeedback: (checked) => checked.includes('Add value labels at top')
      ? 'The values show amounts, but they do not identify the series.'
      : 'The chart still relies on color to distinguish its series.',
    brokenPreview: (
      <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'flex-end', height: 60 }}>
        {[{ h: 75, color: '#22c55e' }, { h: 50, color: '#ef4444' }].map((bar) => (
          <div key={bar.color} style={{ flex: 1, height: `${bar.h}%`, background: bar.color, borderRadius: '3px 3px 0 0' }} />
        ))}
      </div>
    ),
    repairedPreview: (checked) => (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
        <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'flex-end', height: 70 }}>
          {CHART_SERIES.map((bar) => (
            <div key={bar.color} style={{ flex: 1, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end' }}>
              {(checked.includes('Add direct labels') || checked.includes('Add value labels at top')) && (
                <span style={{ fontSize: '0.65rem', color: '#333', marginBottom: '0.1rem', whiteSpace: 'nowrap' }}>
                  {checked.includes('Add direct labels') && bar.label}
                  {checked.includes('Add direct labels') && checked.includes('Add value labels at top') && ': '}
                  {checked.includes('Add value labels at top') && bar.val}
                </span>
              )}
              <div
                data-testid={`chart-${bar.label.toLowerCase().replace(' ', '-')}`}
                style={{
                  width: '100%', height: `${bar.h}%`,
                  background: checked.includes('Add pattern fills')
                    ? chartPattern(bar.color, bar.patternAngle)
                    : bar.color,
                  border: checked.includes('Add pattern fills') ? '1px solid #777' : 'none',
                  borderRadius: '3px 3px 0 0',
                }}
              />
            </div>
          ))}
        </div>
        {checked.includes('Add pattern fills') && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.6rem', fontSize: '0.6rem', color: '#333' }}>
            {CHART_SERIES.map((series) => (
              <span key={series.label} style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                <span
                  aria-hidden="true"
                  data-testid={`legend-${series.label.toLowerCase().replace(' ', '-')}`}
                  style={{ width: 10, height: 10, border: '1px solid #777', background: chartPattern(series.color, series.patternAngle, 4) }}
                />
                {series.label}
              </span>
            ))}
          </div>
        )}
      </div>
    ),
  },
];

const STAGES = [{
  id: 'repair-interface-patterns',
  title: 'Repair interface patterns',
  instruction: 'Choose a valid non-color repair for the form, links, service statuses, and chart, then check the stage.',
}] satisfies readonly ExerciseStageDefinition[];

export const PatternRepairTool = memo(function PatternRepairTool({
  interactive = false,
  onComplete,
  onStageChange,
}: ExerciseToolProps) {
  const [checked, setChecked] = useState<Record<string, string[]>>(
    Object.fromEntries(MODULES.map((m) => [m.id, []])),
  );
  const stageController = useExerciseStages({ stages: STAGES, onComplete, onStageChange });
  const submitted = stageController.result !== 'idle';

  function toggleOption(moduleId: string, option: string) {
    if (!interactive || submitted) return;
    setChecked((prev) => {
      const current = prev[moduleId];
      const next = current.includes(option) ? current.filter((o) => o !== option) : [...current, option];
      return { ...prev, [moduleId]: next };
    });
  }

  function handleCheck() {
    if (!interactive || submitted) return;
    const allRepaired = MODULES.every((mod) => mod.isValidRepair(checked[mod.id]));
    if (allRepaired) stageController.markPassed();
    else stageController.markIncorrect();
  }

  const repairedCount = submitted
    ? MODULES.filter((mod) => mod.isValidRepair(checked[mod.id])).length
    : 0;

  return (
    <div className={shellStyles.shell}>
      <span className={shellStyles.toolLabel}>pattern repair workshop</span>

      <ExerciseStage
        controller={stageController}
        incorrectFeedback="Some patterns still rely on color alone. Review the item feedback and try the stage again."
        completionFeedback="All patterns are repaired. Components that use these patterns receive the same cues."
      >
        {interactive && (
          <p style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>
            Repaired patterns: {repairedCount} of {MODULES.length}.
          </p>
        )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {MODULES.map((mod) => {
          const modChecked = checked[mod.id];
          const isRepaired = submitted && mod.isValidRepair(modChecked);

          return (
            <div
              key={mod.id}
              style={{
                border: `1px solid ${isRepaired ? 'var(--accent-success)' : 'var(--border)'}`,
                borderRadius: 'var(--radius-md)',
                padding: '0.65rem',
                background: isRepaired ? 'color-mix(in srgb, var(--accent-success) 6%, transparent)' : 'transparent',
              }}
            >
              <div style={{ marginBottom: '0.4rem' }}>
                <p style={{ fontWeight: 600, fontSize: '0.8rem', margin: 0, color: 'var(--primary-foreground)' }}>{mod.name}</p>
              </div>

              {/* Before / After */}
              <div data-authored-visual style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <div>
                  <p style={{ fontSize: '0.62rem', color: 'var(--muted)', marginBottom: '0.2rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>Before</p>
                  <div style={{ background: '#ffffff', borderRadius: 'var(--radius-sm)', padding: '0.5rem', border: '1px solid #eee', minHeight: 60 }}>
                    {mod.brokenPreview}
                  </div>
                </div>
                <div>
                  <p style={{ fontSize: '0.62rem', color: 'var(--muted)', marginBottom: '0.2rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>After</p>
                  <div style={{ background: '#ffffff', borderRadius: 'var(--radius-sm)', padding: '0.5rem', border: `1px solid ${isRepaired ? '#bbf7d0' : '#eee'}`, minHeight: 60 }}>
                    {modChecked.length > 0 ? mod.repairedPreview(modChecked) : mod.brokenPreview}
                  </div>
                </div>
              </div>

              {interactive && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                  {mod.repairOptions.map((option) => (
                    <label key={option} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', cursor: submitted ? 'not-allowed' : 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={modChecked.includes(option)}
                        onChange={() => toggleOption(mod.id, option)}
                        disabled={submitted}
                        style={{ accentColor: 'var(--accent-warning)' }}
                      />
                      {option}
                    </label>
                  ))}
                </div>
              )}

              {submitted && (
                <p
                  aria-live="polite"
                  data-testid={`feedback-${mod.id}`}
                  style={{ margin: '0.45rem 0 0', fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: isRepaired ? 'var(--accent-success)' : 'var(--accent-danger)' }}
                >
                  {isRepaired ? '✓ repaired' : mod.invalidFeedback(modChecked)}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {interactive && !submitted && (
        <button
          onClick={handleCheck}
          style={{ alignSelf: 'flex-start', padding: '0.5rem 1.25rem', background: 'var(--accent-cta)', color: 'var(--cta-foreground)', fontWeight: 700, fontSize: '1rem', borderRadius: 'var(--radius-sm)', border: 'none', cursor: 'pointer' }}
        >
          check repairs
        </button>
      )}

      </ExerciseStage>
    </div>
  );
});
