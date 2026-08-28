import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('route accessibility bundle boundaries', () => {
  it('does not load milestone configuration through the eager app shell', () => {
    const appShell = readFileSync('src/components/layout/AppShell.tsx', 'utf8');
    const routeAccessibility = readFileSync(
      'src/components/accessibility/RouteAccessibility.tsx',
      'utf8',
    );

    expect(`${appShell}\n${routeAccessibility}`).not.toContain('data/milestones');
  });
});
