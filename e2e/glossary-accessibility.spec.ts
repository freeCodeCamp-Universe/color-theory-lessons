import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

const STORAGE_KEY = 'color-theory-course-state';

async function seedGlossary(page: Page, theme: 'dark' | 'light') {
  await page.addInitScript(({ key, selectedTheme }) => {
    localStorage.setItem(key, JSON.stringify({
      version: 3,
      progress: {
        completedLessons: ['u1-l1', 'u2-l1'],
        completedQuizzes: [],
        quizBestScores: {},
        completedMilestones: [],
      },
      preferences: {
        theme: selectedTheme,
        reducedMotion: false,
        colorBlindnessMode: null,
      },
    }));
  }, { key: STORAGE_KEY, selectedTheme: theme });
}

for (const theme of ['dark', 'light'] as const) {
  test(`populated glossary has valid description-list semantics in ${theme} theme`, async ({ page }) => {
    await seedGlossary(page, theme);
    await page.goto('/glossary');

    await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
    await expect(page.locator('main dl').first()).toBeVisible();
    expect(await page.locator('main dt').count()).toBeGreaterThan(0);
    expect(await page.locator('main dd').count()).toBeGreaterThan(0);

    const results = await new AxeBuilder({ page }).include('main').analyze();
    const descriptionListViolations = results.violations.filter(
      ({ id }) => id === 'definition-list' || id === 'dlitem',
    );

    expect(descriptionListViolations).toEqual([]);
  });
}
