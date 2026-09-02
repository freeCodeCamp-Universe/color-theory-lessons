import { readFileSync } from 'node:fs';
import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { HSLSliderTool } from './HSLSliderTool.tsx';
import layoutStyles from './HSLSliderTool.module.css';

const styles = readFileSync('src/components/tools/HSLSliderTool.module.css', 'utf8');

afterEach(() => cleanup());

describe('HSLSliderTool previewDimension — interactive', () => {
  it('renders a hue wheel (ARIA slider) when previewDimension is h', () => {
    render(<HSLSliderTool interactive={true} previewDimension="h" />);
    expect(screen.getByRole('slider', { name: /Hue wheel/i })).toHaveStyle({ opacity: '1' });
  });

  it('renders a disabled hue wheel when previewDimension is s', () => {
    render(<HSLSliderTool interactive={true} previewDimension="s" />);
    const wheel = screen.getByRole('slider', { name: /Hue wheel/i });
    expect(wheel).toHaveAttribute('tabindex', '-1');
    expect(wheel).toHaveAttribute('aria-disabled', 'true');
    expect(wheel).toHaveStyle({ opacity: '0.4' });
  });

  it('renders a disabled hue wheel when previewDimension is l', () => {
    render(<HSLSliderTool interactive={true} previewDimension="l" />);
    const wheel = screen.getByRole('slider', { name: /Hue wheel/i });
    expect(wheel).toHaveAttribute('tabindex', '-1');
    expect(wheel).toHaveAttribute('aria-disabled', 'true');
    expect(wheel).toHaveStyle({ opacity: '0.4' });
  });

  it('uses the wheel as the only hue control', () => {
    render(<HSLSliderTool interactive={true} previewDimension="h" />);
    const satSlider = screen.getByRole('slider', { name: /^Saturation: /i });
    const lightSlider = screen.getByRole('slider', { name: /^Lightness: /i });
    expect(screen.queryByRole('slider', { name: /^Hue: /i })).toBeNull();
    expect(satSlider).toBeDisabled();
    expect(lightSlider).toBeDisabled();
  });

  it('the active saturation slider is enabled and non-active sliders are disabled', () => {
    render(<HSLSliderTool interactive={true} previewDimension="s" />);
    const satSlider = screen.getByRole('slider', { name: /^Saturation: /i });
    const lightSlider = screen.getByRole('slider', { name: /^Lightness: /i });
    expect(screen.queryByRole('slider', { name: /^Hue: /i })).toBeNull();
    expect(satSlider).not.toBeDisabled();
    expect(lightSlider).toBeDisabled();
  });

  it('does not render a horizontal hue slider in saturation and lightness previews', () => {
    const { rerender } = render(<HSLSliderTool interactive={true} previewDimension="s" />);
    expect(screen.queryByRole('slider', { name: /^Hue: /i })).toBeNull();

    rerender(<HSLSliderTool interactive={true} previewDimension="l" />);
    expect(screen.queryByRole('slider', { name: /^Hue: /i })).toBeNull();
  });

  it('changing hue via the wheel updates the HSL value display', () => {
    render(<HSLSliderTool interactive={true} previewDimension="h" />);
    const wheel = screen.getByRole('slider', { name: /Hue wheel/i });
    const initialHue = Number(wheel.getAttribute('aria-valuenow'));
    fireEvent.keyDown(wheel, { key: 'ArrowRight' });
    expect(Number(wheel.getAttribute('aria-valuenow'))).toBe(initialHue + 5);
    const newHue = (initialHue + 5) % 360;
    expect(screen.getByText(`H:${newHue} S:70% L:55%`)).toBeInTheDocument();
  });

  it('clicking the hue wheel updates the value display and swatch', () => {
    render(<HSLSliderTool interactive={true} previewDimension="h" />);
    const wheel = screen.getByRole('slider', { name: /Hue wheel/i });

    vi.spyOn(wheel, 'getBoundingClientRect').mockReturnValue({
      bottom: 200,
      height: 200,
      left: 0,
      right: 200,
      top: 0,
      width: 200,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    });

    fireEvent.click(wheel, { clientX: 185, clientY: 100 });

    expect(wheel).toHaveAttribute('aria-valuenow', '90');
    const valueDisplay = screen.getByText('H:90 S:70% L:55%');
    expect(valueDisplay.previousElementSibling).toHaveStyle({
      backgroundColor: 'hsl(90, 70%, 55%)',
    });
  });

  it('hue wraps past 359 without a visual break', () => {
    render(<HSLSliderTool interactive={true} previewDimension="h" />);
    const wheel = screen.getByRole('slider', { name: /Hue wheel/i });
    vi.spyOn(wheel, 'getBoundingClientRect').mockReturnValue({
      bottom: 200,
      height: 200,
      left: 0,
      right: 200,
      top: 0,
      width: 200,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    });
    fireEvent.click(wheel, { clientX: 95, clientY: 15 });
    fireEvent.keyDown(wheel, { key: 'ArrowRight' });
    expect(Number(wheel.getAttribute('aria-valuenow'))).toBe(2);
  });
});

