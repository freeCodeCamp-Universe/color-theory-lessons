import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { ContrastTool } from './ContrastTool.tsx';

beforeEach(() => localStorage.clear());
afterEach(() => cleanup());

const boundaryCases = [
  {
    label: 'Section label',
    below: { lightness: 59, ratio: '4.48' },
    firstPassing: { lightness: 60, ratio: '4.65' },
    above: { lightness: 61, ratio: '4.83' },
  },
  {
    label: 'Helper text below input',
    below: { lightness: 60, ratio: '4.41' },
    firstPassing: { lightness: 61, ratio: '4.57' },
    above: { lightness: 62, ratio: '4.70' },
  },
  {
    label: 'Submit button',
    below: { lightness: 54, ratio: '4.48' },
    firstPassing: { lightness: 53, ratio: '4.67' },
    above: { lightness: 52, ratio: '4.86' },
  },
] as const;

function ratioPattern(ratio: string): RegExp {
  return new RegExp(`ratio: ${ratio.replace('.', '\\.')}:1`);
}

describe('ContrastTool', () => {
  it('associates each lightness control with its live ratio and threshold', () => {
    render(<ContrastTool interactive={true} />);

    const slider = screen.getByRole('slider', { name: /Lightness for Section label/i });
    expect(slider).toHaveAccessibleDescription(/ratio:.*WCAG AA requires 4.5:1/i);
  });

  it('reports the three-pair repair as one named stage', () => {
    const onStageChange = vi.fn();
    render(<ContrastTool onStageChange={onStageChange} />);

    expect(screen.getByText('Stage 1 of 1')).toBeInTheDocument();
    expect(onStageChange).toHaveBeenLastCalledWith(expect.objectContaining({
      id: 'repair-contrast',
      position: 1,
      total: 1,
    }));
  });

  describe('completion', () => {
    it('calls onComplete when all three areas reach the WCAG AA threshold', () => {
      const onComplete = vi.fn();
      render(<ContrastTool interactive={true} onComplete={onComplete} />);

      fireEvent.change(
        screen.getByRole('slider', { name: /Lightness for Section label/i }),
        { target: { value: '60' } },
      );
      fireEvent.change(
        screen.getByRole('slider', { name: /Lightness for Helper text below input/i }),
        { target: { value: '62' } },
      );
      fireEvent.change(
        screen.getByRole('slider', { name: /Lightness for Submit button/i }),
        { target: { value: '53' } },
      );

      fireEvent.click(screen.getByRole('button', { name: 'check' }));

      expect(onComplete).toHaveBeenCalledOnce();
    });

    it('does not call onComplete when one area is just below its threshold', () => {
      const onComplete = vi.fn();
      render(<ContrastTool interactive={true} onComplete={onComplete} />);

      // heading just below 4.5 (ratio ~4.36)
      fireEvent.change(
        screen.getByRole('slider', { name: /Lightness for Section label/i }),
        { target: { value: '58' } },
      );
      fireEvent.change(
        screen.getByRole('slider', { name: /Lightness for Helper text below input/i }),
        { target: { value: '62' } },
      );
      fireEvent.change(
        screen.getByRole('slider', { name: /Lightness for Submit button/i }),
        { target: { value: '53' } },
      );

      fireEvent.click(screen.getByRole('button', { name: 'check' }));

      expect(onComplete).not.toHaveBeenCalled();
    });

    it('does not call onComplete when only some areas pass', () => {
      const onComplete = vi.fn();
      render(<ContrastTool interactive={true} onComplete={onComplete} />);

      // Fix heading and helper; leave the button just below 4.5:1.
      fireEvent.change(
        screen.getByRole('slider', { name: /Lightness for Section label/i }),
        { target: { value: '60' } },
      );
      fireEvent.change(
        screen.getByRole('slider', { name: /Lightness for Helper text below input/i }),
        { target: { value: '62' } },
      );
      fireEvent.change(
        screen.getByRole('slider', { name: /Lightness for Submit button/i }),
        { target: { value: '54' } },
      );

      fireEvent.click(screen.getByRole('button', { name: 'check' }));

      expect(onComplete).not.toHaveBeenCalled();
    });
  });

  describe('ratio display', () => {
    it('shows the ratio and threshold for each area', () => {
      render(<ContrastTool interactive={true} />);

      // Three ratio displays should be present (one per area)
      const ratioTexts = screen.getAllByText(/ratio:.*:1.*WCAG AA requires.*:1/i);
      expect(ratioTexts).toHaveLength(3);
    });

    it.each(boundaryCases)(
      'applies the threshold at each supported boundary step for $label',
      ({ label, below, firstPassing, above }) => {
        render(<ContrastTool interactive={true} />);

        const slider = screen.getByRole('slider', {
          name: new RegExp(`Lightness for ${label}`, 'i'),
        });

        fireEvent.change(slider, { target: { value: below.lightness } });
        expect(screen.getByText(ratioPattern(below.ratio))).toBeInTheDocument();
        expect(screen.queryByText('✓ readable')).not.toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: 'check' }));
        expect(screen.getAllByText('below target').length).toBeGreaterThan(0);
        fireEvent.click(screen.getByRole('button', { name: 'try stage again' }));

        fireEvent.change(slider, { target: { value: firstPassing.lightness } });
        expect(screen.getByText(ratioPattern(firstPassing.ratio))).toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: 'check' }));
        expect(screen.getAllByText('✓ readable')).toHaveLength(1);
        fireEvent.click(screen.getByRole('button', { name: 'try stage again' }));

        fireEvent.change(slider, { target: { value: above.lightness } });
        expect(screen.getByText(ratioPattern(above.ratio))).toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: 'check' }));
        expect(screen.getAllByText('✓ readable')).toHaveLength(1);
      },
    );
  });

  describe('slider range', () => {
    it('every slider has min=0 and max=100', () => {
      render(<ContrastTool interactive={true} />);

      screen.getAllByRole('slider').forEach((slider) => {
        expect(slider).toHaveAttribute('min', '0');
        expect(slider).toHaveAttribute('max', '100');
      });
    });

    it('accepts lightness value of 0', () => {
      render(<ContrastTool interactive={true} />);

      const slider = screen.getByRole('slider', { name: /Lightness for Section label/i });
      fireEvent.change(slider, { target: { value: '0' } });
      expect(slider).toHaveValue('0');
    });

    it('accepts lightness value of 100', () => {
      render(<ContrastTool interactive={true} />);

      const slider = screen.getByRole('slider', { name: /Lightness for Section label/i });
      fireEvent.change(slider, { target: { value: '100' } });
      expect(slider).toHaveValue('100');
    });
  });

  describe('failure message', () => {
    it('shows failing pair labels in the retry message', () => {
      render(<ContrastTool interactive={true} />);

      fireEvent.change(
        screen.getByRole('slider', { name: /Lightness for Section label/i }),
        { target: { value: '60' } },
      );
      fireEvent.change(
        screen.getByRole('slider', { name: /Lightness for Helper text below input/i }),
        { target: { value: '61' } },
      );
      fireEvent.click(screen.getByRole('button', { name: 'check' }));

      expect(
        screen.getByRole('status'),
      ).toHaveTextContent('Still failing: Submit button.');
      expect(
        screen.getByRole('button', { name: 'try stage again' }),
      ).toBeInTheDocument();
    });
  });

  describe('non-interactive mode', () => {
    it('disables all sliders', () => {
      render(<ContrastTool interactive={false} />);

      screen.getAllByRole('slider').forEach((slider) => {
        expect(slider).toBeDisabled();
      });
    });

    it('does not render the check button', () => {
      render(<ContrastTool interactive={false} />);

      expect(screen.queryByRole('button', { name: 'check' })).toBeNull();
    });
  });
});
