import { cleanup, render, screen } from '@testing-library/react';
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
});

async function renderRoute(path: string, heading: string | RegExp) {
  window.history.replaceState({}, '', path);
  render(<App />);
  expect(await screen.findByRole('heading', { name: heading })).toBeInTheDocument();
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
  });

  it.each([
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
    await renderRoute('/settings', /Color Theory.*for Developers/);
    expect(window.location.pathname).toBe('/');
  });

  it('renders the not-found page for an unknown route', async () => {
    await renderRoute('/unknown', 'page not found');
    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /back to course/i })).toHaveAttribute('href', '/');
  });
});
