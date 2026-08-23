import { memo, useState } from 'react';
import shellStyles from './ToolShell.module.css';

interface Module {
  id: string;
  name: string;
  repairOptions: string[];
  repairRequirement: string;
  isValidRepair: (checked: string[]) => boolean;
  brokenPreview: React.ReactNode;
  repairedPreview: (checked: string[]) => React.ReactNode;
}

const MODULES: Module[] = [
  {
    id: 'form-validation',
    name: 'Form validation',
    repairOptions: ['Add error icon ✕', 'Add error message text', 'Change label to bold+red'],
    repairRequirement: 'needs error text + 1 option',
    isValidRepair: (checked) => checked.length >= 2 && checked.includes('Add error message text'),
    brokenPreview: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        <label style={{ fontSize: '0.72rem', color: '#374151' }}>Email address</label>
        <input readOnly value="not-valid" style={{ padding: '0.3rem 0.4rem', fontSize: '0.75rem', border: '2px solid #ef4444', borderRadius: 3, width: '100%', boxSizing: 'border-box', background: '#fff' }} />
      </div>
    ),
    repairedPreview: (checked) => (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        <label style={{ fontSize: '0.72rem', color: checked.includes('Change label to bold+red') ? '#ef4444' : '#374151', fontWeight: checked.includes('Change label to bold+red') ? 700 : 400 }}>Email address</label>
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
    repairRequirement: 'needs ≥1 option',
    isValidRepair: (checked) => checked.length >= 1,
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
    id: 'alert-stack',
    name: 'Alert stack',
    repairOptions: ['Add icons (✓/⚠/✕)', 'Add structured heading', 'Add border-left accent'],
    repairRequirement: 'needs ≥2 options',
    isValidRepair: (checked) => checked.length >= 2,
    brokenPreview: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
        {[{ bg: '#dcfce7', text: '#166534', msg: 'Changes saved.' }, { bg: '#fef9c3', text: '#854d0e', msg: 'Unsaved changes.' }, { bg: '#fee2e2', text: '#991b1b', msg: 'Upload failed.' }].map((alert) => (
          <div key={alert.msg} style={{ background: alert.bg, borderRadius: 3, padding: '0.3rem 0.5rem', fontSize: '0.72rem', color: alert.text }}>
            {alert.msg}
          </div>
        ))}
      </div>
    ),
    repairedPreview: (checked) => (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
        {[
          { bg: '#dcfce7', text: '#166534', msg: 'Changes saved.', heading: 'Success', icon: '✓', borderColor: '#22c55e' },
          { bg: '#fef9c3', text: '#854d0e', msg: 'Unsaved changes.', heading: 'Warning', icon: '⚠', borderColor: '#eab308' },
          { bg: '#fee2e2', text: '#991b1b', msg: 'Upload failed.', heading: 'Error', icon: '✕', borderColor: '#ef4444' },
        ].map((alert) => (
          <div
            key={alert.msg}
            style={{
              background: alert.bg, borderRadius: 3, padding: '0.3rem 0.5rem',
              fontSize: '0.72rem', color: alert.text,
              borderLeft: checked.includes('Add border-left accent') ? `3px solid ${alert.borderColor}` : 'none',
              display: 'flex', gap: '0.35rem', alignItems: 'flex-start',
            }}
          >
            {checked.includes('Add icons (✓/⚠/✕)') && (
              <span style={{ fontWeight: 700, flexShrink: 0 }}>{alert.icon}</span>
            )}
            <div>
              {checked.includes('Add structured heading') && (
                <strong style={{ display: 'block', fontSize: '0.72rem' }}>{alert.heading}:</strong>
              )}
              {alert.msg}
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: 'chart-series',
    name: 'Chart series',
    repairOptions: ['Add direct labels', 'Add pattern fills', 'Add value labels at top'],
    repairRequirement: 'needs direct labels or patterns',
    isValidRepair: (checked) => checked.includes('Add direct labels') || checked.includes('Add pattern fills'),
    brokenPreview: (
      <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'flex-end', height: 60 }}>
        {[{ h: 75, color: '#22c55e' }, { h: 50, color: '#ef4444' }].map((bar) => (
          <div key={bar.color} style={{ flex: 1, height: `${bar.h}%`, background: bar.color, borderRadius: '3px 3px 0 0' }} />
        ))}
      </div>
    ),
    repairedPreview: (checked) => (
      <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'flex-end', height: 70 }}>
        {[{ h: 75, color: '#22c55e', label: 'Series A', val: '75' }, { h: 50, color: '#ef4444', label: 'Series B', val: '50' }].map((bar) => (
          <div key={bar.color} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end' }}>
            {checked.includes('Add value labels at top') && (
              <span style={{ fontSize: '0.65rem', color: '#333', marginBottom: '0.1rem' }}>{bar.val}</span>
            )}
            <div
              style={{
                width: '100%', height: `${bar.h}%`,
                background: checked.includes('Add pattern fills')
                  ? `repeating-linear-gradient(45deg, ${bar.color}, ${bar.color} 2px, transparent 2px, transparent 6px)`
                  : bar.color,
                borderRadius: '3px 3px 0 0', position: 'relative',
              }}
            >
              {checked.includes('Add direct labels') && (
                <span style={{ position: 'absolute', top: -16, left: '50%', transform: 'translateX(-50%)', fontSize: '0.6rem', color: bar.color, fontWeight: 700, whiteSpace: 'nowrap' }}>{bar.label}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    ),
  },
];

interface PatternRepairToolProps {
  interactive?: boolean;
  onComplete?: () => void;
}

export const PatternRepairTool = memo(function PatternRepairTool({ interactive = false, onComplete }: PatternRepairToolProps) {
  const [checked, setChecked] = useState<Record<string, string[]>>(
    Object.fromEntries(MODULES.map((m) => [m.id, []])),
  );
  const [repaired, setRepaired] = useState<Record<string, boolean>>({});
  const [completed, setCompleted] = useState(false);

  function toggleOption(moduleId: string, option: string) {
    if (!interactive || completed) return;
    setChecked((prev) => {
      const current = prev[moduleId];
      const next = current.includes(option) ? current.filter((o) => o !== option) : [...current, option];
      const mod = MODULES.find((m) => m.id === moduleId)!;
      const isRepaired = mod.isValidRepair(next);
      setRepaired((prevR) => {
        const nextR = { ...prevR, [moduleId]: isRepaired };
        const allRepaired = MODULES.every((m) => nextR[m.id]);
        if (allRepaired && !completed) {
          setCompleted(true);
          onComplete?.();
        }
        return nextR;
      });
      return { ...prev, [moduleId]: next };
    });
  }

  const repairedCount = Object.values(repaired).filter(Boolean).length;

  return (
    <div className={shellStyles.shell}>
      <span className={shellStyles.toolLabel}>pattern repair workshop</span>

      {interactive && (
        <p style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>
          Repair each interface pattern by checking the options below. ({repairedCount}/{MODULES.length} repaired)
        </p>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {MODULES.map((mod) => {
          const modChecked = checked[mod.id];
          const isRepaired = repaired[mod.id];

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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <p style={{ fontWeight: 600, fontSize: '0.8rem', margin: 0, color: 'var(--primary-foreground)' }}>{mod.name}</p>
                <span style={{ fontSize: '0.68rem', color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>
                  {isRepaired
                    ? <span style={{ color: 'var(--accent-success)' }}>✓ repaired</span>
                    : mod.repairRequirement}
                </span>
              </div>

              {/* Before / After */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.5rem' }}>
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
                    <label key={option} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={modChecked.includes(option)}
                        onChange={() => toggleOption(mod.id, option)}
                        style={{ accentColor: 'var(--accent-cta)' }}
                      />
                      {option}
                    </label>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {completed && (
        <p style={{ color: 'var(--accent-success)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
          ✓ All patterns repaired. These same fixes, applied as reusable patterns, scale across an entire product.
        </p>
      )}
    </div>
  );
});
