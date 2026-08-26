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
  it('shows WCAG ratios for all five text pairs', () => {
    const black = hexToRgb(BLACK);
    const darkGray = hexToRgb(DARK_GRAY);

    expect(contrastRatio(black, darkGray)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatioWcag(black, darkGray)).toBeLessThan(4.5);

    render(<ThemeSandboxTool interactive />);
    setRegressionColors();

    expect(screen.getByText(/Primary text on background:/)).not.toHaveTextContent('✗');
    fireEvent.click(screen.getByRole('button', { name: 'check theme' }));
    expect(screen.getByText('✗ Primary text on background: 1.5:1 (target: 4.5:1)')).toBeInTheDocument();
    expect(screen.getByText('✗ Primary text on surface: 1.5:1 (target: 4.5:1)')).toBeInTheDocument();
    expect(screen.getByText('✗ Secondary text on surface: 1.5:1 (target: 4.5:1)')).toBeInTheDocument();
    expect(screen.getByText(/Hero text on gradient start:/)).toHaveTextContent('✓');
    expect(screen.getByText(/Hero text on gradient end:/)).toHaveTextContent('✓');
  });

  it('keeps the same stage available for retry when the WCAG ratios fail', () => {
    const onComplete = vi.fn();
    render(<ThemeSandboxTool interactive onComplete={onComplete} />);
    setRegressionColors();

    fireEvent.click(screen.getByRole('button', { name: 'check theme' }));
    expect(onComplete).not.toHaveBeenCalled();
    expect(screen.getByText('Stage 1 of 1')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'try stage again' })).toBeInTheDocument();
  });

  it('rejects secondary text below 4.5:1 and displays the target', () => {
    render(<ThemeSandboxTool interactive />);

    setColor('Secondary text', '#777777');

    fireEvent.click(screen.getByRole('button', { name: 'check theme' }));
    expect(screen.getByText(/Secondary text on surface: 3\.2:1 \(target: 4\.5:1\)/))
      .toHaveTextContent('✗');
    expect(screen.getByRole('button', { name: 'try stage again' })).toBeInTheDocument();
  });

  it('accepts secondary text at or above 4.5:1', () => {
    const onComplete = vi.fn();
    render(<ThemeSandboxTool interactive onComplete={onComplete} />);

    setColor('Secondary text', '#999999');

    fireEvent.click(screen.getByRole('button', { name: 'check theme' }));
    expect(screen.getByText(/Secondary text on surface: 5\.1:1 \(target: 4\.5:1\)/))
      .toHaveTextContent('✓');
    expect(onComplete).toHaveBeenCalledOnce();
    expect(screen.getByText('Theme complete. All five checked text pairs meet 4.5:1.')).toBeInTheDocument();
  });

  it('rejects a gradient endpoint below 4.5:1', () => {
    const onComplete = vi.fn();
    render(<ThemeSandboxTool interactive onComplete={onComplete} />);

    setColor('Secondary text', '#999999');
    setColor('Gradient start', '#777777');

    fireEvent.click(screen.getByRole('button', { name: 'check theme' }));
    expect(screen.getByText('✗ Hero text on gradient start: 4.4:1 (target: 4.5:1)'))
      .toBeInTheDocument();

    expect(onComplete).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: 'try stage again' })).toBeInTheDocument();
  });

  it('requires all five text pairs to pass the stage', () => {
    render(<ThemeSandboxTool interactive />);

    setColor('Background', '#777777');
    setColor('Surface', '#000000');
    setColor('Primary text', '#ffffff');
    setColor('Secondary text', '#ffffff');
    fireEvent.click(screen.getByRole('button', { name: 'check theme' }));
    expect(screen.getByRole('button', { name: 'try stage again' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'try stage again' }));

    setColor('Background', '#000000');
    setColor('Surface', '#777777');
    setColor('Secondary text', '#000000');
    fireEvent.click(screen.getByRole('button', { name: 'check theme' }));
    expect(screen.getByRole('button', { name: 'try stage again' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'try stage again' }));

    setColor('Surface', '#000000');
    setColor('Secondary text', '#ffffff');
    expect(screen.getByRole('button', { name: 'check theme' })).toBeEnabled();
  });
});
