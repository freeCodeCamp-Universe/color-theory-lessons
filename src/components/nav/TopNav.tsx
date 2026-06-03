import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import styles from './TopNav.module.css';

const NAV_ITEMS = [
  { to: '/palette-builder', label: 'palette builder' },
  { to: '/glossary', label: 'glossary' },
  { to: '/review', label: 'review' },
];

function navLinkClass({ isActive }: { isActive: boolean }) {
  return isActive ? `${styles.link} ${styles.active}` : styles.link;
}

export function TopNav() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className={styles.nav} aria-label="Main navigation">
      <NavLink to="/" end className={styles.logo} onClick={() => setMenuOpen(false)}>
        color-theory-course$
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
        </ul>
      )}
    </nav>
  );
}
