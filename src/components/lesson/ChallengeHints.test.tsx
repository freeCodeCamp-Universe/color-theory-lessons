import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { lesson3_4 } from '../../lessons/unit-3/lesson-3-4.ts';
import { lesson3_6 } from '../../lessons/unit-3/lesson-3-6.ts';
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

  it('hides Unit 3 hints assigned to later stages', () => {
    const view = render(
      <ChallengeHints
        hints={lesson3_4.challenge.hints}
        activeStageId="scrim"
        resetKey="u3-l4:0"
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'show hint' }));
    expect(screen.getByText(
      'Try a dark overlay between 40% and 60% opacity. It should dim the background while leaving it visible.',
    )).toBeInTheDocument();
    expect(screen.queryByText(/Try a light overlay between 10% and 20% opacity/))
      .not.toBeInTheDocument();
    expect(screen.queryByText(/Choose a dark overlay between 45% and 80% opacity/))
      .not.toBeInTheDocument();

    view.rerender(
      <ChallengeHints
        hints={lesson3_6.challenge.hints}
        activeStageId="adjust-token-system"
        resetKey="u3-l6:0"
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'show hint' }));
    expect(screen.getByText('Changing the base controls updates every role color derived from them.'))
      .toBeInTheDocument();
    expect(screen.queryByText(/A raw value is a color code/)).not.toBeInTheDocument();

    view.rerender(
      <ChallengeHints
        hints={lesson3_6.challenge.hints}
        activeStageId="classify-token-names"
        resetKey="u3-l6:0"
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'show hint' }));
    expect(screen.getByText(
      'A raw value is a color code such as #1E40AF. A palette token name identifies a color family and step. A role token name identifies how a color is used.',
    )).toBeInTheDocument();
    expect(screen.queryByText('Changing the base controls updates every role color derived from them.'))
      .not.toBeInTheDocument();
  });
});
