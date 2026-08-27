import { useCallback, useEffect, useReducer } from 'react';
import type { ReactNode } from 'react';
import type { ProgressState } from '../types/progress.ts';
import {
  AppDispatchContext,
  AppStateContext,
  appReducer,
  createInitialState,
} from './app-context.tsx';
import type { Action } from './app-context.tsx';
import { clearMilestoneSessions, saveState } from './persistence.ts';

function getSystemTheme(): 'dark' | 'light' {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, reducerDispatch] = useReducer(appReducer, undefined, createInitialState);
  const dispatch = useCallback((action: Action) => {
    if (action.type === 'RESET_PROGRESS') clearMilestoneSessions();
    reducerDispatch(action);
  }, []);

  useEffect(() => {
    const progress: ProgressState = {
      completedLessons: state.completedLessons,
      completedQuizzes: state.completedQuizzes,
      quizBestScores: state.quizBestScores,
      completedMilestones: state.completedMilestones,
    };
    saveState(progress, state.preferences);
  }, [
    state.completedLessons,
    state.completedQuizzes,
    state.quizBestScores,
    state.completedMilestones,
    state.preferences,
  ]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    function applyTheme() {
      const theme = state.preferences.theme === 'system'
        ? getSystemTheme()
        : state.preferences.theme;
      document.documentElement.dataset.theme = theme;
      document.documentElement.style.colorScheme = theme;
      document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')
        ?.setAttribute('content', theme === 'dark' ? '#0a0a23' : '#ffffff');
    }

    applyTheme();
    if (state.preferences.theme === 'system') {
      mediaQuery.addEventListener('change', applyTheme);
      return () => mediaQuery.removeEventListener('change', applyTheme);
    }
  }, [state.preferences.theme]);

  return (
    <AppStateContext value={state}>
      <AppDispatchContext value={dispatch}>
        {children}
      </AppDispatchContext>
    </AppStateContext>
  );
}
