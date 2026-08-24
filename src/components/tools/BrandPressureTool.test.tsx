import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { contrastRatioWcag, type RGB } from '../../utils/color.ts';
import { BrandPressureTool } from './BrandPressureTool.tsx';
import { getBrandPressureStatus } from './brand-pressure-validation.ts';

afterEach(cleanup);

const PASSING_ROLES = {
  'page-bg': '#f8f7ff',
  surface: '#d1d5db',
  'primary-text': '#1c1917',
  'neutral-divider': '#e2e8f0',
};

function setSurface(value: string) {
  fireEvent.change(screen.getAllByRole('textbox')[1], { target: { value } });
}

function rgbFromCss(value: string): RGB {
  const channels = value.match(/\d+/g)?.map(Number);
  if (!channels || channels.length < 3) {
    throw new Error(`Expected an RGB CSS color, received "${value}"`);
  }

  return { r: channels[0], g: channels[1], b: channels[2] };
}

describe('BrandPressureTool fixed action contrast', () => {
  it('renders distinct Save and Cancel pairs that meet normal-text contrast', () => {
    render(<BrandPressureTool interactive />);

    const save = screen.getByRole('button', { name: 'Save' });
    const cancel = screen.getByRole('button', { name: 'Cancel' });
    const saveStyles = getComputedStyle(save);
    const cancelStyles = getComputedStyle(cancel);
    const saveRatio = contrastRatioWcag(
      rgbFromCss(saveStyles.color),
      rgbFromCss(saveStyles.backgroundColor),
    );
    const cancelRatio = contrastRatioWcag(
      rgbFromCss(cancelStyles.color),
      rgbFromCss(cancelStyles.backgroundColor),
    );

    expect(saveStyles.backgroundColor).not.toBe(cancelStyles.backgroundColor);
    expect(saveRatio).toBeGreaterThanOrEqual(4.5);
    expect(cancelRatio).toBeGreaterThanOrEqual(4.5);
    expect(screen.getByText('Save text (4.5:1)').parentElement).toHaveTextContent('✓');
    expect(screen.getByText('Cancel text (4.5:1)').parentElement).toHaveTextContent('✓');
  });

  it('prevents completion when a fixed action label fails contrast', () => {
    const status = getBrandPressureStatus(PASSING_ROLES, [
      { label: 'Save', role: 'action', background: '#7c3aed', foreground: '#ffffff' },
      { label: 'Cancel', role: 'secondary-action', background: '#a78bfa', foreground: '#ffffff' },
    ]);

    expect(status.textOk).toBe(true);
    expect(status.surfaceOk).toBe(true);
    expect(status.pressureOk).toBe(true);
    expect(status.actionChecks[1]).toMatchObject({ pass: false });
    expect(status.allPass).toBe(false);
  });

  it('completes when editable roles and both fixed action labels pass', () => {
    const onComplete = vi.fn();
    render(<BrandPressureTool interactive onComplete={onComplete} />);

    setSurface(PASSING_ROLES.surface);

    expect(screen.getByText(/Brand is present but not overwhelming/)).toBeInTheDocument();
    expect(onComplete).toHaveBeenCalledOnce();
  });
});
