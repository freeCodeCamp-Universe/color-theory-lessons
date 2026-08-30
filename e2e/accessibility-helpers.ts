import AxeBuilder from '@axe-core/playwright';
import type { Page } from '@playwright/test';
import {
  AXE_CONTRAST_RULES,
  formatAccessibilityViolations,
} from '../src/accessibility-test-config.ts';

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
  const nonContrastResults = await new AxeBuilder({ page })
    .disableRules([...AXE_CONTRAST_RULES])
    .analyze();
  let contrastBuilder = new AxeBuilder({ page }).withRules([...AXE_CONTRAST_RULES]);

  for (const exclusion of exclusions) {
    contrastBuilder = contrastBuilder.exclude(exclusion.selector);
  }

  const contrastResults = await contrastBuilder.analyze();
  const violations = [
    ...nonContrastResults.violations,
    ...contrastResults.violations,
  ];
  if (violations.length === 0) return;

  throw new Error([
    'Automated accessibility scan failed.',
    `route: ${context.route}`,
    `theme: ${context.theme}`,
    `state: ${context.state}`,
    ...formatAccessibilityViolations(violations),
  ].join('\n'));
}
