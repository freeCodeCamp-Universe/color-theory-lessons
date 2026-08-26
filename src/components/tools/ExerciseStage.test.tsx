import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ExerciseStage } from './ExerciseStage.tsx';
import type { ExerciseStageDefinition, ExerciseToolProps } from './exercise-stage.ts';
import { useExerciseStages } from './useExerciseStages.ts';

afterEach(() => cleanup());

const SINGLE_STAGE: readonly ExerciseStageDefinition[] = [{
  id: 'only-task',
  title: 'Only task',
  instruction: 'Complete the only task.',
}];

const MULTI_STAGE: readonly ExerciseStageDefinition[] = [
  { id: 'first-task', title: 'First task', instruction: 'Complete the first task.' },
  { id: 'second-task', title: 'Second task', instruction: 'Complete the second task.' },
];

function TestExercise({
  stages,
  onComplete,
  onStageChange,
}: ExerciseToolProps & { stages: readonly ExerciseStageDefinition[] }) {
  const controller = useExerciseStages({ stages, onComplete, onStageChange });

  return (
    <ExerciseStage
      controller={controller}
      incorrectFeedback="Incorrect result"
      passedFeedback="Passed result"
      completionFeedback="Exercise complete"
    >
      <p>{controller.activeStage.id} answers</p>
      {controller.result === 'idle' && (
        <>
          <button onClick={controller.markIncorrect}>fail stage</button>
          <button onClick={controller.markPassed}>pass stage</button>
        </>
      )}
    </ExerciseStage>
  );
}

describe('exercise-stage contract', () => {
  it('renders the shared progress pattern for a single-stage exercise', () => {
    render(<TestExercise stages={SINGLE_STAGE} />);

    expect(screen.getByText('Stage 1 of 1')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Only task' })).toHaveAttribute(
      'aria-describedby',
      'exercise-stage-only-task-position exercise-stage-only-task-instruction',
    );
    expect(screen.getByText('Complete the only task.')).toBeInTheDocument();
  });

  it('supports failure and retry focus without advancing or completing', () => {
    const onComplete = vi.fn();
    render(<TestExercise stages={MULTI_STAGE} onComplete={onComplete} />);

    fireEvent.click(screen.getByRole('button', { name: 'fail stage' }));
    expect(screen.getByRole('status')).toHaveTextContent('Incorrect result');
    expect(screen.getByText('Stage 1 of 2')).toBeInTheDocument();
    expect(onComplete).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: 'try stage again' }));
    expect(screen.getByRole('status')).toBeEmptyDOMElement();
    expect(screen.getByRole('button', { name: 'pass stage' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'First task' })).toHaveFocus();
  });

  it('reports stable IDs, focuses the new stage, and completes only after the final pass', async () => {
    const onComplete = vi.fn();
    const onStageChange = vi.fn();
    render(
      <TestExercise
        stages={MULTI_STAGE}
        onComplete={onComplete}
        onStageChange={onStageChange}
      />,
    );

    expect(onStageChange).toHaveBeenLastCalledWith(expect.objectContaining({
      id: 'first-task',
      position: 1,
      total: 2,
    }));
    fireEvent.click(screen.getByRole('button', { name: 'pass stage' }));
    expect(onComplete).not.toHaveBeenCalled();
    expect(screen.getByRole('status')).toHaveTextContent('Passed result');
    expect(screen.getByRole('status')).toHaveTextContent('Next action: next stage.');
    fireEvent.click(screen.getByRole('button', { name: 'next stage' }));

    const secondHeading = screen.getByRole('heading', { name: 'Second task' });
    await waitFor(() => expect(secondHeading).toHaveFocus());
    expect(onStageChange).toHaveBeenLastCalledWith(expect.objectContaining({
      id: 'second-task',
      position: 2,
      total: 2,
    }));
    expect(screen.queryByText('first-task answers')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'pass stage' }));
    expect(onComplete).toHaveBeenCalledOnce();
    expect(screen.getByRole('status')).toHaveTextContent('Exercise complete');
    expect(screen.queryByRole('button', { name: 'next stage' })).not.toBeInTheDocument();
  });
});
