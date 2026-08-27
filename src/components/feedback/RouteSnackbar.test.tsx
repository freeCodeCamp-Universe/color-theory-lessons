import { cleanup, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';
import { Route, Routes } from 'react-router-dom';
import { renderWithAppState } from '../../test-utils.tsx';
import { RouteSnackbar } from './RouteSnackbar.tsx';

afterEach(() => cleanup());

describe('RouteSnackbar', () => {
  it('shows a redirected-route notice until the learner dismisses it', async () => {
    const user = userEvent.setup();
    renderWithAppState(
      <Routes>
        <Route path="/" element={<RouteSnackbar />} />
      </Routes>,
      {
        route: '/',
        routeState: { routeNotice: 'This lesson is not unlocked yet.' },
      },
    );

    expect(screen.getByRole('status')).toHaveTextContent('This lesson is not unlocked yet.');

    await user.click(screen.getByRole('button', { name: 'dismiss' }));

    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });
});
