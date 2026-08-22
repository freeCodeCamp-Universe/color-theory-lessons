import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { contrastRatio, contrastRatioWcag, hexToRgb } from '../../utils/color.ts';
import { ThemeSandboxTool } from './ThemeSandboxTool.tsx';

afterEach(cleanup);

const BLACK = '#000000';
const DARK_GRAY = '#2d2d2d';

function setColor(name: string, value: string) {
  fireEvent.change(screen.getByLabelText(name), { target: { value } });
}

function setRegressionColors() {
  setColor('Background', DARK_GRAY);
  setColor('Surface', DARK_GRAY);
  setColor('Primary text', BLACK);
  setColor('Secondary text', BLACK);
}

describe('ThemeSandboxTool contrast requirements', () => {
  it('shows WCAG ratios for all three text pairs', () => {
    const black = hexToRgb(BLACK);
    const darkGray = hexToRgb(DARK_GRAY);

    expect(contrastRatio(black, darkGray)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatioWcag(black, darkGray)).toBeLessThan(4.5);

    render(<ThemeSandboxTool interactive />);
    setRegressionColors();

    expect(screen.getByText('✗ Primary text on background: 1.5:1 (target: 4.5:1)')).toBeInTheDocument();
    expect(screen.getByText('✗ Primary text on surface: 1.5:1 (target: 4.5:1)')).toBeInTheDocument();
    expect(screen.getByText('✗ Secondary text on surface: 1.5:1 (target: 4.5:1)')).toBeInTheDocument();
  });

  it('keeps submission disabled when only the simplified ratios pass', () => {
    const onComplete = vi.fn();
    render(<ThemeSandboxTool interactive onComplete={onComplete} />);
    setRegressionColors();

    const submitButton = screen.getByRole('button', {
      name: 'meet contrast targets to submit',
    });
    expect(submitButton).toBeDisabled();

    fireEvent.click(submitButton);
    expect(onComplete).not.toHaveBeenCalled();
  });

  it('rejects secondary text below 4.5:1 and displays the target', () => {
    render(<ThemeSandboxTool interactive />);

    setColor('Secondary text', '#777777');

    expect(screen.getByText(/Secondary text on surface: 3\.3:1 \(target: 4\.5:1\)/))
      .toHaveTextContent('✗');
    expect(screen.getByRole('button', { name: 'meet contrast targets to submit' })).toBeDisabled();
  });

  it('accepts secondary text at or above 4.5:1', () => {
    const onComplete = vi.fn();
    render(<ThemeSandboxTool interactive onComplete={onComplete} />);

    setColor('Secondary text', '#999999');

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
    expect(screen.getByRole('button', { name: 'meet contrast targets to submit' })).toBeDisabled();

    setColor('Background', '#000000');
    setColor('Surface', '#777777');
    setColor('Secondary text', '#000000');
    expect(screen.getByRole('button', { name: 'meet contrast targets to submit' })).toBeDisabled();

    setColor('Surface', '#000000');
    setColor('Secondary text', '#ffffff');
    expect(screen.getByRole('button', { name: 'submit theme' })).toBeEnabled();
  });
});
