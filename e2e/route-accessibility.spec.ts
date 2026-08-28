import { expect, test } from '@playwright/test';

type WindowWithTitleHistory = Window & {
  observedTitles: string[];
  titleObserver: MutationObserver;
};

async function startTitleHistory(page: import('@playwright/test').Page) {
  await page.evaluate(() => {
    const observedWindow = window as unknown as WindowWithTitleHistory;
    observedWindow.observedTitles = [document.title];
    observedWindow.titleObserver = new MutationObserver(() => {
      observedWindow.observedTitles.push(document.title);
    });
    observedWindow.titleObserver.observe(document.head, {
      childList: true,
      characterData: true,
      subtree: true,
    });
  });
}

async function titleHistory(page: import('@playwright/test').Page) {
  return page.evaluate(() => {
    const observedWindow = window as unknown as WindowWithTitleHistory;
    observedWindow.titleObserver.disconnect();
    return observedWindow.observedTitles;
  });
}

test('skip navigation is first and targets programmatically focusable main content', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle('Color Theory Course');

  await page.keyboard.press('Tab');
  const skipLink = page.getByRole('link', { name: 'skip to main content' });
  await expect(skipLink).toBeFocused();
  await expect(skipLink).toBeVisible();

  await page.keyboard.press('Enter');
  await expect(page.getByRole('main')).toBeFocused();
  await expect(page.getByRole('main')).toHaveAttribute('tabindex', '-1');
});

test('client navigation and browser history focus the rendered route heading', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('link', { name: 'palette builder' }).first().click();
  const paletteHeading = page.getByRole('heading', { name: 'palette builder' });
  await expect(page).toHaveTitle('Palette Builder | Color Theory Course');
  await expect(paletteHeading).toBeFocused();

  await page.getByRole('link', { name: 'glossary' }).first().click();
  await expect(page).toHaveTitle('Glossary | Color Theory Course');
  await expect(page.getByRole('heading', { name: 'glossary' })).toBeFocused();

  await page.goBack();
  await expect(page).toHaveTitle('Palette Builder | Color Theory Course');
  await expect(paletteHeading).toBeFocused();

  await page.goForward();
  await expect(page).toHaveTitle('Glossary | Color Theory Course');
  await expect(page.getByRole('heading', { name: 'glossary' })).toBeFocused();
});

test('lesson loading waits for the final heading before moving focus', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Start learning: What Color Does in Interface Design' }).click();

  await expect(page).toHaveTitle('What Color Does in Interface Design | Color Theory Course');
  await expect(page.getByRole('heading', { name: 'What Color Does in Interface Design' })).toBeFocused();
  await expect(page.getByText('loading lesson...')).toHaveCount(0);
});

test('locked and invalid routes expose only their final page context', async ({ page }) => {
  await page.goto('/');
  await startTitleHistory(page);
  await page.evaluate(() => {
    window.history.pushState({}, '', '/lesson/u1-l2');
    window.dispatchEvent(new PopStateEvent('popstate'));
  });

  await expect(page).toHaveURL('/');
  await expect(page).toHaveTitle('Color Theory Course');
  await expect(page.getByRole('heading', { name: /Color Theory.*for Developers/ })).toBeFocused();
  await expect(page.getByRole('status')).toHaveText('This lesson is not unlocked yet.');
  expect(await titleHistory(page)).not.toContain(
    'Hue, Saturation, and Lightness | Color Theory Course',
  );

  await page.evaluate(() => {
    window.history.pushState({}, '', '/not-a-route');
    window.dispatchEvent(new PopStateEvent('popstate'));
  });
  await expect(page).toHaveTitle('Page not found | Color Theory Course');
  await expect(page.getByRole('heading', { name: 'page not found' })).toBeFocused();
});

test('redirect sources never publish transient document titles', async ({ page }) => {
  await page.goto('/');
  await startTitleHistory(page);

  await page.evaluate(() => {
    window.history.pushState({}, '', '/capstone');
    window.dispatchEvent(new PopStateEvent('popstate'));
  });

  await expect(page).toHaveURL('/');
  await expect(page).toHaveTitle('Color Theory Course');
  const titles = await titleHistory(page);
  expect(titles).not.toContain('Page not found | Color Theory Course');
  expect(titles).not.toContain('Color System Capstone | Color Theory Course');
});
