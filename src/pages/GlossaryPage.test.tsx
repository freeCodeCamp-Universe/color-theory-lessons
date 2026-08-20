import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { AppStateContext } from '../state/app-context.tsx';
import { GlossaryPage } from './GlossaryPage.tsx';

vi.mock('../data/glossary.ts', () => ({
  glossary: [
    {
      term: 'linked term',
      definition: 'Shown after completing the linked lesson.',
      relatedLessons: ['u1-l1'],
    },
    {
      term: 'shared term',
      definition: 'Shown after completing either linked lesson.',
      relatedLessons: ['u1-l1', 'u1-l2'],
    },
    {
      term: 'unrelated term',
      definition: 'Hidden until its lesson is complete.',
      relatedLessons: ['u2-l1'],
    },
  ],
}));

afterEach(() => cleanup());

function renderGlossary(completedLessons: string[]) {
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
      <GlossaryPage />
    </AppStateContext>,
  );
}

describe('GlossaryPage', () => {
  it('shows the empty state when no lessons are complete', () => {
    renderGlossary([]);

    expect(screen.getByText(/No terms yet/)).toBeInTheDocument();
    expect(screen.queryByText('linked term')).not.toBeInTheDocument();
  });

  it('shows exactly the terms linked to a completed lesson', () => {
    const { container } = renderGlossary(['u1-l1']);

    const visibleTerms = Array.from(container.querySelectorAll('dt'), (term) => term.textContent);
    expect(visibleTerms).toEqual(['linked term', 'shared term']);
    expect(screen.queryByText('unrelated term')).not.toBeInTheDocument();
  });
});
