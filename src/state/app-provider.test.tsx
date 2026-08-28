import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { useAppDispatch, useAppState } from './app-context.tsx';
import { AppProvider } from './app-provider.tsx';
import {
  ACCESSIBILITY_RESCUE_SESSION_PREFIX,
  CHANNEL_PREDICTION_SESSION_PREFIX,
  DARK_MODE_STRESS_SESSION_PREFIX,
  LEGACY_STEP_STORAGE_PREFIX,
  LESSON_SESSION_PREFIX,
  MILESTONE_SESSION_PREFIX,
  READ_INTERFACE_SESSION_PREFIX,
  SEMANTIC_AUDIT_SESSION_PREFIX,
  SIMULATION_SPOTTER_SESSION_PREFIX,
  THEME_FROM_SCRATCH_SESSION_PREFIX,
} from './persistence.ts';

function ResetProgressButton() {
  const dispatch = useAppDispatch();
  const { completedLessons } = useAppState();
  return (
    <>
      <p>completed lessons: {completedLessons.join(', ') || 'none'}</p>
      <button onClick={() => dispatch({ type: 'COMPLETE_LESSON', lessonId: 'u1-l1' })}>
        complete test lesson
      </button>
      <button onClick={() => dispatch({ type: 'RESET_PROGRESS' })}>
        reset test progress
      </button>
    </>
  );
}

beforeEach(() => {
  vi.restoreAllMocks();
  localStorage.clear();
  sessionStorage.clear();
});

afterEach(cleanup);

describe('AppProvider', () => {
  it('clears lesson and milestone sessions when progress is reset', () => {
    const milestoneSessionKeys = [
      `${MILESTONE_SESSION_PREFIX}milestone-1`,
      `${READ_INTERFACE_SESSION_PREFIX}milestone-1:1`,
      `${CHANNEL_PREDICTION_SESSION_PREFIX}milestone-2:1`,
      `${THEME_FROM_SCRATCH_SESSION_PREFIX}milestone-3:1`,
      `${SIMULATION_SPOTTER_SESSION_PREFIX}milestone-4:1`,
      `${ACCESSIBILITY_RESCUE_SESSION_PREFIX}milestone-5:1`,
      `${SEMANTIC_AUDIT_SESSION_PREFIX}milestone-6:1`,
      `${DARK_MODE_STRESS_SESSION_PREFIX}milestone-6:1`,
    ];
    milestoneSessionKeys.forEach((key) => sessionStorage.setItem(key, 'session state'));
    const lessonSessionKeys = [
      `${LESSON_SESSION_PREFIX}u1-l1`,
      `${LEGACY_STEP_STORAGE_PREFIX}u1-l2`,
    ];
    lessonSessionKeys.forEach((key) => sessionStorage.setItem(key, 'lesson state'));
    sessionStorage.setItem('unrelated-key', 'unrelated state');

    render(
      <AppProvider>
        <ResetProgressButton />
      </AppProvider>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'reset test progress' }));

    milestoneSessionKeys.forEach((key) => expect(sessionStorage.getItem(key)).toBeNull());
    lessonSessionKeys.forEach((key) => expect(sessionStorage.getItem(key)).toBeNull());
    expect(sessionStorage.getItem('unrelated-key')).toBe('unrelated state');
  });

  it('reaches the reducer when milestone-session key enumeration throws', () => {
    render(
      <AppProvider>
        <ResetProgressButton />
      </AppProvider>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'complete test lesson' }));
    expect(screen.getByText('completed lessons: u1-l1')).toBeInTheDocument();
    sessionStorage.setItem(`${MILESTONE_SESSION_PREFIX}milestone-1`, 'milestone state');
    const keySpy = vi.spyOn(Storage.prototype, 'key').mockImplementationOnce(() => {
      throw new Error('SecurityError');
    });

    fireEvent.click(screen.getByRole('button', { name: 'reset test progress' }));

    expect(keySpy).toHaveBeenCalled();
    expect(screen.getByText('completed lessons: none')).toBeInTheDocument();
  });
});
