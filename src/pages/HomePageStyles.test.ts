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
});
