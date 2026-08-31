import styles from './InterfaceMockup.module.css';
import { VisualDescription } from '../accessibility/VisualDescription.tsx';

/** CSS-rendered landing-page context for the Unit 1 milestone. */
export function InterfaceMockup() {
  return (
    <div
      data-authored-visual
      data-a11y-scan-exclude="milestone-1-interface-mockup"
      className={styles.mockup}
      aria-describedby="interface-mockup-description"
    >
      <span className={styles.mockupBadge}>interface mockup</span>

      {/* Navigation */}
      <header className={styles.nav}>
        <span className={styles.regionLabel}>nav</span>
        <span className={styles.navBrand}>site.ui</span>
        <nav className={styles.navLinks}>
          <span>Features</span>
          <span>Pricing</span>
          <span>About</span>
        </nav>
      </header>

      {/* Hero */}
      <section className={styles.hero}>
        <span className={styles.regionLabel}>hero</span>
        <h2 className={styles.heroTitle}>The design tool for developers.</h2>
        <p className={styles.heroSub}>Build interfaces that make sense.</p>
        <span className={styles.cta}>Try it free →</span>
      </section>

      {/* Cards */}
      <section className={styles.cards}>
        <span className={styles.regionLabel}>cards</span>
        <div className={styles.cardGrid}>
          {['Layout', 'Tokens', 'Export'].map((label) => (
            <div key={label} className={styles.card}>
              <span className={styles.cardAccent}>{label}</span>
              <span className={styles.cardBody}>
                Explore the {label.toLowerCase()} tools and customize your workflow.
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <span className={styles.regionLabel}>footer</span>
        <span className={styles.footerText}>© 2025 site.ui · Privacy · Terms</span>
      </footer>
      <VisualDescription id="interface-mockup-description">
        Landing-page mockup. The navigation header is saturated blue, #1E40AF, with medium-gray links, #9CA3AF. The hero is the same dark blue, with a white headline and a green #22C55E Try it free control with dark text. Three light cards have dark body text and orange #C2410C labels. The footer is near-black, #0A0A0A, with dark-gray #4B5563 text. The green control and orange labels are both visually prominent.
      </VisualDescription>
    </div>
  );
}
