import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { BeforeAfterTool } from './BeforeAfterTool.tsx';

afterEach(() => cleanup());

const HIERARCHY_LABELS = ['Submit', 'Save Draft', 'Cancel'] as const;

describe('BeforeAfterTool hierarchy exercise', () => {
  it('renders preview actions as noninteractive content and keeps labeled selectors', () => {
    render(<BeforeAfterTool variant="hierarchy" />);

    for (const label of HIERARCHY_LABELS) {
      expect(screen.queryByRole('button', { name: label })).not.toBeInTheDocument();
      expect(screen.getByRole('combobox', { name: label })).toBeInTheDocument();
    }
  });

  it('allows correction after an incorrect check', () => {
    const onComplete = vi.fn();
    render(<BeforeAfterTool variant="hierarchy" onComplete={onComplete} />);

    fireEvent.click(screen.getByRole('button', { name: 'check hierarchy' }));

    expect(screen.getByText('✗ Submit should be primary, Save Draft secondary, and Cancel tertiary.')).toBeInTheDocument();
    for (const label of HIERARCHY_LABELS) {
      expect(screen.getByRole('combobox', { name: label })).toBeDisabled();
    }
    expect(onComplete).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: 'try again' }));

    const roleSelectors = HIERARCHY_LABELS.map((label) => screen.getByRole('combobox', { name: label }));
    for (const selector of roleSelectors) {
      expect(selector).toBeEnabled();
    }

    fireEvent.change(roleSelectors[0], { target: { value: 'primary' } });
    fireEvent.change(roleSelectors[2], { target: { value: 'tertiary' } });
    fireEvent.click(screen.getByRole('button', { name: 'check hierarchy' }));

    expect(screen.getByText('✓ Submit stands out as the primary action. Well done.')).toBeInTheDocument();
    expect(onComplete).toHaveBeenCalledOnce();
  });
});
