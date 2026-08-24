import { memo, useState } from 'react';
import { simulateDeuteranopia } from '../../utils/color.ts';
import shellStyles from './ToolShell.module.css';
import styles from './SystemStressTestTool.module.css';

interface SystemStressTestToolProps {
  interactive?: boolean;
  onComplete?: () => void;
}

type ContextId = 'light' | 'dark' | 'chart' | 'alerts' | 'simulation';
type FindingId = 'placeholder' | 'dark-action' | 'chart-series' | 'alert-cues';
type Classification = 'role-drift' | 'missing-role' | 'token-override';

interface Finding {
  id: FindingId;
  label: string;
  context: string;
  expectedClassification: Classification;
  explanation: string;
}

const CONTEXTS: { id: ContextId; label: string }[] = [
  { id: 'light', label: 'Light mode' },
  { id: 'dark', label: 'Dark mode' },
  { id: 'chart', label: 'Chart view' },
  { id: 'alerts', label: 'Alert stack' },
  { id: 'simulation', label: 'CVD simulation' },
];

const FINDINGS: Finding[] = [
  {
    id: 'placeholder',
    label: 'Low-contrast placeholder',
    context: 'Light mode',
    expectedClassification: 'token-override',
    explanation: 'The #aaa placeholder bypasses the shared text token.',
  },
  {
    id: 'dark-action',
    label: 'Dark action loses contrast',
    context: 'Dark mode',
    expectedClassification: 'missing-role',
    explanation: 'The system has no dark-mode action role, so it reuses the light-mode value.',
  },
  {
    id: 'chart-series',
    label: 'Chart series reuse semantic colors',
    context: 'Chart view and CVD simulation',
    expectedClassification: 'role-drift',
    explanation: 'Success and error colors have drifted into data-series meanings.',
  },
  {
    id: 'alert-cues',
    label: 'Alerts rely on color alone',
    context: 'Alert stack and CVD simulation',
    expectedClassification: 'missing-role',
    explanation: 'The system has no role for a non-color status cue such as an icon or label.',
  },
];

const CLASSIFICATIONS: { value: Classification; label: string }[] = [
  { value: 'role-drift', label: 'Role drift' },
  { value: 'missing-role', label: 'Missing role' },
  { value: 'token-override', label: 'Token override' },
];

type FindingSelections = Record<FindingId, boolean>;
type FindingClassifications = Record<FindingId, Classification | ''>;

const INITIAL_SELECTIONS: FindingSelections = {
  placeholder: false,
  'dark-action': false,
  'chart-series': false,
  'alert-cues': false,
};

const INITIAL_CLASSIFICATIONS: FindingClassifications = {
  placeholder: '',
  'dark-action': '',
  'chart-series': '',
  'alert-cues': '',
};

const COLORS = {
  light: { background: '#f9fafb', surface: '#ffffff', text: '#111827', action: '#1e40af' },
  dark: { background: '#0f172a', surface: '#1e293b', text: '#f1f5f9', action: '#1e40af' },
  chart: ['#16a34a', '#dc2626'],
  alerts: ['#16a34a', '#dc2626'],
};

function ChartPreview({ simulate = false }: { simulate?: boolean }) {
  const display = (color: string) => simulate ? simulateDeuteranopia(color) : color;

  return (
    <div aria-label={simulate ? 'Chart under deuteranopia simulation' : 'Chart with two color-only series'}>
      <p style={{ color: '#111827', fontSize: '0.75rem', margin: '0 0 0.5rem' }}>Quarterly sign-ups</p>
      <div style={{ height: 100, display: 'flex', gap: '0.5rem', alignItems: 'flex-end' }} aria-hidden="true">
        {[72, 48, 88, 62].map((height, index) => (
          <div key={index} style={{ display: 'flex', gap: '0.15rem', alignItems: 'flex-end', height: '100%', flex: 1 }}>
            <span style={{ background: display(COLORS.chart[0]), height: `${height}%`, flex: 1 }} />
            <span style={{ background: display(COLORS.chart[1]), height: `${Math.max(30, height - 18)}%`, flex: 1 }} />
          </div>
        ))}
      </div>
      <p style={{ color: '#4b5563', fontSize: '0.7rem', margin: '0.35rem 0 0' }}>The series have no labels or patterns.</p>
    </div>
  );
}

