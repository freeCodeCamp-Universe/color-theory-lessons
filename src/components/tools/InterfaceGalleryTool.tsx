import { memo, useState } from 'react';
import { ExerciseStage } from './ExerciseStage.tsx';
import type { ExerciseStageDefinition, ExerciseToolProps } from './exercise-stage.ts';
import shellStyles from './ToolShell.module.css';
import { useExerciseStages } from './useExerciseStages.ts';

const SVG_FILTERS = `
<svg style="position:absolute;width:0;height:0;overflow:hidden" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <defs>
    <filter id="ig-deuteranopia">
      <feColorMatrix type="matrix" values="0.625 0.375 0 0 0  0.7 0.3 0 0 0  0 0.3 0.7 0 0  0 0 0 1 0"/>
    </filter>
    <filter id="ig-protanopia">
      <feColorMatrix type="matrix" values="0.567 0.433 0 0 0  0.558 0.442 0 0 0  0 0.242 0.758 0 0  0 0 0 1 0"/>
    </filter>
    <filter id="ig-tritanopia">
      <feColorMatrix type="matrix" values="0.95 0.05 0 0 0  0 0.433 0.567 0 0  0 0.475 0.525 0 0  0 0 0 1 0"/>
    </filter>
    <filter id="ig-achromatopsia">
      <feColorMatrix type="saturate" values="0"/>
    </filter>
  </defs>
</svg>`;

type SimMode = 'normal' | 'deuteranopia' | 'protanopia' | 'tritanopia' | 'achromatopsia';

const MODES: { id: SimMode; label: string; filter: string }[] = [
  { id: 'normal', label: 'Original', filter: 'none' },
  { id: 'deuteranopia', label: 'Deuteranopia', filter: 'url(#ig-deuteranopia)' },
  { id: 'protanopia', label: 'Protanopia', filter: 'url(#ig-protanopia)' },
  { id: 'tritanopia', label: 'Tritanopia', filter: 'url(#ig-tritanopia)' },
  { id: 'achromatopsia', label: 'Complete achromatopsia', filter: 'url(#ig-achromatopsia)' },
];

interface InterfaceGalleryToolProps extends ExerciseToolProps {
  previewSimulation?: SimMode;
}

const STAGES: readonly ExerciseStageDefinition[] = [{
  id: 'review-simulations',
  title: 'Review color vision simulations',
  instruction: 'Compare the original interface with all four simulation modes.',
}];

export const InterfaceGalleryTool = memo(function InterfaceGalleryTool({
  interactive = false,
  onComplete,
  onStageChange,
  previewSimulation,
}: InterfaceGalleryToolProps) {
  const [mode, setMode] = useState<SimMode>(previewSimulation ?? 'normal');
  const [seen, setSeen] = useState<Set<SimMode>>(new Set(['normal']));
  const stageController = useExerciseStages({ stages: STAGES, onComplete, onStageChange });

  function selectMode(m: SimMode) {
    if (!interactive || stageController.result === 'passed') return;
    setMode(m);
    const next = new Set(seen);
    next.add(m);
    setSeen(next);
    if (next.size === MODES.length) stageController.markPassed();
  }

  const currentFilter = MODES.find((m) => m.id === mode)?.filter ?? 'none';
  const simulationsExplored = [...seen].filter((id) => id !== 'normal').length;

  const gallery = (
    <>
      {interactive && (
        <p style={{ fontSize: '0.78rem', color: 'var(--muted)', marginBottom: '0.6rem' }}>
          {simulationsExplored}/4 simulation modes explored
        </p>
      )}

      {/* Hidden SVG filter definitions */}
      <div dangerouslySetInnerHTML={{ __html: SVG_FILTERS }} />

      {/* Mode selector */}
      <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
        {MODES.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => selectMode(m.id)}
            disabled={!interactive || stageController.result === 'passed'}
            aria-pressed={mode === m.id}
            style={{
              padding: '0.3rem 0.6rem',
              fontSize: '0.75rem',
              fontFamily: 'var(--font-mono)',
              background: mode === m.id ? 'var(--accent-cta)' : 'transparent',
              color: mode === m.id ? '#111' : seen.has(m.id) ? 'var(--accent-success)' : 'var(--muted)',
              border: `1px solid ${mode === m.id ? 'var(--accent-cta)' : 'var(--border)'}`,
              borderRadius: 'var(--radius-sm)',
              cursor: interactive ? 'pointer' : 'default',
            }}
          >
            {seen.has(m.id) && m.id !== mode && m.id !== 'normal' ? '✓ ' : ''}{m.label}
          </button>
        ))}
      </div>

      {/* Mockup panel with filter applied */}
      <div data-authored-visual style={{ filter: currentFilter, borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border)' }}>
        {/* Nav */}
        <div style={{ background: '#1e3a5f', padding: '0.5rem 0.75rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <span style={{ color: '#4da6ff', fontSize: '0.8rem', fontWeight: 600 }}>Dashboard</span>
          <span style={{ color: '#9ca3af', fontSize: '0.8rem' }}>Reports</span>
          <span style={{ color: '#9ca3af', fontSize: '0.8rem' }}>Settings</span>
        </div>

        {/* Content */}
        <div style={{ background: '#f8fafc', padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {/* Status badges */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ background: '#22c55e', color: '#fff', padding: '0.2rem 0.5rem', borderRadius: 99, fontSize: '0.72rem', fontFamily: 'var(--font-mono)' }}>Active</span>
            <span style={{ background: '#ef4444', color: '#fff', padding: '0.2rem 0.5rem', borderRadius: 99, fontSize: '0.72rem', fontFamily: 'var(--font-mono)' }}>Error</span>
            <span style={{ background: '#f59e0b', color: '#fff', padding: '0.2rem 0.5rem', borderRadius: 99, fontSize: '0.72rem', fontFamily: 'var(--font-mono)' }}>Warning</span>
          </div>

          {/* Bar chart */}
          <div>
            <p style={{ fontSize: '0.72rem', color: '#6b7280', marginBottom: '0.3rem' }}>Monthly data</p>
            <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'flex-end', height: 60 }}>
              {[
                { h: 80, color: '#22c55e' },
                { h: 50, color: '#ef4444' },
                { h: 65, color: '#3b82f6' },
              ].map((bar) => (
                <div key={bar.color} style={{ flex: 1, height: `${bar.h}%`, background: bar.color, borderRadius: '3px 3px 0 0' }} />
              ))}
            </div>
          </div>

          {/* Form field with red validation border */}
          <div>
            <label style={{ fontSize: '0.72rem', color: '#374151', display: 'block', marginBottom: '0.2rem' }}>Email</label>
            <input
              readOnly
              value="not-an-email"
              style={{
                width: '100%', padding: '0.3rem 0.5rem', fontSize: '0.78rem',
                border: '2px solid #ef4444', borderRadius: 4, background: '#fff', color: '#111',
                boxSizing: 'border-box',
              }}
            />
          </div>
        </div>
      </div>

    </>
  );

  return (
    <div className={shellStyles.shell}>
      <span className={shellStyles.toolLabel}>interface gallery</span>

      {interactive ? (
        <ExerciseStage
          controller={stageController}
          completionFeedback="All four simulation modes explored. Notice which elements became harder to distinguish in each simulation."
        >
          {gallery}
        </ExerciseStage>
      ) : gallery}
    </div>
  );
});
