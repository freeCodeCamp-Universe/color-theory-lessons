import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { ThemeSandboxTool } from './ThemeSandboxTool.tsx';

afterEach(cleanup);

function setColor(name: string, value: string) {
  fireEvent.change(screen.getByLabelText(name), { target: { value } });
}

describe('ThemeSandboxTool contrast requirements', () => {
  it('rejects secondary text below 4.5:1 and displays the target', () => {
    render(<ThemeSandboxTool interactive />);

    setColor('Secondary text', '#999999');

    expect(screen.getByText(/Secondary text on surface: 3\.2:1 \(target: 4\.5:1\)/))
      .toHaveTextContent('✗');
    expect(screen.getByRole('button', { name: 'fix contrast to submit' })).toBeDisabled();
  });

  it('accepts secondary text at or above 4.5:1', () => {
    const onComplete = vi.fn();
    render(<ThemeSandboxTool interactive onComplete={onComplete} />);

    setColor('Secondary text', '#ffffff');

    expect(screen.getByText(/Secondary text on surface: 5\.2:1 \(target: 4\.5:1\)/))
      .toHaveTextContent('✓');
    fireEvent.click(screen.getByRole('button', { name: 'submit theme' }));
    expect(onComplete).toHaveBeenCalledOnce();
  });

  it('keeps submission disabled until all three text pairs pass', () => {
    render(<ThemeSandboxTool interactive />);

    setColor('Background', '#777777');
    setColor('Surface', '#000000');
    setColor('Primary text', '#ffffff');
    setColor('Secondary text', '#ffffff');
    expect(screen.getByRole('button', { name: 'fix contrast to submit' })).toBeDisabled();

    setColor('Background', '#000000');
    setColor('Surface', '#777777');
    setColor('Secondary text', '#000000');
    expect(screen.getByRole('button', { name: 'fix contrast to submit' })).toBeDisabled();

    setColor('Surface', '#000000');
    setColor('Secondary text', '#ffffff');
    expect(screen.getByRole('button', { name: 'submit theme' })).toBeEnabled();
  });
});
