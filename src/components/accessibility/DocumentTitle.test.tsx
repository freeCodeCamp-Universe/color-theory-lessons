import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { DocumentTitle } from './DocumentTitle.tsx';

afterEach(() => {
  cleanup();
  document.title = '';
});

describe('DocumentTitle', () => {
  it('uses the course name for the dashboard', () => {
    render(<DocumentTitle />);

    expect(document.title).toBe('Color Theory Course');
  });

  it('combines a page name with the course name', () => {
    const { rerender } = render(<DocumentTitle page="Glossary" />);
    expect(document.title).toBe('Glossary | Color Theory Course');

    rerender(<DocumentTitle page="Palette Builder" />);
    expect(document.title).toBe('Palette Builder | Color Theory Course');
  });
});
