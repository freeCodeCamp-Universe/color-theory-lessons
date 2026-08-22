import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { HslPlaygroundTool } from './HslPlaygroundTool.tsx';

afterEach(() => cleanup());

describe('HslPlaygroundTool hue controls', () => {
  it('shows HSL and RGB values with modern space-separated syntax', () => {
    render(<HslPlaygroundTool interactive={true} />);

    expect(screen.getByText('hsl(200 50% 50%)')).toBeInTheDocument();
    expect(screen.getByText('rgb(64 149 191)')).toBeInTheDocument();
  });

  it('keeps the hue wheel and slider synchronized across the range boundary', () => {
    render(<HslPlaygroundTool interactive={true} />);
    const wheel = screen.getByRole('slider', { name: /Hue wheel/i });
    const hueSlider = screen.getByRole('slider', { name: /^Hue: /i });

    expect(hueSlider).toHaveAttribute('max', '359');
    fireEvent.change(hueSlider, { target: { value: '359' } });
    expect(wheel).toHaveAttribute('aria-valuenow', '359');

    fireEvent.keyDown(wheel, { key: 'ArrowRight' });
    expect(wheel).toHaveAttribute('aria-valuenow', '4');
    expect(hueSlider).toHaveValue('4');
  });
});
