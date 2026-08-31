import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { InterfaceMockup } from './InterfaceMockup.tsx';

describe('InterfaceMockup', () => {
  it('connects the mockup to its assessment-safe color and hierarchy description', () => {
    render(<InterfaceMockup />);

    const mockup = screen.getByText('interface mockup').closest('[data-authored-visual]');
    const description = screen.getByText(/Landing-page mockup/);

    expect(mockup).toHaveAttribute('aria-describedby', 'interface-mockup-description');
    expect(description).toHaveClass('sr-only');
    expect(description).toHaveTextContent('#1E40AF');
    expect(description).toHaveTextContent('#9CA3AF');
    expect(description).toHaveTextContent('#22C55E');
    expect(description).toHaveTextContent('#C2410C');
    expect(description).toHaveTextContent('#4B5563');
    expect(description).toHaveTextContent('visually prominent');
  });
});
