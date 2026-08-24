import { memo, useState } from 'react';
import { simulateDeuteranopia } from '../../utils/color.ts';
import shellStyles from './ToolShell.module.css';

interface SystemStressTestToolProps {
  interactive?: boolean;
  onComplete?: () => void;
}

type CheckId =
  | 'hierarchy' | 'text-contrast' | 'semantic-clarity'
  | 'dark-mode' | 'chart-readability' | 'cvd-robustness';

interface Check {
  id: CheckId;
  label: string;
  description: string;
  failNote: string;
}

const CHECKS: Check[] = [
  { id: 'hierarchy', label: 'Visual hierarchy', description: 'Primary actions are more prominent than secondary ones. Page backgrounds recede, content surfaces step forward.', failNote: 'The action button blends into the secondary controls, so neither action appears primary.' },
  { id: 'text-contrast', label: 'Text contrast', description: 'Normal text, including placeholder text, meets 4.5:1. Large text meets 3:1.', failNote: 'Placeholder text (#aaa on #fff) is about 2.3:1, below the 4.5:1 requirement for normal text.' },
  { id: 'semantic-clarity', label: 'Semantic clarity', description: 'Success, warning, and error states pair color with distinct labels, icons, or shapes.', failNote: 'Warning and success use similar yellow and yellow-green colors. Their difference narrows under CVD simulation.' },
  { id: 'dark-mode', label: 'Dark mode adaptation', description: 'Roles adapt to the dark context. Surfaces become lighter at each elevation, text becomes light, and accents remain visible.', failNote: 'Dark mode reuses the #1e40af accent from light mode. It has too little contrast against the dark surface.' },
  { id: 'chart-readability', label: 'Chart readability', description: 'Chart series contrast with the chart background and use labels, patterns, or boundaries when colors alone do not distinguish adjacent data.', failNote: 'The chart uses only red and green to identify its series. Deuteranopia simulation reduces the hue difference, and there are no labels or patterns.' },
  { id: 'cvd-robustness', label: 'CVD support', description: 'Labels, shapes, or icons repeat meaning carried by color. CVD simulation preserves distinctions between palette colors.', failNote: 'The notification row removes its error icons, so color is the only cue that distinguishes error from success.' },
];

const SYSTEM_COLORS = {
  light: { bg: '#f9fafb', surface: '#ffffff', action: '#1e40af', success: '#16a34a', warning: '#b45309', error: '#dc2626', text: '#111827' },
  dark: { bg: '#0f172a', surface: '#1e293b', action: '#3b82f6', success: '#4ade80', warning: '#fbbf24', error: '#f87171', text: '#f1f5f9' },
};

/**
 * A comprehensive audit tool that simulates a "color system stress test."
 * Users must review a palette across light mode, dark mode, and CVD 
 * simulations, marking each system quality check as 'pass' or 'fail'.
 */
