import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { StatusAnnouncement } from './StatusAnnouncement.tsx';
import { VisualDescription } from './VisualDescription.tsx';

describe('accessible visual patterns', () => {
  it('renders an authored name, description, and named color values as visually hidden text', () => {
    render(
      <VisualDescription
        visual={{
          classification: 'assessment',
          accessibleName: 'Target swatch',
          accessibleDescription: 'A muted blue-green swatch.',
          colors: [{ name: 'blue green', value: '#287F83' }],
        }}
      />,
    );

    const description = screen.getByText(/Target swatch/);
    expect(description).toHaveClass('sr-only');
    expect(description).toHaveTextContent(
      'Target swatch. A muted blue-green swatch. Colors: blue green: #287F83.',
    );
  });

  it('uses a polite atomic status region by default', () => {
    render(<StatusAnnouncement message="Stage 2 of 3: match saturation." />);

    expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite');
    expect(screen.getByRole('status')).toHaveAttribute('aria-atomic', 'true');
  });

  it('uses an alert for a blocking error', () => {
    render(<StatusAnnouncement message="Enter a valid HEX value." priority="assertive" />);

    expect(screen.getByRole('alert')).toHaveAttribute('aria-live', 'assertive');
  });
});
