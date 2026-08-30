import axe from 'axe-core';
import { describe, expect, it } from 'vitest';
import {
  AXE_CONTRAST_RULES,
  formatAccessibilityViolations,
} from './accessibility-test-config.ts';

describe('accessibility test configuration', () => {
  it('supports component-level axe scans with the shared dependency', async () => {
    document.body.innerHTML = '<button></button>';

    const results = await axe.run(document.body, {
      rules: Object.fromEntries(
        AXE_CONTRAST_RULES.map((rule) => [rule, { enabled: false }]),
      ),
    });

    expect(formatAccessibilityViolations(results.violations)).toEqual(
      expect.arrayContaining([expect.stringContaining('rule: button-name')]),
    );
  });
});
