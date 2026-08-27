import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { StepPanelConfig } from '../../types/lesson.ts';
import StepPanelRenderer from './StepPanelRenderer.tsx';

vi.mock('../tools/HslPlaygroundTool.tsx', () => ({
  HslPlaygroundTool: () => <div>HSL preview</div>,
}));

afterEach(cleanup);

describe('StepPanelRenderer accessibility contract', () => {
  it('associates an authored description with an informative preview', () => {
    const panel: StepPanelConfig = {
      type: 'hsl-playground-preview',
      accessibility: {
        classification: 'informative',
        accessibleName: 'HSL color preview',
        accessibleDescription: 'Three controls change the displayed hue, saturation, and lightness.',
        colors: [{ name: 'current color', value: 'hsl(200 70% 50%)' }],
      },
    };

    render(<StepPanelRenderer panel={panel} />);

    const visual = screen.getByText('HSL preview').closest('[data-authored-visual]');
    const description = screen.getByText(/Three controls change/);
    expect(visual).toHaveAttribute('aria-describedby', description.id);
    expect(description).toHaveClass('sr-only');
    expect(description).toHaveTextContent('current color: hsl(200 70% 50%)');
  });

  it('removes a decorative, non-interactive preview from the accessibility tree', () => {
    const panel: StepPanelConfig = {
      type: 'hsl-playground-preview',
      accessibility: { classification: 'decorative' },
    };

    render(<StepPanelRenderer panel={panel} />);

    expect(screen.getByText('HSL preview').parentElement).toHaveAttribute('aria-hidden', 'true');
  });
});
