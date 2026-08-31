import { expect, test, type Page } from '@playwright/test';

const STORAGE_KEY = 'color-theory-course-state';
const MILESTONE_SESSION_KEY = 'color-theory-course-milestone-session:';
const LESSON_SESSION_KEY = 'color-theory-course-lesson-session:';

const unitLessons = [
  ['u1-l1', 'u1-l2', 'u1-l3', 'u1-l4', 'u1-l5', 'u1-l6'],
  ['u2-l1', 'u2-l2', 'u2-l3', 'u2-l4', 'u2-l5'],
  ['u3-l1', 'u3-l2', 'u3-l3', 'u3-l4', 'u3-l5', 'u3-l6'],
  ['u4-l1', 'u4-l2', 'u4-l3', 'u4-l4'],
  ['u5-l1', 'u5-l2', 'u5-l3', 'u5-l4', 'u5-l5', 'u5-l6'],
  ['u6-l1', 'u6-l2', 'u6-l3', 'u6-l4', 'u6-l5', 'u6-l6', 'u6-l7'],
] as const;

type ThemePreference = 'dark' | 'light' | 'system';

interface SeedOptions {
  completedLessons?: readonly string[];
  completedMilestones?: readonly string[];
  theme?: ThemePreference;
}

async function seedCourseState(page: Page, options: SeedOptions) {
  await page.addInitScript(({ key, state }) => {
    if (localStorage.getItem(key) === null) {
      localStorage.setItem(key, JSON.stringify(state));
    }
  }, {
    key: STORAGE_KEY,
    state: {
      version: 3,
      progress: {
        completedLessons: options.completedLessons ?? [],
        completedQuizzes: [],
        quizBestScores: {},
        completedMilestones: options.completedMilestones ?? [],
      },
      preferences: {
        theme: options.theme ?? 'system',
        reducedMotion: false,
        colorBlindnessMode: null,
      },
    },
  });
}

async function seedLessonStep(page: Page, lessonId: string, stepIndex: number) {
  await page.addInitScript(({ key, value }) => {
    sessionStorage.setItem(key, JSON.stringify(value));
  }, {
    key: `${LESSON_SESSION_KEY}${lessonId}`,
    value: {
      version: 2,
      phase: 'steps',
      stepIndex,
      challengeDone: false,
      quizIndex: 0,
      answers: [],
      selectedChoice: null,
      submitted: false,
      quizSignature: null,
    },
  });
}

async function storedCourseState(page: Page) {
  return page.evaluate((key) => JSON.parse(localStorage.getItem(key) ?? 'null'), STORAGE_KEY);
}

async function mockupColors(page: Page) {
  return page.evaluate(() => {
    function opaqueBackground(element: Element): string {
      let current: Element | null = element;
      while (current) {
        const background = getComputedStyle(current).backgroundColor;
        if (background !== 'rgba(0, 0, 0, 0)') return background;
        current = current.parentElement;
      }
      throw new Error('Expected the mockup text to have an opaque background');
    }

    return [
      'color-theory-course$',
      'settings',
      'Learn color theory',
      'Six interactive units for developers.',
      'start learning',
      '✓ Unit 1 complete',
      'Lesson 2: Hue, saturation, and lightness →',
    ].map((text) => {
      const element = [...document.querySelectorAll<HTMLElement>('span, div')]
        .find((candidate) => [...candidate.childNodes].some(
          (node) => node.nodeType === Node.TEXT_NODE && node.textContent?.trim() === text,
        ));
      if (!element) throw new Error(`Could not find mockup text: ${text}`);

      return {
        text,
        foreground: getComputedStyle(element).color,
        background: opaqueBackground(element),
      };
    });
  });
}

async function mockupBoundaryColors(page: Page) {
  return page.getByText('Learn color theory', { exact: true }).evaluate((heading) => {
    const canvas = heading.closest('[data-authored-visual]');
    if (!canvas) throw new Error('Expected the mockup to have an authored visual root');

    let boundary: Element | null = canvas;
    while (boundary) {
      const styles = getComputedStyle(boundary);
      if (styles.borderTopStyle !== 'none' && styles.borderTopWidth !== '0px') {
        return {
          background: getComputedStyle(canvas).backgroundColor,
          border: styles.borderTopColor,
        };
      }
      boundary = boundary.parentElement;
    }

    throw new Error('Expected the mockup to have a visible boundary');
  });
}

