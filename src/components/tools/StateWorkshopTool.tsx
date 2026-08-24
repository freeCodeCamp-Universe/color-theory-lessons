import { memo, useState } from 'react';
import shellStyles from './ToolShell.module.css';

interface StateConfig {
  name: string;
  color: string;
  icon: string;
  label: string;
  borderPattern: 'solid' | 'dashed' | 'dotted';
}

const STATES: StateConfig[] = [
  { name: 'Success', color: '#22c55e', icon: '✓', label: 'Success', borderPattern: 'solid' },
  { name: 'Warning', color: '#f59e0b', icon: '⚠', label: 'Warning', borderPattern: 'dashed' },
  { name: 'Error',   color: '#ef4444', icon: '✕', label: 'Error',   borderPattern: 'solid' },
  { name: 'Info',    color: '#3b82f6', icon: 'ℹ', label: 'Info',    borderPattern: 'dotted' },
];

type CueKey = 'icon' | 'label' | 'border';

interface StateWorkshopToolProps {
  interactive?: boolean;
  onComplete?: () => void;
}

function hasDistinctNonColorTreatments(cues: Record<string, Record<CueKey, boolean>>) {
  const treatments = STATES.map((state) => {
    const stateCues = cues[state.name];
    return [
      stateCues.icon ? `icon:${state.icon}` : '',
      stateCues.label ? `label:${state.label}` : '',
      stateCues.border ? `border:${state.borderPattern}` : '',
    ].filter(Boolean).join('|');
  });

  return treatments.every(Boolean) && new Set(treatments).size === STATES.length;
}

export const StateWorkshopTool = memo(function StateWorkshopTool({ interactive = false, onComplete }: StateWorkshopToolProps) {
  const [cues, setCues] = useState<Record<string, Record<CueKey, boolean>>>(
    Object.fromEntries(STATES.map((s) => [s.name, { icon: false, label: false, border: false }])),
  );
  const [completed, setCompleted] = useState(false);

  function toggleCue(stateName: string, cue: CueKey) {
    if (!interactive || completed) return;
    setCues((prev) => {
      const next = {
        ...prev,
        [stateName]: { ...prev[stateName], [cue]: !prev[stateName][cue] },
      };
      if (hasDistinctNonColorTreatments(next) && !completed) {
        setCompleted(true);
        onComplete?.();
      }
      return next;
    });
  }

  return (
    <div className={shellStyles.shell}>
      <span className={shellStyles.toolLabel}>state workshop</span>

      {interactive && (
        <p style={{ fontSize: '0.78rem', color: 'var(--muted)', marginBottom: '0.6rem' }}>
          Give each state a different non-color treatment using an icon, label, or border style.
        </p>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
        {STATES.map((state) => {
          const stateCues = cues[state.name];
          const hasAnyCue = Object.values(stateCues).some(Boolean);
          return (
            <div
              key={state.name}
              style={{
                padding: '0.65rem',
                borderRadius: 'var(--radius-md)',
                border: `1px solid ${hasAnyCue ? 'var(--accent-success)' : 'var(--border)'}`,
                background: hasAnyCue
                  ? 'color-mix(in srgb, var(--accent-success) 5%, transparent)'
                  : 'transparent',
              }}
            >
              {/* State preview */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.35rem 0.5rem',
                borderRadius: 'var(--radius-sm)',
                background: `color-mix(in srgb, ${state.color} 15%, transparent)`,
                border: stateCues.border ? `2px ${state.borderPattern} ${state.color}` : `1px solid ${state.color}`,
                marginBottom: '0.5rem',
                minHeight: 32,
              }}>
                {stateCues.icon && (
                  <span style={{ color: state.color, fontWeight: 700, fontSize: '0.85rem' }}>
                    {state.icon}
                  </span>
                )}
                <span style={{
                  width: 10, height: 10, borderRadius: '50%',
                  background: state.color, flexShrink: 0,
                }} />
                {stateCues.label && (
                  <span style={{ fontSize: '0.78rem', fontWeight: 600, color: state.color }}>
                    {state.label}
                  </span>
                )}
                {!stateCues.icon && !stateCues.label && (
                  <span style={{ fontSize: '0.72rem', color: 'var(--muted)', fontStyle: 'italic' }}>
                    color only
                  </span>
                )}
              </div>

              {/* Cue toggles */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                <p style={{ fontSize: '0.72rem', color: 'var(--muted)', marginBottom: '0.1rem', fontWeight: 600 }}>
                  {state.name} cues:
                </p>
                {(['icon', 'label', 'border'] as CueKey[]).map((cue) => (
                  <label
                    key={cue}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '0.35rem',
                      fontSize: '0.75rem', cursor: interactive ? 'pointer' : 'default',
                      opacity: interactive ? 1 : 0.6,
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={stateCues[cue]}
                      disabled={!interactive || completed}
                      onChange={() => toggleCue(state.name, cue)}
                      style={{ accentColor: state.color }}
                    />
                    {cue === 'icon' ? `Icon (${state.icon})` : cue === 'label' ? `Label "${state.label}"` : 'Border style'}
                  </label>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {completed && (
        <p style={{ color: 'var(--accent-success)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
          Each state now has a distinct non-color treatment.
        </p>
      )}
    </div>
  );
});
