import { memo, useState } from 'react';
import shellStyles from './ToolShell.module.css';
import styles from './BeforeAfterTool.module.css';

/* ── Clickable region data ────────────────────────────────────────────── */

type ColorJob =
  | 'drawing attention'
  | 'grouping items'
  | 'signaling status'
  | 'separating sections'
  | 'no clear purpose';

const ALL_JOBS: ColorJob[] = [
  'drawing attention',
  'grouping items',
  'signaling status',
  'separating sections',
  'no clear purpose',
];

interface Region {
  id: string;
  name: string;
  correctJob: ColorJob;
  explanation: string;
}

const REGIONS: Region[] = [
  {
    id: 'nav',
    name: 'dark nav bar',
    correctJob: 'separating sections',
    explanation: 'The dark background draws a boundary between navigation and content, creating clear sections without using a visible divider.',
  },
  {
    id: 'cta',
    name: 'gold CTA button',
    correctJob: 'drawing attention',
    explanation: 'Gold on a dark surface has the highest contrast on the screen. Color is being used to tell the user "this is the most important thing to do."',
  },
  {
    id: 'success',
    name: 'green success text',
    correctJob: 'signaling status',
    explanation: 'Green communicates a completed state — a widely learned convention. The color carries a specific meaning: something succeeded.',
  },
  {
    id: 'card',
    name: 'blue card border',
    correctJob: 'grouping items',
    explanation: 'The blue left border marks this element as a distinct type of content. It groups the label and text together as one unit.',
  },
];

/* ── Component ────────────────────────────────────────────────────────── */

interface BeforeAfterToolProps {
  variant?: 'color-function' | 'hierarchy';
  interactive?: boolean;
  previewMockup?: 'purposeful' | 'noisy';
  onComplete?: () => void;
}

