import { cleanup, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';
import { Route, Routes, useLocation } from 'react-router-dom';
import donationConfig from '../../../donation-config.json';
import { renderWithAppState } from '../../test-utils.tsx';
import { TopNav } from './TopNav.tsx';

afterEach(() => cleanup());

function CurrentPath() {
  return <p>current path: {useLocation().pathname}</p>;
}

function renderNavigation(route = '/') {
  return renderWithAppState(
    <>
      <TopNav />
      <Routes><Route path="*" element={<CurrentPath />} /></Routes>
    </>,
    { route },
  );
}

describe('TopNav', () => {
  const donationUrl = `https://donate.freecodecamp.org?source=${donationConfig.donationId}&campaign=test-2026&medium=web`;

  it('uses plain course branding for both responsive logo variants', () => {
    renderNavigation();

    expect(screen.getByText('Color Theory Course')).toBeInTheDocument();
    expect(screen.getByText('Color Theory')).toBeInTheDocument();
    expect(screen.queryByText(/\$/)).not.toBeInTheDocument();
  });

  it('navigates with desktop links and marks the current page', async () => {
    const user = userEvent.setup();
    renderNavigation('/glossary');

    expect(screen.getByRole('link', { name: 'glossary' })).toHaveAttribute('aria-current', 'page');
    await user.click(screen.getByRole('link', { name: 'palette builder' }));

    expect(screen.getByText('current path: /palette-builder')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'palette builder' })).toHaveAttribute('aria-current', 'page');
  });

  it('offers a tracked freeCodeCamp donation link', () => {
    renderNavigation();

    expect(screen.getByRole('link', { name: 'Donate' })).toHaveAttribute('href', donationUrl);
  });

  it('toggles the mobile menu and closes it after navigation', async () => {
    const user = userEvent.setup();
    renderNavigation();

    const menuButton = screen.getByRole('button', { name: 'Menu' });
    expect(menuButton).toHaveAttribute('aria-expanded', 'false');

    await user.click(menuButton);
    expect(menuButton).toHaveAttribute('aria-expanded', 'true');

    const mobileMenu = document.getElementById('mobile-nav-menu');
    expect(mobileMenu).not.toBeNull();
    expect(within(mobileMenu!).getByRole('link', { name: 'Donate' })).toHaveAttribute('href', donationUrl);
    await user.click(screen.getAllByRole('link', { name: 'review' })[1]);

    expect(screen.getByText('current path: /review')).toBeInTheDocument();
    expect(menuButton).toHaveAttribute('aria-expanded', 'false');
    expect(document.getElementById('mobile-nav-menu')).not.toBeInTheDocument();
  });

  it('closes an open mobile menu when the logo is used', async () => {
    const user = userEvent.setup();
    renderNavigation('/review');

    await user.click(screen.getByRole('button', { name: 'Menu' }));
    await user.click(screen.getByRole('link', { name: 'Color Theory Course' }));

    expect(screen.getByText('current path: /')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Menu' })).toHaveAttribute('aria-expanded', 'false');
  });
});
