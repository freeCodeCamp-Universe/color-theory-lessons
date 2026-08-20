import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { ContrastTool } from './ContrastTool.tsx';

beforeEach(() => localStorage.clear());
afterEach(() => cleanup());

// Lightness values chosen so that the computed WCAG contrast ratio is:
//   heading (4.5:1 threshold): l=58 → ~4.36 (fail), l=60 → ~4.65 (pass)
//   helper  (4.5:1 threshold): l=60 → ~4.41 (fail), l=62 → ~4.70 (pass)
//   button  (4.5:1 threshold): l=54 → ~4.48 (fail), l=53 → ~4.67 (pass)

describe('ContrastTool', () => {
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
      const ratioTexts = screen.getAllByText(/ratio:.*:1.*need.*:1.*WCAG AA/i);
      expect(ratioTexts).toHaveLength(3);
    });

    it('marks a pair as passing when its ratio meets the threshold', () => {
      render(<ContrastTool interactive={true} />);

      // Set heading to a passing value
      fireEvent.change(
        screen.getByRole('slider', { name: /Lightness for Section label/i }),
        { target: { value: '60' } },
      );

      // The "✓ readable" badge should appear (at least once)
      expect(screen.getAllByText('✓ readable').length).toBeGreaterThan(0);
    });
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

      // All defaults fail — click check without changing anything
      fireEvent.click(screen.getByRole('button', { name: 'check' }));

      expect(screen.getByText(/Still failing:/i)).toBeInTheDocument();
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
