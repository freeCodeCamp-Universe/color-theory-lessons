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
    'button:not([disabled]):not([data-target-size-exception="essential"])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    'input:not([disabled]):not([type="hidden"]):not([type="radio"]):not([type="checkbox"])',
    '[role="button"]:not([aria-disabled="true"]):not([data-target-size-exception="essential"])',
    '[role="tab"]:not([aria-disabled="true"]):not([data-target-size-exception="essential"])',
    '[role="slider"]:not([aria-disabled="true"]):not([data-target-size-exception="essential"])',
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

async function advanceToLastLessonStep(page: Page, toolName: string) {
  await page.locator('aside h1').waitFor();
  for (let step = 0; step < 10; step += 1) {
    const next = page.getByRole('button', { name: 'next', exact: true });
    if (!(await next.isVisible().catch(() => false))) break;
    await next.click();
  }
  await expect(page.getByText(toolName, { exact: true }).first()).toBeVisible();
}

async function expectTargetsDoNotOverlap(page: Page, scopeName: string) {
  const overlaps = await page.evaluate(() => {
    const selector = 'button:not(:disabled),select:not(:disabled),textarea:not(:disabled),input:not(:disabled):not([type="hidden"]):not([type="radio"]):not([type="checkbox"]),[role="button"]:not([aria-disabled="true"]),[role="tab"]:not([aria-disabled="true"]),[role="slider"]:not([aria-disabled="true"]),a[href]';
    const targets = [...document.querySelectorAll<HTMLElement>(selector)].filter((element) => {
      const rect = element.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0 && getComputedStyle(element).visibility !== 'hidden';
    });
    const failures: string[] = [];
    for (let first = 0; first < targets.length; first += 1) {
      for (let second = first + 1; second < targets.length; second += 1) {
        const a = targets[first];
        const b = targets[second];
        if (a.contains(b) || b.contains(a)) continue;
        const aRect = a.getBoundingClientRect();
        const bRect = b.getBoundingClientRect();
        const width = Math.min(aRect.right, bRect.right) - Math.max(aRect.left, bRect.left);
        const height = Math.min(aRect.bottom, bRect.bottom) - Math.max(aRect.top, bRect.top);
        if (width > 0.5 && height > 0.5) {
          const name = (element: HTMLElement) => element.getAttribute('aria-label') || element.innerText.trim();
          failures.push(`${name(a)} overlaps ${name(b)}`);
        }
      }
    }
    return failures;
  });
  expect(overlaps, `${scopeName} targets`).toEqual([]);
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('color-theory-course-state', JSON.stringify({
      version: 3,
      progress: {
        completedLessons: [
          'u1-l1', 'u1-l2', 'u1-l3', 'u1-l4', 'u1-l5', 'u1-l6',
          'u2-l1', 'u2-l2', 'u2-l3', 'u2-l4', 'u2-l5',
          'u3-l1', 'u3-l2', 'u3-l3', 'u3-l4', 'u3-l5', 'u3-l6',
          'u4-l1', 'u4-l2', 'u4-l3', 'u4-l4',
          'u5-l1', 'u5-l2', 'u5-l3', 'u5-l4', 'u5-l5', 'u5-l6',
          'u6-l1', 'u6-l2', 'u6-l3', 'u6-l4',
        ],
        completedQuizzes: [],
        quizBestScores: {},
        completedMilestones: ['milestone-1', 'milestone-2', 'milestone-3', 'milestone-4', 'milestone-5'],
      },
      preferences: { theme: 'system', reducedMotion: false, colorBlindnessMode: null },
    }));
  });
  await page.setViewportSize({ width: 320, height: 900 });
});

test('shared navigation targets meet the AAA minimum', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await page.getByRole('button', { name: 'Menu' }).click();
  await expectVisibleTargetsMeetMinimum(page, 'shared navigation');
});

