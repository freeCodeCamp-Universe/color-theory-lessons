import { cleanup, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { units } from '../data/units.ts';
import {
  AppDispatchContext,
  AppStateContext,
} from '../state/app-context.tsx';
import { HomePage } from './HomePage.tsx';

afterEach(() => cleanup());

const unitOne = units[0];

function renderHomePage(completedMilestones: string[]) {
  return render(
    <MemoryRouter>
      <AppStateContext
        value={{
          completedLessons: unitOne.lessons,
          completedQuizzes: [],
          quizBestScores: {},
          completedMilestones,
          preferences: { reducedMotion: false, colorBlindnessMode: null },
        }}
      >
        <AppDispatchContext value={vi.fn()}>
          <HomePage />
        </AppDispatchContext>
      </AppStateContext>
    </MemoryRouter>,
  );
}

describe('HomePage unit completion', () => {
  it('keeps the unit in progress until its milestone is complete', () => {
    renderHomePage([]);

    const unitCard = screen.getByRole('button', {
      name: /Seeing and Describing Color/,
    });
    expect(within(unitCard).getByText('6/6')).toBeInTheDocument();
    expect(within(unitCard).queryByText('✓ done')).not.toBeInTheDocument();
  });

  it('marks the unit done after its lessons and milestone are complete', () => {
    renderHomePage(['milestone-1']);

    const unitCard = screen.getByRole('button', {
      name: /Seeing and Describing Color/,
    });
    expect(within(unitCard).getByText('✓ done')).toBeInTheDocument();
    expect(within(unitCard).queryByText('6/6')).not.toBeInTheDocument();
  });
});