function contrastRatio(foreground: string, background: string): number {
  function luminance(color: string): number {
    const channels = color.match(/\d+/g)?.slice(0, 3).map(Number);
    if (!channels || channels.length !== 3) {
      throw new Error(`Expected an RGB color, received "${color}"`);
    }
    const linear = channels.map((channel) => {
      const value = channel / 255;
      return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
  }

  const foregroundLuminance = luminance(foreground);
  const backgroundLuminance = luminance(background);
  return (Math.max(foregroundLuminance, backgroundLuminance) + 0.05)
    / (Math.min(foregroundLuminance, backgroundLuminance) + 0.05);
}

async function solveFirstLessonChallenge(page: Page) {
  const answers = [
    ['Click to identify what the nav bar color is doing', 'separating sections'],
    ['Click to identify what the gold button color is doing', 'drawing attention'],
    ['Click to identify what the green text color is doing', 'signaling status'],
    ['Click to identify what the blue card border color is doing', 'grouping items'],
  ] as const;

  for (const [region, answer] of answers) {
    await page.getByRole('button', { name: region }).click();
    await page.getByRole('button', { name: answer, exact: true }).click();
    await page.getByRole('button', { name: 'check role' }).click();
    await page.getByRole('button', { name: 'got it' }).click();
  }
}

async function answerLessonQuiz(page: Page) {
  const answers = [
    'Drawing attention to the primary action',
    'Status communication',
    'A paragraph where every word has a different random color',
  ];

  for (const [index, answer] of answers.entries()) {
    await page.getByRole('button', { name: new RegExp(answer) }).click();
    await page.getByRole('button', { name: 'check', exact: true }).click();
    await page.getByRole('button', {
      name: index === answers.length - 1 ? 'finish lesson →' : 'next question →',
    }).click();
  }
}

async function completeMilestoneOneChallenge(page: Page) {
  const roles = [
    'Focal point',
    'Low-contrast failure',
    'Competing accent',
    'Readable text',
    'Section separator',
  ];
  const selectors = page.locator('select:not([aria-label="Theme preference"])');

  for (const [index, role] of roles.entries()) {
    await selectors.nth(index).selectOption({ label: role });
  }
  await page.getByRole('button', { name: 'check classifications' }).click();
  await page.getByRole('button', { name: 'next part →' }).click();
}

async function answerMilestoneOneQuiz(page: Page, correct: boolean) {
  const correctAnswers = [
    'Use one saturated accent while nearby elements use neutral colors',
    'Increase the contrast ratio between the text and background',
    'Separate that section from the content around it',
  ];
  const wrongAnswers = [
    'Give every action a different saturated color',
    'Change the typeface to monospace',
    'Guarantee that every text color in the section is readable',
  ];

  for (let index = 0; index < correctAnswers.length; index += 1) {
    const radio = page.getByRole('radio', {
      name: correct ? correctAnswers[index] : wrongAnswers[index],
    });
    await page.locator(`label[for="${await radio.getAttribute('id')}"]`).click();
    await page.getByRole('button', { name: 'check', exact: true }).click();
    await page.getByRole('button', {
      name: index === correctAnswers.length - 1 ? 'finish milestone →' : 'next →',
    }).click();
  }
}

test('every navigation destination remains visible and usable at the mobile breakpoint', async ({ page }) => {
  await page.setViewportSize({ width: 700, height: 800 });
  await page.goto('/');

  const menuButton = page.getByRole('button', { name: 'Menu' });
  await expect(page.getByRole('link', { name: 'Color Theory Course' })).toBeVisible();
  await expect(page.getByRole('combobox', { name: 'Theme preference' })).toBeVisible();
  await expect(menuButton).toBeVisible();

  for (const [name, path] of [
    ['palette builder', '/palette-builder'],
    ['glossary', '/glossary'],
    ['review', '/review'],
  ] as const) {
    await menuButton.click();
    const destination = page.getByRole('link', { name });
    await expect(destination).toBeVisible();
    await destination.click();
    await expect(page).toHaveURL(new RegExp(`${path}$`));
    await expect(menuButton).toHaveAttribute('aria-expanded', 'false');
  }

  await page.getByRole('link', { name: 'Color Theory Course' }).click();
  await expect(page).toHaveURL(/\/$/);
});

test('the first lesson mockups keep their colors in both themes', async ({ page }) => {
  await seedCourseState(page, { theme: 'dark' });
  await seedLessonStep(page, 'u1-l1', 0);
  await page.goto('/lesson/u1-l1');
  await expect(page.getByText('Learn color theory', { exact: true })).toBeVisible();

  const darkColors = await mockupColors(page);
  const darkBoundary = await mockupBoundaryColors(page);
  await page.getByRole('combobox', { name: 'Theme preference' }).selectOption('light');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  const lightColors = await mockupColors(page);
  const lightBoundary = await mockupBoundaryColors(page);

  expect(lightColors).toEqual(darkColors);
  expect(lightBoundary).toEqual(darkBoundary);
  for (const pair of lightColors) {
    expect(contrastRatio(pair.foreground, pair.background), pair.text).toBeGreaterThanOrEqual(7);
  }

  for (let index = 0; index < 3; index += 1) {
    await page.getByRole('button', { name: 'next', exact: true }).click();
  }
  await expect(page.getByText(/Colors without a defined role add competing signals/)).toBeVisible();

  const lightNoisyColors = await mockupColors(page);
  const lightNoisyBoundary = await mockupBoundaryColors(page);
  await page.getByRole('combobox', { name: 'Theme preference' }).selectOption('dark');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  const darkNoisyColors = await mockupColors(page);
  const darkNoisyBoundary = await mockupBoundaryColors(page);

  expect(darkNoisyColors).toEqual(lightNoisyColors);
  expect(darkNoisyBoundary).toEqual(lightNoisyBoundary);

  await page.getByRole('button', { name: 'next', exact: true }).click();
  await expect(page.getByText('identify each color\'s role')).toBeVisible();

  const darkExerciseColors = await mockupColors(page);
  const darkExerciseBoundary = await mockupBoundaryColors(page);
  await page.getByRole('combobox', { name: 'Theme preference' }).selectOption('light');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  const lightExerciseColors = await mockupColors(page);
  const lightExerciseBoundary = await mockupBoundaryColors(page);

  expect(darkExerciseColors).toEqual(lightExerciseColors);
  expect(darkExerciseBoundary).toEqual(lightExerciseBoundary);
  expect(lightExerciseColors).toEqual(lightColors);

  const navRegion = page.getByRole('button', {
    name: 'Click to identify what the nav bar color is doing',
  });
  for (let index = 0; index < 20 && await navRegion.evaluate((element) => document.activeElement !== element); index += 1) {
    await page.keyboard.press('Tab');
  }
  await expect(navRegion).toBeFocused();
  await expect.poll(() => navRegion.evaluate((element) => getComputedStyle(element).outlineColor))
    .toBe('rgb(153, 201, 255)');
  const focusColors = await navRegion.evaluate((element) => ({
    outline: getComputedStyle(element).outlineColor,
    background: getComputedStyle(element.parentElement!).backgroundColor,
  }));

  expect(contrastRatio(focusColors.outline, focusColors.background)).toBeGreaterThanOrEqual(3);

  await page.locator('body').click({ position: { x: 1, y: 1 } });
  await navRegion.hover();
  await expect.poll(() => navRegion.evaluate((element) => getComputedStyle(element).outlineColor))
    .toBe('rgb(241, 190, 50)');
  const hoverOutline = await navRegion.evaluate((element) => getComputedStyle(element).outlineColor);
  expect(contrastRatio(hoverOutline, focusColors.background)).toBeGreaterThanOrEqual(3);

  await navRegion.click();
  await expect.poll(() => navRegion.evaluate((element) => getComputedStyle(element).outlineColor))
    .toBe('rgb(153, 201, 255)');
  const activeOutline = await navRegion.evaluate((element) => getComputedStyle(element).outlineColor);
  expect(contrastRatio(activeOutline, focusColors.background)).toBeGreaterThanOrEqual(3);

  await page.getByRole('button', { name: 'separating sections' }).click();
  await page.getByRole('button', { name: 'check role' }).click();
  await expect.poll(() => navRegion.evaluate((element) => getComputedStyle(element).outlineColor))
    .toBe('rgb(172, 209, 87)');
  const solvedColors = await navRegion.evaluate((element) => {
    const badge = element.querySelector('span:last-child');
    if (!badge) throw new Error('Expected the solved region to include a badge');
    return {
      outline: getComputedStyle(element).outlineColor,
      badgeForeground: getComputedStyle(badge).color,
      badgeBackground: getComputedStyle(badge).backgroundColor,
    };
  });

  expect(contrastRatio(solvedColors.outline, focusColors.background)).toBeGreaterThanOrEqual(3);
  expect(contrastRatio(solvedColors.badgeForeground, solvedColors.badgeBackground)).toBeGreaterThanOrEqual(7);
});

test('production progression redirects locked routes and keeps the hero on the milestone', async ({ page }) => {
  await page.goto('/lesson/u2-l1');
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole('status')).toContainText('This lesson is not unlocked yet.');

  await page.getByRole('button', { name: 'dismiss' }).click();
  await page.goto('/milestone/milestone-1');
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole('status')).toContainText('This milestone is not unlocked yet.');

  await page.getByRole('button', { name: 'dismiss' }).click();
  await page.evaluate(() => localStorage.clear());
  await seedCourseState(page, { completedLessons: unitLessons[0] });
  await page.reload();
  await expect(page.getByRole('link', { name: 'Continue: Read the Interface' })).toHaveAttribute(
    'href',
    '/milestone/milestone-1',
  );
});

