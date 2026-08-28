import { expect, test, type Locator, type Page } from '@playwright/test';

const MINIMUM_TARGET_SIZE = 44;

async function expectMinimumTargetSize(target: Locator, name: string) {
  const box = await target.boundingBox();
  expect(box, `${name} should have a rendered target`).not.toBeNull();
  expect(box!.width, `${name} width`).toBeGreaterThanOrEqual(MINIMUM_TARGET_SIZE);
  expect(box!.height, `${name} height`).toBeGreaterThanOrEqual(MINIMUM_TARGET_SIZE);
}

async function expectVisibleTargetsMeetMinimum(page: Page, scopeName: string) {
  const targets = page.locator([
    'button:not([disabled])',
    'select:not([disabled])',
    'input:not([disabled]):not([type="hidden"]):not([type="radio"]):not([type="checkbox"])',
    '[role="button"]:not([aria-disabled="true"])',
    '[role="tab"]:not([aria-disabled="true"])',
    '[role="slider"]:not([aria-disabled="true"])',
    'a[href]',
  ].join(', '));

  for (let index = 0; index < await targets.count(); index += 1) {
    const target = targets.nth(index);
    if (!(await target.isVisible())) continue;

    const description = await target.evaluate((element) => {
      const htmlElement = element as HTMLElement;
      return element.getAttribute('aria-label')
        ?? htmlElement.innerText.trim()
        ?? element.getAttribute('name')
        ?? element.tagName.toLowerCase();
    });
    await expectMinimumTargetSize(target, `${scopeName}: ${description}`);
  }

  const choices = page.locator('input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled])');
  for (let index = 0; index < await choices.count(); index += 1) {
    const choice = choices.nth(index);
    if (!(await choice.isVisible())) continue;

    const id = await choice.getAttribute('id');
    const label = id ? page.locator(`label[for="${id}"]`) : choice.locator('xpath=ancestor::label[1]');
    await expectMinimumTargetSize(label, `${scopeName}: labelled choice ${id ?? index + 1}`);
  }
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('color-theory-course-state', JSON.stringify({
      version: 3,
      progress: {
        completedLessons: [
          'u1-l1', 'u1-l2', 'u1-l3', 'u1-l4', 'u1-l5', 'u1-l6',
          'u2-l1', 'u2-l2', 'u2-l3', 'u2-l4', 'u2-l5',
        ],
        completedQuizzes: [],
        quizBestScores: {},
        completedMilestones: ['milestone-1'],
      },
      preferences: { theme: 'system', reducedMotion: false, colorBlindnessMode: null },
    }));
  });
  await page.setViewportSize({ width: 320, height: 900 });
});

test('shared navigation targets meet the AAA minimum', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Menu' }).click();
  await expectVisibleTargetsMeetMinimum(page, 'shared navigation');
});

test('lesson controls meet the AAA minimum', async ({ page }) => {
  await page.goto('/lesson/u1-l1');
  await expectVisibleTargetsMeetMinimum(page, 'lesson');
});

test('milestone controls meet the AAA minimum', async ({ page }) => {
  await page.goto('/milestone/milestone-2');
  await expectVisibleTargetsMeetMinimum(page, 'milestone');
});

test('representative tool controls meet the AAA minimum', async ({ page }) => {
  await page.goto('/lesson/u2-l2');
  await page.getByRole('button', { name: 'next', exact: true }).click();
  await page.getByRole('button', { name: 'next', exact: true }).click();
  await expectVisibleTargetsMeetMinimum(page, 'RGB mixer');
});

test('Palette Builder controls meet the AAA minimum in each picker mode', async ({ page }) => {
  await page.goto('/palette-builder');

  for (const tabName of ['RGB', 'HSL', 'Swatches']) {
    await page.getByRole('button', { name: tabName }).click();
    await expectVisibleTargetsMeetMinimum(page, `Palette Builder ${tabName}`);
  }
});
