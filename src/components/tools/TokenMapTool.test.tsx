import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { TokenMapTool } from './TokenMapTool.tsx';

const CATEGORY_ANSWERS = {
  '#0B57D0': 'raw',
  'rgb(34 34 34)': 'raw',
  '--blue-600': 'palette',
  '--gray-900': 'palette',
  '--color-text-primary': 'role',
  '--color-success-bg': 'role',
  '--color-action-primary': 'role',
  '#1a1a1a': 'raw',
  '--green-500': 'palette',
} as const;

afterEach(cleanup);

function classifyAllItems() {
  for (const [label, category] of Object.entries(CATEGORY_ANSWERS)) {
    fireEvent.change(
      screen.getByRole('combobox', { name: `Category for ${label}` }),
      { target: { value: category } },
    );
  }
}

function passTokenSystemStage() {
  fireEvent.change(screen.getByLabelText(/Base hue:/), { target: { value: '180' } });
  fireEvent.change(screen.getByLabelText(/Base saturation:/), { target: { value: '80' } });
  fireEvent.click(screen.getByRole('button', { name: 'check token system' }));
  fireEvent.click(screen.getByRole('button', { name: 'classify token names' }));
}

describe('TokenMapTool', () => {
  it('distinguishes raw values, palette token names, and role token names', () => {
    render(<TokenMapTool interactive />);

    passTokenSystemStage();

    expect(
      screen.getByText(
        'Classify each item as a raw value, palette token name, or role token name:',
      ),
    ).toBeInTheDocument();
    expect(document.body).not.toHaveTextContent('alias token');
    expect(document.body).not.toHaveTextContent('—');

    classifyAllItems();

    expect(screen.getByRole('button', { name: 'check (9/9 correct)' })).toBeInTheDocument();
  });

  it('completes after the learner sets a valid base and classifies every item', () => {
    const onComplete = vi.fn();
    render(<TokenMapTool interactive onComplete={onComplete} />);

    expect(screen.getByText('Stage 1 of 2')).toBeInTheDocument();
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'check token system' }));
    expect(screen.getByRole('button', { name: 'try stage again' })).toBeInTheDocument();
    expect(onComplete).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: 'try stage again' }));

    passTokenSystemStage();
    expect(screen.getByText('Stage 2 of 2')).toBeInTheDocument();
    expect(onComplete).not.toHaveBeenCalled();

    fireEvent.change(
      screen.getByRole('combobox', { name: 'Category for #0B57D0' }),
      { target: { value: 'palette' } },
    );
    fireEvent.click(screen.getByRole('button', { name: 'check (0/9 correct)' }));
    expect(screen.getByText('0 of 9 classifications are correct. Try this stage again.')).toBeInTheDocument();
    expect(onComplete).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: 'try stage again' }));

    classifyAllItems();
    fireEvent.click(screen.getByRole('button', { name: 'check (9/9 correct)' }));

    expect(onComplete).toHaveBeenCalledOnce();
    expect(
      screen.getByText('Token map complete. Both stages passed.'),
    ).toBeInTheDocument();
  });
});
