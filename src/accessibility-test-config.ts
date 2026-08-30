import type { Result } from 'axe-core';

export const AXE_CONTRAST_RULES = [
  'color-contrast',
  'color-contrast-enhanced',
] as const;

export function formatAccessibilityViolations(violations: readonly Result[]) {
  return violations.flatMap((violation) =>
    violation.nodes.map((node) => [
      `rule: ${violation.id}`,
      `element: ${node.target.join(' ')}`,
      `impact: ${node.impact ?? violation.impact ?? 'unknown'}`,
      `failure: ${node.failureSummary ?? violation.description}`,
    ].join('\n')),
  );
}
