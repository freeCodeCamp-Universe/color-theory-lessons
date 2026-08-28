/// <reference types="node" />

import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const css = readFileSync('src/pages/HomePage.module.css', 'utf8');
const source = readFileSync('src/pages/HomePage.tsx', 'utf8');

describe('HomePage locked rows', () => {
  it('does not reduce the opacity of informational locked content', () => {
    expect(css).not.toMatch(/\.lessonLocked\s*{[^}]*opacity:/s);
    expect(source).not.toMatch(/styles\.lessonLocked(?!Label)/);
  });

  it('uses the global visible focus treatment for the native disclosure button', () => {
    expect(source).toMatch(/<button[\s\S]*className={styles\.unitDisclosure}/);
    expect(css).not.toMatch(/\.unitDisclosure:focus(?:-visible)?\s*{[^}]*(?:outline:\s*none|outline:\s*0)/s);
  });
});
