import { createContext, useContext } from 'react';
import type { ProgressState } from '../types/progress.ts';
import { loadState } from './persistence.ts';

/** Combined global state including progress and user preferences. */
interface AppState extends ProgressState {
  /** Global user-specific settings. */
  preferences: {
    /** Whether to disable decorative animations. */
    reducedMotion: boolean;
    /** Simulation filter to apply to the UI (e.g., 'deuteranopia'). */
    colorBlindnessMode: string | null;
  };
}

/** Actions that can be dispatched to update the global state. */
export type Action =
  | { type: 'COMPLETE_LESSON'; lessonId: string }
  | { type: 'COMPLETE_QUIZ'; quizId: string; score: number }
  | { type: 'COMPLETE_MILESTONE'; milestoneId: string }
  | { type: 'SET_PREFERENCE'; key: keyof AppState['preferences']; value: string | boolean | null }
  | { type: 'RESET_PROGRESS' };

/** Initialize state from localStorage or defaults. */
export function createInitialState(): AppState {
  const { progress, preferences } = loadState();
  return {
    ...progress,
    preferences,
  };
}

/**
 * Reducer for managing application state updates.
 * Most completion actions are idempotent to prevent duplicate entries.
 */
export function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'COMPLETE_LESSON':
      if (state.completedLessons.includes(action.lessonId)) return state;
      return {
        ...state,
        completedLessons: [...state.completedLessons, action.lessonId],
      };

    case 'COMPLETE_QUIZ': {
      const alreadyCompleted = state.completedQuizzes.includes(action.quizId);
      const previousBest = state.quizBestScores[action.quizId] ?? 0;
      return {
        ...state,
        completedQuizzes: alreadyCompleted
          ? state.completedQuizzes
          : [...state.completedQuizzes, action.quizId],
        quizBestScores: {
          ...state.quizBestScores,
          [action.quizId]: Math.max(previousBest, action.score),
        },
      };
    }

    case 'COMPLETE_MILESTONE':
      if (state.completedMilestones.includes(action.milestoneId)) return state;
      return {
        ...state,
        completedMilestones: [...state.completedMilestones, action.milestoneId],
      };

    case 'SET_PREFERENCE':
      return {
        ...state,
        preferences: {
          ...state.preferences,
          [action.key]: action.value,
        },
      };

    case 'RESET_PROGRESS':
      return {
        ...state,
        completedLessons: [],
        completedQuizzes: [],
        quizBestScores: {},
        completedMilestones: [],
      };

    default:
      return state;
  }
}

export const AppStateContext = createContext<AppState | null>(null);
export const AppDispatchContext = createContext<React.Dispatch<Action> | null>(null);

/** Access the global application state. */
export function useAppState(): AppState {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within an AppProvider');
  }
  return context;
}

/** Access the global dispatch function for state updates. */
export function useAppDispatch(): React.Dispatch<Action> {
  const context = useContext(AppDispatchContext);
  if (!context) {
    throw new Error('useAppDispatch must be used within an AppProvider');
  }
  return context;
}
