import { cleanup, createEvent, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { BeforeAfterTool } from './BeforeAfterTool.tsx';

afterEach(() => cleanup());

const HIERARCHY_LABELS = ['Submit', 'Save Draft', 'Cancel'] as const;

describe('BeforeAfterTool hierarchy exercise', () => {
  it('renders preview actions as noninteractive content and keeps labeled selectors', () => {
    render(<BeforeAfterTool variant="hierarchy" />);

    for (const label of HIERARCHY_LABELS) {
      expect(screen.queryByRole('button', { name: label })).not.toBeInTheDocument();
      expect(screen.getByRole('combobox', { name: label })).toBeInTheDocument();
    }
  });

  it('allows correction after an incorrect check', () => {
    const onComplete = vi.fn();
    render(<BeforeAfterTool variant="hierarchy" onComplete={onComplete} />);

    fireEvent.click(screen.getByRole('button', { name: 'check hierarchy' }));

    expect(screen.getByText('✗ Submit should be primary, Save Draft secondary, and Cancel tertiary.')).toBeInTheDocument();
    for (const label of HIERARCHY_LABELS) {
      expect(screen.getByRole('combobox', { name: label })).toBeDisabled();
    }
    expect(onComplete).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: 'try again' }));

    const roleSelectors = HIERARCHY_LABELS.map((label) => screen.getByRole('combobox', { name: label }));
    for (const selector of roleSelectors) {
      expect(selector).toBeEnabled();
    }

    fireEvent.change(roleSelectors[0], { target: { value: 'primary' } });
    fireEvent.change(roleSelectors[2], { target: { value: 'tertiary' } });
    fireEvent.click(screen.getByRole('button', { name: 'check hierarchy' }));

    expect(screen.getByText('✓ Submit stands out as the primary action. Well done.')).toBeInTheDocument();
    expect(onComplete).toHaveBeenCalledOnce();
  });
});

describe('BeforeAfterTool color-role keyboard activation', () => {
  it('keeps all color-role regions keyboard focusable', () => {
    render(<BeforeAfterTool />);

    const regions = screen.getAllByRole('button', {
      name: /Click to identify what the (nav bar|gold button|green text|blue card border) color is doing/i,
    });

    expect(regions).toHaveLength(4);
    for (const region of regions) {
      expect(region).toHaveAttribute('tabindex', '0');
    }
  });

  it('opens a color-role question with Enter and Space, and prevents Space scrolling', () => {
    render(<BeforeAfterTool />);

    const navRegion = screen.getByRole('button', {
      name: 'Click to identify what the nav bar color is doing',
    });

    fireEvent.keyDown(navRegion, { key: 'Enter' });
    expect(screen.getByText('dark nav bar')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Close' }));

    const spaceEvent = createEvent.keyDown(navRegion, { key: ' ', code: 'Space', charCode: 32 });
    const preventDefault = vi.fn();
    spaceEvent.preventDefault = preventDefault;
    fireEvent(navRegion, spaceEvent);

    expect(preventDefault).toHaveBeenCalled();
    expect(screen.getByText('dark nav bar')).toBeInTheDocument();
  });

  it('marks solved regions with an understandable accessible state', () => {
    render(<BeforeAfterTool />);

    const navRegion = screen.getByRole('button', {
      name: 'Click to identify what the nav bar color is doing',
    });

    fireEvent.click(navRegion);
    fireEvent.click(screen.getByRole('button', { name: 'separating sections' }));

    expect(navRegion).toHaveAttribute('aria-disabled', 'true');
  });
});
