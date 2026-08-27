/// <reference types="node" />

import { readFileSync, readdirSync } from 'node:fs';
import { extname, join } from 'node:path';
import { describe, expect, it } from 'vitest';

function sourceFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return sourceFiles(path);
    if (entry.name.includes('.test.') || !['.css', '.tsx'].includes(extname(entry.name))) return [];
    return [path];
  });
}

describe('CTA gold usage', () => {
  it('reserves the CTA accent for action backgrounds', () => {
    const invalidUses = sourceFiles('src').flatMap((file) => (
      readFileSync(file, 'utf8')
        .split('\n')
        .map((line, index) => ({ file, line, lineNumber: index + 1 }))
        .filter(({ line }) => line.includes('var(--accent-cta)'))
        .filter(({ line }) => !/background(?:-color)?:.*var\(--accent-cta\)/.test(line))
    ));

    expect(invalidUses).toEqual([]);
  });

  it('does not reduce the opacity of informational fixed-role labels', () => {
    for (const file of [
      'src/components/tools/BrandPressureTool.tsx',
      'src/components/tools/DarkTranslatorTool.tsx',
    ]) {
      expect(readFileSync(file, 'utf8')).not.toMatch(/opacity:\s*0\.7/);
    }
  });
});
