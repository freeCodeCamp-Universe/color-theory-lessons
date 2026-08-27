import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { InterfaceGalleryTool } from './InterfaceGalleryTool.tsx';

afterEach(cleanup);

describe('InterfaceGalleryTool', () => {
  it('marks the instructional mock so its authored typography is preserved', () => {
    render(<InterfaceGalleryTool />);

    const dashboard = screen.getByText('Dashboard');
    expect(dashboard.closest('[data-authored-visual]')).toBeInTheDocument();
    expect(dashboard).toHaveStyle({ fontSize: '0.8rem' });
  });
});
