import { memo, useState } from 'react';
import { ExerciseStage } from './ExerciseStage.tsx';
import shellStyles from './ToolShell.module.css';
import styles from './BeforeAfterTool.module.css';
import type {
  ExerciseStageController,
  ExerciseStageDefinition,
  ExerciseToolProps,
} from './exercise-stage.ts';
import { useExerciseStages } from './useExerciseStages.ts';

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
    explanation: 'The dark background separates the navigation from the page content without a visible divider.',
  },
  {
    id: 'cta',
    name: 'gold primary action button',
    correctJob: 'drawing attention',
    explanation: 'The gold button contrasts with the dark background and gray controls, drawing attention to the primary action.',
  },
  {
    id: 'success',
    name: 'green success text',
    correctJob: 'signaling status',
    explanation: 'Green marks the completed state, following a common interface convention.',
  },
  {
    id: 'card',
    name: 'blue card border',
    correctJob: 'grouping items',
    explanation: 'The blue left border marks this element as a distinct type of content. It groups the label and text together as one unit.',
  },
];

/* ── Component ────────────────────────────────────────────────────────── */

interface BeforeAfterToolProps extends ExerciseToolProps {
  variant?: 'color-function' | 'hierarchy';
  previewMockup?: 'purposeful' | 'noisy';
}

const COLOR_ROLE_STAGES = [
  {
    id: 'identify-color-roles',
    title: 'identify the color roles',
    instruction: 'Select each colored area and identify the job its color performs.',
  },
] satisfies readonly ExerciseStageDefinition[];

const HIERARCHY_STAGES = [
  {
    id: 'assign-action-hierarchy',
    title: 'assign the action hierarchy',
    instruction: 'Assign a primary, secondary, or tertiary role to each action, then check the hierarchy.',
  },
] satisfies readonly ExerciseStageDefinition[];

