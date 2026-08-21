import { useMemo } from 'react';
import { lessonRegistry } from '../lessons/lesson-registry.ts';
import { useAppState } from '../state/app-context.tsx';
import { TAG_LABELS } from '../data/reviewTags.ts';
import styles from './ReviewPage.module.css';

interface ReviewEntry {
  lessonId: string;
  title: string;
  keyPoints: string[];
}

export function ReviewPage() {
  const { completedLessons } = useAppState();

  const topicMap = useMemo(() => {
    const map = new Map<string, ReviewEntry[]>();

    for (const lesson of lessonRegistry) {
      if (!completedLessons.includes(lesson.id)) continue;
      if (!lesson.keyPoints || lesson.keyPoints.length === 0) continue;

      const entry: ReviewEntry = {
        lessonId: lesson.id,
        title: lesson.title,
        keyPoints: lesson.keyPoints,
      };

      for (const tag of lesson.reviewTags) {
        if (!map.has(tag)) map.set(tag, []);
        if (!map.get(tag)!.some((e) => e.lessonId === lesson.id)) {
          map.get(tag)!.push(entry);
        }
      }
    }

    return Array.from(map.entries()).sort(([a], [b]) => {
      const labelA = TAG_LABELS[a] ?? a;
      const labelB = TAG_LABELS[b] ?? b;
      return labelA.localeCompare(labelB);
    });
  }, [completedLessons]);

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>review</h1>
      <p className={styles.subtitle}>
        Key facts from completed lessons, grouped by topic.
      </p>

      {topicMap.length === 0 ? (
        <p className={styles.empty}>
          No review content yet — complete your first lesson to unlock this section.
        </p>
      ) : (
        <div className={styles.topicList}>
          {topicMap.map(([tag, entries]) => (
            <section key={tag} className={styles.topic}>
              <h2 className={styles.topicHeading}>
                {TAG_LABELS[tag] ?? tag}
              </h2>
              <div className={styles.entryList}>
                {entries.map((entry) => (
                  <div key={`${tag}-${entry.lessonId}`} className={styles.entry}>
                    <span className={styles.entryTitle}>{entry.title}</span>
                    <ul className={styles.pointList}>
                      {entry.keyPoints.map((point) => (
                        <li key={point} className={styles.point}>{point}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
