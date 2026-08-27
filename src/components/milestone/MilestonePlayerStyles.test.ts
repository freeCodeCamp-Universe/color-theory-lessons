/// <reference types="node" />

import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const css = readFileSync('src/components/milestone/MilestonePlayer.module.css', 'utf8');

describe('MilestonePlayer layout styles', () => {
  it('allows the context column to shrink within a narrow viewport', () => {
    expect(css).toContain('grid-template-columns: minmax(0, 1fr);');
    expect(css).toContain('grid-template-columns: 340px minmax(0, 1fr);');
  });

  it('keeps the question panel left of the context panel on wide screens', () => {
    expect(css).toContain("grid-template-areas: 'panel context';");
    expect(css).toMatch(/\.panel\s*{\s*grid-area: panel;/);
    expect(css).toMatch(/\.contextPanel\s*{\s*grid-area: context;/);
  });
});
