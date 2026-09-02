import { cleanup, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { units } from '../data/units.ts';
import { renderWithAppState } from '../test-utils.tsx';
import { HomePage } from './HomePage.tsx';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
});

const unitOne = units[0];

function getUnit(name: string) {
  return screen.getByText(name).closest('[class*="unitCard"]') as HTMLElement;
}

function getLessonRow(name: string) {
  return screen.getByText(name).closest('li') as HTMLElement;
}

function getDisclosureVisibleLabel(disclosure: HTMLElement) {
  return Array.from(disclosure.children)
    .filter((child) => child.getAttribute('aria-hidden') !== 'true')
    .map((child) => child.textContent)
    .join('');
}

describe('HomePage dashboard', () => {
  it('uses course copy without a fictional terminal prompt', () => {
    renderWithAppState(<HomePage />);

    expect(screen.getByRole('heading', { name: /Color Theory.*for Developers/ })).toBeInTheDocument();
    expect(screen.queryByText(/color-theory-course|learn --interactive/)).not.toBeInTheDocument();
  });

  it('starts with the first unit expanded and locks later units and lessons', () => {
    renderWithAppState(<HomePage />);

    const unitOneDisclosure = screen.getByRole('button', { name: /Seeing and Describing Color/ });
    expect(unitOneDisclosure).toHaveAccessibleName(getDisclosureVisibleLabel(unitOneDisclosure));
    expect(unitOneDisclosure).toHaveAttribute('aria-expanded', 'true');
    expect(unitOneDisclosure).toHaveAttribute('aria-controls', 'unit-1-lessons');
    expect(within(getUnit('Color Systems and Advanced Topics')).queryByRole('button'))
      .not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Start learning: What Color Does in Interface Design' })).toHaveAttribute('href', '/lesson/u1-l1');
    expect(screen.getByRole('link', { name: 'Continue: What Color Does in Interface Design' })).toHaveAttribute('href', '/lesson/u1-l1');
    expect(within(getUnit('How Screens Make Color')).getByText('locked')).toBeInTheDocument();
    expect(within(getLessonRow('Hue, Saturation, and Lightness')).getByText('locked')).toBeInTheDocument();
  });

  it('includes every unlocked unit disclosure label in its accessible name', () => {
    vi.stubEnv('VITE_DEV_MODE', '1');
    renderWithAppState(<HomePage />);

    const disclosures = screen.getAllByRole('button').filter((button) => (
      button.hasAttribute('aria-controls')
    ));
    expect(disclosures).toHaveLength(units.length);

    for (const disclosure of disclosures) {
      expect(disclosure).toHaveAccessibleName(getDisclosureVisibleLabel(disclosure));
    }
  });

  it('shows continue, redo, and locked lesson actions for an in-progress unit', () => {
    renderWithAppState(<HomePage />, {
      state: { completedLessons: ['u1-l1'] },
    });

    expect(screen.getAllByRole('link', { name: /Continue: Hue, Saturation, and Lightness/ })).toHaveLength(2);
    expect(screen.getAllByRole('link', { name: /Continue: Hue, Saturation, and Lightness/ })[0]).toHaveAttribute('href', '/lesson/u1-l2');
    expect(within(getUnit('Seeing and Describing Color')).getByText('1/6')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Redo: What Color Does in Interface Design' })).toHaveAttribute('href', '/lesson/u1-l1');
    expect(within(getLessonRow('Contrast and Readability')).getByText('locked')).toBeInTheDocument();
  });

  it('unlocks the milestone after every lesson in the unit is complete', () => {
    renderWithAppState(<HomePage />, {
      state: { completedLessons: unitOne.lessons },
    });

    expect(within(getUnit('Seeing and Describing Color')).getByText('6/6')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Start: Read the Interface' })).toHaveAttribute('href', '/milestone/milestone-1');
    expect(within(getUnit('How Screens Make Color')).getByText('locked')).toBeInTheDocument();
  });

  it('continues to the milestone before advancing to the next unit', () => {
    renderWithAppState(<HomePage />, {
      state: { completedLessons: unitOne.lessons },
    });

    expect(screen.getByRole('link', { name: 'Continue: Read the Interface' })).toHaveAttribute(
      'href',
      '/milestone/milestone-1',
    );
  });

  it('exposes every lesson and milestone in development mode', async () => {
    vi.stubEnv('VITE_DEV_MODE', '1');
    const user = userEvent.setup();
    renderWithAppState(<HomePage />);

    expect(within(getLessonRow('Read the Interface')).getByRole('link', { name: 'Start: Read the Interface' }))
      .toHaveAttribute('href', '/milestone/milestone-1');

    const unitTwoCard = screen.getByRole('button', { name: /How Screens Make Color/ });
    await user.click(unitTwoCard);

    expect(within(getLessonRow('Two Ways Color Mixes')).getByRole('link', { name: 'Continue: Two Ways Color Mixes' }))
      .toHaveAttribute('href', '/lesson/u2-l1');
    expect(within(getLessonRow('Seeing Pixels as Light, Not Paint')).getByRole('link', { name: 'Continue: Seeing Pixels as Light, Not Paint' }))
      .toHaveAttribute('href', '/lesson/u2-l5');
    expect(within(getLessonRow('Mix for Screen')).getByRole('link', { name: 'Start: Mix for Screen' }))
      .toHaveAttribute('href', '/milestone/milestone-2');
  });

  it('marks a completed unit done and expands the next unit', async () => {
    const user = userEvent.setup();
    renderWithAppState(<HomePage />, {
      state: {
        completedLessons: unitOne.lessons,
        completedMilestones: ['milestone-1'],
      },
    });

    const unitOneCard = getUnit('Seeing and Describing Color');
    const unitOneDisclosure = screen.getByRole('button', { name: /Seeing and Describing Color/ });
    const unitTwoDisclosure = screen.getByRole('button', { name: /How Screens Make Color/ });
    expect(within(unitOneCard).getByText('✓ done')).toBeInTheDocument();
    expect(unitOneDisclosure).toHaveAttribute('aria-expanded', 'false');
    expect(unitTwoDisclosure).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('link', { name: 'Start: Two Ways Color Mixes' })).toHaveAttribute('href', '/lesson/u2-l1');

    await user.click(unitOneDisclosure);
    expect(unitOneDisclosure).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('link', { name: 'Redo: Read the Interface' })).toHaveAttribute('href', '/milestone/milestone-1');

    await user.click(unitOneDisclosure);
    expect(unitOneDisclosure).toHaveAttribute('aria-expanded', 'false');
  });

  it('expands and collapses an unlocked unit with Enter and Space', async () => {
    const user = userEvent.setup();
    renderWithAppState(<HomePage />);

    const unitOneDisclosure = screen.getByRole('button', { name: /Seeing and Describing Color/ });
    unitOneDisclosure.focus();

    await user.keyboard('{Enter}');
    expect(unitOneDisclosure).toHaveAttribute('aria-expanded', 'false');
    await user.keyboard('{Enter}');
    expect(unitOneDisclosure).toHaveAttribute('aria-expanded', 'true');

    await user.keyboard(' ');
    expect(unitOneDisclosure).toHaveAttribute('aria-expanded', 'false');
    await user.keyboard(' ');
    expect(unitOneDisclosure).toHaveAttribute('aria-expanded', 'true');
  });

  it('keeps lesson links outside the disclosure and in logical tab order', async () => {
    const user = userEvent.setup();
    renderWithAppState(<HomePage />);

    const unitOneCard = getUnit('Seeing and Describing Color');
    const disclosure = within(unitOneCard).getByRole('button', {
      name: /Seeing and Describing Color/,
    });
    const startLink = within(unitOneCard).getByRole('link', { name: 'Start: What Color Does in Interface Design' });
    const lessonLink = screen.getByRole('link', { name: 'Continue: What Color Does in Interface Design' });

    expect(disclosure).not.toContainElement(startLink);
    expect(disclosure).not.toContainElement(lessonLink);

    disclosure.focus();
    await user.tab();
    expect(startLink).toHaveFocus();
    await user.tab();
    expect(lessonLink).toHaveFocus();
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
    expect(screen.getAllByRole('link', { name: 'Continue: Hue, Saturation, and Lightness' })[0]).toHaveAttribute('href', '/lesson/u1-l2');
  });

  it('clears progress and updates the dashboard when reset is confirmed', async () => {
    const user = userEvent.setup();
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    renderWithAppState(<HomePage />, {
      state: { completedLessons: ['u1-l1'] },
    });

    await user.click(screen.getByRole('button', { name: 'reset progress' }));

    expect(screen.getByRole('link', { name: 'Start learning: What Color Does in Interface Design' })).toHaveAttribute('href', '/lesson/u1-l1');
    expect(within(getUnit('Seeing and Describing Color')).getByRole('link', { name: 'Start: What Color Does in Interface Design' })).toHaveAttribute('href', '/lesson/u1-l1');
    expect(screen.queryByText('1/6')).not.toBeInTheDocument();
  });
});
