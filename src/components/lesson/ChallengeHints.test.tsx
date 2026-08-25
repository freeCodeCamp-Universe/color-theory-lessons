import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import type { ChallengeHint } from '../../types/lesson.ts';
import { ChallengeHints } from './ChallengeHints.tsx';

afterEach(() => cleanup());

describe('ChallengeHints', () => {
  it('supports challenges with no hints', () => {
    render(<ChallengeHints hints={[]} activeStageId={null} resetKey="lesson-1:0" />);

    expect(screen.queryByRole('button', { name: /hint/ })).not.toBeInTheDocument();
  });

  it('starts closed and reveals one hint per request in source order', () => {
    render(
      <ChallengeHints
        hints={['First hint', 'Second hint']}
        activeStageId={null}
        resetKey="lesson-1:0"
      />,
    );

    expect(screen.queryByText('First hint')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'show hint' }));
    expect(screen.getByText('First hint')).toBeInTheDocument();
    expect(screen.queryByText('Second hint')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'show next hint' }));
    expect(screen.getByText('First hint')).toBeInTheDocument();
    expect(screen.getByText('Second hint')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /hint/ })).not.toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('Hint: Second hint');
  });

  it('shows only challenge-wide and active-stage hints, then resets for a new stage', () => {
    const hints: ChallengeHint[] = [
      'Shared hint',
      { stageId: 'hue', text: 'Hue hint' },
      { stageId: 'saturation', text: 'Saturation hint' },
    ];
    const view = render(
      <ChallengeHints hints={hints} activeStageId="hue" resetKey="lesson-1:0" />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'show hint' }));
    fireEvent.click(screen.getByRole('button', { name: 'show next hint' }));
    expect(screen.getByText('Shared hint')).toBeInTheDocument();
    expect(screen.getByText('Hue hint')).toBeInTheDocument();
    expect(screen.queryByText('Saturation hint')).not.toBeInTheDocument();

    view.rerender(
      <ChallengeHints hints={hints} activeStageId="saturation" resetKey="lesson-1:0" />,
    );
    expect(screen.queryByText('Shared hint')).not.toBeInTheDocument();
    expect(screen.queryByText('Hue hint')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'show hint' }));
    fireEvent.click(screen.getByRole('button', { name: 'show next hint' }));
    expect(screen.getByText('Shared hint')).toBeInTheDocument();
    expect(screen.getByText('Saturation hint')).toBeInTheDocument();
  });

  it('resets revealed hints when the lesson or attempt reset key changes', () => {
    const view = render(
      <ChallengeHints hints={['Try this']} activeStageId={null} resetKey="lesson-1:0" />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'show hint' }));
    expect(screen.getByText('Try this')).toBeInTheDocument();

    view.rerender(
      <ChallengeHints hints={['Try this']} activeStageId={null} resetKey="lesson-1:1" />,
    );
    expect(screen.queryByText('Try this')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'show hint' })).toBeInTheDocument();
  });
});