export const SystemStressTestTool = memo(function SystemStressTestTool({ interactive = false, onComplete }: SystemStressTestToolProps) {
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  const [cvd, setCvd] = useState(false);
  const [findings, setFindings] = useState<Record<CheckId, 'pass' | 'fail' | null>>({
    hierarchy: null, 'text-contrast': null, 'semantic-clarity': null,
    'dark-mode': null, 'chart-readability': null, 'cvd-robustness': null,
  });
  const [completed, setCompleted] = useState(false);

  const palette = SYSTEM_COLORS[mode];
  const display = (hex: string) => cvd ? simulateDeuteranopia(hex) : hex;

  /** Marks a specific quality check as Pass or Fail. Triggers onComplete when all are marked. */
  function mark(id: CheckId, result: 'pass' | 'fail') {
    if (!interactive) return;
    setFindings(prev => {
      const next = { ...prev, [id]: result };
      const allMarked = Object.values(next).every(v => v !== null);
      if (allMarked && !completed) {
        setCompleted(true);
        onComplete?.();
      }
      return next;
    });
  }

  const passCount = Object.values(findings).filter(v => v === 'pass').length;
  const failCount = Object.values(findings).filter(v => v === 'fail').length;
  const totalMarked = passCount + failCount;

  return (
    <div className={shellStyles.shell}>
      <span className={shellStyles.toolLabel}>system stress test</span>

      {/* Controls */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
        {(['light', 'dark'] as const).map(m => (
          <button key={m} onClick={() => setMode(m)} disabled={!interactive}
            style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: 4, cursor: interactive ? 'pointer' : 'default', border: 'none',
              background: mode === m ? 'var(--accent-cta)' : 'var(--border)', color: mode === m ? '#000' : 'var(--primary-foreground)' }}>
            {m} mode
          </button>
        ))}
        <button onClick={() => setCvd(v => !v)} disabled={!interactive}
          style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: 4, cursor: interactive ? 'pointer' : 'default', border: 'none',
            background: cvd ? 'var(--accent-cta)' : 'var(--border)', color: cvd ? '#000' : 'var(--primary-foreground)' }}>
          {cvd ? 'CVD sim ON' : 'CVD sim OFF'}
        </button>
      </div>

      {/* Live palette preview */}
      <div style={{ background: display(palette.bg), border: '1px solid var(--border)', borderRadius: 6, padding: '0.75rem', marginBottom: '0.75rem' }}>
        <div style={{ background: display(palette.surface), borderRadius: 4, padding: '0.6rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <span style={{ color: display(palette.text), fontWeight: 600, fontSize: '0.85rem' }}>Account dashboard</span>
          <span style={{ color: display(palette.text), fontSize: '0.75rem', opacity: 0.6 }}>Manage your account and billing preferences</span>
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            <div style={{ background: display(palette.action), color: '#fff', padding: '0.2rem 0.6rem', borderRadius: 4, fontSize: '0.75rem' }}>Save</div>
            <div style={{ background: 'transparent', border: `1px solid ${display(palette.action)}`, color: display(palette.action), padding: '0.2rem 0.6rem', borderRadius: 4, fontSize: '0.75rem' }}>Cancel</div>
          </div>
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.2rem' }}>
            <span style={{ background: display(palette.success), color: '#fff', padding: '0.1rem 0.4rem', borderRadius: 99, fontSize: '0.7rem' }}>● Success</span>
            <span style={{ background: display(palette.warning), color: '#fff', padding: '0.1rem 0.4rem', borderRadius: 99, fontSize: '0.7rem' }}>▲ Warning</span>
            <span style={{ background: display(palette.error), color: '#fff', padding: '0.1rem 0.4rem', borderRadius: 99, fontSize: '0.7rem' }}>✕ Error</span>
          </div>
        </div>
      </div>

      {/* Checklist */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {CHECKS.map(check => (
          <div key={check.id} style={{ borderRadius: 4, border: '1px solid var(--border)', padding: '0.5rem 0.6rem',
            background: findings[check.id] === 'pass' ? 'rgba(34,197,94,0.08)' : findings[check.id] === 'fail' ? 'rgba(239,68,68,0.08)' : 'transparent' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', fontWeight: 600, color: 'var(--primary-foreground)' }}>{check.label}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: '0.15rem' }}>{check.description}</div>
                {findings[check.id] === 'fail' && (
                  <div style={{ fontSize: '0.72rem', color: 'var(--accent-danger)', marginTop: '0.2rem' }}>⚠ {check.failNote}</div>
                )}
              </div>
              {interactive && (
                <div style={{ display: 'flex', gap: '0.3rem', flexShrink: 0 }}>
                  <button onClick={() => mark(check.id, 'pass')}
                    style={{ fontSize: '0.7rem', padding: '0.1rem 0.4rem', borderRadius: 3, border: 'none', cursor: 'pointer',
                      background: findings[check.id] === 'pass' ? '#16a34a' : 'var(--border)', color: findings[check.id] === 'pass' ? '#fff' : 'var(--primary-foreground)' }}>
                    ✓ Pass
                  </button>
                  <button onClick={() => mark(check.id, 'fail')}
                    style={{ fontSize: '0.7rem', padding: '0.1rem 0.4rem', borderRadius: 3, border: 'none', cursor: 'pointer',
                      background: findings[check.id] === 'fail' ? '#dc2626' : 'var(--border)', color: findings[check.id] === 'fail' ? '#fff' : 'var(--primary-foreground)' }}>
                    ✕ Fail
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {interactive && totalMarked > 0 && (
        <p style={{ fontSize: '0.82rem', color: 'var(--muted)', marginTop: '0.5rem' }}>
          {passCount} pass · {failCount} fail · {CHECKS.length - totalMarked} remaining
        </p>
      )}

      {completed && (
        <p style={{ color: 'var(--accent-success)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
          Stress test complete. Review each failed check before using this color system.
        </p>
      )}
    </div>
  );
});
