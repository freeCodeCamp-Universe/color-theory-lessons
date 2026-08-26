import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { HslPlaygroundTool } from './HslPlaygroundTool.tsx';

afterEach(() => cleanup());

describe('HslPlaygroundTool hue controls', () => {
  it('shows HSL and RGB values with modern space-separated syntax', () => {
    render(<HslPlaygroundTool interactive={true} />);

    expect(screen.getByText('hsl(200 50% 50%)')).toBeInTheDocument();
    expect(screen.getByText('rgb(64 149 191)')).toBeInTheDocument();
  });

  it('keeps assessment stages out of the instructional preview', () => {
    render(<HslPlaygroundTool interactive={false} />);

    expect(screen.getByText('hsl(200 50% 50%)')).toBeInTheDocument();
    expect(screen.queryByText('Stage 1 of 3')).not.toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Match muted teal surface' }))
      .not.toBeInTheDocument();
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

  it('shows one target stage at a time and completes after the final pass', () => {
    const onComplete = vi.fn();
    render(<HslPlaygroundTool interactive onComplete={onComplete} />);

    expect(screen.getByText('Stage 1 of 3')).toBeInTheDocument();
    expect(screen.queryByText('Vivid coral accent')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'check match' }));
    expect(screen.getByText(/outside the target range/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'try stage again' }));

    for (const [h, s, l, nextTitle] of [
      [180, 25, 70, 'Match vivid coral accent'],
      [12, 85, 55, 'Match dark desaturated navy'],
    ] as const) {
      fireEvent.change(screen.getByRole('slider', { name: /^Hue:/ }), { target: { value: h } });
      fireEvent.change(screen.getByRole('slider', { name: /^Saturation:/ }), { target: { value: s } });
      fireEvent.change(screen.getByRole('slider', { name: /^Lightness:/ }), { target: { value: l } });
      fireEvent.click(screen.getByRole('button', { name: 'check match' }));
      expect(onComplete).not.toHaveBeenCalled();
      fireEvent.click(screen.getByRole('button', { name: 'next target' }));
      expect(screen.getByRole('heading', { name: nextTitle })).toBeInTheDocument();
    }

    fireEvent.change(screen.getByRole('slider', { name: /^Hue:/ }), { target: { value: 225 } });
    fireEvent.change(screen.getByRole('slider', { name: /^Saturation:/ }), { target: { value: 30 } });
    fireEvent.change(screen.getByRole('slider', { name: /^Lightness:/ }), { target: { value: 22 } });
    fireEvent.click(screen.getByRole('button', { name: 'check match' }));

    expect(onComplete).toHaveBeenCalledOnce();
    expect(screen.getByText('All three HSL targets matched.')).toBeInTheDocument();
  });
});
