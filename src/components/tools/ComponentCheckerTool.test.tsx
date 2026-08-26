import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { ComponentCheckerTool } from './ComponentCheckerTool.tsx';

afterEach(cleanup);

describe('ComponentCheckerTool contrast threshold', () => {
  it.each([
    ['immediately below 3:1', '#959595', '2.99:1, FAIL', '0/4 passing'],
    ['immediately above 3:1', '#949494', '3.03:1, PASS', '1/4 passing'],
  ])('displays and validates a value %s', (_boundary, color, result, count) => {
    render(<ComponentCheckerTool interactive />);

    fireEvent.change(screen.getByRole('textbox', { name: 'Input border hex color' }), {
      target: { value: color },
    });

    expect(screen.getByText(result)).toBeInTheDocument();
    expect(screen.getByText(new RegExp(count))).toBeInTheDocument();
  });
});
