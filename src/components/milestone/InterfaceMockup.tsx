import styles from './InterfaceMockup.module.css';

/**
 * A CSS-rendered landing page mockup with intentional design strengths and weaknesses.
 * Used as the persistent visual context for the Unit 1 milestone.
 *
 * Intentional issues:
 * - Nav links: medium-gray (#9ca3af) on saturated blue (#1e40af) — low contrast
 * - Card accent labels: orange (#c2410c) competing with the green button for attention
 * - Footer text: dark gray (#4b5563) on near-black (#0a0a0a) — poor contrast
 *
 * Intentional strengths:
 * - Green button: saturated focal point on the blue hero with readable dark text
 * - Hero headline: white on dark blue — clearly readable
 * - Cards: dark text on light surface — accessible
 */
export function InterfaceMockup() {
  return (
    <div data-authored-visual className={styles.mockup}>
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
    </div>
  );
}
