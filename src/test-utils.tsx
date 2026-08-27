import type { ReactElement, ReactNode } from 'react';
import { useReducer } from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import {
  AppDispatchContext,
  AppStateContext,
  appReducer,
} from './state/app-context.tsx';

type AppState = NonNullable<React.ComponentProps<typeof AppStateContext>['value']>;

export const emptyAppState: AppState = {
  completedLessons: [],
  completedQuizzes: [],
  quizBestScores: {},
  completedMilestones: [],
  preferences: {
    theme: 'system',
    reducedMotion: false,
    colorBlindnessMode: null,
  },
};

interface RenderOptions {
  route?: string;
  routeState?: unknown;
  state?: Partial<AppState>;
}

export function renderWithAppState(
  ui: ReactElement,
  { route = '/', routeState, state = {} }: RenderOptions = {},
) {
  const initialState: AppState = {
    ...emptyAppState,
    ...state,
    preferences: {
      ...emptyAppState.preferences,
      ...state.preferences,
    },
  };

  function Wrapper({ children }: { children: ReactNode }) {
    const [currentState, dispatch] = useReducer(appReducer, initialState);

    return (
      <MemoryRouter initialEntries={[{ pathname: route, state: routeState }]}>
        <AppStateContext value={currentState}>
          <AppDispatchContext value={dispatch}>
            {children}
          </AppDispatchContext>
        </AppStateContext>
      </MemoryRouter>
    );
  }

  return render(ui, { wrapper: Wrapper });
}
