import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { AlphaLayerTool } from './AlphaLayerTool.tsx';

function selectImageOverlayContext() {
  fireEvent.click(screen.getByRole('button', { name: 'Image text overlay' }));
}

function setAlpha(value: number) {
  fireEvent.change(screen.getByRole('slider', { name: /Alpha:/ }), { target: { value } });
}

afterEach(cleanup);

describe('AlphaLayerTool image text overlay context', () => {
  it('fails completion when composited background does not meet text contrast target', () => {
    render(<AlphaLayerTool interactive />);

    selectImageOverlayContext();
    setAlpha(20);
    fireEvent.click(screen.getByRole('button', { name: 'check' }));

    expect(screen.getByRole('button', { name: 'Image text overlay' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /✓\s*Image text overlay/ })).not.toBeInTheDocument();
    expect(screen.getByText('Text contrast:').parentElement).toHaveTextContent(
      /Text contrast:\s+\d+\.\d:1 \(target: 4\.5:1\)/,
    );
  });

  it('passes completion when composited background meets contrast target even below old alpha range', () => {
    render(<AlphaLayerTool interactive />);

    selectImageOverlayContext();
    setAlpha(25);
    expect(screen.getByText('Text contrast:').parentElement).toHaveTextContent(
      /Text contrast:\s+\d+\.\d:1 \(target: 4\.5:1\)/,
    );
    fireEvent.click(screen.getByRole('button', { name: 'check' }));

    expect(screen.getByRole('button', { name: /✓\s*Image text overlay/ })).toBeInTheDocument();
  });
});
