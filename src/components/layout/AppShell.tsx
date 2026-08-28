import type { ReactNode } from 'react';
import { TopNav } from '../nav/TopNav.tsx';
import { RouteSnackbar } from '../feedback/RouteSnackbar.tsx';
import { RouteAccessibility } from '../accessibility/RouteAccessibility.tsx';
import { useAppState } from '../../state/app-context.tsx';
import styles from './AppShell.module.css';

const CVD_FILTER_MAP: Record<string, string> = {
  deuteranopia: 'url(#cvd-deuteranopia)',
  protanopia: 'url(#cvd-protanopia)',
  tritanopia: 'url(#cvd-tritanopia)',
  achromatopsia: 'url(#cvd-achromatopsia)',
};

const CVD_SVG_DEFS = `<svg style="position:absolute;width:0;height:0;overflow:hidden" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <defs>
    <filter id="cvd-deuteranopia">
      <feColorMatrix type="matrix" values="0.625 0.375 0 0 0  0.7 0.3 0 0 0  0 0.3 0.7 0 0  0 0 0 1 0"/>
    </filter>
    <filter id="cvd-protanopia">
      <feColorMatrix type="matrix" values="0.567 0.433 0 0 0  0.558 0.442 0 0 0  0 0.242 0.758 0 0  0 0 0 1 0"/>
    </filter>
    <filter id="cvd-tritanopia">
      <feColorMatrix type="matrix" values="0.95 0.05 0 0 0  0 0.433 0.567 0 0  0 0.475 0.525 0 0  0 0 0 1 0"/>
    </filter>
    <filter id="cvd-achromatopsia">
      <feColorMatrix type="saturate" values="0"/>
    </filter>
  </defs>
</svg>`;

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const { preferences } = useAppState();
  const cvdFilter = preferences.colorBlindnessMode
    ? CVD_FILTER_MAP[preferences.colorBlindnessMode]
    : undefined;

  function focusMainContent() {
    document.getElementById('main-content')?.focus();
  }

  return (
    <div className={styles.shell} style={cvdFilter ? { filter: cvdFilter } : undefined}>
      <div dangerouslySetInnerHTML={{ __html: CVD_SVG_DEFS }} />
      <a className={styles.skipLink} href="#main-content" onClick={focusMainContent}>
        skip to main content
      </a>
      <TopNav />
      <main id="main-content" className={styles.main} tabIndex={-1}>{children}</main>
      <RouteAccessibility />
      <RouteSnackbar />
    </div>
  );
}
