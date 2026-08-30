import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { LessonConfig } from '../../types/lesson.ts';
import { ToolRenderer } from './ToolRenderer.tsx';

afterEach(() => cleanup());

const lesson: LessonConfig = {
  id: 'stage-reporting-test',
  unitId: 'unit-test',
  title: 'Stage reporting test',
  interactionType: 'slider-explore',
  steps: [{ text: 'Test the stage bridge.' }],
  challenge: { prompt: 'Match three targets.', hints: [] },
  quizItems: [],
  reviewTags: [],
};

describe('ToolRenderer stage reporting', () => {
  it('associates an authored exercise description with the active tool', async () => {
    render(
      <ToolRenderer
        lesson={{
          ...lesson,
          challenge: {
            ...lesson.challenge,
            accessibility: {
              classification: 'assessment',
              accessibleName: 'HSL matching exercise',
              accessibleDescription: 'A target swatch and a current swatch show the colors to match.',
            },
          },
        }}
        onChallengeComplete={vi.fn()}
      />,
    );

    const tool = await screen.findByRole('group', { name: 'HSL matching exercise' });
    const description = screen.getByText(/A target swatch and a current swatch/);
    expect(tool).toHaveAttribute('aria-describedby', description.id);
    expect(description).toHaveClass('sr-only');
  });

  it('forwards a staged tool active-stage data to the lesson flow', async () => {
    const onStageChange = vi.fn();
    render(
      <ToolRenderer
        lesson={lesson}
        onChallengeComplete={vi.fn()}
        onStageChange={onStageChange}
      />,
    );

    await waitFor(() => {
      expect(onStageChange).toHaveBeenCalledWith(expect.objectContaining({
        id: 'hue',
        position: 1,
        total: 3,
      }));
    });
  });

  it.each([
    ['text-contrast-lab', 'repair-text-contrast', 1],
    ['component-checker', 'repair-component-contrast', 1],
    ['state-workshop', 'repair-semantic-states', 1],
    ['pattern-repair', 'repair-interface-patterns', 1],
    ['audit-flow', 'priority', 4],
    ['inclusive-review', 'assess-inclusive-evidence', 1],
  ] as const)('forwards the active stage for %s', async (interactionType, id, total) => {
    const onStageChange = vi.fn();
    render(
      <ToolRenderer
        lesson={{ ...lesson, interactionType }}
        onChallengeComplete={vi.fn()}
        onStageChange={onStageChange}
      />,
    );

    await waitFor(() => {
      expect(onStageChange).toHaveBeenCalledWith(expect.objectContaining({ id, total }));
    });
  });
});
