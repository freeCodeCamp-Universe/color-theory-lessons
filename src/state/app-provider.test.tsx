import { beforeEach, describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { useAppDispatch } from './app-context.tsx';
import { AppProvider } from './app-provider.tsx';
import {
  MILESTONE_SESSION_PREFIX,
  READ_INTERFACE_SESSION_PREFIX,
} from './persistence.ts';

function ResetProgressButton() {
  const dispatch = useAppDispatch();
  return (
    <button onClick={() => dispatch({ type: 'RESET_PROGRESS' })}>
      reset test progress
    </button>
  );
}

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
});

describe('AppProvider', () => {
  it('clears milestone sessions when progress is reset', () => {
    sessionStorage.setItem(`${MILESTONE_SESSION_PREFIX}milestone-1`, 'milestone state');
    sessionStorage.setItem(`${READ_INTERFACE_SESSION_PREFIX}milestone-1:1`, 'challenge state');
    sessionStorage.setItem('color-theory-course-lesson-session:u1-l1', 'lesson state');

    render(
      <AppProvider>
        <ResetProgressButton />
      </AppProvider>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'reset test progress' }));

    expect(sessionStorage.getItem(`${MILESTONE_SESSION_PREFIX}milestone-1`)).toBeNull();
    expect(sessionStorage.getItem(`${READ_INTERFACE_SESSION_PREFIX}milestone-1:1`)).toBeNull();
    expect(sessionStorage.getItem('color-theory-course-lesson-session:u1-l1')).toBe('lesson state');
  });
});
