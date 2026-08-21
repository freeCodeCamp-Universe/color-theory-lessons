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

  return (
    <AppStateContext value={state}>
      <AppDispatchContext value={dispatch}>
        {children}
      </AppDispatchContext>
    </AppStateContext>
  );
}
