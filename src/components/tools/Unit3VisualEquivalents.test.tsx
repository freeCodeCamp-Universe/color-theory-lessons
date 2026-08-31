import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { AlphaLayerTool } from './AlphaLayerTool.tsx';
import { FormatRevealTool } from './FormatRevealTool.tsx';
import { HexRgbEditorTool } from './HexRgbEditorTool.tsx';
import { HslPlaygroundTool } from './HslPlaygroundTool.tsx';
import { ThemeSandboxTool } from './ThemeSandboxTool.tsx';
import { TokenMapTool } from './TokenMapTool.tsx';

afterEach(cleanup);

describe('Unit 3 visual equivalents', () => {
  it('describes a selected FormatReveal region and its formats', () => {
    render(<FormatRevealTool />);
    fireEvent.click(screen.getByRole('button', { name: 'Nav background' }));
    expect(screen.getAllByText(/Nav background selected.*HEX #1E3A5F/i)).not.toHaveLength(0);
  });

  it('exposes current HEX and RGB values, invalid input, and target evidence', () => {
    render(<HexRgbEditorTool interactive />);
    expect(screen.getByText(/Target appearance: A saturated medium blue target/)).toBeInTheDocument();
    fireEvent.change(screen.getByRole('textbox', { name: 'HEX color input' }), { target: { value: '#12' } });
    expect(screen.getAllByRole('alert').some((alert) => alert.textContent === 'invalid HEX')).toBe(true);
  });

  it('describes the current HSL, HEX, RGB, and assessment-safe target evidence', () => {
    render(<HslPlaygroundTool interactive />);
    expect(screen.getByText(/Current color: HSL 200 degrees.*RGB 64, 149, 191/)).toBeInTheDocument();
    expect(screen.getByText(/Its exact HSL values are not disclosed before checking/)).toBeInTheDocument();
  });

  it('describes alpha composition and its blended result', () => {
    render(<AlphaLayerTool interactive />);
    expect(screen.getByText(/Modal scrim.*Background: Light page, #e8e8e8.*Blended result: rgb\(116 116 116\)/)).toBeInTheDocument();
  });

  it('describes theme roles, gradient endpoints, and contrast results', () => {
    render(<ThemeSandboxTool interactive />);
    expect(screen.getByText(/Theme preview.*Background #1a1a2e.*Gradient starts at #4f46e5 and ends at #7c3aed/)).toBeInTheDocument();
    expect(screen.getByText(/Primary text on background:/).parentElement).toHaveAttribute('aria-live', 'polite');
  });

  it('describes derived token roles and the interface preview', () => {
    render(<TokenMapTool interactive />);
    expect(screen.getAllByText(/Base hue 220 degrees.*--color-action-primary #/)).not.toHaveLength(0);
  });
});
