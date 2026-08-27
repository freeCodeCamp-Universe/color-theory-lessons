import { cleanup, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';
import { Route, Routes, useLocation } from 'react-router-dom';
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
  it('navigates with desktop links and marks the current page', async () => {
    const user = userEvent.setup();
    renderNavigation('/glossary');

    expect(screen.getByRole('link', { name: 'glossary' })).toHaveAttribute('aria-current', 'page');
    await user.click(screen.getByRole('link', { name: 'palette builder' }));

    expect(screen.getByText('current path: /palette-builder')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'palette builder' })).toHaveAttribute('aria-current', 'page');
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
    await user.click(screen.getAllByRole('link', { name: 'review' })[1]);

    expect(screen.getByText('current path: /review')).toBeInTheDocument();
    expect(menuButton).toHaveAttribute('aria-expanded', 'false');
    expect(document.getElementById('mobile-nav-menu')).not.toBeInTheDocument();
  });

  it('closes an open mobile menu when the logo is used', async () => {
    const user = userEvent.setup();
    renderNavigation('/review');

    await user.click(screen.getByRole('button', { name: 'Menu' }));
    await user.click(screen.getByRole('link', { name: /color-theory-course\$color\$/ }));

    expect(screen.getByText('current path: /')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Menu' })).toHaveAttribute('aria-expanded', 'false');
  });
});
