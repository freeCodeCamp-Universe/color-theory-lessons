import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { lesson3_6 } from '../../lessons/unit-3/lesson-3-6.ts';
import { AppProvider } from '../../state/app-provider.tsx';
import { LessonPlayer } from './LessonPlayer.tsx';

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
});

afterEach(cleanup);

const ANSWERS = {
  '#0B57D0': 'raw',
  'rgb(34, 34, 34)': 'raw',
  '--blue-600': 'palette',
  '--gray-900': 'palette',
  '--color-text-primary': 'role',
  '--color-success-bg': 'role',
  '--color-action-primary': 'role',
  '#1a1a1a': 'raw',
  '--green-500': 'palette',
};

describe('Lesson 3.6 Token Map flow', () => {
  it('unlocks the quiz after the rendered challenge is completed', async () => {
    render(
      <MemoryRouter>
        <AppProvider>
          <LessonPlayer lesson={lesson3_6} />
        </AppProvider>
      </MemoryRouter>,
    );

    for (let step = 1; step < lesson3_6.steps.length; step += 1) {
      fireEvent.click(screen.getByRole('button', { name: 'next' }));
    }

    const baseHue = await screen.findByLabelText(/Base hue:/);
    fireEvent.change(baseHue, { target: { value: '180' } });
    fireEvent.change(screen.getByLabelText(/Base saturation:/), { target: { value: '80' } });

    for (const [label, category] of Object.entries(ANSWERS)) {
      fireEvent.change(screen.getByLabelText(`Category for ${label}`), {
        target: { value: category },
      });
    }

    fireEvent.click(screen.getByRole('button', { name: 'check (9/9 correct)' }));

    expect(screen.getByRole('button', { name: 'take the quiz →' })).toBeInTheDocument();
  });
});
