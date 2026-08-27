import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { App } from './App.tsx';

vi.mock('./pages/HomePage.tsx', () => ({ HomePage: () => <h1>home route</h1> }));
vi.mock('./pages/LessonPage.tsx', () => ({ LessonPage: () => <h1>lesson route</h1> }));
vi.mock('./pages/MilestonePage.tsx', () => ({ MilestonePage: () => <h1>milestone route</h1> }));
vi.mock('./pages/PaletteBuilderPage.tsx', () => ({ PaletteBuilderPage: () => <h1>palette builder route</h1> }));
vi.mock('./pages/GlossaryPage.tsx', () => ({ GlossaryPage: () => <h1>glossary route</h1> }));
vi.mock('./pages/ReviewPage.tsx', () => ({ ReviewPage: () => <h1>review route</h1> }));

afterEach(() => {
  cleanup();
  localStorage.clear();
  window.history.replaceState({}, '', '/');
});

async function renderRoute(path: string, heading: string) {
  window.history.replaceState({}, '', path);
  render(<App />);
  expect(await screen.findByRole('heading', { name: heading })).toBeInTheDocument();
}

describe('App routes', () => {
  it.each([
    ['/', 'home route'],
    ['/lesson/u1-l1', 'lesson route'],
    ['/milestone/milestone-1', 'milestone route'],
    ['/palette-builder', 'palette builder route'],
    ['/glossary', 'glossary route'],
    ['/review', 'review route'],
  ])('renders %s', async (path, heading) => {
    await renderRoute(path, heading);
  });

  it('redirects /capstone to the final milestone', async () => {
    await renderRoute('/capstone', 'milestone route');
    expect(window.location.pathname).toBe('/milestone/milestone-6');
  });

  it('redirects /settings to the home page', async () => {
    await renderRoute('/settings', 'home route');
    expect(window.location.pathname).toBe('/');
  });

  it('renders the not-found page for an unknown route', async () => {
    await renderRoute('/unknown', 'page not found');
    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /back to course/i })).toHaveAttribute('href', '/');
  });
});