export const BeforeAfterTool = memo(function BeforeAfterTool({ variant = 'color-function', interactive = true, previewMockup, onComplete }: BeforeAfterToolProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, boolean | null>>({});
  const [triedAnswer, setTriedAnswer] = useState<string | null>(null);

  const solvedCount = Object.values(results).filter(Boolean).length;
  const allSolved = solvedCount === REGIONS.length;

  function handleRegionClick(id: string) {
    if (results[id] === true) return; // already solved
    setActiveId(id);
    setTriedAnswer(null);
  }

  function handleAnswer(regionId: string, job: ColorJob) {
    const region = REGIONS.find((r) => r.id === regionId)!;
    const correct = job === region.correctJob;
    setTriedAnswer(job);
    if (correct) {
      const next = { ...results, [regionId]: true };
      setResults(next);
      if (Object.values(next).filter(Boolean).length === REGIONS.length) {
        onComplete?.();
      }
    } else {
      setResults((prev) => ({ ...prev, [regionId]: prev[regionId] === true ? true : false }));
    }
  }

  function handleDismiss() {
    setActiveId(null);
    setTriedAnswer(null);
  }

  if (previewMockup) {
    return (
      <div className={`${styles.mockup} ${previewMockup === 'purposeful' ? styles.mockupGood : styles.mockupBad}`}>
        <div className={styles.nav}>
          <span className={styles.navLogo}>color-theory-course$</span>
          <span className={styles.navLink}>settings</span>
        </div>
        <div className={styles.hero}>
          <span className={styles.heroHeading}>Learn color theory</span>
          <span className={styles.heroSub}>Six interactive units for developers.</span>
          <span className={styles.cta}>start learning</span>
        </div>
        <span className={styles.successBadge}>✓ Unit 1 complete</span>
        <div className={styles.card}>Lesson 2: Hue, saturation, and lightness →</div>
      </div>
    );
  }

  if (variant === 'hierarchy') {
    return (
      <div className={shellStyles.shell}>
        <span className={shellStyles.toolLabel}>hierarchy tuner</span>
        <HierarchyDemo interactive={interactive} onComplete={onComplete} />
      </div>
    );
  }

  const activeRegion = activeId ? REGIONS.find((r) => r.id === activeId) ?? null : null;
  const lastAnswerCorrect = triedAnswer !== null && activeRegion?.correctJob === triedAnswer;

  return (
    <div className={shellStyles.shell}>
      <span className={shellStyles.toolLabel}>
        {interactive ? 'click each colored area — what is it doing?' : 'before / after comparison'}
      </span>

      <div>
        {/* Purposeful mockup — interactive */}
        <div className={styles.panel}>
          <div className={`${styles.mockup} ${styles.mockupGood}`}>
            <div
              className={`${styles.nav} ${interactive ? styles.region : ''} ${results['nav'] === true ? styles.regionSolved : activeId === 'nav' ? styles.regionActive : ''}`}
              onClick={() => interactive && handleRegionClick('nav')}
              role={interactive ? 'button' : undefined}
              tabIndex={interactive ? 0 : undefined}
              onKeyDown={(e) => interactive && e.key === 'Enter' && handleRegionClick('nav')}
              aria-label={interactive ? 'Click to identify what the nav bar color is doing' : undefined}
            >
              <span className={styles.navLogo}>color-theory-course$</span>
              <span className={styles.navLink}>settings</span>
              {results['nav'] === true && <span className={styles.regionBadge}>✓</span>}
            </div>
            <div className={styles.hero}>
              <span className={styles.heroHeading}>Learn color theory</span>
              <span className={styles.heroSub}>Six interactive units for developers.</span>
              <span
                className={`${styles.cta} ${interactive ? styles.region : ''} ${results['cta'] === true ? styles.regionSolved : activeId === 'cta' ? styles.regionActive : ''}`}
                onClick={() => interactive && handleRegionClick('cta')}
                role={interactive ? 'button' : undefined}
                tabIndex={interactive ? 0 : undefined}
                onKeyDown={(e) => interactive && e.key === 'Enter' && handleRegionClick('cta')}
                aria-label={interactive ? 'Click to identify what the gold button color is doing' : undefined}
              >
                start learning
                {results['cta'] === true && <span className={styles.regionBadge}>✓</span>}
              </span>
            </div>
            <span
              className={`${styles.successBadge} ${interactive ? styles.region : ''} ${results['success'] === true ? styles.regionSolved : activeId === 'success' ? styles.regionActive : ''}`}
              onClick={() => interactive && handleRegionClick('success')}
              role={interactive ? 'button' : undefined}
              tabIndex={interactive ? 0 : undefined}
              onKeyDown={(e) => interactive && e.key === 'Enter' && handleRegionClick('success')}
              aria-label={interactive ? 'Click to identify what the green text color is doing' : undefined}
            >
              ✓ Unit 1 complete
              {results['success'] === true && <span className={styles.regionBadge} style={{ marginLeft: '4px' }}>✓</span>}
            </span>
            <div
              className={`${styles.card} ${interactive ? styles.region : ''} ${results['card'] === true ? styles.regionSolved : activeId === 'card' ? styles.regionActive : ''}`}
              onClick={() => interactive && handleRegionClick('card')}
              role={interactive ? 'button' : undefined}
              tabIndex={interactive ? 0 : undefined}
              onKeyDown={(e) => interactive && e.key === 'Enter' && handleRegionClick('card')}
              aria-label={interactive ? 'Click to identify what the blue card border color is doing' : undefined}
            >
              Lesson 2: Hue, saturation, and lightness →
              {results['card'] === true && <span className={styles.regionBadge}>✓</span>}
            </div>
          </div>
          {interactive && <p className={styles.hint}>Click each colored element ↑</p>}
        </div>
      </div>

      {/* Answer panel */}
      {interactive && activeRegion && (
        <div className={styles.answerPanel}>
          <div className={styles.answerHeader}>
            <span className={styles.answerQuestion}>
              What is the <strong>{activeRegion.name}</strong> doing?
            </span>
            <button className={styles.dismissBtn} onClick={handleDismiss} aria-label="Close">✕</button>
          </div>

          {triedAnswer === null || !lastAnswerCorrect ? (
            <div className={styles.answerChoices}>
              {ALL_JOBS.map((job) => (
                <button
                  key={job}
                  className={`${styles.answerChoice} ${
                    triedAnswer === job && !lastAnswerCorrect ? styles.answerWrong : ''
                  }`}
                  onClick={() => handleAnswer(activeRegion.id, job)}
                  disabled={lastAnswerCorrect}
                >
                  {job}
                </button>
              ))}
            </div>
          ) : null}

          {triedAnswer !== null && (
            <div className={`${styles.answerFeedback} ${lastAnswerCorrect ? styles.answerCorrect : styles.answerIncorrect}`}>
              {lastAnswerCorrect ? (
                <>
                  <span className={styles.answerIcon}>✓</span>
                  <p>{activeRegion.explanation}</p>
                  <button className={styles.nextBtn} onClick={handleDismiss}>got it</button>
                </>
              ) : (
                <>
                  <span className={styles.answerIcon}>✗</span>
                  <p>Not quite. Try another option.</p>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* Progress */}
      {interactive && <div className={styles.progressRow}>
        <span className={styles.score}>{solvedCount} / {REGIONS.length} identified</span>
        {allSolved && (
          <span className={styles.allDone}>All done — challenge complete!</span>
        )}
      </div>}
    </div>
  );
});

/* ── Hierarchy demo (lesson 5) ────────────────────────────────────────── */

const HIERARCHY_ITEMS = [
  { id: 'submit', label: 'Submit', role: 'primary' },
  { id: 'draft', label: 'Save Draft', role: 'secondary' },
  { id: 'cancel', label: 'Cancel', role: 'tertiary' },
] as const;
type BtnRole = 'primary' | 'secondary' | 'tertiary';

function HierarchyDemo({ interactive = true, onComplete }: { interactive?: boolean; onComplete?: () => void }) {
  const [roles, setRoles] = useState<Record<string, BtnRole>>({
    submit: 'secondary',
    draft: 'secondary',
    cancel: 'secondary',
  });
  const [checked, setChecked] = useState(false);

  const btnStyle = (role: BtnRole): React.CSSProperties => {
    if (role === 'primary') return { background: 'var(--yellow)', color: 'var(--gray-90)', border: 'none', padding: '0.5rem 1.2rem', borderRadius: '3px', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer' };
    if (role === 'secondary') return { background: 'transparent', color: 'var(--secondary-foreground)', border: '1px solid var(--border)', padding: '0.5rem 1.2rem', borderRadius: '3px', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', cursor: 'pointer' };
    return { background: 'transparent', color: 'var(--muted)', border: 'none', padding: '0.5rem 0.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', textDecoration: 'underline', cursor: 'pointer' };
  };

  const isCorrect = roles.submit === 'primary' && roles.draft === 'secondary' && roles.cancel === 'tertiary';

  function handleCheck() {
    setChecked(true);
    if (isCorrect) onComplete?.();
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '6px', padding: 'var(--spacing-lg)', display: 'flex', gap: 'var(--spacing-sm)', flexWrap: 'wrap' }}>
        {HIERARCHY_ITEMS.map((item) => (
          <button key={item.id} style={btnStyle(roles[item.id])}>{item.label}</button>
        ))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--muted)', textTransform: 'uppercase' }}>assign roles</span>
        {HIERARCHY_ITEMS.map((item) => (
          <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', width: '90px' }}>{item.label}</span>
            <select
              value={roles[item.id]}
              onChange={(e) => setRoles((r) => ({ ...r, [item.id]: e.target.value as BtnRole }))}
              disabled={checked || !interactive}
              style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', background: 'var(--primary-background)', color: 'var(--primary-foreground)', border: '1px solid var(--border)', borderRadius: '3px', padding: '0.3rem 0.5rem' }}
            >
              <option value="primary">primary (accent)</option>
              <option value="secondary">secondary (outlined)</option>
              <option value="tertiary">tertiary (text link)</option>
            </select>
          </div>
        ))}
      </div>
      {interactive && !checked && (
        <button
          onClick={handleCheck}
          style={{ alignSelf: 'flex-start', padding: '0.5rem 1.25rem', background: 'var(--yellow)', color: 'var(--gray-90)', fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.85rem', borderRadius: '3px', border: 'none', cursor: 'pointer' }}
        >
          check hierarchy
        </button>
      )}
      {checked && (
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: isCorrect ? 'var(--green)' : 'var(--red)' }}>
          {isCorrect
            ? '✓ Submit stands out as the primary action. Well done.'
            : '✗ Submit should be primary, Save Draft secondary, and Cancel a text link.'}
        </p>
      )}
    </div>
  );
}
