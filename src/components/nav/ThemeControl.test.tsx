import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { AppProvider } from '../../state/app-provider.tsx';
import { ThemeControl } from './ThemeControl.tsx';

const STORAGE_KEY = 'color-theory-course-state';

function installMatchMedia(prefersDark: boolean) {
  let matches = prefersDark;
  const listeners = new Set<() => void>();
  const mediaQuery = {
    get matches() {
      return matches;
    },
    media: '(prefers-color-scheme: dark)',
    onchange: null,
    addEventListener: (_type: string, listener: () => void) => {
      listeners.add(listener);
    },
    removeEventListener: (_type: string, listener: () => void) => {
      listeners.delete(listener);
    },
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  };
  vi.spyOn(window, 'matchMedia').mockReturnValue(mediaQuery as unknown as MediaQueryList);

  return {
    setPrefersDark(value: boolean) {
      matches = value;
      listeners.forEach((listener) => listener());
    },
  };
}

beforeEach(() => {
  localStorage.clear();
  document.documentElement.removeAttribute('data-theme');
  document.documentElement.style.removeProperty('color-scheme');
  vi.restoreAllMocks();
});

afterEach(cleanup);

describe('ThemeControl', () => {
  it('applies and persists each learner preference', () => {
    installMatchMedia(false);
    render(
      <AppProvider>
        <ThemeControl />
      </AppProvider>,
    );

    const control = screen.getByRole('combobox', { name: 'Theme preference' });
    expect(control).toHaveValue('system');

    for (const [preference, appliedTheme] of [
      ['dark', 'dark'],
      ['light', 'light'],
      ['system', 'light'],
    ] as const) {
      fireEvent.change(control, { target: { value: preference } });
      expect(control).toHaveValue(preference);
      expect(document.documentElement).toHaveAttribute('data-theme', appliedTheme);
      expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!).preferences.theme).toBe(preference);
    }
  });

  it('restores a saved preference', () => {
    installMatchMedia(false);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      version: 3,
      progress: {
        completedLessons: [],
        completedQuizzes: [],
        quizBestScores: {},
        completedMilestones: [],
      },
      preferences: {
        theme: 'dark',
        reducedMotion: false,
        colorBlindnessMode: null,
      },
    }));

    render(
      <AppProvider>
        <ThemeControl />
      </AppProvider>,
    );

    expect(screen.getByRole('combobox', { name: 'Theme preference' })).toHaveValue('dark');
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
  });

  it('follows system changes when no explicit theme is saved', () => {
    const system = installMatchMedia(false);
    render(
      <AppProvider>
        <ThemeControl />
      </AppProvider>,
    );

    expect(document.documentElement).toHaveAttribute('data-theme', 'light');

    system.setPrefersDark(true);

    expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
  });
});
