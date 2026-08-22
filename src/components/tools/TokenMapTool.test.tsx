import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { TokenMapTool } from './TokenMapTool.tsx';

afterEach(cleanup);

const ANSWERS = {
  '#0B57D0': 'raw',
  'rgb(34, 34, 34)': 'raw',
  '--blue-600': 'alias',
  '--gray-900': 'alias',
  '--color-text-primary': 'role',
  '--color-success-bg': 'role',
  '--color-action-primary': 'role',
  '#1a1a1a': 'raw',
  '--green-500': 'alias',
};

function classifyAllItems() {
  for (const [label, category] of Object.entries(ANSWERS)) {
    fireEvent.change(screen.getByLabelText(`Category for ${label}`), {
      target: { value: category },
    });
  }
}

describe('TokenMapTool', () => {
  it('completes after the learner sets a valid base and classifies every item', () => {
    const onComplete = vi.fn();
    render(<TokenMapTool interactive onComplete={onComplete} />);

    fireEvent.change(screen.getByLabelText(/Base hue:/), { target: { value: '180' } });
    fireEvent.change(screen.getByLabelText(/Base saturation:/), { target: { value: '80' } });
    classifyAllItems();
    fireEvent.click(screen.getByRole('button', { name: 'check (9/9 correct)' }));

    expect(onComplete).toHaveBeenCalledOnce();
    expect(screen.getByText('Token map complete. One base change updated every derived role.'))
      .toBeInTheDocument();
  });
});
