import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('home unit disclosures expose native semantics and keyboard behavior', async ({ page }) => {
  await page.goto('/');

  const heroLink = page.getByRole('link', { name: 'Start: What Color Does in Interface Design' }).first();
  const startLink = page.getByRole('link', { name: 'Start: What Color Does in Interface Design' }).nth(1);
  const lessonLink = page.getByRole('link', { name: 'Continue: What Color Does in Interface Design' });

  await heroLink.focus();
  await page.keyboard.press('Tab');

  const collapseButton = page.getByRole('button', {
    name: 'Collapse Seeing and Describing Color',
  });
  await expect(collapseButton).toBeFocused();
  await expect(collapseButton).toHaveAttribute('aria-controls', 'unit-1-lessons');
  await expect(collapseButton).toHaveAttribute('aria-expanded', 'true');
  await expect(collapseButton).toMatchAriaSnapshot(`
    - button "Collapse Seeing and Describing Color" [expanded]
  `);
  await expect.poll(() => collapseButton.evaluate((element) => {
    const style = getComputedStyle(element);
    return `${style.outlineStyle} ${style.outlineWidth}`;
  })).toBe('solid 2px');

  await page.keyboard.press('Enter');
  const expandButton = page.getByRole('button', {
    name: 'Expand Seeing and Describing Color',
  });
  await expect(expandButton).toHaveAttribute('aria-expanded', 'false');
  await expect(lessonLink).toBeHidden();

  await page.keyboard.press('Space');
  await expect(collapseButton).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('Tab');
  await expect(startLink).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(lessonLink).toBeFocused();
});

test('home page has no nested interactive accessibility violation', async ({ page }) => {
  await page.goto('/');

  const results = await new AxeBuilder({ page }).analyze();
  const nestedInteractive = results.violations.filter(({ id }) => id === 'nested-interactive');

  expect(nestedInteractive).toEqual([]);
});