test('a new learner completes a lesson and keeps progress after a browser reload', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Start learning: What Color Does in Interface Design' }).click();
  await expect(page).toHaveURL(/\/lesson\/u1-l1$/);

  for (let index = 0; index < 4; index += 1) {
    await page.getByRole('button', { name: 'next', exact: true }).click();
  }
  await solveFirstLessonChallenge(page);
  await page.getByRole('button', { name: 'take the quiz →' }).click();
  await answerLessonQuiz(page);

  await expect(page.getByText('lesson complete', { exact: true })).toBeVisible();
  await page.getByRole('link', { name: '← all units' }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole('link', { name: 'Redo: What Color Does in Interface Design' })).toBeVisible();

  await page.reload();

  await expect(page.getByRole('link', { name: 'Redo: What Color Does in Interface Design' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Continue: Hue, Saturation, and Lightness' }).first()).toBeVisible();
  await expect.poll(async () => storedCourseState(page)).toMatchObject({
    progress: {
      completedLessons: ['u1-l1'],
      completedQuizzes: ['u1-l1'],
      quizBestScores: { 'u1-l1': 100 },
    },
  });
});

test('passing a milestone unlocks the next unit after reload', async ({ page }) => {
  await seedCourseState(page, { completedLessons: unitLessons[0] });
  await page.goto('/milestone/milestone-1');

  await completeMilestoneOneChallenge(page);
  await answerMilestoneOneQuiz(page, true);
  await expect(page.getByText('milestone passed')).toBeVisible();
  await page.getByRole('link', { name: '← all units' }).click();
  await expect(page.getByRole('button', { name: /How Screens Make Color/ })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Start: Two Ways Color Mixes' })).toBeVisible();

  await page.reload();

  await expect(page.getByRole('button', { name: /How Screens Make Color/ })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Start: Two Ways Color Mixes' })).toBeVisible();
  await expect.poll(async () => storedCourseState(page)).toMatchObject({
    progress: { completedMilestones: ['milestone-1'] },
  });
});

test('a failed milestone retry clears the attempt and leaves progression locked', async ({ page }) => {
  await seedCourseState(page, { completedLessons: unitLessons[0] });
  await page.goto('/milestone/milestone-1');

  await completeMilestoneOneChallenge(page);
  await answerMilestoneOneQuiz(page, false);
  await expect(page.getByText('milestone not passed')).toBeVisible();
  await page.getByRole('button', { name: 'retry milestone' }).click();

  await expect(page.getByText('0 / 5 answered')).toBeVisible();
  await expect(page.locator('select:not([aria-label="Theme preference"])').first()).toHaveValue('');
  await expect.poll(async () => page.evaluate((key) => {
    const session = JSON.parse(sessionStorage.getItem(key) ?? 'null');
    return session && {
      partIndex: session.partIndex,
      answers: session.answers,
      completedChallenges: session.completedChallenges,
      attemptId: session.attemptId,
    };
  }, `${MILESTONE_SESSION_KEY}milestone-1`)).toEqual({
    partIndex: 0,
    answers: [],
    completedChallenges: [],
    attemptId: 2,
  });

  await page.reload();
  await expect(page.getByText('0 / 5 answered')).toBeVisible();
  await page.getByRole('link', { name: 'Color Theory Course' }).click();
  const unitTwoCard = page.getByText('How Screens Make Color', { exact: true })
    .locator('..')
    .locator('..')
    .locator('..');
  await expect(unitTwoCard).toContainText('locked');
  await expect(unitTwoCard).not.toHaveAttribute('role', 'button');
  await expect.poll(async () => storedCourseState(page)).toMatchObject({
    progress: { completedMilestones: [] },
  });
});

test('the final milestone persists course completion and returns to all units', async ({ page }) => {
  await seedCourseState(page, {
    completedLessons: unitLessons.flat(),
    completedMilestones: ['milestone-1', 'milestone-2', 'milestone-3', 'milestone-4', 'milestone-5'],
  });
  await page.goto('/milestone/milestone-6');

  const roleAssignments = [
    ['#0b1220', 'Page background'],
    ['#1c2536', 'Surface'],
    ['#f8fafc', 'Primary text'],
    ['#cbd5e1', 'Secondary text'],
    ['#3b82f6', 'Action'],
    ['#84cc16', 'Success'],
    ['#f97316', 'Warning'],
    ['#fb7185', 'Error'],
  ] as const;
  for (const [hex, role] of roleAssignments) {
    await page.getByRole('button', { name: `Select swatch ${hex}` }).click();
    await page.getByRole('button', { name: new RegExp(`^${role}:`) }).click();
  }
  await page.getByRole('button', { name: 'check roles' }).click();
  await page.getByRole('button', { name: 'continue to conflict identification' }).click();
  await page.getByRole('combobox', { name: 'Which role issue exists in this set?' })
    .selectOption('warning-error-too-close');
  await page.getByRole('button', { name: 'check conflict' }).click();
  await page.getByRole('button', { name: 'next part →' }).click();

  await page.getByRole('slider', { name: /Text lightness/ }).fill('100');
  await page.getByRole('button', { name: 'check contrast' }).click();
  await page.getByRole('button', { name: 'continue to surface hierarchy' }).click();
  await page.getByRole('slider', { name: /Surface lightness/ }).fill('20');
  await page.getByRole('button', { name: 'check contrast' }).click();
  await page.getByRole('button', { name: 'continue to action contrast' }).click();
  await page.getByRole('slider', { name: /Action lightness/ }).fill('70');
  await page.getByRole('button', { name: 'check contrast' }).click();
  await page.getByRole('button', { name: 'next part →' }).click();

  for (let index = 0; index < 4; index += 1) {
    const radio = page.getByRole('radio').first();
    await page.locator(`label[for="${await radio.getAttribute('id')}"]`).click();
    await page.getByRole('button', { name: 'check', exact: true }).click();
    await page.getByRole('button', {
      name: index === 3 ? 'finish milestone →' : 'next →',
    }).click();
  }

  await expect(page.getByText('milestone passed')).toBeVisible();
  await expect(page.getByRole('link', { name: /continue to Unit/ })).toHaveCount(0);
  await page.reload();
  await expect(page.getByText('milestone passed')).toBeVisible();
  await expect.poll(async () => storedCourseState(page)).toMatchObject({
    progress: {
      completedMilestones: [
        'milestone-1',
        'milestone-2',
        'milestone-3',
        'milestone-4',
        'milestone-5',
        'milestone-6',
      ],
    },
  });
  await page.getByRole('link', { name: '← all units' }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByText('✓ done')).toHaveCount(6);
});

test('the selected theme applies before React and survives navigation and reload', async ({ page }) => {
  await seedCourseState(page, { theme: 'light' });
  await page.route(/\/assets\/.*\.js$/, (route) => route.abort());
  await page.goto('/');

  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute('content', '#ffffff');
  await expect(page.locator('#root')).toBeEmpty();

  await page.unroute(/\/assets\/.*\.js$/);
  await page.reload();
  await page.getByRole('combobox', { name: 'Theme preference' }).selectOption('dark');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.getByRole('link', { name: 'palette builder' }).click();
  await expect(page).toHaveURL(/\/palette-builder$/);
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

  await page.reload();

  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(page.getByRole('combobox', { name: 'Theme preference' })).toHaveValue('dark');
});