function AlertPreview({ simulate = false }: { simulate?: boolean }) {
  const display = (color: string) => simulate ? simulateDeuteranopia(color) : color;

  return (
    <div aria-label={simulate ? 'Alerts under deuteranopia simulation' : 'Color-only alert stack'} style={{ display: 'grid', gap: '0.45rem' }}>
      {COLORS.alerts.map((color, index) => (
        <div key={color} style={{ border: '1px solid #d1d5db', borderRadius: 4, color: '#111827', display: 'flex', gap: '0.5rem', padding: '0.5rem' }}>
          <span aria-hidden="true" style={{ background: display(color), borderRadius: '50%', height: 12, marginTop: 2, width: 12 }} />
          <span style={{ fontSize: '0.75rem' }}>Account update {index + 1}</span>
        </div>
      ))}
      <p style={{ color: '#4b5563', fontSize: '0.7rem', margin: 0 }}>The dots are the only status cues.</p>
    </div>
  );
}

function ContextPreview({ context }: { context: ContextId }) {
  const frameStyle = {
    border: '1px solid var(--border)',
    borderRadius: 6,
    minHeight: 150,
    padding: '0.75rem',
  };

  if (context === 'chart') return <div style={{ ...frameStyle, background: '#ffffff' }}><ChartPreview /></div>;
  if (context === 'alerts') return <div style={{ ...frameStyle, background: '#ffffff' }}><AlertPreview /></div>;
  if (context === 'simulation') {
    return (
      <div style={{ ...frameStyle, background: '#ffffff', display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
        <ChartPreview simulate />
        <AlertPreview simulate />
      </div>
    );
  }

  const palette = COLORS[context];
  return (
    <div style={{ ...frameStyle, background: palette.background }}>
      <div style={{ background: palette.surface, borderRadius: 4, color: palette.text, display: 'grid', gap: '0.65rem', padding: '0.75rem' }}>
        <strong style={{ fontSize: '0.85rem' }}>Account dashboard</strong>
        {context === 'light' ? (
          <label style={{ display: 'grid', fontSize: '0.7rem', gap: '0.2rem' }}>
            Search accounts
            <input aria-label="Search accounts" className={styles.placeholder} disabled placeholder="Search by name" />
            <span style={{ color: '#aaa' }}>Placeholder color: #aaa</span>
          </label>
        ) : (
          <p style={{ fontSize: '0.72rem', margin: 0 }}>The primary action keeps its light-mode color instead of using a dark-mode action role.</p>
        )}
        <button disabled style={{ background: palette.action, border: 0, borderRadius: 4, color: '#ffffff', justifySelf: 'start', padding: '0.35rem 0.7rem' }}>
          Save changes
        </button>
      </div>
    </div>
  );
}

export const SystemStressTestTool = memo(function SystemStressTestTool({ interactive = false, onComplete }: SystemStressTestToolProps) {
  const [context, setContext] = useState<ContextId>('light');
  const [selections, setSelections] = useState<FindingSelections>(INITIAL_SELECTIONS);
  const [classifications, setClassifications] = useState<FindingClassifications>(INITIAL_CLASSIFICATIONS);
  const [submitted, setSubmitted] = useState(false);
  const [completed, setCompleted] = useState(false);

  const incompleteFindings = FINDINGS.filter(finding => !selections[finding.id] || !classifications[finding.id]);
  const incorrectFindings = FINDINGS.filter(finding => selections[finding.id] && classifications[finding.id] && classifications[finding.id] !== finding.expectedClassification);

  function updateSelection(id: FindingId, selected: boolean) {
    if (!interactive || completed) return;
    setSelections(previous => ({ ...previous, [id]: selected }));
    setSubmitted(false);
  }

  function updateClassification(id: FindingId, classification: Classification | '') {
    if (!interactive || completed) return;
    setClassifications(previous => ({ ...previous, [id]: classification }));
    setSubmitted(false);
  }

  function checkAudit() {
    if (!interactive || completed) return;
    setSubmitted(true);
    if (incompleteFindings.length === 0 && incorrectFindings.length === 0) {
      setCompleted(true);
      onComplete?.();
    }
  }

  return (
    <div className={shellStyles.shell}>
      <span className={shellStyles.toolLabel}>system stress test</span>

      <div aria-label="Preview context" role="group" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
        {CONTEXTS.map(item => (
          <button
            key={item.id}
            aria-pressed={context === item.id}
            disabled={!interactive}
            onClick={() => setContext(item.id)}
            style={{
              background: context === item.id ? 'var(--accent-cta)' : 'var(--border)',
              border: 0,
              borderRadius: 4,
              color: context === item.id ? '#000' : 'var(--primary-foreground)',
              cursor: interactive ? 'pointer' : 'default',
              fontSize: '0.75rem',
              padding: '0.3rem 0.55rem',
            }}
          >
            {item.label}
          </button>
        ))}
      </div>

      <ContextPreview context={context} />

      <div style={{ display: 'grid', gap: '0.5rem' }}>
        {FINDINGS.map(finding => {
          const selected = selections[finding.id];
          const incorrect = submitted && selected && classifications[finding.id] && classifications[finding.id] !== finding.expectedClassification;
          return (
            <fieldset key={finding.id} style={{ border: '1px solid var(--border)', borderRadius: 4, margin: 0, padding: '0.55rem' }}>
              <legend style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', fontWeight: 600, padding: '0 0.25rem' }}>{finding.context}</legend>
              <label style={{ alignItems: 'start', display: 'flex', fontSize: '0.78rem', gap: '0.4rem' }}>
                <input checked={selected} disabled={!interactive || completed} onChange={event => updateSelection(finding.id, event.target.checked)} type="checkbox" />
                Mark “{finding.label}” as a weakness
              </label>
              <label style={{ display: 'grid', fontSize: '0.75rem', gap: '0.2rem', marginTop: '0.45rem' }}>
                Classification for {finding.label}
                <select
                  aria-label={`Classification for ${finding.label}`}
                  disabled={!interactive || !selected || completed}
                  onChange={event => updateClassification(finding.id, event.target.value as Classification | '')}
                  value={classifications[finding.id]}
                >
                  <option value="">Choose a classification</option>
                  {CLASSIFICATIONS.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
                </select>
              </label>
              {incorrect && <p role="alert" style={{ color: 'var(--accent-danger)', fontSize: '0.72rem', margin: '0.4rem 0 0' }}>Incorrect classification. {finding.explanation}</p>}
            </fieldset>
          );
        })}
      </div>

      {interactive && !completed && <button onClick={checkAudit}>Check findings</button>}

      {submitted && incompleteFindings.length > 0 && (
        <p role="alert" style={{ color: 'var(--accent-danger)', fontSize: '0.82rem', margin: 0 }}>
          Complete every finding and classification. {incompleteFindings.length} remaining.
        </p>
      )}

      {submitted && incompleteFindings.length === 0 && incorrectFindings.length > 0 && (
        <p role="alert" style={{ color: 'var(--accent-danger)', fontSize: '0.82rem', margin: 0 }}>
          {incorrectFindings.length} {incorrectFindings.length === 1 ? 'classification is' : 'classifications are'} incorrect. Review the feedback and try again.
        </p>
      )}

      {completed && <p style={{ color: 'var(--accent-success)', fontSize: '0.85rem', margin: 0 }}>Stress test complete. You found and classified all four system weaknesses.</p>}
    </div>
  );
});
