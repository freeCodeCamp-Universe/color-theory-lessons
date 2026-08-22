import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { HexRgbEditorTool } from './HexRgbEditorTool.tsx';

afterEach(() => cleanup());

describe('HexRgbEditorTool color readout', () => {
  it('shows the RGB value with modern space-separated syntax', () => {
    render(<HexRgbEditorTool interactive={true} />);

    expect(screen.getByText('#6366F1 · rgb(99 102 241)')).toBeInTheDocument();
  });
});
