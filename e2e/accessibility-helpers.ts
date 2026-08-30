import AxeBuilder from '@axe-core/playwright';
import type { Page } from '@playwright/test';

export interface AccessibilityScanContext {
  route: string;
  theme: 'dark' | 'light';
  state: string;
}

export interface AccessibilityScanExclusion {
  selector: string;
  authoredVisual: string;
  visualEquivalenceCoverage: readonly string[];
}

export async function expectNoAccessibilityViolations(
  page: Page,
  context: AccessibilityScanContext,
  exclusions: readonly AccessibilityScanExclusion[] = [],
) {
  let builder = new AxeBuilder({ page });

  for (const exclusion of exclusions) {
    builder = builder.exclude(exclusion.selector);
  }

  const results = await builder.analyze();
  if (results.violations.length === 0) return;

  const details = results.violations.flatMap((violation) =>
    violation.nodes.map((node) => [
      `rule: ${violation.id}`,
      `element: ${node.target.join(' ')}`,
      `impact: ${node.impact ?? violation.impact ?? 'unknown'}`,
      `failure: ${node.failureSummary ?? violation.description}`,
    ].join('\n')),
  );

  throw new Error([
    'Automated accessibility scan failed.',
    `route: ${context.route}`,
    `theme: ${context.theme}`,
    `state: ${context.state}`,
    ...details,
  ].join('\n'));
}
