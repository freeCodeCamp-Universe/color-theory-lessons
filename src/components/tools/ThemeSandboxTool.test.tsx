import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { contrastRatio, contrastRatioWcag, hexToRgb } from '../../utils/color.ts';
import { ThemeSandboxTool } from './ThemeSandboxTool.tsx';

afterEach(() => cleanup());

const BLACK = '#000000';
const DARK_GRAY = '#2d2d2d';

function setRegressionColors() {
  fireEvent.change(screen.getByLabelText('Background'), {
    target: { value: DARK_GRAY },
  });
  fireEvent.change(screen.getByLabelText('Surface'), {
    target: { value: DARK_GRAY },
  });
  fireEvent.change(screen.getByLabelText('Primary text'), {
    target: { value: BLACK },
  });
  fireEvent.change(screen.getByLabelText('Secondary text'), {
    target: { value: BLACK },
  });
}

describe('ThemeSandboxTool WCAG contrast', () => {
  it('shows WCAG ratios for all three text pairs', () => {
    const black = hexToRgb(BLACK);
    const darkGray = hexToRgb(DARK_GRAY);

    expect(contrastRatio(black, darkGray)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatioWcag(black, darkGray)).toBeLessThan(4.5);

    render(<ThemeSandboxTool interactive={true} />);
    setRegressionColors();

    expect(screen.getByText('✗ Primary text on bg: 1.5:1')).toBeInTheDocument();
    expect(screen.getByText('✗ Primary text on surface: 1.5:1')).toBeInTheDocument();
    expect(screen.getByText('✗ Secondary text on surface: 1.5:1')).toBeInTheDocument();
  });

  it('keeps submission disabled when only the simplified ratios pass', () => {
    const onComplete = vi.fn();
    render(<ThemeSandboxTool interactive={true} onComplete={onComplete} />);
    setRegressionColors();

    const submitButton = screen.getByRole('button', {
      name: 'fix contrast to submit',
    });
    expect(submitButton).toBeDisabled();

    fireEvent.click(submitButton);
    expect(onComplete).not.toHaveBeenCalled();
  });
});
