import { cleanup, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Route, Routes } from 'react-router-dom';
import { getMilestoneById } from '../data/milestones.ts';
import { renderWithAppState } from '../test-utils.tsx';
import { MilestonePage } from './MilestonePage.tsx';

vi.mock('../components/milestone/MilestonePlayer.tsx', () => ({
  MilestonePlayer: ({ milestone }: { milestone: { title: string } }) => <h1>{milestone.title}</h1>,
}));

afterEach(() => cleanup());

describe('MilestonePage', () => {
  const milestoneRoute = (
    <Routes>
      <Route path="/milestone/:milestoneId" element={<MilestonePage />} />
    </Routes>
  );

  it('renders the player for a valid milestone ID', () => {
    const milestone = getMilestoneById('milestone-1')!;
    renderWithAppState(milestoneRoute, { route: `/milestone/${milestone.id}` });

    expect(screen.getByRole('heading', { name: milestone.title })).toBeInTheDocument();
  });

  it('renders a not-found outcome for an invalid milestone ID', () => {
    renderWithAppState(milestoneRoute, { route: '/milestone/not-a-milestone' });

    expect(screen.getByText('milestone not found: not-a-milestone')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /back to home/i })).toHaveAttribute('href', '/');
  });
});
