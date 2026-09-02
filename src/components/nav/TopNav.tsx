import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import donationConfig from '../../../donation-config.json';
import { ThemeControl } from './ThemeControl.tsx';
import styles from './TopNav.module.css';

const NAV_ITEMS = [
  { to: '/palette-builder', label: 'palette builder' },
  { to: '/glossary', label: 'glossary' },
  { to: '/review', label: 'review' },
];

const donationUrl = `https://donate.freecodecamp.org?source=${donationConfig.donationId}&campaign=test-2026&medium=web`;

function navLinkClass({ isActive }: { isActive: boolean }) {
  return isActive ? `${styles.link} ${styles.active}` : styles.link;
}

export function TopNav() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className={styles.nav} aria-label="Main navigation">
      <NavLink
        to="/"
        end
        className={styles.logo}
        aria-label="Color Theory Course"
        onClick={() => setMenuOpen(false)}
      >
        <span className={styles.fullLogo} aria-hidden="true">Color Theory Course</span>
        <span className={styles.shortLogo} aria-hidden="true">Color Theory</span>
      </NavLink>
      <ul className={styles.links}>
        {NAV_ITEMS.map((item) => (
          <li key={item.to}>
            <NavLink to={item.to} className={navLinkClass}>
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
      <ThemeControl />
      <a className={`${styles.donateLink} ${styles.desktopDonateLink}`} href={donationUrl}>
        Donate
      </a>
      <button
        type="button"
        className={styles.menuButton}
        aria-label="Menu"
        aria-expanded={menuOpen}
        aria-controls="mobile-nav-menu"
        onClick={() => setMenuOpen((open) => !open)}
      >
        ≡
      </button>
      {menuOpen && (
        <ul id="mobile-nav-menu" className={styles.mobileMenu}>
          {NAV_ITEMS.map((item) => (
            <li key={item.to}>
              <NavLink to={item.to} className={navLinkClass} onClick={() => setMenuOpen(false)}>
                {item.label}
              </NavLink>
            </li>
          ))}
          <li>
            <a className={`${styles.link} ${styles.donateLink}`} href={donationUrl}>
              Donate
            </a>
          </li>
        </ul>
      )}
    </nav>
  );
}
