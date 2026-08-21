import { cleanup, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { AppStateContext } from '../state/app-context.tsx';
import { ReviewPage } from './ReviewPage.tsx';

afterEach(() => cleanup());

function renderReview(completedLessons: string[]) {
  return render(
    <AppStateContext
      value={{
        completedLessons,
        completedQuizzes: [],
        quizBestScores: {},
        completedMilestones: [],
        preferences: { reducedMotion: false, colorBlindnessMode: null },
      }}
    >
      <ReviewPage />
    </AppStateContext>,
  );
}

describe('ReviewPage topic grouping', () => {
  it('groups completed lessons that share a normalized tag under one heading', () => {
    renderReview(['u3-l5', 'u3-l6', 'u6-l4']);

    const themingHeading = screen.getByRole('heading', { name: 'Theming' });
    const themingSection = themingHeading.closest('section');

    expect(themingSection).not.toBeNull();
    expect(
      within(themingSection!).getByText(
        'Gradients, CSS Color Usage, and Theme Building',
      ),
    ).toBeInTheDocument();
    expect(
      within(themingSection!).getByText(
        'Design Tokens and Role-Based Color Systems',
      ),
    ).toBeInTheDocument();
    expect(
      within(themingSection!).getByText('Dark Mode and Theme Pairing'),
    ).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'themes' })).not.toBeInTheDocument();
  });
});
