import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { HSLSliderTool } from './HSLSliderTool.tsx';

afterEach(() => cleanup());

describe('HSLSliderTool previewDimension — interactive', () => {
  it('renders a hue wheel (ARIA slider) when previewDimension is h', () => {
    render(<HSLSliderTool interactive={true} previewDimension="h" />);
    expect(screen.getByRole('slider', { name: /Hue wheel/i })).toBeInTheDocument();
  });

  it('does not render a hue wheel when previewDimension is s', () => {
    render(<HSLSliderTool interactive={true} previewDimension="s" />);
    expect(screen.queryByRole('slider', { name: /Hue wheel/i })).toBeNull();
  });

  it('does not render a hue wheel when previewDimension is l', () => {
    render(<HSLSliderTool interactive={true} previewDimension="l" />);
    expect(screen.queryByRole('slider', { name: /Hue wheel/i })).toBeNull();
  });

  it('the active hue slider is enabled and non-active sliders are disabled', () => {
    render(<HSLSliderTool interactive={true} previewDimension="h" />);
    const hueSlider = screen.getByRole('slider', { name: /^Hue: /i });
    const satSlider = screen.getByRole('slider', { name: /^Saturation: /i });
    const lightSlider = screen.getByRole('slider', { name: /^Lightness: /i });
    expect(hueSlider).not.toBeDisabled();
    expect(satSlider).toBeDisabled();
    expect(lightSlider).toBeDisabled();
  });

  it('the active saturation slider is enabled and non-active sliders are disabled', () => {
    render(<HSLSliderTool interactive={true} previewDimension="s" />);
    const hueSlider = screen.getByRole('slider', { name: /^Hue: /i });
    const satSlider = screen.getByRole('slider', { name: /^Saturation: /i });
    const lightSlider = screen.getByRole('slider', { name: /^Lightness: /i });
    expect(hueSlider).toBeDisabled();
    expect(satSlider).not.toBeDisabled();
    expect(lightSlider).toBeDisabled();
  });

  it('changing the hue slider updates the HSL value display', () => {
    render(<HSLSliderTool interactive={true} previewDimension="h" />);
    const hueSlider = screen.getByRole('slider', { name: /^Hue: /i });
    fireEvent.change(hueSlider, { target: { value: '45' } });
    expect(screen.getByText(/H:45/)).toBeInTheDocument();
  });

  it('changing hue via wheel updates the hue slider value', () => {
    render(<HSLSliderTool interactive={true} previewDimension="h" />);
    const wheel = screen.getByRole('slider', { name: /Hue wheel/i });
    const initialHue = Number(wheel.getAttribute('aria-valuenow'));
    fireEvent.keyDown(wheel, { key: 'ArrowRight' });
    expect(Number(wheel.getAttribute('aria-valuenow'))).toBe(initialHue + 5);
  });

  it('hue wheel and slider stay in sync after a wheel keyboard interaction', () => {
    render(<HSLSliderTool interactive={true} previewDimension="h" />);
    const wheel = screen.getByRole('slider', { name: /Hue wheel/i });
    fireEvent.keyDown(wheel, { key: 'ArrowRight' });
    const newHue = Number(wheel.getAttribute('aria-valuenow'));
    const hueSlider = screen.getByRole('slider', { name: /^Hue: /i });
    expect(Number(hueSlider.getAttribute('value'))).toBe(newHue);
  });

  it('hue wraps past 359 without a visual break', () => {
    render(<HSLSliderTool interactive={true} previewDimension="h" />);
    const wheel = screen.getByRole('slider', { name: /Hue wheel/i });
    const hueSlider = screen.getByRole('slider', { name: /^Hue: /i });
    fireEvent.change(hueSlider, { target: { value: '358' } });
    fireEvent.keyDown(wheel, { key: 'ArrowRight' });
    fireEvent.keyDown(wheel, { key: 'ArrowRight' });
    expect(Number(wheel.getAttribute('aria-valuenow'))).toBe(8);
  });
});

describe('HueWheel accessibility', () => {
  it('wheel is focusable in interactive mode', () => {
    render(<HSLSliderTool interactive={true} previewDimension="h" />);
    const wheel = screen.getByRole('slider', { name: /Hue wheel/i });
    expect(wheel).toHaveAttribute('tabindex', '0');
  });

  it('wheel is not focusable when interactive is false', () => {
    render(<HSLSliderTool interactive={false} previewDimension="h" />);
    const wheel = screen.getByRole('slider', { name: /Hue wheel/i });
    expect(wheel).toHaveAttribute('tabindex', '-1');
  });
});