describe('HSLSliderTool exercise', () => {
  it('places the current and target swatches in a shared grid row', () => {
    render(<HSLSliderTool interactive={true} />);

    expect(screen.getByText('your color').parentElement?.parentElement).toHaveClass(layoutStyles.exerciseSwatchRow);
    expect(styles).toMatch(/\.exerciseSwatchRow\s*\{[\s\S]*grid-template-areas:[\s\S]*'current-swatch target-swatch'/);
    expect(styles).toMatch(/grid-template-rows:\s*max-content 80px max-content/);
  });

  it('describes the target without exposing its hidden channel value', () => {
    render(<HSLSliderTool interactive={true} />);

    expect(screen.getByRole('img', { name: /Target color for the match the hue stage/i })).toHaveAccessibleName(
      /medium-light, saturated blue.*without reading an exact target value/i,
    );
    expect(screen.queryByText('H:200 S:70% L:55%')).not.toBeInTheDocument();
  });

  it('keeps the hue wheel and slider synchronized', () => {
    render(<HSLSliderTool interactive={true} />);
    const wheel = screen.getByRole('slider', { name: /Hue wheel/i });
    const hueSlider = screen.getByRole('slider', { name: /^Hue: /i });

    expect(screen.getByText(/hue wheel and slider/i)).toBeInTheDocument();
    expect(hueSlider).toHaveAttribute('max', '359');
    fireEvent.keyDown(wheel, { key: 'ArrowRight' });

    expect(wheel).toHaveAttribute('aria-valuenow', '5');
    expect(hueSlider).toHaveValue('5');
  });

  it('reports each target as a stable stage and completes after the final target', () => {
    const onComplete = vi.fn();
    const onStageChange = vi.fn();
    render(
      <HSLSliderTool
        interactive={true}
        onComplete={onComplete}
        onStageChange={onStageChange}
      />,
    );

    expect(onStageChange).toHaveBeenLastCalledWith(expect.objectContaining({ id: 'hue' }));
    fireEvent.change(screen.getByRole('slider', { name: /^Hue: /i }), { target: { value: '200' } });
    fireEvent.click(screen.getByRole('button', { name: 'check' }));
    expect(onComplete).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: 'next stage →' }));

    expect(onStageChange).toHaveBeenLastCalledWith(expect.objectContaining({ id: 'saturation' }));
    fireEvent.change(screen.getByRole('slider', { name: /^Saturation: /i }), { target: { value: '20' } });
    fireEvent.click(screen.getByRole('button', { name: 'check' }));
    expect(onComplete).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: 'next stage →' }));

    expect(onStageChange).toHaveBeenLastCalledWith(expect.objectContaining({ id: 'lightness' }));
    fireEvent.change(screen.getByRole('slider', { name: /^Lightness: /i }), { target: { value: '20' } });
    fireEvent.click(screen.getByRole('button', { name: 'check' }));

    expect(onComplete).toHaveBeenCalledOnce();
    expect(screen.getByRole('status')).toHaveTextContent('All three dimensions matched');
  });

  it('keeps an incorrect match in the current stage until retry', () => {
    const onComplete = vi.fn();
    render(<HSLSliderTool onComplete={onComplete} />);

    fireEvent.change(screen.getByRole('slider', { name: /^Hue: /i }), { target: { value: '100' } });
    fireEvent.click(screen.getByRole('button', { name: 'check' }));

    expect(screen.getByText('Stage 1 of 3')).toBeInTheDocument();
    expect(screen.queryByText('Match the saturation')).not.toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('No match yet.');
    expect(screen.getByText('No match yet. Try this stage again.')).toHaveStyle({
      color: 'var(--accent-danger)',
    });
    expect(onComplete).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: 'try stage again' }));

    expect(screen.getByRole('slider', { name: /^Hue: /i })).toBeEnabled();
    expect(screen.getByRole('slider', { name: /^Hue: /i })).toHaveValue('100');
    expect(screen.getByText('Stage 1 of 3')).toBeInTheDocument();
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
    expect(wheel).toHaveAttribute('aria-disabled', 'true');
  });
});
