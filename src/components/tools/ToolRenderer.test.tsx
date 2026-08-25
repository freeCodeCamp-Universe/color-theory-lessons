import { cleanup, render, waitFor } from '@testing-library/react';
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
});
