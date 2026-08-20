import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { ColorWheelTool } from './ColorWheelTool.tsx';
import { hslToHex } from '../../utils/color.ts';

beforeEach(() => localStorage.clear());
afterEach(() => cleanup());

describe('ColorWheelTool keyboard accessibility', () => {
  it('SVG wheel is focusable (tabIndex 0) in interactive mode', () => {
    render(<ColorWheelTool interactive={true} />);
    const svg = screen.getByRole('slider', { name: /Color wheel hue selector/i });
    expect(svg).toHaveAttribute('tabindex', '0');
  });

  it('SVG wheel is not focusable (tabIndex -1) in non-interactive mode', () => {
    render(<ColorWheelTool interactive={false} />);
    const svg = screen.getByRole('slider', { name: /Color wheel hue selector/i });
    expect(svg).toHaveAttribute('tabindex', '-1');
  });

  it('ArrowRight increases the hue by 5 degrees', () => {
    render(<ColorWheelTool interactive={true} />);
    const svg = screen.getByRole('slider', { name: /Color wheel hue selector/i });
    const initialHue = Number(svg.getAttribute('aria-valuenow'));

    fireEvent.keyDown(svg, { key: 'ArrowRight' });

    expect(Number(svg.getAttribute('aria-valuenow'))).toBe(initialHue + 5);
  });

  it('ArrowLeft decreases the hue by 5 degrees', () => {
    render(<ColorWheelTool interactive={true} />);
    const svg = screen.getByRole('slider', { name: /Color wheel hue selector/i });
    const initialHue = Number(svg.getAttribute('aria-valuenow'));

    fireEvent.keyDown(svg, { key: 'ArrowLeft' });

    expect(Number(svg.getAttribute('aria-valuenow'))).toBe(initialHue - 5);
  });

  it('hue wraps at 360 degrees', () => {
    render(<ColorWheelTool interactive={true} />);
    const svg = screen.getByRole('slider', { name: /Color wheel hue selector/i });

    // Set hue to 358 via range input, then arrow right twice to cross 360
    const rangeInput = screen.getByRole('slider', { name: /Base hue/i });
    fireEvent.change(rangeInput, { target: { value: '358' } });
    fireEvent.keyDown(svg, { key: 'ArrowRight' });
    fireEvent.keyDown(svg, { key: 'ArrowRight' });

    expect(Number(svg.getAttribute('aria-valuenow'))).toBe(8);
  });

  it('arrow keys have no effect in non-interactive mode', () => {
    render(<ColorWheelTool interactive={false} />);
    const svg = screen.getByRole('slider', { name: /Color wheel hue selector/i });
    const initialHue = Number(svg.getAttribute('aria-valuenow'));

    fireEvent.keyDown(svg, { key: 'ArrowRight' });

    expect(Number(svg.getAttribute('aria-valuenow'))).toBe(initialHue);
  });
});

describe('ColorWheelTool preview mode', () => {
  it('renders without the palette build section when previewRelationship is set', () => {
    render(<ColorWheelTool interactive={false} previewRelationship="complementary" />);
    expect(screen.queryByRole('button', { name: /lock palette/i })).toBeNull();
    expect(screen.queryByRole('button', { name: /build palette/i })).toBeNull();
  });
});

describe('ColorWheelTool buildPalette role assignment', () => {
  it('complementary: support swatch comes from the complementary hue (180° from base)', () => {
    render(<ColorWheelTool interactive={true} />);

    fireEvent.click(screen.getByRole('button', { name: 'complementary' }));
    fireEvent.click(screen.getByRole('button', { name: /lock in this palette/i }));

    const supportSwatch = screen.getByText('support').parentElement!;
    const accentSwatch = screen.getByText('accent').parentElement!;
    expect(supportSwatch).toHaveStyle({ backgroundColor: hslToHex(30, 60, 55) });
    expect(accentSwatch).toHaveStyle({ backgroundColor: hslToHex(30, 85, 60) });
  });

  it('triadic: support swatch comes from the second triadic hue (240° from base)', () => {
    render(<ColorWheelTool interactive={true} />);

    fireEvent.click(screen.getByRole('button', { name: 'triadic' }));
    fireEvent.click(screen.getByRole('button', { name: /lock in this palette/i }));

    const supportSwatch = screen.getByText('support').parentElement!;
    const accentSwatch = screen.getByText('accent').parentElement!;
    expect(supportSwatch).toHaveStyle({ backgroundColor: hslToHex(90, 60, 55) });
    expect(accentSwatch).toHaveStyle({ backgroundColor: hslToHex(330, 85, 60) });
  });

  it('analogous: support swatch comes from the second analogous hue (30° below base)', () => {
    render(<ColorWheelTool interactive={true} />);

    fireEvent.click(screen.getByRole('button', { name: 'analogous' }));
    fireEvent.click(screen.getByRole('button', { name: /lock in this palette/i }));

    const supportSwatch = screen.getByText('support').parentElement!;
    const accentSwatch = screen.getByText('accent').parentElement!;
    expect(supportSwatch).toHaveStyle({ backgroundColor: hslToHex(180, 60, 55) });
    expect(accentSwatch).toHaveStyle({ backgroundColor: hslToHex(240, 85, 60) });
  });
});

describe('ColorWheelTool locked palette behavior', () => {
  it('keeps the locked relationship and reflection synchronized by disabling further control changes', () => {
    render(<ColorWheelTool interactive={true} />);

    const wheel = screen.getByRole('slider', { name: /Color wheel hue selector/i });
    const baseHueInput = screen.getByRole('slider', { name: /Base hue/i });

    fireEvent.change(baseHueInput, { target: { value: '45' } });
    fireEvent.click(screen.getByRole('button', { name: 'analogous' }));
    fireEvent.click(screen.getByRole('button', { name: /lock in this palette/i }));

    expect(baseHueInput).toBeDisabled();
    expect(wheel).toHaveAttribute('tabindex', '-1');
    expect(wheel).toHaveAttribute('aria-disabled', 'true');
    expect(screen.getByRole('button', { name: 'analogous' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'complementary' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'triadic' })).toBeDisabled();
    expect(screen.getByText(/Selected relationship:/i)).toHaveTextContent('Selected relationship: analogous.');
    expect(screen.getByText('Where are analogous hues positioned relative to the base hue?')).toBeInTheDocument();

    fireEvent.change(baseHueInput, { target: { value: '90' } });
    fireEvent.keyDown(wheel, { key: 'ArrowRight' });
    fireEvent.click(screen.getByRole('button', { name: 'triadic' }));

    expect(baseHueInput).toHaveValue('45');
    expect(screen.getByText(/Selected relationship:/i)).toHaveTextContent('Selected relationship: analogous.');
    expect(screen.getByText('Where are analogous hues positioned relative to the base hue?')).toBeInTheDocument();
  });
});
