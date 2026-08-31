import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ColorOnlyDetectorTool } from './ColorOnlyDetectorTool.tsx';

afterEach(() => cleanup());

function getExampleCard(name: string) {
  const card = screen.getByText(name).parentElement;
  if (!card) throw new Error(`Could not find the ${name} example`);
  return card;
}

async function selectExample(name: string, user: ReturnType<typeof userEvent.setup>) {
  await user.click(within(getExampleCard(name)).getByRole('button', { name: `Select ${name} example` }));
}

describe('ColorOnlyDetectorTool', () => {
  it('renders the six examples in one evaluative stage', () => {
    render(<ColorOnlyDetectorTool interactive />);

    expect(screen.getByText('Stage 1 of 1')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Sample input')).toBeInTheDocument();
    expect(screen.getByText('Series A')).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /Select .* example/ })).toHaveLength(6);
    expect(screen.getByRole('link', { name: 'privacy policy' })).toBeInTheDocument();
    expect(screen.getByText(/Three unlabeled circular dots/)).toBeInTheDocument();
    expect(screen.queryByText(/This link also has an underline/)).not.toBeInTheDocument();
  });

  it('keeps an incorrect submission in the stage and completes after a corrected retry', async () => {
    const user = userEvent.setup();
    const onComplete = vi.fn();
    render(<ColorOnlyDetectorTool interactive onComplete={onComplete} />);

    await selectExample('Status dots', user);
    await selectExample('Form validation', user);
    await selectExample('Link text', user);
    expect(onComplete).not.toHaveBeenCalled();

    await user.click(screen.getByRole('button', { name: 'check selections' }));

    expect(screen.getByText('Stage 1 of 1')).toBeInTheDocument();
    expect(screen.getByText(/This link also has an underline/)).toBeInTheDocument();
    expect(onComplete).not.toHaveBeenCalled();

    await user.click(screen.getByRole('button', { name: 'try stage again' }));
    await user.click(within(getExampleCard('Link text')).getByRole('button', { name: 'Deselect Link text example' }));
    await selectExample('Chart series', user);
    await user.click(screen.getByRole('button', { name: 'check selections' }));

    expect(screen.getByText(/You found all three examples that rely on hue alone/)).toBeInTheDocument();
    expect(onComplete).toHaveBeenCalledTimes(1);
  });
});
