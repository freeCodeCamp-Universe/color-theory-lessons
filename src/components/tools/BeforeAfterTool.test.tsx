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

  it('describes the current visual hierarchy without disclosing the expected roles', () => {
    render(<BeforeAfterTool variant="hierarchy" />);

    expect(screen.getByRole('img', { name: /Action hierarchy preview/i })).toHaveAccessibleName(
      'Action hierarchy preview. Submit is secondary, Save Draft is secondary, and Cancel is secondary.',
    );
  });

  it('allows correction after an incorrect check', () => {
    const onComplete = vi.fn();
    render(<BeforeAfterTool variant="hierarchy" onComplete={onComplete} />);

    fireEvent.click(screen.getByRole('button', { name: 'check hierarchy' }));

    expect(screen.getByRole('status')).toHaveTextContent(
      'Submit should be primary, Save Draft secondary, and Cancel tertiary.',
    );
    for (const label of HIERARCHY_LABELS) {
      expect(screen.getByRole('combobox', { name: label })).toBeDisabled();
    }
    expect(onComplete).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: 'try stage again' }));

    const roleSelectors = HIERARCHY_LABELS.map((label) => screen.getByRole('combobox', { name: label }));
    for (const selector of roleSelectors) {
      expect(selector).toBeEnabled();
    }

    fireEvent.change(roleSelectors[0], { target: { value: 'primary' } });
    fireEvent.change(roleSelectors[2], { target: { value: 'tertiary' } });
    fireEvent.click(screen.getByRole('button', { name: 'check hierarchy' }));

    expect(screen.getByRole('status')).toHaveTextContent('Submit stands out as the primary action.');
    expect(onComplete).toHaveBeenCalledOnce();
  });

  it('reports its single named stage', () => {
    const onStageChange = vi.fn();
    render(<BeforeAfterTool variant="hierarchy" onStageChange={onStageChange} />);

    expect(screen.getByText('Stage 1 of 1')).toBeInTheDocument();
    expect(onStageChange).toHaveBeenLastCalledWith(expect.objectContaining({
      id: 'assign-action-hierarchy',
      position: 1,
      total: 1,
    }));
  });
});

describe('BeforeAfterTool color-role keyboard activation', () => {
  it.each([
    ['purposeful', /dark navy navigation bar.*gold Start learning button.*green Unit 1 complete text.*blue left border/i],
    ['noisy', /red navigation bar.*orange hero panel.*purple Start learning button.*primary action does not stand out/i],
  ] as const)('describes the %s static mockup', (mockup, description) => {
    render(<BeforeAfterTool previewMockup={mockup} interactive={false} />);

    expect(screen.getByRole('img')).toHaveAccessibleName(description);
  });

  it('renders the color-role work as one named stage', () => {
    const onStageChange = vi.fn();
    render(<BeforeAfterTool onStageChange={onStageChange} />);

    expect(screen.getByText('Stage 1 of 1')).toBeInTheDocument();
    expect(onStageChange).toHaveBeenLastCalledWith(expect.objectContaining({
      id: 'identify-color-roles',
      position: 1,
      total: 1,
    }));
  });

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

  it('names each region by its visible color and interface element', () => {
    render(<BeforeAfterTool />);

    expect(screen.getByRole('button', { name: /nav bar color/i })).toHaveAccessibleDescription('Dark navy navigation bar.');
    expect(screen.getByRole('button', { name: /gold button color/i })).toHaveAccessibleDescription('Gold start learning button.');
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

    expect(navRegion).not.toHaveAttribute('aria-disabled', 'true');

    fireEvent.click(screen.getByRole('button', { name: 'check role' }));

    expect(navRegion).toHaveAttribute('aria-disabled', 'true');
  });

  it('does not grade a selected role until the learner checks it', () => {
    const onComplete = vi.fn();
    render(<BeforeAfterTool onComplete={onComplete} />);

    fireEvent.click(screen.getByRole('button', { name: /nav bar color/i }));

    const checkButton = screen.getByRole('button', { name: 'check role' });
    expect(checkButton).toBeDisabled();

    fireEvent.click(screen.getByRole('button', { name: 'drawing attention' }));

    expect(checkButton).toBeEnabled();
    expect(screen.queryByRole('button', { name: 'try stage again' })).not.toBeInTheDocument();
    expect(onComplete).not.toHaveBeenCalled();

    fireEvent.click(checkButton);

    expect(screen.getByRole('button', { name: 'try stage again' })).toBeInTheDocument();
  });

  it('stays in the stage after an incorrect role and completes once after all four roles pass', () => {
    const onComplete = vi.fn();
    render(<BeforeAfterTool onComplete={onComplete} />);

    const regions = [
      ['nav bar', 'separating sections'],
      ['gold button', 'drawing attention'],
      ['green text', 'signaling status'],
      ['blue card border', 'grouping items'],
    ] as const;

    fireEvent.click(screen.getByRole('button', { name: /nav bar color/i }));
    fireEvent.click(screen.getByRole('button', { name: 'drawing attention' }));
    fireEvent.click(screen.getByRole('button', { name: 'check role' }));
    expect(screen.getByText('Stage 1 of 1')).toBeInTheDocument();
    expect(onComplete).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: 'try stage again' }));

    for (const [region, answer] of regions) {
      fireEvent.click(screen.getByRole('button', { name: new RegExp(`${region} color`, 'i') }));
      fireEvent.click(screen.getByRole('button', { name: answer }));
      fireEvent.click(screen.getByRole('button', { name: 'check role' }));
      if (region !== 'blue card border') {
        fireEvent.click(screen.getByRole('button', { name: 'got it' }));
      }
    }

    expect(onComplete).toHaveBeenCalledOnce();
    expect(screen.getByRole('status')).toHaveTextContent('All four color roles identified.');
  });
});