test('lesson controls meet the AAA minimum', async ({ page }) => {
  await page.goto('/lesson/u1-l1');
  await expect(page.locator('aside h1')).toBeVisible();
  await expectVisibleTargetsMeetMinimum(page, 'lesson');
});

test('milestone controls meet the AAA minimum', async ({ page }) => {
  await page.goto('/milestone/milestone-2');
  await expect(page.locator('aside h1')).toBeVisible();
  await expectVisibleTargetsMeetMinimum(page, 'milestone');
});

test('representative tool controls meet the AAA minimum', async ({ page }) => {
  await page.goto('/lesson/u2-l2');
  await advanceToLastLessonStep(page, 'RGB light mixer');
  await expectVisibleTargetsMeetMinimum(page, 'RGB mixer');
});

test('System Comparison targets meet the AAA minimum', async ({ page }) => {
  await page.goto('/lesson/u6-l1');
  await advanceToLastLessonStep(page, 'system comparison');
  await expectVisibleTargetsMeetMinimum(page, 'System Comparison');
});

test('Format Reveal preserves essential authored target boundaries', async ({ page }) => {
  await page.goto('/lesson/u3-l1');
  await advanceToLastLessonStep(page, 'format explorer');

  for (const name of ['Nav text', 'Primary action button', 'Card border', 'Success accent']) {
    const target = page.getByRole('button', { name, exact: true });
    await expect(target).toHaveAttribute('data-target-size-exception', 'essential');
    const box = await target.boundingBox();
    expect(box, `${name} should have a rendered target`).not.toBeNull();
    expect(
      box!.width < MINIMUM_TARGET_SIZE || box!.height < MINIMUM_TARGET_SIZE,
      `${name} should retain its authored visual boundary`,
    ).toBe(true);
  }
});

test('invalid-route recovery links meet the AAA minimum', async ({ page }) => {
  for (const route of ['/lesson/not-a-lesson', '/milestone/not-a-milestone']) {
    await page.goto(route);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expectMinimumTargetSize(page.getByRole('link', { name: 'back to home' }), route);
  }
});

test('exercise routes reflow with text-spacing overrides', async ({ page }) => {
  const routes = {
    'u1-l5': 'hierarchy tuner',
    'u2-l1': 'additive vs subtractive',
    'u3-l1': 'format explorer',
    'u4-l3': 'interface gallery',
    'u4-l4': 'color-only detector',
    'u5-l1': 'text contrast lab',
    'u5-l4': 'pattern repair workshop',
    'u5-l6': 'inclusive review',
    'u6-l5': 'chart tuner',
  } as const;
  for (const [lessonId, toolName] of Object.entries(routes)) {
    await page.goto(`/lesson/${lessonId}`);
    await advanceToLastLessonStep(page, toolName);
    await expect.poll(
      () => page.evaluate(() => document.documentElement.scrollWidth),
      { message: `${lessonId} should not overflow horizontally before text spacing` },
    ).toBeLessThanOrEqual(320);
    await page.addStyleTag({ content: `
      * { line-height: 1.5 !important; letter-spacing: 0.12em !important; word-spacing: 0.16em !important; }
      p { margin-bottom: 2em !important; }
    ` });
    await expect.poll(
      () => page.evaluate(() => document.documentElement.scrollWidth),
      { message: `${lessonId} should not overflow horizontally` },
    ).toBeLessThanOrEqual(320);
    await expectTargetsDoNotOverlap(page, lessonId);
  }
});

test('Palette Builder controls meet the AAA minimum in each picker mode', async ({ page }) => {
  await page.goto('/palette-builder');
  await expect(page.getByRole('heading', { level: 1, name: 'palette builder' })).toBeVisible();

  for (const tabName of ['RGB', 'HSL', 'Swatches']) {
    await page.getByRole('button', { name: tabName }).click();
    await expectVisibleTargetsMeetMinimum(page, `Palette Builder ${tabName}`);
  }
});
