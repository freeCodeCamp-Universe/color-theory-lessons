import { memo, useState } from 'react';
import shellStyles from './ToolShell.module.css';

interface StateConfig {
  name: string;
  color: string;
  icon: string;
  label: string;
  borderStyle: string;
}

const STATES: StateConfig[] = [
  { name: 'Success', color: '#22c55e', icon: '✓', label: 'Success', borderStyle: '2px solid #22c55e' },
  { name: 'Warning', color: '#f59e0b', icon: '⚠', label: 'Warning', borderStyle: '2px dashed #f59e0b' },
  { name: 'Error',   color: '#ef4444', icon: '✕', label: 'Error',   borderStyle: '2px solid #ef4444' },
  { name: 'Info',    color: '#3b82f6', icon: 'ℹ', label: 'Info',    borderStyle: '2px dotted #3b82f6' },
];

type CueKey = 'icon' | 'label' | 'border';

interface StateWorkshopToolProps {
  interactive?: boolean;
  onComplete?: () => void;
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
      const allHaveOneCue = STATES.every((s) =>
        Object.values(next[s.name]).some(Boolean),
      );
      if (allHaveOneCue && !completed) {
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
          Add at least one non-color cue to each state: icon, label, or border style.
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
                border: stateCues.border ? state.borderStyle : `1px solid ${state.color}`,
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
          Each state now has a selected non-color cue.
        </p>
      )}
    </div>
  );
});
