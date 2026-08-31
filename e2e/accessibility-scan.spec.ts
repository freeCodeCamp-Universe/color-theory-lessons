import { expect, test, type Page } from '@playwright/test';
import { units } from '../src/data/units.ts';
import { lesson1_2 } from '../src/lessons/unit-1/lesson-1-2.ts';
import { getLessonQuizSignature } from '../src/lessons/quiz-utils.ts';
import {
  expectNoAccessibilityViolations,
  type AccessibilityScanExclusion,
} from './accessibility-helpers.ts';

const COURSE_STATE_KEY = 'color-theory-course-state';
const LESSON_SESSION_PREFIX = 'color-theory-course-lesson-session:';
const MILESTONE_SESSION_PREFIX = 'color-theory-course-milestone-session:';

const lessonRoutes = units.flatMap((unit) =>
  unit.lessons.map((lessonId) => `/lesson/${lessonId}`),
);
const milestoneRoutes = units.map((unit) => `/milestone/${unit.milestoneId}`);
const staticRoutes = [
  '/',
  '/palette-builder',
  '/glossary',
  '/review',
  ...lessonRoutes,
  ...milestoneRoutes,
  '/not-a-route',
];

const authoredVisualExclusions: Readonly<Record<string, readonly AccessibilityScanExclusion[]>> = {
  '/milestone/milestone-1': [{
    selector: '[data-a11y-scan-exclude="milestone-1-interface-mockup"]',
    authoredVisual: 'Unit 1 milestone interface mockup with intentional weak contrast',
    visualEquivalenceCoverage: ['#110', '#107'],
  }],
  '/milestone/milestone-3': [{
    selector: '[data-a11y-scan-exclude="milestone-3-theme-preview"]',
    authoredVisual: 'Unit 3 milestone learner-controlled theme preview',
    visualEquivalenceCoverage: ['#110', '#107'],
  }],
  '/milestone/milestone-5': [{
    selector: '[data-a11y-scan-exclude="milestone-5-body-text-sample"]',
    authoredVisual: 'Unit 5 milestone body-text sample that begins below the contrast target',
    visualEquivalenceCoverage: ['#110', '#107'],
  }],
};

async function seedUnlockedCourse(page: Page, theme: 'dark' | 'light') {
  await page.addInitScript(({ key, lessonIds, milestoneIds, selectedTheme }) => {
    localStorage.setItem(key, JSON.stringify({
      version: 3,
      progress: {
        completedLessons: lessonIds,
        completedQuizzes: lessonIds,
        quizBestScores: Object.fromEntries(lessonIds.map((id) => [id, 100])),
        completedMilestones: milestoneIds,
      },
      preferences: {
        theme: selectedTheme,
        reducedMotion: false,
        colorBlindnessMode: null,
      },
    }));
  }, {
    key: COURSE_STATE_KEY,
    lessonIds: units.flatMap((unit) => unit.lessons),
    milestoneIds: units.map((unit) => unit.milestoneId),
    selectedTheme: theme,
  });
}

