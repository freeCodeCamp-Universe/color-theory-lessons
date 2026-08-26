import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { AuditFlowTool } from './AuditFlowTool.tsx';

afterEach(() => cleanup());

function checkStage() {
  fireEvent.click(screen.getByRole('button', { name: 'Check answer' }));
}

function advanceStage() {
  fireEvent.click(screen.getByRole('button', { name: 'next stage' }));
}

function completePriorityStage() {
  for (const option of ['Text content', 'Status indicators', 'Chart series marks', 'Border that identifies a button']) {
    fireEvent.click(screen.getByRole('checkbox', { name: option }));
  }
  checkStage();
  advanceStage();
}

describe('AuditFlowTool stages', () => {
  it('renders only the active stage and supports retry without restarting', () => {
    render(<AuditFlowTool interactive />);

    expect(screen.getByText('Stage 1 of 4')).toBeInTheDocument();
    expect(screen.queryByText('Contrast check')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('checkbox', { name: 'Text content' }));
    checkStage();

    expect(screen.getByText(/Not quite/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'try stage again' }));
    expect(screen.getByRole('checkbox', { name: 'Text content' })).toBeChecked();
    expect(screen.getByText('Stage 1 of 4')).toBeInTheDocument();
  });

  it('requires all four stages in order and completes once', () => {
    const onComplete = vi.fn();
    render(<AuditFlowTool interactive onComplete={onComplete} />);

    completePriorityStage();
    expect(screen.getByText('Stage 2 of 4')).toBeInTheDocument();
    expect(onComplete).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('radio', { name: 'Fail because 2.3:1 is below the 4.5:1 threshold for normal text' }));
    checkStage();
    advanceStage();
    expect(screen.getByText('Stage 3 of 4')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('radio', { name: 'Add a text label or icon to each dot so meaning does not depend on color alone' }));
    checkStage();
    advanceStage();
    expect(screen.getByText('Stage 4 of 4')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('radio', { name: 'Users who cannot distinguish the hues cannot tell the series apart' }));
    checkStage();

    expect(screen.getByText(/Audit activity complete/)).toBeInTheDocument();
    expect(onComplete).toHaveBeenCalledOnce();
    expect(screen.queryByRole('button', { name: 'next stage' })).not.toBeInTheDocument();
  });
});
