import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { App } from './App.tsx';

vi.mock('./pages/LessonPage.tsx', () => ({ LessonPage: () => <h1>lesson route</h1> }));
vi.mock('./pages/MilestonePage.tsx', () => ({ MilestonePage: () => <h1>milestone route</h1> }));
vi.mock('./pages/PaletteBuilderPage.tsx', () => ({ PaletteBuilderPage: () => <h1>palette builder route</h1> }));
vi.mock('./pages/GlossaryPage.tsx', () => ({ GlossaryPage: () => <h1>glossary route</h1> }));
vi.mock('./pages/ReviewPage.tsx', () => ({ ReviewPage: () => <h1>review route</h1> }));

afterEach(() => {
  cleanup();
  localStorage.clear();
  window.history.replaceState({}, '', '/');
  document.title = '';
});

async function renderRoute(path: string, heading: string | RegExp, title?: string) {
  window.history.replaceState({}, '', path);
  render(<App />);
  await screen.findByRole('heading', { name: heading });
  if (title) expect(document.title).toBe(title);
}

describe('App routes', () => {
  it('renders the course dashboard inside the app shell at /', async () => {
    window.history.replaceState({}, '', '/');
    render(<App />);

    expect(await screen.findByRole('heading', { name: /Color Theory.*for Developers/ })).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'Main navigation' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /color-theory-course\$/ })).toHaveAttribute('href', '/');
    expect(screen.getByRole('combobox', { name: 'Theme preference' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Seeing and Describing Color/ })).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('button', { name: 'reset progress' })).toBeInTheDocument();
    expect(document.title).toBe('Color Theory Course');
  });

  it.each([
    ['/lesson/u1-l1', 'lesson route', 'What Color Does in Interface Design | Color Theory Course'],
    ['/milestone/milestone-1', 'milestone route', 'Read the Interface | Color Theory Course'],
    ['/palette-builder', 'palette builder route', 'Palette Builder | Color Theory Course'],
    ['/glossary', 'glossary route', 'Glossary | Color Theory Course'],
    ['/review', 'review route', 'Review | Color Theory Course'],
    ['/lesson/not-registered', 'lesson route', 'Lesson not found | Color Theory Course'],
    ['/milestone/not-registered', 'milestone route', 'Milestone not found | Color Theory Course'],
  ])('renders %s with its document title', async (path, heading, title) => {
    await renderRoute(path, heading, title);
  });

  it('redirects /capstone to the final milestone', async () => {
    await renderRoute('/capstone', 'milestone route');
    expect(window.location.pathname).toBe('/milestone/milestone-6');
    expect(document.title).toBe('Color System Capstone | Color Theory Course');
    await waitFor(() => expect(screen.getByRole('heading', { name: 'milestone route' })).toHaveFocus());
  });

  it('redirects /settings to the home page', async () => {
    await renderRoute('/settings', /Color Theory.*for Developers/);
    expect(window.location.pathname).toBe('/');
  });

  it('renders the not-found page for an unknown route', async () => {
    await renderRoute('/unknown', 'page not found', 'Page not found | Color Theory Course');
    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /back to course/i })).toHaveAttribute('href', '/');
  });

  it('puts the skip link first and moves focus to main content', async () => {
    const user = userEvent.setup();
    await renderRoute('/', /Color Theory.*for Developers/);

    await user.tab();
    const skipLink = screen.getByRole('link', { name: 'skip to main content' });
    expect(skipLink).toHaveFocus();

    await user.keyboard('{Enter}');
    expect(screen.getByRole('main')).toHaveFocus();
    expect(screen.getByRole('main')).toHaveAttribute('tabindex', '-1');
  });

  it('moves focus and updates the title after client-side navigation', async () => {
    const user = userEvent.setup();
    await renderRoute('/', /Color Theory.*for Developers/);

    await user.click(screen.getAllByRole('link', { name: 'palette builder' })[0]);
    const heading = await screen.findByRole('heading', { name: 'palette builder route' });
    await waitFor(() => expect(heading).toHaveFocus());
    expect(document.title).toBe('Palette Builder | Color Theory Course');
  });
});