async function seedLockedCourse(page: Page, theme: 'dark' | 'light') {
  await page.addInitScript(({ key, selectedTheme }) => {
    localStorage.setItem(key, JSON.stringify({
      version: 3,
      progress: {
        completedLessons: [],
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
  }, { key: COURSE_STATE_KEY, selectedTheme: theme });
}

async function setSession(page: Page, key: string, value: object) {
  await page.evaluate(({ storageKey, sessionValue }) => {
    sessionStorage.setItem(storageKey, JSON.stringify(sessionValue));
  }, { storageKey: key, sessionValue: value });
}

function lessonSession(overrides: Record<string, unknown>) {
  return {
    version: 2,
    phase: 'quiz',
    stepIndex: lesson1_2.steps.length - 1,
    challengeDone: true,
    quizIndex: 0,
    answers: [],
    selectedChoice: null,
    submitted: false,
    quizSignature: getLessonQuizSignature(lesson1_2),
    ...overrides,
  };
}

function milestoneSession(overrides: Record<string, unknown>) {
  return {
    version: 1,
    phase: 'complete',
    partIndex: 1,
    questionIndex: 2,
    selectedChoice: 'd',
    submitted: true,
    answers: [],
    completedChallenges: [],
    attemptId: 1,
    ...overrides,
  };
}

for (const theme of ['light', 'dark'] as const) {
  test(`all static routes | theme: ${theme} | state: initial`, async ({ page }) => {
    test.setTimeout(180_000);
    await seedUnlockedCourse(page, theme);

    for (const route of staticRoutes) {
      await page.goto(route);
      await expect(page).toHaveURL(route);
      await expect(page.locator('[data-route-loading-heading]')).toHaveCount(0);
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      await expect(page.getByText(/loading (lesson|milestone|tool)\.\.\./i)).toHaveCount(0);

      const exclusions = authoredVisualExclusions[route] ?? [];
      for (const exclusion of exclusions) {
        await expect(page.locator(exclusion.selector), exclusion.authoredVisual).toHaveCount(1);
      }

      await expectNoAccessibilityViolations(
        page,
        { route, theme, state: 'initial' },
        exclusions,
      );
    }
  });

  test(`locked route redirects | theme: ${theme}`, async ({ page }) => {
    await seedLockedCourse(page, theme);

    for (const route of ['/lesson/u2-l1', '/milestone/milestone-1']) {
      await page.goto(route);
      await expect(page).toHaveURL('/');
      await expect(page.getByRole('status')).toContainText('not unlocked yet');
      await expectNoAccessibilityViolations(page, {
        route,
        theme,
        state: 'locked-route redirect',
      });
    }
  });

  test(`representative interface states | theme: ${theme}`, async ({ page }) => {
    test.setTimeout(90_000);
    await seedUnlockedCourse(page, theme);

    await page.goto('/lesson/u1-l1');
    await expect(page.getByRole('button', { name: 'back' })).toBeDisabled();
    await expectNoAccessibilityViolations(page, {
      route: '/lesson/u1-l1',
      theme,
      state: 'disabled control',
    });

    await setSession(
      page,
      `${LESSON_SESSION_PREFIX}u1-l2`,
      lessonSession({ selectedChoice: 'hue' }),
    );
    await page.goto('/lesson/u1-l2');
    await expect(page.getByRole('button', { name: /Hue/ })).toHaveAttribute('aria-pressed', 'true');
    await expectNoAccessibilityViolations(page, {
      route: '/lesson/u1-l2',
      theme,
      state: 'selected answer',
    });

    await setSession(
      page,
      `${LESSON_SESSION_PREFIX}u1-l2`,
      lessonSession({
        selectedChoice: 'hue',
        submitted: true,
        answers: [{ questionId: 'q1', choiceId: 'hue', isCorrect: false }],
      }),
    );
    await page.goto('/lesson/u1-l2');
    await expect(page.getByRole('button', { name: /your answer: incorrect/ })).toBeVisible();
    await expectNoAccessibilityViolations(page, {
      route: '/lesson/u1-l2',
      theme,
      state: 'submitted incorrect answer',
    });

    await setSession(
      page,
      `${LESSON_SESSION_PREFIX}u1-l2`,
      lessonSession({
        phase: 'complete',
        quizIndex: 2,
        selectedChoice: 'lightness',
        submitted: true,
        answers: [
          { questionId: 'q1', choiceId: 'saturation', isCorrect: true },
          { questionId: 'q2', choiceId: 'decreasing-lightness', isCorrect: true },
          { questionId: 'q3', choiceId: 'lightness', isCorrect: true },
        ],
      }),
    );
    await page.goto('/lesson/u1-l2');
    await expect(page.getByRole('progressbar', { name: 'Lesson progress: Lesson complete' }))
      .toBeVisible();
    await expectNoAccessibilityViolations(page, {
      route: '/lesson/u1-l2',
      theme,
      state: 'completed lesson',
    });

    await setSession(
      page,
      `${MILESTONE_SESSION_PREFIX}milestone-1`,
      milestoneSession({}),
    );
    await page.goto('/milestone/milestone-1');
    await expect(page.getByText('milestone not passed')).toBeVisible();
    await expect(page.getByRole('button', { name: 'retry milestone' })).toBeVisible();
    await expectNoAccessibilityViolations(page, {
      route: '/milestone/milestone-1',
      theme,
      state: 'retry after failed milestone',
    });

    await setSession(
      page,
      `${MILESTONE_SESSION_PREFIX}milestone-1`,
      milestoneSession({
        answers: [{ questionId: 'm1-q1', choiceId: 'c', isCorrect: true }],
        completedChallenges: ['m1-c1'],
      }),
    );
    await page.goto('/milestone/milestone-1');
    await expect(page.getByText('milestone passed')).toBeVisible();
    await expectNoAccessibilityViolations(page, {
      route: '/milestone/milestone-1',
      theme,
      state: 'passed milestone',
    });

    await page.goto('/palette-builder');
    await page.getByRole('textbox', { name: 'Hex color value' }).fill('invalid');
    await expect(page.getByRole('textbox', { name: 'Hex color value' })).toHaveAttribute(
      'aria-invalid',
      'true',
    );
    await expectNoAccessibilityViolations(page, {
      route: '/palette-builder',
      theme,
      state: 'validation error',
    });

    await page.setViewportSize({ width: 600, height: 800 });
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await page.getByRole('button', { name: 'Menu' }).click();
    await expect(page.getByRole('button', { name: 'Menu' })).toHaveAttribute('aria-expanded', 'true');
    await expectNoAccessibilityViolations(page, {
      route: '/',
      theme,
      state: 'menu open',
    });
  });

  test(`loading and error states | theme: ${theme}`, async ({ page, context }) => {
    await seedUnlockedCourse(page, theme);

    let releaseGlossary = () => {};
    const glossaryRequestBlocked = new Promise<void>((resolve) => {
      releaseGlossary = resolve;
    });
    await page.route(/\/assets\/GlossaryPage-[^/]+\.js$/, async (route) => {
      await glossaryRequestBlocked;
      await route.continue();
    });
    await page.goto('/');
    await page.getByRole('link', { name: 'glossary' }).first().click();
    await expect(page.getByText('loading...')).toBeVisible();
    await expectNoAccessibilityViolations(page, {
      route: '/glossary',
      theme,
      state: 'loading',
    });
    releaseGlossary();
    await expect(page.getByRole('heading', { name: 'glossary' })).toBeVisible();

    const errorPage = await context.newPage();
    await seedUnlockedCourse(errorPage, theme);
    await errorPage.route(/\/assets\/ReviewPage-[^/]+\.js$/, (route) => route.abort('failed'));
    await errorPage.goto('/');
    await errorPage.getByRole('link', { name: 'review' }).first().click();
    await expect(errorPage.getByText('something went wrong.')).toBeVisible();
    await expectNoAccessibilityViolations(errorPage, {
      route: '/review',
      theme,
      state: 'error',
    });
  });
}

test('the static route inventory covers 45 routes', () => {
  expect(staticRoutes).toHaveLength(45);
});

test('accessibility failures report the route, theme, state, rule, and element', async ({ page }) => {
  await page.setContent(`
    <html lang="en" data-theme="light">
      <head><title>Accessibility fixture</title></head>
      <body><main><h1>Fixture</h1><button></button></main></body>
    </html>
  `);

  let message = '';
  try {
    await expectNoAccessibilityViolations(page, {
      route: '/fixture',
      theme: 'light',
      state: 'unnamed button',
    });
  } catch (error) {
    message = error instanceof Error ? error.message : String(error);
  }

  expect(message).toContain('route: /fixture');
  expect(message).toContain('theme: light');
  expect(message).toContain('state: unnamed button');
  expect(message).toContain('rule: button-name');
  expect(message).toContain('element: button');
});

test('keyboard users can focus and scroll overflowing lesson instructions', async ({ page }) => {
  await seedUnlockedCourse(page, 'light');
  await page.goto('/lesson/u3-l4');

  const instructions = page.getByRole('region', { name: 'Lesson instructions' });
  await expect(instructions).toBeVisible();
  expect(await instructions.evaluate((element) => element.scrollHeight > element.clientHeight)).toBe(true);

  await instructions.focus();
  await expect(instructions).toBeFocused();
  await expect(instructions).toHaveCSS('outline-style', 'solid');
  await page.keyboard.press('End');
  await expect.poll(() => instructions.evaluate((element) => element.scrollTop)).toBeGreaterThan(0);
});