export const BeforeAfterTool = memo(function BeforeAfterTool({
  variant = 'color-function',
  interactive = true,
  previewMockup,
  onComplete,
  onStageChange,
}: BeforeAfterToolProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, boolean | null>>({});
  const [selectedAnswer, setSelectedAnswer] = useState<ColorJob | null>(null);
  const [triedAnswer, setTriedAnswer] = useState<ColorJob | null>(null);

  const solvedCount = Object.values(results).filter(Boolean).length;
  const stageController = useExerciseStages({
    stages: variant === 'hierarchy' ? HIERARCHY_STAGES : COLOR_ROLE_STAGES,
    onComplete,
    onStageChange,
  });

  function handleRegionClick(id: string) {
    if (results[id] === true) return; // already solved
    setActiveId(id);
    setSelectedAnswer(null);
    setTriedAnswer(null);
  }

  function handleRegionKeyDown(e: React.KeyboardEvent<HTMLElement>, id: string) {
    if (!interactive) return;
    if (e.key !== 'Enter' && e.key !== ' ') return;
    e.preventDefault();
    handleRegionClick(id);
  }

  function handleCheckAnswer(regionId: string, job: ColorJob) {
    const region = REGIONS.find((r) => r.id === regionId)!;
    const correct = job === region.correctJob;
    setTriedAnswer(job);
    if (correct) {
      const next = { ...results, [regionId]: true };
      setResults(next);
      if (Object.values(next).filter(Boolean).length === REGIONS.length) {
        stageController.markPassed();
      }
    } else {
      setResults((prev) => ({ ...prev, [regionId]: prev[regionId] === true ? true : false }));
      stageController.markIncorrect();
    }
  }

  function handleDismiss() {
    setActiveId(null);
    setSelectedAnswer(null);
    setTriedAnswer(null);
  }

  if (previewMockup) {
    return (
      <div className={styles.previewFrame}>
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
      </div>
    );
  }

  if (variant === 'hierarchy') {
    return (
      <div className={shellStyles.shell}>
        <span className={shellStyles.toolLabel}>hierarchy tuner</span>
        <HierarchyDemo interactive={interactive} stageController={stageController} />
      </div>
    );
  }

  const activeRegion = activeId ? REGIONS.find((r) => r.id === activeId) ?? null : null;
  const lastAnswerCorrect = triedAnswer !== null && activeRegion?.correctJob === triedAnswer;

  return (
    <div className={shellStyles.shell}>
      <span className={shellStyles.toolLabel}>
        {interactive ? 'identify each color\'s role' : 'before / after comparison'}
      </span>

      <ExerciseStage
        controller={stageController}
        incorrectFeedback={<span style={{ color: 'var(--red)' }}>That role does not match this area.</span>}
        completionFeedback={<span style={{ color: 'var(--green)' }}>✓ All four color roles identified.</span>}
        onRetry={() => setTriedAnswer(null)}
      >

      <div>
        {/* Purposeful mockup — interactive */}
        <div className={styles.panel}>
          <div className={`${styles.mockup} ${styles.mockupGood}`}>
            <div
              className={`${styles.nav} ${interactive ? styles.region : ''} ${results['nav'] === true ? styles.regionSolved : activeId === 'nav' ? styles.regionActive : ''}`}
              onClick={() => interactive && handleRegionClick('nav')}
              role={interactive ? 'button' : undefined}
              tabIndex={interactive ? 0 : undefined}
              onKeyDown={(e) => handleRegionKeyDown(e, 'nav')}
              aria-label={interactive ? 'Click to identify what the nav bar color is doing' : undefined}
              aria-disabled={interactive && results['nav'] === true ? true : undefined}
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
                onKeyDown={(e) => handleRegionKeyDown(e, 'cta')}
                aria-label={interactive ? 'Click to identify what the gold button color is doing' : undefined}
                aria-disabled={interactive && results['cta'] === true ? true : undefined}
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
              onKeyDown={(e) => handleRegionKeyDown(e, 'success')}
              aria-label={interactive ? 'Click to identify what the green text color is doing' : undefined}
              aria-disabled={interactive && results['success'] === true ? true : undefined}
            >
              ✓ Unit 1 complete
              {results['success'] === true && <span className={styles.regionBadge} style={{ marginLeft: '4px' }}>✓</span>}
            </span>
            <div
              className={`${styles.card} ${interactive ? styles.region : ''} ${results['card'] === true ? styles.regionSolved : activeId === 'card' ? styles.regionActive : ''}`}
              onClick={() => interactive && handleRegionClick('card')}
              role={interactive ? 'button' : undefined}
              tabIndex={interactive ? 0 : undefined}
              onKeyDown={(e) => handleRegionKeyDown(e, 'card')}
              aria-label={interactive ? 'Click to identify what the blue card border color is doing' : undefined}
              aria-disabled={interactive && results['card'] === true ? true : undefined}
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

          {triedAnswer === null ? (
            <div className={styles.answerChoices}>
              {ALL_JOBS.map((job) => (
                <button
                  key={job}
                  className={`${styles.answerChoice} ${
                    selectedAnswer === job ? styles.answerSelected : ''
                  }`}
                  onClick={() => setSelectedAnswer(job)}
                  aria-pressed={selectedAnswer === job}
                >
                  {job}
                </button>
              ))}
              <button
                className={styles.checkAnswerBtn}
                disabled={selectedAnswer === null}
                onClick={() => selectedAnswer && handleCheckAnswer(activeRegion.id, selectedAnswer)}
              >
                check role
              </button>
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
      </div>}
      </ExerciseStage>
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

function HierarchyDemo({
  interactive = true,
  stageController,
}: {
  interactive?: boolean;
  stageController: ExerciseStageController;
}) {
  const [roles, setRoles] = useState<Record<string, BtnRole>>({
    submit: 'secondary',
    draft: 'secondary',
    cancel: 'secondary',
  });
  const checked = stageController.result !== 'idle';

  const btnStyle = (role: BtnRole): React.CSSProperties => {
    if (role === 'primary') return { background: 'var(--yellow)', color: 'var(--gray-90)', border: 'none', padding: '0.5rem 1.2rem', borderRadius: '3px', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', fontWeight: 700 };
    if (role === 'secondary') return { background: 'transparent', color: 'var(--secondary-foreground)', border: '1px solid var(--border)', padding: '0.5rem 1.2rem', borderRadius: '3px', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' };
    return { background: 'transparent', color: 'var(--muted)', border: 'none', padding: '0.5rem 0.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', textDecoration: 'underline' };
  };

  const isCorrect = roles.submit === 'primary' && roles.draft === 'secondary' && roles.cancel === 'tertiary';

  function handleCheck() {
    if (isCorrect) stageController.markPassed();
    else stageController.markIncorrect();
  }

  return (
    <ExerciseStage
      controller={stageController}
      incorrectFeedback={(
        <span style={{ color: 'var(--red)' }}>
          Submit should be primary, Save Draft secondary, and Cancel tertiary.
        </span>
      )}
      completionFeedback={(
        <span style={{ color: 'var(--green)' }}>✓ Submit stands out as the primary action.</span>
      )}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '6px', padding: 'var(--spacing-lg)', display: 'flex', gap: 'var(--spacing-sm)', flexWrap: 'wrap' }}>
        {HIERARCHY_ITEMS.map((item) => (
          <span key={item.id} style={btnStyle(roles[item.id])}>{item.label}</span>
        ))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--muted)', textTransform: 'uppercase' }}>assign roles</span>
        {HIERARCHY_ITEMS.map((item) => (
          <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
            <label htmlFor={`hierarchy-role-${item.id}`} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', width: '90px' }}>{item.label}</label>
            <select
              id={`hierarchy-role-${item.id}`}
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
      </div>
    </ExerciseStage>
  );
}
