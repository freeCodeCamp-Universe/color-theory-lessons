import { useMemo } from 'react';
import { glossary } from '../data/glossary.ts';
import { useAppState } from '../state/app-context.tsx';
import styles from './GlossaryPage.module.css';
import { DocumentTitle } from '../components/accessibility/DocumentTitle.tsx';

export function GlossaryPage() {
  const { completedLessons } = useAppState();

  const visibleTerms = useMemo(() => {
    return glossary
      .filter((entry) => entry.relatedLessons.some((id) => completedLessons.includes(id)))
      .sort((a, b) => a.term.localeCompare(b.term));
  }, [completedLessons]);

  const byLetter = useMemo(() => {
    const map = new Map<string, typeof visibleTerms>();
    for (const entry of visibleTerms) {
      const letter = entry.term[0].toUpperCase();
      if (!map.has(letter)) map.set(letter, []);
      map.get(letter)!.push(entry);
    }
    return Array.from(map.entries());
  }, [visibleTerms]);

  return (
    <div className={styles.container}>
      <DocumentTitle page="Glossary" />
      <h1 className={styles.heading}>glossary</h1>
      <p className={styles.subtitle}>
        Terms from completed lessons, in alphabetical order.
      </p>

      {visibleTerms.length === 0 ? (
        <p className={styles.empty}>
          No terms yet. Complete your first lesson to unlock this glossary.
        </p>
      ) : (
        <dl className={styles.termList}>
          {byLetter.map(([letter, terms]) => (
            <div key={letter} className={styles.letterGroup}>
              <span className={styles.letter}>{letter}</span>
              {terms.map((entry) => (
                <div key={entry.term} className={styles.entry}>
                  <dt className={styles.term}>{entry.term}</dt>
                  <dd className={styles.definition}>{entry.definition}</dd>
                </div>
              ))}
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}
