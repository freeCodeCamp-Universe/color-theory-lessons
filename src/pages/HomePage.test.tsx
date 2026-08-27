import { cleanup, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { units } from '../data/units.ts';
import { renderWithAppState } from '../test-utils.tsx';
import { HomePage } from './HomePage.tsx';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

const unitOne = units[0];

function getUnit(name: string) {
  return screen.getByText(name).closest('[class*="unitCard"]') as HTMLElement;
}

function getLessonRow(name: string) {
  return screen.getByText(name).closest('li') as HTMLElement;
}

describe('HomePage dashboard', () => {
  it('starts with the first unit expanded and locks later units and lessons', () => {
    renderWithAppState(<HomePage />);

    const unitOneCard = screen.getByRole('button', { name: /Seeing and Describing Color/ });
    expect(unitOneCard).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('link', { name: 'start learning' })).toHaveAttribute('href', '/lesson/u1-l1');
    expect(screen.getAllByRole('link', { name: 'continue →' })[0]).toHaveAttribute('href', '/lesson/u1-l1');
    expect(within(getUnit('How Screens Make Color')).getByText('locked')).toBeInTheDocument();
    expect(within(getLessonRow('Hue, Saturation, and Lightness')).getByText('locked')).toBeInTheDocument();
  });

  it('shows continue, redo, and locked lesson actions for an in-progress unit', () => {
    renderWithAppState(<HomePage />, {
      state: { completedLessons: ['u1-l1'] },
    });

    expect(screen.getAllByRole('link', { name: 'continue →' })).toHaveLength(2);
    expect(screen.getAllByRole('link', { name: 'continue →' })[0]).toHaveAttribute('href', '/lesson/u1-l2');
    expect(within(getUnit('Seeing and Describing Color')).getByText('1/6')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'redo →' })).toHaveAttribute('href', '/lesson/u1-l1');
    expect(within(getLessonRow('Contrast and Readability')).getByText('locked')).toBeInTheDocument();
  });

  it('unlocks the milestone after every lesson in the unit is complete', () => {
    renderWithAppState(<HomePage />, {
      state: { completedLessons: unitOne.lessons },
    });

    expect(within(getUnit('Seeing and Describing Color')).getByText('6/6')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'start →' })).toHaveAttribute('href', '/milestone/milestone-1');
    expect(within(getUnit('How Screens Make Color')).getByText('locked')).toBeInTheDocument();
  });

  it('marks a completed unit done and expands the next unit', async () => {
    const user = userEvent.setup();
    renderWithAppState(<HomePage />, {
      state: {
        completedLessons: unitOne.lessons,
        completedMilestones: ['milestone-1'],
      },
    });

    const unitOneCard = screen.getByRole('button', { name: /Seeing and Describing Color/ });
    const unitTwoCard = screen.getByRole('button', { name: /How Screens Make Color/ });
    expect(within(unitOneCard).getByText('✓ done')).toBeInTheDocument();
    expect(unitOneCard).toHaveAttribute('aria-expanded', 'false');
    expect(unitTwoCard).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('link', { name: 'start →' })).toHaveAttribute('href', '/lesson/u2-l1');

    await user.click(unitOneCard);
    expect(unitOneCard).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getAllByRole('link', { name: 'redo →' }).at(-1)).toHaveAttribute('href', '/milestone/milestone-1');

    await user.click(unitOneCard);
    expect(unitOneCard).toHaveAttribute('aria-expanded', 'false');
  });

  it('preserves progress when reset is cancelled', async () => {
    const user = userEvent.setup();
    const confirm = vi.spyOn(window, 'confirm').mockReturnValue(false);
    renderWithAppState(<HomePage />, {
      state: { completedLessons: ['u1-l1'] },
    });

    await user.click(screen.getByRole('button', { name: 'reset progress' }));

    expect(confirm).toHaveBeenCalledWith('Reset all progress? This cannot be undone.');
    expect(within(getUnit('Seeing and Describing Color')).getByText('1/6')).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: 'continue →' })[0]).toHaveAttribute('href', '/lesson/u1-l2');
  });

  it('clears progress and updates the dashboard when reset is confirmed', async () => {
    const user = userEvent.setup();
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    renderWithAppState(<HomePage />, {
      state: { completedLessons: ['u1-l1'] },
    });

    await user.click(screen.getByRole('button', { name: 'reset progress' }));

    expect(screen.getByRole('link', { name: 'start learning' })).toHaveAttribute('href', '/lesson/u1-l1');
    expect(within(getUnit('Seeing and Describing Color')).getByRole('link', { name: 'start →' })).toHaveAttribute('href', '/lesson/u1-l1');
    expect(screen.queryByText('1/6')).not.toBeInTheDocument();
  });
});
