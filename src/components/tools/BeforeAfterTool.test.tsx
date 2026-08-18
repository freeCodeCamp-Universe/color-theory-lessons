import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { BeforeAfterTool } from './BeforeAfterTool.tsx';

afterEach(() => cleanup());

describe('BeforeAfterTool hierarchy exercise', () => {
  it('allows correction after an incorrect check', () => {
    const onComplete = vi.fn();
    render(<BeforeAfterTool variant="hierarchy" onComplete={onComplete} />);

    fireEvent.click(screen.getByRole('button', { name: 'check hierarchy' }));

    expect(screen.getByText('✗ Submit should be primary, Save Draft secondary, and Cancel tertiary.')).toBeInTheDocument();
    expect(screen.getAllByRole('combobox')).toEqual([
      expect.objectContaining({ disabled: true }),
      expect.objectContaining({ disabled: true }),
      expect.objectContaining({ disabled: true }),
    ]);
    expect(onComplete).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: 'try again' }));

    const roleSelectors = screen.getAllByRole('combobox');
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
