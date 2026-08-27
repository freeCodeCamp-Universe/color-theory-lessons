import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { VisionCardsTool } from './VisionCardsTool.tsx';

afterEach(cleanup);

describe('VisionCardsTool typography', () => {
  it('applies the tool UI typography floor to progress and expanded content', () => {
    render(<VisionCardsTool interactive />);

    const progress = screen.getByText('0/6 cards explored');
    expect(getComputedStyle(progress).fontSize).toBe('1rem');

    fireEvent.click(screen.getByRole('button', { name: /Protanopia/ }));
    const description = screen.getByText(/Loss of function from the L-cone/);
    expect(getComputedStyle(description).fontSize).toBe('1rem');
  });

  it('preserves the authored lesson preview without exempting the interactive tool', () => {
    render(<VisionCardsTool interactive={false} previewExpandedNames={['Protanopia']} />);

    const description = screen.getByText(/Loss of function from the L-cone/);
    expect(description.closest('[data-authored-visual]')).toBeInTheDocument();
    expect(getComputedStyle(description).fontSize).toBe('0.82rem');
  });
});
