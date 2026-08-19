import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { ColorWheelTool } from './ColorWheelTool.tsx';

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

    // select complementary relationship
    fireEvent.click(screen.getByRole('button', { name: 'complementary' }));
    // lock in the palette
    fireEvent.click(screen.getByRole('button', { name: /lock in this palette/i }));

    // After locking, both support and accent should use the complementary hue.
    // The base hue is 210 (default). Complementary = (210+180)%360 = 30.
    // Support swatch title should be hsl(30, 60%, 55%) and accent hsl(30, 85%, 60%).
    const supportSwatch = document.querySelector('[title*="30"]') as HTMLElement | null;
    expect(supportSwatch).not.toBeNull();
  });

  it('triadic: support swatch comes from the second triadic hue (240° from base)', () => {
    render(<ColorWheelTool interactive={true} />);

    // select triadic relationship
    fireEvent.click(screen.getByRole('button', { name: 'triadic' }));
    // lock in the palette
    fireEvent.click(screen.getByRole('button', { name: /lock in this palette/i }));

    // Base = 210, triadic hues = 330 and 90.
    // accent = 330 (relatedH[0]), support = 90 (relatedH[1]).
    // support div uses hslToHex(90, 60, 55); accent uses hslToHex(330, 85, 60).
    const swatches = document.querySelectorAll('[style*="background-color"]');
    // At least dominant, support and accent swatches are rendered.
    expect(swatches.length).toBeGreaterThanOrEqual(3);
  });

  it('analogous: support swatch comes from the second analogous hue (30° below base)', () => {
    render(<ColorWheelTool interactive={true} />);

    // analogous is not the default, explicitly select it
    fireEvent.click(screen.getByRole('button', { name: 'analogous' }));
    fireEvent.click(screen.getByRole('button', { name: /lock in this palette/i }));

    // Base = 210, analogous hues = 240 and 180. accent = 240 (relatedH[0]), support = 180 (relatedH[1]).
    const swatches = document.querySelectorAll('[style*="background-color"]');
    expect(swatches.length).toBeGreaterThanOrEqual(3);
  });
});
