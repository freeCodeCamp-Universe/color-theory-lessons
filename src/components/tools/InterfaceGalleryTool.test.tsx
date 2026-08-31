import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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

  it('describes each simulation’s status, chart, and form changes without changing their text data', async () => {
    const user = userEvent.setup();
    render(<InterfaceGalleryTool interactive />);

    await user.click(screen.getByRole('button', { name: 'Deuteranopia' }));

    const description = document.getElementById('interface-gallery-description');
    expect(description).toHaveTextContent('Active chip and 80% chart bar become muted purple, #5F537D');
    expect(description).toHaveTextContent('Email validation border become yellow-green, #AFBC44');
  });
});
