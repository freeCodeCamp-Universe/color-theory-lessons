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
        preferences: { theme: 'system', reducedMotion: false, colorBlindnessMode: null },
      }}
    >
      <GlossaryPage />
    </AppStateContext>,
  );
}

describe('GlossaryPage', () => {
  it('shows the empty state when no lessons are complete', () => {
    const { container } = renderGlossary([]);

    expect(screen.getByText(/No terms yet/)).toBeInTheDocument();
    expect(screen.queryByText('linked term')).not.toBeInTheDocument();
    expect(container.querySelector('dl')).not.toBeInTheDocument();
    expect(screen.queryByRole('heading', { level: 2 })).not.toBeInTheDocument();
  });

  it('renders one letter group as a heading followed by a description list', () => {
    const { container } = renderGlossary(['u1-l2']);

    expect(screen.getByRole('heading', { level: 2, name: 'S' })).toBeInTheDocument();
    expect(container.querySelectorAll('dl')).toHaveLength(1);
    expect(Array.from(container.querySelectorAll('dt'), (term) => term.textContent))
      .toEqual(['shared term']);
    expect(container.querySelector('dt')?.closest('dl')).toBe(container.querySelector('dl'));
    expect(container.querySelector('dd')?.closest('dl')).toBe(container.querySelector('dl'));
  });

  it('preserves filtering and ordering across multiple letter groups', () => {
    const { container } = renderGlossary(['u1-l1']);

    const groupHeadings = screen.getAllByRole('heading', { level: 2 });
    expect(groupHeadings.map((heading) => heading.textContent)).toEqual(['L', 'S']);
    expect(container.querySelectorAll('dl')).toHaveLength(2);

    const visibleTerms = Array.from(container.querySelectorAll('dt'), (term) => term.textContent);
    expect(visibleTerms).toEqual(['linked term', 'shared term']);
    expect(screen.queryByText('unrelated term')).not.toBeInTheDocument();

    for (const element of container.querySelectorAll('dt, dd')) {
      expect(element.closest('dl')).not.toBeNull();
    }
  });
});
