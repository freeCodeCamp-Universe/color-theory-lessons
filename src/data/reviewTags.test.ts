import { describe, it, expect } from 'vitest';
import { TAG_LABELS } from './reviewTags.ts';
import { lessonRegistry } from '../lessons/lesson-registry.ts';

describe('reviewTags', () => {
  it('every tag used in lesson metadata resolves to a label (no raw slugs)', () => {
    const missing: string[] = [];
    for (const lesson of lessonRegistry) {
      for (const tag of lesson.reviewTags) {
        if (!(tag in TAG_LABELS)) {
          missing.push(`${lesson.id}: "${tag}"`);
        }
      }
    }
    expect(missing, `Tags without a label:\n${missing.join('\n')}`).toHaveLength(0);
  });

  it('no two keys share the same label (no label collisions)', () => {
    const seen = new Map<string, string>();
    const collisions: string[] = [];
    for (const [key, label] of Object.entries(TAG_LABELS)) {
      if (seen.has(label)) {
        collisions.push(`"${key}" and "${seen.get(label)}" both map to "${label}"`);
      } else {
        seen.set(label, key);
      }
    }
    expect(collisions, `Label collisions:\n${collisions.join('\n')}`).toHaveLength(0);
  });

  it('TAG_LABELS contains every key referenced by at least one lesson (no dead entries)', () => {
    const usedTags = new Set<string>();
    for (const lesson of lessonRegistry) {
      for (const tag of lesson.reviewTags) {
        usedTags.add(tag);
      }
    }
    const dead: string[] = [];
    for (const key of Object.keys(TAG_LABELS)) {
      if (!usedTags.has(key)) {
        dead.push(key);
      }
    }
    // Dead entries are not a hard error (reserved tags are allowed), but we
    // report them to catch accidental taxonomy drift.
    if (dead.length > 0) {
      console.warn('TAG_LABELS keys not referenced by any lesson:', dead);
    }
  });
});
