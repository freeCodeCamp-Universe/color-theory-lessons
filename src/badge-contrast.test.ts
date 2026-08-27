/// <reference types="node" />

import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const lessonStyles = readFileSync('src/components/lesson/LessonPlayer.module.css', 'utf8');
const milestoneStyles = readFileSync('src/components/milestone/MilestonePlayer.module.css', 'utf8');
const simulationStyles = readFileSync(
  'src/components/milestone/challenges/SimulationSpotterChallenge.module.css',
  'utf8',
);
const contrastTool = readFileSync('src/components/tools/TextContrastLabTool.tsx', 'utf8');

describe('accent text badge backgrounds', () => {
  it('uses the measured AAA tint tokens for completion and result badges', () => {
    expect(lessonStyles).toContain('background-color: var(--badge-success-background)');
    expect(milestoneStyles).toContain('background-color: var(--badge-link-background)');
    expect(milestoneStyles).toContain('background-color: var(--badge-success-background)');
    expect(milestoneStyles).toContain('background-color: var(--badge-warning-background)');
    expect(simulationStyles).toContain('background: var(--badge-warning-background)');
    expect(contrastTool).toContain("'var(--badge-success-background)'");
    expect(contrastTool).toContain("'var(--badge-danger-background)'");
  });
});
