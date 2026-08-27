import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ErrorBoundary } from './ErrorBoundary.tsx';
import styles from './ErrorBoundary.module.css';

function BrokenChild(): never {
  throw new Error('test failure');
}

describe('ErrorBoundary', () => {
  it('renders a styled application fallback and retries its child', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const view = render(
      <ErrorBoundary>
        <BrokenChild />
      </ErrorBoundary>,
    );

    expect(screen.getByText('something went wrong.')).toHaveClass(styles.message);
    expect(screen.getByRole('button', { name: 'try again' })).toHaveClass(styles.retryButton);

    view.rerender(
      <ErrorBoundary>
        <p>recovered</p>
      </ErrorBoundary>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'try again' }));

    expect(screen.getByText('recovered')).toBeInTheDocument();
    consoleError.mockRestore();
  });
});
