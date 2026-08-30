import { expect, test } from '@playwright/test';

const COURSE_STATE_KEY = 'color-theory-course-state';
const LESSON_SESSION_PREFIX = 'color-theory-course-lesson-session:';

async function unlockFirstTwoLessons(page: import('@playwright/test').Page) {
  await page.addInitScript(({ courseStateKey }) => {
    localStorage.setItem(courseStateKey, JSON.stringify({
      version: 3,
      progress: {
        completedLessons: ['u1-l1'],
        completedQuizzes: ['u1-l1'],
        quizBestScores: { 'u1-l1': 100 },
        completedMilestones: [],
      },
      preferences: {},
    }));
  }, { courseStateKey: COURSE_STATE_KEY });
}

test('lesson progress and a static preview expose the current visual context', async ({ page }) => {
  await page.goto('/lesson/u1-l1');

  const progress = page.getByRole('progressbar', { name: /^Lesson progress:/ });
  await expect(progress).toHaveAttribute('aria-valuetext', 'Lesson step 1 of 5');
  await expect(progress).toContainText('Lesson step 1 of 5');

  const preview = page.getByRole('group', { name: 'Purposeful interface color preview' });
  const descriptionId = await preview.getAttribute('aria-describedby');
  expect(descriptionId).toBeTruthy();
  await expect(page.locator(`#${descriptionId}`)).toContainText(
    'The dark navigation background separates settings from the page content.',
  );
  await expect(preview).not.toHaveAttribute('aria-hidden', 'true');
});

test('quiz swatches, keyboard selection, results, and question changes are announced', async ({ page }) => {
  await unlockFirstTwoLessons(page);
  await page.addInitScript(({ lessonSessionPrefix }) => {
    sessionStorage.setItem(`${lessonSessionPrefix}u1-l2`, JSON.stringify({
      version: 2,
      phase: 'quiz',
      stepIndex: 4,
      challengeDone: true,
      quizIndex: 0,
      answers: [],
      selectedChoice: null,
      submitted: false,
    }));
  }, { lessonSessionPrefix: LESSON_SESSION_PREFIX });

  await page.goto('/lesson/u1-l2');

  const progress = page.getByRole('progressbar', { name: /^Lesson progress:/ });
  const status = page.getByRole('status');
  await expect(progress).toHaveAttribute('aria-valuetext', 'Quiz question 1 of 3');
  await expect(page.getByRole('img', { name: 'vivid red' })).toHaveAccessibleDescription(
    'A vivid, strongly saturated red swatch. Color value: #E53935.',
  );
  await expect(page.getByRole('img', { name: 'dusty rose' })).toHaveAccessibleDescription(
    'A muted, lighter rose-red swatch. Color value: #C48B9F.',
  );

  const saturationChoice = page.getByRole('button', { name: /Saturation/ });
  await saturationChoice.focus();
  await page.keyboard.press('Space');
  await expect(saturationChoice).toHaveAttribute('aria-pressed', 'true');
  await expect(status).toHaveText('Selected Saturation.');

  const checkButton = page.getByRole('button', { name: 'check' });
  await checkButton.focus();
  await page.keyboard.press('Enter');
  await expect(status).toContainText('Correct. Saturation drops by about 45 percentage points');

  await page.getByRole('button', { name: 'next question →' }).click();
  await expect(status).toHaveText('Quiz question 2 of 3.');
  await page.getByRole('button', { name: /Decreasing lightness/ }).click();
  await page.getByRole('button', { name: 'check' }).click();
  await page.getByRole('button', { name: 'next question →' }).click();

  await expect(progress).toHaveAttribute('aria-valuetext', 'Quiz question 3 of 3');
  await expect(page.getByRole('img', { name: 'sky blue' })).toHaveAccessibleDescription(
    'A light sky-blue swatch. Color value: #87CEEB.',
  );
  await expect(page.getByRole('img', { name: 'deep navy' })).toHaveAccessibleDescription(
    'A dark navy-blue swatch. Color value: #1A237E.',
  );
});
