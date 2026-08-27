import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { INTERACTION_TYPES } from './types/lesson.ts';
import { MILESTONE_CHALLENGE_TYPES } from './types/milestone.ts';

const inventoryPath = resolve(process.cwd(), 'docs/ACCESSIBLE_VISUALS.md');
const inventory = readFileSync(inventoryPath, 'utf8');

function inventoryRow(type: string): string | undefined {
  return inventory.split('\n').find((line) => line.startsWith(`| \`${type}\` |`));
}

describe('accessible visual inventory', () => {
  it.each(INTERACTION_TYPES)('assigns the %s interaction type to a child issue', (type) => {
    expect(inventoryRow(type)).toMatch(/\| #(?:101|102|103|104|105|106|108) \|$/);
  });

  it.each(MILESTONE_CHALLENGE_TYPES)('assigns the %s milestone challenge to issue #110', (type) => {
    expect(inventoryRow(type)).toMatch(/\| #110 \|$/);
  });

  it('includes shared shells and Palette Builder', () => {
    expect(inventory).toContain('## Shared shell inventory');
    expect(inventory).toContain('| LessonPlayer |');
    expect(inventory).toContain('| ExerciseStage |');
    expect(inventory).toContain('| MilestonePlayer |');
    expect(inventory).toContain('## Palette Builder inventory');
    expect(inventory).toContain('| Picker tabs, hue ring, and current picker marker |');
  });
});
